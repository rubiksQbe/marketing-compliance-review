# ClearPath Review Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a focused ClearPath Review web app that replaces Excel/email compliance marketing review with a risk-tiered queue, structured intake, single-screen decisions, and audit trails — deployed on GitHub Pages.

**Architecture:** Client-only Vite React SPA with localStorage persistence and seeded demo data. Four purposeful routes (queue, submit, review, audit) plus an assumptions log. No backend/auth.

**Tech Stack:** Vite, React 19, TypeScript, Tailwind CSS, React Router, shadcn-style primitives, GitHub Pages via `gh-pages` or Actions.

## Global Constraints

- Only surfaces from design §4: Queue, Submit, Review workspace, Audit trail, Assumptions
- Track assumptions A1–A10 in-app
- Static deploy suitable for GitHub Pages (`base` path configurable)
- No extraneous CRM/campaign/AI auto-approve features
- Brand: ClearPath Financial / ClearPath Review; slate + teal; Fraunces + Source Sans 3
- Demo persona switcher (Reviewer / Marketer), not real auth

---

### Task 1: Scaffold Vite app + DesignFlow wireframes

**Files:**
- Create: Vite React-TS app at repo root
- Create: `wireframes/` via DesignFlow for interactive iteration
- Create: `.gitignore`, `README.md`

- [ ] **Step 1:** Scaffold with `npm create vite@latest tmp-scaffold -- --template react-ts`, move to root
- [ ] **Step 2:** Add Tailwind, React Router, path alias
- [ ] **Step 3:** `npx designflow@0.3.1 init wireframes --name clearpath-review` for React wireframe iteration
- [ ] **Step 4:** Commit scaffold

### Task 2: Domain model + seed data + store

**Files:**
- Create: `src/lib/types.ts`, `src/lib/risk.ts`, `src/lib/storage.ts`, `src/data/seed.ts`, `src/lib/store.tsx`

- [ ] **Step 1:** Define `Request`, `AuditEvent`, enums for product/channel/status/risk
- [ ] **Step 2:** Implement `suggestRiskTier()` from product/channel/claim flags
- [ ] **Step 3:** Seed 6–8 realistic pending/approved/changes_requested items
- [ ] **Step 4:** Context store: list, get, submit, decide, reset; persist localStorage
- [ ] **Step 5:** Commit

### Task 3: Shell chrome + Queue + Submit

**Files:**
- Create: `src/components/AppShell.tsx`, `src/pages/QueuePage.tsx`, `src/pages/SubmitPage.tsx`, UI primitives as needed

- [ ] **Step 1:** App shell with ClearPath brand, persona switcher, nav limited to purposeful links
- [ ] **Step 2:** Queue with filters, SLA urgency, metrics, empty state
- [ ] **Step 3:** Submit form with validation blocking incomplete intake; risk suggestion
- [ ] **Step 4:** Commit

### Task 4: Review workspace + Audit + Assumptions

**Files:**
- Create: `src/pages/ReviewPage.tsx`, `src/pages/AuditPage.tsx`, `src/pages/AssumptionsPage.tsx`

- [ ] **Step 1:** Review: asset + checklist + decision panel; reason codes required
- [ ] **Step 2:** Audit event timeline per request
- [ ] **Step 3:** Assumptions page listing A1–A10
- [ ] **Step 4:** Commit

### Task 5: Polish, README, GitHub Pages deploy

**Files:**
- Modify: `vite.config.ts` base, `package.json` scripts
- Create: `.github/workflows/deploy.yml` if needed
- Create/Update: `README.md`

- [ ] **Step 1:** Visual polish, motion, responsive layouts, error states
- [ ] **Step 2:** Configure GH Pages build (`base: './'` or repo name)
- [ ] **Step 3:** Start local preview on uncommon port; verify flows
- [ ] **Step 4:** Push; enable Pages deploy; record live URL
- [ ] **Step 5:** Final commit + push
