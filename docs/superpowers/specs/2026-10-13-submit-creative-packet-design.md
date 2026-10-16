> **Implemented / historical.** Current notes: `docs/README.md`. Canonical decisions: `src/data/assumptions.ts`.

# Submit creative packet — Design Spec

**Date:** 2026-10-13  
**Product:** ClearPath Review  
**Status:** Approved for planning (brainstorm 2026-10-13)  
**Parent:** `docs/superpowers/specs/2026-10-12-clearpath-compliance-review-design.md`

---

## 1. Problem

Assumption **D7** previously treated visual assets as “file required, accompanying copy optional,” and text-only assets as “copy required, no file.” That understates how compliance desks review packets:

- Visual packets usually need accompanying copy (caption, CTA, alt text), not file-only.
- Email review usually wants HTML or a screenshot of the rendered email, not a plain text box alone.
- Landing review usually wants a destination URL **and** a page capture, not pasted body copy alone.
- Production desks often accept multi-file proofs (static + motion + landing) — **out of scope** for this pass.

---

## 2. Decision

**Scope A + validation rule set 2 + Approach 1.**

- Same two substance fields: one proof image (`creativeImage`) + one text area (`body`).
- Labels, help text, and **required** rules vary by asset type.
- No multi-file upload model in this pass.
- Update product assumptions and the parent design doc so they match the live app.

---

## 3. Submit form rules

| Asset type | Required proof image | Required text | Destination URL |
|------------|----------------------|---------------|-----------------|
| Banner / social / affiliate creative | Creative file (PNG/JPG/WebP/GIF, existing ~900 KB cap) | Accompanying copy (caption, CTA, alt text) | Required (existing) |
| Email | Email screenshot or HTML render image | Exact email copy | Required (existing) |
| Landing page | Page-capture image | Exact on-page copy | Required (existing) |

### UI copy (intent)

- Visual: “Creative file” + “Accompanying copy” — clarify caption / CTA / alt; not file-only.
- Email: “Email screenshot or HTML render” + “Exact email copy” — not plain text alone.
- Landing: “Page capture” + “Exact on-page copy”; URL field remains the live destination.
- Optional note in help: production desks often take separate static / motion / landing proofs; this demo accepts one primary proof image.

### Validation

Submit blocked unless:

1. Existing required metadata still present (title, audience, disclosures, valid URL, affiliate partner name when source is affiliate).
2. `creativeImage` present for **all** asset types under this rule set.
3. `body` trimmed non-empty for **all** asset types.

Error messages must name the missing piece in asset-specific language (file vs screenshot vs page capture; accompanying copy vs exact copy).

---

## 4. Review workspace

- Show the proof image whenever `creativeImage` is set, including email and landing (not only `isVisualAsset`).
- Keep consumer-facing copy (`body`) visible in the package.
- Classification / disclosures / destination unchanged.

---

## 5. Data model impact

No new persisted fields. Existing:

- `creativeImage?: string` — now used for visual creatives **and** email/landing proof images.
- `body: string` — accompanying or exact copy; required for all types after this change.
- `destinationUrl: string` — unchanged.

Seed data and storage key bump so demos load packets that satisfy the new required shape.

---

## 6. Assumptions & docs to update

| Artifact | Change |
|----------|--------|
| `src/data/assumptions.ts` D7 | File + accompanying copy for visuals; screenshot/HTML render + exact copy for email; page capture + exact copy + URL for landing. Multi-file proofs out of scope. |
| `docs/assumptions-evolution.md` D7 | Align “now in product” with the above. |
| Parent design spec §4.1–§4.4, §5, §6, §7, A3, §10 | Correct drift vs implementation (see §7 below). |

---

## 7. Parent design-doc accuracy corrections (locked)

These rewrite stale lines in `2026-10-12-clearpath-compliance-review-design.md` to match the shipped app (plus this creative-packet change):

| Section | Corrected truth |
|---------|-----------------|
| §4.1 metrics | Needs review / Due soon / All; filter chips include match counts; no median wait |
| §4.2 submit | Structured intake; risk suggestion is **read-only** on submit; reviewer may override tier on pending review |
| §4.2 creative | Proof image + copy required by asset type (this spec) |
| §4.3 disposition | Approve / Decline only; remediation autopopulates from findings |
| §4.4 | UI label **Activity**; route `/audit/:id` |
| §5 IA | `/` landing → `/entry/:role` → `/queue` or `/mine`; `/submit`, `/submit/:id`, `/review/:id`, `/audit/:id`, `/assumptions` |
| §6 model | Live `ReviewRequest` / `AuditEvent` shapes (string `disclosures`, no `riskTierSuggested`, status includes `withdrawn`, plus `creativeImage`, `submitter`, `source`, `partnerName`, `intakeNotes`) |
| §7 UX | No keyboard shortcuts in v1; Approve / Decline only |
| A3 | Decisions write immutable events; Decline stores `rejected` (+ reason codes) |
| §10 | Assumptions page surfaces curated key IDs from `assumptions.ts`, not only A1–A10 |

---

## 8. Out of scope

- Multi-file proofs (static + motion + landing as separate uploads)
- True HTML email source editor / MIME parse
- Live URL crawl or automated page capture
- Object storage / virus scanning (D8 still applies to data URLs)

---

## 9. Success criteria

1. Submitter cannot submit any asset type without both proof image and copy (plus existing required fields).
2. Labels/help match asset type (creative file vs email screenshot vs page capture).
3. Review shows proof image for email/landing when present.
4. D7 and parent design doc match the implementation after the change.
5. Seed + storage key refresh so Reset/demo loads valid packets.
