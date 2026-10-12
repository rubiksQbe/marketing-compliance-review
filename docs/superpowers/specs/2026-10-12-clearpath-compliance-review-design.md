# ClearPath Review — Design Spec

**Date:** 2026-10-12  
**Product:** ClearPath Review (internal compliance marketing workbench)  
**Company:** ClearPath Financial (fictional) — national consumer finance; personal loans, credit cards, mortgage prequalification; markets via typical channels including affiliates.

---

## 1. Problem

ClearPath’s compliance marketing review runs on **Excel trackers + email threads**. As affiliate and digital volume grows, that process bottlenecks growth.

**Key issue to solve:** The compliance marketing team’s **throughput** — not creative tooling, not campaign planning — is the constraint on shipping more offers safely.

**Secondary goal:** Intuitive UX so reviewers decide in one focused screen and marketers submit review-ready work.

### Operating model assumption (submitter paths)

**Submitters into this portal are ClearPath employees only:**
- **Internal marketers** — ClearPath-owned campaigns (email, web, paid, etc.)
- **Affiliate managers** — partner/custom affiliate creatives, submitted *on behalf of* affiliates

**External affiliates are not portal users in v1.**

We also assume a **pre-approved creative library** already exists (or is being stood up in parallel). Affiliates should use those assets whenever possible. Custom (non-library) affiliate creatives follow:

1. Affiliate formats a complete custom-creative request (copy, URL, channel, disclosures, etc.).
2. Affiliate forwards it to their **affiliate manager**.
3. Affiliate manager checks completeness and sends it back if incomplete — **before** compliance ever sees it.
4. Only then does the affiliate manager **submit into ClearPath Review** for compliance decisioning.
5. Compliance reviews in a risk-tiered queue; status/feedback return to the affiliate manager (who relays to the partner).

Internal marketers may submit directly into the portal (no affiliate-manager gate), still using the same structured intake.

### As-is process (assumed)

Today’s review loop is informal and dual-channel:

1. Internal marketers and affiliate managers send promotional materials via email — copy, links, screenshots, attachments, often incomplete; affiliates often email managers in similarly unstructured ways.
2. Compliance marketing **manually logs** those items into a spreadsheet (owner, status, dates are inconsistent).
3. Reviewers work the pile in a **non-standardized order** while checking consumer-protection requirements (UDAAP, Reg Z / TILA advertising triggers, affiliate relationship clarity, firm policy).
4. Feedback goes back **via email**, often without structured reason codes.
5. Status for submitters is opaque; audit evidence is scattered across inbox + spreadsheet.

### To-be process (Approach A)

1. **Upstream completeness (outside or at the edge of this product)** — affiliate manager rejects incomplete partner packets before portal entry; portal intake also blocks incomplete fields.
2. **Standardized portal intake** — internal marketers and affiliate managers submit review-ready packets (`Source: Internal | Affiliate partner`).
3. **Shared risk-tiered compliance queue** — compliance pulls by risk + SLA urgency.
4. **One-screen review** — asset + checklist + decision together.
5. **Structured feedback + status** — visible to the submitting marketer/affiliate manager on **their** items only.
6. **Automatic audit trail** — who decided what, when, and why.

### Scope boundary (explicit)

| In scope (this portal) | Out of scope (v1) |
|------------------------|-------------------|
| Compliance reviewer queue + decide + audit | External affiliate self-serve portal |
| Structured intake for internal marketers & affiliate managers | Building/managing the pre-approved creative library UI |
| Status/feedback for the employee submitter | Affiliate ↔ affiliate manager collaboration workspace |
| Risk tiering / reason codes | Live post-publication affiliate monitoring |

**Bottleneck honesty:** Making compliance faster can surface the next constraint in the affiliate → affiliate manager intake loop. That may become the new bottleneck — and fixing *that* is a different product (partner portal / AM intake tool). This task’s goal is compliance-team throughput; we design the portal so incomplete affiliate work is filtered **before** it consumes reviewer time, without trying to rebuild the whole partner channel stack.

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
| P8 | **Marketers and reviewers share one workflow but different jobs.** Marketers need “submit correctly + track my items”; reviewers need “decide quickly across the org queue.” | Dual-persona ops tools beat separate systems that recreate email handoffs. | Persona-aware homes; one underlying request object; scoped marketer visibility (A1b). |
| P9 | Solving creative production or full campaign ops **does not unlock** the stated bottleneck. | Brief says Excel/email *review* is the constraint. | No campaign builder / CMS / CRM in v1. |
| P10 | A thin demo with real workflow shape beats a broad platform shell. | For this deliverable, persuasion = walk a request from intake → decision → audit. | Four purposeful screens only. |

**North-star metric (assumed):** increase **compliant decisions per reviewer-hour** while holding or improving audit completeness and first-pass quality.

---

## 2. Product / delivery assumptions (tracked)

