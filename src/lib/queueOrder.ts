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

/** Previous / next neighbors in the pending queue (High → Low, nearest due). */
export function pendingNeighbors(
  requests: ReviewRequest[],
  currentId: string,
  now = Date.now(),
): {
  prev: ReviewRequest | undefined
  next: ReviewRequest | undefined
  index: number
  total: number
} {
  const ordered = orderedPendingQueue(requests, now)
  const index = ordered.findIndex((r) => r.id === currentId)
  if (index < 0) {
    return { prev: undefined, next: ordered[0], index: -1, total: ordered.length }
  }
  return {
    prev: index > 0 ? ordered[index - 1] : undefined,
    next: index < ordered.length - 1 ? ordered[index + 1] : undefined,
    index,
    total: ordered.length,
  }
}
