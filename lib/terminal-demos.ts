import type { Locale } from "./i18n";

/**
 * Content for the interactive terminal on the featured project cards.
 * Kept in the site (not in content/projects) because `npm run sync` overwrites that folder.
 *
 * Line kinds: "cmd" is typed out after a "$" prompt, "out" is plain output,
 * "ok" / "warn" are highlighted results, "dim" is secondary output.
 */
export type TerminalLineKind = "cmd" | "out" | "ok" | "warn" | "dim";
export type TerminalLine = { kind: TerminalLineKind; text: string };

/** Folder names inside each repo that `cd frontend` / `cd backend` open on GitHub. */
export const REPO_DIRS: Record<string, { frontend: string; backend: string; branch: string }> = {
  "ai-agents-platform": { frontend: "frontend", backend: "backend", branch: "main" },
  "ai-observability-incident-response": { frontend: "frontend", backend: "backend", branch: "main" },
  "ai-notes": { frontend: "ai-notes-frontend", backend: "ai-notes-backend", branch: "main" },
  "workout-tracker": { frontend: "frontend", backend: "backend", branch: "main" },
};

const DEMOS: Record<string, Record<Locale, TerminalLine[]>> = {
  "ai-agents-platform": {
    pl: [
      { kind: "cmd", text: 'agent run "porównaj cennik.pdf z rynkiem i wyślij raport"' },
      { kind: "dim", text: "plan → readDocument · webSearch · generateReport · sendEmail" },
      { kind: "ok", text: "✓ readDocument    cennik.pdf · 24 pozycje" },
      { kind: "ok", text: "✓ webSearch       6 źródeł" },
      { kind: "ok", text: "✓ generateReport  raport.html · 2 wykresy" },
      { kind: "warn", text: "⏸ sendEmail wymaga akceptacji (email:send)" },
    ],
    en: [
      { kind: "cmd", text: 'agent run "compare pricing.pdf with the market and email a report"' },
      { kind: "dim", text: "plan → readDocument · webSearch · generateReport · sendEmail" },
      { kind: "ok", text: "✓ readDocument    pricing.pdf · 24 rows" },
      { kind: "ok", text: "✓ webSearch       6 sources" },
      { kind: "ok", text: "✓ generateReport  report.html · 2 charts" },
      { kind: "warn", text: "⏸ sendEmail needs approval (email:send)" },
    ],
  },
  "ai-observability-incident-response": {
    pl: [
      { kind: "cmd", text: "curl -X POST /api/ingest/errors -H 'X-Api-Key: obs_…'" },
      { kind: "dim", text: "202 Accepted · w kolejce ingestu" },
      { kind: "cmd", text: 'incident analyze "Skok 5xx w checkout-api"' },
      { kind: "out", text: "oś czasu: deploy v1.42.3 → +38 błędów → P95 1.8 s" },
      { kind: "ok", text: "✓ fakty: 4 · hipotezy: 2 (pewność: wysoka)" },
      { kind: "warn", text: "→ podejrzane: [deployment v1.42.3]" },
    ],
    en: [
      { kind: "cmd", text: "curl -X POST /api/ingest/errors -H 'X-Api-Key: obs_…'" },
      { kind: "dim", text: "202 Accepted · queued for ingest" },
      { kind: "cmd", text: 'incident analyze "5xx spike in checkout-api"' },
      { kind: "out", text: "timeline: deploy v1.42.3 → +38 errors → P95 1.8 s" },
      { kind: "ok", text: "✓ facts: 4 · hypotheses: 2 (confidence: high)" },
      { kind: "warn", text: "→ suspect: [deployment v1.42.3]" },
    ],
  },
  "ai-notes": {
    pl: [
      { kind: "cmd", text: 'ask "co ustaliliśmy o wdrożeniu?"' },
      { kind: "dim", text: "embedding zapytania → 5 najtrafniejszych notatek" },
      { kind: "ok", text: "✓ odpowiedź ze źródłami: „Plan wdrożenia”, „Retro #12”" },
      { kind: "cmd", text: 'agent "podsumuj notatki o kliencie w projekcie Q4"' },
      { kind: "out", text: "search_notes · get_note ×3 · create_note" },
      { kind: "ok", text: "✓ utworzono „Podsumowanie: klient” w Q4" },
    ],
    en: [
      { kind: "cmd", text: 'ask "what did we decide about the rollout?"' },
      { kind: "dim", text: "query embedding → top 5 matching notes" },
      { kind: "ok", text: '✓ answer with sources: "Rollout plan", "Retro #12"' },
      { kind: "cmd", text: 'agent "summarise the client notes in project Q4"' },
      { kind: "out", text: "search_notes · get_note ×3 · create_note" },
      { kind: "ok", text: '✓ created "Summary: client" in Q4' },
    ],
  },
};

export function getTerminalDemo(slug: string, locale: Locale): TerminalLine[] {
  return DEMOS[slug]?.[locale] ?? [];
}
