# Orvio — Data Contract (Supabase backend)

This is the bridge between the **dashboard UI** (built in Lovable, inspired by Resend's
clean dark dashboard) and the **Supabase backend**. Both sides target the shapes below so
wiring is a clean swap from mock → live, not a rewrite.

- **UI side:** build against the TypeScript shapes in `src/mock/data.ts`. Do not invent new
  field names; if the UI needs a field that isn't here, add it here first.
- **Backend side:** every table below returns rows that map 1:1 to those shapes (snake_case
  in Postgres → camelCase in the app via the data layer).

---

## 1. The Resend-inspired dashboard shapes

Resend's signature is a **status word as the headline** ("Good / Good / Poor") with small
metrics beneath, restrained color (one status dot per row), and one hero number + area chart.
Orvio's equivalent shapes (defined in `src/mock/data.ts`):

```ts
type MetricTone = "good" | "watch" | "risk" | "neutral";

type MetricRow = {
  label: string;        // "New leads", "At risk"
  value: number;        // raw number — UI formats it
  format?: "count" | "usd" | "pct";
  pct?: number;         // optional secondary % shown muted to the right
  tone?: MetricTone;    // the row's status dot color
};

type MetricGroup = {
  key: string;          // "lead-flow"
  label: string;        // eyebrow: "LEAD FLOW"
  statusWord: string;   // the big headline: "Strong" | "Good" | "At risk"
  statusTone: MetricTone;
  rows: MetricRow[];    // 2 rows, like Resend's Sent/Delivered
};

type DashboardSummary = {
  heroLabel: string;    // "Leads this month"
  heroValue: number;    // 282
  trend: { d: string; value: number }[];  // area chart series
  groups: MetricGroup[]; // 3 status cards
};
```

**Agency dashboard** (`/app`) uses three groups: `lead-flow`, `client-health`,
`spend-efficiency`. **Client portal** (`/portal`) uses a client-scoped summary with the
same shape. Backend computes these as **Postgres views or RPCs** (they are aggregates, not
stored rows) — see §3.

---

## 2. Tables (map 1:1 to the existing mock types)

Enums shown as Postgres `enum`; timestamps are `timestamptz`. Relative-time strings in the
mock (`submitted: "2h ago"`) become real `created_at` columns — the UI formats the delta.

| Mock type / export        | Supabase table     | Notes |
| ------------------------- | ------------------ | ----- |
| `Agency`                  | `agencies`         | `owner_id → auth.users`. `plan`, `status`, `meta/google/stripe` status enums. |
| `Client`                  | `clients`          | `agency_id → agencies.id`. `status` = active/onboarding/at-risk. `meta`/`google` connection enums. `monthly_spend numeric`. |
| `Campaign`                | `campaigns`        | `client_id → clients.id`. metric columns numeric. `period` (e.g. `2026-04`). |
| `Lead`                    | `leads`            | `client_id`, `campaign_id` FKs. `submitted` string → `created_at timestamptz`. |
| `ContentAsset`            | `content_assets`   | `client_id` FK. `updated` string → `updated_at`. `platform` nullable. |
| `currentAgency`/`currentClient` | — (derived) | Resolved from the signed-in user's membership, not a table. |

### Auth & tenancy (RLS is mandatory)
- `auth.users` (Supabase) → `profiles` (id, role: `agency_owner` | `agency_member` | `client`, `agency_id`, `client_id`).
- **Agency users** see only rows where `agency_id` = their agency (RLS policy on every table).
- **Client-portal users** see only rows where `client_id` = their client.
- White-label is data-driven: `agencies.brand_color`, `agencies.domain`, `agencies.name`
  drive the portal chrome (no per-tenant code).

---

## 3. Dashboard aggregates (views / RPCs, not tables)

The `DashboardSummary` / `MetricGroup` shapes are computed server-side so the UI never does
the math:

- `rpc_agency_dashboard(agency_id)` → `DashboardSummary` for `/app`.
- `rpc_client_dashboard(client_id)` → `DashboardSummary` for `/portal`.
- `trend` series come from a `metric_snapshots` rollup (daily/weekly spend + leads per scope),
  so the area chart and hero number stay consistent.

Status-word thresholds (tune later, but fix them now so UI + backend agree):
- **lead-flow:** Strong ≥ 200 leads/mo · Steady 80–199 · Slow < 80.
- **client-health:** Good if 0 at-risk · Watch if 1 · At risk if ≥ 2 (or any churn signal).
- **spend-efficiency:** Good if avg CPL ≤ $90 · Fair $90–130 · High > $130.

---

## 4. Build order (parallel-safe)

1. **Now:** this contract + the shapes/sample data in `src/mock/data.ts` (done).
2. **Lovable:** rebuild `/app`, `/portal`, `/admin` dashboards against these shapes, dark
   Resend-inspired aesthetic. Keep importing from `src/mock/data.ts`.
3. **Me (backend):** Supabase schema + enums + RLS + the two dashboard RPCs + a thin data
   layer (`src/lib/data/*`) exposing the same function signatures the mock provides, so the
   swap is one import change per route.
4. **Wire:** flip routes from mock imports to the live data layer; verify shapes match.

> Coordination: Lovable provisions the Supabase project (it's Lovable-native). Backend work
> needs the project URL + anon/service keys before migrations can run. Until then, schema +
> migrations + RLS policies are authored against this contract and applied once the project exists.
