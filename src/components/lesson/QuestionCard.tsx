import { useEffect, useState, type CSSProperties } from 'react'
import { Check, Lightbulb, Sparkles, X } from 'lucide-react'
import type { Question } from '@/types'
import { cn } from '@/utils/cn'
import { isCorrect, QUESTION_TYPE_LABEL } from '@/utils/answers'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface Props {
  question: Question
  index: number
  total: number
  /** Controlled answer value. */
  value: string
  onChange: (value: string) => void
  /** Practice mode reveals feedback immediately; test mode defers it. */
  mode: 'practice' | 'test'
  /** In test mode, set once the test is submitted. */
  revealed?: boolean
  /** Practice mode: called once when the learner checks this answer. */
  onChecked?: (correct: boolean) => void
  className?: string
  style?: CSSProperties
}

const LETTERS = ['A', 'B', 'C', 'D', 'E']

const LEVEL_TONE = { easy: 'success', medium: 'warning', hard: 'danger' } as const

/** Renders " ___ " gaps as a visible blank so the carrier sentence reads naturally. */
function WithBlanks({ text }: { text: string }) {
  const parts = text.split(/_{3,}/)
  if (parts.length === 1) return <>{text}</>
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 ? (
            <span className="mx-0.5 inline-block w-14 translate-y-[-3px] border-b-2 border-dashed border-brand-400 align-baseline dark:border-brand-500" />
          ) : null}
        </span>
      ))}
    </>
  )
}

function OptionList({
  question,
  value,
  onChange,
  disabled,
  showResult,
}: {
  question: Question
  value: string
  onChange: (v: string) => void
  disabled: boolean
  showResult: boolean
}) {
  return (
    <div className="mt-5 grid gap-2.5" role="radiogroup">
      {(question.options ?? []).map((option, i) => {
        const selected = value === option
        const correct = option === question.answer
        const state = showResult
          ? correct
            ? 'correct'
            : selected
              ? 'wrong'
              : 'dimmed'
          : selected
            ? 'selected'
            : 'idle'

        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onChange(option)}
            style={{ '--i': i } as CSSProperties}
            className={cn(
              'group flex w-full animate-fade-up stagger items-start gap-3 rounded-xl border px-3.5 py-3 text-left text-[14.5px] leading-6',
              'transition-[transform,background-color,border-color,box-shadow,opacity] duration-200 ease-spring focus-ring',
              state === 'idle' &&
                'border-ink-200 bg-white hover:-translate-y-px hover:border-brand-300 hover:bg-brand-50/40 hover:shadow-card active:scale-[0.99] dark:border-ink-700/80 dark:bg-ink-900 dark:hover:border-brand-700 dark:hover:bg-brand-950/30',
              state === 'selected' &&
                'border-brand-500 bg-brand-50 text-brand-950 shadow-[0_0_0_3px_rgba(37,99,235,0.15)] dark:border-brand-500 dark:bg-brand-950/60 dark:text-brand-50',
              state === 'correct' &&
                'animate-celebrate border-emerald-500 bg-emerald-50 text-emerald-950 shadow-[0_0_0_3px_rgba(16,185,129,0.15)] dark:border-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-50',
              state === 'wrong' &&
                'animate-shake border-rose-500 bg-rose-50 text-rose-950 dark:border-rose-600 dark:bg-rose-950/60 dark:text-rose-50',
              state === 'dimmed' && 'border-ink-200 bg-white opacity-55 dark:border-ink-800 dark:bg-ink-900',
              disabled && 'cursor-default hover:translate-y-0',
            )}
          >
            <span
              className={cn(
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11.5px] font-bold transition-all duration-200',
                state === 'idle' &&
                  'bg-ink-100 text-ink-500 group-hover:bg-brand-100 group-hover:text-brand-700 dark:bg-ink-800 dark:text-ink-400 dark:group-hover:bg-brand-900 dark:group-hover:text-brand-200',
                state === 'selected' && 'bg-brand-600 text-white',
                state === 'correct' && 'bg-emerald-600 text-white',
                state === 'wrong' && 'bg-rose-600 text-white',
                state === 'dimmed' && 'bg-ink-100 text-ink-400 dark:bg-ink-800',
              )}
            >
              {state === 'correct' ? (
                <Check size={13} strokeWidth={3} className="animate-pop-in" />
              ) : state === 'wrong' ? (
                <X size={13} strokeWidth={3} className="animate-pop-in" />
              ) : (
                LETTERS[i]
              )}
            </span>
            <span className="pt-px">{option}</span>
          </button>
        )
      })}
    </div>
  )
}

