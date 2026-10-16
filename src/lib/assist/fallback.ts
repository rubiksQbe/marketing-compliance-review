import { findingsForTier } from '@/data/findings'
import type { ReasonCode } from '@/lib/types'
import type { AssistFinding, AssistInput, AssistResult } from './types'

const VALID = new Set<ReasonCode>([
  'missing_disclosure',
  'misleading_net_impression',
  'unsubstantiated_claim',
  'not_clear_conspicuous',
  'offer_landing_mismatch',
  'affiliate_relationship_unclear',
  'trigger_terms_incomplete',
  'other',
])

function allowedFor(request: AssistInput['request']): Set<ReasonCode> {
  return new Set(findingsForTier(request.riskTier).map((f) => f.code))
}

function push(
  out: AssistFinding[],
  allowed: Set<ReasonCode>,
  code: ReasonCode,
  reason: string,
  where: string,
) {
  if (!VALID.has(code) || !allowed.has(code)) return
  if (out.some((f) => f.code === code)) return
  out.push({ code, reason, where })
}

/** Deterministic assist when proxy / local key are unavailable. */
export function fallbackAssist({ request }: AssistInput): AssistResult {
  const findings: AssistFinding[] = []
  const allowed = allowedFor(request)
  const body = request.body.toLowerCase()
  const disclosures = request.disclosures.toLowerCase()
  const combined = `${body}\n${disclosures}`

  if (request.disclosures.trim().length < 40) {
    push(
      findings,
      allowed,
      'missing_disclosure',
      'Disclosure text is thin relative to a consumer-facing offer; expand material terms as shown.',
      'Disclosures field',
    )
  }

  if (
    (request.claimFlags.includes('apr_or_rate') || /\b\d+(\.\d+)?%\s*apr\b/i.test(request.body)) &&
    !/apr|annual percentage rate|rates? (from|as low as)/i.test(request.disclosures)
  ) {
    push(
      findings,
      allowed,
      'trigger_terms_incomplete',
      'Rate/APR language appears without matching Reg Z-style accompanying terms in disclosures.',
      'Creative copy (rate / APR claim)',
    )
    push(
      findings,
      allowed,
      'missing_disclosure',
      'APR or rate claim needs clear accompanying disclosure near the claim.',
      'Disclosures vs headline rate',
    )
  }

  if (/guaranteed|no credit check|pre-?approved for everyone|instant approval/i.test(body)) {
    push(
      findings,
      allowed,
      'unsubstantiated_claim',
      'Absolute approval or credit-check language is typically unsubstantiated for consumer credit ads.',
      'Creative copy',
    )
    push(
      findings,
      allowed,
      'misleading_net_impression',
      'Net impression may overstate likelihood of approval or understate underwriting.',
      'Headline / CTA',
    )
  }

  if (request.claimFlags.includes('urgency') && /today|now|limited|expires|hurry/i.test(body)) {
    push(
      findings,
      allowed,
      'misleading_net_impression',
      'Urgency framing can distort the net impression if scarcity is not genuine.',
      'Urgency / CTA language',
    )
  }

  if (
    request.source === 'affiliate' &&
    !/partner|compensat|affiliate|may receive/i.test(combined)
  ) {
    push(
      findings,
      allowed,
      'affiliate_relationship_unclear',
      'Affiliate-sourced packet lacks clear paid/partner relationship language near the offer.',
      'Disclosures / partner relationship',
    )
  }

  if (request.claimFlags.includes('comparison') && !/compar|versus|vs\.|than a typical/i.test(disclosures)) {
    push(
      findings,
      allowed,
      'unsubstantiated_claim',
      'Comparison claim needs a clear basis and as-of context in or next to the creative.',
      'Comparison claim',
    )
  }

  if (
    request.destinationUrl.includes('partners.') &&
    request.claimFlags.includes('apr_or_rate') &&
    !/subject to|actual apr|creditworthiness/i.test(disclosures)
  ) {
    push(
      findings,
      allowed,
      'offer_landing_mismatch',
      'Partner destination with rate claims should disclose that terms may differ after underwriting.',
      'Destination URL vs disclosures',
    )
  }

  return { findings, source: 'fallback' }
}
