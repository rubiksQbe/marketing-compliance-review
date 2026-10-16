import type { ReasonCode, ReviewRequest } from '@/lib/types'

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
}

export type AssistInput = {
  request: ReviewRequest
}
