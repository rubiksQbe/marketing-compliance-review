> **Implemented / historical.** Current notes: `docs/README.md`. Canonical decisions: `src/data/assumptions.ts`.

# Submit Creative Packet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Require a proof image and consumer-facing copy on every submit packet, with asset-specific labels/help, and show that proof on review for email/landing as well as visuals.

**Architecture:** Extract pure creative-packet helpers (labels + validation messages) used by `SubmitPage`. Keep the existing `creativeImage` + `body` fields. Always persist `creativeImage` when present. Update `ReviewPage` to render the image whenever set. Align D7 / evolution notes and refresh seeds + storage key.

**Tech Stack:** Vite, React 19, TypeScript, Tailwind 4, localStorage seed (`src/data/seed.ts`)

## Global Constraints

- Scope A only: one proof image + one text field; no multi-file uploads.
- Validation rule set 2: every asset type requires both `creativeImage` and non-empty `body`.
- Destination URL remains required for all types (existing).
- Image types stay PNG/JPG/WebP/GIF under ~900 KB (D8).
- Multi-file proofs (static + motion + landing) stay out of scope; help text may note that.
- Spec: `docs/superpowers/specs/2026-10-13-submit-creative-packet-design.md`

## File map

| File | Responsibility |
|------|----------------|
| `src/lib/creativePacket.ts` | Asset-typed labels, help, missing-field errors, `requiresProofImage` helpers |
| `src/lib/creativePacket.check.ts` | Node-runnable assertions for those helpers (no new test runner) |
| `src/pages/SubmitPage.tsx` | Wire labels, always show file input, require image+copy, always save `creativeImage` |
| `src/pages/ReviewPage.tsx` | Show proof image whenever `creativeImage` is set; always show copy |
| `src/data/assumptions.ts` | Update D7 text/implication |
| `docs/assumptions-evolution.md` | Align D7 “now in product” |
| `src/data/seed.ts` | Ensure every seed packet that is submit-shaped has image+body where needed for demos |
| `src/lib/storage.ts` | Bump requests key so demos pick up seed/validation changes |

---

### Task 1: Creative packet helpers + checks

**Files:**
- Create: `src/lib/creativePacket.ts`
- Create: `src/lib/creativePacket.check.ts`
- Test: run via Vite SSR in Node (same pattern as prior seed checks)

**Interfaces:**
- Consumes: `AssetType` from `src/lib/types.ts`; `isVisualAsset` from `src/lib/labels.ts`
- Produces:
  - `export type CreativePacketCopy = { sectionHint: string; fileLabel: string; fileHelp: string; bodyLabel: string; bodyHelp: string }`
  - `export function creativePacketCopy(assetType: AssetType): CreativePacketCopy`
  - `export function missingCreativeErrors(input: { assetType: AssetType; creativeImage?: string; body: string }): string[]` — returns zero or more human-readable errors (image missing and/or copy missing), asset-specific wording

- [ ] **Step 1: Write the failing check script**

Create `src/lib/creativePacket.check.ts`:

```ts
import type { AssetType } from './types'
import { creativePacketCopy, missingCreativeErrors } from './creativePacket'

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg)
}

const banner = creativePacketCopy('banner')
assert(banner.fileLabel.toLowerCase().includes('creative'), 'banner file label')
assert(banner.bodyLabel.toLowerCase().includes('accompanying'), 'banner body label')
assert(banner.bodyHelp.toLowerCase().includes('caption'), 'banner body help mentions caption')

const email = creativePacketCopy('email')
assert(/screenshot|html/i.test(email.fileLabel), 'email file label')
assert(/exact/i.test(email.bodyLabel), 'email body label')

const landing = creativePacketCopy('landing_page')
assert(/page capture|capture/i.test(landing.fileLabel), 'landing file label')

assert(
  missingCreativeErrors({ assetType: 'banner', body: '' }).length >= 2,
  'banner missing both',
)
assert(
  missingCreativeErrors({ assetType: 'email', creativeImage: 'data:image/png;base64,xx', body: 'Hi' })
    .length === 0,
  'email complete',
)
assert(
  missingCreativeErrors({ assetType: 'landing_page', body: 'Copy' }).some((e) =>
    /capture|screenshot|image|file/i.test(e),
  ),
  'landing missing capture',
)

console.log('creativePacket checks passed')
```

