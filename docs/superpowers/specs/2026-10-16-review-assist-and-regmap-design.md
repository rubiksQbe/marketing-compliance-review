# Review assist, regulation map, and next-in-queue — Design Spec

**Date:** 2026-10-16  
**Product:** ClearPath Financial Market Compliance Review  
**Status:** Approved for planning (brainstorm 2026-10-16)  
**Parent:** `docs/superpowers/specs/2026-10-12-clearpath-compliance-review-design.md`

---

## 1. Problem

Reviewers need three workflow upgrades:

1. **Why an issue matters** — optional access to the regulation behind each compliance finding (UDAAP, Reg Z / TILA, etc.) without cluttering the checklist or submitter intake.
2. **Faster queue walk** — after Approve/Decline, open the next pending packet instead of bouncing to the queue home.
3. **Directed review** — model-assisted flags (with where + reason) that pre-check findings so Declines are faster, while Approves still require human confirmation that nothing was missed.

Framing: build as a **prototype of a production-ready product**, not a throwaway demo. Where the static client cannot enforce production guarantees (API keys, multi-reviewer locks), document the production shape and ship the best honest client path.

---

## 2. Decisions locked

| Topic | Choice |
|-------|--------|
| Regulation UI | Slide-over drawer (**B**) |
| Who sees the drawer | Reviewers (any status); submitters on **declined** submissions only |
| Legal disclaimer in drawer | **None** |
| Official links | Primary federal sources (CFPB / FRB / FTC / eCFR) |
| Next after decide | Next pending in queue order High → Low, then nearest due (**A**); else `/queue` |
| Multi-reviewer concurrency | **Document only** this pass (claim/lock needs shared backend) |
| Assist mode | Hybrid live + fallback (**C**) |
| Assist credentials | Prefer `POST /api/assist` proxy; optional local key in settings for prototype trials |
| Assist UX | Auto-run on pending open; **pre-check** mapped findings; always show reason + where (**C**) |
| Auto-approve | **Never** |

LLM assist is **in scope** for this design (not deferred).

---

## 3. Regulation map drawer

### Trigger

- Control label: **Why these issues?**
- Placement: under the compliance-issues checklist on the review disposition rail (reviewers).
- Submitters: same control on **declined** reviews, near the declined findings / remediation panel.
- Not shown on submit intake; not shown to submitters for pending / approved / withdrawn.

### Behavior

- Opens a right-side slide-over; close via ✕, backdrop click, or Escape.
- Lists findings for the current risk tier (same set as the checklist), or for submitters the codes present on the decline.
- Each row: finding label, regime tags (e.g. UDAAP · Reg Z / TILA), short plain-English note, and one or more **official documentation** links (new tab).
- Checklist vocabulary stays plain English; statute names appear only in the drawer.

### Data

New module `src/data/regulationMap.ts`:

```ts
export type RegulationSource = { label: string; url: string }

export type RegulationMapEntry = {
  regimes: string[]
  note: string
  sources: RegulationSource[]
}

export const REGULATION_MAP: Record<ReasonCode, RegulationMapEntry>
```

Sources must be real primary or agency pages (examples to wire in implementation):

- CFPB UDAAP examination / consumer-protection materials  
- Reg Z / TILA advertising provisions (eCFR 12 CFR 1026 / agency explainers)  
- FTC Endorsement Guides (affiliate relationship clarity)  

---

## 4. Next-in-queue after decide

### Behavior

- **Reviewers only:** after successful Approve or Decline, navigate to the next **pending** request in the same order as the queue: risk High → Low, then ascending `remainingFor` (nearest due first). Skip the request just decided.
- If no other pending remains → `/queue`.
- **Submitters:** unchanged — remain on `/review/:id` after a decision they can see.
- Soft-withdraw and other exits unchanged.

### Implementation note

Extract shared `orderedPendingQueue(requests: ReviewRequest[]): ReviewRequest[]` used by `QueuePage` sort and post-decide navigation so order cannot drift.

### Concurrency (documented, not implemented)

