import type { LessonLanguage, Lesson, Question } from '@/types'

/*
 * The lesson and question banks are most of the bundle, so the static
 * content service does not import them itself. Each bank is a "pack" that
 * registers itself when its module is imported:
 *
 * - routes that render lessons or questions import the pack statically
 *   (`import '@/services/content/lessonPack'`), so the data is ready before
 *   the first render and `use()` never suspends: prerendered HTML and
 *   hydration stay identical;
 * - any other caller still works: the service loads the pack on demand and
 *   returns a pending promise, which suspends under the route's <Suspense>.
 */

export interface LessonPack {
  getLesson(legacyId: number, locale: LessonLanguage): Lesson | undefined
}

export interface QuestionPack {
  getPracticeQuestions(legacyId: number): Question[]
  getTestQuestions(legacyId: number): Question[]
}

export const packs: { lessons?: LessonPack; questions?: QuestionPack } = {}

export function registerLessonPack(pack: LessonPack) {
  packs.lessons = pack
}

export function registerQuestionPack(pack: QuestionPack) {
  packs.questions = pack
}

export async function loadLessonPack(): Promise<LessonPack> {
  await import('./lessonPack')
  return packs.lessons!
}

export async function loadQuestionPack(): Promise<QuestionPack> {
  await import('./questionPack')
  return packs.questions!
}
