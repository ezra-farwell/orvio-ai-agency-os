// Mock data for Orvio — local service / home-services agencies

export type Client = {
  id: string;
  name: string;
  owner: string;
  email: string;
  phone: string;
  category: string;
  area: string;
  initials: string;
  color: string;
  meta: "connected" | "warning" | "disconnected";
  google: "connected" | "warning" | "disconnected";
  status: "active" | "onboarding" | "at-risk";
  monthlySpend: number;
  leads: number;
  cpl: number;
};

export const clients: Client[] = [
  { id: "hartland", name: "Hartland Plumbing", owner: "Mike Hartland", email: "mike@hartlandplumbing.com", phone: "(248) 555-0142", category: "Plumbing", area: "Detroit Metro, MI", initials: "HP", color: "#4F46E5", meta: "connected", google: "connected", status: "active", monthlySpend: 4280, leads: 63, cpl: 67.94 },
  { id: "northside", name: "Northside Roofing", owner: "Jenna Vega", email: "jenna@northsideroof.com", phone: "(612) 555-0177", category: "Roofing", area: "Minneapolis, MN", initials: "NR", color: "#8B5CF6", meta: "connected", google: "warning", status: "active", monthlySpend: 6420, leads: 81, cpl: 79.26 },
  { id: "apex", name: "Apex Remodeling", owner: "Carlos Reyes", email: "carlos@apexremodel.co", phone: "(602) 555-0193", category: "Remodeling", area: "Phoenix, AZ", initials: "AR", color: "#10B981", meta: "connected", google: "connected", status: "active", monthlySpend: 8910, leads: 47, cpl: 189.57 },
  { id: "brighton", name: "Brighton HVAC Pros", owner: "Sasha Patel", email: "sasha@brightonhvac.com", phone: "(303) 555-0124", category: "HVAC", area: "Denver, CO", initials: "BH", color: "#F59E0B", meta: "warning", google: "connected", status: "at-risk", monthlySpend: 3140, leads: 28, cpl: 112.14 },
  { id: "lakeside", name: "Lakeside Electric", owner: "Owen Brooks", email: "owen@lakesideelectric.io", phone: "(206) 555-0189", category: "Electrical", area: "Seattle, WA", initials: "LE", color: "#EF4444", meta: "connected", google: "connected", status: "active", monthlySpend: 2980, leads: 41, cpl: 72.68 },
  { id: "evergreen", name: "Evergreen Landscaping", owner: "Maya Liu", email: "maya@evergreenland.co", phone: "(503) 555-0166", category: "Landscaping", area: "Portland, OR", initials: "EL", color: "#0EA5E9", meta: "connected", google: "connected", status: "onboarding", monthlySpend: 1820, leads: 22, cpl: 82.73 },
];

export type Campaign = {
  id: string;
  name: string;
  client: string;
  platform: "Meta Ads" | "Google Ads";
  status: "Active" | "Paused" | "Learning";
  spend: number;
  leads: number;
  cpl: number;
  cpc: number;
  ctr: number;
  cpm: number;
  impressions: number;
  clicks: number;
  conv: number;
};

