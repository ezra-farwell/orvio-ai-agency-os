import {
  defineEventHandler,
  getHeader,
  readBody,
  setResponseStatus,
} from "h3";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import type { Database } from "../../src/integrations/supabase/types";

/**
 * POST /api/ai-stream
 *
 * Streaming sibling of the `sendOrvioAIMessage` server function. It performs the
 * same auth + context + persistence orchestration, but streams the model's
 * tokens back as Server-Sent Events so a slow local response renders live
 * instead of arriving in one block after 10-30s.
 *
 * This route is intentionally ADDITIVE — the non-streaming server function is
 * left untouched. The client treats streaming as a progressive enhancement and
 * falls back to that server function if this route is unreachable (e.g. local
 * `vite dev`, where Nitro routes are not served) or fails before the first
 * `meta` event. Once `meta` is emitted the user message is already persisted, so
 * the client commits to this path and never double-sends.
 *
 * SSE event shapes (each `data: <json>`):
 *   { type: "meta",  conversationId, userMessageId, mode, clientId }
 *   { type: "delta", text }
 *   { type: "done",  assistantMessageId, model, provider, latencyMs }
 *   { type: "error", message }
 */

const modes = [
  "general",
  "campaign_ideas",
  "lead_followup",
  "creative_prompt",
  "competitor_summary",
  "report_summary",
  "task_recommendations",
] as const;

const bodySchema = z.object({
  message: z.string().trim().min(1).max(8_000),
  clientId: z.string().uuid().optional(),
  conversationId: z.string().uuid().optional(),
  mode: z.enum(modes).optional(),
  context: z.string().trim().max(12_000).optional(),
});

