-- Orvio AI interactive persistence.
-- Stores agency-side conversations, messages, and task suggestions.
-- Client-portal users have no policies on these tables.

-- ---------- conversations ----------
create table orvio_ai_conversations (
  id         uuid primary key default gen_random_uuid(),
  agency_id  uuid not null references agencies (id) on delete cascade,
  user_id    uuid not null references profiles (id) on delete cascade,
  client_id  uuid references clients (id) on delete set null,
  title      text,
  mode       text not null default 'general'
    constraint orvio_ai_conversations_mode_check check (
      mode in (
        'general',
        'campaign_ideas',
        'lead_followup',
        'creative_prompt',
        'competitor_summary',
        'report_summary',
        'task_recommendations'
      )
    ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- messages ----------
create table orvio_ai_messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references orvio_ai_conversations (id) on delete cascade,
  agency_id       uuid not null references agencies (id) on delete cascade,
  user_id         uuid not null references profiles (id) on delete cascade,
  client_id       uuid references clients (id) on delete set null,
  role            text not null
    constraint orvio_ai_messages_role_check check (role in ('user', 'assistant', 'system')),
  content         text not null,
  model           text,
  provider        text,
  latency_ms      integer
    constraint orvio_ai_messages_latency_check check (latency_ms is null or latency_ms >= 0),
  metadata        jsonb,
  created_at      timestamptz not null default now()
);

-- ---------- task suggestions ----------
create table orvio_ai_task_suggestions (
  id                     uuid primary key default gen_random_uuid(),
  agency_id              uuid not null references agencies (id) on delete cascade,
  user_id                uuid not null references profiles (id) on delete cascade,
  client_id              uuid references clients (id) on delete set null,
  source_conversation_id uuid references orvio_ai_conversations (id) on delete set null,
  title                  text not null,
  description            text,
  priority               text
    constraint orvio_ai_task_suggestions_priority_check check (
      priority is null or priority in ('low', 'medium', 'high', 'urgent')
    ),
  status                 text not null default 'suggested'
    constraint orvio_ai_task_suggestions_status_check check (
      status in ('suggested', 'accepted', 'dismissed', 'completed')
    ),
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- ---------- indexes ----------
create index idx_orvio_ai_conversations_agency
  on orvio_ai_conversations (agency_id);
create index idx_orvio_ai_conversations_user
  on orvio_ai_conversations (user_id);
create index idx_orvio_ai_conversations_client
  on orvio_ai_conversations (client_id);
create index idx_orvio_ai_conversations_created
  on orvio_ai_conversations (created_at desc);

create index idx_orvio_ai_messages_conversation
  on orvio_ai_messages (conversation_id);
create index idx_orvio_ai_messages_agency
  on orvio_ai_messages (agency_id);
create index idx_orvio_ai_messages_client
  on orvio_ai_messages (client_id);
create index idx_orvio_ai_messages_created
  on orvio_ai_messages (created_at asc);

create index idx_orvio_ai_task_suggestions_agency
  on orvio_ai_task_suggestions (agency_id);
create index idx_orvio_ai_task_suggestions_client
  on orvio_ai_task_suggestions (client_id);
create index idx_orvio_ai_task_suggestions_conversation
  on orvio_ai_task_suggestions (source_conversation_id);
create index idx_orvio_ai_task_suggestions_status
  on orvio_ai_task_suggestions (status);
create index idx_orvio_ai_task_suggestions_created
  on orvio_ai_task_suggestions (created_at desc);

-- ---------- relational tenant validation ----------
-- RLS validates the caller's agency. This trigger additionally prevents rows
-- from linking an agency to a profile, client, or conversation from another
-- tenant, even if a caller submits inconsistent foreign keys.
create or replace function validate_orvio_ai_tenant_links()
returns trigger
language plpgsql security definer set search_path = public as $$
declare
  conversation_agency uuid;
begin
  if not exists (
    select 1 from profiles p
    where p.id = new.user_id and p.agency_id = new.agency_id
  ) then
    raise exception 'invalid Orvio AI tenant relationship';
  end if;

  if new.client_id is not null and not exists (
    select 1 from clients c
    where c.id = new.client_id and c.agency_id = new.agency_id
  ) then
    raise exception 'invalid Orvio AI tenant relationship';
  end if;

  if tg_table_name = 'orvio_ai_messages' then
    select c.agency_id
      into conversation_agency
      from orvio_ai_conversations c
      where c.id = new.conversation_id;

    if conversation_agency is null
       or conversation_agency <> new.agency_id then
      raise exception 'invalid Orvio AI tenant relationship';
    end if;
  end if;

  if tg_table_name = 'orvio_ai_task_suggestions'
     and new.source_conversation_id is not null
     and not exists (
       select 1 from orvio_ai_conversations c
       where c.id = new.source_conversation_id
         and c.agency_id = new.agency_id
     ) then
    raise exception 'invalid Orvio AI tenant relationship';
  end if;

  return new;
end;
$$;

create trigger validate_orvio_ai_conversation_tenant
  before insert or update on orvio_ai_conversations
  for each row execute function validate_orvio_ai_tenant_links();

create trigger validate_orvio_ai_message_tenant
  before insert or update on orvio_ai_messages
  for each row execute function validate_orvio_ai_tenant_links();

create trigger validate_orvio_ai_task_suggestion_tenant
  before insert or update on orvio_ai_task_suggestions
  for each row execute function validate_orvio_ai_tenant_links();

-- ---------- updated_at ----------
create or replace function set_updated_at()
returns trigger
language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_orvio_ai_conversations_updated_at
  before update on orvio_ai_conversations
  for each row execute function set_updated_at();

create trigger set_orvio_ai_task_suggestions_updated_at
  before update on orvio_ai_task_suggestions
  for each row execute function set_updated_at();

-- ---------- row level security ----------
alter table orvio_ai_conversations    enable row level security;
alter table orvio_ai_messages         enable row level security;
alter table orvio_ai_task_suggestions enable row level security;

-- Agency owners and members may manage AI records belonging to their agency.
-- Client users fail is_agency_user() and therefore receive no access.
create policy orvio_ai_conversations_agency_all on orvio_ai_conversations
  for all
  using (agency_id = auth_agency_id() and is_agency_user())
  with check (agency_id = auth_agency_id() and is_agency_user());

create policy orvio_ai_messages_agency_all on orvio_ai_messages
  for all
  using (agency_id = auth_agency_id() and is_agency_user())
  with check (agency_id = auth_agency_id() and is_agency_user());

create policy orvio_ai_task_suggestions_agency_all on orvio_ai_task_suggestions
  for all
  using (agency_id = auth_agency_id() and is_agency_user())
  with check (agency_id = auth_agency_id() and is_agency_user());
