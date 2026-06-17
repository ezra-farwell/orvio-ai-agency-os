import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const testInput = z.object({
  message: z.string().trim().min(1).max(2_000),
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
