import { fallbackAssist } from './fallback'
import type { ReviewRequest } from '@/lib/types'

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg)
}

const request: ReviewRequest = {
  id: 'CP-TEST',
  title: 'Guaranteed APR banner',
  product: 'personal_loans',
  channel: 'affiliate',
  assetType: 'banner',
  audience: 'Consumers',
  body: 'Guaranteed approval from 7.99% APR — apply now!',
  destinationUrl: 'https://partners.clearpath.example/loans',
  disclosures: 'Subject to credit approval.',
  claimFlags: ['apr_or_rate', 'approval_odds', 'urgency'],
  riskTier: 'high',
  status: 'pending',
  slaHours: 8,
  submittedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  submitter: 'Sam Ortiz',
  source: 'affiliate',
  partnerName: 'LoanCompare Media',
  events: [],
}

const result = fallbackAssist({ request })
assert(result.source === 'fallback', 'source')
assert(result.summary.trim().length > 20, 'summary required')
assert(result.findings.length >= 2, 'expected multiple findings')
assert(result.callouts.length >= 1, 'expected callouts')
assert(
  result.findings.every((f) => f.reason.trim() && f.where.trim()),
  'each finding needs reason + where',
)
assert(
  result.findings.some((f) => f.code === 'unsubstantiated_claim' || f.code === 'misleading_net_impression'),
  'should flag guaranteed approval language',
)
assert(
  result.callouts.every((c) => c.id && c.label && c.detail),
  'callouts need id/label/detail',
)

console.log(
  'fallbackAssist checks passed',
  `findings=${result.findings.map((f) => f.code).join(',')}`,
  `callouts=${result.callouts.length}`,
)
