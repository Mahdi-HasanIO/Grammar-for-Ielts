import type { Question } from '@/types'

/* Questions for Modules 1-5. Practice is short and formative; tests are 10 items. */

export const stage1Practice: Question[] = [
  /* ---- Module 1 ---- */
  {
    id: 'm1-p1', moduleId: 1, type: 'multiple-choice',
    question: 'Which sentence has a complete subject and verb?',
    options: [
      'In the graph shows a rise in sales.',
      'The graph shows a rise in sales.',
      'Shows a rise in sales in the graph.',
      'In the graph showing a rise in sales.',
    ],
    answer: 'The graph shows a rise in sales.',
    explanation:
      'এখানে The graph হলো Subject আর shows হলো Verb। in দিয়ে শুরু হওয়া phrase কখনো Subject হতে পারে না।',
  },
  {
    id: 'm1-p2', moduleId: 1, type: 'fill-blank',
    question: '___ is essential to reduce carbon emissions.',
    answer: 'It',
    acceptable: ['it'],
    explanation:
      'be + adjective + to-infinitive গঠনের আগে Subject-এর খালি জায়গাটা পূরণ করে dummy subject it।',
  },
  {
    id: 'm1-p3', moduleId: 1, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'The students | they often | struggle | with grammar.',
    options: ['The students', 'they often', 'struggle', 'with grammar'],
    answer: 'they often',
    explanation:
      'The students আগে থেকেই Subject, তাই they বসালে একই Clause-এ দুটো Subject হয়ে যায়।',
  },
  {
    id: 'm1-p4', moduleId: 1, type: 'rewrite',
    question: 'Rewrite so the clause has a subject: "Is important to invest in education."',
    answer: 'It is important to invest in education.',
    acceptable: ['it is important to invest in education'],
    explanation:
      'লিখিত ইংরেজিতে প্রতিটি Clause-এ একটা Subject লাগে, আর এখানে সেটা হলো dummy it।',
  },

  /* ---- Module 2 ---- */
  {
    id: 'm2-p1', moduleId: 2, type: 'multiple-choice',
    question: 'The impact of social media on teenagers ___ widely debated.',
    options: ['are', 'is', 'were', 'have been'],
    answer: 'is',
    explanation:
      'Head noun হলো impact, যেটা একবচন; মাঝখানের বহুবচন Noun-গুলো শুধু বাড়তি বর্ণনা।',
  },
  {
    id: 'm2-p2', moduleId: 2, type: 'fill-blank',
    question: 'There ___ several reasons for this decline. (is / are)',
    answer: 'are',
    explanation:
      'Existential বাক্যে Verb মেলে পরের Noun-এর সঙ্গে, আর reasons বহুবচন।',
  },
  {
    id: 'm2-p3', moduleId: 2, type: 'choose-correct-sentence',
    question: 'Which sentence is correct?',
    options: [
      'Researches show that exercise improves memory.',
      'Research show that exercise improves memory.',
      'Research shows that exercise improves memory.',
      'A research shows that exercise improves memory.',
    ],
    answer: 'Research shows that exercise improves memory.',
    explanation:
      'Research uncountable: এতে -s বসে না, a বসে না, আর Verb একবচন হয়।',
  },
  {
    id: 'm2-p4', moduleId: 2, type: 'multiple-choice',
    question: 'A number of studies ___ reached the same conclusion.',
    options: ['has', 'have', 'is', 'was'],
    answer: 'have',
    explanation:
      'A number of মানে কয়েকটা, তাই Verb বহুবচন। The number of হলে Verb একবচন হতো।',
  },

  /* ---- Module 3 ---- */
  {
    id: 'm3-p1', moduleId: 3, type: 'multiple-choice',
    question: '___ rapid growth of technology has changed the workplace.',
    options: ['A', 'The', 'An', 'No article'],
    answer: 'The',
    explanation:
      'of-phrase-টা বুঝিয়ে দিচ্ছে ঠিক কোন growth-এর কথা হচ্ছে, তাই এখানে the বসবে।',
  },
  {
    id: 'm3-p2', moduleId: 3, type: 'choose-correct-sentence',
    question: 'Which sentence generalises correctly?',
    options: [
      'The cars are a major source of pollution.',
      'Cars are a major source of pollution.',
      'Car is a major source of pollution.',
      'A cars are a major source of pollution.',
    ],
    answer: 'Cars are a major source of pollution.',
    explanation:
      'পুরো একটা শ্রেণি নিয়ে সাধারণ কথা বলতে article ছাড়া বহুবচন Noun বসে।',
  },
  {
    id: 'm3-p3', moduleId: 3, type: 'fill-blank',
    question: 'There are ___ advantages to this approach. (much / many)',
    answer: 'many',
    explanation:
      'Advantages একটা countable বহুবচন Noun, তাই এর সঙ্গে many বসে।',
  },
  {
    id: 'm3-p4', moduleId: 3, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'Most of people | believe | that education | is important.',
    options: ['Most of people', 'believe', 'that education', 'is important'],
    answer: 'Most of people',
    explanation:
      'সাধারণ অর্থে most + বহুবচন Noun বসে। Most of ব্যবহার করলে পরে determiner লাগে: most of the people।',
  },

  /* ---- Module 4 ---- */
  {
    id: 'm4-p1', moduleId: 4, type: 'multiple-choice',
    question: 'Every company must protect ___ data.',
    options: ['their', 'its', 'our', 'them'],
    answer: 'its',
    explanation:
      'Every থাকলে Antecedent একবচন হয়, তাই possessive Pronoun হবে its।',
  },
  {
    id: 'm4-p2', moduleId: 4, type: 'fill-blank',
    question: '___ is clear that the policy has failed. (It / There)',
    answer: 'It',
    acceptable: ['it'],
    explanation:
      'Adjective আর that-clause-এর আগে মতামত বোঝাতে it বসে; there বসে কোনো কিছু আছে বোঝাতে।',
  },
  {
    id: 'm4-p3', moduleId: 4, type: 'choose-correct-sentence',
    question: 'Which sentence has a clear pronoun reference?',
    options: [
      'Governments fund charities, but they waste money.',
      'Governments fund charities, but the charities waste money.',
      'Governments fund charities, but it wastes money.',
      'Governments fund charities, but them waste money.',
    ],
    answer: 'Governments fund charities, but the charities waste money.',
    explanation:
      'দুটো বহুবচন Noun থাকায় they কাকে বোঝাচ্ছে বোঝা যায় না; Noun-টা আবার লিখলে অর্থ পরিষ্কার হয়।',
  },
  {
    id: 'm4-p4', moduleId: 4, type: 'rewrite',
    question: 'Make the reference specific by adding a summary noun: "Cities are expanding rapidly. This causes problems."',
    answer: 'This expansion causes problems.',
    acceptable: ['this expansion causes problems', 'this growth causes problems'],
    explanation:
      'This + summary noun বসালে this কীসের কথা বলছে, তা পরিষ্কার হয়ে যায়।',
  },

  /* ---- Module 5 ---- */
  {
    id: 'm5-p1', moduleId: 5, type: 'choose-correct-sentence',
    question: 'Which sentence is punctuated correctly?',
    options: [
      'Many cities face congestion, however few have solved it.',
      'Many cities face congestion; however, few have solved it.',
      'Many cities face congestion however, few have solved it.',
      'Many cities face congestion, however; few have solved it.',
    ],
    answer: 'Many cities face congestion; however, few have solved it.',
    explanation:
      'However একটা linking adverbial, তাই এর আগে semicolon বা full stop আর পরে কমা লাগে।',
  },
  {
    id: 'm5-p2', moduleId: 5, type: 'multiple-choice',
    question: 'Which option correctly fixes the comma splice in "The policy was expensive, it reduced emissions."?',
    options: [
      'The policy was expensive, but it reduced emissions.',
      'The policy was expensive, however it reduced emissions.',
      'The policy was expensive it reduced emissions.',
      'The policy was expensive, moreover it reduced emissions.',
    ],
    answer: 'The policy was expensive, but it reduced emissions.',
    explanation:
      'কমার পরে একটা coordinator বসালে দুটো Independent Clause ঠিকভাবে জোড়া লাগে।',
  },
  {
    id: 'm5-p3', moduleId: 5, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'Although the scheme | was popular, | but it | was cancelled.',
    options: ['Although the scheme', 'was popular,', 'but it', 'was cancelled'],
    answer: 'but it',
    explanation:
      'Although আগেই বৈপরীত্য বুঝিয়ে দিয়েছে, তাই but বসালে একই কাজে দুটো connector হয়ে যায়।',
  },
  {
    id: 'm5-p4', moduleId: 5, type: 'fill-blank',
    question: 'The city has three main problems___ traffic, pollution and housing. (colon or semicolon?)',
    answer: ':',
    acceptable: ['colon', ':'],
    explanation:
      'Colon দিয়ে তালিকা শুরু হয়। Semicolon বসাতে হলে দুই পাশেই পূর্ণ বাক্য লাগত।',
  },
]

