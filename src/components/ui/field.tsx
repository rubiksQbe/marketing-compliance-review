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

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(control, 'pr-9', className)} {...props} />
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(control, className)} {...props} />
}

export function FieldError({ children }: { children?: string | null }) {
  if (!children) return null
  return <p className="text-sm text-danger">{children}</p>
}
