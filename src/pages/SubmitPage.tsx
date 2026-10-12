import { RiskBadge } from '@/components/StatusBadge'
import { Button } from '@/components/ui/button'
import { FieldError, Input, Label, Select, Textarea } from '@/components/ui/field'
import {
  ASSET_LABELS,
  CHANNEL_LABELS,
  CLAIM_LABELS,
  PRODUCT_LABELS,
  isDeclinedStatus,
  isVisualAsset,
} from '@/lib/labels'
import { scoreRisk } from '@/lib/risk'
import { useStore } from '@/lib/store'
import type {
  AssetType,
  Channel,
  ClaimFlag,
  Product,
  SubmissionSource,
} from '@/lib/types'
import { FileArrowUp, Image as ImageIcon, Trash } from '@phosphor-icons/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

const CLAIMS = Object.keys(CLAIM_LABELS) as ClaimFlag[]
/** Keep demo localStorage under control. */
const MAX_CREATIVE_BYTES = 900_000

function readImageAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Upload an image file (PNG, JPG, WebP, or GIF).'))
      return
    }
    if (file.size > MAX_CREATIVE_BYTES) {
      reject(new Error('Image must be under 900 KB for this demo.'))
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result)
      else reject(new Error('Could not read that file.'))
    }
    reader.onerror = () => reject(new Error('Could not read that file.'))
    reader.readAsDataURL(file)
  })
}

