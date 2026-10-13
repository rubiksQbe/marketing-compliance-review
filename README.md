# ClearPath Financial Marketing Compliance Review

Internal compliance marketing review workbench for **ClearPath Financial** (fictional) — personal loans, credit cards, and mortgage prequalification marketed online, including affiliate channels.

## Problem

Compliance marketing review via **Excel + email** bottlenecks growth: lost ownership, incomplete submissions, uniform review depth, unstructured feedback, and weak audit evidence.

## Solution

**ClearPath Review** increases compliance throughput with:

1. **Risk-tiered queue** — highest risk and nearest SLA first  
2. **Structured intake** — incomplete submissions cannot enter the queue  
3. **One-screen review** — 2/3 package + 1/3 disposition rail  
4. **Automatic audit trail** — every decision is timestamped with reason codes  

PRD: `docs/prd/clearpath-review-prd.md`  
Design spec: `docs/superpowers/specs/2026-10-12-clearpath-compliance-review-design.md`  
Assumptions & locked decisions: `src/data/assumptions.ts` (landing: **Demo notes · key assumptions**)  
Critique & evolution notes: `docs/assumptions-evolution.md`

## Key Decisions

- The main architecture choice is shifting from an inefficient, messy workflow of emails (between internal marketers/affiliate managers and the compliance marketing team) and Excel (requires lots of manual input and upkeep) to a system that simplifies handoff of materials and organizes those for the user.
- Role-based landing page because there are two main users (who both matter in the goal of increasing the compliance team's throughput): submitters and reviewers.
- The risk-tiered queue not only structures how the reviewer carries out the review process, but it also has higher-risk requests go through more thorough review. Thus, amount of time and attention scales depending on the risk.
- Key assumption is that the company already has a pre-existing pre-approved asset library that would prevent materials that don't need compliance review from cluttering the team's workflow. That means the system is built to specifically handle custom promotional materials that warrant review.
- It is assumed that affiliate partner marketers aren't interfacing directly with the compliance team at ClearPath. They'd send their materials for publishing to a ClearPath Affiliate Manager, whose job is to make sure the packets are complete such that they can submit it for review. Therefore only complete materials ready for review are seen my the compliance marketing team. The AM's workflow might become the new bottleneck (which is outside the scope of this system).
- I chose specifically to have binary Approve/Decline decisions instead of having a third "Return and Request Changes" review option (initially suggested by AI) because the review process is easier when one can map 1+ compliance issues to one outcome and 0 to the other. The default assumption is that if it is declined, it is because it needs revisions.
- Standardized compliance issue codes and auto-suggested remediation (fixes) make the whole process more streamlined.

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123).

```bash
npm run build
npm run preview
```

## Demo flow

1. **Landing** — choose Review or Submit, then a demo identity  

2. **Identity** — Jordan Lee (reviewer), Ava Chen (internal marketer), or Sam Ortiz (affiliate manager)  
3. **Reviewer** sees the org-wide queue; **submitters** see only **Your submitted requests**  
4. Open **CP-1042** to use the locked review workspace (Approve, or check findings → Decline)  

Data persists in `localStorage`. Header **Reset** restores the seed dataset. **Switch** returns to the landing role cards.

## GitHub Pages

Static SPA (`HashRouter`, `base: './'`).

1. Push to a GitHub repository  
2. Settings → Pages → Source: **GitHub Actions**  
3. Workflow: `.github/workflows/deploy-pages.yml`  

Or: `npm run build && npm run deploy` (`gh-pages` branch).

## Stack

Vite · React 19 · TypeScript · Tailwind CSS 4 · React Router · Phosphor Icons · Sen + Spectral
