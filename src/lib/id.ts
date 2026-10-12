export function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}

export function nextRequestId(existing: string[]): string {
  const nums = existing
    .map((id) => Number(id.replace(/^CP-/, '')))
    .filter((n) => Number.isFinite(n))
  const next = (nums.length ? Math.max(...nums) : 1000) + 1
  return `CP-${next}`
}
