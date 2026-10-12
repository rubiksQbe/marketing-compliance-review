import { Button } from '@/components/ui/button'
import { KIND_LABELS } from '@/lib/labels'
import { useStore } from '@/lib/store'
import { SignOut } from '@phosphor-icons/react'
import { Link, Outlet, useNavigate } from 'react-router-dom'

export function AppShell() {
  const { session, setSession } = useStore()
  const navigate = useNavigate()

  if (!session) {
    return <Outlet />
  }

  const home = session.role === 'reviewer' ? '/queue' : '/mine'

  return (
    <div className="min-h-screen">
      <header className="border-b border-mist-200/80 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link to={home} className="min-w-0">
            <p className="font-brand text-base font-medium tracking-tight text-forest-500 whitespace-nowrap sm:text-lg">
              ClearPath Financial
            </p>
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-right text-xs leading-snug">
              <p className="font-medium text-navy-800">{session.name}</p>
              <p className="text-steel-600">{KIND_LABELS[session.kind]}</p>
            </div>
            <Button
              variant="ghost"
              icon={<SignOut size={16} weight="regular" />}
              onClick={() => {
                setSession(null)
                navigate('/')
              }}
            >
              Log out
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  )
}
