import type { ReasonCode } from '@/lib/types'

export interface Finding {
  code: ReasonCode
  label: string
  fix: string
}

/** Exception-based disposition list (critical findings). */
export const FINDINGS: Finding[] = [
  {
    code: 'missing_disclosure',
    label: 'Missing / incomplete disclosure',
    fix: 'Add the full required disclosure with the claim.',
  },
  {
    code: 'unsubstantiated_claim',
    label: 'Unsubstantiated claim',
    fix: 'Remove/qualify the claim or attach approved substantiation.',
  },
  {
    code: 'not_clear_conspicuous',
    label: 'Not clear & conspicuous',
    fix: 'Move disclosure proximate to the claim; increase prominence.',
  },
  {
    code: 'affiliate_relationship_unclear',
    label: 'Affiliate relationship unclear',
    fix: 'State the paid/partner relationship clearly near the offer.',
  },
  {
    code: 'offer_landing_mismatch',
    label: 'Offer–landing mismatch',
    fix: 'Align CTA/destination terms with the creative.',
  },
  {
    code: 'misleading_net_impression',
    label: 'Misleading net impression',
    fix: 'Rewrite headline/visual so it matches actual terms.',
  },
  {
    code: 'trigger_terms_incomplete',
    label: 'Triggering terms incomplete',
    fix: 'Add required credit terms or remove triggers.',
  },
  {
    code: 'other',
    label: 'Other',
    fix: 'See additional notes.',
  },
]

export function fixesForCodes(codes: ReasonCode[]): string[] {
  return codes.map((code) => FINDINGS.find((f) => f.code === code)?.fix ?? 'See additional notes.')
}
