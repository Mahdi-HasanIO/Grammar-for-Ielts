import type { Question } from '@/types'

/* Questions for Modules 23-24. */

export const stage5Practice: Question[] = [
  /* ---- Module 23 ---- */
  {
    id: 'm23-p1', moduleId: 23, type: 'multiple-choice',
    question: 'Which is the concise equivalent of "due to the fact that"?',
    options: ['because', 'therefore', 'although', 'despite'],
    answer: 'because',
    explanation:
      'অর্থ একটুও না হারিয়ে পাঁচটা শব্দ কমে একটা শব্দ হয়ে যায়।',
  },
  {
    id: 'm23-p2', moduleId: 23, type: 'choose-correct-sentence',
    question: 'Where should only go?',
    options: [
      'He almost drove his children to school every day.',
      'He drove his children to school almost every day.',
      'He drove almost his children to school every day.',
      'Almost he drove his children to school every day.',
    ],
    answer: 'He drove his children to school almost every day.',
    explanation:
      'সীমা বোঝানো Adverb বসবে ঠিক সেই অংশের পাশে, যেটাকে এটা সীমিত করছে।',
  },
  {
    id: 'm23-p3', moduleId: 23, type: 'rewrite',
    question: 'Make it concise: "The committee made a decision to conduct an investigation into the matter."',
    answer: 'The committee decided to investigate the matter.',
    acceptable: ['the committee decided to investigate the matter'],
    explanation:
      'Noun-এর আড়ালে লুকিয়ে থাকা Verb-গুলো ফিরিয়ে আনলে ছয়টা শব্দ কমে যায়।',
  },
  {
    id: 'm23-p4', moduleId: 23, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'Walking through the park, | the statues | were impressive | that afternoon.',
    options: ['Walking through the park,', 'the statues', 'were impressive', 'that afternoon'],
    answer: 'the statues',
    explanation:
      'মূর্তি তো হাঁটতে পারে না, তাই মূল Clause-এ এমন একটা Subject দরকার, যে হাঁটতে পারে।',
  },

  /* ---- Module 24 ---- */
  {
    id: 'm24-p1', moduleId: 24, type: 'multiple-choice',
    question: 'Which is the academic equivalent of "a lot of people"?',
    options: ['loads of people', 'many people', 'tons of people', 'people a lot'],
    answer: 'many people',
    explanation:
      'Many বা a significant proportion academic register-এর সঙ্গে মানানসই।',
  },
  {
    id: 'm24-p2', moduleId: 24, type: 'choose-correct-sentence',
    question: 'Which uses a colon correctly?',
    options: [
      'Three factors matter: are cost, time and access.',
      'Three factors matter: cost, time and access.',
      'The main issues are: cost, time and access.',
      'Three factors: matter cost, time and access.',
    ],
    answer: 'Three factors matter: cost, time and access.',
    explanation:
      'Colon বসে একটা পূর্ণ Clause-এর পরে, আর তালিকাটা আসে ঠিক তার পরেই।',
  },
  {
    id: 'm24-p3', moduleId: 24, type: 'fill-blank',
    question: 'Costs rose___ demand fell. (comma or semicolon?) Write the mark only.',
    answer: ';',
    acceptable: [';', 'semicolon'],
    explanation:
      'Semicolon কাছাকাছি অর্থের দুটো পূর্ণ বাক্য জোড়া দেয়।',
  },
  {
    id: 'm24-p4', moduleId: 24, type: 'rewrite',
    question: 'Raise the register: "As you can see from the graph, sales went up."',
    answer: 'As the graph shows, sales increased.',
    acceptable: ['as the graph shows, sales increased', 'the graph shows that sales increased'],
    explanation:
      'পাঠককে সরাসরি সম্বোধন এড়ান, আর phrasal verb-এর বদলে এক শব্দের Verb বসান।',
  },
]

