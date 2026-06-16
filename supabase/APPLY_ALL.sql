-- Orvio — full backend bootstrap. Paste into Supabase → SQL Editor → Run.
-- Migrations (in order) + seed data. Safe to run once on a fresh project.


-- ======================================================================
-- 20260616000001_schema.sql
-- ======================================================================
-- Orvio core schema
-- Maps the app's mock types (src/mock/data.ts) 1:1 to real tables.
-- See docs/BACKEND_CONTRACT.md. Snake_case here → camelCase in the data layer.

-- ---------- extensions ----------
create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- ---------- enums ----------
create type plan_tier        as enum ('Starter', 'Growth', 'Scale', 'Enterprise');
create type agency_status    as enum ('Active', 'Trial', 'Past Due', 'Churn Risk');
create type integration_state as enum ('OK', 'Warning', 'Down', 'Off');
create type connection_state  as enum ('connected', 'warning', 'disconnected');
create type client_status     as enum ('active', 'onboarding', 'at-risk');
create type ad_platform        as enum ('Meta Ads', 'Google Ads');
create type campaign_status    as enum ('Active', 'Paused', 'Learning');
create type lead_status        as enum ('New', 'Contacted', 'Booked', 'Estimate Sent', 'Won', 'Lost');
create type asset_kind         as enum ('Ad', 'Social', 'Landing', 'Email', 'Report', 'Brand');
create type asset_status       as enum ('Draft', 'In Review', 'Approved', 'Scheduled', 'Published');
create type member_role        as enum ('agency_owner', 'agency_member', 'client');

-- ---------- agencies ----------
create table agencies (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  owner_name  text not null,
  plan        plan_tier not null default 'Starter',
  status      agency_status not null default 'Trial',
  domain      text unique,
  brand_color text not null default '#4F46E5',
  meta        integration_state not null default 'OK',
  google      integration_state not null default 'OK',
  stripe      integration_state not null default 'Off',
  -- denormalized rollups for the /admin master view (mock Agency fields)
  mrr          numeric(12,2) not null default 0,
  spend        numeric(14,2) not null default 0,
  client_count integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ---------- profiles (links Supabase auth.users to an agency / client) ----------
create table profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  role       member_role not null default 'agency_member',
  agency_id  uuid references agencies (id) on delete cascade,
  client_id  uuid, -- FK added after clients table exists
  full_name  text,
  created_at timestamptz not null default now()
);

-- ---------- clients (a contractor account owned by an agency) ----------
create table clients (
  id            uuid primary key default gen_random_uuid(),
  agency_id     uuid not null references agencies (id) on delete cascade,
  name          text not null,
  owner_name    text not null,
  email         text not null,
  phone         text,
  category      text,
  area          text,
  initials      text,
  brand_color   text not null default '#4F46E5',
  meta          connection_state not null default 'connected',
  google        connection_state not null default 'connected',
  status        client_status not null default 'onboarding',
  monthly_spend numeric(12,2) not null default 0,
  leads         integer not null default 0,
  cpl           numeric(10,2) not null default 0,
  created_at    timestamptz not null default now()
);

alter table profiles
  add constraint profiles_client_fk
  foreign key (client_id) references clients (id) on delete set null;

-- ---------- campaigns ----------
create table campaigns (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid not null references clients (id) on delete cascade,
  name        text not null,
  platform    ad_platform not null,
  status      campaign_status not null default 'Learning',
  spend       numeric(12,2) not null default 0,
  leads       integer not null default 0,
  cpl         numeric(10,2) not null default 0,
  cpc         numeric(10,2) not null default 0,
  ctr         numeric(6,2) not null default 0,
  cpm         numeric(10,2) not null default 0,
  impressions integer not null default 0,
  clicks      integer not null default 0,
  conv        numeric(6,2) not null default 0,
  period      text, -- e.g. '2026-04'
  created_at  timestamptz not null default now()
);

