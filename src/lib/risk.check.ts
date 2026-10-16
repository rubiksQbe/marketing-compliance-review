import { inferContentRisk, resolveSubmitRisk, scoreRisk, tierRank } from './risk'

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg)
}

// Underflagged APR affiliate packet: intake low/med without rate flag; content high
const underflagged = resolveSubmitRisk({
  product: 'personal_loans',
  channel: 'web',
  claimFlags: [],
  body: 'From 6.99% APR — apply in minutes.',
  disclosures: 'Subject to credit approval.',
  destinationUrl: 'https://partners.clearpath.example/loans',
  source: 'internal',
})
assert(underflagged.intake.tier === 'low', `intake expected low, got ${underflagged.intake.tier}`)
assert(tierRank(underflagged.content.tier) >= tierRank('medium'), 'content should elevate')
assert(underflagged.contentRaised, 'contentRaised')
assert(tierRank(underflagged.tier) > tierRank(underflagged.intake.tier), 'effective > intake')

const honest = scoreRisk({
  product: 'personal_loans',
  channel: 'affiliate',
  claimFlags: ['apr_or_rate'],
})
assert(honest.tier === 'high', 'honest affiliate+APR is high')

const clean = resolveSubmitRisk({
  product: 'personal_loans',
  channel: 'display',
  claimFlags: [],
  body: 'ClearPath Financial — personal loans designed around your plan.',
  disclosures:
    'ClearPath Financial. Member FDIC (demo). Lending products subject to credit approval and underwriting.',
  destinationUrl: 'https://www.clearpath.example/loans',
  source: 'internal',
})
assert(clean.tier === 'low' || clean.tier === 'medium', `clean tier unexpected ${clean.tier}`)
assert(!clean.contentRaised || clean.content.tier === clean.intake.tier, 'clean should not raise oddly')

const contentOnly = inferContentRisk({
  body: "You're pre-approved — claim your card.",
  disclosures: 'Subject to credit approval.',
  destinationUrl: 'https://www.clearpath.example/cards',
  source: 'internal',
})
assert(tierRank(contentOnly.tier) >= tierRank('medium'), 'pre-approved content elevates')

console.log(
  'risk checks passed',
  `underflagged ${underflagged.intake.tier}→${underflagged.tier}`,
  `clean=${clean.tier}`,
)
