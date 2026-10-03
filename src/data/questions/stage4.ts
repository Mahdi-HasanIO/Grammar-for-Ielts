import type { Question } from '@/types'

/* Questions for Modules 18-22. */

export const stage4Practice: Question[] = [
  /* ---- Module 18 ---- */
  {
    id: 'm18-p1', moduleId: 18, type: 'rewrite',
    question: 'Nominalize the clause: "Because prices rose rapidly, demand fell."  Start with "The rapid..."',
    answer: 'The rapid rise in prices reduced demand.',
    acceptable: ['the rapid rise in prices reduced demand', 'the rapid rise in prices caused demand to fall'],
    explanation:
      'Adverb-টি Adjective-এ বদলে যায় আর Verb-টি নিজের Preposition সহ Noun-এ রূপ নেয়।',
  },
  {
    id: 'm18-p2', moduleId: 18, type: 'multiple-choice',
    question: 'Which noun modifier is correct?',
    options: ['a five-years plan', 'a five-year plan', 'a five years plan', 'a five year plans'],
    answer: 'a five-year plan',
    explanation:
      'Modifier হিসেবে ব্যবহৃত Noun একবচনে থাকে এবং সংখ্যার সঙ্গে hyphen দিয়ে যুক্ত হয়।',
  },
  {
    id: 'm18-p3', moduleId: 18, type: 'fill-blank',
    question: 'The fact ___ the policy failed is undeniable. (that / which)',
    answer: 'that',
    explanation:
      'Noun complement clause-এ Relative Pronoun নয়, that বসে।',
  },
  {
    id: 'm18-p4', moduleId: 18, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'The analyse | of the data | shows | a clear pattern.',
    options: ['The analyse', 'of the data', 'shows', 'a clear pattern'],
    answer: 'The analyse',
    explanation:
      'Analyse হলো Verb, আর এর Noun রূপ হলো analysis।',
  },

  /* ---- Module 19 ---- */
  {
    id: 'm19-p1', moduleId: 19, type: 'choose-correct-sentence',
    question: 'Which claim is best supported by a single study?',
    options: [
      'This study proves that exercise prevents depression.',
      'This study indicates that exercise may help prevent depression.',
      'This study shows exercise always prevents depression.',
      'Everyone knows exercise prevents depression.',
    ],
    answer: 'This study indicates that exercise may help prevent depression.',
    explanation:
      'Indicates ও may দাবির জোরকে প্রমাণের সঙ্গে মানানসই করে তোলে।',
  },
  {
    id: 'm19-p2', moduleId: 19, type: 'multiple-choice',
    question: 'Which revision of "Technology always improves education" is strongest?',
    options: [
      'Technology maybe improves education.',
      'Technology can improve educational outcomes when it is implemented effectively.',
      'Technology possibly might improve education sometimes.',
      'Technology improves education, I think.',
    ],
    answer: 'Technology can improve educational outcomes when it is implemented effectively.',
    explanation:
      'একটি শর্ত যোগ করায় দাবিটি কেবল নরম নয়, বরং নির্ভুল হয়ে ওঠে।',
  },
  {
    id: 'm19-p3', moduleId: 19, type: 'fill-blank',
    question: 'Young people ___ to spend more time online than older groups. (tend / tends)',
    answer: 'tend',
    explanation:
      'Tend to একটি hedge, যা ব্যতিক্রমসহ সাধারণ প্রবণতা বোঝায়।',
  },
  {
    id: 'm19-p4', moduleId: 19, type: 'rewrite',
    question: 'Remove the excess hedging: "It is possible that it might perhaps be true that costs may rise."',
    answer: 'Costs are likely to rise.',
    acceptable: ['costs are likely to rise', 'costs may rise'],
    explanation:
      'প্রতি দাবিতে একটি hedge-ই যথেষ্ট; একের পর এক বসালে বাক্য অর্থশূন্য হয়ে যায়।',
  },

  /* ---- Module 20 ---- */
  {
    id: 'm20-p1', moduleId: 20, type: 'choose-correct-sentence',
    question: 'Which version respects end-weight?',
    options: [
      'To find a solution that satisfies all stakeholders is difficult.',
      'It is difficult to find a solution that satisfies all stakeholders.',
      'Difficult it is to find a solution for all stakeholders.',
      'A solution that satisfies all stakeholders to find is difficult.',
    ],
    answer: 'It is difficult to find a solution that satisfies all stakeholders.',
    explanation:
      'লম্বা infinitive clause-টি বাক্যের শেষে বসাই উচিত।',
  },
  {
    id: 'm20-p2', moduleId: 20, type: 'multiple-choice',
    question: 'Which opening carries given information forward best?',
    options: ['This.', 'This thing.', 'This expansion', 'That one'],
    answer: 'This expansion',
    explanation:
      'This + summary noun নির্দিষ্টভাবে আগের বাক্যকে নির্দেশ করে এবং জানা তথ্য দিয়ে শুরু করে।',
  },
  {
    id: 'm20-p3', moduleId: 20, type: 'fill-blank',
    question: '___ was a sharp fall in rainfall, which affected three regions. (There / It)',
    answer: 'There',
    explanation:
      'Existential there নতুন তথ্য আনে এবং ভারী Clause-টিকে শেষে রাখে।',
  },
  {
    id: 'm20-p4', moduleId: 20, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'Moreover, | in addition, | furthermore, | the cost should also be considered.',
    options: ['Moreover,', 'in addition,', 'furthermore,', 'the cost should also be considered'],
    answer: 'in addition,',
    explanation:
      'তিনটি যোগবাচক connector একই কাজ করছে; একটি রেখে বাকিগুলো বাদ দিতে হবে।',
  },

  /* ---- Module 21 ---- */
  {
    id: 'm21-p1', moduleId: 21, type: 'multiple-choice',
    question: 'People who volunteer usually ___ for personal reasons.',
    options: ['do it', 'do so', 'make so', 'does so'],
    answer: 'do so',
    explanation:
      'Do so হলো পুনরাবৃত্ত Verb phrase-এর আনুষ্ঠানিক বিকল্প।',
  },
  {
    id: 'm21-p2', moduleId: 21, type: 'fill-blank',
    question: 'The old system was slow; the new ___ is faster. (one / ones)',
    answer: 'one',
    explanation:
      'One আগে উল্লেখ করা একবচন countable Noun-এর জায়গা নেয়।',
  },
  {
    id: 'm21-p3', moduleId: 21, type: 'choose-correct-sentence',
    question: 'Which sentence uses such correctly?',
    options: [
      'Such problem is difficult to solve.',
      'Such problems are difficult to solve.',
      'Such a problems are difficult to solve.',
      'Such of problems are difficult to solve.',
    ],
    answer: 'Such problems are difficult to solve.',
    explanation:
      'Such-এর পরে বহুবচন বা uncountable Noun বসে; একবচন countable Noun হলে such a লাগত।',
  },
  {
    id: 'm21-p4', moduleId: 21, type: 'rewrite',
    question: 'Use ellipsis: "Some countries invest in rail. Other countries invest in roads."',
    answer: 'Some countries invest in rail; others, in roads.',
    acceptable: ['some countries invest in rail; others, in roads', 'some countries invest in rail, others in roads'],
    explanation:
      'পুনরাবৃত্ত Verb-টি পাঠক নিজেই বুঝে নিতে পারেন, তাই সেটি বাদ দেওয়া যায়।',
  },

  /* ---- Module 22 ---- */
  {
    id: 'm22-p1', moduleId: 22, type: 'multiple-choice',
    question: 'What ___ is long-term planning.',
    options: ['governments needs', 'governments need', 'do governments need', 'governments needing'],
    answer: 'governments need',
    explanation:
      'What-clause-এর ভেতরে Verb মেলে governments-এর সঙ্গে।',
  },
  {
    id: 'm22-p2', moduleId: 22, type: 'choose-correct-sentence',
    question: 'Which inversion is correct?',
    options: [
      'Not only the scheme reduces costs, but also improves safety.',
      'Not only does the scheme reduce costs, but it also improves safety.',
      'Not only reduces the scheme costs, but it also improves safety.',
      'Not only the scheme does reduce costs, but also it improves safety.',
    ],
    answer: 'Not only does the scheme reduce costs, but it also improves safety.',
    explanation:
      'সামনে বসা নেতিবাচক শব্দ do-support দাবি করে, আর দ্বিতীয় Clause-এ নিজস্ব Subject থাকে।',
  },
  {
    id: 'm22-p3', moduleId: 22, type: 'fill-blank',
    question: 'Rarely ___ a policy attracted so much criticism. (has / have)',
    answer: 'has',
    explanation:
      'শুরুতে rarely বসলে inversion হয়, আর Subject a policy একবচন।',
  },
  {
    id: 'm22-p4', moduleId: 22, type: 'multiple-choice',
    question: 'How important are clefts and inversion for IELTS Band 8?',
    options: [
      'Required in every essay',
      'Required in Task 2 only',
      'Not required at any band',
      'Required for Task 1 descriptions',
    ],
    answer: 'Not required at any band',
    explanation:
      'IELTS নম্বর দেয় নির্ভুলতা ও সাবলীলতায়, কোনো নির্দিষ্ট দেখানো-গঠনে নয়।',
  },
]

