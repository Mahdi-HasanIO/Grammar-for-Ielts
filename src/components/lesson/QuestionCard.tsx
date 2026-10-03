import { useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'
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
    <div className="mt-4 grid gap-2">
      {(question.options ?? []).map((option) => {
        const selected = value === option
        const correct = option === question.answer
        const state = showResult
          ? correct
            ? 'correct'
            : selected
              ? 'wrong'
              : 'idle'
          : selected
            ? 'selected'
            : 'idle'

        return (
          <button
            key={option}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option)}
            className={cn(
              'flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-[14px] transition-colors',
              state === 'idle' &&
                'border-ink-200 bg-white hover:border-ink-300 hover:bg-ink-50 dark:border-ink-800 dark:bg-ink-900 dark:hover:border-ink-700 dark:hover:bg-ink-800',
              state === 'selected' &&
                'border-brand-500 bg-brand-50 text-brand-900 dark:border-brand-600 dark:bg-brand-950 dark:text-brand-100',
              state === 'correct' &&
                'border-emerald-500 bg-emerald-50 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-100',
              state === 'wrong' &&
                'border-rose-500 bg-rose-50 text-rose-900 dark:border-rose-700 dark:bg-rose-950 dark:text-rose-100',
              disabled && 'cursor-default',
            )}
          >
            <span
              className={cn(
                'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border',
                state === 'selected' && 'border-brand-600 bg-brand-600 text-white',
                state === 'correct' && 'border-emerald-600 bg-emerald-600 text-white',
                state === 'wrong' && 'border-rose-600 bg-rose-600 text-white',
                state === 'idle' && 'border-ink-300 dark:border-ink-600',
              )}
            >
              {state === 'correct' ? <Check size={11} strokeWidth={3} /> : null}
              {state === 'wrong' ? <X size={11} strokeWidth={3} /> : null}
            </span>
            <span>{option}</span>
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
}: Props) {
  const [checked, setChecked] = useState(false)
  const typed = question.type === 'fill-blank' || question.type === 'rewrite'

  useEffect(() => {
    setChecked(false)
  }, [question.id])

  const showResult = mode === 'test' ? revealed : checked
  const correct = isCorrect(question, value)
  const locked = mode === 'practice' && checked

  return (
    <div className="card card-pad animate-fade-up">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="muted">
          Question {index + 1} of {total}
        </Badge>
        <Badge tone="neutral">{QUESTION_TYPE_LABEL[question.type]}</Badge>
      </div>

      <p className="mt-3 text-[15px] font-medium leading-6 text-ink-900 dark:text-ink-50">
        {question.question}
      </p>

      {question.prompt ? (
        <p className="mt-3 rounded-lg bg-ink-100 px-3 py-2 font-serif text-[15px] leading-6 text-ink-800 dark:bg-ink-800/70 dark:text-ink-100">
          {question.prompt}
        </p>
      ) : null}

      {typed ? (
        <input
          type="text"
          value={value}
          disabled={locked || (mode === 'test' && revealed)}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your answer"
          autoComplete="off"
          className={cn(
            'mt-4 w-full rounded-xl border px-4 py-2.5 text-[14px] outline-none transition-colors',
            'border-ink-200 bg-white placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100',
            'dark:border-ink-700 dark:bg-ink-900 dark:placeholder:text-ink-500 dark:focus:ring-brand-950',
            showResult && correct && 'border-emerald-500 dark:border-emerald-600',
            showResult && !correct && 'border-rose-500 dark:border-rose-600',
          )}
        />
      ) : (
        <OptionList
          question={question}
          value={value}
          onChange={(v) => {
            if (locked || (mode === 'test' && revealed)) return
            onChange(v)
          }}
          disabled={locked || (mode === 'test' && revealed)}
          showResult={showResult}
        />
      )}

      {mode === 'practice' && !checked ? (
        <Button
          size="sm"
          variant="secondary"
          className="mt-4"
          disabled={!value}
          onClick={() => setChecked(true)}
        >
          Check answer
        </Button>
      ) : null}

      {showResult ? (
        <div
          className={cn(
            'mt-4 rounded-xl border px-4 py-3 text-[13px] leading-6 animate-fade-up',
            correct
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-100'
              : 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-100',
          )}
        >
          <p className="flex items-center gap-1.5 font-semibold">
            {correct ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
            {correct ? 'Correct' : 'Not quite'}
          </p>
          {!correct ? (
            <p className="mt-1">
              Answer: <span className="font-medium">{question.answer}</span>
            </p>
          ) : null}
          <p className="mt-1 opacity-90">{question.explanation}</p>
        </div>
      ) : null}
    </div>
  )
}
