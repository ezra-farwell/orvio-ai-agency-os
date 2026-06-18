import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const modes = [
  "general",
  "campaign_ideas",
  "lead_followup",
  "creative_prompt",
  "competitor_summary",
  "report_summary",
  "task_recommendations",
] as const;

const sendMessageInput = z.object({
  message: z.string().trim().min(1).max(8_000),
  clientId: z.string().uuid().optional(),
  conversationId: z.string().uuid().optional(),
  mode: z.enum(modes).optional(),
  context: z.string().trim().max(12_000).optional(),
});

const listConversationsInput = z.object({
  clientId: z.string().uuid().optional(),
  limit: z.number().int().min(1).max(50).default(20),
});

const conversationInput = z.object({
  conversationId: z.string().uuid(),
});

const taskSuggestionStatuses = [
  "suggested",
  "accepted",
  "dismissed",
  "completed",
] as const;

const listTaskSuggestionsInput = z.object({
  clientId: z.string().uuid().optional(),
  status: z.enum(taskSuggestionStatuses).optional(),
  limit: z.number().int().min(1).max(50).default(20),
});

const updateTaskSuggestionStatusInput = z.object({
  taskSuggestionId: z.string().uuid(),
  status: z.enum(["accepted", "dismissed", "completed"]),
});

const taskSuggestionInput = z.object({
  taskSuggestionId: z.string().uuid(),
});

const testInput = z.object({
  message: z.string().trim().min(1).max(2_000),
});

function publicError(message: string): Error {
  return new Error(message);
}