export function QuestionCard({
  question,
  index,
  total,
  value,
  onChange,
  mode,
  revealed = false,
  onChecked,
  className,
  style,
}: Props) {
  const [checked, setChecked] = useState(false)
  const typed = question.type === 'fill-blank' || question.type === 'rewrite'

  useEffect(() => {
    setChecked(false)
  }, [question.id])

  const showResult = mode === 'test' ? revealed : checked
  const correct = isCorrect(question, value)
  const locked = (mode === 'practice' && checked) || (mode === 'test' && revealed)

  function check() {
    if (!value || checked) return
    setChecked(true)
    onChecked?.(correct)
  }

  return (
    <div className={cn('card card-pad', className)} style={style}>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 font-display text-[13px] font-bold tabular-nums text-ink-400 dark:text-ink-500">
          {String(index + 1).padStart(2, '0')}
          <span className="font-medium">/{String(total).padStart(2, '0')}</span>
        </span>
        <Badge tone="neutral">{QUESTION_TYPE_LABEL[question.type]}</Badge>
        {question.source === 'ai' ? (
          <Badge tone="ai">
            <Sparkles size={11} /> AI
          </Badge>
        ) : null}
        {question.level ? (
          <Badge tone={LEVEL_TONE[question.level]} className="capitalize">
            {question.level}
          </Badge>
        ) : null}
        {question.context ? <Badge tone="muted">{question.context}</Badge> : null}
      </div>

      <p className="mt-3.5 text-[15.5px] font-semibold leading-7 text-ink-900 dark:text-ink-50">
        <WithBlanks text={question.question} />
      </p>

      {question.prompt ? (
        <p className="mt-3 rounded-xl border-l-4 border-brand-400 bg-ink-50 px-4 py-3 font-serif text-[15.5px] leading-7 text-ink-800 dark:border-brand-600 dark:bg-ink-800/50 dark:text-ink-100">
          {question.prompt}
        </p>
      ) : null}

      {typed ? (
        <input
          type="text"
          value={value}
          disabled={locked}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && mode === 'practice') check()
          }}
          placeholder="Type your answer"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          className={cn(
            'mt-5 w-full rounded-xl border px-4 py-3 text-[15px] outline-none transition-[border-color,box-shadow] duration-200',
            'border-ink-200 bg-white placeholder:text-ink-400 focus:border-brand-500 focus:shadow-[0_0_0_4px_rgba(37,99,235,0.15)]',
            'dark:border-ink-700 dark:bg-ink-900 dark:placeholder:text-ink-500',
            showResult && correct && 'border-emerald-500 bg-emerald-50/50 dark:border-emerald-600 dark:bg-emerald-950/30',
            showResult && !correct && 'animate-shake border-rose-500 bg-rose-50/50 dark:border-rose-600 dark:bg-rose-950/30',
          )}
        />
      ) : (
        <OptionList
          question={question}
          value={value}
          onChange={(v) => {
            if (!locked) onChange(v)
          }}
          disabled={locked}
          showResult={showResult}
        />
      )}

      {mode === 'practice' && !checked ? (
        <div className="mt-4 flex items-center gap-3">
          <Button size="sm" variant={value ? 'primary' : 'secondary'} disabled={!value} onClick={check}>
            Check answer
          </Button>
          {!value ? (
            <span className="text-[12px] text-ink-400 dark:text-ink-500">
              {typed ? 'Type an answer first' : 'Pick an option first'}
            </span>
          ) : null}
        </div>
      ) : null}

      {/* Grid-rows trick animates the panel's height open without measuring it. */}
      <div
        className={cn(
          'grid transition-[grid-template-rows,opacity] duration-500 ease-spring',
          showResult ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          {showResult ? (
            <div
              className={cn(
                'mt-4 rounded-xl border px-4 py-3.5 text-[13.5px]',
                correct
                  ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-white text-emerald-950 dark:border-emerald-900 dark:from-emerald-950/60 dark:to-ink-900 dark:text-emerald-50'
                  : 'border-rose-200 bg-gradient-to-br from-rose-50 to-white text-rose-950 dark:border-rose-900 dark:from-rose-950/60 dark:to-ink-900 dark:text-rose-50',
              )}
            >
              <p className="flex items-center gap-2 font-bold">
                <span
                  className={cn(
                    'flex h-5 w-5 animate-pop-in items-center justify-center rounded-full text-white',
                    correct ? 'bg-emerald-500' : 'bg-rose-500',
                  )}
                >
                  {correct ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
                </span>
                {correct ? 'Correct, well done!' : 'Not quite'}
              </p>
              {!correct ? (
                <p className="mt-2 leading-6">
                  Correct answer: <span className="font-semibold">{question.answer}</span>
                </p>
              ) : null}
              <p className="bn-text mt-2 flex gap-2 opacity-90">
                <Lightbulb size={14} className="mt-1 shrink-0 opacity-70" />
                <span>{question.explanation}</span>
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
