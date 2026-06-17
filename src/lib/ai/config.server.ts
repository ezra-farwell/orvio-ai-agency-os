import process from "node:process";
import { z } from "zod";

const providerSchema = z.literal("ollama");

const aiConfigSchema = z.object({
  provider: providerSchema,
  baseUrl: z.string().url().refine(
    (value) => value.startsWith("http://") || value.startsWith("https://"),
    "must use http or https",
  ),
  model: z.string().trim().min(1),
  apiKey: z.string().optional(),
  timeoutMs: z.coerce.number().int().min(1_000).max(600_000),
});

export type OrvioAIProvider = z.infer<typeof providerSchema>;

export type OrvioAIConfig = {
  provider: OrvioAIProvider;
  baseUrl: string;
  model: string;
  apiKey?: string;
  timeoutMs: number;
};

export class OrvioAIConfigurationError extends Error {
  constructor() {
    super("Orvio AI server configuration is missing or invalid.");
    this.name = "OrvioAIConfigurationError";
  }
}

/**
 * Read AI configuration per request. This is required by server runtimes where
 * environment bindings may not be available during module initialization.
 */
export function getOrvioAIConfig(): OrvioAIConfig {
  const parsed = aiConfigSchema.safeParse({
    provider: process.env.ORVIO_AI_PROVIDER,
    baseUrl: process.env.ORVIO_AI_BASE_URL,
    model: process.env.ORVIO_AI_MODEL,
    apiKey: process.env.ORVIO_AI_API_KEY?.trim() || undefined,
    timeoutMs: process.env.ORVIO_AI_TIMEOUT_MS,
  });

  if (!parsed.success) {
    throw new OrvioAIConfigurationError();
  }

  return {
    ...parsed.data,
    baseUrl: parsed.data.baseUrl.replace(/\/+$/, ""),
  };
}
