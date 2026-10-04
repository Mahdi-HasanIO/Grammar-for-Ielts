import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  BookCheck,
  Gauge,
  KeyRound,
  RefreshCw,
  Sparkles,
  Trophy,
  Wand2,
  WifiOff,
} from 'lucide-react'
import type { Lesson, ModuleMeta } from '@/types'
import { useAiPractice } from '@/hooks/useAiPractice'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { useProgress } from '@/hooks/useProgress'
import { AI_SET_SIZE, type AiDifficulty } from '@/utils/aiPractice'
import { isCorrect } from '@/utils/answers'
import { cn } from '@/utils/cn'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { QuestionSkeleton } from '@/components/ui/Skeleton'
import { QuestionCard } from '@/components/lesson/QuestionCard'

const DIFFICULTIES: { value: AiDifficulty; label: string; hint: string }[] = [
  { value: 'warm-up', label: 'Warm-up', hint: 'Shorter sentences, clearer choices' },
  { value: 'mixed', label: 'Mixed', hint: 'Easy to hard, like a real lesson' },
  { value: 'challenge', label: 'Challenge', hint: 'Band 8-level traps' },
]

const LOADING_STEPS = [
  'Reading this lesson’s rules…',
  'Writing IELTS-style sentences…',
  'Making sure each question has one clear answer…',
  'Adding short explanations in Bangla…',
]

function GeneratingBanner() {
  const [step, setStep] = useState(0)
  useEffect(() => {
    const t = window.setInterval(() => setStep((s) => (s + 1) % LOADING_STEPS.length), 1800)
    return () => window.clearInterval(t)
  }, [])

  return (
    <div
      className="relative mb-4 animate-scale-in overflow-hidden rounded-2xl border border-brand-200 bg-gradient-to-r from-brand-50 via-white to-cyan-50 px-4 py-3.5 dark:border-brand-800/60 dark:from-brand-950/70 dark:via-ink-900 dark:to-cyan-950/40"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-600 text-white shadow-glow">
          <Sparkles size={17} className="animate-sparkle" />
        </span>
        <div className="min-w-0">
          <p className="text-[13.5px] font-bold text-ink-900 dark:text-ink-50">
            Generating fresh AI questions
          </p>
          <p key={step} className="animate-fade-in text-[12.5px] text-ink-600 dark:text-ink-300">
            {LOADING_STEPS[step]}
          </p>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden bg-brand-100 dark:bg-brand-950">
        <div className="h-full w-full origin-left animate-progress-indeterminate bg-gradient-to-r from-brand-500 to-accent-500" />
      </div>
    </div>
  )
}

