import { StatusBadge } from '@/components/StatusBadge'
import { Button } from '@/components/ui/button'
import { ASSET_LABELS, CHANNEL_LABELS, PRODUCT_LABELS, isDeclinedStatus } from '@/lib/labels'
import { useStore } from '@/lib/store'
import { formatWhen } from '@/lib/time'
import { PencilSimple, Plus, Trash } from '@phosphor-icons/react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

export function MinePage() {
  const { session, visibleRequests, deleteRequest } = useStore()
  const navigate = useNavigate()

  if (!session) return <Navigate to="/" replace />
  if (session.role !== 'submitter') return <Navigate to="/queue" replace />

  const sorted = [...visibleRequests].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )

  return (
    <div className="animate-in">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-serif text-2xl text-navy-800">Your submitted requests</h1>
        <Button variant="primary" icon={<Plus size={16} />} onClick={() => navigate('/submit')}>
          New request
        </Button>
      </div>

      <ul className="space-y-2">
        {sorted.map((req) => {
          const canEdit = req.status === 'pending' || isDeclinedStatus(req.status)
          return (
            <li key={req.id}>
              <div className="rounded-md border border-mist-200 bg-white/90 px-4 py-3 transition-colors hover:border-steel-400">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <Link to={`/review/${req.id}`} className="min-w-0 flex-1 focus-visible:outline-none">
                    <p className="text-xs text-steel-600">{req.id}</p>
                    <p className="font-medium text-navy-800">{req.title}</p>
                    <p className="mt-1 text-xs text-steel-600">
                      {PRODUCT_LABELS[req.product]} · {CHANNEL_LABELS[req.channel]} ·{' '}
                      {ASSET_LABELS[req.assetType]} · Updated {formatWhen(req.updatedAt)}
                    </p>
                  </Link>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <StatusBadge status={req.status} />
                    <div className="flex items-center gap-0">
                      {canEdit && (
                        <Button
                          variant="ghost"
                          icon={<PencilSimple size={16} />}
                          className="px-1 py-1"
                          aria-label="Edit"
                          title="Edit"
                          onClick={() => navigate(`/submit/${req.id}`)}
                        />
                      )}
                      <Button
                        variant="ghost"
                        icon={<Trash size={16} />}
                        className="px-1 py-1"
                        aria-label="Delete"
                        title="Delete"
                        onClick={() => {
                          if (window.confirm(`Delete ${req.id}? This cannot be undone.`)) {
                            deleteRequest(req.id)
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
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
