# ClearPath Financial Marketing Compliance Review

Internal compliance marketing review for **ClearPath Financial** (fictional) — personal loans, credit cards, and mortgage prequalification, including affiliate channels.

Replaces Excel + email with a risk-tiered queue, structured intake, one-screen decisions, and an audit trail.

**Docs:** [`docs/README.md`](docs/README.md) · decisions log `src/data/assumptions.ts` · Assist API `docs/api/assist.md`

## Key decisions

- **Approve or Decline only** — no third “changes requested” status; Decline means remediate and resubmit.
- **Risk sets priority, SLA, and checklist depth** — it never skips a human decision.
- **Submitters** are internal marketers and affiliate managers; external affiliates stay upstream.
- **Every packet needs a proof image and copy** (labels vary by asset type).
- **Assist triages; humans decide** — optional local LLM key; production uses `POST /api/assist`.
- **Regulation map on demand** (**Why these issues?**) — plain checklist labels; no legal disclaimer.

## Changes in this pass (2026-10-16)

- **Regulation map** — slide-over with official CFPB / FTC / eCFR links; reviewers anytime, submitters on Declined.
- **Next-in-queue** after Approve/Decline, plus **Previous / Next** on the review header.
- **Desk-style Assist** — summary, findings (Where / Reason / On creative), checklist pre-checks; never auto-Approves.
- **Tier raise from Assist** — when flags need a deeper checklist, suggest Raise; re-run and pre-check new boxes.
- **Content risk on submit** — intake claim types + copy/URL scan; higher signal wins so underflags don’t stay Low.
- **Robust seeds (v7)** — ~20 promo packets, pending due ≥12h, subtle decline cases Assist catches offline.
- **AI assist** on the Review queue (mobile-visible); README local-key steps; Submit form back link.
- **Key decisions** page refreshed (D9, D2, D3, D15, D16, D14, A1c, A3).

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123).

```bash
npm run build
npm run preview
```

Data lives in `localStorage` (`clearpath-review.requests.v7`). Header **Reset** reloads seeds.

## AI assist (optional local LLM key)

Assist runs on any **pending** open (seeds and new submits). Order: `POST /api/assist` → local OpenAI key → heuristic fallback.

1. Create a key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys) (none is bundled).
2. Sign in as **Jordan Lee** → **Review queue** → **AI assist**.
3. Paste → **Save key** (this browser’s `localStorage` only).
4. Open or **Re-run** Assist on a pending review (`gpt-4o-mini`; may send the proof image).
5. **Clear key** when finished. Do not commit keys; production keeps keys server-side.

Without a key or proxy, fallback rules still triage.

## Stack

Vite · React 19 · TypeScript · Tailwind CSS 4 · React Router · Phosphor Icons · Sen + Spectral
