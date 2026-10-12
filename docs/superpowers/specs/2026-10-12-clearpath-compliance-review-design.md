# ClearPath Review — Design Spec

**Date:** 2026-10-12  
**Product:** ClearPath Review (internal compliance marketing workbench)  
**Company:** ClearPath Financial (fictional) — national consumer finance; personal loans, credit cards, mortgage prequalification; markets via typical channels including affiliates.

---

## 1. Problem

ClearPath’s compliance marketing review runs on **Excel trackers + email threads**. As affiliate and digital volume grows, that process bottlenecks growth.

**Key issue to solve:** The compliance marketing team’s **throughput** — not creative tooling, not campaign planning — is the constraint on shipping more offers safely.

**Secondary goal:** Intuitive UX so reviewers decide in one focused screen and marketers submit review-ready work.

---

## 1b. Pain-point assumptions (customer jobs & friction)

These are the exact assumptions about *who hurts* and *how*. They drive Approach A.

| ID | Pain assumption | Why it’s reasonable | What “good” looks like |
|----|-----------------|---------------------|------------------------|
| P1 | **Marketing volume is rising faster than compliance headcount**, especially via affiliates and digital variants. | Consumer finance growth is channel-driven; each variant is another regulated communication. | Queue absorbs volume without linear hiring. |
| P2 | The bottleneck is **cycle time + rework**, not lack of judgment skill. Reviewers are skilled; the process wastes their attention. | Industry pattern: same disclosure/claim issues recur; incomplete packets bounce. | More first-pass-ready items; fewer email round-trips. |
| P3 | **Excel + email destroy ownership and priority.** Nobody has a trusted “what’s next / who’s holding it / what’s late.” | Shared spreadsheets + threads are classic failure modes for approval workflows. | One queue with status, owner, SLA urgency. |
| P4 | **Incomplete submissions** (missing disclosures, unclear claims, wrong product context) cause most avoidable delay. | Reg Z / UDAAP reviews need facts up front; without them every review becomes discovery. | Intake blocks until required context exists. |
| P5 | **Not all assets deserve equal review depth.** An APR affiliate banner ≠ a brand awareness ad with no claims. | Risk-tiering is standard in compliance ops; uniform full review is the throughput killer. | High-risk gets deep checklist; low-risk clears faster. |
| P6 | **Unstructured feedback doesn’t scale learning.** Freeform email comments don’t prevent the next marketer from repeating the mistake. | Recurring reject reasons (disclosures, firm policy, misleading claims) dominate real programs. | Reason codes + notes marketers can act on. |
| P7 | **Auditability is non-negotiable**, even when speed is the goal. Exam/inquiry readiness is part of the job. | CFPB/Reg Z programs expect documented review before use; “approved in Slack” fails under scrutiny. | Every decision writes who / when / what / why. |
| P8 | **Marketers and reviewers share one workflow but different jobs.** Marketers need “submit correctly”; reviewers need “decide quickly.” | Dual-persona ops tools beat separate systems that recreate email handoffs. | Submit vs Review surfaces; one underlying request object. |
| P9 | Solving creative production or full campaign ops **does not unlock** the stated bottleneck. | Brief says Excel/email *review* is the constraint. | No campaign builder / CMS / CRM in v1. |
| P10 | A thin demo with real workflow shape beats a broad platform shell. | For this deliverable, persuasion = walk a request from intake → decision → audit. | Four purposeful screens only. |

**North-star metric (assumed):** increase **compliant decisions per reviewer-hour** while holding or improving audit completeness and first-pass quality.

---

## 2. Product / delivery assumptions (tracked)

| ID | Assumption | Design implication |
|----|------------|--------------------|
| A1 | Primary daily user is the **compliance reviewer**; marketers submit; leads need queue health | Default home = reviewer queue; submit + audit are secondary surfaces |
| A2 | Assets span ads, emails, LPs, social, affiliate creatives across loans / cards / mortgage | Intake captures product + channel + asset type |
| A3 | Human sign-off and timestamped audit trail are mandatory for regulated claims | Approve/reject/changes-requested produce immutable event log (client-side demo) |
| A4 | Risk-tiered routing raises throughput more than raw headcount | Auto-suggest risk tier from product/channel/claims; SLA differs by tier |
| A5 | Incomplete intake is a major rework driver | Block submit until required fields + disclosures present |
| A6 | Structured rejection reasons beat freeform email | Decision requires reason codes; optional note |
| A7 | v1 is a demoable static app (GitHub Pages); no real auth/backend | Seed data + localStorage persistence |
| A8 | Success metrics: median time-in-queue, rework signals, audit completeness | Surface queue metrics on home; full event history per request |
| A9 | Extraneous CRM/campaign builders dilute the product | Out of scope for v1 |
| A10 | Brand should feel trustworthy consumer-finance ops tooling, not consumer marketing site | Calm professional UI; ClearPath brand as product chrome |

---

## 3. Architecture decision: Approach A (chosen)

### Options considered

| Option | Shape | Verdict |
|--------|-------|---------|
| **A — Reviewer workbench** | Risk-tiered queue → structured intake → one-screen decide → audit | **Chosen** |
| **B — Full campaign lifecycle** | Brief → create → multi-approver → publish → monitor | Rejected for v1 — solves adjacent jobs, not the stated bottleneck |
| **C — Template library first** | Pre-approved modules so many assets skip review | Deferred — high leverage later, doesn’t fix today’s queue ownership/rework/audit |

### Why we solve it this way (Approach A)

We treat the product as an **operating system for review decisions**, not a marketing suite.

1. **Attack the constraint named in the brief** — Excel/email review process, not creative production (P9, P10).  
2. **Raise reviewer throughput** by removing coordination waste: one queue, clear priority, one decision screen (P2, P3).  
3. **Prevent rework before it hits the queue** with structured intake (P4).  
4. **Spend scarce judgment where risk is real** via tiered checklists/SLA (P5).  
5. **Make feedback reusable** with reason codes (P6).  
6. **Keep speed from undermining control** with automatic audit events (P7).  
7. **Serve both personas without rebuilding email** — submit + review on one request record (P8).

### Why A is the best fit (product intuition)

- **Best problem–solution fit:** A maps 1:1 to the pain chain (submit poorly → wait in opaque queue → review with missing context → email feedback → resubmit → weak record). B and C each skip a link in that chain.  
- **Highest leverage per UI surface:** Four jobs (pick work, submit ready work, decide, prove) cover P1–P8 without dashboard theater.  
- **Correct sequencing:** Templates (C) work *after* you can see recurring reason codes and risk patterns from a real queue — A generates that learning loop. Lifecycle platforms (B) assume review is already a solved subsystem.  
- **Demo honesty:** A stranger can feel the before/after in minutes: incomplete submit blocked → high-risk item surfaces → decide with codes → audit exists. That is better product storytelling than a half-built “platform.”  
- **YAGNI under regulation:** Shipping AI auto-approve, affiliate portals, or publish controls early adds risk and UI without proving the core loop.

**Decision locked:** Approach A — Reviewer workbench.

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
