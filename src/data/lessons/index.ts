import type { Lesson } from '@/types'
import { stage1Lessons } from './stage1'
import { stage2Lessons } from './stage2'
import { stage3Lessons } from './stage3'
import { stage4Lessons } from './stage4'
import { stage5Lessons } from './stage5'

export const LESSONS: Lesson[] = [
  ...stage1Lessons,
  ...stage2Lessons,
  ...stage3Lessons,
  ...stage4Lessons,
  ...stage5Lessons,
]

export function getLesson(moduleId: number): Lesson | undefined {
  return LESSONS.find((l) => l.moduleId === moduleId)
}
