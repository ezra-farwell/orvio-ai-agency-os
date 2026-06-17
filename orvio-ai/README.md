# Orvio AI worker (Windows homelab)

A local AI worker that reads your platform data + state/trade benchmarks from Supabase,
runs a **local** Ollama model on your PC, and writes insights (churn risk, plain-English
analytics, follow-up flags, client reports, recommended actions) back to Supabase. The web
app reads those — so your data and the model both stay on your machine, and the app keeps
working when the PC is off.

## One-time setup (Windows)

1. **Install Ollama** → https://ollama.com/download → run the installer.
2. **Pull a model** (PowerShell):
   ```powershell
   ollama pull llama3.1:8b      # fits your 6GB GTX 1660 Super now
   # after the 3090 upgrade:    ollama pull qwen2.5:14b   (or 32b)
   ```
   Ollama now serves an API at http://localhost:11434.
3. **Install Python 3.11+** (python.org → check "Add to PATH").
4. **Set up the worker** (PowerShell, in this folder):
   ```powershell
   cd path\to\orvio-ai-agency-os\orvio-ai
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   copy .env.example .env
   ```
5. **Edit `.env`** — paste your Supabase **service_role** key
   (Supabase → Project Settings → API → `service_role`). Keep `OLLAMA_MODEL` matching what you pulled.

## Run it

```powershell
.\.venv\Scripts\Activate.ps1
python worker.py
```
It analyzes every client and writes rows to `ai_insights`. First run on the 1660 will be slow
(a few seconds per client); the 3090 makes it near-instant.

## Schedule it (Task Scheduler)

1. Open **Task Scheduler** → **Create Basic Task** → name it "Orvio AI".
2. Trigger: **Daily** (or hourly).
3. Action: **Start a program** →
   - Program: `path\to\orvio-ai\.venv\Scripts\python.exe`
   - Arguments: `worker.py`
   - Start in: `path\to\orvio-ai`
4. Finish. It now runs on its own; the dashboards show the latest insights.

## How the app reads it

`ai_insights` (and the `ai_latest` view) are RLS-protected: agencies see all insight kinds
for their clients; client portals see only `analytics_summary` + `client_report`. Wiring the
churn badge / AI summary / recommended actions into the UI is the next app-side step.

## Benchmarks

`benchmarks` is seeded with national defaults + a few state examples (AZ, WY). The worker
grades each client against the right `(state, trade)` peer group. As you accumulate real data,
we can add a step that recomputes benchmarks from your own platform medians (`source='computed'`).
