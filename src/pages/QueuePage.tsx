import { RiskBadge, StatusBadge } from '@/components/StatusBadge'
import { ASSET_LABELS, CHANNEL_LABELS, PRODUCT_LABELS, isDeclinedStatus } from '@/lib/labels'
import { useStore } from '@/lib/store'
import { formatSla, formatWhen, remainingFor } from '@/lib/time'
import type { RiskTier } from '@/lib/types'
import { Clock, WarningCircle } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'

const RISK_ORDER: Record<RiskTier, number> = { high: 0, medium: 1, low: 2 }

type Filter = 'pending' | 'declined' | 'approved' | 'all'

export function QueuePage() {
  const { session, visibleRequests } = useStore()
  const [statusFilter, setStatusFilter] = useState<Filter>('pending')

  const filtered = useMemo(() => {
    const list = visibleRequests.filter((r) => {
      if (statusFilter === 'all') return true
      if (statusFilter === 'pending') return r.status === 'pending'
      if (statusFilter === 'approved') return r.status === 'approved'
      return isDeclinedStatus(r.status)
    })
    return [...list].sort((a, b) => {
      const risk = RISK_ORDER[a.riskTier] - RISK_ORDER[b.riskTier]
      if (risk !== 0) return risk
      return remainingFor(a) - remainingFor(b)
    })
  }, [visibleRequests, statusFilter])

  const pending = visibleRequests.filter((r) => r.status === 'pending')
  const atRisk = pending.filter((r) => remainingFor(r) < r.slaHours * 0.25)

  if (!session) return <Navigate to="/" replace />
  if (session.role !== 'reviewer') return <Navigate to="/mine" replace />

  return (
    <div className="animate-in">
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-navy-800">Review queue</h1>
        <p className="mt-1 text-sm text-steel-600">
          Prioritized by risk tier (High → Low), then nearest SLA deadline.
        </p>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <Metric label="Needs review" value={String(pending.length)} />
        <Metric label="SLA at risk" value={String(atRisk.length)} warn={atRisk.length > 0} />
        <Metric label="In queue (all)" value={String(visibleRequests.length)} />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {([
          ['pending', 'Needs review'],
          ['declined', 'Declined'],
          ['approved', 'Approved'],
          ['all', 'All'],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setStatusFilter(key)}
            className={`rounded-[5px] px-2.5 py-1 text-xs font-medium ${
              statusFilter === key
                ? 'bg-navy-800 text-white'
                : 'bg-white/80 text-steel-600 border border-mist-200 hover:border-steel-400'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <ul className="space-y-2">
        {filtered.map((req) => {
          const remaining = remainingFor(req)
          const urgent = req.status === 'pending' && remaining < req.slaHours * 0.25
          return (
            <li key={req.id}>
              <Link
                to={`/review/${req.id}`}
                className={`block rounded-md border border-mist-200 bg-white/90 px-4 py-3 transition-colors hover:border-steel-400 focus-visible:outline-none focus-visible:shadow-[0_0_0_4px_rgba(133,193,223,0.45)] ${urgent ? 'sla-pulse' : ''}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs text-steel-600">{req.id}</p>
                    <p className="font-medium text-navy-800">{req.title}</p>
                    <p className="mt-1 text-xs text-steel-600">
                      {PRODUCT_LABELS[req.product]} · {CHANNEL_LABELS[req.channel]} ·{' '}
                      {ASSET_LABELS[req.assetType]}
                    </p>
                    <p className="mt-1 text-xs text-steel-600">
                      Submitted by {req.submitter}
                      {req.partnerName ? ` · ${req.partnerName}` : ''} · {formatWhen(req.submittedAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {req.status === 'pending' && <RiskBadge tier={req.riskTier} short />}
                    <StatusBadge status={req.status} />
                    {req.status === 'pending' && (
                      <span
                        className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium ${
                          urgent ? 'bg-warn-soft text-warn' : 'bg-mist-100 text-steel-600'
                        }`}
                      >
                        {urgent ? <WarningCircle size={12} /> : <Clock size={12} />}
                        {formatSla(req)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          )
        })}
        {filtered.length === 0 && (
          <li className="rounded-md border border-dashed border-mist-200 bg-white/60 px-4 py-10 text-center text-sm text-steel-600">
            No requests in this filter.
          </li>
        )}
      </ul>
    </div>
  )
}

function Metric({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="rounded-md border border-mist-200 bg-white/90 px-4 py-3">
      <p className="text-xs text-steel-600">{label}</p>
      <p className={`mt-1 font-serif text-2xl ${warn ? 'text-warn' : 'text-navy-800'}`}>{value}</p>
    </div>
  )
}
