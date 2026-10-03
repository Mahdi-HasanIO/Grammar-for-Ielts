import { NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState, type ReactNode } from 'react'
import {
  BarChart3,
  BookOpen,
  Flame,
  GraduationCap,
  LayoutDashboard,
  Menu,
  RotateCcw,
  Settings,
  X,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { useProgress } from '@/hooks/useProgress'
import { useStreak } from '@/hooks/useStreak'
import { completedCount } from '@/utils/progression'
import { MODULES } from '@/data/modules'
import { ProgressBar } from '@/components/ui/ProgressBar'

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/course', label: 'Course', icon: BookOpen, end: false },
  { to: '/review', label: 'Review', icon: RotateCcw, end: false },
  { to: '/progress', label: 'Progress', icon: BarChart3, end: false },
  { to: '/settings', label: 'Settings', icon: Settings, end: false },
]

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-200'
                : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-ink-100',
            )
          }
        >
          <Icon size={18} strokeWidth={2} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

function SidebarSummary() {
  const { state } = useProgress()
  const { current } = useStreak()
  const done = completedCount(state)
  const pct = Math.round((done / MODULES.length) * 100)

  return (
    <div className="rounded-xl border border-ink-200 bg-ink-50 p-3 dark:border-ink-800 dark:bg-ink-900/60">
      <div className="flex items-center justify-between text-[12px] font-medium text-ink-600 dark:text-ink-300">
        <span>Course progress</span>
        <span className="tabular-nums">{pct}%</span>
      </div>
      <ProgressBar value={pct} className="mt-2" size="sm" />
      <div className="mt-3 flex items-center justify-between text-[12px] text-ink-500 dark:text-ink-400">
        <span className="tabular-nums">
          {done} / {MODULES.length} modules
        </span>
        <span className="inline-flex items-center gap-1 tabular-nums">
          <Flame size={13} className={current > 0 ? 'text-amber-500' : ''} />
          {current}
        </span>
      </div>
    </div>
  )
}

export function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  return (
    <div className="min-h-screen lg:flex">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-ink-200 bg-white/90 px-4 py-3 backdrop-blur lg:hidden dark:border-ink-800 dark:bg-ink-950/90">
        <div className="flex items-center gap-2">
          <GraduationCap size={20} className="text-brand-600" />
          <span className="text-sm font-semibold tracking-tight">Grammar Path</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="rounded-lg p-2 text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {open ? (
        <div className="fixed inset-x-0 top-[57px] z-20 animate-fade-up border-b border-ink-200 bg-white p-4 shadow-lift lg:hidden dark:border-ink-800 dark:bg-ink-950">
          <NavItems onNavigate={() => setOpen(false)} />
          <div className="mt-4">
            <SidebarSummary />
          </div>
        </div>
      ) : null}

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-ink-200 bg-white px-4 py-6 lg:flex lg:flex-col lg:justify-between dark:border-ink-800 dark:bg-ink-900/40">
        <div>
          <div className="mb-7 flex items-center gap-2 px-2">
            <GraduationCap size={22} className="text-brand-600" />
            <div>
              <p className="text-sm font-semibold leading-tight tracking-tight">Grammar Path</p>
              <p className="text-[11px] text-ink-500 dark:text-ink-400">IELTS Band 8+ track</p>
            </div>
          </div>
          <NavItems />
        </div>
        <SidebarSummary />
      </aside>

      <main className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10">{children}</div>
      </main>
    </div>
  )
}