| ID | Assumption | Design implication |
|----|------------|--------------------|
| A1 | Primary daily user is the **compliance reviewer**; marketers are secondary submitters | **Persona-aware home:** reviewers land on the full risk-tiered queue; marketers land on **My submissions** (not the team queue) |
| A1b | Employee submitters should not see peers’ in-flight reviews by default (pre-launch claims, unreleased offers, partner-specific creatives) | Submitter visibility is scoped to requests they submitted; compliance retains org-wide queue visibility |
| A1c | Portal submitters are **internal marketers** and **affiliate managers** only; external affiliates are not users | Submit form includes `Source: Internal \| Affiliate partner` (+ partner name when affiliate) |
| A1d | A **pre-approved creative library** exists (or is being stood up); custom affiliate work is the exception path | Product copy/empty states reinforce “use library first”; portal optimizes custom-review throughput, not library browsing |
| A1e | Affiliate managers perform a completeness gate **before** portal submission | Compliance queue receives fewer incomplete affiliate packets; AM↔affiliate tooling stays out of scope |
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

### 4.1 Reviewer queue (reviewer home)
- Filterable org-wide list: status, risk tier, product, SLA urgency
- Metrics strip: pending count, at-risk SLA, median wait (seeded/demo)
- Purpose: help reviewers pull the highest-value next item
- **Not shown to marketers as their landing view**

### 4.1b My submissions (submitter home — internal marketer or affiliate manager)
- List scoped to the current employee submitter’s requests only
- Status + latest feedback/reason codes visible per item
- CTA to submit new material (`Source: Internal | Affiliate partner`)
- Purpose: relevant progress tracking without exposing peers’ in-flight work (A1b)

### 4.2 Submit request
- Marketer form: title, product, channel, asset type, audience, claim flags, copy/URL, disclosures
- Auto risk suggestion with override
- Purpose: make every submission review-ready (A5)

### 4.3 Review workspace (locked)
- One composition: left **2/3** package card | right **1/3** sticky disposition rail
- Equal-height dual scroll; auto-hide scrollbars; action bar pinned
- Header: back + risk/SLA chips → title → Submitted by (partner when affiliate)
- Package: Creative (image or text by asset type) → Destination (link) → Disclosures → Classification → Claims → Intake notes
- Exception checklist (findings); requested changes autopopulate as **fix text only**
- Default **Approve**; any checked finding morphs action to **Decline** (codes stored in audit; not shown in requested-changes box)
- Purpose: maximize decisions per hour (throughput)

### 4.4 Audit trail
- Per-request event history (submitted, reviewed, decided, reasons)
- Purpose: satisfy A3 without Excel archaeology

**Explicitly out of scope:** auth, multi-tenant admin, AI auto-approve, creative editor, affiliate portal, analytics warehouse, notifications integrations.

---

## 5. Information architecture

```
/                 → Persona-aware home
                    Reviewer  → org-wide risk-tiered queue
                    Marketer  → My submissions (scoped)
/submit           → Structured intake
/review/:id       → Review workspace (reviewer; marketer read-only on own items)
/audit/:id        → Audit trail (reviewer: any; marketer: own items only)
/assumptions      → Living assumptions log (transparency)
```

### Landing & identity (decision)

**Landing (locked — Option A):** full-screen **role cards first** — ClearPath Review brand, then two choices: **Compliance reviewer** or **Submitter**.  
If Submitter, next step is demo employee identity (Ava / Sam), then **Your submitted requests**.  
That split is intentional: the two jobs need different homes; a shared queue is the wrong first screen for submitters.

**Submitter home practice:** prefer **“Your submitted requests”** (scoped to the current person), not an org-wide list with name tags.

| Approach | Fits submitter goals? | Confidentiality (A1b) | Auth cost |
|----------|----------------------|------------------------|-----------|
| Personalized “Your requests” | Best — status/feedback on *my* work | Good | Needs identity |
| Org-wide list + “submitted by” tags | Weak — noisy, wrong default | Weak | None |

**v1 delivery compromise (A7):** no real login/backend on GitHub Pages. Instead:
1. Landing role picker (Reviewer vs Submitter)
2. If Submitter — pick a **demo employee identity** (e.g. Sam Ortiz — Affiliate manager, Ava Chen — Internal marketer)
3. Home shows only requests where `submitter === selected identity`
4. Reviewer identity (Jordan Lee) sees the org-wide queue

This preserves the *correct product shape* (personalized submitter home) without shipping authentication. A production build would replace the demo identity picker with SSO/login; the IA stays the same.

Demo actors: reviewer `Jordan Lee` (sees all); submitters `Sam Ortiz` (affiliate manager) / `Ava Chen` (internal marketer) (each sees only their submissions).

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

## 8. Visual direction (locked)

- Brand wordmark: **ClearPath Financial** in **Sen Regular 400**
- Product emphasis: **ClearPath Review** with **Spectral Regular 400** for serif moments
- Anchors: navy `#1a3a5c` · steel `#5a8faa` · mist `#c9d4dc` · canvas `#f5f8fa` · forest `#2d4a3e` plus full navy/steel/mist/canvas/forest 50–950 scales (PRD §10)
- Buttons: default steel-400; hover navy-800; loading mist-200; approve forest-400; focus = **soft halo**; label weight **500**
- Secondary ghost: no fill/border; always Phosphor icon + label
- Text contrast: navy-800/900 on light surfaces; no light steel body/link text
- Background mesh **locked:** BR3 bottom-right steel stack (top clear), steel peak opacity `0.53`, forest bottom ellipse `72%` wide — CSS in PRD §10.7
- Icons: **Phosphor Icons** only; **no emoji**
- Buttons: minimally rounded (not pills); hover / focus / loading states required
- Motion: subtle queue enter, SLA pulse, decision confirmation

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