- [ ] **Step 2: Run check to verify it fails**

Run:

```bash
node --input-type=module <<'EOF'
import { createServer } from 'vite'
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
try {
  await server.ssrLoadModule('/src/lib/creativePacket.check.ts')
} finally {
  await server.close()
}
EOF
```

Expected: FAIL — cannot resolve `./creativePacket` / module not found.

- [ ] **Step 3: Implement helpers**

Create `src/lib/creativePacket.ts`:

```ts
import { isVisualAsset } from './labels'
import type { AssetType } from './types'

export type CreativePacketCopy = {
  sectionHint: string
  fileLabel: string
  fileHelp: string
  bodyLabel: string
  bodyHelp: string
}

export function creativePacketCopy(assetType: AssetType): CreativePacketCopy {
  if (isVisualAsset(assetType)) {
    return {
      sectionHint:
        'Visual packets need the creative file and accompanying copy (caption, CTA, alt text) — not file-only.',
      fileLabel: 'Creative file',
      fileHelp: 'Banner, social, or affiliate image (PNG, JPG, WebP, or GIF · under 900 KB).',
      bodyLabel: 'Accompanying copy',
      bodyHelp: 'Caption, CTA, and alt text as shown to consumers. Required even when text appears in the image.',
    }
  }
  if (assetType === 'email') {
    return {
      sectionHint:
        'Email review needs a screenshot or HTML render plus the exact copy — not a plain text box alone.',
      fileLabel: 'Email screenshot or HTML render',
      fileHelp: 'Upload a PNG, JPG, WebP, or GIF of the rendered email (under 900 KB).',
      bodyLabel: 'Exact email copy',
      bodyHelp: 'Paste the exact consumer-facing email text, including subject line if claimed.',
    }
  }
  return {
    sectionHint:
      'Landing review needs the destination URL, a page capture, and exact on-page copy — not paste-only.',
    fileLabel: 'Page capture',
    fileHelp: 'Upload a PNG, JPG, WebP, or GIF screenshot of the landing page (under 900 KB).',
    bodyLabel: 'Exact on-page copy',
    bodyHelp: 'Paste the exact headline and body copy as shown on the page.',
  }
}

export function missingCreativeErrors(input: {
  assetType: AssetType
  creativeImage?: string
  body: string
}): string[] {
  const copy = creativePacketCopy(input.assetType)
  const errors: string[] = []
  if (!input.creativeImage) {
    errors.push(`Upload the ${copy.fileLabel.toLowerCase()}.`)
  }
  if (!input.body.trim()) {
    errors.push(`Add the ${copy.bodyLabel.toLowerCase()}.`)
  }
  return errors
}
```

- [ ] **Step 4: Re-run check to verify it passes**

Same command as Step 2.  
Expected: stdout includes `creativePacket checks passed`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/creativePacket.ts src/lib/creativePacket.check.ts
git commit -m "Add creative packet label and validation helpers."
```

---

### Task 2: Submit form requires proof image + copy for all asset types

**Files:**
- Modify: `src/pages/SubmitPage.tsx`
- Consumes: `creativePacketCopy`, `missingCreativeErrors` from Task 1

**Interfaces:**
- Consumes: `creativePacketCopy(assetType)`, `missingCreativeErrors({ assetType, creativeImage, body })`
- Produces: Submit payload always includes `creativeImage` when set (including email/landing)

- [ ] **Step 1: Import helpers and derive packet copy**

Near other imports in `SubmitPage.tsx`:

```ts
import { creativePacketCopy, missingCreativeErrors } from '@/lib/creativePacket'
```

Replace:

```ts
  const visual = isVisualAsset(assetType)

  /** Visual assets require a file; text-only assets require copy. */
  const hasCreativeSubstance = visual ? Boolean(creativeImage) : Boolean(body.trim())
  const copyRequired = !visual
```

with:

```ts
  const visual = isVisualAsset(assetType)
  const packet = creativePacketCopy(assetType)
```

- [ ] **Step 2: Fix dirty-check and payload to keep email/landing images**

In `isDirty`, change:

```ts
    const nextImage = isVisualAsset(assetType) ? creativeImage : undefined
```

to:

```ts
    const nextImage = creativeImage
```

In `onSubmit` payload, change:

```ts
      creativeImage: visual ? creativeImage : undefined,
```

to:

```ts
      creativeImage,
