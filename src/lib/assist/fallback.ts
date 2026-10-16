import { findingsForTier } from '@/data/findings'
import { ASSET_LABELS } from '@/lib/labels'
import type { ReasonCode } from '@/lib/types'
import type { AssistCallout, AssistFinding, AssistInput, AssistResult } from './types'

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

function pushFinding(
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

function pushCallout(
  out: AssistCallout[],
  id: string,
  label: string,
  detail: string,
  relatedCodes?: ReasonCode[],
) {
  if (out.some((c) => c.id === id)) return
  out.push({
    id,
    label,
    detail: detail.slice(0, 220),
    ...(relatedCodes?.length ? { relatedCodes } : {}),
  })
}

function quote(text: string, max = 100): string {
  const t = text.replace(/\s+/g, ' ').trim()
  if (t.length <= max) return `“${t}”`
  return `“${t.slice(0, max - 1)}…”`
}

/** Deterministic desk-style triage when proxy / local key are unavailable. */
export function fallbackAssist({ request }: AssistInput): AssistResult {
  const findings: AssistFinding[] = []
  const callouts: AssistCallout[] = []
  const allowed = allowedFor(request)
  const body = request.body.toLowerCase()
  const disclosures = request.disclosures.toLowerCase()
  const combined = `${body}\n${disclosures}`
  const hasProof = Boolean(request.creativeImage)
  const copyLabel = hasProof ? 'Headline band (proof)' : 'Creative copy'
  const discLabel = hasProof ? 'Disclosure footer (proof)' : 'Disclosures field'

  const rateInBody =
    request.claimFlags.includes('apr_or_rate') ||
    /\b\d+(\.\d+)?%\s*(apr|apy)\b/i.test(request.body) ||
    /\b(apr|interest rate|prequalification rate)\b/i.test(request.body) ||
    /\b(from|as low as)\s+\d+(\.\d+)?%\b/i.test(request.body)
  const rateInDisc = /apr|annual percentage rate|rates? (from|as low as|depend)/i.test(
    request.disclosures,
  )

  if (request.disclosures.trim().length < 40) {
    pushFinding(
      findings,
      allowed,
      'missing_disclosure',
      'Disclosure text is thin relative to a consumer-facing offer; expand material terms near the claim.',
      discLabel,
    )
    pushCallout(
      callouts,
      'thin-disc',
      discLabel,
      `Short disclosure: ${quote(request.disclosures || '(empty)', 80)}`,
      ['missing_disclosure'],
    )
  }

  if (rateInBody && !rateInDisc) {
    pushFinding(
      findings,
      allowed,
      'trigger_terms_incomplete',
      'Rate/APR or “from / as low as” language appears without matching Reg Z-style accompanying terms in disclosures.',
      copyLabel,
    )
    pushFinding(
      findings,
      allowed,
      'missing_disclosure',
      'APR or rate claim needs clear accompanying disclosure near the claim.',
      `${copyLabel} vs ${discLabel}`,
    )
    pushCallout(
      callouts,
      'rate-trigger',
      copyLabel,
      `Rate trigger in copy: ${quote(request.body)}`,
      ['trigger_terms_incomplete', 'missing_disclosure'],
    )
  }

  if (
    /guaranteed|no credit check|pre-?approved for everyone|instant approval|you'?re pre-?approved|pre-?approved —|pre-?approved -/i.test(
      body,
    )
  ) {
    pushFinding(
      findings,
      allowed,
      'unsubstantiated_claim',
      'Absolute or soft-guarantee approval language is typically unsubstantiated for consumer credit ads.',
      copyLabel,
    )
    pushFinding(
      findings,
      allowed,
      'misleading_net_impression',
      'Net impression may overstate likelihood of approval or understate underwriting.',
      copyLabel,
    )
    pushCallout(
      callouts,
      'approval-absolute',
      copyLabel,
      `Approval-odds tone: ${quote(request.body)}`,
      ['unsubstantiated_claim', 'misleading_net_impression'],
    )
  }

  if (/instant funding|funded instantly|money in minutes guaranteed/i.test(body)) {
    pushFinding(
      findings,
      allowed,
      'unsubstantiated_claim',
      'Absolute funding-speed claims need substantiation and clear exceptions.',
      copyLabel,
    )
    pushFinding(
      findings,
      allowed,
      'misleading_net_impression',
      '“Instant” funding can distort net impression if funding is not immediate for all applicants.',
      copyLabel,
    )
    pushCallout(
      callouts,
      'instant-funding',
      copyLabel,
      `Speed claim: ${quote(request.body)}`,
      ['unsubstantiated_claim', 'misleading_net_impression'],
    )
  }

  if (
    (/zero fees|no fees|fee-?free|fees forever/i.test(body) ||
      request.claimFlags.includes('fee_claim')) &&
    !/except|origination|may apply|some products|not all/i.test(disclosures)
  ) {
    pushFinding(
      findings,
      allowed,
      'unsubstantiated_claim',
      'Broad fee-free claim needs exceptions or product-limited substantiation in or next to the creative.',
      copyLabel,
    )
    pushFinding(
      findings,
      allowed,
      'missing_disclosure',
      'Fee claim lacks proximate exceptions or material fee disclosure.',
      discLabel,
    )
    pushCallout(
      callouts,
      'fee-absolute',
      copyLabel,
      `Fee language: ${quote(request.body)}`,
      ['unsubstantiated_claim', 'missing_disclosure'],
    )
  }

  if (
    (request.claimFlags.includes('urgency') || /today|tonight|now|limited|expires|hurry|ends /i.test(body)) &&
    /today|tonight|now|limited|expires|hurry|ends /i.test(body)
  ) {
    pushFinding(
      findings,
      allowed,
      'misleading_net_impression',
      'Urgency framing can distort the net impression if scarcity is not genuine or disclosed.',
      hasProof ? 'CTA band (proof)' : 'Urgency / CTA language',
    )
    pushCallout(
      callouts,
      'urgency',
      hasProof ? 'CTA band (proof)' : 'Urgency / CTA language',
      `Scarcity wording: ${quote(request.body)}`,
      ['misleading_net_impression'],
    )
  }

  if (
    (request.source === 'affiliate' || request.destinationUrl.includes('partners.')) &&
    !/may receive|compensat|#ad\b|advertisement|paid (partner|relationship)|affiliate (link|disclosure|partner)/i.test(
      combined,
    )
  ) {
    pushFinding(
      findings,
      allowed,
      'affiliate_relationship_unclear',
      'Affiliate-sourced or partner-destination packet lacks clear paid/partner relationship language near the offer.',
      discLabel,
    )
    pushCallout(
      callouts,
      'affiliate-rel',
      discLabel,
      'No partner / compensation / #ad language found in copy or disclosures.',
      ['affiliate_relationship_unclear'],
    )
  }

  if (
    (request.claimFlags.includes('comparison') ||
      /beats? (most|a typical)|more than|versus|vs\.|compared to/i.test(body)) &&
    !/compar|versus|vs\.|than a typical|as of|based on|published/i.test(disclosures)
  ) {
    pushFinding(
      findings,
      allowed,
      'unsubstantiated_claim',
      'Comparison claim needs a clear basis and as-of context in or next to the creative.',
      copyLabel,
    )
    pushCallout(
      callouts,
      'comparison',
      copyLabel,
      `Comparison claim: ${quote(request.body)}`,
      ['unsubstantiated_claim'],
    )
  }

  if (
    request.destinationUrl.includes('partners.') &&
    (rateInBody ||
      request.claimFlags.includes('apr_or_rate') ||
      request.claimFlags.includes('approval_odds') ||
      /offer|rate|apr|approv/i.test(body)) &&
    !/subject to|actual apr|creditworthiness|terms may differ|may vary/i.test(disclosures)
  ) {
    pushFinding(
      findings,
      allowed,
      'offer_landing_mismatch',
      'Partner destination with material offer language should disclose that terms may differ after underwriting.',
      'Destination URL vs disclosures',
    )
    pushCallout(
      callouts,
      'landing-mismatch',
      'Destination URL',
      `Partner URL ${request.destinationUrl} without terms-may-differ caveat in disclosures.`,
      ['offer_landing_mismatch'],
    )
  }

  if (
    (request.claimFlags.includes('testimonial') ||
      /\bi (got|was) approved\b|\bin minutes\b.*approv/i.test(body)) &&
    request.source === 'affiliate' &&
    !/#ad\b|advertisement|may receive|compensat|paid (partner|relationship)/i.test(combined)
  ) {
    pushFinding(
      findings,
      allowed,
      'affiliate_relationship_unclear',
      'Endorsement-style / first-person approval story needs clear paid relationship disclosure.',
      copyLabel,
    )
    pushFinding(
      findings,
      allowed,
      'misleading_net_impression',
      'Personal approval anecdote can imply typical results without qualification.',
      copyLabel,
    )
    pushCallout(
      callouts,
      'testimonial',
      copyLabel,
      `Testimonial tone: ${quote(request.body)}`,
      ['affiliate_relationship_unclear', 'misleading_net_impression'],
    )
  }

  if (/lock your rate|rate lock/i.test(body) && request.disclosures.trim().length < 90) {
    pushFinding(
      findings,
      allowed,
      'missing_disclosure',
      'Rate-lock marketing needs material caveats (availability, qualification, not a commitment).',
      discLabel,
    )
    pushFinding(
      findings,
      allowed,
      'misleading_net_impression',
      '“Lock your rate” can overstate certainty without proximate limitations.',
      copyLabel,
    )
    pushCallout(
      callouts,
      'rate-lock',
      copyLabel,
      `Rate-lock language: ${quote(request.body)}`,
      ['missing_disclosure', 'misleading_net_impression'],
    )
  }

  // Always surface inspected regions for triage UX
  if (callouts.length === 0) {
    pushCallout(
      callouts,
      'copy-scan',
      copyLabel,
      findings.length
        ? quote(request.body)
        : `Inspected: ${quote(request.body || '(empty copy)')}`,
    )
    pushCallout(
      callouts,
      'disc-scan',
      discLabel,
      `Inspected: ${quote(request.disclosures || '(empty)', 120)}`,
    )
  }

  const asset = ASSET_LABELS[request.assetType] ?? request.assetType

  let summary: string
  if (findings.length === 0) {
    summary = `No policy hits on this ${asset}. ${
      hasProof ? 'Proof image present — ' : ''
    }Confirm net impression, disclosure proximity, and landing match manually before Approve.`
  } else {
    summary = `Triage flagged ${findings.length} issue(s) on this ${asset}.`
  }

  return { summary, findings, callouts, source: 'fallback' }
}
