# Robust seed library + assist emulation

**Product:** ClearPath Financial Market Compliance Review  
**Date:** 2026-10-16  
**Status:** Approved for planning (Tina: option C, min due ≥12h)

## Goal

Replace the thin demo seed set with a larger, realistic promotional-intake library so reviewers can exercise Assist and disposition on packets that look like real marketing submissions. No pending item may be overdue or due in under 12 hours at seed load. Expand deterministic Assist (fallback) so the first pass catches the planted subtle issues the way a policy/rule desk would.

## Non-goals

- Hosting a production `POST /api/assist` backend in this repo
- Auto-approve or auto-decline
- Embedding large binary creative images in git (intake notes may say “proof attached”; `creativeImage` stays optional)
- Changing risk-tier SLA lengths (High 8h / Med 24h / Low 48h) — only `submittedAt` shifts so remaining time stays ≥12h where the tier window allows

## SLA / overdue constraint

- **Meaning of “min due in 12 hrs”:** for every **pending** seed, due-at ≥ now + 12h, i.e. `remaining = slaHours − ageHours ≥ 12`.
- **No pending seed may be overdue** at load. Decided rows may be older (historical).
- **New submits unchanged:** product policy stays High→8h / Med→24h / Low→48h via existing risk helpers.
- **Seed high pending exception:** an 8h window cannot leave ≥12h remaining. Seed rows with `riskTier: 'high'` therefore use **`slaHours: 24` (seed-only)** with `dueIn ∈ [12, 18]` and an intake note that the demo clock is extended; production High on new submit remains 8h.
- **Medium / Low pending:** keep policy `slaHours` (24 / 48); set `submittedAt` so `dueIn ≥ 12` (typical Med dueIn 12–30h, Low 12–40h).

## Seed inventory (~20–22)

IDs continue `CP-10xx` ascending. Mix submitters Ava Chen (internal) and Sam Ortiz (affiliate).

### Pending — subtle decline-worthy (~12) — Assist must flag ≥1 on fallback

| ID | Asset / channel | Planted issue (subtle) | Expected assist codes (primary) |
|----|-----------------|------------------------|----------------------------------|
| CP-1050 | Banner / affiliate | “From 6.99% APR” + short disclosure missing creditworthiness / partner comp | `trigger_terms_incomplete`, `missing_disclosure`, possibly `affiliate_relationship_unclear` |
| CP-1051 | Email / internal | Rate mention in subject-style body; disclosure omits APR accompaniment | `trigger_terms_incomplete`, `missing_disclosure` |
| CP-1052 | Landing / affiliate | “You’re pre-approved — claim your card” (soft guarantee) | `unsubstantiated_claim`, `misleading_net_impression` |
| CP-1053 | Social / paid | “Zero fees” with thin “see terms” only | `unsubstantiated_claim`, `missing_disclosure` |
| CP-1054 | Banner / affiliate | Comparison “beats most store cards” without as-of / basis in disclosures | `unsubstantiated_claim` |
| CP-1055 | Email / internal | Urgency “expires tonight” + rate tease | `misleading_net_impression` (+ rate codes if APR present) |
| CP-1056 | Landing / web | CTA to partners.* URL; offer text implies same terms as brand site | `offer_landing_mismatch` |
| CP-1057 | Affiliate creative | Partner packet missing any partner/compensation language | `affiliate_relationship_unclear` |
| CP-1058 | Display / brand | Absolute “instant funding” claim | `unsubstantiated_claim`, `misleading_net_impression` |
| CP-1059 | Email / affiliate | Fee-free forever variant with weak disclosure | `unsubstantiated_claim`, `missing_disclosure` |
| CP-1060 | Landing / mortgage | “Lock your rate today” without material caveats | `missing_disclosure`, `misleading_net_impression` |
| CP-1061 | Social / affiliate | Testimonial-style “I got approved in minutes” without #ad / relationship | `affiliate_relationship_unclear`, `misleading_net_impression` |

Copy must read like real promo (headline + CTA + UTM destination + disclosure band + intake notes citing terms sheets). Issues stay subtle: not “GUARANTEED APPROVAL!!!” in all caps — soft overclaims and disclosure gaps.

### Pending — clean approve candidates (~4) — Assist must return **zero** findings

| ID | Notes |
|----|--------|
| CP-1062 | Brand awareness, no rate/fee/approval claims, adequate disclosure (≥40 chars, no trigger phrases) |
| CP-1063 | Cash-back social with matching category disclosure, no APR / fee absolutes |
| CP-1064 | Planning tools landing, illustrative payment disclaimer present, brand (non-partners) URL |
| CP-1065 | Soft-pull prequal email, no rate number, full soft-pull disclosure, no urgency absolutes |

### Decided history (~5–6)

Retain/refine declined and approved examples (e.g. guaranteed approval declined, fee-free declined, clean prequal approved) with realistic event timelines. These may be older than 12h; status is not pending.

Drop or rewrite prior pending IDs (CP-1041–1044 etc.) into the new numbering so the library is coherent; bump storage key so old localStorage is replaced.

## Assist architecture (unchanged resolution, richer fallback)

Order remains:

1. `POST /api/assist` (production BFF; optional)
2. Local OpenAI key from Assist settings (prototype only)
3. `fallbackAssist` heuristics (default offline)

### Assist settings page

Reviewer-only. Stores optional API key in `localStorage` for local LLM trials. Not required for demos; fallback must make the seed story work without a key.

### Fallback emulation of real desks

Expand deterministic checks to mirror policy layers (not LLM creativity):

- **Trigger / Reg Z-ish:** `%` / APR / “as low as” / “from X%” in body without APR/rate accompaniment in disclosures
- **Absolutes:** guaranteed, pre-approved (unqualified), instant approval/funding, zero/no fees forever
- **Urgency:** claimFlags or body scarcity without qualifying language
- **Affiliate:** `source === 'affiliate'` (or partners.* URL) without partner/compensat/affiliate language in body+disclosures
- **Comparison:** comparison flag or “beats/more than/vs” without basis/as-of in disclosures
- **Thin disclosure:** short disclosure relative to claim-bearing creative
- **Landing mismatch:** partners.* destination + material claim without “terms may differ / subject to” style caveats
- **Testimonial / endorsement tone:** first-person approval stories on affiliate without relationship disclosure

Each finding still requires `code`, `where`, `reason`. Never emit approve. Respect tier-gated checklist (`findingsForTier`) so Low stamps do not get High-only codes.

Optional: seed `intakeNotes` may include an `assistHint` is **out of scope** — heuristics must work from packet fields alone so live submits behave the same.

## Storage

Bump `clearpath-review.requests.v6` → `v7` so Reset and first load pick up the new library.

## Testing

- Unit/script checks: for each planted decline seed ID, `fallbackAssist` returns the expected primary codes (table above); clean seeds return **zero** findings.
- Remaining-time check: every pending seed has `remaining ≥ 12h` at evaluation time.
- Manual smoke: Reset → Review as Jordan → open a subtle pending → Assist pre-checks → Why these issues? → decide → next in queue.

## Docs

- Short note in `docs/assumptions-evolution.md` or assumptions if High seed SLA extension needs a decision row; otherwise a brief README / assist.md pointer that demos use fallback unless a key/proxy is configured.
- Do not invent new curated Key decisions unless product policy changes for new submits.

## Out of scope follow-ups

- Server-side `/api/assist` implementation
- Vision OCR without LLM
- Concurrency / claim locks for multi-reviewer queues