export const campaigns: Campaign[] = [
  { id: "c1", name: "Emergency Plumbing Leads", client: "Hartland Plumbing", platform: "Google Ads", status: "Active", spend: 1840, leads: 31, cpl: 59.35, cpc: 4.12, ctr: 3.4, cpm: 28.4, impressions: 64800, clicks: 2204, conv: 14.1 },
  { id: "c2", name: "Kitchen Remodel Estimate Requests", client: "Apex Remodeling", platform: "Meta Ads", status: "Active", spend: 3210, leads: 22, cpl: 145.91, cpc: 2.84, ctr: 2.1, cpm: 19.7, impressions: 162900, clicks: 3422, conv: 8.2 },
  { id: "c3", name: "Roof Replacement Campaign", client: "Northside Roofing", platform: "Meta Ads", status: "Active", spend: 2980, leads: 38, cpl: 78.42, cpc: 2.95, ctr: 2.8, cpm: 22.1, impressions: 135500, clicks: 3801, conv: 11.4 },
  { id: "c4", name: "HVAC Tune-Up Offer", client: "Brighton HVAC Pros", platform: "Meta Ads", status: "Learning", spend: 1120, leads: 9, cpl: 124.44, cpc: 1.98, ctr: 1.6, cpm: 14.2, impressions: 78900, clicks: 1561, conv: 5.7 },
  { id: "c5", name: "Electrical Panel Upgrade Leads", client: "Lakeside Electric", platform: "Google Ads", status: "Active", spend: 1490, leads: 24, cpl: 62.08, cpc: 3.41, ctr: 4.1, cpm: 31.8, impressions: 46700, clicks: 1914, conv: 13.2 },
  { id: "c6", name: "Spring Landscape Quotes", client: "Evergreen Landscaping", platform: "Google Ads", status: "Active", spend: 920, leads: 14, cpl: 65.71, cpc: 3.02, ctr: 3.7, cpm: 29.4, impressions: 31200, clicks: 1154, conv: 12.1 },
  { id: "c7", name: "Furnace Replacement Q1", client: "Brighton HVAC Pros", platform: "Google Ads", status: "Paused", spend: 2020, leads: 19, cpl: 106.32, cpc: 5.84, ctr: 2.9, cpm: 38.1, impressions: 53000, clicks: 1538, conv: 9.4 },
  { id: "c8", name: "Drain Cleaning Local", client: "Hartland Plumbing", platform: "Meta Ads", status: "Active", spend: 1240, leads: 26, cpl: 47.69, cpc: 1.74, ctr: 3.1, cpm: 18.6, impressions: 66700, clicks: 2068, conv: 12.8 },
];

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  client: string;
  campaign: string;
  source: "Meta Ads" | "Google Ads";
  status: "New" | "Contacted" | "Booked" | "Estimate Sent" | "Won" | "Lost";
  submitted: string;
  notes: string;
};

export const leads: Lead[] = [
  { id: "l1", name: "Brian Connors",   phone: "(248) 555-1023", email: "brian.c@gmail.com",     client: "Hartland Plumbing", campaign: "Emergency Plumbing Leads", source: "Google Ads", status: "New", submitted: "2h ago", notes: "Burst pipe, basement flooding." },
  { id: "l2", name: "Whitney Park",    phone: "(612) 555-0918", email: "w.park@outlook.com",    client: "Northside Roofing", campaign: "Roof Replacement Campaign", source: "Meta Ads", status: "Contacted", submitted: "5h ago", notes: "Storm damage estimate." },
  { id: "l3", name: "Marcus Hill",     phone: "(602) 555-2241", email: "marcus.hill@yahoo.com", client: "Apex Remodeling", campaign: "Kitchen Remodel Estimate Requests", source: "Meta Ads", status: "Booked", submitted: "yesterday", notes: "Full kitchen, 200 sqft." },
  { id: "l4", name: "Dana Wexler",     phone: "(206) 555-1812", email: "d.wexler@icloud.com",   client: "Lakeside Electric", campaign: "Electrical Panel Upgrade Leads", source: "Google Ads", status: "Estimate Sent", submitted: "2d ago", notes: "Panel upgrade, 200A." },
  { id: "l5", name: "Priya Shah",      phone: "(303) 555-0044", email: "priya.s@gmail.com",     client: "Brighton HVAC Pros", campaign: "HVAC Tune-Up Offer", source: "Meta Ads", status: "Won", submitted: "3d ago", notes: "Tune-up booked for Thurs." },
  { id: "l6", name: "Eduardo Souza",   phone: "(503) 555-7790", email: "e.souza@gmail.com",     client: "Evergreen Landscaping", campaign: "Spring Landscape Quotes", source: "Google Ads", status: "New", submitted: "30m ago", notes: "Backyard redesign quote." },
  { id: "l7", name: "Lila Tanaka",     phone: "(248) 555-3399", email: "lila.t@hotmail.com",    client: "Hartland Plumbing", campaign: "Drain Cleaning Local", source: "Meta Ads", status: "Contacted", submitted: "4h ago", notes: "Recurring drain issue." },
  { id: "l8", name: "Garrett Kowalski",phone: "(612) 555-8821", email: "g.kowalski@gmail.com",  client: "Northside Roofing", campaign: "Roof Replacement Campaign", source: "Meta Ads", status: "Lost", submitted: "5d ago", notes: "Went with competitor." },
  { id: "l9", name: "Imani Reed",      phone: "(206) 555-4501", email: "imani.reed@gmail.com",  client: "Lakeside Electric", campaign: "Electrical Panel Upgrade Leads", source: "Google Ads", status: "Booked", submitted: "1d ago", notes: "EV charger install." },
  { id: "l10",name: "Theo Bellamy",    phone: "(602) 555-6612", email: "theo.b@outlook.com",    client: "Apex Remodeling", campaign: "Kitchen Remodel Estimate Requests", source: "Meta Ads", status: "Estimate Sent", submitted: "6h ago", notes: "Open-concept kitchen." },
];

