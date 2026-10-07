import { NavLink, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  BarChart3,
  BookMarked,
  BookOpen,
  Check,
  ChevronDown,
  Dumbbell,
  Flame,
  House,
  LayoutDashboard,
  Library,
  Menu,
  Monitor,
  Moon,
  Newspaper,
  RotateCcw,
  Settings,
  Sun,
  Users,
  X,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import logoWord from '@/assets/logo-wordmark.webp'
import logoWordDark from '@/assets/logo-wordmark-dark.webp'
import { useProgress } from '@/hooks/useProgress'
import { useStreak } from '@/hooks/useStreak'
import { completedCount } from '@/utils/progression'
import { contentService, useContent } from '@/services/content'
import { ProgressBar } from '@/components/ui/ProgressBar'
import type { Preferences } from '@/types'
import { DeveloperCredit } from '@/components/DeveloperInfo'
import { useVisitorCount } from '@/hooks/useVisitorCount'
import { useHydrated } from '@/hooks/useHydrated'
import { ConnectionStatus } from '@/components/ConnectionStatus'

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/course', label: 'Course', icon: BookOpen, end: false },
  { to: '/review', label: 'Review', icon: RotateCcw, end: false },
  { to: '/bookmarks', label: 'Bookmarks', icon: BookMarked, end: false },
  { to: '/progress', label: 'Progress', icon: BarChart3, end: false },
  { to: '/settings', label: 'Settings', icon: Settings, end: false },
]

/* Public pages, so learners can leave the workspace without hunting for a link. */
const EXPLORE = [
  { to: '/', label: 'Home', icon: House, end: true },
  { to: '/grammar', label: 'Grammar', icon: Library, end: false },
  { to: '/blog', label: 'Blog', icon: Newspaper, end: false },
  { to: '/practice', label: 'Practice', icon: Dumbbell, end: false },
]

