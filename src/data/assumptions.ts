export interface Assumption {
  id: string
  text: string
  implication: string
}

/**
 * Canonical log of operating assumptions and locked design decisions.
 * Shown in-app at /assumptions; keep this file current when product rules change.
 */
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
    text: 'Risk-tiered routing raises throughput more than raw headcount.',
    implication: 'Queue sorts High → Low, then nearest due time within the same tier.',
  },
  {
    id: 'D3',
    text: 'Risk tier is auto-scored from product, channel, and claim flags (weighted demo matrix).',
    implication:
      'Submitters see a read-only suggestion; they cannot override tier. Score updates live as those fields change.',
  },
  {
    id: 'D4',
    text: 'SLA clock is derived from risk tier — not an independent submitter choice.',
    implication:
      'High → 8h, Medium → 24h, Low → 48h (demo policy knobs: same-day / next-day / two-day). Stored as slaHours at submit/resubmit.',
  },
  {
    id: 'D5',
    text: '8h / 24h / 48h are plausible desk conventions for the prototype, not regulatory mandates.',
    implication: 'A real org would set windows from staffing, exam pressure, and channel; numbers are swappable policy.',
  },
  {
    id: 'D6',
    text: '“SLA at risk” means less than 25% of the tier window remains.',
    implication: 'Queue metric and urgent styling highlight items nearing or past due — still not a second risk score.',
  },

  // —— Intake / creative ——
  {
    id: 'D7',
    text: 'Creative substance requires at least one of: uploaded file or exact copy.',
    implication:
      'Visual asset types (banner, social, affiliate creative) may attach an optional image; text-only types (email, landing) require copy and hide file upload.',
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
    text: 'Structured rejection reasons beat freeform email.',
    implication:
      'Decline requires ≥1 finding; submitters (and reviewers on decided items) see marked reasons plus autopopulated requested-change fixes.',
  },
  {
    id: 'D10',
    text: 'Submitters may edit & resubmit or delete while pending or declined; approved packets are locked.',
    implication: 'Resubmit returns the item to Needs review with a new audit event.',
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
    implication: 'Audit trail is a separate route for reviewers, linked from the decision rail.',
  },
  {
    id: 'D13',
    text: 'Branding is locked: navy/steel/mist/canvas/forest, Sen + Spectral, Phosphor icons, mesh BR3 @ 0.53 / 72%.',
    implication: 'See docs/prd/clearpath-review-prd.md §10 for full token and mesh specs.',
  },

  // —— Vocabulary candidates (not yet applied) ——
  {
    id: 'V1',
    text: 'Vocabulary candidate: label decline reasons “Decline reasons” (not “Rejection reasons”) to match Approve / Decline CTAs.',
    implication: 'Keeps disposition language consistent; legal teams may still prefer “rejection” in audit exports.',
  },
  {
    id: 'V2',
    text: 'Vocabulary candidate: rename “Requested changes” → “Required fixes” (or “Remediation”).',
    implication: 'Avoids implying a separate changes-requested status after Decline was locked as the only negative disposition.',
  },
  {
    id: 'V3',
    text: 'Vocabulary candidate: “Claims flagged” → “Claim types” or “Risk triggers.”',
    implication: 'Matches how marketers classify packets before send; “flagged” can sound like a prior finding.',
  },
  {
    id: 'V4',
    text: 'Vocabulary candidate: “SLA” / “SLA at risk” → “Due” / “Due soon” in submitter-facing UI (and clearer reviewer copy).',
    implication: 'SLA is ops jargon; due timing is clearer — especially since SLA is just the risk-derived clock.',
  },
  {
    id: 'V5',
    text: 'Vocabulary candidate: “Audit trail” → “Activity” for day-to-day review; keep “Audit” in export/compliance contexts.',
    implication: 'Aligns with how reviewers narrate the workbench without diluting regulatory meaning.',
  },
]
