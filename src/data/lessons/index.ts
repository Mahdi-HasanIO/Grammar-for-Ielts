import type { Lesson, LessonLanguage } from '@/types'
import { stage1Lessons } from './stage1'
import { stage2Lessons } from './stage2'
import { stage3Lessons } from './stage3'
import { stage4Lessons } from './stage4'
import { stage5Lessons } from './stage5'
import { stage1LessonsEn } from './en/stage1'
import { stage2LessonsEn } from './en/stage2'
import { stage3LessonsEn } from './en/stage3'
import { stage4LessonsEn } from './en/stage4'
import { stage5LessonsEn } from './en/stage5'

/** Bangla-primary lessons (the original course content). */
export const LESSONS: Lesson[] = [
  ...stage1Lessons,
  ...stage2Lessons,
  ...stage3Lessons,
  ...stage4Lessons,
  ...stage5Lessons,
]

/** English versions with the same module ids and rule ids. */
export const LESSONS_EN: Lesson[] = [
  ...stage1LessonsEn,
  ...stage2LessonsEn,
  ...stage3LessonsEn,
  ...stage4LessonsEn,
  ...stage5LessonsEn,
]

export function getLesson(moduleId: number, language: LessonLanguage = 'bn'): Lesson | undefined {
  const pool = language === 'en' ? LESSONS_EN : LESSONS
  return pool.find((l) => l.moduleId === moduleId)
}
