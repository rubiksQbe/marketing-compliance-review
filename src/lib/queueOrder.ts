import { remainingFor } from './time'
import type { ReviewRequest, RiskTier } from './types'

const RISK_ORDER: Record<RiskTier, number> = { high: 0, medium: 1, low: 2 }

/** Pending only, High → Low, then nearest due (ascending remaining). */
export function orderedPendingQueue(
  requests: ReviewRequest[],
  now = Date.now(),
): ReviewRequest[] {
  return [...requests]
    .filter((r) => r.status === 'pending')
    .sort((a, b) => {
      const risk = RISK_ORDER[a.riskTier] - RISK_ORDER[b.riskTier]
      if (risk !== 0) return risk
      return remainingFor(a, now) - remainingFor(b, now)
    })
}

/** Next pending after `currentId` in queue order, or undefined if none. */
export function nextPendingAfter(
  requests: ReviewRequest[],
  currentId: string,
  now = Date.now(),
): ReviewRequest | undefined {
  const ordered = orderedPendingQueue(requests, now).filter((r) => r.id !== currentId)
  return ordered[0]
}
