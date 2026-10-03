import type { ModuleMeta, Stage } from '@/types'

export const STAGES: Stage[] = [
  {
    id: 1,
    name: 'Foundation',
    tagline: 'ভুলমুক্ত বাক্য গড়ে তুলুন',
    description:
      'মূল বাক্যের উপর নিয়ন্ত্রণ। Band কমিয়ে দেওয়া বেশিরভাগ ভুল এখানেই থাকে, উন্নত ব্যাকরণে নয়।',
  },
  {
    id: 2,
    name: 'Core Grammar',
    tagline: 'Verb, Voice ও গঠন',
    description:
      'যে ব্যাকরণ প্রায় প্রতিটি অনুচ্ছেদেই লাগে: Tense, Modality, Voice এবং Verb ও Preposition যে গঠন দাবি করে।',
  },
  {
    id: 3,
    name: 'Complex Sentence Control',
    tagline: 'ধারণাগুলো নির্ভুলভাবে জোড়া দিন',
    description:
      'নিয়ন্ত্রণ না হারিয়ে Clause জোড়া দেওয়া। এখানেই বৈচিত্র্য আর নির্ভুলতাকে একসঙ্গে কাজ করতে হয়।',
  },
  {
    id: 4,
    name: 'Advanced Grammar',
    tagline: 'Academic ভঙ্গিতে লিখুন',
    description:
      'সংকোচন, অবস্থান ও প্রবাহ। এই গঠনগুলোই একটি মোটামুটি ভালো লেখাকে সত্যিকারের জোরালো লেখায় বদলে দেয়।',
  },
  {
    id: 5,
    name: 'Professional Writing',
    tagline: 'স্পষ্টতা ও tone-এর জন্য সম্পাদনা',
    description:
      'নির্ভুল ব্যাকরণকে পরীক্ষার ও পেশাগত কাজের উপযোগী স্পষ্ট, পরিমিত লেখায় রূপ দেওয়া।',
  },
]

