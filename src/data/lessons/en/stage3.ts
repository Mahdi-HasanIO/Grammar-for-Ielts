import type { Lesson } from '@/types'

/* English versions of the Stage 3 lessons. Same shape and ids as ../stage3.ts. */
export const stage3LessonsEn: Lesson[] = [
  /* ----------------------------- Module 12 ----------------------------- */
  {
    moduleId: 12,
    intro:
      'Band 7 and above requires complex sentences, but they only help when they are accurate. Almost every problem comes from two habits: expressing the same relationship twice (although and but together), or putting the wrong structure after a connector.',
    rules: [
      {
        id: 'm12-r1',
        heading: 'Three ways to join, three sets of rules',
        rule: 'Coordinators (and, but, so) join two clauses of equal weight. Subordinators (because, although) make one clause depend on another. Linking adverbials (however, therefore) connect one sentence to the next.',
        whenToUse: 'Whenever you connect two ideas.',
        structure: [
          'Coordinator: Clause, and clause. (and, but, so, or, yet, for, nor)',
          'Subordinator: Although clause, clause. / Clause although clause.',
          'Linking adverbial: Clause. However, clause. / Clause; however, clause.',
        ],
        table: {
          caption: 'The same idea three ways',
          headers: ['Type', 'Example'],
          rows: [
            ['Coordinator', 'The scheme was costly, but it worked.'],
            ['Subordinator', 'Although the scheme was costly, it worked.'],
            ['Linking adverbial', 'The scheme was costly. Nevertheless, it worked.'],
          ],
        },
        notes: [
          'Use exactly one of these three for each relationship. Using two is an error.',
        ],
      },
      {
        id: 'm12-r2',
        heading: 'Choosing a subordinator by meaning',
        rule: 'Choose the subordinator that expresses the relationship you intend; do not simply use the first one that comes to mind.',
        whenToUse: 'While planning a complex sentence in your head.',
        structure: [
          'Reason: because, since, as',
          'Result: so that, with the result that',
          'Contrast: whereas, while',
          'Concession: although, though, even though',
          'Purpose: so that, in order that',
          'Condition: if, unless, provided that, as long as',
          'Time: when, while, before, after, until, once, as soon as',
        ],
        table: {
          caption: 'Contrast vs concession',
          headers: ['Relationship', 'Word', 'Example'],
          rows: [
            ['Two things differ', 'whereas', 'Cities grew, whereas rural areas shrank.'],
            ['Unexpected result', 'although', 'Although funding rose, results did not improve.'],
            ['Reason', 'because', 'Prices rose because demand outstripped supply.'],
            ['Purpose', 'so that', 'Taxes were cut so that firms could invest.'],
          ],
        },
        notes: [
          'Whereas sets two facts directly against each other; although signals that the second fact is contrary to expectation.',
        ],
      },
      {
        id: 'm12-r3',
        heading: 'Despite and in spite of take a noun',
        rule: 'Despite and in spite of are prepositions, so they are followed by a noun, pronoun or -ing form, never a full clause.',
        whenToUse: 'When you want to express contrast without writing another full clause.',
        structure: [
          'despite + noun: Despite the cost, the project continued.',
          'despite + -ing: Despite costing millions, the project continued.',
          'despite the fact that + clause: Despite the fact that it cost millions, the project continued.',
          'although + clause: Although it cost millions, the project continued.',
        ],
        notes: ['Write despite, not despite of. In spite of is three separate words.'],
      },
      {
        id: 'm12-r4',
        heading: 'One relationship, one connector',
        rule: 'Do not add a coordinator or adverbial that repeats the meaning of a subordinator already in the sentence.',
        whenToUse: 'Check every sentence that contains although or because.',
        structure: [
          'Wrong: Although it is expensive, but it is effective.',
          'Right: Although it is expensive, it is effective.',
          'Right: It is expensive, but it is effective.',
          'Wrong: Because of traffic, so people are late.',
          'Right: Because of traffic, people are late.',
        ],
        notes: [
          'This is the most common complex-sentence error in IELTS writing, and it is entirely avoidable.',
        ],
      },
    ],
    examples: [
      {
        wrong: 'Although the government increased spending, but the problem continued.',
        right: 'Although the government increased spending, the problem continued.',
        note: 'Although has already expressed the contrast.',
      },
      {
        wrong: 'Despite of the high cost, the scheme was approved.',
        right: 'Despite the high cost, the scheme was approved.',
        note: 'Despite never takes of.',
      },
      {
        wrong: 'Despite it was raining, the event continued.',
        right: 'Although it was raining, the event continued.',
        note: 'A clause needs although, not despite.',
      },
      {
        wrong: 'Because the roads are congested, therefore commuting takes longer.',
        right: 'Because the roads are congested, commuting takes longer.',
        note: 'Because and therefore both express cause and effect; one is enough.',
      },
      {
        wrong: 'Urban areas are growing, while rural areas are shrinking, however this is not universal.',
        right: 'Urban areas are growing while rural areas are shrinking; however, this pattern is not universal.',
        note: 'However needs a semicolon or full stop before it.',
      },
    ],
    mistakes: [
      {
        wrong: 'Even though renewable energy is clean, but it remains expensive.',
        right: 'Even though renewable energy is clean, it remains expensive.',
        explanation: 'Even though is a subordinator, so it cannot be combined with but.',
      },
      {
        wrong: 'In spite of the traffic was heavy, we arrived on time.',
        right: 'In spite of the heavy traffic, we arrived on time.',
        explanation: 'In spite of is followed by a noun phrase, not a clause.',
      },
      {
        wrong: 'The policy failed, because of poor planning and it was underfunded.',
        right: 'The policy failed because it was poorly planned and underfunded.',
        explanation:
          'Because of takes a noun and because takes a clause; mixing them breaks the sentence.',
      },
      {
        wrong: 'Whereas some people prefer cities.',
        right: 'Whereas some people prefer cities, others prefer the countryside.',
        explanation: 'A whereas clause is dependent and cannot stand alone.',
      },
      {
        wrong: 'Moreover, that the cost is high makes the scheme unpopular, and however it continues.',
        right: 'The high cost makes the scheme unpopular. It continues nonetheless.',
        explanation:
          'Stacking connectors buries the actual argument. One clear relationship per sentence reads far better.',
      },
    ],
    keyTakeaways: [
      'One relationship, one connector.',
      'Although + clause; despite + noun or -ing.',
      'Whereas shows a difference between two facts; although shows an unexpected result.',
      'However and therefore need a full stop or semicolon before them.',
    ],
  },

  /* ----------------------------- Module 13 ----------------------------- */
  {
    moduleId: 13,
    intro:
      'Relative clauses are the safest way to show complex structures in academic writing, because they add information about a noun without starting a new sentence. Getting them right takes two things: choosing the correct pronoun, and knowing whether the information is essential or just extra.',
    rules: [
      {
        id: 'm13-r1',
        heading: 'Choosing the right relative pronoun',
        rule: 'The pronoun depends on what the noun is (a person, thing or place), not on its role in the sentence.',
        whenToUse: 'Whenever you attach a clause to a noun.',
        structure: [
          'who - people: the students who attended',
          'which - things: the policy which was introduced',
          'that - people or things, defining clauses only',
          'whose - possession: the company whose profits fell',
          'where - places: the city where he was born',
          'when - times: the year when the law changed',
        ],
        notes: [
          'That cannot be used in a non-defining clause: The report, that was published in 2020,... is wrong.',
          'Which can refer to a whole clause: Sales fell, which worried investors.',
        ],
      },
      {
        id: 'm13-r2',
        heading: 'Defining vs non-defining',
        rule: 'A defining clause identifies exactly which one you mean and takes no commas. A non-defining clause adds extra information and is enclosed in commas.',
        whenToUse: 'Decide which one you are writing before you place any commas, not afterwards.',
        structure: [
          'Defining: Students who study abroad often become more independent. (only those who study abroad)',
          'Non-defining: My brother, who studies abroad, visits twice a year. (extra information)',
          'Defining: The report that the committee published is controversial.',
          'Non-defining: The report, which runs to 300 pages, is controversial.',
        ],
        table: {
          caption: 'How the two types differ',
          headers: ['Feature', 'Defining', 'Non-defining'],
          rows: [
            ['Commas', 'No', 'Yes, on both sides'],
            ['Can use that', 'Yes', 'No'],
            ['Pronoun can be dropped', 'Yes, if it is the object', 'No'],
            ['Type of information', 'Essential', 'Extra'],
          ],
        },
        notes: [
          'Commas change the whole meaning. Workers who were unskilled lost their jobs means only the unskilled workers lost their jobs; Workers, who were unskilled, lost their jobs means all the workers were unskilled.',
        ],
      },
      {
        id: 'm13-r3',
        heading: 'Do not add a second pronoun',
        rule: 'The relative pronoun already fills the subject or object position, so no other pronoun can be added.',
        whenToUse: 'Check every relative clause you write.',
        structure: [
          'Wrong: The policy which it was introduced reduced pollution.',
          'Right: The policy which was introduced reduced pollution.',
          'Wrong: The book that I read it was useful.',
          'Right: The book that I read was useful.',
        ],
      },
      {
        id: 'm13-r4',
        heading: 'Preposition + which, and reducing clauses',
        rule: 'In formal writing, the preposition can move in front of which or whom. Defining clauses containing be can often be shortened.',
        whenToUse:
          'Fronting the preposition suits formal writing. Once you have mastered the full form, reduced clauses make sentences tighter.',
        structure: [
          'Informal: the problem which we are dealing with',
          'Formal: the problem with which we are dealing',
          'the rate at which temperatures are rising',
          'the extent to which this is true',
          'Reduced: The students who are enrolled on the course -> The students enrolled on the course',
          'Reduced: The report which was published in 2020 -> The report published in 2020',
          'Reduced: People who live in cities -> People living in cities',
        ],
        notes: [
          'Defining clauses with be, or with an active meaning, reduce easily.',
          'Module 17 covers reduction in more detail, along with the dangling-modifier trap.',
        ],
      },
    ],
    examples: [
      {
        wrong: 'The policy which it was introduced in 2015 reduced pollution.',
        right: 'The policy which was introduced in 2015 reduced pollution.',
        note: 'Which is already the subject here.',
      },
      {
        wrong: 'My hometown which is in the north has grown rapidly.',
        right: 'My hometown, which is in the north, has grown rapidly.',
        note: 'The noun is unique, so the clause is non-defining and needs commas.',
      },
      {
        wrong: 'The researcher that her study was published won an award.',
        right: 'The researcher whose study was published won an award.',
        note: 'Whose expresses possession.',
      },
      {
        wrong: 'This is the village where I grew up in.',
        right: 'This is the village where I grew up.',
        note: 'Where already contains the preposition (where = in which).',
      },
      {
        wrong: 'The report, that was released yesterday, criticises the plan.',
        right: 'The report, which was released yesterday, criticises the plan.',
        note: 'That cannot be used in a non-defining clause.',
      },
    ],
    mistakes: [
      {
        wrong: 'Students which study hard usually succeed.',
        right: 'Students who study hard usually succeed.',
        explanation: 'Which is for things; people take who or that.',
      },
      {
        wrong: 'The company, who employs 2,000 people, is expanding.',
        right: 'The company, which employs 2,000 people, is expanding.',
        explanation: 'An organisation is not a person, so it takes which.',
      },
      {
        wrong: 'There are many reasons why people move to cities, which it is a global trend.',
        right: 'There are many reasons why people move to cities, a trend seen worldwide.',
        explanation:
          'The extra it is wrong, and an appositive noun phrase is clearer here than another which.',
      },
      {
        wrong: 'The period which the economy grew fastest was the 1990s.',
        right: 'The period in which the economy grew fastest was the 1990s.',
        explanation:
          'The clause needs a preposition: in which, or simply when.',
      },
      {
        wrong: 'People live in rural areas often have limited access to healthcare.',
        right: 'People living in rural areas often have limited access to healthcare.',
        explanation:
          'A reduced clause needs the -ing form; otherwise the sentence has two finite verbs.',
      },
    ],
    keyTakeaways: [
      'who for people, which for things, whose for possession.',
      'If the clause identifies which one, no commas; if it adds extra information, use commas.',
      'That is never used in a non-defining clause.',
      'Never repeat the subject after a relative pronoun.',
    ],
  },

  /* ----------------------------- Module 14 ----------------------------- */
  {
    moduleId: 14,
    intro:
      'A noun clause is a whole clause doing the job of a noun. It is how you report other people’s arguments, evaluate claims and structure an essay. The most common error here is keeping question word order inside an embedded question.',
    rules: [
      {
        id: 'm14-r1',
        heading: 'That-clauses',
        rule: 'A that-clause can be the object of a reporting verb, or it can follow an adjective or noun to complete its meaning.',
        whenToUse: 'When reporting what someone argues, shows or believes.',
        structure: [
          'As object: Critics argue that the policy is ineffective.',
          'After an adjective: It is clear that demand has fallen.',
          'After a noun: the claim that technology destroys jobs',
          'As subject (rare, heavy): That the policy failed is undeniable.',
        ],
        notes: [
          'That can be dropped in informal writing, but it is better kept in academic writing.',
          'Common reporting verbs: argue, claim, suggest, show, indicate, demonstrate, reveal, conclude, maintain.',
        ],
      },
      {
        id: 'm14-r2',
        heading: 'Whether and if clauses',
        rule: 'Use whether for yes/no alternatives. Whether is preferred to if in formal writing, and only whether can follow a preposition or come before to.',
        whenToUse: 'When the clause represents a question that has not yet been answered.',
        structure: [
          'It is unclear whether the scheme will succeed.',
          'The debate over whether tuition should be free continues.',
          'They must decide whether to expand or consolidate.',
          'whether or not: It will proceed whether or not funding is approved.',
        ],
        notes: ['You cannot write the question of if; only whether works after a preposition.'],
      },
      {
        id: 'm14-r3',
        heading: 'Embedded questions use statement word order',
        rule: 'Once a question is embedded in a larger sentence, it behaves like a statement: no inversion and no auxiliary do.',
        whenToUse: 'After wonder, explain, know, understand, show, examine and question.',
        structure: [
          'Direct: Why do people migrate?',
          'Embedded: It is unclear why people migrate.',
          'Direct: How can governments reduce waste?',
          'Embedded: The report explains how governments can reduce waste.',
          'Direct: Is the policy effective?',
          'Embedded: Researchers question whether the policy is effective.',
        ],
        table: {
          caption: 'Direct to embedded',
          headers: ['Direct question', 'Embedded form'],
          rows: [
            ['What does it cost?', 'how much it costs'],
            ['Where did they go?', 'where they went'],
            ['Why is it rising?', 'why it is rising'],
            ['Can we measure it?', 'whether we can measure it'],
          ],
        },
        notes: [
          'Remove do, does and did completely, and return the main verb to its normal form.',
        ],
      },
      {
        id: 'm14-r4',
        heading: 'Extraposition: moving the clause to the end',
        rule: 'A that-clause or to-infinitive in subject position makes a sentence top-heavy. Move the clause to the end and start with it.',
        whenToUse: 'In topic sentences and evaluative sentences.',
        structure: [
          'Heavy: That the climate is changing is now undisputed.',
          'Extraposed: It is now undisputed that the climate is changing.',
          'Heavy: To measure happiness accurately is difficult.',
          'Extraposed: It is difficult to measure happiness accurately.',
          'Useful frames: It is clear / likely / apparent / widely accepted / worth noting that...',
        ],
        notes: [
          'This is the same end-weight principle (heavy material last) that Module 20 applies to whole paragraphs.',
        ],
      },
    ],
    examples: [
      {
        wrong: 'I wonder why do people move to cities.',
        right: 'I wonder why people move to cities.',
        note: 'Embedded questions use statement word order.',
      },
      {
        wrong: 'The study examines how does air pollution affect health.',
        right: 'The study examines how air pollution affects health.',
        note: 'Remove does and put the -s back on the main verb.',
      },
      {
        wrong: 'It is not clear that or not the policy will work.',
        right: 'It is not clear whether the policy will work.',
        note: 'Yes/no alternatives take whether.',
      },
      {
        wrong: 'That the government should act is obvious to everyone who reads the data.',
        right: 'It is obvious to everyone who reads the data that the government should act.',
        note: 'Extraposition moves the heavy clause to the end.',
      },
      {
        wrong: 'Researchers have discussed about whether the method is reliable.',
        right: 'Researchers have discussed whether the method is reliable.',
        note: 'Discuss takes no preposition.',
      },
    ],
    mistakes: [
      {
        wrong: 'Nobody knows what will be the outcome.',
        right: 'Nobody knows what the outcome will be.',
        explanation:
          'In an embedded clause the subject comes before the verb, so the outcome goes first.',
      },
      {
        wrong: 'The question of if students should pay fees is controversial.',
        right: 'The question of whether students should pay fees is controversial.',
        explanation: 'Only whether can follow a preposition.',
      },
      {
        wrong: 'It is argued the technology has reduced employment.',
        right: 'It is argued that technology has reduced employment.',
        explanation:
          'Keep that in formal writing; it shows the reader where the new clause begins.',
      },
      {
        wrong: 'Researchers want to know that why the figure fell.',
        right: 'Researchers want to know why the figure fell.',
        explanation: 'Do not combine that with a wh-word; one connector is enough.',
      },
      {
        wrong: 'It is depends on whether funding is available.',
        right: 'It depends on whether funding is available.',
        explanation:
          'This it is pattern is followed by an adjective, not a full verb.',
      },
    ],
    keyTakeaways: [
      'Use verb + that-clause to report other people’s arguments.',
      'Yes/no alternatives take whether, and only whether follows a preposition.',
      'Embedded questions use statement word order and no auxiliary do.',
      'Move heavy subject clauses to the end and begin the sentence with it.',
    ],
  },

  /* ----------------------------- Module 15 ----------------------------- */
  {
    moduleId: 15,
    intro:
      'Conditionals are the grammar of argument. A paragraph proposing a solution is often one long conditional: if this were done, that would happen. Three structures do almost all of this work, and the core rule is simple: no will in the if-clause.',
    rules: [
      {
        id: 'm15-r1',
        heading: 'The three conditionals you need most',
        rule: 'The zero conditional expresses general truths, the first conditional a realistic future, and the second conditional an imagined situation.',
        whenToUse: 'Zero for general truths, first for realistic proposals, second for hypotheticals.',
        structure: [
          'Zero: If + present simple, present simple. If water reaches 100 degrees, it boils.',
          'First: If + present simple, will + base. If governments invest in rail, congestion will fall.',
          'Second: If + past simple, would + base. If governments invested in rail, congestion would fall.',
        ],
        table: {
          caption: 'Which one to use when',
          headers: ['Type', 'Meaning', 'Example'],
          rows: [
            ['Zero', 'Always true', 'If demand rises, prices increase.'],
            ['First', 'Realistic future', 'If demand rises, prices will increase.'],
            ['Second', 'Hypothetical or less likely', 'If demand rose, prices would increase.'],
          ],
        },
        notes: [
          'The second conditional is not about the past; it is about an imagined present or future, even though the verb looks past.',
          'In formal writing, were is used with all subjects, including I, he, she and it: If the policy were introduced...',
        ],
      },
      {
        id: 'm15-r2',
        heading: 'No will in the if-clause',
        rule: 'In the condition, the present simple carries future meaning. Will belongs only in the result clause.',
        whenToUse: 'In every first conditional you write.',
        structure: [
          'Wrong: If the government will reduce taxes, businesses will invest.',
          'Right: If the government reduces taxes, businesses will invest.',
          'Right: If the government were to reduce taxes, businesses would invest.',
        ],
        notes: [
          'The same rule applies to when, as soon as, until and before: When prices rise, demand will fall.',
        ],
      },
      {
        id: 'm15-r3',
        heading: 'Unless, provided that, as long as',
        rule: 'Unless means except if, so it already contains a negative. Provided that and as long as express a condition that must be met.',
        whenToUse: 'To vary your conditionals and to state the conditions under which a proposal will work.',
        structure: [
          'Unless action is taken, emissions will continue to rise.',
          'The scheme will succeed provided that it is properly funded.',
          'Remote work is effective as long as teams communicate regularly.',
          'In the event of a shortage, prices would rise.',
        ],
        notes: [
          'Do not write unless... not: Unless the government does not act contains a double negative.',
          'Provided that and as long as are also followed by the present tense, like the first conditional.',
        ],
      },
      {
        id: 'm15-r4',
        heading: 'Conditionals in argument',
        rule: 'Use the first conditional for proposals you consider realistic and the second for ones you want to present as hypothetical. Your choice reveals your position.',
        whenToUse: 'In solution and opinion paragraphs.',
        structure: [
          'Realistic proposal: If schools introduced financial education, students would manage money better.',
          'Consequence of inaction: Unless cities expand public transport, congestion will worsen.',
          'Acknowledging a limit: Even if funding were doubled, the problem would persist.',
        ],
        notes: [
          'Mixed and third conditionals are useful but optional. Getting the first three right matters far more.',
        ],
      },
    ],
    examples: [
      {
        wrong: 'If the government will invest more, the problem will be solved.',
        right: 'If the government invests more, the problem will be solved.',
        note: 'The if-clause takes the present simple.',
      },
      {
        wrong: 'If people would recycle more, less waste would go to landfill.',
        right: 'If people recycled more, less waste would go to landfill.',
        note: 'The if-clause of a second conditional takes the past simple.',
      },
      {
        wrong: 'Unless we do not act now, the situation will worsen.',
        right: 'Unless we act now, the situation will worsen.',
        note: 'Unless already means if not.',
      },
      {
        wrong: 'If I was the minister, I would increase funding.',
        right: 'If I were the minister, I would increase funding.',
        note: 'Formal hypotheticals use were.',
      },
      {
        wrong: 'The plan will work provided that it will receive support.',
        right: 'The plan will work provided that it receives support.',
        note: 'Provided that follows the same rule as if.',
      },
    ],
    mistakes: [
      {
        wrong: 'If companies would pay higher wages, employees will be more motivated.',
        right: 'If companies paid higher wages, employees would be more motivated.',
        explanation:
          'The sentence mixes two patterns. Use either past simple with would, or present simple with will.',
      },
      {
        wrong: 'When the government will introduce the law, protests will begin.',
        right: 'When the government introduces the law, protests will begin.',
        explanation: 'Time clauses, like if-clauses, do not take will.',
      },
      {
        wrong: 'If education would be free, more people could attend university.',
        right: 'If education were free, more people could attend university.',
        explanation: 'Would does not go in the condition; use were for a hypothetical.',
      },
      {
        wrong: 'Unless if the policy changes, the issue will remain.',
        right: 'Unless the policy changes, the issue will remain.',
        explanation: 'Unless and if cannot be used together.',
      },
      {
        wrong: 'If the scheme was introduced last year, results will appear soon.',
        right: 'If the scheme was introduced last year, results should appear soon.',
        explanation:
          'A real past condition pairs better with a modal of expectation (such as should) than with a confident prediction.',
      },
    ],
    keyTakeaways: [
      'Zero for general truths, first for a realistic future, second for hypotheticals.',
      'Never put will in an if-clause or a time clause.',
      'Unless already means if not, so do not add another not.',
      'Your choice of conditional tells the reader how realistic you think a proposal is.',
    ],
  },

  /* ----------------------------- Module 16 ----------------------------- */
  {
    moduleId: 16,
    intro:
      'Parallelism means keeping the parts joined by and, or or but in the same grammatical form. It works quietly: when it is right, nobody notices, but when it is wrong, a carefully built long sentence collapses at the end.',
    rules: [
      {
        id: 'm16-r1',
        heading: 'Keep every item in a list the same form',
        rule: 'Each item in a list must be the same type: all nouns, all -ing forms, all infinitives or all finite verbs.',
        whenToUse: 'In every sentence that contains a list of two or more items.',
        structure: [
          'All finite verbs: The policy reduces pollution, saves money and improves health.',
          'All -ing forms: The scheme involves building schools, training teachers and funding equipment.',
          'All nouns: The report examines cost, feasibility and public support.',
          'All infinitives: The aim is to reduce waste, to cut costs and to raise awareness.',
        ],
        notes: [
          'With infinitives, either write to before every item or only before the first. Do not mix the two.',
        ],
      },
      {
        id: 'm16-r2',
        heading: 'Paired connectors',
        rule: 'Both sides of a correlative pair (both...and, either...or) must have the same structure.',
        whenToUse: 'With not only...but also, both...and, either...or and neither...nor.',
        structure: [
          'both + X and + X: both in schools and in workplaces',
          'not only + X but also + X: not only cheaper but also faster',
          'either + X or + X: either raising taxes or cutting spending',
          'neither + X nor + X: neither practical nor affordable',
        ],
        table: {
          caption: 'Balancing both sides of the pair',
          headers: ['Wrong', 'Right'],
          rows: [
            ['not only cheap but also it saves time', 'not only cheap but also time-saving'],
            ['both for students and teachers', 'both for students and for teachers'],
            ['either by taxing or regulation', 'either by taxation or by regulation'],
          ],
        },
        notes: ['Whatever word type (verb, noun, adjective) follows not only must also follow but also.'],
      },
      {
        id: 'm16-r3',
        heading: 'Parallelism in comparisons',
        rule: 'The two sides of a comparison must be the same kind of thing.',
        whenToUse: 'With than, as...as and numerical comparisons.',
        structure: [
          'Wrong: The population of Japan is larger than Canada.',
          'Right: The population of Japan is larger than that of Canada.',
          'Right: Japan has a larger population than Canada does.',
          'Wrong: Reading is more useful than to watch television.',
          'Right: Reading is more useful than watching television.',
        ],
        notes: [
          'Use that of (singular) and those of (plural) to refer back to the head noun without repeating it.',
        ],
      },
      {
        id: 'm16-r4',
        heading: 'A shared word must fit every item',
        rule: 'If the items in a list share a preposition, article or auxiliary, it must fit each item. If it does not, write the correct word separately.',
        whenToUse: 'In long lists where one preposition is carrying several items.',
        structure: [
          'Wrong: The policy is interested in and committed to reform. (check that both sides fit)',
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
        note: 'Three finite verbs in a row.',
      },
      {
        wrong: 'She enjoys reading, to travel and cooking.',
        right: 'She enjoys reading, travelling and cooking.',
        note: 'Enjoy takes -ing, so every item takes the -ing form.',
      },
      {
        wrong: 'The city is not only crowded but also it is expensive.',
        right: 'The city is not only crowded but also expensive.',
        note: 'An adjective on both sides of the pair.',
      },
      {
        wrong: 'The climate of Spain is warmer than Norway.',
        right: 'The climate of Spain is warmer than that of Norway.',
        note: 'Compare climate with climate, not with a country.',
      },
      {
        wrong: 'Governments should invest in education, improving healthcare and to build housing.',
        right: 'Governments should invest in education, improve healthcare and build housing.',
        note: 'All three items after should are now bare infinitives.',
      },
    ],
    mistakes: [
      {
        wrong: 'The course teaches students how to write reports, giving presentations and research skills.',
        right: 'The course teaches students how to write reports, give presentations and conduct research.',
        explanation: 'All three items now follow how to as bare infinitives.',
      },
      {
        wrong: 'He is responsible for planning, to organise events and the budget.',
        right: 'He is responsible for planning events, organising budgets and managing staff.',
        explanation: 'For is a preposition, so every item after it takes the -ing form.',
      },
      {
        wrong: 'Neither the cost nor the benefits was clear.',
        right: 'Neither the cost nor the benefits were clear.',
        explanation:
          'With neither...nor, the verb agrees with the nearer subject, which is plural here.',
      },
      {
        wrong: 'The report is both detailed and it is well researched.',
        right: 'The report is both detailed and well researched.',
        explanation: 'Both...and joins two adjectives here, not an adjective and a clause.',
      },
      {
        wrong: 'Wages in the north are lower than the south.',
        right: 'Wages in the north are lower than those in the south.',
        explanation: 'Those in means wages in, so both sides of the comparison match.',
      },
    ],
    keyTakeaways: [
      'Items joined by and or or must share the same form.',
      'Whatever follows not only must also follow but also.',
      'Use that of and those of to keep both sides of a comparison the same.',
      'Read each list item separately with the start of the sentence to check it fits.',
    ],
  },

  /* ----------------------------- Module 17 ----------------------------- */
  {
    moduleId: 17,
    intro:
      'Participle clauses merge two clauses into one, and they are a real sign of control over the language. They carry one big risk: if the doer of the participle is not the subject of the main clause, the sentence says something you never meant.',
    rules: [
      {
        id: 'm17-r1',
        heading: 'Reducing relative clauses',
        rule: 'The pronoun and be can be removed from a defining relative clause. Use -ing for an active meaning and -ed for a passive meaning.',
        whenToUse: 'To make noun phrases shorter and tighter without losing information.',
        structure: [
          'who are living in cities -> living in cities',
          'which was published in 2020 -> published in 2020',
          'that is causing concern -> causing concern',
          'who have been affected -> affected',
        ],
        table: {
          caption: 'Full form and reduced form',
          headers: ['Full clause', 'Reduced form'],
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
        heading: 'Adverbial participle clauses',
        rule: 'An -ing clause at the start or end of a sentence can express time, reason or result. The reader assumes the subject of the main clause is doing the -ing action.',
        whenToUse: 'To combine two actions by the same doer in one sentence.',
        structure: [
          'Time: Having completed the survey, the researchers analysed the data.',
          'Reason: Facing rising costs, many firms reduced staff.',
          'Result: Demand fell sharply, causing prices to drop.',
          'Passive: Introduced in 2015, the scheme has halved waiting times.',
        ],
        notes: [
          'Having + past participle shows that the action was complete before the main verb.',
          'A result -ing clause at the end of a sentence is very useful in Task 1: The figure peaked in 2008, reaching 90 million.',
        ],
      },
      {
        id: 'm17-r3',
        heading: 'Dangling modifiers',
        rule: 'The doer of the participle must be the subject of the main clause. Otherwise the modifier dangles: it has nothing to attach to.',
        whenToUse: 'Check every sentence that starts with an -ing or -ed form.',
        structure: [
          'Dangling: Walking to school, the rain started.',
          'Fixed: Walking to school, I was caught in the rain.',
          'Fixed: While I was walking to school, it started to rain.',
          'Dangling: Having studied the data, the conclusion was obvious.',
          'Fixed: Having studied the data, the researchers reached an obvious conclusion.',
        ],
        notes: [
          'The easiest fix is to write a full clause with a subordinator (when, because, after).',
          'This error is hard to spot because the sentence sounds fluent. Ask yourself: who is actually doing the -ing action?',
        ],
      },
      {
        id: 'm17-r4',
        heading: 'Adding information with an infinitive after a noun',
        rule: 'A to-infinitive after a noun expresses purpose or what needs to be done.',
        whenToUse: 'To shorten relative clauses that express purpose.',
        structure: [
          'the best way to reduce emissions',
          'the first country to introduce the ban',
          'a decision to be made by the committee',
          'measures to be taken in the next decade',
        ],
        notes: [
          'If the action is done to the noun, use a passive infinitive: the issues to be addressed.',
        ],
      },
    ],
    examples: [
      {
        wrong: 'Walking to school, the rain started.',
        right: 'Walking to school, I was caught in the rain.',
        note: 'The rain was not walking.',
      },
      {
        wrong: 'Having finished the report, the deadline was met.',
        right: 'Having finished the report, the team met the deadline.',
        note: 'The deadline did not finish the report.',
      },
      {
        wrong: 'The students enrolling on the course last year have graduated.',
        right: 'The students enrolled on the course last year have graduated.',
        note: 'The students were enrolled, so the passive -ed form is correct.',
      },
      {
        wrong: 'Based on the data, it can conclude that demand is rising.',
        right: 'Based on the data, we can conclude that demand is rising.',
        note: 'The clause needs a subject for the participle to attach to.',
      },
      {
        wrong: 'The figure rose steadily, reached a peak in 2010.',
        right: 'The figure rose steadily, reaching a peak in 2010.',
        note: 'A result clause takes the -ing form, not a finite verb.',
      },
    ],
    mistakes: [
      {
        wrong: 'After reviewing the evidence, the policy was changed.',
        right: 'After reviewing the evidence, the committee changed the policy.',
        explanation:
          'A passive main clause almost always creates a dangling modifier, because the real doer disappears from the sentence.',
      },
      {
        wrong: 'Living in a big city, the cost of housing is very high.',
        right: 'For those living in a big city, the cost of housing is very high.',
        explanation: 'The cost does not live anywhere; write about the people who do.',
      },
      {
        wrong: 'The report writing by the committee was published yesterday.',
        right: 'The report written by the committee was published yesterday.',
        explanation:
          'The report was written, so the reduced form needs the past participle.',
      },
      {
        wrong: 'Being a developing country, the government cannot afford this.',
        right: 'Because it is a developing country, my country cannot afford this.',
        explanation:
          'A government is not a country; writing a full clause resolves the mismatch.',
      },
      {
        wrong: 'Introducing in 2015, the scheme has reduced waiting times.',
        right: 'Introduced in 2015, the scheme has reduced waiting times.',
        explanation: 'The action is done to the scheme, so a passive participle is needed.',
      },
    ],
    keyTakeaways: [
      '-ing for active meaning, -ed for passive meaning.',
      'The subject of the main clause must be the doer of the participle.',
      'If it is not, write a full clause with a subordinator.',
      'In Task 1, a result -ing clause at the end of a sentence is safe and useful.',
    ],
  },
]
