import { Button } from '@/components/ui/button'
import { Archive, X } from '@phosphor-icons/react'
import { useEffect } from 'react'

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
}: {
  open: boolean
  title: string
  body?: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/35 px-4"
      role="presentation"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby={body ? 'confirm-body' : undefined}
        className="w-full max-w-sm rounded-md border border-mist-200 bg-white p-5 shadow-[0_8px_28px_rgba(18,40,63,0.16)] animate-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 id="confirm-title" className="font-serif text-lg text-navy-800">
            {title}
          </h2>
          <Button
            variant="ghost"
            icon={<X size={16} />}
            className="px-1 py-1"
            aria-label="Close"
            onClick={onCancel}
          />
        </div>
        {body ? (
          <p id="confirm-body" className="mt-2 text-sm text-steel-600">
            {body}
          </p>
        ) : null}
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" icon={<X size={14} />} onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="decline" icon={<Archive size={14} />} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