Production systems use claim/lock, atomic DB claim, or optimistic versioning so two reviewers cannot decide the same packet. This client (localStorage / no shared authority) cannot enforce that. Assumptions / evolution docs must state: **multi-reviewer safety requires a shared backend with claim + lease**; next-in-queue alone is not a concurrency control.

---

## 5. Compliance assist (LLM + fallback)

### Goals

- Direct reviewers to likely issues with **where** and **reason**.
- Pre-check matching checklist boxes to speed Declines.
- Keep a **human in the loop** for every final Approve / Decline.
- Prefer production shape: **server-side proxy**; allow optional local key only for prototype trials.

### Contract

```ts
export type AssistFinding = {
  code: ReasonCode
  reason: string
  where: string // region of creative, copy excerpt, or disclosure area
}

export type AssistResult = {
  findings: AssistFinding[]
  source: 'proxy' | 'local_key' | 'fallback'
}

export async function assistReview(input: {
  request: ReviewRequest
}): Promise<AssistResult>
```

Resolution order:

1. `POST /api/assist` with packet payload (title, body, disclosures, claim flags, risk tier, destination URL, and creative image data URL or omit if too large — document size limits).  
2. Else if reviewer has stored a local API key in settings → direct provider call (vision-capable model when `creativeImage` present).  
3. Else **fallback**: deterministic heuristics over copy/disclosures/claim flags (+ any seeded assist notes), so the prototype remains usable without network or keys.

### UI (reviewers, pending only)

- Auto-run when opening a pending review; show loading; offer **Re-run**.
- Block **Assist suggestions**: each suggestion shows finding label, **where**, **reason**.
- On result, **pre-check** checklist boxes for returned `code`s that exist in the current tier checklist. Reviewer may uncheck.
- Persist assist output in component state for the open review (optional: Activity event `assist_ran` later — not required for v1 of this pass unless cheap).
- Submitters never see assist.
- Decided / non-pending: do not auto-run.

### Settings (prototype)

- Lightweight reviewer settings (or shell entry): paste optional provider API key → `localStorage` (prototype-only).  
- Copy must state that production deployments must use `/api/assist` and never ship browser-held keys.

### Proxy stub

- Document expected `POST /api/assist` request/response JSON matching `AssistResult`.  
- Optional thin Vite middleware or Pages-incompatible note: GitHub Pages cannot host the proxy; production hosting must. Client still implements the call site.

### Safety

- Never auto-Approve.  
- Assist errors surface a non-blocking message and leave checklist unchanged (or keep prior assist state).  
- Fallback must not invent codes outside `ReasonCode`.

---

## 6. Surfaces touched

| Surface | Change |
|---------|--------|
| `ReviewPage` | Why these issues? → drawer; assist block + pre-check; next-in-queue on decide |
| `QueuePage` | Use shared pending order helper |
| New `regulationMap.ts` | Finding → regimes / note / official URLs |
| New `assist` module(s) | Client resolver + fallback (+ settings key storage) |
| Assumptions / evolution | Concurrency backend requirement; assist hybrid; drawer audience |

---

## 7. Out of scope (this pass)

- Real multi-reviewer claim/lock server  
- Hosted `/api/assist` deployment on GitHub Pages  
- Auto-approve or removing human final decision  
- Submitter-facing assist  

---

## 8. Success criteria

1. Reviewer can open regulation drawer with official links; submitter can on declined items only.  
2. After reviewer decide, next pending opens in queue order (or queue if empty).  
3. Opening a pending review runs assist; suggestions show where + reason; matching boxes pre-check; Approve/Decline remain human.  
4. Without proxy/key, fallback still returns usable suggestions.  
5. Docs state concurrency and key-handling production requirements.

---

## 9. Spec self-review

- No TBD placeholders for required behavior.  
- Drawer audience and assist audience do not contradict.  
- Next-in-queue order matches queue sort via shared helper.  
- LLM path is hybrid with explicit production proxy shape.  
- Concurrency is explicitly documentation-only for this pass.
