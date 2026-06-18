import type { OrvioAIMode } from "./prompts.server";

type PersistenceClient = {
  from(table: string): any;
};

export type OrvioAIJson =
  | string
  | number
  | boolean
  | null
  | OrvioAIJson[]
  | { [key: string]: OrvioAIJson };

export type OrvioAIJsonObject = { [key: string]: OrvioAIJson };

export type OrvioAIConversationRow = {
  id: string;
  agency_id: string;
  user_id: string;
  client_id: string | null;
  title: string | null;
  mode: OrvioAIMode;
  created_at: string;
  updated_at: string;
};

export type OrvioAIMessageRow = {
  id: string;
  conversation_id: string;
  agency_id: string;
  user_id: string;
  client_id: string | null;
  role: "user" | "assistant" | "system";
  content: string;
  model: string | null;
  provider: string | null;
  latency_ms: number | null;
  metadata: OrvioAIJsonObject | null;
  created_at: string;
};

export type OrvioAIPersistenceErrorCode =
  | "conversation_not_found"
  | "conversation_mismatch"
  | "database_error";

export class OrvioAIPersistenceError extends Error {
  readonly code: OrvioAIPersistenceErrorCode;

  constructor(code: OrvioAIPersistenceErrorCode) {
    super(code);
    this.name = "OrvioAIPersistenceError";
    this.code = code;
  }
}

export function createConversationTitle(message: string): string {
  const title = message.replace(/\s+/g, " ").trim();
  return title.length <= 80 ? title : `${title.slice(0, 77).trimEnd()}...`;
}

export async function createOrvioAIConversation(options: {
  supabase: PersistenceClient;
  agencyId: string;
  userId: string;
  clientId?: string;
  mode: OrvioAIMode;
  title: string;
}): Promise<OrvioAIConversationRow> {
  const { data, error } = await options.supabase
    .from("orvio_ai_conversations")
    .insert({
      agency_id: options.agencyId,
      user_id: options.userId,
      client_id: options.clientId ?? null,
      mode: options.mode,
      title: options.title,
    })
    .select("id, agency_id, user_id, client_id, title, mode, created_at, updated_at")
    .single();

  if (error || !data) throw new OrvioAIPersistenceError("database_error");
  return data as OrvioAIConversationRow;
}

export async function getOrvioAIConversationForAgency(options: {
  supabase: PersistenceClient;
  agencyId: string;
  conversationId: string;
}): Promise<OrvioAIConversationRow> {
  const { data, error } = await options.supabase
    .from("orvio_ai_conversations")
    .select("id, agency_id, user_id, client_id, title, mode, created_at, updated_at")
    .eq("id", options.conversationId)
    .eq("agency_id", options.agencyId)
    .maybeSingle();

  if (error) throw new OrvioAIPersistenceError("database_error");
  if (!data) throw new OrvioAIPersistenceError("conversation_not_found");
  return data as OrvioAIConversationRow;
}

export async function insertOrvioAIMessage(options: {
  supabase: PersistenceClient;
  conversationId: string;
  agencyId: string;
  userId: string;
  clientId?: string;
  role: OrvioAIMessageRow["role"];
  content: string;
  model?: string;
  provider?: string;
  latencyMs?: number;
  metadata?: OrvioAIJsonObject;
}): Promise<OrvioAIMessageRow> {
  const { data, error } = await options.supabase
    .from("orvio_ai_messages")
    .insert({
      conversation_id: options.conversationId,
      agency_id: options.agencyId,
      user_id: options.userId,
      client_id: options.clientId ?? null,
      role: options.role,
      content: options.content,
      model: options.model ?? null,
      provider: options.provider ?? null,
      latency_ms: options.latencyMs ?? null,
      metadata: options.metadata ?? null,
    })
    .select(
      "id, conversation_id, agency_id, user_id, client_id, role, content, model, provider, latency_ms, metadata, created_at",
    )
    .single();

  if (error || !data) throw new OrvioAIPersistenceError("database_error");
  return data as OrvioAIMessageRow;
}

export async function touchOrvioAIConversation(options: {
  supabase: PersistenceClient;
  agencyId: string;
  conversationId: string;
}): Promise<void> {
  const { error } = await options.supabase
    .from("orvio_ai_conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", options.conversationId)
    .eq("agency_id", options.agencyId);

  if (error) throw new OrvioAIPersistenceError("database_error");
}

export async function listOrvioAIConversationsForAgency(options: {
  supabase: PersistenceClient;
  agencyId: string;
  clientId?: string;
  limit: number;
}): Promise<OrvioAIConversationRow[]> {
  let query = options.supabase
    .from("orvio_ai_conversations")
    .select("id, agency_id, user_id, client_id, title, mode, created_at, updated_at")
    .eq("agency_id", options.agencyId)
    .order("updated_at", { ascending: false })
    .limit(options.limit);

  if (options.clientId) query = query.eq("client_id", options.clientId);

  const { data, error } = await query;
  if (error) throw new OrvioAIPersistenceError("database_error");
  return (data ?? []) as OrvioAIConversationRow[];
}

export async function listOrvioAIMessagesForConversation(options: {
  supabase: PersistenceClient;
  agencyId: string;
  conversationId: string;
}): Promise<OrvioAIMessageRow[]> {
  const { data, error } = await options.supabase
    .from("orvio_ai_messages")
    .select(
      "id, conversation_id, agency_id, user_id, client_id, role, content, model, provider, latency_ms, metadata, created_at",
    )
    .eq("conversation_id", options.conversationId)
    .eq("agency_id", options.agencyId)
    .order("created_at", { ascending: true });

  if (error) throw new OrvioAIPersistenceError("database_error");
  return (data ?? []) as OrvioAIMessageRow[];
}

export async function deleteOrvioAIConversationForAgency(options: {
  supabase: PersistenceClient;
  agencyId: string;
  conversationId: string;
}): Promise<void> {
  const { data, error } = await options.supabase
    .from("orvio_ai_conversations")
    .delete()
    .eq("id", options.conversationId)
    .eq("agency_id", options.agencyId)
    .select("id")
    .maybeSingle();

  if (error) throw new OrvioAIPersistenceError("database_error");
  if (!data) throw new OrvioAIPersistenceError("conversation_not_found");
}

export async function deleteNewOrvioAIConversationBestEffort(options: {
  supabase: PersistenceClient;
  agencyId: string;
  conversationId: string;
}): Promise<void> {
  await options.supabase
    .from("orvio_ai_conversations")
    .delete()
    .eq("id", options.conversationId)
    .eq("agency_id", options.agencyId);
}
