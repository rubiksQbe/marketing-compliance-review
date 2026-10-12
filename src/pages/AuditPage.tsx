import { StatusBadge } from '@/components/StatusBadge'
import { Button } from '@/components/ui/button'
import { fixesForCodes } from '@/data/findings'
import { EVENT_ACTION_LABELS, REASON_LABELS } from '@/lib/labels'
import { useStore } from '@/lib/store'
import { formatWhen } from '@/lib/time'
import { ArrowLeft } from '@phosphor-icons/react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'

export function AuditPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { getRequest, session, visibleRequests } = useStore()
  const request = getRequest(id)

  if (!session) return <Navigate to="/" replace />

  const canAccess = Boolean(
    request &&
      (session.role === 'reviewer' || visibleRequests.some((r) => r.id === request.id)),
  )

  if (!request || !canAccess) {
    return (
      <div className="rounded-md border border-dashed border-mist-200 bg-white/70 px-6 py-16 text-center">
        <h1 className="font-serif text-2xl text-navy-800">Activity not available</h1>
        <Link to={session.role === 'reviewer' ? '/queue' : '/mine'} className="mt-4 inline-block text-sm font-medium underline">
          Back
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl animate-in">
      <Button
        variant="ghost"
        icon={<ArrowLeft size={16} />}
        onClick={() => navigate(`/review/${request.id}`)}
        className="mb-4 px-0"
      >
        Back to review
      </Button>

      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs text-steel-600">{request.id}</p>
          <h1 className="font-serif text-2xl text-navy-800">{request.title}</h1>
        </div>
        <StatusBadge status={request.status} />
      </div>

      <ol className="space-y-3 border-l-2 border-mist-200 pl-4">
        {[...request.events]
          .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime())
          .map((evt) => {
            const fixes = evt.reasonCodes?.length ? fixesForCodes(evt.reasonCodes) : []
            return (
              <li key={evt.id} className="relative">
                <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-steel-400" />
                <p className="text-xs text-steel-600">{formatWhen(evt.at)}</p>
                <p className="font-medium text-navy-800">
                  {EVENT_ACTION_LABELS[evt.action]} · {evt.actor}
                </p>
                {evt.reasonCodes?.length ? (
                  <p className="mt-1 text-xs text-steel-600">
                    Issues: {evt.reasonCodes.map((c) => REASON_LABELS[c]).join(', ')}
                  </p>
                ) : null}
                {fixes.length > 0 && (
                  <ul className="mt-1 list-disc pl-4 text-xs text-navy-800">
                    {fixes.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                )}
                {evt.detail && <p className="mt-1 text-xs text-steel-600">{evt.detail}</p>}
              </li>
            )
          })}
      </ol>
    </div>
  )
}
