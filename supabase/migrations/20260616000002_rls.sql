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
