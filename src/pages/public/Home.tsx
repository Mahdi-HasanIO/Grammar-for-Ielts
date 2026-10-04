import { useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpenText,
  Check,
  CloudOff,
  Download,
  Flame,
  Languages,
  Library,
  ListChecks,
  Route,
  ShieldCheck,
  Sparkles,
  Target,
  TriangleAlert,
  Wand2,
  X,
} from 'lucide-react'
import { MODULES, STAGES } from '@/data/modules'
import { STAGES_EN } from '@/data/modulesEn'
import { FEATURED_TOPIC_SLUGS, GRAMMAR_TOPICS, topicBySlug } from '@/data/grammarTopics'
import { BLOG_POSTS, featuredPost } from '@/data/blog/posts'
import { buttonClasses } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Reveal } from '@/components/ui/Reveal'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { Blob, CountUp, Parallax } from '@/components/public/motion'
import {
  BlogCard,
  Container,
  Eyebrow,
  FeaturedPostCard,
  GrammarCard,
  SectionHeading,
} from '@/components/public/PublicUi'
import { useCourseCta } from '@/hooks/useCourseCta'
import { cn } from '@/utils/cn'
import { OfflineDownload } from '@/components/OfflineDownload'

/** Every module has 4 practice questions and a 10-question test. */
const QUESTION_COUNT = MODULES.length * 14

const stagger = (i: number) => ({ '--i': i }) as CSSProperties

/* ------------------------------- Hero -------------------------------- */

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      {/* Main lesson card */}
      <div className="float-slow relative z-10 rounded-3xl border border-ink-200/80 bg-white/90 p-5 shadow-lift backdrop-blur sm:p-6 dark:border-ink-800 dark:bg-ink-900/90">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-600 font-display text-[17px] font-extrabold text-white shadow-glow">
            2
          </span>
          <div className="min-w-0">
            <p className="label-xs">Stage 1 · Foundation</p>
            <p className="truncate text-[15px] font-bold text-ink-900 dark:text-ink-50">Subject-Verb Agreement</p>
          </div>
        </div>
        <div className="mt-5 space-y-2.5">
          <p className="flex gap-2.5 rounded-xl bg-rose-50 px-3.5 py-2.5 font-serif text-[14.5px] leading-6 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950">
              <X size={12} strokeWidth={3} />
            </span>
            <span className="line-through decoration-rose-300/80">The number of cars have increased.</span>
          </p>
          <p className="flex gap-2.5 rounded-xl bg-emerald-50 px-3.5 py-2.5 font-serif text-[14.5px] leading-6 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 animate-pop-in items-center justify-center rounded-full bg-emerald-100 [animation-delay:900ms] dark:bg-emerald-950">
              <Check size={12} strokeWidth={3} />
            </span>
            The number of cars has increased.
          </p>
        </div>
        <p className="mt-4 border-t border-dashed border-ink-200 pt-3 text-[13px] leading-6 text-ink-600 dark:border-ink-700 dark:text-ink-400">
          <span className="font-semibold text-ink-800 dark:text-ink-200">The number of</span> refers to one figure, so
          the verb is singular.
        </p>
      </div>

      {/* Floating progress card */}
      <div className="float-slower absolute -right-3 -top-10 z-20 hidden items-center gap-3 rounded-2xl border border-ink-200/80 bg-white/95 p-3 pr-4 shadow-lift backdrop-blur sm:flex lg:-right-8 dark:border-ink-800 dark:bg-ink-900/95">
        <div className="relative">
          <ProgressRing value={90} size={52} stroke={6} label="" />
          <Check size={18} strokeWidth={3} className="absolute inset-0 m-auto text-emerald-500" />
        </div>
        <div>
          <p className="text-[12px] font-semibold text-ink-500 dark:text-ink-400">Module test</p>
          <p className="text-[14px] font-bold text-emerald-600 dark:text-emerald-400">Passed · 9/10</p>
        </div>
      </div>

      {/* Floating language chip */}
      <div className="float-slower absolute -bottom-6 -left-3 z-20 hidden items-center gap-1 rounded-xl border border-ink-200/80 bg-white/95 p-1 shadow-lift backdrop-blur sm:flex lg:-left-8 dark:border-ink-800 dark:bg-ink-900/95">
        <Languages size={14} className="ml-2 mr-1 text-ink-400" />
        <span className="rounded-lg bg-brand-50 px-3 py-1.5 text-[12.5px] font-semibold text-brand-700 dark:bg-brand-950/70 dark:text-brand-200">
          English
        </span>
        <span lang="bn" className="px-3 py-1.5 text-[12.5px] font-semibold text-ink-500 dark:text-ink-400">
          বাংলা
        </span>
      </div>

      {/* Floating streak chip */}
      <div className="float-slow absolute -bottom-4 right-6 z-20 hidden items-center gap-2 rounded-full border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50 px-3.5 py-2 text-[13px] font-semibold text-amber-800 shadow-lift md:flex dark:border-amber-900/60 dark:from-amber-950/80 dark:to-orange-950/60 dark:text-amber-200">
        <Flame size={15} className="text-orange-500" /> 7-day streak
      </div>
    </div>
  )
}

