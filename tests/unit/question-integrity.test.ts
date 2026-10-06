import { describe, expect, it } from 'vitest'
import { getPracticeQuestions, getTestQuestions, PRACTICE_QUESTIONS, TEST_QUESTIONS } from '@/data/questions'
import { MODULES } from '@/data/modules'
import { isCorrect, QUESTION_TYPE_LABEL } from '@/utils/answers'
import { TEST_LENGTH } from '@/utils/progression'
import type { Question, QuestionType } from '@/types'

const ALL = [...PRACTICE_QUESTIONS, ...TEST_QUESTIONS]
const MODULE_IDS = new Set(MODULES.map((m) => m.id))
const TYPES = Object.keys(QUESTION_TYPE_LABEL) as QuestionType[]
const WITH_OPTIONS: QuestionType[] = ['multiple-choice', 'choose-correct-sentence', 'error-correction']
const TYPED: QuestionType[] = ['fill-blank', 'rewrite']

describe('question bank size', () => {
  it('has 4 practice and 10 test questions for each of the 24 modules (336 in total)', () => {
    expect(MODULES).toHaveLength(24)
    for (const m of MODULES) {
      expect(getPracticeQuestions(m.id), `module ${m.id} practice`).toHaveLength(4)
      expect(getTestQuestions(m.id), `module ${m.id} test`).toHaveLength(TEST_LENGTH)
    }
    expect(PRACTICE_QUESTIONS).toHaveLength(96)
    expect(TEST_QUESTIONS).toHaveLength(240)
  })

  it('returns nothing for an unknown module', () => {
    expect(getPracticeQuestions(999)).toEqual([])
    expect(getTestQuestions(999)).toEqual([])
  })
})

describe('question identity', () => {
  it('has unique ids across practice and test questions', () => {
    const ids = ALL.map((q) => q.id)
    const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i)
    expect(duplicates).toEqual([])
  })

  it('references existing modules only', () => {
    expect(ALL.filter((q) => !MODULE_IDS.has(q.moduleId)).map((q) => q.id)).toEqual([])
  })

  it('uses only known question types and marks no built-in question as AI', () => {
    expect(ALL.filter((q) => !TYPES.includes(q.type)).map((q) => q.id)).toEqual([])
    expect(ALL.filter((q) => q.source === 'ai').map((q) => q.id)).toEqual([])
  })
})

describe.each(ALL.map((q) => [q.id, q] as [string, Question]))('question %s', (_id, q) => {
  it('has question text and an explanation', () => {
    expect(q.question.trim()).not.toBe('')
    expect(q.explanation.trim()).not.toBe('')
    expect(q.answer.trim()).not.toBe('')
  })

  if (WITH_OPTIONS.includes(q.type)) {
    it('has at least two distinct options, one of which is the answer', () => {
      const options = q.options ?? []
      expect(options.length).toBeGreaterThanOrEqual(2)
      // Options may differ only in punctuation (comma splice vs semicolon), so compare them exactly.
      expect(new Set(options).size).toBe(options.length)
      expect(options).toContain(q.answer)
      for (const o of options) expect(o.trim()).not.toBe('')
    })

    it('marks exactly one option as correct', () => {
      expect((q.options ?? []).filter((o) => isCorrect(q, o))).toEqual([q.answer])
    })
  }

  if (TYPED.includes(q.type)) {
    it('is answered by typing, so it has no options', () => {
      expect(q.options ?? []).toEqual([])
    })

    it('accepts its answer and every listed alternative, but not an empty or unrelated answer', () => {
      expect(isCorrect(q, q.answer)).toBe(true)
      for (const alt of q.acceptable ?? []) expect(isCorrect(q, alt), alt).toBe(true)
      expect(isCorrect(q, '')).toBe(false)
      expect(isCorrect(q, 'zzzz unrelated')).toBe(false)
    })
  }

  if (q.type === 'fill-blank') {
    // Most fill-blank items mark a gap with ___; a few are "replace X with one word" instructions.
    it('marks the blank with ___ or asks for one word', () => {
      expect(`${q.question} ${q.prompt ?? ''}`).toMatch(/___|one word/i)
    })
  }
})