export function AiPracticePanel({ module, lesson }: { module: ModuleMeta; lesson?: Lesson }) {
  const { recordAnswers, markPracticeCompleted } = useProgress()
  const ai = useAiPractice(module, lesson)
  const { questions, usingAi, status, hasKey, generation } = ai
  // AI generation needs the network. Offline, every trigger is disabled and nothing is faked;
  // the built-in questions stay available and the buttons come back when the connection does.
  const online = useOnlineStatus()
  const generate = useCallback(() => (navigator.onLine ? ai.generate() : Promise.resolve()), [ai.generate])

  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [submitted, setSubmitted] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const autoTried = useRef(false)

  // Each new set (or module) starts with a clean slate.
  const setSignature = questions.map((q) => q.id).join('|')
  useEffect(() => {
    setAnswers({})
    setChecked({})
    setSubmitted(false)
  }, [setSignature])

  useEffect(() => {
    autoTried.current = false
  }, [module.id])

  // With a key saved, replace the built-in set automatically the first time
  // the learner scrolls near the practice section. Lazily, so a quick look at
  // the lesson doesn't spend API quota.
  useEffect(() => {
    const node = rootRef.current
    if (!node || !online || !hasKey || usingAi || status !== 'idle' || autoTried.current) return
    if (typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !autoTried.current) {
          autoTried.current = true
          observer.disconnect()
          void generate()
        }
      },
      { rootMargin: '300px 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [online, hasKey, usingAi, status, generate])

  const loading = status === 'loading'
  const answeredAll = questions.every((q) => (answers[q.id] ?? '').length > 0)
  const checkedCount = Object.keys(checked).length
  const correctSoFar = Object.values(checked).filter(Boolean).length
  const finalCorrect = questions.reduce((n, q) => n + (isCorrect(q, answers[q.id] ?? '') ? 1 : 0), 0)

  function submitPractice() {
    recordAnswers(finalCorrect, questions.length)
    markPracticeCompleted(module.id)
    setSubmitted(true)
  }

  return (
    <div ref={rootRef}>
      {/* Control panel */}
      <div className="relative mb-5 overflow-hidden rounded-3xl border border-brand-200/70 bg-gradient-to-br from-white via-brand-50/60 to-cyan-50/70 p-5 shadow-card sm:p-6 dark:border-brand-900/60 dark:from-ink-900 dark:via-brand-950/40 dark:to-cyan-950/30">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent-500/10 blur-3xl" />
        <div className="relative">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-600 text-white shadow-glow">
                <Wand2 size={20} />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-[16px] font-bold tracking-tight text-ink-900 dark:text-ink-50">
                    AI Practice Questions
                  </h3>
                  <Badge tone="ai">
                    <Sparkles size={11} /> Powered by Gemini
                  </Badge>
                </div>
                <p className="mt-1 max-w-xl text-[13.5px] leading-6 text-ink-600 dark:text-ink-300">
                  Fresh questions written by AI for <span className="font-semibold">this lesson’s</span>{' '}
                  rules, with IELTS-style sentences and a short Bangla explanation for each answer.
                  Generate a new set whenever you want more practice.
                </p>
              </div>
            </div>
          </div>

          {hasKey ? (
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div
                className="inline-flex w-full rounded-xl bg-ink-100/80 p-1 sm:w-auto dark:bg-ink-800/70"
                role="radiogroup"
                aria-label="Difficulty"
              >
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    role="radio"
                    aria-checked={ai.difficulty === d.value}
                    title={d.hint}
                    disabled={loading}
                    onClick={() => ai.setDifficulty(d.value)}
                    className={cn(
                      'flex-1 rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition-all duration-200 ease-spring focus-ring sm:flex-none',
                      ai.difficulty === d.value
                        ? 'bg-white text-brand-700 shadow-card dark:bg-ink-700 dark:text-white'
                        : 'text-ink-500 hover:text-ink-800 dark:text-ink-400 dark:hover:text-ink-100',
                    )}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              <Button
                variant="ai"
                onClick={() => void generate()}
                loading={loading}
                disabled={!online}
                className="w-full sm:w-auto"
              >
                {!loading ? (usingAi ? <RefreshCw size={15} /> : <Sparkles size={15} />) : null}
                {loading
                  ? 'Generating…'
                  : usingAi
                    ? 'Generate a fresh set'
                    : 'Generate AI Practice Questions'}
              </Button>
            </div>
          ) : (
            <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-dashed border-brand-300 bg-white/70 p-4 sm:flex-row sm:items-center dark:border-brand-800 dark:bg-ink-900/60">
              <span className="icon-chip h-10 w-10 bg-brand-50 text-brand-600 ring-brand-200 dark:bg-brand-950 dark:text-brand-300 dark:ring-brand-800">
                <KeyRound size={18} />
              </span>
              <p className="flex-1 text-[13px] leading-6 text-ink-700 dark:text-ink-300">
                Connect a free Gemini API key once to unlock unlimited AI questions for every
                lesson. Until then, you’re practising with the built-in set below.
              </p>
              <Link to="/settings#ai" className="shrink-0">
                <Button variant="ai" size="sm" className="w-full sm:w-auto">
                  <Sparkles size={14} /> Set up AI practice
                </Button>
              </Link>
            </div>
          )}

          {!online ? (
            <p
              role="status"
              className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-[13px] leading-6 text-amber-900 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-100"
            >
              <WifiOff size={15} className="mt-1 shrink-0" aria-hidden />
              <span>
                AI Practice Generation requires an internet connection. The built-in practice set below works
                offline.
              </span>
            </p>
          ) : null}

          {/* Current set status */}
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-ink-500 dark:text-ink-400">
            {usingAi ? (
              <span className="inline-flex items-center gap-1.5 font-semibold text-brand-700 dark:text-brand-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
                </span>
                AI set #{generation} · {questions.length} questions
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <BookCheck size={13} /> Built-in practice set · {questions.length} questions
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Gauge size={12} /> Doesn’t affect your module score
            </span>
          </div>
        </div>
      </div>

      {status === 'error' && ai.message ? (
        <div
          role="alert"
          className="mb-4 flex animate-fade-down items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] leading-6 text-amber-900 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-100"
        >
          <AlertCircle size={16} className="mt-1 shrink-0" />
          <div className="flex-1">
            <p>{ai.message}</p>
            {!usingAi ? <p className="opacity-80">Showing the built-in practice set for now.</p> : null}
          </div>
          {hasKey ? (
            <Button size="sm" variant="secondary" onClick={() => void generate()} disabled={!online} className="shrink-0">
              <RefreshCw size={13} /> Retry
            </Button>
          ) : null}
        </div>
      ) : null}

      {loading ? <GeneratingBanner /> : null}

      {/* Live score */}
      {!loading && checkedCount > 0 ? (
        <div className="mb-4 flex animate-fade-in items-center gap-3 rounded-2xl border border-ink-200/80 bg-white px-4 py-3 shadow-card dark:border-ink-800 dark:bg-ink-900">
          <span className="text-[12.5px] font-semibold text-ink-600 dark:text-ink-300">
            Checked {checkedCount}/{questions.length}
          </span>
          <ProgressBar value={(checkedCount / questions.length) * 100} size="sm" className="flex-1" />
          <span className="text-[12.5px] font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
            {correctSoFar} correct
          </span>
        </div>
      ) : null}

      <div className="space-y-4">
        {loading
          ? Array.from({ length: usingAi ? questions.length : AI_SET_SIZE }, (_, i) => (
              <QuestionSkeleton key={i} index={i} />
            ))
          : questions.map((q, i) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={i}
                total={questions.length}
                mode="practice"
                value={answers[q.id] ?? ''}
                onChange={(v) => setAnswers((prev) => ({ ...prev, [q.id]: v }))}
                onChecked={(ok) => setChecked((prev) => ({ ...prev, [q.id]: ok }))}
                className="animate-fade-up stagger"
                style={{ '--i': i } as CSSProperties}
              />
            ))}
      </div>

      {!loading ? (
        !submitted ? (
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button variant="secondary" disabled={!answeredAll} onClick={submitPractice}>
              <BookCheck size={15} /> Finish practice
            </Button>
            {!answeredAll ? (
              <span className="text-[12px] text-ink-500 dark:text-ink-400">
                Answer every question to finish this set.
              </span>
            ) : null}
          </div>
        ) : (
          <div className="mt-5 flex animate-pop-in flex-col gap-4 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 sm:flex-row sm:items-center dark:border-emerald-900/70 dark:from-emerald-950/50 dark:to-ink-900">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-[0_8px_24px_-8px_rgba(16,185,129,0.6)]">
              <Trophy size={22} />
            </span>
            <div className="flex-1">
              <p className="font-display text-[16px] font-bold text-emerald-950 dark:text-emerald-50">
                Practice logged: {finalCorrect}/{questions.length} correct
              </p>
              <p className="mt-0.5 text-[13px] text-emerald-900/80 dark:text-emerald-100/80">
                {hasKey
                  ? 'Want more? Generate a fresh AI set, or take the module test when the rules feel familiar.'
                  : 'When the rules feel familiar, take the module test.'}
              </p>
            </div>
            {hasKey ? (
              <Button variant="ai" size="sm" onClick={() => void generate()} disabled={!online}>
                <RefreshCw size={14} /> New AI set
              </Button>
            ) : null}
          </div>
        )
      ) : null}
    </div>
  )
}
