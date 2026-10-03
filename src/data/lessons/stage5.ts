import type { Lesson } from '@/types'

export const stage5Lessons: Lesson[] = [
  /* ----------------------------- Module 23 ----------------------------- */
  {
    moduleId: 23,
    intro:
      'এই মডিউলটি নতুন কোনো ব্যাকরণ নয়, বরং সম্পাদনার একটি তালিকা। এখানকার সবকিছুই আপনি করবেন লেখা শেষ হওয়ার পরে: যা কিছু বাড়তি তা কেটে ফেলা, modifier-কে সঠিক শব্দের পাশে বসানো, আর Subject ও Verb-কে কাছাকাছি রাখা। পরীক্ষার চাপেও এই অভ্যাসগুলো ভুল কমায়, কারণ ছোট ও নিয়ন্ত্রিত বাক্যে ভুল কম হয়।',
    rules: [
      {
        id: 'm23-r1',
        heading: 'বাড়তি শব্দ কেটে ফেলুন',
        rule: 'কিছু প্রচলিত phrase লেখার দৈর্ঘ্য বাড়ায়, অর্থ বাড়ায় না। এগুলোর জায়গায় একটি শব্দ বসান।',
        whenToUse:
          'প্রতিটি খসড়ায়, এমনকি পরীক্ষার হলে হাতে দুই মিনিট থাকলেও।',
        structure: [
          'due to the fact that -> because',
          'in spite of the fact that -> although',
          'at this point in time -> now',
          'in the event that -> if',
          'has the ability to -> can',
          'a large number of -> many',
          'in order to -> to',
          'it is important to note that -> প্রায়ই পুরোটাই বাদ দেওয়া যায়',
        ],
        table: {
          caption: 'লম্বা ও সংক্ষিপ্ত রূপ',
          headers: ['বাড়তি শব্দে ভরা', 'সংক্ষিপ্ত'],
          rows: [
            ['There are many people who believe', 'Many people believe'],
            ['The reason why this happens is because', 'This happens because'],
            ['In todays modern world', 'Today'],
            ['make a decision about', 'decide'],
            ['conduct an investigation into', 'investigate'],
          ],
        },
        notes: [
          'Verb থেকে বানানো Noun প্রায়ই আসল কাজটিকে আড়াল করে রাখে: make a decision হয়ে যায় decide। Module 18-এর nominalization বেশি দূর এগিয়ে গেলে এভাবেই ফিরিয়ে আনতে হয়।',
        ],
      },
      {
        id: 'm23-r2',
        heading: 'Subject ও Verb কাছাকাছি রাখুন',
        rule: 'Subject আর তার Verb-এর মাঝে লম্বা ফাঁক থাকলে পাঠককে Subject-টি মনে রাখতে হয়, আর agreement-এর ভুল হওয়ার আশঙ্কাও বেড়ে যায়।',
        whenToUse: 'Subject-এর পরে যখন আট শব্দের বেশি লম্বা কোনো অংশ বসে।',
        structure: [
          'Hard: The policy, which was introduced in 2015 after a lengthy consultation involving several agencies, failed.',
          'Better: The policy failed, despite a lengthy consultation involving several agencies before its introduction in 2015.',
          'Better: Introduced in 2015 after a lengthy consultation, the policy failed.',
        ],
      },
      {
        id: 'm23-r3',
        heading: 'Modifier-কে তার নিজের শব্দের পাশে বসান',
        rule: 'Modifier সবচেয়ে কাছের শব্দটির সঙ্গে জুড়ে যায়। সেটি যদি আপনার উদ্দিষ্ট শব্দ না হয়, তবে modifier-টি সরিয়ে দিন।',
        whenToUse: 'only, almost, nearly, just এবং প্রতিটি বর্ণনামূলক phrase যাচাই করুন।',
        structure: [
          'Only the committee approved the plan. (আর কেউ অনুমোদন করেনি)',
          'The committee only approved the plan. (তারা এর বেশি কিছু করেনি)',
          'The committee approved only the plan. (আর কিছুই অনুমোদিত হয়নি)',
          'Misplaced: The minister announced a plan to reduce emissions on Tuesday.',
          'Fixed: On Tuesday the minister announced a plan to reduce emissions.',
        ],
        notes: [
          'only-কে ঠিক সেই অংশের আগে বসান, যাকে এটি সীমিত করছে।',
          'বাক্যের শেষে বসা সময় বা স্থানবাচক phrase কাছের Noun-এর সঙ্গে জুড়ে যায়, আর প্রায়ই সেটি ভুল Noun হয়।',
        ],
      },
      {
        id: 'm23-r4',
        heading: 'বাক্যের দৈর্ঘ্য নিয়ন্ত্রণে রাখুন',
        rule: 'দৈর্ঘ্যে বৈচিত্র্য আনুন, তবে সবচেয়ে লম্বা বাক্যগুলোর একটি সীমা রাখুন। কোনো বাক্য প্রায় ত্রিশ শব্দ ছাড়িয়ে গেলে সেটি ভেঙে দিন।',
        whenToUse: 'লিখতে লিখতেই যখন নিজের বাক্যের সুতো হারিয়ে ফেলেন।',
        structure: [
          'Coordinator-এ ভাগ করুন: ...costs, and the delay... দুটি বাক্য হয়ে যায়।',
          'Relative pronoun-এ ভাগ করুন: ..., which meant... হয়ে যায় This meant...',
          'Clause-কে phrase বানান: Because it was expensive -> Owing to its cost',
        ],
        notes: [
          'লম্বা বাক্য ভাষাদক্ষতার প্রমাণ নয়; বরং দৈর্ঘ্যের বৈচিত্র্যই প্রমাণ।',
          'তিনটি ভুলসহ একটি উচ্চাকাঙ্ক্ষী বাক্যের চেয়ে দুটি নির্ভুল বাক্য বেশি নম্বর পায়।',
        ],
      },
    ],
    examples: [
      {
        wrong: 'Due to the fact that the cost was high, the project was cancelled.',
        right: 'Because the cost was high, the project was cancelled.',
        note: 'পাঁচটি শব্দ কমে একটিতে নেমে এসেছে।',
      },
      {
        wrong: 'He almost drove his children to school every day.',
        right: 'He drove his children to school almost every day.',
        note: 'Almost-কে every day-এর ঠিক পাশে বসতে হবে।',
      },
      {
        wrong: 'The committee made a decision to conduct an investigation into the matter.',
        right: 'The committee decided to investigate the matter.',
        note: 'লুকিয়ে থাকা Verb দুটি ফিরিয়ে আনা হয়েছে।',
      },
      {
        wrong: 'There are a large number of students who are struggling with the course.',
        right: 'Many students are struggling with the course.',
        note: 'Existential গঠনটি কোনো অর্থই যোগ করছিল না।',
      },
      {
        wrong: 'Walking through the park, the statues were impressive.',
        right: 'Walking through the park, we found the statues impressive.',
        note: 'মূর্তি তো হাঁটে না; modifier-টির জন্য একটি Subject দরকার ছিল।',
      },
    ],
    mistakes: [
      {
        wrong: 'In todays modern world of today, technology is important.',
        right: 'Technology is now central to daily life.',
        explanation:
          'শুরুর phrase-টি দুইভাবে একই কথা বলছিল, আর important শব্দটিও অস্পষ্ট।',
      },
      {
        wrong: 'The report that was written by the team that was appointed last year was published.',
        right: 'The report by the team appointed last year has been published.',
        explanation:
          'দুটি পূর্ণ Relative Clause phrase-এ নেমে এসেছে, ফলে Subject তার Verb-এর কাছে দ্রুত পৌঁছেছে।',
      },
      {
        wrong: 'She only eats vegetables on weekdays, which are organic.',
        right: 'On weekdays she eats only organic vegetables.',
        explanation:
          'only আর Relative Clause দুটিই নিজের উদ্দিষ্ট শব্দ থেকে সরে গিয়েছিল।',
      },
      {
        wrong: 'It is important to note that it should be mentioned that costs have risen.',
        right: 'Costs have risen.',
        explanation: 'দুটি ভূমিকামূলক phrase-এর কোনোটিতেই কোনো তথ্য নেই; দুটোই বাদ দিন।',
      },
      {
        wrong: 'The implementation of the utilisation of renewable resources is necessary.',
        right: 'Renewable resources must be used more widely.',
        explanation:
          'একের পর এক nominalization একটি সহজ Verb-কে ঢেকে রেখেছিল। এগুলো খুলে আবার Clause-এ ফিরে যান।',
      },
    ],
    keyTakeaways: [
      'লম্বা বাঁধাধরা phrase-এর জায়গায় একটি শব্দ বসান।',
      'Subject-কে তার Verb-এর পাশে রাখুন।',
      'only এবং প্রতিটি বিশেষণমূলক phrase তার উদ্দিষ্ট শব্দের পাশে বসান।',
      'লিখতে গিয়ে যে বাক্যের সুতো হারিয়ে ফেলেন, সেটি ভেঙে দিন।',
    ],
  },

  /* ----------------------------- Module 24 ----------------------------- */
  {
    moduleId: 24,
    intro:
      'শেষ মডিউলটি বিচারবুদ্ধি নিয়ে: প্রশ্নের সঙ্গে মানানসই register বাছা, উদ্দেশ্য নিয়ে বিরামচিহ্ন বসানো, আর দেখানোর জন্য নয় বরং কার্যকারিতার জন্য বাক্যের দৈর্ঘ্যে বৈচিত্র্য আনা। Band 8 চায় নানা ধরনের গঠন সাবলীলভাবে ব্যবহার করা, আর সাবলীলতা মানে বেছে নেওয়া, ক্রমাগত কঠিন করা নয়।',
    rules: [
      {
        id: 'm24-r1',
        heading: 'Academic ও Professional Register',
        rule: 'আনুষ্ঠানিক লিখিত ইংরেজিতে contraction, কথ্য phrasal verb এবং পাঠককে সরাসরি সম্বোধন এড়িয়ে চলা হয়।',
        whenToUse: 'IELTS Task 1 ও Task 2, রিপোর্ট এবং বেশিরভাগ পেশাগত লেখায়।',
        structure: [
          'Contraction নয়: do not, cannot, it is',
          'এড়িয়ে চলুন: get, a lot of, kids, stuff, things',
          'বেছে নিন: obtain বা receive, a great deal of, children, factors, issues',
          'Phrasal verb-এর বদলে একক Verb: find out -> discover; go up -> increase; cut down on -> reduce',
          'পাঠককে সম্বোধন নয়: As you can see নয়, বরং As the chart shows',
        ],
        table: {
          caption: 'Register বদলানোর উদাহরণ',
          headers: ['অনানুষ্ঠানিক', 'Academic'],
          rows: [
            ['a lot of people', 'many people / a significant proportion'],
            ['kids', 'children'],
            ['get better', 'improve'],
            ['look into', 'examine / investigate'],
            ['big problem', 'serious issue'],
            ['And so...', 'Consequently, ...'],
          ],
        },
        notes: [
          'পেশাগত ইমেইল academic essay-র চেয়ে কম আনুষ্ঠানিক; সেখানে কিছু contraction স্বাভাবিক। একটিমাত্র নিয়ম নয়, কাজের ধরন দেখে register ঠিক করুন।',
          'আনুষ্ঠানিক বাক্য And বা But দিয়ে শুরু করবেন না। Moreover বা However ব্যবহার করুন, নয়তো বাক্যটি নতুন করে সাজান।',
        ],
      },
      {
        id: 'm24-r2',
        heading: 'Semicolon, Colon ও Dash',
        rule: 'প্রতিটি চিহ্নের একটি নির্দিষ্ট কাজ আছে। সঠিক চিহ্নটি বসালে বাড়তি শব্দের আর দরকার পড়ে না।',
        whenToUse: 'খুব পরিমিতভাবে, আর একই বাক্যে কখনো দুইবার নয়।',
        structure: [
          'Semicolon - দুটি পূর্ণ ও ঘনিষ্ঠ বাক্য জোড়া দেয়: Costs rose; demand fell.',
          'Semicolon - এমন তালিকার অংশ আলাদা করে যেগুলোর ভেতরেই কমা আছে।',
          'Colon - তালিকা, ব্যাখ্যা বা সিদ্ধান্ত আনে: Three factors matter: cost, time and access.',
          'Dash - জোর দিয়ে একটি পাশের মন্তব্য আলাদা করে: The result - entirely unexpected - changed the policy.',
        ],
        notes: [
          'Colon-এর আগে একটি পূর্ণ Clause থাকতে হবে, অসম্পূর্ণ কোনো অংশ নয়।',
          'আনুষ্ঠানিক academic লেখায় dash কম ব্যবহার করুন; পেশাগত লেখায় এটি বেশ প্রচলিত।',
        ],
      },
      {
        id: 'm24-r3',
        heading: 'উদ্দেশ্যপূর্ণ বাক্য-বৈচিত্র্য',
        rule: 'বাক্যের দৈর্ঘ্যে এমনভাবে বৈচিত্র্য আনুন যাতে গঠনটি অর্থকে সাহায্য করে। দুটি লম্বা বাক্যের পরে একটি ছোট বাক্য জোরালোভাবে আঘাত করে।',
        whenToUse: 'অনুচ্ছেদের শেষে, কিংবা নিজের অবস্থান জানানোর সময়।',
        structure: [
          'লম্বা বাক্যে প্রেক্ষাপট ও শর্ত...',
          'মাঝারি বাক্যে বক্তব্যের বিস্তার...',
          'ছোট বাক্যে সিদ্ধান্ত: The cost is simply too high.',
        ],
        notes: [
          'পরপর তিনটি বাক্য একই দৈর্ঘ্য ও একই গড়নের হওয়া এড়িয়ে চলুন।',
          'শুরুতেও বৈচিত্র্য আনুন; প্রতিটি বাক্য Subject দিয়ে শুরু হওয়ার দরকার নেই। সামনে বসানো Adverbial বা participle clause ছন্দ বদলে দেয়।',
        ],
      },
      {
        id: 'm24-r4',
        heading: 'সাবলীলতা, ক্রমাগত জটিলতা নয়',
        rule: 'বিস্তৃত পরিসর মানে আপনি সঠিক গঠনটি বেছে নিতে পারেন, এমনকি সেটি সহজ গঠন হলেও। এর মানে এই নয় যে প্রতিটি বাক্য জটিল হতে হবে।',
        whenToUse: 'যে কোনো লেখা জমা দেওয়ার আগে শেষ যাচাই হিসেবে।',
        structure: [
          'নিজেকে জিজ্ঞাসা করুন: এই বাক্যটির কি সত্যিই জটিল হওয়া দরকার, নাকি আমি উন্নত দেখানোর জন্য জটিল করছি?',
          'নিজেকে জিজ্ঞাসা করুন: প্রতিটি জটিল বাক্য কি ভুলমুক্ত?',
          'নিজেকে জিজ্ঞাসা করুন: পাঠক কি প্রথমবার পড়েই বুঝতে পারবেন?',
        ],
        notes: [
          'পুরো কোর্সটি এখানেই এসে মেলে: আগে নির্ভুলতা, তারপর জটিলতা, তারপর কোনটি কখন ব্যবহার করবেন সেই নিয়ন্ত্রণ।',
        ],
      },
    ],
    examples: [
      {
        wrong: 'There is a lot of stuff that governments can do about this.',
        right: 'Governments can take a number of measures to address this.',
        note: 'অস্পষ্ট কথ্য Noun-এর জায়গায় নির্দিষ্ট academic শব্দ বসেছে।',
      },
      {
        wrong: 'The policy didnt work, and it cost a lot too.',
        right: 'The policy did not work, and it was expensive.',
        note: 'Contraction বাদ, আর অস্পষ্ট পরিমাণের বদলে নির্দিষ্ট Adjective।',
      },
      {
        wrong: 'Three factors matter: are cost, time and access.',
        right: 'Three factors matter: cost, time and access.',
        note: 'Colon-এর আগের Clause পূর্ণ হতে হবে, আর তালিকাটি সরাসরি বসবে।',
      },
      {
        wrong: 'Costs rose, demand fell.',
        right: 'Costs rose; demand fell.',
        note: 'কমা যেখানে পারে না, সেখানে semicolon দুটি পূর্ণ বাক্য জোড়া দেয়।',
      },
      {
        wrong: 'As you can see from the graph, sales went up.',
        right: 'As the graph shows, sales increased.',
        note: 'পাঠককে সম্বোধন এড়ান, আর phrasal verb-এর বদলে একক Verb বসান।',
      },
    ],
    mistakes: [
      {
        wrong: 'In conclusion, I wanna say that governments should do more.',
        right: 'In conclusion, governments should do more.',
        explanation:
          'Wanna লিখিত ইংরেজি নয়, আর ভূমিকামূলক অংশটিরও কোনো দরকার ছিল না।',
      },
      {
        wrong: 'The main issues are: cost, time and access.',
        right: 'The main issues are cost, time and access.',
        explanation:
          'Verb আর তার পরিপূরকের মাঝখানে colon বসে না; আগে Clause-টি পূর্ণ হতে হবে।',
      },
      {
        wrong: 'Costs rose; however demand fell; and prices stayed flat.',
        right: 'Costs rose; however, demand fell and prices stayed flat.',
        explanation:
          'However-এর পরে কমা লাগে, আর এক বাক্যে দুটি semicolon বেশি হয়ে যায়।',
      },
      {
        wrong: 'Kids nowadays are getting addicted to their phones big time.',
        right: 'Children today spend an increasing amount of time on their phones.',
        explanation:
          'এক বাক্যেই তিনটি register-এর সমস্যা: কথ্য Noun, কথ্য Verb আর slang।',
      },
      {
        wrong: 'Although many argue that the policy is effective, and despite the evidence, however it remains controversial.',
        right: 'Although many argue that the policy is effective, it remains controversial.',
        explanation:
          'একটি বৈপরীত্যের জন্য তিনটি connector। নিয়ন্ত্রণহীন জটিলতা সহজ বাক্যের চেয়েও খারাপ পড়তে লাগে।',
      },
    ],
    keyTakeaways: [
      'কাজের ধরন অনুযায়ী register বাছুন: academic লেখায় contraction বা কথ্য শব্দ নয়।',
      'Semicolon বাক্য জোড়া দেয়, colon কিছু উপস্থাপন করে, dash পাশের মন্তব্যে জোর দেয়।',
      'বাক্যের দৈর্ঘ্য ও শুরুতে ইচ্ছাকৃত বৈচিত্র্য আনুন, বিশেষ করে অনুচ্ছেদের শেষে।',
      'বিস্তৃত পরিসর মানে সঠিক গঠন বেছে নেওয়া, সবসময় সবচেয়ে জটিলটি নয়।',
    ],
  },
]
