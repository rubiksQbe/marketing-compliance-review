import { REGULATION_MAP } from '@/data/regulationMap'
import { REASON_LABELS } from '@/lib/labels'
import type { ReasonCode } from '@/lib/types'
import { X } from '@phosphor-icons/react'
import { useEffect } from 'react'

export function RegulationMapDrawer({
  open,
  onClose,
  codes,
}: {
  open: boolean
  onClose: () => void
  codes: ReasonCode[]
}) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const unique = [...new Set(codes)]

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Regulation map">
      <button
        type="button"
        className="absolute inset-0 bg-navy-900/30"
        aria-label="Close regulation map"
        onClick={onClose}
      />
      <aside className="relative flex h-full w-full max-w-md flex-col border-l border-mist-200 bg-white shadow-[-12px_0_32px_rgba(26,58,92,0.12)] animate-in">
        <header className="flex items-center justify-between border-b border-mist-200 px-4 py-3">
          <h2 className="font-serif text-lg text-navy-800">Regulation map</h2>
          <button
            type="button"
            className="rounded-[5px] p-1.5 text-steel-600 hover:bg-mist-100 hover:text-navy-800"
            aria-label="Close"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {unique.length === 0 ? (
            <p className="text-sm text-steel-600">No compliance issues in scope for this packet.</p>
          ) : (
            <ul className="space-y-4">
              {unique.map((code) => {
                const entry = REGULATION_MAP[code]
                return (
                  <li key={code} className="border-b border-mist-100 pb-4 last:border-0">
                    <p className="text-sm font-medium text-navy-800">{REASON_LABELS[code]}</p>
                    <p className="mt-1 text-xs font-medium text-steel-600">{entry.regimes.join(' · ')}</p>
                    <p className="mt-2 text-xs leading-snug text-steel-600">{entry.note}</p>
                    <ul className="mt-2 space-y-1.5">
                      {entry.sources.map((src) => (
                        <li key={src.url}>
                          <a
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-medium text-steel-700 underline underline-offset-2 hover:text-navy-800"
                          >
                            {src.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </aside>
    </div>
  )
}
