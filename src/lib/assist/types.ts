import type { ReasonCode, ReviewRequest } from '@/lib/types'

export type AssistFinding = {
  code: ReasonCode
  reason: string
  where: string
}

export type AssistResult = {
  findings: AssistFinding[]
  source: 'proxy' | 'local_key' | 'fallback'
}

export type AssistInput = {
  request: ReviewRequest
}