export const trend30d = [
  { d: "May 1", spend: 720, leads: 11 }, { d: "May 4", spend: 880, leads: 14 },
  { d: "May 7", spend: 1020, leads: 17 }, { d: "May 10", spend: 1180, leads: 19 },
  { d: "May 13", spend: 1240, leads: 21 }, { d: "May 16", spend: 1390, leads: 22 },
  { d: "May 19", spend: 1510, leads: 26 }, { d: "May 22", spend: 1610, leads: 28 },
  { d: "May 25", spend: 1780, leads: 31 }, { d: "May 28", spend: 1840, leads: 34 },
  { d: "May 31", spend: 1920, leads: 38 },
];

export const platformSplit = [
  { platform: "Meta Ads",   spend: 8550, leads: 95, share: 53 },
  { platform: "Google Ads", spend: 7570, leads: 89, share: 47 },
];

export type ContentAsset = {
  id: string;
  title: string;
  client: string;
  kind: "Ad" | "Social" | "Landing" | "Email" | "Report" | "Brand";
  platform?: "Meta Ads" | "Google Ads" | "Instagram" | "Facebook";
  status: "Draft" | "In Review" | "Approved" | "Scheduled" | "Published";
  updated: string;
  thumb: string;
};

export const assets: ContentAsset[] = [
  { id: "a1", title: "Emergency plumbing — primary text v3", client: "Hartland Plumbing", kind: "Ad", platform: "Meta Ads", status: "In Review", updated: "2h ago", thumb: "/thumbs/plumb.svg" },
  { id: "a2", title: "Kitchen remodel before/after carousel", client: "Apex Remodeling", kind: "Ad", platform: "Meta Ads", status: "Approved", updated: "yesterday", thumb: "/thumbs/kitchen.svg" },
  { id: "a3", title: "Roof storm damage landing page", client: "Northside Roofing", kind: "Landing", status: "Draft", updated: "3h ago", thumb: "/thumbs/roof.svg" },
  { id: "a4", title: "HVAC tune-up Spring promo email", client: "Brighton HVAC Pros", kind: "Email", status: "Scheduled", updated: "2d ago", thumb: "/thumbs/email.svg" },
  { id: "a5", title: "Panel upgrade search ad headlines", client: "Lakeside Electric", kind: "Ad", platform: "Google Ads", status: "Approved", updated: "5h ago", thumb: "/thumbs/electric.svg" },
  { id: "a6", title: "Spring landscape social posts (Apr)", client: "Evergreen Landscaping", kind: "Social", platform: "Instagram", status: "In Review", updated: "1d ago", thumb: "/thumbs/landscape.svg" },
  { id: "a7", title: "Monthly performance report — Mar", client: "Hartland Plumbing", kind: "Report", status: "Published", updated: "1w ago", thumb: "/thumbs/report.svg" },
  { id: "a8", title: "Brand voice guide", client: "Apex Remodeling", kind: "Brand", status: "Approved", updated: "2w ago", thumb: "/thumbs/brand.svg" },
];

