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
  mode: z.enum(modes).default("general"),
  context: z.string().trim().max(12_000).optional(),
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
    ] = await Promise.all([
      import("../ai/context.server"),
      import("../ai/prompts.server"),
      import("../ai/config.server"),
      import("../ai/provider.server"),
    ]);

    try {
      const requestContext = await loadOrvioAIRequestContext({
        supabase: context.supabase as unknown as Parameters<
          typeof loadOrvioAIRequestContext
        >[0]["supabase"],
        userId: context.userId,
        clientId: data.clientId,
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
        systemPrompt: buildOrvioAISystemPrompt(data.mode),
        userMessage: data.message,
        context: aiContext,
        temperature: 0.3,
        maxTokens: 1_200,
      });

      return {
        ...result,
        mode: data.mode,
        clientId: data.clientId,
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

      throw publicError("Orvio AI could not complete the request.");
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
