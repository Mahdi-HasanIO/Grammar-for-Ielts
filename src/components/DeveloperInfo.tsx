import { ExternalLink } from 'lucide-react'
import { cn } from '@/utils/cn'

export const DEVELOPER = {
  name: 'Mahdi Hasan Mehedi',
  github: 'https://github.com/Mahdi-HasanIO',
  handle: 'Mahdi-HasanIO',
}

/** GitHub mark; lucide-react no longer ships brand icons. */
export function GitHubIcon({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.4-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  )
}

/** Full card for the Settings page. */
export function DeveloperCard({ className }: { className?: string }) {
  const initials = DEVELOPER.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')

  return (
    <div className={cn('card relative overflow-hidden', className)}>
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-brand-400/20 to-accent-500/20 blur-3xl" />
      <div className="relative flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-600 font-display text-xl font-extrabold text-white shadow-glow">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="label-xs">Developer</p>
          <h2 className="mt-1 text-[20px] font-extrabold tracking-tight text-ink-900 dark:text-ink-50">
            {DEVELOPER.name}
          </h2>
          <p className="mt-1 text-[13.5px] leading-6 text-ink-600 dark:text-ink-400">
            Designed and built Grammar Path, a sequential grammar course for IELTS Band 8+ and
            professional English.
          </p>
        </div>
        <a
          href={DEVELOPER.github}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-ink-900 px-5 text-sm font-semibold text-white shadow-lift transition-all duration-200 ease-spring hover:-translate-y-0.5 hover:bg-ink-800 focus-ring active:scale-[0.97] dark:bg-white dark:text-ink-900 dark:hover:bg-ink-100"
        >
          <GitHubIcon size={17} />
          {DEVELOPER.handle}
          <ExternalLink size={13} className="opacity-60 transition-transform duration-200 group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  )
}

/** Compact credit line for the sidebar. */
export function DeveloperCredit() {
  return (
    <a
      href={DEVELOPER.github}
      target="_blank"
      rel="noreferrer"
      className="group mt-3 flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-[11.5px] text-ink-500 transition-colors hover:text-ink-900 focus-ring dark:text-ink-400 dark:hover:text-ink-100"
    >
      <GitHubIcon size={13} className="transition-transform duration-200 group-hover:scale-110" />
      Built by <span className="font-semibold">{DEVELOPER.name}</span>
    </a>
  )
}
