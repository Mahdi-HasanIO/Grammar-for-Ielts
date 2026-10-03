import type { Lesson } from '@/types'

export const stage1Lessons: Lesson[] = [
  /* ------------------------------ Module 1 ----------------------------- */
  {
    moduleId: 1,
    intro:
      'ইংরেজির প্রতিটি বাক্য তৈরি হয় Clause (উপবাক্য) দিয়ে, আর প্রতিটি Clause-এ একটা Subject (কর্তা) আর একটা Verb (ক্রিয়া) থাকতেই হবে। অনেকে Band 8-এ পৌঁছাতে পারেন না কঠিন grammar-এর জন্য নয়; বরং Subject বাদ পড়া, Subject দুইবার বসানো বা ভুল word order-এর জন্য। এই জায়গাটা পাকা হলে পরের module-গুলো অনেক সহজ লাগবে।',
    rules: [
      {
        id: 'm1-r1',
        heading: 'Clause-এর পাঁচটি উপাদান',
        rule: 'একটি Clause সর্বোচ্চ পাঁচটি উপাদান দিয়ে গঠিত হয়: Subject (কর্তা), Verb (ক্রিয়া), Object (কর্ম), Complement (পূরক) এবং Adverbial (ক্রিয়া-বিশেষণ অংশ)। Verb থাকা বাধ্যতামূলক, আর লিখিত ইংরেজিতে Subject-ও বাধ্যতামূলক।',
        whenToUse:
          'ভুল ধরার টুল হিসেবে এটা ব্যবহার করুন। কোনো বাক্য পড়ে খটকা লাগলে উপাদানগুলো আলাদা করে দেখুন: কোনটা বাদ পড়েছে, বা কোনটা দুইবার এসেছে।',
        structure: [
          'Subject + Verb: Prices rose.',
          'Subject + Verb + Object: The government introduced a tax.',
          'Subject + Verb + Complement: The results are significant.',
          'Subject + Verb + Adverbial: The figure peaked in 2015.',
          'Subject + Verb + Object + Adverbial: Cities attract migrants for economic reasons.',
        ],
        notes: [
          'Complement (পূরক) Subject-কে বর্ণনা করে এবং সাধারণত be, become, seem বা appear-এর পরে বসে।',
          'Adverbial-কে বাক্যের বিভিন্ন জায়গায় সরানো যায়, কিন্তু Object ও Complement সরানো যায় না।',
        ],
        table: {
          caption: 'উপাদান চেনার সহজ উপায়',
          headers: ['উপাদান', 'যে প্রশ্নের উত্তর দেয়', 'উদাহরণ'],
          rows: [
            ['Subject (কর্তা)', 'কে বা কী কাজটি করে?', 'Public transport reduces congestion.'],
            ['Verb (ক্রিয়া)', 'কী ঘটছে?', 'Public transport reduces congestion.'],
            ['Object (কর্ম)', 'কার উপর কাজটি পড়ছে?', 'Public transport reduces congestion.'],
            ['Complement (পূরক)', 'Subject আসলে কী?', 'The policy is effective.'],
            ['Adverbial', 'কখন, কোথায়, কেন, কীভাবে?', 'The policy worked in rural areas.'],
          ],
        },
      },
      {
        id: 'm1-r2',
        heading: 'মূল শব্দক্রম: Subject - Verb - Object',
        rule: 'ইংরেজিতে অর্থ ঠিক হয় শব্দের ক্রম দিয়ে। Subject আর Object-এর জায়গা বদলে গেলে কে কাজটি করল সেটাই বদলে যায়, তাই এই ক্রম ইচ্ছেমতো পাল্টানো যায় না।',
        whenToUse: 'সাধারণ statement বা বিবৃতিমূলক প্রতিটি বাক্যেই এই নিয়ম খাটে।',
        structure: [
          'Statement: Subject + Verb + Object + (Adverbial)',
          'Adverbial বাক্যের শুরুতেও বসতে পারে: In 2020, the government introduced a tax.',
          'Verb-কে তার Subject-এর কাছাকাছি রাখুন, মাঝখানে লম্বা অংশ ঢোকাবেন না।',
        ],
        notes: [
          'শুরুতে বসা Adverbial কয়েক শব্দের বেশি হলে তার পরে কমা দিতে হয়।',
          'Verb আর তার Object-এর মাঝখানে Adverb বসাবেন না: reduces significantly congestion নয়, বরং significantly reduces congestion.',
        ],
      },
      {
        id: 'm1-r3',
        heading: 'Prepositional phrase কখনো Subject হতে পারে না',
        rule: 'in, on, from, by, for বা according to দিয়ে শুরু হওয়া অংশটি Adverbial, Subject নয়। তাই Clause-এর নিজের একটি Subject লাগবেই।',
        whenToUse:
          'বিশেষ করে Task 1-এর শুরুর বাক্যে, যেখানে অনেকে In the graph বা According to the table দিয়ে বাক্য শুরু করেন।',
        structure: [
          'Wrong: In this graph shows the data.',
          'Right: The graph shows the data.',
          'Right: In this graph, the data shows a clear trend.',
          'Right: As the graph shows, consumption rose steadily.',
        ],
        notes: [
          'In / From / According to দিয়ে শুরু করলে কমার পরে সত্যিকারের একটি Subject আছে কি না যাচাই করুন।',
        ],
        examples: [
          {
            wrong: 'In the chart illustrates the number of visitors.',
            right: 'The chart illustrates the number of visitors.',
            note: 'Preposition-টি সরিয়ে দিলে the chart নিজেই Subject হয়ে যায়।',
          },
        ],
      },
      {
        id: 'm1-r4',
        heading: 'Dummy it এবং Existential there',
        rule: 'ইংরেজিতে Subject ছাড়া Clause চলে না। বসানোর মতো অর্থপূর্ণ কোনো Subject না থাকলে it বা there সেই খালি জায়গাটা পূরণ করে।',
        whenToUse:
          'মতামত দেওয়ার বাক্যে (It is important to...), আবহাওয়া বা সময় বোঝাতে, আর কোনো কিছু আছে সেটা জানাতে (There are three reasons...)।',
        structure: [
          'It + be + adjective + to-infinitive: It is important to consider the cost.',
          'It + be + adjective + that-clause: It is clear that demand has risen.',
          'There + be + noun: There are several explanations for this trend.',
        ],
        notes: [
          'এই it কখনো বাদ দেবেন না; লিখিত ইংরেজিতে Is important to consider কোনো পূর্ণ বাক্য নয়।',
          'There is / There are পরের Noun অনুযায়ী বদলায়। Module 2-তে এটি বিস্তারিত আছে।',
        ],
      },
    ],
    examples: [
      {
        wrong: 'In this graph shows the population of three cities.',
        right: 'This graph shows the population of three cities.',
        note: 'in this graph একটি Adverbial phrase বলে Clause-টির কোনো Subject ছিল না।',
      },
      {
        wrong: 'Is important to invest in education.',
        right: 'It is important to invest in education.',
        note: 'লিখিত ইংরেজিতে dummy subject it বসাতেই হবে।',
      },
      {
        wrong: 'The students they often struggle with grammar.',
        right: 'The students often struggle with grammar.',
        note: 'Subject-কে আবার Pronoun দিয়ে দ্বিতীয়বার বসাবেন না।',
      },
      {
        wrong: 'The policy reduced significantly air pollution.',
        right: 'The policy significantly reduced air pollution.',
        note: 'Verb আর Object-এর মাঝখানে Adverb বসানো যায় না।',
      },
      {
        wrong: 'Have many reasons for this problem.',
        right: 'There are many reasons for this problem.',
        note: 'কোনো কিছু আছে বোঝাতে existential there ব্যবহার করুন।',
      },
    ],
    mistakes: [
      {
        wrong: 'In the first chart shows a sharp rise.',
        right: 'The first chart shows a sharp rise.',
        explanation:
          'Prepositional phrase কখনো Subject-এর কাজ করতে পারে না। হয় preposition-টি বাদ দিন, নয়তো কমার পরে একটি Subject যোগ করুন।',
      },
      {
        wrong: 'Is necessary to reduce carbon emissions.',
        right: 'It is necessary to reduce carbon emissions.',
        explanation: 'লেখায় প্রতিটি Clause-এ Subject লাগে; অর্থ না থাকলেও অন্তত একটা dummy subject বসাতেই হয়।',
      },
      {
        wrong: 'My country it has a growing economy.',
        right: 'My country has a growing economy.',
        explanation:
          'My country নিজেই Subject, তাই it বসালে একই Clause-এ দুটি Subject হয়ে যায়, যা ভুল।',
      },
      {
        wrong: 'Nowadays, more and more people living in cities.',
        right: 'Nowadays, more and more people live in cities.',
        explanation:
          'শুধু -ing রূপ কখনো finite verb হতে পারে না, তাই Clause-টাতে আসল Verb-টাই ছিল না।',
      },
      {
        wrong: 'Explains the author that technology has changed society.',
        right: 'The author explains that technology has changed society.',
        explanation:
          'ইংরেজি statement-এ Subject সবসময় Verb-এর আগে থাকে; শুধু প্রশ্নে এই ক্রম উল্টে যায়।',
      },
    ],
    keyTakeaways: [
      'প্রতিটি বাক্যে Subject আর finite Verb খুঁজে বের করার অভ্যাস করুন।',
      'in, on বা according to দিয়ে শুরু হওয়া অংশ কখনো Subject নয়।',
      'আসল Subject না থাকলে it বা there বসান; Subject-এর জায়গা কখনো খালি রাখবেন না।',
      'Subject-কে Pronoun দিয়ে দুইবার বসাবেন না, আর Verb ও Object-এর মাঝখানে Adverb রাখবেন না।',
    ],
  },

  /* ------------------------------ Module 2 ----------------------------- */
  {
    moduleId: 2,
    intro:
      'Subject ছোট হলে Agreement সহজই মনে হয়, কিন্তু Subject লম্বা হলেই গোলমাল শুরু হয়। তখন আমরা আসল Subject-এর কথা ভুলে গিয়ে Verb-কে সবচেয়ে কাছের Noun-এর সঙ্গে মিলিয়ে ফেলি। এই ভুল পুরো লেখায় বারবার হয় বলে আপনার accuracy-তে এর প্রভাব অনেক বেশি।',
    rules: [
      {
        id: 'm2-r1',
        heading: 'আসল Head Noun খুঁজে তারপর Verb মেলান',
        rule: 'Verb মিলবে Subject noun phrase-এর head noun-এর সঙ্গে, Verb-এর ঠিক আগে বসা Noun-এর সঙ্গে নয়।',
        whenToUse:
          'যখনই Subject-এর ভেতরে of, with, along with, as well as বা কোনো Relative Clause থাকে।',
        structure: [
          'The number of students is rising. (head = number)',
          'The effects of the policy are visible. (head = effects)',
          'The quality of the roads has improved. (head = quality)',
        ],
        notes: [
          'মনে মনে head noun আর Verb-এর মাঝের অংশটুকু বাদ দিয়ে পড়ুন, তারপর মিলিয়ে দেখুন।',
          'along with, together with বা as well as বসলে একবচন Subject বহুবচন হয়ে যায় না।',
        ],
      },
      {
        id: 'm2-r2',
        heading: 'There is এবং There are',
        rule: 'Existential বাক্যে Verb মেলে পরে বসা Noun-এর সঙ্গে, there-এর সঙ্গে নয়।',
        whenToUse: 'নতুন কোনো কিছু আছে, সেটা জানাতে।',
        structure: [
          'There is a clear difference between the two groups.',
          'There are several reasons for this change.',
          'There has been a steady increase in demand.',
          'There have been numerous attempts to solve the problem.',
        ],
        notes: [
          'তালিকা থাকলে প্রথম আইটেমের সঙ্গে মেলান: There is a library and two laboratories on campus.',
        ],
      },
      {
        id: 'm2-r3',
        heading: 'Uncountable Noun সবসময় একবচন',
        rule: 'ইংরেজিতে অনেক abstract Noun (যেমন advice, progress) আর বস্তুবাচক Noun (যেমন equipment) বহুবচন হয় না, আর সবসময় একবচন Verb নেয়।',
        whenToUse: 'Academic writing-এ প্রায় সবসময়, কারণ সেখানে abstract Noun অনেক বেশি ব্যবহার হয়।',
        structure: [
          'Information is widely available.',
          'This research supports the hypothesis.',
          'The equipment was installed last year.',
        ],
        table: {
          caption: 'যে Noun-গুলোতে শিক্ষার্থীরা সবচেয়ে বেশি ভুল করে',
          headers: ['Uncountable (-s হয় না)', 'গুনতে চাইলে যা ব্যবহার করবেন'],
          rows: [
            ['information', 'pieces of information / facts'],
            ['research', 'studies'],
            ['advice', 'pieces of advice / suggestions'],
            ['equipment', 'machines / tools'],
            ['knowledge', 'skills'],
            ['furniture', 'items of furniture'],
            ['evidence', 'findings'],
            ['progress', 'steps / improvements'],
          ],
        },
        notes: [
          'কখনোই informations, researches, advices বা equipments লিখবেন না।',
          'গুনতে হলে পরিমাণবাচক শব্দ ব্যবহার করুন: three pieces of evidence.',
        ],
      },
      {
        id: 'm2-r4',
        heading: 'Each, every, one of এবং দুই ধরনের number',
        rule: 'Each ও every একবচন Verb নেয়। One of-এর পরে বহুবচন Noun বসলেও Verb একবচন হয়। A number of বহুবচন, আর the number of একবচন।',
        whenToUse: 'সাধারণ মন্তব্য করার সময় এবং তথ্য বা পরিসংখ্যান বর্ণনা করার সময়।',
        structure: [
          'Each student receives a laptop.',
          'Every country faces this challenge.',
          'One of the main causes is poor planning.',
          'A number of studies have reached the same conclusion.',
          'The number of applicants has fallen.',
        ],
        notes: [
          'A number of মানে কয়েকটি, তাই Verb বহুবচন। The number of একটি নির্দিষ্ট সংখ্যা বোঝায়, তাই Verb একবচন।',
          'Academic English-এ government, team, company-র মতো Collective Noun একবচন Verb নেয়: The government has announced a plan.',
        ],
      },
    ],
    examples: [
      {
        wrong: 'The impact of social media on young people are significant.',
        right: 'The impact of social media on young people is significant.',
        note: 'Head noun হলো impact, যা একবচন।',
      },
      {
        wrong: 'There is many factors behind this trend.',
        right: 'There are many factors behind this trend.',
        note: 'Verb মিলছে factors-এর সঙ্গে।',
      },
      {
        wrong: 'Researches show that exercise improves memory.',
        right: 'Research shows that exercise improves memory.',
        note: 'Research uncountable, তাই -s নেই এবং Verb একবচন।',
      },
      {
        wrong: 'One of the biggest problem are traffic congestion.',
        right: 'One of the biggest problems is traffic congestion.',
        note: 'One of-এর পরে বহুবচন Noun, কিন্তু Verb একবচন।',
      },
      {
        wrong: 'The number of cars have increased sharply.',
        right: 'The number of cars has increased sharply.',
        note: 'The number of একটি নির্দিষ্ট সংখ্যা বোঝায়, তাই Verb একবচন।',
      },
    ],
    mistakes: [
      {
        wrong: 'The government are planning new regulations.',
        right: 'The government is planning new regulations.',
        explanation:
          'Academic English-এ Collective Noun একবচন Verb নেয়। একবার যে রূপ বেছে নেবেন, পুরো লেখায় সেটাই ধরে রাখুন।',
      },
      {
        wrong: 'Each of the participants were interviewed twice.',
        right: 'Each of the participants was interviewed twice.',
        explanation: 'Subject-এর head হলো each, আর each সবসময় একবচন।',
      },
      {
        wrong: 'Modern technology have changed the way we work.',
        right: 'Modern technology has changed the way we work.',
        explanation: 'এখানে technology uncountable, তাই এটা একবচন Noun-এর মতোই Verb নেয়।',
      },
      {
        wrong: 'A number of solutions has been proposed.',
        right: 'A number of solutions have been proposed.',
        explanation: 'A number of মানে কয়েকটি, তাই Verb বহুবচন হবে।',
      },
      {
        wrong: 'The data was collected from three countries, and they was analysed in 2020.',
        right: 'The data were collected from three countries and analysed in 2020.',
        explanation:
          'Academic writing-এ data সাধারণত বহুবচন ধরা হয়। আপনি যে রূপই বেছে নিন, পুরো লেখায় একই রকম রাখুন।',
      },
    ],
    keyTakeaways: [
      'মাঝের বাড়তি অংশ বাদ দিয়ে head noun-এর সঙ্গে Verb মেলান।',
      'There is / there are মেলে পরের Noun-এর সঙ্গে, there-এর সঙ্গে নয়।',
      'information, research, advice, equipment ও evidence-এ কখনো -s বসে না।',
      'A number of = বহুবচন Verb; the number of = একবচন Verb।',
    ],
  },

  /* ------------------------------ Module 3 ----------------------------- */
  {
    moduleId: 3,
    intro:
      'Article-এর নিজের তেমন অর্থ নেই, তাই এগুলো সহজেই বাদ পড়ে যায় আর চোখেও পড়ে না। সমস্যাটা সংখ্যায়: একটা essay-তে প্রায় একশোবার article বসানোর জায়গা আসে, তাই অল্প কিছু ভুলেও পুরো লেখাটা ভুলে ভরা মনে হয়। তাই ধাপে ধাপে ভাবুন: Countable না Uncountable, তারপর নির্দিষ্ট না সাধারণ, তারপর প্রথমবার বলছেন নাকি আগে বলা জিনিস।',
    rules: [
      {
        id: 'm3-r1',
        heading: 'Article বাছাইয়ের ধাপ',
        rule: 'তিনটি প্রশ্ন করুন: Noun-টি কি Countable? এটি কি একবচন? পাঠক কি বুঝতে পারবে ঠিক কোনটির কথা বলছেন?',
        whenToUse: 'যেকোনো common noun লেখার ঠিক আগে।',
        structure: [
          'Countable + singular + নির্দিষ্ট: the solution',
          'Countable + singular + অনির্দিষ্ট: a solution',
          'Countable + plural + সাধারণ অর্থে: solutions',
          'Uncountable + সাধারণ অর্থে: pollution',
          'আগে উল্লেখ করা যে কোনো Noun: the',
        ],
        table: {
          caption: 'কোন Article কোথায় বসবে',
          headers: ['Noun-এর ধরন', 'সাধারণ অর্থে', 'নির্দিষ্ট অর্থে'],
          rows: [
            ['Singular countable', 'a / an car', 'the car'],
            ['Plural countable', 'cars (article নেই)', 'the cars'],
            ['Uncountable', 'water (article নেই)', 'the water'],
          ],
        },
      },
      {
        id: 'm3-r2',
        heading: 'প্রথম উল্লেখ ও দ্বিতীয় উল্লেখ',
        rule: 'নতুন কিছু প্রথমবার বলার সময় a বসে, অথবা কোনো article বসে না; পরে সেই একই জিনিসের কথা বললে the বসে।',
        whenToUse: 'যে paragraph-এ একটা উদাহরণ ধরে আলোচনা এগোচ্ছেন, সেখানে।',
        structure: [
          'The city built a new railway. The railway has reduced congestion.',
          'Governments could introduce taxes. The taxes would fund public transport.',
        ],
        notes: [
          'প্রসঙ্গ থেকেই বোঝা গেলে the বসে: the government, the environment, the internet.',
          'Superlative ও ক্রমবাচক শব্দের আগে the বসে: the highest figure, the first stage.',
        ],
      },
      {
        id: 'm3-r3',
        heading: 'সাধারণভাবে কোনো কিছু বোঝানো',
        rule: 'সাধারণ অর্থ বোঝাতে Countable Noun-এর বহুবচন রূপ article ছাড়া ব্যবহার করুন, আর Uncountable Noun-ও article ছাড়া ব্যবহার করুন।',
        whenToUse:
          'Task 2-এর introduction আর topic sentence-এ, যেখানে নির্দিষ্ট কোনো উদাহরণ নয়, পুরো একটা শ্রেণি নিয়ে কথা বলছেন।',
        structure: [
          'Cars pollute the air. (The cars pollute... নয়)',
          'Education reduces inequality.',
          'Children learn languages quickly.',
          'A child learns languages quickly. (একবচনে সাধারণ অর্থ, তুলনামূলক কম ব্যবহৃত)',
        ],
        notes: [
          'The + বহুবচন Noun মানে একটি নির্দিষ্ট দল: The children in the study learned quickly.',
          'সাধারণ অর্থে abstract Noun-এর আগে the বসে না: the technology has changed society ভুল।',
        ],
      },
      {
        id: 'm3-r4',
        heading: 'Determiner ও Quantifier',
        rule: 'Demonstrative ও Quantifier নিজেই Article-এর জায়গা নেয়; এদের সঙ্গে a বা the একসঙ্গে বসে না।',
        whenToUse: 'আগে বলা কোনো আইডিয়া বোঝাতে, বা মোটামুটি পরিমাণ বোঝাতে।',
        structure: [
          'this / that + একবচন; these / those + বহুবচন',
          'much + uncountable; many + countable plural',
          'a little / little + uncountable; a few / few + countable plural',
          'some, any, all, most, several, both',
        ],
        table: {
          caption: 'Quantifier কোন Noun-এর সঙ্গে বসে',
          headers: ['Quantifier', 'Noun-এর ধরন', 'উদাহরণ'],
          rows: [
            ['much, a little, less', 'uncountable', 'much progress, less traffic'],
            ['many, a few, fewer', 'countable plural', 'many studies, fewer cars'],
            ['most, some, all', 'দুই ধরনেই', 'most people, most pollution'],
            ['each, every', 'countable singular', 'each student'],
          ],
        },
        notes: [
          'Most people মানে সাধারণভাবে বেশিরভাগ মানুষ; most of the people মানে একটি নির্দিষ্ট দলের বেশিরভাগ।',
          'A few মানে কিছু আছে; few মানে প্রায় নেই। A little ও little-এর পার্থক্যও ঠিক একই রকম।',
        ],
      },
    ],
    examples: [
      {
        wrong: 'The technology has transformed the education.',
        right: 'Technology has transformed education.',
        note: 'দুটি Noun-ই এখানে সাধারণ ও uncountable, তাই কোনো article বসবে না।',
      },
      {
        wrong: 'He is engineer at a large company.',
        right: 'He is an engineer at a large company.',
        note: 'একবচন Countable Noun-এর আগে সবসময় একটি determiner লাগে।',
      },
      {
        wrong: 'The cars are a major source of pollution.',
        right: 'Cars are a major source of pollution.',
        note: 'সাধারণ অর্থ বোঝাতে article ছাড়া বহুবচন ব্যবহার করুন।',
      },
      {
        wrong: 'There are much advantages to this approach.',
        right: 'There are many advantages to this approach.',
        note: 'Advantages countable, তাই many বসবে।',
      },
      {
        wrong: 'Government should invest more in the public transport.',
        right: 'The government should invest more in public transport.',
        note: 'The government নির্দিষ্ট, কিন্তু public transport এখানে সাধারণ অর্থে।',
      },
    ],
    mistakes: [
      {
        wrong: 'Internet has changed how we communicate.',
        right: 'The internet has changed how we communicate.',
        explanation:
          'সবার কাছে পরিচিত ও একক জিনিসের আগে the বসে: the internet, the environment, the media.',
      },
      {
        wrong: 'She did a research on renewable energy.',
        right: 'She carried out research on renewable energy.',
        explanation:
          'Research uncountable বলে এর আগে a বসতে পারে না। Countable Noun দরকার হলে a study ব্যবহার করুন।',
      },
      {
        wrong: 'Most of people believe that education is important.',
        right: 'Most people believe that education is important.',
        explanation:
          'সাধারণ অর্থে most + বহুবচন Noun বসে। Most of ব্যবহার করলে পরে determiner লাগে: most of the people in the survey.',
      },
      {
        wrong: 'The children in general need more outdoor activity.',
        right: 'Children in general need more outdoor activity.',
        explanation:
          'পুরো শ্রেণি বোঝাতে article ছাড়া বহুবচন বসে; the বসালে নির্দিষ্ট একটা দলকে বোঝাত।',
      },
      {
        wrong: 'This problems affect every city.',
        right: 'These problems affect every city.',
        explanation: 'This একবচনের জন্য; বহুবচন Noun-এর সঙ্গে these বসে।',
      },
      {
        wrong: 'It is a useful information for students.',
        right: 'It is useful information for students.',
        explanation:
          'Uncountable Noun-এর আগে কখনো a বসে না। গুনতে হলে a piece of যোগ করুন।',
      },
    ],
    keyTakeaways: [
      'প্রথমে ঠিক করুন Countable না Uncountable, তারপর নির্দিষ্ট না সাধারণ।',
      'নতুন কিছু আনতে a, আর আগের জিনিস বোঝাতে the।',
      'সাধারণ অর্থ বোঝাতে article ছাড়া বহুবচন ও uncountable Noun ব্যবহার করুন।',
      'this, these, each, every বা most-এর সঙ্গে কখনো article বসাবেন না।',
    ],
  },

  /* ------------------------------ Module 4 ----------------------------- */
  {
    moduleId: 4,
    intro:
      'Pronoun ব্যবহার করে আপনি আসলে ধরে নিচ্ছেন যে পাঠক ইতিমধ্যে বুঝে গেছেন কার কথা হচ্ছে। পাঠক যদি তা না বোঝেন, তাহলে বাক্যের গঠন ঠিক থাকলেও যুক্তিটা আটকে যায়। এই ভুলে Grammar আর Coherence দুই জায়গাতেই নম্বর কাটে, তাই এটা ভালোভাবে ঠিক করে নেওয়া দরকার।',
    rules: [
      {
        id: 'm4-r1',
        heading: 'Pronoun আর Noun-এর বচনে মিল',
        rule: 'Pronoun যে Noun-কে বোঝাচ্ছে (তার Antecedent), বচনে তার সঙ্গে মিলতে হবে। একবচন Noun-এর জন্য it, he, she বা singular they; বহুবচন Noun-এর জন্য they।',
        whenToUse: 'যতবার আগে বলা কোনো Noun-কে আবার বোঝাতে চাইবেন।',
        structure: [
          'The company increased its budget.',
          'Companies increased their budgets.',
          'A student should submit their work on time. (singular they, এখন গ্রহণযোগ্য)',
        ],
        notes: [
          'Collective Noun-কে একবচন ধরলে it বসবে: The government published its report.',
          'নির্দিষ্ট নয় এমন কোনো ব্যক্তির কথা বলতে academic writing-এ singular they চলে, আর এতে he or she-এর মতো ভারী গঠন এড়ানো যায়।',
        ],
      },
      {
        id: 'm4-r2',
        heading: 'Antecedent যেন একটাই হয়',
        rule: 'একটা Pronoun ঠিক একটা Noun-কেই বোঝাবে। দুটো Noun-ই খাপ খেলে Pronoun না বসিয়ে Noun-টাই আবার লিখুন।',
        whenToUse: 'যখন এক বাক্যে Pronoun-টা বোঝাতে পারে এমন দুটো Noun থাকে।',
        structure: [
          'Ambiguous: Governments give money to charities, but they waste it.',
          'Clear: Governments give money to charities, but the charities waste it.',
          'Clear: Governments give money to charities, although this funding is often wasted.',
        ],
        notes: [
          'নিজের লেখা পড়তে গিয়ে যদি আপনি নিজেই এক মুহূর্ত থমকে যান, পাঠকও থমকাবেন।',
          'Noun আবার লেখা কখনো ভুল নয়, কিন্তু অস্পষ্ট Pronoun অবশ্যই ভুল।',
        ],
      },
      {
        id: 'm4-r3',
        heading: 'This, that এবং Summary Noun',
        rule: 'This আর that পুরো একটা আইডিয়াকে বোঝাতে পারে, কিন্তু শুধু this লিখলে প্রায়ই বোঝা যায় না কীসের কথা হচ্ছে। সঙ্গে একটা Noun বসালেই পরিষ্কার হয়ে যায়।',
        whenToUse:
          'যে বাক্য আগের বাক্য নিয়ে মন্তব্য করছে, তার শুরুতে। Academic writing-এ এটা সবচেয়ে কাজের অভ্যাসগুলোর একটা।',
        structure: [
          'Weak: Cities are expanding rapidly. This causes problems.',
          'Strong: Cities are expanding rapidly. This expansion places pressure on housing.',
          'কাজে লাগে এমন summary noun: this trend, this approach, this finding, this shift, this policy, this argument.',
        ],
        notes: ['Module 21-এ এই গঠনটিকেই cohesion-এর কৌশল হিসেবে আরও বিস্তারিত দেখানো হয়েছে।'],
      },
      {
        id: 'm4-r4',
        heading: 'Dummy it বনাম Existential there',
        rule: 'মতামত দিতে বা লম্বা Clause-কে বাক্যের শেষে পাঠাতে it, আর কোনো কিছু আছে বোঝাতে there। একটার জায়গায় আরেকটা বসে না।',
        whenToUse: 'Introduction-এর বাক্যে, আর নতুন তথ্য আনার সময়।',
        structure: [
          'It is clear that demand has risen.',
          'It is difficult to measure happiness.',
          'There is a strong link between diet and health.',
          'There are three main arguments against this view.',
        ],
        notes: [
          'It বসে Adjective বা that-clause-এর আগে; there বসে একটি Noun phrase-এর আগে।',
          'It is clear that...-এর it কোনো কিছুকে নির্দেশ করে না, তাই এর জন্য কোনো antecedent লাগে না।',
        ],
      },
    ],
    examples: [
      {
        wrong: 'Every company must protect their data.',
        right: 'Every company must protect its data.',
        note: 'Every থাকলে Pronoun একবচন হতে বাধ্য।',
      },
      {
        wrong: 'When parents talk to teachers, they often disagree with them.',
        right: 'When parents talk to teachers, the parents often disagree with them.',
        note: 'দুটি বহুবচন Noun থাকায় they অস্পষ্ট হয়ে গিয়েছিল।',
      },
      {
        wrong: 'There is clear that the policy failed.',
        right: 'It is clear that the policy failed.',
        note: 'Adjective ও that-clause-এর আগে it বসে।',
      },
      {
        wrong: 'The results were surprising. It suggests a new explanation.',
        right: 'The results were surprising. They suggest a new explanation.',
        note: 'Antecedent results বহুবচন।',
      },
      {
        wrong: 'Pollution increased, and this is a problem that must be solved.',
        right: 'Pollution increased, and this deterioration must be addressed.',
        note: 'Summary noun বসানোয় this কীসের কথা বলছে, তা এখন পরিষ্কার।',
      },
    ],
    mistakes: [
      {
        wrong: 'Students should bring his or her own laptop.',
        right: 'Students should bring their own laptops.',
        explanation: 'Antecedent বহুবচন রাখলে Pronoun-ও আপনাআপনি সহজ আর স্বাভাবিক হয়ে যায়।',
      },
      {
        wrong: 'It has many museums in the city.',
        right: 'There are many museums in the city.',
        explanation: 'কোনো কিছু আছে বোঝাতে there বসে, it নয়।',
      },
      {
        wrong: 'The committee announced their decision, and it was criticised by them.',
        right: 'The committee announced its decision, which was widely criticised.',
        explanation:
          'Collective Noun-টাকে একবচন রাখুন, আর Relative Clause দিয়ে পরপর অনেকগুলো Pronoun-এর জট ছাড়িয়ে নিন।',
      },
      {
        wrong: 'Technology is advancing quickly, which they make old skills obsolete.',
        right: 'Technology is advancing quickly, which makes old skills obsolete.',
        explanation:
          'Relative pronoun which নিজেই Subject, তাই they বসালে দ্বিতীয় একটি Subject হয়ে যায়।',
      },
      {
        wrong: 'Some people prefer cars to public transport because it is faster.',
        right: 'Some people prefer cars to public transport because cars are faster.',
        explanation:
          'It যে কোনোটিকেই বোঝাতে পারে, ফলে তুলনাটাই অর্থহীন হয়ে যায়।',
      },
    ],
    keyTakeaways: [
      'প্রতিটি Pronoun-এর জন্য একটাই স্পষ্ট Antecedent আছে কি না, আর বচনে মিলছে কি না, দেখে নিন।',
      'অস্পষ্ট this-এর বদলে this + summary noun লিখুন।',
      'It দিয়ে মূল্যায়ন শুরু হয়, there দিয়ে অস্তিত্ব।',
      'অস্পষ্ট Pronoun-এর চেয়ে Noun আবার লিখে দেওয়া সবসময় ভালো।',
    ],
  },

  /* ------------------------------ Module 5 ----------------------------- */
  {
    moduleId: 5,
    intro:
      'এই module-এর মূল প্রশ্ন একটাই: একটা বাক্য কোথায় শুরু হয় আর কোথায় শেষ হয়? Fragment, run-on আর comma splice সবগুলোই এই প্রশ্নের ভুল উত্তর থেকে আসে। ভালো খবর হলো, চেক করার নিয়মটা একদম mechanical, তাই পরীক্ষার চাপেও অর্থ নিয়ে মাথা না ঘামিয়ে সহজে চেক করা যায়।',
    rules: [
      {
        id: 'm5-r1',
        heading: 'Independent ও Dependent Clause',
        rule: 'Independent Clause একাই একটা পূর্ণ বাক্য হতে পারে। Dependent Clause শুরু হয় একটা Subordinator (যেমন because, although) দিয়ে, আর একা দাঁড়াতে পারে না।',
        whenToUse: 'দাঁড়ি বা full stop বসানোর ঠিক আগে।',
        structure: [
          'Independent: Air quality has improved.',
          'Dependent: Because air quality has improved',
          'Complete: Because air quality has improved, fewer people suffer from asthma.',
        ],
        table: {
          caption: 'যে শব্দগুলো Dependent Clause তৈরি করে',
          headers: ['সম্পর্ক', 'Subordinator'],
          rows: [
            ['কারণ', 'because, since, as'],
            ['বৈপরীত্য', 'although, though, whereas, while'],
            ['শর্ত', 'if, unless, provided that'],
            ['সময়', 'when, before, after, until, once'],
            ['উদ্দেশ্য', 'so that, in order that'],
          ],
        },
        notes: [
          'এক বাক্যে একাধিক Dependent Clause থাকতে পারে, কিন্তু অন্তত একটি Independent Clause থাকতেই হবে।',
        ],
      },
      {
        id: 'm5-r2',
        heading: 'Fragment (অসম্পূর্ণ বাক্য)',
        rule: 'Fragment হলো বাক্যের একটা টুকরো, যেটাকে পূর্ণ বাক্যের মতো full stop দিয়ে লেখা হয়েছে। সাধারণত এতে finite verb থাকে না, অথবা এটা একা পড়ে থাকা একটা Dependent Clause।',
        whenToUse: 'because, although, which বা কোনো -ing রূপ দিয়ে শুরু হওয়া প্রতিটি বাক্য যাচাই করুন।',
        structure: [
          'Fragment: Because the cost of housing has risen sharply.',
          'Fixed: Because the cost of housing has risen sharply, many young people cannot buy a home.',
          'Fragment: Which is the main reason for the decline.',
          'Fixed: This is the main reason for the decline.',
        ],
        notes: [
          '-ing রূপ finite verb নয়, তাই The population growing rapidly. একটি fragment।',
        ],
      },
      {
        id: 'm5-r3',
        heading: 'Run-on ও Comma Splice',
        rule: 'দুটি Independent Clause-কে কিছু না বসিয়ে (run-on) বা শুধু একটি কমা দিয়ে (comma splice) জোড়া লাগানো যায় না।',
        whenToUse:
          'যখনই দুটো পূর্ণ আইডিয়া জোড়া দিচ্ছেন, বিশেষ করে however আর therefore-এর আশেপাশে।',
        structure: [
          'Splice: The policy was expensive, it reduced emissions.',
          'Fix 1 - full stop: The policy was expensive. It reduced emissions.',
          'Fix 2 - coordinator: The policy was expensive, but it reduced emissions.',
          'Fix 3 - semicolon: The policy was expensive; it reduced emissions.',
          'Fix 4 - subordinator: Although the policy was expensive, it reduced emissions.',
        ],
        notes: [
          'চারটা সমাধানের অর্থ কিন্তু এক নয়। আপনি যে সম্পর্কটা বোঝাতে চান, সেটাই বেছে নিন।',
        ],
      },
      {
        id: 'm5-r4',
        heading: 'Coordinator বনাম Linking Adverbial',
        rule: 'And, but, so, or, yet ও for কমার পরে দুটি Clause জোড়া দিতে পারে। কিন্তু however, therefore, moreover ও nevertheless পারে না, কারণ এগুলো Adverb, Conjunction নয়।',
        whenToUse: 'যতবার however বা therefore ব্যবহার করবেন, ততবার।',
        structure: [
          'Correct: The cost was high, but the benefits were clear.',
          'Correct: The cost was high. However, the benefits were clear.',
          'Correct: The cost was high; however, the benefits were clear.',
          'Wrong: The cost was high, however the benefits were clear.',
        ],
        table: {
          caption: 'কোন Connector-এর সঙ্গে কী বিরামচিহ্ন',
          headers: ['Connector-এর ধরন', 'উদাহরণ', 'বিরামচিহ্ন'],
          rows: [
            ['Coordinator', 'and, but, so, or, yet', 'clause, + coordinator + clause'],
            ['Subordinator', 'although, because, if', 'Subordinator clause, + main clause'],
            ['Linking adverbial', 'however, therefore, moreover', 'clause. + Adverbial, + clause'],
          ],
        },
        notes: [
          'Linking adverbial-এর আগে full stop-এর জায়গায় semicolon বসতে পারে, কিন্তু কমা কখনোই নয়।',
          'Semicolon দুটো পূর্ণ আর কাছাকাছি অর্থের বাক্য জোড়া দেয়। কোনো এক পাশ পূর্ণ বাক্য না হলে কমা ব্যবহার করুন।',
        ],
      },
    ],
    examples: [
      {
        wrong: 'Many cities face congestion, however few have solved it.',
        right: 'Many cities face congestion; however, few have solved it.',
        note: 'শুধু কমা দিয়ে however দুটি Clause জোড়া দিতে পারে না।',
      },
      {
        wrong: 'Although the scheme was popular, but it was cancelled.',
        right: 'Although the scheme was popular, it was cancelled.',
        note: 'একটা connector-ই যথেষ্ট; although আগেই বৈপরীত্যটা বুঝিয়ে দিয়েছে।',
      },
      {
        wrong: 'Because the system is efficient. It saves money.',
        right: 'Because the system is efficient, it saves money.',
        note: 'প্রথম অংশটা Dependent Clause, অথচ সেটাকে পূর্ণ বাক্যের মতো লেখা হয়েছিল।',
      },
      {
        wrong: 'Online learning is convenient it is also cheaper.',
        right: 'Online learning is convenient, and it is also cheaper.',
        note: 'দুটি Independent Clause জোড়া দিতে কিছু একটা লাগবেই।',
      },
      {
        wrong: 'Working from home has become common; which reduces commuting.',
        right: 'Working from home has become common, which reduces commuting.',
        note: 'Semicolon-এর পরে একটি Independent Clause থাকতে হয়।',
      },
    ],
    mistakes: [
      {
        wrong: 'Technology is advancing rapidly, therefore many jobs will disappear.',
        right: 'Technology is advancing rapidly; therefore, many jobs will disappear.',
        explanation:
          'Therefore একটি linking adverbial, তাই শুধু কমা বসালে comma splice হয়। এখানে full stop দিলেও সমান চলত।',
      },
      {
        wrong: 'The report was published last year. Which caused a public debate.',
        right: 'The report was published last year, which caused a public debate.',
        explanation: 'which দিয়ে শুরু হওয়া Clause একা একটি বাক্য হতে পারে না।',
      },
      {
        wrong: 'More people are cycling, this reduces air pollution.',
        right: 'More people are cycling, which reduces air pollution.',
        explanation:
          'This দিয়ে নতুন একটা Independent Clause শুরু হচ্ছে, তাই শুধু কমা দেওয়ায় comma splice হয়েছে। Relative Clause দিয়ে আইডিয়া দুটো সুন্দরভাবে জোড়া লাগে।',
      },
      {
        wrong: 'Despite the government invested heavily, the problem remained.',
        right: 'Although the government invested heavily, the problem remained.',
        explanation:
          'Despite-এর পরে Noun বা -ing রূপ বসে; পূর্ণ Clause বসাতে হলে although লাগবে। Module 12-তে এই পার্থক্য বিস্তারিত আছে।',
      },
      {
        wrong: 'The city has three main problems; traffic, pollution and housing.',
        right: 'The city has three main problems: traffic, pollution and housing.',
        explanation:
          'তালিকা আনতে colon বসে। Semicolon বসাতে হলে দুই পাশেই পূর্ণ বাক্য লাগত।',
      },
    ],
    keyTakeaways: [
      'প্রতিটি full stop বসানোর আগে দেখুন বাক্যটিতে Subject ও finite Verb আছে কি না।',
      'দুটি Independent Clause জোড়া দিতে full stop, semicolon, coordinator বা subordinator লাগবে।',
      'However ও therefore বসে full stop বা semicolon-এর পরে, কখনো শুধু কমার পরে নয়।',
      'একটি সম্পর্ক বোঝাতে কখনো দুটি connector ব্যবহার করবেন না।',
    ],
  },
]
