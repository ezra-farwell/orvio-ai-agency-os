import { getOrvioAIConfig, type OrvioAIProvider } from "./config.server";

export type OrvioAIContext =
  | string
  | Record<string, unknown>
  | readonly unknown[];

export type OrvioAIChatInput = {
  systemPrompt: string;
  userMessage: string;
  context?: OrvioAIContext;
  temperature?: number;
  maxTokens?: number;
};

export type OrvioAIChatResult = {
  text: string;
  provider: OrvioAIProvider;
  model: string;
  latencyMs: number;
};

type OpenAIChatCompletionResponse = {
  model?: string;
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

export type OrvioAIProviderErrorCode =
  | "connection_failed"
  | "request_failed"
  | "timeout"
  | "invalid_response"
  | "queue_full";

export class OrvioAIProviderError extends Error {
  readonly code: OrvioAIProviderErrorCode;
  readonly status?: number;

  constructor(
    code: OrvioAIProviderErrorCode,
    message: string,
    options?: { status?: number; cause?: unknown },
  ) {
    super(message, { cause: options?.cause });
    this.name = "OrvioAIProviderError";
    this.code = code;
    this.status = options?.status;
  }
}

function serializeContext(context: OrvioAIContext): string {
  if (typeof context === "string") return context;

  try {
    return JSON.stringify(context, null, 2);
  } catch {
    throw new OrvioAIProviderError(
      "request_failed",
      "The supplied Orvio AI context could not be serialized.",
    );
  }
}

function buildUserContent(input: OrvioAIChatInput): string {
  if (input.context === undefined) return input.userMessage;
  return `Context:\n${serializeContext(input.context)}\n\nUser request:\n${input.userMessage}`;
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

export async function completeOrvioAIChat(
  input: OrvioAIChatInput,
): Promise<OrvioAIChatResult> {
  const config = getOrvioAIConfig();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);
  const startedAt = Date.now();

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (config.apiKey) {
      headers.Authorization = `Bearer ${config.apiKey}`;
    }

    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers,
      signal: controller.signal,
      body: JSON.stringify({
        model: config.model,
        stream: false,
        messages: [
          { role: "system", content: input.systemPrompt },
          { role: "user", content: buildUserContent(input) },
        ],
        ...(input.temperature === undefined
          ? {}
          : { temperature: input.temperature }),
        ...(input.maxTokens === undefined
          ? {}
          : { max_tokens: input.maxTokens }),
      }),
    });

    if (response.status === 429) {
      throw new OrvioAIProviderError(
        "queue_full",
        "Orvio AI is busy with another request. Please try again in a moment.",
        { status: 429 },
      );
    }

    if (!response.ok) {
      throw new OrvioAIProviderError(
        "request_failed",
        `The Orvio AI provider rejected the request with status ${response.status}.`,
        { status: response.status },
      );
    }

    let payload: OpenAIChatCompletionResponse;
    try {
      payload = (await response.json()) as OpenAIChatCompletionResponse;
    } catch (error) {
      throw new OrvioAIProviderError(
        "invalid_response",
        "The Orvio AI provider returned an invalid response.",
        { cause: error },
      );
    }

    const text = payload.choices?.[0]?.message?.content?.trim();
    if (!text) {
      throw new OrvioAIProviderError(
        "invalid_response",
        "The Orvio AI provider returned no response text.",
      );
    }

    return {
      text,
      provider: config.provider,
      model: payload.model || config.model,
      latencyMs: Date.now() - startedAt,
    };
  } catch (error) {
    if (error instanceof OrvioAIProviderError) throw error;

    if (isAbortError(error)) {
      throw new OrvioAIProviderError(
        "timeout",
        "The Orvio AI request timed out.",
        { cause: error },
      );
    }

    throw new OrvioAIProviderError(
      "connection_failed",
      "Unable to reach the configured Orvio AI provider.",
      { cause: error },
    );
  } finally {
    clearTimeout(timeout);
  }
}
