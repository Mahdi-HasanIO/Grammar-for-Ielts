import type { Question } from '@/types'
import { stage1Practice, stage1Test } from './stage1'
import { stage2Practice, stage2Test } from './stage2'
import { stage3Practice, stage3Test } from './stage3'
import { stage4Practice, stage4Test } from './stage4'
import { stage5Practice, stage5Test } from './stage5'

export const PRACTICE_QUESTIONS: Question[] = [
  ...stage1Practice,
  ...stage2Practice,
  ...stage3Practice,
  ...stage4Practice,
  ...stage5Practice,
]

export const TEST_QUESTIONS: Question[] = [
  ...stage1Test,
  ...stage2Test,
  ...stage3Test,
  ...stage4Test,
  ...stage5Test,
]

export function getPracticeQuestions(moduleId: number): Question[] {
  return PRACTICE_QUESTIONS.filter((q) => q.moduleId === moduleId)
}

export function getTestQuestions(moduleId: number): Question[] {
  return TEST_QUESTIONS.filter((q) => q.moduleId === moduleId)
}
