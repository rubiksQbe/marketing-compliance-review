import { KIND_LABELS } from '@/lib/labels'
import { useStore } from '@/lib/store'
import { DEMO_IDENTITIES, type SessionRole } from '@/lib/types'
import { User } from '@phosphor-icons/react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

export function IdentityPage() {
  const { role } = useParams<{ role: string }>()
  const navigate = useNavigate()
  const { setSession } = useStore()

  if (role !== 'reviewer' && role !== 'submitter') {
    return <Navigate to="/" replace />
  }

  const sessionRole = role as SessionRole
  const options = DEMO_IDENTITIES.filter((d) => d.role === sessionRole)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 max-w-lg text-center animate-in">
        <p className="font-brand text-sm text-steel-600">ClearPath Financial</p>
        <h1 className="mt-1 font-serif text-2xl text-navy-800">
          {sessionRole === 'reviewer' ? 'Enter as reviewer' : 'Who is submitting?'}
        </h1>
        <p className="mt-2 text-sm text-steel-600">
          Demo identity stands in for SSO. Your home and visibility follow this person.
        </p>
      </div>

      <div className="flex w-full max-w-md flex-col gap-3 animate-in-delay">
        {options.map((identity) => (
          <button
            key={identity.name}
            type="button"
            className="flex items-center gap-3 rounded-md border border-mist-200 bg-white/90 px-4 py-3 text-left transition-colors hover:border-steel-400 focus-visible:outline-none focus-visible:shadow-[0_0_0_4px_rgba(133,193,223,0.45)]"
            onClick={() => {
              setSession(identity)
              navigate(identity.role === 'reviewer' ? '/queue' : '/mine')
            }}
          >
            <User size={22} className="shrink-0 text-steel-400" weight="regular" />
            <span>
              <span className="block font-medium text-navy-800">{identity.name}</span>
              <span className="block text-xs text-steel-600">{KIND_LABELS[identity.kind]}</span>
            </span>
          </button>
        ))}
        <button
          type="button"
          className="mt-2 text-sm font-medium text-steel-600 hover:text-navy-800"
          onClick={() => navigate('/')}
        >
          ← Back to roles
        </button>
      </div>
    </div>
  )
}