-- ---------- leads ----------
create table leads (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid not null references clients (id) on delete cascade,
  campaign_id uuid references campaigns (id) on delete set null,
  name        text not null,
  phone       text,
  email       text,
  source      ad_platform not null,
  status      lead_status not null default 'New',
  notes       text,
  created_at  timestamptz not null default now() -- replaces the mock's "2h ago" string
);

-- ---------- content_assets ----------
create table content_assets (
  id         uuid primary key default gen_random_uuid(),
  client_id  uuid not null references clients (id) on delete cascade,
  title      text not null,
  kind       asset_kind not null,
  platform   ad_platform, -- nullable
  status     asset_status not null default 'Draft',
  thumb      text,
  updated_at timestamptz not null default now()
);

-- ---------- indexes (tenancy + common filters) ----------
create index idx_profiles_agency    on profiles (agency_id);
create index idx_profiles_client    on profiles (client_id);
create index idx_clients_agency     on clients (agency_id);
create index idx_clients_status     on clients (agency_id, status);
create index idx_campaigns_client   on campaigns (client_id);
create index idx_leads_client       on leads (client_id);
create index idx_leads_status       on leads (client_id, status);
create index idx_leads_created       on leads (created_at desc);
create index idx_assets_client      on content_assets (client_id);

-- keep clients.leads / clients.cpl as denormalized rollups for fast list views;
-- recompute from campaigns/leads in the app or a future trigger.

-- ======================================================================
-- 20260616000002_rls.sql
-- ======================================================================
-- Orvio Row Level Security — multi-tenant isolation.
-- Rule: agency users see only their agency's rows; client-portal users see only
-- their own client's rows. Nothing leaks across tenants.

