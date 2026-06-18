import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import {
  Bot,
  Clock3,
  LoaderCircle,
  MessageSquarePlus,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react";

import { Card, PageHeader } from "@/components/bits";
import {
  deleteOrvioAIConversation,
  getOrvioAIConversation,
  listOrvioAIConversations,
  sendOrvioAIMessage,
} from "@/lib/api/ai.functions";
import { getClients } from "@/lib/data";

export const Route = createFileRoute("/app/ai")({
  validateSearch: z.object({
    clientId: z.string().uuid().optional().catch(undefined),
    mode: z
      .enum([
        "general",
        "campaign_ideas",
        "lead_followup",
        "creative_prompt",
        "competitor_summary",
        "report_summary",
        "task_recommendations",
      ])
      .optional()
      .catch(undefined),
    prompt: z.string().max(8_000).optional().catch(undefined),
    context: z.string().max(12_000).optional().catch(undefined),
  }),
  component: OrvioAIPage,
  head: () => ({ meta: [{ title: "Orvio AI — Agency assistant" }] }),
});

const MODES = [
  {
    value: "general",
    label: "General agency assistant",
    description: "Operations, client strategy, reporting, follow-up, and planning.",
  },
  {
    value: "campaign_ideas",
    label: "Campaign ideas",
    description: "Paid-ad angles, offers, hooks, and campaign structure.",
  },
  {
    value: "lead_followup",
    label: "Lead follow-up",
    description: "Follow-up strategy, call notes, SMS, email, and next steps.",
  },
  {
    value: "creative_prompt",
    label: "Creative prompts",
    description: "Original image and video prompts for client-branded ads.",
  },
  {
    value: "competitor_summary",
    label: "Competitor summary",
    description: "Turn supplied public research into practical creative intelligence.",
  },
  {
    value: "report_summary",
    label: "Report summary",
    description: "Explain performance wins, risks, missing data, and next actions.",
  },
  {
    value: "task_recommendations",
    label: "Task recommendations",
    description: "Prioritized agency actions with reasons and expected impact.",
  },
] as const;

type Mode = (typeof MODES)[number]["value"];

type Conversation = Awaited<
  ReturnType<typeof listOrvioAIConversations>
>[number];

type ConversationMessage = Awaited<
  ReturnType<typeof getOrvioAIConversation>
>["messages"][number];

function cleanError(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

function formatConversationTime(value: string): string {
  const date = new Date(value);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function OrvioAIPage() {
  const search = Route.useSearch();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialClientAppliedRef = useRef(false);
  const [activeConversationId, setActiveConversationId] = useState<string>();
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [clientId, setClientId] = useState("");
  const [mode, setMode] = useState<Mode>(search.mode ?? "general");
  const [draft, setDraft] = useState(search.prompt ?? "");
  const [starterContext, setStarterContext] = useState(search.context ?? "");
  const [loadingConversationId, setLoadingConversationId] = useState<string>();
  const [sending, setSending] = useState(false);
  const [deletingId, setDeletingId] = useState<string>();
  const [error, setError] = useState<string>();

  const { data: clients = [], isSuccess: clientsLoaded } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });

  const {
    data: conversations = [],
    isLoading: conversationsLoading,
    error: conversationsError,
  } = useQuery({
    queryKey: ["orvio-ai-conversations"],
    queryFn: () => listOrvioAIConversations({ data: { limit: 50 } }),
  });

  const clientNames = useMemo(
    () => new Map(clients.map((client) => [client.id, client.name])),
    [clients],
  );
  const activeMode = MODES.find((item) => item.value === mode) ?? MODES[0];
  const conversationLocked = Boolean(activeConversationId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  useEffect(() => {
    if (initialClientAppliedRef.current || !clientsLoaded) return;
    initialClientAppliedRef.current = true;

    if (
      search.clientId &&
      clients.some((client) => client.id === search.clientId)
    ) {
      setClientId(search.clientId);
    }
  }, [clients, clientsLoaded, search.clientId]);

  function startNewChat() {
    initialClientAppliedRef.current = true;
    setActiveConversationId(undefined);
    setMessages([]);
    setClientId("");
    setMode("general");
    setDraft("");
    setStarterContext("");
    setError(undefined);
  }

  async function openConversation(conversation: Conversation) {
    if (sending || loadingConversationId) return;
    setLoadingConversationId(conversation.id);
    setError(undefined);

    try {
      const result = await getOrvioAIConversation({
        data: { conversationId: conversation.id },
      });
      setActiveConversationId(result.conversation.id);
      setClientId(result.conversation.clientId ?? "");
      setMode(result.conversation.mode);
      setMessages(result.messages);
    } catch (loadError) {
      setError(
        cleanError(loadError, "The Orvio AI conversation could not be loaded."),
      );
    } finally {
      setLoadingConversationId(undefined);
    }
  }

  async function removeConversation(
    event: React.MouseEvent,
    conversationId: string,
  ) {
    event.stopPropagation();
    if (deletingId || sending) return;
    setDeletingId(conversationId);
    setError(undefined);

    try {
      await deleteOrvioAIConversation({ data: { conversationId } });
      if (activeConversationId === conversationId) startNewChat();
      await queryClient.invalidateQueries({
        queryKey: ["orvio-ai-conversations"],
      });
    } catch (deleteError) {
      setError(
        cleanError(
          deleteError,
          "The Orvio AI conversation could not be deleted.",
        ),
      );
    } finally {
      setDeletingId(undefined);
    }
  }

  async function sendMessage() {
    const message = draft.trim();
    if (!message || sending) return;

    const optimisticId = `pending-${Date.now()}`;
    const optimisticMessage: ConversationMessage = {
      id: optimisticId,
      role: "user",
      content: message,
      model: null,
      provider: null,
      latencyMs: null,
      metadata: null,
      createdAt: new Date().toISOString(),
    };

    setMessages((current) => [...current, optimisticMessage]);
    setDraft("");
    setError(undefined);
    setSending(true);

    try {
      const result = await sendOrvioAIMessage({
        data: {
          message,
          conversationId: activeConversationId,
          clientId: clientId || undefined,
          mode,
          context: starterContext || undefined,
        },
      });

      const assistantMessage: ConversationMessage = {
        id: result.assistantMessageId,
        role: "assistant",
        content: result.text,
        model: result.model,
        provider: result.provider,
        latencyMs: result.latencyMs,
        metadata: { mode: result.mode },
        createdAt: new Date().toISOString(),
      };

      setActiveConversationId(result.conversationId);
      setMessages((current) => [
        ...current.map((item) =>
          item.id === optimisticId
            ? { ...item, id: result.userMessageId }
            : item,
        ),
        assistantMessage,
      ]);
      await queryClient.invalidateQueries({
        queryKey: ["orvio-ai-conversations"],
      });
    } catch (sendError) {
      setError(cleanError(sendError, "Orvio AI could not complete the request."));
      await queryClient.invalidateQueries({
        queryKey: ["orvio-ai-conversations"],
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <PageHeader
        title={
          <span className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
              <Sparkles className="h-4 w-4" />
            </span>
            Orvio AI
          </span>
        }
        sub="AI assistant for agency operations, ads, client strategy, reporting, and follow-up."
      />

      <div className="px-4 pb-8 sm:px-6">
        <Card className="grid min-h-[680px] overflow-hidden lg:h-[calc(100vh-150px)] lg:min-h-[620px] lg:grid-cols-[290px_minmax(0,1fr)]">
          <aside className="flex min-h-0 flex-col border-b border-border bg-[var(--surface)] lg:border-b-0 lg:border-r">
            <div className="border-b border-border p-3">
              <button
                type="button"
                onClick={startNewChat}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-foreground px-3 text-[13px] font-medium text-background transition-opacity hover:opacity-90"
              >
                <MessageSquarePlus className="h-4 w-4" />
                New Chat
              </button>
            </div>

            <div className="flex items-center justify-between px-4 pb-2 pt-4">
              <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--text-faint)]">
                Conversations
              </span>
              <span className="text-[11px] text-muted-foreground">
                {conversations.length}
              </span>
            </div>

            <div className="max-h-[240px] flex-1 overflow-y-auto px-2 pb-3 lg:max-h-none">
              {conversationsLoading ? (
                <div className="flex items-center gap-2 px-2 py-4 text-[12px] text-muted-foreground">
                  <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                  Loading conversations…
                </div>
              ) : conversations.length === 0 ? (
                <div className="px-3 py-5 text-[12px] leading-relaxed text-muted-foreground">
                  Your saved Orvio AI conversations will appear here.
                </div>
              ) : (
                <ul className="space-y-1">
                  {conversations.map((conversation) => {
                    const active = activeConversationId === conversation.id;
                    const loading = loadingConversationId === conversation.id;
                    return (
                      <li key={conversation.id}>
                        <div
                          className={`group flex w-full items-start gap-1 rounded-lg px-1 py-1 transition-colors ${
                            active
                              ? "bg-[var(--surface-2)]"
                              : "hover:bg-[var(--surface-2)]/70"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => openConversation(conversation)}
                            className="flex min-w-0 flex-1 items-start gap-2 px-1.5 py-1.5 text-left"
                          >
                            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-[var(--accent-soft)] text-[var(--accent)]">
                              {loading ? (
                                <LoaderCircle className="h-3 w-3 animate-spin" />
                              ) : (
                                <Bot className="h-3 w-3" />
                              )}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[12.5px] font-medium">
                                {conversation.title || "Untitled conversation"}
                              </span>
                              <span className="mt-0.5 flex items-center gap-1.5 text-[10.5px] text-muted-foreground">
                                <span className="truncate">
                                  {conversation.clientId
                                    ? clientNames.get(conversation.clientId) ||
                                      "Client"
                                    : "Agency-wide"}
                                </span>
                                <span>·</span>
                                <span>
                                  {formatConversationTime(
                                    conversation.updatedAt,
                                  )}
                                </span>
                              </span>
                            </span>
                          </button>
                          <button
                            type="button"
                            title="Delete conversation"
                            onClick={(event) =>
                              removeConversation(event, conversation.id)
                            }
                            className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted-foreground opacity-0 hover:bg-[var(--danger-soft)] hover:text-[var(--danger)] group-hover:opacity-100 focus:opacity-100"
                          >
                            {deletingId === conversation.id ? (
                              <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </aside>

          <main className="flex min-h-0 min-w-0 flex-col bg-background">
            <div className="border-b border-border px-4 py-4 sm:px-5">
              <div className="grid gap-3 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                    Client
                  </span>
                  <select
                    value={clientId}
                    disabled={conversationLocked || sending}
                    onChange={(event) => setClientId(event.target.value)}
                    className="h-10 w-full rounded-lg border border-border bg-[var(--surface)] px-3 text-[13px] outline-none focus:border-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="">Agency-wide chat</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                    Mode
                  </span>
                  <select
                    value={mode}
                    disabled={conversationLocked || sending}
                    onChange={(event) => setMode(event.target.value as Mode)}
                    className="h-10 w-full rounded-lg border border-border bg-[var(--surface)] px-3 text-[13px] outline-none focus:border-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {MODES.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <p className="mt-2 text-[11.5px] text-muted-foreground">
                {activeMode.description}
                {conversationLocked
                  ? " Start a new chat to change client or mode."
                  : ""}
              </p>
              {starterContext && !conversationLocked && (
                <div className="mt-3 rounded-lg border border-border bg-[var(--surface-2)] px-3 py-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10.5px] font-medium uppercase tracking-[0.08em] text-[var(--text-faint)]">
                      Context included when sent
                    </span>
                    <button
                      type="button"
                      onClick={() => setStarterContext("")}
                      className="text-[11px] text-muted-foreground hover:text-foreground"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-1 whitespace-pre-wrap text-[11.5px] leading-relaxed text-muted-foreground">
                    {starterContext}
                  </div>
                </div>
              )}
            </div>

            <div className="min-h-[360px] flex-1 overflow-y-auto px-4 py-5 sm:px-6">
              {loadingConversationId ? (
                <div className="grid h-full min-h-[320px] place-items-center">
                  <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Loading conversation…
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <EmptyChat
                  mode={activeMode.label}
                  clientName={clientId ? clientNames.get(clientId) : undefined}
                  onPrompt={setDraft}
                />
              ) : (
                <div className="mx-auto max-w-3xl space-y-5">
                  {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                  {sending && (
                    <div className="flex items-start gap-3">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                        <Sparkles className="h-4 w-4" />
                      </span>
                      <div className="rounded-2xl border border-border bg-[var(--surface)] px-4 py-3">
                        <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                          <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                          Orvio AI is working…
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {(error || conversationsError) && (
              <div className="mx-4 mb-3 rounded-lg border border-[var(--danger)]/30 bg-[var(--danger-soft)] px-3 py-2.5 text-[12.5px] text-[var(--danger)] sm:mx-5">
                {error ||
                  cleanError(
                    conversationsError,
                    "Orvio AI conversations could not be loaded.",
                  )}
              </div>
            )}

            <div className="border-t border-border bg-[var(--surface)] p-3 sm:p-4">
              <div className="mx-auto max-w-3xl">
                <div className="flex items-end gap-2 rounded-xl border border-border bg-background p-2 focus-within:border-[var(--accent)]">
                  <textarea
                    value={draft}
                    disabled={sending}
                    rows={2}
                    maxLength={8_000}
                    placeholder={`Ask Orvio AI about ${clientId ? clientNames.get(clientId) || "this client" : "your agency"}…`}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" &&
                        !event.shiftKey &&
                        !event.nativeEvent.isComposing
                      ) {
                        event.preventDefault();
                        void sendMessage();
                      }
                    }}
                    className="max-h-36 min-h-12 flex-1 resize-none bg-transparent px-2 py-2 text-[13px] leading-relaxed outline-none placeholder:text-[var(--text-faint)] disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => void sendMessage()}
                    disabled={!draft.trim() || sending}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-foreground text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-35"
                    title="Send message"
                  >
                    {sending ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="mt-1.5 text-center text-[10.5px] text-[var(--text-faint)]">
                  Enter to send · Shift+Enter for a new line · Review AI output
                  before using it with clients.
                </div>
              </div>
            </div>
          </main>
        </Card>
      </div>
    </>
  );
}

function EmptyChat({
  mode,
  clientName,
  onPrompt,
}: {
  mode: string;
  clientName?: string;
  onPrompt: (prompt: string) => void;
}) {
  const prompts = clientName
    ? [
        `Give me three practical priorities for ${clientName}.`,
        `What information is missing before I make a recommendation for ${clientName}?`,
        `Draft a concise client-ready update for ${clientName}.`,
      ]
    : [
        "Help me prioritize agency work for this week.",
        "Create a client reporting checklist for my team.",
        "Suggest a practical follow-up process for new leads.",
      ];

  return (
    <div className="grid h-full min-h-[340px] place-items-center">
      <div className="w-full max-w-xl text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-border bg-[var(--surface)] text-[var(--accent)]">
          <Bot className="h-5 w-5" />
        </span>
        <h2 className="mt-4 text-[18px] font-semibold">Start with Orvio AI</h2>
        <p className="mx-auto mt-1 max-w-md text-[13px] leading-relaxed text-muted-foreground">
          {clientName
            ? `Working in ${mode} mode with context for ${clientName}.`
            : `Working in ${mode} mode without a selected client.`}
        </p>
        <div className="mt-5 grid gap-2 text-left sm:grid-cols-3">
          {prompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => onPrompt(prompt)}
              className="rounded-xl border border-border bg-[var(--surface)] p-3 text-[12px] leading-relaxed text-muted-foreground transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)] hover:text-foreground"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ConversationMessage }) {
  const assistant = message.role !== "user";
  return (
    <div className={`flex items-start gap-3 ${assistant ? "" : "justify-end"}`}>
      {assistant && (
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
          <Sparkles className="h-4 w-4" />
        </span>
      )}
      <div
        className={`max-w-[88%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed sm:max-w-[78%] ${
          assistant
            ? "border border-border bg-[var(--surface)] text-foreground"
            : "bg-foreground text-background"
        }`}
      >
        <div className="whitespace-pre-wrap break-words">{message.content}</div>
        {assistant &&
          (message.provider || message.model || message.latencyMs != null) && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-border pt-2 text-[10px] text-[var(--text-faint)]">
              {message.provider && <span>{message.provider}</span>}
              {message.model && (
                <>
                  <span>·</span>
                  <span>{message.model}</span>
                </>
              )}
              {message.latencyMs != null && (
                <>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="h-2.5 w-2.5" />
                    {(message.latencyMs / 1_000).toFixed(1)}s
                  </span>
                </>
              )}
            </div>
          )}
      </div>
    </div>
  );
}
