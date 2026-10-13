import { isVisualAsset } from './labels'
import type { AssetType } from './types'

export type CreativePacketCopy = {
  sectionHint: string
  fileLabel: string
  fileHelp: string
  bodyLabel: string
  bodyHelp: string
}

export function creativePacketCopy(assetType: AssetType): CreativePacketCopy {
  if (isVisualAsset(assetType)) {
    return {
      sectionHint:
        'Visual packets need the creative file and accompanying copy (caption, CTA, alt text) — not file-only.',
      fileLabel: 'Creative file',
      fileHelp: 'Banner, social, or affiliate image (PNG, JPG, WebP, or GIF · under 900 KB).',
      bodyLabel: 'Accompanying copy',
      bodyHelp: 'Caption, CTA, and alt text as shown to consumers. Required even when text appears in the image.',
    }
  }
  if (assetType === 'email') {
    return {
      sectionHint:
        'Email review needs a screenshot or HTML render plus the exact copy — not a plain text box alone.',
      fileLabel: 'Email screenshot or HTML render',
      fileHelp: 'Upload a PNG, JPG, WebP, or GIF of the rendered email (under 900 KB).',
      bodyLabel: 'Exact email copy',
      bodyHelp: 'Paste the exact consumer-facing email text, including subject line if claimed.',
    }
  }
  return {
    sectionHint:
      'Landing review needs the destination URL, a page capture, and exact on-page copy — not paste-only.',
    fileLabel: 'Page capture',
    fileHelp: 'Upload a PNG, JPG, WebP, or GIF screenshot of the landing page (under 900 KB).',
    bodyLabel: 'Exact on-page copy',
    bodyHelp: 'Paste the exact headline and body copy as shown on the page.',
  }
}

export function missingCreativeErrors(input: {
  assetType: AssetType
  creativeImage?: string
  body: string
}): string[] {
  const copy = creativePacketCopy(input.assetType)
  const errors: string[] = []
  if (!input.creativeImage) {
    errors.push(`Upload the ${copy.fileLabel.toLowerCase()}.`)
  }
  if (!input.body.trim()) {
    errors.push(`Add the ${copy.bodyLabel.toLowerCase()}.`)
  }
  return errors
}
