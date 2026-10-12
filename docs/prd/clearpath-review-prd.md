# Product Requirements Document — ClearPath Review

**Status:** Locked for implementation  

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
| **Jordan Lee** | Marketing Compliance Specialist | Org-wide risk-tiered queue | All requests |
| **Ava Chen** | Internal marketer (submitter) | Your submitted requests | Only Ava’s requests |
| **Sam Ortiz** | Affiliate manager (submitter) | Your submitted requests | Only Sam’s requests |

**Landing (locked):** Option A — full-screen role cards (Compliance reviewer / Submitter). Submitters then pick a demo employee identity.

**Production note:** Demo identity picker stands in for SSO; IA stays the same when real auth is added.

---

## 5. Operating model assumptions & locked decisions

**Canonical log (keep current):** `src/data/assumptions.ts`, also rendered in-app at `/assumptions` (key subset from the landing page).

Includes operating assumptions (P/A*), locked product decisions (D*), and applied vocabulary (V*).

**Critique / evolution:** `docs/assumptions-evolution.md` — which assumptions are stretched, how they’d evolve (campaign teams, soft withdraw, tiered checklists, etc.), and what the demo already tightened (reviewer risk override; visual file required).

Pain-model narrative and earlier A1–A10 write-ups also appear in `docs/superpowers/specs/2026-10-12-clearpath-compliance-review-design.md`. Branding tokens remain in §10 of this PRD.

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
| FR6 | Review workspace: 2/3 package card + 1/3 sticky disposition rail (see §11b) |
| FR7 | Exception checklist: ≥1 reason required to Decline; Approve when none checked |
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

### 10.1 Brand anchors

| Token | Hex | Role |
|-------|-----|------|
| `navy` | `#1a3a5c` | ≈ navy-800 band — primary ink |
| `steel` | `#5a8faa` | ≈ steel-400 — default button |
| `mist` | `#c9d4dc` | ≈ mist-200 — borders / loading |
| `canvas` | `#f5f8fa` | ≈ canvas-50 — page / mesh field |
| `forest` | `#2d4a3e` | ≈ forest-800 — deep positive |

Use **scale steps** below for hover, soft surfaces, mesh, and halos (not one-off hexes).

### 10.2 Navy scale (`--navy-*`)

| 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| `#f1f6fa` | `#dee9f6` | `#bfd7f2` | `#92bbea` | `#5296df` | `#3a74b2` | `#2d5d90` | `#234973` | `#183757` | `#12283f` | `#091726` |

### 10.3 Steel scale (`--steel-*`)

| 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| `#f1f6f9` | `#dbebf3` | `#b9daec` | `#85c1df` | `#629bb8` | `#4b788f` | `#3b6073` | `#2e4c5c` | `#213945` | `#182932` | `#0d181d` |

### 10.4 Mist scale (`--mist-*`)

| 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| `#f3f6f8` | `#e1e9ef` | `#c6d7e3` | `#9ebcd0` | `#7697ac` | `#5b7686` | `#495e6c` | `#394a56` | `#2a3740` | `#1e282e` | `#11171b` |

### 10.5 Canvas scale (`--canvas-*`)

| 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| `#f3f5f7` | `#e4e9ec` | `#cbd6de` | `#a8bac7` | `#8195a4` | `#647480` | `#4f5d67` | `#3e4951` | `#2e373d` | `#21272c` | `#131719` |

Page field may use brand canvas `#f5f8fa` (slightly cooler than canvas-50) or canvas-50 — pick one in implementation and stay consistent (`#f5f8fa` preferred).

### 10.6 Forest scale (`--forest-*`)

| 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| `#ebf9f3` | `#cbf3e1` | `#97e8c7` | `#82c9ac` | `#67a089` | `#4f7d6a` | `#3e6454` | `#304f42` | `#233b31` | `#192b23` | `#0e1914` |

### 10.7 Interaction states (mapped to scales)

