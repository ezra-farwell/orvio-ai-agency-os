-- Orvio AI: state/trade benchmarks (grounding) + ai_insights (worker output).
-- The local AI worker (on the operator's PC) reads platform data + benchmarks,
-- runs a local LLM, and writes structured insights here. The app reads them.

-- ---------- benchmarks (global reference data; state + trade specific) ----------
create table benchmarks (
  id         uuid primary key default gen_random_uuid(),
  state      text not null,   -- 'AZ', 'WY', ... or '*' national default
  trade      text not null,   -- 'Plumbing','HVAC',... or '*' any
  metric     text not null,   -- 'cpl','booking_rate','cost_per_booked'
  p25        numeric, p50 numeric, p75 numeric,
  unit       text,            -- 'usd' | 'pct'
  source     text not null default 'seed',  -- 'seed' | 'computed'
  updated_at timestamptz not null default now(),
  unique (state, trade, metric)
);
alter table benchmarks enable row level security;
create policy benchmarks_read on benchmarks for select using (auth.role() = 'authenticated');

-- ---------- ai_insights (per client, produced by the worker) ----------
create type insight_kind as enum
  ('churn_risk', 'analytics_summary', 'followup_flag', 'client_report', 'next_actions');

create table ai_insights (
  id         uuid primary key default gen_random_uuid(),
  client_id  uuid not null references clients (id) on delete cascade,
  kind       insight_kind not null,
  severity   text,            -- 'low' | 'medium' | 'high'
  score      numeric,         -- 0-100 (churn risk)
  title      text,
  body       text,            -- generated prose (summary / report)
  data       jsonb,           -- structured (e.g. recommended actions list)
  model      text,            -- which local model produced it
  created_at timestamptz not null default now()
);
create index idx_ai_insights_client on ai_insights (client_id, kind, created_at desc);
alter table ai_insights enable row level security;

-- Agency users: all insight kinds for their clients.
create policy ai_agency_read on ai_insights for select using (
  exists (select 1 from clients c where c.id = ai_insights.client_id and c.agency_id = auth_agency_id()) and is_agency_user()
);
-- Client-portal users: only client-facing kinds for their own client.
create policy ai_client_read on ai_insights for select using (
  client_id = auth_client_id() and kind in ('analytics_summary', 'client_report')
);

-- Latest insight of each kind per client (handy for the app).
create or replace view ai_latest as
  select distinct on (client_id, kind) *
  from ai_insights order by client_id, kind, created_at desc;
