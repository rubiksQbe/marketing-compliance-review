import type { Channel, ClaimFlag, Product, RiskTier } from './types'

export function suggestRiskTier(input: {
  product: Product
  channel: Channel
  claimFlags: ClaimFlag[]
}): RiskTier {
  const { product, channel, claimFlags } = input
  let score = 0

  if (channel === 'affiliate') score += 2
  if (channel === 'paid_social' || channel === 'display') score += 1
  if (product === 'mortgage_prequal') score += 1
  if (claimFlags.includes('apr_or_rate')) score += 2
  if (claimFlags.includes('approval_odds')) score += 2
  if (claimFlags.includes('comparison')) score += 1
  if (claimFlags.includes('urgency')) score += 1
  if (claimFlags.includes('testimonial')) score += 1
  if (claimFlags.includes('fee_claim')) score += 1

  if (score >= 4) return 'high'
  if (score >= 2) return 'medium'
  return 'low'
}

export function slaHoursForTier(tier: RiskTier): number {
  if (tier === 'high') return 8
  if (tier === 'medium') return 24
  return 48
}
