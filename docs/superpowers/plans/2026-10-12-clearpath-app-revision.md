# ClearPath Review — Main App Revision Plan

> **For agentic workers:** Implement task-by-task. Commit after each task.

**Goal:** Revise `src/` to match locked PRD + companion decisions (landing A, persona homes, branded mesh, locked review workspace).

**Architecture:** Vite + React 19 + TS + Tailwind 4 + HashRouter + localStorage store. Phosphor icons. No backend.

**Tech stack:** Existing package; add `@phosphor-icons/react`; remove `lucide-react` usage.

---

## File map

| File | Responsibility |
|------|----------------|
| `src/index.css` | Brand tokens, mesh, fonts, scrollbar, button utilities |
| `src/lib/types.ts` | Domain types (source, partner, reason codes, personas) |
| `src/lib/store.tsx` | Session identity + scoped selectors + decisions |
| `src/data/seed.ts` | Demo requests for Ava / Sam / queue |
| `src/data/findings.ts` | Rejection reasons + suggested fixes |
| `src/pages/LandingPage.tsx` | Role cards |
| `src/pages/IdentityPage.tsx` | Submitter (and reviewer) demo pick |
| `src/pages/QueuePage.tsx` | Reviewer home |
| `src/pages/MinePage.tsx` | Submitter “Your submitted requests” |
| `src/pages/SubmitPage.tsx` | Structured intake |
| `src/pages/ReviewPage.tsx` | Locked dual-pane workspace |
| `src/pages/AuditPage.tsx` | Audit trail |
| `src/pages/AssumptionsPage.tsx` | Assumptions log |
| `src/components/*` | Shell, badges, buttons |
| `src/App.tsx` | Routes |
| `.github/workflows/deploy.yml` | GitHub Pages |
| `README.md` | Run + deploy |

---

### Task 1: Tokens, fonts, Phosphor, types, findings, seed

Update CSS variables + mesh; wire Google fonts; install Phosphor; expand types/reason codes; seed with source/partner.

### Task 2: Session store + landing + shell

Role landing → identity → persona homes; AppShell nav by persona; switch identity.

### Task 3: Queue + Mine + Submit

Reviewer queue metrics/SLA; submitter scoped list; validated intake with source.

### Task 4: Review workspace + Audit + Assumptions

Implement locked layout (§11b PRD); audit separate; assumptions page current.

### Task 5: Build, run, README, Pages workflow, commit/push

`npm run build`; dev on 43123; README; gh-pages workflow.
