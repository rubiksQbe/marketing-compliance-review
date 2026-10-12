import type { ReviewRequest } from './types'

export function hoursRemaining(
  submittedAt: string,
  slaHours: number,
  now = Date.now(),
): number {
  const deadline = new Date(submittedAt).getTime() + slaHours * 60 * 60 * 1000
  return (deadline - now) / (60 * 60 * 1000)
}

export function remainingFor(req: ReviewRequest, now = Date.now()): number {
  return hoursRemaining(req.submittedAt, req.slaHours, now)
}

export function formatSla(req: ReviewRequest, now = Date.now()): string {
  const remaining = remainingFor(req, now)
  if (remaining < 0) return `${Math.abs(remaining).toFixed(1)}h overdue`
  return `${remaining.toFixed(1)}h`
}

export function formatSlaLong(req: ReviewRequest, now = Date.now()): string {
  const remaining = remainingFor(req, now)
  if (remaining < 0) return `${Math.abs(remaining).toFixed(1)}h overdue`
  return `${remaining.toFixed(1)}h left`
}

export function formatWhen(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
