export type Product = 'personal_loans' | 'credit_cards' | 'mortgage_prequal'
export type Channel = 'affiliate' | 'paid_social' | 'email' | 'web' | 'display'
export type AssetType = 'banner' | 'landing_page' | 'email' | 'social_post' | 'affiliate_creative'
export type RiskTier = 'low' | 'medium' | 'high'
export type RequestStatus = 'pending' | 'changes_requested' | 'approved' | 'rejected'
export type SubmissionSource = 'internal' | 'affiliate'

/** Demo session role after landing */
export type SessionRole = 'reviewer' | 'submitter'

export type IdentityKind = 'reviewer' | 'internal_marketer' | 'affiliate_manager'

export interface SessionIdentity {
  role: SessionRole
  kind: IdentityKind
  name: string
}

export type ClaimFlag =
  | 'apr_or_rate'
  | 'fee_claim'
  | 'approval_odds'
  | 'comparison'
  | 'urgency'
  | 'testimonial'

export type ReasonCode =
  | 'missing_disclosure'
  | 'unsubstantiated_claim'
  | 'not_clear_conspicuous'
  | 'affiliate_relationship_unclear'
  | 'offer_landing_mismatch'
  | 'misleading_net_impression'
  | 'trigger_terms_incomplete'
  | 'other'

export interface AuditEvent {
  id: string
  at: string
  actor: string
  action:
    | 'submitted'
    | 'opened'
    | 'approved'
    | 'changes_requested'
    | 'rejected'
    | 'resubmitted'
    | 'risk_updated'
  detail?: string
  reasonCodes?: ReasonCode[]
}

export interface ReviewRequest {
  id: string
  title: string
  product: Product
  channel: Channel
  assetType: AssetType
  audience: string
  body: string
  /** Data URL for uploaded banner / social / affiliate creative image. */
  creativeImage?: string
  destinationUrl: string
  disclosures: string
  claimFlags: ClaimFlag[]
  riskTier: RiskTier
  status: RequestStatus
  slaHours: number
  submittedAt: string
  updatedAt: string
  submitter: string
  source: SubmissionSource
  partnerName?: string
  intakeNotes?: string
  assignee?: string
  events: AuditEvent[]
}

export interface SubmitInput {
  title: string
  product: Product
  channel: Channel
  assetType: AssetType
  audience: string
  body: string
  creativeImage?: string
  destinationUrl: string
  disclosures: string
  claimFlags: ClaimFlag[]
  riskTier: RiskTier
  source: SubmissionSource
  partnerName?: string
  intakeNotes?: string
}

export interface DecisionInput {
  action: 'approved' | 'rejected'
  detail?: string
  reasonCodes?: ReasonCode[]
  actor: string
}

export const DEMO_IDENTITIES: SessionIdentity[] = [
  { role: 'reviewer', kind: 'reviewer', name: 'Jordan Lee' },
  { role: 'submitter', kind: 'internal_marketer', name: 'Ava Chen' },
  { role: 'submitter', kind: 'affiliate_manager', name: 'Sam Ortiz' },
]
