# Product Requirements Document — ClearPath Review

**Status:** Draft for review (pre-implementation alignment)  
**Date:** 2026-10-12  
**Company:** ClearPath Financial (fictional)  
**Product:** ClearPath Review  
**Related spec:** `docs/superpowers/specs/2026-10-12-clearpath-compliance-review-design.md`

---

## 1. Summary

ClearPath Review is an internal web app that replaces Excel + email for **compliance marketing review**. It increases **compliance team throughput** by standardizing intake from employee submitters (internal marketers and affiliate managers), risk-tiering the review queue, consolidating decisions into one screen, and writing an automatic audit trail.

External affiliates are **not** users of this portal.

---

## 2. Problem

### 2.1 Business context

ClearPath offers personal loans, credit cards, and mortgage prequalification online, marketed through typical channels including affiliates. Growth increases the volume of promotional materials that must be reviewed against consumer-protection expectations (e.g. UDAAP clarity, Reg Z / TILA advertising triggers, disclosures, firm policy) before use.

### 2.2 As-is (assumed)

1. Internal marketers and affiliate managers email promotional materials (often incomplete).
2. Affiliates with custom (non-library) creatives send packets to their affiliate manager first — today that handoff is also unstructured.
3. Compliance logs items into a spreadsheet and reviews in a non-standardized order.
4. Feedback returns by email without structured reason codes.
5. Status and audit evidence are scattered.

### 2.3 Core problem statement

**The compliance marketing team’s review process — not creative production — is the growth bottleneck.** Throughput is limited by incomplete intake, opaque ownership, uniform review depth, unstructured feedback, and weak records.

---

## 3. Goals

### 3.1 Primary goal

Increase **compliant decisions per reviewer-hour** without weakening controls.

### 3.2 Secondary goal

Intuitive flows for both personas: reviewers decide quickly; submitters submit complete packets and track **their own** status/feedback.

### 3.3 Non-goals (v1)

- External affiliate self-serve portal
- Building/managing the pre-approved creative library UI
- Affiliate ↔ affiliate manager collaboration workspace
- Live post-publication monitoring
- Real SSO/auth/backend
- Campaign briefing, creative editing, CRM, publish tooling
- AI auto-approve

---

## 4. Users & personas

| Persona | Role | Home | Sees |
|---------|------|------|------|
| **Jordan Lee** | Compliance reviewer | Org-wide risk-tiered queue | All requests |
| **Ava Chen** | Internal marketer (submitter) | Your submitted requests | Only Ava’s requests |
| **Sam Ortiz** | Affiliate manager (submitter) | Your submitted requests | Only Sam’s requests |

**Landing (locked):** Option A — full-screen role cards (Compliance reviewer / Submitter). Submitters then pick a demo employee identity.

**Production note:** Demo identity picker stands in for SSO; IA stays the same when real auth is added.

---

## 5. Operating model assumptions

| ID | Assumption |
|----|------------|
| P1–P10 | Pain model in design spec (volume > headcount, rework, ownership, incomplete intake, risk tiers, reason codes, audit, dual jobs, no campaign suite, sharp demo) |
| A1–A10 | Product/delivery assumptions in design spec |
| A1b | Submitters do not see peers’ in-flight reviews by default |
| A1c | Portal submitters = internal marketers + affiliate managers only |
| A1d | Pre-approved creative library exists (or is stood up in parallel); custom affiliate work is the exception path |
| A1e | Affiliate managers completeness-gate partner packets **before** portal submission |
| Landing A | Role cards first, then submitter identity |

**Upstream bottleneck honesty:** Speeding compliance may surface affiliate → AM intake as the next constraint. Fixing that is out of scope for this portal.

---

## 6. User journeys

### 6.1 Reviewer

1. Land → choose **Compliance reviewer** → enter as Jordan.  
2. See risk-tiered queue (SLA urgency, filters, metrics).  
3. Open item → one-screen review (asset + checklist + decision).  
4. Approve / request changes / reject (reason codes required for non-approvals).  
5. Audit trail updated automatically.

### 6.2 Internal marketer

1. Land → **Submitter** → Ava.  
2. **Your submitted requests** + status/feedback.  
3. Submit new request (`Source: Internal`) with required fields.  
4. Incomplete packets blocked.  
5. Later: see decision + reason codes on own items only.

### 6.3 Affiliate manager

1. Land → **Submitter** → Sam.  
2. Same home as marketer, scoped to Sam.  
3. After offline completeness check with affiliate, submit (`Source: Affiliate partner` + partner name).  
4. Relay compliance feedback to the affiliate outside this product.

---

## 7. Functional requirements

### Must have (v1)

| ID | Requirement |
|----|-------------|
| FR1 | Role-card landing → reviewer or submitter path |
| FR2 | Demo identity selection for submitters (and reviewer) |
| FR3 | Reviewer org-wide queue with risk, status, SLA cues, basic metrics |
| FR4 | Submitter “Your submitted requests” scoped by identity |
| FR5 | Structured submit form with validation; risk suggestion; source field |
| FR6 | Review workspace: preview + tiered checklist + decision panel |
| FR7 | Reason codes required for changes requested / reject |
| FR8 | Per-request audit timeline |
| FR9 | In-app assumptions log (pain + product assumptions) |
| FR10 | localStorage persistence + reset demo; HashRouter for GitHub Pages |

### Nice to have (only if they stay thin)

| ID | Requirement |
|----|-------------|
| FR11 | Keyboard shortcuts on review (A / C / R) |
| FR12 | Highlight at-risk SLA items |

### Explicitly out

Affiliate portal, library CMS, notifications integrations, multi-approver matrix, real auth.