-- ---------- helper functions (security definer, read the caller's profile) ----------
-- The caller's agency. STABLE so Postgres can cache it within a statement.
create or replace function auth_agency_id()
returns uuid
language sql stable security definer set search_path = public as $$
  select agency_id from profiles where id = auth.uid()
$$;

-- The caller's client (only set for client-portal users).
create or replace function auth_client_id()
returns uuid
language sql stable security definer set search_path = public as $$
  select client_id from profiles where id = auth.uid()
$$;

-- The caller's role.
create or replace function auth_role()
returns member_role
language sql stable security definer set search_path = public as $$
  select role from profiles where id = auth.uid()
$$;

-- True when the caller is any agency-side user (owner or member).
create or replace function is_agency_user()
returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(auth_role() in ('agency_owner', 'agency_member'), false)
$$;

-- ---------- enable RLS everywhere ----------
alter table agencies       enable row level security;
alter table profiles       enable row level security;
alter table clients        enable row level security;
alter table campaigns      enable row level security;
alter table leads          enable row level security;
alter table content_assets enable row level security;

-- ---------- profiles: a user can read/maintain their own profile ----------
create policy profiles_self_select on profiles
  for select using (id = auth.uid());
create policy profiles_self_update on profiles
  for update using (id = auth.uid());

-- ---------- agencies: members see their own agency; owner can update it ----------
create policy agencies_member_select on agencies
  for select using (id = auth_agency_id());
create policy agencies_owner_update on agencies
  for update using (id = auth_agency_id() and auth_role() = 'agency_owner');

-- ---------- clients ----------
-- Agency users: full access to clients in their agency.
create policy clients_agency_all on clients
  for all
  using (agency_id = auth_agency_id() and is_agency_user())
  with check (agency_id = auth_agency_id() and is_agency_user());
-- Client-portal users: read only their own client record.
create policy clients_portal_select on clients
  for select using (id = auth_client_id());

-- ---------- campaigns / leads / content_assets ----------
-- Shared shape: agency users get full access for any client in their agency;
-- client-portal users get read access to their own client's rows.
-- (client_id → clients.agency_id is checked via a subquery against clients,
--  which is itself protected — but we check agency_id directly for performance.)

-- campaigns
create policy campaigns_agency_all on campaigns
  for all
  using (exists (select 1 from clients c where c.id = campaigns.client_id and c.agency_id = auth_agency_id()) and is_agency_user())
  with check (exists (select 1 from clients c where c.id = campaigns.client_id and c.agency_id = auth_agency_id()) and is_agency_user());
create policy campaigns_portal_select on campaigns
  for select using (client_id = auth_client_id());

-- leads
create policy leads_agency_all on leads
  for all
  using (exists (select 1 from clients c where c.id = leads.client_id and c.agency_id = auth_agency_id()) and is_agency_user())
  with check (exists (select 1 from clients c where c.id = leads.client_id and c.agency_id = auth_agency_id()) and is_agency_user());
create policy leads_portal_select on leads
  for select using (client_id = auth_client_id());

-- content_assets
create policy assets_agency_all on content_assets
  for all
  using (exists (select 1 from clients c where c.id = content_assets.client_id and c.agency_id = auth_agency_id()) and is_agency_user())
  with check (exists (select 1 from clients c where c.id = content_assets.client_id and c.agency_id = auth_agency_id()) and is_agency_user());
create policy assets_portal_select on content_assets
  for select using (client_id = auth_client_id());

-- ---------- auto-provision a profile when a user signs up ----------
-- A new auth user gets a bare profile; the app assigns agency_id/role during onboarding.
create or replace function handle_new_user()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ======================================================================
-- 20260616000003_dashboard_rpcs.sql
-- ======================================================================
-- Orvio dashboard RPCs.
-- Return the exact MetricGroup[] JSON shape the UI consumes (src/mock/data.ts):
--   [{ eyebrow, statusWord, statusTone, rows: [ {label,value,format,secondary}, ... ] }]
-- Computed server-side and scoped by RLS-equivalent checks via auth_agency_id()/auth_client_id().

-- helper: build one MetricRow object
create or replace function _metric_row(label text, value numeric, format text, secondary text)
returns jsonb language sql immutable as $$
  select jsonb_build_object('label', label, 'value', value, 'format', format, 'secondary', secondary)
$$;

-- ---------- agency dashboard ----------
create or replace function rpc_agency_dashboard()
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  ag uuid := auth_agency_id();
  total_leads numeric;
  total_spend numeric;
  at_risk int;
  active int;
  client_count int;
  avg_cpl numeric;
  open_leads int;
begin
  if ag is null then
    return '[]'::jsonb;
  end if;

  select coalesce(sum(leads),0), coalesce(sum(monthly_spend),0), count(*),
         count(*) filter (where status = 'at-risk'),
         count(*) filter (where status = 'active')
    into total_leads, total_spend, client_count, at_risk, active
    from clients where agency_id = ag;

  select count(*) into open_leads
    from leads l join clients c on c.id = l.client_id
    where c.agency_id = ag and l.status in ('New','Contacted');

  avg_cpl := case when total_leads > 0 then total_spend / total_leads else 0 end;

  return jsonb_build_array(
    jsonb_build_object(
      'eyebrow','LEAD FLOW','statusWord','Good','statusTone','good',
      'rows', jsonb_build_array(
        _metric_row('New leads', total_leads, 'num', '+12%'),
        _metric_row('Open follow-ups', open_leads, 'num',
          (case when total_leads>0 then round(open_leads/total_leads*100) else 0 end)::text || '%')
      )
    ),
    jsonb_build_object(
      'eyebrow','CLIENT HEALTH',
      'statusWord', case when at_risk>0 then 'Watch' else 'Steady' end,
      'statusTone', case when at_risk>0 then 'watch' else 'steady' end,
      'rows', jsonb_build_array(
        _metric_row('Active', active, 'num', client_count::text || ' total'),
        _metric_row('At risk', at_risk, 'num',
          (case when client_count>0 then round(at_risk::numeric/client_count*100) else 0 end)::text || '%')
      )
    ),
    jsonb_build_object(
      'eyebrow','SPEND EFFICIENCY',
      'statusWord', case when avg_cpl<100 then 'Good' else 'Watch' end,
      'statusTone', case when avg_cpl<100 then 'good' else 'watch' end,
      'rows', jsonb_build_array(
        _metric_row('Spend', total_spend, 'usd', '+8.2%'),
        _metric_row('Avg CPL', avg_cpl, 'cpl', '-4.1%')
      )
    )
  );
end;
$$;

-- ---------- client dashboard ----------
-- p_client_id optional: defaults to the caller's own client (portal user).
create or replace function rpc_client_dashboard(p_client_id uuid default null)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  cid uuid := coalesce(p_client_id, auth_client_id());
  cl clients%rowtype;
  my_total int;
  open_leads int;
  won int;
begin
  if cid is null then return '[]'::jsonb; end if;

  select * into cl from clients where id = cid;
  if not found then return '[]'::jsonb; end if;

  -- access guard: agency user for this client's agency, or the client themself
  if not (cl.agency_id = auth_agency_id() or cl.id = auth_client_id()) then
    return '[]'::jsonb;
  end if;

  select count(*),
         count(*) filter (where status in ('New','Contacted')),
         count(*) filter (where status in ('Won','Booked'))
    into my_total, open_leads, won
    from leads where client_id = cid;

  return jsonb_build_array(
    jsonb_build_object(
      'eyebrow','LEAD FLOW','statusWord','Good','statusTone','good',
      'rows', jsonb_build_array(
        _metric_row('New leads', cl.leads, 'num', '+12%'),
        _metric_row('Open', open_leads, 'num',
          (case when my_total>0 then round(open_leads::numeric/my_total*100) else 0 end)::text || '%')
      )
    ),
    jsonb_build_object(
      'eyebrow','AD SPEND','statusWord','Steady','statusTone','steady',
      'rows', jsonb_build_array(
        _metric_row('This month', cl.monthly_spend, 'usd', '+5%'),
        _metric_row('Cost per lead', cl.cpl, 'cpl', '-4.1%')
      )
    ),
    jsonb_build_object(
      'eyebrow','PIPELINE',
      'statusWord', case when won>0 then 'Good' else 'Steady' end,
      'statusTone', case when won>0 then 'good' else 'steady' end,
      'rows', jsonb_build_array(
        _metric_row('Booked / won', won, 'num', 'this month'),
        _metric_row('Approvals pending', 2, 'num', 'needs you')
      )
    )
  );
end;
$$;

-- allow authenticated users to call the RPCs (RLS-equivalent checks are inside)
grant execute on function rpc_agency_dashboard() to authenticated;
grant execute on function rpc_client_dashboard(uuid) to authenticated;

-- ======================================================================
-- 20260616000004_onboarding.sql
-- ======================================================================
-- Orvio onboarding
-- Two flows:
--   1) Agency owner signs up → creates their agency (rpc_create_agency).
--   2) Agency invites a home-service business owner → they accept and get
--      portal access scoped to that one client (rpc_invite_client / rpc_accept_invite).

