-- Orvio billing — invoices an agency sends to its clients, paid via the agency's
-- own connected Stripe account (Stripe Connect direct charges). The stripe-billing
-- Edge Function creates Checkout Sessions and flips status from Stripe webhooks.
--
-- Money flow: homeowner/contractor pays -> agency's connected Stripe account.
-- Orvio (the platform) never holds funds. Tokens/secrets stay in the Edge Function.

create type invoice_status as enum ('draft', 'open', 'paid', 'past_due', 'void', 'refunded');

-- Human-friendly invoice numbers (INV-2050, INV-2051, ...). Global for simplicity.
create sequence if not exists invoice_number_seq start 2050;

create table invoices (
  id                         uuid primary key default gen_random_uuid(),
  agency_id                  uuid not null references agencies (id) on delete cascade,
  client_id                  uuid not null references clients (id) on delete cascade,
  number                     text not null unique
                               default ('INV-' || lpad(nextval('invoice_number_seq')::text, 4, '0')),
  description                text,
  amount_cents               integer not null check (amount_cents >= 0),
  currency                   text not null default 'usd',
  status                     invoice_status not null default 'draft',
  due_date                   date,
  stripe_checkout_session_id text,
  stripe_payment_intent_id   text,
  hosted_invoice_url         text,
  paid_at                    timestamptz,
  created_at                 timestamptz not null default now(),
  updated_at                 timestamptz not null default now()
);

create index idx_invoices_agency  on invoices (agency_id, created_at desc);
create index idx_invoices_client  on invoices (client_id, created_at desc);
create index idx_invoices_session on invoices (stripe_checkout_session_id);

alter table invoices enable row level security;

-- Agency users: full access to their own agency's invoices.
create policy invoices_agency_all on invoices
  for all
  using (agency_id = auth_agency_id() and is_agency_user())
  with check (agency_id = auth_agency_id() and is_agency_user());

-- Client-portal users: read their own client's invoices (to view + pay).
-- They never write; status changes come only from the Edge Function (service role).
create policy invoices_portal_select on invoices
  for select using (client_id = auth_client_id());

-- updated_at maintenance
create or replace function set_invoices_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_invoices_updated_at
  before update on invoices
  for each row execute function set_invoices_updated_at();
