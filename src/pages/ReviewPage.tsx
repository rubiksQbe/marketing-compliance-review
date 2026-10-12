import { ConfirmDialog } from '@/components/ConfirmDialog'
import { RiskBadge, StatusBadge } from '@/components/StatusBadge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/field'
import { FINDINGS, fixesForCodes } from '@/data/findings'
import { useAutoHideScroll } from '@/hooks/useAutoHideScroll'
import {
  ASSET_LABELS,
  CHANNEL_LABELS,
  CLAIM_LABELS,
  PRODUCT_LABELS,
  REASON_LABELS,
  isDeclinedStatus,
  isVisualAsset,
} from '@/lib/labels'
import { useStore } from '@/lib/store'
import { formatSla } from '@/lib/time'
import type { ReasonCode } from '@/lib/types'
import { ArrowLeft, Path, PencilSimple, Trash } from '@phosphor-icons/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'

export function ReviewPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { getRequest, decide, markOpened, session, visibleRequests, deleteRequest } = useStore()
  const request = getRequest(id)

  const [selected, setSelected] = useState<ReasonCode[]>([])
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  useAutoHideScroll(leftRef)
  useAutoHideScroll(rightRef)

  const canAccess = Boolean(
    request &&
      session &&
      (session.role === 'reviewer' || visibleRequests.some((r) => r.id === request.id)),
  )

  const isReviewer = session?.role === 'reviewer'
  const isSubmitter = session?.role === 'submitter'

  const actionable = Boolean(isReviewer && request && request.status === 'pending')

  const lastDecision = useMemo(() => {
    if (!request) return undefined
    return [...request.events]
      .reverse()
      .find((e) => e.action === 'approved' || e.action === 'changes_requested' || e.action === 'rejected')
  }, [request])

  const declinedCodes = lastDecision?.reasonCodes ?? []
  const declinedNotes = lastDecision?.detail ?? ''
  const declinedFixes = useMemo(() => fixesForCodes(declinedCodes), [declinedCodes])
  const requestDeclined = Boolean(request && isDeclinedStatus(request.status))
  const requestApproved = request?.status === 'approved'
  const canSubmitterEdit = Boolean(
    isSubmitter && request && (request.status === 'pending' || requestDeclined),
  )

  const requestedFixes = useMemo(() => fixesForCodes(selected), [selected])

  useEffect(() => {
    if (request && isReviewer && session) {
      markOpened(request.id, session.name)
    }
  }, [request, isReviewer, session, markOpened])

  if (!session) return <Navigate to="/" replace />
  if (!request || !canAccess) {
    return (
      <div className="rounded-md border border-dashed border-mist-200 bg-white/70 px-6 py-16 text-center animate-in">
        <h1 className="font-serif text-2xl text-navy-800">Request not found</h1>
        <p className="mt-2 text-sm text-steel-600">It may be outside your visibility or cleared.</p>
        <Link
          to={session.role === 'reviewer' ? '/queue' : '/mine'}
          className="mt-4 inline-block text-sm font-medium text-navy-800 underline underline-offset-2"
        >
          Back
        </Link>
      </div>
    )
  }

  const backTo = isReviewer ? '/queue' : '/mine'
  const backLabel = isReviewer ? 'Queue' : 'Requests'
  const visual = isVisualAsset(request.assetType)
  const declining = selected.length > 0

  function toggle(code: ReasonCode) {
    setSelected((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    )
    setError(null)
  }

  function onDecide() {
    if (!actionable || !session) return
    setError(null)
    if (declining && selected.length === 0) {
      setError('Select at least one rejection reason to decline.')
      return
    }
    decide(request!.id, {
      action: declining ? 'rejected' : 'approved',
      detail: notes.trim() || undefined,
      reasonCodes: declining ? selected : undefined,
      actor: session.name,
    })
    navigate(isReviewer ? '/queue' : `/review/${request!.id}`)
  }

  return (
    <div className="animate-in -mx-4 sm:-mx-6">
      <div className="mx-auto flex max-w-6xl flex-col rounded-md border border-mist-200 bg-canvas sm:mx-6 lg:h-[calc(100vh-7.5rem)] lg:overflow-hidden">
        <header className="shrink-0 border-b border-mist-200 bg-white px-[18px] py-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <Link
              to={backTo}
              className="inline-flex items-center gap-1 text-[11px] text-steel-600 hover:text-navy-800"
            >
              <ArrowLeft size={12} /> {backLabel} · {request.id}
            </Link>
            <span className="inline-flex items-center gap-1.5">
              {isReviewer ? (
                request.status === 'pending' ? (
                  <>
                    <RiskBadge tier={request.riskTier} short />
                    <span className="rounded px-1.5 py-0.5 text-[10px] font-medium leading-tight bg-warn-soft text-warn">
                      {formatSla(request)}
                    </span>
                  </>
                ) : (
                  <StatusBadge status={request.status} />
                )
              ) : (
                <StatusBadge status={request.status} />
              )}
            </span>
          </div>
          <h1 className="font-serif text-lg text-navy-800 leading-snug sm:text-[18px]">
            {request.title}
          </h1>
          <p className="mt-2.5 text-[11px] text-steel-600 leading-snug">
            Submitted by <strong className="font-medium text-navy-800">{request.submitter}</strong>
            {' · '}
            {request.source === 'affiliate' ? 'Affiliate manager' : 'Internal marketer'}
            {request.partnerName ? (
              <>
                {' · Partner: '}
                <strong className="font-medium text-navy-800">{request.partnerName}</strong>
              </>
            ) : null}
          </p>
        </header>

        <div className="grid flex-1 grid-cols-1 lg:min-h-0 lg:grid-cols-[2fr_1fr] lg:overflow-hidden">
          <div
            ref={leftRef}
            className="border-mist-200 p-3.5 lg:scroll-pane lg:min-h-0 lg:overflow-auto lg:border-r"
          >
            <div className="rounded-md border border-mist-200 bg-white p-3.5">
              <SectionLabel>Creative</SectionLabel>
              {visual ? (
                request.creativeImage ? (
                  <div className="overflow-hidden rounded-[5px] border border-mist-200 bg-canvas">
                    <img
                      src={request.creativeImage}
                      alt="Submitted creative"
                      className="max-h-[220px] w-full object-contain"
                    />
                  </div>
                ) : (
                  <div
                    className="relative flex h-[140px] flex-col justify-center overflow-hidden rounded-[5px] px-[18px] py-4 text-white"
                    style={{
                      background:
                        'linear-gradient(120deg, #183757 0%, #2d5d90 48%, #629bb8 100%)',
                    }}
                    role="img"
                    aria-label="Creative preview"
                  >
                    <div
                      className="pointer-events-none absolute -right-6 -bottom-9 h-[150px] w-[150px] rounded-full"
                      style={{ background: 'rgba(103,160,137,0.28)' }}
                    />
                    <p className="text-[9px] font-medium uppercase tracking-wider opacity-90 relative z-[1]">
                      {request.source === 'affiliate' ? 'Partner offer' : 'ClearPath'} ·{' '}
                      {PRODUCT_LABELS[request.product]}
                    </p>
                    <p className="relative z-[1] mt-1.5 font-serif text-lg leading-snug max-w-[88%]">
                      {request.body.split('—')[0]?.trim() || request.body}
                    </p>
                    <span className="relative z-[1] mt-2.5 self-start rounded-[4px] bg-forest-400 px-2.5 py-1 text-[11px] font-medium">
                      Apply in minutes →
                    </span>
                  </div>
                )
              ) : (
                <blockquote className="rounded-r-[5px] border-l-[3px] border-steel-400 bg-canvas px-3 py-2.5 text-[13px] leading-snug text-navy-800">
                  {request.body}
                </blockquote>
              )}

              <SectionLabel>Destination</SectionLabel>
              <p className="break-words text-xs text-navy-800 leading-snug">
                <a
                  href={request.destinationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-steel-600 underline underline-offset-2 hover:text-navy-800"
                >
                  {request.destinationUrl}
                </a>
              </p>

              <SectionLabel>Disclosures (as shown)</SectionLabel>
              <p className="text-xs text-navy-800 leading-snug">{request.disclosures}</p>

              <SectionLabel>Classification</SectionLabel>
              <dl className="grid gap-[3px] text-xs leading-tight">
                <Row label="Product" value={PRODUCT_LABELS[request.product]} />
                <Row label="Channel" value={CHANNEL_LABELS[request.channel]} />
                <Row label="Asset type" value={ASSET_LABELS[request.assetType]} />
                <Row label="Audience" value={request.audience} />
              </dl>

              <SectionLabel>Claims flagged</SectionLabel>
              <p className="text-xs text-navy-800 leading-snug">
                {request.claimFlags.length
                  ? request.claimFlags.map((c) => CLAIM_LABELS[c]).join(', ')
                  : 'None'}
              </p>

              {request.intakeNotes ? (
                <>
                  <SectionLabel>Intake notes</SectionLabel>
                  <p className="text-xs text-navy-800 leading-snug">{request.intakeNotes}</p>
                </>
              ) : null}
            </div>
          </div>

          <aside className="flex flex-col border-t border-mist-200 bg-white lg:min-h-0 lg:border-t-0">
            <div
              ref={rightRef}
              className="px-3.5 pt-3.5 pb-2 lg:scroll-pane lg:min-h-0 lg:flex-1 lg:overflow-auto"
            >
              {isReviewer && (
                <>
                  {actionable && (
                    <>
                      <p className="mb-2 text-[11px] font-medium text-navy-800">Rejection reasons</p>
                      {FINDINGS.map((f) => (
                        <label
                          key={f.code}
                          className="grid grid-cols-[16px_1fr] items-center gap-1.5 border-t border-mist-100 py-1.5 text-[11px] leading-snug first:border-t-0 first:pt-0"
                        >
                          <input
                            type="checkbox"
                            className="accent-navy-800"
                            checked={selected.includes(f.code)}
                            onChange={() => toggle(f.code)}
                          />
                          <span className="font-medium text-navy-800">{f.label}</span>
                        </label>
                      ))}

                      {declining && (
                        <div className="mt-2 rounded-[5px] bg-forest-50 px-2 py-2 text-[10px] leading-snug text-forest-800">
                          <p className="font-medium text-navy-800">Requested changes</p>
                          <ul className="mt-1 list-disc space-y-0.5 pl-4 font-normal">
                            {requestedFixes.map((fix) => (
                              <li key={fix}>{fix}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="mt-2">
                        <p className="mb-1 text-[11px] font-medium text-navy-800">Additional notes</p>
                        <Textarea
                          className="min-h-12 text-[11px]"
                          placeholder="Optional comments…"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                        />
                      </div>

                      {error && <p className="mt-2 text-[11px] text-danger">{error}</p>}
                    </>
                  )}

                  {!actionable && requestApproved && (
                    <p className="text-[11px] text-steel-600">Approved.</p>
                  )}

                  {!actionable && requestDeclined && (
                    <DeclinedReasonsPanel
                      codes={declinedCodes}
                      fixes={declinedFixes}
                      notes={declinedNotes}
                    />
                  )}

                  <Button
                    variant="ghost"
                    icon={<Path size={14} />}
                    className="mt-3 w-full justify-start px-0"
                    onClick={() => navigate(`/audit/${request.id}`)}
                  >
                    Audit trail
                  </Button>
                </>
              )}

              {isSubmitter && requestDeclined && (
                <DeclinedReasonsPanel
                  codes={declinedCodes}
                  fixes={declinedFixes}
                  notes={declinedNotes}
                />
              )}

              {isSubmitter && requestApproved && (
                <p className="text-[11px] text-steel-600">This package was approved.</p>
              )}

              {isSubmitter && request.status === 'pending' && (
                <p className="text-[11px] text-steel-600">Awaiting compliance decision.</p>
              )}
            </div>

            {actionable && (
              <div className="shrink-0 border-t border-mist-100 px-3.5 py-3.5">
                <Button
                  type="button"
                  variant={declining ? 'decline' : 'approve'}
                  className="w-full"
                  onClick={onDecide}
                >
                  {declining ? 'Decline' : 'Approve'}
                </Button>
              </div>
            )}

            {canSubmitterEdit && (
              <div className="shrink-0 border-t border-mist-100 px-3.5 py-3.5 flex flex-col gap-2">
                <Button
                  type="button"
                  variant="primary"
                  className="w-full"
                  icon={<PencilSimple size={16} />}
                  onClick={() => navigate(`/submit/${request.id}`)}
                >
                  Edit & resubmit
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  icon={<Trash size={16} />}
                  onClick={() => setConfirmDelete(true)}
                >
                  Delete request
                </Button>
              </div>
            )}
          </aside>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete request?"
        body={`${request.id} — ${request.title}. This cannot be undone.`}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          deleteRequest(request.id)
          setConfirmDelete(false)
          navigate('/mine')
        }}
      />
    </div>
  )
}

function DeclinedReasonsPanel({
  codes,
  fixes,
  notes,
}: {
  codes: ReasonCode[]
  fixes: string[]
  notes: string
}) {
  return (
    <>
      <p className="mb-2 text-[11px] font-medium text-navy-800">Rejection reasons</p>
      {codes.length === 0 ? (
        <p className="text-[11px] text-steel-600">No coded reasons recorded.</p>
      ) : (
        codes.map((code) => (
          <div
            key={code}
            className="grid grid-cols-[16px_1fr] items-center gap-1.5 border-t border-mist-100 py-1.5 text-[11px] leading-snug first:border-t-0 first:pt-0"
          >
            <input type="checkbox" className="accent-navy-800" checked readOnly disabled />
            <span className="font-medium text-navy-800">{REASON_LABELS[code]}</span>
          </div>
        ))
      )}

      {fixes.length > 0 && (
        <div className="mt-2 rounded-[5px] bg-forest-50 px-2 py-2 text-[10px] leading-snug text-forest-800">
          <p className="font-medium text-navy-800">Requested changes</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-4 font-normal">
            {fixes.map((fix) => (
              <li key={fix}>{fix}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-2">
        <p className="mb-1 text-[11px] font-medium text-navy-800">Additional notes</p>
        <p className="rounded-[5px] border border-mist-200 bg-canvas px-2 py-2 text-[11px] text-navy-800 leading-snug whitespace-pre-wrap">
          {notes || '—'}
        </p>
      </div>
    </>
  )
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="mt-3.5 mb-1.5 first:mt-0 text-[10px] font-medium uppercase tracking-wider text-steel-600">
      {children}
    </p>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[96px_1fr] gap-2">
      <dt className="font-medium text-steel-600">{label}</dt>
      <dd className="break-words text-navy-800">{value}</dd>
    </div>
  )
}
