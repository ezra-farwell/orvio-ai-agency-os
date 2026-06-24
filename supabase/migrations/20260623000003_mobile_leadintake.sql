-- Mobile app backbone: real lead intake, speed-to-lead, and push device tokens.

-- Per-client public intake token. A contractor's web form / funnel posts to the
-- lead-intake Edge Function with ?token=<this>; the function maps it to the client.
alter table clients add column if not exists intake_token text unique
  default encode(gen_random_bytes(16), 'hex');

-- Backfill any existing clients that predate the column.
update clients set intake_token = encode(gen_random_bytes(16), 'hex') where intake_token is null;

-- Enrich leads for real intake + the speed-to-lead metric.
alter table leads add column if not exists job_type text;
alter table leads add column if not exists budget text;
alter table leads add column if not exists timeline text;
alter table leads add column if not exists first_contacted_at timestamptz;

-- Speed-to-lead: stamp first_contacted_at the moment a lead leaves 'New'.
create or replace function stamp_first_contact()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.first_contacted_at is null and old.status = 'New' and new.status <> 'New' then
    new.first_contacted_at = now();
  end if;
  return new;
end;
$$;

drop trigger if exists trg_leads_first_contact on leads;
create trigger trg_leads_first_contact
  before update on leads
  for each row execute function stamp_first_contact();

-- One row per device per user, for push (FCM / APNs via Capacitor, or web push).
create table if not exists device_tokens (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  token      text not null unique,
  platform   text not null check (platform in ('ios', 'android', 'web')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_device_tokens_user on device_tokens (user_id);

alter table device_tokens enable row level security;
create policy device_tokens_self_all on device_tokens
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