| State | Fill | Text | Notes |
|-------|------|------|-------|
| Default (primary) | steel-400 `#629bb8` (or brand steel `#5a8faa`) | `#ffffff` | Font weight **500** |
| Hover | navy-800 `#183757` (or brand navy) | `#ffffff` | Weight 500 |
| Focus | same as default + **soft halo** `0 0 0 4px` steel-300 @ ~35% | `#ffffff` | No hard border stack |
| Loading | mist-200 `#c6d7e3` | navy-800 | Weight 500 |
| Approve default | forest-400 `#67a089` | `#ffffff` | Weight 500 |
| Approve hover | forest-600 `#3e6454` | `#ffffff` | |
| Approve focus | approve + soft forest-300 halo | `#ffffff` | |
| **Secondary (ghost)** | **none** — no fill, no border | navy-800 | **Must** include Phosphor icon; never text-only. Hover: navy @ ~6–8% wash. Weight 500. Keeps filled accents attention-grabbing. |
| Surfaces / cards | `#ffffff` or canvas | navy-800 text | Borders mist-200 |
| Danger | `#9b2c2c` | `#ffffff` | |
| Warning / SLA | warm soft + `#9a6b2f` | dark ink | |

**Contrast:** Body/UI text = navy-800/900 on light surfaces. No light steel/navy text for paragraphs or links.

**Mesh (locked — BR3 mid @ 0.53 / 72%):** base `#f5f8fa`; bottom-right tall steel stack (cleared top); steel-dominant; forest along bottom at **72%** width; peak steel opacity **0.53**.

```css
background-color: #f5f8fa;
background-image:
  radial-gradient(ellipse 54% 56% at 90% 60%, rgba(133,193,223,0.53) 0%, rgba(133,193,223,0.26) 38%, transparent 66%),
  radial-gradient(ellipse 50% 48% at 95% 80%, rgba(185,218,236,0.46) 0%, rgba(185,218,236,0.20) 42%, transparent 70%),
  radial-gradient(ellipse 72% 34% at 78% 100%, rgba(151,232,199,0.36) 0%, rgba(130,201,172,0.22) 46%, transparent 72%),
  radial-gradient(ellipse 48% 28% at 92% 96%, rgba(151,232,199,0.32) 0%, transparent 68%);
```

### 10.8 Typography

| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Logo / company wordmark | **Sen** | Regular 400 | Exact string: `ClearPath Financial` |
| Serif display / product emphasis | **Spectral** | Regular 400 | Product name, select headings |
| UI / body | Sen (or Sen + system fallback) | 400/600 | Dense ops readability |

### 10.9 Iconography & controls

- **Phosphor Icons** only where icons aid scanning (status, nav, SLA, actions). **No emoji.**
- Buttons: **minimally rounded** corners (≈4–6px), not pills; label weight **500**.
- Primary / approve: filled; hover / focus (soft halo) / loading via scale steps.
- **Secondary ghost:** no background, no border; always icon + label (Phosphor).
- Background: **mesh** on `#f5f8fa` — large, Highnote-like, **distinct** steel vs forest hues.

### 10.10 Motion

Subtle enter on lists; soft SLA pulse; decision confirmation — presence, not noise.

---

## 10b. Research notes — compliance review platforms (v1 implications)

### How mature platforms work

Industry tools (e.g. Red Oak, Ruleguard, Adclear-class pre-publication systems) converge on:

1. **Structured intake** — required metadata + asset + disclosures before the item enters a queue  
2. **Risk-based routing / prioritised queue** — not inbox order  
3. **Single review surface** — creative preview + context + disposition controls together  
4. **Human final sign-off** — AI/rules may flag; a qualified reviewer decides  
5. **Immutable audit trail** — who / when / what version / rationale  
6. **Structured feedback** — findings with remediation, not freeform email only  

