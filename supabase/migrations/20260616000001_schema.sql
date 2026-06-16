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