```

- [ ] **Step 3: Replace validation for creative substance**

Replace the `if (!hasCreativeSubstance) { ... }` block with:

```ts
    const creativeErrors = missingCreativeErrors({ assetType, creativeImage, body })
    if (creativeErrors.length) {
      setError(creativeErrors[0]!)
      return
    }
```

- [ ] **Step 4: Revamp Creative section UI**

Replace the Creative block (section heading through body textarea) so that:

1. Section hint uses `packet.sectionHint`.
2. File upload is **always** shown (not only when `visual`), with `packet.fileLabel` / `packet.fileHelp`.
3. Body field is **always required**, with `packet.bodyLabel` / `packet.bodyHelp`.
4. Keep existing file input accept list and preview/remove UI.

Sketch:

```tsx
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-navy-800">
              Creative <span className="text-danger">*</span>
            </p>
            <p className="mt-0.5 text-xs text-steel-600">{packet.sectionHint}</p>
            <p className="mt-1 text-[11px] text-steel-600">
              Production desks often take separate static, motion, and landing proofs; this demo
              accepts one primary proof image.
            </p>
          </div>

          <div>
            <Label htmlFor="creative-file" required>
              {packet.fileLabel}
            </Label>
            <p className="mt-0.5 text-xs text-steel-600">{packet.fileHelp}</p>
            {/* existing file input + preview/remove */}
          </div>

          <div>
            <Label htmlFor="body" required>
              {packet.bodyLabel}
            </Label>
            <p className="mt-0.5 text-xs text-steel-600">{packet.bodyHelp}</p>
            <Textarea
              id="body"
              className="mt-1 min-h-24"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
        </div>
```

When switching asset type away from visual, **do not** clear `creativeImage` automatically anymore (email/landing need it). Remove the clear-on-switch behavior if present:

```ts
                if (!isVisualAsset(next)) {
                  setCreativeImage(undefined)
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }
```

Delete that block; keep only `setAssetType(next)`.

- [ ] **Step 5: Typecheck / lint**

```bash
npx tsc -b --pretty false
npm run lint
```

Expected: `tsc` exit 0; oxlint may still show pre-existing warnings only.

- [ ] **Step 6: Commit**

```bash
git add src/pages/SubmitPage.tsx
git commit -m "Require proof image and copy on submit for every asset type."
```

---

### Task 3: Review page shows proof image for all asset types

**Files:**
- Modify: `src/pages/ReviewPage.tsx` (Creative section ~207–247)

**Interfaces:**
- Consumes: `request.creativeImage`, `request.body`
- Produces: Image preview whenever `creativeImage` is set; copy always shown below (or as primary text for text packets)

- [ ] **Step 1: Replace Creative rendering**

Replace the `visual ? (...) : (blockquote)` branch with:

```tsx
              <SectionLabel>Creative</SectionLabel>
              {request.creativeImage ? (
                <div className="overflow-hidden rounded-[5px] border border-mist-200 bg-canvas">
                  <img
                    src={request.creativeImage}
                    alt="Submitted creative proof"
                    className="max-h-[220px] w-full object-contain"
                  />
                </div>
              ) : visual ? (
                <div
                  className="relative flex h-[140px] flex-col justify-center overflow-hidden rounded-[5px] px-[18px] py-4 text-white"
                  style={{
                    background:
                      'linear-gradient(120deg, #183757 0%, #2d5d90 48%, #629bb8 100%)',
                  }}
                  role="img"
                  aria-label="Creative preview"
                >
                  {/* keep existing decorative fallback markup */}
                </div>
              ) : null}

              {request.body.trim() ? (
                <>
                  <SectionLabel>{visual ? 'Accompanying copy' : 'Copy'}</SectionLabel>
                  <blockquote className="rounded-r-[5px] border-l-[3px] border-steel-400 bg-canvas px-3 py-2.5 text-[13px] leading-snug text-navy-800">
                    {request.body}
                  </blockquote>
                </>
              ) : null}
```

Keep the existing decorative fallback children inside the `visual` gradient block unchanged from current file.

- [ ] **Step 2: Typecheck**

```bash
npx tsc -b --pretty false
```

Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/pages/ReviewPage.tsx
git commit -m "Show creative proof images for email and landing on review."
```

---

### Task 4: Assumptions, seeds, storage key