export type Agency = {
  id: string;
  name: string;
  owner: string;
  plan: "Starter" | "Growth" | "Scale" | "Enterprise";
  clients: number;
  mrr: number;
  spend: number;
  status: "Active" | "Trial" | "Past Due" | "Churn Risk";
  meta: "OK" | "Warning" | "Down";
  google: "OK" | "Warning" | "Down";
  stripe: "OK" | "Warning" | "Off";
  domain: string;
};

export const agencies: Agency[] = [
  { id: "ag1", name: "Northstar Growth Co.", owner: "Avery Sloan",   plan: "Scale",      clients: 24, mrr: 4200, spend: 184200, status: "Active",     meta: "OK", google: "OK", stripe: "OK", domain: "portal.northstar.io" },
  { id: "ag2", name: "Tidewater Media",      owner: "Reece Park",    plan: "Growth",     clients: 11, mrr: 1900, spend: 84200,  status: "Active",     meta: "OK", google: "Warning", stripe: "OK", domain: "go.tidewater.com" },
  { id: "ag3", name: "Foundry Local",        owner: "Helena Cruz",   plan: "Growth",     clients: 9,  mrr: 1900, spend: 61800,  status: "Trial",      meta: "OK", google: "OK", stripe: "OK", domain: "app.foundrylocal.com" },
  { id: "ag4", name: "Bluefield Partners",   owner: "Marcus Yates",  plan: "Scale",      clients: 18, mrr: 4200, spend: 142900, status: "Active",     meta: "Warning", google: "OK", stripe: "OK", domain: "portal.bluefieldco.com" },
  { id: "ag5", name: "Crestline Studio",     owner: "Sage Whitmore", plan: "Starter",    clients: 4,  mrr: 490,  spend: 18900,  status: "Past Due",   meta: "OK", google: "OK", stripe: "Warning", domain: "crestlinestudio.app" },
  { id: "ag6", name: "Pinecrest Digital",    owner: "Jordan Reyes",  plan: "Enterprise", clients: 42, mrr: 8900, spend: 312400, status: "Active",     meta: "OK", google: "OK", stripe: "OK", domain: "clients.pinecrest.com" },
  { id: "ag7", name: "Sable & Co.",          owner: "Nora Bishop",   plan: "Growth",     clients: 7,  mrr: 1900, spend: 41800,  status: "Churn Risk", meta: "Down", google: "OK", stripe: "OK", domain: "go.sableand.co" },
];

// Currently signed-in mock agency context (used by /app and /portal)
export const currentAgency = {
  name: "Northstar Growth Co.",
  brandColor: "#4F46E5",
  owner: "Avery Sloan",
  domain: "portal.northstar.io",
};

export const currentClient = clients[0]; // Hartland Plumbing in the client portal

export const usd = (n: number) =>
  n >= 1000 ? `$${(n / 1).toLocaleString("en-US", { maximumFractionDigits: 0 })}` : `$${n.toFixed(2)}`;
export const usd2 = (n: number) => `$${n.toFixed(2)}`;
export const pct = (n: number) => `${n.toFixed(1)}%`;
export const num = (n: number) => n.toLocaleString("en-US");

// ============= Resend-inspired status-word metric groups =============
export type MetricTone = "good" | "steady" | "watch" | "risk" | "neutral";

export type MetricRow = {
  label: string;
  value: number;
  format: "usd" | "num" | "pct" | "cpl";
  secondary?: string; // e.g. "100%" or "+12%"
};

