# Documentation map

**Canonical decisions:** `src/data/assumptions.ts` (in-app **Key decisions** curated list: D9, D2, D3, D15, D16, D14, A1c, A3).  
**Living critique:** `docs/assumptions-evolution.md`  
**Assist API contract:** `docs/api/assist.md`  
**PRD / early design:** historical baseline — prefer assumptions.ts when they conflict.

Historical Superpowers specs/plans under `docs/superpowers/` record how features were built; they are not the source of truth for current UI copy.

---

## What the app is now

Risk-tiered compliance review workbench: structured intake → queue → one-screen decide → Activity trail. Assist triages pending packets; humans Approve/Decline. Static SPA + `localStorage` (`requests.v7`).

---

## Key decisions (product)

| Choice | Why |
|--------|-----|
| Binary **Approve / Decline** (no third “changes requested” CTA) | One outcome maps to 0 vs ≥1 compliance issues; Decline implies remediate & resubmit |
| **Risk** = priority + SLA + checklist depth, never skip review | High gets fuller checklist; Low still needs a decision |
| **AM + internal marketer** submit; affiliates stay upstream | Completeness gate outside this portal |
| **Proof image + copy** on every asset type | Visual packets still need caption/CTA/alt; email/landing need screenshot/capture |
| Soft **Withdraw** (not hard delete) | Keep audit evidence |
| **Next pending** after decide | Desk walk; not a concurrency lock (needs backend) |
| **Hybrid Assist** (proxy → local key → rules); never auto-Approve | Triage only; LLM optional; may suggest raising tier so deeper checkboxes appear and get pre-checked |
| **Content risk on submit** | Intake claim types + copy/URL scan; **max** wins so underflagging doesn’t silently stay Low |
| **Regulation map** slide-over, no legal disclaimer | Official links on demand; keep checklist vocabulary plain |

---

## UX considerations (locked in review)

- Queue metrics: **Needs review**, **Due soon**, **All**; filters show counts  
- SLA clocks are **reviewer-only**; submitters never see them  
- Checklist labels stay plain (“Compliance issues”); statute names live in **Why these issues?**  
- Assist panel: short **Summary** + findings (**Where** / **Reason** / one **On creative**); no source footer  
- **AI assist** lives on the Review queue body (mobile-visible), not the header  
- Submitters see regulation map only on **Declined** packets  

---

## How the product owner guided the agent

Direction came from Tina in-chat (not invented by the agent):

- Rejected AI-default third disposition; kept Approve/Decline  
- Relabeled metrics (Due soon / All) and required filter counts  
- Renamed **Key decisions**; dropped P1 / D1 / D7 from the curated list  
- Required proof+copy intake; no “file only” / copy-only email-landing  
- Regulation map for reviewers + declined submitters; **no** legal-advice disclaimer  
- Next-in-queue after decide; hybrid Assist with human final say  
- Desk-style triage (summary + evidence); short summary copy; merge callouts; drop “(proof)” / source line  
- Seed library: realistic promo packets, subtle decline cases, pending due ≥12h  
- Move Assist settings → queue as **AI assist**; document local key in README  

---

## Assumptions still stretched

See `docs/assumptions-evolution.md` — e.g. calendar-hour SLAs, AM always gates completeness, client-only multi-reviewer safety, browser LLM keys for prototypes only.
