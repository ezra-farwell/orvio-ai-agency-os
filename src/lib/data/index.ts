// Orvio data-access layer.
// Returns the SAME app types the UI already uses (from src/mock/data.ts), so
// switching a route from mock → live is a one-import change. When Supabase is
// not configured yet, every function transparently returns the mock data, so
// the app runs today and goes live the moment VITE_SUPABASE_* env vars are set.

import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import type {
  AgencyRow, ClientRow, CampaignRow, LeadRow, ContentAssetRow,
} from "@/lib/supabase/types";
import {
  clients as mockClients,
  campaigns as mockCampaigns,
  leads as mockLeads,
  assets as mockAssets,
  agencies as mockAgencies,
  agencyDashboard as mockAgencyDashboard,
  clientDashboard as mockClientDashboard,
  type Client, type Campaign, type Lead, type ContentAsset, type Agency,
  type MetricGroup,
} from "@/mock/data";

/* ---------- helpers ---------- */

function ago(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.max(0, Math.round(diff / 60000));
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return d === 1 ? "yesterday" : `${d}d ago`;
}

/* ---------- row → app-type mappers ---------- */

const toClient = (r: ClientRow): Client => ({
  id: r.id,
  name: r.name,
  owner: r.owner_name,
  email: r.email,
  phone: r.phone ?? "",
  category: r.category ?? "",
  area: r.area ?? "",
  initials: r.initials ?? "",
  color: r.brand_color,
  meta: r.meta,
  google: r.google,
  status: r.status,
  monthlySpend: Number(r.monthly_spend),
  leads: r.leads,
  cpl: Number(r.cpl),
});

const toCampaign = (r: CampaignRow & { clients?: { name: string } | null }): Campaign => ({
  id: r.id,
  name: r.name,
  client: r.clients?.name ?? "",
  platform: r.platform,
  status: r.status,
  spend: Number(r.spend),
  leads: r.leads,
  cpl: Number(r.cpl),
  cpc: Number(r.cpc),
  ctr: Number(r.ctr),
  cpm: Number(r.cpm),
  impressions: r.impressions,
  clicks: r.clicks,
  conv: Number(r.conv),
});

const toLead = (
  r: LeadRow & { clients?: { name: string } | null; campaigns?: { name: string } | null },
): Lead => ({
  id: r.id,
  name: r.name,
  phone: r.phone ?? "",
  email: r.email ?? "",
  client: r.clients?.name ?? "",
  campaign: r.campaigns?.name ?? "",
  source: r.source,
  status: r.status,
  submitted: ago(r.created_at),
  notes: r.notes ?? "",
});

const toAsset = (
  r: ContentAssetRow & { clients?: { name: string } | null },
): ContentAsset => ({
  id: r.id,
  title: r.title,
  client: r.clients?.name ?? "",
  kind: r.kind,
  platform: r.platform ?? undefined,
  status: r.status,
  updated: ago(r.updated_at),
  thumb: r.thumb ?? "",
});

const toAgency = (r: AgencyRow): Agency => ({
  id: r.id,
  name: r.name,
  owner: r.owner_name,
  plan: r.plan,
  clients: r.client_count,
  mrr: Number(r.mrr),
  spend: Number(r.spend),
  status: r.status,
  // DB unifies integration state (incl. "Off"); the app's agency marks are narrower.
  meta: r.meta as Agency["meta"],
  google: r.google as Agency["google"],
  stripe: r.stripe as Agency["stripe"],
  domain: r.domain ?? "",
});

/* ---------- queries (mock fallback until Supabase is configured) ---------- */

export async function getClients(): Promise<Client[]> {
  if (!isSupabaseConfigured || !supabase) return mockClients;
  const { data, error } = await supabase.from("clients").select("*").order("name");
  if (error) throw error;
  return (data as ClientRow[]).map(toClient);
}

export async function getClient(id: string): Promise<Client | null> {
  if (!isSupabaseConfigured || !supabase) return mockClients.find((c) => c.id === id) ?? null;
  const { data, error } = await supabase.from("clients").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? toClient(data as ClientRow) : null;
}

export async function getCampaigns(): Promise<Campaign[]> {
  if (!isSupabaseConfigured || !supabase) return mockCampaigns;
  const { data, error } = await supabase.from("campaigns").select("*, clients(name)").order("spend", { ascending: false });
  if (error) throw error;
  return (data as never[]).map(toCampaign);
}

export async function getLeads(): Promise<Lead[]> {
  if (!isSupabaseConfigured || !supabase) return mockLeads;
  const { data, error } = await supabase
    .from("leads")
    .select("*, clients(name), campaigns(name)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as never[]).map(toLead);
}

export async function getAssets(): Promise<ContentAsset[]> {
  if (!isSupabaseConfigured || !supabase) return mockAssets;
  const { data, error } = await supabase.from("content_assets").select("*, clients(name)").order("updated_at", { ascending: false });
  if (error) throw error;
  return (data as never[]).map(toAsset);
}

export async function getAgencies(): Promise<Agency[]> {
  if (!isSupabaseConfigured || !supabase) return mockAgencies;
  const { data, error } = await supabase.from("agencies").select("*").order("mrr", { ascending: false });
  if (error) throw error;
  return (data as AgencyRow[]).map(toAgency);
}

export async function getAgencyDashboard(): Promise<MetricGroup[]> {
  if (!isSupabaseConfigured || !supabase) return mockAgencyDashboard();
  const { data, error } = await supabase.rpc("rpc_agency_dashboard");
  if (error) throw error;
  return data as MetricGroup[];
}

export async function getClientDashboard(clientId?: string): Promise<MetricGroup[]> {
  if (!isSupabaseConfigured || !supabase) {
    const c = clientId ? mockClients.find((x) => x.id === clientId) : mockClients[0];
    return c ? mockClientDashboard(c) : [];
  }
  const { data, error } = await supabase.rpc("rpc_client_dashboard", { p_client_id: clientId ?? null });
  if (error) throw error;
  return data as MetricGroup[];
}
