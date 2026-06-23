import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import {
  Bot,
  Check,
  Clock3,
  ListTodo,
  LoaderCircle,
  MessageSquarePlus,
  Send,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

import { Card, PageHeader } from "@/components/bits";
import {
  deleteOrvioAITaskSuggestion,
  deleteOrvioAIConversation,
  getOrvioAIConversation,
  listOrvioAIConversations,
  listOrvioAITaskSuggestions,
  sendOrvioAIMessage,
  updateOrvioAITaskSuggestionStatus,
} from "@/lib/api/ai.functions";
import { getClients } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";

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

type TaskSuggestion = Awaited<
  ReturnType<typeof listOrvioAITaskSuggestions>
>[number];

type TaskSuggestionData = {
  active: TaskSuggestion[];
  history: TaskSuggestion[];
};

type StarterPrompt = {
  category: string;
  label: string;
  mode: Mode;
  prompt: string;
};

const AGENCY_STARTER_PROMPTS: StarterPrompt[] = [
  { category: "Agency growth", label: "Weekly growth plan", mode: "general", prompt: "Give me a weekly agency growth plan." },
  { category: "Agency operations", label: "Prioritize this week", mode: "task_recommendations", prompt: "Help me prioritize agency work this week." },
  { category: "Agency operations", label: "First-client onboarding", mode: "task_recommendations", prompt: "Create a first-client onboarding checklist." },
  { category: "Agency growth", label: "Service packages", mode: "campaign_ideas", prompt: "Generate service package ideas for a Meta/Google ads agency." },
  { category: "Agency growth", label: "Offer positioning", mode: "general", prompt: "Help me position an agency offer for local service businesses." },
  { category: "Agency growth", label: "Outbound plan", mode: "lead_followup", prompt: "Create a simple agency outbound follow-up plan for prospective clients." },
  { category: "Agency operations", label: "Today's actions", mode: "task_recommendations", prompt: "Give me five concrete agency actions to complete today." },
  { category: "Agency operations", label: "Workflow bottlenecks", mode: "task_recommendations", prompt: "Identify common agency workflow bottlenecks and practical fixes." },
  { category: "Agency operations", label: "Reporting process", mode: "task_recommendations", prompt: "Recommend tasks to improve an agency reporting process and data quality." },
  { category: "Agency operations", label: "Client health checklist", mode: "general", prompt: "Create a general client churn-risk and health checklist for an agency." },
  { category: "Agency operations", label: "Retention process", mode: "general", prompt: "Create a repeatable client retention process for an agency." },
  { category: "Campaign planning", label: "Campaign framework", mode: "campaign_ideas", prompt: "Create a reusable paid-media campaign planning framework." },
  { category: "Campaign planning", label: "Testing plan", mode: "campaign_ideas", prompt: "Outline a practical creative and offer testing process for agency clients." },
  { category: "Lead operations", label: "Lead qualification", mode: "lead_followup", prompt: "Create a reusable lead qualification checklist for local service businesses." },
  { category: "Lead operations", label: "Follow-up framework", mode: "lead_followup", prompt: "Create a general five-touch lead follow-up framework." },
  { category: "Reporting", label: "Report template", mode: "report_summary", prompt: "Create a reusable monthly client report template." },
  { category: "Reporting", label: "Reporting agenda", mode: "report_summary", prompt: "Create an agenda for a 30-minute monthly client reporting call." },
  { category: "Creative prompts", label: "Static ad framework", mode: "creative_prompt", prompt: "Create a reusable image-generation prompt framework for static ads." },
];

const CLIENT_STARTER_PROMPTS: StarterPrompt[] = [
  { category: "Client campaign", label: "Campaign angles", mode: "campaign_ideas", prompt: "Give me five campaign angles for the selected client using the available client context." },
  { category: "Client campaign", label: "Offer ideas", mode: "campaign_ideas", prompt: "Develop three compelling offers for the selected client using the available client context." },
  { category: "Client campaign", label: "Ad hooks", mode: "campaign_ideas", prompt: "Write ten ad hooks for the selected client based on the available category and service-area context." },
  { category: "Client campaign", label: "Campaign structure", mode: "campaign_ideas", prompt: "Outline a practical 30-day campaign structure for the selected client." },
  { category: "Client campaign", label: "Retargeting plan", mode: "campaign_ideas", prompt: "Suggest a retargeting plan for the selected client's leads who did not book." },
  { category: "Client follow-up", label: "New lead sequence", mode: "lead_followup", prompt: "Create a five-touch follow-up sequence for the selected client's new leads." },
  { category: "Client follow-up", label: "Missed call SMS", mode: "lead_followup", prompt: "Draft a missed-call SMS for the selected client using the available client context." },
  { category: "Client follow-up", label: "Reactivation message", mode: "lead_followup", prompt: "Draft a reactivation message for the selected client's older leads." },
  { category: "Client report", label: "Performance summary", mode: "report_summary", prompt: "Summarize the selected client's available performance context, including wins, risks, missing data, and next actions." },
  { category: "Client report", label: "Explain CPL", mode: "report_summary", prompt: "Explain the selected client's available CPL and lead data in client-ready language." },
  { category: "Client report", label: "Executive update", mode: "report_summary", prompt: "Draft a brief executive update for the selected client using the available context." },
  { category: "Client tasks", label: "Next steps", mode: "task_recommendations", prompt: "Recommend the next operational steps for the selected client using the available context." },
  { category: "Client creative", label: "Static ad prompt", mode: "creative_prompt", prompt: "Write an original static-ad image prompt for the selected client using its category and service-area context." },
  { category: "Client creative", label: "Short video prompt", mode: "creative_prompt", prompt: "Create a 15-second vertical video prompt for the selected client." },
  { category: "Client health", label: "Churn risk review", mode: "general", prompt: "Assess churn risk for the selected client using all available client context. Give a useful assessment before listing missing data." },
  { category: "Client health", label: "Health check-in", mode: "general", prompt: "Draft a proactive health check-in for the selected client using the available context." },
  { category: "Client health", label: "Retention plan", mode: "general", prompt: "Create a practical 30-day retention plan for the selected client using the available context." },
];

const CLIENT_SPECIFIC_MODES = new Set<Mode>([
  "campaign_ideas",
  "lead_followup",
  "report_summary",
]);

const taskSuggestionsQueryKey = ["orvio-ai-task-suggestions"] as const;

function cleanError(error: unknown, fallback: string): string {
  if (
    error instanceof Error &&
    error.message.length <= 160 &&
    /^(Orvio AI|The Orvio AI)/.test(error.message)
  ) {
    return error.message;
  }
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
  const sendLockRef = useRef(false);
  const [activeConversationId, setActiveConversationId] = useState<string>();
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [clientId, setClientId] = useState("");
  const [mode, setMode] = useState<Mode>(search.mode ?? "general");
  const [draft, setDraft] = useState(search.prompt ?? "");
  const [starterContext, setStarterContext] = useState(search.context ?? "");
  const [loadingConversationId, setLoadingConversationId] = useState<string>();
  const [sending, setSending] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [streamingId, setStreamingId] = useState<string>();
  const [deletingId, setDeletingId] = useState<string>();
  const [updatingTaskId, setUpdatingTaskId] = useState<string>();
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

  const {
    data: taskSuggestions = { active: [], history: [] },
    isLoading: taskSuggestionsLoading,
    error: taskSuggestionsError,
  } = useQuery({
    queryKey: taskSuggestionsQueryKey,
    queryFn: async () => {
      const [suggested, accepted, completed, dismissed] = await Promise.all([
        listOrvioAITaskSuggestions({
          data: { status: "suggested", limit: 20 },
        }),
        listOrvioAITaskSuggestions({
          data: { status: "accepted", limit: 20 },
        }),
        listOrvioAITaskSuggestions({
          data: { status: "completed", limit: 20 },
        }),
        listOrvioAITaskSuggestions({
          data: { status: "dismissed", limit: 20 },
        }),
      ]);

      return {
        active: [...suggested, ...accepted]
          .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
          .slice(0, 20),
        history: [...completed, ...dismissed]
          .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
          .slice(0, 20),
      };
    },
  });

  // Lightweight availability probe — pings /api/ai-health (which checks the
  // proxy + local model) so the user knows the home PC is reachable before they
  // type. Only renders a pill for known JSON states; a non-JSON 404 (e.g. local
  // dev where the Nitro route isn't served) is treated as "unknown" and hidden.
  const { data: aiHealth } = useQuery({
    queryKey: ["ai-health"],
    queryFn: async (): Promise<{ status: string; latencyMs?: number }> => {
      try {
        const res = await fetch("/api/ai-health", {
          headers: { accept: "application/json" },
        });
        const contentType = res.headers.get("content-type") ?? "";
        if (!contentType.includes("application/json")) {
          return { status: "unknown" };
        }
        return await res.json();
      } catch {
        return { status: "unknown" };
      }
    },
    refetchInterval: 45_000,
    staleTime: 30_000,
    retry: 1,
  });

  const clientNames = useMemo(
    () => new Map(clients.map((client) => [client.id, client.name])),
    [clients],
  );
  const activeMode = MODES.find((item) => item.value === mode) ?? MODES[0];
  const conversationLocked = Boolean(activeConversationId);
  const clientSpecificModeWithoutClient =
    !clientId && CLIENT_SPECIFIC_MODES.has(mode);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  // Local inference is slow (8-30s on the 6GB card). Show a live elapsed counter
  // so a long wait reads as "working", not "hung".
  useEffect(() => {
    if (!sending) return;
    setElapsed(0);
    const startedAt = Date.now();
    const id = setInterval(
      () => setElapsed(Math.round((Date.now() - startedAt) / 1000)),
      1000,
    );
    return () => clearInterval(id);
  }, [sending]);

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
    if (sendLockRef.current) return;
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
    if (sendLockRef.current || loadingConversationId) return;
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
    if (
      !window.confirm(
        "Delete this conversation? This action cannot be undone.",
      )
    ) {
      return;
    }
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
    if (!message || sendLockRef.current) return;
    sendLockRef.current = true;

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

    const refreshAfterSend = async (resultMode: string) => {
      await queryClient.invalidateQueries({
        queryKey: ["orvio-ai-conversations"],
      });
      if (resultMode === "task_recommendations") {
        await queryClient.invalidateQueries({
          queryKey: taskSuggestionsQueryKey,
        });
      }
    };

    // Preferred path: stream tokens live via /api/ai-stream. Returns true once a
    // user message has been persisted server-side (the `meta` event) — past that
    // point we never fall back, to avoid double-sending. Returns false if the
    // route is unreachable (e.g. local dev, where Nitro routes aren't served) or
    // errors before `meta`, in which case the optimistic message is untouched and
    // the non-streaming server function takes over.
    const trySendStreaming = async (): Promise<boolean> => {
      let token: string | undefined;
      try {
        const { data } = await supabase.auth.getSession();
        token = data.session?.access_token;
      } catch {
        return false;
      }
      if (!token) return false;

      let response: Response;
      try {
        response = await fetch("/api/ai-stream", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message,
            conversationId: activeConversationId,
            clientId: clientId || undefined,
            mode,
            context: starterContext || undefined,
          }),
        });
      } catch {
        return false;
      }

      const contentType = response.headers.get("content-type") ?? "";
      if (
        !response.ok ||
        !response.body ||
        !contentType.includes("text/event-stream")
      ) {
        return false;
      }

      const placeholderId = `streaming-${Date.now()}`;
      let committed = false;
      let placeholderAdded = false;
      let finalized = false;
      let assistantText = "";
      let streamedMode: string = mode;

      const handle = (payload: { type: string; [key: string]: unknown }) => {
        if (payload.type === "meta") {
          committed = true;
          streamedMode = (payload.mode as string) ?? mode;
          setActiveConversationId(payload.conversationId as string);
          setMessages((current) =>
            current.map((item) =>
              item.id === optimisticId
                ? { ...item, id: payload.userMessageId as string }
                : item,
            ),
          );
        } else if (payload.type === "delta") {
          assistantText += String(payload.text ?? "");
          if (!placeholderAdded) {
            placeholderAdded = true;
            setStreamingId(placeholderId);
            setMessages((current) => [
              ...current,
              {
                id: placeholderId,
                role: "assistant",
                content: assistantText,
                model: null,
                provider: null,
                latencyMs: null,
                metadata: { mode: streamedMode },
                createdAt: new Date().toISOString(),
              },
            ]);
          } else {
            setMessages((current) =>
              current.map((item) =>
                item.id === placeholderId
                  ? { ...item, content: assistantText }
                  : item,
              ),
            );
          }
        } else if (payload.type === "done") {
          finalized = true;
          setMessages((current) =>
            current.map((item) =>
              item.id === placeholderId
                ? {
                    ...item,
                    id: (payload.assistantMessageId as string) ?? item.id,
                    content: assistantText,
                    model: (payload.model as string) ?? null,
                    provider: (payload.provider as string) ?? null,
                    latencyMs: (payload.latencyMs as number) ?? null,
                  }
                : item,
            ),
          );
        } else if (payload.type === "error") {
          finalized = true;
          setMessages((current) =>
            current.filter((item) => item.id !== placeholderId),
          );
          setError(
            typeof payload.message === "string"
              ? payload.message
              : "Orvio AI could not complete the request.",
          );
        }
      };

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const data = trimmed.slice(5).trim();
            if (!data) continue;
            try {
              handle(JSON.parse(data) as { type: string });
            } catch {
              // ignore a malformed SSE line
            }
          }
        }
      } catch {
        // stream broke mid-flight; handled by the finalized check below
      }

      if (!committed) return false;

      if (!finalized) {
        setMessages((current) =>
          current.filter((item) => item.id !== placeholderId),
        );
        setError(
          "Orvio AI was interrupted before finishing. Please try again.",
        );
      }
      await refreshAfterSend(streamedMode);
      return true;
    };

    try {
      const streamed = await trySendStreaming();

      if (!streamed) {
        // Fallback: non-streaming server function (also the local-dev path).
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
        await refreshAfterSend(result.mode);
      }
    } catch (sendError) {
      setMessages((current) =>
        current.filter((item) => item.id !== optimisticId),
      );
      setDraft(message);
      setError(
        cleanError(
          sendError,
          "Orvio AI could not complete the request. Please try again.",
        ),
      );
      await queryClient.invalidateQueries({
        queryKey: ["orvio-ai-conversations"],
      });
    } finally {
      sendLockRef.current = false;
      setSending(false);
      setStreamingId(undefined);
    }
  }

  async function updateTaskStatus(
    taskSuggestionId: string,
    status: "accepted" | "dismissed" | "completed",
  ) {
    if (updatingTaskId) return;
    setUpdatingTaskId(taskSuggestionId);
    setError(undefined);

    try {
      const updatedTask = await updateOrvioAITaskSuggestionStatus({
        data: { taskSuggestionId, status },
      });

      queryClient.setQueryData<TaskSuggestionData>(
        taskSuggestionsQueryKey,
        (current = { active: [], history: [] }) => {
          const existing = [...current.active, ...current.history].find(
            (task) => task.id === taskSuggestionId,
          );
          if (!existing) return current;

          const task = { ...existing, ...updatedTask };
          return status === "accepted"
            ? {
                active: [
                  task,
                  ...current.active.filter(
                    (item) => item.id !== taskSuggestionId,
                  ),
                ],
                history: current.history.filter(
                  (item) => item.id !== taskSuggestionId,
                ),
              }
            : {
                active: current.active.filter(
                  (item) => item.id !== taskSuggestionId,
                ),
                history: [
                  task,
                  ...current.history.filter(
                    (item) => item.id !== taskSuggestionId,
                  ),
                ],
              };
        },
      );
      await queryClient.invalidateQueries({
        queryKey: taskSuggestionsQueryKey,
      });
    } catch {
      setError("The task suggestion could not be updated. Please try again.");
    } finally {
      setUpdatingTaskId(undefined);
    }
  }

  async function deleteTaskSuggestion(taskSuggestionId: string) {
    if (updatingTaskId) return;
    setUpdatingTaskId(taskSuggestionId);
    setError(undefined);

    try {
      await deleteOrvioAITaskSuggestion({ data: { taskSuggestionId } });
      queryClient.setQueryData<TaskSuggestionData>(
        taskSuggestionsQueryKey,
        (current = { active: [], history: [] }) => ({
          active: current.active.filter(
            (task) => task.id !== taskSuggestionId,
          ),
          history: current.history.filter(
            (task) => task.id !== taskSuggestionId,
          ),
        }),
      );
      await queryClient.invalidateQueries({
        queryKey: taskSuggestionsQueryKey,
      });
    } catch {
      setError("The task suggestion could not be deleted. Please try again.");
    } finally {
      setUpdatingTaskId(undefined);
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
        actions={<AIHealthPill status={aiHealth?.status} />}
      />

      <div className="px-4 pb-8 sm:px-6">
        <Card className="grid min-h-[680px] overflow-hidden lg:h-[calc(100vh-150px)] lg:min-h-[620px] lg:grid-cols-[290px_minmax(0,1fr)]">
          <aside className="flex min-h-0 flex-col border-b border-border bg-[var(--surface)] lg:border-b-0 lg:border-r">
            <div className="border-b border-border p-3">
              <button
                type="button"
                onClick={startNewChat}
                disabled={sending}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-foreground px-3 text-[13px] font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
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
                              ? "border border-[var(--accent)]/35 bg-[var(--accent-soft)]"
                              : "hover:bg-[var(--surface-2)]/70"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => openConversation(conversation)}
                            aria-current={active ? "page" : undefined}
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
                                  Updated{" "}
                                  {formatConversationTime(
                                    conversation.updatedAt,
                                  )}
                                </span>
                              </span>
                            </span>
                          </button>
                          <button
                            type="button"
                            title="Delete conversation permanently"
                            aria-label={`Delete ${conversation.title || "conversation"}`}
                            disabled={Boolean(deletingId) || sending}
                            onClick={(event) =>
                              removeConversation(event, conversation.id)
                            }
                            className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted-foreground opacity-0 hover:bg-[var(--danger-soft)] hover:text-[var(--danger)] disabled:cursor-not-allowed disabled:opacity-30 group-hover:opacity-100 focus:opacity-100"
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
              {clientsLoaded && clients.length === 0 && (
                <p className="mt-2 rounded-lg border border-dashed border-border bg-[var(--surface-2)]/55 px-3 py-2 text-[11.5px] leading-relaxed text-muted-foreground">
                  No clients yet. Orvio AI still works agency-wide.{" "}
                  <Link
                    to="/app/clients"
                    className="font-medium text-foreground underline decoration-border underline-offset-2 hover:decoration-foreground"
                  >
                    Add your first client
                  </Link>{" "}
                  when you are ready for client-specific context.
                </p>
              )}
              {clientSpecificModeWithoutClient && (
                <p className="mt-2 text-[11.5px] text-muted-foreground">
                  Select a client for a client-specific assessment, or run this
                  as a general agency checklist.
                </p>
              )}
              {mode === "task_recommendations" && (
                <p className="mt-1.5 flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
                  <ListTodo className="h-3.5 w-3.5 text-[var(--accent)]" />
                  Concrete recommendations may be saved as suggested tasks for
                  review.
                </p>
              )}
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
                  hasSelectedClient={Boolean(clientId)}
                  firstConversation={conversations.length === 0}
                  onPrompt={(starter) => {
                    setMode(starter.mode);
                    setDraft(starter.prompt);
                  }}
                />
              ) : (
                <div className="mx-auto max-w-3xl space-y-5">
                  {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                  {sending && !streamingId && (
                    <div className="flex items-start gap-3">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                        <Sparkles className="h-4 w-4" />
                      </span>
                      <div className="rounded-2xl border border-border bg-[var(--surface)] px-4 py-3">
                        <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                          <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                          <span>
                            Thinking with local model…
                            {elapsed > 0 && (
                              <span className="ml-1 tabular-nums text-[var(--text-faint)]">
                                {elapsed}s
                              </span>
                            )}
                          </span>
                        </div>
                        {elapsed >= 15 && (
                          <div className="mt-1.5 pl-[22px] text-[11px] text-[var(--text-faint)]">
                            Local inference on your home hardware can take a moment.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <SuggestedTasksPanel
              activeTasks={taskSuggestions.active}
              historyTasks={taskSuggestions.history}
              loading={taskSuggestionsLoading}
              updatingTaskId={updatingTaskId}
              onStatusChange={updateTaskStatus}
              onDelete={deleteTaskSuggestion}
            />

            {(error || conversationsError || taskSuggestionsError) && (
              <div className="mx-4 mb-3 rounded-lg border border-[var(--danger)]/30 bg-[var(--danger-soft)] px-3 py-2.5 text-[12.5px] text-[var(--danger)] sm:mx-5">
                {error ||
                  cleanError(
                    conversationsError || taskSuggestionsError,
                    "Orvio AI data could not be loaded.",
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

function AIHealthPill({ status }: { status?: string }) {
  const states: Record<string, { dot: string; label: string }> = {
    up: { dot: "var(--success)", label: "Local model online" },
    down: { dot: "var(--danger)", label: "Model offline" },
    unconfigured: { dot: "var(--warning)", label: "Not configured" },
    local_dev: { dot: "var(--text-faint)", label: "Dev mode" },
  };
  const state = status ? states[status] : undefined;
  // Hide entirely for unknown/loading so we never flash a misleading "offline".
  if (!state) return null;

  return (
    <span
      title="Live status of the local Orvio AI model"
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-[var(--surface)] px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: state.dot }}
      />
      {state.label}
    </span>
  );
}

function SuggestedTasksPanel({
  activeTasks,
  historyTasks,
  loading,
  updatingTaskId,
  onStatusChange,
  onDelete,
}: {
  activeTasks: TaskSuggestion[];
  historyTasks: TaskSuggestion[];
  loading: boolean;
  updatingTaskId?: string;
  onStatusChange: (
    taskSuggestionId: string,
    status: "accepted" | "dismissed" | "completed",
  ) => Promise<void>;
  onDelete: (taskSuggestionId: string) => Promise<void>;
}) {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <section className="border-t border-border bg-[var(--surface)] px-4 py-3 sm:px-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ListTodo className="h-4 w-4 text-[var(--accent)]" />
          <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--text-faint)]">
            Suggested Tasks
          </span>
        </div>
        <div className="flex items-center gap-3">
          {historyTasks.length > 0 && (
            <button
              type="button"
              onClick={() => setShowHistory((current) => !current)}
              className="text-[11px] font-medium text-muted-foreground hover:text-foreground"
            >
              {showHistory ? "Hide history" : `History (${historyTasks.length})`}
            </button>
          )}
          <span className="text-[11px] text-muted-foreground">
            {activeTasks.length} active
          </span>
        </div>
      </div>

      {loading ? (
        <div className="mt-3 flex items-center gap-2 text-[12px] text-muted-foreground">
          <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
          Loading suggested tasks…
        </div>
      ) : activeTasks.length === 0 ? (
        <p className="mt-2 text-[11.5px] text-muted-foreground">
          No active tasks. New recommendations saved by Orvio AI will appear
          here.
        </p>
      ) : (
        <div className="mt-2 max-h-52 space-y-2 overflow-y-auto pr-1">
          {activeTasks.map((task) => (
            <TaskSuggestionCard
              key={task.id}
              task={task}
              updating={updatingTaskId === task.id}
              showStatusActions
              actionsDisabled={Boolean(updatingTaskId)}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {showHistory && historyTasks.length > 0 && (
        <div className="mt-3 border-t border-border pt-3">
          <div className="mb-2 text-[10.5px] font-medium uppercase tracking-[0.08em] text-[var(--text-faint)]">
            Completed and dismissed
          </div>
          <div className="max-h-40 space-y-2 overflow-y-auto pr-1">
            {historyTasks.map((task) => (
              <TaskSuggestionCard
                key={task.id}
                task={task}
                updating={updatingTaskId === task.id}
                actionsDisabled={Boolean(updatingTaskId)}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function TaskSuggestionCard({
  task,
  updating,
  showStatusActions = false,
  actionsDisabled,
  onStatusChange,
  onDelete,
}: {
  task: TaskSuggestion;
  updating: boolean;
  showStatusActions?: boolean;
  actionsDisabled: boolean;
  onStatusChange: (
    taskSuggestionId: string,
    status: "accepted" | "dismissed" | "completed",
  ) => Promise<void>;
  onDelete: (taskSuggestionId: string) => Promise<void>;
}) {
  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[12.5px] font-medium">{task.title}</div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <TaskBadge value={task.priority || "No priority"} kind="priority" />
            <TaskBadge value={task.status} kind="status" />
            {task.clientName && (
              <span className="text-[10.5px] text-muted-foreground">
                {task.clientName}
              </span>
            )}
          </div>
        </div>
        {updating && (
          <LoaderCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 animate-spin text-muted-foreground" />
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {showStatusActions && task.status !== "accepted" && (
          <TaskAction
            disabled={actionsDisabled}
            onClick={() => void onStatusChange(task.id, "accepted")}
          >
            <Check className="h-3 w-3" />
            Accept
          </TaskAction>
        )}
        {showStatusActions && (
          <>
            <TaskAction
              disabled={actionsDisabled}
              onClick={() => void onStatusChange(task.id, "completed")}
            >
              Complete
            </TaskAction>
            <TaskAction
              disabled={actionsDisabled}
              onClick={() => void onStatusChange(task.id, "dismissed")}
            >
              <X className="h-3 w-3" />
              Dismiss
            </TaskAction>
          </>
        )}
        <TaskAction
          danger
          disabled={actionsDisabled}
          onClick={() => void onDelete(task.id)}
        >
          <Trash2 className="h-3 w-3" />
          Delete
        </TaskAction>
      </div>
    </div>
  );
}

function TaskBadge({
  value,
  kind,
}: {
  value: string;
  kind: "priority" | "status";
}) {
  const emphasized =
    value === "urgent" || value === "high" || value === "accepted";
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[9.5px] font-medium capitalize ${
        emphasized
          ? "border-[var(--accent)]/25 bg-[var(--accent-soft)] text-[var(--accent)]"
          : kind === "status"
            ? "border-border bg-[var(--surface-2)] text-muted-foreground"
            : "border-border text-muted-foreground"
      }`}
    >
      {value}
    </span>
  );
}

function TaskAction({
  children,
  danger = false,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { danger?: boolean }) {
  return (
    <button
      type="button"
      className={`inline-flex h-7 items-center gap-1 rounded-md border px-2 text-[10.5px] font-medium disabled:cursor-not-allowed disabled:opacity-40 ${
        danger
          ? "border-[var(--danger)]/25 text-[var(--danger)] hover:bg-[var(--danger-soft)]"
          : "border-border text-muted-foreground hover:bg-[var(--surface-2)] hover:text-foreground"
      }`}
      {...props}
    >
      {children}
    </button>
  );
}

function EmptyChat({
  mode,
  clientName,
  hasSelectedClient,
  firstConversation,
  onPrompt,
}: {
  mode: string;
  clientName?: string;
  hasSelectedClient: boolean;
  firstConversation: boolean;
  onPrompt: (starter: StarterPrompt) => void;
}) {
  const prompts = hasSelectedClient
    ? [...CLIENT_STARTER_PROMPTS, ...AGENCY_STARTER_PROMPTS]
    : AGENCY_STARTER_PROMPTS;

  return (
    <div className="mx-auto flex min-h-[340px] w-full max-w-4xl flex-col justify-center py-4">
      <div className="text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-border bg-[var(--surface)] text-[var(--accent)]">
          <Bot className="h-5 w-5" />
        </span>
        <h2 className="mt-4 text-[18px] font-semibold">
          {firstConversation ? "Meet Orvio AI" : "Start a new chat"}
        </h2>
        <p className="mx-auto mt-1 max-w-md text-[13px] leading-relaxed text-muted-foreground">
          {hasSelectedClient
            ? `Working in ${mode} mode with context for ${clientName || "the selected client"}.`
            : `Working in ${mode} mode without a selected client.`}
        </p>
        <p className="mx-auto mt-2 max-w-2xl text-[12px] leading-relaxed text-muted-foreground">
          Use Orvio AI for campaign ideas, lead follow-up, client reports, task
          recommendations, creative prompts, and churn or client-health
          planning. Choose a starter below to prefill the composer—nothing
          sends until you review it.
        </p>
      </div>

      <div className="mt-5 max-h-[310px] overflow-y-auto rounded-xl border border-border bg-[var(--surface)] p-3">
        <div className="grid gap-2 text-left sm:grid-cols-2 lg:grid-cols-3">
          {prompts.map((starter) => (
            <button
              key={`${starter.category}-${starter.label}`}
              type="button"
              onClick={() => onPrompt(starter)}
              className="rounded-lg border border-border bg-background p-3 text-left transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)]"
            >
              <span className="block text-[9.5px] font-medium uppercase tracking-[0.08em] text-[var(--accent)]">
                {starter.category}
              </span>
              <span className="mt-1 block text-[12px] font-medium text-foreground">
                {starter.label}
              </span>
              <span className="mt-1 block line-clamp-2 text-[10.5px] leading-relaxed text-muted-foreground">
                {starter.prompt}
              </span>
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
