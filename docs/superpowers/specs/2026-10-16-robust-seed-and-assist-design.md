# Robust seed library + desk-style Assist triage

**Product:** ClearPath Financial Market Compliance Review  
**Date:** 2026-10-16  
**Status:** Approved design (Tina: seed option C, min due ≥12h; triage option A)

## Goal

1. Replace the thin demo seed set with a **~20–22 packet** promotional-intake library that looks like real marketing submissions and **showcases Assist triage** (summary, findings with where/reason, creative callouts).
2. No pending item overdue or due in under **12 hours** at seed load.
3. Expand Assist so default (fallback) and LLM paths behave like desk triage/acceleration: draft spotting, proof-oriented callouts, reviewer summary — human still decides.

## Non-goals

- Hosting production `POST /api/assist` in this repo
- Auto-approve / auto-decline
- Third-party OCR SDKs or pixel heatmaps
- Changing **new-submit** SLA policy (High 8h / Med 24h / Low 48h)

## Assist triage panel (review rail)

On pending reviewer open (and Re-run):

| Block | Content |
|-------|---------|
| **Summary** | 2–4 sentences: what the creative claims, risk posture, what to verify before Approve. Always present when Assist completes. |
| **Findings** | Existing list: label + **Where** + **Reason**; pre-check matching checklist codes. |
| **Creative callouts** | Short list of proof/copy regions Assist “looked at” (e.g. Headline band, Disclosure footer, CTA). Each has `label`, `detail` (quoted or paraphrased text), optional `relatedCodes`. When `creativeImage` exists, callouts describe on-proof regions; otherwise they cite intake fields (Creative copy, Disclosures, Destination URL). |
| **Source** | `proxy` / `local_key` / `fallback` badge. |

Never auto-Approve. Empty findings still get a summary like “No policy hits — confirm net impression and disclosures manually.”

### Types

```ts
type AssistCallout = {
  id: string
  label: string
  detail: string
  relatedCodes?: ReasonCode[]
}

type AssistResult = {
  summary: string
  findings: AssistFinding[]  // code, reason, where
  callouts: AssistCallout[]
  source: 'proxy' | 'local_key' | 'fallback'
}
```

### Resolution order (unchanged)

1. `POST /api/assist` — response must include `summary`, `findings`, `callouts` (sanitize; default empty arrays / fallback summary if missing fields)
2. Local OpenAI key (Assist settings) — prompt requests JSON with summary + findings + callouts; send `creativeImage` when present (vision)
3. `fallbackAssist` — deterministic summary + findings + callouts from packet fields

### Fallback rules (policy desk emulation)

- Trigger / Reg Z-ish: `%` / APR / “as low as” / “from X%” without APR accompaniment in disclosures  
- Absolutes: guaranteed, unqualified pre-approved, instant approval/funding, zero/no fees forever  
- Urgency: scarcity language without qualification  
- Affiliate: affiliate source or partners.* URL without partner/compensat/affiliate language  
- Comparison: beats/more than/vs without basis/as-of  
- Thin disclosure: short disclosure on claim-bearing creative  
- Landing mismatch: partners.* + material claim without terms-may-differ caveats  
- Testimonial tone on affiliate without relationship disclosure  

Callouts are derived from each rule hit (and always include at least Creative copy + Disclosures when findings exist). Respect `findingsForTier` gating.

### Assist settings

Reviewer-only optional OpenAI key for local LLM/vision trials. Demos must work fully offline via fallback; seeds are authored so **fallback alone** showcases summary + findings + callouts.

### API doc

Update `docs/api/assist.md` for the expanded response shape.

## SLA / overdue

- Pending: `remaining ≥ 12` hours at seed load.  
- New submits: unchanged policy SLAs.  
- **Seed high pending:** `riskTier: 'high'` with **`slaHours: 24` (seed-only)** and `dueIn ∈ [12, 18]`; intake note explains demo clock. Med/Low keep 24/48 with `dueIn ≥ 12`.  
- Decided rows may be older.

## Seed inventory (~20–22) — must showcase triage

IDs `CP-1050`+. Mix Ava Chen / Sam Ortiz. Copy = real promo intake (headline, CTA, UTM URL, disclosure band, terms-sheet intake notes).

