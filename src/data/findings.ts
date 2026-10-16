import type { ReasonCode, RiskTier } from '@/lib/types'

export interface Finding {
  code: ReasonCode
  label: string
  fix: string
  /** Lowest risk tier that includes this issue on the disposition checklist. */
  fromTier: RiskTier
}

/**
 * Exception-based disposition list.
 * Tiered depth: Low = stamp path; Medium adds claim/landing checks; High = full set.
 */
export const FINDINGS: Finding[] = [
  {
    code: 'missing_disclosure',
    label: 'Missing / incomplete disclosure',
    fix: 'Add the full required disclosure with the claim.',
    fromTier: 'low',
  },
  {
    code: 'misleading_net_impression',
    label: 'Misleading net impression',
    fix: 'Rewrite headline/visual so it matches actual terms.',
    fromTier: 'low',
  },
  {
    code: 'unsubstantiated_claim',
    label: 'Unsubstantiated claim',
    fix: 'Remove/qualify the claim or attach approved substantiation.',
    fromTier: 'medium',
  },
  {
    code: 'not_clear_conspicuous',
    label: 'Not clear & conspicuous',
    fix: 'Move disclosure proximate to the claim; increase prominence.',
    fromTier: 'medium',
  },
  {
    code: 'offer_landing_mismatch',
    label: 'Offer–landing mismatch',
    fix: 'Align CTA/destination terms with the creative.',
    fromTier: 'medium',
  },
  {
    code: 'affiliate_relationship_unclear',
    label: 'Affiliate relationship unclear',
    fix: 'State the paid/partner relationship clearly near the offer.',
    fromTier: 'high',
  },
  {
    code: 'trigger_terms_incomplete',
    label: 'Triggering terms incomplete',
    fix: 'Add required credit terms or remove triggers.',
    fromTier: 'high',
  },
  {
    code: 'other',
    label: 'Other',
    fix: 'See additional notes.',
    fromTier: 'low',
  },
]

const TIER_RANK: Record<RiskTier, number> = { low: 0, medium: 1, high: 2 }

export function findingsForTier(tier: RiskTier): Finding[] {
  const rank = TIER_RANK[tier]
  return FINDINGS.filter((f) => TIER_RANK[f.fromTier] <= rank)
}

export function fromTierForCode(code: ReasonCode): RiskTier {
  return FINDINGS.find((f) => f.code === code)?.fromTier ?? 'low'
}

/** Lowest checklist tier that includes every given reason code. */
export function minTierForCodes(codes: ReasonCode[]): RiskTier {
  let rank = 0
  for (const code of codes) {
    rank = Math.max(rank, TIER_RANK[fromTierForCode(code)])
  }
  if (rank >= 2) return 'high'
  if (rank >= 1) return 'medium'
  return 'low'
}

export const REVIEW_DEPTH_COPY: Record<
  RiskTier,
  { title: string; hint: string }
> = {
  low: {
    title: 'Stamp path',
    hint: 'Disclosures and net impression only — approve quickly if clean.',
  },
  medium: {
    title: 'Standard review',
    hint: 'Stamp checks plus substantiation, clarity, and landing match.',
  },
  high: {
    title: 'Full review',
    hint: 'Complete checklist — affiliate relationship and triggering terms included.',
  },
}

export function fixesForCodes(codes: ReasonCode[]): string[] {
  return codes.map((code) => FINDINGS.find((f) => f.code === code)?.fix ?? 'See additional notes.')
}
