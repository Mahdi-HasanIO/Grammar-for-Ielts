import type { Lesson } from '@/types'

export const stage5Lessons: Lesson[] = [
  /* ----------------------------- Module 23 ----------------------------- */
  {
    moduleId: 23,
    intro:
      'এই module-এ নতুন কোনো grammar নেই; এটা আসলে লেখা edit করার একটা checklist। এখানকার সব কাজ লেখা শেষ হওয়ার পরে: বাড়তি যা আছে কেটে ফেলা, modifier-কে ঠিক শব্দের পাশে বসানো, আর Subject ও Verb-কে কাছাকাছি রাখা। পরীক্ষার চাপেও এই অভ্যাসগুলো ভুল কমায়, কারণ ছোট আর গোছানো বাক্যে ভুল কম হয়।',
    rules: [
      {
        id: 'm23-r1',
        heading: 'বাড়তি শব্দ কেটে ফেলুন',
        rule: 'কিছু চেনা phrase শুধু লেখা লম্বা করে, অর্থ বাড়ায় না। এগুলোর জায়গায় একটা শব্দ বসান।',
        whenToUse:
          'প্রতিটি draft-এ, এমনকি পরীক্ষার হলে হাতে মাত্র দুই মিনিট থাকলেও।',
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
          caption: 'লম্বা রূপ আর ছোট রূপ',
          headers: ['বাড়তি শব্দে ভরা', 'ছোট রূপ'],
          rows: [
            ['There are many people who believe', 'Many people believe'],
            ['The reason why this happens is because', 'This happens because'],
            ['In todays modern world', 'Today'],
            ['make a decision about', 'decide'],
            ['conduct an investigation into', 'investigate'],
          ],
        },
        notes: [
          'Verb থেকে বানানো Noun অনেক সময় আসল কাজটাকে আড়াল করে রাখে: make a decision-এর বদলে লিখুন decide। Module 18-এর nominalization বাড়াবাড়ি হয়ে গেলে এভাবেই আবার Verb-এ ফিরিয়ে আনতে হয়।',
        ],
      },
      {
        id: 'm23-r2',
        heading: 'Subject আর Verb কাছাকাছি রাখুন',
        rule: 'Subject আর তার Verb-এর মাঝে অনেক শব্দ থাকলে পাঠককে Subject-টা মনে ধরে রাখতে হয়, আর agreement-এর ভুল হওয়ার সম্ভাবনাও বাড়ে।',
        whenToUse: 'Subject-এর পরে যখন আট শব্দের বেশি লম্বা কোনো অংশ বসে যায়।',
        structure: [
          'Hard: The policy, which was introduced in 2015 after a lengthy consultation involving several agencies, failed.',
          'Better: The policy failed, despite a lengthy consultation involving several agencies before its introduction in 2015.',
          'Better: Introduced in 2015 after a lengthy consultation, the policy failed.',
        ],
      },
      {
        id: 'm23-r3',
        heading: 'Modifier-কে তার নিজের শব্দের পাশে বসান',
        rule: 'Modifier সবচেয়ে কাছের শব্দটার সঙ্গেই জুড়ে যায়। সেটা যদি আপনি যে শব্দটা বোঝাতে চেয়েছেন সেটা না হয়, তাহলে modifier-টাকে সরিয়ে ঠিক জায়গায় বসান।',
        whenToUse: 'only, almost, nearly, just আর প্রতিটি বর্ণনামূলক phrase চেক করুন।',
        structure: [
          'Only the committee approved the plan. (কমিটি ছাড়া আর কেউ অনুমোদন দেয়নি)',
          'The committee only approved the plan. (কমিটি শুধু অনুমোদনই দিয়েছে, এর বেশি কিছু করেনি)',
          'The committee approved only the plan. (এই plan ছাড়া আর কিছুই অনুমোদন পায়নি)',
          'Misplaced: The minister announced a plan to reduce emissions on Tuesday.',
          'Fixed: On Tuesday the minister announced a plan to reduce emissions.',
        ],
        notes: [
          'only-কে ঠিক সেই অংশের আগে বসান, যেটাকে আপনি সীমিত করতে চান।',
          'বাক্যের শেষে বসা সময় বা স্থান বোঝানো phrase পাশের Noun-এর সঙ্গে জুড়ে যায়, আর প্রায়ই সেটা ভুল Noun।',
        ],
      },
      {
        id: 'm23-r4',
        heading: 'বাক্য যেন বেশি লম্বা না হয়',
        rule: 'বাক্যের দৈর্ঘ্যে বৈচিত্র্য আনুন, তবে লম্বা বাক্যের একটা সীমা রাখুন। কোনো বাক্য প্রায় ত্রিশ শব্দ ছাড়িয়ে গেলে সেটা ভেঙে দিন।',
        whenToUse: 'লিখতে লিখতেই যখন নিজের বাক্যের খেই হারিয়ে ফেলেন।',
        structure: [
          'Coordinator-এর জায়গায় ভাঙুন: ...costs, and the delay... দুটো আলাদা বাক্য হয়ে যায়।',
          'Relative pronoun-এর জায়গায় ভাঙুন: ..., which meant... হয়ে যায় This meant...',
          'Clause-কে phrase বানান: Because it was expensive -> Owing to its cost',
        ],
        notes: [
          'লম্বা বাক্য ভাষায় দক্ষতার প্রমাণ নয়; প্রমাণ হলো ছোট-বড় বাক্যের সঠিক মিশ্রণ।',
          'তিনটা ভুলওয়ালা একটা ভারী বাক্যের চেয়ে দুটো নির্ভুল বাক্য বেশি নম্বর পায়।',
        ],
      },
    ],
    examples: [
      {
        wrong: 'Due to the fact that the cost was high, the project was cancelled.',
        right: 'Because the cost was high, the project was cancelled.',
        note: 'পাঁচটা শব্দ কমে একটা শব্দ হয়েছে।',
      },
      {
        wrong: 'He almost drove his children to school every day.',
        right: 'He drove his children to school almost every day.',
        note: 'Almost বসবে every day-এর ঠিক পাশে।',
      },
      {
        wrong: 'The committee made a decision to conduct an investigation into the matter.',
        right: 'The committee decided to investigate the matter.',
        note: 'Noun-এর আড়ালে লুকিয়ে থাকা দুটো Verb ফিরিয়ে আনা হয়েছে।',
      },
      {
        wrong: 'There are a large number of students who are struggling with the course.',
        right: 'Many students are struggling with the course.',
        note: 'There is... গঠনটা কোনো অর্থই যোগ করছিল না।',
      },
      {
        wrong: 'Walking through the park, the statues were impressive.',
        right: 'Walking through the park, we found the statues impressive.',
        note: 'মূর্তি তো হাঁটে না; modifier-টার জন্য একটা ঠিকঠাক Subject দরকার ছিল।',
      },
    ],
    mistakes: [
      {
        wrong: 'In todays modern world of today, technology is important.',
        right: 'Technology is now central to daily life.',
        explanation:
          'শুরুর phrase-টা একই কথা দুবার বলছিল, আর important শব্দটাও অস্পষ্ট।',
      },
      {
        wrong: 'The report that was written by the team that was appointed last year was published.',
        right: 'The report by the team appointed last year has been published.',
        explanation:
          'দুটো পূর্ণ Relative Clause ছোট হয়ে phrase হয়েছে, ফলে Subject-এর পরে Verb তাড়াতাড়ি চলে এসেছে।',
      },
      {
        wrong: 'She only eats vegetables on weekdays, which are organic.',
        right: 'On weekdays she eats only organic vegetables.',
        explanation:
          'only আর Relative Clause, দুটোই যে শব্দের সঙ্গে থাকার কথা, তার থেকে সরে গিয়েছিল।',
      },
      {
        wrong: 'It is important to note that it should be mentioned that costs have risen.',
        right: 'Costs have risen.',
        explanation: 'শুরুর দুটো phrase-এর কোনোটাতেই কোনো তথ্য নেই; দুটোই বাদ দিন।',
      },
      {
        wrong: 'The implementation of the utilisation of renewable resources is necessary.',
        right: 'Renewable resources must be used more widely.',
        explanation:
          'একের পর এক nominalization একটা সহজ Verb-কে ঢেকে রেখেছিল। এগুলো ভেঙে আবার সাধারণ Clause লিখুন।',
      },
    ],
    keyTakeaways: [
      'লম্বা গতানুগতিক phrase-এর জায়গায় একটা শব্দ বসান।',
      'Subject-কে তার Verb-এর পাশে রাখুন।',
      'only আর প্রতিটি বর্ণনামূলক phrase যে শব্দকে বোঝাচ্ছে, তার ঠিক পাশে বসান।',
      'লিখতে গিয়ে যে বাক্যের খেই হারিয়ে ফেলেন, সেটা ভেঙে দিন।',
    ],
  },

  /* ----------------------------- Module 24 ----------------------------- */
  {
    moduleId: 24,
    intro:
      'শেষ module-টা বিচারবুদ্ধি নিয়ে: প্রশ্নের সঙ্গে মানানসই register বাছা, বুঝেশুনে punctuation বসানো, আর দেখানোর জন্য নয়, কাজের জন্য বাক্যের দৈর্ঘ্যে বৈচিত্র্য আনা। Band 8-এর জন্য নানা ধরনের গঠন সাবলীলভাবে ব্যবহার করতে হয়, আর সাবলীলতা মানে ঠিক গঠনটা বেছে নেওয়া, সবকিছু কঠিন করে ফেলা নয়।',
    rules: [
      {
        id: 'm24-r1',
        heading: 'Academic আর Professional Register',
        rule: 'Formal লিখিত ইংরেজিতে contraction (don\'t, it\'s), কথ্য phrasal verb আর পাঠককে সরাসরি you বলে সম্বোধন এড়িয়ে চলা হয়।',
        whenToUse: 'IELTS Task 1 ও Task 2, report আর বেশিরভাগ অফিসিয়াল লেখায়।',
        structure: [
          'Contraction নয়: do not, cannot, it is',
          'এড়িয়ে চলুন: get, a lot of, kids, stuff, things',
          'বেছে নিন: obtain বা receive, a great deal of, children, factors, issues',
          'Phrasal verb-এর বদলে একক Verb: find out -> discover; go up -> increase; cut down on -> reduce',
          'পাঠককে সরাসরি সম্বোধন নয়: As you can see নয়, বরং As the chart shows',
        ],
        table: {
          caption: 'Informal থেকে formal',
          headers: ['Informal', 'Academic'],
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
          'অফিসের email academic essay-র চেয়ে কম formal; সেখানে কিছু contraction স্বাভাবিক। সব জায়গায় একই নিয়ম নয়, লেখার ধরন দেখে register ঠিক করুন।',
          'Formal লেখায় বাক্য And বা But দিয়ে শুরু করবেন না। Moreover বা However ব্যবহার করুন, নয়তো বাক্যটা নতুন করে সাজান।',
        ],
      },
      {
        id: 'm24-r2',
        heading: 'Semicolon, Colon ও Dash',
        rule: 'প্রতিটি চিহ্নের একটা নির্দিষ্ট কাজ আছে। ঠিক চিহ্নটা বসালে বাড়তি শব্দের আর দরকার পড়ে না।',
        whenToUse: 'খুব হিসেব করে, আর একই বাক্যে কখনো দুবার নয়।',
        structure: [
          'Semicolon - কাছাকাছি অর্থের দুটো পূর্ণ বাক্য জোড়া দেয়: Costs rose; demand fell.',
          'Semicolon - এমন তালিকার আইটেম আলাদা করে, যেগুলোর ভেতরেই কমা আছে।',
          'Colon - এরপর তালিকা, ব্যাখ্যা বা সিদ্ধান্ত আসছে বোঝায়: Three factors matter: cost, time and access.',
          'Dash - পাশের কোনো মন্তব্যকে জোর দিয়ে আলাদা করে: The result - entirely unexpected - changed the policy.',
        ],
        notes: [
          'Colon-এর আগে একটা পূর্ণ Clause থাকতে হবে, অসম্পূর্ণ কোনো অংশ নয়।',
          'Formal academic লেখায় dash কম ব্যবহার করুন; অফিসিয়াল লেখায় এটা বেশ চলে।',
        ],
      },
      {
        id: 'm24-r3',
        heading: 'ভেবেচিন্তে বাক্যে বৈচিত্র্য আনা',
        rule: 'বাক্যের দৈর্ঘ্যে এমনভাবে বৈচিত্র্য আনুন, যাতে গঠনটা অর্থকে আরও জোরালো করে। দুটো লম্বা বাক্যের পরে একটা ছোট বাক্য পাঠকের মনে জোরে দাগ কাটে।',
        whenToUse: 'Paragraph-এর শেষে, অথবা নিজের মত জানানোর সময়।',
        structure: [
          'লম্বা বাক্যে প্রেক্ষাপট আর শর্ত...',
          'মাঝারি বাক্যে বক্তব্যের ব্যাখ্যা...',
          'ছোট বাক্যে সিদ্ধান্ত: The cost is simply too high.',
        ],
        notes: [
          'পরপর তিনটা বাক্য একই দৈর্ঘ্যের আর একই গঠনের যেন না হয়।',
          'বাক্যের শুরুতেও বৈচিত্র্য আনুন; প্রতিটি বাক্য Subject দিয়ে শুরু করার দরকার নেই। শুরুতে Adverbial বা participle clause বসালে লেখার ছন্দ বদলে যায়।',
        ],
      },
      {
        id: 'm24-r4',
        heading: 'লক্ষ্য সাবলীলতা, সবকিছু জটিল করা নয়',
        rule: 'Range ভালো মানে, আপনি দরকার অনুযায়ী ঠিক গঠনটা বেছে নিতে পারেন, সেটা সহজ গঠন হলেও। এর মানে এই নয় যে প্রতিটি বাক্য জটিল হতে হবে।',
        whenToUse: 'যেকোনো লেখা জমা দেওয়ার আগে শেষবার চেক করার সময়।',
        structure: [
          'নিজেকে জিজ্ঞেস করুন: এই বাক্যটার কি সত্যিই জটিল হওয়া দরকার, নাকি শুধু advanced দেখাতে জটিল করছি?',
          'নিজেকে জিজ্ঞেস করুন: প্রতিটি জটিল বাক্য কি ভুলমুক্ত?',
          'নিজেকে জিজ্ঞেস করুন: পাঠক কি একবার পড়েই বুঝতে পারবেন?',
        ],
        notes: [
          'পুরো কোর্সটা এখানে এসে মেলে: আগে নির্ভুলতা, তারপর জটিলতা, তারপর কখন কোনটা ব্যবহার করবেন, সেই বিচারবুদ্ধি।',
        ],
      },
    ],
    examples: [
      {
        wrong: 'There is a lot of stuff that governments can do about this.',
        right: 'Governments can take a number of measures to address this.',
        note: 'অস্পষ্ট কথ্য Noun-এর জায়গায় নির্দিষ্ট academic শব্দ বসানো হয়েছে।',
      },
      {
        wrong: 'The policy didnt work, and it cost a lot too.',
        right: 'The policy did not work, and it was expensive.',
        note: 'Contraction বাদ, আর a lot-এর মতো অস্পষ্ট পরিমাণের বদলে নির্দিষ্ট Adjective।',
      },
      {
        wrong: 'Three factors matter: are cost, time and access.',
        right: 'Three factors matter: cost, time and access.',
        note: 'Colon-এর আগের Clause পূর্ণ হতে হবে, আর তালিকাটা সরাসরি পরে বসবে।',
      },
      {
        wrong: 'Costs rose, demand fell.',
        right: 'Costs rose; demand fell.',
        note: 'কমা যেখানে পারে না, সেখানে semicolon দুটো পূর্ণ বাক্য জোড়া দেয়।',
      },
      {
        wrong: 'As you can see from the graph, sales went up.',
        right: 'As the graph shows, sales increased.',
        note: 'পাঠককে সরাসরি সম্বোধন এড়ান, আর phrasal verb-এর বদলে এক শব্দের Verb বসান।',
      },
    ],
    mistakes: [
      {
        wrong: 'In conclusion, I wanna say that governments should do more.',
        right: 'In conclusion, governments should do more.',
        explanation:
          'Wanna লিখিত ইংরেজিতে চলে না, আর শুরুর অংশটারও কোনো দরকার ছিল না।',
      },
      {
        wrong: 'The main issues are: cost, time and access.',
        right: 'The main issues are cost, time and access.',
        explanation:
          'Verb আর তার Object-এর মাঝখানে colon বসে না; colon-এর আগে Clause-টা পূর্ণ হতে হবে।',
      },
      {
        wrong: 'Costs rose; however demand fell; and prices stayed flat.',
        right: 'Costs rose; however, demand fell and prices stayed flat.',
        explanation:
          'However-এর পরে কমা লাগে, আর এক বাক্যে দুটো semicolon বাড়াবাড়ি।',
      },
      {
        wrong: 'Kids nowadays are getting addicted to their phones big time.',
        right: 'Children today spend an increasing amount of time on their phones.',
        explanation:
          'এক বাক্যেই register-এর তিনটা সমস্যা: কথ্য Noun, কথ্য Verb আর slang।',
      },
      {
        wrong: 'Although many argue that the policy is effective, and despite the evidence, however it remains controversial.',
        right: 'Although many argue that the policy is effective, it remains controversial.',
        explanation:
          'একটা বৈপরীত্য বোঝাতে তিনটা connector। এলোমেলো জটিল বাক্য পড়তে সাধারণ বাক্যের চেয়েও খারাপ লাগে।',
      },
    ],
    keyTakeaways: [
      'লেখার ধরন বুঝে register বাছুন: academic লেখায় contraction বা কথ্য শব্দ নয়।',
      'Semicolon বাক্য জোড়া দেয়, colon পরের কথাটা সামনে আনে, dash পাশের মন্তব্যে জোর দেয়।',
      'বাক্যের দৈর্ঘ্যে আর শুরুতে ভেবেচিন্তে বৈচিত্র্য আনুন, বিশেষ করে paragraph-এর শেষে।',
      'Range ভালো মানে ঠিক গঠনটা বেছে নেওয়া, সবসময় সবচেয়ে জটিলটা নয়।',
    ],
  },
]