### Creative proofs (showcase callouts / vision)

Do **not** commit large binaries. For **visual** pending seeds that should demo callouts on a proof, embed a **small inline SVG data URL** (`data:image/svg+xml;base64,…` or utf8-encoded) showing headline + disclosure band so:

- Review left pane shows a real-looking proof  
- Fallback callouts can say “Headline band”, “Disclosure footer”  
- LLM path (if keyed) can receive the image  

At least **8** pending seeds include such SVGs (banners, social, affiliate creative, landing “capture”). Email-only seeds may omit image and rely on copy callouts.

### Pending — subtle decline-worthy (~12) — fallback findings ≥1 + non-empty summary + ≥1 callout

| ID | Asset / channel | Planted issue | Primary assist codes | Showcase |
|----|-----------------|---------------|----------------------|----------|
| CP-1050 | Banner / affiliate | From 6.99% APR; thin disc; weak partner language | `trigger_terms_incomplete`, `missing_disclosure`, `affiliate_relationship_unclear` | SVG proof + callouts on headline/APR |
| CP-1051 | Email / internal | Rate in body; disc omits APR accompaniment | `trigger_terms_incomplete`, `missing_disclosure` | Copy callouts |
| CP-1052 | Landing / affiliate | Soft “pre-approved — claim your card” | `unsubstantiated_claim`, `misleading_net_impression` | SVG capture |
| CP-1053 | Social / paid | “Zero fees” + thin see-terms | `unsubstantiated_claim`, `missing_disclosure` | SVG |
| CP-1054 | Banner / affiliate | Comparison without as-of/basis | `unsubstantiated_claim` | SVG |
| CP-1055 | Email / internal | Expires tonight + rate tease | `misleading_net_impression` (+ rate codes if APR) | Copy callouts |
| CP-1056 | Landing / web | partners.* CTA; implies brand terms | `offer_landing_mismatch` | SVG |
| CP-1057 | Affiliate creative | No partner/comp language | `affiliate_relationship_unclear` | SVG |
| CP-1058 | Display | Instant funding absolute | `unsubstantiated_claim`, `misleading_net_impression` | SVG |
| CP-1059 | Email / affiliate | Fee-free forever; weak disc | `unsubstantiated_claim`, `missing_disclosure` | Copy callouts |
| CP-1060 | Landing / mortgage | Lock your rate today; thin caveats | `missing_disclosure`, `misleading_net_impression` | SVG |
| CP-1061 | Social / affiliate | “I got approved in minutes”; no #ad | `affiliate_relationship_unclear`, `misleading_net_impression` | SVG |

Issues stay subtle (soft overclaims / gaps), not cartoon shouting.

### Pending — clean (~4) — zero findings; summary still present; optional “reviewed regions” callouts

| ID | Notes |
|----|--------|
| CP-1062 | Brand awareness; adequate disclosure; no triggers |
| CP-1063 | Cash-back social; matching category disc; no APR/fee absolutes |
| CP-1064 | Planning tools landing; illustrative disclaimer; brand URL |
| CP-1065 | Soft-pull prequal email; no rate number; full soft-pull disc |

Clean seeds: summary states no policy hits / confirm manually; callouts may still list regions inspected with neutral detail.

### Decided history (~5–6)

Realistic approved/declined packets with event timelines (may be older). Include at least one declined with rich reason codes so submitter **Why these issues?** still demos.

Replace prior pending CP-1041–1044-style rows; bump storage key.

## Storage

`clearpath-review.requests.v6` → **`v7`**.

## Testing

- Script: every planted decline seed → expected primary codes + non-empty `summary` + `callouts.length ≥ 1`.  
- Script: every clean pending → `findings.length === 0` + non-empty `summary`.  
- Script: every pending → `remaining ≥ 12h`.  
- `npx tsc -b`; manual Reset → open CP-1050 → see summary, findings, callouts, pre-checks, SVG proof.

## Docs

- `docs/api/assist.md` response shape.  
- Assumptions: one note if needed for seed-only High `slaHours: 24`.  
- Assist settings blurb: fallback always triages; key upgrades LLM/vision.

## Out of scope follow-ups

- Production BFF, real OCR SDK, concurrency locks, auto-decide
