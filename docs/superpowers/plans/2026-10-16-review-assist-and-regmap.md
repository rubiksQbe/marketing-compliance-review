> **Implemented / historical.** Current notes: `docs/README.md`. Canonical decisions: `src/data/assumptions.ts`.

# Review Assist, Regulation Map, and Next-in-Queue Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a regulation-map slide-over with official links, navigate reviewers to the next pending queue item after decide, and ship hybrid compliance assist (proxy → local key → fallback) that pre-checks findings with where + reason.

**Architecture:** Shared `orderedPendingQueue` for queue sort and post-decide navigation. Static `REGULATION_MAP` drives a drawer component. `assistReview` resolves proxy, optional local key, then heuristics. ReviewPage wires drawer, assist auto-run/pre-check, and next navigation.

**Tech Stack:** Vite, React 19, TypeScript, Tailwind 4, localStorage

## Global Constraints

- Product: ClearPath Financial Market Compliance Review (production-oriented prototype)
- Regulation UI: slide-over; reviewers always; submitters on declined only; no legal-advice disclaimer
- Official links only (CFPB / FRB / FTC / eCFR)
- Next after decide: High → Low then nearest due; else `/queue`; reviewers only
- Concurrency: document only (no fake multi-user lock)
- Assist: hybrid; auto-run on pending open; pre-check codes; show where + reason; never auto-approve
- Credentials: prefer `POST /api/assist`; optional local key in settings for prototype trials
- Spec: `docs/superpowers/specs/2026-10-16-review-assist-and-regmap-design.md`

## File map

| File | Responsibility |
|------|----------------|
| `src/lib/queueOrder.ts` | `orderedPendingQueue` |
| `src/data/regulationMap.ts` | ReasonCode → regimes / note / official URLs |
| `src/components/RegulationMapDrawer.tsx` | Slide-over UI |
| `src/lib/assist/types.ts` | AssistFinding / AssistResult |
| `src/lib/assist/fallback.ts` | Deterministic heuristic assist |
| `src/lib/assist/client.ts` | `assistReview` resolver |
| `src/lib/assist/settings.ts` | localStorage API key get/set |
| `src/pages/ReviewPage.tsx` | Wire drawer, assist, next-in-queue |
| `src/pages/QueuePage.tsx` | Use shared order helper |
| `src/pages/AssistSettingsPage.tsx` or shell entry | Optional local key UI |
| `src/data/assumptions.ts` + evolution | Concurrency + assist notes |
| `docs/api/assist.md` | Proxy contract |

---

### Task 1: Queue order helper

**Files:**
- Create: `src/lib/queueOrder.ts`
- Create: `src/lib/queueOrder.check.ts`
- Modify: `src/pages/QueuePage.tsx`

**Interfaces:**
- Produces: `orderedPendingQueue(requests: ReviewRequest[]): ReviewRequest[]` — pending only, High→Low then `remainingFor` ascending
- Also: `nextPendingAfter(requests: ReviewRequest[], currentId: string): ReviewRequest | undefined`

- [ ] **Step 1: Write failing check** asserting order of a small fixture list and `nextPendingAfter` skip.

- [ ] **Step 2: Implement `queueOrder.ts` and make check pass via Vite SSR.**

- [ ] **Step 3: Refactor QueuePage pending/filtered sort to use `orderedPendingQueue` for pending filter path (keep status filters).**

- [ ] **Step 4: Commit** `Add shared pending queue order helper.`

---

### Task 2: Regulation map data + drawer

**Files:**
- Create: `src/data/regulationMap.ts`
- Create: `src/components/RegulationMapDrawer.tsx`
- Modify: `src/pages/ReviewPage.tsx` (trigger + wire)

**Interfaces:**
- Produces: `REGULATION_MAP`, `RegulationMapDrawer({ open, onClose, codes: ReasonCode[] })`

- [ ] **Step 1: Add REGULATION_MAP for every ReasonCode with real official URLs and notes.**

