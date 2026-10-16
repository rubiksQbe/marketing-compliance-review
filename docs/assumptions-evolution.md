# Assumptions critique & evolution

Companion to `src/data/assumptions.ts` (in-app: **demo notes · key decisions**).  
What holds for this prototype, what is stretched, and what shipped from earlier critiques.

---

## Solid for the prototype

| ID | Note |
|----|------|
| **A1c / A3 / A6** | AM + marketer submitters; human sign-off; structured issues + remediation |
| **D2 / D3 / D4** | Tiered depth + priority; suggested risk with reviewer override; SLA from tier |
| **D7 / D9 / D10** | Proof + copy; Approve/Decline only; soft withdraw |
| **D14–D17** | Next-in-queue ≠ lock; hybrid Assist; regulation map; seed High clock exception |
| **V1–V5** | Compliance issues / Remediation / Claim types / Activity; SLA reviewer-only |

---

## Stretched — evolution path

| Topic | Stretch | Evolution |
|-------|---------|-----------|
| **A1b** peer visibility | Mine is persona-scoped | Campaign / workspace RBAC |
| **A1d** pre-approved library | Assumed elsewhere | First-class template / skip-review path |
| **A1e** AM completeness gate | Uneven in reality | AM checklist or return-to-AM without full Decline |
| **D4/D5** 8/24/48h calendar | Ignores business hours | Business-hour clocks, pause on remediation |
| **D6** Due soon &lt;25% | Arbitrary | Configurable; separate overdue metric |
| **D14** concurrency | localStorage can’t claim | Backend claim/lease + optimistic versions |
| **D15** Assist | Needs keys/egress for LLM/vision | Hosted `/api/assist`, eval harness |

---

## Shipped from critique / owner direction

| Change | Touches |
|--------|---------|
| Reviewer risk override | D3 |
| Proof image + copy all asset types | D7 |
| Tiered checklist + queue priority | D2 |
| Soft withdraw | D10 |
| Next-in-queue after decide | D14 |
| Hybrid Assist triage (summary / where / reason / on creative) | D15 |
| Regulation map, no disclaimer | D16 |
| Seed pending ≥12h remaining (High seed `slaHours: 24`) | D17 |
| Queue UX: Due soon / All, filter counts; AI assist on queue | V* / owner |

When rules change, update `src/data/assumptions.ts` first.
