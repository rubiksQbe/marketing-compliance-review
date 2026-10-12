import { ArrowRight, ClipboardText, UserCircle } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

const cardClass =
  'group rounded-md border border-mist-200 bg-white/90 p-6 transition-[border-color,transform,box-shadow] duration-150 hover:border-steel-400 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] focus-visible:outline-none focus-visible:shadow-[0_0_0_4px_rgba(133,193,223,0.45)]'

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-10 text-center animate-in">
        <p className="font-brand text-xl text-navy-800 sm:text-2xl">ClearPath Financial</p>
        <h1 className="mt-2 font-serif text-3xl text-forest-700 sm:text-4xl">
          Marketing Compliance Review
        </h1>
      </div>

      <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-2 animate-in-delay">
        <Link to="/entry/submitter" className={cardClass}>
          <UserCircle size={28} className="text-forest-400" weight="regular" />
          <h2 className="mt-4 flex items-center gap-2 font-serif text-xl text-navy-800">
            Submitter
            <ArrowRight
              size={18}
              weight="regular"
              className="opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
              aria-hidden
            />
          </h2>
          <p className="mt-2 text-sm text-steel-600">
            Submit complete packages and track approval status on your own requests.
          </p>
        </Link>

        <Link to="/entry/reviewer" className={cardClass}>
          <ClipboardText size={28} className="text-steel-400" weight="regular" />
          <h2 className="mt-4 flex items-center gap-2 font-serif text-xl text-navy-800">
            Compliance reviewer
            <ArrowRight
              size={18}
              weight="regular"
              className="opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
              aria-hidden
            />
          </h2>
          <p className="mt-2 text-sm text-steel-600">
            Clear the risk-tiered queue and decide packages with structured findings.
          </p>
        </Link>
      </div>
    </div>
  )
}
