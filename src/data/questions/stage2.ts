import type { Question } from '@/types'

/* Questions for Modules 6-11. */

export const stage2Practice: Question[] = [
  /* ---- Module 6 ---- */
  {
    id: 'm6-p1', moduleId: 6, type: 'multiple-choice',
    question: 'The population ___ dramatically in 1990.',
    options: ['has increased', 'increased', 'had increased', 'increases'],
    answer: 'increased',
    explanation:
      'নির্দিষ্ট ও শেষ হয়ে যাওয়া অতীত সময় উল্লেখ থাকলে Past simple লাগে।',
  },
  {
    id: 'm6-p2', moduleId: 6, type: 'fill-blank',
    question: 'Since 2010, the city ___ invested heavily in cycling. (has / had)',
    answer: 'has',
    explanation:
      'Since বোঝাচ্ছে সময়কালটি এখনো চলছে, আর সেখানে Present perfect বসে।',
  },
  {
    id: 'm6-p3', moduleId: 6, type: 'choose-correct-sentence',
    question: 'Which sentence is correct for a process diagram?',
    options: [
      'Firstly, the beans are harvested. Then workers dried them.',
      'Firstly, the beans are harvested. They are then dried.',
      'Firstly, the beans harvested. Then they dry.',
      'Firstly, the beans were harvested. They are then dried.',
    ],
    answer: 'Firstly, the beans are harvested. They are then dried.',
    explanation:
      'Process বর্ণনায় শুরু থেকে শেষ পর্যন্ত একই Tense ও একই Voice ধরে রাখতে হয়।',
  },
  {
    id: 'm6-p4', moduleId: 6, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'Nowadays, | people spent | more time online | than before.',
    options: ['Nowadays,', 'people spent', 'more time online', 'than before'],
    answer: 'people spent',
    explanation:
      'Nowadays বর্তমান সময় বোঝায়, তাই Verb হবে spend।',
  },

  /* ---- Module 7 ---- */
  {
    id: 'm7-p1', moduleId: 7, type: 'multiple-choice',
    question: 'Governments ___ reduce emissions more quickly.',
    options: ['should to', 'should', 'shoulds', 'should be'],
    answer: 'should',
    explanation:
      'Modal-এর পরে bare infinitive বসে; কোনো to নয়, কোনো -s নয়।',
  },
  {
    id: 'm7-p2', moduleId: 7, type: 'multiple-choice',
    question: 'Which modal expresses the strongest certainty about a conclusion?',
    options: ['might', 'could', 'must', 'may'],
    answer: 'must',
    explanation:
      'Must দিয়ে প্রমাণ থেকে পাওয়া দৃঢ় সিদ্ধান্ত বোঝানো হয়।',
  },
  {
    id: 'm7-p3', moduleId: 7, type: 'choose-correct-sentence',
    question: 'Which sentence is correct?',
    options: [
      'The rise might caused by population growth.',
      'The rise might have been caused by population growth.',
      'The rise might be caused by population growth happened.',
      'The rise might has been caused by population growth.',
    ],
    answer: 'The rise might have been caused by population growth.',
    explanation:
      'অতীতের সম্ভাবনা passive-এ বোঝাতে might have been + past participle বসে।',
  },
  {
    id: 'm7-p4', moduleId: 7, type: 'fill-blank',
    question: 'Employees ___ have to work overtime if they do not want to. (must not / do not)',
    answer: 'do not',
    explanation:
      'Do not have to বাধ্যবাধকতা তুলে নেয়, আর must not কাজটি নিষিদ্ধ করে।',
  },

  /* ---- Module 8 ---- */
  {
    id: 'm8-p1', moduleId: 8, type: 'multiple-choice',
    question: 'The new policy will ___ next year.',
    options: ['be introduce', 'be introduced', 'introduced', 'being introduced'],
    answer: 'be introduced',
    explanation:
      'Modal passive-এর গঠন হলো modal + be + past participle।',
  },
  {
    id: 'm8-p2', moduleId: 8, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'Many changes | have been occurred | in the city | since 2010.',
    options: ['Many changes', 'have been occurred', 'in the city', 'since 2010'],
    answer: 'have been occurred',
    explanation:
      'Occur-এর কোনো Object নেই, তাই এটি passive হতে পারে না: have occurred হবে।',
  },
  {
    id: 'm8-p3', moduleId: 8, type: 'choose-correct-sentence',
    question: 'Which impersonal reporting structure is correct?',
    options: [
      'It is said that the policy to be effective.',
      'The policy is said to be effective.',
      'The policy is said that it effective.',
      'It is said the policy to be effective.',
    ],
    answer: 'The policy is said to be effective.',
    explanation:
      'Subject + passive reporting verb + to-infinitive একটি সম্পূর্ণ গঠন।',
  },
  {
    id: 'm8-p4', moduleId: 8, type: 'rewrite',
    question: 'Rewrite in the active voice: "It was decided by the committee that the project would be cancelled."',
    answer: 'The committee cancelled the project.',
    acceptable: ['the committee cancelled the project', 'the committee decided to cancel the project'],
    explanation:
      'Active রূপটি কর্তার নাম বলে দেয় এবং ছয়টি বাড়তি শব্দ কমিয়ে দেয়।',
  },

  /* ---- Module 9 ---- */
  {
    id: 'm9-p1', moduleId: 9, type: 'multiple-choice',
    question: 'The report suggests ___ the budget.',
    options: ['to increase', 'increasing', 'increase', 'to increasing'],
    answer: 'increasing',
    explanation:
      'Suggest-এর পরে gerund বা that-clause বসে, কখনো to-infinitive নয়।',
  },
  {
    id: 'm9-p2', moduleId: 9, type: 'fill-blank',
    question: 'The law prevents companies ___ polluting rivers. (from / to)',
    answer: 'from',
    explanation:
      'Prevent-এর গঠন হলো prevent someone from doing something।',
  },
  {
    id: 'm9-p3', moduleId: 9, type: 'choose-correct-sentence',
    question: 'Which sentence is correct?',
    options: [
      'This policy allows to reduce traffic.',
      'This policy allows cities to reduce traffic.',
      'This policy allows reducing traffic to cities.',
      'This policy allows cities reducing traffic.',
    ],
    answer: 'This policy allows cities to reduce traffic.',
    explanation:
      'Allow-এর ক্ষেত্রে to-infinitive-এর আগে একটি Object বসাতেই হবে।',
  },
  {
    id: 'm9-p4', moduleId: 9, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'The government | should focus | to improve | healthcare.',
    options: ['The government', 'should focus', 'to improve', 'healthcare'],
    answer: 'to improve',
    explanation:
      'Focus-এর সঙ্গে on বসে, আর Preposition-এর পরে Verb -ing রূপ নেয়: on improving।',
  },

  /* ---- Module 10 ---- */
  {
    id: 'm10-p1', moduleId: 10, type: 'multiple-choice',
    question: 'There was a sharp increase ___ the number of tourists.',
    options: ['of', 'in', 'on', 'to'],
    answer: 'in',
    explanation:
      'increase, rise, fall ও decline - সবগুলোর পরেই in বসে, যা বোঝায় কী বদলেছে।',
  },
  {
    id: 'm10-p2', moduleId: 10, type: 'fill-blank',
    question: 'Social media has a huge impact ___ young people.',
    answer: 'on',
    explanation:
      'impact, effect ও influence - তিনটিরই সঙ্গে on বসে।',
  },
  {
    id: 'm10-p3', moduleId: 10, type: 'multiple-choice',
    question: 'Sales rose ___ 80 million units in 2020.',
    options: ['by', 'to', 'at', 'from'],
    answer: 'to',
    explanation:
      'To দিয়ে শেষ মান বোঝায়; by দিয়ে বোঝাত পরিবর্তনের পরিমাণ।',
  },
  {
    id: 'm10-p4', moduleId: 10, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'The essay | discusses about | three possible | solutions.',
    options: ['The essay', 'discusses about', 'three possible', 'solutions'],
    answer: 'discusses about',
    explanation:
      'Discuss সরাসরি Object নেয়, এর সঙ্গে কোনো Preposition বসে না।',
  },

  /* ---- Module 11 ---- */
  {
    id: 'm11-p1', moduleId: 11, type: 'multiple-choice',
    question: 'The second city is ___ than the first.',
    options: ['more bigger', 'much bigger', 'most big', 'more big'],
    answer: 'much bigger',
    explanation:
      'একটি comparative চিহ্নই যথেষ্ট, আর much দিয়ে পার্থক্যের মাত্রা বোঝানো হয়।',
  },
  {
    id: 'm11-p2', moduleId: 11, type: 'choose-correct-sentence',
    question: 'Which sentence states the multiple correctly?',
    options: [
      'There were twice more visitors in July than in January.',
      'There were twice as many visitors in July as in January.',
      'There were two times visitors in July than January.',
      'There were twice as much visitors in July as in January.',
    ],
    answer: 'There were twice as many visitors in July as in January.',
    explanation:
      'গুণিতক বোঝাতে as...as কাঠামো লাগে, আর visitors countable বলে many বসে।',
  },
  {
    id: 'm11-p3', moduleId: 11, type: 'fill-blank',
    question: 'Sales increased ___ between 2010 and 2015. (sharp / sharply)',
    answer: 'sharply',
    explanation:
      'Verb-কে বিশেষিত করে Adverb; Noun হলে Adjective sharp বসত।',
  },
  {
    id: 'm11-p4', moduleId: 11, type: 'rewrite',
    question: 'Rewrite using a verb and adverb: "There was a sharp rise in sales."',
    answer: 'Sales rose sharply.',
    acceptable: ['sales rose sharply', 'sales increased sharply'],
    explanation:
      'একই তথ্য Noun phrase দিয়েও বলা যায়, আবার Verb phrase দিয়েও।',
  },
]