export const stage1Test: Question[] = [
  /* =========================== Module 1 test ========================== */
  {
    id: 'm1-t1', moduleId: 1, type: 'multiple-choice',
    question: 'Which element is missing from "In this chart illustrates the data."?',
    options: ['The verb', 'The subject', 'The object', 'The adverbial'],
    answer: 'The subject',
    explanation:
      'in this chart একটা Adverbial phrase, তাই Clause-টায় Verb আছে, কিন্তু কোনো Subject নেই।',
  },
  {
    id: 'm1-t2', moduleId: 1, type: 'choose-correct-sentence',
    question: 'Which sentence is correct?',
    options: [
      'Is necessary to reduce waste.',
      'It is necessary to reduce waste.',
      'There is necessary to reduce waste.',
      'Necessary is to reduce waste.',
    ],
    answer: 'It is necessary to reduce waste.',
    explanation:
      'be + adjective + to-infinitive গঠনের আগে dummy subject it বসাতেই হবে।',
  },
  {
    id: 'm1-t3', moduleId: 1, type: 'fill-blank',
    question: '___ are many reasons for this problem. (It / There)',
    answer: 'There',
    acceptable: ['there'],
    explanation:
      'Existential there দিয়ে বোঝানো হয় কোনো কিছু আছে, আর এর পরে একটা Noun phrase বসে।',
  },
  {
    id: 'm1-t4', moduleId: 1, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'The policy | reduced significantly | air pollution | last year.',
    options: ['The policy', 'reduced significantly', 'air pollution', 'last year'],
    answer: 'reduced significantly',
    explanation:
      'Adverb কখনো Verb আর তার Object-এর মাঝখানে বসে না: significantly reduced air pollution হওয়া উচিত।',
  },
  {
    id: 'm1-t5', moduleId: 1, type: 'multiple-choice',
    question: 'In "The results are significant", what is the function of significant?',
    options: ['Object', 'Complement', 'Adverbial', 'Subject'],
    answer: 'Complement',
    explanation:
      'এটা be-এর পরে বসে Subject-কে বর্ণনা করছে, তাই এটা Subject Complement।',
  },
  {
    id: 'm1-t6', moduleId: 1, type: 'choose-correct-sentence',
    question: 'Which sentence has correct word order?',
    options: [
      'Explains the author that technology has changed society.',
      'The author explains that technology has changed society.',
      'That technology has changed society the author explains.',
      'The author that technology has changed society explains.',
    ],
    answer: 'The author explains that technology has changed society.',
    explanation:
      'ইংরেজি statement-এ Subject সবসময় Verb-এর আগে থাকে; শুধু প্রশ্নে এই ক্রম উল্টে যায়।',
  },
  {
    id: 'm1-t7', moduleId: 1, type: 'multiple-choice',
    question: 'Why is "Nowadays, more and more people living in cities." incorrect?',
    options: [
      'It has no subject.',
      'It has no finite verb.',
      'It has two objects.',
      'The adverbial is misplaced.',
    ],
    answer: 'It has no finite verb.',
    explanation:
      'শুধু -ing রূপ কোনো Clause-এর মূল Verb হতে পারে না; এখানে live বা are living দরকার।',
  },
  {
    id: 'm1-t8', moduleId: 1, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'My country | it has | a growing | economy.',
    options: ['My country', 'it has', 'a growing', 'economy'],
    answer: 'it has',
    explanation:
      'My country আগে থেকেই Subject, তাই it বসালে একই Subject দুবার হয়ে যায়।',
  },
  {
    id: 'm1-t9', moduleId: 1, type: 'fill-blank',
    question: 'Complete with one word: ___ is difficult to measure happiness accurately.',
    answer: 'It',
    acceptable: ['it'],
    explanation:
      'আসল Clause-টাকে শেষে পাঠানো হয়েছে, তাই Subject-এর জায়গা পূরণ করছে dummy it।',
  },
  {
    id: 'm1-t10', moduleId: 1, type: 'choose-correct-sentence',
    question: 'Which sentence is grammatically complete?',
    options: [
      'According to the report shows a decline.',
      'According to the report, sales declined.',
      'According to the report declining sales.',
      'In according to the report, sales declined.',
    ],
    answer: 'According to the report, sales declined.',
    explanation:
      'শুরুর phrase-এর পরে Clause-টায় নিজের Subject আর Verb দুটোই আছে।',
  },

  /* =========================== Module 2 test ========================== */
  {
    id: 'm2-t1', moduleId: 2, type: 'multiple-choice',
    question: 'The quality of the roads ___ improved considerably.',
    options: ['have', 'has', 'are', 'were'],
    answer: 'has',
    explanation:
      'Head noun হলো quality, যেটা একবচন; of the roads শুধু বাড়তি বর্ণনা।',
  },
  {
    id: 'm2-t2', moduleId: 2, type: 'choose-correct-sentence',
    question: 'Which sentence is correct?',
    options: [
      'There is many factors behind this trend.',
      'There are many factors behind this trend.',
      'There have many factors behind this trend.',
      'There has many factors behind this trend.',
    ],
    answer: 'There are many factors behind this trend.',
    explanation:
      'Verb মেলে factors-এর সঙ্গে, অর্থাৎ there-এর পরের Noun-এর সঙ্গে।',
  },
  {
    id: 'm2-t3', moduleId: 2, type: 'fill-blank',
    question: 'One of the main causes ___ poor planning. (is / are)',
    answer: 'is',
    explanation:
      'Subject-এর head হলো one, তাই causes বহুবচন হলেও Verb একবচন।',
  },
  {
    id: 'm2-t4', moduleId: 2, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'The number | of cars | have increased | sharply.',
    options: ['The number', 'of cars', 'have increased', 'sharply'],
    answer: 'have increased',
    explanation:
      'The number of একটা নির্দিষ্ট সংখ্যা বোঝায়, তাই Verb হবে has increased।',
  },
  {
    id: 'm2-t5', moduleId: 2, type: 'multiple-choice',
    question: 'Which noun is uncountable and never takes -s?',
    options: ['solution', 'advice', 'factor', 'method'],
    answer: 'advice',
    explanation:
      'Advice uncountable; গুনতে হলে a piece of advice বা suggestions ব্যবহার করুন।',
  },
  {
    id: 'm2-t6', moduleId: 2, type: 'multiple-choice',
    question: 'Each of the participants ___ interviewed twice.',
    options: ['were', 'was', 'have been', 'are'],
    answer: 'was',
    explanation:
      'Each একবচন, আর এটাই Subject phrase-এর head।',
  },
  {
    id: 'm2-t7', moduleId: 2, type: 'choose-correct-sentence',
    question: 'Which sentence uses a collective noun correctly in academic English?',
    options: [
      'The government are planning new rules.',
      'The government is planning new rules.',
      'The government have plan new rules.',
      'The governments is planning new rules.',
    ],
    answer: 'The government is planning new rules.',
    explanation:
      'Academic English-এ Collective Noun একবচন Verb নেয়।',
  },
  {
    id: 'm2-t8', moduleId: 2, type: 'fill-blank',
    question: 'A number of solutions ___ been proposed. (has / have)',
    answer: 'have',
    explanation:
      'A number of মানে কয়েকটি, তাই Verb বহুবচন হবে।',
  },
  {
    id: 'm2-t9', moduleId: 2, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'Modern technology | have changed | the way | we work.',
    options: ['Modern technology', 'have changed', 'the way', 'we work'],
    answer: 'have changed',
    explanation:
      'এখানে technology uncountable, তাই একবচন Verb নেয়: has changed।',
  },
  {
    id: 'm2-t10', moduleId: 2, type: 'multiple-choice',
    question: 'Which sentence shows correct agreement with a long subject?',
    options: [
      'The effects of the new policy on small businesses is unclear.',
      'The effects of the new policy on small businesses are unclear.',
      'The effect of the new policy on small businesses are unclear.',
      'The effects of the new policy on small businesses was unclear.',
    ],
    answer: 'The effects of the new policy on small businesses are unclear.',
    explanation:
      'Effects হলো বহুবচন head noun, তাই Verb-ও বহুবচন।',
  },

  /* =========================== Module 3 test ========================== */
  {
    id: 'm3-t1', moduleId: 3, type: 'multiple-choice',
    question: '___ technology has transformed ___ education.',
    options: ['The / the', 'A / the', 'No article / no article', 'The / a'],
    answer: 'No article / no article',
    explanation:
      'দুটো Noun-ই এখানে সাধারণ অর্থে আর uncountable, তাই কোনোটাতেই article বসে না।',
  },
  {
    id: 'm3-t2', moduleId: 3, type: 'choose-correct-sentence',
    question: 'Which sentence is correct?',
    options: [
      'He is engineer at a large firm.',
      'He is an engineer at a large firm.',
      'He is the engineer at large firm.',
      'He is engineer at the large firm.',
    ],
    answer: 'He is an engineer at a large firm.',
    explanation:
      'একবচন countable Noun-এর আগে সবসময় determiner লাগে, আর vowel sound-এর আগে an বসে।',
  },
  {
    id: 'm3-t3', moduleId: 3, type: 'fill-blank',
    question: 'Complete with one word: ___ internet has changed how we communicate.',
    answer: 'The',
    acceptable: ['the'],
    explanation:
      'সবার চেনা আর একটাই আছে এমন জিনিসের আগে the বসে: the internet, the environment, the media।',
  },
  {
    id: 'm3-t4', moduleId: 3, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'She carried out | a research | on renewable | energy.',
    options: ['She carried out', 'a research', 'on renewable', 'energy'],
    answer: 'a research',
    explanation:
      'Research uncountable, তাই এর আগে a বসতে পারে না। research বা a study লিখুন।',
  },
  {
    id: 'm3-t5', moduleId: 3, type: 'multiple-choice',
    question: 'The city built a new railway. ___ railway has reduced congestion.',
    options: ['A', 'The', 'An', 'No article'],
    answer: 'The',
    explanation:
      'আগে বলা জিনিসের কথা আবার বললে the বসে।',
  },
  {
    id: 'm3-t6', moduleId: 3, type: 'multiple-choice',
    question: 'Which quantifier fits? There is ___ evidence to support this claim.',
    options: ['many', 'few', 'little', 'a number of'],
    answer: 'little',
    explanation:
      'Evidence uncountable, তাই এর সঙ্গে few নয়, little বসে।',
  },
  {
    id: 'm3-t7', moduleId: 3, type: 'choose-correct-sentence',
    question: 'Which sentence is correct?',
    options: [
      'This problems affect every city.',
      'These problems affect every city.',
      'These problem affects every cities.',
      'This problems affects every cities.',
    ],
    answer: 'These problems affect every city.',
    explanation:
      'These মেলে বহুবচন Noun-এর সঙ্গে, আর every-র পরে একবচন Noun বসে।',
  },
  {
    id: 'm3-t8', moduleId: 3, type: 'fill-blank',
    question: 'It is ___ useful information for students. (a / an / no article)',
    answer: 'no article',
    acceptable: ['no article', 'none', '-', 'zero'],
    explanation:
      'Information uncountable, তাই এর আগে a বসে না। গুনতে হলে a piece of যোগ করুন।',
  },
  {
    id: 'm3-t9', moduleId: 3, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'The children | in general | need more | outdoor activity.',
    options: ['The children', 'in general', 'need more', 'outdoor activity'],
    answer: 'The children',
    explanation:
      'পুরো শ্রেণি বোঝাতে article ছাড়া বহুবচন বসে; the বসালে নির্দিষ্ট একটা দলকে বোঝাত।',
  },
  {
    id: 'm3-t10', moduleId: 3, type: 'multiple-choice',
    question: 'Which is correct for a general statement about a whole category?',
    options: [
      'The pollution is a serious problem.',
      'Pollution is a serious problem.',
      'A pollution is a serious problem.',
      'Pollutions are a serious problem.',
    ],
    answer: 'Pollution is a serious problem.',
    explanation:
      'সাধারণ অর্থে uncountable Noun-এর আগে কোনো article বসে না, আর Verb একবচন হয়।',
  },

  /* =========================== Module 4 test ========================== */
  {
    id: 'm4-t1', moduleId: 4, type: 'multiple-choice',
    question: 'The committee announced ___ decision yesterday.',
    options: ['their', 'its', 'it', 'theirs'],
    answer: 'its',
    explanation:
      'Collective Noun-কে একবচন ধরলে possessive Pronoun-ও একবচন হবে: its।',
  },
  {
    id: 'm4-t2', moduleId: 4, type: 'choose-correct-sentence',
    question: 'Which sentence avoids an ambiguous pronoun?',
    options: [
      'People prefer cars to buses because it is faster.',
      'People prefer cars to buses because they are faster.',
      'People prefer cars to buses because cars are faster.',
      'People prefer cars to buses because them are faster.',
    ],
    answer: 'People prefer cars to buses because cars are faster.',
    explanation:
      'They দিয়ে cars, buses বা people - যেকোনোটাই বোঝাতে পারত, তাই Noun-টা আবার লিখতে হবে।',
  },
  {
    id: 'm4-t3', moduleId: 4, type: 'fill-blank',
    question: '___ is a strong link between diet and health. (It / There)',
    answer: 'There',
    acceptable: ['there'],
    explanation:
      'There একটা Noun phrase-এর আগে বসে বোঝায় যে কোনো কিছু আছে।',
  },
  {
    id: 'm4-t4', moduleId: 4, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'Technology is | advancing quickly, | which they make | old skills obsolete.',
    options: ['Technology is', 'advancing quickly,', 'which they make', 'old skills obsolete'],
    answer: 'which they make',
    explanation:
      'Which নিজেই Clause-টার Subject, তাই they বসালে দুটো Subject হয়ে যায়।',
  },
  {
    id: 'm4-t5', moduleId: 4, type: 'multiple-choice',
    question: 'The results were surprising. ___ suggest a new explanation.',
    options: ['It', 'They', 'This', 'There'],
    answer: 'They',
    explanation:
      'Antecedent results বহুবচন, তাই Pronoun হবে they।',
  },
  {
    id: 'm4-t6', moduleId: 4, type: 'multiple-choice',
    question: 'Which phrase best replaces a vague "This" at the start of a sentence?',
    options: ['This thing', 'This', 'This trend', 'That'],
    answer: 'This trend',
    explanation:
      'This + summary noun বসালে this কীসের কথা বলছে তা পরিষ্কার হয়, আর cohesion-ও ভালো হয়।',
  },
  {
    id: 'm4-t7', moduleId: 4, type: 'choose-correct-sentence',
    question: 'Which sentence is correct?',
    options: [
      'It has many museums in the city.',
      'There are many museums in the city.',
      'There has many museums in the city.',
      'It are many museums in the city.',
    ],
    answer: 'There are many museums in the city.',
    explanation:
      'কোনো কিছু আছে বোঝাতে there বসে, আর Verb মেলে museums-এর সঙ্গে।',
  },
  {
    id: 'm4-t8', moduleId: 4, type: 'fill-blank',
    question: 'Students should bring ___ own laptops. (his or her / their)',
    answer: 'their',
    explanation:
      'Antecedent students বহুবচন, তাই their-ই স্বাভাবিক পছন্দ।',
  },
  {
    id: 'm4-t9', moduleId: 4, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'Every company | must protect | their data | from attacks.',
    options: ['Every company', 'must protect', 'their data', 'from attacks'],
    answer: 'their data',
    explanation:
      'Every company একবচন, তাই possessive Pronoun হবে its।',
  },
  {
    id: 'm4-t10', moduleId: 4, type: 'multiple-choice',
    question: 'Which sentence uses dummy it correctly?',
    options: [
      'There is clear that the policy failed.',
      'It is clear that the policy failed.',
      'This is clear that the policy failed.',
      'It is clear the policy failed that.',
    ],
    answer: 'It is clear that the policy failed.',
    explanation:
      'Adjective আর শেষে পাঠানো that-clause-এর আগে it বসে।',
  },

  /* =========================== Module 5 test ========================== */
  {
    id: 'm5-t1', moduleId: 5, type: 'multiple-choice',
    question: 'What is the error in "Technology is advancing rapidly, therefore many jobs will disappear."?',
    options: ['Fragment', 'Comma splice', 'Missing subject', 'Subject-verb agreement'],
    answer: 'Comma splice',
    explanation:
      'Therefore একটা linking adverbial, তাই শুধু কমা দিয়ে দুটো Clause জোড়া দেওয়া যায় না।',
  },
  {
    id: 'm5-t2', moduleId: 5, type: 'choose-correct-sentence',
    question: 'Which sentence is correct?',
    options: [
      'The report was published last year. Which caused a debate.',
      'The report was published last year, which caused a debate.',
      'The report was published last year; which caused a debate.',
      'The report was published last year which, caused a debate.',
    ],
    answer: 'The report was published last year, which caused a debate.',
    explanation:
      'which দিয়ে শুরু হওয়া Clause নির্ভরশীল, তাই এটা একা একটা বাক্য হতে পারে না।',
  },
  {
    id: 'm5-t3', moduleId: 5, type: 'fill-blank',
    question: 'Online learning is convenient___ it is also cheaper. (comma + and, or semicolon?) Write the punctuation plus any word.',
    answer: ', and',
    acceptable: [', and', 'and', ';'],
    explanation:
      'দুটো Independent Clause জোড়া দিতে কমার পরে একটা coordinator লাগে, অথবা একটা semicolon।',
  },
  {
    id: 'm5-t4', moduleId: 5, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'More people | are cycling, | this reduces | air pollution.',
    options: ['More people', 'are cycling,', 'this reduces', 'air pollution'],
    answer: 'this reduces',
    explanation:
      'This দিয়ে নতুন একটা Independent Clause শুরু হচ্ছে, তাই শুধু কমা দেওয়ায় comma splice হয়েছে; which reduces লিখুন।',
  },
  {
    id: 'm5-t5', moduleId: 5, type: 'multiple-choice',
    question: 'Which word creates a dependent clause?',
    options: ['however', 'therefore', 'although', 'moreover'],
    answer: 'although',
    explanation:
      'Although একটা Subordinator, আর বাকি তিনটা linking adverbial।',
  },
  {
    id: 'm5-t6', moduleId: 5, type: 'choose-correct-sentence',
    question: 'Which sentence uses a semicolon correctly?',
    options: [
      'Working from home is common; which reduces commuting.',
      'Working from home is common; it reduces commuting.',
      'Working from home is common; because it reduces commuting.',
      'Working from home; is common and reduces commuting.',
    ],
    answer: 'Working from home is common; it reduces commuting.',
    explanation:
      'Semicolon-এর দুই পাশেই একটা করে পূর্ণ বাক্য থাকতে হবে।',
  },
  {
    id: 'm5-t7', moduleId: 5, type: 'multiple-choice',
    question: 'Which punctuation correctly introduces a list?',
    options: ['semicolon', 'colon', 'comma splice', 'dash and comma'],
    answer: 'colon',
    explanation:
      'একটা পূর্ণ Clause-এর পরে colon বসিয়ে তালিকা শুরু করা হয়।',
  },
  {
    id: 'm5-t8', moduleId: 5, type: 'error-correction',
    question: 'Which underlined part contains the error?',
    prompt: 'Despite | the government | invested heavily, | the problem remained.',
    options: ['Despite', 'the government', 'invested heavily,', 'the problem remained'],
    answer: 'Despite',
    explanation:
      'Despite-এর পরে Noun বা -ing রূপ বসে; পূর্ণ Clause বসাতে হলে although লাগবে।',
  },
  {
    id: 'm5-t9', moduleId: 5, type: 'choose-correct-sentence',
    question: 'Which is a complete sentence?',
    options: [
      'Because the system is efficient.',
      'Which saves a great deal of money.',
      'The system is efficient, so it saves money.',
      'Saving a great deal of money every year.',
    ],
    answer: 'The system is efficient, so it saves money.',
    explanation:
      'শুধু এই option-টাতেই একটা Independent Clause আছে।',
  },
  {
    id: 'm5-t10', moduleId: 5, type: 'multiple-choice',
    question: 'Which correctly joins "The cost was high" and "The benefits were clear"?',
    options: [
      'The cost was high, however the benefits were clear.',
      'The cost was high; however, the benefits were clear.',
      'The cost was high however; the benefits were clear.',
      'The cost was high, however; the benefits were clear.',
    ],
    answer: 'The cost was high; however, the benefits were clear.',
    explanation:
      'However-এর আগে semicolon আর পরে কমা বসে।',
  },
]