export default defineEventHandler(async (event) => {
  // --- auth (mirrors requireSupabaseAuth middleware) ---
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    setResponseStatus(event, 500);
    return { error: "Server authentication is not configured." };
  }

  const authHeader = getHeader(event, "authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    setResponseStatus(event, 401);
    return { error: "Unauthorized" };
  }
  const token = authHeader.slice(7).trim();
  if (!token) {
    setResponseStatus(event, 401);
    return { error: "Unauthorized" };
  }

  const supabaseClient = createClient<Database>(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: {
        storage: undefined,
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );

  const { data: claimsData, error: claimsError } =
    await supabaseClient.auth.getClaims(token);
  if (claimsError || !claimsData?.claims?.sub) {
    setResponseStatus(event, 401);
    return { error: "Unauthorized" };
  }
  const userId = claimsData.claims.sub as string;

  // --- parse body ---
  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await readBody(event));
  } catch {
    setResponseStatus(event, 400);
    return { error: "Invalid request." };
  }

  // Server-only modules are imported lazily, matching the server-function pattern.
  const [
    { loadOrvioAIRequestContext, OrvioAIContextError },
    { buildOrvioAISystemPrompt },
    { streamOrvioAIChat, OrvioAIProviderError },
    persistence,
    taskSuggestions,
  ] = await Promise.all([
    import("../../src/lib/ai/context.server"),
    import("../../src/lib/ai/prompts.server"),
    import("../../src/lib/ai/provider.server"),
    import("../../src/lib/ai/persistence.server"),
    import("../../src/lib/ai/task-suggestions.server"),
  ]);

  const ctxSupabase = supabaseClient as unknown as Parameters<
    typeof loadOrvioAIRequestContext
  >[0]["supabase"];
  const persistSupabase = supabaseClient as unknown as Parameters<
    typeof persistence.createOrvioAIConversation
  >[0]["supabase"];

  try {
    // --- prepare: context, conversation, and user message (before streaming) ---
    let requestContext = await loadOrvioAIRequestContext({
      supabase: ctxSupabase,
      userId,
    });

    let conversation;
    let effectiveMode = body.mode ?? "general";
    let effectiveClientId = body.clientId;

    if (body.conversationId) {
      conversation = await persistence.getOrvioAIConversationForAgency({
        supabase: persistSupabase,
        agencyId: requestContext.agencyId,
        conversationId: body.conversationId,
      });
      if (body.mode && body.mode !== conversation.mode) {
        throw new persistence.OrvioAIPersistenceError("conversation_mismatch");
      }
      if (
        body.clientId !== undefined &&
        body.clientId !== (conversation.client_id ?? undefined)
      ) {
        throw new persistence.OrvioAIPersistenceError("conversation_mismatch");
      }
      effectiveMode = conversation.mode;
      effectiveClientId = conversation.client_id ?? undefined;
    }

    if (effectiveClientId) {
      requestContext = await loadOrvioAIRequestContext({
        supabase: ctxSupabase,
        userId,
        clientId: effectiveClientId,
      });
    }

    let newConversationId: string | undefined;
    if (!conversation) {
      conversation = await persistence.createOrvioAIConversation({
        supabase: persistSupabase,
        agencyId: requestContext.agencyId,
        userId: requestContext.profile.userId,
        clientId: effectiveClientId,
        mode: effectiveMode,
        title: persistence.createConversationTitle(body.message),
      });
      newConversationId = conversation.id;
    }

    let userMessage;
    try {
      userMessage = await persistence.insertOrvioAIMessage({
        supabase: persistSupabase,
        conversationId: conversation.id,
        agencyId: requestContext.agencyId,
        userId: requestContext.profile.userId,
        clientId: effectiveClientId,
        role: "user",
        content: body.message,
        metadata: {
          mode: effectiveMode,
          hasAdditionalContext: Boolean(body.context),
          streamed: true,
        },
      });
    } catch (error) {
      if (newConversationId) {
        await persistence.deleteNewOrvioAIConversationBestEffort({
          supabase: persistSupabase,
          agencyId: requestContext.agencyId,
          conversationId: newConversationId,
        });
      }
      throw error;
    }

    await persistence.touchOrvioAIConversation({
      supabase: persistSupabase,
      agencyId: requestContext.agencyId,
      conversationId: conversation.id,
    });

    const aiContext = {
      clientSelection: requestContext.client
        ? "selected_client_context_available"
        : "no_client_selected",
      authenticatedUser: {
        role: requestContext.profile.role,
        fullName: requestContext.profile.fullName,
      },
      selectedClient: requestContext.client,
      additionalContext: body.context || undefined,
    };

    const systemPrompt = [
      buildOrvioAISystemPrompt(effectiveMode, {
        hasSelectedClient: Boolean(requestContext.client),
      }),
      effectiveMode === "task_recommendations"
        ? taskSuggestions.TASK_RECOMMENDATION_FORMAT_INSTRUCTIONS
        : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    // Capture the resolved exchange for the streaming closure below.
    const resolved = {
      requestContext,
      conversation,
      effectiveMode,
      effectiveClientId,
      userMessage,
      aiContext,
      systemPrompt,
    };

    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const send = (payload: Record<string, unknown>) =>
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(payload)}\n\n`),
          );

        try {
          send({
            type: "meta",
            conversationId: resolved.conversation.id,
            userMessageId: resolved.userMessage.id,
            mode: resolved.effectiveMode,
            clientId: resolved.effectiveClientId ?? null,
          });

          const result = await streamOrvioAIChat(
            {
              systemPrompt: resolved.systemPrompt,
              userMessage: body.message,
              context: resolved.aiContext,
              temperature: 0.3,
              maxTokens: 1_200,
            },
            (delta) => send({ type: "delta", text: delta }),
          );

          const assistantMessage = await persistence.insertOrvioAIMessage({
            supabase: persistSupabase,
            conversationId: resolved.conversation.id,
            agencyId: resolved.requestContext.agencyId,
            userId: resolved.requestContext.profile.userId,
            clientId: resolved.effectiveClientId,
            role: "assistant",
            content: result.text,
            model: result.model,
            provider: result.provider,
            latencyMs: result.latencyMs,
            metadata: { mode: resolved.effectiveMode },
          });

          await persistence.touchOrvioAIConversation({
            supabase: persistSupabase,
            agencyId: resolved.requestContext.agencyId,
            conversationId: resolved.conversation.id,
          });

          if (resolved.effectiveMode === "task_recommendations") {
            try {
              await persistence.insertOrvioAITaskSuggestions({
                supabase: persistSupabase,
                agencyId: resolved.requestContext.agencyId,
                userId: resolved.requestContext.profile.userId,
                clientId: resolved.effectiveClientId,
                conversationId: resolved.conversation.id,
                suggestions: taskSuggestions.extractTaskSuggestions(result.text),
              });
            } catch {
              // Task extraction is best-effort; the reply remains valid without it.
            }
          }

          send({
            type: "done",
            assistantMessageId: assistantMessage.id,
            model: result.model,
            provider: result.provider,
            latencyMs: result.latencyMs,
          });
        } catch (error) {
          let message = "Orvio AI could not complete the request.";
          if (error instanceof OrvioAIProviderError) {
            if (error.code === "queue_full") {
              message =
                "Orvio AI is busy right now — please try again in a moment.";
            } else if (error.code === "timeout") {
              message = "Orvio AI took too long to respond. Please try again.";
            } else if (error.code === "connection_failed") {
              message = "Orvio AI is temporarily unavailable. Check back shortly.";
            }
          }
          send({ type: "error", message });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "content-type": "text/event-stream; charset=utf-8",
        "cache-control": "no-cache, no-transform",
        "x-accel-buffering": "no",
      },
    });
  } catch (error) {
    // Failures here happen BEFORE any `meta` event, so the client can safely
    // fall back to the non-streaming server function without double-sending.
    if (error instanceof OrvioAIContextError) {
      setResponseStatus(event, 403);
      return { error: "You are not authorized to use Orvio AI." };
    }
    if (error instanceof persistence.OrvioAIPersistenceError) {
      setResponseStatus(event, 409);
      return {
        error: "The selected client or mode does not match this conversation.",
      };
    }
    setResponseStatus(event, 500);
    return { error: "Orvio AI could not start the request." };
  }
});