const THEME_OPTIONS: { value: Preferences['theme']; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

export function Logo({ compact = false }: { compact?: boolean }) {
  const word = cn(
    'w-auto select-none transition-transform duration-300 ease-spring group-hover:scale-[1.03]',
    compact ? 'h-[22px]' : 'h-7',
  )
  return (
    <NavLink
      to="/"
      aria-label="Grammar for IELTS - home"
      className="group inline-flex flex-col items-center gap-1 rounded-lg focus-ring"
    >
      {/* Wordmark artwork: deep blue in light theme, white in dark theme. Fixed size avoids layout shift. */}
      <img src={logoWord} alt="" width={540} height={83} className={cn(word, 'dark:hidden')} draggable={false} />
      <img src={logoWordDark} alt="" width={540} height={83} className={cn(word, 'hidden dark:block')} draggable={false} />
      {/* Tagline as live text so it stays crisp and readable at small sizes. */}
      <span
        className={cn(
          'font-logo font-semibold uppercase leading-none text-[#1e3a8a] dark:text-white',
          compact ? 'pl-[0.32em] text-[10px] tracking-[0.32em]' : 'pl-[0.38em] text-[12px] tracking-[0.38em]',
        )}
      >
        for IELTS
      </span>
    </NavLink>
  )
}

function NavItems({
  onNavigate,
  items = NAV,
  label = 'Main',
}: {
  onNavigate?: () => void
  items?: typeof NAV
  label?: string
}) {
  return (
    <nav className="flex flex-col gap-1" aria-label={label}>
      {items.map(({ to, label, icon: Icon, end }, i) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          style={{ '--i': i } as React.CSSProperties}
          className={({ isActive }) =>
            cn(
              'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ease-spring focus-ring',
              isActive
                ? 'bg-white text-brand-700 shadow-card ring-1 ring-ink-200/80 dark:bg-ink-800/80 dark:text-white dark:ring-ink-700/60'
                : 'text-ink-600 hover:translate-x-0.5 hover:bg-white/70 hover:text-ink-900 dark:text-ink-400 dark:hover:bg-ink-800/50 dark:hover:text-ink-100',
            )
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={cn(
                  'absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-brand-500 to-accent-500 transition-all duration-300 ease-spring',
                  isActive ? 'opacity-100' : 'scale-y-0 opacity-0',
                )}
              />
              <Icon
                size={18}
                strokeWidth={2}
                className={cn(
                  'transition-transform duration-200 group-hover:scale-110',
                  isActive && 'text-brand-600 dark:text-brand-300',
                )}
              />
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

function SidebarSummary() {
  const moduleCount = useContent(contentService.getModules()).length
  const { state } = useProgress()
  const { current } = useStreak()
  const done = completedCount(state)
  const pct = Math.round((done / moduleCount) * 100)
  const visitors = useVisitorCount()

  return (
    <div className="rounded-2xl border border-ink-200/80 bg-white p-4 shadow-card dark:border-ink-800 dark:bg-ink-900">
      <div className="flex items-center justify-between text-[12px] font-semibold text-ink-700 dark:text-ink-200">
        <span>Course progress</span>
        <span className="tabular-nums text-brand-600 dark:text-brand-300">{pct}%</span>
      </div>
      <ProgressBar value={pct} className="mt-2.5" size="sm" />
      <div className="mt-3 flex items-center justify-between text-[12px] text-ink-500 dark:text-ink-400">
        <span className="tabular-nums">
          {done} / {moduleCount} modules
        </span>
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold tabular-nums',
            current > 0 && 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
          )}
        >
          <Flame size={13} className={current > 0 ? 'animate-sparkle text-amber-500' : ''} />
          {current}
        </span>
      </div>
      {visitors.status === 'ready' ? (
        <p className="mt-3 flex animate-fade-in items-center gap-1.5 border-t border-dashed border-ink-200 pt-3 text-[12px] text-ink-500 dark:border-ink-700 dark:text-ink-400">
          <Users size={13} className="text-emerald-500" />
          <span className="font-semibold tabular-nums text-ink-700 dark:text-ink-200">
            {visitors.count.toLocaleString()}
          </span>
          learners visited
        </p>
      ) : null}
    </div>
  )
}

/** Small dropdown for switching theme without leaving the page. */
export function ThemeMenu({ align = 'right' }: { align?: 'left' | 'right' }) {
  const { preferences, setPreferences } = useProgress()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  // Prerendered pages show the default until hydration, then the saved preference.
  const hydrated = useHydrated()
  const active = (hydrated && THEME_OPTIONS.find((t) => t.value === preferences.theme)) || THEME_OPTIONS[2]

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Theme: ${active.label}`}
        className="inline-flex h-9 items-center gap-1.5 rounded-xl px-2.5 text-[13px] font-semibold text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900 focus-ring dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-ink-50"
      >
        <active.icon size={16} />
        <ChevronDown
          size={13}
          className={cn('transition-transform duration-200', open && 'rotate-180')}
        />
      </button>
      {open ? (
        <div
          role="menu"
          className={cn(
            'absolute top-full z-50 mt-2 w-40 origin-top animate-fade-down rounded-xl border border-ink-200 bg-white p-1 shadow-lift dark:border-ink-700 dark:bg-ink-900',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              role="menuitemradio"
              aria-checked={preferences.theme === value}
              onClick={() => {
                setPreferences({ theme: value })
                setOpen(false)
              }}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors',
                preferences.theme === value
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/70 dark:text-brand-200'
                  : 'text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800',
              )}
            >
              <Icon size={15} />
              {label}
              {preferences.theme === value ? <Check size={14} className="ml-auto" /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    if (!location.hash) return
    // Deep links such as /settings#ai: wait for the page to paint, then scroll to the target.
    const timer = window.setTimeout(() => {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 350)
    return () => window.clearTimeout(timer)
  }, [location.pathname, location.hash])

  // Lock background scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="min-h-screen">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-ink-200/70 bg-white/75 px-4 py-2.5 backdrop-blur-xl lg:hidden dark:border-ink-800/70 dark:bg-ink-950/75">
        <Logo compact />
        <div className="flex items-center gap-1">
          <ConnectionStatus />
          <ThemeMenu />
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="rounded-xl p-2 text-ink-600 transition-colors hover:bg-ink-100 focus-ring dark:text-ink-300 dark:hover:bg-ink-800"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Mobile drawer: stays mounted so it can animate both in and out. */}
      <div
        className={cn('fixed inset-0 z-40 lg:hidden', open ? 'pointer-events-auto' : 'pointer-events-none')}
        aria-hidden={!open}
        inert={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={cn(
            'absolute inset-0 bg-ink-950/40 backdrop-blur-sm transition-opacity duration-300',
            open ? 'opacity-100' : 'opacity-0',
          )}
        />
        <aside
          className={cn(
            'safe-bottom absolute inset-y-0 left-0 flex w-[84%] max-w-xs flex-col justify-between gap-6 overflow-y-auto bg-ink-50 px-4 py-5 shadow-2xl transition-transform duration-300 ease-spring dark:bg-ink-950',
            open ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div>
            <div className="mb-7 flex items-center justify-between px-1">
              <Logo />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="rounded-xl p-2 text-ink-500 transition-colors hover:bg-ink-200/60 focus-ring dark:hover:bg-ink-800"
              >
                <X size={18} />
              </button>
            </div>
            <NavItems onNavigate={() => setOpen(false)} />
            <p className="label-xs mb-2 mt-6 px-3">Explore</p>
            <NavItems onNavigate={() => setOpen(false)} items={EXPLORE} label="Explore" />
          </div>
          <div>
            <ConnectionStatus className="mb-2" />
            <SidebarSummary />
            <DeveloperCredit />
          </div>
        </aside>
      </div>

      {/* Desktop sidebar */}
      <aside className="no-scrollbar fixed inset-y-0 left-0 z-20 hidden w-72 flex-col justify-between gap-6 overflow-y-auto border-r border-ink-200/70 bg-ink-50/80 px-5 py-6 backdrop-blur-xl lg:flex dark:border-ink-800/70 dark:bg-ink-950/60">
        <div>
          <div className="mb-8 flex items-center justify-between px-1">
            <Logo />
            <ThemeMenu />
          </div>
          <p className="label-xs mb-2 px-3">Menu</p>
          <NavItems />
          <p className="label-xs mb-2 mt-6 px-3">Explore</p>
          <NavItems items={EXPLORE} label="Explore" />
        </div>
        <div>
          <ConnectionStatus className="mb-2" />
          <SidebarSummary />
          <DeveloperCredit />
        </div>
      </aside>

      <main className="min-w-0 lg:pl-72">
        <div
          key={location.pathname}
          className="mx-auto w-full max-w-5xl animate-fade-up px-4 pb-16 pt-6 sm:px-6 sm:pt-8 lg:px-10 lg:pt-10"
        >
          {children}
        </div>
      </main>
    </div>
  )
}
