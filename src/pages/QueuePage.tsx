import { RiskBadge, StatusBadge } from '@/components/StatusBadge'
import {
  ASSET_LABELS,
  CHANNEL_LABELS,
  PRODUCT_LABELS,
} from '@/lib/labels'
import { useStore } from '@/lib/store'
import { formatSla, formatWhen, remainingFor } from '@/lib/time'
import type { RequestStatus, RiskTier } from '@/lib/types'
import { Clock, WarningCircle } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'

const RISK_ORDER: Record<RiskTier, number> = { high: 0, medium: 1, low: 2 }

export function QueuePage() {
  const { session, visibleRequests } = useStore()
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('pending')

  const filtered = useMemo(() => {
    const list =
      statusFilter === 'all'
        ? visibleRequests
        : visibleRequests.filter((r) => r.status === statusFilter)
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
          Org-wide workbench — prioritize by risk tier and SLA.
        </p>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <Metric label="Pending" value={String(pending.length)} />
        <Metric
          label="SLA at risk"
          value={String(atRisk.length)}
          warn={atRisk.length > 0}
        />
        <Metric label="In queue (all)" value={String(visibleRequests.length)} />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(['pending', 'changes_requested', 'approved', 'rejected', 'all'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            className={`rounded-[5px] px-2.5 py-1 text-xs font-medium ${
              statusFilter === s
                ? 'bg-navy-800 text-white'
                : 'bg-white/80 text-steel-600 border border-mist-200 hover:border-steel-400'
            }`}
          >
            {s === 'all' ? 'All' : s === 'changes_requested' ? 'Changes' : s === 'rejected' ? 'Declined' : s[0].toUpperCase() + s.slice(1)}
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
                    <RiskBadge tier={req.riskTier} short />
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