export type MetricGroup = {
  eyebrow: string;          // e.g. "LEAD FLOW"
  statusWord: string;       // e.g. "Good"
  statusTone: MetricTone;   // drives the dot color
  rows: [MetricRow, MetricRow]; // two rows like Resend
};

export const TONE_COLOR: Record<MetricTone, string> = {
  good: "#10B981",
  steady: "#4F46E5",
  watch: "#F59E0B",
  risk: "#EF4444",
  neutral: "#A1A1AA",
};

export function formatMetric(r: MetricRow): string {
  switch (r.format) {
    case "usd": return usd(r.value);
    case "num": return num(r.value);
    case "pct": return `${r.value.toFixed(1)}%`;
    case "cpl": return `$${r.value.toFixed(2)}`;
  }
}

export function agencyDashboard(): MetricGroup[] {
  const totalLeads = clients.reduce((a, c) => a + c.leads, 0);
  const totalSpend = clients.reduce((a, c) => a + c.monthlySpend, 0);
  const atRisk = clients.filter(c => c.status === "at-risk").length;
  const active = clients.filter(c => c.status === "active").length;
  const avgCpl = totalSpend / totalLeads;
  const openLeads = leads.filter(l => l.status === "New" || l.status === "Contacted").length;
  return [
    {
      eyebrow: "LEAD FLOW",
      statusWord: "Good",
      statusTone: "good",
      rows: [
        { label: "New leads", value: totalLeads, format: "num", secondary: "+12%" },
        { label: "Open follow-ups", value: openLeads, format: "num", secondary: `${Math.round(openLeads/totalLeads*100)}%` },
      ],
    },
    {
      eyebrow: "CLIENT HEALTH",
      statusWord: atRisk > 0 ? "Watch" : "Steady",
      statusTone: atRisk > 0 ? "watch" : "steady",
      rows: [
        { label: "Active", value: active, format: "num", secondary: `${clients.length} total` },
        { label: "At risk", value: atRisk, format: "num", secondary: `${Math.round(atRisk/clients.length*100)}%` },
      ],
    },
    {
      eyebrow: "SPEND EFFICIENCY",
      statusWord: avgCpl < 100 ? "Good" : "Watch",
      statusTone: avgCpl < 100 ? "good" : "watch",
      rows: [
        { label: "Spend", value: totalSpend, format: "usd", secondary: "+8.2%" },
        { label: "Avg CPL", value: avgCpl, format: "cpl", secondary: "-4.1%" },
      ],
    },
  ];
}

export function clientDashboard(client: Client): MetricGroup[] {
  const myLeads = leads.filter(l => l.client === client.name);
  const open = myLeads.filter(l => l.status === "New" || l.status === "Contacted").length;
  const won = myLeads.filter(l => l.status === "Won" || l.status === "Booked").length;
  return [
    {
      eyebrow: "LEAD FLOW",
      statusWord: "Good",
      statusTone: "good",
      rows: [
        { label: "New leads", value: client.leads, format: "num", secondary: "+12%" },
        { label: "Open", value: open, format: "num", secondary: `${myLeads.length ? Math.round(open/myLeads.length*100) : 0}%` },
      ],
    },
    {
      eyebrow: "AD SPEND",
      statusWord: "Steady",
      statusTone: "steady",
      rows: [
        { label: "This month", value: client.monthlySpend, format: "usd", secondary: "+5%" },
        { label: "Cost per lead", value: client.cpl, format: "cpl", secondary: "-4.1%" },
      ],
    },
    {
      eyebrow: "PIPELINE",
      statusWord: won > 0 ? "Good" : "Steady",
      statusTone: won > 0 ? "good" : "steady",
      rows: [
        { label: "Booked / won", value: won, format: "num", secondary: "this month" },
        { label: "Approvals pending", value: 2, format: "num", secondary: "needs you" },
      ],
    },
  ];
}
