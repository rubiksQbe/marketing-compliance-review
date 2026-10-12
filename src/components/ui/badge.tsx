import { cn } from '@/lib/cn'
import type { HTMLAttributes } from 'react'

export function Badge({
  className,
  tone = 'neutral',
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: 'neutral' | 'ok' | 'warn' | 'danger'
}) {
  const tones = {
    neutral: 'bg-mist-100 text-steel-600',
    ok: 'bg-forest-50 text-forest-800',
    warn: 'bg-warn-soft text-warn',
    danger: 'bg-danger-soft text-danger',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-2 py-0.5 text-xs font-medium',
        tones[tone],
        className,
      )}
      {...props}
    />
  )
}