export const sendOrvioAIMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(sendMessageInput)
  .handler(async ({ data, context }) => {
    const [
      { loadOrvioAIRequestContext, OrvioAIContextError },
      { buildOrvioAISystemPrompt },
      { OrvioAIConfigurationError },
      { completeOrvioAIChat, OrvioAIProviderError },
      persistence,
      taskSuggestions,
    ] = await Promise.all([
      import("../ai/context.server"),
      import("../ai/prompts.server"),
      import("../ai/config.server"),
      import("../ai/provider.server"),
      import("../ai/persistence.server"),
      import("../ai/task-suggestions.server"),
    ]);

    const supabase = context.supabase as unknown as Parameters<
      typeof persistence.getOrvioAIConversationForAgency
    >[0]["supabase"];
    let newConversationId: string | undefined;
    let userMessageSaved = false;

    try {
      let requestContext = await loadOrvioAIRequestContext({
        supabase: context.supabase as unknown as Parameters<
          typeof loadOrvioAIRequestContext
        >[0]["supabase"],
        userId: context.userId,
      });

      let conversation;
      let effectiveMode = data.mode ?? "general";
      let effectiveClientId = data.clientId;

      if (data.conversationId) {
        conversation = await persistence.getOrvioAIConversationForAgency({
          supabase,
          agencyId: requestContext.agencyId,
          conversationId: data.conversationId,
        });

        if (data.mode && data.mode !== conversation.mode) {
          throw new persistence.OrvioAIPersistenceError("conversation_mismatch");
        }
        if (
          data.clientId !== undefined &&
          data.clientId !== (conversation.client_id ?? undefined)
        ) {
          throw new persistence.OrvioAIPersistenceError("conversation_mismatch");
        }

        effectiveMode = conversation.mode;
        effectiveClientId = conversation.client_id ?? undefined;
      }

      if (effectiveClientId) {
        requestContext = await loadOrvioAIRequestContext({
          supabase: context.supabase as unknown as Parameters<
            typeof loadOrvioAIRequestContext
          >[0]["supabase"],
          userId: context.userId,
          clientId: effectiveClientId,
        });
      }

      if (!conversation) {
        conversation = await persistence.createOrvioAIConversation({
          supabase,
          agencyId: requestContext.agencyId,
          userId: requestContext.profile.userId,
          clientId: effectiveClientId,
          mode: effectiveMode,
          title: persistence.createConversationTitle(data.message),
        });
        newConversationId = conversation.id;
      }

      let userMessage;
      try {
        userMessage = await persistence.insertOrvioAIMessage({
          supabase,
          conversationId: conversation.id,
          agencyId: requestContext.agencyId,
          userId: requestContext.profile.userId,
          clientId: effectiveClientId,
          role: "user",
          content: data.message,
          metadata: {
            mode: effectiveMode,
            hasAdditionalContext: Boolean(data.context),
          },
        });
        userMessageSaved = true;
      } catch (error) {
        if (newConversationId) {
          await persistence.deleteNewOrvioAIConversationBestEffort({
            supabase,
            agencyId: requestContext.agencyId,
            conversationId: newConversationId,
          });
        }
        throw error;
      }

      await persistence.touchOrvioAIConversation({
        supabase,
        agencyId: requestContext.agencyId,
        conversationId: conversation.id,
      });

      const aiContext = {
        authenticatedUser: {
          role: requestContext.profile.role,
          fullName: requestContext.profile.fullName,
        },
        selectedClient: requestContext.client,
        additionalContext: data.context || undefined,
      };

      const result = await completeOrvioAIChat({
        systemPrompt: [
          buildOrvioAISystemPrompt(effectiveMode),
          effectiveMode === "task_recommendations"
            ? taskSuggestions.TASK_RECOMMENDATION_FORMAT_INSTRUCTIONS
            : "",
        ]
          .filter(Boolean)
          .join("\n\n"),
        userMessage: data.message,
        context: aiContext,
        temperature: 0.3,
        maxTokens: 1_200,
      });

      const assistantMessage = await persistence.insertOrvioAIMessage({
        supabase,
        conversationId: conversation.id,
        agencyId: requestContext.agencyId,
        userId: requestContext.profile.userId,
        clientId: effectiveClientId,
        role: "assistant",
        content: result.text,
        model: result.model,
        provider: result.provider,
        latencyMs: result.latencyMs,
        metadata: { mode: effectiveMode },
      });

      await persistence.touchOrvioAIConversation({
        supabase,
        agencyId: requestContext.agencyId,
        conversationId: conversation.id,
      });

      if (effectiveMode === "task_recommendations") {
        try {
          await persistence.insertOrvioAITaskSuggestions({
            supabase,
            agencyId: requestContext.agencyId,
            userId: requestContext.profile.userId,
            clientId: effectiveClientId,
            conversationId: conversation.id,
            suggestions: taskSuggestions.extractTaskSuggestions(result.text),
          });
        } catch {
          // Task extraction and persistence are best-effort. The chat response
          // remains usable even when no safe suggestions can be saved.
        }
      }

      return {
        conversationId: conversation.id,
        userMessageId: userMessage.id,
        assistantMessageId: assistantMessage.id,
        text: result.text,
        provider: result.provider,
        model: result.model,
        latencyMs: result.latencyMs,
        mode: effectiveMode,
        clientId: effectiveClientId,
      };
    } catch (error) {
      if (error instanceof OrvioAIContextError) {
        if (error.code === "client_forbidden") {
          throw publicError("The selected client is not available to your agency.");
        }
        if (error.code === "profile_unavailable") {
          throw publicError("Your Orvio profile could not be loaded.");
        }
        throw publicError("You are not authorized to use Orvio AI.");
      }

      if (error instanceof OrvioAIConfigurationError) {
        throw publicError("Orvio AI is not configured on the server.");
      }

      if (error instanceof OrvioAIProviderError) {
        if (error.code === "timeout") {
          throw publicError("Orvio AI took too long to respond. Please try again.");
        }
        if (error.code === "connection_failed") {
          throw publicError(
            "Orvio AI is currently unavailable. Confirm the local AI service is running.",
          );
        }
        throw publicError("Orvio AI could not complete the request.");
      }

      if (error instanceof persistence.OrvioAIPersistenceError) {
        if (error.code === "conversation_not_found") {
          throw publicError("The selected Orvio AI conversation was not found.");
        }
        if (error.code === "conversation_mismatch") {
          throw publicError(
            "The selected client or mode does not match this conversation.",
          );
        }
        throw publicError(
          userMessageSaved
            ? "The Orvio AI conversation could not be fully saved."
            : "The Orvio AI conversation could not be saved.",
        );
      }

      throw publicError("Orvio AI could not complete the request.");
    }
  });

