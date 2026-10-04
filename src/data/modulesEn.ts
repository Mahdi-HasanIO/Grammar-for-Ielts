import type { StageId } from '@/types'

/*
 * English versions of the Bangla text in modules.ts (stage taglines and
 * descriptions, module summaries and IELTS notes). Keyed by id so the
 * course has one module list that can render in either language.
 */

export const STAGES_EN: Record<StageId, { tagline: string; description: string }> = {
  1: {
    tagline: 'Build error-free sentences',
    description:
      'The ability to write simple sentences accurately. Most of the errors that pull a band score down happen here, not in advanced grammar.',
  },
  2: {
    tagline: 'Verbs, voice and sentence patterns',
    description:
      'The grammar you need in almost every paragraph: tense, modals, voice, and which structure follows which verb or preposition.',
  },
  3: {
    tagline: 'Connect ideas accurately',
    description:
      'Joining several clauses without making errors. Here your sentences need to be varied and accurate at the same time.',
  },
  4: {
    tagline: 'Write in an academic style',
    description:
      'Saying more in fewer words, making measured claims and creating natural flow. These structures turn reasonably good writing into genuinely strong writing.',
  },
  5: {
    tagline: 'Editing for clarity and tone',
    description:
      'Turning accurate grammar into clear, well-organised writing that works both in the exam and at work.',
  },
}

export const MODULES_EN: Record<number, { summary: string; ieltsNote: string }> = {
  1: {
    summary: 'Every clause needs a subject and a verb, in the right order.',
    ieltsNote:
      'Examiners treat a missing or doubled subject as a very basic error. Band 8 requires most sentences to be error-free, so secure this area first.',
  },
  2: {
    summary: 'However long the subject, the verb agrees with the real subject.',
    ieltsNote:
      'Agreement is the most frequent error in Task 2 essays. Because it repeats throughout a script, examiners see it as a persistent weakness rather than a slip.',
  },
  3: {
    summary: 'When to use a, when to use the, and when to use neither.',
    ieltsNote:
      'A single article error costs little, but they recur. A dozen in one script means you can no longer say most sentences are error-free, which is exactly what Band 8 needs.',
  },
  4: {
    summary: 'Make it clear what every pronoun refers to.',
    ieltsNote:
      'Ambiguous pronouns cost marks in two places: Grammar and Coherence, because the reader has to stop and work out who they refers to.',
  },
  5: {
    summary: 'Know exactly where a sentence begins and ends.',
    ieltsNote:
      'Joining two sentences with only a comma before however or therefore (a comma splice) is very common and easy to fix. Clear sentence boundaries make the whole script look more organised.',
  },
  6: {
    summary: 'Choose a tense, then stay in it.',
    ieltsNote:
      'In Task 1 the real work is reading the chart title to see which time period it covers. Task 2 is mostly written in the present simple. Changing tense within a paragraph for no reason stands out immediately.',
  },
  7: {
    summary: 'Express how certain, how likely and how necessary something is.',
    ieltsNote:
      'Giving advice and talking about the future in Task 2 depend entirely on modals. They let you argue strongly without overstating, and they are the foundation of hedging in Module 19.',
  },
  8: {
    summary: 'Shift the focus when the doer is unknown or unimportant.',
    ieltsNote:
      'Very useful for Task 1 process diagrams and impersonal statements in Task 2. The passive is a tool for shifting focus, not a way to sound weighty; too much of it makes writing unclear.',
  },
  9: {
    summary: 'Learn which structure follows which verb.',
    ieltsNote:
      'Errors like suggest to do or allow to access are marked as grammar errors, not vocabulary errors, and they recur with the verbs essays use most.',
  },
  10: {
    summary: 'Get the prepositions right after academic nouns and verbs.',
    ieltsNote:
      'Task 1 description depends entirely on these patterns. Confusing rose by and rose to means you actually report the wrong number.',
  },
  11: {
    summary: 'Compare figures accurately and express the same idea in different ways.',
    ieltsNote:
      'Academic Task 1 is almost entirely comparison. Getting multiples and fractions such as twice, three times and half right protects your Task Achievement score as well as your grammar.',
  },
  12: {
    summary: 'Join clauses by meaning, and never use two connectors at once.',
    ieltsNote:
      'Band 7 and above needs complex sentences, but they must be accurate. Although... but... is the familiar error that ruins an otherwise good sentence.',
  },
  13: {
    summary: 'Add information about a noun without starting a new sentence.',
    ieltsNote:
      'This is the safest way to show complex structures. The two key tasks: getting commas right in non-defining clauses, and not adding an extra pronoun.',
  },
  14: {
    summary: 'Use a whole clause as a subject or an object.',
    ieltsNote:
      'Presenting arguments and giving opinions both depend on these. Even strong candidates often get the word order of embedded questions wrong.',
  },
  15: {
    summary: 'Argue about both real and hypothetical outcomes.',
    ieltsNote:
      'Solution paragraphs run on conditionals: If governments invested in..., congestion would fall. Mixed and third conditionals are good to have but not essential.',
  },
  16: {
    summary: 'Write every item in a list in the same grammatical form.',
    ieltsNote:
      'Long sentences listing reasons or benefits are very common in Task 2. If the list is not parallel, the sentence you wanted to impress with becomes a clear grammar error.',
  },
  17: {
    summary: 'Shorten clauses, but never leave a modifier dangling.',
    ieltsNote:
      'Used correctly, this is real evidence of control. The risk is a dangling modifier, which makes the sentence say something you never meant.',
  },
  18: {
    summary: 'Pack information into a noun phrase, but in moderation.',
    ieltsNote:
      'This, not inversion, is what makes writing genuinely academic. Research on academic writing shows it relies more on information-rich noun phrases than on chains of clauses.',
  },
  19: {
    summary: 'Make claims you can stand behind.',
    ieltsNote:
      'Overstated claims weaken an argument and sound unprofessional. Hedging lets you give your view without overreaching, which improves the quality of your answer as well as your grammar.',
  },
  20: {
    summary: 'Known information first, new information last.',
    ieltsNote:
      'High Cohesion scores go to writing that flows without a linker in every sentence, and most of that work is done by the order of information inside each sentence.',
  },
  21: {
    summary: 'Link sentences through reference, not just connectors.',
    ieltsNote:
      'The band descriptors explicitly penalise mechanical overuse of cohesive devices. Reference and substitution are the natural-sounding alternative.',
  },
  22: {
    summary: 'Optional structures for emphasis; use them sparingly.',
    ieltsNote:
      'Not required for any band. IELTS rewards accuracy and flexibility, not particular \'impressive\' structures. Forcing inversion usually creates errors exactly where a plain sentence would have been correct.',
  },
  23: {
    summary: 'Cut extra words, place modifiers correctly, keep subject and verb close.',
    ieltsNote:
      'Under time pressure, short, organised sentences contain fewer errors than long ones. This module also works as a checklist for editing your own writing.',
  },
  24: {
    summary: 'Choose a tone that fits the task, and vary sentence length deliberately.',
    ieltsNote:
      'Band 8 requires a range of structures used flexibly. Flexibility does not mean making every sentence long; it means choosing the right length for each job.',
  },
}
