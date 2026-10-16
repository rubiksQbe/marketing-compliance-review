import { nextPendingAfter, orderedPendingQueue } from './queueOrder'
import type { ReviewRequest } from './types'

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg)
}

const base = {
  title: 't',
  product: 'personal_loans' as const,
  channel: 'web' as const,
  assetType: 'landing_page' as const,
  audience: 'a',
  body: 'b',
  destinationUrl: 'https://example.com',
  disclosures: 'd',
  claimFlags: [] as ReviewRequest['claimFlags'],
  submitter: 'Ava Chen',
  source: 'internal' as const,
  events: [],
  updatedAt: new Date().toISOString(),
}

const now = Date.parse('2026-10-16T12:00:00.000Z')

const fixture: ReviewRequest[] = [
  {
    ...base,
    id: 'low-soon',
    riskTier: 'low',
    status: 'pending',
    slaHours: 48,
    submittedAt: new Date(now - 40 * 3600_000).toISOString(),
  },
  {
    ...base,
    id: 'high-later',
    riskTier: 'high',
    status: 'pending',
    slaHours: 8,
    submittedAt: new Date(now - 2 * 3600_000).toISOString(),
  },
  {
    ...base,
    id: 'high-soon',
    riskTier: 'high',
    status: 'pending',
    slaHours: 8,
    submittedAt: new Date(now - 6 * 3600_000).toISOString(),
  },
  {
    ...base,
    id: 'approved',
    riskTier: 'high',
    status: 'approved',
    slaHours: 8,
    submittedAt: new Date(now - 7 * 3600_000).toISOString(),
  },
]

const ordered = orderedPendingQueue(fixture, now)
assert(
  ordered.map((r) => r.id).join(',') === 'high-soon,high-later,low-soon',
  `order was ${ordered.map((r) => r.id).join(',')}`,
)

const next = nextPendingAfter(fixture, 'high-soon', now)
assert(next?.id === 'high-later', `next was ${next?.id}`)

const afterLastHigh = nextPendingAfter(
  fixture.filter((r) => r.id !== 'high-later'),
  'high-soon',
  now,
)
assert(afterLastHigh?.id === 'low-soon', `fallback next was ${afterLastHigh?.id}`)

console.log('queueOrder checks passed')
