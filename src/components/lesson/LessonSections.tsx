import { AlertTriangle, Check, CheckCircle2, Lightbulb, X } from 'lucide-react'
import type { CSSProperties } from 'react'
import type { CommonMistake, ExamplePair, Lesson, RuleBlock } from '@/types'
import { Badge } from '@/components/ui/Badge'

function ExampleRow({ example, style }: { example: ExamplePair; style?: CSSProperties }) {
  return (
    <div
      style={style}
      className="group rounded-2xl border border-ink-200/80 bg-white p-4 shadow-card transition-all duration-300 ease-spring hover:-translate-y-0.5 hover:shadow-lift sm:p-5 dark:border-ink-800 dark:bg-ink-900"
    >
      {example.wrong ? (
        <p className="flex gap-2.5 font-serif text-[15.5px] leading-7 text-rose-700 dark:text-rose-300">
          <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950">
            <X size={12} strokeWidth={3} />
          </span>
          <span className="line-through decoration-rose-300/80 decoration-1 dark:decoration-rose-700">
            {example.wrong}
          </span>
        </p>
      ) : null}
      <p
        className={`flex gap-2.5 font-serif text-[15.5px] leading-7 text-emerald-800 dark:text-emerald-300 ${
          example.wrong ? 'mt-2' : ''
        }`}
      >
        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 transition-transform duration-300 group-hover:scale-110 dark:bg-emerald-950">
          <Check size={12} strokeWidth={3} />
        </span>
        <span>{example.right}</span>
      </p>
      {example.note ? (
        <p className="bn-text mt-3 border-t border-dashed border-ink-200 pt-3 text-[13.5px] text-ink-600 dark:border-ink-700 dark:text-ink-400">
          {example.note}
        </p>
      ) : null}
    </div>
  )
}

