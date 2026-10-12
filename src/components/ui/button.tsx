import { cn } from '@/lib/cn'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'approve' | 'decline' | 'ghost' | 'loading'

const variants: Record<Variant, string> = {
  primary:
    'bg-steel-400 text-white hover:bg-navy-800 focus-visible:shadow-[0_0_0_4px_rgba(133,193,223,0.45)]',
  approve:
    'bg-forest-400 text-white hover:bg-forest-600 focus-visible:shadow-[0_0_0_4px_rgba(130,201,172,0.4)]',
  decline:
    'bg-danger text-white hover:bg-[#7f2424] focus-visible:shadow-[0_0_0_4px_rgba(155,44,44,0.28)]',
  ghost:
    'bg-transparent text-navy-800 hover:bg-navy-800/5 focus-visible:shadow-[0_0_0_4px_rgba(133,193,223,0.35)]',
  loading: 'bg-mist-200 text-navy-800 cursor-wait',
}

export function Button({
  className,
  variant = 'primary',
  icon,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  icon?: ReactNode
}) {
  if (variant === 'ghost' && !icon) {
    console.warn('Ghost buttons must include an icon (ClearPath branding).')
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[5px] px-3.5 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none',
        variants[variant],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}
