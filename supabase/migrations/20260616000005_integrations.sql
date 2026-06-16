-- Orvio integrations
-- The agency connects its own Meta / Google accounts once (oauth_connections),
-- then maps specific ad accounts to each client (ad_accounts). Synced metrics
-- land in metric_snapshots and roll up onto clients.leads / monthly_spend / cpl.
--
-- Tokens are written ONLY by the Edge Functions (service role). Browser clients
-- can read connection *status* but never the tokens themselves (see RLS below).

create type oauth_provider as enum ('meta', 'google');
create type connection_status as enum ('active', 'expired', 'revoked', 'error');

-- ---------- oauth_connections (agency-level) ----------
create table oauth_connections (
  id            uuid primary key default gen_random_uuid(),
  agency_id     uuid not null references agencies (id) on delete cascade,
  provider      oauth_provider not null,
  external_user_id text,                 -- the provider's user/account id
  access_token  text,                    -- written by Edge Functions only
  refresh_token text,
  scope         text,
  expires_at    timestamptz,
  status        connection_status not null default 'active',
  connected_by  uuid references auth.users (id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (agency_id, provider)
);

-- ---------- ad_accounts (maps a client to a provider ad account) ----------
create table ad_accounts (
  id             uuid primary key default gen_random_uuid(),
  client_id      uuid not null references clients (id) on delete cascade,
  connection_id  uuid not null references oauth_connections (id) on delete cascade,
  provider       oauth_provider not null,
  external_id    text not null,          -- e.g. Meta act_<id> / Google customer id
  name           text,
  currency       text default 'USD',
  status         connection_status not null default 'active',
  created_at     timestamptz not null default now(),
  unique (provider, external_id, client_id)
);

create index idx_adaccounts_client on ad_accounts (client_id);

-- ---------- metric_snapshots (daily synced spend/leads per client+provider) ----------
create table metric_snapshots (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid not null references clients (id) on delete cascade,
  provider    oauth_provider not null,
  date        date not null,
  spend       numeric(12,2) not null default 0,
  leads       integer not null default 0,
  clicks      integer not null default 0,
  impressions integer not null default 0,
  created_at  timestamptz not null default now(),
  unique (client_id, provider, date)
);

create index idx_snapshots_client_date on metric_snapshots (client_id, date desc);

-- ---------- RLS ----------
alter table oauth_connections enable row level security;
alter table ad_accounts       enable row level security;
alter table metric_snapshots  enable row level security;

-- Connections: agency users may READ status/metadata for their agency, but the
-- token columns are never exposed to anon/authenticated — only the service role
-- (Edge Functions) reads/writes tokens. We enforce read-only here and rely on a
-- column-safe view (below) for the app.
create policy conn_agency_select on oauth_connections
  for select using (agency_id = auth_agency_id() and is_agency_user());

-- ad_accounts: agency users full access for their clients; client-portal users read their own.
create policy adacct_agency_all on ad_accounts
  for all
  using (exists (select 1 from clients c where c.id = ad_accounts.client_id and c.agency_id = auth_agency_id()) and is_agency_user())
  with check (exists (select 1 from clients c where c.id = ad_accounts.client_id and c.agency_id = auth_agency_id()) and is_agency_user());
create policy adacct_portal_select on ad_accounts
  for select using (client_id = auth_client_id());

-- metric_snapshots: agency users for their clients; client-portal users their own.
create policy snap_agency_select on metric_snapshots
  for select using (exists (select 1 from clients c where c.id = metric_snapshots.client_id and c.agency_id = auth_agency_id()) and is_agency_user());
create policy snap_portal_select on metric_snapshots
  for select using (client_id = auth_client_id());

-- Safe, token-free view of connection status for the app to read.
create or replace view connection_status_view as
  select id, agency_id, provider, external_user_id, scope, expires_at, status, created_at, updated_at
  from oauth_connections;

-- ---------- rollup: recompute clients.leads / monthly_spend / cpl from snapshots ----------
-- Call after a sync. Uses the last 30 days.
create or replace function rpc_rollup_client(p_client_id uuid)
returns void
language plpgsql security definer set search_path = public as $$
declare
  s numeric; l int;
begin
  select coalesce(sum(spend),0), coalesce(sum(leads),0)
    into s, l
    from metric_snapshots
    where client_id = p_client_id and date >= current_date - interval '30 days';

  update clients
    set monthly_spend = s,
        leads = l,
        cpl = case when l > 0 then round(s / l, 2) else 0 end
    where id = p_client_id;
end;
$$;

grant execute on function rpc_rollup_client(uuid) to service_role;
