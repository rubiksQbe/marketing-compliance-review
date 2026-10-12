import { RiskBadge, StatusBadge } from '@/components/StatusBadge'
import { Button } from '@/components/ui/button'
import { ASSET_LABELS, CHANNEL_LABELS, PRODUCT_LABELS, REASON_LABELS } from '@/lib/labels'
import { useStore } from '@/lib/store'
import { formatWhen } from '@/lib/time'
import { fixesForCodes } from '@/data/findings'
import { Plus } from '@phosphor-icons/react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

export function MinePage() {
  const { session, visibleRequests } = useStore()
  const navigate = useNavigate()

  if (!session) return <Navigate to="/" replace />
  if (session.role !== 'submitter') return <Navigate to="/queue" replace />

  const sorted = [...visibleRequests].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )

  return (
    <div className="animate-in">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl text-navy-800">Your submitted requests</h1>
          <p className="mt-1 text-sm text-steel-600">
            Only {session.name}’s packets — peers’ in-flight work stays private.
          </p>
        </div>
        <Button variant="primary" icon={<Plus size={16} />} onClick={() => navigate('/submit')}>
          New request
        </Button>
      </div>

      <ul className="space-y-2">
        {sorted.map((req) => {
          const lastDecision = [...req.events]
            .reverse()
            .find((e) => e.action === 'approved' || e.action === 'changes_requested' || e.action === 'rejected')
          const fixes = lastDecision?.reasonCodes?.length
            ? fixesForCodes(lastDecision.reasonCodes)
            : []

          return (
            <li key={req.id}>
              <Link
                to={`/review/${req.id}`}
                className="block rounded-md border border-mist-200 bg-white/90 px-4 py-3 transition-colors hover:border-steel-400 focus-visible:outline-none focus-visible:shadow-[0_0_0_4px_rgba(133,193,223,0.45)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-steel-600">{req.id}</p>
                    <p className="font-medium text-navy-800">{req.title}</p>
                    <p className="mt-1 text-xs text-steel-600">
                      {PRODUCT_LABELS[req.product]} · {CHANNEL_LABELS[req.channel]} ·{' '}
                      {ASSET_LABELS[req.assetType]} · Updated {formatWhen(req.updatedAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <RiskBadge tier={req.riskTier} short />
                    <StatusBadge status={req.status} />
                  </div>
                </div>
                {lastDecision && (lastDecision.action !== 'approved') && (
                  <div className="mt-2 rounded-[5px] bg-forest-50 px-3 py-2 text-xs text-forest-800">
                    {fixes.length > 0 ? (
                      <ul className="list-disc space-y-0.5 pl-4">
                        {fixes.map((fix) => (
                          <li key={fix}>{fix}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>
                        {lastDecision.reasonCodes
                          ?.map((c) => REASON_LABELS[c])
                          .join(' · ') || 'See reviewer notes.'}
                      </p>
                    )}
                    {lastDecision.detail && (
                      <p className="mt-1 text-steel-600">{lastDecision.detail}</p>
                    )}
                  </div>
                )}
              </Link>
            </li>
          )
        })}
        {sorted.length === 0 && (
          <li className="rounded-md border border-dashed border-mist-200 bg-white/60 px-4 py-10 text-center text-sm text-steel-600">
            No submissions yet.{' '}
            <Link to="/submit" className="font-medium text-navy-800 underline underline-offset-2">
              Submit a package
            </Link>
          </li>
        )}
      </ul>
    </div>
  )
}