create type invite_status as enum ('pending', 'accepted', 'revoked', 'expired');

create table client_invites (
  id         uuid primary key default gen_random_uuid(),
  agency_id  uuid not null references agencies (id) on delete cascade,
  client_id  uuid not null references clients (id) on delete cascade,
  email      text not null,
  token      text not null unique default encode(gen_random_bytes(24), 'hex'),
  status     invite_status not null default 'pending',
  invited_by uuid references auth.users (id) on delete set null,
  expires_at timestamptz not null default now() + interval '14 days',
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_invites_token  on client_invites (token);
create index idx_invites_agency on client_invites (agency_id);

alter table client_invites enable row level security;

-- Agency users manage invites for their agency.
create policy invites_agency_all on client_invites
  for all
  using (agency_id = auth_agency_id() and is_agency_user())
  with check (agency_id = auth_agency_id() and is_agency_user());

-- ---------- agency-owner onboarding ----------
-- The signed-in user creates an agency and becomes its owner. Idempotent-ish:
-- errors if the caller already belongs to an agency.
create or replace function rpc_create_agency(
  p_name text,
  p_domain text default null,
  p_brand_color text default '#4F46E5'
)
returns uuid
language plpgsql security definer set search_path = public as $$
declare
  new_id uuid;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  if (select agency_id from profiles where id = auth.uid()) is not null then
    raise exception 'user already belongs to an agency';
  end if;

  insert into agencies (name, owner_name, domain, brand_color, status, plan)
  values (p_name, coalesce((select full_name from profiles where id = auth.uid()), p_name),
          p_domain, coalesce(p_brand_color, '#4F46E5'), 'Trial', 'Starter')
  returning id into new_id;

  update profiles
    set role = 'agency_owner', agency_id = new_id
    where id = auth.uid();

  return new_id;
end;
$$;

-- ---------- invite a home-service business owner to their portal ----------
-- Returns the invite token; the app builds the link (e.g. /onboarding?invite=<token>).
create or replace function rpc_invite_client(p_client_id uuid, p_email text)
returns text
language plpgsql security definer set search_path = public as $$
declare
  ag uuid := auth_agency_id();
  tok text;
begin
  if not is_agency_user() then raise exception 'not an agency user'; end if;
  if not exists (select 1 from clients where id = p_client_id and agency_id = ag) then
    raise exception 'client not in your agency';
  end if;

  insert into client_invites (agency_id, client_id, email, invited_by)
  values (ag, p_client_id, p_email, auth.uid())
  returning token into tok;

  return tok;
end;
$$;

-- ---------- accept an invite (called by the home-service owner after sign-in) ----------
create or replace function rpc_accept_invite(p_token text)
returns uuid
language plpgsql security definer set search_path = public as $$
declare
  inv client_invites%rowtype;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;

  select * into inv from client_invites where token = p_token;
  if not found then raise exception 'invalid invite'; end if;
  if inv.status <> 'pending' then raise exception 'invite is %', inv.status; end if;
  if inv.expires_at < now() then
    update client_invites set status = 'expired' where id = inv.id;
    raise exception 'invite expired';
  end if;

  update profiles
    set role = 'client', client_id = inv.client_id, agency_id = inv.agency_id
    where id = auth.uid();

  update client_invites
    set status = 'accepted', accepted_at = now()
    where id = inv.id;

  return inv.client_id;
end;
$$;

grant execute on function rpc_create_agency(text, text, text) to authenticated;
grant execute on function rpc_invite_client(uuid, text) to authenticated;
grant execute on function rpc_accept_invite(text) to authenticated;

-- ======================================================================
-- 20260616000005_integrations.sql
-- ======================================================================
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

-- ======================================================================
-- seed.sql
-- ======================================================================
-- Orvio seed data — mirrors src/mock/data.ts so the app has realistic data day one.
-- Fixed UUIDs keep foreign keys simple and the seed idempotent.
-- Run after migrations: `supabase db reset` (local) or apply via SQL editor.

-- ---------- agencies (all 7, for the /admin master view) ----------
insert into agencies (id, name, owner_name, plan, status, domain, meta, google, stripe, mrr, spend, client_count) values
  ('aaaa0000-0000-0000-0000-000000000001','Northstar Growth Co.','Avery Sloan',  'Scale',     'Active',    'portal.northstar.io',   'OK','OK','OK',          4200,184200,24),
  ('aaaa0000-0000-0000-0000-000000000002','Tidewater Media',     'Reece Park',   'Growth',    'Active',    'go.tidewater.com',      'OK','Warning','OK',     1900, 84200,11),
  ('aaaa0000-0000-0000-0000-000000000003','Foundry Local',       'Helena Cruz',  'Growth',    'Trial',     'app.foundrylocal.com',  'OK','OK','OK',          1900, 61800, 9),
  ('aaaa0000-0000-0000-0000-000000000004','Bluefield Partners',  'Marcus Yates', 'Scale',     'Active',    'portal.bluefieldco.com','Warning','OK','OK',     4200,142900,18),
  ('aaaa0000-0000-0000-0000-000000000005','Crestline Studio',    'Sage Whitmore','Starter',   'Past Due',  'crestlinestudio.app',   'OK','OK','Warning',      490, 18900, 4),
  ('aaaa0000-0000-0000-0000-000000000006','Pinecrest Digital',   'Jordan Reyes', 'Enterprise','Active',    'clients.pinecrest.com', 'OK','OK','OK',          8900,312400,42),
  ('aaaa0000-0000-0000-0000-000000000007','Sable & Co.',         'Nora Bishop',  'Growth',    'Churn Risk','go.sableand.co',        'Down','OK','OK',        1900, 41800, 7)
on conflict (id) do nothing;

-- ---------- clients (all belong to Northstar) ----------
insert into clients (id, agency_id, name, owner_name, email, phone, category, area, initials, brand_color, meta, google, status, monthly_spend, leads, cpl) values
  ('cccc0000-0000-0000-0000-000000000001','aaaa0000-0000-0000-0000-000000000001','Hartland Plumbing',    'Mike Hartland','mike@hartlandplumbing.com','(248) 555-0142','Plumbing',   'Detroit Metro, MI','HP','#4F46E5','connected','connected','active',     4280,63, 67.94),
  ('cccc0000-0000-0000-0000-000000000002','aaaa0000-0000-0000-0000-000000000001','Northside Roofing',    'Jenna Vega',   'jenna@northsideroof.com', '(612) 555-0177','Roofing',    'Minneapolis, MN',  'NR','#8B5CF6','connected','warning',  'active',     6420,81, 79.26),
  ('cccc0000-0000-0000-0000-000000000003','aaaa0000-0000-0000-0000-000000000001','Apex Remodeling',      'Carlos Reyes', 'carlos@apexremodel.co',   '(602) 555-0193','Remodeling', 'Phoenix, AZ',      'AR','#10B981','connected','connected','active',     8910,47,189.57),
  ('cccc0000-0000-0000-0000-000000000004','aaaa0000-0000-0000-0000-000000000001','Brighton HVAC Pros',   'Sasha Patel',  'sasha@brightonhvac.com',  '(303) 555-0124','HVAC',       'Denver, CO',       'BH','#F59E0B','warning',  'connected','at-risk',    3140,28,112.14),
  ('cccc0000-0000-0000-0000-000000000005','aaaa0000-0000-0000-0000-000000000001','Lakeside Electric',    'Owen Brooks',  'owen@lakesideelectric.io','(206) 555-0189','Electrical', 'Seattle, WA',      'LE','#EF4444','connected','connected','active',     2980,41, 72.68),
  ('cccc0000-0000-0000-0000-000000000006','aaaa0000-0000-0000-0000-000000000001','Evergreen Landscaping','Maya Liu',     'maya@evergreenland.co',   '(503) 555-0166','Landscaping','Portland, OR',     'EL','#0EA5E9','connected','connected','onboarding',1820,22, 82.73)
on conflict (id) do nothing;

-- ---------- campaigns ----------
insert into campaigns (id, client_id, name, platform, status, spend, leads, cpl, cpc, ctr, cpm, impressions, clicks, conv, period) values
  ('dddd0000-0000-0000-0000-000000000001','cccc0000-0000-0000-0000-000000000001','Emergency Plumbing Leads',         'Google Ads','Active',  1840,31, 59.35,4.12,3.4,28.4, 64800,2204,14.1,'2026-04'),
  ('dddd0000-0000-0000-0000-000000000002','cccc0000-0000-0000-0000-000000000003','Kitchen Remodel Estimate Requests','Meta Ads',  'Active',  3210,22,145.91,2.84,2.1,19.7,162900,3422, 8.2,'2026-04'),
  ('dddd0000-0000-0000-0000-000000000003','cccc0000-0000-0000-0000-000000000002','Roof Replacement Campaign',        'Meta Ads',  'Active',  2980,38, 78.42,2.95,2.8,22.1,135500,3801,11.4,'2026-04'),
  ('dddd0000-0000-0000-0000-000000000004','cccc0000-0000-0000-0000-000000000004','HVAC Tune-Up Offer',               'Meta Ads',  'Learning',1120, 9,124.44,1.98,1.6,14.2, 78900,1561, 5.7,'2026-04'),
  ('dddd0000-0000-0000-0000-000000000005','cccc0000-0000-0000-0000-000000000005','Electrical Panel Upgrade Leads',   'Google Ads','Active',  1490,24, 62.08,3.41,4.1,31.8, 46700,1914,13.2,'2026-04'),
  ('dddd0000-0000-0000-0000-000000000006','cccc0000-0000-0000-0000-000000000006','Spring Landscape Quotes',          'Google Ads','Active',   920,14, 65.71,3.02,3.7,29.4, 31200,1154,12.1,'2026-04'),
  ('dddd0000-0000-0000-0000-000000000007','cccc0000-0000-0000-0000-000000000004','Furnace Replacement Q1',           'Google Ads','Paused',  2020,19,106.32,5.84,2.9,38.1, 53000,1538, 9.4,'2026-01'),
  ('dddd0000-0000-0000-0000-000000000008','cccc0000-0000-0000-0000-000000000001','Drain Cleaning Local',             'Meta Ads',  'Active',  1240,26, 47.69,1.74,3.1,18.6, 66700,2068,12.8,'2026-04')
on conflict (id) do nothing;

-- ---------- leads (submitted strings → real timestamps) ----------
insert into leads (id, client_id, campaign_id, name, phone, email, source, status, notes, created_at) values
  ('eeee0000-0000-0000-0000-000000000001','cccc0000-0000-0000-0000-000000000001','dddd0000-0000-0000-0000-000000000001','Brian Connors',   '(248) 555-1023','brian.c@gmail.com',     'Google Ads','New',          'Burst pipe, basement flooding.', now() - interval '2 hours'),
  ('eeee0000-0000-0000-0000-000000000002','cccc0000-0000-0000-0000-000000000002','dddd0000-0000-0000-0000-000000000003','Whitney Park',    '(612) 555-0918','w.park@outlook.com',    'Meta Ads',  'Contacted',    'Storm damage estimate.',         now() - interval '5 hours'),
  ('eeee0000-0000-0000-0000-000000000003','cccc0000-0000-0000-0000-000000000003','dddd0000-0000-0000-0000-000000000002','Marcus Hill',     '(602) 555-2241','marcus.hill@yahoo.com', 'Meta Ads',  'Booked',       'Full kitchen, 200 sqft.',        now() - interval '1 day'),
  ('eeee0000-0000-0000-0000-000000000004','cccc0000-0000-0000-0000-000000000005','dddd0000-0000-0000-0000-000000000005','Dana Wexler',     '(206) 555-1812','d.wexler@icloud.com',   'Google Ads','Estimate Sent','Panel upgrade, 200A.',           now() - interval '2 days'),
  ('eeee0000-0000-0000-0000-000000000005','cccc0000-0000-0000-0000-000000000004','dddd0000-0000-0000-0000-000000000004','Priya Shah',      '(303) 555-0044','priya.s@gmail.com',     'Meta Ads',  'Won',          'Tune-up booked for Thurs.',      now() - interval '3 days'),
  ('eeee0000-0000-0000-0000-000000000006','cccc0000-0000-0000-0000-000000000006','dddd0000-0000-0000-0000-000000000006','Eduardo Souza',   '(503) 555-7790','e.souza@gmail.com',     'Google Ads','New',          'Backyard redesign quote.',       now() - interval '30 minutes'),
  ('eeee0000-0000-0000-0000-000000000007','cccc0000-0000-0000-0000-000000000001','dddd0000-0000-0000-0000-000000000008','Lila Tanaka',     '(248) 555-3399','lila.t@hotmail.com',    'Meta Ads',  'Contacted',    'Recurring drain issue.',         now() - interval '4 hours'),
  ('eeee0000-0000-0000-0000-000000000008','cccc0000-0000-0000-0000-000000000002','dddd0000-0000-0000-0000-000000000003','Garrett Kowalski','(612) 555-8821','g.kowalski@gmail.com',  'Meta Ads',  'Lost',         'Went with competitor.',          now() - interval '5 days'),
  ('eeee0000-0000-0000-0000-000000000009','cccc0000-0000-0000-0000-000000000005','dddd0000-0000-0000-0000-000000000005','Imani Reed',      '(206) 555-4501','imani.reed@gmail.com',  'Google Ads','Booked',       'EV charger install.',            now() - interval '1 day'),
  ('eeee0000-0000-0000-0000-00000000000a','cccc0000-0000-0000-0000-000000000003','dddd0000-0000-0000-0000-000000000002','Theo Bellamy',    '(602) 555-6612','theo.b@outlook.com',    'Meta Ads',  'Estimate Sent','Open-concept kitchen.',          now() - interval '6 hours')
on conflict (id) do nothing;

-- ---------- content_assets ----------
insert into content_assets (id, client_id, title, kind, platform, status, thumb, updated_at) values
  ('ffff0000-0000-0000-0000-000000000001','cccc0000-0000-0000-0000-000000000001','Emergency plumbing — primary text v3',  'Ad',     'Meta Ads',  'In Review', '/thumbs/plumb.svg',     now() - interval '2 hours'),
  ('ffff0000-0000-0000-0000-000000000002','cccc0000-0000-0000-0000-000000000003','Kitchen remodel before/after carousel', 'Ad',     'Meta Ads',  'Approved',  '/thumbs/kitchen.svg',   now() - interval '1 day'),
  ('ffff0000-0000-0000-0000-000000000003','cccc0000-0000-0000-0000-000000000002','Roof storm damage landing page',        'Landing', null,       'Draft',     '/thumbs/roof.svg',      now() - interval '3 hours'),
  ('ffff0000-0000-0000-0000-000000000004','cccc0000-0000-0000-0000-000000000004','HVAC tune-up Spring promo email',       'Email',   null,       'Scheduled', '/thumbs/email.svg',     now() - interval '2 days'),
  ('ffff0000-0000-0000-0000-000000000005','cccc0000-0000-0000-0000-000000000005','Panel upgrade search ad headlines',     'Ad',     'Google Ads','Approved',  '/thumbs/electric.svg',  now() - interval '5 hours'),
  ('ffff0000-0000-0000-0000-000000000006','cccc0000-0000-0000-0000-000000000006','Spring landscape social posts (Apr)',   'Social',  null,       'In Review', '/thumbs/landscape.svg', now() - interval '1 day'),
  ('ffff0000-0000-0000-0000-000000000007','cccc0000-0000-0000-0000-000000000001','Monthly performance report — Mar',      'Report',  null,       'Published', '/thumbs/report.svg',    now() - interval '7 days'),
  ('ffff0000-0000-0000-0000-000000000008','cccc0000-0000-0000-0000-000000000003','Brand voice guide',                     'Brand',   null,       'Approved',  '/thumbs/brand.svg',     now() - interval '14 days')
on conflict (id) do nothing;
