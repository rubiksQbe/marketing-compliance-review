import { minTierForCodes } from '@/data/findings'
import { inferContentRisk, maxRiskTier, tierRank } from '@/lib/risk'
import type { ReasonCode } from '@/lib/types'
import { fallbackAssist } from './fallback'
import { getAssistApiKey } from './settings'
import type { AssistCallout, AssistFinding, AssistInput, AssistResult } from './types'

const MAX_IMAGE_CHARS = 120_000

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

function sanitizeFindings(findings: AssistFinding[]): AssistFinding[] {
  const seen = new Set<ReasonCode>()
  const out: AssistFinding[] = []
  for (const f of findings) {
    if (!VALID.has(f.code) || seen.has(f.code)) continue
    if (!f.reason?.trim() || !f.where?.trim()) continue
    seen.add(f.code)
    out.push({ code: f.code, reason: f.reason.trim(), where: f.where.trim() })
  }
  return out
}

function sanitizeCallouts(raw: unknown): AssistCallout[] {
  if (!Array.isArray(raw)) return []
  const out: AssistCallout[] = []
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const c = item as Partial<AssistCallout>
    if (!c.id?.trim() || !c.label?.trim() || !c.detail?.trim()) continue
    const related = Array.isArray(c.relatedCodes)
      ? c.relatedCodes.filter((code): code is ReasonCode => VALID.has(code as ReasonCode))
      : undefined
    out.push({
      id: c.id.trim(),
      label: c.label.trim(),
      detail: c.detail.trim().slice(0, 400),
      ...(related?.length ? { relatedCodes: related } : {}),
    })
    if (out.length >= 8) break
  }
  return out
}

function defaultSummary(findings: AssistFinding[], _source: AssistResult['source']): string {
  if (findings.length === 0) {
    return 'No issues returned. Confirm net impression and disclosures manually before Approve.'
  }
  return `Triage flagged ${findings.length} issue(s).`
}

function sanitizeResult(
  data: { summary?: unknown; findings?: unknown; callouts?: unknown },
  source: AssistResult['source'],
): AssistResult | null {
  if (!Array.isArray(data.findings)) return null
  const findings = sanitizeFindings(data.findings as AssistFinding[])
  const callouts = sanitizeCallouts(data.callouts)
  const summary =
    typeof data.summary === 'string' && data.summary.trim()
      ? data.summary.trim().slice(0, 600)
      : defaultSummary(findings, source)
  return { summary, findings, callouts, source }
}

function packetPayload(request: AssistInput['request']) {
  const image =
    request.creativeImage && request.creativeImage.length <= MAX_IMAGE_CHARS
      ? request.creativeImage
      : undefined
  return {
    id: request.id,
    title: request.title,
    product: request.product,
    channel: request.channel,
    assetType: request.assetType,
    audience: request.audience,
    body: request.body,
    disclosures: request.disclosures,
    claimFlags: request.claimFlags,
    riskTier: request.riskTier,
    destinationUrl: request.destinationUrl,
    source: request.source,
    partnerName: request.partnerName,
    creativeImage: image,
  }
}

async function tryProxy(input: AssistInput): Promise<AssistResult | null> {
  try {
    const res = await fetch('/api/assist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(packetPayload(input.request)),
    })
    if (!res.ok) return null
    const data = (await res.json()) as {
      summary?: unknown
      findings?: unknown
      callouts?: unknown
    }
    return sanitizeResult(data, 'proxy')
  } catch {
    return null
  }
}

async function tryLocalKey(input: AssistInput): Promise<AssistResult | null> {
  const apiKey = getAssistApiKey()
  if (!apiKey) return null

  const codes = [
    'missing_disclosure',
    'misleading_net_impression',
    'unsubstantiated_claim',
    'not_clear_conspicuous',
    'offer_landing_mismatch',
    'affiliate_relationship_unclear',
    'trigger_terms_incomplete',
    'other',
  ].join(', ')

  const system = `You are a US consumer-finance marketing compliance triage assistant (not a decision engine). Return ONLY JSON:
{"summary":"1-2 short sentences on what looks risky in plain language — do NOT list reason codes, product/channel labels, or say that Assist does not decide","findings":[{"code":"...","reason":"...","where":"..."}],"callouts":[{"id":"short-id","label":"region name","detail":"quoted or paraphrased text on proof/copy","relatedCodes":["optional codes"]}]}.
Codes must be one of: ${codes}. Flag likely issues only. Never approve. Keep reason, where, and callout detail concise. If a creative image is provided, OCR/read visible text and cite headline vs disclosure bands in where/callouts — do not append “(proof)” to labels.`

  const userText = JSON.stringify(packetPayload({ ...input.request, creativeImage: undefined }), null, 2)

  const content: Array<Record<string, unknown>> = [{ type: 'text', text: userText }]
  if (input.request.creativeImage && input.request.creativeImage.startsWith('data:image')) {
    content.push({
      type: 'image_url',
      image_url: { url: input.request.creativeImage },
    })
  }

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: system },
          { role: 'user', content },
        ],
        temperature: 0.2,
      }),
    })
    if (!res.ok) return null
    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>
    }
    const raw = data.choices?.[0]?.message?.content
    if (!raw) return null
    const parsed = JSON.parse(raw) as {
      summary?: unknown
      findings?: unknown
      callouts?: unknown
    }
    return sanitizeResult(parsed, 'local_key')
  } catch {
    return null
  }
}

function attachSuggestedTier(result: AssistResult, input: AssistInput): AssistResult {
  const contentTier = inferContentRisk({
    body: input.request.body,
    disclosures: input.request.disclosures,
    destinationUrl: input.request.destinationUrl,
    source: input.request.source,
  }).tier
  const findingsTier = minTierForCodes(result.findings.map((f) => f.code))
  let needed = maxRiskTier(contentTier, findingsTier)
  if (result.suggestedTier) needed = maxRiskTier(needed, result.suggestedTier)
  if (tierRank(needed) > tierRank(input.request.riskTier)) {
    return { ...result, suggestedTier: needed }
  }
  if (!result.suggestedTier) return result
  const { suggestedTier: _drop, ...rest } = result
  return rest
}

/** Proxy → local key → heuristic fallback. */
export async function assistReview(input: AssistInput): Promise<AssistResult> {
  const fromProxy = await tryProxy(input)
  if (fromProxy) return attachSuggestedTier(fromProxy, input)
  const fromKey = await tryLocalKey(input)
  if (fromKey) return attachSuggestedTier(fromKey, input)
  return attachSuggestedTier(fallbackAssist(input), input)
}
