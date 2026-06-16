// Hand-authored DB types mirroring supabase/migrations.
// Once a Supabase project exists, regenerate with:
//   npx supabase gen types typescript --project-id <id> > src/lib/supabase/types.ts

export type PlanTier = "Starter" | "Growth" | "Scale" | "Enterprise";
export type AgencyStatus = "Active" | "Trial" | "Past Due" | "Churn Risk";
export type IntegrationState = "OK" | "Warning" | "Down" | "Off";
export type ConnectionState = "connected" | "warning" | "disconnected";
export type ClientStatus = "active" | "onboarding" | "at-risk";
export type AdPlatform = "Meta Ads" | "Google Ads";
export type CampaignStatus = "Active" | "Paused" | "Learning";
export type LeadStatus = "New" | "Contacted" | "Booked" | "Estimate Sent" | "Won" | "Lost";
export type AssetKind = "Ad" | "Social" | "Landing" | "Email" | "Report" | "Brand";
export type AssetStatus = "Draft" | "In Review" | "Approved" | "Scheduled" | "Published";
export type MemberRole = "agency_owner" | "agency_member" | "client";

// Row shapes (snake_case, as stored). The data layer maps these → the app's
// camelCase types in src/mock/data.ts.
export type AgencyRow = {
  id: string;
  name: string;
  owner_name: string;
  plan: PlanTier;
  status: AgencyStatus;
  domain: string | null;
  brand_color: string;
  meta: IntegrationState;
  google: IntegrationState;
  stripe: IntegrationState;
  mrr: number;
  spend: number;
  client_count: number;
  created_at: string;
};

export type ClientRow = {
  id: string;
  agency_id: string;
  name: string;
  owner_name: string;
  email: string;
  phone: string | null;
  category: string | null;
  area: string | null;
  initials: string | null;
  brand_color: string;
  meta: ConnectionState;
  google: ConnectionState;
  status: ClientStatus;
  monthly_spend: number;
  leads: number;
  cpl: number;
  created_at: string;
};

export type CampaignRow = {
  id: string;
  client_id: string;
  name: string;
  platform: AdPlatform;
  status: CampaignStatus;
  spend: number;
  leads: number;
  cpl: number;
  cpc: number;
  ctr: number;
  cpm: number;
  impressions: number;
  clicks: number;
  conv: number;
  period: string | null;
  created_at: string;
};

export type LeadRow = {
  id: string;
  client_id: string;
  campaign_id: string | null;
  name: string;
  phone: string | null;
  email: string | null;
  source: AdPlatform;
  status: LeadStatus;
  notes: string | null;
  created_at: string;
};

export type ContentAssetRow = {
  id: string;
  client_id: string;
  title: string;
  kind: AssetKind;
  platform: AdPlatform | null;
  status: AssetStatus;
  thumb: string | null;
  updated_at: string;
};

export type ProfileRow = {
  id: string;
  role: MemberRole;
  agency_id: string | null;
  client_id: string | null;
  full_name: string | null;
  created_at: string;
};
