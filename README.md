# ClearPath Review

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
