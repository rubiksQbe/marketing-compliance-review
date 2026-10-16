import type { ReasonCode } from '@/lib/types'

export type RegulationSource = { label: string; url: string }

export type RegulationMapEntry = {
  regimes: string[]
  note: string
  sources: RegulationSource[]
}

/**
 * Maps each compliance finding to primary federal sources.
 * Links open official CFPB / FRB / FTC / eCFR pages.
 */
export const REGULATION_MAP: Record<ReasonCode, RegulationMapEntry> = {
  missing_disclosure: {
    regimes: ['UDAAP', 'Reg Z / TILA'],
    note: 'Material terms and conditions must be disclosed so the consumer can understand the offer; credit ads with triggering terms need the accompanying Reg Z disclosures.',
    sources: [
      {
        label: 'CFPB — Unfair, Deceptive, or Abusive Acts or Practices (UDAAP)',
        url: 'https://www.consumerfinance.gov/compliance/supervision-examinations/unfair-deceptive-or-abusive-acts-or-practices-udaaps/',
      },
      {
        label: 'eCFR — 12 CFR § 1026.24 Advertising (Reg Z)',
        url: 'https://www.ecfr.gov/current/title-12/chapter-X/part-1026/subpart-C/section-1026.24',
      },
    ],
  },
  misleading_net_impression: {
    regimes: ['UDAAP'],
    note: 'The overall net impression of the creative — headlines, visuals, and layout — must not mislead about terms, costs, or likelihood of approval.',
    sources: [
      {
        label: 'CFPB — UDAAP examination procedures',
        url: 'https://www.consumerfinance.gov/compliance/supervision-examinations/unfair-deceptive-or-abusive-acts-or-practices-udaaps/',
      },
      {
        label: 'FTC — Advertising and Marketing on the Internet',
        url: 'https://www.ftc.gov/business-guidance/resources/advertising-marketing-internet-rules-road',
      },
    ],
  },
  unsubstantiated_claim: {
    regimes: ['UDAAP', 'FTC substantiation'],
    note: 'Objective claims (rates, savings, approval odds, comparisons) need a reasonable basis before use.',
    sources: [
      {
        label: 'FTC — Advertising Substantiation',
        url: 'https://www.ftc.gov/news-events/topics/truth-advertising/advertising-substantiation',
      },
      {
        label: 'CFPB — UDAAP examination procedures',
        url: 'https://www.consumerfinance.gov/compliance/supervision-examinations/unfair-deceptive-or-abusive-acts-or-practices-udaaps/',
      },
    ],
  },
  not_clear_conspicuous: {
    regimes: ['UDAAP', 'Reg Z / TILA'],
    note: 'Required disclosures must be clear and conspicuous — proximate to the claim, readable, and not buried in fine print or truncated UI.',
    sources: [
      {
        label: 'eCFR — 12 CFR § 1026.24 Advertising (Reg Z)',
        url: 'https://www.ecfr.gov/current/title-12/chapter-X/part-1026/subpart-C/section-1026.24',
      },
      {
        label: 'CFPB — UDAAP examination procedures',
        url: 'https://www.consumerfinance.gov/compliance/supervision-examinations/unfair-deceptive-or-abusive-acts-or-practices-udaaps/',
      },
    ],
  },
  offer_landing_mismatch: {
    regimes: ['UDAAP'],
    note: 'Terms promised in the ad must match the landing experience; bait-and-switch patterns are deceptive.',
    sources: [
      {
        label: 'CFPB — UDAAP examination procedures',
        url: 'https://www.consumerfinance.gov/compliance/supervision-examinations/unfair-deceptive-or-abusive-acts-or-practices-udaaps/',
      },
      {
        label: 'FTC — .com Disclosures',
        url: 'https://www.ftc.gov/business-guidance/resources/com-disclosures-how-make-effective-disclosures-digital-advertising',
      },
    ],
  },
  affiliate_relationship_unclear: {
    regimes: ['FTC Endorsement Guides', 'UDAAP'],
    note: 'Material connections (paid affiliate / partner compensation) must be clearly disclosed near the endorsement or offer.',
    sources: [
      {
        label: 'FTC — Endorsement Guides (16 CFR Part 255)',
        url: 'https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking',
      },
      {
        label: 'eCFR — 16 CFR Part 255 Guides Concerning Use of Endorsements',
        url: 'https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-255',
      },
    ],
  },
  trigger_terms_incomplete: {
    regimes: ['Reg Z / TILA'],
    note: 'Advertising a triggering term (e.g. a specific APR or payment) requires the additional Reg Z advertising disclosures.',
    sources: [
      {
        label: 'eCFR — 12 CFR § 1026.24 Advertising (Reg Z)',
        url: 'https://www.ecfr.gov/current/title-12/chapter-X/part-1026/subpart-C/section-1026.24',
      },
      {
        label: 'CFPB — Truth in Lending Act (TILA)',
        url: 'https://www.consumerfinance.gov/rules-policy/regulations/1026/',
      },
    ],
  },
  other: {
    regimes: ['UDAAP', 'Firm policy'],
    note: 'Residual issues may still raise unfair, deceptive, or abusive concerns or violate firm advertising policy — document the specific concern in notes.',
    sources: [
      {
        label: 'CFPB — UDAAP examination procedures',
        url: 'https://www.consumerfinance.gov/compliance/supervision-examinations/unfair-deceptive-or-abusive-acts-or-practices-udaaps/',
      },
    ],
  },
}
