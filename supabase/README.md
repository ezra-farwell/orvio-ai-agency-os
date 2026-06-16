# Orvio Supabase backend

Schema, RLS, dashboard RPCs, and seed for Orvio. Authored against the data contract
in `docs/BACKEND_CONTRACT.md` and the app types in `src/mock/data.ts`.

## What's here

- `migrations/20260616000001_schema.sql` — enums, tables (agencies, profiles, clients,
  campaigns, leads, content_assets), foreign keys, indexes.
- `migrations/20260616000002_rls.sql` — Row Level Security: agency users see only their
  agency; client-portal users see only their client. Auto-provisions a profile on signup.
- `migrations/20260616000003_dashboard_rpcs.sql` — `rpc_agency_dashboard()` and
  `rpc_client_dashboard(client_id)` returning the `MetricGroup[]` JSON the UI consumes.
- `migrations/20260616000004_onboarding.sql` — `client_invites` + `rpc_create_agency`
  (agency-owner signup), `rpc_invite_client` / `rpc_accept_invite` (home-service owner).
- `migrations/20260616000005_integrations.sql` — `oauth_connections`, `ad_accounts`,
  `metric_snapshots`, token-free `connection_status_view`, and `rpc_rollup_client`.
- `functions/` — Edge Functions: `meta-oauth`, `google-oauth` (OAuth + token storage),
  `sync-insights` (pull spend/leads → snapshots → client rollups). Secrets live here.
- `seed.sql` — the current mock dataset as real rows (7 agencies + Northstar's 6 clients,
  campaigns, leads, assets).

## Apply it (once you create the project)

1. Create a project at supabase.com. Copy the Project URL + anon key into `.env`
   (see `.env.example`).
2. Link and push:
   ```bash
   npx supabase login
   npx supabase link --project-ref <your-ref>
   npx supabase db push          # runs the migrations
   # seed: paste seed.sql into the SQL editor, or:
   npx supabase db reset --linked   # ⚠ wipes + re-migrates + seeds (dev only)
   ```
3. Regenerate exact types (replaces the hand-authored ones):
   ```bash
   npx supabase gen types typescript --project-id <ref> > src/lib/supabase/types.ts
   ```

## Wiring the frontend

The data layer (`src/lib/data/index.ts`) already returns the app's existing types and
**falls back to mock data when env vars are absent**. To go live on a route, swap the
import from `@/mock/data` to `@/lib/data` and consume the async functions via react-query.
No env keys = app keeps running on mock; keys present = live data, automatically.

## Auth / tenancy notes

- A signed-up user gets a bare `profiles` row; assign `role` + `agency_id` (or `client_id`)
  during onboarding.
- All cross-tenant isolation is enforced by RLS in the database, not the client — safe
  even if the frontend is wrong.

## Onboarding flows (client helpers in `src/lib/auth` + `src/lib/data/onboarding.ts`)

- **Agency owner:** sign up → `createAgency({ name, domain, brandColor })` → becomes
  `agency_owner` of a new agency.
- **Home-service business owner:** agency calls `inviteClient(clientId, email)` → sends
  `inviteLink(token)` → owner signs in → `acceptInvite(token)` links them to that client
  (role `client`, scoped by RLS to their one portal).

## Integrations (Meta + Google) — `src/lib/integrations`

1. Create the provider apps and set secrets:
   ```bash
   supabase secrets set META_APP_ID=... META_APP_SECRET=... \
     GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=... GOOGLE_ADS_DEVELOPER_TOKEN=... \
     APP_URL=https://app.orvio.com
   ```
2. Deploy the functions:
   ```bash
   supabase functions deploy meta-oauth google-oauth sync-insights
   ```
3. Add each function's URL as an authorized OAuth **redirect URI** in the Meta app and
   Google Cloud console:
   `https://<ref>.functions.supabase.co/meta-oauth` and `.../google-oauth`.
4. In the app: `startConnect("meta")` / `startConnect("google")` opens consent; on return
   the token is stored. Map ad accounts to clients with `mapAdAccount(...)`, then pull
   metrics with `syncInsights(clientId?)` (or schedule it via Supabase cron).

> Production note: Meta Marketing API and Google Ads API require app review + (for Google)
> a developer token before they return live data. The OAuth + storage flow works as soon as
> the apps exist in dev mode; `sync-insights` returns Meta metrics immediately and Google
> metrics once the developer token is approved.
