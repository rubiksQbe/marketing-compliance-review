import { cn } from '@/lib/cn'

/**
 * Company mark inspired by Webdings capital “P” (national park / twin-pine glyph),
 * mirrored on the vertical axis (`scaleX(-1)`), colored forest.
 * Rendered as SVG so it works where Webdings is not installed.
 */
export function BrandMark({
  className,
  size = 28,
}: {
  className?: string
  size?: number
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={cn('shrink-0 scale-x-[-1] text-forest-400', className)}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Twin pines — Webdings “P” national-park silhouette */}
      <path d="M12 3.2 7.1 11.2h2.6L5.4 18h2.5L3.2 27h17.4l-4.7-9h2.5l-4.3-6.8h2.6L12 3.2z" />
      <path d="M21.2 6.4 17.4 12.5h2.1l-3.5 5.4h2l-3.4 7.1h12.6l-3.3-7.1h2l-3.4-5.4h2.1L21.2 6.4z" />
      <rect x="10.6" y="27" width="2.6" height="2.8" rx="0.35" />
      <rect x="19.8" y="25" width="2.2" height="4.8" rx="0.35" />
    </svg>
  )
}

export function BrandWordmark({
  className,
  markSize = 28,
  textClassName,
}: {
  className?: string
  markSize?: number
  textClassName?: string
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <BrandMark size={markSize} />
      <span className={cn('font-brand text-navy-800', textClassName)}>ClearPath Financial</span>
    </span>
  )
}
