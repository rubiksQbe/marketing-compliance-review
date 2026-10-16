import type { Channel, ClaimFlag, Product, RiskTier, SubmissionSource } from './types'

export interface RiskSuggestion {
  tier: RiskTier
  score: number
  factors: string[]
}

const TIER_RANK: Record<RiskTier, number> = { low: 0, medium: 1, high: 2 }

export function tierRank(tier: RiskTier): number {
  return TIER_RANK[tier]
}

export function maxRiskTier(a: RiskTier, b: RiskTier): RiskTier {
  return tierRank(a) >= tierRank(b) ? a : b
}

function tierFromScore(score: number): RiskTier {
  if (score >= 4) return 'high'
  if (score >= 2) return 'medium'
  return 'low'
}

/** Weighted scoring from intake fields (product / channel / claim types). */
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

  return { tier: tierFromScore(score), score, factors }
}

export function suggestRiskTier(input: {
  product?: Product | ''
  channel?: Channel | ''
  claimFlags: ClaimFlag[]
}): RiskTier {
  return scoreRisk(input).tier
}

/**
 * Content/rules scoring that does not trust claim flags alone.
 * Scans copy, disclosures, and destination for material risk signals.
 */
export function inferContentRisk(input: {
  body?: string
  disclosures?: string
  destinationUrl?: string
  source?: SubmissionSource | ''
}): RiskSuggestion {
  const body = (input.body ?? '').toLowerCase()
  const url = (input.destinationUrl ?? '').toLowerCase()
  let score = 0
  const factors: string[] = []

  if (
    /\b\d+(\.\d+)?%\s*(apr|apy)\b/i.test(input.body ?? '') ||
    /\b(apr|interest rate|prequalification rate)\b/i.test(body) ||
    /\b(from|as low as)\s+\d+(\.\d+)?%\b/i.test(input.body ?? '')
  ) {
    score += 2
    factors.push('Content: rate / APR language (+2)')
  }

  if (
    /guaranteed|no credit check|pre-?approved|instant approval|you'?re pre-?approved|approv(ed|al) in minutes/i.test(
      body,
    )
  ) {
    score += 2
    factors.push('Content: approval-odds language (+2)')
  }

  if (/zero fees|no fees|fee-?free|fees forever/i.test(body)) {
    score += 1
    factors.push('Content: fee claim (+1)')
  }

  if (/today|tonight|expires|hurry|limited time|ends /i.test(body)) {
    score += 1
    factors.push('Content: urgency (+1)')
  }

  if (/beats? (most|a typical)|more than|versus|\bvs\.?\b|compared to/i.test(body)) {
    score += 1
    factors.push('Content: comparison (+1)')
  }

  if (/\bi (got|was) approved\b|testimonial/i.test(body)) {
    score += 1
    factors.push('Content: testimonial tone (+1)')
  }

  if (input.source === 'affiliate' || url.includes('partners.')) {
    score += 2
    factors.push('Content: affiliate / partner destination (+2)')
  }

  // Thin disclosures on claim-bearing copy slightly elevates medium floor
  if (score >= 2 && (input.disclosures ?? '').trim().length < 40) {
    score += 1
    factors.push('Content: thin disclosures (+1)')
  }

  return { tier: tierFromScore(score), score, factors }
}

/** Intake + content: effective tier is the max; factors merged for transparency. */
export function resolveSubmitRisk(input: {
  product?: Product | ''
  channel?: Channel | ''
  claimFlags: ClaimFlag[]
  body?: string
  disclosures?: string
  destinationUrl?: string
  source?: SubmissionSource | ''
}): RiskSuggestion & { intake: RiskSuggestion; content: RiskSuggestion; contentRaised: boolean } {
  const intake = scoreRisk(input)
  const content = inferContentRisk(input)
  const tier = maxRiskTier(intake.tier, content.tier)
  const contentRaised = tierRank(content.tier) > tierRank(intake.tier)
  const factors = [
    ...intake.factors.map((f) => `Intake: ${f}`),
    ...content.factors,
    ...(contentRaised ? [`Effective ${tier} (content raised above intake ${intake.tier})`] : []),
  ]
  const score = Math.max(intake.score, content.score)
  return { tier, score, factors, intake, content, contentRaised }
}

export function slaHoursForTier(tier: RiskTier): number {
  if (tier === 'high') return 8
  if (tier === 'medium') return 24
  return 48
}
