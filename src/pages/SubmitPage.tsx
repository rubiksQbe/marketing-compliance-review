import { Button } from '@/components/ui/button'
import { FieldError, Input, Label, Select, Textarea } from '@/components/ui/field'
import {
  ASSET_LABELS,
  CHANNEL_LABELS,
  CLAIM_LABELS,
  PRODUCT_LABELS,
  RISK_LABELS,
  isDeclinedStatus,
} from '@/lib/labels'
import { suggestRiskTier } from '@/lib/risk'
import { useStore } from '@/lib/store'
import type {
  AssetType,
  Channel,
  ClaimFlag,
  Product,
  RiskTier,
  SubmissionSource,
} from '@/lib/types'
import { PaperPlaneTilt } from '@phosphor-icons/react'
import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

const CLAIMS = Object.keys(CLAIM_LABELS) as ClaimFlag[]

export function SubmitPage() {
  const { id } = useParams<{ id?: string }>()
  const { session, submitRequest, resubmitRequest, getRequest } = useStore()
  const navigate = useNavigate()
  const existing = id ? getRequest(id) : undefined
  const editing = Boolean(id && existing)

  const [title, setTitle] = useState('')
  const [product, setProduct] = useState<Product>('personal_loans')
  const [channel, setChannel] = useState<Channel>('affiliate')
  const [assetType, setAssetType] = useState<AssetType>('banner')
  const [audience, setAudience] = useState('')
  const [body, setBody] = useState('')
  const [destinationUrl, setDestinationUrl] = useState('')
  const [disclosures, setDisclosures] = useState('')
  const [claimFlags, setClaimFlags] = useState<ClaimFlag[]>([])
  const [source, setSource] = useState<SubmissionSource>(
    session?.kind === 'affiliate_manager' ? 'affiliate' : 'internal',
  )
  const [partnerName, setPartnerName] = useState('')
  const [intakeNotes, setIntakeNotes] = useState('')
  const [riskOverride, setRiskOverride] = useState<RiskTier | ''>('')
  const [error, setError] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(!id)

  useEffect(() => {
    if (!id || !existing) {
      setHydrated(true)
      return
    }
    setTitle(existing.title)
    setProduct(existing.product)
    setChannel(existing.channel)
    setAssetType(existing.assetType)
    setAudience(existing.audience)
    setBody(existing.body)
    setDestinationUrl(existing.destinationUrl)
    setDisclosures(existing.disclosures)
    setClaimFlags(existing.claimFlags)
    setSource(existing.source)
    setPartnerName(existing.partnerName ?? '')
    setIntakeNotes(existing.intakeNotes ?? '')
    setRiskOverride(existing.riskTier)
    setHydrated(true)
  }, [id, existing])

  const suggested = useMemo(
    () => suggestRiskTier({ product, channel, claimFlags }),
    [product, channel, claimFlags],
  )
  const riskTier = riskOverride || suggested

  if (!session) return <Navigate to="/" replace />
  if (session.role !== 'submitter') return <Navigate to="/queue" replace />
  if (id && hydrated && (!existing || existing.submitter !== session.name)) {
    return <Navigate to="/mine" replace />
  }
  if (editing && existing && existing.status === 'approved') {
    return <Navigate to={`/review/${existing.id}`} replace />
  }
  if (editing && existing && !(existing.status === 'pending' || isDeclinedStatus(existing.status))) {
    return <Navigate to="/mine" replace />
  }
  if (!hydrated) return null

  function toggleClaim(flag: ClaimFlag) {
    setClaimFlags((prev) =>
      prev.includes(flag) ? prev.filter((f) => f !== flag) : [...prev, flag],
    )
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!title.trim() || !audience.trim() || !body.trim() || !destinationUrl.trim() || !disclosures.trim()) {
      setError('Complete all required fields before submitting.')
      return
    }
    if (source === 'affiliate' && !partnerName.trim()) {
      setError('Partner name is required for affiliate-sourced packets.')
      return
    }
    try {
      new URL(destinationUrl.trim())
    } catch {
      setError('Destination must be a valid URL.')
      return
    }

    const payload = {
      title: title.trim(),
      product,
      channel,
      assetType,
      audience: audience.trim(),
      body: body.trim(),
      destinationUrl: destinationUrl.trim(),
      disclosures: disclosures.trim(),
      claimFlags,
      riskTier,
      source,
      partnerName: partnerName.trim() || undefined,
      intakeNotes: intakeNotes.trim() || undefined,
    }

    if (editing && id) {
      const updated = resubmitRequest(id, payload)
      if (updated) navigate(`/review/${updated.id}`)
      return
    }

    const created = submitRequest(payload)
    navigate(`/review/${created.id}`)
  }

  return (
    <div className="mx-auto max-w-2xl animate-in">
      <h1 className="font-serif text-2xl text-navy-800">
        {editing ? 'Edit & resubmit' : 'Submit for review'}
      </h1>

      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-md border border-mist-200 bg-white/90 p-5">
        <div>
          <Label htmlFor="title" required>
            Piece title
          </Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="product" required>
              Product
            </Label>
            <Select
              id="product"
              className="mt-1"
              value={product}
              onChange={(e) => setProduct(e.target.value as Product)}
            >
              {(Object.keys(PRODUCT_LABELS) as Product[]).map((p) => (
                <option key={p} value={p}>
                  {PRODUCT_LABELS[p]}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="channel" required>
              Channel
            </Label>
            <Select
              id="channel"
              className="mt-1"
              value={channel}
              onChange={(e) => setChannel(e.target.value as Channel)}
            >
              {(Object.keys(CHANNEL_LABELS) as Channel[]).map((c) => (
                <option key={c} value={c}>
                  {CHANNEL_LABELS[c]}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="asset" required>
              Asset type
            </Label>
            <Select
              id="asset"
              className="mt-1"
              value={assetType}
              onChange={(e) => setAssetType(e.target.value as AssetType)}
            >
              {(Object.keys(ASSET_LABELS) as AssetType[]).map((a) => (
                <option key={a} value={a}>
                  {ASSET_LABELS[a]}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="source" required>
              Source
            </Label>
            <Select
              id="source"
              className="mt-1"
              value={source}
              onChange={(e) => setSource(e.target.value as SubmissionSource)}
            >
              <option value="internal">Internal</option>
              <option value="affiliate">Affiliate partner</option>
            </Select>
          </div>
        </div>

        {source === 'affiliate' && (
          <div>
            <Label htmlFor="partner" required>
              Partner name
            </Label>
            <Input
              id="partner"
              className="mt-1"
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              placeholder="e.g. LoanCompare Media"
            />
          </div>
        )}

        <div>
          <Label htmlFor="audience" required>
            Audience
          </Label>
          <Input
            id="audience"
            className="mt-1"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="body" required>
            Creative copy (exact)
          </Label>
          <Textarea
            id="body"
            className="mt-1 min-h-24"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="url" required>
            Destination URL
          </Label>
          <Input
            id="url"
            className="mt-1"
            value={destinationUrl}
            onChange={(e) => setDestinationUrl(e.target.value)}
            placeholder="https://"
          />
        </div>

        <div>
          <Label htmlFor="disclosures" required>
            Disclosures (as shown)
          </Label>
          <Textarea
            id="disclosures"
            className="mt-1 min-h-20"
            value={disclosures}
            onChange={(e) => setDisclosures(e.target.value)}
          />
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-navy-800">Claim flags</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {CLAIMS.map((flag) => {
              const on = claimFlags.includes(flag)
              return (
                <button
                  key={flag}
                  type="button"
                  onClick={() => toggleClaim(flag)}
                  className={`rounded-[5px] border px-2.5 py-1 text-xs font-medium ${
                    on
                      ? 'border-navy-800 bg-navy-800 text-white'
                      : 'border-mist-200 bg-white text-steel-600 hover:border-steel-400'
                  }`}
                >
                  {CLAIM_LABELS[flag]}
                </button>
              )
            })}
          </div>
        </fieldset>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="risk">Risk tier</Label>
            <Select
              id="risk"
              className="mt-1"
              value={riskOverride}
              onChange={(e) => setRiskOverride((e.target.value || '') as RiskTier | '')}
            >
              <option value="">Suggested: {RISK_LABELS[suggested]}</option>
              {(Object.keys(RISK_LABELS) as RiskTier[]).map((t) => (
                <option key={t} value={t}>
                  Override: {RISK_LABELS[t]}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="notes">Intake notes (optional)</Label>
            <Input
              id="notes"
              className="mt-1"
              value={intakeNotes}
              onChange={(e) => setIntakeNotes(e.target.value)}
            />
          </div>
        </div>

        <FieldError>{error}</FieldError>

        <Button type="submit" variant="primary" icon={<PaperPlaneTilt size={16} />} className="w-full sm:w-auto">
          {editing ? 'Resubmit for approval' : 'Submit for compliance review'}
        </Button>
      </form>
    </div>
  )
}
