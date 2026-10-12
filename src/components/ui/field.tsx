import { cn } from '@/lib/cn'
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

export function Label({
  children,
  htmlFor,
  required,
}: {
  children: string
  htmlFor?: string
  required?: boolean
}) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-navy-800">
      {children}
      {required ? <span className="text-danger"> *</span> : null}
    </label>
  )
}

const control =
  'w-full rounded-[5px] border border-mist-200 bg-white px-3 py-2 text-sm text-navy-800 outline-none focus-visible:shadow-[0_0_0_4px_rgba(133,193,223,0.35)] focus-visible:border-steel-400'

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(control, className)} {...props} />
}

/** Native select arrows ignore padding; paint a custom chevron inset from the edge. */
const SELECT_CHEVRON = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 12 12"><path stroke="#4a6d8c" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m3 4.5 3 3 3-3"/></svg>',
)}")`

export function Select({ className, style, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(control, 'appearance-none pr-10', className)}
      style={{
        ...style,
        backgroundImage: SELECT_CHEVRON,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
        backgroundSize: '12px 12px',
      }}
      {...props}
    />
  )
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(control, className)} {...props} />
}

export function FieldError({ children }: { children?: string | null }) {
  if (!children) return null
  return <p className="text-sm text-danger">{children}</p>
}
