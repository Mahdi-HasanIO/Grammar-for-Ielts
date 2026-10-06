import { describe, expect, it } from 'vitest'
import { LESSONS, LESSONS_EN, getLesson } from '@/data/lessons'
import { MODULES } from '@/data/modules'
import { MODULES_EN, STAGES_EN } from '@/data/modulesEn'
import { PRACTICE_QUESTIONS, TEST_QUESTIONS } from '@/data/questions'
import type { Lesson, RuleBlock } from '@/types'

/*
 * The Bangla (original) and English lessons are parallel files. They must
 * teach the same thing: same rules in the same order, the same English
 * example sentences, and the same number of items in every list. Only the
 * explanations differ by language.
 */

const MODULE_IDS = MODULES.map((m) => m.id)
const BANGLA = /[ঀ-৿]/

const sentences = (pairs: { wrong?: string; right: string }[] = []) => pairs.map((p) => ({ wrong: p.wrong, right: p.right }))

/** Language-independent shape of a rule: ids, counts and table dimensions. */
function ruleShape(rule: RuleBlock) {
  return {
    id: rule.id,
    structure: rule.structure.length,
    notes: rule.notes?.length ?? 0,
    table: rule.table ? { headers: rule.table.headers.length, rows: rule.table.rows.map((r) => r.length) } : null,
    examples: rule.examples?.length ?? 0,
  }
}

function lessonShape(lesson: Lesson) {
  return {
    rules: lesson.rules.map(ruleShape),
    examples: lesson.examples.length,
    mistakes: lesson.mistakes.length,
    keyTakeaways: lesson.keyTakeaways.length,
  }
}

describe('lesson catalogue', () => {
  it('has 24 modules, numbered 1 to 24', () => {
    expect(MODULE_IDS).toEqual(Array.from({ length: 24 }, (_, i) => i + 1))
  })

  it('has exactly one Bangla and one English lesson per module, in module order', () => {
    expect(LESSONS.map((l) => l.moduleId)).toEqual(MODULE_IDS)
    expect(LESSONS_EN.map((l) => l.moduleId)).toEqual(MODULE_IDS)
  })

  it('selects the language through getLesson()', () => {
    for (const id of MODULE_IDS) {
      expect(getLesson(id, 'bn')).toBe(LESSONS.find((l) => l.moduleId === id))
      expect(getLesson(id, 'en')).toBe(LESSONS_EN.find((l) => l.moduleId === id))
    }
    expect(getLesson(999, 'en')).toBeUndefined()
  })

  it('has English module summaries, IELTS notes and stage text for every module and stage', () => {
    for (const id of MODULE_IDS) {
      expect(MODULES_EN[id]?.summary, `module ${id}`).toBeTruthy()
      expect(MODULES_EN[id]?.ieltsNote, `module ${id}`).toBeTruthy()
    }
    expect(Object.keys(STAGES_EN)).toEqual(['1', '2', '3', '4', '5'])
  })
})

describe.each(MODULE_IDS)('module %i: English/Bangla parity', (id) => {
  const bn = getLesson(id, 'bn')!
  const en = getLesson(id, 'en')!

  it('has matching rule ids in the same order', () => {
    expect(en.rules.map((r) => r.id)).toEqual(bn.rules.map((r) => r.id))
    expect(bn.rules.length).toBeGreaterThan(0)
  })

  it('has rule ids that belong to this module and are unique', () => {
    const ids = bn.rules.map((r) => r.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const ruleId of ids) expect(ruleId).toMatch(new RegExp(`^m${id}-`))
  })

  it('has the same lesson structure and item counts', () => {
    expect(lessonShape(en)).toEqual(lessonShape(bn))
  })

  it('has identical English example sentences in both versions', () => {
    expect(sentences(en.examples)).toEqual(sentences(bn.examples))
    expect(en.mistakes.map((m) => [m.wrong, m.right])).toEqual(bn.mistakes.map((m) => [m.wrong, m.right]))
    en.rules.forEach((rule, i) => {
      expect(sentences(rule.examples), rule.id).toEqual(sentences(bn.rules[i].examples))
    })
  })

  it('is explained in Bangla in the Bangla version and in English in the English version', () => {
    expect(bn.intro).toMatch(BANGLA)
    expect(en.intro).not.toMatch(BANGLA)
    expect(en.intro.length).toBeGreaterThan(40)
  })

  it('has practice and test questions that point at this lesson', () => {
    expect(PRACTICE_QUESTIONS.filter((q) => q.moduleId === id).length).toBeGreaterThan(0)
    expect(TEST_QUESTIONS.filter((q) => q.moduleId === id).length).toBeGreaterThan(0)
  })
})
