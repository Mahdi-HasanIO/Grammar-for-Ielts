import { Suspense, useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { ArrowRight, Menu, X } from 'lucide-react'
import { Logo, ThemeMenu } from '@/components/Layout'
import { DeveloperCredit } from '@/components/DeveloperInfo'
import { buttonClasses } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { useCourseCta } from '@/hooks/useCourseCta'
import { cn } from '@/utils/cn'
import { BLOG_CATEGORIES } from '@/data/blog/posts'
import { detectLowPowerDevice } from './motion'

const PUBLIC_NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/grammar', label: 'Grammar', end: false },
  { to: '/course', label: 'Course', end: false },
  { to: '/blog', label: 'Blog', end: false },
  { to: '/practice', label: 'Practice', end: false },
  { to: '/dashboard', label: 'Dashboard', end: false },
]

function HeaderLink({ to, label, end, onClick }: { to: string; label: string; end: boolean; onClick?: () => void }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'group relative rounded-lg px-3 py-2 text-[14px] font-semibold transition-colors duration-200 focus-ring',
          isActive
            ? 'text-ink-900 dark:text-white'
            : 'text-ink-600 hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-100',
        )
      }
    >
      {({ isActive }) => (
        <>
          {label}
          <span
            className={cn(
              'absolute inset-x-3 -bottom-0.5 h-0.5 origin-left rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-transform duration-300 ease-spring',
              isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
            )}
          />
        </>
      )}
    </NavLink>
  )
}

function PublicHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const cta = useCourseCta()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location.pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-[background-color,border-color,box-shadow] duration-300',
        scrolled || open
          ? 'border-b border-ink-200/70 bg-white/80 shadow-[0_8px_30px_-20px_rgba(15,23,42,0.25)] backdrop-blur-xl dark:border-ink-800/70 dark:bg-ink-950/80'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo compact />

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
          {PUBLIC_NAV.map((item) => (
            <HeaderLink key={item.to} {...item} />
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeMenu />
          <Link
            to={cta.to}
            className={buttonClasses({ size: 'sm', className: 'group hidden sm:inline-flex' })}
          >
            {cta.label}
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="public-mobile-nav"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-ink-600 transition-colors hover:bg-ink-100 focus-ring lg:hidden dark:text-ink-300 dark:hover:bg-ink-800"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu: grid-rows trick animates height without measuring. */}
      <div
        id="public-mobile-nav"
        className={cn(
          'grid transition-[grid-template-rows,opacity] duration-300 ease-spring lg:hidden',
          open ? 'grid-rows-[1fr] opacity-100' : 'pointer-events-none grid-rows-[0fr] opacity-0',
        )}
        inert={!open}
      >
        <div className="overflow-hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 pb-4 pt-1 sm:px-6" aria-label="Mobile">
            {PUBLIC_NAV.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex min-h-[44px] items-center rounded-xl px-3 text-[15px] font-semibold transition-colors focus-ring',
                    isActive
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-200'
                      : 'text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800',
                  )
                }
              >
                {label}
              </NavLink>
            ))}
            <Link to={cta.to} className={buttonClasses({ className: 'mt-2 w-full' })}>
              {cta.label}
              <ArrowRight size={15} />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="label-xs mb-3">{title}</h2>
      <ul className="space-y-2 text-[14px]">{children}</ul>
    </div>
  )
}

function FooterLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <li>
      <Link
        to={to}
        className="rounded text-ink-600 transition-colors hover:text-brand-700 focus-ring dark:text-ink-400 dark:hover:text-brand-300"
      >
        {children}
      </Link>
    </li>
  )
}

function PublicFooter() {
  return (
    <footer className="relative mt-24 border-t border-ink-200/70 bg-white/60 backdrop-blur-sm dark:border-ink-800/70 dark:bg-ink-950/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-[14px] leading-6 text-ink-600 dark:text-ink-400">
            A structured grammar course for IELTS Writing Band 7-8+, with every lesson in English
            and বাংলা.
          </p>
        </div>
        <FooterColumn title="Learn">
          <FooterLink to="/course">Course</FooterLink>
          <FooterLink to="/grammar">Grammar topics</FooterLink>
          <FooterLink to="/practice">Practice</FooterLink>
          <FooterLink to="/dashboard">Dashboard</FooterLink>
        </FooterColumn>
        <FooterColumn title="Read">
          <FooterLink to="/blog">All articles</FooterLink>
          {BLOG_CATEGORIES.slice(0, 3).map((c) => (
            <FooterLink key={c} to={`/blog?category=${encodeURIComponent(c)}`}>
              {c}
            </FooterLink>
          ))}
        </FooterColumn>
        <FooterColumn title="Your account">
          <FooterLink to="/progress">Progress</FooterLink>
          <FooterLink to="/review">Review</FooterLink>
          <FooterLink to="/settings">Settings</FooterLink>
        </FooterColumn>
      </div>
      <div className="border-t border-ink-200/70 dark:border-ink-800/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-[12.5px] text-ink-500 sm:flex-row sm:px-6 lg:px-8 dark:text-ink-400">
          <p>© {new Date().getFullYear()} Grammar for IELTS. Progress is saved in your browser.</p>
          <div className="[&>a]:mt-0">
            <DeveloperCredit />
          </div>
        </div>
      </div>
    </footer>
  )
}

function PublicFallback() {
  return (
    // Full viewport height keeps the footer below the fold, so it does not jump when the page arrives.
    <div className="mx-auto min-h-screen max-w-6xl space-y-5 px-4 py-12 sm:px-6 lg:px-8" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-3 w-24 rounded-full" />
      <Skeleton className="h-10 w-96 max-w-full rounded-xl" />
      <Skeleton className="h-4 w-full max-w-xl" />
      <div className="grid gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-44 rounded-2xl" />
        <Skeleton className="h-44 rounded-2xl" />
        <Skeleton className="h-44 rounded-2xl" />
      </div>
    </div>
  )
}

/** Shell for the public website: top navigation, footer and route transitions. */
export function PublicLayout() {
  const location = useLocation()

  useEffect(() => {
    if (detectLowPowerDevice()) document.documentElement.dataset.motion = 'reduced'
  }, [])

  useEffect(() => {
    if (location.hash) {
      // Deep links such as /grammar/articles#practice: wait for the lazy page to paint.
      const timer = window.setTimeout(() => {
        document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 400)
      return () => window.clearTimeout(timer)
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [location.pathname, location.hash])

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <a
        href="#main"
        className="sr-only left-4 top-3 z-50 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-brand-700 shadow-lift focus:not-sr-only focus:fixed dark:bg-ink-900 dark:text-brand-200"
      >
        Skip to content
      </a>
      <PublicHeader />
      <main id="main" className="flex-1">
        <Suspense fallback={<PublicFallback />}>
          <div key={location.pathname} className="page-enter">
            <Outlet />
          </div>
        </Suspense>
      </main>
      <PublicFooter />
    </div>
  )
}
