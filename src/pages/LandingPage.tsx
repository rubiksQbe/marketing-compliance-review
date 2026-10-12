import { ClipboardText, UserCircle } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-10 text-center animate-in">
        <p className="font-brand text-xl text-navy-800 sm:text-2xl">ClearPath Financial</p>
        <h1 className="mt-2 font-serif text-3xl text-navy-800 sm:text-4xl">ClearPath Review</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-steel-600">
          Compliance marketing review — structured intake, risk-tiered queue, one-screen decisions.
        </p>
      </div>

      <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-2 animate-in-delay">
        <Link
          to="/entry/reviewer"
          className="group rounded-md border border-mist-200 bg-white/90 p-6 transition-colors hover:border-steel-400 focus-visible:outline-none focus-visible:shadow-[0_0_0_4px_rgba(133,193,223,0.45)]"
        >
          <ClipboardText size={28} className="text-steel-400" weight="regular" />
          <h2 className="mt-4 font-serif text-xl text-navy-800">Compliance reviewer</h2>
          <p className="mt-2 text-sm text-steel-600">
            Open the org-wide risk-tiered queue and dispose packages.
          </p>
          <span className="mt-4 inline-block text-sm font-medium text-navy-800 group-hover:text-steel-600">
            Continue →
          </span>
        </Link>

        <Link
          to="/entry/submitter"
          className="group rounded-md border border-mist-200 bg-white/90 p-6 transition-colors hover:border-steel-400 focus-visible:outline-none focus-visible:shadow-[0_0_0_4px_rgba(133,193,223,0.45)]"
        >
          <UserCircle size={28} className="text-forest-400" weight="regular" />
          <h2 className="mt-4 font-serif text-xl text-navy-800">Submitter</h2>
          <p className="mt-2 text-sm text-steel-600">
            Internal marketers and affiliate managers — submit packets and track your own requests.
          </p>
          <span className="mt-4 inline-block text-sm font-medium text-navy-800 group-hover:text-steel-600">
            Continue →
          </span>
        </Link>
      </div>
    </div>
  )
}