export const stage2Test: Question[] = [
  /* =========================== Module 6 test ========================== */
  {
    id: 'm6-t1', moduleId: 6, type: 'multiple-choice',
    question: 'In 2020 the figure ___ its highest point.',
    options: ['has reached', 'reached', 'reaches', 'had been reaching'],
    answer: 'reached',
    explanation:
      'Present perfect-এর সঙ্গে in 2020-এর মতো শেষ হওয়া সময় বসতে পারে না।',
  },
  {
    id: 'm6-t2', moduleId: 6, type: 'choose-correct-sentence',
    question: 'Which sentence is correct?',
    options: [
      'If technology will improve, costs will fall.',
      'If technology improves, costs will fall.',
      'If technology improve, costs will fall.',
      'If technology would improve, costs will fall.',
    ],
    answer: 'If technology improves, costs will fall.',
    explanation:
      'অর্থ ভবিষ্যৎ হলেও if-clause-এ Present simple বসে।',
  },
  {
    id: 'm6-t3', moduleId: 6, type: 'fill-blank',
    question: 'When the researchers arrived, the experiment ___ already finished. (has / had)',
    answer: 'had',
    explanation:
      'দুটি অতীত ঘটনার মধ্যে আগেরটি বোঝাতে Past perfect বসে।',
  },
  {
    id: 'm6-t4', moduleId: 6, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'The graph | showed that | sales will rise | until 2030.',
    options: ['The graph', 'showed that', 'sales will rise', 'until 2030'],
    answer: 'showed that',
    explanation:
      'চার্টটি এখন আপনার সামনেই আছে, তাই এটি কী দেখাচ্ছে তা Present simple-এ লিখুন।',
  },
  {
    id: 'm6-t5', moduleId: 6, type: 'multiple-choice',
    question: 'Which tense fits a Task 2 argument about the present state of the world?',
    options: ['Past simple', 'Present simple', 'Past perfect', 'Future continuous'],
    answer: 'Present simple',
    explanation:
      'সাধারণ পরিস্থিতি নিয়ে Task 2-এর যুক্তি মূলত Present simple-এ লেখা হয়।',
  },
  {
    id: 'm6-t6', moduleId: 6, type: 'multiple-choice',
    question: 'Emissions ___ sharply since 2019.',
    options: ['fell', 'have fallen', 'had fallen', 'fall'],
    answer: 'have fallen',
    explanation:
      'Since বোঝাচ্ছে সময়কালটি এখনো শেষ হয়নি এবং বর্তমান পর্যন্ত চলছে।',
  },
  {
    id: 'm6-t7', moduleId: 6, type: 'choose-correct-sentence',
    question: 'Which sentence keeps a consistent time frame?',
    options: [
      'The government introduced the scheme and spends millions on it.',
      'The government introduced the scheme and spent millions on it.',
      'The government introduces the scheme and spent millions on it.',
      'The government has introduced the scheme in 2015 and spends millions.',
    ],
    answer: 'The government introduced the scheme and spent millions on it.',
    explanation:
      'দুটি Verb-ই একই শেষ হওয়া অতীত সময়ের কথা বলছে।',
  },
  {
    id: 'm6-t8', moduleId: 6, type: 'fill-blank',
    question: 'Demand ___ expected to reach 40 million by 2035. (is / was)',
    answer: 'is',
    explanation:
      'বর্তমান থেকে করা পূর্বাভাসে is expected to বসে, কোনো অতীত রূপ নয়।',
  },
  {
    id: 'm6-t9', moduleId: 6, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'Since the last decade, | air quality | improved | considerably.',
    options: ['Since the last decade,', 'air quality', 'improved', 'considerably'],
    answer: 'Since the last decade,',
    explanation:
      'Since-এর পরে নির্দিষ্ট সময়বিন্দু বসে; সময়কাল বোঝাতে over the last decade লাগবে।',
  },
  {
    id: 'm6-t10', moduleId: 6, type: 'multiple-choice',
    question: 'Which form describes a process diagram with no dates?',
    options: ['Past simple active', 'Present simple passive', 'Present perfect', 'Future passive'],
    answer: 'Present simple passive',
    explanation:
      'Process-কে সাধারণ ধারাবাহিকতা হিসেবে বর্ণনা করা হয়: the glass is crushed and then melted।',
  },

  /* =========================== Module 7 test ========================== */
  {
    id: 'm7-t1', moduleId: 7, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'The government | should to introduce | stricter laws | on emissions.',
    options: ['The government', 'should to introduce', 'stricter laws', 'on emissions'],
    answer: 'should to introduce',
    explanation:
      'Modal-এর পরে bare infinitive বসে, কখনো to বসে না।',
  },
  {
    id: 'm7-t2', moduleId: 7, type: 'multiple-choice',
    question: 'It ___ solve the problem in the long term.',
    options: ['will can', 'will be able to', 'can will', 'will could'],
    answer: 'will be able to',
    explanation:
      'দুটি Modal পাশাপাশি বসে না; দ্বিতীয়টির জায়গায় be able to বসে।',
  },
  {
    id: 'm7-t3', moduleId: 7, type: 'multiple-choice',
    question: 'Which sentence expresses obligation rather than likelihood?',
    options: [
      'Costs must be rising, given the data.',
      'Governments must act now.',
      'The scheme must have failed.',
      'Demand must be higher than expected.',
    ],
    answer: 'Governments must act now.',
    explanation:
      'এখানে must দিয়ে প্রয়োজনীয়তা বোঝানো হচ্ছে, আর বাকিগুলোতে প্রমাণ থেকে সিদ্ধান্ত।',
  },
  {
    id: 'm7-t4', moduleId: 7, type: 'fill-blank',
    question: 'Students should ___ encouraged to read widely. (be / to be)',
    answer: 'be',
    explanation:
      'Modal passive-এর গঠন হলো modal + be + past participle।',
  },
  {
    id: 'm7-t5', moduleId: 7, type: 'choose-correct-sentence',
    question: 'Which sentence is correct?',
    options: [
      'Technology must improves education.',
      'Technology must improve education.',
      'Technology musts improve education.',
      'Technology must to improve education.',
    ],
    answer: 'Technology must improve education.',
    explanation:
      'Modal-এর পরের Verb-এ কখনো -s বসে না এবং to-ও বসে না।',
  },
  {
    id: 'm7-t6', moduleId: 7, type: 'multiple-choice',
    question: 'Which modal is most appropriate for a recommendation in an essay?',
    options: ['must', 'should', 'will', 'can'],
    answer: 'should',
    explanation:
      'Should পরামর্শ দেয় কিন্তু আইনের মতো শোনায় না, যা essay-র register-এর সঙ্গে মানানসই।',
  },
  {
    id: 'm7-t7', moduleId: 7, type: 'multiple-choice',
    question: 'Which sentence makes the weakest claim?',
    options: [
      'Automation will displace workers.',
      'Automation must displace workers.',
      'Automation may displace workers.',
      'Automation should displace workers.',
    ],
    answer: 'Automation may displace workers.',
    explanation:
      'May দিয়ে আত্মবিশ্বাস বা প্রত্যাশা নয়, বরং সত্যিকারের সম্ভাবনা বোঝানো হয়।',
  },
  {
    id: 'm7-t8', moduleId: 7, type: 'choose-correct-sentence',
    question: 'Which sentence correctly removes an obligation?',
    options: [
      'Employees must not work overtime if they prefer not to.',
      'Employees do not have to work overtime if they prefer not to.',
      'Employees should not to work overtime if they prefer not to.',
      'Employees cannot work overtime if they prefer not to.',
    ],
    answer: 'Employees do not have to work overtime if they prefer not to.',
    explanation:
      'Must not নিষেধ করে, আর do not have to কাজটিকে ঐচ্ছিক করে দেয়।',
  },
  {
    id: 'm7-t9', moduleId: 7, type: 'fill-blank',
    question: 'The delay ___ have been caused by funding cuts. (might / might to)',
    answer: 'might',
    explanation:
      'অতীতের সম্ভাবনায় might have + past participle বসে, কোনো to ছাড়াই।',
  },
  {
    id: 'm7-t10', moduleId: 7, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'Children | may to watch | television | after finishing homework.',
    options: ['Children', 'may to watch', 'television', 'after finishing homework'],
    answer: 'may to watch',
    explanation:
      'অনুমতি বোঝানোর ক্ষেত্রেও bare infinitive-এর নিয়ম একই: may watch।',
  },

  /* =========================== Module 8 test ========================== */
  {
    id: 'm8-t1', moduleId: 8, type: 'multiple-choice',
    question: 'The results were ___ in the second graph.',
    options: ['showed', 'shown', 'showing', 'show'],
    answer: 'shown',
    explanation:
      'Passive-এ past simple showed নয়, past participle shown বসে।',
  },
  {
    id: 'm8-t2', moduleId: 8, type: 'choose-correct-sentence',
    question: 'Which sentence is correct?',
    options: [
      'The problem was happened last year.',
      'The problem happened last year.',
      'The problem was happen last year.',
      'The problem is happened last year.',
    ],
    answer: 'The problem happened last year.',
    explanation:
      'Happen একটি Intransitive Verb, তাই এর কোনো passive রূপ নেই।',
  },
  {
    id: 'm8-t3', moduleId: 8, type: 'fill-blank',
    question: 'Several studies have ___ conducted on this topic. (been / being)',
    answer: 'been',
    explanation:
      'Present perfect passive-এর গঠন হলো have been + past participle।',
  },
  {
    id: 'm8-t4', moduleId: 8, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'The report | was wrote | by a team | of researchers.',
    options: ['The report', 'was wrote', 'by a team', 'of researchers'],
    answer: 'was wrote',
    explanation:
      'Passive-এ past participle written বসাতে হবে।',
  },
  {
    id: 'm8-t5', moduleId: 8, type: 'multiple-choice',
    question: 'When should the by-phrase normally be omitted?',
    options: [
      'When the agent is the main point',
      'When the agent is unknown or obvious',
      'Whenever the sentence is long',
      'In every passive sentence',
    ],
    answer: 'When the agent is unknown or obvious',
    explanation:
      'Academic লেখায় বেশিরভাগ passive-এ by-phrase থাকে না, কারণ কর্তা নতুন কিছু জানায় না।',
  },
  {
    id: 'm8-t6', moduleId: 8, type: 'choose-correct-sentence',
    question: 'Which version is clearer?',
    options: [
      'It was decided by the committee that the project would be cancelled.',
      'The committee cancelled the project.',
      'The project was cancelled by a decision taken by the committee.',
      'A cancellation of the project was decided upon by the committee.',
    ],
    answer: 'The committee cancelled the project.',
    explanation:
      'কর্তা জানা থাকলে ও গুরুত্বপূর্ণ হলে Active voice ছোট ও স্পষ্ট হয়।',
  },
  {
    id: 'm8-t7', moduleId: 8, type: 'multiple-choice',
    question: 'Which is the correct passive of "They must review the policy"?',
    options: [
      'The policy must reviewed.',
      'The policy must be reviewed.',
      'The policy must been reviewed.',
      'The policy must to be reviewed.',
    ],
    answer: 'The policy must be reviewed.',
    explanation:
      'গঠনটি হলো modal + be + past participle।',
  },
  {
    id: 'm8-t8', moduleId: 8, type: 'fill-blank',
    question: 'It is ___ that automation will reduce employment. (argued / arguing)',
    answer: 'argued',
    explanation:
      'নৈর্ব্যক্তিক গঠনটি হলো it + passive + that-clause।',
  },
  {
    id: 'm8-t9', moduleId: 8, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'Air pollution | is effected | by traffic | volume.',
    options: ['Air pollution', 'is effected', 'by traffic', 'volume'],
    answer: 'is effected',
    explanation:
      'Affect হলো Verb আর effect হলো Noun: is affected হবে।',
  },
  {
    id: 'm8-t10', moduleId: 8, type: 'multiple-choice',
    question: 'In a Task 1 process diagram, which form is standard?',
    options: [
      'The workers crush the glass.',
      'The glass is crushed.',
      'The glass has been crushed.',
      'The glass was crushing.',
    ],
    answer: 'The glass is crushed.',
    explanation:
      'Process-এ Present simple passive বসে, কারণ কর্তা এখানে অপ্রাসঙ্গিক।',
  },

  /* =========================== Module 9 test ========================== */
  {
    id: 'm9-t1', moduleId: 9, type: 'multiple-choice',
    question: 'I would recommend ___ abroad for a year.',
    options: ['to study', 'studying', 'study', 'to studying'],
    answer: 'studying',
    explanation:
      'Recommend-এর গঠন suggest-এর মতোই: gerund বা that-clause।',
  },
  {
    id: 'm9-t2', moduleId: 9, type: 'choose-correct-sentence',
    question: 'Which sentence is correct?',
    options: [
      'Technology enables to communicate instantly.',
      'Technology enables people to communicate instantly.',
      'Technology enables communicating people instantly.',
      'Technology enables that people communicate instantly.',
    ],
    answer: 'Technology enables people to communicate instantly.',
    explanation:
      'Enable-এর ক্ষেত্রে to-infinitive-এর আগে একটি Object লাগে।',
  },
  {
    id: 'm9-t3', moduleId: 9, type: 'fill-blank',
    question: 'She is looking forward to ___ from you. (hear / hearing)',
    answer: 'hearing',
    explanation:
      'look forward to-এর to একটি Preposition, তাই এর পরে -ing বসে।',
  },
  {
    id: 'm9-t4', moduleId: 9, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'They avoided | to answer | the question | about funding.',
    options: ['They avoided', 'to answer', 'the question', 'about funding'],
    answer: 'to answer',
    explanation:
      'Avoid-এর পরে সবসময় -ing রূপ বসে: avoided answering।',
  },
  {
    id: 'm9-t5', moduleId: 9, type: 'multiple-choice',
    question: 'Which verb is followed by a to-infinitive?',
    options: ['avoid', 'tend', 'involve', 'risk'],
    answer: 'tend',
    explanation:
      'Tend to do হয়; বাকি তিনটি Verb-এর পরে -ing রূপ বসে।',
  },
  {
    id: 'm9-t6', moduleId: 9, type: 'multiple-choice',
    question: 'Students are capable ___ complex problems.',
    options: ['to solve', 'of solving', 'for solving', 'solving'],
    answer: 'of solving',
    explanation:
      'Capable-এর সঙ্গে of বসে, আর Preposition-এর পরে Verb -ing রূপ নেয়।',
  },
  {
    id: 'm9-t7', moduleId: 9, type: 'choose-correct-sentence',
    question: 'Which sentence is correct?',
    options: [
      'It is difficult measuring happiness objectively.',
      'It is difficult to measure happiness objectively.',
      'It is difficult measure happiness objectively.',
      'It is difficult for measure happiness objectively.',
    ],
    answer: 'It is difficult to measure happiness objectively.',
    explanation:
      'It is-এর পরে মূল্যায়নমূলক Adjective থাকলে to-infinitive বসে।',
  },
  {
    id: 'm9-t8', moduleId: 9, type: 'fill-blank',
    question: 'The plan involves ___ three new schools. (build / building)',
    answer: 'building',
    explanation:
      'Involve-এর পরে সবসময় -ing রূপ বসে।',
  },
  {
    id: 'm9-t9', moduleId: 9, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'The law | requires companies | publish | their emissions.',
    options: ['The law', 'requires companies', 'publish', 'their emissions'],
    answer: 'publish',
    explanation:
      'Require একটি Object ও তারপর to-infinitive নেয়: to publish।',
  },
  {
    id: 'm9-t10', moduleId: 9, type: 'multiple-choice',
    question: 'Which is correct?',
    options: [
      'He is used to work late.',
      'He is used to working late.',
      'He is used to works late.',
      'He used to working late.',
    ],
    answer: 'He is used to working late.',
    explanation:
      'Be used to মানে অভ্যস্ত হওয়া, আর এখানকার to একটি Preposition, তাই -ing বসে।',
  },

  /* ========================== Module 10 test ========================== */
  {
    id: 'm10-t1', moduleId: 10, type: 'multiple-choice',
    question: 'Unemployment is one of the main reasons ___ crime.',
    options: ['of', 'for', 'to', 'in'],
    answer: 'for',
    explanation:
      'Reason-এর সঙ্গে for বসে; the cause of লিখলেও চলত।',
  },
  {
    id: 'm10-t2', moduleId: 10, type: 'multiple-choice',
    question: 'Consumption peaked ___ 90 million units.',
    options: ['to', 'by', 'at', 'in'],
    answer: 'at',
    explanation:
      'peak, stand ও remain - তিনটিরই পরে নির্দিষ্ট মানের আগে at বসে।',
  },
  {
    id: 'm10-t3', moduleId: 10, type: 'fill-blank',
    question: 'Many countries are suffering ___ water shortages.',
    answer: 'from',
    explanation:
      'Suffer-এর সঙ্গে from বসে।',
  },
  {
    id: 'm10-t4', moduleId: 10, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'This leads to | people become | unemployed | in large numbers.',
    options: ['This leads to', 'people become', 'unemployed', 'in large numbers'],
    answer: 'people become',
    explanation:
      'lead to-এর to একটি Preposition, তাই এর পরের Verb হবে becoming।',
  },
  {
    id: 'm10-t5', moduleId: 10, type: 'multiple-choice',
    question: 'Sales fell ___ 15 per cent, from 100 to 85 million.',
    options: ['to', 'by', 'at', 'on'],
    answer: 'by',
    explanation:
      'By দিয়ে পরিবর্তনের পরিমাণ বোঝায়; to দিয়ে বোঝাত শেষ মান।',
  },
  {
    id: 'm10-t6', moduleId: 10, type: 'choose-correct-sentence',
    question: 'Which sentence is correct?',
    options: [
      'The results are different than the 2019 figures.',
      'The results are different from the 2019 figures.',
      'The results are different to than the 2019 figures.',
      'The results are different of the 2019 figures.',
    ],
    answer: 'The results are different from the 2019 figures.',
    explanation:
      'Academic English-এ different from স্বাভাবিক ও প্রচলিত।',
  },
  {
    id: 'm10-t7', moduleId: 10, type: 'multiple-choice',
    question: 'Which pair is correct?',
    options: [
      'Congestion results from pollution.',
      'Pollution results in congestion.',
      'Congestion results in pollution.',
      'Pollution results to congestion.',
    ],
    answer: 'Congestion results in pollution.',
    explanation:
      'Result in দিয়ে ফলাফল বোঝায়, আর result from দিয়ে কারণ।',
  },
  {
    id: 'm10-t8', moduleId: 10, type: 'fill-blank',
    question: 'Students should concentrate ___ their studies.',
    answer: 'on',
    explanation:
      'concentrate, focus, depend ও rely - সবগুলোর সঙ্গেই on বসে।',
  },
  {
    id: 'm10-t9', moduleId: 10, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'There was | a sharp increase | of the number | of tourists.',
    options: ['There was', 'a sharp increase', 'of the number', 'of tourists'],
    answer: 'of the number',
    explanation:
      'Increase-এর পরে in বসে কী বেড়েছে তা বোঝাতে: an increase in the number of tourists।',
  },
  {
    id: 'm10-t10', moduleId: 10, type: 'multiple-choice',
    question: 'Which verb takes no preposition?',
    options: ['depend', 'discuss', 'rely', 'contribute'],
    answer: 'discuss',
    explanation:
      'Discuss সরাসরি Object নেয়: discuss the issue, কখনো discuss about the issue নয়।',
  },

  /* ========================== Module 11 test ========================== */
  {
    id: 'm11-t1', moduleId: 11, type: 'multiple-choice',
    question: 'China has ___ population in the world.',
    options: ['the larger', 'the largest', 'a larger', 'more large'],
    answer: 'the largest',
    explanation:
      'সবার সঙ্গে তুলনা করতে হলে comparative নয়, the সহ superlative লাগে।',
  },
  {
    id: 'm11-t2', moduleId: 11, type: 'choose-correct-sentence',
    question: 'Which comparison is complete?',
    options: [
      'Car ownership is higher than 1990.',
      'Car ownership is higher than it was in 1990.',
      'Car ownership is more high than in 1990 year.',
      'Car ownership is higher as in 1990.',
    ],
    answer: 'Car ownership is higher than it was in 1990.',
    explanation:
      'একটি মাত্রার সঙ্গে আরেকটি মাত্রার তুলনা করুন, কোনো সালের সঙ্গে নয়।',
  },
  {
    id: 'm11-t3', moduleId: 11, type: 'fill-blank',
    question: 'There was a ___ increase in unemployment. (slight / slightly)',
    answer: 'slight',
    explanation:
      'Noun-এর আগে Adjective বসে; Verb হলে Adverb slightly বসত।',
  },
  {
    id: 'm11-t4', moduleId: 11, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'The figure | for Spain | was the most highest | of all countries.',
    options: ['The figure', 'for Spain', 'was the most highest', 'of all countries'],
    answer: 'was the most highest',
    explanation:
      'একটি superlative চিহ্নই যথেষ্ট: the highest।',
  },
  {
    id: 'm11-t5', moduleId: 11, type: 'multiple-choice',
    question: 'Which phrase is unambiguous?',
    options: [
      'three times more than Italy',
      'three times as much as Italy',
      'three times over Italy',
      'three more times than Italy',
    ],
    answer: 'three times as much as Italy',
    explanation:
      'Three times more দিয়ে তিন গুণ না চার গুণ বোঝাচ্ছে তা অস্পষ্ট থেকে যায়।',
  },
  {
    id: 'm11-t6', moduleId: 11, type: 'multiple-choice',
    question: 'Three quarters of the energy ___ produced by coal.',
    options: ['are', 'is', 'were', 'have been'],
    answer: 'is',
    explanation:
      'Verb মেলে energy-র সঙ্গে, যা uncountable এবং একবচন।',
  },
  {
    id: 'm11-t7', moduleId: 11, type: 'choose-correct-sentence',
    question: 'Which sentence is correct?',
    options: [
      'The number of users was more high in urban areas.',
      'The number of users was higher in urban areas.',
      'The number of users was the higher in urban areas.',
      'The number of users was more higher in urban areas.',
    ],
    answer: 'The number of users was higher in urban areas.',
    explanation:
      'High একটি ছোট Adjective, তাই এর comparative হলো higher।',
  },
  {
    id: 'm11-t8', moduleId: 11, type: 'fill-blank',
    question: 'The figure rose ___ between 2000 and 2010. (steady / steadily)',
    answer: 'steadily',
    explanation:
      'Adverb দিয়ে Verb rose-কে বিশেষিত করা হচ্ছে।',
  },
  {
    id: 'm11-t9', moduleId: 11, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'There were | twice as much | visitors in July | as in January.',
    options: ['There were', 'twice as much', 'visitors in July', 'as in January'],
    answer: 'twice as much',
    explanation:
      'Visitors countable, তাই গঠনটি হবে twice as many।',
  },
  {
    id: 'm11-t10', moduleId: 11, type: 'multiple-choice',
    question: 'Which adverb signals a large difference?',
    options: ['slightly', 'marginally', 'considerably', 'somewhat'],
    answer: 'considerably',
    explanation:
      'considerably, significantly ও substantially দিয়ে তুলনার মাত্রা বাড়ানো হয়।',
  },
]