**Files:**
- Modify: `src/data/assumptions.ts` (D7)
- Modify: `docs/assumptions-evolution.md` (D7 section)
- Modify: `src/data/seed.ts` (add placeholder note / ensure email & landing demos can show proofs where practical)
- Modify: `src/lib/storage.ts` (bump `REQUESTS_KEY` to `v6`)

**Interfaces:**
- Consumes: none new
- Produces: D7 matches shipped rules; demos load under new key

- [ ] **Step 1: Update D7 in assumptions**

Replace D7 with:

```ts
  {
    id: 'D7',
    text: 'Every packet needs a proof image and consumer-facing copy; labels vary by asset type.',
    implication:
      'Banner / social / affiliate → creative file + accompanying copy (caption / CTA / alt). Email → screenshot or HTML render + exact copy. Landing → page capture + exact copy + destination URL. Multi-file proofs stay out of scope for this demo.',
  },
```

- [ ] **Step 2: Update evolution doc D7**

In `docs/assumptions-evolution.md`, replace the D7 subsection body so **Now in product** matches Step 1 implication (file+copy for visuals; screenshot+copy for email; capture+copy+URL for landing; multi-file out of scope).

- [ ] **Step 3: Seed / storage**

Bump in `src/lib/storage.ts`:

```ts
const REQUESTS_KEY = 'clearpath-review.requests.v6'
```

For seeds: email (`CP-1041`) and landing (`CP-1031`, `CP-1044`, `CP-1035`) currently lack `creativeImage`. Do **not** invent large data-URL binaries in git. Instead:

1. Leave historical decided seeds without images (review shows copy; gradient fallback only for visuals without image).
2. For **pending** email/landing that submitters might open as edit templates, prefer leaving them as-is for queue demo **or** add a short `intakeNotes` reminder that new submits require a capture — do not block Reset demos.
3. Optional: if any pending email/landing is meant to demonstrate the new review layout, skip heavy fixtures; manual submit in QA covers the happy path.

Primary guarantee: **new submits** enforce image+copy. Seeds remain loadable.

- [ ] **Step 4: Run helper check + typecheck**

```bash
node --input-type=module <<'EOF'
import { createServer } from 'vite'
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
try {
  await server.ssrLoadModule('/src/lib/creativePacket.check.ts')
} finally {
  await server.close()
}
EOF
npx tsc -b --pretty false
npm run lint
```

Expected: checks passed; tsc 0.

- [ ] **Step 5: Commit**

```bash
git add src/data/assumptions.ts docs/assumptions-evolution.md src/lib/storage.ts src/data/seed.ts
git commit -m "Align D7 and storage with required proof image plus copy."
```

---

### Task 5: Manual verification

**Files:** none (browser)

- [ ] **Step 1: Start app**

```bash
npm run dev
```

Open `http://127.0.0.1:43123/`.

- [ ] **Step 2: Submitter path — banner**

Log in as Ava → New request → asset **Display banner**. Confirm Creative file + Accompanying copy both required. Submit blocked if either missing. With both present, submit succeeds and review shows image + accompanying copy.

- [ ] **Step 3: Submitter path — email**

Asset **Email**. Confirm labels say screenshot/HTML render + exact copy. Both required. Review shows image + copy.

- [ ] **Step 4: Submitter path — landing**

Asset **Landing page**. Confirm page capture + exact copy + URL. Review shows capture + copy.

- [ ] **Step 5: Assumptions**

Open `/assumptions` (or key list) and confirm D7 reflects the new rule.

- [ ] **Step 6: Commit any leftover fixes; push; update PR**

```bash
git push -u origin cursor/sla-active-seed-853a
```

Update PR #2 body to note creative-packet implementation complete.

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| Visual: file + accompanying copy required | 1–2 |
| Email: screenshot/HTML render + exact copy | 1–2 |
| Landing: page capture + copy + URL | 1–2 (URL already required) |
| Asset-specific labels/help | 1–2 |
| Multi-file note, still out of scope | 2 (help text) |
| Review shows proof for email/landing | 3 |
| D7 + evolution + parent already updated | 4 (+ prior design commits) |
| Storage key bump for demos | 4 |
| Manual QA | 5 |

## Placeholder / consistency self-review

- No TBD/TODO left in tasks.
- Helper names (`creativePacketCopy`, `missingCreativeErrors`) consistent across Tasks 1–2.
- Payload always keeps `creativeImage` for all asset types after Task 2.
