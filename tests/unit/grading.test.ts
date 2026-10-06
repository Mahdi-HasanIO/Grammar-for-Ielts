import { describe, expect, it } from 'vitest'
import { PRACTICE_QUESTIONS, TEST_QUESTIONS, getTestQuestions } from '@/data/questions'
import { isCorrect, isTypedQuestion, normalize, scoreAnswers } from '@/utils/answers'
import type { Question, QuestionType } from '@/types'

/*
 * Grading rules:
 * - option-based questions (multiple-choice, choose-correct-sentence,
 *   error-correction): the picked option must be exactly the answer;
 * - typed questions (fill-blank, rewrite): case, punctuation and spacing are
 *   ignored, and listed alternative answers are accepted.
 *
 * Regression: before this fix, option answers were also normalised, so in
 * questions whose options differ only in punctuation every option was graded
 * correct, including in module tests that decide unlocking.
 */

const ALL = [...PRACTICE_QUESTIONS, ...TEST_QUESTIONS]
const byId = (id: string) => ALL.find((q) => q.id === id)!

/** Every question whose options differed only in punctuation when the bug was found. */
const PUNCTUATION_QUESTIONS = ['m5-p1', 'm13-p3', 'm24-p2', 'm5-t2', 'm5-t10', 'm12-t10', 'm13-t2', 'm24-t6']

const question = (type: QuestionType, extra: Partial<Question>): Question => ({
  id: 'x',
  moduleId: 1,
  type,
  question: 'Question?',
  answer: '',
  explanation: 'Because.',
  ...extra,
})

describe('which questions are typed', () => {
  it.each<[QuestionType, boolean]>([
    ['fill-blank', true],
    ['rewrite', true],
    ['multiple-choice', false],
    ['choose-correct-sentence', false],
    ['error-correction', false],
  ])('%s → typed: %s', (type, typed) => {
    expect(isTypedQuestion({ type })).toBe(typed)
  })

  it('matches the data: typed questions have no options, every other question has options', () => {
    for (const q of ALL) expect(Boolean(q.options?.length), q.id).toBe(!isTypedQuestion(q))
  })
})

describe('option-based questions compare exactly', () => {
  const options = ['Costs rose, however demand fell.', 'Costs rose; however, demand fell.', 'Costs rose however; demand fell.']
  const mc = question('multiple-choice', { options, answer: 'Costs rose; however, demand fell.' })

  it('accepts the correct option', () => {
    expect(isCorrect(mc, 'Costs rose; however, demand fell.')).toBe(true)
  })

  it('does not treat options that differ only in punctuation as equivalent', () => {
    // These normalise to the same text, which is exactly why normalising was wrong here.
    expect(new Set(options.map(normalize)).size).toBe(1)
    expect(isCorrect(mc, 'Costs rose, however demand fell.')).toBe(false)
    expect(isCorrect(mc, 'Costs rose however; demand fell.')).toBe(false)
  })

  it('does not accept case or spacing variants of an option', () => {
    expect(isCorrect(mc, 'costs rose; however, demand fell.')).toBe(false)
    expect(isCorrect(mc, ' Costs rose; however, demand fell. ')).toBe(false)
    expect(isCorrect(mc, '')).toBe(false)
  })

  it('applies to choose-correct-sentence and error-correction questions too', () => {
    const ccs = question('choose-correct-sentence', { options: ['A, b.', 'A; b.'], answer: 'A; b.' })
    expect(isCorrect(ccs, 'A; b.')).toBe(true)
    expect(isCorrect(ccs, 'A, b.')).toBe(false)
    const ec = question('error-correction', { options: ['The data', 'shows,', 'a rise', 'in sales'], answer: 'shows,' })
    expect(isCorrect(ec, 'shows,')).toBe(true)
    expect(isCorrect(ec, 'a rise')).toBe(false)
  })

  it('grades AI-generated option questions the same way (their answer is the option string itself)', () => {
    const ai = question('multiple-choice', { source: 'ai', options: ['has', 'have', 'had'], answer: 'has' })
    expect(isCorrect(ai, 'has')).toBe(true)
    expect(isCorrect(ai, 'have')).toBe(false)
  })
})

describe.each(PUNCTUATION_QUESTIONS)('regression: %s', (id) => {
  const q = byId(id)

  it('is an option-based question whose options differ only in punctuation', () => {
    expect(isTypedQuestion(q)).toBe(false)
    const options = q.options ?? []
    expect(new Set(options.map(normalize)).size).toBeLessThan(options.length)
  })

  it('accepts only the correctly punctuated answer', () => {
    for (const option of q.options ?? []) {
      expect(isCorrect(q, option), option).toBe(option === q.answer)
    }
  })
})

