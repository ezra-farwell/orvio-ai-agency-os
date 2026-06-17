"""
Orvio AI worker — runs on your homelab PC.

For every client it reads platform data + the matching state/trade benchmarks from
Supabase, runs your LOCAL Ollama model, and writes structured insights back to the
ai_insights table. The web app just reads those, so it keeps working when the PC is off.

Talks to Supabase over its REST API (no SDK) and to Ollama over HTTP — only dependency
is `requests`. Configure via orvio-ai/.env (see .env.example).
"""
import os, json, re, time
import requests
from pathlib import Path

# --- config -----------------------------------------------------------------
def load_env():
    env = Path(__file__).with_name(".env")
    if env.exists():
        for line in env.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())

load_env()
SUPABASE_URL = os.environ["SUPABASE_URL"].rstrip("/")
SERVICE_KEY  = os.environ["SUPABASE_SERVICE_KEY"]          # service role — stays on your PC
OLLAMA_URL   = os.environ.get("OLLAMA_URL", "http://localhost:11434").rstrip("/")
MODEL        = os.environ.get("OLLAMA_MODEL", "llama3.1:8b")

SB = {"apikey": SERVICE_KEY, "Authorization": f"Bearer {SERVICE_KEY}", "Content-Type": "application/json"}

# --- supabase REST helpers --------------------------------------------------
def sb_get(path):
    r = requests.get(f"{SUPABASE_URL}/rest/v1/{path}", headers=SB, timeout=30)
    r.raise_for_status()
    return r.json()

def sb_insert(table, row):
    r = requests.post(f"{SUPABASE_URL}/rest/v1/{table}", headers=SB, data=json.dumps(row), timeout=30)
    r.raise_for_status()

# --- ollama -----------------------------------------------------------------
def ollama(prompt, system, want_json=False):
    body = {
        "model": MODEL, "stream": False,
        "messages": [{"role": "system", "content": system}, {"role": "user", "content": prompt}],
        "options": {"temperature": 0.3},
    }
    if want_json:
        body["format"] = "json"
    r = requests.post(f"{OLLAMA_URL}/api/chat", data=json.dumps(body), timeout=300)
    r.raise_for_status()
    return r.json()["message"]["content"].strip()

def ollama_json(prompt, system):
    raw = ollama(prompt, system, want_json=True)
    try:
        return json.loads(raw)
    except Exception:
        m = re.search(r"\{.*\}", raw, re.S)
        return json.loads(m.group(0)) if m else {}

def as_text(a):
    """Models sometimes return list items as objects — coerce to a clean string."""
    if isinstance(a, dict):
        return a.get("action") or a.get("text") or a.get("description") or "; ".join(str(v) for v in a.values())
    return str(a)

# --- benchmarks -------------------------------------------------------------
def state_of(area):  # "Phoenix, AZ" -> "AZ"
    m = re.search(r",\s*([A-Z]{2})\b", area or "")
    return m.group(1) if m else "*"

def benchmark(state, trade, metric):
    rows = sb_get(f"benchmarks?metric=eq.{metric}&trade=eq.{trade}&or=(state.eq.{state},state.eq.*)")
    rows.sort(key=lambda r: 0 if r["state"] == state else 1)  # prefer state-specific
    return rows[0] if rows else None

# --- per-client analysis ----------------------------------------------------
def build_context(client):
    state, trade = state_of(client.get("area")), client.get("category") or "Home services"
    leads = sb_get(f"leads?client_id=eq.{client['id']}&select=status")
    by = {}
    for l in leads:
        by[l["status"]] = by.get(l["status"], 0) + 1
    bm = benchmark(state, trade, "cpl")
    bm_line = (f"Typical CPL for {trade} in {state}: ${bm['p25']}-${bm['p75']} (median ${bm['p50']})."
               if bm else "No benchmark available for this state/trade.")
    return state, trade, {
        "client": client["name"], "state": state, "trade": trade,
        "monthly_spend": client.get("monthly_spend"), "leads": client.get("leads"),
        "cpl": client.get("cpl"), "status": client.get("status"),
        "lead_breakdown": by, "benchmark": bm_line,
    }

