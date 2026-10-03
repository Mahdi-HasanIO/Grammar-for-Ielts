import type { Lesson } from '@/types'

export const stage4Lessons: Lesson[] = [
  /* ----------------------------- Module 18 ----------------------------- */
  {
    moduleId: 18,
    intro:
      'Academic লেখা পাণ্ডিত্যপূর্ণ শোনায় লম্বা Clause-এর সারির কারণে নয়, বরং তথ্যকে Noun phrase-এর ভেতরে ঠেসে দেওয়ার কারণে। এই Noun phrase তৈরি করা ও খুলে ফেলার দক্ষতাই এই কোর্সের সবচেয়ে কাজের উন্নত দক্ষতা, আর কোথায় থামতে হবে সেটা জানাও এর অংশ।',
    rules: [
      {
        id: 'm18-r1',
        heading: 'Noun বড় করার চারটি উপায়',
        rule: 'Noun-এর আগে, পরে বা দুই দিকেই বিশেষণ অংশ বসতে পারে। Academic writing-এ এই চারটি গঠনই প্রচুর ব্যবহৃত হয়।',
        whenToUse: 'যখন কোনো বাক্য ঢিলেঢালা ও পুনরাবৃত্তিমূলক মনে হয়।',
        structure: [
          'Adjective + noun: rapid growth',
          'Noun + noun: government policy, traffic congestion, air quality',
          'Noun + of-phrase: the growth of the economy',
          'Noun + অন্য preposition: the impact on rural communities',
          'Noun + relative বা participle clause: the policy introduced in 2015',
        ],
        table: {
          caption: 'ধাপে ধাপে Noun phrase গড়ে তোলা',
          headers: ['ধাপ', 'Phrase'],
          rows: [
            ['Head noun', 'growth'],
            ['+ adjective', 'rapid growth'],
            ['+ noun modifier', 'rapid population growth'],
            ['+ prepositional phrase', 'rapid population growth in coastal cities'],
            ['+ participle clause', 'rapid population growth in coastal cities driven by migration'],
          ],
        },
        notes: [
          'Noun + noun গঠনে প্রথম Noun-টি একবচনেই থাকে: a three-year programme, a car park, government policy.',
        ],
      },
      {
        id: 'm18-r2',
        heading: 'Nominalization (ক্রিয়াকে বিশেষ্যে রূপান্তর)',
        rule: 'Nominalization মানে Verb বা Adjective-কে Noun-এ রূপান্তর করা, যার ফলে একটি প্রক্রিয়াকেই বাক্যের Subject বানানো যায়।',
        whenToUse:
          'যখন আগের কোনো কাজকে সংক্ষেপে নির্দেশ করতে চান, বা সেটিকেই পরের বাক্যের মূল বিষয় বানাতে চান।',
        structure: [
          'rise -> the rise; grow -> growth; decide -> the decision',
          'reduce -> a reduction; expand -> expansion; analyse -> analysis',
          'Because prices rose rapidly, demand fell. -> The rapid rise in prices reduced demand.',
          'The government decided to invest. -> The government decision to invest...',
        ],
        table: {
          caption: 'Verb থেকে Noun',
          headers: ['Clause', 'Nominalized phrase'],
          rows: [
            ['Temperatures increased sharply.', 'the sharp increase in temperatures'],
            ['The policy failed.', 'the failure of the policy'],
            ['Cities are expanding.', 'the expansion of cities'],
            ['People consume more energy.', 'rising energy consumption'],
          ],
        },
        notes: [
          'Adverb-টি Adjective-এ বদলে যায়: rose rapidly হয়ে যায় a rapid rise।',
          'Noun যে Preposition দাবি করে সেটি ঠিক রাখুন: a rise in, an impact on, a reduction in.',
        ],
      },
      {
        id: 'm18-r3',
        heading: 'Apposition ও Noun Complement Clause',
        rule: 'Apposition-এ দুটি Noun phrase পাশাপাশি বসে, দ্বিতীয়টি প্রথমটিকে অন্যভাবে বোঝায়। আর Noun complement clause-এ that দিয়ে কোনো ভাববাচক Noun-এর বিষয়বস্তু জানানো হয়।',
        whenToUse: 'নতুন বাক্য না বানিয়েই কোনো শব্দের ব্যাখ্যা দিতে বা কোনো দাবির বক্তব্য জানাতে।',
        structure: [
          'Apposition: Jakarta, the capital of Indonesia, is sinking.',
          'Apposition: One solution, congestion charging, has proved effective.',
          'Noun + that-clause: the claim that technology destroys jobs',
          'প্রচলিত Noun: the idea / belief / fact / claim / argument / possibility that...',
        ],
        notes: [
          'Noun complement clause কিন্তু Relative Clause নয়: the fact that is true সঠিক, the fact which is true নয়।',
        ],
      },
      {
        id: 'm18-r4',
        heading: 'কোথায় থামতে হবে',
        rule: 'সংকোচন একটি কৌশল, লক্ষ্য নয়। একটি Noun phrase-এ তিন বা তার বেশি modifier জমে গেলে পাঠককে সেটি খুলে খুলে বুঝতে হয়, ফলে স্পষ্টতা কমে।',
        whenToUse: 'যখন নিজের লেখা আবার পড়তে গিয়ে আপনি নিজেই সুতো হারিয়ে ফেলেন।',
        structure: [
          'Overloaded: Government urban transport infrastructure investment policy reform proposals',
          'Clearer: proposals to reform government policy on investment in urban transport',
          'Overloaded: The implementation of the reduction of the utilisation of plastic',
          'Clearer: Reducing plastic use',
        ],
        notes: [
          'পরপর অনেকগুলো of-phrase থাকাই সবচেয়ে বড় লক্ষণ যে আপনি বেশি দূর চলে গেছেন। Module 23-এ এর সমাধান আছে।',
        ],
      },
    ],
    examples: [
      {
        wrong: 'Because the population grew quickly, the city expanded.',
        right: 'Rapid population growth drove the expansion of the city.',
        note: 'Clause-টি এমন একটি Noun phrase হয়ে গেছে, যা নিজেই Subject হতে পারে।',
      },
      {
        wrong: 'There was an increase of 20 per cent in the prices rapidly.',
        right: 'There was a rapid 20 per cent increase in prices.',
        note: 'Noun phrase-এর ভেতরে Adverb-টি Adjective হয়ে যায়।',
      },
      {
        wrong: 'the governments policies on the environment',
        right: 'government environmental policy',
        note: 'Noun modifier একবচনে থাকে এবং এতে apostrophe লাগে না।',
      },
      {
        wrong: 'The fact which the policy failed is undeniable.',
        right: 'The fact that the policy failed is undeniable.',
        note: 'Noun complement clause-এ which নয়, that বসে।',
      },
      {
        wrong: 'The reduction of the amount of the consumption of water',
        right: 'Reduced water consumption',
        note: 'তিনটি of-phrase মিলে দুটি noun modifier-এ নেমে এসেছে।',
      },
    ],
    mistakes: [
      {
        wrong: 'The increasing of prices has affected low-income families.',
        right: 'The increase in prices has affected low-income families.',
        explanation:
          'প্রতিষ্ঠিত Noun রূপ থাকলে সেটিই ব্যবহার করুন, সঙ্গে তার নিজস্ব Preposition।',
      },
      {
        wrong: 'a five-years plan for the development of the economy',
        right: 'a five-year economic development plan',
        explanation:
          'যৌগিক modifier একবচনে থাকে, আর of-phrase-এর চেয়ে Adjective হালকা ও ঝরঝরে।',
      },
      {
        wrong: 'The analyse of the data shows a clear pattern.',
        right: 'The analysis of the data shows a clear pattern.',
        explanation: 'Analyse হলো Verb, আর Noun হলো analysis।',
      },
      {
        wrong: 'There is a possibility of that the scheme will fail.',
        right: 'There is a possibility that the scheme will fail.',
        explanation:
          'Noun complement clause সরাসরি জুড়ে বসে; that-এর আগে কোনো Preposition বসে না।',
      },
      {
        wrong: 'The utilisation of the implementation of new technology methodologies',
        right: 'Introducing new technology',
        explanation:
          'একের পর এক ভাববাচক Noun জমালে অর্থ হারিয়ে যায়। অর্থ হারিয়ে গেলে আবার Verb-এ ফিরে যান।',
      },
    ],
    keyTakeaways: [
      'Head noun-এর আগে ও পরে তথ্য সাজিয়ে নিন।',
      'Clause-কে Noun phrase বানালে একটি প্রক্রিয়াকেও Subject করা যায়।',
      'Noun modifier একবচনে থাকে: a three-year plan, government policy।',
      'পাঠককে যদি দুইবার খুলে বুঝতে হয়, সেখানেই সংকোচন থামান।',
    ],
  },

  /* ----------------------------- Module 19 ----------------------------- */
  {
    moduleId: 19,
    intro:
      'Hedging হলো অভিজ্ঞ লেখকদের সেই কৌশল, যা দিয়ে তাঁরা এমন দাবি করেন যা রক্ষা করা যায়। শর্তহীন দাবি করলেই পাঠকের মনে সহজ একটি ব্যতিক্রম চলে আসে, কিন্তু পরিমিত দাবি টিকে থাকে। এটি দুর্বলতা বা অস্পষ্টতা নয়; বরং আপনার প্রমাণ ঠিক কতটুকু সমর্থন করে, সেটিই সঠিকভাবে বলা।',
    rules: [
      {
        id: 'm19-r1',
        heading: 'Hedging-এর উপকরণ',
        rule: 'চার ধরনের শব্দ দিয়ে দাবির জোর কমানো যায়: Modal Verb, সাধারণ Verb, Adverb এবং Quantifier।',
        whenToUse: 'কারণ, ফলাফল বা ভবিষ্যৎ নিয়ে করা যে কোনো সাধারণ দাবিতে।',
        structure: [
          'Modal: may, might, could, can, would',
          'Verb: tend to, appear to, seem to, suggest, indicate, imply',
          'Adverb: often, generally, largely, arguably, relatively, possibly',
          'Quantifier: many, most, some, a number of, in some cases',
          'গঠন: It is likely that..., It appears that..., There is evidence that...',
        ],
        table: {
          caption: 'দাবির জোর কমানো',
          headers: ['চূড়ান্ত দাবি', 'পরিমিত দাবি'],
          rows: [
            ['Technology always improves education.', 'Technology can improve educational outcomes.'],
            ['This proves the theory.', 'This suggests that the theory holds.'],
            ['Everyone agrees that...', 'There is broad agreement that...'],
            ['Pollution causes illness.', 'Pollution is a significant contributor to illness.'],
          ],
        },
      },
      {
        id: 'm19-r2',
        heading: 'Hedge-এর বদলে শর্ত যোগ করুন',
        rule: 'অনেক সময় সবচেয়ে ভালো উপায় Verb-কে নরম করা নয়, বরং দাবিটি কোন পরিস্থিতিতে খাটে তা বলে দেওয়া।',
        whenToUse: 'যখন আপনি দাবিটি বিশ্বাস করেন, কিন্তু সেটি সব ক্ষেত্রে সত্য নয়।',
        structure: [
          'Weak: Technology always improves education.',
          'Better: Technology can improve educational outcomes when it is properly implemented.',
          'Better: In well-resourced schools, technology has improved outcomes considerably.',
        ],
        notes: [
          'Conditional clause দাবিটিকে শুধু নরম নয়, বরং নির্ভুল করে তোলে।',
          'এতে আপনার task response-ও ভালো হয়, কারণ এতে বোঝা যায় আপনি সীমাবদ্ধতা নিয়ে ভেবেছেন।',
        ],
      },
      {
        id: 'm19-r3',
        heading: 'অন্যের বক্তব্য উপস্থাপন',
        rule: 'Reporting verb-এর ভেতরেই আপনার নিজের মূল্যায়ন লুকিয়ে থাকে, তাই এগুলো ভেবেচিন্তে বাছুন।',
        whenToUse: 'গবেষণা, সমালোচক বা প্রচলিত মতের কথা বলার সময়।',
        structure: [
          'নিরপেক্ষ: states, reports, notes, describes',
          'সমর্থনসূচক: shows, demonstrates, establishes, confirms',
          'সতর্ক: suggests, indicates, implies',
          'দূরত্ব বোঝানো: claims, asserts, alleges',
        ],
        notes: [
          'shows ও demonstrates ব্যবহার করলে আপনি নিজেও ফলাফলটি মেনে নিচ্ছেন; suggests ও indicates-এ সেই দায় থাকে না।',
          'Claims দিয়ে বোঝায় আপনি বিষয়টি নিয়ে সন্দিহান। এটি ভেবেচিন্তে ব্যবহার করুন, ভুল করে নয়।',
        ],
      },
      {
        id: 'm19-r4',
        heading: 'অতিরিক্ত Hedging নয়',
        rule: 'একের পর এক hedge বসালে বাক্যটি আর কিছুই বলে না। প্রতি দাবিতে এক বা দুটিই যথেষ্ট।',
        whenToUse: 'সম্পাদনার সময়।',
        structure: [
          'Over-hedged: It could possibly be argued that there may perhaps be some evidence that this might be true.',
          'Fixed: There is some evidence that this is true.',
          'Over-hedged: It seems that it may be likely that costs could rise.',
          'Fixed: Costs are likely to rise.',
        ],
        notes: [
          'IELTS Task 2-তে প্রশ্নের উত্তর আপনাকে দিতেই হবে। Hedging অবস্থানকে সংযত করে, অবস্থানের বিকল্প হয় না।',
        ],
      },
    ],
    examples: [
      {
        wrong: 'Technology always improves education.',
        right: 'Technology can improve educational outcomes when it is implemented effectively.',
        note: 'শর্ত যোগ করায় দাবিটি এখন রক্ষা করা যায়।',
      },
      {
        wrong: 'All young people are addicted to social media.',
        right: 'Many young people spend a considerable amount of time on social media.',
        note: 'চূড়ান্ত quantifier আর ভারী Verb দুটোই বদলানো হয়েছে।',
      },
      {
        wrong: 'This study proves that exercise prevents depression.',
        right: 'This study indicates that exercise may help prevent depression.',
        note: 'একটি গবেষণা ইঙ্গিত দেয়, প্রমাণ করে না।',
      },
      {
        wrong: 'It is possible that it might perhaps be true that costs may rise.',
        right: 'Costs are likely to rise.',
        note: 'একটি hedge-ই যথেষ্ট।',
      },
      {
        wrong: 'Everybody knows that cities are dangerous.',
        right: 'Cities are often perceived as less safe than rural areas.',
        note: 'ধারণাটিকে ধারণা হিসেবেই উপস্থাপন করুন, তথ্য হিসেবে নয়।',
      },
    ],
    mistakes: [
      {
        wrong: 'Pollution definitely causes all respiratory diseases.',
        right: 'Pollution contributes to a range of respiratory conditions.',
        explanation:
          'All আর definitely দুটোই রক্ষা করা অসম্ভব; contributes to একটি বাস্তব সম্পর্ক বোঝায়।',
      },
      {
        wrong: 'The graph proves that the policy was successful.',
        right: 'The graph suggests that the policy had some effect.',
        explanation: 'চার্ট একটি প্রবণতা দেখায়, কারণ প্রমাণ করে না।',
      },
      {
        wrong: 'It tends to be that students may possibly perform better.',
        right: 'Students tend to perform better.',
        explanation: 'Tend to নিজেই একটি hedge; বাকিটা নিছক বাড়তি শব্দ।',
      },
      {
        wrong: 'In my opinion, I think that perhaps the government should maybe act.',
        right: 'The government should act.',
        explanation:
          'আপনার অবস্থান স্পষ্ট থাকা উচিত। Hedge করুন প্রমাণকে, নিজের অবস্থানকে নয়।',
      },
      {
        wrong: 'Research is proving that this approach is the only solution.',
        right: 'Research suggests that this approach is one effective solution.',
        explanation:
          'The only solution এমন একটি চূড়ান্ত দাবি, যা কোনো গবেষণাই সমর্থন করতে পারে না।',
      },
    ],
    keyTakeaways: [
      'Modal, tend to, suggest ও Adverb দিয়ে দাবিকে প্রমাণের সঙ্গে মানানসই করুন।',
      'অনেক সময় Verb নরম করার চেয়ে একটি শর্ত যোগ করা ভালো।',
      'Reporting verb-এ মূল্যায়ন থাকে: shows দায় নেয়, suggests নেয় না।',
      'প্রতি দাবিতে একটি hedge; নিজের অবস্থান কখনো hedge করে মুছে ফেলবেন না।',
    ],
  },

  /* ----------------------------- Module 20 ----------------------------- */
  {
    moduleId: 20,
    intro:
      'লেখা তখনই সাবলীল হয় যখন বাক্যগুলো এমনভাবে সাজানো থাকে যে প্রতিটি বাক্য শুরু হয় পাঠকের আগে থেকেই জানা কিছু দিয়ে। অনুচ্ছেদ এলোমেলো লাগলে বেশিরভাগ লেখক আরও linking word যোগ করেন। কিন্তু আসল সমাধান সাধারণত বাক্যের ভেতরে তথ্যের ক্রম বদলানো।',
    rules: [
      {
        id: 'm20-r1',
        heading: 'জানা তথ্য আগে, নতুন তথ্য পরে',
        rule: 'পাঠকের কাছে যা ইতিমধ্যে জানা, তা দিয়ে বাক্য শুরু করুন এবং নতুন তথ্যটি রাখুন শেষে।',
        whenToUse: 'অনুচ্ছেদের প্রথম বাক্যের পরের প্রতিটি বাক্যে।',
        structure: [
          'Choppy: A new tax was introduced in 2015. Congestion fell by 20 per cent because of the tax.',
          'Flowing: In 2015 the city introduced a new tax. This measure cut congestion by 20 per cent.',
        ],
        notes: [
          'বাক্যের শেষ কয়েকটি শব্দ পাঠকের সবচেয়ে বেশি মনে থাকে। আপনার মূল কথাটি সেখানেই রাখুন।',
          'Linking word দিয়ে যে কাজটি করাতে চান, এই নীতিই তার বেশিরভাগ করে দেয়।',
        ],
      },
      {
        id: 'm20-r2',
        heading: 'End-weight (ভারী অংশ শেষে রাখা)',
        rule: 'লম্বা ও জটিল অংশ বাক্যের শেষে বসে, শুরুতে নয়।',
        whenToUse: 'যখন Subject-টি প্রায় দশ শব্দের বেশি লম্বা হয়ে যায়।',
        structure: [
          'Heavy subject: That governments should invest more heavily in renewable infrastructure is clear.',
          'End-weight: It is clear that governments should invest more heavily in renewable infrastructure.',
          'Heavy subject: The need to reduce emissions, cut waste and protect biodiversity is urgent.',
          'End-weight: There is an urgent need to reduce emissions, cut waste and protect biodiversity.',
        ],
      },
      {
        id: 'm20-r3',
        heading: 'ক্রম বদলানোর উপকরণ',
        rule: 'চারটি গঠন দিয়ে তথ্য না বদলেই তার অবস্থান বদলানো যায়।',
        whenToUse: 'যখন স্বাভাবিক ক্রমে নতুন তথ্যটি শুরুতে চলে আসে।',
        structure: [
          'Passive: যার উপর কাজ পড়েছে তাকে আগে আনে। The scheme was criticised by residents.',
          'Existential there: নতুন কিছু উপস্থাপন করে। There are three explanations for this.',
          'Extraposition: Clause-কে শেষে সরায়। It is clear that demand has risen.',
          'Fronted adverbial: প্রেক্ষাপট তৈরি করে। In rural areas, access remains limited.',
        ],
        notes: [
          'এগুলো Module 8 ও Module 14-এর সেই একই গঠন, তবে এখানে ব্যবহার হচ্ছে ব্যাকরণের জন্য নয়, সাবলীলতার জন্য।',
        ],
      },
      {
        id: 'm20-r4',
        heading: 'সেতু হিসেবে This + Summary Noun',
        rule: 'this বা these-এর সঙ্গে এমন একটি Noun বসিয়ে বাক্য শুরু করুন, যা আগের বাক্যটিকে এক কথায় বুঝিয়ে দেয়।',
        whenToUse: 'যে বাক্যটি আগের পুরো বাক্য নিয়ে মন্তব্য করছে, তার শুরুতে।',
        structure: [
          'Cities are expanding rapidly. This expansion places pressure on housing.',
          'Many firms now allow remote work. This shift has reduced office demand.',
          'কাজে লাগে এমন Noun: trend, shift, change, approach, measure, finding, problem, development, practice.',
        ],
        notes: [
          'এটি একই সঙ্গে cohesion-এর কৌশল এবং জানা তথ্য আগে রাখার উপায়।',
          'Noun ছাড়া this প্রায়ই অস্পষ্ট থাকে। Module 4 ও Module 21 দুটোতেই এই কথাটি আছে।',
        ],
      },
    ],
    examples: [
      {
        wrong: 'A sharp fall in rainfall, which affected three regions and lasted two years, occurred.',
        right: 'There was a sharp fall in rainfall, which affected three regions and lasted two years.',
        note: 'ভারী অংশটি এখন বাক্যের শেষে।',
      },
      {
        wrong: 'Firstly, cities grew. Moreover, housing costs rose. Furthermore, commuting increased.',
        right: 'Cities grew rapidly. This growth pushed up housing costs and lengthened commutes.',
        note: 'ক্রম বদলানোয় তিনটি connector-এর আর দরকারই পড়ল না।',
      },
      {
        wrong: 'To find a solution that satisfies all stakeholders is difficult.',
        right: 'It is difficult to find a solution that satisfies all stakeholders.',
        note: 'Extraposition end-weight নীতিকে সম্মান করে।',
      },
      {
        wrong: 'Residents criticised the scheme. The scheme was expensive and poorly planned.',
        right: 'The scheme was criticised by residents, who considered it expensive and poorly planned.',
        note: 'Passive জানা বিষয়টিকে আগে নিয়ে এসেছে।',
      },
      {
        wrong: 'Unemployment rose. This is a problem.',
        right: 'Unemployment rose sharply. This increase has placed pressure on welfare budgets.',
        note: 'Summary noun ধারণাটিকে সামনে এগিয়ে নিয়ে যায়।',
      },
    ],
    mistakes: [
      {
        wrong: 'Moreover, in addition, furthermore, the cost should also be considered.',
        right: 'Cost is a further consideration.',
        explanation:
          'তিনটি যোগবাচক connector একই কাজ করছে। বাক্যের অবস্থানই তো যোগ করার ইঙ্গিত দিচ্ছে।',
      },
      {
        wrong: 'That the climate is changing rapidly and that action is needed urgently is accepted.',
        right: 'It is widely accepted that the climate is changing rapidly and that urgent action is needed.',
        explanation: 'দুটি ভারী Subject Clause বাক্যের শেষে যাওয়াই উচিত।',
      },
      {
        wrong: 'Congestion charging reduced traffic. Traffic reduction improved air quality. Air quality improvements reduced illness.',
        right: 'Congestion charging reduced traffic, which improved air quality and, in turn, lowered rates of illness.',
        explanation:
          'তিন বাক্য ধরে জানা-নতুন শিকল টানা যান্ত্রিক শোনায়; এক বাক্যেই বিষয়টি ভালোভাবে আসে।',
      },
      {
        wrong: 'There is the government which should act on this issue.',
        right: 'The government should act on this issue.',
        explanation:
          'Existential there নতুন ও অনির্দিষ্ট তথ্য আনে, আগে থেকে জানা Subject নয়।',
      },
      {
        wrong: 'This is why it matters a lot for the future.',
        right: 'This pattern matters because it shapes long-term planning.',
        explanation: 'Summary noun ও একটি কারণ মিলে অস্পষ্ট সেতুটির জায়গা নিয়েছে।',
      },
    ],
    keyTakeaways: [
      'পাঠকের জানা তথ্য দিয়ে শুরু করুন, নতুন তথ্য দিয়ে শেষ করুন।',
      'ভারী অংশ বাক্যের শেষে রাখুন।',
      'তথ্য না বদলে ক্রম বদলাতে passive, there, extraposition ও fronting ব্যবহার করুন।',
      'দুই বাক্যের মধ্যে সবচেয়ে নির্ভরযোগ্য সেতু হলো this + summary noun।',
    ],
  },

  /* ----------------------------- Module 21 ----------------------------- */
  {
    moduleId: 21,
    intro:
      'Cohesion মানে connector-এর ভাণ্ডার নয়। এটি সেই কৌশলগুলোর সমষ্টি, যা দিয়ে একটি লেখা সবকিছু আবার না লিখেই নিজের আগের অংশকে নির্দেশ করতে পারে। Band descriptor-এ সরাসরি cohesive device-এর যান্ত্রিক অতিরিক্ত ব্যবহারের বিষয়ে সতর্ক করা আছে, তাই reference, substitution ও ellipsis অনেক বেশি মূল্যবান দক্ষতা।',
    rules: [
      {
        id: 'm21-r1',
        heading: 'Reference (পূর্বোল্লেখ নির্দেশ)',
        rule: 'Pronoun, Demonstrative ও Definite article - তিনটিই আগে উল্লেখ করা কিছুকে নির্দেশ করে।',
        whenToUse: 'প্রতিটি অনুচ্ছেদেই, প্রতিনিয়ত।',
        structure: [
          'Pronoun: The committee met yesterday. It approved the budget.',
          'Demonstrative: Three cities were studied. These differ in size.',
          'Definite article: A new tax was introduced. The tax raised 2 billion.',
          'তুলনামূলক নির্দেশ: a similar pattern, the same trend, another approach',
        ],
        notes: [
          'The দিয়েই পাঠক বুঝে যান যে এই Noun-টি আগে এসেছে, আর এটিই নিজে থেকে একটি cohesion-এর কাজ।',
        ],
      },
      {
        id: 'm21-r2',
        heading: 'Substitution (বিকল্প শব্দ বসানো)',
        rule: 'পুরো একটি লম্বা অংশ আবার না লিখে তার জায়গায় একটি ছোট শব্দ বসানো হয়।',
        whenToUse: 'যখন কোনো Noun বা Verb phrase আবার লিখতে হচ্ছে।',
        structure: [
          'Countable Noun-এর জন্য one / ones: The old system was slow; the new one is faster.',
          'Verb phrase-এর জন্য do so / does so: Those who recycle do so for environmental reasons.',
          'Clause-এর জন্য so: If demand rises, and it seems likely to do so, prices will follow.',
          'such + noun: Such measures are rarely popular.',
        ],
        notes: [
          'Do so হলো do it-এর আনুষ্ঠানিক লিখিত রূপ এবং essay-তে এটি বিশেষভাবে কাজে লাগে।',
        ],
      },
      {
        id: 'm21-r3',
        heading: 'Ellipsis (উহ্য রাখা)',
        rule: 'আগের Clause থেকে পাঠক যে শব্দগুলো নিজেই বুঝে নিতে পারবেন, সেগুলো বাদ দিন।',
        whenToUse: 'জোড়া গঠনে ও তুলনায়।',
        structure: [
          'Some countries invest heavily in rail; others, in roads.',
          'The first policy succeeded; the second did not.',
          'She can speak French, and he can too.',
          'More was spent on healthcare than on education.',
        ],
        notes: [
          'যা বাদ দেবেন তা পাঠকের উদ্ধার করার মতো হতে হবে। পাঠককে আন্দাজ করতে হলে শব্দগুলো লিখে দিন।',
        ],
      },
      {
        id: 'm21-r4',
        heading: 'Connector পরিমিত রাখুন',
        rule: 'সম্পর্কটি সত্যিই অপ্রত্যাশিত হলে বা চিহ্নিত করা দরকার হলেই linking adverbial ব্যবহার করুন। প্রতিটি বাক্য connector দিয়ে শুরু করবেন না।',
        whenToUse: 'মোটামুটি প্রতি তিন-চার বাক্যে একবার, এর বেশি নয়।',
        structure: [
          'Overloaded: Firstly, cities are growing. Moreover, housing is scarce. Furthermore, prices are rising. In addition, wages are flat.',
          'Natural: Cities are growing while housing remains scarce. Prices have risen accordingly, and wages have not kept pace.',
        ],
        table: {
          caption: 'আরেকটি connector-এর বদলে কী করবেন',
          headers: ['এর বদলে', 'এটি করুন'],
          rows: [
            ['Moreover, ...', 'দুটি বাক্য and বা Relative Clause দিয়ে জুড়ে দিন'],
            ['Furthermore, ...', 'This + summary noun দিয়ে প্রসঙ্গ এগিয়ে নিন'],
            ['In addition, ...', 'এক বাক্যের ভেতরেই একটি তালিকা বানান'],
            ['Therefore, ...', 'ফলাফলবাচক participle clause: ..., reducing costs.'],
          ],
        },
      },
    ],
    examples: [
      {
        wrong: 'The new policy replaced the old policy because the old policy was ineffective.',
        right: 'The new policy replaced the old one, which had proved ineffective.',
        note: 'Substitution ও Relative Clause মিলে দুটি পুনরাবৃত্তি সরিয়ে দিয়েছে।',
      },
      {
        wrong: 'People who volunteer, they volunteer for personal reasons.',
        right: 'People who volunteer usually do so for personal reasons.',
        note: 'Do so পুরো Verb phrase-টির জায়গা নিয়েছে।',
      },
      {
        wrong: 'Firstly, pollution is rising. Secondly, traffic is rising. Thirdly, noise is rising.',
        right: 'Pollution, traffic and noise are all increasing.',
        note: 'একটি বাক্যই তিনটি connector-এর কাজ করে দিয়েছে।',
      },
      {
        wrong: 'These kind of problems require urgent action.',
        right: 'These kinds of problem require urgent action.',
        note: 'These-এর সঙ্গে বহুবচন Noun মিলতে হবে।',
      },
      {
        wrong: 'Some countries invest in rail. Other countries invest in roads.',
        right: 'Some countries invest in rail; others, in roads.',
        note: 'Ellipsis উদ্ধারযোগ্য শব্দগুলো সরিয়ে দিয়েছে।',
      },
    ],
    mistakes: [
      {
        wrong: 'Such problem is difficult to solve.',
        right: 'Such problems are difficult to solve.',
        explanation:
          'Such-এর পরে বহুবচন বা uncountable Noun বসে; একবচন countable Noun হলে such a লাগে।',
      },
      {
        wrong: 'Moreover, furthermore, the cost is also high.',
        right: 'The cost is also high.',
        explanation: 'Also আগেই যোগ বোঝাচ্ছে, তাই connector দুটি বাড়তি।',
      },
      {
        wrong: 'The report was long. This made difficult to read.',
        right: 'The report was long, which made it difficult to read.',
        explanation: 'Make-এর একটি Object লাগে; এখানে it বোঝাচ্ছে report-কে।',
      },
      {
        wrong: 'I prefer the first option than the second one.',
        right: 'I prefer the first option to the second.',
        explanation:
          'Prefer-এর সঙ্গে to বসে, আর ellipsis-এর পরে শুধু the second লিখলেই যথেষ্ট।',
      },
      {
        wrong: 'Students who study abroad, they do it because of career reasons.',
        right: 'Students who study abroad often do so for career reasons.',
        explanation:
          'বাড়তি Pronoun বাদ দিন এবং আনুষ্ঠানিক বিকল্প do so ব্যবহার করুন।',
      },
    ],
    keyTakeaways: [
      'Reference, substitution ও ellipsis connector ছাড়াই cohesion তৈরি করে।',
      'Phrase-এর পুনরাবৃত্তি এড়াতে one, ones, do so ও such ব্যবহার করুন।',
      'শুধু সেটুকুই বাদ দিন যা পাঠক নিজে উদ্ধার করতে পারবেন।',
      'প্রতিটি বাক্যে connector থাকলে সেটি যান্ত্রিক শোনায় এবং এতে নম্বর কমে।',
    ],
  },

  /* ----------------------------- Module 22 ----------------------------- */
  {
    moduleId: 22,
    intro:
      'এই মডিউলটি ঐচ্ছিক। Cleft ও Inversion সত্যিকারের গঠন, যা দক্ষ লেখকরা জোর দেওয়ার জন্য ব্যবহার করেন, কিন্তু IELTS-এ কোনো band-এই এগুলো লাগে না; বরং জোর করে inversion লিখতে গিয়ে অনেকে সঠিক বাক্যকে ভুল বানিয়ে ফেলেন। এগুলো চিনে রাখার জন্য শিখুন, আর ব্যবহার করুন কেবল তখনই যখন জোর দেওয়াটা সত্যিই দরকার।',
    rules: [
      {
        id: 'm22-r1',
        heading: 'What-cleft (what দিয়ে জোর দেওয়া)',
        rule: 'What-cleft যে অংশটিতে আপনি জোর দিতে চান, সেটিকে বাক্যের দ্বিতীয়ার্ধে সরিয়ে নিয়ে যায়।',
        whenToUse:
          'একটি essay-তে বড়জোর একবার, সাধারণত কোনো মূল বক্তব্য বা সুপারিশ তুলে ধরতে।',
        structure: [
          'Plain: Governments need long-term planning.',
          'Cleft: What governments need is long-term planning.',
          'Plain: The cost matters most.',
          'Cleft: What matters most is the cost.',
        ],
        notes: [
          'What-clause যখন Subject হয়, তখন তার পরের Verb একবচন হয়: What matters is...',
        ],
      },
      {
        id: 'm22-r2',
        heading: 'It-cleft (it দিয়ে জোর দেওয়া)',
        rule: 'It-cleft বাক্যের একটি নির্দিষ্ট অংশকে আলাদা করে তুলে ধরে, বিশেষ করে বৈপরীত্য বোঝাতে।',
        whenToUse: 'যখন আপনি পাঠকের ধরে নেওয়া কোনো ধারণা সংশোধন করছেন।',
        structure: [
          'Plain: Poor planning caused the delay.',
          'Cleft: It was poor planning that caused the delay.',
          'Plain: The policy failed in rural areas.',
          'Cleft: It was in rural areas that the policy failed.',
        ],
        notes: ['বস্তু ও পরিস্থিতির জন্য that, আর মানুষের জন্য who বা that বসে।'],
      },
      {
        id: 'm22-r3',
        heading: 'Negative Inversion (নেতিবাচক শব্দে শব্দক্রম উল্টে যাওয়া)',
        rule: 'নেতিবাচক বা সীমাবদ্ধতাসূচক Adverbial দিয়ে বাক্য শুরু হলে Subject ও Auxiliary-র জায়গা বদলে যায়, ঠিক প্রশ্নের মতো।',
        whenToUse: 'খুব কম, এবং কেবল তখনই যখন গঠনটি আপনার পুরোপুরি আয়ত্তে আছে।',
        structure: [
          'Not only does the scheme reduce costs, but it also improves safety.',
          'Rarely has a policy attracted so much criticism.',
          'Only after 2010 did the figure begin to fall.',
          'Under no circumstances should this be ignored.',
        ],
        table: {
          caption: 'সাধারণ ও Inverted রূপ',
          headers: ['সাধারণ', 'Inverted'],
          rows: [
            ['The scheme not only reduces costs but also improves safety.', 'Not only does the scheme reduce costs, but it also improves safety.'],
            ['A policy has rarely attracted so much criticism.', 'Rarely has a policy attracted so much criticism.'],
            ['The figure only began to fall after 2010.', 'Only after 2010 did the figure begin to fall.'],
          ],
        },
        notes: [
          'Auxiliary না থাকলে do, does বা did সেই জায়গা পূরণ করে, আর মূল Verb তার base রূপে ফিরে যায়।',
          'not only...but also-তে শুধু প্রথম Clause-এ inversion হয়, দ্বিতীয়টিতে নয়।',
        ],
      },
      {
        id: 'm22-r4',
        heading: 'কখন এগুলো ব্যবহার করবেন না',
        rule: 'জোর দেওয়ার এই গঠনগুলোর একটি মূল্য আছে: এগুলো লম্বা, চোখে পড়ে এবং সহজেই ভুল হয়। অন্যদিকে সাধারণ বাক্য সাধারণ হওয়ার জন্য কখনো নম্বর হারায় না।',
        whenToUse: 'এই মডিউলের কোনো গঠন ব্যবহার করার সিদ্ধান্ত নেওয়ার আগে এটি পড়ুন।',
        structure: [
          'IELTS নম্বর দেয় নানা ধরনের গঠন সঠিক ও সাবলীলভাবে ব্যবহারের জন্য, কোনো নির্দিষ্ট দেখানো-গঠনের তালিকার জন্য নয়।',
          'ভুলসহ একটি inverted বাক্যের ক্ষতি নির্ভুল সাধারণ বাক্যের চেয়ে অনেক বেশি।',
          'সময়ের চাপে গঠনটি যদি আপনাআপনি বেরিয়ে না আসে, পরীক্ষায় সেটি ব্যবহার করবেন না।',
        ],
        notes: [
          'উন্নত পর্যায়ের নম্বর আসলে আসে Module 18 থেকে 21 থেকে। এই মডিউলটিকে বাড়তি সমৃদ্ধি হিসেবে দেখুন।',
        ],
      },
    ],
    examples: [
      {
        wrong: 'What governments needs is long-term planning.',
        right: 'What governments need is long-term planning.',
        note: 'What-clause-এর ভেতরের Verb মেলে governments-এর সঙ্গে।',
      },
      {
        wrong: 'Not only the scheme reduces costs, but also improves safety.',
        right: 'Not only does the scheme reduce costs, but it also improves safety.',
        note: 'নেতিবাচক শব্দ সামনে এলে inversion লাগে, আর দ্বিতীয় Clause-এ নিজস্ব Subject দরকার।',
      },
      {
        wrong: 'Rarely a policy has attracted so much criticism.',
        right: 'Rarely has a policy attracted so much criticism.',
        note: 'শুরুতে rarely বসলে inversion হয়।',
      },
      {
        wrong: 'It was the cost what caused the delay.',
        right: 'It was the cost that caused the delay.',
        note: 'It-cleft-এ what নয়, that বসে।',
      },
      {
        wrong: 'Only after the law changed the figure began to fall.',
        right: 'Only after the law changed did the figure begin to fall.',
        note: 'Only + adverbial-এর ক্ষেত্রে do-support ও base form লাগে।',
      },
    ],
    mistakes: [
      {
        wrong: 'Never before people have had access to so much information.',
        right: 'Never before have people had access to so much information.',
        explanation: 'নেতিবাচক শব্দ সামনে এলে Auxiliary Subject-এর আগে চলে আসে।',
      },
      {
        wrong: 'What is needed are stronger regulations.',
        right: 'What is needed is stronger regulations.',
        explanation: 'What-clause একটি একবচন Subject, তাই Verb একবচনই থাকে।',
      },
      {
        wrong: 'Not only it is expensive but also ineffective.',
        right: 'It is not only expensive but also ineffective.',
        explanation:
          'সামনে না আনলে inversion-ও লাগে না, আর সাধারণ রূপটিই সঠিক ও সহজ।',
      },
      {
        wrong: 'Under no circumstances we should ignore this evidence.',
        right: 'Under no circumstances should we ignore this evidence.',
        explanation: 'শুরুতে বসা সীমাবদ্ধতাসূচক phrase inversion দাবি করে।',
      },
      {
        wrong: 'It is the government who is responsible for it is the funding.',
        right: 'The government is responsible for funding.',
        explanation:
          'ভাঙা cleft-এর চেয়ে cleft না থাকাই ভালো। সন্দেহ হলে সাধারণ বাক্যটিই লিখুন।',
      },
    ],
    keyTakeaways: [
      'এই গঠনগুলো ঐচ্ছিক এবং Band 8-এর জন্য মোটেও বাধ্যতামূলক নয়।',
      'What-cleft ও it-cleft জোর বদলায়; what-clause-এর পরে Verb একবচন রাখুন।',
      'শুরুতে নেতিবাচক শব্দ বসলে Subject ও Auxiliary উল্টে যায় এবং do-support লাগে।',
      'ভুলসহ উচ্চাকাঙ্ক্ষী বাক্যের চেয়ে নির্ভুল সাধারণ বাক্য সবসময় ভালো।',
    ],
  },
]