**Layout implication:** Reviewer home = prioritised queue. Review workspace = **asset + package context + disposition** in one composition. Because reviewers are **trained and judgment-capable**, v1 should not teach statute text; it should **accelerate disposition** with common finding codes + suggested fixes.

### Complete submission package (what “review-ready” means)

A complete package for ClearPath Review (consumer-finance marketing / affiliate creative) should include:

| Package element | Why reviewers need it |
|-----------------|----------------------|
| **Piece title** | Queue identity / search |
| **Product** | Which offer rules apply (loans / cards / mortgage prequal) |
| **Channel / medium** | Disclosure placement differs (email vs paid social vs affiliate LP) |
| **Asset type** | Banner, LP, email, social, affiliate creative |
| **Audience / targeting notes** | Net impression & suitability context |
| **Creative copy (exact)** | What consumers will actually see |
| **Destination URL / CTA target** | Offer must match landing experience |
| **Required disclosures (as they will appear)** | Clear & conspicuous check |
| **Claim flags** (APR/rate, fees, approval odds, comparison, urgency, testimonial) | Focus review depth |
| **Source** (Internal vs Affiliate partner + partner name) | Third-party / entanglement context |
| **Intended first-use / go-live** (optional in v1) | SLA & exam chronology |
| **Supporting notes / substantiation pointer** (optional) | Where rate/fee claims come from |

Incomplete packages are blocked at intake (or by the affiliate manager upstream).

### Reviewer workflow (streamlined)

1. Pull next item from risk/SLA queue  
2. Scan **package context** (product, channel, claims, source)  
3. Read **creative + disclosures** for **net impression**  
4. Decide: **Approve** / **Changes requested** / **Decline** (reject)  
5. If not approved: select **finding codes** + optional note; each code carries a **suggested fix** for the submitter  
6. Decision writes to **audit trail** automatically  

### Vocabulary (roles & systems)

| Term | Meaning |
|------|---------|
| **Piece / creative / asset** | The marketing item under review |
| **Submission / intake** | Request entering the review system |
| **Submitter** | Internal marketer or affiliate manager who files the package |
| **Reviewer / compliance reviewer** | Person performing pre-publication review |
| **Pre-publication approval / pre-use approval** | Must be approved before first use |
| **Queue / work queue** | Prioritised list of pending reviews |
| **Risk tier** | Review depth / SLA class (low / medium / high) |
| **SLA / turnaround** | Time expectation for a decision |
| **Net impression** | Overall takeaway a reasonable consumer gets from the ad as a whole |
| **Clear and conspicuous** | Disclosure must be noticeable and understandable in context |
| **Triggering terms** | Credit ad terms that require additional Reg Z / TILA disclosures |
| **Substantiation** | Evidence on file *before* a claim runs |
| **Claim / representation** | Express or implied statement about the product |
| **Material omission** | Missing fact that would change the net impression |
| **Disclosure** | Qualifying/required language accompanying a claim |
| **Finding / exception** | Specific issue noted by the reviewer |
| **Remediation / required revision** | What the submitter must change |
| **Changes requested** (aka send back) | Returned for revision; not a final decline |
| **Approve / approval** | Cleared for use (this version) |
| **Decline / reject** | Not approvable as submitted (or prohibited) |
| **Audit trail / books & records** | Timestamped history for exams |
| **First use** | Earliest date the piece will be published/used |
| **Version** | Specific creative iteration under review |

### Common findings → suggested fixes (checkbox disposition list)

Used on non-approvals. Reviewer selects one or more; submitter sees **finding + fix**.

