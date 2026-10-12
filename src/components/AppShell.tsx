import { BrandWordmark } from '@/components/BrandMark'
import { Button } from '@/components/ui/button'
import { KIND_LABELS } from '@/lib/labels'
import { useStore } from '@/lib/store'
import { SignOut, Trash } from '@phosphor-icons/react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

export function AppShell() {
  const { session, setSession, resetDemo } = useStore()
  const navigate = useNavigate()

  if (!session) {
    return <Outlet />
  }

  const home = session.role === 'reviewer' ? '/queue' : '/mine'

  return (
    <div className="min-h-screen">
      <header className="border-b border-mist-200/80 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <BrandWordmark markSize={22} textClassName="text-sm" />
            <p className="font-serif text-lg text-navy-800 leading-tight pl-[30px]">
              ClearPath Review
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-1 text-sm">
            <NavLink
              to={home}
              className={({ isActive }) =>
                `rounded-[5px] px-2.5 py-1.5 font-medium ${isActive ? 'bg-mist-100 text-navy-800' : 'text-steel-600 hover:bg-navy-800/5'}`
              }
            >
              {session.role === 'reviewer' ? 'Queue' : 'Your requests'}
            </NavLink>
            {session.role === 'submitter' && (
              <NavLink
                to="/submit"
                className={({ isActive }) =>
                  `rounded-[5px] px-2.5 py-1.5 font-medium ${isActive ? 'bg-mist-100 text-navy-800' : 'text-steel-600 hover:bg-navy-800/5'}`
                }
              >
                Submit
              </NavLink>
            )}
            <NavLink
              to="/assumptions"
              className={({ isActive }) =>
                `rounded-[5px] px-2.5 py-1.5 font-medium ${isActive ? 'bg-mist-100 text-navy-800' : 'text-steel-600 hover:bg-navy-800/5'}`
              }
            >
              Assumptions
            </NavLink>
          </nav>
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
              Switch
            </Button>
            <Button
              variant="ghost"
              icon={<Trash size={16} weight="regular" />}
              onClick={() => {
                resetDemo()
              }}
              title="Reset demo data"
            >
              Reset
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
