import { z } from 'zod'

/*
 * Server-side copy of the frontend's versioned progress and bookmark shapes
 * (src/services/progress/schema.ts, src/types, src/repositories/localBookmarkRepository.ts
 * in the React app). Written out here rather than imported: the backend
 * never imports from the frontend. Keep the two in step when the shape
 * changes, and bump PROGRESS_SCHEMA_VERSION together.
 *
 * Like the frontend's strict validator: any invalid field rejects the whole
 * document (400), and unknown fields are dropped, never stored.
 */

export const PROGRESS_SCHEMA_VERSION = 1

/** Same caps as the frontend's PROGRESS_LIMITS and MAX_BOOKMARKS. */
export const PROGRESS_LIMITS = {
  modules: 1_000,
  attempts: 50_000,
  activityDays: 20_000,
  badges: 500,
  badgeIdLength: 64,
  timestampLength: 40,
} as const

export const BOOKMARK_LIMITS = {
  bookmarks: 1_000,
  // Not limited by the frontend; generous bounds so a single entry cannot be huge.
  pathLength: 500,
  titleLength: 500,
} as const

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/
const MODULE_KEY = /^[1-9]\d{0,5}$/

const timestamp = z
  .string('expected an ISO date')
  .max(PROGRESS_LIMITS.timestampLength, 'expected an ISO date')
  .refine((value) => !Number.isNaN(Date.parse(value)), 'expected an ISO date')

const count = z.number('expected a number').int('expected a whole number').min(0).max(Number.MAX_SAFE_INTEGER)
const score = z.number('expected a number').min(0).max(100)

const moduleProgress = z.object({
  moduleId: z.number().int().min(1),
  completed: z.boolean('expected true or false'),
  lessonViewed: z.boolean('expected true or false'),
  practiceCompleted: z.boolean('expected true or false'),
  bestScore: score,
  latestScore: score,
  attempts: count,
  completedAt: timestamp.optional(),
})

const testAttempt = z
  .object({
    moduleId: z.number().int().min(1),
    at: timestamp,
    score: count,
    total: count,
    percentage: score,
    passed: z.boolean('expected true or false'),
  })
  .refine((attempt) => attempt.score <= attempt.total, { message: 'score is greater than total', path: ['score'] })

const dayActivity = z.object({
  date: z.string().regex(DATE_KEY),
  // Minutes come from a timer; fractions are tolerated, as in the frontend.
  minutes: z.number('expected a number').min(0).max(Number.MAX_SAFE_INTEGER),
  modulesCompleted: count,
  testsTaken: count,
  questionsAnswered: count,
  questionsCorrect: count,
})

export const progressState = z
  .object({
    schemaVersion: z.literal(PROGRESS_SCHEMA_VERSION, `expected version ${PROGRESS_SCHEMA_VERSION}`),
    modules: z.record(z.string().regex(MODULE_KEY, 'expected a numeric module id key'), moduleProgress),
    attempts: z.array(testAttempt).max(PROGRESS_LIMITS.attempts, 'too many attempts'),
    activity: z.record(z.string().regex(DATE_KEY, 'expected a YYYY-MM-DD key'), dayActivity),
    badges: z
      .array(z.string().min(1, 'expected a badge id').max(PROGRESS_LIMITS.badgeIdLength, 'expected a badge id'))
      .max(PROGRESS_LIMITS.badges, 'too many badges')
      // The frontend keeps the first of any duplicates; so do we.
      .transform((badges) => [...new Set(badges)]),
    xp: z.number('expected a number').min(0).max(Number.MAX_SAFE_INTEGER),
    startedAt: timestamp,
  })
  .superRefine((state, ctx) => {
    const modules = Object.entries(state.modules)
    if (modules.length > PROGRESS_LIMITS.modules) ctx.addIssue({ code: 'custom', path: ['modules'], message: 'too many modules' })
    for (const [key, value] of modules) {
      if (value.moduleId !== Number(key)) ctx.addIssue({ code: 'custom', path: ['modules', key, 'moduleId'], message: `expected ${key} to match its key` })
    }
    const days = Object.entries(state.activity)
    if (days.length > PROGRESS_LIMITS.activityDays) ctx.addIssue({ code: 'custom', path: ['activity'], message: 'too many days' })
    for (const [key, value] of days) {
      if (value.date !== key) ctx.addIssue({ code: 'custom', path: ['activity', key, 'date'], message: `expected ${key} to match its key` })
    }
  })

export type ProgressState = z.output<typeof progressState>
export type ModuleProgress = z.output<typeof moduleProgress>
export type TestAttempt = z.output<typeof testAttempt>
export type DayActivity = z.output<typeof dayActivity>

const BOOKMARK_KINDS = ['grammar', 'article', 'lesson'] as const

const bookmark = z.object({
  kind: z.enum(BOOKMARK_KINDS, 'expected grammar, article or lesson'),
  path: z
    .string()
    .min(1)
    .max(BOOKMARK_LIMITS.pathLength)
    .refine((path) => path.startsWith('/') && !path.startsWith('//'), 'expected a path inside the app, like /grammar/articles'),
  title: z.string().max(BOOKMARK_LIMITS.titleLength),
  savedAt: timestamp,
})

export const bookmarkList = z
  .array(bookmark)
  .max(BOOKMARK_LIMITS.bookmarks, 'too many bookmarks')
  .superRefine((list, ctx) => {
    const seen = new Set<string>()
    list.forEach((item, index) => {
      if (seen.has(item.path)) ctx.addIssue({ code: 'custom', path: [index, 'path'], message: 'duplicate path' })
      seen.add(item.path)
    })
  })

export type Bookmark = z.output<typeof bookmark>

/** The version the client last saw; 0 when it has never synced. */
const baseVersion = z.number('baseVersion is required').int().min(0)

export const putProgressBody = z.object({ baseVersion, progress: progressState })
export const putBookmarksBody = z.object({ baseVersion, bookmarks: bookmarkList })