describe('module tests score punctuation choices correctly', () => {
  it('a comma splice in module 12’s test costs the mark', () => {
    const questions = getTestQuestions(12)
    const allRight = Object.fromEntries(questions.map((q) => [q.id, q.answer]))
    expect(scoreAnswers(questions, allRight)).toBe(10)
    const spliced = { ...allRight, 'm12-t10': 'Costs rose, however demand fell.' }
    expect(byId('m12-t10').options).toContain('Costs rose, however demand fell.')
    expect(scoreAnswers(questions, spliced)).toBe(9)
  })

  it.each([5, 13, 24])('picking every wrong punctuation option in module %i’s test scores below 10', (moduleId) => {
    const questions = getTestQuestions(moduleId)
    const answers = Object.fromEntries(
      questions.map((q) => [q.id, PUNCTUATION_QUESTIONS.includes(q.id) ? q.options!.find((o) => o !== q.answer)! : q.answer]),
    )
    const affected = questions.filter((q) => PUNCTUATION_QUESTIONS.includes(q.id)).length
    expect(affected).toBeGreaterThan(0)
    expect(scoreAnswers(questions, answers)).toBe(10 - affected)
  })
})

describe('typed questions keep their forgiving comparison', () => {
  const fill = question('fill-blank', { question: 'She ___ to work.', answer: 'goes', acceptable: ['walks'] })
  const rewrite = question('rewrite', {
    question: 'Rewrite in the passive.',
    answer: 'The report was written by the team.',
    acceptable: ["The team's report was written."],
  })

  it('ignores case, punctuation and extra spacing', () => {
    expect(isCorrect(fill, 'GOES')).toBe(true)
    expect(isCorrect(fill, '  goes. ')).toBe(true)
    expect(isCorrect(rewrite, 'the report was written by the team')).toBe(true)
    expect(isCorrect(rewrite, 'The  report was written, by the team!')).toBe(true)
  })

  it('accepts listed alternatives, with the same normalisation and curly apostrophes', () => {
    expect(isCorrect(fill, 'Walks')).toBe(true)
    expect(isCorrect(rewrite, 'The team’s report was written.')).toBe(true)
  })

  it('still rejects wrong or empty answers', () => {
    expect(isCorrect(fill, 'go')).toBe(false)
    expect(isCorrect(fill, '')).toBe(false)
    expect(isCorrect(rewrite, 'The team wrote the report.')).toBe(false)
  })

  it('accepts every real typed answer and its alternatives as typed, and in lower case without punctuation', () => {
    for (const q of ALL.filter(isTypedQuestion)) {
      for (const accepted of [q.answer, ...(q.acceptable ?? [])]) {
        expect(isCorrect(q, accepted), `${q.id}: ${accepted}`).toBe(true)
        // Punctuation-only answers (":" or ";") have nothing left once punctuation is removed; see below.
        if (normalize(accepted) !== '') expect(isCorrect(q, normalize(accepted)), `${q.id}: ${accepted}`).toBe(true)
      }
    }
  })
})

/*
 * Same bug in typed questions whose answer is punctuation itself: normalising
 * reduced the answer to an empty string, so any punctuation the learner typed
 * matched. A punctuation-only answer is now compared with its punctuation.
 */
describe('typed questions whose answer is punctuation', () => {
  it('lists the questions this applies to', () => {
    const punctuationAnswers = ALL.filter(
      (q) => isTypedQuestion(q) && [q.answer, ...(q.acceptable ?? [])].some((a) => normalize(a) === ''),
    ).map((q) => q.id)
    expect(punctuationAnswers).toEqual(['m5-p4', 'm24-p3', 'm5-t3'])
  })

  it('m5-p4 (colon or semicolon?): only the colon is right', () => {
    const q = byId('m5-p4')
    expect(isCorrect(q, ':')).toBe(true)
    expect(isCorrect(q, ' : ')).toBe(true)
    expect(isCorrect(q, 'Colon')).toBe(true)
    expect(isCorrect(q, ';')).toBe(false)
    expect(isCorrect(q, ',')).toBe(false)
    expect(isCorrect(q, 'semicolon')).toBe(false)
  })

  it('m24-p3: only the semicolon is right', () => {
    const q = byId('m24-p3')
    expect(isCorrect(q, ';')).toBe(true)
    expect(isCorrect(q, 'semicolon')).toBe(true)
    expect(isCorrect(q, ',')).toBe(false)
    expect(isCorrect(q, ':')).toBe(false)
  })

  it('m5-t3 (module test): ", and" or ";" is right, a bare comma (comma splice) is not', () => {
    const q = byId('m5-t3')
    expect(isCorrect(q, ', and')).toBe(true)
    expect(isCorrect(q, 'and')).toBe(true)
    expect(isCorrect(q, ';')).toBe(true)
    expect(isCorrect(q, ',')).toBe(false)
    expect(isCorrect(q, ':')).toBe(false)
    expect(isCorrect(q, '.')).toBe(false)
  })
})
