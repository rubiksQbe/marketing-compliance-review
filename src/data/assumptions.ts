export interface Assumption {
  id: string
  text: string
  implication: string
}

export const ASSUMPTIONS: Assumption[] = [
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
    id: 'A4',
    text: 'Risk-tiered routing raises throughput more than raw headcount.',
    implication: 'Queue prioritizes High (8h) / Med (24h) / Low (48h) SLAs.',
  },
  {
    id: 'A5',
    text: 'Incomplete intake is a major rework driver.',
    implication: 'Submit is blocked until required fields and disclosures are present.',
  },
  {
    id: 'A6',
    text: 'Structured rejection reasons beat freeform email.',
    implication: 'Decline requires ≥1 finding; submitters see autopopulated requested-change fixes.',
  },
  {
    id: 'A7',
    text: 'v1 is a demoable static app for GitHub Pages; no real auth/backend.',
    implication: 'Role cards + demo identity picker stand in for SSO; localStorage persistence.',
  },
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
    text: 'Vocabulary candidate: “SLA” / “SLA at risk” → “Due” / “Due soon” in submitter-facing UI.',
    implication: 'SLA is ops jargon; due timing is clearer for marketers.',
  },
  {
    id: 'V5',
    text: 'Vocabulary candidate: “Audit trail” → “Activity” for day-to-day review; keep “Audit” in export/compliance contexts.',
    implication: 'Aligns with how reviewers narrate the workbench without diluting regulatory meaning.',
  },
]
