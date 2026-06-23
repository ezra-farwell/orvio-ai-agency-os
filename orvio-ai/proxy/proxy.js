"use strict";

/**
 * Orvio AI auth + queue proxy — runs on the homelab PC in front of Ollama.
 *
 * Responsibilities:
 *   1. Bearer-token auth  — rejects anything without the right ORVIO_PROXY_SECRET
 *   2. Concurrency cap    — exactly 1 request in-flight to Ollama at a time
 *   3. Bounded queue      — up to MAX_QUEUE requests wait; beyond that → 429 immediately
 *   4. Health endpoint    — GET /health (no auth) for Uptime Kuma and the Vercel health route
 *
 * Zero external dependencies. Requires Node 18+.
 *
 * Run:  node proxy.js
 * Env:  copy .env.example → .env and fill in ORVIO_PROXY_SECRET
 */

const http = require("node:http");
const https = require("node:https");
const path = require("node:path");
const fs = require("node:fs");

// ---------------------------------------------------------------------------
// Config — read .env from same directory, then fall through to process.env
// ---------------------------------------------------------------------------
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const eqIdx = trimmed.indexOf("=");
    const k = trimmed.slice(0, eqIdx).trim();
    const v = trimmed.slice(eqIdx + 1).trim();
    if (k && !(k in process.env)) process.env[k] = v;
  }
}

const SECRET    = process.env.ORVIO_PROXY_SECRET ?? "";
const OLLAMA    = (process.env.OLLAMA_URL ?? "http://localhost:11434").replace(/\/$/, "");
const PORT      = Number(process.env.PROXY_PORT ?? 3001);
const TIMEOUT   = Number(process.env.ORVIO_AI_TIMEOUT_MS ?? 120_000);
const MAX_QUEUE = Number(process.env.ORVIO_AI_MAX_QUEUE ?? 3);

if (!SECRET) {
  console.warn(
    "WARNING: ORVIO_PROXY_SECRET is not set — every request will be rejected with 401.",
  );
}

// ---------------------------------------------------------------------------
// Concurrency semaphore — exactly 1 slot, rest queue up to MAX_QUEUE
// ---------------------------------------------------------------------------
let inFlight = false;

/** @type {Array<{resolve:()=>void, reject:(e:Error)=>void, timer:NodeJS.Timeout}>} */
const waiting = [];

function acquireSlot() {
  if (!inFlight) {
    inFlight = true;
    return Promise.resolve();
  }
  if (waiting.length >= MAX_QUEUE) {
    const err = new Error("queue_full");
    err.code = "queue_full";
    return Promise.reject(err);
  }
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      const idx = waiting.indexOf(entry);
      if (idx !== -1) waiting.splice(idx, 1);
      const err = new Error("queue_timeout");
      err.code = "queue_timeout";
      reject(err);
    }, TIMEOUT);
    const entry = { resolve, reject, timer };
    waiting.push(entry);
  });
}

function releaseSlot() {
  if (waiting.length > 0) {
    const next = waiting.shift();
    clearTimeout(next.timer);
    next.resolve();
  } else {
    inFlight = false;
  }
}

// ---------------------------------------------------------------------------
// Forward request to Ollama
// ---------------------------------------------------------------------------
function forwardToOllama(req, res) {
  const target = new URL(OLLAMA);
  const useHttps = target.protocol === "https:";
  const proto = useHttps ? https : http;

  // Strip the proxy auth header before forwarding — Ollama doesn't need it
  const forwardHeaders = Object.assign({}, req.headers, { host: target.host });
  delete forwardHeaders["authorization"];

  let released = false;
  function releaseSafe() {
    if (!released) { released = true; releaseSlot(); }
  }

  const proxyReq = proto.request(
    {
      hostname: target.hostname,
      port: target.port || (useHttps ? 443 : 80),
      path: req.url,
      method: req.method,
      headers: forwardHeaders,
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
      proxyRes.on("end", releaseSafe);
      proxyRes.on("error", releaseSafe);
    },
  );

  proxyReq.on("error", (err) => {
    releaseSafe();
    if (!res.headersSent) {
      res.writeHead(503, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "ollama_unreachable", detail: err.message }));
    }
  });

  res.on("error", releaseSafe);
  req.pipe(proxyReq, { end: true });
}

// ---------------------------------------------------------------------------
// Health check — pings Ollama /api/version, reports queue state
// ---------------------------------------------------------------------------
function handleHealth(res) {
  const target = new URL(OLLAMA);
  const useHttps = target.protocol === "https:";
  const proto = useHttps ? https : http;
  const t0 = Date.now();

  const probe = proto.request(
    {
      hostname: target.hostname,
      port: target.port || (useHttps ? 443 : 80),
      path: "/api/version",
      method: "GET",
      timeout: 5_000,
    },
    (probeRes) => {
      let body = "";
      probeRes.on("data", (chunk) => { body += chunk; });
      probeRes.on("end", () => {
        let ollamaInfo = {};
        try { ollamaInfo = JSON.parse(body); } catch { /* ignore */ }
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({
          status: "up",
          latencyMs: Date.now() - t0,
          ollama: ollamaInfo,
          queue: { inFlight, waiting: waiting.length, maxQueue: MAX_QUEUE },
        }));
      });
    },
  );

  probe.on("timeout", () => {
    probe.destroy();
    if (!res.headersSent) {
      res.writeHead(503, { "content-type": "application/json" });
      res.end(JSON.stringify({ status: "down", reason: "ollama_timeout", latencyMs: Date.now() - t0 }));
    }
  });

  probe.on("error", (err) => {
    if (!res.headersSent) {
      res.writeHead(503, { "content-type": "application/json" });
      res.end(JSON.stringify({ status: "down", reason: err.message, latencyMs: Date.now() - t0 }));
    }
  });

  probe.end();
}

// ---------------------------------------------------------------------------
// HTTP server
// ---------------------------------------------------------------------------
const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url ?? "/", "http://localhost");

  // Health — unauthenticated, exposes no model data
  if (req.method === "GET" && pathname === "/health") {
    handleHealth(res);
    return;
  }

  // Auth check for everything else
  const authHeader = req.headers["authorization"] ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!SECRET || token !== SECRET) {
    res.writeHead(401, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "Unauthorized" }));
    return;
  }

  // Queue → forward
  acquireSlot()
    .then(() => forwardToOllama(req, res))
    .catch((err) => {
      const status = err.code === "queue_full" ? 429 : 503;
      res.writeHead(status, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: err.code, message: err.message }));
    });
});

server.listen(PORT, "127.0.0.1", () => {
  const masked = SECRET
    ? `${SECRET.slice(0, 4)}${"*".repeat(Math.max(0, SECRET.length - 4))}`
    : "UNSET";
  console.log(`Orvio AI proxy  http://127.0.0.1:${PORT}`);
  console.log(`  Ollama : ${OLLAMA}`);
  console.log(`  Secret : ${masked}`);
  console.log(`  Queue  : max ${MAX_QUEUE} waiting | timeout ${TIMEOUT}ms`);
  console.log(`  Health : http://127.0.0.1:${PORT}/health`);
});