export const stage5Test: Question[] = [
  /* ========================== Module 23 test ========================== */
  {
    id: 'm23-t1', moduleId: 23, type: 'multiple-choice',
    question: 'Which phrase can usually be deleted entirely?',
    options: ['because of', 'it is important to note that', 'in order to', 'as a result'],
    answer: 'it is important to note that',
    explanation:
      'এটা কোনো তথ্য দেয় না, শুধু ভূমিকা করে; বাদ দিলেও বাক্যটা ঠিকই থাকে।',
  },
  {
    id: 'm23-t2', moduleId: 23, type: 'choose-correct-sentence',
    question: 'Which version is concise?',
    options: [
      'There are a large number of students who are struggling with the course.',
      'Many students are struggling with the course.',
      'A large number of students are being in a struggle with the course.',
      'It is the case that many students struggle with the course.',
    ],
    answer: 'Many students are struggling with the course.',
    explanation:
      'There is... গঠন আর Relative Clause, দুটোই কোনো অর্থ যোগ করছিল না।',
  },
  {
    id: 'm23-t3', moduleId: 23, type: 'fill-blank',
    question: 'Replace "has the ability to" with one word.',
    answer: 'can',
    explanation:
      'একটা Modal-ই পুরো phrase-টার জায়গা নিয়ে নেয়।',
  },
  {
    id: 'm23-t4', moduleId: 23, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'The minister | announced a plan | to reduce emissions | on Tuesday.',
    options: ['The minister', 'announced a plan', 'to reduce emissions', 'on Tuesday'],
    answer: 'on Tuesday',
    explanation:
      'বাক্যের শেষে বসায় সময় বোঝানো phrase-টা মনে হচ্ছে emissions-কে বর্ণনা করছে; এটাকে সামনে নিয়ে আসুন।',
  },
  {
    id: 'm23-t5', moduleId: 23, type: 'multiple-choice',
    question: 'Why keep the subject close to its verb?',
    options: [
      'It makes sentences longer',
      'It reduces memory load and prevents agreement errors',
      'It is required by IELTS',
      'It allows more adjectives',
    ],
    answer: 'It reduces memory load and prevents agreement errors',
    explanation:
      'Subject আর Verb-এর মাঝে অনেক শব্দ থাকলে পাঠককে Subject মনে ধরে রাখতে হয়, আর agreement-এর ভুলও হয় সহজে।',
  },
  {
    id: 'm23-t6', moduleId: 23, type: 'multiple-choice',
    question: 'Which sentence places only correctly to mean nothing else was approved?',
    options: [
      'Only the committee approved the plan.',
      'The committee only approved the plan.',
      'The committee approved only the plan.',
      'The committee approved the plan only approved.',
    ],
    answer: 'The committee approved only the plan.',
    explanation:
      'Only বসে ঠিক সেই অংশের আগে, যেটাকে এটা সীমিত করছে।',
  },
  {
    id: 'm23-t7', moduleId: 23, type: 'choose-correct-sentence',
    question: 'Which revision is clearest?',
    options: [
      'The implementation of the utilisation of renewable resources is necessary.',
      'Renewable resources must be used more widely.',
      'The utilisation implementation of renewables is a necessity.',
      'There is a necessity of the implementation of renewables.',
    ],
    answer: 'Renewable resources must be used more widely.',
    explanation:
      'একের পর এক nominalization ভেঙে ফেললে সহজ একটা Verb ফিরে আসে।',
  },
  {
    id: 'm23-t8', moduleId: 23, type: 'fill-blank',
    question: 'Replace "in spite of the fact that" with one word.',
    answer: 'although',
    explanation:
      'Although-এর পরে সরাসরি Clause বসে।',
  },
  {
    id: 'm23-t9', moduleId: 23, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'In todays modern world of today, | technology | is important | to everyone.',
    options: ['In todays modern world of today,', 'technology', 'is important', 'to everyone'],
    answer: 'In todays modern world of today,',
    explanation:
      'Phrase-টা একই কথা দুবার বলছে; শুধু Today লিখলেই যথেষ্ট হতো।',
  },
  {
    id: 'm23-t10', moduleId: 23, type: 'multiple-choice',
    question: 'What should you do with a sentence you lose track of while writing?',
    options: [
      'Add another clause to finish the thought',
      'Split it into two sentences',
      'Add a semicolon and continue',
      'Delete the subject',
    ],
    answer: 'Split it into two sentences',
    explanation:
      'ভুলওয়ালা একটা লম্বা বাক্যের চেয়ে দুটো নির্ভুল বাক্য বেশি নম্বর পায়।',
  },

  /* ========================== Module 24 test ========================== */
  {
    id: 'm24-t1', moduleId: 24, type: 'choose-correct-sentence',
    question: 'Which sentence fits academic register?',
    options: [
      'Kids nowadays are getting addicted to their phones big time.',
      'Children today spend an increasing amount of time on their phones.',
      'Kids these days cant stop using phones.',
      'Children are into phones a lot nowadays.',
    ],
    answer: 'Children today spend an increasing amount of time on their phones.',
    explanation:
      'Formal Noun, নির্দিষ্ট Verb, আর কোনো slang নেই।',
  },
  {
    id: 'm24-t2', moduleId: 24, type: 'multiple-choice',
    question: 'Which punctuation mark introduces an explanation or list?',
    options: ['semicolon', 'colon', 'comma', 'dash'],
    answer: 'colon',
    explanation:
      'একটা পূর্ণ Clause-এর পরে colon বসিয়ে পরের কথাটা সামনে আনা হয়।',
  },
  {
    id: 'm24-t3', moduleId: 24, type: 'fill-blank',
    question: 'Write the formal equivalent of "find out" in one word.',
    answer: 'discover',
    acceptable: ['discover', 'determine', 'establish', 'ascertain'],
    explanation:
      'Academic লেখায় কথ্য phrasal verb-এর জায়গায় সাধারণত এক শব্দের Verb বসে।',
  },
  {
    id: 'm24-t4', moduleId: 24, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'The main issues | are: | cost, time | and access.',
    options: ['The main issues', 'are:', 'cost, time', 'and access'],
    answer: 'are:',
    explanation:
      'Verb আর তার Object-এর মাঝখানে colon বসানো যায় না।',
  },
  {
    id: 'm24-t5', moduleId: 24, type: 'multiple-choice',
    question: 'Which is correct in formal academic writing?',
    options: ['didnt work', 'did not work', 'didn t work', 'not worked'],
    answer: 'did not work',
    explanation:
      'Academic register-এ contraction এড়িয়ে চলা হয়।',
  },
  {
    id: 'm24-t6', moduleId: 24, type: 'choose-correct-sentence',
    question: 'Which uses a semicolon correctly?',
    options: [
      'Costs rose, demand fell.',
      'Costs rose; demand fell.',
      'Costs rose; and demand fell.',
      'Costs rose; however demand fell.',
    ],
    answer: 'Costs rose; demand fell.',
    explanation:
      'দুই পাশেই একটা করে পূর্ণ বাক্য আছে, আর দুটোর অর্থ কাছাকাছি।',
  },
  {
    id: 'm24-t7', moduleId: 24, type: 'multiple-choice',
    question: 'What does purposeful sentence variety mean?',
    options: [
      'Making every sentence long',
      'Choosing sentence length for effect',
      'Alternating tenses',
      'Using a connector in each sentence',
    ],
    answer: 'Choosing sentence length for effect',
    explanation:
      'দুটো লম্বা বাক্যের পরে একটা ছোট বাক্য পাঠকের মনে জোরে দাগ কাটে, আর এটাই উদ্দেশ্য।',
  },
  {
    id: 'm24-t8', moduleId: 24, type: 'fill-blank',
    question: 'Costs rose; ___, demand fell. (however with correct punctuation after it)',
    answer: 'however',
    explanation:
      'However দিয়ে দ্বিতীয় Clause শুরু হলে এর পরে একটা কমা বসে।',
  },
  {
    id: 'm24-t9', moduleId: 24, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'Although many argue | that the policy is effective, | however | it remains controversial.',
    options: ['Although many argue', 'that the policy is effective,', 'however', 'it remains controversial'],
    answer: 'however',
    explanation:
      'Although আগেই বৈপরীত্যটা বুঝিয়ে দিয়েছে, তাই আরেকটা connector বসানো ভুল।',
  },
  {
    id: 'm24-t10', moduleId: 24, type: 'multiple-choice',
    question: 'What does a wide range of structures mean at Band 8?',
    options: [
      'Every sentence is complex',
      'You can choose the right structure, including a simple one',
      'You use inversion and clefts often',
      'You use the longest possible sentences',
    ],
    answer: 'You can choose the right structure, including a simple one',
    explanation:
      'Range মানে সাবলীলতা আর নির্ভুলতা, সবকিছু জটিল করে ফেলা নয়।',
  },
]