export const stage4Test: Question[] = [
  /* ========================== Module 18 test ========================== */
  {
    id: 'm18-t1', moduleId: 18, type: 'multiple-choice',
    question: 'Which is the noun form of the verb increase, used with its correct preposition?',
    options: ['the increasing of prices', 'the increase in prices', 'the increase of price', 'the increased prices in'],
    answer: 'the increase in prices',
    explanation:
      'প্রতিষ্ঠিত Noun রূপটি ব্যবহার করুন, আর increase-এর সঙ্গে in বসে।',
  },
  {
    id: 'm18-t2', moduleId: 18, type: 'choose-correct-sentence',
    question: 'Which noun phrase is correctly formed?',
    options: [
      'the governments policies on the environment',
      'government environmental policy',
      'the government environmental policies of',
      'environmental the government policy',
    ],
    answer: 'government environmental policy',
    explanation:
      'Modifier হিসেবে বসা Noun একবচনে থাকে এবং এতে apostrophe লাগে না।',
  },
  {
    id: 'm18-t3', moduleId: 18, type: 'fill-blank',
    question: 'There is a possibility ___ the scheme will fail. (that / of that)',
    answer: 'that',
    explanation:
      'Noun complement clause সরাসরি জুড়ে বসে; that-এর আগে কোনো Preposition বসে না।',
  },
  {
    id: 'm18-t4', moduleId: 18, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'The fact | which the policy failed | is undeniable | to most analysts.',
    options: ['The fact', 'which the policy failed', 'is undeniable', 'to most analysts'],
    answer: 'which the policy failed',
    explanation:
      'The fact তার বিষয়বস্তু জানাতে that-clause নেয়, কোনো Relative Clause নয়।',
  },
  {
    id: 'm18-t5', moduleId: 18, type: 'multiple-choice',
    question: 'Which version is clearest?',
    options: [
      'The implementation of the reduction of the utilisation of plastic',
      'Reducing plastic use',
      'The plastic utilisation reduction implementation',
      'The reduction implementation of plastic utilisation',
    ],
    answer: 'Reducing plastic use',
    explanation:
      'একের পর এক ভাববাচক Noun সহজ একটি কাজকে ঢেকে রাখে; সেগুলো খুলে Verb-এ ফিরে যান।',
  },
  {
    id: 'm18-t6', moduleId: 18, type: 'multiple-choice',
    question: 'Which sentence uses apposition?',
    options: [
      'Jakarta is the capital and it is sinking.',
      'Jakarta, the capital of Indonesia, is sinking.',
      'Jakarta which is the capital is sinking.',
      'The capital of Indonesia is Jakarta and sinking.',
    ],
    answer: 'Jakarta, the capital of Indonesia, is sinking.',
    explanation:
      'দুটি Noun phrase পাশাপাশি বসেছে, আর দ্বিতীয়টি প্রথমটিকেই অন্যভাবে বোঝাচ্ছে।',
  },
  {
    id: 'm18-t7', moduleId: 18, type: 'choose-correct-sentence',
    question: 'Which nominalization is correct?',
    options: [
      'Temperatures increased sharply became the sharply increase.',
      'The sharp increase in temperatures was recorded in July.',
      'The sharply increase in temperatures was recorded in July.',
      'The increase sharp of temperatures was recorded in July.',
    ],
    answer: 'The sharp increase in temperatures was recorded in July.',
    explanation:
      'Noun phrase-এর ভেতরে Adverb বদলে গিয়ে Adjective হয়ে যায়।',
  },
  {
    id: 'm18-t8', moduleId: 18, type: 'fill-blank',
    question: 'Rewrite the head noun: "Cities are expanding" becomes "the ___ of cities".',
    answer: 'expansion',
    explanation:
      'Expand-এর Noun রূপ expansion, যা এরপর Subject হিসেবে কাজ করতে পারে।',
  },
  {
    id: 'm18-t9', moduleId: 18, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'A three-years | programme | was introduced | last year.',
    options: ['A three-years', 'programme', 'was introduced', 'last year'],
    answer: 'A three-years',
    explanation:
      'যৌগিক modifier একবচনে থাকে: a three-year programme।',
  },
  {
    id: 'm18-t10', moduleId: 18, type: 'multiple-choice',
    question: 'What is the clearest sign that you have nominalized too far?',
    options: [
      'A sentence with two clauses',
      'A chain of of-phrases',
      'Using a passive verb',
      'Using an adjective before a noun',
    ],
    answer: 'A chain of of-phrases',
    explanation:
      'পরপর অনেকগুলো of-phrase থাকলে পাঠককে বাক্যটি দুইবার খুলে বুঝতে হয়।',
  },

  /* ========================== Module 19 test ========================== */
  {
    id: 'm19-t1', moduleId: 19, type: 'choose-correct-sentence',
    question: 'Which claim is defensible?',
    options: [
      'Pollution definitely causes all respiratory diseases.',
      'Pollution contributes to a range of respiratory conditions.',
      'Pollution never affects respiratory health.',
      'Pollution proves respiratory disease.',
    ],
    answer: 'Pollution contributes to a range of respiratory conditions.',
    explanation:
      'Contributes to একটি বাস্তব সম্পর্ক বোঝায়, অতিরঞ্জন ছাড়াই।',
  },
  {
    id: 'm19-t2', moduleId: 19, type: 'multiple-choice',
    question: 'The graph ___ that the policy had some effect.',
    options: ['proves', 'suggests', 'guarantees', 'confirms absolutely'],
    answer: 'suggests',
    explanation:
      'চার্ট একটি প্রবণতা দেখায়, কোনো কারণ প্রমাণ করতে পারে না।',
  },
  {
    id: 'm19-t3', moduleId: 19, type: 'fill-blank',
    question: 'It is ___ that costs will rise next year. (likely / certainly)',
    answer: 'likely',
    explanation:
      'It is likely that সম্ভাব্য ফলাফল বোঝানোর একটি প্রচলিত hedging গঠন।',
  },
  {
    id: 'm19-t4', moduleId: 19, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'It tends to be | that students | may possibly | perform better.',
    options: ['It tends to be', 'that students', 'may possibly', 'perform better'],
    answer: 'may possibly',
    explanation:
      'Tend to নিজেই একটি hedge, আর may possibly এর উপরে আরও দুটি hedge চাপিয়ে দিচ্ছে।',
  },
  {
    id: 'm19-t5', moduleId: 19, type: 'multiple-choice',
    question: 'Which reporting verb distances you from the claim?',
    options: ['demonstrates', 'claims', 'establishes', 'confirms'],
    answer: 'claims',
    explanation:
      'Claims দিয়ে বোঝায় যে আপনি বক্তব্যটি মেনে নিচ্ছেন না।',
  },
  {
    id: 'm19-t6', moduleId: 19, type: 'choose-correct-sentence',
    question: 'Which sentence states a position clearly while hedging the evidence?',
    options: [
      'In my opinion, I think that perhaps the government should maybe act.',
      'The government should act, since the evidence suggests that delay is costly.',
      'Possibly the government could potentially consider acting.',
      'The government must act because everyone knows it is right.',
    ],
    answer: 'The government should act, since the evidence suggests that delay is costly.',
    explanation:
      'অবস্থান এখানে দৃঢ়, আর hedge বসেছে প্রমাণের উপর, যেখানে এটির থাকা উচিত।',
  },
  {
    id: 'm19-t7', moduleId: 19, type: 'multiple-choice',
    question: 'Which quantifier is safest in a general claim about young people?',
    options: ['all', 'every single', 'many', 'without exception'],
    answer: 'many',
    explanation:
      'Many ব্যতিক্রমের জায়গা রাখে, কিন্তু চূড়ান্ত quantifier তা রাখে না।',
  },
  {
    id: 'm19-t8', moduleId: 19, type: 'fill-blank',
    question: 'The findings ___ that a link exists, though more research is needed. (prove / indicate)',
    answer: 'indicate',
    explanation:
      'Indicate একটি প্রাথমিক ফলাফলের জোরের সঙ্গে মানানসই।',
  },
  {
    id: 'm19-t9', moduleId: 19, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'Research is proving | that this approach | is the only | solution available.',
    options: ['Research is proving', 'that this approach', 'is the only', 'solution available'],
    answer: 'is the only',
    explanation:
      'The only solution এমন একটি চূড়ান্ত দাবি, যা কোনো গবেষণাই সমর্থন করতে পারে না।',
  },
  {
    id: 'm19-t10', moduleId: 19, type: 'multiple-choice',
    question: 'What should you never hedge away in an IELTS Task 2 essay?',
    options: [
      'The strength of the evidence',
      'Your own position on the question',
      'A prediction about the future',
      'A claim about causes',
    ],
    answer: 'Your own position on the question',
    explanation:
      'Hedging দাবিকে সংযত করে, কিন্তু প্রশ্নের উত্তর দেওয়ার বিকল্প হয় না।',
  },

  /* ========================== Module 20 test ========================== */
  {
    id: 'm20-t1', moduleId: 20, type: 'multiple-choice',
    question: 'Where should new information normally appear in a sentence?',
    options: ['At the start', 'At the end', 'In the middle', 'In a separate clause'],
    answer: 'At the end',
    explanation:
      'জানা তথ্য আগে আসে, আর বাক্যের শেষ অংশটিই মূল কথা বহন করে।',
  },
  {
    id: 'm20-t2', moduleId: 20, type: 'choose-correct-sentence',
    question: 'Which version flows better as a second sentence?',
    options: [
      'Congestion fell by 20 per cent because of the tax introduced in 2015.',
      'This measure cut congestion by 20 per cent.',
      'By 20 per cent congestion fell because of this.',
      'A 20 per cent fall in congestion by the tax was caused.',
    ],
    answer: 'This measure cut congestion by 20 per cent.',
    explanation:
      'এটি জানা তথ্য দিয়ে শুরু হয়ে নতুন সংখ্যাটি দিয়ে শেষ হচ্ছে।',
  },
  {
    id: 'm20-t3', moduleId: 20, type: 'fill-blank',
    question: '___ is clear that governments must act. (It / There)',
    answer: 'It',
    acceptable: ['it'],
    explanation:
      'Extraposition Clause-কে শেষে সরিয়ে Subject-এর জায়গা it দিয়ে পূরণ করে।',
  },
  {
    id: 'm20-t4', moduleId: 20, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'There is | the government | which should act | on this issue.',
    options: ['There is', 'the government', 'which should act', 'on this issue'],
    answer: 'There is',
    explanation:
      'Existential there নতুন ও অনির্দিষ্ট তথ্য আনে, আগে থেকে জানা Subject নয়।',
  },
  {
    id: 'm20-t5', moduleId: 20, type: 'multiple-choice',
    question: 'Which structure moves a long subject clause to the end?',
    options: ['Passive voice', 'Extraposition', 'Coordination', 'Ellipsis'],
    answer: 'Extraposition',
    explanation:
      'It is clear that... গঠনটি Clause-কে মূল Verb-এর পরে নিয়ে যায়।',
  },
  {
    id: 'm20-t6', moduleId: 20, type: 'choose-correct-sentence',
    question: 'Which revision removes unnecessary connectors?',
    options: [
      'Firstly, cities grew. Moreover, housing costs rose. Furthermore, commuting increased.',
      'Cities grew rapidly. This growth pushed up housing costs and lengthened commutes.',
      'Cities grew. Moreover, this. Furthermore, that.',
      'In addition, moreover, cities grew and costs rose.',
    ],
    answer: 'Cities grew rapidly. This growth pushed up housing costs and lengthened commutes.',
    explanation:
      'তথ্যের ক্রম বদলানোয় তিনটি linking adverbial-এর আর দরকার থাকে না।',
  },
  {
    id: 'm20-t7', moduleId: 20, type: 'multiple-choice',
    question: 'Why use the passive for information packaging?',
    options: [
      'It sounds more academic',
      'It puts the affected thing in the subject position',
      'It shortens the sentence',
      'It avoids using a verb',
    ],
    answer: 'It puts the affected thing in the subject position',
    explanation:
      'Passive ব্যবহার করলে জানা তথ্য দিয়ে বাক্য শুরু করা যায়।',
  },
  {
    id: 'm20-t8', moduleId: 20, type: 'fill-blank',
    question: 'Many firms now allow remote work. This ___ has reduced office demand. (shift / thing)',
    answer: 'shift',
    explanation:
      'Summary noun আগের বাক্যে বর্ণিত বিষয়টিকে এক শব্দে নাম দেয়।',
  },
  {
    id: 'm20-t9', moduleId: 20, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'That the climate is changing rapidly | and that action is needed | urgently | is accepted.',
    options: ['That the climate is changing rapidly', 'and that action is needed', 'urgently', 'is accepted'],
    answer: 'That the climate is changing rapidly',
    explanation:
      'দুটি ভারী Subject Clause extraposition করা উচিত: It is accepted that...',
  },
  {
    id: 'm20-t10', moduleId: 20, type: 'multiple-choice',
    question: 'Which sentence respects end-weight?',
    options: [
      'A sharp fall in rainfall, which affected three regions and lasted two years, occurred.',
      'There was a sharp fall in rainfall, which affected three regions and lasted two years.',
      'Occurred a sharp fall in rainfall affecting three regions.',
      'Rainfall, affecting three regions and lasting two years, a sharp fall occurred.',
    ],
    answer: 'There was a sharp fall in rainfall, which affected three regions and lasted two years.',
    explanation:
      'ভারী বিশেষণ অংশটি এখন বাক্যের শেষে বসেছে।',
  },

  /* ========================== Module 21 test ========================== */
  {
    id: 'm21-t1', moduleId: 21, type: 'choose-correct-sentence',
    question: 'Which sentence avoids repetition best?',
    options: [
      'The new policy replaced the old policy because the old policy was ineffective.',
      'The new policy replaced the old one, which had proved ineffective.',
      'The new policy replaced it because it was ineffective policy.',
      'The new policy replaced the old policy, it was ineffective.',
    ],
    answer: 'The new policy replaced the old one, which had proved ineffective.',
    explanation:
      'One দিয়ে substitution আর একটি Relative Clause মিলে দুটি পুনরাবৃত্তি সরিয়ে দিয়েছে।',
  },
  {
    id: 'm21-t2', moduleId: 21, type: 'multiple-choice',
    question: 'Which is the formal written substitute for a repeated verb phrase?',
    options: ['do it', 'do so', 'make it', 'does that'],
    answer: 'do so',
    explanation:
      'Academic লেখায় do so-ই প্রচলিত ও মানানসই রূপ।',
  },
  {
    id: 'm21-t3', moduleId: 21, type: 'fill-blank',
    question: 'These ___ of problem require urgent action. (kind / kinds)',
    answer: 'kinds',
    explanation:
      'These-এর সঙ্গে বহুবচন Noun মিলতে হবে।',
  },
  {
    id: 'm21-t4', moduleId: 21, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'The report | was long. | This made | difficult to read.',
    options: ['The report', 'was long.', 'This made', 'difficult to read'],
    answer: 'difficult to read',
    explanation:
      'Make-এর একটি Object লাগে: which made it difficult to read।',
  },
  {
    id: 'm21-t5', moduleId: 21, type: 'multiple-choice',
    question: 'Which cohesive device leaves out recoverable words?',
    options: ['Reference', 'Substitution', 'Ellipsis', 'Conjunction'],
    answer: 'Ellipsis',
    explanation:
      'Ellipsis সেই শব্দগুলো বাদ দেয়, যা পাঠক আগের Clause থেকে বুঝে নিতে পারেন।',
  },
  {
    id: 'm21-t6', moduleId: 21, type: 'choose-correct-sentence',
    question: 'Which sentence is correct?',
    options: [
      'I prefer the first option than the second one.',
      'I prefer the first option to the second.',
      'I prefer the first option over than the second.',
      'I prefer the first option as the second one.',
    ],
    answer: 'I prefer the first option to the second.',
    explanation:
      'Prefer-এর সঙ্গে to বসে, আর ellipsis পুনরাবৃত্ত Noun-টি সরিয়ে দেয়।',
  },
  {
    id: 'm21-t7', moduleId: 21, type: 'multiple-choice',
    question: 'What do the band descriptors warn against?',
    options: [
      'Using any cohesive devices',
      'Mechanical overuse of cohesive devices',
      'Using pronouns for reference',
      'Using substitution in formal writing',
    ],
    answer: 'Mechanical overuse of cohesive devices',
    explanation:
      'প্রতিটি বাক্যে connector থাকলে সেটি যান্ত্রিক শোনায় এবং এতে নম্বর কমে।',
  },
  {
    id: 'm21-t8', moduleId: 21, type: 'fill-blank',
    question: 'Students who study abroad often ___ so for career reasons. (do / make)',
    answer: 'do',
    explanation:
      'Do so এখানে study abroad-এর জায়গা নিচ্ছে।',
  },
  {
    id: 'm21-t9', moduleId: 21, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'Such problem | is difficult | to solve | in the short term.',
    options: ['Such problem', 'is difficult', 'to solve', 'in the short term'],
    answer: 'Such problem',
    explanation:
      'Such-এর পরে বহুবচন বা uncountable Noun বসে; একবচন countable Noun হলে such a লাগে।',
  },
  {
    id: 'm21-t10', moduleId: 21, type: 'multiple-choice',
    question: 'Which alternative replaces "Therefore," at the start of a sentence?',
    options: [
      'A result participle clause at the end of the previous sentence',
      'Another linking adverbial',
      'A semicolon plus moreover',
      'A fragment',
    ],
    answer: 'A result participle clause at the end of the previous sentence',
    explanation:
      '..., reducing costs. লিখলে আরেকটি connector ছাড়াই ফলাফল বোঝানো যায়।',
  },

  /* ========================== Module 22 test ========================== */
  {
    id: 'm22-t1', moduleId: 22, type: 'choose-correct-sentence',
    question: 'Which inversion is correct?',
    options: [
      'Never before people have had access to so much information.',
      'Never before have people had access to so much information.',
      'Never before people had access to so much information.',
      'Never before did people have had access to so much information.',
    ],
    answer: 'Never before have people had access to so much information.',
    explanation:
      'সামনে বসা নেতিবাচক শব্দের কারণে Auxiliary Subject-এর আগে চলে আসে।',
  },
  {
    id: 'm22-t2', moduleId: 22, type: 'multiple-choice',
    question: 'What ___ needed is stronger regulation.',
    options: ['are', 'is', 'were', 'have'],
    answer: 'is',
    explanation:
      'Subject হিসেবে কাজ করা what-clause একবচন Verb নেয়।',
  },
  {
    id: 'm22-t3', moduleId: 22, type: 'fill-blank',
    question: 'It was poor planning ___ caused the delay. (that / what)',
    answer: 'that',
    explanation:
      'It-cleft-এ what নয়, that বসে।',
  },
  {
    id: 'm22-t4', moduleId: 22, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'Under no circumstances | we should | ignore | this evidence.',
    options: ['Under no circumstances', 'we should', 'ignore', 'this evidence'],
    answer: 'we should',
    explanation:
      'শুরুতে বসা সীমাবদ্ধতাসূচক phrase inversion দাবি করে: should we ignore।',
  },
  {
    id: 'm22-t5', moduleId: 22, type: 'multiple-choice',
    question: 'Only after 2010 ___ the figure begin to fall.',
    options: ['did', 'was', 'had', 'has'],
    answer: 'did',
    explanation:
      'Only + adverbial-এর ক্ষেত্রে do-support লাগে, আর মূল Verb base রূপে ফিরে যায়।',
  },
  {
    id: 'm22-t6', moduleId: 22, type: 'choose-correct-sentence',
    question: 'Which sentence is correct and simplest?',
    options: [
      'Not only it is expensive but also ineffective.',
      'It is not only expensive but also ineffective.',
      'Not only is it expensive but also it ineffective.',
      'Not only expensive it is but ineffective also.',
    ],
    answer: 'It is not only expensive but also ineffective.',
    explanation:
      'সামনে না আনলে inversion-ও লাগে না, আর সাধারণ রূপটিই সঠিক।',
  },
  {
    id: 'm22-t7', moduleId: 22, type: 'multiple-choice',
    question: 'Which structure emphasises an element by moving it after is?',
    options: ['Passive voice', 'What-cleft', 'Relative clause', 'Ellipsis'],
    answer: 'What-cleft',
    explanation:
      'What matters most is the cost গঠনে জোরটি বাক্যের দ্বিতীয়ার্ধে চলে যায়।',
  },
  {
    id: 'm22-t8', moduleId: 22, type: 'fill-blank',
    question: 'Rarely has a policy ___ so much criticism. (attracted / attract)',
    answer: 'attracted',
    explanation:
      'Has-এর পরে মূল Verb past participle রূপ নেয়।',
  },
  {
    id: 'm22-t9', moduleId: 22, type: 'multiple-choice',
    question: 'When should you avoid inversion in an exam?',
    options: [
      'When the sentence is short',
      'When you cannot produce the form automatically',
      'When writing Task 1',
      'When the topic is technology',
    ],
    answer: 'When you cannot produce the form automatically',
    explanation:
      'ভুলসহ একটি inverted বাক্যের ক্ষতি নির্ভুল সাধারণ বাক্যের চেয়ে অনেক বেশি।',
  },
  {
    id: 'm22-t10', moduleId: 22, type: 'multiple-choice',
    question: 'Where do advanced marks actually come from, according to this course?',
    options: [
      'Clefts and inversion',
      'Noun phrases, hedging, information packaging and cohesion',
      'Using the longest sentences possible',
      'Using every tense in one essay',
    ],
    answer: 'Noun phrases, hedging, information packaging and cohesion',
    explanation:
      'উন্নত পর্যায়ের দক্ষতা আসে Module 18 থেকে 21 থেকে; Module 22 কেবল বাড়তি সমৃদ্ধি।',
  },
]
