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

/** Native select arrows ignore padding; paint a custom chevron with room from the edge. */
const selectChevron =
  "appearance-none bg-[length:12px_12px] bg-[right_12px_center] bg-no-repeat pr-10 " +
  "bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 fill=%22none%22 viewBox=%220 0 12 12%22%3E%3Cpath stroke=%22%234a6d8c%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%221.5%22 d=%22m3 4.5 3 3 3-3%22/%3E%3C/svg%3E')]"

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(control, selectChevron, className)} {...props} />
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(control, className)} {...props} />
}

export function FieldError({ children }: { children?: string | null }) {
  if (!children) return null
  return <p className="text-sm text-danger">{children}</p>
}
