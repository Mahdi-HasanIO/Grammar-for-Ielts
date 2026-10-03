import { AlertTriangle, Check, Lightbulb, X } from 'lucide-react'
import type { CommonMistake, ExamplePair, Lesson, RuleBlock } from '@/types'
import { Badge } from '@/components/ui/Badge'

function ExampleRow({ example }: { example: ExamplePair }) {
  return (
    <div className="rounded-xl border border-ink-200 bg-white p-4 dark:border-ink-800 dark:bg-ink-900">
      {example.wrong ? (
        <p className="flex gap-2 font-serif text-[15px] leading-6 text-rose-700 dark:text-rose-300">
          <X size={15} className="mt-1 shrink-0" strokeWidth={2.5} />
          <span className="line-through decoration-rose-300 decoration-1">{example.wrong}</span>
        </p>
      ) : null}
      <p
        className={`flex gap-2 font-serif text-[15px] leading-6 text-emerald-700 dark:text-emerald-300 ${
          example.wrong ? 'mt-2' : ''
        }`}
      >
        <Check size={15} className="mt-1 shrink-0" strokeWidth={2.5} />
        <span>{example.right}</span>
      </p>
      {example.note ? (
        <p className="mt-2.5 border-t border-ink-200 pt-2.5 text-[13px] leading-5 text-ink-600 dark:border-ink-800 dark:text-ink-400">
          {example.note}
        </p>
      ) : null}
    </div>
  )
}

export function RuleCard({ rule, index }: { rule: RuleBlock; index: number }) {
  return (
    <section className="card overflow-hidden">
      <div className="border-b border-ink-200 bg-ink-50 px-5 py-4 dark:border-ink-800 dark:bg-ink-900/60 sm:px-6">
        <div className="flex items-start gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand-600 text-[12px] font-semibold text-white">
            {index + 1}
          </span>
          <h3 className="text-[15px] font-semibold tracking-tight text-ink-900 dark:text-ink-50">
            {rule.heading}
          </h3>
        </div>
      </div>

      <div className="space-y-5 px-5 py-5 sm:px-6">
        <div>
          <p className="label-xs mb-1.5">Rule</p>
          <p className="text-[15px] leading-7 text-ink-800 dark:text-ink-200">{rule.rule}</p>
        </div>

        <div>
          <p className="label-xs mb-1.5">When to use it</p>
          <p className="text-[14px] leading-6 text-ink-700 dark:text-ink-300">{rule.whenToUse}</p>
        </div>

        <div>
          <p className="label-xs mb-2">Structure</p>
          <ul className="space-y-1.5">
            {rule.structure.map((line) => (
              <li
                key={line}
                className="rounded-lg bg-ink-100 px-3 py-2 font-serif text-[14px] leading-6 text-ink-800 dark:bg-ink-800/60 dark:text-ink-100"
              >
                {line}
              </li>
            ))}
          </ul>
        </div>

        {rule.table ? (
          <div>
            {rule.table.caption ? <p className="label-xs mb-2">{rule.table.caption}</p> : null}
            <div className="overflow-x-auto rounded-xl border border-ink-200 dark:border-ink-800">
              <table className="w-full border-collapse text-left text-[13px]">
                <thead className="bg-ink-50 dark:bg-ink-900/60">
                  <tr>
                    {rule.table.headers.map((h) => (
                      <th
                        key={h}
                        className="whitespace-nowrap px-3 py-2 font-semibold text-ink-700 dark:text-ink-200"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rule.table.rows.map((row, i) => (
                    <tr
                      key={row.join('|')}
                      className={
                        i % 2 === 1 ? 'bg-ink-50/60 dark:bg-ink-900/30' : undefined
                      }
                    >
                      {row.map((cell) => (
                        <td
                          key={cell}
                          className="border-t border-ink-200 px-3 py-2 align-top text-ink-700 dark:border-ink-800 dark:text-ink-300"
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
          <div className="space-y-2">{rule.examples.map((ex) => <ExampleRow key={ex.right} example={ex} />)}</div>
        ) : null}

        {rule.notes?.length ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900 dark:bg-amber-950/50">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              <Lightbulb size={13} />
              Important notes
            </p>
            <ul className="mt-2 space-y-1.5">
              {rule.notes.map((note) => (
                <li
                  key={note}
                  className="text-[13px] leading-6 text-amber-900 dark:text-amber-100"
                >
                  {note}
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
    <div className="grid gap-3 sm:grid-cols-2">
      {examples.map((ex) => (
        <ExampleRow key={ex.right} example={ex} />
      ))}
    </div>
  )
}

export function MistakesSection({ mistakes }: { mistakes: CommonMistake[] }) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-4 dark:border-rose-900/70 dark:bg-rose-950/30 sm:p-5">
      <p className="mb-3 flex items-center gap-2 text-[13px] font-semibold text-rose-800 dark:text-rose-200">
        <AlertTriangle size={15} />
        Common mistakes
        <Badge tone="danger" className="ml-auto">
          {mistakes.length}
        </Badge>
      </p>
      <div className="space-y-2.5">
        {mistakes.map((m) => (
          <div
            key={m.wrong}
            className="rounded-xl border border-rose-200 bg-white p-4 dark:border-rose-900/70 dark:bg-ink-900"
          >
            <p className="flex gap-2 font-serif text-[15px] leading-6 text-rose-700 dark:text-rose-300">
              <X size={15} className="mt-1 shrink-0" strokeWidth={2.5} />
              <span>{m.wrong}</span>
            </p>
            <p className="mt-2 flex gap-2 font-serif text-[15px] leading-6 text-emerald-700 dark:text-emerald-300">
              <Check size={15} className="mt-1 shrink-0" strokeWidth={2.5} />
              <span>{m.right}</span>
            </p>
            <p className="mt-2.5 border-t border-ink-200 pt-2.5 text-[13px] leading-5 text-ink-600 dark:border-ink-800 dark:text-ink-400">
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
    <div className="rounded-2xl border border-brand-200 bg-brand-50 p-4 dark:border-brand-900 dark:bg-brand-950/50 sm:p-5">
      <p className="label-xs mb-3 text-brand-700 dark:text-brand-300">Key takeaways</p>
      <ul className="space-y-2">
        {lesson.keyTakeaways.map((t) => (
          <li
            key={t}
            className="flex gap-2.5 text-[14px] leading-6 text-brand-950 dark:text-brand-100"
          >
            <Check size={15} className="mt-1 shrink-0 text-brand-600 dark:text-brand-400" strokeWidth={2.5} />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
