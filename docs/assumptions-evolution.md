# Assumptions critique & evolution notes

Companion to `src/data/assumptions.ts` (in-app: **Demo notes · key assumptions**).  
This doc flags what is solid for a demo, what is stretched, and how a real product would evolve.

---

## Solid for this demo

| ID | Note |
|----|------|
| **P1** | Volume vs headcount is a fair reason to optimize reviewer throughput. |
| **A1c** | Internal marketer + AM as portal users is a common boundary. |
| **A3 / A6** | Human sign-off + structured issues + remediation is the core control story. |
| **D1** | Risk prioritizes; it does not skip approval. Keep this explicit in demos. |
| **A5 / A7** | Incomplete intake hurts; static demo without real auth is fine for v1. |
| **V1–V5** | Applied UI vocabulary (compliance issues, remediation, claim types, activity; SLA reviewer-only). |

---

## Questionable assumptions — how we’d evolve

### A1b — Submitters don’t see peers’ in-flight reviews

**Stretch:** Campaign teams often need shared status (“where is Q4 cards?”).

**Evolution:** Keep persona-scoped “Your requests” for demo simplicity. A later version would add **campaign / workspace** visibility (team queue, shared filters) with RBAC so marketers see the campaign without seeing every org packet.

### A1d — Pre-approved creative library exists

**Stretch:** Many shops don’t have a clean, trusted library yet.

**Evolution:** Demo assumes library work happens elsewhere. Product evolution: **template / pre-cleared library** as a first-class path (skip custom review when unchanged), with this portal remaining the **exception / custom** path.

### A1e — AMs always completeness-gate partner packets

**Stretch:** AM QA is uneven; incomplete affiliate packs still reach compliance.

**Evolution:** Keep AM gate out of scope for the demo. Evolution: lightweight **AM intake checklist**, partner upload portal, or compliance “return to AM” without a full Decline when the packet isn’t review-ready.

### D2 — Risk-tiered routing raises throughput more than headcount

**Stretch:** Plausible, not proven. Only helps if High work is *different*, not just a shorter clock on the same checklist.

**Other ways to implement D2 (alternatives / complements):**

1. **Tiered checklists** — High shows more findings / mandatory substantiation fields; Low is a short stamp checklist. Same queue, different depth.
2. **Staffing / skill routing** — High → senior reviewers; Low → junior or rotating desk.
3. **Batch Low** — group low-risk brand pieces into a daily batch review.
4. **Channel SLAs without risk labels** — e.g. affiliate always 8h, display 48h (risk score becomes secondary).
5. **Workload caps** — auto-pause Low intake when High backlog exceeds N.
6. **Measure it** — track decisions/hour and rework rate by tier; drop or retune scoring if High isn’t harder, only louder.

**Now in product:** priority sort + due window **and** tiered checklists (`findingsForTier`): Low = disclosures / net impression / other; Medium adds substantiation, clear & conspicuous, offer–landing; High adds affiliate relationship + triggering terms. Review rail shows stamp / standard / full depth copy. Changing risk mid-review swaps the checklist.

### D3 — Auto risk from claim types (now: suggestion + reviewer override)

**Was stretch:** Self-reported claim types under-flag; no compliance correction.

**Now in product:** Submitters still see a **read-only suggestion**; **reviewers can change tier** on pending items (Activity event `Risk updated`; due window recalculated as `submittedAt + new slaHours`).

**Further evolution:** Content/rules or model-assisted scoring; require reviewer confirm on High; dual control for tier downgrades.

### D4 / D5 — 8h / 24h / 48h SLA from risk

**Stretch:** Calendar hours ignore business days, time zones, and holidays.

**Evolution:** Business-hour clocks, per-channel overrides, pause when waiting on submitter remediation, escalate when overdue.

### D6 — “SLA at risk” at &lt;25% remaining

**Stretch:** Arbitrary threshold.

**Evolution:** Configurable thresholds; separate “overdue” vs “due soon”; notify assignee.

### D7 — Creative substance (now: file required for visual)

**Was stretch:** File *or* copy for banners/social.

**Now in product:** **Visual asset types require a creative file**; accompanying copy optional. Text-only (email / landing) still require exact copy and hide file upload.

**Further evolution:** Multi-file proofs, HTML email source, landing URL crawl, virus scan, object storage (not data URLs).

### D9 — Approve / Decline only

**Stretch:** Many desks use “revise & resubmit” / conditional approval as a named state.

**Evolution for demo honesty:** Decline + remediation stands in for “needs changes.” A later status model could add **`changes_requested`** (or “Remediate”) distinct from hard Decline/reject, with different submitter CTAs.

### D10 — Delete while pending / declined

**Stretch:** Hard delete destroys exam/audit evidence; compliance often wants a retained trail for withdrawn work.

**Ways to implement a retained trail:**

1. **Soft withdraw (recommended)**  
   - Replace hard delete with status `withdrawn` (or `voided`).  
   - Write Activity event `Withdrawn` with actor + timestamp.  
   - Hide from default Needs review queue; show in Mine / All with badge **Withdrawn**.  
   - Payload remains in storage (and eventually in a real DB); no physical purge in v1.

2. **Tombstone record**  
   - On delete, strip creative bytes but keep id, title, submitter, status history, and hashes of attachments.

3. **Immutable event log + optional blob GC**  
   - Events never deleted; creative blobs GC’d after N days with “attachment purged” marker on the event.

4. **Permissioned purge**  
   - Only compliance admin can hard-delete after export; submitters only withdraw.

**Now in product:** soft **Withdrawn** (1) — submitter withdraw from Mine / review; Active queue excludes withdrawn; Mine keeps the row with badge; Activity logs `Withdrawn`.

### A1b / campaign note (summary)

Single-person Mine lists are for **demo simplicity**. An evolution would introduce **campaign teams** (shared visibility, roles, and maybe campaign-level SLAs) without forcing every marketer to see the org-wide compliance queue.

---

## Product changes made from this critique

| Change | Assumption touched |
|--------|-------------------|
| Reviewer risk override on pending review header | D3 |
| Visual assets require creative file | D7 |
| Tiered checklist depth (Low stamp / Med standard / High full) + queue priority | D2 |
| Soft withdraw (retain payload + Activity; hide from active queue) | D10 |
| This evolution doc | All stretch items above |

Keep `src/data/assumptions.ts` in sync when rules change; link demos to **Key assumptions** on the landing page.