export const listOrvioAIConversations = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(listConversationsInput)
  .handler(async ({ data, context }) => {
    const [{ loadOrvioAIRequestContext }, persistence] = await Promise.all([
      import("../ai/context.server"),
      import("../ai/persistence.server"),
    ]);

    try {
      const requestContext = await loadOrvioAIRequestContext({
        supabase: context.supabase as unknown as Parameters<
          typeof loadOrvioAIRequestContext
        >[0]["supabase"],
        userId: context.userId,
        clientId: data.clientId,
      });
      const rows = await persistence.listOrvioAIConversationsForAgency({
        supabase: context.supabase as unknown as Parameters<
          typeof persistence.listOrvioAIConversationsForAgency
        >[0]["supabase"],
        agencyId: requestContext.agencyId,
        clientId: data.clientId,
        limit: data.limit,
      });

      return rows.map((row) => ({
        id: row.id,
        clientId: row.client_id ?? undefined,
        title: row.title,
        mode: row.mode,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch {
      throw publicError("Orvio AI conversations could not be loaded.");
    }
  });

export const getOrvioAIConversation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(conversationInput)
  .handler(async ({ data, context }) => {
    const [{ loadOrvioAIRequestContext }, persistence] = await Promise.all([
      import("../ai/context.server"),
      import("../ai/persistence.server"),
    ]);

    try {
      const requestContext = await loadOrvioAIRequestContext({
        supabase: context.supabase as unknown as Parameters<
          typeof loadOrvioAIRequestContext
        >[0]["supabase"],
        userId: context.userId,
      });
      const supabase = context.supabase as unknown as Parameters<
        typeof persistence.getOrvioAIConversationForAgency
      >[0]["supabase"];
      const conversation =
        await persistence.getOrvioAIConversationForAgency({
          supabase,
          agencyId: requestContext.agencyId,
          conversationId: data.conversationId,
        });
      const messages = await persistence.listOrvioAIMessagesForConversation({
        supabase,
        agencyId: requestContext.agencyId,
        conversationId: conversation.id,
      });

      return {
        conversation: {
          id: conversation.id,
          clientId: conversation.client_id ?? undefined,
          title: conversation.title,
          mode: conversation.mode,
          createdAt: conversation.created_at,
          updatedAt: conversation.updated_at,
        },
        messages: messages.map((message) => ({
          id: message.id,
          role: message.role,
          content: message.content,
          model: message.model,
          provider: message.provider,
          latencyMs: message.latency_ms,
          metadata: message.metadata,
          createdAt: message.created_at,
        })),
      };
    } catch {
      throw publicError("The Orvio AI conversation could not be loaded.");
    }
  });

export const deleteOrvioAIConversation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(conversationInput)
  .handler(async ({ data, context }) => {
    const [{ loadOrvioAIRequestContext }, persistence] = await Promise.all([
      import("../ai/context.server"),
      import("../ai/persistence.server"),
    ]);

    try {
      const requestContext = await loadOrvioAIRequestContext({
        supabase: context.supabase as unknown as Parameters<
          typeof loadOrvioAIRequestContext
        >[0]["supabase"],
        userId: context.userId,
      });
      await persistence.deleteOrvioAIConversationForAgency({
        supabase: context.supabase as unknown as Parameters<
          typeof persistence.deleteOrvioAIConversationForAgency
        >[0]["supabase"],
        agencyId: requestContext.agencyId,
        conversationId: data.conversationId,
      });
      return { deleted: true, conversationId: data.conversationId };
    } catch {
      throw publicError("The Orvio AI conversation could not be deleted.");
    }
  });

export const listOrvioAITaskSuggestions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(listTaskSuggestionsInput)
  .handler(async ({ data, context }) => {
    const [{ loadOrvioAIRequestContext }, persistence] = await Promise.all([
      import("../ai/context.server"),
      import("../ai/persistence.server"),
    ]);

    try {
      const requestContext = await loadOrvioAIRequestContext({
        supabase: context.supabase as unknown as Parameters<
          typeof loadOrvioAIRequestContext
        >[0]["supabase"],
        userId: context.userId,
        clientId: data.clientId,
      });
      const rows = await persistence.listOrvioAITaskSuggestionsForAgency({
        supabase: context.supabase as unknown as Parameters<
          typeof persistence.listOrvioAITaskSuggestionsForAgency
        >[0]["supabase"],
        agencyId: requestContext.agencyId,
        clientId: data.clientId,
        status: data.status,
        limit: data.limit,
      });

      return rows.map((row) => ({
        id: row.id,
        clientId: row.client_id ?? undefined,
        clientName: row.clients?.name,
        sourceConversationId: row.source_conversation_id ?? undefined,
        title: row.title,
        description: row.description ?? undefined,
        priority: row.priority ?? undefined,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch {
      throw publicError("Orvio AI task suggestions could not be loaded.");
    }
  });

export const updateOrvioAITaskSuggestionStatus = createServerFn({
  method: "POST",
})
  .middleware([requireSupabaseAuth])
  .inputValidator(updateTaskSuggestionStatusInput)
  .handler(async ({ data, context }) => {
    const [{ loadOrvioAIRequestContext }, persistence] = await Promise.all([
      import("../ai/context.server"),
      import("../ai/persistence.server"),
    ]);

    try {
      const requestContext = await loadOrvioAIRequestContext({
        supabase: context.supabase as unknown as Parameters<
          typeof loadOrvioAIRequestContext
        >[0]["supabase"],
        userId: context.userId,
      });
      const row =
        await persistence.updateOrvioAITaskSuggestionStatusForAgency({
          supabase: context.supabase as unknown as Parameters<
            typeof persistence.updateOrvioAITaskSuggestionStatusForAgency
          >[0]["supabase"],
          agencyId: requestContext.agencyId,
          taskSuggestionId: data.taskSuggestionId,
          status: data.status,
        });

      return {
        id: row.id,
        clientId: row.client_id ?? undefined,
        sourceConversationId: row.source_conversation_id ?? undefined,
        title: row.title,
        description: row.description ?? undefined,
        priority: row.priority ?? undefined,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    } catch {
      throw publicError("The Orvio AI task suggestion could not be updated.");
    }
  });

export const deleteOrvioAITaskSuggestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(taskSuggestionInput)
  .handler(async ({ data, context }) => {
    const [{ loadOrvioAIRequestContext }, persistence] = await Promise.all([
      import("../ai/context.server"),
      import("../ai/persistence.server"),
    ]);

    try {
      const requestContext = await loadOrvioAIRequestContext({
        supabase: context.supabase as unknown as Parameters<
          typeof loadOrvioAIRequestContext
        >[0]["supabase"],
        userId: context.userId,
      });
      await persistence.deleteOrvioAITaskSuggestionForAgency({
        supabase: context.supabase as unknown as Parameters<
          typeof persistence.deleteOrvioAITaskSuggestionForAgency
        >[0]["supabase"],
        agencyId: requestContext.agencyId,
        taskSuggestionId: data.taskSuggestionId,
      });

      return { deleted: true, taskSuggestionId: data.taskSuggestionId };
    } catch {
      throw publicError("The Orvio AI task suggestion could not be deleted.");
    }
  });

/**
 * Authenticated smoke test for the server-side provider. No UI calls this yet.
 * The provider import stays inside the handler so server-only code and config
 * cannot be included in the browser bundle.
 */
export const testOrvioAIProvider = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(testInput)
  .handler(async ({ data }) => {
    const { completeOrvioAIChat } = await import("../ai/provider.server");

    return completeOrvioAIChat({
      systemPrompt:
        "You are the Orvio AI provider health check. Answer briefly and plainly.",
      userMessage: data.message,
      temperature: 0,
      maxTokens: 100,
    });
  });
