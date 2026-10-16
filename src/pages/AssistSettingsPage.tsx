import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/field'
import { getAssistApiKey, setAssistApiKey } from '@/lib/assist/settings'
import { useStore } from '@/lib/store'
import { ArrowLeft } from '@phosphor-icons/react'
import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'

export function AssistSettingsPage() {
  const { session } = useStore()
  const [key, setKey] = useState(() => getAssistApiKey() ?? '')
  const [saved, setSaved] = useState(false)

  if (!session) return <Navigate to="/" replace />
  if (session.role !== 'reviewer') return <Navigate to="/mine" replace />

  return (
    <div className="mx-auto max-w-lg animate-in">
      <Link
        to="/queue"
        className="inline-flex items-center gap-1 text-xs text-steel-600 hover:text-navy-800"
      >
        <ArrowLeft size={12} /> Back to queue
      </Link>
      <h1 className="mt-4 font-serif text-2xl text-navy-800">Assist settings</h1>
      <p className="mt-2 text-sm text-steel-600">
        Assist always runs desk-style triage (summary, findings, creative callouts) via heuristic
        fallback. An optional OpenAI key upgrades wording and vision/OCR on proof images for local
        trials. Production should call <code className="text-[12px]">POST /api/assist</code> with
        server-side credentials — browser keys stay in this browser’s localStorage only.
      </p>

      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          setAssistApiKey(key.trim() || null)
          setSaved(true)
        }}
      >
        <div>
          <Label htmlFor="assist-key">OpenAI API key (optional)</Label>
          <Input
            id="assist-key"
            className="mt-1"
            type="password"
            autoComplete="off"
            value={key}
            onChange={(e) => {
              setKey(e.target.value)
              setSaved(false)
            }}
            placeholder="sk-…"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="submit" variant="primary">
            Save key
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setKey('')
              setAssistApiKey(null)
              setSaved(true)
            }}
          >
            Clear key
          </Button>
        </div>
        {saved && <p className="text-xs text-forest-700">Saved for this browser.</p>}
      </form>

      <p className="mt-6 text-xs text-steel-600">
        Resolution order: API proxy → local key → heuristic fallback. See{' '}
        <code className="text-[11px]">docs/api/assist.md</code>.
      </p>
    </div>
  )
}
