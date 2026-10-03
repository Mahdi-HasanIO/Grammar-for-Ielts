import type { Lesson } from '@/types'

export const stage4Lessons: Lesson[] = [
  /* ----------------------------- Module 18 ----------------------------- */
  {
    moduleId: 18,
    intro:
      'Academic লেখা academic শোনায় একের পর এক লম্বা Clause-এর জন্য নয়, বরং অনেক তথ্য গুছিয়ে একটা Noun phrase-এ আনার জন্য। Noun phrase বানানো আর দরকার হলে ভেঙে সহজ করা, এই কোর্সের সবচেয়ে কাজের advanced দক্ষতা এটাই। আর কোথায় থামতে হবে, সেটা জানাও এর অংশ।',
    rules: [
      {
        id: 'm18-r1',
        heading: 'Noun phrase বড় করার চারটা উপায়',
        rule: 'Noun-এর আগে, পরে বা দুই দিকেই বর্ণনা যোগ করা যায়। Academic writing-এ এই চারটা গঠনই প্রচুর ব্যবহার হয়।',
        whenToUse: 'যখন কোনো বাক্য ঢিলেঢালা লাগে, বা একই কথা বারবার আসে।',
        structure: [
          'Adjective + noun: rapid growth',
          'Noun + noun: government policy, traffic congestion, air quality',
          'Noun + of-phrase: the growth of the economy',
          'Noun + অন্য কোনো preposition: the impact on rural communities',
          'Noun + relative বা participle clause: the policy introduced in 2015',
        ],
        table: {
          caption: 'ধাপে ধাপে Noun phrase বানানো',
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
          'Noun + noun গঠনে প্রথম Noun-টা একবচনেই থাকে: a three-year programme, a car park, government policy.',
        ],
      },
      {
        id: 'm18-r2',
        heading: 'Nominalization (Verb থেকে Noun বানানো)',
        rule: 'Nominalization মানে Verb বা Adjective-কে Noun-এ বদলে ফেলা। এতে একটা পুরো প্রক্রিয়াকেই বাক্যের Subject বানানো যায় (যেমন prices rose → the rise in prices)।',
        whenToUse:
          'যখন আগে বলা কোনো কাজকে সংক্ষেপে আবার বোঝাতে চান, বা সেটাকেই পরের বাক্যের মূল বিষয় বানাতে চান।',
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
          'Adverb-টা Adjective হয়ে যায়: rose rapidly হয়ে যায় a rapid rise।',
          'Noun-এর সঙ্গে যে Preposition বসে, সেটা ঠিক রাখুন: a rise in, an impact on, a reduction in.',
        ],
      },
      {
        id: 'm18-r3',
        heading: 'Apposition আর Noun Complement Clause',
        rule: 'Apposition-এ দুটো Noun phrase পাশাপাশি বসে, আর দ্বিতীয়টা প্রথমটাকে অন্যভাবে ব্যাখ্যা করে। Noun complement clause-এ that দিয়ে জানানো হয় idea, claim বা fact-এর মতো Noun-এর ভেতরের কথাটা কী।',
        whenToUse: 'নতুন বাক্য না লিখেই কোনো শব্দ ব্যাখ্যা করতে, বা কোনো দাবিতে আসলে কী বলা হয়েছে তা জানাতে।',
        structure: [
          'Apposition: Jakarta, the capital of Indonesia, is sinking.',
          'Apposition: One solution, congestion charging, has proved effective.',
          'Noun + that-clause: the claim that technology destroys jobs',
          'বহুল ব্যবহৃত Noun: the idea / belief / fact / claim / argument / possibility that...',
        ],
        notes: [
          'Noun complement clause কিন্তু Relative Clause নয়: the fact that prices rose সঠিক, the fact which prices rose নয়।',
        ],
      },
      {
        id: 'm18-r4',
        heading: 'কোথায় থামতে হবে',
        rule: 'কম শব্দে বেশি বলা একটা কৌশল, লক্ষ্য নয়। একটা Noun phrase-এ তিন বা তার বেশি modifier জমে গেলে পাঠককে সেটা ভেঙে ভেঙে বুঝতে হয়, ফলে লেখা অস্পষ্ট হয়ে যায়।',
        whenToUse: 'যখন নিজের লেখা আবার পড়তে গিয়ে আপনি নিজেই খেই হারিয়ে ফেলেন।',
        structure: [
          'Overloaded: Government urban transport infrastructure investment policy reform proposals',
          'Clearer: proposals to reform government policy on investment in urban transport',
          'Overloaded: The implementation of the reduction of the utilisation of plastic',
          'Clearer: Reducing plastic use',
        ],
        notes: [
          'পরপর অনেকগুলো of-phrase থাকলেই বুঝবেন বাড়াবাড়ি হয়ে গেছে। Module 23-এ এর সমাধান আছে।',
        ],
      },
    ],
    examples: [
      {
        wrong: 'Because the population grew quickly, the city expanded.',
        right: 'Rapid population growth drove the expansion of the city.',
        note: 'Clause-টা এমন একটা Noun phrase হয়ে গেছে, যেটা নিজেই Subject হতে পারে।',
      },
      {
        wrong: 'There was an increase of 20 per cent in the prices rapidly.',
        right: 'There was a rapid 20 per cent increase in prices.',
        note: 'Noun phrase-এর ভেতরে Adverb-টা Adjective হয়ে যায়।',
      },
      {
        wrong: 'the governments policies on the environment',
        right: 'government environmental policy',
        note: 'Noun modifier একবচনে থাকে, আর এতে apostrophe লাগে না।',
      },
      {
        wrong: 'The fact which the policy failed is undeniable.',
        right: 'The fact that the policy failed is undeniable.',
        note: 'Noun complement clause-এ which নয়, that বসে।',
      },
      {
        wrong: 'The reduction of the amount of the consumption of water',
        right: 'Reduced water consumption',
        note: 'তিনটা of-phrase কমে এখন দুটো noun modifier হয়েছে।',
      },
    ],
    mistakes: [
      {
        wrong: 'The increasing of prices has affected low-income families.',
        right: 'The increase in prices has affected low-income families.',
        explanation:
          'প্রচলিত Noun রূপ থাকলে সেটাই ব্যবহার করুন, সঙ্গে তার নিজের Preposition।',
      },
      {
        wrong: 'a five-years plan for the development of the economy',
        right: 'a five-year economic development plan',
        explanation:
          'Compound modifier একবচনে থাকে, আর of-phrase-এর চেয়ে Adjective হালকা আর ঝরঝরে।',
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
          'Noun complement clause সরাসরি Noun-এর পরে বসে; that-এর আগে কোনো Preposition বসে না।',
      },
      {
        wrong: 'The utilisation of the implementation of new technology methodologies',
        right: 'Introducing new technology',
        explanation:
          'একের পর এক abstract Noun জমালে অর্থ হারিয়ে যায়। তেমন হলে আবার Verb দিয়ে লিখুন।',
      },
    ],
    keyTakeaways: [
      'Head noun-এর আগে আর পরে তথ্য সাজিয়ে নিন।',
      'Clause-কে Noun phrase বানালে একটা পুরো প্রক্রিয়াকেও Subject করা যায়।',
      'Noun modifier একবচনে থাকে: a three-year plan, government policy।',
      'পাঠককে যদি দুবার পড়ে বুঝতে হয়, সেখানেই থামুন।',
    ],
  },

  /* ----------------------------- Module 19 ----------------------------- */
  {
    moduleId: 19,
    intro:
      'Hedging হলো অভিজ্ঞ লেখকদের সেই কৌশল, যা দিয়ে তাঁরা এমন দাবি করেন যেটার পক্ষে দাঁড়ানো যায়। All বা always দিয়ে চরম দাবি করলেই পাঠকের মাথায় একটা ব্যতিক্রম চলে আসে, কিন্তু মেপে করা দাবি টিকে থাকে। এটা দুর্বলতা বা ঘোলাটে কথা নয়; বরং আপনার প্রমাণ ঠিক কতটুকু বলে, সেটুকুই নির্ভুলভাবে বলা।',
    rules: [
      {
        id: 'm19-r1',
        heading: 'Hedging-এর হাতিয়ার',
        rule: 'চার ধরনের শব্দ দিয়ে দাবির জোর কমানো যায়: Modal Verb, সাধারণ Verb (tend, appear), Adverb (often, generally) আর Quantifier (many, some)।',
        whenToUse: 'কারণ, ফলাফল বা ভবিষ্যৎ নিয়ে যেকোনো সাধারণ দাবিতে।',
        structure: [
          'Modal: may, might, could, can, would',
          'Verb: tend to, appear to, seem to, suggest, indicate, imply',
          'Adverb: often, generally, largely, arguably, relatively, possibly',
          'Quantifier: many, most, some, a number of, in some cases',
          'গঠন: It is likely that..., It appears that..., There is evidence that...',
        ],
        table: {
          caption: 'দাবির জোর কমানো',
          headers: ['চরম দাবি', 'মেপে করা দাবি'],
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
        rule: 'অনেক সময় সবচেয়ে ভালো উপায় Verb নরম করা নয়, বরং দাবিটা কোন পরিস্থিতিতে খাটে, সেটা বলে দেওয়া।',
        whenToUse: 'যখন আপনি দাবিটা বিশ্বাস করেন, কিন্তু সেটা সব ক্ষেত্রে সত্য নয়।',
        structure: [
          'Weak: Technology always improves education.',
          'Better: Technology can improve educational outcomes when it is properly implemented.',
          'Better: In well-resourced schools, technology has improved outcomes considerably.',
        ],
        notes: [
          'Conditional clause দাবিটাকে শুধু নরম করে না, নির্ভুলও করে।',
          'এতে আপনার Task Response-ও ভালো হয়, কারণ বোঝা যায় আপনি সীমাবদ্ধতা নিয়েও ভেবেছেন।',
        ],
      },
      {
        id: 'm19-r3',
        heading: 'অন্যের বক্তব্য তুলে ধরা',
        rule: 'কোন Reporting verb বাছলেন, তা থেকেই বোঝা যায় আপনি নিজে বিষয়টাকে কীভাবে দেখছেন, তাই ভেবেচিন্তে বাছুন।',
        whenToUse: 'গবেষণা, সমালোচক বা প্রচলিত মতের কথা বলার সময়।',
        structure: [
          'নিরপেক্ষ: states, reports, notes, describes',
          'সমর্থন করে: shows, demonstrates, establishes, confirms',
          'সতর্ক: suggests, indicates, implies',
          'নিজেকে দূরে রাখে: claims, asserts, alleges',
        ],
        notes: [
          'shows বা demonstrates লিখলে আপনি নিজেও ফলাফলটা মেনে নিচ্ছেন; suggests বা indicates-এ সেই দায় থাকে না।',
          'Claims লিখলে বোঝায় আপনি বিষয়টা নিয়ে সন্দিহান। এটা ভেবেচিন্তে ব্যবহার করুন, ভুল করে নয়।',
        ],
      },
      {
        id: 'm19-r4',
        heading: 'অতিরিক্ত Hedging নয়',
        rule: 'একের পর এক hedge বসালে বাক্যটা শেষে আর কিছুই বলে না। প্রতিটি দাবিতে এক বা দুটোই যথেষ্ট।',
        whenToUse: 'লেখা edit করার সময়।',
        structure: [
          'Over-hedged: It could possibly be argued that there may perhaps be some evidence that this might be true.',
          'Fixed: There is some evidence that this is true.',
          'Over-hedged: It seems that it may be likely that costs could rise.',
          'Fixed: Costs are likely to rise.',
        ],
        notes: [
          'IELTS Task 2-তে প্রশ্নের উত্তর আপনাকে দিতেই হবে। Hedging আপনার মতকে মেপে প্রকাশ করে, কিন্তু মত না দেওয়ার অজুহাত নয়।',
        ],
      },
    ],
    examples: [
      {
        wrong: 'Technology always improves education.',
        right: 'Technology can improve educational outcomes when it is implemented effectively.',
        note: 'শর্ত যোগ করায় এখন দাবিটার পক্ষে দাঁড়ানো যায়।',
      },
      {
        wrong: 'All young people are addicted to social media.',
        right: 'Many young people spend a considerable amount of time on social media.',
        note: 'চরম quantifier আর অতি জোরালো Verb, দুটোই বদলানো হয়েছে।',
      },
      {
        wrong: 'This study proves that exercise prevents depression.',
        right: 'This study indicates that exercise may help prevent depression.',
        note: 'একটা গবেষণা ইঙ্গিত দেয়, প্রমাণ করে না।',
      },
      {
        wrong: 'It is possible that it might perhaps be true that costs may rise.',
        right: 'Costs are likely to rise.',
        note: 'একটা hedge-ই যথেষ্ট।',
      },
      {
        wrong: 'Everybody knows that cities are dangerous.',
        right: 'Cities are often perceived as less safe than rural areas.',
        note: 'মতামতকে মতামত হিসেবেই লিখুন, প্রমাণিত সত্য হিসেবে নয়।',
      },
    ],
    mistakes: [
      {
        wrong: 'Pollution definitely causes all respiratory diseases.',
        right: 'Pollution contributes to a range of respiratory conditions.',
        explanation:
          'All আর definitely-র পক্ষে যুক্তি দেওয়া অসম্ভব; contributes to একটা বাস্তবসম্মত সম্পর্ক বোঝায়।',
      },
      {
        wrong: 'The graph proves that the policy was successful.',
        right: 'The graph suggests that the policy had some effect.',
        explanation: 'চার্ট একটা প্রবণতা দেখায়, কারণ প্রমাণ করে না।',
      },
      {
        wrong: 'It tends to be that students may possibly perform better.',
        right: 'Students tend to perform better.',
        explanation: 'Tend to নিজেই একটা hedge; বাকিগুলো শুধু বাড়তি শব্দ।',
      },
      {
        wrong: 'In my opinion, I think that perhaps the government should maybe act.',
        right: 'The government should act.',
        explanation:
          'আপনার মত স্পষ্ট থাকা উচিত। Hedge করুন প্রমাণ নিয়ে করা দাবিকে, নিজের মতকে নয়।',
      },
      {
        wrong: 'Research is proving that this approach is the only solution.',
        right: 'Research suggests that this approach is one effective solution.',
        explanation:
          'The only solution এমন একটা চরম দাবি, যেটা কোনো গবেষণাই সমর্থন করতে পারে না।',
      },
    ],
    keyTakeaways: [
      'Modal, tend to, suggest আর Adverb দিয়ে দাবিকে প্রমাণের সঙ্গে মিলিয়ে নিন।',
      'অনেক সময় Verb নরম করার চেয়ে একটা শর্ত যোগ করা ভালো।',
      'Reporting verb-এ আপনার মতামত লুকিয়ে থাকে: shows লিখলে দায় নিচ্ছেন, suggests লিখলে নিচ্ছেন না।',
      'প্রতিটি দাবিতে একটা hedge; কিন্তু hedge করতে করতে নিজের মতটাই মুছে ফেলবেন না।',
    ],
  },

  /* ----------------------------- Module 20 ----------------------------- */
  {
    moduleId: 20,
    intro:
      'লেখা তখনই সাবলীল লাগে, যখন প্রতিটি বাক্য শুরু হয় পাঠকের আগে থেকে জানা কিছু দিয়ে। Paragraph এলোমেলো লাগলে বেশিরভাগ মানুষ আরও linking word বসিয়ে দেন। কিন্তু আসল সমাধান সাধারণত বাক্যের ভেতরে তথ্যের ক্রম বদলানো।',
    rules: [
      {
        id: 'm20-r1',
        heading: 'জানা কথা আগে, নতুন কথা পরে',
        rule: 'পাঠক যা ইতিমধ্যে জানেন, তা দিয়ে বাক্য শুরু করুন, আর নতুন তথ্যটা রাখুন শেষে।',
        whenToUse: 'Paragraph-এর প্রথম বাক্যের পর থেকে প্রতিটি বাক্যে।',
        structure: [
          'Choppy: A new tax was introduced in 2015. Congestion fell by 20 per cent because of the tax.',
          'Flowing: In 2015 the city introduced a new tax. This measure cut congestion by 20 per cent.',
        ],
        notes: [
          'বাক্যের শেষ কয়েকটা শব্দই পাঠকের সবচেয়ে বেশি মনে থাকে। আপনার মূল কথাটা সেখানেই রাখুন।',
          'Linking word দিয়ে যে কাজটা করাতে চান, এই নিয়মটাই তার বেশিরভাগ করে দেয়।',
        ],
      },
      {
        id: 'm20-r2',
        heading: 'End-weight (ভারী অংশ শেষে রাখা)',
        rule: 'লম্বা আর জটিল অংশ বাক্যের শেষে বসে, শুরুতে নয়।',
        whenToUse: 'যখন Subject-টা দশ শব্দের বেশি লম্বা হয়ে যায়।',
        structure: [
          'Heavy subject: That governments should invest more heavily in renewable infrastructure is clear.',
          'End-weight: It is clear that governments should invest more heavily in renewable infrastructure.',
          'Heavy subject: The need to reduce emissions, cut waste and protect biodiversity is urgent.',
          'End-weight: There is an urgent need to reduce emissions, cut waste and protect biodiversity.',
        ],
      },
      {
        id: 'm20-r3',
        heading: 'তথ্যের ক্রম বদলানোর হাতিয়ার',
        rule: 'চারটা গঠন দিয়ে তথ্য না বদলেই বাক্যে তার জায়গা বদলানো যায়।',
        whenToUse: 'যখন স্বাভাবিকভাবে লিখলে নতুন তথ্যটা বাক্যের শুরুতে চলে আসে।',
        structure: [
          'Passive: কাজটা যার উপর হয়েছে, তাকে আগে আনে। The scheme was criticised by residents.',
          'Existential there: নতুন কিছুর কথা তোলে। There are three explanations for this.',
          'Extraposition: Clause-কে শেষে পাঠায়। It is clear that demand has risen.',
          'Fronted adverbial: শুরুতেই প্রেক্ষাপট ঠিক করে দেয়। In rural areas, access remains limited.',
        ],
        notes: [
          'এগুলো Module 8 আর Module 14-এর সেই একই গঠন, তবে এখানে ব্যবহার হচ্ছে grammar-এর জন্য নয়, লেখার flow-এর জন্য।',
        ],
      },
      {
        id: 'm20-r4',
        heading: 'দুই বাক্যের সংযোগ: This + Summary Noun',
        rule: 'this বা these-এর সঙ্গে এমন একটা Noun বসিয়ে বাক্য শুরু করুন, যেটা আগের বাক্যটাকে এক কথায় বুঝিয়ে দেয়।',
        whenToUse: 'যে বাক্য আগের পুরো বাক্যটা নিয়ে মন্তব্য করছে, তার শুরুতে।',
        structure: [
          'Cities are expanding rapidly. This expansion places pressure on housing.',
          'Many firms now allow remote work. This shift has reduced office demand.',
          'কাজে লাগে এমন Noun: trend, shift, change, approach, measure, finding, problem, development, practice.',
        ],
        notes: [
          'এটা একই সঙ্গে cohesion-এর কৌশল, আর জানা তথ্য আগে রাখার উপায়।',
          'Noun ছাড়া শুধু this প্রায়ই অস্পষ্ট থাকে। Module 4 আর Module 21 দুটোতেই এই কথাটা আছে।',
        ],
      },
    ],
    examples: [
      {
        wrong: 'A sharp fall in rainfall, which affected three regions and lasted two years, occurred.',
        right: 'There was a sharp fall in rainfall, which affected three regions and lasted two years.',
        note: 'ভারী অংশটা এখন বাক্যের শেষে।',
      },
      {
        wrong: 'Firstly, cities grew. Moreover, housing costs rose. Furthermore, commuting increased.',
        right: 'Cities grew rapidly. This growth pushed up housing costs and lengthened commutes.',
        note: 'ক্রম বদলানোয় তিনটা connector-এর আর দরকারই পড়ল না।',
      },
      {
        wrong: 'To find a solution that satisfies all stakeholders is difficult.',
        right: 'It is difficult to find a solution that satisfies all stakeholders.',
        note: 'Extraposition করায় ভারী অংশটা শেষে গেছে (end-weight)।',
      },
      {
        wrong: 'Residents criticised the scheme. The scheme was expensive and poorly planned.',
        right: 'The scheme was criticised by residents, who considered it expensive and poorly planned.',
        note: 'Passive করায় জানা বিষয়টা আগে চলে এসেছে।',
      },
      {
        wrong: 'Unemployment rose. This is a problem.',
        right: 'Unemployment rose sharply. This increase has placed pressure on welfare budgets.',
        note: 'Summary noun আগের আইডিয়াটাকে ধরে সামনে এগিয়ে নেয়।',
      },
    ],
    mistakes: [
      {
        wrong: 'Moreover, in addition, furthermore, the cost should also be considered.',
        right: 'Cost is a further consideration.',
        explanation:
          'তিনটা connector একই কাজ করছে, মানে আরও কিছু যোগ করা। বাক্যের ক্রমই তো সেটা বুঝিয়ে দিচ্ছে।',
      },
      {
        wrong: 'That the climate is changing rapidly and that action is needed urgently is accepted.',
        right: 'It is widely accepted that the climate is changing rapidly and that urgent action is needed.',
        explanation: 'দুটো ভারী Subject Clause বাক্যের শেষে যাওয়াই উচিত।',
      },
      {
        wrong: 'Congestion charging reduced traffic. Traffic reduction improved air quality. Air quality improvements reduced illness.',
        right: 'Congestion charging reduced traffic, which improved air quality and, in turn, lowered rates of illness.',
        explanation:
          'তিনটা বাক্য ধরে যান্ত্রিকভাবে জানা-নতুন সাজালে কৃত্রিম শোনায়; এক বাক্যেই কথাটা ভালোভাবে বলা যায়।',
      },
      {
        wrong: 'There is the government which should act on this issue.',
        right: 'The government should act on this issue.',
        explanation:
          'Existential there দিয়ে নতুন আর অনির্দিষ্ট তথ্য আনা হয়, আগে থেকে জানা Subject নয়।',
      },
      {
        wrong: 'This is why it matters a lot for the future.',
        right: 'This pattern matters because it shapes long-term planning.',
        explanation: 'অস্পষ্ট this-এর জায়গায় এখন summary noun আর একটা কারণ, তাই দুই বাক্যের সংযোগ পরিষ্কার।',
      },
    ],
    keyTakeaways: [
      'পাঠকের জানা তথ্য দিয়ে শুরু করুন, নতুন তথ্য দিয়ে শেষ করুন।',
      'ভারী অংশ বাক্যের শেষে রাখুন।',
      'তথ্য না বদলে ক্রম বদলাতে passive, there, extraposition আর fronting ব্যবহার করুন।',
      'দুই বাক্য জোড়ার সবচেয়ে নির্ভরযোগ্য উপায় হলো this + summary noun।',
    ],
  },

  /* ----------------------------- Module 21 ----------------------------- */
  {
    moduleId: 21,
    intro:
      'Cohesion মানে connector-এর লম্বা লিস্ট নয়। Cohesion হলো সেই কৌশলগুলো, যা দিয়ে একটা লেখা আগে বলা কথা আবার পুরোটা না লিখেই সেদিকে ইঙ্গিত করতে পারে। Band descriptor-এ সরাসরি বলা আছে, cohesive device যান্ত্রিকভাবে বেশি ব্যবহার করা যাবে না। তাই reference, substitution আর ellipsis অনেক বেশি কাজের দক্ষতা।',
    rules: [
      {
        id: 'm21-r1',
        heading: 'Reference (আগে বলা কিছুর দিকে ইঙ্গিত)',
        rule: 'Pronoun, Demonstrative (this, these) আর Definite article (the) - তিনটাই আগে বলা কিছুকে বোঝায়।',
        whenToUse: 'প্রতিটি paragraph-এ, সবসময়।',
        structure: [
          'Pronoun: The committee met yesterday. It approved the budget.',
          'Demonstrative: Three cities were studied. These differ in size.',
          'Definite article: A new tax was introduced. The tax raised 2 billion.',
          'তুলনা দিয়ে ইঙ্গিত: a similar pattern, the same trend, another approach',
        ],
        notes: [
          'The দেখেই পাঠক বুঝে যান যে এই Noun-টা আগে এসেছে; এটাও নিজে থেকেই cohesion-এর কাজ করে।',
        ],
      },
      {
        id: 'm21-r2',
        heading: 'Substitution (ছোট শব্দ দিয়ে বদলে দেওয়া)',
        rule: 'লম্বা একটা অংশ আবার না লিখে, তার জায়গায় একটা ছোট শব্দ বসানো হয়।',
        whenToUse: 'যখন কোনো Noun বা Verb phrase আবার লিখতে হচ্ছে।',
        structure: [
          'Countable Noun-এর জন্য one / ones: The old system was slow; the new one is faster.',
          'Verb phrase-এর জন্য do so / does so: Those who recycle do so for environmental reasons.',
          'Clause-এর জন্য so: If demand rises, and it seems likely to do so, prices will follow.',
          'such + noun: Such measures are rarely popular.',
        ],
        notes: [
          'Do so হলো do it-এর formal লিখিত রূপ, আর essay-তে এটা খুব কাজে লাগে।',
        ],
      },
      {
        id: 'm21-r3',
        heading: 'Ellipsis (বুঝে নেওয়া যায় এমন শব্দ বাদ দেওয়া)',
        rule: 'আগের Clause থেকে পাঠক যে শব্দগুলো নিজেই বুঝে নিতে পারবেন, সেগুলো বাদ দিন।',
        whenToUse: 'জোড়া লাগানো গঠনে আর তুলনায়।',
        structure: [
          'Some countries invest heavily in rail; others, in roads.',
          'The first policy succeeded; the second did not.',
          'She can speak French, and he can too.',
          'More was spent on healthcare than on education.',
        ],
        notes: [
          'যা বাদ দেবেন, পাঠক যেন সেটা নিজেই বুঝে নিতে পারেন। পাঠককে আন্দাজ করতে হলে শব্দগুলো লিখেই দিন।',
        ],
      },
      {
        id: 'm21-r4',
        heading: 'Connector কম ব্যবহার করুন',
        rule: 'সম্পর্কটা সত্যিই অপ্রত্যাশিত হলে, বা আলাদা করে বলে দেওয়া দরকার হলে তবেই linking adverbial ব্যবহার করুন। প্রতিটি বাক্য connector দিয়ে শুরু করবেন না।',
        whenToUse: 'মোটামুটি প্রতি তিন-চারটা বাক্যে একবার, এর বেশি নয়।',
        structure: [
          'Overloaded: Firstly, cities are growing. Moreover, housing is scarce. Furthermore, prices are rising. In addition, wages are flat.',
          'Natural: Cities are growing while housing remains scarce. Prices have risen accordingly, and wages have not kept pace.',
        ],
        table: {
          caption: 'আরেকটা connector না বসিয়ে কী করবেন',
          headers: ['এর বদলে', 'এটি করুন'],
          rows: [
            ['Moreover, ...', 'দুটো বাক্য and বা Relative Clause দিয়ে জুড়ে দিন'],
            ['Furthermore, ...', 'This + summary noun দিয়ে কথা এগিয়ে নিন'],
            ['In addition, ...', 'এক বাক্যের ভেতরেই একটা তালিকা বানান'],
            ['Therefore, ...', 'ফলাফল বোঝানো participle clause: ..., reducing costs.'],
          ],
        },
      },
    ],
    examples: [
      {
        wrong: 'The new policy replaced the old policy because the old policy was ineffective.',
        right: 'The new policy replaced the old one, which had proved ineffective.',
        note: 'Substitution আর Relative Clause মিলে দুটো পুনরাবৃত্তি সরিয়ে দিয়েছে।',
      },
      {
        wrong: 'People who volunteer, they volunteer for personal reasons.',
        right: 'People who volunteer usually do so for personal reasons.',
        note: 'Do so পুরো Verb phrase-টার জায়গা নিয়েছে।',
      },
      {
        wrong: 'Firstly, pollution is rising. Secondly, traffic is rising. Thirdly, noise is rising.',
        right: 'Pollution, traffic and noise are all increasing.',
        note: 'একটা বাক্যই তিনটা connector-এর কাজ করে দিয়েছে।',
      },
      {
        wrong: 'These kind of problems require urgent action.',
        right: 'These kinds of problem require urgent action.',
        note: 'These-এর সঙ্গে বহুবচন Noun মিলতে হবে।',
      },
      {
        wrong: 'Some countries invest in rail. Other countries invest in roads.',
        right: 'Some countries invest in rail; others, in roads.',
        note: 'Ellipsis করে সেই শব্দগুলো বাদ দেওয়া হয়েছে, যেগুলো পাঠক নিজেই বুঝে নেবেন।',
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
        explanation: 'Also আগেই যোগ করার অর্থ দিচ্ছে, তাই বাকি দুটো connector বাড়তি।',
      },
      {
        wrong: 'The report was long. This made difficult to read.',
        right: 'The report was long, which made it difficult to read.',
        explanation: 'Make-এর একটা Object লাগে; এখানে it বোঝাচ্ছে report-কে।',
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
          'বাড়তি Pronoun বাদ দিন, আর formal বিকল্প do so ব্যবহার করুন।',
      },
    ],
    keyTakeaways: [
      'Reference, substitution আর ellipsis connector ছাড়াই cohesion তৈরি করে।',
      'একই phrase বারবার না লিখে one, ones, do so আর such ব্যবহার করুন।',
      'শুধু সেটুকুই বাদ দিন, যা পাঠক নিজে বুঝে নিতে পারবেন।',
      'প্রতিটি বাক্যে connector থাকলে লেখা যান্ত্রিক শোনায়, আর এতে নম্বর কাটে।',
    ],
  },

  /* ----------------------------- Module 22 ----------------------------- */
  {
    moduleId: 22,
    intro:
      'এই module-টা ঐচ্ছিক। Cleft আর Inversion আসল গঠন, দক্ষ লেখকরা জোর দেওয়ার জন্য এগুলো ব্যবহার করেন। কিন্তু IELTS-এ কোনো band-এর জন্যই এগুলো লাগে না; বরং জোর করে inversion লিখতে গিয়ে অনেকে ঠিক বাক্যকেও ভুল বানিয়ে ফেলেন। এগুলো চেনার জন্য শিখুন, আর ব্যবহার করুন শুধু তখনই, যখন সত্যিই জোর দেওয়া দরকার।',
    rules: [
      {
        id: 'm22-r1',
        heading: 'What-cleft (what দিয়ে জোর দেওয়া)',
        rule: 'What-cleft যে অংশে আপনি জোর দিতে চান, সেটাকে বাক্যের দ্বিতীয় অর্ধে নিয়ে যায়।',
        whenToUse:
          'একটা essay-তে বড়জোর একবার, সাধারণত মূল কোনো বক্তব্য বা পরামর্শে জোর দিতে।',
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
        rule: 'It-cleft বাক্যের নির্দিষ্ট একটা অংশকে আলাদা করে তুলে ধরে, বিশেষ করে বৈপরীত্য বোঝাতে।',
        whenToUse: 'যখন পাঠকের কোনো ভুল ধারণা শুধরে দিচ্ছেন।',
        structure: [
          'Plain: Poor planning caused the delay.',
          'Cleft: It was poor planning that caused the delay.',
          'Plain: The policy failed in rural areas.',
          'Cleft: It was in rural areas that the policy failed.',
        ],
        notes: ['বস্তু বা পরিস্থিতির জন্য that, আর মানুষের জন্য who বা that বসে।'],
      },
      {
        id: 'm22-r3',
        heading: 'Negative Inversion (না-বোধক শব্দ শুরুতে এলে word order উল্টে যাওয়া)',
        rule: 'Never, rarely, only then-এর মতো না-বোধক বা সীমা বোঝানো Adverbial দিয়ে বাক্য শুরু হলে Subject আর Auxiliary-র জায়গা বদলে যায়, ঠিক প্রশ্নের মতো।',
        whenToUse: 'খুব কম, আর শুধু তখনই যখন গঠনটা আপনার পুরোপুরি আয়ত্তে।',
        structure: [
          'Not only does the scheme reduce costs, but it also improves safety.',
          'Rarely has a policy attracted so much criticism.',
          'Only after 2010 did the figure begin to fall.',
          'Under no circumstances should this be ignored.',
        ],
        table: {
          caption: 'সাধারণ রূপ আর Inverted রূপ',
          headers: ['সাধারণ', 'Inverted'],
          rows: [
            ['The scheme not only reduces costs but also improves safety.', 'Not only does the scheme reduce costs, but it also improves safety.'],
            ['A policy has rarely attracted so much criticism.', 'Rarely has a policy attracted so much criticism.'],
            ['The figure only began to fall after 2010.', 'Only after 2010 did the figure begin to fall.'],
          ],
        },
        notes: [
          'Auxiliary না থাকলে do, does বা did সেই জায়গা পূরণ করে, আর মূল Verb তার base রূপে ফিরে যায়।',
          'not only...but also-তে শুধু প্রথম Clause-এ inversion হয়, দ্বিতীয়টায় নয়।',
        ],
      },
      {
        id: 'm22-r4',
        heading: 'কখন এগুলো ব্যবহার করবেন না',
        rule: 'জোর দেওয়ার এই গঠনগুলোর একটা দামও আছে: এগুলো লম্বা, চোখে পড়ে, আর সহজেই ভুল হয়। অন্যদিকে, সাধারণ বাক্য সাধারণ বলে কখনো নম্বর কাটা যায় না।',
        whenToUse: 'এই module-এর কোনো গঠন ব্যবহার করার আগে এটা পড়ে নিন।',
        structure: [
          'IELTS নম্বর দেয় নানা ধরনের গঠন নির্ভুল আর সাবলীলভাবে ব্যবহারের জন্য, কোনো নির্দিষ্ট \'দেখানোর মতো\' গঠনের তালিকার জন্য নয়।',
          'ভুলে ভরা একটা inverted বাক্য, নির্ভুল একটা সাধারণ বাক্যের চেয়ে অনেক বেশি ক্ষতি করে।',
          'সময়ের চাপে গঠনটা যদি সহজে, স্বাভাবিকভাবে না আসে, পরীক্ষায় সেটা ব্যবহার করবেন না।',
        ],
        notes: [
          'Advanced লেভেলে নম্বর আসলে আসে Module 18 থেকে 21-এর দক্ষতা থেকে। এই module-টাকে বাড়তি জ্ঞান হিসেবে দেখুন।',
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
        note: 'না-বোধক শব্দ সামনে এলে inversion লাগে, আর দ্বিতীয় Clause-এ নিজস্ব Subject দরকার।',
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
        note: 'Only + adverbial-এর পরে do-support আর base form লাগে।',
      },
    ],
    mistakes: [
      {
        wrong: 'Never before people have had access to so much information.',
        right: 'Never before have people had access to so much information.',
        explanation: 'না-বোধক শব্দ সামনে এলে Auxiliary Subject-এর আগে চলে আসে।',
      },
      {
        wrong: 'What is needed are stronger regulations.',
        right: 'What is needed is stronger regulations.',
        explanation: 'What-clause একবচন Subject, তাই Verb একবচনই থাকে।',
      },
      {
        wrong: 'Not only it is expensive but also ineffective.',
        right: 'It is not only expensive but also ineffective.',
        explanation:
          'শব্দটা সামনে না আনলে inversion-ও লাগে না; সাধারণ রূপটাই সঠিক আর সহজ।',
      },
      {
        wrong: 'Under no circumstances we should ignore this evidence.',
        right: 'Under no circumstances should we ignore this evidence.',
        explanation: 'শুরুতে সীমা বোঝানো phrase বসলে inversion লাগে।',
      },
      {
        wrong: 'It is the government who is responsible for it is the funding.',
        right: 'The government is responsible for funding.',
        explanation:
          'ভুল cleft-এর চেয়ে cleft না লেখাই ভালো। সন্দেহ হলে সাধারণ বাক্যটাই লিখুন।',
      },
    ],
    keyTakeaways: [
      'এই গঠনগুলো ঐচ্ছিক, Band 8-এর জন্য মোটেও বাধ্যতামূলক নয়।',
      'What-cleft আর it-cleft দিয়ে জোর কোথায় পড়বে তা বদলানো যায়; what-clause-এর পরে Verb একবচন রাখুন।',
      'শুরুতে না-বোধক শব্দ বসলে Subject আর Auxiliary উল্টে যায়, আর দরকার হলে do-support লাগে।',
      'ভুলে ভরা ভারী বাক্যের চেয়ে নির্ভুল সাধারণ বাক্য সবসময় ভালো।',
    ],
  },
]
