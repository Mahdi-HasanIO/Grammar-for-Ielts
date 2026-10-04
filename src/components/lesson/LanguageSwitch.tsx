import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Languages } from 'lucide-react'
import type { LessonLanguage } from '@/types'
import { useLessonLanguage } from '@/hooks/useLessonLanguage'
import { cn } from '@/utils/cn'

const OPTIONS: { value: LessonLanguage; label: string; lang: string }[] = [
  { value: 'en', label: 'English', lang: 'en' },
  { value: 'bn', label: 'বাংলা', lang: 'bn' },
]

/** Compact English | বাংলা segmented control for switching lesson language at any time. */
export function LanguageToggle({
  className,
  fallback = 'bn',
}: {
  className?: string
  /** Shown as active when the learner has not chosen a language yet. */
  fallback?: LessonLanguage
}) {
  const { chosen, setLanguage } = useLessonLanguage()
  const language = chosen ?? fallback

  return (
    <div
      role="radiogroup"
      aria-label="Lesson language"
      className={cn(
        'inline-flex items-center gap-1 rounded-xl border border-ink-200 bg-ink-50 p-1 dark:border-ink-700 dark:bg-ink-800/60',
        className,
      )}
    >
      <Languages size={14} className="ml-1.5 mr-0.5 text-ink-400" aria-hidden />
      {OPTIONS.map((opt) => {
        const active = language === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            lang={opt.lang}
            onClick={() => setLanguage(opt.value)}
            className={cn(
              'min-h-[32px] rounded-lg px-3 text-[13px] font-semibold transition-all duration-200 ease-spring focus-ring',
              active
                ? 'bg-white text-brand-700 shadow-card ring-1 ring-ink-200/80 dark:bg-ink-900 dark:text-brand-200 dark:ring-ink-700'
                : 'text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-100',
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

/**
 * Shown once, before the learner first opens the course. The choice is stored
 * locally and can be changed from any lesson with the toggle above.
 */
export function LanguageChooser() {
  const { chosen, setLanguage } = useLessonLanguage()
  const firstRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const open = chosen === null

  useEffect(() => {
    if (!open) return
    firstRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // Keep keyboard focus inside the dialog until a language is chosen.
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !dialogRef.current) return
      const buttons = Array.from(dialogRef.current.querySelectorAll('button'))
      const first = buttons[0]
      const last = buttons[buttons.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!open) return null

  // Portal to <body>: the workspace wraps pages in an animated (transformed) container,
  // which would otherwise trap this fixed overlay inside the content column.
  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 animate-fade-in bg-ink-950/50 backdrop-blur-sm" aria-hidden />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lang-chooser-title"
        aria-describedby="lang-chooser-desc"
        className="relative w-full max-w-md animate-scale-in overflow-hidden rounded-3xl border border-ink-200 bg-white p-6 text-center shadow-lift sm:p-8 dark:border-ink-800 dark:bg-ink-900"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-brand-400/25 to-accent-500/25 blur-3xl" />
        <span className="icon-chip relative mx-auto mb-4 h-12 w-12 bg-gradient-to-br from-brand-50 to-cyan-50 text-brand-600 ring-brand-200/70 dark:from-brand-950 dark:to-cyan-950/50 dark:text-brand-300 dark:ring-brand-800/60">
          <Languages size={22} />
        </span>
        <h2 id="lang-chooser-title" className="relative text-[22px] font-extrabold tracking-tight text-ink-900 dark:text-ink-50">
          Choose your learning language
        </h2>
        <p id="lang-chooser-desc" className="relative mt-2 text-[14px] leading-6 text-ink-600 dark:text-ink-400">
          Rules, explanations and tips will appear in this language. Example sentences stay in
          English. You can switch at any time inside a lesson.
        </p>
        <div className="relative mt-6 grid grid-cols-2 gap-3">
          {OPTIONS.map((opt, i) => (
            <button
              key={opt.value}
              ref={i === 0 ? firstRef : undefined}
              type="button"
              lang={opt.lang}
              onClick={() => setLanguage(opt.value)}
              className="group flex min-h-[88px] flex-col items-center justify-center gap-1 rounded-2xl border border-ink-200 bg-ink-50 px-4 py-4 transition-all duration-300 ease-spring hover:-translate-y-0.5 hover:border-brand-300 hover:bg-white hover:shadow-lift active:scale-[0.98] focus-ring dark:border-ink-700 dark:bg-ink-800/60 dark:hover:border-brand-700 dark:hover:bg-ink-800"
            >
              <span className="text-[18px] font-bold text-ink-900 dark:text-ink-50">{opt.label}</span>
              <span className="text-[12px] text-ink-500 dark:text-ink-400">
                {opt.value === 'en' ? 'Explanations in English' : 'সহজ বাংলায় ব্যাখ্যা'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  )
}
