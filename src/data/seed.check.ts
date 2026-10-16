import { fallbackAssist } from '@/lib/assist/fallback'
import { SEED_REQUESTS } from './seed'

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg)
}

const EXPECTED: Record<string, ReasonCodeExpectation> = {
  'CP-1050': ['trigger_terms_incomplete', 'missing_disclosure', 'affiliate_relationship_unclear'],
  'CP-1051': ['trigger_terms_incomplete', 'missing_disclosure'],
  'CP-1052': ['unsubstantiated_claim', 'misleading_net_impression'],
  'CP-1053': ['unsubstantiated_claim', 'missing_disclosure'],
  'CP-1054': ['unsubstantiated_claim'],
  'CP-1055': ['misleading_net_impression'],
  'CP-1056': ['offer_landing_mismatch'],
  'CP-1057': ['affiliate_relationship_unclear'],
  'CP-1058': ['unsubstantiated_claim', 'misleading_net_impression'],
  'CP-1059': ['unsubstantiated_claim', 'missing_disclosure'],
  'CP-1060': ['missing_disclosure', 'misleading_net_impression'],
  'CP-1061': ['affiliate_relationship_unclear', 'misleading_net_impression'],
}

type ReasonCodeExpectation = string[]

const CLEAN = new Set(['CP-1062', 'CP-1063', 'CP-1064', 'CP-1065'])

const now = Date.now()
const pending = SEED_REQUESTS.filter((r) => r.status === 'pending')
assert(pending.length >= 14, `expected ≥14 pending, got ${pending.length}`)

for (const r of pending) {
  const ageH = (now - new Date(r.submittedAt).getTime()) / 3_600_000
  const remaining = r.slaHours - ageH
  assert(remaining >= 11.9, `${r.id} remaining ${remaining.toFixed(2)}h < 12h`)
}

for (const [id, codes] of Object.entries(EXPECTED)) {
  const req = SEED_REQUESTS.find((r) => r.id === id)
  assert(req, `missing seed ${id}`)
  const result = fallbackAssist({ request: req! })
  assert(result.summary.trim().length > 20, `${id} summary`)
  assert(result.callouts.length >= 1, `${id} callouts`)
  const got = new Set(result.findings.map((f) => f.code))
  for (const code of codes) {
    assert(got.has(code as never), `${id} missing expected code ${code}; got ${[...got].join(',')}`)
  }
}

for (const id of CLEAN) {
  const req = SEED_REQUESTS.find((r) => r.id === id)
  assert(req, `missing clean seed ${id}`)
  const result = fallbackAssist({ request: req! })
  assert(result.findings.length === 0, `${id} should be clean; got ${result.findings.map((f) => f.code).join(',')}`)
  assert(result.summary.trim().length > 20, `${id} summary`)
  assert(result.callouts.length >= 1, `${id} callouts`)
}

const withProof = pending.filter((r) => r.creativeImage).length
assert(withProof >= 8, `expected ≥8 pending with SVG proof, got ${withProof}`)

console.log(
  'seed checks passed',
  `pending=${pending.length}`,
  `proofs=${withProof}`,
  `declineCases=${Object.keys(EXPECTED).length}`,
  `clean=${CLEAN.size}`,
)