- [ ] **Step 2: Build slide-over (backdrop, panel, Esc/close, links target=_blank rel=noopener).**

- [ ] **Step 3: On ReviewPage — reviewers: “Why these issues?” under checklist with tier codes; submitters on declined: same near declined panel with declinedCodes. No disclaimer.**

- [ ] **Step 4: Commit** `Add regulation map drawer with official source links.`

---

### Task 3: Next-in-queue after decide

**Files:**
- Modify: `src/pages/ReviewPage.tsx` `onDecide`

- [ ] **Step 1: After `decide(...)`, if reviewer: `const next = nextPendingAfter(visibleRequests, request.id)`; navigate to `/review/${next.id}` or `/queue`.**

- [ ] **Step 2: Confirm submitter path still navigates to `/review/${id}`.**

- [ ] **Step 3: Commit** `Advance reviewers to the next pending request after decide.`

---

### Task 4: Assist fallback + client resolver

**Files:**
- Create: `src/lib/assist/types.ts`
- Create: `src/lib/assist/fallback.ts`
- Create: `src/lib/assist/fallback.check.ts`
- Create: `src/lib/assist/settings.ts`
- Create: `src/lib/assist/client.ts`
- Create: `docs/api/assist.md`

**Interfaces:**
- Produces: `assistReview({ request }): Promise<AssistResult>`
- Settings: `getAssistApiKey(): string | null`, `setAssistApiKey(key: string | null): void`

- [ ] **Step 1: Define types matching the spec.**

- [ ] **Step 2: Implement fallback heuristics (e.g. empty/short disclosures → missing_disclosure; APR claims without APR-ish disclosure → trigger/missing; “guaranteed” → unsubstantiated/misleading; affiliate without relationship language → affiliate_relationship_unclear). Only emit ReasonCodes.**

- [ ] **Step 3: Write check that fallback returns findings with where+reason for a fixture packet.**

- [ ] **Step 4: Implement client: try POST `/api/assist` → else local key provider call (OpenAI-compatible vision chat if key set; keep minimal) → else fallback. Catch errors and fall through.**

- [ ] **Step 5: Document proxy JSON in `docs/api/assist.md`.**

- [ ] **Step 6: Commit** `Add hybrid compliance assist client with heuristic fallback.`

---

### Task 5: Wire assist into ReviewPage + settings

**Files:**
- Modify: `src/pages/ReviewPage.tsx`
- Create: `src/pages/AssistSettingsPage.tsx` (or modal from AppShell for reviewers)
- Modify: `src/App.tsx` route if page
- Modify: `src/components/AppShell.tsx` link for reviewers

- [ ] **Step 1: On pending reviewer open, call `assistReview`; loading + error toast/text; Re-run button.**

- [ ] **Step 2: Render Assist suggestions (label, where, reason). Pre-check `selected` with returned codes ∩ checklist.**

- [ ] **Step 3: Settings UI for optional API key with production-proxy copy.**

- [ ] **Step 4: Commit** `Wire assist suggestions and optional API key settings.`

---

### Task 6: Assumptions docs

**Files:**
- Modify: `src/data/assumptions.ts`
- Modify: `docs/assumptions-evolution.md`

- [ ] **Step 1: Add assumptions for multi-reviewer claim/lock requiring backend; hybrid assist; regulation drawer audience.**

- [ ] **Step 2: Commit** `Document concurrency and assist prototype assumptions.`

---

### Task 7: Verify + PR

- [ ] **Step 1: `npx tsc -b` and helper checks green.**

- [ ] **Step 2: Manual smoke: drawer links, next-in-queue, assist fallback pre-check.**

- [ ] **Step 3: Push and update PR.**

---

## Spec coverage

| Spec item | Task |
|-----------|------|
| Regulation drawer + official links | 2 |
| Submitter declined access | 2 |
| Shared queue order + next after decide | 1, 3 |
| Concurrency docs only | 6 |
| Hybrid assist + fallback | 4, 5 |
| Pre-check + where/reason | 5 |
| Settings local key + proxy docs | 4, 5 |
