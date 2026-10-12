import { RISK_LABELS, STATUS_LABELS } from '@/lib/labels'
import { cn } from '@/lib/cn'
import type { RequestStatus, RiskTier } from '@/lib/types'

const statusClass: Record<RequestStatus, string> = {
  pending: 'bg-steel-100 text-navy-800',
  changes_requested: 'bg-warn-soft text-warn',
  approved: 'bg-forest-50 text-forest-800',
  rejected: 'bg-danger-soft text-danger',
}

const riskClass: Record<RiskTier, string> = {
  low: 'bg-mist-100 text-steel-600',
  medium: 'bg-warn-soft text-warn',
  high: 'bg-danger-soft text-danger',
}

export function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span
      className={cn(
        'inline-flex rounded px-1.5 py-0.5 text-[10px] font-medium leading-tight',
        statusClass[status],
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}

export function RiskBadge({ tier, short = false }: { tier: RiskTier; short?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex rounded px-1.5 py-0.5 text-[10px] font-medium leading-tight',
        riskClass[tier],
      )}
    >
      {short ? RISK_LABELS[tier] : `${RISK_LABELS[tier]} risk`}
    </span>
  )
}
