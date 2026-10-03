import type { Lesson } from '@/types'

export const stage2Lessons: Lesson[] = [
  /* ------------------------------ Module 6 ----------------------------- */
  {
    moduleId: 6,
    intro:
      'সব Tense মুখস্থ করার দরকার নেই। দরকার অল্প কয়েকটা Tense, যেগুলো আপনি সবসময় নির্ভুলভাবে ব্যবহার করতে পারবেন, আর প্রশ্ন দেখে বোঝার ক্ষমতা যে কোন সময়ের কথা লিখতে হবে। পরীক্ষায় Tense-এর বেশিরভাগ ভুল আসলে কঠিন কিছু নয়; বরং একই paragraph-এ কারণ ছাড়াই Tense বদলে ফেলা।',
    rules: [
      {
        id: 'm6-r1',
        heading: 'যে কয়টি Tense আসলেই লাগবে',
        rule: 'Academic writing-এর প্রায় পুরোটাই চলে পাঁচটা রূপ দিয়ে: Present simple, Past simple, Present perfect, Past perfect, আর একটা Future রূপ।',
        whenToUse: 'প্রতিটি paragraph-এর শুরুতে ঠিক করে নিন কোন সময়ের কথা বলছেন, তারপর সেটাতেই থাকুন।',
        structure: [
          'Present simple - সাধারণ সত্য, বর্তমান অবস্থা, আপনার যুক্তি।',
          'Past simple - নির্দিষ্ট অতীত সময়ে শেষ হওয়া ঘটনা।',
          'Present perfect - অতীতের ঘটনা যার প্রভাব এখনো আছে, বা যে সময়টা এখনো শেষ হয়নি।',
          'Past perfect - অতীতের আরেকটি ঘটনার আগে ঘটে যাওয়া ঘটনা।',
          'will / be going to - ভবিষ্যদ্বাণী ও পরিকল্পনা।',
        ],
        table: {
          caption: 'কোন অর্থে কোন Tense',
          headers: ['অর্থ', 'Tense', 'উদাহরণ'],
          rows: [
            ['চিরন্তন সত্য', 'Present simple', 'Water boils at 100 degrees.'],
            ['চলমান প্রবণতা', 'Present continuous', 'Prices are rising steadily.'],
            ['শেষ হওয়া অতীত ঘটনা', 'Past simple', 'The policy was introduced in 2015.'],
            ['অতীত ঘটনা, বর্তমান প্রভাব', 'Present perfect', 'Costs have risen since 2015.'],
            ['আরও আগের অতীত', 'Past perfect', 'By 2010 demand had already peaked.'],
            ['ভবিষ্যদ্বাণী', 'will + base', 'Demand will continue to grow.'],
          ],
        },
      },
      {
        id: 'm6-r2',
        heading: 'Past simple না Present perfect',
        rule: 'নির্দিষ্ট আর শেষ হয়ে যাওয়া সময়ের কথা থাকলে Past simple ব্যবহার করুন। সময় বলা না থাকলে, বা সময়টা এখনো চলতে থাকলে Present perfect ব্যবহার করুন।',
        whenToUse: 'যখনই সময়ের সঙ্গে পরিবর্তন বর্ণনা করবেন।',
        structure: [
          'Past simple: Emissions fell sharply in 2019.',
          'Present perfect: Emissions have fallen sharply since 2019.',
          'Present perfect: Several countries have adopted this approach.',
        ],
        notes: [
          'since ও so far থাকলে Present perfect; আর in 2019, last year, ago থাকলে Past simple।',
          'দুটোকে কখনো মেশাবেন না: has fallen in 2019 ভুল।',
        ],
      },
      {
        id: 'm6-r3',
        heading: 'IELTS-এর প্রশ্নে Tense',
        rule: 'Task 1-এ Tense ঠিক হয় চার্টের সাল দেখে। Task 2 মূলত Present simple-এ লেখা হয়।',
        whenToUse: 'একটা শব্দ লেখার আগেই চার্টের title ভালো করে পড়ুন।',
        structure: [
          'অতীতের সাল দেওয়া চার্ট: The number of visitors rose between 2001 and 2010.',
          'সাল না থাকা চার্ট: The chart shows how waste is processed.',
          'ভবিষ্যতের পূর্বাভাসসহ চার্ট: Demand is expected to reach 40 million by 2035.',
          'Process diagram: The glass is crushed and then melted.',
          'Task 2-এর যুক্তি: Governments should prioritise public transport.',
        ],
        notes: [
          'Process diagram-এ সাধারণত Present simple passive ব্যবহৃত হয়।',
          'ভবিষ্যতের অনুমান করা সংখ্যার জন্য will, is expected to বা is projected to বসে, Past simple নয়।',
        ],
      },
      {
        id: 'm6-r4',
        heading: 'এক Tense-এ থাকা, আর কারণ থাকলে তবেই বদলানো',
        rule: 'অর্থের দরকার না হলে একই সময়ে থাকুন। আর সত্যিই Tense বদলালে কারণটা যেন পাঠক বুঝতে পারেন।',
        whenToUse: 'লেখা শেষে নিজের লেখা চেক করার সময়।',
        structure: [
          'Unjustified: The government introduced the scheme and spends millions on it.',
          'Fixed: The government introduced the scheme and spent millions on it.',
          'Justified: The government introduced the scheme in 2015, and it still operates today.',
        ],
        notes: [
          'today বা since then-এর মতো সময় বোঝানো শব্দ থাকলে Tense বদলানোর কারণটা পাঠক সহজেই বোঝেন।',
        ],
      },
    ],
    examples: [
      {
        wrong: 'The population has increased dramatically in 1990.',
        right: 'The population increased dramatically in 1990.',
        note: 'নির্দিষ্ট অতীত সাল উল্লেখ থাকলে Past simple লাগে।',
      },
      {
        wrong: 'Since 2010, the city invested heavily in cycling.',
        right: 'Since 2010, the city has invested heavily in cycling.',
        note: 'Since বলছে, সময়টা এখনো চলছে।',
      },
      {
        wrong: 'The graph showed that sales will rise until 2030.',
        right: 'The graph shows that sales will rise until 2030.',
        note: 'চার্টটা এখন আপনার সামনেই আছে, তাই এটা কী দেখাচ্ছে তা Present-এ লিখুন।',
      },
      {
        wrong: 'When the researchers arrived, the experiment already finished.',
        right: 'When the researchers arrived, the experiment had already finished.',
        note: 'অতীতের দুটো ঘটনার মধ্যে যেটা আগে ঘটেছে, সেটা Past perfect-এ বসে।',
      },
      {
        wrong: 'Firstly, the beans are harvested. Then workers dried them.',
        right: 'Firstly, the beans are harvested. They are then dried.',
        note: 'Process বর্ণনা করার সময় পুরোটা একই Tense আর একই Voice-এ লিখুন।',
      },
    ],
    mistakes: [
      {
        wrong: 'Nowadays, people spent more time online than before.',
        right: 'Nowadays, people spend more time online than before.',
        explanation: 'Nowadays বর্তমান সময় বোঝায়, তাই Present simple হবে।',
      },
      {
        wrong: 'In 2020 the figure has reached its highest point.',
        right: 'In 2020 the figure reached its highest point.',
        explanation: 'Present perfect-এর সঙ্গে শেষ হয়ে যাওয়া নির্দিষ্ট সময় বসতে পারে না।',
      },
      {
        wrong: 'If technology will improve, costs will fall.',
        right: 'If technology improves, costs will fall.',
        explanation:
          'First conditional-এর if-clause-এ will বসে না, Present simple বসে।',
      },
      {
        wrong: 'The report was published last year and describes three solutions.',
        right: 'The report, which was published last year, describes three solutions.',
        explanation:
          'শুধু পাশাপাশি বসালে Tense-এর বদলটা গোলমেলে লাগে; Relative Clause ব্যবহার করলে বোঝা যায় যে দুটো আলাদা সময়ের কথা ইচ্ছা করেই বলা হচ্ছে।',
      },
      {
        wrong: 'Since the last decade, air quality improved considerably.',
        right: 'Over the last decade, air quality has improved considerably.',
        explanation:
          'Since-এর পরে নির্দিষ্ট একটা সময় (যেমন 2010) বসে, আর সময়ের দৈর্ঘ্য বোঝাতে over বসে। দুই ক্ষেত্রেই সময়টা এখনো চলছে, তাই Present perfect মানায়।',
      },
    ],
    keyTakeaways: [
      'প্রশ্ন দেখে সময়টা ঠিক করুন, তারপর সেটাতেই থাকুন।',
      'নির্দিষ্ট অতীত সময় মানে Past simple; since থাকলে বা সময় উল্লেখ না থাকলে Present perfect।',
      'চার্ট বা process কী দেখাচ্ছে তা Present-এ লিখুন, আর ডেটাগুলো চার্টের সময় অনুযায়ী।',
      'প্রতিবার Tense বদলানোর পেছনে একটা স্পষ্ট কারণ থাকতে হবে।',
    ],
  },

  /* ------------------------------ Module 7 ----------------------------- */
  {
    moduleId: 7,
    intro:
      'Modal দিয়ে আপনি বোঝান কোনো বিষয়ে আপনি কতটা নিশ্চিত, আর আপনার পরামর্শ কতটা জোরালো। Modal মূলত দুটো কাজ করে: কোনো কিছু কতটা সম্ভব তা বোঝায়, আর কারও কী করা উচিত তা বোঝায়। এই দুটো আলাদা রাখতে পারলে আপনার যুক্তি একপেশে না শুনিয়ে ভারসাম্যপূর্ণ শোনাবে।',
    rules: [
      {
        id: 'm7-r1',
        heading: 'দুটো কাজ: সম্ভাবনা আর বাধ্যবাধকতা',
        rule: 'একই Modal দিয়ে কোনো কিছুর সম্ভাবনা (epistemic) বোঝানো যায়, আবার কী করা জরুরি (deontic) সেটাও বোঝানো যায়। কোন অর্থটা বোঝানো হচ্ছে, সেটা বোঝা যায় context দেখে।',
        whenToUse: 'যখনই আপনি ভবিষ্যতের কথা বলছেন, পরামর্শ দিচ্ছেন বা মতামত দিচ্ছেন।',
        structure: [
          'সম্ভাবনা: This policy may reduce congestion. (এটি সম্ভব)',
          'অনুমতি: Drivers may park here. (এটি অনুমোদিত)',
          'সিদ্ধান্ত: Costs must be rising, given the data. (আমি এই সিদ্ধান্তে আসছি)',
          'বাধ্যবাধকতা: Governments must act. (এটি করা জরুরি)',
        ],
        notes: [
          'এই পরিভাষাগুলো মুখস্থ করার দরকার নেই; শুধু নিজেকে জিজ্ঞেস করার অভ্যাস করুন: আমি কি সম্ভাবনার কথা বলছি, নাকি কী করা উচিত তার কথা?',
        ],
      },
      {
        id: 'm7-r2',
        heading: 'নিশ্চয়তার মাত্রা',
        rule: 'Modal-গুলোকে প্রায় নিশ্চিত থেকে সামান্য সম্ভাবনা পর্যন্ত একটা সিঁড়ির মতো সাজানো যায়। ঠিক ধাপটা বেছে নিলেই আপনার দাবি যুক্তিসঙ্গত থাকে।',
        whenToUse: 'যখন এমন কোনো ফলাফলের কথা বলছেন, যেটা আপনি প্রমাণ করতে পারবেন না।',
        structure: [
          'will - আত্মবিশ্বাসী ভবিষ্যদ্বাণী: Demand will rise.',
          'must - প্রমাণভিত্তিক দৃঢ় সিদ্ধান্ত: The cause must be economic.',
          'should - যুক্তিসঙ্গত প্রত্যাশা: The scheme should reduce delays.',
          'may / might / could - সম্ভাবনা: Automation may displace workers.',
          'cannot - অসম্ভব: This cannot be the only explanation.',
        ],
        table: {
          caption: 'দাবির জোর কতটা',
          headers: ['Modal', 'জোর', 'সাধারণ ব্যবহার'],
          rows: [
            ['will', '95%', 'যে ভবিষ্যদ্বাণীতে আপনি আত্মবিশ্বাসী'],
            ['must', '90%', 'প্রমাণ থেকে পাওয়া যৌক্তিক সিদ্ধান্ত'],
            ['should', '70%', 'যুক্তিসঙ্গত প্রত্যাশা'],
            ['may / might / could', '40%', 'সত্যিকারের সম্ভাবনা'],
            ['could not / cannot', '0%', 'সম্পূর্ণ বাতিল করা'],
          ],
        },
      },
      {
        id: 'm7-r3',
        heading: 'বাধ্যবাধকতা ও পরামর্শ',
        rule: 'Must খুব কড়া, অনেক সময় হুকুমের মতো শোনায়; essay-তে পরামর্শ দেওয়ার স্বাভাবিক শব্দ হলো should।',
        whenToUse: 'সমাধান নিয়ে লেখা paragraph-এ।',
        structure: [
          'Governments should invest in renewable energy.',
          'Schools ought to teach financial literacy.',
          'Companies need to disclose their emissions.',
          'Passengers must carry a valid ticket. (নিয়ম, মতামত নয়)',
          'Students do not have to attend. (বাধ্যবাধকতা নেই)',
        ],
        notes: [
          'Must not মানে করা নিষেধ; do not have to মানে করার দরকার নেই, তবে চাইলে করতে পারেন। দুটো কখনো এক নয়।',
          'যুক্তি দেওয়ার সময় should সাধারণত ভালো পছন্দ, কারণ এটা পরামর্শ দেয়, কিন্তু আইনের মতো শোনায় না।',
        ],
      },
      {
        id: 'm7-r4',
        heading: 'Modal-এর যে নিয়ম কখনো বদলায় না',
        rule: 'Modal-এর পরে সবসময় bare infinitive বসে। Modal-এ -s যোগ হয় না, পরে to বসে না, আর দুটো Modal পাশাপাশি বসতে পারে না।',
        whenToUse: 'সবসময়।',
        structure: [
          'modal + base verb: should invest',
          'modal + be + -ing: may be rising',
          'modal + have + past participle: might have caused',
          'modal + be + past participle: should be introduced',
        ],
        notes: [
          'should to invest, musts, will can, should invests - এগুলোর কোনোটিই হয় না।',
          'অতীতের সম্ভাবনা বোঝাতে might have + participle বসে: The delay might have been caused by funding cuts.',
        ],
      },
    ],
    examples: [
      {
        wrong: 'Governments must to reduce emissions.',
        right: 'Governments must reduce emissions.',
        note: 'Modal-এর পরে bare infinitive বসে।',
      },
      {
        wrong: 'This policy will definitely solve all social problems.',
        right: 'This policy could address several of these problems.',
        note: 'চরম দাবির চেয়ে মেপে করা দাবির পক্ষে যুক্তি দেওয়া অনেক সহজ।',
      },
      {
        wrong: 'Students should to be encouraged to read widely.',
        right: 'Students should be encouraged to read widely.',
        note: 'Modal + be + past participle দিয়ে modal passive হয়।',
      },
      {
        wrong: 'The rise might caused by population growth.',
        right: 'The rise might have been caused by population growth.',
        note: 'অতীতের সম্ভাবনায় might have been + participle বসে।',
      },
      {
        wrong: 'Employees must not work overtime if they do not want to.',
        right: 'Employees do not have to work overtime if they do not want to.',
        note: 'Must not মানে নিষেধ; do not have to মানে বাধ্যবাধকতা নেই।',
      },
    ],
    mistakes: [
      {
        wrong: 'The government should to introduce stricter laws.',
        right: 'The government should introduce stricter laws.',
        explanation: 'Modal-এর পরে কখনোই to বসে না।',
      },
      {
        wrong: 'It will can solve the problem.',
        right: 'It will be able to solve the problem.',
        explanation: 'দুটো Modal পাশাপাশি বসে না; দ্বিতীয়টার জায়গায় be able to ব্যবহার করুন।',
      },
      {
        wrong: 'Technology must improves education.',
        right: 'Technology must improve education.',
        explanation: 'Modal-এর পরের Verb-এ কখনো -s যোগ হয় না।',
      },
      {
        wrong: 'Children may to watch television after finishing homework.',
        right: 'Children may watch television after finishing homework.',
        explanation: 'অনুমতি বোঝানোর সময়ও একই bare infinitive নিয়ম খাটে।',
      },
      {
        wrong: 'This evidence must proves that the theory is correct.',
        right: 'This evidence suggests that the theory is correct.',
        explanation:
          'গঠনের ভুল তো আছেই, তার উপর must দিয়ে এমন জোরালো দাবি করা হয়েছে, যেটা মাত্র একটা প্রমাণ দিয়ে করা যায় না।',
      },
    ],
    keyTakeaways: [
      'Modal বাছার আগে ভাবুন: আপনি সম্ভাবনা বোঝাচ্ছেন, নাকি বাধ্যবাধকতা?',
      'Essay-তে পরামর্শ দিতে should স্বাভাবিক; must রাখুন নিয়মকানুনের জন্য।',
      'Modal + bare infinitive; কোনো to নয়, -s নয়, দুটো Modal একসঙ্গে নয়।',
      'may, might আর could ব্যবহার করে এমন দাবি করুন, যার পক্ষে আপনি সত্যিই যুক্তি দিতে পারবেন।',
    ],
  },

  /* ------------------------------ Module 8 ----------------------------- */
  {
    moduleId: 8,
    intro:
      'Passive হলো ফোকাস বদলানোর একটা কৌশল। কাজটা যার উপর হয়েছে, Passive তাকে Subject-এর জায়গায় নিয়ে আসে। এটা দরকার তখনই, যখন কে কাজটা করেছে তা অজানা, স্পষ্ট বা অদরকারি। তবে লেখাকে ভারী বা পণ্ডিতি দেখানোর জন্য Passive নয়; পুরো paragraph passive-এ লিখলে পড়া কঠিন হয়, সুন্দর হয় না।',
    rules: [
      {
        id: 'm8-r1',
        heading: 'Passive কীভাবে গঠিত হয়',
        rule: 'Passive-এর গঠন: be + past participle। Tense বোঝানোর কাজটা করে be, তাই participle কখনো বদলায় না।',
        whenToUse: 'যখন কে কাজটা করেছে তার চেয়ে কার উপর কাজটা হয়েছে, সেটা বেশি গুরুত্বপূর্ণ।',
        structure: [
          'Present simple: The data are collected annually.',
          'Past simple: The scheme was introduced in 2015.',
          'Present perfect: Several studies have been conducted.',
          'Future: A new system will be installed.',
          'Modal: Emissions should be reduced.',
          'Continuous: The road is being widened.',
        ],
        table: {
          caption: 'Active থেকে Passive',
          headers: ['Tense', 'Active', 'Passive'],
          rows: [
            ['Present', 'They collect the data.', 'The data are collected.'],
            ['Past', 'They built the bridge.', 'The bridge was built.'],
            ['Present perfect', 'They have tested it.', 'It has been tested.'],
            ['Modal', 'They must review it.', 'It must be reviewed.'],
          ],
        },
      },
      {
        id: 'm8-r2',
        heading: 'Agent বাদ দেওয়া',
        rule: 'by + agent তখনই দিন, যখন কে কাজটা করেছে তা জানা পাঠকের জন্য দরকারি। Academic লেখায় বেশিরভাগ সময় এটা বাদ যায়।',
        whenToUse: 'Process, গবেষণার পদ্ধতি আর সাধারণ বক্তব্যে।',
        structure: [
          'কর্তা অজানা: The documents were destroyed.',
          'কর্তা স্পষ্ট: The suspect was arrested. (by the police)',
          'কর্তা অপ্রাসঙ্গিক: The samples were stored at 4 degrees.',
          'কর্তার নামটাই গুরুত্বপূর্ণ তথ্য: The theory was first proposed by Chomsky.',
        ],
        notes: [
          'Academic writing-এ প্রতি পাঁচটা passive-এর মধ্যে প্রায় চারটাতেই কোনো by-phrase থাকে না।',
        ],
      },
      {
        id: 'm8-r3',
        heading: 'নাম না বলে মত জানানো (Impersonal reporting)',
        rule: 'এই দুটো গঠন দিয়ে কারও নাম না বলেই প্রচলিত মত জানাতে পারেন।',
        whenToUse: 'Essay-তে সাধারণ মত বা প্রতিষ্ঠিত গবেষণার ফল সংক্ষেপে বলার সময়।',
        structure: [
          'It + passive + that-clause: It is argued that automation will reduce employment.',
          'Subject + passive + to-infinitive: Automation is believed to reduce employment.',
          'যেসব Verb বেশি ব্যবহৃত হয়: argue, believe, claim, think, say, expect, consider, report, know.',
        ],
        notes: [
          'এগুলো কাজের, তবে খুব চোখে পড়ে। একটা essay-তে এক-দুইবারই যথেষ্ট।',
          'দ্বিতীয় গঠনে to-infinitive লাগবে: X is believed to be..., কখনো X is believed that... নয়।',
        ],
      },
      {
        id: 'm8-r4',
        heading: 'কখন Active ভালো',
        rule: 'যখন কে কাজটা করছে সেটাই মূল কথা, অথবা passive দিলে দায়িত্বটা কার তা লুকিয়ে যায় বা অকারণে শব্দ বাড়ে, তখন Active ব্যবহার করুন।',
        whenToUse: 'বেশিরভাগ সময়েই।',
        structure: [
          'Weak: It was decided by the committee that the project would be cancelled.',
          'Better: The committee cancelled the project.',
          'Weak: Mistakes were made.',
          'Better: The department made several mistakes.',
        ],
        notes: [
          'Task 2-তে কারা কাজটা করবে তা সাধারণত স্পষ্ট: governments, schools, employers। তাদের নামটাই সরাসরি লিখুন।',
        ],
      },
    ],
    examples: [
      {
        wrong: 'The report was wrote by a team of researchers.',
        right: 'The report was written by a team of researchers.',
        note: 'Passive-এ past simple নয়, past participle লাগে।',
      },
      {
        wrong: 'The new policy will be introduce next year.',
        right: 'The new policy will be introduced next year.',
        note: 'Modal-এর পরেও গঠনটা be + past participle।',
      },
      {
        wrong: 'It is believed that technology to improve productivity.',
        right: 'It is believed that technology improves productivity.',
        note: 'It is believed that-এর পরে একটা পূর্ণ Clause বসে।',
      },
      {
        wrong: 'The glass is crushing and then melted.',
        right: 'The glass is crushed and then melted.',
        note: 'Process-এর ধাপগুলোতে ধারাবাহিকভাবে passive বসে।',
      },
      {
        wrong: 'The problem was happened last year.',
        right: 'The problem occurred last year.',
        note: 'happen-এর মতো Intransitive Verb (যার Object হয় না)-এর কোনো passive রূপ নেই।',
      },
    ],
    mistakes: [
      {
        wrong: 'The results were showed in the second graph.',
        right: 'The results were shown in the second graph.',
        explanation: 'Shown হলো participle, আর showed হলো past simple।',
      },
      {
        wrong: 'Many changes have been occurred since then.',
        right: 'Many changes have occurred since then.',
        explanation:
          'occur, happen, rise, arrive ও exist-এর কোনো Object নেই, তাই এগুলো passive হতে পারে না।',
      },
      {
        wrong: 'It is said that the policy to be effective.',
        right: 'The policy is said to be effective.',
        explanation:
          'যেকোনো একটা গঠন বেছে নিন: It is said that the policy is effective, অথবা The policy is said to be effective.',
      },
      {
        wrong: 'The decision was made by the government to increase the tax by them.',
        right: 'The government decided to increase the tax.',
        explanation:
          'Passive করায় চারটা বাড়তি শব্দ এসেছে, আর কর্তাকেও আবার বলতে হয়েছে। Active রূপটাই বেশি পরিষ্কার।',
      },
      {
        wrong: 'Air pollution is effected by traffic volume.',
        right: 'Air pollution is affected by traffic volume.',
        explanation:
          'Affect হলো Verb আর effect হলো Noun। Passive গঠনটা নিজে ঠিকই ছিল।',
      },
    ],
    keyTakeaways: [
      'be + past participle; Tense বোঝায় be।',
      'কর্তার নাম পাঠককে নতুন কিছু না জানালে by-phrase বাদ দিন।',
      'It is argued that... কাজের গঠন, তবে অল্প ব্যবহার করুন।',
      'কর্তা গুরুত্বপূর্ণ হলে Active voice-এ লিখুন।',
    ],
  },

  /* ------------------------------ Module 9 ----------------------------- */
  {
    moduleId: 9,
    intro:
      'প্রতিটি Verb-এর পরে একটা নির্দিষ্ট গঠন বসে: কখনো gerund, কখনো infinitive, কখনো Object + infinitive, আবার কখনো that-clause। অর্থ দেখে এগুলো আন্দাজ করা যায় না, তাই Verb আর তার গঠন একসঙ্গে শিখতে হয়। ভালো খবর হলো, essay-তে যা লাগে তার প্রায় পুরোটাই কয়েক ডজন Verb দিয়েই হয়ে যায়।',
    rules: [
      {
        id: 'm9-r1',
        heading: 'Verb + gerund (-ing রূপ)',
        rule: 'কিছু পরিচিত Verb-এর পরে সবসময় -ing রূপ বসে, কখনো to বসে না।',
        whenToUse: 'এড়ানো, চালিয়ে যাওয়া, প্রস্তাব দেওয়া আর বিবেচনা করা বোঝায় এমন Verb-এর সঙ্গে।',
        structure: [
          'avoid, consider, suggest, involve, risk, delay, deny, mind, practise, enjoy, keep, finish',
          'Governments should avoid raising taxes too quickly.',
          'The plan involves building three new schools.',
          'Critics suggest reviewing the policy.',
        ],
        notes: [
          'Suggest নিয়েই সবচেয়ে বেশি ভুল হয়: suggest doing অথবা suggest that someone do, কিন্তু কখনোই suggest to do নয়।',
        ],
      },
      {
        id: 'm9-r2',
        heading: 'Verb + to-infinitive (to সহ ক্রিয়া)',
        rule: 'আরেক দল Verb-এর পরে বসে to + base form।',
        whenToUse: 'ইচ্ছা, প্রবণতা আর চেষ্টা বোঝায় এমন Verb-এর সঙ্গে।',
        structure: [
          'tend, aim, fail, hope, plan, decide, attempt, refuse, manage, afford, offer, seek, choose',
          'Young people tend to spend more time online.',
          'The scheme aims to cut emissions by half.',
          'Many countries have failed to meet their targets.',
        ],
      },
      {
        id: 'm9-r3',
        heading: 'Verb + object + to-infinitive (মাঝে Object বসে)',
        rule: 'কিছু Verb-এর পরে infinitive-এর আগে একজন ব্যক্তি বা কোনো কিছু বসাতেই হয়; এই Object বাদ দেওয়া যায় না।',
        whenToUse: 'যখন কেউ অন্য কাউকে দিয়ে কিছু করায়, বা করার সুযোগ দেয়।',
        structure: [
          'allow, enable, encourage, force, require, persuade, advise, expect, cause, lead',
          'Technology enables students to learn remotely.',
          'The law requires companies to publish their emissions.',
          'This allows people to work from home.',
        ],
        notes: [
          'This allows to work from home লেখা যাবে না। Object বসানো বাধ্যতামূলক।',
          'Make ও let-এর পরে bare infinitive বসে: This makes people work harder.',
        ],
        table: {
          caption: 'যে গঠনগুলোতে শিক্ষার্থীরা সবচেয়ে বেশি আটকায়',
          headers: ['Verb', 'গঠন', 'উদাহরণ'],
          rows: [
            ['allow', 'allow sb to do', 'allow students to choose'],
            ['prevent', 'prevent sb from doing', 'prevent people from smoking'],
            ['suggest', 'suggest doing / that...', 'suggest reviewing the rule'],
            ['recommend', 'recommend doing / that...', 'recommend introducing a tax'],
            ['look forward to', 'to + -ing', 'look forward to receiving'],
            ['succeed in', 'in + -ing', 'succeed in reducing waste'],
          ],
        },
      },
      {
        id: 'm9-r4',
        heading: 'Preposition + gerund এবং Adjective + infinitive',
        rule: 'Preposition-এর ঠিক পরে কোনো Verb বসলে সেটা সবসময় -ing রূপ নেয়। আর মতামত বোঝানো Adjective (important, difficult)-এর পরে to-infinitive বসে।',
        whenToUse: 'প্রায় প্রতিটি complex বাক্যেই।',
        structure: [
          'preposition + -ing: interested in learning, capable of solving, responsible for managing',
          'prevent / stop / discourage sb from doing',
          'adjective + to-infinitive: difficult to measure, likely to increase, important to consider',
          'It is + adjective + to-infinitive: It is essential to act now.',
        ],
        notes: [
          'look forward to ও be used to-এর to আসলে Preposition, তাই এর পরে -ing বসে: used to working late.',
          'পার্থক্যটা খেয়াল করুন: used to work মানে আগে করতাম (অতীতের অভ্যাস), আর be used to working মানে কোনো কিছুতে অভ্যস্ত।',
        ],
      },
    ],
    examples: [
      {
        wrong: 'The report suggests to increase the budget.',
        right: 'The report suggests increasing the budget.',
        note: 'Suggest-এর পরে gerund বা that-clause বসে।',
      },
      {
        wrong: 'This policy allows to reduce traffic.',
        right: 'This policy allows cities to reduce traffic.',
        note: 'Allow-এর পরে infinitive-এর আগে একটা Object লাগে।',
      },
      {
        wrong: 'They avoided to answer the question.',
        right: 'They avoided answering the question.',
        note: 'Avoid-এর পরে সবসময় -ing বসে।',
      },
      {
        wrong: 'The law prevents companies to pollute rivers.',
        right: 'The law prevents companies from polluting rivers.',
        note: 'Prevent-এর গঠন হলো from + -ing।',
      },
      {
        wrong: 'Students are capable to solve complex problems.',
        right: 'Students are capable of solving complex problems.',
        note: 'Capable-এর পরে of + -ing বসে।',
      },
    ],
    mistakes: [
      {
        wrong: 'I would recommend to study abroad.',
        right: 'I would recommend studying abroad.',
        explanation: 'Recommend-এর গঠন suggest-এর মতোই।',
      },
      {
        wrong: 'The government should focus to improve healthcare.',
        right: 'The government should focus on improving healthcare.',
        explanation: 'Focus-এর সঙ্গে on বসে, আর Preposition-এর পরে -ing বাধ্যতামূলক।',
      },
      {
        wrong: 'Technology enables to communicate instantly.',
        right: 'Technology enables people to communicate instantly.',
        explanation: 'allow আর require-এর মতো enable-এরও একটা Object লাগে।',
      },
      {
        wrong: 'She is looking forward to hear from you.',
        right: 'She is looking forward to hearing from you.',
        explanation:
          'এখানকার to কোনো infinitive-এর অংশ নয়, এটা একটা Preposition, তাই পরে -ing বসে।',
      },
      {
        wrong: 'It is difficult measuring happiness objectively.',
        right: 'It is difficult to measure happiness objectively.',
        explanation: 'It is-এর পরে মতামত বোঝানো Adjective থাকলে to-infinitive বসে।',
      },
    ],
    keyTakeaways: [
      'Verb আর তার পরের গঠনটা একসঙ্গে, এক প্যাকেজ হিসেবে শিখুন।',
      'avoid, suggest, consider, involve ও risk-এর পরে -ing বসে।',
      'allow, enable, encourage আর require-এর পরে to-এর আগে একটা Object লাগে।',
      'Preposition-এর পরে যেকোনো Verb -ing রূপ নেয়, এমনকি look forward to-এর পরেও।',
    ],
  },

  /* ----------------------------- Module 10 ----------------------------- */
  {
    moduleId: 10,
    intro:
      'কোন Preposition বসবে, তা ঠিক হয় আগের শব্দটা দেখে, যুক্তি দিয়ে নয়। কেন an increase in হয় অথচ an impact on, তার কোনো ব্যাখ্যা নেই; জোড়াগুলো শুধু মনে রাখতে হয়। Task 1-এ এগুলোর গুরুত্ব অনেক: rose by আর rose to একেবারে আলাদা দুটো সংখ্যা বোঝায়।',
    rules: [
      {
        id: 'm10-r1',
        heading: 'Noun + preposition',
        rule: 'Academic Noun-গুলোর সঙ্গে নির্দিষ্ট Preposition বসে। শুধু Noun নয়, পুরো জোড়াটা শিখুন।',
        whenToUse: 'যে বাক্যেই দুটো জিনিসের সম্পর্ক বোঝাবেন, সেখানেই।',
        structure: [
          'an increase / rise / fall / decline / reduction IN something',
          'an impact / effect / influence ON something',
          'access / solution / approach / damage TO something',
          'a reason / need / demand FOR something',
          'a lack / cause / risk OF something',
          'a relationship / difference / link BETWEEN two things',
        ],
        table: {
          caption: 'সবচেয়ে বেশি লাগে এমন জোড়া',
          headers: ['Noun', 'Preposition', 'উদাহরণ'],
          rows: [
            ['increase, decline', 'in', 'a sharp increase in rainfall'],
            ['impact, effect', 'on', 'a strong effect on health'],
            ['access, solution', 'to', 'access to clean water'],
            ['reason, demand', 'for', 'the reason for the delay'],
            ['cause, risk', 'of', 'the risk of flooding'],
            ['relationship, link', 'between', 'the link between diet and illness'],
          ],
        },
      },
      {
        id: 'm10-r2',
        heading: 'Verb + preposition',
        rule: 'অনেক Academic Verb-এর পরে নির্দিষ্ট একটা Preposition বসাতে হয়।',
        whenToUse: 'কারণ, নির্ভরতা আর দায়িত্ব বোঝানোর সময়।',
        structure: [
          'result in / result from',
          'depend on, rely on, focus on, concentrate on',
          'contribute to, lead to, respond to, refer to',
          'suffer from, benefit from, result from',
          'deal with, cope with, associate with',
        ],
        notes: [
          'Result in দিয়ে ফলাফল বোঝায়, আর result from দিয়ে কারণ। Congestion results in pollution; pollution results from congestion.',
          'discuss, mention, consider ও affect-এর পরে কোনো Preposition বসে না: discuss the issue লিখুন, discuss about the issue নয়।',
        ],
      },
      {
        id: 'm10-r3',
        heading: 'Adjective + preposition',
        rule: 'Adjective-গুলোরও নিজস্ব Preposition আছে।',
        whenToUse: 'মতামত দেওয়ার বাক্যে।',
        structure: [
          'responsible for, suitable for, essential for',
          'aware of, capable of, typical of, characteristic of',
          'similar to, related to, due to, relevant to',
          'different from, free from',
          'concerned about, consistent with',
        ],
      },
      {
        id: 'm10-r4',
        heading: 'Task 1-এ পরিবর্তন বোঝানোর গঠন',
        rule: 'চারটা গঠন চার রকম তথ্য দেয়। এগুলো গুলিয়ে ফেললে আপনি ভুল সংখ্যাই লিখে ফেলবেন।',
        whenToUse: 'যতবার কোনো সংখ্যার পরিবর্তন বর্ণনা করবেন।',
        structure: [
          'rise / fall BY - পরিবর্তনের পরিমাণ: Sales rose by 20 per cent.',
          'rise / fall TO - শেষ মান: Sales rose to 80 million.',
          'rise / fall FROM X TO Y: Sales rose from 60 to 80 million.',
          'peak / stand / remain AT - নির্দিষ্ট একটা মান: Sales peaked at 90 million.',
        ],
        table: {
          caption: 'পরিবর্তন কীভাবে লিখবেন',
          headers: ['গঠন', 'যা বোঝায়', 'উদাহরণ'],
          rows: [
            ['by', 'পরিবর্তনের পরিমাণ', 'fell by 15 per cent'],
            ['to', 'শেষ মান', 'fell to 15 per cent'],
            ['from... to...', 'শুরু ও শেষ', 'fell from 30 to 15 per cent'],
            ['at', 'নির্দিষ্ট একটা মান', 'peaked at 30 per cent'],
            ['between... and...', 'কতটা সময় জুড়ে', 'between 2000 and 2010'],
            ['in / over', 'একটা সাল / একটা সময়কাল', 'in 2005; over the decade'],
          ],
        },
        notes: [
          'An increase of 20 per cent মানে কতটা বেড়েছে; an increase to 20 per cent মানে বেড়ে কোথায় পৌঁছেছে।',
        ],
      },
    ],
    examples: [
      {
        wrong: 'There was a sharp increase of the number of tourists.',
        right: 'There was a sharp increase in the number of tourists.',
        note: 'Increase in দিয়ে বোঝায় কী বেড়েছে; increase of দিয়ে বোঝায় কতটা বেড়েছে।',
      },
      {
        wrong: 'Social media has a huge impact in young people.',
        right: 'Social media has a huge impact on young people.',
        note: 'Impact-এর সঙ্গে সবসময় on বসে।',
      },
      {
        wrong: 'The figure rose to 20 per cent between 2000 and 2010, from 40 to 60 million.',
        right: 'The figure rose by 20 per cent between 2000 and 2010, from 40 to 48 million.',
        note: 'পরিবর্তনের পরিমাণে by, আর শুরু-শেষ বোঝাতে from... to... ব্যবহার করুন।',
      },
      {
        wrong: 'Many countries are suffering of water shortages.',
        right: 'Many countries are suffering from water shortages.',
        note: 'Suffer-এর সঙ্গে from বসে।',
      },
      {
        wrong: 'The essay discusses about three solutions.',
        right: 'The essay discusses three solutions.',
        note: 'Discuss সরাসরি Object নেয়, কোনো Preposition ছাড়াই।',
      },
    ],
    mistakes: [
      {
        wrong: 'This leads to people become unemployed.',
        right: 'This leads to people becoming unemployed.',
        explanation:
          'lead to-এর to একটা Preposition, তাই এর পরের Verb -ing রূপ নেয়।',
      },
      {
        wrong: 'Unemployment is one of the main reasons of crime.',
        right: 'Unemployment is one of the main reasons for crime.',
        explanation: 'Reason-এর সঙ্গে for বসে। The cause of crime লিখলেও চলত।',
      },
      {
        wrong: 'The results are different than the ones reported in 2019.',
        right: 'The results are different from the ones reported in 2019.',
        explanation:
          'Academic English-এ different from স্বাভাবিক; different than মূলত আমেরিকান কথ্য রূপ।',
      },
      {
        wrong: 'Consumption peaked to 90 million units.',
        right: 'Consumption peaked at 90 million units.',
        explanation: 'peak, stand আর remain - তিনটার সঙ্গেই at বসে।',
      },
      {
        wrong: 'Students should concentrate in their studies.',
        right: 'Students should concentrate on their studies.',
        explanation: 'concentrate, focus, depend ও rely - সবগুলোর সঙ্গেই on বসে।',
      },
    ],
    keyTakeaways: [
      'Noun ও তার Preposition একসঙ্গে মুখস্থ করুন: increase in, impact on, access to।',
      'Result in-এর পরে আসে ফলাফল, আর result from-এর পরে আসে কারণ।',
      'discuss, affect, mention ও consider-এর পরে কোনো Preposition বসে না।',
      'By = কতটা বদলেছে; to = শেষে কত হয়েছে; at = নির্দিষ্ট একটা মান।',
    ],
  },

  /* ----------------------------- Module 11 ----------------------------- */
  {
    moduleId: 11,
    intro:
      'Academic Task 1 শুরু থেকে শেষ পর্যন্ত তুলনাই, আর Task 2-তেও বারবার এক বিকল্পের সঙ্গে আরেকটার তুলনা করতে হয়। তুলনার ভুলে ক্ষতি দ্বিগুণ: ভুল গুণ (যেমন twice, three times) লিখলে শুধু ভাষা খারাপ হয় না, আপনি ভুল তথ্যও লিখে ফেলেন।',
    rules: [
      {
        id: 'm11-r1',
        heading: 'Comparative ও Superlative গঠন',
        rule: 'এক syllable-এর Adjective-এ -er আর -est বসে। লম্বা Adjective-এ more আর most বসে। দুটো একসঙ্গে কখনো নয়।',
        whenToUse: 'যখনই দুই বা তার বেশি জিনিসের মধ্যে কোনটা বেশি বা কম তা বোঝাবেন।',
        structure: [
          'এক syllable: high - higher - the highest',
          'দুই syllable, শেষে -y: easy - easier - the easiest',
          'লম্বা শব্দ: expensive - more expensive - the most expensive',
          'অনিয়মিত: good - better - best; bad - worse - worst; far - further - furthest',
        ],
        notes: [
          'more higher বা most highest কখনোই হয় না।',
          'Superlative-এর আগে the বসে: the largest proportion.',
        ],
      },
      {
        id: 'm11-r2',
        heading: 'সমান আর কয়েক গুণ বোঝানো',
        rule: 'সমান বোঝাতে as + adjective + as ব্যবহার করুন, আর কয় গুণ (twice, three times) তা প্রথম as-এর আগে বসান।',
        whenToUse: 'যখন একটা সংখ্যা আরেকটার কয়েক গুণ।',
        structure: [
          'as high as, not as high as',
          'twice as many cars as',
          'three times as expensive as',
          'three times the number of cars',
          'half as many visitors as',
        ],
        table: {
          caption: 'কয় গুণ, তা লেখার দুটো উপায়',
          headers: ['as...as দিয়ে', 'the + noun দিয়ে'],
          rows: [
            ['twice as many students as', 'twice the number of students'],
            ['three times as high as', 'three times the height of'],
            ['half as much energy as', 'half the amount of energy'],
          ],
        },
        notes: [
          'Countable Noun-এর সঙ্গে many আর Uncountable Noun-এর সঙ্গে much বসে।',
          'three times as many as বোঝাতে three times more than লিখবেন না; three times more than-এর অর্থ অস্পষ্ট।',
        ],
      },
      {
        id: 'm11-r3',
        heading: 'পার্থক্য কতটা, তা বোঝানো',
        rule: 'Comparative-এর আগে বসা Adverb বলে দেয় পার্থক্যটা কত বড়।',
        whenToUse: 'একই রকম সাদামাটা তুলনা বারবার না লিখে বৈচিত্র্য আনতে।',
        structure: [
          'বড় পার্থক্য: significantly, considerably, substantially, far, much',
          'ছোট পার্থক্য: slightly, marginally, somewhat, a little',
          'উদাহরণ: significantly higher, slightly more expensive, far less common',
        ],
        notes: [
          'very বসে সাধারণ Adjective-এর সঙ্গে, Comparative-এর সঙ্গে নয়: very high ঠিক, কিন্তু much higher লিখতে হয়।',
        ],
      },
      {
        id: 'm11-r4',
        heading: 'পরিমাণ, শতকরা ও পরিবর্তন',
        rule: 'একটা সংখ্যাকে অনুপাত, ভগ্নাংশ বা পরিবর্তন হিসেবে লেখা যায়। প্রতিটার নিজস্ব গঠন আছে।',
        whenToUse: 'পুরো Task 1 জুড়েই।',
        structure: [
          'অনুপাত: 40 per cent of respondents; the proportion of women rose.',
          'ভগ্নাংশ: a quarter of the sample; two thirds of all households.',
          'সংখ্যাগরিষ্ঠতা: the vast majority of; a small minority of.',
          'Adjective + noun: a sharp rise, a slight decline, a steady increase, a dramatic fall.',
          'Verb + adverb: rose sharply, fell slightly, increased steadily, declined dramatically.',
        ],
        table: {
          caption: 'একই তথ্য, দুই রকম গঠন',
          headers: ['Noun phrase', 'Verb phrase'],
          rows: [
            ['There was a sharp rise in sales.', 'Sales rose sharply.'],
            ['A slight decline occurred in 2010.', 'The figure declined slightly in 2010.'],
            ['The graph shows a steady increase.', 'The figure increased steadily.'],
          ],
        },
        notes: [
          'Noun-এর আগে Adjective, আর Verb-এর পরে Adverb। rose sharp বা a sharply rise লেখা পরিষ্কার ভুল।',
          'Uncountable Noun-এর সঙ্গে শতকরা একবচন Verb নেয়, আর বহুবচন Noun-এর সঙ্গে বহুবচন Verb: 40 per cent of the water is..., 40 per cent of students are...',
        ],
      },
    ],
    examples: [
      {
        wrong: 'The second city is more bigger than the first.',
        right: 'The second city is much bigger than the first.',
        note: '-er রূপের সঙ্গে কখনো more বসে না।',
      },
      {
        wrong: 'There were twice more visitors in July than in January.',
        right: 'There were twice as many visitors in July as in January.',
        note: 'কয় গুণ, তা বোঝাতে as...as গঠন ব্যবহার করুন।',
      },
      {
        wrong: 'Sales increased sharp between 2010 and 2015.',
        right: 'Sales increased sharply between 2010 and 2015.',
        note: 'Verb-কে বর্ণনা করে Adverb।',
      },
      {
        wrong: 'The figure for Spain was the most highest of all.',
        right: 'The figure for Spain was the highest of all.',
        note: 'একটা superlative চিহ্নই যথেষ্ট।',
      },
      {
        wrong: 'Three quarters of the energy are produced by coal.',
        right: 'Three quarters of the energy is produced by coal.',
        note: 'Energy uncountable, তাই Verb একবচন।',
      },
    ],
    mistakes: [
      {
        wrong: 'China has the larger population in the world.',
        right: 'China has the largest population in the world.',
        explanation:
          'সবার সঙ্গে তুলনা করতে হলে comparative নয়, superlative লাগে।',
      },
      {
        wrong: 'Car ownership is higher than 1990.',
        right: 'Car ownership is higher than it was in 1990.',
        explanation:
          'একই ধরনের জিনিসের মধ্যে তুলনা করুন: একটা সংখ্যার সঙ্গে আরেকটা সংখ্যা, কোনো সালের সঙ্গে নয়।',
      },
      {
        wrong: 'There was a slightly increase in unemployment.',
        right: 'There was a slight increase in unemployment.',
        explanation: 'Noun-এর আগে Adverb নয়, Adjective বসে।',
      },
      {
        wrong: 'The number of users was more high in urban areas.',
        right: 'The number of users was higher in urban areas.',
        explanation: 'High ছোট Adjective, তাই এতে -er বসে।',
      },
      {
        wrong: 'Japan spent three times more money than Italy did on research.',
        right: 'Japan spent three times as much money on research as Italy did.',
        explanation:
          'Three times more দিয়ে তিন গুণ নাকি চার গুণ বোঝাচ্ছে, তা পরিষ্কার নয়; as...as গঠনটাই নির্ভুল।',
      },
    ],
    keyTakeaways: [
      'প্রতিটি Adjective-এ comparative চিহ্ন একটাই: হয় -er, নয়তো more।',
      'কয় গুণ বোঝাতে twice / three times + as...as, অথবা + the number of ব্যবহার করুন।',
      'Noun-এর আগে Adjective, Verb-এর পরে Adverb: a sharp rise, rose sharply।',
      'একই ধরনের জিনিসের মধ্যে তুলনা করুন, আর কীসের সঙ্গে তুলনা করছেন তা স্পষ্ট করে লিখুন।',
    ],
  },
]
