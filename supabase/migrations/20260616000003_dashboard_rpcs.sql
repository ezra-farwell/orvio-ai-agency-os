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
