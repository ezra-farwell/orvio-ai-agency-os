# Cloudflare Tunnel — Windows setup (homelab PC)

Cloudflare Tunnel gives you a stable public HTTPS URL that routes to `http://127.0.0.1:3001`
(the Orvio AI proxy) without opening any firewall ports. Traffic is encrypted end-to-end
and the URL never changes after setup.

**Requirements:**
- Free Cloudflare account at cloudflare.com
- A domain added to Cloudflare (even a cheap .com works; Cloudflare manages DNS)

---

## 1 — Install cloudflared

Download the Windows x64 MSI or EXE from the official releases page:
https://github.com/cloudflare/cloudflared/releases/latest

Look for `cloudflared-windows-amd64.msi` and run it. It installs `cloudflared.exe` to
`C:\Program Files (x86)\cloudflared\cloudflared.exe` and adds it to PATH.

Verify in a new PowerShell window:
```powershell
cloudflared --version
```

---

## 2 — Authenticate

```powershell
cloudflared tunnel login
```

This opens your browser to Cloudflare. Select the domain you want to use and authorize.
A credentials file is saved to `C:\Users\<you>\.cloudflared\cert.pem`.

---

## 3 — Create a named tunnel

```powershell
cloudflared tunnel create orvio-ai
```

This outputs a Tunnel ID (a UUID like `a1b2c3d4-...`) and saves a credentials JSON at
`C:\Users\<you>\.cloudflared\<tunnel-id>.json`. Keep the ID handy.

---

## 4 — Route a DNS hostname to the tunnel

Replace `ai.yourdomain.com` with whatever subdomain you want:

```powershell
cloudflared tunnel route dns orvio-ai ai.yourdomain.com
```

This creates a CNAME record in Cloudflare DNS pointing `ai.yourdomain.com` → your tunnel.
The URL `https://ai.yourdomain.com` is now your stable production endpoint.

---

## 5 — Create the config file

Create `C:\Users\<you>\.cloudflared\config.yml`:

```yaml
tunnel: <your-tunnel-id>          # the UUID from step 3
credentials-file: C:\Users\<you>\.cloudflared\<tunnel-id>.json

ingress:
  - hostname: ai.yourdomain.com
    service: http://127.0.0.1:3001
  - service: http_status:404
```

Replace `<your-tunnel-id>`, `<you>`, and `ai.yourdomain.com` with your actual values.

Test it manually before installing as a service:
```powershell
cloudflared tunnel run orvio-ai
```

Then verify in a browser: `https://ai.yourdomain.com/health` should return `{"status":"up",...}`.
(The proxy must be running first — see proxy startup below.)

Press Ctrl+C to stop the test run.

---

## 6 — Install as a Windows service (survives reboots)

In an **elevated** PowerShell (Run as Administrator):

```powershell
cloudflared service install
```

This installs a Windows service named "Cloudflared" that starts automatically on boot.

Start it now without rebooting:
```powershell
Start-Service cloudflared
```

Check its status:
```powershell
Get-Service cloudflared
```

---

## 7 — Run the proxy as a Windows service (survives reboots)

The proxy also needs to survive reboots. Use NSSM (Non-Sucking Service Manager):

Download NSSM from https://nssm.cc/download — get the latest release, extract it, and
either add it to PATH or run from its folder.

In elevated PowerShell:
```powershell
nssm install OrvioAIProxy node "C:\path\to\orvio-ai\proxy\proxy.js"
nssm set OrvioAIProxy AppDirectory "C:\path\to\orvio-ai\proxy"
nssm set OrvioAIProxy AppEnvironmentExtra "ORVIO_PROXY_SECRET=your-secret-here" "OLLAMA_URL=http://localhost:11434" "PROXY_PORT=3001" "ORVIO_AI_TIMEOUT_MS=120000" "ORVIO_AI_MAX_QUEUE=3"
nssm set OrvioAIProxy Start SERVICE_AUTO_START
nssm start OrvioAIProxy
```

(You can also just drop a `.env` file in `orvio-ai/proxy/` and omit `AppEnvironmentExtra`
if you prefer — the proxy reads `.env` on startup.)

Verify the service is running:
```powershell
Get-Service OrvioAIProxy
```

---

## End state

After this setup:

| Component | Status |
|---|---|
| Ollama | `http://localhost:11434` (local only, unchanged) |
| Orvio AI proxy | `http://127.0.0.1:3001` (local only, Windows service) |
| Cloudflare Tunnel | Forwards `https://ai.yourdomain.com` → proxy (Windows service) |
| Public health URL | `https://ai.yourdomain.com/health` (no auth needed) |

Set in Vercel:
```
ORVIO_AI_BASE_URL=https://ai.yourdomain.com/v1
ORVIO_AI_API_KEY=<same value as ORVIO_PROXY_SECRET in proxy/.env>
```

---

## Troubleshooting

**"connection refused" on `/health`** — the proxy isn't running. Check `Get-Service OrvioAIProxy`.

**401 from the proxy** — Vercel's `ORVIO_AI_API_KEY` doesn't match `ORVIO_PROXY_SECRET`. They must be identical.

**429 from Vercel** — the queue is full (3 requests already waiting). Normal under load; the UI shows a friendly message.

**Tunnel shows "offline" in Cloudflare dashboard** — cloudflared service is stopped. Run `Start-Service cloudflared`.

**Ollama not responding** — open PowerShell and run `ollama list` to confirm Ollama is running.
