import type { Channel, ClaimFlag, Product, RiskTier } from './types'

export interface RiskSuggestion {
  tier: RiskTier
  score: number
  factors: string[]
}

/** Weighted demo scoring — mirrors a simple compliance intake matrix. */
export function scoreRisk(input: {
  product?: Product | ''
  channel?: Channel | ''
  claimFlags: ClaimFlag[]
}): RiskSuggestion {
  const { product, channel, claimFlags } = input
  let score = 0
  const factors: string[] = []

  if (channel === 'affiliate') {
    score += 2
    factors.push('Affiliate (+2)')
  } else if (channel === 'paid_social' || channel === 'display') {
    score += 1
    factors.push(`${channel === 'paid_social' ? 'Paid social' : 'Display'} (+1)`)
  }

  if (product === 'mortgage_prequal') {
    score += 1
    factors.push('Mortgage prequal (+1)')
  }

  if (claimFlags.includes('apr_or_rate')) {
    score += 2
    factors.push('APR / rate (+2)')
  }
  if (claimFlags.includes('approval_odds')) {
    score += 2
    factors.push('Approval odds (+2)')
  }
  if (claimFlags.includes('comparison')) {
    score += 1
    factors.push('Comparison (+1)')
  }
  if (claimFlags.includes('urgency')) {
    score += 1
    factors.push('Urgency (+1)')
  }
  if (claimFlags.includes('testimonial')) {
    score += 1
    factors.push('Testimonial (+1)')
  }
  if (claimFlags.includes('fee_claim')) {
    score += 1
    factors.push('Fee claim (+1)')
  }

  const tier: RiskTier = score >= 4 ? 'high' : score >= 2 ? 'medium' : 'low'
  return { tier, score, factors }
}

export function suggestRiskTier(input: {
  product?: Product | ''
  channel?: Channel | ''
  claimFlags: ClaimFlag[]
}): RiskTier {
  return scoreRisk(input).tier
}

export function slaHoursForTier(tier: RiskTier): number {
  if (tier === 'high') return 8
  if (tier === 'medium') return 24
  return 48
}
