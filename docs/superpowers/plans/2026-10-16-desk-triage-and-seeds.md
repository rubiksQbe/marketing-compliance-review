> **Implemented / historical.** Current notes: `docs/README.md`. Canonical decisions: `src/data/assumptions.ts`.

# Desk-style Assist triage + robust seeds Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand Assist to desk-style triage (summary + findings + creative callouts) and replace seeds with ~20 realistic promo packets that showcase triage offline, with no pending due under 12h.

**Architecture:** Extend `AssistResult` and sanitize paths in `client.ts`; enrich `fallbackAssist` to emit summary/callouts from policy rules; render new blocks on `ReviewPage`; rewrite `seed.ts` with SVG data-URL proofs and planted issues; bump storage to v7; expand Vite SSR checks.

**Tech Stack:** Vite, React 19, TypeScript, Tailwind 4, localStorage

## Global Constraints

- Spec: `docs/superpowers/specs/2026-10-16-robust-seed-and-assist-design.md`
- Never auto-Approve; human decides
- Pending remaining ≥ 12h; High seed-only `slaHours: 24`
- No large binary images — small SVG data URLs only
- Heuristics work from packet fields alone (no assistHint)

---

### Task 1: Assist types + fallback summary/callouts

**Files:**
- Modify: `src/lib/assist/types.ts`
- Modify: `src/lib/assist/fallback.ts`
- Modify: `src/lib/assist/fallback.check.ts`
- Modify: `src/lib/assist/client.ts`
- Modify: `docs/api/assist.md`

**Interfaces:**
- Produces: `AssistResult { summary, findings, callouts, source }`; `AssistCallout { id, label, detail, relatedCodes? }`

- [ ] **Step 1:** Extend types with `summary`, `callouts`, `AssistCallout`.
- [ ] **Step 2:** Expand `fallbackAssist` rules + always return non-empty `summary` and callouts (≥1 when findings; clean packets get neutral “regions inspected” callouts + “no policy hits” summary).
- [ ] **Step 3:** Update `client.ts` sanitize to require summary string; default callouts `[]`; LLM/proxy JSON schema includes new fields; prompt asks for summary + callouts + findings.
- [ ] **Step 4:** Update `fallback.check.ts` assertions for summary/callouts; run via Vite SSR / `npx tsx`.
- [ ] **Step 5:** Update `docs/api/assist.md`; commit.

### Task 2: Review UI triage panel

**Files:**
- Modify: `src/pages/ReviewPage.tsx`
- Modify: `src/pages/AssistSettingsPage.tsx` (copy only)

- [ ] **Step 1:** Render Summary and Creative callouts above/beside findings; keep Where/Reason and source badge.
- [ ] **Step 2:** Assist settings: note that fallback always triages; key upgrades LLM/vision.
- [ ] **Step 3:** `npx tsc -b`; commit.

### Task 3: Seed library + storage v7 + seed/assist checks

**Files:**
- Modify: `src/data/seed.ts` (full rewrite)
- Create: `src/data/seedProofs.ts` (SVG data URL helpers)
- Modify: `src/lib/storage.ts` (v7)
- Create: `src/data/seed.check.ts` (remaining ≥12h, planted codes via fallbackAssist)
- Modify: `src/data/assumptions.ts` if High seed SLA needs a note

- [ ] **Step 1:** Add compact SVG proof helper (headline + disclosure bands).
- [ ] **Step 2:** Author CP-1050–1065 pending + ~5–6 decided per spec tables; plant issues for fallback.
- [ ] **Step 3:** Bump storage key to v7.
- [ ] **Step 4:** Seed check script: pending remaining ≥12; decline seeds match primary codes; clean seeds zero findings; all have summary.
- [ ] **Step 5:** Run checks + tsc; commit; push; update PR.

### Task 4: Manual smoke

- [ ] Reset demo → Jordan → CP-1050: SVG proof, summary, findings, callouts, pre-checks.
- [ ] Confirm no pending overdue / due &lt;12h on queue.
- [ ] Push evidence if needed.
