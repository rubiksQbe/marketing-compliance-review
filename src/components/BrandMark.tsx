import { cn } from '@/lib/cn'
import { useId } from 'react'

/**
 * ClearPath park-sign mark (tree + winding path), forest via currentColor.
 * Path cutout uses a mask so it reads on mesh/canvas backgrounds.
 */
export function BrandMark({
  className,
  size = 28,
}: {
  className?: string
  size?: number
}) {
  const maskId = useId()
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={cn('shrink-0 text-forest-400', className)}
      aria-hidden
    >
      <defs>
        <mask id={maskId}>
          <rect width="32" height="32" fill="white" />
          <path
            d="M 30,16
               C 24,14 20,24 14,24
               C 10,24 8,19 2,19
               L 2,25
               L 30,25
               Z"
            fill="black"
          />
        </mask>
      </defs>

      <g fill="currentColor" mask={`url(#${maskId})`}>
        <rect x="2" y="10" width="28" height="15" />
        <rect x="15" y="6" width="2" height="5" />
        <polygon points="11,11 21,11 16,7" />
        <polygon points="12,8 20,8 16,5" />
        <polygon points="13,5 19,5 16,2" />
      </g>
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