function TopicTicker() {
  const names = GRAMMAR_TOPICS.map((t) => t.name)
  const row = (copy: boolean) => (
    <div className="flex shrink-0 gap-2.5 pr-2.5" {...(copy ? { 'data-copy': '', 'aria-hidden': true } : {})}>
      {names.map((name, i) => {
        const topic = GRAMMAR_TOPICS[i]
        return (
          <Link
            key={name}
            to={`/grammar/${topic.slug}`}
            tabIndex={copy ? -1 : undefined}
            className="whitespace-nowrap rounded-full border border-ink-200/80 bg-white/70 px-3.5 py-1.5 text-[13px] font-medium text-ink-600 backdrop-blur transition-colors hover:border-brand-300 hover:text-brand-700 focus-ring dark:border-ink-800 dark:bg-ink-900/60 dark:text-ink-300 dark:hover:border-brand-700 dark:hover:text-brand-200"
          >
            {name}
          </Link>
        )
      })}
    </div>
  )
  return (
    <div className="marquee overflow-hidden py-1" aria-label="Grammar topics">
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}

function Hero() {
  const cta = useCourseCta()
  return (
    <section className="relative isolate overflow-hidden pb-16 pt-10 sm:pt-16 lg:pb-24">
      {/* Decorative background */}
      <Parallax speed={0.12} className="pointer-events-none absolute inset-0 -z-10">
        <Blob className="-left-24 top-0 h-72 w-72 bg-brand-400/30 dark:bg-brand-500/20" />
        <Blob className="right-[-6rem] top-24 h-80 w-80 bg-accent-400/25 [animation-delay:-6s] dark:bg-accent-500/15" />
      </Parallax>
      <Parallax speed={-0.05} className="pointer-events-none absolute inset-0 -z-10">
        <Blob className="bottom-0 left-1/3 h-64 w-64 bg-sky-300/25 [animation-delay:-11s] dark:bg-sky-500/10" />
      </Parallax>
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] dark:opacity-[0.15]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(148 160 180 / 0.35) 1px, transparent 0)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
        aria-hidden
      />

      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
          <div>
            <p
              className="inline-flex animate-fade-up stagger items-center gap-2 rounded-full border border-brand-200/80 bg-white/70 px-3 py-1.5 text-[12.5px] font-semibold text-brand-700 shadow-card backdrop-blur dark:border-brand-800/60 dark:bg-ink-900/60 dark:text-brand-200"
              style={stagger(0)}
            >
              <Sparkles size={13} className="animate-sparkle" />
              IELTS Writing grammar · Band 7 to 8+
            </p>
            <h1
              className="mt-5 animate-fade-up stagger text-[38px] font-extrabold leading-[1.05] tracking-tight text-ink-900 sm:text-[52px] lg:text-[58px] dark:text-ink-50"
              style={stagger(1)}
            >
              Master the grammar behind{' '}
              <span className="text-gradient animate-gradient-pan bg-[length:200%_auto]">Band 8 writing</span>
            </h1>
            <p
              className="mt-5 max-w-xl animate-fade-up stagger text-[16.5px] leading-8 text-ink-600 dark:text-ink-300"
              style={stagger(2)}
            >
              A step-by-step course that fixes the errors examiners see most, then builds the complex
              structures and academic style that higher bands reward. Learn in English or বাংলা, practise
              with instant feedback, and track every step.
            </p>
            <div className="mt-8 flex animate-fade-up stagger flex-col gap-3 sm:flex-row" style={stagger(3)}>
              <Link to={cta.to} className={buttonClasses({ size: 'lg', className: 'group' })}>
                {cta.started ? 'Continue Course' : 'Start Course'}
                <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link to="/grammar" className={buttonClasses({ size: 'lg', variant: 'secondary', className: 'group' })}>
                <Library size={17} className="transition-transform duration-300 group-hover:-rotate-6" />
                Browse Grammar
              </Link>
            </div>
            <ul
              className="mt-8 flex animate-fade-up stagger flex-wrap gap-x-5 gap-y-2 text-[13.5px] font-medium text-ink-600 dark:text-ink-400"
              style={stagger(4)}
            >
              {['Free to use', 'English + বাংলা lessons', 'No sign-up needed'].map((item) => (
                <li key={item} className="inline-flex items-center gap-1.5">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                    <Check size={11} strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="animate-fade-up stagger px-4 sm:px-8 lg:px-0" style={stagger(3)}>
            <HeroVisual />
          </div>
        </div>
      </Container>

      <div className="mt-16 animate-fade-in [animation-delay:600ms] lg:mt-20">
        <TopicTicker />
      </div>
    </section>
  )
}

/* ------------------------------ Stats -------------------------------- */

function Stats() {
  const stats = [
    { value: MODULES.length, suffix: '', label: 'Structured modules' },
    { value: STAGES.length, suffix: '', label: 'Learning stages' },
    { value: QUESTION_COUNT, suffix: '+', label: 'Practice & test questions' },
    { value: 2, suffix: '', label: 'Languages per lesson' },
  ]
  return (
    <section aria-label="Course in numbers">
      <Container>
        <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-accent-600 p-6 text-white shadow-glow-lg sm:p-10">
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-accent-400/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-brand-300/25 blur-3xl" />
          <dl className="relative grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse items-center lg:items-start">
                <dt className="mt-1.5 text-center text-[13px] font-medium text-white/75 lg:text-left">{s.label}</dt>
                <dd className="font-display text-[38px] font-extrabold leading-none tracking-tight sm:text-[46px]">
                  <CountUp value={s.value} suffix={s.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  )
}

/* -------------------------- Course overview -------------------------- */

function CourseOverview() {
  const cta = useCourseCta()
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="The course"
          title="Five stages, in the order that raises your score"
          description="Accuracy first, then complexity, then control. Each module unlocks when you pass the one before it, so advanced grammar always rests on secure foundations."
          action={
            <Link to={cta.to} className={buttonClasses({ variant: 'secondary', className: 'group' })}>
              {cta.label}
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          }
        />
        <ol className="relative grid gap-4 md:grid-cols-5">
          <span
            className="pointer-events-none absolute left-[22px] top-6 hidden h-0.5 w-[calc(100%-44px)] bg-gradient-to-r from-brand-200 via-accent-200 to-brand-200 md:block dark:from-brand-900 dark:via-accent-600/30 dark:to-brand-900"
            aria-hidden
          />
          {STAGES.map((stage, i) => {
            const modules = MODULES.filter((m) => m.stage === stage.id)
            return (
              <Reveal as="li" key={stage.id} delay={i * 90} className="relative">
                <div className="glow-card group flex h-full items-start gap-4 rounded-2xl border border-ink-200/80 bg-white p-4 shadow-card transition-[transform,box-shadow] duration-300 ease-spring hover:-translate-y-1 hover:shadow-lift sm:p-5 md:block dark:border-ink-800 dark:bg-ink-900">
                  <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-600 font-display text-[16px] font-extrabold text-white shadow-glow transition-transform duration-300 ease-bounce group-hover:scale-110">
                    {stage.id}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[16px] font-bold tracking-tight text-ink-900 md:mt-4 dark:text-ink-50">{stage.name}</h3>
                    <p className="mt-1 text-[13.5px] leading-6 text-ink-600 md:mt-1.5 dark:text-ink-400">{STAGES_EN[stage.id].tagline}</p>
                    <p className="mt-2 text-[12px] font-semibold text-brand-600 md:mt-3 dark:text-brand-300">
                      Modules {modules[0].id}-{modules[modules.length - 1].id} · {modules.length} lessons
                    </p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </ol>
      </Container>
    </section>
  )
}

/* -------------------------- Featured grammar ------------------------- */

function FeaturedGrammar() {
  const topics = FEATURED_TOPIC_SLUGS.map((s) => topicBySlug(s)).filter((t) => t !== undefined)
  return (
    <section className="relative isolate py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-brand-50/60 to-transparent dark:via-brand-950/20" />
      <Container>
        <SectionHeading
          eyebrow="Grammar library"
          title="Browse any topic, any time"
          description="Every grammar point in the course has its own page with the key rules, common mistakes and quick practice. No need to start the course first."
          action={
            <Link to="/grammar" className={buttonClasses({ variant: 'secondary', className: 'group' })}>
              Browse Grammar
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic, i) => (
            <Reveal key={topic.slug} delay={(i % 3) * 90} className="reveal-scale h-full">
              <GrammarCard topic={topic} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

/* ---------------------------- Bilingual ------------------------------ */

const SAMPLE = {
  en: {
    heading: 'Find the head noun, then match the verb',
    rule: 'The verb agrees with the head noun of the subject, not with whichever noun happens to sit just before the verb.',
    tip: 'Mentally skip everything between the head noun and the verb, then check the match.',
  },
  bn: {
    heading: 'আসল Head Noun খুঁজে তারপর Verb মেলান',
    rule: 'Verb মিলবে Subject noun phrase-এর head noun-এর সঙ্গে, Verb-এর ঠিক আগে বসা Noun-এর সঙ্গে নয়।',
    tip: 'মনে মনে head noun আর Verb-এর মাঝের অংশটুকু বাদ দিয়ে পড়ুন, তারপর মিলিয়ে দেখুন।',
  },
}

function Bilingual() {
  const [lang, setLang] = useState<'en' | 'bn'>('bn')
  const sample = SAMPLE[lang]
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <Eyebrow className="mb-3">English + বাংলা</Eyebrow>
            <h2 className="text-[26px] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[34px] dark:text-ink-50">
              Understand every rule in the language you think in
            </h2>
            <p className="mt-4 text-[15.5px] leading-7 text-ink-600 dark:text-ink-400">
              Every lesson has complete English and Bangla versions of the rules, explanations, common
              mistakes, tips and IELTS guidance. Example sentences stay in English, so you always practise
              the language you will write in the exam.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                'Choose your language once; switch inside any lesson',
                'Natural, easy Bangla, not word-for-word translation',
                'Grammar terms kept in English so they match the exam',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[14.5px] text-ink-700 dark:text-ink-300">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120} className="reveal-scale">
            <div className="glow-card rounded-3xl border border-ink-200/80 bg-white p-5 shadow-lift sm:p-6 dark:border-ink-800 dark:bg-ink-900">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="label-xs">Try it · Module 2, Rule 1</p>
                <div
                  role="radiogroup"
                  aria-label="Sample language"
                  className="inline-flex gap-1 rounded-xl border border-ink-200 bg-ink-50 p-1 dark:border-ink-700 dark:bg-ink-800/60"
                >
                  {(['en', 'bn'] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      role="radio"
                      aria-checked={lang === l}
                      lang={l}
                      onClick={() => setLang(l)}
                      className={cn(
                        'min-h-[32px] rounded-lg px-3 text-[13px] font-semibold transition-all duration-200 focus-ring',
                        lang === l
                          ? 'bg-white text-brand-700 shadow-card ring-1 ring-ink-200/80 dark:bg-ink-900 dark:text-brand-200 dark:ring-ink-700'
                          : 'text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-100',
                      )}
                    >
                      {l === 'en' ? 'English' : 'বাংলা'}
                    </button>
                  ))}
                </div>
              </div>
              {/* Both versions share one grid cell so the card never changes height. */}
              <div className="mt-5 grid">
                {(['en', 'bn'] as const).map((l) => (
                  <div
                    key={l}
                    lang={l}
                    aria-hidden={lang !== l}
                    className={cn(
                      'col-start-1 row-start-1 transition-[opacity,transform] duration-500 ease-spring',
                      lang === l ? 'opacity-100' : 'pointer-events-none translate-y-2 opacity-0',
                    )}
                  >
                    <h3 className="text-[17px] font-bold tracking-tight text-ink-900 dark:text-ink-50">{SAMPLE[l].heading}</h3>
                    <p className="bn-text mt-3 text-[15px] text-ink-700 dark:text-ink-300">{SAMPLE[l].rule}</p>
                    <p className="bn-text mt-4 rounded-xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-[14px] text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
                      {SAMPLE[l].tip}
                    </p>
                  </div>
                ))}
              </div>
              <span className="sr-only" aria-live="polite">
                {sample.heading}
              </span>
              <p className="mt-4 rounded-xl border-l-[3px] border-brand-400 bg-ink-50 px-4 py-2.5 font-serif text-[14.5px] text-ink-800 dark:border-brand-600 dark:bg-ink-800/50 dark:text-ink-100">
                The effects of the policy are visible. (head = effects)
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

/* ------------------------- AI + offline features --------------------- */

function Features() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
          {/* AI practice */}
          <Reveal className="h-full">
            <div className="relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-ink-900 via-ink-900 to-brand-950 p-6 text-white shadow-lift sm:p-8 dark:ring-1 dark:ring-ink-800">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/30 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-accent-500/20 blur-3xl" />
              <div className="relative">
                <Badge tone="ai" className="bg-white/10 text-white ring-white/20 dark:bg-white/10 dark:text-white">
                  <Sparkles size={12} /> AI practice
                </Badge>
                <h2 className="mt-4 text-[24px] font-extrabold leading-tight tracking-tight sm:text-[30px]">
                  Fresh questions for every lesson, whenever you want them
                </h2>
                <p className="mt-3 max-w-xl text-[15px] leading-7 text-white/75">
                  Connect a free Gemini key once and every lesson can generate new IELTS-style questions on
                  exactly the rule you just learned, at warm-up, mixed or challenge level, with instant
                  explanations.
                </p>
                <div className="mt-6 rounded-2xl bg-white/[0.07] p-4 ring-1 ring-inset ring-white/15 backdrop-blur">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-white/60">Question 3 of 5</p>
                    <span className="rounded-full bg-amber-400/20 px-2.5 py-0.5 text-[11px] font-semibold text-amber-200">Challenge</span>
                  </div>
                  <p className="mt-2 font-serif text-[15.5px] leading-7">
                    Although the scheme was popular, ___ it was cancelled.
                  </p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {['but', '(no word)'].map((opt, i) => (
                      <span
                        key={opt}
                        className={cn(
                          'flex items-center gap-2 rounded-xl px-3 py-2 text-[14px] ring-1 ring-inset',
                          i === 1 ? 'bg-emerald-400/15 text-emerald-100 ring-emerald-300/40' : 'bg-white/5 text-white/70 ring-white/10',
                        )}
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white/10 text-[11px] font-bold">
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                        {i === 1 ? <Check size={14} className="ml-auto text-emerald-300" /> : null}
                      </span>
                    ))}
                  </div>
                </div>
                <Link
                  to="/practice"
                  className={buttonClasses({
                    variant: 'secondary',
                    className:
                      'group mt-6 border-transparent bg-white text-ink-900 hover:bg-white hover:shadow-glow-lg dark:border-transparent dark:bg-white dark:text-ink-900 dark:hover:bg-white',
                  })}
                >
                  <Wand2 size={16} />
                  Practice Now
                  <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Offline preview */}
          <Reveal delay={120} className="h-full">
            <div className="glow-card relative flex h-full flex-col overflow-hidden rounded-3xl border border-ink-200/80 bg-white p-6 shadow-card sm:p-8 dark:border-ink-800 dark:bg-ink-900">
              <div className="flex items-center justify-between gap-3">
                <span className="icon-chip h-12 w-12 bg-gradient-to-br from-sky-50 to-brand-50 text-sky-600 ring-sky-200/70 dark:from-sky-950/60 dark:to-brand-950 dark:text-sky-300 dark:ring-sky-800/60">
                  <CloudOff size={22} />
                </span>
                <Badge tone="success">Works offline</Badge>
              </div>
              <h2 className="mt-5 text-[22px] font-extrabold leading-tight tracking-tight text-ink-900 dark:text-ink-50">
                Offline learning
              </h2>
              <p className="mt-3 text-[14.5px] leading-7 text-ink-600 dark:text-ink-400">
                Install Grammar for IELTS on your phone and keep studying on the bus, in a power cut or
                anywhere without a connection. Lessons, practice and your progress all work offline.
              </p>
              <ul className="mt-5 space-y-2.5 text-[14px] text-ink-700 dark:text-ink-300">
                {[
                  { icon: Download, text: 'Install like an app' },
                  { icon: BookOpenText, text: 'Read every lesson offline' },
                  { icon: ShieldCheck, text: 'Progress stays on your device' },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-2.5">
                    <Icon size={16} className="shrink-0 text-sky-600 dark:text-sky-400" />
                    {text}
                  </li>
                ))}
              </ul>
              <OfflineDownload variant="plain" className="mt-6 border-t border-dashed border-ink-200 pt-5 dark:border-ink-800" />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

/* ------------------------------- Why --------------------------------- */

const WHY = [
  {
    icon: Route,
    title: 'Built in the right order',
    text: 'Sequential modules fix the errors that cost the most marks before moving to advanced structures.',
  },
  {
    icon: Target,
    title: 'Focused on IELTS',
    text: 'Every lesson explains how much the structure matters for Band 8, so you spend time where it counts.',
  },
  {
    icon: TriangleAlert,
    title: 'Learn from real mistakes',
    text: 'Each topic shows the exact errors examiners see, with the correction and the reason behind it.',
  },
  {
    icon: ListChecks,
    title: 'Test every step',
    text: 'A 10-question test closes each module. Score 80% to unlock the next one and earn your progress.',
  },
  {
    icon: Flame,
    title: 'Stay motivated',
    text: 'Daily goals, streaks, badges and a progress dashboard keep your study habit going.',
  },
  {
    icon: ShieldCheck,
    title: 'Private by design',
    text: 'No account and no server. Your progress is stored only in your own browser.',
  },
]

function Why() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Why Grammar for IELTS"
          title="Everything you need to make your grammar exam-ready"
          description="Designed around the IELTS band descriptors: accuracy first, then range, then the judgement to use both well."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WHY.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={(i % 3) * 90} className="h-full">
              <div className="group h-full rounded-2xl border border-ink-200/80 bg-white/70 p-6 backdrop-blur-sm transition-[transform,box-shadow,background-color] duration-300 ease-spring hover:-translate-y-1 hover:bg-white hover:shadow-lift dark:border-ink-800 dark:bg-ink-900/60 dark:hover:bg-ink-900">
                <span className="icon-chip h-11 w-11 bg-gradient-to-br from-brand-50 to-cyan-50 text-brand-600 ring-brand-200/70 transition-transform duration-300 ease-bounce group-hover:-translate-y-0.5 group-hover:scale-110 dark:from-brand-950 dark:to-cyan-950/50 dark:text-brand-300 dark:ring-brand-800/60">
                  <Icon size={20} />
                </span>
                <h3 className="mt-4 text-[16.5px] font-bold tracking-tight text-ink-900 dark:text-ink-50">{title}</h3>
                <p className="mt-2 text-[14px] leading-6 text-ink-600 dark:text-ink-400">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

/* ------------------------------- Blog -------------------------------- */

function LatestPosts() {
  const featured = featuredPost()
  const latest = BLOG_POSTS.filter((p) => p.slug !== featured.slug).slice(0, 3)
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="From the blog"
          title="Grammar advice for IELTS writers"
          action={
            <Link to="/blog" className={buttonClasses({ variant: 'secondary', className: 'group' })}>
              Read Articles
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          }
        />
        <Reveal>
          <FeaturedPostCard post={featured} />
        </Reveal>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {latest.map((post, i) => (
            <Reveal key={post.slug} delay={i * 90} className="h-full">
              <BlogCard post={post} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

/* ---------------------------- Final CTA ------------------------------ */

function FinalCta() {
  const cta = useCourseCta()
  return (
    <section className="pt-8">
      <Container>
        <Reveal className="reveal-scale">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-accent-600 px-6 py-12 text-center text-white shadow-glow-lg sm:px-12 sm:py-16">
            <Blob className="-left-10 -top-16 h-56 w-56 bg-white/20" />
            <Blob className="-bottom-20 right-0 h-64 w-64 bg-accent-400/40 [animation-delay:-8s]" />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-[28px] font-extrabold leading-tight tracking-tight sm:text-[38px]">
                Your next essay can have fewer errors than your last
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[15.5px] leading-7 text-white/80">
                Start with Module 1 today. It takes about twelve minutes, and it fixes the error that costs
                the most marks.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  to={cta.to}
                  className={buttonClasses({
                    size: 'lg',
                    variant: 'secondary',
                    className:
                      'group border-transparent bg-white text-brand-700 hover:bg-white hover:shadow-lift dark:border-transparent dark:bg-white dark:text-brand-700 dark:hover:bg-white',
                  })}
                >
                  {cta.label}
                  <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/dashboard"
                  className={buttonClasses({
                    size: 'lg',
                    variant: 'ghost',
                    className: 'text-white ring-1 ring-inset ring-white/30 hover:bg-white/10 hover:text-white dark:text-white dark:hover:bg-white/10',
                  })}
                >
                  Open Dashboard
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

export function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <CourseOverview />
      <FeaturedGrammar />
      <Bilingual />
      <Features />
      <Why />
      <LatestPosts />
      <FinalCta />
    </>
  )
}
