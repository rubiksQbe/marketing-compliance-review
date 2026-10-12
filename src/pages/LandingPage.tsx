import { ArrowRight, ClipboardText, FileArrowUp } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

const cardClass =
  'group rounded-md border border-mist-200 bg-white/90 p-6 transition-colors hover:border-steel-400 focus-visible:outline-none focus-visible:shadow-[0_0_0_4px_rgba(133,193,223,0.45)]'

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-10 text-center animate-in">
        <p className="font-brand text-lg font-medium tracking-tight text-forest-500 whitespace-nowrap sm:text-xl">
          ClearPath Financial
        </p>
        <h1 className="mt-1.5 font-serif text-3xl text-navy-800 sm:text-4xl">
          Marketing Compliance Review
        </h1>
      </div>

      <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-2 animate-in-delay">
        <Link to="/entry/submitter" className={cardClass}>
          <FileArrowUp size={28} className="text-forest-400" weight="regular" />
          <h2 className="mt-4 flex items-center gap-2 font-serif text-2xl text-navy-800">
            Submit
            <ArrowRight
              size={18}
              weight="regular"
              className="opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
              aria-hidden
            />
          </h2>
          <p className="mt-2 text-sm text-steel-600">
            For internal marketers and affiliate managers. Send promotional materials for review and
            track approval status.
          </p>
        </Link>

        <Link to="/entry/reviewer" className={cardClass}>
          <ClipboardText size={28} className="text-steel-400" weight="regular" />
          <h2 className="mt-4 flex items-center gap-2 font-serif text-2xl text-navy-800">
            Review
            <ArrowRight
              size={18}
              weight="regular"
              className="opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
              aria-hidden
            />
          </h2>
          <p className="mt-2 text-sm text-steel-600">
            For compliance marketing team. Approve or decline promotional materials and enforce
            regulations.
          </p>
        </Link>
      </div>

      <p className="mt-10 animate-in-delay text-center">
        <Link
          to="/assumptions"
          className="text-[11px] text-steel-600/80 underline-offset-2 hover:text-steel-600 hover:underline"
        >
          Demo notes · key assumptions
        </Link>
      </p>
    </div>
  )
}
