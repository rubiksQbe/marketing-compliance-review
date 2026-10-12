import { SEED_REQUESTS } from '@/data/seed'
import type { ReviewRequest, SessionIdentity } from './types'

/** Bump when seed shape/content must replace stale localStorage demos. */
const REQUESTS_KEY = 'clearpath-review.requests.v4'
const SESSION_KEY = 'clearpath-review.session.v2'

export function loadRequests(): ReviewRequest[] {
  try {
    const raw = localStorage.getItem(REQUESTS_KEY)
    if (!raw) return structuredClone(SEED_REQUESTS)
    const parsed = JSON.parse(raw) as ReviewRequest[]
    if (!Array.isArray(parsed) || parsed.length === 0) return structuredClone(SEED_REQUESTS)
    return parsed
  } catch {
    return structuredClone(SEED_REQUESTS)
  }
}

export function saveRequests(requests: ReviewRequest[]): void {
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests))
}

export function resetRequests(): ReviewRequest[] {
  const seed = structuredClone(SEED_REQUESTS)
  saveRequests(seed)
  return seed
}

export function loadSession(): SessionIdentity | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as SessionIdentity
  } catch {
    return null
  }
}

export function saveSession(session: SessionIdentity | null): void {
  if (!session) {
    localStorage.removeItem(SESSION_KEY)
    return
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}
