# ClearPath Financial Marketing Compliance Review

Internal compliance marketing review for **ClearPath Financial** (fictional) — personal loans, credit cards, and mortgage prequalification, including affiliate channels.

Replaces Excel + email with risk-tiered queue, structured intake, one-screen decisions, and an audit trail.

**Docs:** [`docs/README.md`](docs/README.md) (map, decisions, UX, owner guidance) · canonical log `src/data/assumptions.ts` · Assist API `docs/api/assist.md`

## Key decisions

- **Approve / Decline only** — decline = needs remediation; no separate “changes requested” CTA (owner rejected the AI-suggested third status).
- **Risk** sets queue order, SLA, and checklist depth — never skips human review.
- Submitters are **internal marketers + affiliate managers**; external affiliates stay upstream.
- Every packet needs **proof image + copy** (labels vary by asset type).
- **Assist** triages (summary + findings); human decides. Optional local LLM key; production uses `POST /api/assist`.
- **Regulation map** on demand (**Why these issues?**); plain checklist labels; no legal disclaimer.

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

Data: `localStorage` (`clearpath-review.requests.v7`). Header **Reset** reloads seeds.

## AI assist (optional local LLM key)

Assist auto-runs on any **pending** open (seeds and new submits). Order: `POST /api/assist` → local OpenAI key → heuristic fallback.

1. Create a key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys) (none is bundled).  
2. Sign in as **Jordan Lee** → **Review queue** → **AI assist**.  
3. Paste → **Save key** (this browser’s `localStorage` only).  
4. Open or **Re-run** on a pending review (`gpt-4o-mini`; may send proof image).  
5. **Clear key** when done. Do not commit keys; production keeps keys server-side.

Without a key/proxy, fallback rules still triage.

## Stack

Vite · React 19 · TypeScript · Tailwind CSS 4 · React Router · Phosphor Icons · Sen + Spectral
