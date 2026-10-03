import type { Lesson } from '@/types'

export const stage3Lessons: Lesson[] = [
  /* ----------------------------- Module 12 ----------------------------- */
  {
    moduleId: 12,
    intro:
      'Band 7 বা তার বেশি পেতে হলে complex sentence লিখতেই হবে, কিন্তু সেটা কাজে আসে তখনই, যখন বাক্যটা নির্ভুল থাকে। প্রায় সব সমস্যার মূলে দুটো অভ্যাস: একই সম্পর্ক দুইবার বোঝানো (যেমন although আর but একসঙ্গে), অথবা connector-এর পরে ভুল গঠন বসানো।',
    rules: [
      {
        id: 'm12-r1',
        heading: 'জোড়া দেওয়ার তিন উপায়, তিন রকম নিয়ম',
        rule: 'Coordinator (and, but, so) সমান গুরুত্বের দুটো Clause জোড়া দেয়। Subordinator (because, although) একটা Clause-কে আরেকটার উপর নির্ভরশীল করে। আর Linking Adverbial (however, therefore) এক বাক্যের সঙ্গে পরের বাক্যের যোগসূত্র তৈরি করে।',
        whenToUse: 'যখনই দুটো আইডিয়া একসঙ্গে জুড়বেন।',
        structure: [
          'Coordinator: Clause, and clause. (and, but, so, or, yet, for, nor)',
          'Subordinator: Although clause, clause. / Clause although clause.',
          'Linking adverbial: Clause. However, clause. / Clause; however, clause.',
        ],
        table: {
          caption: 'একই কথা তিনভাবে',
          headers: ['ধরন', 'উদাহরণ'],
          rows: [
            ['Coordinator', 'The scheme was costly, but it worked.'],
            ['Subordinator', 'Although the scheme was costly, it worked.'],
            ['Linking adverbial', 'The scheme was costly. Nevertheless, it worked.'],
          ],
        },
        notes: [
          'একটা সম্পর্কের জন্য এই তিনটার মধ্যে ঠিক একটা ব্যবহার করুন। দুটো দিলেই ভুল।',
        ],
      },
      {
        id: 'm12-r2',
        heading: 'অর্থ অনুযায়ী Subordinator',
        rule: 'আপনি কোন সম্পর্কটা বোঝাতে চান, সেটা দেখে Subordinator বাছুন; প্রথমে যেটা মাথায় এলো সেটাই বসিয়ে দেবেন না।',
        whenToUse: 'Complex sentence লেখার আগে মাথায় সাজানোর সময়।',
        structure: [
          'কারণ: because, since, as',
          'ফলাফল: so that, with the result that',
          'বৈপরীত্য: whereas, while',
          'মেনে নিয়েও উল্টো কথা (concession): although, though, even though',
          'উদ্দেশ্য: so that, in order that',
          'শর্ত: if, unless, provided that, as long as',
          'সময়: when, while, before, after, until, once, as soon as',
        ],
        table: {
          caption: 'Contrast আর concession-এর পার্থক্য',
          headers: ['সম্পর্ক', 'শব্দ', 'উদাহরণ'],
          rows: [
            ['দুটি বিষয় আলাদা', 'whereas', 'Cities grew, whereas rural areas shrank.'],
            ['অপ্রত্যাশিত ফল', 'although', 'Although funding rose, results did not improve.'],
            ['কারণ', 'because', 'Prices rose because demand outstripped supply.'],
            ['উদ্দেশ্য', 'so that', 'Taxes were cut so that firms could invest.'],
          ],
        },
        notes: [
          'Whereas দিয়ে দুটো তথ্যের সরাসরি পার্থক্য দেখানো হয়; আর although বোঝায় যে দ্বিতীয় তথ্যটা প্রত্যাশার উল্টো।',
        ],
      },
      {
        id: 'm12-r3',
        heading: 'Despite ও in spite of-এর পরে Noun বসে',
        rule: 'Despite ও in spite of হলো Preposition, তাই এদের পরে Noun, Pronoun বা -ing রূপ বসে, কখনো পূর্ণ Clause নয়।',
        whenToUse: 'যখন আরেকটা পূর্ণ Clause না লিখেই বৈপরীত্য বোঝাতে চান।',
        structure: [
          'despite + noun: Despite the cost, the project continued.',
          'despite + -ing: Despite costing millions, the project continued.',
          'despite the fact that + clause: Despite the fact that it cost millions, the project continued.',
          'although + clause: Although it cost millions, the project continued.',
        ],
        notes: ['despite লিখুন, despite of নয়। আর in spite of তিনটা আলাদা শব্দ।'],
      },
      {
        id: 'm12-r4',
        heading: 'এক সম্পর্কে একটিই Connector',
        rule: 'একই অর্থের Subordinator-এর সঙ্গে আবার Coordinator বা Adverbial জুড়ে দেবেন না।',
        whenToUse: 'although বা because আছে এমন প্রতিটি বাক্যে এটা চেক করুন।',
        structure: [
          'Wrong: Although it is expensive, but it is effective.',
          'Right: Although it is expensive, it is effective.',
          'Right: It is expensive, but it is effective.',
          'Wrong: Because of traffic, so people are late.',
          'Right: Because of traffic, people are late.',
        ],
        notes: [
          'IELTS writing-এ complex sentence-এ সবচেয়ে বেশি এই ভুলটাই দেখা যায়, অথচ এটা পুরোপুরি এড়ানো সম্ভব।',
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
        note: 'Because আর therefore দুটোই কারণ-ফলাফলের সম্পর্ক বোঝায়; একটাই যথেষ্ট।',
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
        explanation: 'Even though একটা Subordinator, তাই এর সঙ্গে but বসতে পারে না।',
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
          'Because of-এর পরে Noun বসে, আর because-এর পরে Clause; দুটো মিশিয়ে ফেললে বাক্যটা ভেঙে যায়।',
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
          'একের পর এক connector বসালে আসল যুক্তিটাই হারিয়ে যায়। এক বাক্যে একটা স্পষ্ট সম্পর্ক রাখলে পড়তে অনেক ভালো লাগে।',
      },
    ],
    keyTakeaways: [
      'একটা সম্পর্ক, একটাই connector।',
      'Although + clause; despite + noun বা -ing।',
      'Whereas দিয়ে দুটো তথ্যের পার্থক্য, আর although দিয়ে প্রত্যাশার উল্টো ফল বোঝায়।',
      'However ও therefore-এর আগে full stop বা semicolon লাগে।',
    ],
  },

  /* ----------------------------- Module 13 ----------------------------- */
  {
    moduleId: 13,
    intro:
      'Relative Clause হলো academic writing-এ complex গঠন দেখানোর সবচেয়ে নিরাপদ উপায়, কারণ নতুন বাক্য না লিখেই এটা Noun সম্পর্কে বাড়তি তথ্য জুড়ে দেয়। এটা ঠিকভাবে লিখতে দুটো জিনিস লাগে: সঠিক Pronoun বাছা, আর তথ্যটা অপরিহার্য নাকি শুধু বাড়তি, সেটা বোঝা।',
    rules: [
      {
        id: 'm13-r1',
        heading: 'সঠিক Relative Pronoun বাছা',
        rule: 'কোন Pronoun বসবে তা ঠিক হয় Noun-টা কী (মানুষ, বস্তু, স্থান) তা দেখে; বাক্যে তার ভূমিকা দেখে নয়।',
        whenToUse: 'যখনই কোনো Noun-এর সঙ্গে একটা Clause জুড়বেন।',
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
          'Which পুরো একটা Clause-কেও বোঝাতে পারে: Sales fell, which worried investors.',
        ],
      },
      {
        id: 'm13-r2',
        heading: 'Defining বনাম Non-defining',
        rule: 'Defining clause বুঝিয়ে দেয় ঠিক কোনটার কথা বলছেন, আর এতে কমা বসে না। Non-defining clause শুধু বাড়তি তথ্য দেয়, আর এর দুই পাশে কমা বসে।',
        whenToUse: 'কমা বসানোর আগেই ঠিক করুন কোনটা লিখছেন, পরে নয়।',
        structure: [
          'Defining: Students who study abroad often become more independent. (শুধু যারা বিদেশে পড়ে)',
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
            ['Pronoun বাদ দেওয়া যায়', 'হ্যাঁ, যদি এটা Object হয়', 'না'],
            ['তথ্যের ধরন', 'অপরিহার্য', 'বাড়তি'],
          ],
        },
        notes: [
          'কমা পুরো অর্থটাই বদলে দেয়। Workers who were unskilled lost their jobs মানে শুধু অদক্ষ কর্মীরাই চাকরি হারিয়েছে; আর Workers, who were unskilled, lost their jobs মানে কর্মীরা সবাই অদক্ষ ছিল।',
        ],
      },
      {
        id: 'm13-r3',
        heading: 'দ্বিতীয়বার Pronoun বসাবেন না',
        rule: 'Relative Pronoun নিজেই Subject বা Object-এর জায়গাটা নিয়ে নেয়, তাই আর একটা Pronoun বসানো যাবে না।',
        whenToUse: 'নিজের লেখা প্রতিটি Relative Clause চেক করুন।',
        structure: [
          'Wrong: The policy which it was introduced reduced pollution.',
          'Right: The policy which was introduced reduced pollution.',
          'Wrong: The book that I read it was useful.',
          'Right: The book that I read was useful.',
        ],
      },
      {
        id: 'm13-r4',
        heading: 'Preposition + which, আর Clause ছোট করা',
        rule: 'Formal লেখায় Preposition-টাকে which বা whom-এর আগে নিয়ে আসা যায়। আর be আছে এমন defining clause অনেক সময় ছোট করে লেখা যায়।',
        whenToUse:
          'Preposition সামনে আনা formal লেখায় মানায়। আর পূর্ণ গঠনটা ভালোভাবে আয়ত্তে এলে, ছোট করে লিখলে বাক্য আরও টানটান হয়।',
        structure: [
          'Informal: the problem which we are dealing with',
          'Formal: the problem with which we are dealing',
          'the rate at which temperatures are rising',
          'the extent to which this is true',
          'ছোট রূপ: The students who are enrolled on the course -> The students enrolled on the course',
          'ছোট রূপ: The report which was published in 2020 -> The report published in 2020',
          'ছোট রূপ: People who live in cities -> People living in cities',
        ],
        notes: [
          'শুধু be আছে এমন defining clause, অথবা active অর্থের clause সহজেই ছোট করা যায়।',
          'Module 17-এ Clause ছোট করার নিয়ম আরও বিস্তারিত আছে, সঙ্গে dangling modifier-এর ফাঁদও।',
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
        note: 'Noun-টা একটাই (unique), তাই এর সঙ্গে non-defining clause বসে, আর কমা লাগে।',
      },
      {
        wrong: 'The researcher that her study was published won an award.',
        right: 'The researcher whose study was published won an award.',
        note: 'অধিকার বোঝাতে whose বসে।',
      },
      {
        wrong: 'This is the village where I grew up in.',
        right: 'This is the village where I grew up.',
        note: 'Where-এর ভেতরেই Preposition-টা আছে (where = in which)।',
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
        explanation: 'প্রতিষ্ঠান কোনো মানুষ নয়, তাই এর সঙ্গে which বসে।',
      },
      {
        wrong: 'There are many reasons why people move to cities, which it is a global trend.',
        right: 'There are many reasons why people move to cities, a trend seen worldwide.',
        explanation:
          'বাড়তি it তো ভুলই, তার উপর এখানে আরেকটা which-এর চেয়ে apposition (কমা দিয়ে পাশে বসানো Noun phrase) অনেক বেশি পরিষ্কার।',
      },
      {
        wrong: 'The period which the economy grew fastest was the 1990s.',
        right: 'The period in which the economy grew fastest was the 1990s.',
        explanation:
          'Clause-টাতে একটা Preposition দরকার: in which, অথবা সহজভাবে when।',
      },
      {
        wrong: 'People live in rural areas often have limited access to healthcare.',
        right: 'People living in rural areas often have limited access to healthcare.',
        explanation:
          'ছোট করা Clause-এ -ing রূপ লাগে; আগের মতো লিখলে বাক্যে দুটো finite verb হয়ে যায়।',
      },
    ],
    keyTakeaways: [
      'মানুষের জন্য who, বস্তুর জন্য which, আর অধিকারের জন্য whose।',
      'Clause যদি বুঝিয়ে দেয় কোনটার কথা হচ্ছে, তাহলে কমা নেই; শুধু বাড়তি তথ্য দিলে কমা আছে।',
      'Non-defining clause-এ that একদমই বসে না।',
      'Relative Pronoun-এর পরে কখনো Subject-টা আবার লিখবেন না।',
    ],
  },

  /* ----------------------------- Module 14 ----------------------------- */
  {
    moduleId: 14,
    intro:
      'Noun Clause হলো এমন একটা পুরো Clause, যেটা Noun-এর কাজ করে। এটা দিয়েই আপনি অন্যের যুক্তি তুলে ধরেন, কোনো দাবি নিয়ে মত দেন আর essay সাজান। এখানে সবচেয়ে বেশি যে ভুলটা হয়: embedded question-এর ভেতরে প্রশ্নের word order রেখে দেওয়া।',
    rules: [
      {
        id: 'm14-r1',
        heading: 'That-clause',
        rule: 'That-clause কোনো reporting verb-এর Object হতে পারে, আবার Adjective বা Noun-এর পরে বসে তার অর্থ সম্পূর্ণও করতে পারে।',
        whenToUse: 'যখন জানাবেন কেউ কী যুক্তি দেন, কী দেখান বা কী বিশ্বাস করেন।',
        structure: [
          'Object হিসেবে: Critics argue that the policy is ineffective.',
          'Adjective-এর পরে: It is clear that demand has fallen.',
          'Noun-এর পরে: the claim that technology destroys jobs',
          'Subject হিসেবে (কম ব্যবহৃত, ভারী): That the policy failed is undeniable.',
        ],
        notes: [
          'Informal লেখায় that বাদ দেওয়া যায়, তবে academic লেখায় রাখাই ভালো।',
          'বহুল ব্যবহৃত reporting verb: argue, claim, suggest, show, indicate, demonstrate, reveal, conclude, maintain.',
        ],
      },
      {
        id: 'm14-r2',
        heading: 'Whether ও if clause',
        rule: 'হ্যাঁ-না ধরনের বিকল্প বোঝাতে whether ব্যবহার করুন। Formal লেখায় if-এর চেয়ে whether ভালো, আর Preposition-এর পরে বা to-এর আগে whether-ই বসবে।',
        whenToUse: 'যখন Clause-টা এমন একটা প্রশ্ন বোঝায়, যার উত্তর এখনো ঠিক হয়নি।',
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
        heading: 'Embedded question-এ statement-এর word order থাকে',
        rule: 'বড় একটা বাক্যের ভেতরে ঢুকলে প্রশ্নটা statement-এর মতো হয়ে যায়: কোনো inversion থাকে না, auxiliary do-ও থাকে না।',
        whenToUse: 'wonder, explain, know, understand, show, examine আর question-এর পরে।',
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
          'do, does আর did পুরোপুরি বাদ দিন, আর মূল Verb-কে তার স্বাভাবিক রূপে ফিরিয়ে আনুন।',
        ],
      },
      {
        id: 'm14-r4',
        heading: 'Extraposition: Clause-কে শেষে সরিয়ে দেওয়া',
        rule: 'Subject-এর জায়গায় that-clause বা to-infinitive বসালে বাক্যটা ভারী হয়ে যায়। Clause-টা শেষে পাঠিয়ে দিন, আর শুরুতে it বসান।',
        whenToUse: 'Topic sentence আর মতামত দেওয়ার বাক্যে।',
        structure: [
          'Heavy: That the climate is changing is now undisputed.',
          'Extraposed: It is now undisputed that the climate is changing.',
          'Heavy: To measure happiness accurately is difficult.',
          'Extraposed: It is difficult to measure happiness accurately.',
          'কাজে লাগে এমন গঠন: It is clear / likely / apparent / widely accepted / worth noting that...',
        ],
        notes: [
          'এটা সেই একই end-weight নীতি (ভারী অংশ শেষে), যেটা Module 20-তে পুরো paragraph-এর জন্য দেখানো হয়েছে।',
        ],
      },
    ],
    examples: [
      {
        wrong: 'I wonder why do people move to cities.',
        right: 'I wonder why people move to cities.',
        note: 'Embedded question-এ statement-এর word order থাকে।',
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
        note: 'Extraposition করলে ভারী Clause-টা শেষে চলে যায়।',
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
          'Embedded clause-এ Subject আগে আর Verb পরে থাকে, তাই the outcome আগে বসবে।',
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
          'Formal লেখায় that রাখুন; এতে পাঠক বুঝতে পারেন নতুন Clause কোথা থেকে শুরু হচ্ছে।',
      },
      {
        wrong: 'Researchers want to know that why the figure fell.',
        right: 'Researchers want to know why the figure fell.',
        explanation: 'wh-শব্দের সঙ্গে that বসাবেন না; একটা connector-ই যথেষ্ট।',
      },
      {
        wrong: 'It is depends on whether funding is available.',
        right: 'It depends on whether funding is available.',
        explanation:
          'এই it is-এর পরে Adjective বসে, কোনো পূর্ণ Verb নয়।',
      },
    ],
    keyTakeaways: [
      'অন্যের যুক্তি জানাতে verb + that-clause ব্যবহার করুন।',
      'হ্যাঁ-না বিকল্পে whether বসে, আর Preposition-এর পরে সবসময় whether।',
      'Embedded question-এ statement-এর word order থাকে, auxiliary do থাকে না।',
      'ভারী Subject Clause শেষে পাঠিয়ে দিন, আর বাক্য শুরু করুন it দিয়ে।',
    ],
  },

  /* ----------------------------- Module 15 ----------------------------- */
  {
    moduleId: 15,
    intro:
      'যুক্তি দেওয়ার grammar হলো Conditional। সমাধান নিয়ে লেখা paragraph আসলে প্রায়ই একটা conditional: এটা করা হলে, ওটা হতো। তিনটা গঠন দিয়েই এই কাজের প্রায় পুরোটা হয়ে যায়, আর মূল নিয়মটা সহজ: if-clause-এ will বসে না।',
    rules: [
      {
        id: 'm15-r1',
        heading: 'যে তিনটা Conditional সবচেয়ে বেশি লাগে',
        rule: 'Zero conditional সাধারণ সত্য বোঝায়, First conditional বাস্তবে হতে পারে এমন ভবিষ্যৎ বোঝায়, আর Second conditional কাল্পনিক অবস্থা বোঝায়।',
        whenToUse: 'সাধারণ সত্যের জন্য zero, বাস্তব প্রস্তাবের জন্য first, আর কল্পনার জন্য second।',
        structure: [
          'Zero: If + present simple, present simple. If water reaches 100 degrees, it boils.',
          'First: If + present simple, will + base. If governments invest in rail, congestion will fall.',
          'Second: If + past simple, would + base. If governments invested in rail, congestion would fall.',
        ],
        table: {
          caption: 'কোনটা কখন ব্যবহার করবেন',
          headers: ['ধরন', 'অর্থ', 'উদাহরণ'],
          rows: [
            ['Zero', 'সবসময় সত্য', 'If demand rises, prices increase.'],
            ['First', 'বাস্তবসম্মত ভবিষ্যৎ', 'If demand rises, prices will increase.'],
            ['Second', 'কাল্পনিক বা কম সম্ভাব্য', 'If demand rose, prices would increase.'],
          ],
        },
        notes: [
          'Second conditional অতীত নিয়ে নয়; এটা কাল্পনিক বর্তমান বা ভবিষ্যৎ নিয়ে, যদিও Verb দেখতে past-এর মতো।',
          'Formal লেখায় I, he, she, it সহ সব Subject-এর সঙ্গেই were ব্যবহার হয়: If the policy were introduced...',
        ],
      },
      {
        id: 'm15-r2',
        heading: 'If-clause-এ will বসে না',
        rule: 'শর্তের অংশে ভবিষ্যতের অর্থ বোঝায় Present simple। Will বসে শুধু ফলাফলের Clause-এ।',
        whenToUse: 'নিজের লেখা প্রতিটি first conditional-এ।',
        structure: [
          'Wrong: If the government will reduce taxes, businesses will invest.',
          'Right: If the government reduces taxes, businesses will invest.',
          'Right: If the government were to reduce taxes, businesses would invest.',
        ],
        notes: [
          'when, as soon as, until আর before-এর ক্ষেত্রেও একই নিয়ম: When prices rise, demand will fall.',
        ],
      },
      {
        id: 'm15-r3',
        heading: 'Unless, provided that, as long as',
        rule: 'Unless মানে except if, অর্থাৎ এর ভেতরেই না-বোধক অর্থ আছে। Provided that আর as long as এমন শর্ত বোঝায়, যেটা পূরণ হতেই হবে।',
        whenToUse: 'Conditional-এ বৈচিত্র্য আনতে, আর প্রস্তাব কোন শর্তে কাজ করবে তা বলে দিতে।',
        structure: [
          'Unless action is taken, emissions will continue to rise.',
          'The scheme will succeed provided that it is properly funded.',
          'Remote work is effective as long as teams communicate regularly.',
          'In the event of a shortage, prices would rise.',
        ],
        notes: [
          'unless... not লিখবেন না: Unless the government does not act-এ দুবার না-বোধক অর্থ এসে গেছে (double negative)।',
          'Provided that আর as long as-এর পরেও first conditional-এর মতো present tense বসে।',
        ],
      },
      {
        id: 'm15-r4',
        heading: 'যুক্তিতে Conditional',
        rule: 'যে প্রস্তাবকে বাস্তবসম্মত মনে করেন, তার জন্য first conditional; আর যেটাকে কাল্পনিক হিসেবে দেখাতে চান, তার জন্য second conditional। কোনটা বাছলেন, তা থেকেই আপনার অবস্থান বোঝা যায়।',
        whenToUse: 'সমাধান আর মতামত নিয়ে লেখা paragraph-এ।',
        structure: [
          'বাস্তবসম্মত প্রস্তাব: If schools introduced financial education, students would manage money better.',
          'কিছু না করলে কী হবে: Unless cities expand public transport, congestion will worsen.',
          'সমাধানের সীমাবদ্ধতা মেনে নেওয়া: Even if funding were doubled, the problem would persist.',
        ],
        notes: [
          'Mixed আর third conditional কাজের, তবে ঐচ্ছিক। প্রথম তিনটা নির্ভুলভাবে লেখা অনেক বেশি গুরুত্বপূর্ণ।',
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
        note: 'Formal কাল্পনিক গঠনে were বসে।',
      },
      {
        wrong: 'The plan will work provided that it will receive support.',
        right: 'The plan will work provided that it receives support.',
        note: 'Provided that-এর নিয়ম if-এর মতোই।',
      },
    ],
    mistakes: [
      {
        wrong: 'If companies would pay higher wages, employees will be more motivated.',
        right: 'If companies paid higher wages, employees would be more motivated.',
        explanation:
          'বাক্যটায় দুটো গঠন মিশে গেছে। হয় past simple-এর সঙ্গে would, নয়তো present simple-এর সঙ্গে will রাখুন।',
      },
      {
        wrong: 'When the government will introduce the law, protests will begin.',
        right: 'When the government introduces the law, protests will begin.',
        explanation: 'Time clause-এও if-clause-এর মতোই will বসে না।',
      },
      {
        wrong: 'If education would be free, more people could attend university.',
        right: 'If education were free, more people could attend university.',
        explanation: 'শর্তের অংশে would বসে না; কল্পনা বোঝাতে were বসে।',
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
          'অতীতের বাস্তব শর্তের সঙ্গে নিশ্চিত ভবিষ্যদ্বাণী নয়, বরং প্রত্যাশা বোঝানো modal (যেমন should) মানায়।',
      },
    ],
    keyTakeaways: [
      'সাধারণ সত্যের জন্য zero, বাস্তবসম্মত ভবিষ্যতের জন্য first, কল্পনার জন্য second।',
      'If-clause বা time clause-এ কখনো will বসাবেন না।',
      'Unless-এর অর্থই if not, তাই আলাদা করে আর not যোগ করবেন না।',
      'কোন conditional বাছলেন, তা থেকেই পাঠক বোঝেন প্রস্তাবটাকে আপনি কতটা বাস্তবসম্মত মনে করছেন।',
    ],
  },

  /* ----------------------------- Module 16 ----------------------------- */
  {
    moduleId: 16,
    intro:
      'Parallelism মানে and, or বা but দিয়ে জোড়া দেওয়া অংশগুলোর গঠন একই রকম রাখা। এটা চুপচাপ কাজ করে: ঠিক থাকলে কেউ খেয়ালই করে না, কিন্তু ভুল হলে যত্ন করে লেখা লম্বা বাক্যটা শেষে এসে ভেঙে পড়ে।',
    rules: [
      {
        id: 'm16-r1',
        heading: 'তালিকার সব অংশের গঠন এক রাখুন',
        rule: 'তালিকার প্রতিটি অংশ একই ধরনের হতে হবে: সবগুলো Noun, সবগুলো -ing রূপ, সবগুলো infinitive, অথবা সবগুলো finite verb।',
        whenToUse: 'দুই বা তার বেশি আইটেমের তালিকা আছে এমন প্রতিটি বাক্যে।',
        structure: [
          'সবগুলো finite verb: The policy reduces pollution, saves money and improves health.',
          'সবগুলো -ing রূপ: The scheme involves building schools, training teachers and funding equipment.',
          'সবগুলো Noun: The report examines cost, feasibility and public support.',
          'সবগুলো infinitive: The aim is to reduce waste, to cut costs and to raise awareness.',
        ],
        notes: [
          'Infinitive-এর ক্ষেত্রে হয় প্রতিটি আইটেমে to লিখুন, নয়তো শুধু প্রথমটায়। মাঝখানে এলোমেলো করবেন না।',
        ],
      },
      {
        id: 'm16-r2',
        heading: 'জোড়ায় জোড়ায় বসা Connector',
        rule: 'Correlative জোড়ার (both...and, either...or) দুই পাশে একই ধরনের গঠন বসতে হবে।',
        whenToUse: 'not only...but also, both...and, either...or আর neither...nor-এর সঙ্গে।',
        structure: [
          'both + X and + X: both in schools and in workplaces',
          'not only + X but also + X: not only cheaper but also faster',
          'either + X or + X: either raising taxes or cutting spending',
          'neither + X nor + X: neither practical nor affordable',
        ],
        table: {
          caption: 'জোড়ার দুই পাশ সমান রাখা',
          headers: ['ভুল', 'সঠিক'],
          rows: [
            ['not only cheap but also it saves time', 'not only cheap but also time-saving'],
            ['both for students and teachers', 'both for students and for teachers'],
            ['either by taxing or regulation', 'either by taxation or by regulation'],
          ],
        },
        notes: ['not only-এর পরে যে ধরনের শব্দ (Verb, Noun, Adjective) বসবে, but also-এর পরেও ঠিক সেই ধরনের শব্দই বসবে।'],
      },
      {
        id: 'm16-r3',
        heading: 'তুলনায় Parallelism',
        rule: 'তুলনার দুই পাশে একই ধরনের জিনিস থাকতে হবে।',
        whenToUse: 'than, as...as আর সংখ্যার তুলনায়।',
        structure: [
          'Wrong: The population of Japan is larger than Canada.',
          'Right: The population of Japan is larger than that of Canada.',
          'Right: Japan has a larger population than Canada does.',
          'Wrong: Reading is more useful than to watch television.',
          'Right: Reading is more useful than watching television.',
        ],
        notes: [
          'Head noun আবার না লিখে বোঝাতে একবচনে that of, আর বহুবচনে those of ব্যবহার করুন।',
        ],
      },
      {
        id: 'm16-r4',
        heading: 'একটা শব্দ সবার সঙ্গে ভাগ করলে, সেটা যেন সবার সঙ্গেই খাটে',
        rule: 'তালিকার সব আইটেম যদি একটা Preposition, Article বা Auxiliary ভাগ করে নেয়, তাহলে সেটা প্রতিটি আইটেমের সঙ্গেই মানাতে হবে। না মানালে সঠিকটা আলাদা করে লিখুন।',
        whenToUse: 'লম্বা তালিকায়, যেখানে একটা Preposition দিয়েই অনেকগুলো আইটেম চালানো হচ্ছে।',
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
        note: 'পরপর তিনটা finite verb।',
      },
      {
        wrong: 'She enjoys reading, to travel and cooking.',
        right: 'She enjoys reading, travelling and cooking.',
        note: 'Enjoy-এর পরে -ing বসে, তাই প্রতিটি আইটেমই -ing রূপে হবে।',
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
        note: 'should-এর পরে তিনটা আইটেমই এখন bare infinitive।',
      },
    ],
    mistakes: [
      {
        wrong: 'The course teaches students how to write reports, giving presentations and research skills.',
        right: 'The course teaches students how to write reports, give presentations and conduct research.',
        explanation: 'এখন তিনটা আইটেমই how to-এর পরে bare infinitive হিসেবে বসেছে।',
      },
      {
        wrong: 'He is responsible for planning, to organise events and the budget.',
        right: 'He is responsible for planning events, organising budgets and managing staff.',
        explanation: 'for একটা Preposition, তাই এর পরের প্রতিটি আইটেম -ing রূপে হবে।',
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
        explanation: 'Both...and এখানে দুটো Adjective জোড়া দেয়, একটা Adjective আর একটা Clause নয়।',
      },
      {
        wrong: 'Wages in the north are lower than the south.',
        right: 'Wages in the north are lower than those in the south.',
        explanation: 'Those in মানে wages in, তাই তুলনার দুই পাশে একই জিনিস থাকে।',
      },
    ],
    keyTakeaways: [
      'and বা or দিয়ে জোড়া দেওয়া আইটেমগুলোর গঠন এক হতে হবে।',
      'not only-এর পরে যা বসে, but also-এর পরেও তাই বসবে।',
      'তুলনার দুই পাশে একই জিনিস রাখতে that of আর those of ব্যবহার করুন।',
      'তালিকার প্রতিটি আইটেম বাক্যের শুরুর অংশের সঙ্গে জুড়ে আলাদা করে একবার পড়ে দেখুন।',
    ],
  },

  /* ----------------------------- Module 17 ----------------------------- */
  {
    moduleId: 17,
    intro:
      'Participle clause দুটো Clause-কে একটায় মিলিয়ে দেয়, আর এটা ভাষার উপর সত্যিকারের দখলের প্রমাণ। তবে এতে একটা বড় ঝুঁকি আছে: participle-এর কাজটা যে করছে, সে যদি মূল Clause-এর Subject না হয়, তাহলে বাক্যটা এমন অর্থ দেয় যা আপনি বলতেই চাননি।',
    rules: [
      {
        id: 'm17-r1',
        heading: 'Relative Clause ছোট করা',
        rule: 'Defining relative clause থেকে Pronoun আর be বাদ দেওয়া যায়। Active অর্থ হলে -ing, আর Passive অর্থ হলে -ed রূপ বসে।',
        whenToUse: 'তথ্য না হারিয়ে Noun phrase ছোট আর টানটান করতে।',
        structure: [
          'who are living in cities -> living in cities',
          'which was published in 2020 -> published in 2020',
          'that is causing concern -> causing concern',
          'who have been affected -> affected',
        ],
        table: {
          caption: 'পূর্ণ রূপ আর ছোট রূপ',
          headers: ['পূর্ণ Clause', 'ছোট রূপ'],
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
        heading: 'Adverbial Participle Clause',
        rule: 'বাক্যের শুরুতে বা শেষে বসা -ing clause সময়, কারণ বা ফলাফল বোঝাতে পারে। পাঠক ধরে নেন, -ing কাজটা করছে মূল Clause-এর Subject-ই।',
        whenToUse: 'একই কর্তার দুটো কাজ এক বাক্যে জুড়তে।',
        structure: [
          'সময়: Having completed the survey, the researchers analysed the data.',
          'কারণ: Facing rising costs, many firms reduced staff.',
          'ফলাফল: Demand fell sharply, causing prices to drop.',
          'Passive: Introduced in 2015, the scheme has halved waiting times.',
        ],
        notes: [
          'Having + past participle বোঝায়, কাজটা মূল Verb-এর আগেই শেষ হয়ে গেছে।',
          'বাক্যের শেষে ফলাফল বোঝানো -ing clause Task 1-এ খুব কাজের: The figure peaked in 2008, reaching 90 million.',
        ],
      },
      {
        id: 'm17-r3',
        heading: 'Dangling Modifier (ঝুলে থাকা modifier)',
        rule: 'Participle-এর কাজটা যে করছে, মূল Clause-এর Subject-কেই সে হতে হবে। তা না হলে modifier-টা ঝুলে থাকে, অর্থাৎ কার সঙ্গে জুড়বে তা খুঁজে পায় না।',
        whenToUse: '-ing বা -ed দিয়ে শুরু হওয়া প্রতিটি বাক্য চেক করুন।',
        structure: [
          'Dangling: Walking to school, the rain started.',
          'Fixed: Walking to school, I was caught in the rain.',
          'Fixed: While I was walking to school, it started to rain.',
          'Dangling: Having studied the data, the conclusion was obvious.',
          'Fixed: Having studied the data, the researchers reached an obvious conclusion.',
        ],
        notes: [
          'সবচেয়ে সহজ সমাধান: Subordinator (when, because, after) বসিয়ে পূর্ণ Clause লিখে ফেলা।',
          'এই ভুল ধরা কঠিন, কারণ বাক্যটা শুনতে সাবলীল লাগে। নিজেকে একটা প্রশ্ন করুন: -ing কাজটা আসলে কে করছে?',
        ],
      },
      {
        id: 'm17-r4',
        heading: 'Noun-এর পরে Infinitive বসিয়ে তথ্য যোগ করা',
        rule: 'Noun-এর পরে বসা to-infinitive উদ্দেশ্য বা কী করতে হবে তা বোঝায়।',
        whenToUse: 'উদ্দেশ্য বোঝানো Relative Clause ছোট করতে।',
        structure: [
          'the best way to reduce emissions',
          'the first country to introduce the ban',
          'a decision to be made by the committee',
          'measures to be taken in the next decade',
        ],
        notes: [
          'কাজটা যদি Noun-এর উপর হয়, তাহলে passive infinitive বসান: the issues to be addressed.',
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
        note: 'শিক্ষার্থীদের ভর্তি করানো হয়েছিল, তাই passive -ed রূপটাই সঠিক।',
      },
      {
        wrong: 'Based on the data, it can conclude that demand is rising.',
        right: 'Based on the data, we can conclude that demand is rising.',
        note: 'Participle যার সঙ্গে জুড়বে, Clause-এ এমন একটা Subject দরকার।',
      },
      {
        wrong: 'The figure rose steadily, reached a peak in 2010.',
        right: 'The figure rose steadily, reaching a peak in 2010.',
        note: 'ফলাফল বোঝানো এই Clause-এ finite verb নয়, -ing রূপ বসে।',
      },
    ],
    mistakes: [
      {
        wrong: 'After reviewing the evidence, the policy was changed.',
        right: 'After reviewing the evidence, the committee changed the policy.',
        explanation:
          'মূল Clause passive হলে প্রায় সবসময়ই dangling modifier হয়ে যায়, কারণ আসল কর্তা বাক্য থেকে হারিয়ে যায়।',
      },
      {
        wrong: 'Living in a big city, the cost of housing is very high.',
        right: 'For those living in a big city, the cost of housing is very high.',
        explanation: 'খরচ তো কোথাও বাস করে না; যারা বাস করে, তাদের কথা লিখুন।',
      },
      {
        wrong: 'The report writing by the committee was published yesterday.',
        right: 'The report written by the committee was published yesterday.',
        explanation:
          'Report-টা লেখা হয়েছিল, তাই ছোট রূপে past participle বসবে।',
      },
      {
        wrong: 'Being a developing country, the government cannot afford this.',
        right: 'Because it is a developing country, my country cannot afford this.',
        explanation:
          'Government তো কোনো দেশ নয়; পূর্ণ Clause লিখলে এই গরমিলটা ঠিক হয়ে যায়।',
      },
      {
        wrong: 'Introducing in 2015, the scheme has reduced waiting times.',
        right: 'Introduced in 2015, the scheme has reduced waiting times.',
        explanation: 'কাজটা Scheme-এর উপর হচ্ছে, তাই passive participle লাগবে।',
      },
    ],
    keyTakeaways: [
      'Active অর্থে -ing, আর Passive অর্থে -ed।',
      'মূল Clause-এর Subject-কেই participle-এর কাজটা করতে হবে।',
      'তা না হলে Subordinator বসিয়ে পূর্ণ Clause লিখুন।',
      'Task 1-এ বাক্যের শেষে ফলাফল বোঝানো -ing clause নিরাপদ আর কাজের।',
    ],
  },
]
