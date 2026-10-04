import { MODULES } from '@/data/modules'
import type { ModuleMeta } from '@/types'

/*
 * Public grammar topics. Each one is a friendly URL onto an existing course
 * module, so the grammar pages and the course always share the same content.
 */

export interface GrammarTopic {
  slug: string
  moduleId: number
  /** Short, search-friendly name used on cards and in URLs. */
  name: string
  /** One or two sentences for the topic card and page intro. */
  description: string
  /** Slugs of closely related topics. */
  related: string[]
}

const TOPICS: GrammarTopic[] = [
  {
    slug: 'sentence-structure',
    moduleId: 1,
    name: 'Sentence Structure & Word Order',
    description:
      'Subjects, verbs, objects and complements: the five building blocks of every clause, and the word order that holds them together.',
    related: ['subject-verb-agreement', 'sentence-boundaries', 'pronouns'],
  },
  {
    slug: 'subject-verb-agreement',
    moduleId: 2,
    name: 'Subject-Verb Agreement',
    description:
      'Match the verb to the real subject, even when the subject is long, uncountable or starts with there, each or a number of.',
    related: ['sentence-structure', 'articles', 'parallelism'],
  },
  {
    slug: 'articles',
    moduleId: 3,
    name: 'Articles (a, an, the)',
    description:
      'A step-by-step way to choose a, an, the or no article at all, plus the quantifiers that go with countable and uncountable nouns.',
    related: ['subject-verb-agreement', 'pronouns', 'nominalization'],
  },
  {
    slug: 'pronouns',
    moduleId: 4,
    name: 'Pronoun Reference',
    description:
      'Make every it, they and this point clearly to one noun, and use summary nouns so readers never have to guess.',
    related: ['cohesion', 'articles', 'information-structure'],
  },
  {
    slug: 'sentence-boundaries',
    moduleId: 5,
    name: 'Sentence Boundaries & Punctuation',
    description:
      'Fix fragments, run-ons and comma splices, and learn the punctuation that goes with however and therefore.',
    related: ['linking-clauses', 'sentence-structure', 'register-and-punctuation'],
  },
  {
    slug: 'tenses',
    moduleId: 6,
    name: 'Tenses',
    description:
      'The handful of tenses IELTS writing really needs, how to read the time frame of a Task 1 chart, and how to stay consistent.',
    related: ['modal-verbs', 'passive-voice', 'conditionals'],
  },
  {
    slug: 'modal-verbs',
    moduleId: 7,
    name: 'Modal Verbs',
    description:
      'Use can, may, might, should and must to express certainty and obligation precisely, without overstating your argument.',
    related: ['hedging', 'conditionals', 'tenses'],
  },
  {
    slug: 'passive-voice',
    moduleId: 8,
    name: 'Passive Voice',
    description:
      'Form the passive in every tense, use it for Task 1 processes and impersonal reporting, and know when the active is better.',
    related: ['tenses', 'information-structure', 'participial-clauses'],
  },
  {
    slug: 'verb-patterns',
    moduleId: 9,
    name: 'Verb Patterns (Gerunds & Infinitives)',
    description:
      'Learn which verbs take -ing, which take to-infinitive and which need an object first: suggest doing, allow people to do.',
    related: ['prepositions', 'modal-verbs', 'noun-clauses'],
  },
  {
    slug: 'prepositions',
    moduleId: 10,
    name: 'Prepositions & Collocations',
    description:
      'The fixed preposition pairs academic writing relies on (increase in, impact on) and the Task 1 patterns rose by, rose to and peaked at.',
    related: ['comparisons', 'verb-patterns', 'nominalization'],
  },
  {
    slug: 'comparisons',
    moduleId: 11,
    name: 'Comparisons & Quantities',
    description:
      'Comparatives, superlatives, twice as many as, fractions and percentages: the language of every Academic Task 1 report.',
    related: ['prepositions', 'parallelism', 'tenses'],
  },
  {
    slug: 'linking-clauses',
    moduleId: 12,
    name: 'Linking Clauses (Conjunctions)',
    description:
      'Coordinators, subordinators and linking adverbials: how to join ideas accurately, and why although... but is always wrong.',
    related: ['sentence-boundaries', 'relative-clauses', 'cohesion'],
  },
  {
    slug: 'relative-clauses',
    moduleId: 13,
    name: 'Relative Clauses',
    description:
      'Who, which, that, whose and where; defining vs non-defining clauses; and the comma rules that change your meaning.',
    related: ['participial-clauses', 'noun-clauses', 'linking-clauses'],
  },
  {
    slug: 'noun-clauses',
    moduleId: 14,
    name: 'Noun Clauses',
    description:
      'That-clauses, whether-clauses and embedded questions, plus It is clear that... for heavy subjects.',
    related: ['relative-clauses', 'information-structure', 'verb-patterns'],
  },
  {
    slug: 'conditionals',
    moduleId: 15,
    name: 'Conditionals',
    description:
      'Zero, first and second conditionals, unless and provided that, and how to use conditionals to argue for solutions.',
    related: ['modal-verbs', 'tenses', 'hedging'],
  },
  {
    slug: 'parallelism',
    moduleId: 16,
    name: 'Parallel Structure',
    description:
      'Keep lists, not only... but also pairs and comparisons in matching grammatical forms so long sentences stay correct.',
    related: ['comparisons', 'linking-clauses', 'subject-verb-agreement'],
  },
  {
    slug: 'participial-clauses',
    moduleId: 17,
    name: 'Participle Clauses',
    description:
      'Shorten clauses with -ing and -ed forms, add result clauses in Task 1, and avoid the dangling-modifier trap.',
    related: ['relative-clauses', 'passive-voice', 'concision'],
  },
  {
    slug: 'nominalization',
    moduleId: 18,
    name: 'Noun Phrases & Nominalization',
    description:
      'Turn verbs into nouns and build dense noun phrases, the real engine of academic style, and know when to stop.',
    related: ['information-structure', 'concision', 'articles'],
  },
  {
    slug: 'hedging',
    moduleId: 19,
    name: 'Hedging & Academic Stance',
    description:
      'Soften claims with may, tend to and suggest so that every statement you make is one you can defend.',
    related: ['modal-verbs', 'conditionals', 'register-and-punctuation'],
  },
  {
    slug: 'information-structure',
    moduleId: 20,
    name: 'Information Structure',
    description:
      'Given before new, end-weight and this + summary noun: the ordering habits that make writing flow without extra linkers.',
    related: ['cohesion', 'nominalization', 'passive-voice'],
  },
  {
    slug: 'cohesion',
    moduleId: 21,
    name: 'Cohesion: Reference & Substitution',
    description:
      'Link sentences with reference, substitution and ellipsis instead of stacking moreover and furthermore.',
    related: ['information-structure', 'pronouns', 'linking-clauses'],
  },
  {
    slug: 'inversion',
    moduleId: 22,
    name: 'Inversion & Cleft Sentences',
    description:
      'Not only does..., Rarely has... and What matters is...: optional emphatic structures, and when they are worth the risk.',
    related: ['information-structure', 'register-and-punctuation', 'linking-clauses'],
  },
  {
    slug: 'concision',
    moduleId: 23,
    name: 'Concise Writing',
    description:
      'Cut deadwood, place modifiers correctly and keep subjects close to verbs: an editing checklist for every draft.',
    related: ['nominalization', 'participial-clauses', 'register-and-punctuation'],
  },
  {
    slug: 'register-and-punctuation',
    moduleId: 24,
    name: 'Register, Punctuation & Variety',
    description:
      'Formal vs informal style, semicolons, colons and dashes, and how to vary sentences with purpose.',
    related: ['concision', 'sentence-boundaries', 'hedging'],
  },
]

export const GRAMMAR_TOPICS = TOPICS

export function topicBySlug(slug: string | undefined): GrammarTopic | undefined {
  return TOPICS.find((t) => t.slug === slug)
}

export function topicByModuleId(moduleId: number): GrammarTopic | undefined {
  return TOPICS.find((t) => t.moduleId === moduleId)
}

export function topicModule(topic: GrammarTopic): ModuleMeta {
  const module = MODULES.find((m) => m.id === topic.moduleId)
  if (!module) throw new Error(`Unknown module ${topic.moduleId}`)
  return module
}

/** Topics featured on the homepage, chosen to cover each stage. */
export const FEATURED_TOPIC_SLUGS = [
  'articles',
  'tenses',
  'subject-verb-agreement',
  'conditionals',
  'relative-clauses',
  'nominalization',
]
