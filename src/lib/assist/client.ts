import type { ReasonCode } from '@/lib/types'
import { fallbackAssist } from './fallback'
import { getAssistApiKey } from './settings'
import type { AssistFinding, AssistInput, AssistResult } from './types'

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

function sanitize(findings: AssistFinding[]): AssistFinding[] {
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
    const data = (await res.json()) as { findings?: AssistFinding[] }
    if (!Array.isArray(data.findings)) return null
    return { findings: sanitize(data.findings), source: 'proxy' }
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

  const system = `You are a US consumer-finance marketing compliance assistant. Return ONLY JSON: {"findings":[{"code":"...","reason":"...","where":"..."}]}. Codes must be one of: ${codes}. Flag likely issues only. Never approve. Keep reason and where concise.`

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
    const parsed = JSON.parse(raw) as { findings?: AssistFinding[] }
    if (!Array.isArray(parsed.findings)) return null
    return { findings: sanitize(parsed.findings), source: 'local_key' }
  } catch {
    return null
  }
}

/** Proxy → local key → heuristic fallback. */
export async function assistReview(input: AssistInput): Promise<AssistResult> {
  const fromProxy = await tryProxy(input)
  if (fromProxy) return fromProxy
  const fromKey = await tryLocalKey(input)
  if (fromKey) return fromKey
  return fallbackAssist(input)
}
