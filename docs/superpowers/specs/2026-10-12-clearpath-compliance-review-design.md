# ClearPath Review — Design Spec

**Date:** 2026-10-12  
**Product:** ClearPath Review (internal compliance marketing workbench)  
**Company:** ClearPath Financial (fictional) — national consumer finance; personal loans, credit cards, mortgage prequalification; markets via typical channels including affiliates.

---

## 1. Problem

ClearPath’s compliance marketing review runs on **Excel trackers + email threads**. As affiliate and digital volume grows, that process bottlenecks growth:

- No single source of truth for who owns a review
- Incomplete submissions cause rework loops
- All assets get the same full review depth
- Feedback is unstructured and hard to action
- Audit evidence is scattered and unreliable

**Key issue to solve:** Replace fragmented Excel/email review with a **risk-tiered, structured review workbench** that increases compliance team throughput without weakening controls.

**Secondary goal:** Intuitive UX so reviewers decide in one focused screen and marketers submit review-ready work.

---

## 2. Assumptions (tracked)

| ID | Assumption | Design implication |
|----|------------|--------------------|
| A1 | Primary daily user is the **compliance reviewer**; marketers submit; leads need queue health | Default home = reviewer queue; submit + audit are secondary surfaces |
| A2 | Assets span ads, emails, LPs, social, affiliate creatives across loans / cards / mortgage | Intake captures product + channel + asset type |
| A3 | Human sign-off and timestamped audit trail are mandatory for regulated claims | Approve/reject/changes-requested produce immutable event log (client-side demo) |
| A4 | Risk-tiered routing raises throughput more than raw headcount | Auto-suggest risk tier from product/channel/claims; SLA differs by tier |
| A5 | Incomplete intake is a major rework driver | Block submit until required fields + disclosure checklist present |
| A6 | Structured rejection reasons beat freeform email | Decision requires reason codes; optional note |
| A7 | v1 is a demoable static app (GitHub Pages); no real auth/backend | Seed data + localStorage persistence |
| A8 | Success metrics: median time-in-queue, rework rate, % reviews with complete audit | Surface queue metrics on home; show audit completeness |
| A9 | Extraneous CRM/campaign builders dilute the product | Out of scope for v1 |
| A10 | Brand should feel trustworthy consumer-finance ops tooling, not consumer marketing site | Calm professional UI; ClearPath brand as product chrome |

---

## 3. Approaches considered

### A — Reviewer workbench (chosen)
Risk-tiered queue → structured intake → single-screen review → structured decisions → audit trail.

- **Pros:** Directly attacks bottleneck; tight scope; strong UX focus  
- **Cons:** Doesn’t replace creative production tools  

### B — Full campaign lifecycle platform
Brief → create → multi-approver → publish → monitor.

- **Pros:** Visionary  
- **Cons:** Too broad; slow to value; lots of unused UI  

### C — Template library first
Pre-approved modules so many assets skip review.

- **Pros:** Long-term leverage  
- **Cons:** Doesn’t fix today’s queue; needs mature claim library first  

**Decision:** Approach A.

---

## 4. Product surfaces (only what serves the goals)

### 4.1 Queue (home)
- Filterable list: status, risk tier, product, SLA urgency
- Metrics strip: pending count, at-risk SLA, median wait (seeded/demo)
- Purpose: help reviewers pull the highest-value next item

### 4.2 Submit request
- Marketer form: title, product, channel, asset type, audience, claim flags, copy/URL, disclosures
- Auto risk suggestion with override
- Purpose: make every submission review-ready (A5)

### 4.3 Review workspace
- One composition: asset preview | applicable checklist | decision panel
- Actions: Approve / Request changes / Reject — with reason codes
- Purpose: maximize decisions per hour (throughput)

### 4.4 Audit trail
- Per-request event history (submitted, reviewed, decided, reasons)
- Purpose: satisfy A3 without Excel archaeology

**Explicitly out of scope:** auth, multi-tenant admin, AI auto-approve, creative editor, affiliate portal, analytics warehouse, notifications integrations.

---

## 5. Information architecture

```
/                 → Queue (default)
/submit           → Structured intake
/review/:id       → Review workspace
/audit/:id        → Audit trail for a request
/assumptions      → Living assumptions log (transparency)
```

Roles simulated via a simple persona switcher (Reviewer / Marketer) — no login (A7).

---

## 6. Data model (client)

```ts
Request {
  id, title, product, channel, assetType, audience,
  body, destinationUrl, disclosures[],
  claimFlags[], riskTieruggested, riskTier,
  status: draft|pending|changes_requested|approved|rejected,
  slaHours, submittedAt, updatedAt,
  assignee?,
  events: AuditEvent[]
}
AuditEvent { id, at, actor, action, detail?, reasonCodes? }
```

Persistence: `localStorage` with seed dataset reset.

---

## 7. UX principles (tied to goals)

1. **One job per screen** — queue picks work; review decides; submit intakes; audit proves.
2. **No cards in hero/chrome noise** — operational density without dashboard theater.
3. **Decision within one viewport** on desktop review screen.
4. **Keyboard-friendly primary actions** on review (approve / changes / reject).
5. **Empty, loading, error states** for queue and missing request IDs.
6. **Everything justified** — if a control doesn’t raise throughput or auditability, cut it.

---

## 8. Visual direction

- Brand: **ClearPath Financial** + product name **ClearPath Review**
- Direction: precise fintech ops — deep slate, clear teal accent, warm paper surfaces (avoid purple gradients, cream+terracotta cliché, broadsheet density)
- Typography: expressive but readable — e.g. "Fraunces" for brand wordmark, "Source Sans 3" for UI
- Motion: subtle queue row enter, SLA pulse for at-risk, decision confirmation

---

## 9. Tech stack

- Vite + React + TypeScript + Tailwind
- shadcn/ui primitives where needed (Button, Input, Select, Badge, Textarea)
- Deploy: GitHub Pages (`base` path aware)
- Ideation: Superpowers brainstorming + DesignFlow interactive React renderer for wireframe iteration

---

## 10. Success criteria for this deliverable

1. Deployed GitHub Pages URL + GitHub repository
2. Reviewer can clear a pending item with structured decision in ≤3 clicks from queue
3. Marketer cannot submit without required compliance fields
4. Every decision writes an audit event
5. Assumptions page documents A1–A10
6. No extraneous navigation or features beyond §4

---

## 11. Research inputs (summary)

Industry practice for financial marketing compliance emphasizes: risk-tiered routing, structured intake, mandatory checklists, consolidated feedback, SLA/escalation, and timestamped audit trails — with humans retaining final approval. Excel/email fails these systematically; a focused workbench addresses them without building a full martech suite.
