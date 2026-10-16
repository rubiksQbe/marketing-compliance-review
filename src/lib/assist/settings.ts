const KEY = 'clearpath-review.assist.apiKey.v1'

export function getAssistApiKey(): string | null {
  try {
    const raw = localStorage.getItem(KEY)
    const trimmed = raw?.trim()
    return trimmed ? trimmed : null
  } catch {
    return null
  }
}

export function setAssistApiKey(key: string | null): void {
  if (!key || !key.trim()) {
    localStorage.removeItem(KEY)
    return
  }
  localStorage.setItem(KEY, key.trim())
}
