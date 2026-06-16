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