export const MODULES: ModuleMeta[] = [
  /* ------------------------- Stage 1 - Foundation ------------------------ */
  {
    id: 1,
    slug: 'clause-anatomy-and-word-order',
    title: 'Clause Anatomy & Word Order',
    stage: 1,
    difficulty: 'Elementary',
    summary: 'প্রতিটি Clause-এ Subject ও Verb থাকতে হবে, আর সঠিক ক্রমে।',
    estimatedMinutes: 12,
    topics: ['Subject', 'Verb', 'Object', 'Complement', 'Adverbial', 'SVO order', 'Dummy it'],
    ielts: {
      importance: 'Very High',
      priority: 'Essential for Band 8',
      note:
        'Subject বাদ পড়া বা দুইবার বসানো Clause পরীক্ষকের চোখে একদম প্রাথমিক ভুল হিসেবে ধরা পড়ে। Band 8-এর জন্য বেশিরভাগ বাক্য ভুলমুক্ত থাকতে হয়, তাই সবার আগে এই জায়গাটি পাকা করুন।',
    },
  },
  {
    id: 2,
    slug: 'subject-verb-agreement',
    title: 'Subject-Verb Agreement & Noun Number',
    stage: 1,
    difficulty: 'Elementary',
    summary: 'Subject যত লম্বাই হোক, Verb মেলাতে হবে আসল Subject-এর সঙ্গে।',
    estimatedMinutes: 14,
    topics: ['Singular/plural', 'Long subjects', 'There is/are', 'Uncountable nouns', 'Collective nouns', 'A number of'],
    ielts: {
      importance: 'Very High',
      priority: 'Essential for Band 8',
      note:
        'Task 2 essay-তে Agreement-এর ভুলই সবচেয়ে বেশিবার ঘটে। পুরো লেখাজুড়ে বারবার ঘটে বলে পরীক্ষক একে মাঝেমধ্যের ভুল নয়, বরং ধারাবাহিক দুর্বলতা হিসেবে দেখেন।',
    },
  },
  {
    id: 3,
    slug: 'articles-and-determiners',
    title: 'Articles & Determiners',
    stage: 1,
    difficulty: 'Intermediate',
    summary: 'কখন a বসবে, কখন the, আর কখন কিছুই বসবে না।',
    estimatedMinutes: 18,
    topics: ['a / an', 'the', 'Zero article', 'Countable vs uncountable', 'Generic reference', 'Quantifiers'],
    ielts: {
      importance: 'Very High',
      priority: 'Essential for Band 8',
      note:
        'Article-এর ভুল একা খুব বড় ক্ষতি করে না, কিন্তু এটি বারবার ঘটে। এক লেখায় ডজনখানেক এমন ভুল থাকলে সেটিকে আর বেশিরভাগ বাক্য ভুলমুক্ত বলা যায় না, অথচ Band 8-এ সেটিই দরকার।',
    },
  },
  {
    id: 4,
    slug: 'pronoun-reference',
    title: 'Pronoun Reference',
    stage: 1,
    difficulty: 'Intermediate',
    summary: 'প্রতিটি Pronoun কাকে বোঝাচ্ছে তা স্পষ্ট রাখুন।',
    estimatedMinutes: 12,
    topics: ['Agreement', 'Antecedents', 'it / they / this', 'Dummy it', 'Existential there', 'Ambiguity'],
    ielts: {
      importance: 'High',
      priority: 'Essential for Band 8',
      note:
        'অস্পষ্ট Pronoun-এ দুইভাবে নম্বর কমে: একবার Grammar-এ, আরেকবার Coherence-এ, কারণ পাঠককে থেমে ভাবতে হয় they আসলে কাদের বোঝাচ্ছে।',
    },
  },
  {
    id: 5,
    slug: 'sentence-boundaries',
    title: 'Sentence Boundaries & Punctuation',
    stage: 1,
    difficulty: 'Intermediate',
    summary: 'একটি বাক্য ঠিক কোথায় শুরু আর কোথায় শেষ, তা বুঝে নিন।',
    estimatedMinutes: 16,
    topics: ['Independent clauses', 'Fragments', 'Run-ons', 'Comma splices', 'Semicolons', 'however / therefore'],
    ielts: {
      importance: 'Very High',
      priority: 'Essential for Band 8',
      note:
        'however ও therefore-এর আগে comma splice খুব সাধারণ একটি ভুল এবং এটি ঠিক করা সহজ। বাক্যের সীমানা পরিষ্কার থাকলে আপনার বাকি লেখাটুকুও অনেক বেশি নিয়ন্ত্রিত দেখায়।',
    },
  },

  /* ------------------------ Stage 2 - Core Grammar ----------------------- */
  {
    id: 6,
    slug: 'tense-and-aspect',
    title: 'Tense & Aspect',
    stage: 2,
    difficulty: 'Intermediate',
    summary: 'একটি Tense বেছে নিন, তারপর সেটি ধরে রাখুন।',
    estimatedMinutes: 18,
    topics: ['Present simple', 'Past simple', 'Present perfect', 'Past perfect', 'Future forms', 'Consistency'],
    ielts: {
      importance: 'Very High',
      priority: 'Essential for Band 8',
      note:
        'Task 1-এ চার্টের শিরোনাম দেখে সময়কাল বুঝে নেওয়াই আসল কাজ। Task 2 মূলত Present simple-এ লেখা হয়। এক অনুচ্ছেদের ভেতরে ব্যাখ্যাহীন Tense বদল স্পষ্টভাবে চোখে পড়ে।',
    },
  },
  {
    id: 7,
    slug: 'modal-verbs',
    title: 'Modal Verbs',
    stage: 2,
    difficulty: 'Intermediate',
    summary: 'নিশ্চয়তা, সম্ভাবনা ও বাধ্যবাধকতা সঠিকভাবে প্রকাশ করুন।',
    estimatedMinutes: 14,
    topics: ['can / could', 'may / might', 'should', 'must', 'would', 'Epistemic vs deontic'],
    ielts: {
      importance: 'High',
      priority: 'Essential for Band 8',
      note:
        'Task 2-তে সুপারিশ ও ভবিষ্যদ্বাণী পুরোটাই Modal-এর উপর নির্ভরশীল। এগুলো আপনাকে অতিরঞ্জন ছাড়াই যুক্তি দিতে সাহায্য করে, যা Module 19-এর hedging-এর ভিত্তি।',
    },
  },
  {
    id: 8,
    slug: 'passive-voice',
    title: 'Passive Voice',
    stage: 2,
    difficulty: 'Intermediate',
    summary: 'কর্তা অজানা বা অপ্রয়োজনীয় হলে ফোকাস বদলে দিন।',
    estimatedMinutes: 16,
    topics: ['Basic passive', 'Passive across tenses', 'Modal + passive', 'Agent omission', 'It is argued that'],
    ielts: {
      importance: 'High',
      priority: 'High-value enhancement',
      note:
        'Task 1-এর process এবং Task 2-এর নৈর্ব্যক্তিক দাবিতে এটি কাজে লাগে। এটি ফোকাস বদলানোর কৌশল, পাণ্ডিত্য দেখানোর উপায় নয়; অতিরিক্ত passive স্পষ্টতা কমিয়ে দেয়।',
    },
  },
  {
    id: 9,
    slug: 'verb-complementation',
    title: 'Verb Complementation',
    stage: 2,
    difficulty: 'Upper-Intermediate',
    summary: 'কোন Verb-এর পরে কোন গঠন বসে তা শিখে নিন।',
    estimatedMinutes: 18,
    topics: ['verb + gerund', 'verb + infinitive', 'verb + object + infinitive', 'that-clauses', 'preposition + gerund'],
    ielts: {
      importance: 'Very High',
      priority: 'Essential for Band 8',
      note:
        'suggest to do বা allow to access-এর মতো ভুলকে শব্দভাণ্ডারের নয়, ব্যাকরণের ভুল হিসেবে গণনা করা হয়, আর essay-র সবচেয়ে প্রচলিত Verb-গুলোতেই এগুলো বারবার ঘটে।',
    },
  },
  {
    id: 10,
    slug: 'prepositional-patterns',
    title: 'Prepositional Patterns',
    stage: 2,
    difficulty: 'Upper-Intermediate',
    summary: 'Academic Noun ও Verb-এর সঙ্গে কোন Preposition বসে তা ঠিক করুন।',
    estimatedMinutes: 15,
    topics: ['increase in', 'impact on', 'access to', 'result in', 'rise by / to', 'peak at'],
    ielts: {
      importance: 'Very High',
      priority: 'Essential for Band 8',
      note:
        'Task 1-এর পুরো বর্ণনাই এই গঠনগুলোর উপর দাঁড়ানো। rose by আর rose to উল্টে গেলে আপনি আসলে ভুল সংখ্যাই রিপোর্ট করে ফেলেন।',
    },
  },
  {
    id: 11,
    slug: 'comparison-and-quantity',
    title: 'Comparison & Quantity',
    stage: 2,
    difficulty: 'Upper-Intermediate',
    summary: 'সংখ্যা নির্ভুলভাবে তুলনা করুন এবং প্রকাশে বৈচিত্র্য আনুন।',
    estimatedMinutes: 18,
    topics: ['Comparatives', 'Superlatives', 'as...as', 'twice as many', 'Percentages', 'Fractions', 'sharp / slight'],
    ielts: {
      importance: 'Very High',
      priority: 'Essential for Band 8',
      note:
        'Academic Task 1 প্রায় পুরোটাই তুলনা। গুণিতক ও ভগ্নাংশ নির্ভুল হলে শুধু ব্যাকরণ নয়, Task Achievement-ও সুরক্ষিত থাকে।',
    },
  },

  /* ---------------- Stage 3 - Complex Sentence Control ------------------- */
  {
    id: 12,
    slug: 'coordination-and-subordination',
    title: 'Coordination & Subordination',
    stage: 3,
    difficulty: 'Upper-Intermediate',
    summary: 'অর্থ অনুযায়ী Clause জোড়া দিন, আর কখনো দুটি connector নয়।',
    estimatedMinutes: 18,
    topics: ['and / but / so', 'because', 'although', 'whereas', 'despite', 'therefore', 'however'],
    ielts: {
      importance: 'Very High',
      priority: 'Essential for Band 8',
      note:
        'Band 7 ও তার উপরে complex sentence লাগে, তবে কেবল নিয়ন্ত্রিত হলেই। Although... but... সেই চিরচেনা ভুল, যা একটি ভালো বাক্যকেও নষ্ট করে দেয়।',
    },
  },
  {
    id: 13,
    slug: 'relative-clauses',
    title: 'Relative Clauses',
    stage: 3,
    difficulty: 'Upper-Intermediate',
    summary: 'নতুন বাক্য শুরু না করেই Noun-এর সঙ্গে তথ্য যোগ করুন।',
    estimatedMinutes: 18,
    topics: ['who / which / that', 'whose', 'where / when', 'Defining vs non-defining', 'preposition + which', 'Reduction'],
    ielts: {
      importance: 'Very High',
      priority: 'Essential for Band 8',
      note:
        'জটিল গঠন দেখানোর সবচেয়ে নির্ভরযোগ্য উপায় এটিই। Non-defining clause-এ কমা আর বাড়তি Pronoun-এর ভুল, এই দুটি ঠিক রাখাই মূল কাজ।',
    },
  },
  {
    id: 14,
    slug: 'noun-clauses-and-extraposition',
    title: 'Noun Clauses & Extraposition',
    stage: 3,
    difficulty: 'Upper-Intermediate',
    summary: 'পুরো একটি Clause-কে Subject বা Object হিসেবে ব্যবহার করুন।',
    estimatedMinutes: 16,
    topics: ['that-clauses', 'whether', 'wh-clauses', 'Embedded questions', 'It is clear that'],
    ielts: {
      importance: 'High',
      priority: 'Essential for Band 8',
      note:
        'যুক্তি উপস্থাপন ও মূল্যায়ন পুরোপুরি এগুলোর উপর নির্ভর করে। Embedded question-এর শব্দক্রমে ভালো শিক্ষার্থীরাও প্রায়ই ভুল করেন।',
    },
  },
  {
    id: 15,
    slug: 'conditionals',
    title: 'Conditionals',
    stage: 3,
    difficulty: 'Upper-Intermediate',
    summary: 'বাস্তব ও কাল্পনিক, দুই ধরনের ফলাফল নিয়েই যুক্তি দিন।',
    estimatedMinutes: 16,
    topics: ['Zero conditional', 'First conditional', 'Second conditional', 'unless', 'provided that', 'as long as'],
    ielts: {
      importance: 'High',
      priority: 'High-value enhancement',
      note:
        'সমাধান বিষয়ক অনুচ্ছেদ Conditional-এর উপরেই দাঁড়ায়: If governments invested in..., congestion would fall. Mixed ও third conditional বাড়তি সুবিধা, বাধ্যতামূলক নয়।',
    },
  },
  {
    id: 16,
    slug: 'parallelism',
    title: 'Parallelism',
    stage: 3,
    difficulty: 'Upper-Intermediate',
    summary: 'তালিকার প্রতিটি অংশের ব্যাকরণগত গঠন এক রাখুন।',
    estimatedMinutes: 12,
    topics: ['Lists', 'not only...but also', 'Parallel comparisons', 'Matching forms'],
    ielts: {
      importance: 'High',
      priority: 'Essential for Band 8',
      note:
        'Task 2-তে কারণ বা সুবিধার তালিকাসহ লম্বা বাক্য খুব সাধারণ, আর তালিকা ভেঙে গেলে সেটি একটি উচ্চাকাঙ্ক্ষী বাক্যের স্পষ্ট ব্যাকরণগত ভুল হয়ে দাঁড়ায়।',
    },
  },
  {
    id: 17,
    slug: 'reduced-and-participle-clauses',
    title: 'Reduced & Participle Clauses',
    stage: 3,
    difficulty: 'Advanced',
    summary: 'Clause সংক্ষিপ্ত করুন, তবে modifier যেন ঝুলে না থাকে।',
    estimatedMinutes: 18,
    topics: ['-ing clauses', '-ed clauses', 'Reduced relatives', 'having + participle', 'Dangling modifiers'],
    ielts: {
      importance: 'High',
      priority: 'High-value enhancement',
      note:
        'নিয়ন্ত্রণে রাখতে পারলে এটি সত্যিকারের ভাষাদক্ষতার প্রমাণ। ঝুঁকি হলো dangling modifier, যা এমন একটি বাক্য তৈরি করে যা আপনি বোঝাতেই চাননি।',
    },
  },

  /* ------------------- Stage 4 - Advanced Grammar ------------------------ */
  {
    id: 18,
    slug: 'complex-noun-phrases',
    title: 'Complex Noun Phrases & Nominalization',
    stage: 4,
    difficulty: 'Advanced',
    summary: 'তথ্যকে Noun phrase-এ ঠেসে দিন, তবে পরিমিতভাবে।',
    estimatedMinutes: 20,
    topics: ['noun + noun', 'noun + of', 'Prepositional modifiers', 'Noun complement clauses', 'Apposition', 'Nominalization'],
    ielts: {
      importance: 'High',
      priority: 'High-value enhancement',
      note:
        'লেখাকে সত্যিকার অর্থে academic করে তোলে এটিই, inversion নয়। Academic ভাষাশৈলীর গবেষণাও জটিল Clause-এর সারির চেয়ে ঘন Noun phrase-এর দিকেই ইঙ্গিত করে।',
    },
  },
  {
    id: 19,
    slug: 'hedging-and-stance',
    title: 'Hedging & Academic Stance',
    stage: 4,
    difficulty: 'Advanced',
    summary: 'এমন দাবি করুন যা আপনি রক্ষা করতে পারবেন।',
    estimatedMinutes: 16,
    topics: ['may / might / could', 'tend to', 'appear to', 'suggest / indicate', 'arguably', 'It is likely that'],
    ielts: {
      importance: 'Very High',
      priority: 'High-value enhancement',
      note:
        'অতিরঞ্জিত দাবি আপনার যুক্তি দুর্বল করে এবং অপেশাদার শোনায়। Hedging আপনাকে অবস্থান নিতে দেয়, অথচ নির্ভুলও রাখে, যা ব্যাকরণের পাশাপাশি উত্তরের মানও বাড়ায়।',
    },
  },
  {
    id: 20,
    slug: 'information-packaging',
    title: 'Information Packaging',
    stage: 4,
    difficulty: 'Advanced',
    summary: 'জানা তথ্য আগে, নতুন তথ্য পরে রাখুন।',
    estimatedMinutes: 18,
    topics: ['Given to new', 'End-weight', 'Heavy subjects', 'Passive for focus', 'Existential there', 'This + summary noun'],
    ielts: {
      importance: 'High',
      priority: 'High-value enhancement',
      note:
        'Cohesion-এর নম্বর সেই লেখাকে পুরস্কৃত করে, যা প্রতিটি বাক্যে linker ছাড়াই সাবলীলভাবে এগোয়। এই কাজের বেশিরভাগটাই করে বাক্যের ভেতরে তথ্যের ক্রম।',
    },
  },
  {
    id: 21,
    slug: 'grammatical-cohesion',
    title: 'Grammatical Cohesion',
    stage: 4,
    difficulty: 'Advanced',
    summary: 'শুধু connector নয়, reference দিয়েও বাক্য জোড়া দিন।',
    estimatedMinutes: 16,
    topics: ['Reference', 'Substitution', 'Ellipsis', 'this / such + noun', 'one / ones', 'do so'],
    ielts: {
      importance: 'High',
      priority: 'High-value enhancement',
      note:
        'Band descriptor-এ cohesive device-এর যান্ত্রিক অতিরিক্ত ব্যবহারের বিষয়ে সরাসরি সতর্ক করা আছে। Reference ও substitution সেই বিকল্প, যা স্বাভাবিক শোনায়।',
    },
  },
  {
    id: 22,
    slug: 'clefts-and-inversion',
    title: 'Clefts & Limited Inversion',
    stage: 4,
    difficulty: 'Proficient',
    summary: 'জোর দেওয়ার ঐচ্ছিক গঠন, খুব পরিমিতভাবে ব্যবহার্য।',
    estimatedMinutes: 14,
    topics: ['What matters is...', 'It was X that...', 'Not only does X...', 'Emphasis'],
    ielts: {
      importance: 'Situational',
      priority: 'Optional',
      note:
        'কোনো band-এই এটি আবশ্যক নয়। IELTS নম্বর দেয় নির্ভুলতা ও সাবলীলতায়, কোনো নির্দিষ্ট দেখানো-গঠনে নয়। জোর করে inversion লিখতে গিয়ে সাধারণত সেখানেই ভুল হয়, যেখানে সাধারণ বাক্য নির্ভুল হতো।',
    },
  },

  /* ----------------- Stage 5 - Professional Writing ---------------------- */
  {
    id: 23,
    slug: 'concision-and-ambiguity',
    title: 'Concision & Ambiguity Control',
    stage: 5,
    difficulty: 'Advanced',
    summary: 'বাড়তি শব্দ কাটুন, modifier বসান, Subject ও Verb কাছাকাছি রাখুন।',
    estimatedMinutes: 18,
    topics: ['Cutting deadwood', 'Sentence length', 'Misplaced modifiers', 'Weak nominalizations', 'Subject-verb distance'],
    ielts: {
      importance: 'High',
      priority: 'High-value enhancement',
      note:
        'সময়ের চাপে লম্বা বাক্যের চেয়ে ছোট ও নিয়ন্ত্রিত বাক্যে ভুল কম হয়। এই মডিউলটি একই সঙ্গে আপনার সম্পাদনার তালিকা হিসেবেও কাজ করে।',
    },
  },
  {
    id: 24,
    slug: 'register-and-sentence-variety',
    title: 'Register, Punctuation & Sentence Variety',
    stage: 5,
    difficulty: 'Proficient',
    summary: 'কাজের ধরন অনুযায়ী tone বাছুন, আর বাক্যের দৈর্ঘ্যে ইচ্ছাকৃত বৈচিত্র্য আনুন।',
    estimatedMinutes: 18,
    topics: ['Formal vs informal', 'Academic register', 'Contractions', 'Semicolons', 'Colons', 'Dashes', 'Sentence variety'],
    ielts: {
      importance: 'High',
      priority: 'Essential for Band 8',
      note:
        'Band 8 চায় নানা ধরনের গঠন সাবলীলভাবে ব্যবহার করা। সাবলীলতা মানে কার্যকারিতার জন্য বাক্যের দৈর্ঘ্য বেছে নেওয়া, প্রতিটি বাক্য লম্বা করা নয়।',
    },
  },
]

export const TOTAL_MODULES = MODULES.length
