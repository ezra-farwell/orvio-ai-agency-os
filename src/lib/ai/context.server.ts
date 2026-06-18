type QueryResult<T> = PromiseLike<{ data: T | null; error: unknown }>;

type SupabaseQuery = {
  select(columns: string): SupabaseQuery;
  eq(column: string, value: string): SupabaseQuery;
  maybeSingle<T>(): QueryResult<T>;
};

export type AuthenticatedSupabaseClient = {
  from(table: string): SupabaseQuery;
};

type ProfileRow = {
  id: string;
  role: "agency_owner" | "agency_member" | "client";
  agency_id: string | null;
  client_id: string | null;
  full_name: string | null;
};

type ClientRow = {
  id: string;
  agency_id: string;
  name: string;
  owner_name: string;
  category: string | null;
  area: string | null;
  status: string;
  monthly_spend: number;
  leads: number;
  cpl: number;
  meta: string;
  google: string;
};

export type OrvioAIClientContext = {
  id: string;
  name: string;
  ownerName: string;
  category: string | null;
  serviceArea: string | null;
  status: string;
  monthlySpend: number;
  leads: number;
  cpl: number;
  integrations: {
    meta: string;
    google: string;
  };
};

export type OrvioAIRequestContext = {
  profile: {
    userId: string;
    role: ProfileRow["role"];
    fullName: string | null;
  };
  agencyId: string;
  client?: OrvioAIClientContext;
};

export type OrvioAIContextErrorCode =
  | "unauthorized"
  | "profile_unavailable"
  | "client_forbidden";

export class OrvioAIContextError extends Error {
  readonly code: OrvioAIContextErrorCode;

  constructor(code: OrvioAIContextErrorCode) {
    super(code);
    this.name = "OrvioAIContextError";
    this.code = code;
  }
}

export async function loadOrvioAIRequestContext(options: {
  supabase: AuthenticatedSupabaseClient;
  userId: string;
  clientId?: string;
}): Promise<OrvioAIRequestContext> {
  const { data: profile, error: profileError } = await options.supabase
    .from("profiles")
    .select("id, role, agency_id, client_id, full_name")
    .eq("id", options.userId)
    .maybeSingle<ProfileRow>();

  if (profileError) {
    throw new OrvioAIContextError("profile_unavailable");
  }

  if (
    !profile ||
    !profile.agency_id ||
    !["agency_owner", "agency_member"].includes(profile.role)
  ) {
    throw new OrvioAIContextError("unauthorized");
  }

  const result: OrvioAIRequestContext = {
    profile: {
      userId: profile.id,
      role: profile.role,
      fullName: profile.full_name,
    },
    agencyId: profile.agency_id,
  };

  if (!options.clientId) return result;

  const { data: client, error: clientError } = await options.supabase
    .from("clients")
    .select(
      "id, agency_id, name, owner_name, category, area, status, monthly_spend, leads, cpl, meta, google",
    )
    .eq("id", options.clientId)
    .eq("agency_id", profile.agency_id)
    .maybeSingle<ClientRow>();

  if (clientError || !client || client.agency_id !== profile.agency_id) {
    throw new OrvioAIContextError("client_forbidden");
  }

  result.client = {
    id: client.id,
    name: client.name,
    ownerName: client.owner_name,
    category: client.category,
    serviceArea: client.area,
    status: client.status,
    monthlySpend: Number(client.monthly_spend),
    leads: client.leads,
    cpl: Number(client.cpl),
    integrations: {
      meta: client.meta,
      google: client.google,
    },
  };

  return result;
}
