create or replace function public.is_agency_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $function$
  select exists (
    select 1
    from profiles
    where id = auth.uid()
      and role in ('agency_owner', 'agency_member')
      and agency_id is not null
  );
$function$;

drop trigger if exists validate_orvio_ai_conversation_tenant on public.orvio_ai_conversations;
drop trigger if exists validate_orvio_ai_message_tenant on public.orvio_ai_messages;
