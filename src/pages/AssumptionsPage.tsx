import { KEY_ASSUMPTIONS } from '@/data/assumptions'
import { ArrowLeft } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

export function AssumptionsPage() {
  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-10 sm:px-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-xs text-steel-600 hover:text-navy-800"
      >
        <ArrowLeft size={12} /> Back to landing
      </Link>

      <h1 className="mt-4 font-serif text-2xl text-navy-800">Key decisions</h1>
      <p className="mt-1 text-sm text-steel-600">
        The choices that most shape the workbench today — disposition, risk depth, Assist,
        regulation map, and who submits. Full log:{' '}
        <code className="text-[12px]">src/data/assumptions.ts</code>.
      </p>

      <ol className="mt-6 list-none space-y-3">
        {KEY_ASSUMPTIONS.map((a) => (
          <li key={a.id} className="rounded-md border border-mist-200 bg-white/90 px-4 py-3">
            <p className="text-xs font-medium text-steel-600">{a.id}</p>
            <p className="mt-1 text-sm font-medium text-navy-800">{a.text}</p>
            <p className="mt-1 text-xs text-steel-600">{a.implication}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
