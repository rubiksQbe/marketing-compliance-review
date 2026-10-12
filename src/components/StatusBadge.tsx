import { RISK_LABELS, STATUS_LABELS, isDeclinedStatus } from '@/lib/labels'
import { cn } from '@/lib/cn'
import type { RequestStatus, RiskTier } from '@/lib/types'

export function StatusBadge({ status }: { status: RequestStatus }) {
  const declined = isDeclinedStatus(status)
  return (
    <span
      className={cn(
        'inline-flex rounded px-1.5 py-0.5 text-[10px] font-medium leading-tight',
        status === 'pending' && 'bg-steel-100 text-navy-800',
        status === 'approved' && 'bg-forest-50 text-forest-800',
        declined && 'bg-danger-soft text-danger',
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
        tier === 'low' && 'bg-mist-100 text-steel-600',
        tier === 'medium' && 'bg-warn-soft text-warn',
        tier === 'high' && 'bg-danger-soft text-danger',
      )}
    >
      {short ? RISK_LABELS[tier] : `${RISK_LABELS[tier]} risk`}
    </span>
  )
}