export function SubmitPage() {
  const { id } = useParams<{ id?: string }>()
  const { session, submitRequest, resubmitRequest, getRequest } = useStore()
  const navigate = useNavigate()
  const existing = id ? getRequest(id) : undefined
  const editing = Boolean(id && existing)

  const [title, setTitle] = useState('')
  const [product, setProduct] = useState<Product | ''>('')
  const [channel, setChannel] = useState<Channel | ''>('')
  const [assetType, setAssetType] = useState<AssetType>('banner')
  const [audience, setAudience] = useState('')
  const [body, setBody] = useState('')
  const [creativeImage, setCreativeImage] = useState<string | undefined>()
  const [destinationUrl, setDestinationUrl] = useState('')
  const [disclosures, setDisclosures] = useState('')
  const [claimFlags, setClaimFlags] = useState<ClaimFlag[]>([])
  const [source, setSource] = useState<SubmissionSource>(
    session?.kind === 'affiliate_manager' ? 'affiliate' : 'internal',
  )
  const [partnerName, setPartnerName] = useState('')
  const [intakeNotes, setIntakeNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(!id)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    setCreativeImage(existing.creativeImage)
    setDestinationUrl(existing.destinationUrl)
    setDisclosures(existing.disclosures)
    setClaimFlags(existing.claimFlags)
    setSource(existing.source)
    setPartnerName(existing.partnerName ?? '')
    setIntakeNotes(existing.intakeNotes ?? '')
    setHydrated(true)
  }, [id, existing])

  const visual = isVisualAsset(assetType)

  /** Visual assets require a file; text-only assets require copy. */
  const hasCreativeSubstance = visual ? Boolean(creativeImage) : Boolean(body.trim())
  const copyRequired = !visual

  const risk = useMemo(() => {
    if (!product && !channel && claimFlags.length === 0) return null
    return scoreRisk({ product, channel, claimFlags })
  }, [product, channel, claimFlags])

  const isDirty = useMemo(() => {
    if (!editing || !existing) return true
    const flagsEqual =
      [...claimFlags].sort().join('|') === [...existing.claimFlags].sort().join('|')
    const nextImage = isVisualAsset(assetType) ? creativeImage : undefined
    return !(
      title.trim() === existing.title &&
      product === existing.product &&
      channel === existing.channel &&
      assetType === existing.assetType &&
      audience.trim() === existing.audience &&
      body.trim() === existing.body &&
      nextImage === existing.creativeImage &&
      destinationUrl.trim() === existing.destinationUrl &&
      disclosures.trim() === existing.disclosures &&
      flagsEqual &&
      source === existing.source &&
      (partnerName.trim() || undefined) === existing.partnerName &&
      (intakeNotes.trim() || undefined) === (existing.intakeNotes || undefined)
    )
  }, [
    editing,
    existing,
    title,
    product,
    channel,
    assetType,
    audience,
    body,
    creativeImage,
    destinationUrl,
    disclosures,
    claimFlags,
    source,
    partnerName,
    intakeNotes,
  ])

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

  async function onCreativeFile(file: File | undefined) {
    if (!file) return
    setError(null)
    try {
      const dataUrl = await readImageAsDataUrl(file)
      setCreativeImage(dataUrl)
    } catch (err) {
      setCreativeImage(undefined)
      setError(err instanceof Error ? err.message : 'Could not read that file.')
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (editing && !isDirty) {
      setError('Change something in the package before resubmitting.')
      return
    }
    if (!product || !channel) {
      setError('Select product and channel before submitting.')
      return
    }
    if (!title.trim() || !audience.trim() || !destinationUrl.trim() || !disclosures.trim()) {
      setError('Complete all required fields before submitting.')
      return
    }
    if (!hasCreativeSubstance) {
      setError(
        visual
          ? 'Upload the creative file for this visual asset.'
          : 'Add the exact creative copy for this text-only asset.',
      )
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

    const riskTier = scoreRisk({ product, channel, claimFlags }).tier

    const payload = {
      title: title.trim(),
      product,
      channel,
      assetType,
      audience: audience.trim(),
      body: body.trim(),
      creativeImage: visual ? creativeImage : undefined,
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
              onChange={(e) => setProduct(e.target.value as Product | '')}
            >
              <option value="">Select product</option>
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
              onChange={(e) => setChannel(e.target.value as Channel | '')}
            >
              <option value="">Select channel</option>
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
              onChange={(e) => {
                const next = e.target.value as AssetType
                setAssetType(next)
                if (!isVisualAsset(next)) {
                  setCreativeImage(undefined)
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }
              }}
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

        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-navy-800">
              Creative <span className="text-danger">*</span>
            </p>
            <p className="mt-0.5 text-xs text-steel-600">
              {visual
                ? 'Visual assets require the creative file. Accompanying copy is optional.'
                : 'Text-only assets need the exact copy shown to consumers.'}
            </p>
          </div>

          {visual && (
            <div>
              <Label htmlFor="creative-file" required>
                Creative file
              </Label>
              <p className="mt-0.5 text-xs text-steel-600">
                Banner, social, or affiliate image (PNG, JPG, WebP, or GIF · under 900 KB).
              </p>
              <input
                ref={fileInputRef}
                id="creative-file"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="mt-2 block w-full text-sm text-navy-800 outline-none file:mr-3 file:cursor-pointer file:rounded-[5px] file:border-0 file:bg-steel-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-steel-800 file:hover:bg-steel-200"
                onChange={(e) => void onCreativeFile(e.target.files?.[0])}
              />
              {creativeImage ? (
                <div className="mt-3 overflow-hidden rounded-[5px] border border-mist-200 bg-canvas">
                  <img
                    src={creativeImage}
                    alt="Uploaded creative preview"
                    className="max-h-48 w-full object-contain"
                  />
                  <div className="flex items-center justify-between gap-2 border-t border-mist-200 px-3 py-2">
                    <span className="inline-flex items-center gap-1.5 text-xs text-steel-600">
                      <ImageIcon size={14} /> Ready for review
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      icon={<Trash size={14} />}
                      className="h-auto px-1.5 py-1 text-xs"
                      onClick={() => {
                        setCreativeImage(undefined)
                        if (fileInputRef.current) fileInputRef.current.value = ''
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          <div>
            <Label htmlFor="body" required={copyRequired}>
              {visual ? 'Accompanying copy (optional)' : 'Creative copy (exact)'}
            </Label>
            {visual ? (
              <p className="mt-0.5 text-xs text-steel-600">
                Add on-image or landing text if it isn’t fully readable from the file alone.
              </p>
            ) : null}
            <Textarea
              id="body"
              className="mt-1 min-h-24"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
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
          <legend className="text-sm font-medium text-navy-800">Claim types</legend>
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

        <div>
          <p className="text-sm font-medium text-navy-800">Auto-suggested risk tier</p>
          {risk ? (
            <div className="mt-1.5 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <RiskBadge tier={risk.tier} short />
                <span className="text-xs text-steel-600">
                  Score {risk.score} · Low 0–1 · Medium 2–3 · High 4+
                </span>
              </div>
              <p className="text-xs text-steel-600">
                {risk.factors.length
                  ? risk.factors.join(' · ')
                  : 'No elevated signals — stays Low until channel, product, or claim types add weight.'}
              </p>
            </div>
          ) : (
            <p className="mt-1.5 text-sm text-steel-600">
              Select product, channel, or claim types to see a suggestion.
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="notes">Intake notes (optional)</Label>
          <Textarea
            id="notes"
            className="mt-1 min-h-20"
            value={intakeNotes}
            onChange={(e) => setIntakeNotes(e.target.value)}
          />
        </div>

        <FieldError>{error}</FieldError>

        <Button
          type="submit"
          variant="approve"
          icon={<FileArrowUp size={16} />}
          className="w-full sm:w-auto"
          disabled={editing && !isDirty}
        >
          {editing ? 'Resubmit for approval' : 'Submit for compliance review'}
        </Button>
      </form>
    </div>
  )
}
