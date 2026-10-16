/** Compact SVG data-URL proofs for demo seeds (no binary assets in git). */

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function wrapLines(text: string, max = 42): string[] {
  const words = text.trim().split(/\s+/)
  const lines: string[] = []
  let cur = ''
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w
    if (next.length > max && cur) {
      lines.push(cur)
      cur = w
    } else {
      cur = next
    }
  }
  if (cur) lines.push(cur)
  return lines.slice(0, 3)
}

export function promoProofSvg(opts: {
  eyebrow?: string
  headline: string
  sub?: string
  cta?: string
  disclosure: string
  accent?: string
}): string {
  const accent = opts.accent ?? '#0B4F6C'
  const eyebrow = esc(opts.eyebrow ?? 'ClearPath Financial')
  const headLines = wrapLines(opts.headline, 36).map(esc)
  const sub = opts.sub ? wrapLines(opts.sub, 48).map(esc) : []
  const cta = esc(opts.cta ?? 'Learn more')
  const discLines = wrapLines(opts.disclosure, 78).map(esc)

  let y = 78
  const headTs = headLines
    .map((line) => {
      const t = `<text x="36" y="${y}" font-family="Georgia, serif" font-size="26" fill="#0A2540">${line}</text>`
      y += 32
      return t
    })
    .join('')
  const subTs = sub
    .map((line) => {
      const t = `<text x="36" y="${y}" font-family="system-ui,sans-serif" font-size="14" fill="#3D5A6C">${line}</text>`
      y += 20
      return t
    })
    .join('')
  const ctaY = Math.min(y + 28, 250)
  let dy = 318
  const discTs = discLines
    .map((line) => {
      const t = `<text x="36" y="${dy}" font-family="system-ui,sans-serif" font-size="9" fill="#5A6F7A">${line}</text>`
      dy += 12
      return t
    })
    .join('')

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#E8F2F6"/><stop offset="1" stop-color="#F7FBFC"/></linearGradient></defs>
<rect width="640" height="360" fill="url(#g)"/>
<rect x="0" y="0" width="8" height="360" fill="${accent}"/>
<text x="36" y="40" font-family="system-ui,sans-serif" font-size="12" font-weight="600" fill="${accent}">${eyebrow}</text>
${headTs}
${subTs}
<rect x="36" y="${ctaY}" width="132" height="36" rx="4" fill="${accent}"/>
<text x="102" y="${ctaY + 23}" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#fff">${cta}</text>
<rect x="0" y="300" width="640" height="60" fill="#0A2540" opacity="0.06"/>
${discTs}
</svg>`

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
