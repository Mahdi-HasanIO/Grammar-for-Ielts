import type { Question } from '@/types'

/* Questions for Modules 12-17. */

export const stage3Practice: Question[] = [
  /* ---- Module 12 ---- */
  {
    id: 'm12-p1', moduleId: 12, type: 'choose-correct-sentence',
    question: 'Which sentence is correct?',
    options: [
      'Although it is expensive, but it is effective.',
      'Although it is expensive, it is effective.',
      'Although it is expensive, however it is effective.',
      'Although it is expensive, so it is effective.',
    ],
    answer: 'Although it is expensive, it is effective.',
    explanation:
      'Although আগেই বৈপরীত্য বুঝিয়ে দিয়েছে, তাই দ্বিতীয় কোনো connector লাগে না।',
  },
  {
    id: 'm12-p2', moduleId: 12, type: 'fill-blank',
    question: '___ the high cost, the scheme was approved. (Despite / Although)',
    answer: 'Despite',
    explanation:
      'The high cost একটা Noun phrase, তাই Preposition despite এখানে ঠিক।',
  },
  {
    id: 'm12-p3', moduleId: 12, type: 'multiple-choice',
    question: 'Which word expresses a straight contrast between two facts?',
    options: ['although', 'whereas', 'because', 'so that'],
    answer: 'whereas',
    explanation:
      'Whereas দুটো তথ্যের সরাসরি পার্থক্য বোঝায়, আর although বোঝায় ফলটা প্রত্যাশার উল্টো।',
  },
  {
    id: 'm12-p4', moduleId: 12, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'Because the roads | are congested, | therefore commuting | takes longer.',
    options: ['Because the roads', 'are congested,', 'therefore commuting', 'takes longer'],
    answer: 'therefore commuting',
    explanation:
      'Because আর therefore দুটোই কারণ-ফলাফল বোঝায়, তাই একসঙ্গে বসালে একই কাজে দুটো connector হয়ে যায়।',
  },

  /* ---- Module 13 ---- */
  {
    id: 'm13-p1', moduleId: 13, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'The policy | which it was | introduced in 2015 | reduced pollution.',
    options: ['The policy', 'which it was', 'introduced in 2015', 'reduced pollution'],
    answer: 'which it was',
    explanation:
      'Which নিজেই Relative Clause-টার Subject, তাই it বসালে দুটো Subject হয়ে যায়।',
  },
  {
    id: 'm13-p2', moduleId: 13, type: 'multiple-choice',
    question: 'The researcher ___ study was published won an award.',
    options: ['who', 'which', 'whose', 'whom'],
    answer: 'whose',
    explanation:
      'Whose দিয়ে কার জিনিস তা বোঝায়: study-টা researcher-এর।',
  },
  {
    id: 'm13-p3', moduleId: 13, type: 'choose-correct-sentence',
    question: 'Which sentence punctuates a non-defining clause correctly?',
    options: [
      'My hometown which is in the north has grown rapidly.',
      'My hometown, which is in the north, has grown rapidly.',
      'My hometown, that is in the north, has grown rapidly.',
      'My hometown which is in the north, has grown rapidly.',
    ],
    answer: 'My hometown, which is in the north, has grown rapidly.',
    explanation:
      'একটাই আছে এমন Noun সম্পর্কে বাড়তি তথ্য দিলে দুই পাশে কমা বসে, আর which ব্যবহার হয়।',
  },
  {
    id: 'm13-p4', moduleId: 13, type: 'rewrite',
    question: 'Reduce the relative clause: "The report which was published in 2020 criticises the plan."',
    answer: 'The report published in 2020 criticises the plan.',
    acceptable: ['the report published in 2020 criticises the plan'],
    explanation:
      'which was বাদ দিলে শুধু past participle থাকে, যেটা Noun-টাকে বর্ণনা করে।',
  },

  /* ---- Module 14 ---- */
  {
    id: 'm14-p1', moduleId: 14, type: 'choose-correct-sentence',
    question: 'Which embedded question is correct?',
    options: [
      'I wonder why do people move to cities.',
      'I wonder why people move to cities.',
      'I wonder why people do move to cities?',
      'I wonder that why people move to cities.',
    ],
    answer: 'I wonder why people move to cities.',
    explanation:
      'Embedded question-এ statement-এর word order থাকে, আর auxiliary do বাদ যায়।',
  },
  {
    id: 'm14-p2', moduleId: 14, type: 'fill-blank',
    question: 'It is unclear ___ the scheme will succeed. (if / whether)',
    answer: 'whether',
    explanation:
      'Formal লেখায় হ্যাঁ-না বিকল্প বোঝাতে whether বেশি মানানসই।',
  },
  {
    id: 'm14-p3', moduleId: 14, type: 'rewrite',
    question: 'Use extraposition: "That the climate is changing is now undisputed."',
    answer: 'It is now undisputed that the climate is changing.',
    acceptable: ['it is now undisputed that the climate is changing'],
    explanation:
      'ভারী Clause-টাকে শেষে পাঠালে end-weight নিয়ম (ভারী অংশ শেষে) মানা হয়।',
  },
  {
    id: 'm14-p4', moduleId: 14, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'The study | examines how | does air pollution | affect health.',
    options: ['The study', 'examines how', 'does air pollution', 'affect health'],
    answer: 'does air pollution',
    explanation:
      'does বাদ দিয়ে statement-এর word order-এ লিখুন: how air pollution affects health।',
  },

  /* ---- Module 15 ---- */
  {
    id: 'm15-p1', moduleId: 15, type: 'multiple-choice',
    question: 'If the government ___ more, the problem will be solved.',
    options: ['will invest', 'invests', 'invested', 'would invest'],
    answer: 'invests',
    explanation:
      'First conditional-এর if-clause-এ Present simple বসে।',
  },
  {
    id: 'm15-p2', moduleId: 15, type: 'choose-correct-sentence',
    question: 'Which second conditional is correct?',
    options: [
      'If people would recycle more, less waste would go to landfill.',
      'If people recycled more, less waste would go to landfill.',
      'If people recycle more, less waste would go to landfill.',
      'If people will recycle more, less waste would go to landfill.',
    ],
    answer: 'If people recycled more, less waste would go to landfill.',
    explanation:
      'Second conditional-এ if-clause-এ Past simple আর ফলাফলে would + base form বসে।',
  },
  {
    id: 'm15-p3', moduleId: 15, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'Unless | we do not act now, | the situation | will worsen.',
    options: ['Unless', 'we do not act now,', 'the situation', 'will worsen'],
    answer: 'we do not act now,',
    explanation:
      'Unless-এর অর্থই if not, তাই আরেকটা not বসালে অর্থ উল্টে যায়।',
  },
  {
    id: 'm15-p4', moduleId: 15, type: 'fill-blank',
    question: 'If I ___ the minister, I would increase funding. (was / were)',
    answer: 'were',
    explanation:
      'Formal লেখায় কাল্পনিক অর্থে were ব্যবহার হয়।',
  },

  /* ---- Module 16 ---- */
  {
    id: 'm16-p1', moduleId: 16, type: 'choose-correct-sentence',
    question: 'Which list is parallel?',
    options: [
      'The policy reduces pollution, saving money and to improve health.',
      'The policy reduces pollution, saves money and improves health.',
      'The policy reduces pollution, money saving and health improvement.',
      'The policy reduces pollution, to save money and improving health.',
    ],
    answer: 'The policy reduces pollution, saves money and improves health.',
    explanation:
      'তিনটা আইটেমই এখন একই Subject-এর finite verb।',
  },
  {
    id: 'm16-p2', moduleId: 16, type: 'multiple-choice',
    question: 'The city is not only crowded but also ___.',
    options: ['it is expensive', 'expensive', 'expensively', 'has expense'],
    answer: 'expensive',
    explanation:
      'not only-এর পরে যা বসে, but also-এর পরেও তাই বসবে: Adjective-এর সঙ্গে Adjective।',
  },
  {
    id: 'm16-p3', moduleId: 16, type: 'fill-blank',
    question: 'The climate of Spain is warmer than ___ of Norway. (that / those)',
    answer: 'that',
    explanation:
      'That of দিয়ে একবচন Noun climate বোঝানো হচ্ছে, তাই তুলনার দুই পাশে একই জিনিস থাকে।',
  },
  {
    id: 'm16-p4', moduleId: 16, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'She enjoys | reading, | to travel | and cooking.',
    options: ['She enjoys', 'reading,', 'to travel', 'and cooking'],
    answer: 'to travel',
    explanation:
      'Enjoy-এর পরে -ing বসে, তাই তালিকার প্রতিটি আইটেম -ing রূপে হতে হবে।',
  },

  /* ---- Module 17 ---- */
  {
    id: 'm17-p1', moduleId: 17, type: 'choose-correct-sentence',
    question: 'Which sentence has no dangling modifier?',
    options: [
      'Walking to school, the rain started.',
      'Walking to school, I was caught in the rain.',
      'Walking to school, it rained heavily.',
      'Walking to school, the weather turned bad.',
    ],
    answer: 'Walking to school, I was caught in the rain.',
    explanation:
      'হাঁটার কাজটা মূল Clause-এর Subject-কেই করতে হবে।',
  },
  {
    id: 'm17-p2', moduleId: 17, type: 'fill-blank',
    question: 'The report ___ in 2020 criticises the plan. (publishing / published)',
    answer: 'published',
    explanation:
      'Report-টা প্রকাশ করা হয়েছিল, তাই ছোট রূপে past participle বসে।',
  },
  {
    id: 'm17-p3', moduleId: 17, type: 'multiple-choice',
    question: 'The figure rose steadily, ___ a peak in 2010.',
    options: ['reached', 'reaching', 'to reaching', 'reaches'],
    answer: 'reaching',
    explanation:
      'বাক্যের শেষে ফলাফল বোঝানো Clause -ing রূপ নেয়।',
  },
  {
    id: 'm17-p4', moduleId: 17, type: 'rewrite',
    question: 'Fix the dangling modifier: "Having finished the report, the deadline was met."',
    answer: 'Having finished the report, the team met the deadline.',
    acceptable: ['having finished the report, the team met the deadline', 'having finished the report, we met the deadline'],
    explanation:
      'মূল Clause-এ এমন একটা Subject থাকতে হবে, যে আসলে report-টা শেষ করেছে।',
  },
]

