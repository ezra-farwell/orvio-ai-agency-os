-- Client content approvals. Clients review the agency's creative in their portal
-- and either approve it or request changes. We extend content_assets with a note +
-- timestamp, and gate the write behind a SECURITY DEFINER RPC so a portal user can
-- only review their OWN assets (and only touch status/note — not arbitrary columns).

alter table content_assets add column if not exists approval_note text;
alter table content_assets add column if not exists reviewed_at  timestamptz;

-- Portal user reviews one of their assets. p_approve=true -> Approved; otherwise the
-- asset stays in review with the change note attached for the agency to action.
create or replace function rpc_client_review_asset(
  p_asset_id uuid,
  p_approve  boolean,
  p_note     text default null
)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if not exists (
    select 1 from content_assets where id = p_asset_id and client_id = auth_client_id()
  ) then
    raise exception 'asset not found for this client';
  end if;

  if p_approve then
    update content_assets
      set status = 'Approved', approval_note = null, reviewed_at = now()
      where id = p_asset_id;
  else
    update content_assets
      set approval_note = coalesce(nullif(trim(p_note), ''), 'Changes requested'),
          reviewed_at = now()
      where id = p_asset_id;
  end if;
end;
$$;

grant execute on function rpc_client_review_asset(uuid, boolean, text) to authenticated;
