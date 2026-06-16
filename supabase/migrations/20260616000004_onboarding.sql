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
