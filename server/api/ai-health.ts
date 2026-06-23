import { defineEventHandler, setResponseStatus } from "h3";

/**
 * GET /api/ai-health
 *
 * Pings the Orvio AI proxy's /health endpoint and returns the result.
 * Returns 200 when the proxy + Ollama are reachable, 503 otherwise.
 *
 * Wire this URL into Uptime Kuma (or any HTTP monitor) to track homelab uptime.
 * No authentication is required to call this endpoint — it exposes no sensitive data.
 *
 * Local dev: returns { status: "local_dev" } immediately (nothing to ping).
 */
export default defineEventHandler(async (event) => {
  const baseUrl = process.env.ORVIO_AI_BASE_URL?.trim();

  if (!baseUrl) {
    setResponseStatus(event, 503);
    return { status: "unconfigured", reason: "ORVIO_AI_BASE_URL is not set" };
  }

  // In local dev the base URL points directly at Ollama — there is no proxy /health endpoint.
  const isLocal =
    baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1");
  if (isLocal) {
    return {
      status: "local_dev",
      note: "Health checks only apply to the production proxy. Set ORVIO_AI_BASE_URL to the tunnel URL to enable.",
    };
  }

  // Derive the proxy base URL by stripping the /v1 suffix, then append /health.
  const proxyBase = baseUrl.replace(/\/v1\/?$/, "").replace(/\/+$/, "");
  const healthUrl = `${proxyBase}/health`;
  const startedAt = Date.now();

  try {
    const res = await fetch(healthUrl, {
      signal: AbortSignal.timeout(10_000),
    });

    const latencyMs = Date.now() - startedAt;

    if (!res.ok) {
      setResponseStatus(event, 503);
      return { status: "down", httpStatus: res.status, latencyMs };
    }

    let proxyBody: unknown = {};
    try {
      proxyBody = await res.json();
    } catch {
      // ignore parse errors — the important thing is the 200
    }

    return { status: "up", latencyMs, proxy: proxyBody };
  } catch (err) {
    setResponseStatus(event, 503);
    return {
      status: "down",
      reason: err instanceof Error ? err.message : "unknown",
      latencyMs: Date.now() - startedAt,
    };
  }
});