def churn_insight(ctxs):
    churn = ollama_json(
        f"Client data:\n{ctxs}\n\nReturn JSON: {{\"score\": 0-100 churn risk, "
        f"\"severity\": \"low|medium|high\", \"reason\": \"one sentence\"}}.",
        "You assess churn risk for a marketing agency's contractor client. Higher CPL vs "
        "benchmark, falling leads, or 'at-risk' status raise the score. Be conservative and specific.")
    if not churn:
        return None
    return {"kind": "churn_risk", "score": churn.get("score"),
            "severity": churn.get("severity"), "title": "Churn risk",
            "body": churn.get("reason"), "data": churn}

def summary_insight(ctxs):
    summary = ollama(
        f"Client data:\n{ctxs}\n\nWrite 2-3 plain-English sentences a non-marketer contractor "
        f"would understand about how their ads did this month. No jargon, no numbers they didn't ask for.",
        "You explain ad performance to a busy contractor. Warm, clear, honest.")
    return {"kind": "analytics_summary", "title": "This month, in plain English", "body": summary}

def flags_insight(ctxs):
    flags = ollama_json(
        f"Client data:\n{ctxs}\n\nReturn JSON: {{\"flags\": [\"short issue the agency should follow up on\"]}}. "
        f"Empty list if all healthy.",
        "You flag operational follow-ups for the agency team (e.g. CPL above benchmark, leads not contacted).")
    if not flags.get("flags"):
        return None
    flag_list = [as_text(f) for f in flags["flags"]]
    return {"kind": "followup_flag", "severity": "medium",
            "title": f"{len(flag_list)} follow-up(s)", "body": "; ".join(flag_list),
            "data": {"flags": flag_list}}

def actions_insight(ctxs):
    actions = ollama_json(
        f"Client data:\n{ctxs}\n\nReturn JSON: {{\"actions\": [\"specific next action for the agency\"]}} "
        f"(max 4, ordered by impact).",
        "You recommend concrete next actions for the agency to improve this client's results.")
    if not actions.get("actions"):
        return None
    action_list = [as_text(a) for a in actions["actions"]]
    return {"kind": "next_actions", "title": "Recommended next actions",
            "body": "\n".join(f"• {a}" for a in action_list), "data": {"actions": action_list}}

def report_insight(ctxs):
    report = ollama(
        f"Client data:\n{ctxs}\n\nWrite a short, friendly monthly update (4-6 sentences) the agency can "
        f"send this client. Lead with the win, be transparent about anything soft, end with what's next.",
        "You ghost-write a contractor-friendly monthly report for a white-label agency. No jargon.")
    return {"kind": "client_report", "title": "Monthly client report", "body": report}

# Each insight is independent — a single model/JSON failure can't drop the others.
BUILDERS = [churn_insight, summary_insight, flags_insight, actions_insight, report_insight]

def run():
    clients = sb_get("clients?select=id,name,area,category,monthly_spend,leads,cpl,status")
    print(f"Analyzing {len(clients)} clients with {MODEL}…")
    for c in clients:
        _, _, ctx = build_context(c)
        ctxs = json.dumps(ctx, indent=2)
        ok, fail = 0, 0
        for build in BUILDERS:
            try:
                ins = build(ctxs)
                if not ins:
                    continue
                ins["client_id"] = c["id"]; ins["model"] = MODEL
                sb_insert("ai_insights", ins)
                ok += 1
            except Exception as e:
                fail += 1
                print(f"      · {c['name']} / {build.__name__}: {e}")
        mark = "✓" if fail == 0 else "partial"
        print(f"  {mark} {c['name']} ({ok} insight{'s' if ok != 1 else ''}{', ' + str(fail) + ' failed' if fail else ''})")
        time.sleep(0.3)
    print("Done.")

if __name__ == "__main__":
    run()
