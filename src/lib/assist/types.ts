import type { ReasonCode, ReviewRequest, RiskTier } from '@/lib/types'

export type AssistFinding = {
  code: ReasonCode
  reason: string
  where: string
}

export type AssistCallout = {
  id: string
  label: string
  detail: string
  relatedCodes?: ReasonCode[]
}

export type AssistResult = {
  summary: string
  findings: AssistFinding[]
  callouts: AssistCallout[]
  source: 'proxy' | 'local_key' | 'fallback'
  /** When set and higher than the packet's current tier, reviewer should raise before declining on full depth. */
  suggestedTier?: RiskTier
}

export type AssistInput = {
  request: ReviewRequest
}
