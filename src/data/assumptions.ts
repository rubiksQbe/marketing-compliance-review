export interface Assumption {
  id: string
  text: string
  implication: string
}

/**
 * Canonical log of operating assumptions and locked design decisions.
 * Full list in this file; /assumptions (Key decisions) shows KEY_ASSUMPTIONS.
 * Keep current when product rules change.
 */
/** Curated for /assumptions (Key decisions). Full log remains ASSUMPTIONS below. */
export const KEY_ASSUMPTION_IDS = [
  'D9',
  'D2',
  'D3',
  'D15',
  'D16',
  'D14',
  'A1c',
  'A3',
] as const

export const ASSUMPTIONS: Assumption[] = [
  // —— Operating model ——
  {
    id: 'P1',
    text: 'Marketing volume is growing faster than compliance headcount.',
    implication: 'Optimize reviewer decisions per hour, not creative production tooling.',
  },
  {
    id: 'A1b',
    text: 'Submitters should not see peers’ in-flight reviews by default.',
    implication: 'Submitter home is “Your submitted requests,” scoped by identity.',
  },
  {
    id: 'A1c',
    text: 'Portal submitters are internal marketers and affiliate managers only.',
    implication: 'External affiliates are out of scope; AMs gate partner packets upstream.',
  },
  {
    id: 'A1d',
    text: 'A pre-approved creative library exists (or is stood up in parallel).',
    implication: 'Custom affiliate work is the exception path into this portal.',
  },
  {
    id: 'A1e',
    text: 'Affiliate managers completeness-gate partner packets before portal submission.',
    implication: 'Compliance receives review-ready packages; AM↔affiliate workflow is out of scope.',
  },
  {
    id: 'A3',
    text: 'Human sign-off and a timestamped audit trail are mandatory for regulated claims.',
    implication: 'Approve / Decline always write an immutable event with reason codes when declining.',
  },
  {
    id: 'A5',
    text: 'Incomplete intake is a major rework driver.',
    implication: 'Submit is blocked until required package fields and disclosures are present.',
  },
  {
    id: 'A7',
    text: 'v1 is a demoable static app for GitHub Pages; no real auth/backend.',
    implication: 'Role cards + demo identity picker stand in for SSO; localStorage persistence.',
  },

  // —— Risk, SLA, and queue ——
  {
    id: 'D1',
    text: 'Every promotional packet in this portal needs a compliance decision before publish — risk does not skip review.',
    implication:
      'Risk tier only sets queue priority and turnaround window; Low still requires Approve or Decline.',
  },
  {
    id: 'D2',
    text: 'Risk-tiered routing raises throughput when paired with tiered review depth.',
    implication:
      'Queue sorts High → Low, then nearest due. Disposition checklist is short for Low (stamp), fuller for Medium, complete for High — not the same checklist with a different clock.',
  },
  {
    id: 'D3',
    text: 'Risk tier is auto-suggested from product, channel, and claim types; compliance may override.',
    implication:
      'Suggestion uses intake claim types plus content scan (copy/URL) — max wins on submit. Assist may suggest raising tier when flags need deeper checklist; raising re-runs Assist and pre-checks newly available boxes. Reviewers can still override tier on pending items.',
  },
  {
    id: 'D4',
    text: 'SLA (Service Level Agreement) clock is derived from risk tier — not an independent submitter choice.',
    implication:
      'High → 8h, Medium → 24h, Low → 48h (demo policy knobs: same-day / next-day / two-day). Stored as slaHours at submit/resubmit. A missed window does not close the request: it stays Needs review, the clock reads overdue, and it counts as Due soon until Approve, Decline, or Withdraw.',
  },
  {
    id: 'D5',
    text: '8h / 24h / 48h are plausible desk conventions for the prototype, not regulatory mandates.',
    implication: 'A real org would set windows from staffing, exam pressure, and channel; numbers are swappable policy.',
  },
  {
    id: 'D6',
    text: '“Due soon” means less than 25% of the tier window remains.',
    implication: 'Queue metric and urgent styling highlight items nearing or past due — still not a second risk score.',
  },

  // —— Intake / creative ——
  {
    id: 'D7',
    text: 'Every packet needs a proof image and consumer-facing copy; labels vary by asset type.',
    implication:
      'Banner / social / affiliate → creative file + accompanying copy (caption / CTA / alt). Email → screenshot or HTML render + exact copy. Landing → page capture + exact copy + destination URL. Multi-file proofs stay out of scope for this demo.',
  },
  {
    id: 'D8',
    text: 'Demo creative uploads are stored as data URLs with a ~900 KB cap.',
    implication: 'Fits localStorage demos; production would use object storage and virus scanning.',
  },

  // —— Disposition & status ——
  {
    id: 'D9',
    text: 'Reviewer dispositions are Approve or Decline only (no separate “changes requested” status going forward).',
    implication:
      'Decline stores status rejected with ≥1 reason code; UI label is Declined. Legacy seed changes_requested maps to the same label.',
  },
  {
    id: 'A6',
    text: 'Structured compliance issues beat freeform email.',
    implication:
      'Decline requires ≥1 issue; submitters (and reviewers on decided items) see marked issues plus autopopulated remediation.',
  },
  {
    id: 'D10',
    text: 'Submitters may edit & resubmit or soft-withdraw while pending or declined; approved packets are locked.',
    implication:
      'Withdraw sets status Withdrawn (not hard delete): hidden from the active review queue, payload + Activity retained. Resubmit returns pending items to Needs review.',
  },

  // —— Personas & IA ——
  {
    id: 'D11',
    text: 'Demo identities: Jordan Lee (Marketing Compliance Specialist), Ava Chen (internal marketer), Sam Ortiz (affiliate manager).',
    implication: 'Landing is Submit / Review role cards, then identity picker; shell shows name + kind label.',
  },
  {
    id: 'D12',
    text: 'Review workspace is dual-pane on large screens (≈2/3 package + 1/3 disposition); stacked with page scroll on small screens.',
    implication: 'Activity is a separate route for reviewers, linked from the decision rail.',
  },
  {
    id: 'D13',
    text: 'Branding is locked: navy/steel/mist/canvas/forest, Sen + Spectral, Phosphor icons, mesh BR3 @ 0.53 / 72%.',
    implication: 'See docs/prd/clearpath-review-prd.md §10 for full token and mesh specs.',
  },
  {
    id: 'D14',
    text: 'After decide, advance to the next pending item; reviewers can also step Previous / Next through the pending queue from the review header.',
    implication:
      'Queue order is High → Low, then nearest due. Previous/Next and post-decide advance are navigation aids — not a multi-reviewer claim/lock (that needs a shared backend).',
  },
  {
    id: 'D15',
    text: 'Compliance assist is hybrid desk triage: prefer POST /api/assist, optional local key for LLM/vision trials, then heuristic fallback; never auto-Approve.',
    implication:
      'Assist shows summary + findings (Where / Reason / On creative), may pre-check boxes, and can suggest raising risk tier when flags need a deeper checklist (raise re-runs Assist and checks new boxes). Optional local key via Review queue → AI assist.',
  },
  {
    id: 'D17',
    text: 'Demo seed High pending rows may use slaHours 24 so remaining time stays ≥12h at load; new High submits still use 8h.',
    implication:
      'Queue demos never start overdue or under the 12h floor. Production policy knobs remain High→8h / Med→24h / Low→48h on submit.',
  },
  {
    id: 'D16',
    text: 'Regulation map is an optional slide-over with official primary-source links — not checklist clutter.',
    implication:
      'Reviewers can open Why these issues? anytime; submitters only on declined packets. Statute names stay out of the default checklist labels.',
  },

  // —— Vocabulary (applied) ——
  {
    id: 'V1',
    text: 'UI copy: “Compliance issues” (not “Rejection reasons”) for decline checklists.',
    implication: 'Matches how reviewers describe findings; Approve / Decline CTAs unchanged.',
  },
  {
    id: 'V2',
    text: 'UI copy: “Remediation” (not “Requested changes”) for autopopulated fixes.',
    implication: 'Avoids implying a separate changes-requested status.',
  },
  {
    id: 'V3',
    text: 'UI copy: “Claim types” (not “Claims flagged” / “Claim flags”).',
    implication: 'Classification language for intake, not a prior finding.',
  },
  {
    id: 'V4',
    text: 'SLA / due clocks are reviewer-ops only; submitters do not see SLA.',
    implication: 'Submit shows risk suggestion only; queue and review header keep the due countdown for Jordan.',
  },
  {
    id: 'V5',
    text: 'UI copy: “Activity” (not “Audit trail”) for the event history route.',
    implication: 'Day-to-day workbench language; route path may still be /audit/:id.',
  },
]

export const KEY_ASSUMPTIONS: Assumption[] = KEY_ASSUMPTION_IDS.map((id) => {
  const found = ASSUMPTIONS.find((a) => a.id === id)
  if (!found) throw new Error(`Missing key assumption ${id}`)
  return found
})
