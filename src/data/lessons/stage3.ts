import type { Lesson } from '@/types'

export const stage3Lessons: Lesson[] = [
  /* ----------------------------- Module 12 ----------------------------- */
  {
    moduleId: 12,
    intro:
      'Band 7 বা তার বেশি পেতে হলে complex sentence লিখতেই হবে, কিন্তু সেটি কাজে আসে তখনই যখন বাক্যটি নিয়ন্ত্রণে থাকে। প্রায় সব সমস্যার মূলে একটিই অভ্যাস: একই সম্পর্ক দুইবার চিহ্নিত করা, অথবা connector-এর পরে ভুল ধরনের গঠন বসানো।',
    rules: [
      {
        id: 'm12-r1',
        heading: 'জোড়া দেওয়ার তিন উপায়, তিন রকম নিয়ম',
        rule: 'Coordinator দুটি সমমানের Clause জোড়া দেয়। Subordinator একটি Clause-কে অন্যটির উপর নির্ভরশীল করে। আর Linking Adverbial বাক্যের সীমানা পেরিয়ে সংযোগ তৈরি করে।',
        whenToUse: 'যখনই দুটি ধারণা একসঙ্গে আসবে।',
        structure: [
          'Coordinator: Clause, and clause. (and, but, so, or, yet, for, nor)',
          'Subordinator: Although clause, clause. / Clause although clause.',
          'Linking adverbial: Clause. However, clause. / Clause; however, clause.',
        ],
        table: {
          caption: 'একই ধারণা তিনভাবে',
          headers: ['ধরন', 'উদাহরণ'],
          rows: [
            ['Coordinator', 'The scheme was costly, but it worked.'],
            ['Subordinator', 'Although the scheme was costly, it worked.'],
            ['Linking adverbial', 'The scheme was costly. Nevertheless, it worked.'],
          ],
        },
        notes: [
          'একটি সম্পর্কের জন্য এই তিনটির ঠিক একটি ব্যবহার করুন। দুটি ব্যবহার করলেই ভুল।',
        ],
      },
      {
        id: 'm12-r2',
        heading: 'অর্থ অনুযায়ী Subordinator',
        rule: 'যে সম্পর্কটি আপনি বোঝাতে চান, সেটি দেখে Subordinator বাছুন; যেটি মনে পড়ল সেটি বসিয়ে দেবেন না।',
        whenToUse: 'Complex sentence পরিকল্পনা করার সময়।',
        structure: [
          'কারণ: because, since, as',
          'ফলাফল: so that, with the result that',
          'বৈপরীত্য: whereas, while',
          'স্বীকৃতি বা ছাড়: although, though, even though',
          'উদ্দেশ্য: so that, in order that',
          'শর্ত: if, unless, provided that, as long as',
          'সময়: when, while, before, after, until, once, as soon as',
        ],
        table: {
          caption: 'বৈপরীত্য ও স্বীকৃতির পার্থক্য',
          headers: ['সম্পর্ক', 'শব্দ', 'উদাহরণ'],
          rows: [
            ['দুটি বিষয় আলাদা', 'whereas', 'Cities grew, whereas rural areas shrank.'],
            ['অপ্রত্যাশিত ফল', 'although', 'Although funding rose, results did not improve.'],
            ['কারণ', 'because', 'Prices rose because demand outstripped supply.'],
            ['উদ্দেশ্য', 'so that', 'Taxes were cut so that firms could invest.'],
          ],
        },
        notes: [
          'Whereas ব্যবহার হয় দুটি তথ্যের সরাসরি পার্থক্য দেখাতে; আর although বোঝায় দ্বিতীয় তথ্যটি অপ্রত্যাশিত।',
        ],
      },
      {
        id: 'm12-r3',
        heading: 'Despite ও in spite of-এর পরে Noun বসে',
        rule: 'Despite ও in spite of হলো Preposition, তাই এদের পরে Noun, Pronoun বা -ing রূপ বসে, কখনো পূর্ণ Clause নয়।',
        whenToUse: 'যখন দ্বিতীয় একটি Clause ছাড়াই বৈপরীত্য বোঝাতে চান।',
        structure: [
          'despite + noun: Despite the cost, the project continued.',
          'despite + -ing: Despite costing millions, the project continued.',
          'despite the fact that + clause: Despite the fact that it cost millions, the project continued.',
          'although + clause: Although it cost millions, the project continued.',
        ],
        notes: ['despite লিখুন, despite of নয়। আর in spite of তিনটি আলাদা শব্দ।'],
      },
      {
        id: 'm12-r4',
        heading: 'এক সম্পর্কে একটিই Connector',
        rule: 'একই অর্থ বোঝায় এমন Subordinator-এর সঙ্গে Coordinator বা Adverbial জুড়ে দেবেন না।',
        whenToUse: 'although বা because আছে এমন প্রতিটি বাক্যে এটি যাচাই করুন।',
        structure: [
          'Wrong: Although it is expensive, but it is effective.',
          'Right: Although it is expensive, it is effective.',
          'Right: It is expensive, but it is effective.',
          'Wrong: Because of traffic, so people are late.',
          'Right: Because of traffic, people are late.',
        ],
        notes: [
          'IELTS writing-এ complex sentence-এর সবচেয়ে বেশি দেখা এই ভুলটি পুরোপুরি এড়ানো সম্ভব।',
        ],
      },
    ],
    examples: [
      {
        wrong: 'Although the government increased spending, but the problem continued.',
        right: 'Although the government increased spending, the problem continued.',
        note: 'Although আগেই বৈপরীত্য বুঝিয়ে দিয়েছে।',
      },
      {
        wrong: 'Despite of the high cost, the scheme was approved.',
        right: 'Despite the high cost, the scheme was approved.',
        note: 'Despite-এর সঙ্গে কখনো of বসে না।',
      },
      {
        wrong: 'Despite it was raining, the event continued.',
        right: 'Although it was raining, the event continued.',
        note: 'Clause বসাতে হলে despite নয়, although লাগে।',
      },
      {
        wrong: 'Because the roads are congested, therefore commuting takes longer.',
        right: 'Because the roads are congested, commuting takes longer.',
        note: 'Because আর therefore দুটোই কারণ বোঝায়; একটিই যথেষ্ট।',
      },
      {
        wrong: 'Urban areas are growing, while rural areas are shrinking, however this is not universal.',
        right: 'Urban areas are growing while rural areas are shrinking; however, this pattern is not universal.',
        note: 'However-এর আগে semicolon বা full stop লাগে।',
      },
    ],
    mistakes: [
      {
        wrong: 'Even though renewable energy is clean, but it remains expensive.',
        right: 'Even though renewable energy is clean, it remains expensive.',
        explanation: 'Even though একটি Subordinator, তাই এর সঙ্গে but বসতে পারে না।',
      },
      {
        wrong: 'In spite of the traffic was heavy, we arrived on time.',
        right: 'In spite of the heavy traffic, we arrived on time.',
        explanation: 'In spite of-এর পরে Noun phrase বসে, Clause নয়।',
      },
      {
        wrong: 'The policy failed, because of poor planning and it was underfunded.',
        right: 'The policy failed because it was poorly planned and underfunded.',
        explanation:
          'Because of-এর পরে Noun বসে আর because-এর পরে Clause; দুটি মিশিয়ে ফেললে বাক্যটি ভেঙে যায়।',
      },
      {
        wrong: 'Whereas some people prefer cities.',
        right: 'Whereas some people prefer cities, others prefer the countryside.',
        explanation: 'Whereas দিয়ে শুরু হওয়া Clause নির্ভরশীল, তাই একা দাঁড়াতে পারে না।',
      },
      {
        wrong: 'Moreover, that the cost is high makes the scheme unpopular, and however it continues.',
        right: 'The high cost makes the scheme unpopular. It continues nonetheless.',
        explanation:
          'একের পর এক connector বসালে যুক্তি ঢাকা পড়ে যায়। এক বাক্যে একটি স্পষ্ট সম্পর্ক রাখলে পড়তে ভালো লাগে।',
      },
    ],
    keyTakeaways: [
      'একটি সম্পর্ক, একটিই connector।',
      'Although + clause; despite + noun বা -ing।',
      'Whereas দিয়ে দুটি তথ্যের পার্থক্য, আর although দিয়ে অপ্রত্যাশিত ফল বোঝায়।',
      'However ও therefore-এর আগে full stop বা semicolon লাগে।',
    ],
  },

  /* ----------------------------- Module 13 ----------------------------- */
  {
    moduleId: 13,
    intro:
      'Relative Clause (সম্পর্কবাচক উপবাক্য) academic writing-এর সবচেয়ে নির্ভরযোগ্য জটিল গঠন, কারণ এটি নতুন বাক্য শুরু না করেই Noun-এর সঙ্গে বাড়তি তথ্য জুড়ে দেয়। দুটি বিষয়ের উপর এর সাফল্য নির্ভর করে: সঠিক Pronoun বাছা, আর তথ্যটি অপরিহার্য না বাড়তি তা বোঝা।',
    rules: [
      {
        id: 'm13-r1',
        heading: 'সঠিক Relative Pronoun বাছা',
        rule: 'Pronoun বাছা হয় Noun-টি কী, তার উপর ভিত্তি করে; বাক্যে তার ভূমিকা দেখে নয়।',
        whenToUse: 'যখনই কোনো Noun-এর সঙ্গে একটি Clause জুড়ে দেবেন।',
        structure: [
          'who - মানুষ: the students who attended',
          'which - বস্তু: the policy which was introduced',
          'that - মানুষ বা বস্তু, শুধু defining clause-এ',
          'whose - অধিকার: the company whose profits fell',
          'where - স্থান: the city where he was born',
          'when - সময়: the year when the law changed',
        ],
        notes: [
          'Non-defining clause-এ that বসে না: The report, that was published in 2020,... ভুল।',
          'Which পুরো একটি Clause-কেও নির্দেশ করতে পারে: Sales fell, which worried investors.',
        ],
      },
      {
        id: 'm13-r2',
        heading: 'Defining বনাম Non-defining',
        rule: 'Defining clause বুঝিয়ে দেয় ঠিক কোনটির কথা বলছেন এবং এতে কমা বসে না। Non-defining clause বাড়তি তথ্য দেয় এবং দুই পাশে কমা বসে।',
        whenToUse: 'কমা বসানোর আগেই সিদ্ধান্ত নিন, পরে নয়।',
        structure: [
          'Defining: Students who study abroad often become more independent. (কেবল ওই শিক্ষার্থীরা)',
          'Non-defining: My brother, who studies abroad, visits twice a year. (বাড়তি তথ্য)',
          'Defining: The report that the committee published is controversial.',
          'Non-defining: The report, which runs to 300 pages, is controversial.',
        ],
        table: {
          caption: 'দুই ধরনের পার্থক্য',
          headers: ['বৈশিষ্ট্য', 'Defining', 'Non-defining'],
          rows: [
            ['কমা', 'না', 'হ্যাঁ, দুই পাশেই'],
            ['that ব্যবহার করা যায়', 'হ্যাঁ', 'না'],
            ['Pronoun বাদ দেওয়া যায়', 'হ্যাঁ, যদি এটি Object হয়', 'না'],
            ['তথ্যের ধরন', 'অপরিহার্য', 'বাড়তি'],
          ],
        },
        notes: [
          'কমা অর্থই বদলে দেয়। Workers who were unskilled lost their jobs মানে শুধু অদক্ষরাই চাকরি হারিয়েছে; আর Workers, who were unskilled, lost their jobs মানে তারা সবাই অদক্ষ ছিল।',
        ],
      },
      {
        id: 'm13-r3',
        heading: 'দ্বিতীয়বার Pronoun বসাবেন না',
        rule: 'Relative Pronoun নিজেই Subject বা Object-এর জায়গা পূরণ করে ফেলে, তাই আবার আরেকটি Pronoun বসানো যাবে না।',
        whenToUse: 'আপনার লেখা প্রতিটি Relative Clause যাচাই করুন।',
        structure: [
          'Wrong: The policy which it was introduced reduced pollution.',
          'Right: The policy which was introduced reduced pollution.',
          'Wrong: The book that I read it was useful.',
          'Right: The book that I read was useful.',
        ],
      },
      {
        id: 'm13-r4',
        heading: 'Preposition + which এবং Clause সংক্ষিপ্ত করা',
        rule: 'আনুষ্ঠানিক লেখায় Preposition-টি which বা whom-এর আগে সরিয়ে আনা যায়। আর be যুক্ত defining clause অনেক সময় সংক্ষিপ্ত করা যায়।',
        whenToUse:
          'Preposition সামনে আনা আনুষ্ঠানিক লেখায় মানায়। আর পূর্ণ গঠন ভালোভাবে রপ্ত হলে সংক্ষিপ্তকরণ বাক্যকে আঁটসাঁট করে।',
        structure: [
          'Informal: the problem which we are dealing with',
          'Formal: the problem with which we are dealing',
          'the rate at which temperatures are rising',
          'the extent to which this is true',
          'সংক্ষিপ্তকরণ: The students who are enrolled on the course -> The students enrolled on the course',
          'সংক্ষিপ্তকরণ: The report which was published in 2020 -> The report published in 2020',
          'সংক্ষিপ্তকরণ: People who live in cities -> People living in cities',
        ],
        notes: [
          'শুধু be যুক্ত defining clause, অথবা সক্রিয় -ing অর্থের clause সহজে সংক্ষিপ্ত হয়।',
          'Module 17-এ সংক্ষিপ্তকরণ আরও বিস্তারিত আছে, সেই সঙ্গে dangling modifier-এর ফাঁদও।',
        ],
      },
    ],
    examples: [
      {
        wrong: 'The policy which it was introduced in 2015 reduced pollution.',
        right: 'The policy which was introduced in 2015 reduced pollution.',
        note: 'Which নিজেই এখানে Subject।',
      },
      {
        wrong: 'My hometown which is in the north has grown rapidly.',
        right: 'My hometown, which is in the north, has grown rapidly.',
        note: 'অনন্য একটি Noun-এর সঙ্গে non-defining clause বসে, তাই কমা লাগে।',
      },
      {
        wrong: 'The researcher that her study was published won an award.',
        right: 'The researcher whose study was published won an award.',
        note: 'অধিকার বোঝাতে whose বসে।',
      },
      {
        wrong: 'This is the village where I grew up in.',
        right: 'This is the village where I grew up.',
        note: 'Where-এর ভেতরেই Preposition-টি আছে।',
      },
      {
        wrong: 'The report, that was released yesterday, criticises the plan.',
        right: 'The report, which was released yesterday, criticises the plan.',
        note: 'Non-defining clause-এ that ব্যবহার করা যায় না।',
      },
    ],
    mistakes: [
      {
        wrong: 'Students which study hard usually succeed.',
        right: 'Students who study hard usually succeed.',
        explanation: 'Which বস্তুর জন্য; মানুষের ক্ষেত্রে who বা that বসে।',
      },
      {
        wrong: 'The company, who employs 2,000 people, is expanding.',
        right: 'The company, which employs 2,000 people, is expanding.',
        explanation: 'প্রতিষ্ঠান একটি বস্তু, তাই এর সঙ্গে which বসে।',
      },
      {
        wrong: 'There are many reasons why people move to cities, which it is a global trend.',
        right: 'There are many reasons why people move to cities, a trend seen worldwide.',
        explanation:
          'বাড়তি it তো ভুল বটেই, এখানে দ্বিতীয় একটি which-এর চেয়ে apposition অনেক বেশি স্পষ্ট।',
      },
      {
        wrong: 'The period which the economy grew fastest was the 1990s.',
        right: 'The period in which the economy grew fastest was the 1990s.',
        explanation:
          'Clause-টিতে একটি Preposition দরকার: in which, অথবা সহজভাবে when।',
      },
      {
        wrong: 'People live in rural areas often have limited access to healthcare.',
        right: 'People living in rural areas often have limited access to healthcare.',
        explanation:
          'সংক্ষিপ্ত Clause-এ -ing রূপ লাগে; যেভাবে লেখা হয়েছিল, তাতে বাক্যে দুটি finite verb হয়ে গিয়েছিল।',
      },
    ],
    keyTakeaways: [
      'মানুষের জন্য who, বস্তুর জন্য which, আর অধিকারের জন্য whose।',
      'Clause যদি চিনিয়ে দেয় তবে কমা নেই; শুধু বাড়তি তথ্য দিলে কমা আছে।',
      'Non-defining clause-এ that সম্পূর্ণ নিষিদ্ধ।',
      'Relative Pronoun-এর পরে কখনো Subject-টি আবার লিখবেন না।',
    ],
  },

  /* ----------------------------- Module 14 ----------------------------- */
  {
    moduleId: 14,
    intro:
      'Noun Clause হলো এমন একটি পুরো Clause যা Noun-এর কাজ করে। এর মাধ্যমেই আপনি অন্যের যুক্তি তুলে ধরেন, দাবি মূল্যায়ন করেন এবং essay-র কাঠামো তৈরি করেন। এখানে একটি ভুলই সবচেয়ে বেশি হয়: embedded question-এর ভেতরে প্রশ্নের শব্দক্রম রেখে দেওয়া।',
    rules: [
      {
        id: 'm14-r1',
        heading: 'That-clause (that দিয়ে গঠিত উপবাক্য)',
        rule: 'That-clause কোনো reporting verb-এর Object হতে পারে, আবার Adjective বা Noun-এর পরিপূরকও হতে পারে।',
        whenToUse: 'যখন কেউ কী যুক্তি দেন, কী দেখান বা কী বিশ্বাস করেন তা জানাবেন।',
        structure: [
          'Object হিসেবে: Critics argue that the policy is ineffective.',
          'Adjective-এর পরে: It is clear that demand has fallen.',
          'Noun-এর পরে: the claim that technology destroys jobs',
          'Subject হিসেবে (কম ব্যবহৃত, ভারী): That the policy failed is undeniable.',
        ],
        notes: [
          'অনানুষ্ঠানিক লেখায় that বাদ দেওয়া যায়, তবে academic লেখায় রাখা ভালো।',
          'প্রচলিত reporting verb: argue, claim, suggest, show, indicate, demonstrate, reveal, conclude, maintain.',
        ],
      },
      {
        id: 'm14-r2',
        heading: 'Whether ও if clause',
        rule: 'হ্যাঁ-না ধরনের বিকল্প বোঝাতে whether ব্যবহার করুন। আনুষ্ঠানিক লেখায় if-এর চেয়ে whether ভালো, আর Preposition-এর পরে বা to-এর আগে whether বাধ্যতামূলক।',
        whenToUse: 'যখন Clause-টি একটি খোলা প্রশ্ন বোঝায়।',
        structure: [
          'It is unclear whether the scheme will succeed.',
          'The debate over whether tuition should be free continues.',
          'They must decide whether to expand or consolidate.',
          'whether or not: It will proceed whether or not funding is approved.',
        ],
        notes: ['the question of if লেখা যায় না; Preposition-এর পরে শুধু whether চলে।'],
      },
      {
        id: 'm14-r3',
        heading: 'Embedded question-এ statement-এর শব্দক্রম থাকে',
        rule: 'বড় একটি বাক্যের ভেতরে ঢুকলে প্রশ্ন statement-এ পরিণত হয়: কোনো inversion থাকে না, সহায়ক do-ও থাকে না।',
        whenToUse: 'wonder, explain, know, understand, show, examine ও question-এর পরে।',
        structure: [
          'Direct: Why do people migrate?',
          'Embedded: It is unclear why people migrate.',
          'Direct: How can governments reduce waste?',
          'Embedded: The report explains how governments can reduce waste.',
          'Direct: Is the policy effective?',
          'Embedded: Researchers question whether the policy is effective.',
        ],
        table: {
          caption: 'Direct থেকে Embedded',
          headers: ['Direct question', 'Embedded রূপ'],
          rows: [
            ['What does it cost?', 'how much it costs'],
            ['Where did they go?', 'where they went'],
            ['Why is it rising?', 'why it is rising'],
            ['Can we measure it?', 'whether we can measure it'],
          ],
        },
        notes: [
          'do, does ও did পুরোপুরি বাদ দিন এবং মূল Verb-টিকে তার স্বাভাবিক রূপে ফিরিয়ে আনুন।',
        ],
      },
      {
        id: 'm14-r4',
        heading: 'Extraposition: Clause-কে শেষে সরিয়ে দেওয়া',
        rule: 'Subject-এর জায়গায় that-clause বা to-infinitive বসলে বাক্যটি ভারী হয়ে যায়। Clause-টি শেষে সরিয়ে শুরুতে it বসান।',
        whenToUse: 'Topic sentence ও মূল্যায়নমূলক বাক্যে।',
        structure: [
          'Heavy: That the climate is changing is now undisputed.',
          'Extraposed: It is now undisputed that the climate is changing.',
          'Heavy: To measure happiness accurately is difficult.',
          'Extraposed: It is difficult to measure happiness accurately.',
          'কাজে লাগে এমন গঠন: It is clear / likely / apparent / widely accepted / worth noting that...',
        ],
        notes: [
          'এটি সেই একই end-weight নীতি, যা Module 20-তে পুরো অনুচ্ছেদের জন্য দেখানো হয়েছে।',
        ],
      },
    ],
    examples: [
      {
        wrong: 'I wonder why do people move to cities.',
        right: 'I wonder why people move to cities.',
        note: 'Embedded question-এ statement-এর শব্দক্রম থাকে।',
      },
      {
        wrong: 'The study examines how does air pollution affect health.',
        right: 'The study examines how air pollution affects health.',
        note: 'does বাদ দিয়ে মূল Verb-এ -s ফিরিয়ে আনুন।',
      },
      {
        wrong: 'It is not clear that or not the policy will work.',
        right: 'It is not clear whether the policy will work.',
        note: 'হ্যাঁ-না বিকল্পে whether বসে।',
      },
      {
        wrong: 'That the government should act is obvious to everyone who reads the data.',
        right: 'It is obvious to everyone who reads the data that the government should act.',
        note: 'Extraposition করলে ভারী Clause-টি শেষে চলে যায়।',
      },
      {
        wrong: 'Researchers have discussed about whether the method is reliable.',
        right: 'Researchers have discussed whether the method is reliable.',
        note: 'Discuss-এর পরে কোনো Preposition বসে না।',
      },
    ],
    mistakes: [
      {
        wrong: 'Nobody knows what will be the outcome.',
        right: 'Nobody knows what the outcome will be.',
        explanation:
          'Embedded clause-এ Subject আগে ও Verb পরে থাকে, তাই the outcome আগে বসবে।',
      },
      {
        wrong: 'The question of if students should pay fees is controversial.',
        right: 'The question of whether students should pay fees is controversial.',
        explanation: 'Preposition-এর পরে কেবল whether বসতে পারে।',
      },
      {
        wrong: 'It is argued the technology has reduced employment.',
        right: 'It is argued that technology has reduced employment.',
        explanation:
          'আনুষ্ঠানিক লেখায় that রাখুন; এটি পাঠককে Clause-এর সীমানা বুঝিয়ে দেয়।',
      },
      {
        wrong: 'Researchers want to know that why the figure fell.',
        right: 'Researchers want to know why the figure fell.',
        explanation: 'wh-শব্দের সঙ্গে that বসাবেন না; একটি connector-ই যথেষ্ট।',
      },
      {
        wrong: 'It is depends on whether funding is available.',
        right: 'It depends on whether funding is available.',
        explanation:
          'Extraposed it is বসে Adjective-এর আগে, কোনো পূর্ণ Verb-এর আগে নয়।',
      },
    ],
    keyTakeaways: [
      'অন্যের যুক্তি জানাতে verb + that-clause ব্যবহার করুন।',
      'হ্যাঁ-না বিকল্পে whether বসে, আর Preposition-এর পরে সবসময় whether।',
      'Embedded question-এ statement-এর শব্দক্রম থাকে, সহায়ক do থাকে না।',
      'ভারী Subject Clause শেষে সরিয়ে দিয়ে বাক্য শুরু করুন it দিয়ে।',
    ],
  },

  /* ----------------------------- Module 15 ----------------------------- */
  {
    moduleId: 15,
    intro:
      'Conditional হলো যুক্তি উপস্থাপনের ব্যাকরণ। সমাধান বিষয়ক অনুচ্ছেদ আসলে প্রায়ই ছদ্মবেশী conditional: যদি এটি করা হতো, তাহলে ওটি ঘটত। তিনটি গঠন দিয়েই এই কাজের প্রায় পুরোটা চলে, আর মূল নিয়মটি সহজ: if-clause-এ will বসে না।',
    rules: [
      {
        id: 'm15-r1',
        heading: 'কাজে লাগে এমন তিনটি Conditional',
        rule: 'Zero conditional সাধারণ সত্য বোঝায়, First conditional সম্ভাব্য ভবিষ্যৎ বোঝায়, আর Second conditional কাল্পনিক অবস্থা বোঝায়।',
        whenToUse: 'তথ্যের জন্য zero, প্রস্তাবের জন্য first, আর কল্পনার জন্য second।',
        structure: [
          'Zero: If + present simple, present simple. If water reaches 100 degrees, it boils.',
          'First: If + present simple, will + base. If governments invest in rail, congestion will fall.',
          'Second: If + past simple, would + base. If governments invested in rail, congestion would fall.',
        ],
        table: {
          caption: 'কোনটি কখন ব্যবহার করবেন',
          headers: ['ধরন', 'অর্থ', 'উদাহরণ'],
          rows: [
            ['Zero', 'সবসময় সত্য', 'If demand rises, prices increase.'],
            ['First', 'বাস্তবসম্মত ভবিষ্যৎ', 'If demand rises, prices will increase.'],
            ['Second', 'কাল্পনিক বা কম সম্ভাব্য', 'If demand rose, prices would increase.'],
          ],
        },
        notes: [
          'Second conditional অতীত নিয়ে নয়; এটি কল্পিত বর্তমান বা ভবিষ্যৎ নিয়ে।',
          'আনুষ্ঠানিক লেখায় সব পুরুষের জন্যই were ব্যবহার করা হয়: If the policy were introduced...',
        ],
      },
      {
        id: 'm15-r2',
        heading: 'If-clause-এ will বসে না',
        rule: 'শর্তের অংশে ভবিষ্যতের অর্থ বহন করে Present simple। Will শুধু ফলাফলের Clause-এ বসে।',
        whenToUse: 'আপনার লেখা প্রতিটি first conditional-এ।',
        structure: [
          'Wrong: If the government will reduce taxes, businesses will invest.',
          'Right: If the government reduces taxes, businesses will invest.',
          'Right: If the government were to reduce taxes, businesses would invest.',
        ],
        notes: [
          'when, as soon as, until ও before-এর ক্ষেত্রেও একই নিয়ম: When prices rise, demand will fall.',
        ],
      },
      {
        id: 'm15-r3',
        heading: 'Unless, provided that, as long as (শর্তবাচক শব্দ)',
        rule: 'Unless মানে except if, অর্থাৎ এর ভেতরেই নেতিবাচক অর্থ আছে। Provided that ও as long as এমন শর্ত বোঝায় যা পূরণ হতেই হবে।',
        whenToUse: 'Conditional-এ বৈচিত্র্য আনতে এবং প্রস্তাবের সীমা বেঁধে দিতে।',
        structure: [
          'Unless action is taken, emissions will continue to rise.',
          'The scheme will succeed provided that it is properly funded.',
          'Remote work is effective as long as teams communicate regularly.',
          'In the event of a shortage, prices would rise.',
        ],
        notes: [
          'unless... not লিখবেন না: Unless the government does not act একটি দ্বৈত নেতিবাচক গঠন।',
          'Provided that ও as long as first conditional-এর মতোই present tense নেয়।',
        ],
      },
      {
        id: 'm15-r4',
        heading: 'যুক্তিতে Conditional',
        rule: 'যে প্রস্তাবকে আপনি বাস্তবসম্মত মনে করেন তার জন্য first conditional, আর যেটিকে কাল্পনিক হিসেবে দেখাতে চান তার জন্য second conditional ব্যবহার করুন। আপনার বাছাই-ই আপনার অবস্থান জানিয়ে দেয়।',
        whenToUse: 'সমাধান ও মূল্যায়ন বিষয়ক অনুচ্ছেদে।',
        structure: [
          'বাস্তবসম্মত প্রস্তাব: If schools introduced financial education, students would manage money better.',
          'নিষ্ক্রিয়তার ফল: Unless cities expand public transport, congestion will worsen.',
          'সীমা স্বীকার করা: Even if funding were doubled, the problem would persist.',
        ],
        notes: [
          'Mixed ও third conditional কাজের, তবে ঐচ্ছিক। প্রথম তিনটিতে নির্ভুলতা অনেক বেশি গুরুত্বপূর্ণ।',
        ],
      },
    ],
    examples: [
      {
        wrong: 'If the government will invest more, the problem will be solved.',
        right: 'If the government invests more, the problem will be solved.',
        note: 'If-clause-এ Present simple বসে।',
      },
      {
        wrong: 'If people would recycle more, less waste would go to landfill.',
        right: 'If people recycled more, less waste would go to landfill.',
        note: 'Second conditional-এর if-clause-এ Past simple বসে।',
      },
      {
        wrong: 'Unless we do not act now, the situation will worsen.',
        right: 'Unless we act now, the situation will worsen.',
        note: 'Unless-এর অর্থই তো if not।',
      },
      {
        wrong: 'If I was the minister, I would increase funding.',
        right: 'If I were the minister, I would increase funding.',
        note: 'আনুষ্ঠানিক কাল্পনিক গঠনে were বসে।',
      },
      {
        wrong: 'The plan will work provided that it will receive support.',
        right: 'The plan will work provided that it receives support.',
        note: 'Provided that if-এর মতোই আচরণ করে।',
      },
    ],
    mistakes: [
      {
        wrong: 'If companies would pay higher wages, employees will be more motivated.',
        right: 'If companies paid higher wages, employees would be more motivated.',
        explanation:
          'বাক্যটিতে দুটি গঠন মিশে গেছে। হয় past simple-এর সঙ্গে would, নয়তো present simple-এর সঙ্গে will রাখুন।',
      },
      {
        wrong: 'When the government will introduce the law, protests will begin.',
        right: 'When the government introduces the law, protests will begin.',
        explanation: 'Time clause-এও if-clause-এর মতোই will বসে না।',
      },
      {
        wrong: 'If education would be free, more people could attend university.',
        right: 'If education were free, more people could attend university.',
        explanation: 'শর্তের অংশে would বসে না; কল্পনা বোঝায় were।',
      },
      {
        wrong: 'Unless if the policy changes, the issue will remain.',
        right: 'Unless the policy changes, the issue will remain.',
        explanation: 'Unless ও if একসঙ্গে বসতে পারে না।',
      },
      {
        wrong: 'If the scheme was introduced last year, results will appear soon.',
        right: 'If the scheme was introduced last year, results should appear soon.',
        explanation:
          'বাস্তব অতীত শর্তের সঙ্গে সরাসরি ভবিষ্যদ্বাণী নয়, বরং প্রত্যাশা বোঝানো modal মানানসই।',
      },
    ],
    keyTakeaways: [
      'তথ্যের জন্য zero, বাস্তবসম্মত ভবিষ্যতের জন্য first, কল্পনার জন্য second।',
      'If-clause বা time clause-এ কখনো will বসাবেন না।',
      'Unless-এর অর্থই if not, তাই আলাদা করে আর নেতিবাচক শব্দ যোগ করবেন না।',
      'আপনি কোন conditional বাছলেন, তা থেকেই পাঠক বোঝেন প্রস্তাবটিকে আপনি কতটা বাস্তবসম্মত ভাবছেন।',
    ],
  },

  /* ----------------------------- Module 16 ----------------------------- */
  {
    moduleId: 16,
    intro:
      'Parallelism হলো সেই নিয়ম, যেখানে and, or ও but দিয়ে জোড়া দেওয়া অংশগুলোর গঠন একই রকম হতে হয়। এর কাজটা নীরব: ঠিক থাকলে কেউ খেয়ালই করে না, আর ভুল হলে একটি উচ্চাকাঙ্ক্ষী বাক্য শেষ অংশে এসে ভেঙে পড়ে।',
    rules: [
      {
        id: 'm16-r1',
        heading: 'তালিকার সব অংশের গঠন এক রাখুন',
        rule: 'জোড়া দেওয়া তালিকার প্রতিটি অংশ একই ধরনের একক হতে হবে: সবগুলো Noun, সবগুলো -ing রূপ, সবগুলো infinitive, অথবা সবগুলো finite verb।',
        whenToUse: 'দুই বা ততোধিক আইটেমের তালিকা আছে এমন প্রতিটি বাক্যে।',
        structure: [
          'সবগুলো finite verb: The policy reduces pollution, saves money and improves health.',
          'সবগুলো -ing রূপ: The scheme involves building schools, training teachers and funding equipment.',
          'সবগুলো Noun: The report examines cost, feasibility and public support.',
          'সবগুলো infinitive: The aim is to reduce waste, to cut costs and to raise awareness.',
        ],
        notes: [
          'Infinitive-এর ক্ষেত্রে হয় প্রতিটি আইটেমে to লিখুন, নয়তো শুধু প্রথমটিতে। এলোমেলোভাবে বদলাবেন না।',
        ],
      },
      {
        id: 'm16-r2',
        heading: 'জোড়ায় বসা Connector',
        rule: 'Correlative জোড়াগুলোর দুই পাশে একই ধরনের গঠন বসতে হবে।',
        whenToUse: 'not only...but also, both...and, either...or এবং neither...nor-এর সঙ্গে।',
        structure: [
          'both + X and + X: both in schools and in workplaces',
          'not only + X but also + X: not only cheaper but also faster',
          'either + X or + X: either raising taxes or cutting spending',
          'neither + X nor + X: neither practical nor affordable',
        ],
        table: {
          caption: 'জোড়ার ভারসাম্য রক্ষা',
          headers: ['ভুল', 'সঠিক'],
          rows: [
            ['not only cheap but also it saves time', 'not only cheap but also time-saving'],
            ['both for students and teachers', 'both for students and for teachers'],
            ['either by taxing or regulation', 'either by taxation or by regulation'],
          ],
        },
        notes: ['not only-এর পরে যে পদ বসবে, but also-এর পরেও সেই একই পদ বসতে হবে।'],
      },
      {
        id: 'm16-r3',
        heading: 'তুলনায় Parallelism',
        rule: 'তুলনার দুই পাশে তুলনাযোগ্য একই ধরনের একক থাকতে হবে।',
        whenToUse: 'than, as...as এবং সংখ্যার তুলনায়।',
        structure: [
          'Wrong: The population of Japan is larger than Canada.',
          'Right: The population of Japan is larger than that of Canada.',
          'Right: Japan has a larger population than Canada does.',
          'Wrong: Reading is more useful than to watch television.',
          'Right: Reading is more useful than watching television.',
        ],
        notes: [
          'Head noun আবার বোঝাতে একবচনে that of আর বহুবচনে those of ব্যবহার করুন।',
        ],
      },
      {
        id: 'm16-r4',
        heading: 'ভাগ করে নেওয়া শব্দ যেন সবার সঙ্গে খাটে',
        rule: 'তালিকার সব আইটেমে যদি একটি Preposition, Article বা Auxiliary ভাগ করে ব্যবহার করা হয়, তবে সেটি প্রতিটি আইটেমের সঙ্গে মানানসই হতে হবে। না হলে সঠিকটি আলাদাভাবে লিখুন।',
        whenToUse: 'লম্বা তালিকায়, যেখানে একটি Preposition দিয়ে অনেক কাজ করানো হচ্ছে।',
        structure: [
          'Wrong: The policy is interested in and committed to reform. (দুই পাশেই মেলে কি না যাচাই করুন)',
          'Right: The policy shows an interest in and a commitment to reform.',
          'Wrong: Students can apply for and benefit from the scheme at any time.',
          'Right: Students can apply for the scheme and benefit from it at any time.',
        ],
      },
    ],
    examples: [
      {
        wrong: 'The policy reduces pollution, saving money and to improve health.',
        right: 'The policy reduces pollution, saves money and improves health.',
        note: 'পরপর তিনটি finite verb।',
      },
      {
        wrong: 'She enjoys reading, to travel and cooking.',
        right: 'She enjoys reading, travelling and cooking.',
        note: 'Enjoy-এর পরে -ing বসে, তাই প্রতিটি আইটেমই -ing রূপে হতে হবে।',
      },
      {
        wrong: 'The city is not only crowded but also it is expensive.',
        right: 'The city is not only crowded but also expensive.',
        note: 'জোড়ার দুই পাশেই Adjective।',
      },
      {
        wrong: 'The climate of Spain is warmer than Norway.',
        right: 'The climate of Spain is warmer than that of Norway.',
        note: 'Climate-এর সঙ্গে climate-এর তুলনা করুন, দেশের সঙ্গে নয়।',
      },
      {
        wrong: 'Governments should invest in education, improving healthcare and to build housing.',
        right: 'Governments should invest in education, improve healthcare and build housing.',
        note: 'should-এর পরে তিনটি আইটেমই এখন bare infinitive।',
      },
    ],
    mistakes: [
      {
        wrong: 'The course teaches students how to write reports, giving presentations and research skills.',
        right: 'The course teaches students how to write reports, give presentations and conduct research.',
        explanation: 'এখন তিনটি আইটেমই how to-এর পরে bare infinitive হিসেবে বসেছে।',
      },
      {
        wrong: 'He is responsible for planning, to organise events and the budget.',
        right: 'He is responsible for planning events, organising budgets and managing staff.',
        explanation: 'for একটি Preposition, তাই এর পরের প্রতিটি আইটেম -ing রূপে হতে হবে।',
      },
      {
        wrong: 'Neither the cost nor the benefits was clear.',
        right: 'Neither the cost nor the benefits were clear.',
        explanation:
          'neither...nor-এর ক্ষেত্রে Verb মেলে কাছের Subject-এর সঙ্গে, যা এখানে বহুবচন।',
      },
      {
        wrong: 'The report is both detailed and it is well researched.',
        right: 'The report is both detailed and well researched.',
        explanation: 'Both...and দুটি Adjective জোড়া দেয়, Adjective আর Clause নয়।',
      },
      {
        wrong: 'Wages in the north are lower than the south.',
        right: 'Wages in the north are lower than those in the south.',
        explanation: 'Those in মানে wages in, যা তুলনাটিকে ভারসাম্যপূর্ণ রাখে।',
      },
    ],
    keyTakeaways: [
      'and বা or দিয়ে জোড়া দেওয়া আইটেমগুলোর গঠন এক হতে হবে।',
      'not only-এর পরে যা বসে, but also-এর পরেও তাই বসবে।',
      'তুলনা ভারসাম্যপূর্ণ রাখতে that of ও those of ব্যবহার করুন।',
      'তালিকার প্রতিটি আইটেম শুরুর অংশের সঙ্গে জুড়ে একবার করে পড়ে দেখুন।',
    ],
  },

  /* ----------------------------- Module 17 ----------------------------- */
  {
    moduleId: 17,
    intro:
      'Participle clause দুটি Clause-কে একটিতে মিলিয়ে দেয় এবং এটি সত্যিকারের ভাষাদক্ষতার প্রমাণ। তবে এতে একটি ঝুঁকি আছে, আর সেটি গুরুতর: participle-এর উহ্য কর্তা যদি মূল Clause-এর Subject না হয়, তাহলে বাক্যটি এমন কিছু বলে ফেলে যা আপনি বোঝাতে চাননি।',
    rules: [
      {
        id: 'm17-r1',
        heading: 'Relative Clause সংক্ষিপ্ত করা',
        rule: 'Defining relative clause থেকে Pronoun ও be বাদ দেওয়া যায়। Active অর্থের Clause হয় -ing, আর Passive অর্থের Clause হয় -ed।',
        whenToUse: 'তথ্য না হারিয়ে Noun phrase আঁটসাঁট করতে।',
        structure: [
          'who are living in cities -> living in cities',
          'which was published in 2020 -> published in 2020',
          'that is causing concern -> causing concern',
          'who have been affected -> affected',
        ],
        table: {
          caption: 'পূর্ণ ও সংক্ষিপ্ত রূপ',
          headers: ['পূর্ণ Clause', 'সংক্ষিপ্ত রূপ'],
          rows: [
            ['People who live in rural areas', 'People living in rural areas'],
            ['The report which was issued last week', 'The report issued last week'],
            ['Students who are enrolled on the course', 'Students enrolled on the course'],
            ['Factors which affect performance', 'Factors affecting performance'],
          ],
        },
      },
      {
        id: 'm17-r2',
        heading: 'Adverbial Participle Clause (ক্রিয়াবিশেষণমূলক participle উপবাক্য)',
        rule: 'বাক্যের শুরুতে বা শেষে বসা -ing clause সময়, কারণ বা ফলাফল বোঝাতে পারে। এর উহ্য কর্তা হিসেবে ধরা হয় মূল Clause-এর Subject-কে।',
        whenToUse: 'একই কর্তার দুটি কাজ জোড়া দিতে।',
        structure: [
          'সময়: Having completed the survey, the researchers analysed the data.',
          'কারণ: Facing rising costs, many firms reduced staff.',
          'ফলাফল: Demand fell sharply, causing prices to drop.',
          'Passive: Introduced in 2015, the scheme has halved waiting times.',
        ],
        notes: [
          'Having + past participle বোঝায় কাজটি মূল Verb-এর আগেই শেষ হয়েছে।',
          'বাক্যের শেষে বসা ফলাফলবাচক -ing clause Task 1-এ খুব কাজের: The figure peaked in 2008, reaching 90 million.',
        ],
      },
      {
        id: 'm17-r3',
        heading: 'Dangling Modifier (ঝুলন্ত বিশেষণ অংশ)',
        rule: 'Participle-এর কাজটি যে করছে, মূল Clause-এর Subject-কেই সেই ব্যক্তি বা বস্তু হতে হবে। তা না হলে modifier-টি ঝুলে থাকে।',
        whenToUse: '-ing বা -ed দিয়ে শুরু হওয়া প্রতিটি বাক্য যাচাই করুন।',
        structure: [
          'Dangling: Walking to school, the rain started.',
          'Fixed: Walking to school, I was caught in the rain.',
          'Fixed: While I was walking to school, it started to rain.',
          'Dangling: Having studied the data, the conclusion was obvious.',
          'Fixed: Having studied the data, the researchers reached an obvious conclusion.',
        ],
        notes: [
          'সবচেয়ে দ্রুত সমাধান হলো Subordinator বসিয়ে পূর্ণ Clause-এ ফিরে যাওয়া।',
          'এই ভুল ধরা কঠিন, কারণ বাক্যটি শুনতে সাবলীল লাগে। পরীক্ষা করুন এই প্রশ্নে: -ing কাজটি আসলে কে করছে?',
        ],
      },
      {
        id: 'm17-r4',
        heading: 'Infinitive দিয়ে Noun-এর পরিচয় বাড়ানো',
        rule: 'Noun-এর পরে বসা to-infinitive উদ্দেশ্য বা করণীয় কাজ বোঝায়।',
        whenToUse: 'উদ্দেশ্যবাচক Relative Clause সংক্ষিপ্ত করতে।',
        structure: [
          'the best way to reduce emissions',
          'the first country to introduce the ban',
          'a decision to be made by the committee',
          'measures to be taken in the next decade',
        ],
        notes: [
          'Noun-টি যদি কাজের শিকার হয়, তবে passive infinitive বসান: the issues to be addressed.',
        ],
      },
    ],
    examples: [
      {
        wrong: 'Walking to school, the rain started.',
        right: 'Walking to school, I was caught in the rain.',
        note: 'বৃষ্টি তো হেঁটে যাচ্ছিল না।',
      },
      {
        wrong: 'Having finished the report, the deadline was met.',
        right: 'Having finished the report, the team met the deadline.',
        note: 'Deadline তো রিপোর্ট শেষ করেনি।',
      },
      {
        wrong: 'The students enrolling on the course last year have graduated.',
        right: 'The students enrolled on the course last year have graduated.',
        note: 'শিক্ষার্থীদের ভর্তি করানো হয়েছিল, তাই passive -ed রূপটিই সঠিক।',
      },
      {
        wrong: 'Based on the data, it can conclude that demand is rising.',
        right: 'Based on the data, we can conclude that demand is rising.',
        note: 'Participle যার সঙ্গে জুড়বে, Clause-এ এমন একটি Subject দরকার।',
      },
      {
        wrong: 'The figure rose steadily, reached a peak in 2010.',
        right: 'The figure rose steadily, reaching a peak in 2010.',
        note: 'ফলাফলবাচক Clause-এ finite verb নয়, -ing রূপ বসে।',
      },
    ],
    mistakes: [
      {
        wrong: 'After reviewing the evidence, the policy was changed.',
        right: 'After reviewing the evidence, the committee changed the policy.',
        explanation:
          'Passive মূল Clause প্রায় সবসময়ই dangling modifier তৈরি করে, কারণ আসল কর্তা হারিয়ে যায়।',
      },
      {
        wrong: 'Living in a big city, the cost of housing is very high.',
        right: 'For those living in a big city, the cost of housing is very high.',
        explanation: 'খরচ তো কোথাও বাস করে না; যারা বাস করে তাদের উল্লেখ করুন।',
      },
      {
        wrong: 'The report writing by the committee was published yesterday.',
        right: 'The report written by the committee was published yesterday.',
        explanation:
          'Report-টি লেখা হয়েছিল, তাই সংক্ষিপ্ত রূপে past participle বসবে।',
      },
      {
        wrong: 'Being a developing country, the government cannot afford this.',
        right: 'Because it is a developing country, my country cannot afford this.',
        explanation:
          'Government তো কোনো দেশ নয়; পূর্ণ Clause-এ ফিরে গেলে অমিলটি ঠিক হয়ে যায়।',
      },
      {
        wrong: 'Introducing in 2015, the scheme has reduced waiting times.',
        right: 'Introduced in 2015, the scheme has reduced waiting times.',
        explanation: 'Scheme-টি কাজটির শিকার, তাই passive participle লাগবে।',
      },
    ],
    keyTakeaways: [
      'Active অর্থে -ing, আর Passive অর্থে -ed।',
      'মূল Clause-এর Subject-কেই participle-এর কাজটি করতে হবে।',
      'তা না হলে Subordinator বসিয়ে পূর্ণ Clause-এ ফিরে যান।',
      'Task 1-এর বাক্যের শেষে ফলাফলবাচক clause নিরাপদ ও কার্যকর ব্যবহার।',
    ],
  },
]
