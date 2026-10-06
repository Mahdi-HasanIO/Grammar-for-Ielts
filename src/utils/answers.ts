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

/** Questions answered by typing. Every other type is answered by picking one of its options. */
export function isTypedQuestion(question: Pick<Question, 'type'>): boolean {
  return question.type === 'fill-blank' || question.type === 'rewrite'
}

export function isCorrect(question: Question, given: string): boolean {
  if (!given) return false
  // A picked option is the option string itself, so compare exactly. Normalising would erase the
  // punctuation that distinguishes options such as "rose, however" and "rose; however,".
  if (!isTypedQuestion(question)) return given === question.answer
  return [question.answer, ...(question.acceptable ?? [])].some((accepted) => typedMatches(accepted, given))
}

/** Typed answers ignore case, punctuation and spacing, except when the answer is punctuation itself (":" or ";"). */
function typedMatches(accepted: string, given: string): boolean {
  const expected = normalize(accepted)
  if (expected === '') return withoutSpaces(accepted) === withoutSpaces(given)
  return expected === normalize(given)
}

function withoutSpaces(input: string): string {
  return input.replace(/[‘’]/g, "'").replace(/\s+/g, '')
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
