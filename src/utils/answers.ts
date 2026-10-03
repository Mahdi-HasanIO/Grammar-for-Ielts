import type { Question } from '@/types'

/** Loose comparison for typed answers: ignores case, punctuation and spacing. */
export function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[.,!?;:"'()]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function isCorrect(question: Question, given: string): boolean {
  if (!given) return false
  const candidate = normalize(given)
  if (candidate === normalize(question.answer)) return true
  return (question.acceptable ?? []).some((a) => normalize(a) === candidate)
}

export function scoreAnswers(
  questions: Question[],
  answers: Record<string, string>,
): number {
  return questions.reduce(
    (total, q) => total + (isCorrect(q, answers[q.id] ?? '') ? 1 : 0),
    0,
  )
}

export const QUESTION_TYPE_LABEL: Record<Question['type'], string> = {
  'multiple-choice': 'Multiple choice',
  'fill-blank': 'Fill in the blank',
  'choose-correct-sentence': 'Choose the correct sentence',
  'error-correction': 'Find the error',
  rewrite: 'Rewrite',
}
