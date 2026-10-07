import type { LessonLanguage, ModuleMeta, Stage } from '@/types'
import { moduleTextEn, stageTextEn } from '@/content/catalog'

/** Returns the module with its summary and IELTS note in the requested language. */
export function localizeModule(module: ModuleMeta, language: LessonLanguage): ModuleMeta {
  if (language === 'bn') return module
  const en = moduleTextEn(module.id)
  if (!en) return module
  return { ...module, summary: en.summary, ielts: { ...module.ielts, note: en.ieltsNote } }
}

/** Returns the stage with its tagline and description in the requested language. */
export function localizeStage(stage: Stage, language: LessonLanguage): Stage {
  if (language === 'bn') return stage
  const en = stageTextEn(stage.id)
  return en ? { ...stage, ...en } : stage
}

/** Fixed lesson labels. Grammar terms stay in English in both versions, as in the original course. */
const LABELS = {
  en: {
    rule: 'Rule',
    whenToUse: 'When to use it',
    structure: 'Structure',
    notes: 'Important notes',
    watchOut: 'Watch out for these',
    takeaways: 'Key takeaways',
    theRule: 'The rule',
    examples: 'Examples',
    examplesDesc: 'Each pair shows the error, the correction and the reason behind it.',
    mistakes: 'Common mistakes',
    mistakesDesc: 'The errors that cost the most marks in this area.',
    ieltsTitle: 'Why this matters for IELTS',
    languageLabel: 'Lesson language',
  },
  bn: {
    rule: 'নিয়ম',
    whenToUse: 'কখন ব্যবহার করবেন',
    structure: 'গঠন',
    notes: 'গুরুত্বপূর্ণ টিপস',
    watchOut: 'এই ভুলগুলো থেকে সাবধান',
    takeaways: 'মূল কথা',
    theRule: 'নিয়ম',
    examples: 'উদাহরণ',
    examplesDesc: 'প্রতিটি জোড়ায় ভুল বাক্য, সঠিক বাক্য আর কেন ভুল তার ব্যাখ্যা আছে।',
    mistakes: 'সাধারণ ভুল',
    mistakesDesc: 'এই অংশে যে ভুলগুলোতে সবচেয়ে বেশি নম্বর কাটে।',
    ieltsTitle: 'IELTS-এ এটা কেন জরুরি',
    languageLabel: 'পাঠের ভাষা',
  },
} as const

export type LessonLabels = { [K in keyof (typeof LABELS)['en']]: string }

export function lessonLabels(language: LessonLanguage): LessonLabels {
  return LABELS[language]
}
