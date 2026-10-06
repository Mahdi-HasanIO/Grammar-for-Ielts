/* ------------------------------------------------------------------ *
 * Domain types. Content files are typed against these, so adding a
 * new module or question is a data change, never a UI change.
 * ------------------------------------------------------------------ */

export type StageId = 1 | 2 | 3 | 4 | 5

/** Language the lesson explanations are shown in. Examples stay in English either way. */
export type LessonLanguage = 'en' | 'bn'

export interface Stage {
  id: StageId
  name: string
  tagline: string
  description: string
}

export type Difficulty =
  | 'Elementary'
  | 'Intermediate'
  | 'Upper-Intermediate'
  | 'Advanced'
  | 'Proficient'

/** How much a structure actually matters for IELTS Writing Band 8+. */
export type IeltsPriority =
  | 'Essential for Band 8'
  | 'High-value enhancement'
  | 'Optional'

export type IeltsImportance = 'Very High' | 'High' | 'Medium' | 'Situational'

export interface ModuleMeta {
  id: number
  slug: string
  title: string
  stage: StageId
  difficulty: Difficulty
  /** Short line shown on course cards. */
  summary: string
  /** Minutes to read and understand the lesson (practice is extra). */
  estimatedMinutes: number
  /** Grammar points covered, shown as chips on the module page. */
  topics: string[]
  ielts: {
    importance: IeltsImportance
    priority: IeltsPriority
    note: string
  }
}

/* ----------------------------- Lessons ---------------------------- */

export interface ExamplePair {
  wrong?: string
  right: string
  note?: string
}

export interface RuleTable {
  caption?: string
  headers: string[]
  rows: string[][]
}

/** One teaching unit inside a lesson: Rule -> When -> Structure -> Notes. */
export interface RuleBlock {
  id: string
  heading: string
  rule: string
  whenToUse: string
  structure: string[]
  notes?: string[]
  table?: RuleTable
  examples?: ExamplePair[]
}

export interface CommonMistake {
  wrong: string
  right: string
  explanation: string
}

export interface Lesson {
  moduleId: number
  /** One-paragraph framing of why this module exists. */
  intro: string
  rules: RuleBlock[]
  /** Worked examples shown in the Examples section. */
  examples: ExamplePair[]
  mistakes: CommonMistake[]
  /** Short actionable reminders shown at the end of the lesson. */
  keyTakeaways: string[]
}

/* ---------------------------- Questions --------------------------- */

export type QuestionType =
  | 'multiple-choice'
  | 'fill-blank'
  | 'choose-correct-sentence'
  | 'error-correction'
  | 'rewrite'

export interface Question {
  id: string
  moduleId: number
  type: QuestionType
  /** Instruction or carrier sentence. Use ___ to mark a blank. */
  question: string
  /** Extra context shown above the question (e.g. the sentence to fix). */
  prompt?: string
  /** Present for every type except 'fill-blank' and 'rewrite'. */
  options?: string[]
  /** The single correct answer. */
  answer: string
  /** Additional accepted answers for typed responses. */
  acceptable?: string[]
  explanation: string
  /** Set on AI-generated questions so the UI can label them. */
  source?: 'ai' | 'static'
  /** Relative difficulty inside the module (AI-generated questions only). */
  level?: 'easy' | 'medium' | 'hard'
  /** Short context label such as "IELTS Task 2" (AI-generated questions only). */
  context?: string
}

/* ---------------------------- Progress ---------------------------- */

export interface TestAttempt {
  moduleId: number
  /** ISO timestamp. */
  at: string
  score: number
  total: number
  percentage: number
  passed: boolean
}

export interface ModuleProgress {
  moduleId: number
  completed: boolean
  lessonViewed: boolean
  practiceCompleted: boolean
  bestScore: number
  latestScore: number
  attempts: number
  completedAt?: string
}

export interface DayActivity {
  /** YYYY-MM-DD in local time. */
  date: string
  minutes: number
  modulesCompleted: number
  testsTaken: number
  questionsAnswered: number
  questionsCorrect: number
}

export interface Preferences {
  theme: 'light' | 'dark' | 'system'
  dailyGoalMinutes: number
  showHints: boolean
}

export interface ProgressState {
  /**
   * Version of this stored shape (see services/progress/migrations.ts).
   * Absent in data saved before versioning; migrated to 1 on load.
   */
  schemaVersion: number
  modules: Record<number, ModuleProgress>
  attempts: TestAttempt[]
  activity: Record<string, DayActivity>
  badges: string[]
  xp: number
  startedAt: string
}

export type BookmarkKind = 'grammar' | 'article' | 'lesson'

export interface Bookmark {
  kind: BookmarkKind
  /** Path inside the app, e.g. /grammar/articles. Doubles as the unique id. */
  path: string
  title: string
  /** ISO timestamp. */
  savedAt: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
}