| Code | Finding (reviewer language) | Suggested fix (submitter-facing) |
|------|----------------------------|----------------------------------|
| `missing_disclosure` | Required disclosure missing or incomplete | Add the product/channel-required disclosure in full; keep it with the claim |
| `not_clear_conspicuous` | Disclosure not clear and conspicuous | Move disclosure proximate to the claim; increase prominence; avoid bury-in-footer-only |
| `unsubstantiated_claim` | Claim lacks substantiation | Remove/qualify the claim or attach approved substantiation source before resubmit |
| `misleading_net_impression` | Net impression likely misleading | Rewrite headline/visual so it matches actual terms; disclosure cannot cure a false headline |
| `absolute_language` | Absolute/guaranteed language unsupported | Replace “guaranteed / always / everyone approved” with accurate, conditional wording |
| `trigger_terms_incomplete` | Triggering credit terms without required additions | Add Reg Z–style required terms (e.g. APR presentation / accompanying terms) or remove triggers |
| `fee_cost_omission` | Material fee/cost condition omitted | Disclose material fees/conditions prominently where the benefit is claimed |
| `affiliate_relationship_unclear` | Affiliate/partner relationship unclear | State paid relationship / partner nature clearly near the offer |
| `offer_landing_mismatch` | Creative offer doesn’t match destination | Align CTA/destination terms with the creative, or update the creative to match the LP |
| `wrong_product_terms` | Incorrect product terms | Correct rate/fee/eligibility language to approved product source |
| `testimonial_issues` | Testimonial/endorsement issues | Add required endorsement disclosures or remove testimonial |
| `fair_lending_udaap_flag` | Fair lending / UDAAP concern | Revise targeting/claims that could be unfair, deceptive, or abusive; escalate if needed |
| `firm_policy` | Fails internal ClearPath marketing policy | Follow marked policy guidance in reviewer note |
| `other` | Other | See reviewer note |

**Approve** does not require finding codes. **Decline** (v1 single non-approve action) requires ≥1 code. Submitters see autopopulated **requested changes** as the suggested-fix lines only (no code labels in that box).

---

## 11b. Review workspace (locked)

Companion mock: `review-layout-locked.html`.

| Decision | Locked choice |
|----------|---------------|
| Layout | Left **2/3** package card · right **1/3** disposition rail |
| Scroll | Equal-height panes; each scrolls independently; **auto-hide** scrollbars; Approve/Decline bar pinned |
| Header | Back (`← Queue · ID`) + risk/SLA chips on one row → Spectral title → `Submitted by …` |
| Header chips | Risk tier + SLA only (claim flags live in package) |
| Package sections | Creative (visual **or** verbatim text by asset type) → Destination (clickable URL, no `CTA/URL` label) → Disclosures → Classification (tight rows) → Claims flagged (value only) → Intake notes. No Source block (header has it). No “Creative & package” title. |
| Disposition | Critical/exception checklist (findings, not affirmative compliance ticks) |
| Requested changes | Autopopulates below checklist from checked items — **fix text only** |
| Notes | Additional notes textarea |
| Primary action | Default **Approve** (forest-400). Any checkbox → morphs to **Decline** (danger red, no icon) |
| Card hover | None on package card; buttons keep hover/focus halo |
| Audit | Not on decision screen (separate `/audit/:id`) |

---

## 11. Component inventory

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
- Design artifacts: Superpowers companion mocks (not production)

---

## 13. Open items before coding revision

1. ~~Landing pattern~~ → **A locked**  
2. ~~Branding direction~~ → **Locked** (§10)  
3. ~~Review workspace~~ → **Locked** (§11b)  
4. **Next:** robust revision of `src/` to match this PRD + design spec  

---

## 14. Approval

| Decision | Status |
|----------|--------|
| Approach A — reviewer workbench | Locked |
| Submitters = internal marketer + affiliate manager | Locked |
| Pre-approved library assumed; AM completeness gate upstream | Locked |
| Persona-aware homes + scoped submitter visibility | Locked |
| Landing Option A — role cards first | Locked |
| Branding tokens | Locked (palette scales, Sen/Spectral, Phosphor, buttons, soft halo) |
| Mesh composition | Locked — BR3 bottom-right, steel 0.53, forest 72% wide |
| Component set / review layout | **Locked** (§11b) |
| Implement main app revision | **In progress** |
