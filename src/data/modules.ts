import type { ModuleMeta, Stage } from '@/types'

export const STAGES: Stage[] = [
  {
    id: 1,
    name: 'Foundation',
    tagline: 'ভুলমুক্ত বাক্য গড়ে তুলুন',
    description:
      'সাধারণ বাক্য নির্ভুলভাবে লেখার দক্ষতা। Band কমে যাওয়ার বেশিরভাগ ভুল আসলে এখানেই হয়, কঠিন grammar-এ নয়।',
  },
  {
    id: 2,
    name: 'Core Grammar',
    tagline: 'Verb, Voice আর বাক্যের গঠন',
    description:
      'যে grammar প্রায় প্রতিটি paragraph-এ লাগে: Tense, Modal, Voice, আর কোন Verb বা Preposition-এর পরে কোন গঠন বসে।',
  },
  {
    id: 3,
    name: 'Complex Sentence Control',
    tagline: 'আইডিয়াগুলো নির্ভুলভাবে জুড়ুন',
    description:
      'ভুল না করে একাধিক Clause জোড়া লাগানো। এখানে বাক্যে বৈচিত্র্যও আনতে হবে, আবার নির্ভুলও থাকতে হবে।',
  },
  {
    id: 4,
    name: 'Advanced Grammar',
    tagline: 'Academic স্টাইলে লিখুন',
    description:
      'কম শব্দে বেশি কথা বলা, দাবি মেপে করা আর লেখার স্বাভাবিক flow। এই গঠনগুলোই মোটামুটি ভালো একটা লেখাকে সত্যিকারের শক্তিশালী লেখায় পরিণত করে।',
  },
  {
    id: 5,
    name: 'Professional Writing',
    tagline: 'স্পষ্টতা আর tone ঠিক করতে editing',
    description:
      'নির্ভুল grammar-কে এমন পরিষ্কার, গোছানো লেখায় রূপ দেওয়া, যা পরীক্ষায় আর কাজের জায়গায় দুই জায়গাতেই চলে।',
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
    summary: 'প্রতিটি Clause-এ Subject আর Verb থাকতেই হবে, তাও সঠিক ক্রমে।',
    estimatedMinutes: 12,
    topics: ['Subject', 'Verb', 'Object', 'Complement', 'Adverbial', 'SVO order', 'Dummy it'],
    ielts: {
      importance: 'Very High',
      priority: 'Essential for Band 8',
      note:
        'Subject বাদ পড়লে বা দুইবার বসলে examiner সেটাকে একেবারে basic ভুল হিসেবে ধরেন। Band 8 পেতে হলে বেশিরভাগ বাক্য ভুলমুক্ত হতে হয়, তাই সবার আগে এই জায়গাটা পাকা করে নিন।',
    },
  },
  {
    id: 2,
    slug: 'subject-verb-agreement',
    title: 'Subject-Verb Agreement & Noun Number',
    stage: 1,
    difficulty: 'Elementary',
    summary: 'Subject যত লম্বাই হোক, Verb মিলবে আসল Subject-এর সঙ্গেই।',
    estimatedMinutes: 14,
    topics: ['Singular/plural', 'Long subjects', 'There is/are', 'Uncountable nouns', 'Collective nouns', 'A number of'],
    ielts: {
      importance: 'Very High',
      priority: 'Essential for Band 8',
      note:
        'Task 2 essay-তে সবচেয়ে বেশি যে ভুলটা হয়, সেটা Agreement-এর ভুল। পুরো লেখায় বারবার হয় বলে examiner এটাকে হঠাৎ হয়ে যাওয়া ভুল না ভেবে একটা স্থায়ী দুর্বলতা হিসেবেই দেখেন।',
    },
  },
  {
    id: 3,
    slug: 'articles-and-determiners',
    title: 'Articles & Determiners',
    stage: 1,
    difficulty: 'Intermediate',
    summary: 'কখন a বসবে, কখন the, আর কখন কোনোটাই বসবে না।',
    estimatedMinutes: 18,
    topics: ['a / an', 'the', 'Zero article', 'Countable vs uncountable', 'Generic reference', 'Quantifiers'],
    ielts: {
      importance: 'Very High',
      priority: 'Essential for Band 8',
      note:
        'একটা Article-এর ভুলে খুব বেশি ক্ষতি হয় না, কিন্তু এই ভুল বারবার হয়। এক লেখায় ডজনখানেক এমন ভুল থাকলে আর বলা যায় না যে বেশিরভাগ বাক্য ভুলমুক্ত, অথচ Band 8-এর জন্য ঠিক সেটাই দরকার।',
    },
  },
  {
    id: 4,
    slug: 'pronoun-reference',
    title: 'Pronoun Reference',
    stage: 1,
    difficulty: 'Intermediate',
    summary: 'প্রতিটি Pronoun কাকে বোঝাচ্ছে, সেটা যেন পরিষ্কার থাকে।',
    estimatedMinutes: 12,
    topics: ['Agreement', 'Antecedents', 'it / they / this', 'Dummy it', 'Existential there', 'Ambiguity'],
    ielts: {
      importance: 'High',
      priority: 'Essential for Band 8',
      note:
        'অস্পষ্ট Pronoun-এর কারণে দুই জায়গায় নম্বর কাটা যায়: Grammar-এ আর Coherence-এ। কারণ পাঠককে থেমে ভাবতে হয়, they আসলে কাদের কথা বলছে।',
    },
  },
  {
    id: 5,
    slug: 'sentence-boundaries',
    title: 'Sentence Boundaries & Punctuation',
    stage: 1,
    difficulty: 'Intermediate',
    summary: 'একটা বাক্য ঠিক কোথায় শুরু আর কোথায় শেষ, সেটা বুঝে নিন।',
    estimatedMinutes: 16,
    topics: ['Independent clauses', 'Fragments', 'Run-ons', 'Comma splices', 'Semicolons', 'however / therefore'],
    ielts: {
      importance: 'Very High',
      priority: 'Essential for Band 8',
      note:
        'however বা therefore-এর আগে শুধু কমা দিয়ে দুটো বাক্য জোড়া (comma splice) খুব কমন ভুল, আর ঠিক করাও সহজ। বাক্য কোথায় শেষ হচ্ছে সেটা পরিষ্কার থাকলে পুরো লেখাটাই অনেক গোছানো লাগে।',
    },
  },

  /* ------------------------ Stage 2 - Core Grammar ----------------------- */
  {
    id: 6,
    slug: 'tense-and-aspect',
    title: 'Tense & Aspect',
    stage: 2,
    difficulty: 'Intermediate',
    summary: 'একটা Tense বেছে নিন, তারপর সেটাতেই থাকুন।',
    estimatedMinutes: 18,
    topics: ['Present simple', 'Past simple', 'Present perfect', 'Past perfect', 'Future forms', 'Consistency'],
    ielts: {
      importance: 'Very High',
      priority: 'Essential for Band 8',
      note:
        'Task 1-এ চার্টের title দেখে সময়টা কখনকার, সেটা বোঝাই আসল কাজ। Task 2 মূলত Present simple-এ লেখা হয়। একই paragraph-এ কারণ ছাড়া Tense বদলালে সেটা সহজেই চোখে পড়ে।',
    },
  },
  {
    id: 7,
    slug: 'modal-verbs',
    title: 'Modal Verbs',
    stage: 2,
    difficulty: 'Intermediate',
    summary: 'কতটা নিশ্চিত, কতটা সম্ভব আর কতটা জরুরি, সেটা ঠিকঠাক বোঝান।',
    estimatedMinutes: 14,
    topics: ['can / could', 'may / might', 'should', 'must', 'would', 'Epistemic vs deontic'],
    ielts: {
      importance: 'High',
      priority: 'Essential for Band 8',
      note:
        'Task 2-তে পরামর্শ দেওয়া বা ভবিষ্যতের কথা বলা পুরোটাই Modal দিয়ে হয়। Modal থাকলে বাড়িয়ে না বলেও জোরালো যুক্তি দেওয়া যায়, আর এটাই Module 19-এর hedging-এর ভিত্তি।',
    },
  },
  {
    id: 8,
    slug: 'passive-voice',
    title: 'Passive Voice',
    stage: 2,
    difficulty: 'Intermediate',
    summary: 'কে কাজটা করেছে তা অজানা বা অদরকারি হলে ফোকাস বদলে দিন।',
    estimatedMinutes: 16,
    topics: ['Basic passive', 'Passive across tenses', 'Modal + passive', 'Agent omission', 'It is argued that'],
    ielts: {
      importance: 'High',
      priority: 'High-value enhancement',
      note:
        'Task 1-এর process diagram আর Task 2-এর নৈর্ব্যক্তিক (impersonal) বক্তব্যে এটা খুব কাজে লাগে। Passive হলো ফোকাস বদলানোর একটা কৌশল, ভারী শোনানোর উপায় নয়; বেশি passive দিলে লেখা উল্টো অস্পষ্ট হয়ে যায়।',
    },
  },
  {
    id: 9,
    slug: 'verb-complementation',
    title: 'Verb Complementation',
    stage: 2,
    difficulty: 'Upper-Intermediate',
    summary: 'কোন Verb-এর পরে কোন গঠন বসে, সেটা শিখে নিন।',
    estimatedMinutes: 18,
    topics: ['verb + gerund', 'verb + infinitive', 'verb + object + infinitive', 'that-clauses', 'preposition + gerund'],
    ielts: {
      importance: 'Very High',
      priority: 'Essential for Band 8',
      note:
        'suggest to do বা allow to access-এর মতো ভুল vocabulary-র নয়, grammar-এর ভুল হিসেবেই ধরা হয়। আর essay-তে সবচেয়ে বেশি ব্যবহৃত Verb-গুলোতেই এই ভুল বারবার হয়।',
    },
  },
  {
    id: 10,
    slug: 'prepositional-patterns',
    title: 'Prepositional Patterns',
    stage: 2,
    difficulty: 'Upper-Intermediate',
    summary: 'Academic Noun আর Verb-এর সঙ্গে কোন Preposition বসে, সেটা ঠিক করে নিন।',
    estimatedMinutes: 15,
    topics: ['increase in', 'impact on', 'access to', 'result in', 'rise by / to', 'peak at'],
    ielts: {
      importance: 'Very High',
      priority: 'Essential for Band 8',
      note:
        'Task 1-এর পুরো বর্ণনাটাই এই গঠনগুলোর উপর নির্ভর করে। rose by আর rose to গুলিয়ে ফেললে আপনি আসলে ভুল সংখ্যাই লিখে ফেলবেন।',
    },
  },
  {
    id: 11,
    slug: 'comparison-and-quantity',
    title: 'Comparison & Quantity',
    stage: 2,
    difficulty: 'Upper-Intermediate',
    summary: 'সংখ্যা নির্ভুলভাবে তুলনা করুন, আর একই কথা নানাভাবে বলুন।',
    estimatedMinutes: 18,
    topics: ['Comparatives', 'Superlatives', 'as...as', 'twice as many', 'Percentages', 'Fractions', 'sharp / slight'],
    ielts: {
      importance: 'Very High',
      priority: 'Essential for Band 8',
      note:
        'Academic Task 1 প্রায় পুরোটাই তুলনা। twice, three times বা half-এর মতো গুণ আর ভগ্নাংশ ঠিকঠাক লিখলে শুধু grammar নয়, Task Achievement-এর নম্বরও বাঁচে।',
    },
  },

  /* ---------------- Stage 3 - Complex Sentence Control ------------------- */
  {
    id: 12,
    slug: 'coordination-and-subordination',
    title: 'Coordination & Subordination',
    stage: 3,
    difficulty: 'Upper-Intermediate',
    summary: 'অর্থ বুঝে Clause জোড়া দিন, আর একসঙ্গে কখনো দুটো connector নয়।',
    estimatedMinutes: 18,
    topics: ['and / but / so', 'because', 'although', 'whereas', 'despite', 'therefore', 'however'],
    ielts: {
      importance: 'Very High',
      priority: 'Essential for Band 8',
      note:
        'Band 7 বা তার বেশি পেতে complex sentence লাগে, তবে সেগুলো নির্ভুল হতে হবে। Although... but... হলো সেই পরিচিত ভুল, যেটা ভালো একটা বাক্যকেও নষ্ট করে দেয়।',
    },
  },
  {
    id: 13,
    slug: 'relative-clauses',
    title: 'Relative Clauses',
    stage: 3,
    difficulty: 'Upper-Intermediate',
    summary: 'নতুন বাক্য না লিখেই Noun সম্পর্কে বাড়তি তথ্য যোগ করুন।',
    estimatedMinutes: 18,
    topics: ['who / which / that', 'whose', 'where / when', 'Defining vs non-defining', 'preposition + which', 'Reduction'],
    ielts: {
      importance: 'Very High',
      priority: 'Essential for Band 8',
      note:
        'Complex গঠন দেখানোর সবচেয়ে নিরাপদ উপায় এটাই। মূল কাজ দুটো: Non-defining clause-এ কমা ঠিক রাখা, আর বাড়তি Pronoun না বসানো।',
    },
  },
  {
    id: 14,
    slug: 'noun-clauses-and-extraposition',
    title: 'Noun Clauses & Extraposition',
    stage: 3,
    difficulty: 'Upper-Intermediate',
    summary: 'পুরো একটা Clause-কে Subject বা Object হিসেবে ব্যবহার করুন।',
    estimatedMinutes: 16,
    topics: ['that-clauses', 'whether', 'wh-clauses', 'Embedded questions', 'It is clear that'],
    ielts: {
      importance: 'High',
      priority: 'Essential for Band 8',
      note:
        'যুক্তি দেওয়া আর মতামত জানানো, দুটোই এগুলোর উপর নির্ভর করে। Embedded question-এর word order-এ ভালো শিক্ষার্থীরাও প্রায়ই ভুল করেন।',
    },
  },
  {
    id: 15,
    slug: 'conditionals',
    title: 'Conditionals',
    stage: 3,
    difficulty: 'Upper-Intermediate',
    summary: 'বাস্তব আর কাল্পনিক, দুই ধরনের ফলাফল নিয়েই যুক্তি দিন।',
    estimatedMinutes: 16,
    topics: ['Zero conditional', 'First conditional', 'Second conditional', 'unless', 'provided that', 'as long as'],
    ielts: {
      importance: 'High',
      priority: 'High-value enhancement',
      note:
        'সমাধান নিয়ে লেখা paragraph মূলত Conditional দিয়েই চলে: If governments invested in..., congestion would fall. Mixed আর third conditional থাকলে ভালো, কিন্তু বাধ্যতামূলক নয়।',
    },
  },
  {
    id: 16,
    slug: 'parallelism',
    title: 'Parallelism',
    stage: 3,
    difficulty: 'Upper-Intermediate',
    summary: 'তালিকার প্রতিটি অংশ একই grammatical গঠনে লিখুন।',
    estimatedMinutes: 12,
    topics: ['Lists', 'not only...but also', 'Parallel comparisons', 'Matching forms'],
    ielts: {
      importance: 'High',
      priority: 'Essential for Band 8',
      note:
        'Task 2-তে কারণ বা সুবিধার তালিকা দিয়ে লম্বা বাক্য লেখা খুব সাধারণ। কিন্তু তালিকার গঠন মিল না থাকলে, ভালো করে লিখতে চাওয়া বাক্যটাই একটা স্পষ্ট grammar ভুলে পরিণত হয়।',
    },
  },
  {
    id: 17,
    slug: 'reduced-and-participle-clauses',
    title: 'Reduced & Participle Clauses',
    stage: 3,
    difficulty: 'Advanced',
    summary: 'Clause ছোট করুন, তবে modifier যেন ঝুলে না থাকে।',
    estimatedMinutes: 18,
    topics: ['-ing clauses', '-ed clauses', 'Reduced relatives', 'having + participle', 'Dangling modifiers'],
    ielts: {
      importance: 'High',
      priority: 'High-value enhancement',
      note:
        'ঠিকভাবে ব্যবহার করতে পারলে এটা ভাষার উপর সত্যিকারের দখলের প্রমাণ। ঝুঁকি হলো dangling modifier, যার ফলে বাক্যটা এমন অর্থ দেয় যা আপনি বলতেই চাননি।',
    },
  },

  /* ------------------- Stage 4 - Advanced Grammar ------------------------ */
  {
    id: 18,
    slug: 'complex-noun-phrases',
    title: 'Complex Noun Phrases & Nominalization',
    stage: 4,
    difficulty: 'Advanced',
    summary: 'অনেক তথ্য একটা Noun phrase-এ গুছিয়ে আনুন, তবে মাত্রা রেখে।',
    estimatedMinutes: 20,
    topics: ['noun + noun', 'noun + of', 'Prepositional modifiers', 'Noun complement clauses', 'Apposition', 'Nominalization'],
    ielts: {
      importance: 'High',
      priority: 'High-value enhancement',
      note:
        'লেখাকে সত্যিকারের academic করে তোলে এটাই, inversion নয়। Academic writing নিয়ে গবেষণাও বলে, এ ধরনের লেখায় একের পর এক Clause-এর চেয়ে তথ্যবহুল Noun phrase-ই বেশি দেখা যায়।',
    },
  },
  {
    id: 19,
    slug: 'hedging-and-stance',
    title: 'Hedging & Academic Stance',
    stage: 4,
    difficulty: 'Advanced',
    summary: 'এমন দাবি করুন, যেটার পক্ষে আপনি দাঁড়াতে পারবেন।',
    estimatedMinutes: 16,
    topics: ['may / might / could', 'tend to', 'appear to', 'suggest / indicate', 'arguably', 'It is likely that'],
    ielts: {
      importance: 'Very High',
      priority: 'High-value enhancement',
      note:
        'বাড়িয়ে বলা দাবি যুক্তিকে দুর্বল করে আর লেখাকে অপেশাদার শোনায়। Hedging দিয়ে আপনি নিজের মত দিতে পারেন, আবার বাড়াবাড়িও এড়াতে পারেন। এতে grammar-এর পাশাপাশি উত্তরের মানও বাড়ে।',
    },
  },
  {
    id: 20,
    slug: 'information-packaging',
    title: 'Information Packaging',
    stage: 4,
    difficulty: 'Advanced',
    summary: 'পাঠক যা জানে তা আগে, নতুন তথ্য পরে।',
    estimatedMinutes: 18,
    topics: ['Given to new', 'End-weight', 'Heavy subjects', 'Passive for focus', 'Existential there', 'This + summary noun'],
    ielts: {
      importance: 'High',
      priority: 'High-value enhancement',
      note:
        'Cohesion-এ বেশি নম্বর পায় সেই লেখা, যেটা প্রতিটি বাক্যে linker না বসিয়েও সাবলীলভাবে এগোয়। আর এর বেশিরভাগ কাজটাই করে বাক্যের ভেতরে তথ্য সাজানোর ক্রম।',
    },
  },
  {
    id: 21,
    slug: 'grammatical-cohesion',
    title: 'Grammatical Cohesion',
    stage: 4,
    difficulty: 'Advanced',
    summary: 'শুধু connector দিয়ে নয়, reference দিয়েও বাক্য জুড়ুন।',
    estimatedMinutes: 16,
    topics: ['Reference', 'Substitution', 'Ellipsis', 'this / such + noun', 'one / ones', 'do so'],
    ielts: {
      importance: 'High',
      priority: 'High-value enhancement',
      note:
        'Band descriptor-এ সরাসরি বলা আছে, cohesive device যান্ত্রিকভাবে বেশি বেশি ব্যবহার করা যাবে না। Reference আর substitution হলো সেই বিকল্প, যেটা শুনতে স্বাভাবিক লাগে।',
    },
  },
  {
    id: 22,
    slug: 'clefts-and-inversion',
    title: 'Clefts & Limited Inversion',
    stage: 4,
    difficulty: 'Proficient',
    summary: 'জোর দেওয়ার ঐচ্ছিক গঠন, খুব হিসেব করে ব্যবহার করুন।',
    estimatedMinutes: 14,
    topics: ['What matters is...', 'It was X that...', 'Not only does X...', 'Emphasis'],
    ielts: {
      importance: 'Situational',
      priority: 'Optional',
      note:
        'কোনো band-এর জন্যই এটা বাধ্যতামূলক নয়। IELTS নম্বর দেয় নির্ভুলতা আর সাবলীলতার জন্য, কোনো নির্দিষ্ট \'দেখানোর মতো\' গঠনের জন্য নয়। জোর করে inversion লিখতে গেলে সাধারণত ঠিক সেখানেই ভুল হয়, যেখানে সাধারণ বাক্যটা নির্ভুল হতো।',
    },
  },

  /* ----------------- Stage 5 - Professional Writing ---------------------- */
  {
    id: 23,
    slug: 'concision-and-ambiguity',
    title: 'Concision & Ambiguity Control',
    stage: 5,
    difficulty: 'Advanced',
    summary: 'বাড়তি শব্দ কাটুন, modifier ঠিক জায়গায় বসান, Subject আর Verb কাছাকাছি রাখুন।',
    estimatedMinutes: 18,
    topics: ['Cutting deadwood', 'Sentence length', 'Misplaced modifiers', 'Weak nominalizations', 'Subject-verb distance'],
    ielts: {
      importance: 'High',
      priority: 'High-value enhancement',
      note:
        'সময়ের চাপে লম্বা বাক্যের চেয়ে ছোট, গোছানো বাক্যে ভুল কম হয়। এই module-টা আপনার নিজের লেখা edit করার checklist হিসেবেও কাজ করবে।',
    },
  },
  {
    id: 24,
    slug: 'register-and-sentence-variety',
    title: 'Register, Punctuation & Sentence Variety',
    stage: 5,
    difficulty: 'Proficient',
    summary: 'লেখার ধরন বুঝে tone বাছুন, আর ভেবেচিন্তে বাক্যের দৈর্ঘ্যে বৈচিত্র্য আনুন।',
    estimatedMinutes: 18,
    topics: ['Formal vs informal', 'Academic register', 'Contractions', 'Semicolons', 'Colons', 'Dashes', 'Sentence variety'],
    ielts: {
      importance: 'High',
      priority: 'Essential for Band 8',
      note:
        'Band 8-এর জন্য নানা ধরনের গঠন সাবলীলভাবে ব্যবহার করতে হয়। সাবলীলতা মানে প্রতিটি বাক্য লম্বা করা নয়, বরং যেখানে যেমন দরকার সেভাবে বাক্যের দৈর্ঘ্য বেছে নেওয়া।',
    },
  },
]

export const TOTAL_MODULES = MODULES.length