export const stage3Test: Question[] = [
  /* ========================== Module 12 test ========================== */
  {
    id: 'm12-t1', moduleId: 12, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'Even though | renewable energy is clean, | but it remains | expensive.',
    options: ['Even though', 'renewable energy is clean,', 'but it remains', 'expensive'],
    answer: 'but it remains',
    explanation:
      'Even though একটা Subordinator, তাই এর সঙ্গে but বসতে পারে না।',
  },
  {
    id: 'm12-t2', moduleId: 12, type: 'multiple-choice',
    question: '___ the traffic was heavy, we arrived on time.',
    options: ['Despite', 'In spite of', 'Although', 'Despite of'],
    answer: 'Although',
    explanation:
      'পূর্ণ Clause বসাতে হলে although লাগে; despite আর in spite of-এর পরে Noun phrase বসে।',
  },
  {
    id: 'm12-t3', moduleId: 12, type: 'choose-correct-sentence',
    question: 'Which sentence is correct?',
    options: [
      'Despite of the cost, the project continued.',
      'Despite the cost, the project continued.',
      'Despite the cost was high, the project continued.',
      'Despite that the cost, the project continued.',
    ],
    answer: 'Despite the cost, the project continued.',
    explanation:
      'Despite-এর সঙ্গে কখনো of বসে না, আর এর পরে Clause-ও বসে না।',
  },
  {
    id: 'm12-t4', moduleId: 12, type: 'fill-blank',
    question: 'Taxes were cut ___ that firms could invest. (so / such)',
    answer: 'so',
    explanation:
      'So that দিয়ে উদ্দেশ্য বোঝানো Clause শুরু হয়।',
  },
  {
    id: 'm12-t5', moduleId: 12, type: 'multiple-choice',
    question: 'Which connector marks concession?',
    options: ['because', 'although', 'so that', 'when'],
    answer: 'although',
    explanation:
      'Although বোঝায়, প্রথম Clause দেখে যা আশা করা যেত, ফলটা তার উল্টো।',
  },
  {
    id: 'm12-t6', moduleId: 12, type: 'choose-correct-sentence',
    question: 'Which sentence is complete?',
    options: [
      'Whereas some people prefer cities.',
      'Whereas some people prefer cities, others prefer the countryside.',
      'Whereas, some people prefer cities and countryside.',
      'Some people prefer cities. Whereas the countryside.',
    ],
    answer: 'Whereas some people prefer cities, others prefer the countryside.',
    explanation:
      'Whereas দিয়ে শুরু হওয়া Clause নির্ভরশীল, তাই এর সঙ্গে একটা main clause লাগে।',
  },
  {
    id: 'm12-t7', moduleId: 12, type: 'multiple-choice',
    question: 'Which is correct after because?',
    options: ['a noun phrase', 'an -ing form', 'a full clause', 'an adjective'],
    answer: 'a full clause',
    explanation:
      'Because-এর পরে Clause বসে, আর because of-এর পরে Noun phrase।',
  },
  {
    id: 'm12-t8', moduleId: 12, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'The policy failed, | because of poor planning | and it was | underfunded.',
    options: ['The policy failed,', 'because of poor planning', 'and it was', 'underfunded'],
    answer: 'because of poor planning',
    explanation:
      'দ্বিতীয় অংশটা একটা Clause, তাই connector হবে because, because of নয়।',
  },
  {
    id: 'm12-t9', moduleId: 12, type: 'fill-blank',
    question: 'Urban areas are growing, ___ rural areas are shrinking. (whereas / although)',
    answer: 'whereas',
    explanation:
      'দুটো তথ্য শুধু আলাদা, অর্থাৎ এটা সাধারণ বৈপরীত্য, প্রত্যাশার উল্টো কোনো ফল নয়।',
  },
  {
    id: 'm12-t10', moduleId: 12, type: 'multiple-choice',
    question: 'Which version is correctly punctuated?',
    options: [
      'Costs rose, however demand fell.',
      'Costs rose; however, demand fell.',
      'Costs rose however; demand fell.',
      'Costs rose, however; demand fell.',
    ],
    answer: 'Costs rose; however, demand fell.',
    explanation:
      'However-এর আগে semicolon বা full stop আর পরে কমা বসে।',
  },

  /* ========================== Module 13 test ========================== */
  {
    id: 'm13-t1', moduleId: 13, type: 'multiple-choice',
    question: 'Students ___ study hard usually succeed.',
    options: ['which', 'who', 'whose', 'where'],
    answer: 'who',
    explanation:
      'Who বসে মানুষের জন্য; which বস্তুর জন্য।',
  },
  {
    id: 'm13-t2', moduleId: 13, type: 'choose-correct-sentence',
    question: 'Which sentence is correct?',
    options: [
      'The report, that was released yesterday, criticises the plan.',
      'The report, which was released yesterday, criticises the plan.',
      'The report which, was released yesterday, criticises the plan.',
      'The report that, was released yesterday criticises the plan.',
    ],
    answer: 'The report, which was released yesterday, criticises the plan.',
    explanation:
      'Non-defining clause-এ that ব্যবহার করা যায় না।',
  },
  {
    id: 'm13-t3', moduleId: 13, type: 'fill-blank',
    question: 'The company, ___ employs 2,000 people, is expanding. (who / which)',
    answer: 'which',
    explanation:
      'প্রতিষ্ঠান কোনো মানুষ নয়, তাই এর সঙ্গে which বসে।',
  },
  {
    id: 'm13-t4', moduleId: 13, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'This is | the village | where I grew up in | last year.',
    options: ['This is', 'the village', 'where I grew up in', 'last year'],
    answer: 'where I grew up in',
    explanation:
      'Where-এর ভেতরেই Preposition-টা আছে, তাই আলাদা করে in বসানো বাড়তি।',
  },
  {
    id: 'm13-t5', moduleId: 13, type: 'multiple-choice',
    question: 'What does the comma change in "Workers, who were unskilled, lost their jobs"?',
    options: [
      'Only the unskilled workers lost their jobs.',
      'All the workers were unskilled and lost their jobs.',
      'Nothing; the meaning is the same.',
      'The sentence becomes a fragment.',
    ],
    answer: 'All the workers were unskilled and lost their jobs.',
    explanation:
      'কমা বসালে Clause-টা non-defining হয়ে যায়, অর্থাৎ তখন এটা সবার সম্পর্কেই বলছে।',
  },
  {
    id: 'm13-t6', moduleId: 13, type: 'multiple-choice',
    question: 'The period ___ the economy grew fastest was the 1990s.',
    options: ['which', 'in which', 'that', 'what'],
    answer: 'in which',
    explanation:
      'Clause-টাতে একটা Preposition দরকার, তাই in which বা সহজভাবে when বসবে।',
  },
  {
    id: 'm13-t7', moduleId: 13, type: 'choose-correct-sentence',
    question: 'Which reduced clause is correct?',
    options: [
      'People live in rural areas often lack healthcare.',
      'People living in rural areas often lack healthcare.',
      'People lived in rural areas often lack healthcare.',
      'People who living in rural areas often lack healthcare.',
    ],
    answer: 'People living in rural areas often lack healthcare.',
    explanation:
      'Active অর্থের Relative Clause ছোট করলে -ing রূপ নেয়।',
  },
  {
    id: 'm13-t8', moduleId: 13, type: 'fill-blank',
    question: 'The rate ___ which temperatures are rising is alarming.',
    answer: 'at',
    explanation:
      'নির্দিষ্ট গঠনটা হলো the rate at which।',
  },
  {
    id: 'm13-t9', moduleId: 13, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'The book | that I read it | last week | was useful.',
    options: ['The book', 'that I read it', 'last week', 'was useful'],
    answer: 'that I read it',
    explanation:
      'That আগে থেকেই read-এর Object, তাই it বসালে দুটো Object হয়ে যায়।',
  },
  {
    id: 'm13-t10', moduleId: 13, type: 'multiple-choice',
    question: 'Which relative clause is defining?',
    options: [
      'My brother, who lives in Paris, is an engineer.',
      'Students who study abroad often become more independent.',
      'The report, which runs to 300 pages, is controversial.',
      'Jakarta, which is sinking, is the capital.',
    ],
    answer: 'Students who study abroad often become more independent.',
    explanation:
      'এটা বুঝিয়ে দিচ্ছে কোন শিক্ষার্থীদের কথা হচ্ছে, তাই এতে কোনো কমা বসে না।',
  },

  /* ========================== Module 14 test ========================== */
  {
    id: 'm14-t1', moduleId: 14, type: 'choose-correct-sentence',
    question: 'Which sentence is correct?',
    options: [
      'Nobody knows what will be the outcome.',
      'Nobody knows what the outcome will be.',
      'Nobody knows what does the outcome be.',
      'Nobody knows that what the outcome will be.',
    ],
    answer: 'Nobody knows what the outcome will be.',
    explanation:
      'Embedded clause-এ Subject আগে আর Verb পরে থাকে।',
  },
  {
    id: 'm14-t2', moduleId: 14, type: 'multiple-choice',
    question: 'The question of ___ students should pay fees is controversial.',
    options: ['if', 'whether', 'that', 'what'],
    answer: 'whether',
    explanation:
      'Preposition-এর পরে শুধু whether বসতে পারে।',
  },
  {
    id: 'm14-t3', moduleId: 14, type: 'fill-blank',
    question: 'It is argued ___ technology has reduced employment. (that / which)',
    answer: 'that',
    explanation:
      'Reporting verb-এর পরে একটা that-clause বসে।',
  },
  {
    id: 'm14-t4', moduleId: 14, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'Researchers | want to know | that why | the figure fell.',
    options: ['Researchers', 'want to know', 'that why', 'the figure fell'],
    answer: 'that why',
    explanation:
      'wh-শব্দের সঙ্গে that বসে না; একটা connector-ই যথেষ্ট।',
  },
  {
    id: 'm14-t5', moduleId: 14, type: 'multiple-choice',
    question: 'Which sentence uses extraposition?',
    options: [
      'That the policy failed is undeniable.',
      'It is undeniable that the policy failed.',
      'The policy failed undeniably.',
      'Undeniably the policy has failed.',
    ],
    answer: 'It is undeniable that the policy failed.',
    explanation:
      'Clause-টা শেষে চলে গেছে, আর Subject-এর জায়গা পূরণ করছে it।',
  },
  {
    id: 'm14-t6', moduleId: 14, type: 'choose-correct-sentence',
    question: 'Which embedded question is correct?',
    options: [
      'The report explains how can governments reduce waste.',
      'The report explains how governments can reduce waste.',
      'The report explains how do governments reduce waste.',
      'The report explains that how governments can reduce waste.',
    ],
    answer: 'The report explains how governments can reduce waste.',
    explanation:
      'Embedded question-এর ভেতরে কোনো inversion হয় না।',
  },
  {
    id: 'm14-t7', moduleId: 14, type: 'multiple-choice',
    question: 'Which reporting verb commits you most strongly to the finding?',
    options: ['suggests', 'indicates', 'demonstrates', 'implies'],
    answer: 'demonstrates',
    explanation:
      'Demonstrates বা shows লিখলে লেখক নিজেও ফলাফলটা মেনে নেন; suggests বা indicates-এ তা হয় না।',
  },
  {
    id: 'm14-t8', moduleId: 14, type: 'fill-blank',
    question: 'They must decide ___ to expand or consolidate. (if / whether)',
    answer: 'whether',
    explanation:
      'to-infinitive-এর আগে শুধু whether বসতে পারে।',
  },
  {
    id: 'm14-t9', moduleId: 14, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'It is depends | on whether | funding | is available.',
    options: ['It is depends', 'on whether', 'funding', 'is available'],
    answer: 'It is depends',
    explanation:
      'এই it is-এর পরে Adjective বসে, কোনো পূর্ণ Verb নয়; তাই লিখুন It depends।',
  },
  {
    id: 'm14-t10', moduleId: 14, type: 'multiple-choice',
    question: 'Convert to an embedded form: "What does it cost?"',
    options: ['what does it cost', 'how much it costs', 'what costs it', 'how much does it cost'],
    answer: 'how much it costs',
    explanation:
      'Auxiliary বাদ দিন, আর মূল Verb-কে তার স্বাভাবিক রূপে ফিরিয়ে আনুন।',
  },

  /* ========================== Module 15 test ========================== */
  {
    id: 'm15-t1', moduleId: 15, type: 'choose-correct-sentence',
    question: 'Which sentence is consistent?',
    options: [
      'If companies would pay higher wages, employees will be more motivated.',
      'If companies paid higher wages, employees would be more motivated.',
      'If companies pay higher wages, employees would have been motivated.',
      'If companies will pay higher wages, employees would be motivated.',
    ],
    answer: 'If companies paid higher wages, employees would be more motivated.',
    explanation:
      'Second conditional-এ Past simple-এর সঙ্গে would + base form বসে।',
  },
  {
    id: 'm15-t2', moduleId: 15, type: 'multiple-choice',
    question: 'When the government ___ the law, protests will begin.',
    options: ['will introduce', 'introduces', 'introduced', 'would introduce'],
    answer: 'introduces',
    explanation:
      'Time clause-এও if-clause-এর মতোই will বসে না।',
  },
  {
    id: 'm15-t3', moduleId: 15, type: 'fill-blank',
    question: 'The plan will work provided that it ___ support. (receives / will receive)',
    answer: 'receives',
    explanation:
      'Provided that-এর নিয়ম if-এর মতোই, তাই এর পরে Present tense বসে।',
  },
  {
    id: 'm15-t4', moduleId: 15, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'Unless if | the policy changes, | the issue | will remain.',
    options: ['Unless if', 'the policy changes,', 'the issue', 'will remain'],
    answer: 'Unless if',
    explanation:
      'Unless আর if একসঙ্গে বসে না; unless-এর অর্থই except if।',
  },
  {
    id: 'm15-t5', moduleId: 15, type: 'multiple-choice',
    question: 'Which conditional states a general truth?',
    options: [
      'If demand rises, prices increase.',
      'If demand rises, prices will increase.',
      'If demand rose, prices would increase.',
      'If demand had risen, prices would have increased.',
    ],
    answer: 'If demand rises, prices increase.',
    explanation:
      'Zero conditional-এ দুই Clause-এই Present simple বসে।',
  },
  {
    id: 'm15-t6', moduleId: 15, type: 'multiple-choice',
    question: 'If education ___ free, more people could attend university.',
    options: ['would be', 'were', 'will be', 'is being'],
    answer: 'were',
    explanation:
      'Were দিয়ে কাল্পনিক শর্ত বোঝানো হয়, আর would বসে ফলাফলের Clause-এ।',
  },
  {
    id: 'm15-t7', moduleId: 15, type: 'choose-correct-sentence',
    question: 'Which sentence uses unless correctly?',
    options: [
      'Unless action is not taken, emissions will rise.',
      'Unless action is taken, emissions will rise.',
      'Unless action will be taken, emissions will rise.',
      'Unless if action is taken, emissions will rise.',
    ],
    answer: 'Unless action is taken, emissions will rise.',
    explanation:
      'Unless-এর ভেতরেই না-বোধক অর্থ আছে, আর এর পরে Present tense বসে।',
  },
  {
    id: 'm15-t8', moduleId: 15, type: 'fill-blank',
    question: 'Remote work is effective as long as teams ___ regularly. (communicate / will communicate)',
    answer: 'communicate',
    explanation:
      'As long as একটা শর্ত বোঝায়, আর এর পরে Present simple বসে।',
  },
  {
    id: 'm15-t9', moduleId: 15, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'If the government | will reduce taxes, | businesses | will invest more.',
    options: ['If the government', 'will reduce taxes,', 'businesses', 'will invest more'],
    answer: 'will reduce taxes,',
    explanation:
      'If-clause-এ Present simple বসে: reduces।',
  },
  {
    id: 'm15-t10', moduleId: 15, type: 'multiple-choice',
    question: 'Which conditional presents a proposal as hypothetical rather than likely?',
    options: [
      'If schools introduce financial education, students will manage money better.',
      'If schools introduced financial education, students would manage money better.',
      'If schools introduce financial education, students manage money better.',
      'Unless schools introduce financial education, students will struggle.',
    ],
    answer: 'If schools introduced financial education, students would manage money better.',
    explanation:
      'Second conditional বোঝায় যে আপনি ভবিষ্যদ্বাণী করছেন না, একটা কাল্পনিক অবস্থার কথা বলছেন।',
  },

  /* ========================== Module 16 test ========================== */
  {
    id: 'm16-t1', moduleId: 16, type: 'choose-correct-sentence',
    question: 'Which sentence is parallel?',
    options: [
      'The course teaches students how to write reports, giving presentations and research skills.',
      'The course teaches students how to write reports, give presentations and conduct research.',
      'The course teaches students how to write reports, presentations and researching.',
      'The course teaches students writing reports, to give presentations and research.',
    ],
    answer: 'The course teaches students how to write reports, give presentations and conduct research.',
    explanation:
      'তিনটা আইটেমই এখন how to-এর পরে bare infinitive হিসেবে বসেছে।',
  },
  {
    id: 'm16-t2', moduleId: 16, type: 'multiple-choice',
    question: 'He is responsible for planning events, ___ budgets and managing staff.',
    options: ['to organise', 'organise', 'organising', 'organisation'],
    answer: 'organising',
    explanation:
      'Preposition for-এর পরে প্রতিটি আইটেম -ing রূপে হবে।',
  },
  {
    id: 'm16-t3', moduleId: 16, type: 'fill-blank',
    question: 'Wages in the north are lower than ___ in the south. (that / those)',
    answer: 'those',
    explanation:
      'Those দিয়ে বহুবচন Noun wages বোঝানো হচ্ছে।',
  },
  {
    id: 'm16-t4', moduleId: 16, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'The report | is both detailed | and it is | well researched.',
    options: ['The report', 'is both detailed', 'and it is', 'well researched'],
    answer: 'and it is',
    explanation:
      'Both...and এখানে দুটো Adjective জোড়া দেয়, তাই একপাশে Clause বসালে parallelism ভেঙে যায়।',
  },
  {
    id: 'm16-t5', moduleId: 16, type: 'multiple-choice',
    question: 'Neither the cost nor the benefits ___ clear.',
    options: ['was', 'were', 'is', 'has been'],
    answer: 'were',
    explanation:
      'neither...nor-এর ক্ষেত্রে Verb মেলে কাছের Subject benefits-এর সঙ্গে, যা বহুবচন।',
  },
  {
    id: 'm16-t6', moduleId: 16, type: 'choose-correct-sentence',
    question: 'Which comparison is parallel?',
    options: [
      'Reading is more useful than to watch television.',
      'Reading is more useful than watching television.',
      'Reading is more useful than television watch.',
      'To read is more useful than watching television.',
    ],
    answer: 'Reading is more useful than watching television.',
    explanation:
      'তুলনার দুই পাশেই এখন -ing রূপ আছে।',
  },
  {
    id: 'm16-t7', moduleId: 16, type: 'multiple-choice',
    question: 'The city offers ___ good transport and affordable housing.',
    options: ['both', 'either', 'neither', 'not only'],
    answer: 'both',
    explanation:
      'Both...and একই ধরনের দুটো হ্যাঁ-বোধক আইটেম জোড়া দেয়।',
  },
  {
    id: 'm16-t8', moduleId: 16, type: 'multiple-choice',
    question: 'Which completes the list in parallel? "The aim is to reduce waste, cut costs and ___."',
    options: ['raising awareness', 'raise awareness', 'to raising awareness', 'awareness is raised'],
    answer: 'raise awareness',
    explanation:
      'তালিকার শুরুতে to থাকায় বাকি প্রতিটি আইটেম bare infinitive: reduce, cut, raise।',
  },
  {
    id: 'm16-t9', moduleId: 16, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'Governments should | invest in education, | improving healthcare | and build housing.',
    options: ['Governments should', 'invest in education,', 'improving healthcare', 'and build housing'],
    answer: 'improving healthcare',
    explanation:
      'Should-এর পরে প্রতিটি আইটেম bare infinitive হবে: improve healthcare।',
  },
  {
    id: 'm16-t10', moduleId: 16, type: 'multiple-choice',
    question: 'Which phrase keeps a comparison balanced?',
    options: [
      'The population of Japan is larger than Canada.',
      'The population of Japan is larger than that of Canada.',
      'The population of Japan is larger than those of Canada.',
      'The population of Japan is larger as Canada.',
    ],
    answer: 'The population of Japan is larger than that of Canada.',
    explanation:
      'That of দিয়ে একবচন head noun population আবার বোঝানো হচ্ছে।',
  },

  /* ========================== Module 17 test ========================== */
  {
    id: 'm17-t1', moduleId: 17, type: 'choose-correct-sentence',
    question: 'Which sentence has no dangling modifier?',
    options: [
      'After reviewing the evidence, the policy was changed.',
      'After reviewing the evidence, the committee changed the policy.',
      'After reviewing the evidence, changes were made.',
      'After reviewing the evidence, it was decided to change.',
    ],
    answer: 'After reviewing the evidence, the committee changed the policy.',
    explanation:
      'প্রমাণ পর্যালোচনার কাজটা মূল Clause-এর Subject-কেই করতে হবে।',
  },
  {
    id: 'm17-t2', moduleId: 17, type: 'multiple-choice',
    question: '___ in 2015, the scheme has reduced waiting times.',
    options: ['Introducing', 'Introduced', 'To introduce', 'Introduce'],
    answer: 'Introduced',
    explanation:
      'কাজটা Scheme-এর উপর হচ্ছে, তাই passive participle বসবে।',
  },
  {
    id: 'm17-t3', moduleId: 17, type: 'fill-blank',
    question: '___ completed the survey, the researchers analysed the data. (Having / Have)',
    answer: 'Having',
    explanation:
      'Having + past participle বোঝায়, কাজটা মূল Verb-এর আগেই শেষ হয়ে গেছে।',
  },
  {
    id: 'm17-t4', moduleId: 17, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'The report | writing by the committee | was published | yesterday.',
    options: ['The report', 'writing by the committee', 'was published', 'yesterday'],
    answer: 'writing by the committee',
    explanation:
      'Report-টা লেখা হয়েছিল, তাই ছোট রূপে past participle written বসবে।',
  },
  {
    id: 'm17-t5', moduleId: 17, type: 'multiple-choice',
    question: 'Which is the correct reduction of "Factors which affect performance"?',
    options: [
      'Factors affected performance',
      'Factors affecting performance',
      'Factors to affect performance',
      'Factors affect performance',
    ],
    answer: 'Factors affecting performance',
    explanation:
      'Active অর্থের Relative Clause ছোট করলে -ing রূপ নেয়।',
  },
  {
    id: 'm17-t6', moduleId: 17, type: 'choose-correct-sentence',
    question: 'Which sentence is correct?',
    options: [
      'Living in a big city, the cost of housing is very high.',
      'For those living in a big city, the cost of housing is very high.',
      'Living in a big city, housing costs are a problem for it.',
      'Live in a big city, the cost of housing is very high.',
    ],
    answer: 'For those living in a big city, the cost of housing is very high.',
    explanation:
      'এখন participle-টা এমন একটা Noun-কে বর্ণনা করছে, যে সত্যিই কোথাও বাস করতে পারে।',
  },
  {
    id: 'm17-t7', moduleId: 17, type: 'multiple-choice',
    question: 'The figure peaked in 2008, ___ 90 million.',
    options: ['reached', 'reaching', 'reach', 'to reach'],
    answer: 'reaching',
    explanation:
      'ফলাফল বোঝানো participle clause -ing রূপ নেয়, আর মূল Subject-এর সঙ্গেই জুড়ে থাকে।',
  },
  {
    id: 'm17-t8', moduleId: 17, type: 'fill-blank',
    question: 'The issues ___ be addressed are listed below. (to / for)',
    answer: 'to',
    explanation:
      'Noun-এর পরে বসা infinitive-এ to থাকে; এখানে passive রূপে: to be addressed।',
  },
  {
    id: 'm17-t9', moduleId: 17, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'The students | enrolling on the course | last year | have graduated.',
    options: ['The students', 'enrolling on the course', 'last year', 'have graduated'],
    answer: 'enrolling on the course',
    explanation:
      'শিক্ষার্থীদের ভর্তি করানো হয়েছিল, তাই passive participle enrolled সঠিক।',
  },
  {
    id: 'm17-t10', moduleId: 17, type: 'multiple-choice',
    question: 'What is the quickest fix for a dangling modifier?',
    options: [
      'Delete the main clause',
      'Restore the full clause with a subordinator',
      'Add a comma',
      'Change the tense',
    ],
    answer: 'Restore the full clause with a subordinator',
    explanation:
      'While I was walking to school... লিখলে Subject স্পষ্ট হয়ে যায়।',
  },
]