---

## 8. Success metrics (demo-measurable proxies)

| Metric | Proxy in v1 |
|--------|-------------|
| Reviewer throughput | Pending → decided in ≤3 clicks from queue |
| Rework reduction | Submit blocked until required fields present |
| Audit completeness | 100% of decisions create an event |
| Submitter clarity | Submitter never sees org-wide queue as home |

---

## 9. Information architecture

```
/entry                 Role cards (Landing A)
/entry/submitter       Demo identity picker (Ava / Sam)
/queue                 Reviewer home
/mine                  Submitter home — Your requests
/submit                Structured intake
/review/:id            Review workspace
/audit/:id             Audit trail (scoped by persona)
/assumptions           Assumptions log
```

---

## 10. Branding (locked)

**Direction:** airy fintech-ops surface inspired by mesh-gradient product landings (Highnote-like atmosphere), adapted for an internal compliance tool — not a consumer loan promo site.

### 10.1 Core palette

| Token | Hex | Use |
|-------|-----|-----|
| `navy` | `#1a3a5c` | Primary text/ink, key headings, button **hover** fill |
| `steel` | `#5a8faa` | Base accent; **default** primary button fill |
| `steelBright` | `#7eb3cc` | Mesh blob (brighter steel) — decorative only |
| `mist` | `#c9d4dc` | Borders, dividers; button **loading** fill |
| `canvas` | `#f5f8fa` | Page base / mesh field |
| `forest` | `#2d4a3e` | Deep positive text on light surfaces |
| `forestBright` | `#3f7a5c` | **Approve** button fill; mesh blob (brighter forest) |

### 10.2 Expanded interaction states

| State | Rule | Hex (working) | Text on fill |
|-------|------|---------------|-------------|
| Default (primary) | steel fill | `#5a8faa` | `#ffffff` (high contrast — not light blue) |
| Hover | navy fill | `#1a3a5c` | `#ffffff` |
| Focus | **one-layer** border only (no outer glow/ring stack) | `2px solid #1a3a5c` on steel fill | `#ffffff` |
| Loading | mist fill | `#c9d4dc` | `#1a3a5c` (dark ink on mist) |
| Approve default | forestBright | `#3f7a5c` | `#ffffff` |
| Approve hover | forest | `#2d4a3e` | `#ffffff` |
| Danger | — | `#9b2c2c` | `#ffffff` |
| Danger soft bg | — | `#fde8e8` | `#9b2c2c` |
| Warning / SLA | — | `#9a6b2f` / `#f3e7d3` | dark on soft |

**Contrast rules:** All body/UI text uses navy (`#1a3a5c`) or darker on canvas/white. **Avoid light-blue text** (`steel`/`steelBright` are for fills, borders, and mesh — not paragraph/link copy on light backgrounds). Links use navy + underline or navy weight change.

### 10.3 Typography

| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Logo / company wordmark | **Sen** | Regular 400 | Exact string: `ClearPath Financial` |
| Serif display / product emphasis | **Spectral** | Regular 400 | Product name, select headings |
| UI / body | Sen (or Sen + system fallback) | 400/600 | Dense ops readability |

### 10.4 Iconography & controls

- **Phosphor Icons** only where icons aid scanning (status, nav, SLA, actions). **No emoji.**
- Buttons: **minimally rounded** corners (≈4–6px), not pills.
- Buttons must implement **hover, focus, and loading** states using the expanded palette.
- Background: **mesh gradient** on `#f5f8fa` with soft navy / steel / forest blobs (upper field), similar structure to the reference landing — atmospheric, not a flat fill.

### 10.5 Motion

Subtle enter on lists; soft SLA pulse; decision confirmation — presence, not noise.

---

## 11. Component inventory (for discussion)

Only components tied to FR1–FR10:

| Component | Purpose |
|-----------|---------|
| `RoleLanding` | Landing A role cards |
| `IdentityPicker` | Demo employee select |
| `AppShell` | Brand chrome + nav scoped by persona |
| `QueueList` + `QueueMetrics` | Reviewer home |
| `MySubmissionsList` | Submitter home |
| `SubmitForm` | Validated intake |
| `ReviewWorkspace` | Asset / checklist / decision |
| `AuditTimeline` | Event history |
| `StatusBadge` / `RiskBadge` / `SlaCue` | Scanability |
| `AssumptionList` | Transparency |
| Primitives | Button, Input, Select, Textarea, Label, Badge (shadcn-style) |

**Not building:** charts suite, notification center, rich text editor, file CDN, comment threads, kanban boards.

---

## 12. Technical constraints

- Vite + React + TypeScript + Tailwind  
- Static deploy: GitHub Pages (`base: './'`, HashRouter)  
- Client-only state: seed data + localStorage  
- Design artifacts: Superpowers companion + DesignFlow wireframes (not production)

---

## 13. Open items before coding revision

1. ~~Landing pattern~~ → **A locked**  
2. **Branding direction** — confirm or adjust (§10)  
3. **Component/UX details** — review workspace layout; submitter list density  
4. Then: robust revision of `src/` to match this PRD + design spec  

---

## 14. Approval

| Decision | Status |
|----------|--------|
| Approach A — reviewer workbench | Locked |
| Submitters = internal marketer + affiliate manager | Locked |
| Pre-approved library assumed; AM completeness gate upstream | Locked |
| Persona-aware homes + scoped submitter visibility | Locked |
| Landing Option A — role cards first | Locked |
| Branding tokens | **Locked** (palette, Sen/Spectral, Phosphor, mesh, button states) |
| Component set / review layout | **Discussing** |
| Implement main app revision | **Blocked until components agreed** |