export function RuleCard({ rule, index }: { rule: RuleBlock; index: number }) {
  return (
    <section className="card overflow-hidden">
      <div className="relative border-b border-ink-200/80 bg-gradient-to-r from-ink-50 to-white px-5 py-4 sm:px-6 dark:border-ink-800 dark:from-ink-900 dark:to-ink-900/40">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-600 font-display text-[13px] font-bold text-white shadow-glow">
            {index + 1}
          </span>
          <h3 className="text-[16px] font-bold tracking-tight text-ink-900 dark:text-ink-50">
            {rule.heading}
          </h3>
        </div>
      </div>

      <div className="space-y-6 px-5 py-6 sm:px-6">
        <div>
          <p className="label-xs mb-2">Rule</p>
          <p className="bn-text text-[15.5px] text-ink-800 dark:text-ink-100">{rule.rule}</p>
        </div>

        <div className="rounded-xl bg-brand-50/50 px-4 py-3 ring-1 ring-inset ring-brand-100 dark:bg-brand-950/30 dark:ring-brand-900/50">
          <p className="label-xs mb-1.5 text-brand-700 dark:text-brand-300">When to use it</p>
          <p className="bn-text text-[14.5px] text-ink-700 dark:text-ink-300">{rule.whenToUse}</p>
        </div>

        <div>
          <p className="label-xs mb-2.5">Structure</p>
          <ul className="space-y-2">
            {rule.structure.map((line) => (
              <li
                key={line}
                className="rounded-xl border-l-[3px] border-brand-400 bg-ink-50 px-4 py-2.5 font-serif text-[14.5px] leading-7 text-ink-800 transition-colors duration-200 hover:bg-brand-50/60 dark:border-brand-600 dark:bg-ink-800/50 dark:text-ink-100 dark:hover:bg-brand-950/40"
              >
                {line}
              </li>
            ))}
          </ul>
        </div>

        {rule.table ? (
          <div>
            {rule.table.caption ? <p className="label-xs mb-2.5">{rule.table.caption}</p> : null}
            <div className="overflow-x-auto rounded-xl border border-ink-200 dark:border-ink-800">
              <table className="w-full border-collapse text-left text-[13.5px]">
                <thead className="bg-ink-50 dark:bg-ink-800/60">
                  <tr>
                    {rule.table.headers.map((h) => (
                      <th
                        key={h}
                        className="whitespace-nowrap px-3.5 py-2.5 text-[12px] font-bold uppercase tracking-wide text-ink-600 dark:text-ink-300"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rule.table.rows.map((row) => (
                    <tr
                      key={row.join('|')}
                      className="transition-colors duration-150 hover:bg-brand-50/40 dark:hover:bg-brand-950/20"
                    >
                      {row.map((cell, ci) => (
                        <td
                          key={`${ci}-${cell}`}
                          className="bn-text border-t border-ink-200 px-3.5 py-2.5 align-top text-ink-700 dark:border-ink-800 dark:text-ink-300"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {rule.examples?.length ? (
          <div className="space-y-2.5">
            {rule.examples.map((ex) => (
              <ExampleRow key={ex.right} example={ex} />
            ))}
          </div>
        ) : null}

        {rule.notes?.length ? (
          <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50/40 px-4 py-3.5 dark:border-amber-900/60 dark:from-amber-950/40 dark:to-ink-900">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-amber-800 dark:text-amber-300">
              <Lightbulb size={13} />
              Important notes
            </p>
            <ul className="mt-2.5 space-y-2">
              {rule.notes.map((note) => (
                <li
                  key={note}
                  className="bn-text flex gap-2 text-[14px] text-amber-950 dark:text-amber-100"
                >
                  <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export function ExamplesSection({ examples }: { examples: ExamplePair[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {examples.map((ex, i) => (
        <ExampleRow
          key={ex.right}
          example={ex}
          style={{ '--i': i } as CSSProperties}
        />
      ))}
    </div>
  )
}

export function MistakesSection({ mistakes }: { mistakes: CommonMistake[] }) {
  return (
    <div className="rounded-3xl border border-rose-200/80 bg-gradient-to-br from-rose-50/80 to-white p-4 sm:p-5 dark:border-rose-900/50 dark:from-rose-950/30 dark:to-ink-900">
      <p className="mb-4 flex items-center gap-2 text-[13.5px] font-bold text-rose-800 dark:text-rose-200">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-950">
          <AlertTriangle size={15} />
        </span>
        Watch out for these
        <Badge tone="danger" className="ml-auto">
          {mistakes.length}
        </Badge>
      </p>
      <div className="space-y-3">
        {mistakes.map((m) => (
          <div
            key={m.wrong}
            className="rounded-2xl border border-rose-100 bg-white p-4 shadow-card transition-all duration-300 ease-spring hover:-translate-y-0.5 hover:shadow-lift sm:p-5 dark:border-rose-900/40 dark:bg-ink-900"
          >
            <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
              <p className="flex gap-2.5 font-serif text-[15px] leading-7 text-rose-700 dark:text-rose-300">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950">
                  <X size={12} strokeWidth={3} />
                </span>
                <span>{m.wrong}</span>
              </p>
              <p className="flex gap-2.5 font-serif text-[15px] leading-7 text-emerald-800 dark:text-emerald-300">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
                  <Check size={12} strokeWidth={3} />
                </span>
                <span>{m.right}</span>
              </p>
            </div>
            <p className="bn-text mt-3 border-t border-dashed border-ink-200 pt-3 text-[13.5px] text-ink-600 dark:border-ink-700 dark:text-ink-400">
              {m.explanation}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TakeawaysSection({ lesson }: { lesson: Lesson }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-brand-200/80 bg-gradient-to-br from-brand-50 via-white to-purple-50/60 p-5 sm:p-6 dark:border-brand-900/60 dark:from-brand-950/60 dark:via-ink-900 dark:to-purple-950/30">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-400/10 blur-2xl" />
      <p className="relative mb-4 flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.12em] text-brand-700 dark:text-brand-300">
        <Lightbulb size={15} /> Key takeaways
      </p>
      <ul className="relative space-y-3">
        {lesson.keyTakeaways.map((t) => (
          <li key={t} className="bn-text flex gap-3 text-[14.5px] text-ink-800 dark:text-ink-100">
            <CheckCircle2
              size={18}
              className="mt-1 shrink-0 text-brand-600 dark:text-brand-400"
              strokeWidth={2.2}
            />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
