import type { OrvioAITaskSuggestionPriority } from "./persistence.server";

export const TASK_RECOMMENDATION_FORMAT_INSTRUCTIONS = [
  "Always end the response with a section labeled exactly: Recommended Tasks",
  "In that section, include only concrete tasks using this format:",
  "- [high] Review the lead follow-up queue — Contact leads older than 24 hours.",
  "Allowed priority labels are low, medium, high, or urgent.",
  "Every task must include one allowed priority label in brackets.",
  "Start every task title with a clear action verb.",
  "Do not put observations, risks, missing information, or general advice in that section.",
  "Tasks must remain useful when there are no clients or performance records yet.",
  "For an empty agency workspace, use relevant setup tasks such as:",
  "- [high] Add first client profile — Create or import the first client and record its goals, market, and contacts.",
  "- [high] Define core service package — Document the primary offer, deliverables, pricing, and ideal customer.",
  "- [medium] Connect Meta and Google reporting — Set up the available ad and reporting integrations.",
  "- [high] Build first lead intake pipeline — Add lead sources, stages, ownership, and follow-up steps.",
  "- [medium] Create onboarding checklist — Define the information, access, assets, and approvals required from a new client.",
  "- [medium] Draft first campaign plan — Outline the objective, audience, offer, channels, creative needs, and launch steps.",
  "Include no more than 7 recommended tasks.",
].join("\n");

type ExtractedTaskSuggestion = {
  title: string;
  description?: string;
  priority?: OrvioAITaskSuggestionPriority;
};

const actionVerbs = new Set([
  "add",
  "analyze",
  "assign",
  "audit",
  "build",
  "call",
  "check",
  "clean",
  "confirm",
  "connect",
  "contact",
  "create",
  "define",
  "draft",
  "fix",
  "follow",
  "implement",
  "improve",
  "launch",
  "optimize",
  "pause",
  "prepare",
  "publish",
  "refresh",
  "remove",
  "replace",
  "research",
  "review",
  "schedule",
  "send",
  "set",
  "test",
  "update",
  "verify",
  "write",
]);

function cleanText(value: string): string {
  return value
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isSafeTitle(title: string): boolean {
  if (title.length < 8 || title.length > 120) return false;
  if (/[?!]$/.test(title)) return false;

  const firstWord = title.match(/^[A-Za-z]+/)?.[0]?.toLowerCase();
  return Boolean(firstWord && actionVerbs.has(firstWord));
}

export function extractTaskSuggestions(
  response: string,
): ExtractedTaskSuggestion[] {
  const lines = response.split(/\r?\n/);
  const headingIndex = lines.findIndex((line) =>
    /^#{0,6}\s*(?:\*\*)?recommended tasks(?:\*\*)?\s*:?\s*$/i.test(
      line.trim(),
    ),
  );
  if (headingIndex === -1) return [];

  const suggestions: ExtractedTaskSuggestion[] = [];
  const seenTitles = new Set<string>();

  for (const rawLine of lines.slice(headingIndex + 1)) {
    const trimmed = rawLine.trim();
    if (!trimmed) continue;
    if (/^#{1,6}\s+\S/.test(trimmed)) break;

    const taskMatch = trimmed.match(
      /^(?:[-*+]|\d+[.)])\s+(?:\[(low|medium|high|urgent)\]\s+)?(.+)$/i,
    );
    if (!taskMatch) continue;

    const priority = taskMatch[1]?.toLowerCase() as
      | OrvioAITaskSuggestionPriority
      | undefined;
    const content = cleanText(taskMatch[2]);
    const separator = content.match(/\s+(?:—|–|-)\s+/);
    const title = cleanText(
      separator ? content.slice(0, separator.index) : content,
    ).replace(/[.;:]$/, "");
    const description = separator
      ? cleanText(content.slice((separator.index ?? 0) + separator[0].length))
      : undefined;
    const normalizedTitle = title.toLowerCase();

    if (!isSafeTitle(title) || seenTitles.has(normalizedTitle)) continue;
    if (description && (description.length < 8 || description.length > 500)) {
      continue;
    }

    seenTitles.add(normalizedTitle);
    suggestions.push({
      title,
      description,
      priority,
    });

    if (suggestions.length === 7) break;
  }

  return suggestions;
}
