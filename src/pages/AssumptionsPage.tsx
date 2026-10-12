import { ASSUMPTIONS } from '@/data/assumptions'
import { Navigate } from 'react-router-dom'
import { useStore } from '@/lib/store'

export function AssumptionsPage() {
  const { session } = useStore()
  if (!session) return <Navigate to="/" replace />

  return (
    <div className="animate-in">
      <h1 className="font-serif text-2xl text-navy-800">Assumptions</h1>
      <p className="mt-1 max-w-2xl text-sm text-steel-600">
        Product and operating assumptions behind this marketing compliance review tool — kept visible so demos stay honest.
      </p>
      <ul className="mt-6 space-y-3">
        {ASSUMPTIONS.map((a) => (
          <li key={a.id} className="rounded-md border border-mist-200 bg-white/90 px-4 py-3">
            <p className="text-xs font-medium text-steel-600">{a.id}</p>
            <p className="mt-1 text-sm font-medium text-navy-800">{a.text}</p>
            <p className="mt-1 text-xs text-steel-600">{a.implication}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
