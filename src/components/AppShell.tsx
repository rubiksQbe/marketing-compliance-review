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
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-2.5 sm:gap-3 sm:px-6 sm:py-3">
          <Link to={home} className="min-w-0 truncate">
            <p className="font-brand text-sm font-medium tracking-tight text-forest-500 whitespace-nowrap sm:text-lg">
              ClearPath Financial
            </p>
          </Link>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <div className="hidden text-right text-xs leading-snug sm:block">
              <p className="font-medium text-navy-800">{session.name}</p>
              <p className="text-steel-600">{KIND_LABELS[session.kind]}</p>
            </div>
            <Button
              variant="ghost"
              icon={<SignOut size={18} weight="regular" />}
              aria-label="Log out"
              title="Log out"
              className="px-2 sm:px-3.5"
              onClick={() => {
                setSession(null)
                navigate('/')
              }}
            >
              <span className="hidden sm:inline">Log out</span>
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
