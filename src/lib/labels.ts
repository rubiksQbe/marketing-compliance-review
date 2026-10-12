import type {
  AssetType,
  Channel,
  ClaimFlag,
  IdentityKind,
  Product,
  ReasonCode,
  RequestStatus,
  RiskTier,
  SubmissionSource,
} from './types'

export const PRODUCT_LABELS: Record<Product, string> = {
  personal_loans: 'Personal loans',
  credit_cards: 'Credit cards',
  mortgage_prequal: 'Mortgage prequalification',
}

export const CHANNEL_LABELS: Record<Channel, string> = {
  affiliate: 'Affiliate',
  paid_social: 'Paid social',
  email: 'Email',
  web: 'Web',
  display: 'Display',
}

export const ASSET_LABELS: Record<AssetType, string> = {
  banner: 'Display banner',
  landing_page: 'Landing page',
  email: 'Email',
  social_post: 'Social post',
  affiliate_creative: 'Affiliate creative',
}

export const RISK_LABELS: Record<RiskTier, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

/** Submitter-facing + reviewer disposition labels (Approve / Decline only). */
export const STATUS_LABELS: Record<RequestStatus, string> = {
  pending: 'Pending',
  changes_requested: 'Declined',
  approved: 'Approved',
  rejected: 'Declined',
}

export function isDeclinedStatus(status: RequestStatus): boolean {
  return status === 'changes_requested' || status === 'rejected'
}

export const CLAIM_LABELS: Record<ClaimFlag, string> = {
  apr_or_rate: 'APR / rate claim',
  fee_claim: 'Fee claim',
  approval_odds: 'Approval odds',
  comparison: 'Competitive comparison',
  urgency: 'Urgency / scarcity',
  testimonial: 'Testimonial',
}

export const REASON_LABELS: Record<ReasonCode, string> = {
  missing_disclosure: 'Missing / incomplete disclosure',
  unsubstantiated_claim: 'Unsubstantiated claim',
  not_clear_conspicuous: 'Not clear & conspicuous',
  affiliate_relationship_unclear: 'Affiliate relationship unclear',
  offer_landing_mismatch: 'Offer–landing mismatch',
  misleading_net_impression: 'Misleading net impression',
  trigger_terms_incomplete: 'Triggering terms incomplete',
  other: 'Other',
}

export const SOURCE_LABELS: Record<SubmissionSource, string> = {
  internal: 'Internal',
  affiliate: 'Affiliate partner',
}

export const KIND_LABELS: Record<IdentityKind, string> = {
  reviewer: 'Compliance reviewer',
  internal_marketer: 'Internal marketer',
  affiliate_manager: 'Affiliate manager',
}

/** Visual creatives show an image preview; text-only assets show verbatim copy. */
export function isVisualAsset(assetType: AssetType): boolean {
  return assetType === 'banner' || assetType === 'affiliate_creative' || assetType === 'social_post'
}
