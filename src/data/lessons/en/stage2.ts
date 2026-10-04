import type { Lesson } from '@/types'

/* English versions of the Stage 2 lessons. Same shape and ids as ../stage2.ts. */
export const stage2LessonsEn: Lesson[] = [
  /* ------------------------------ Module 6 ----------------------------- */
  {
    moduleId: 6,
    intro:
      'You do not need to memorise every tense. You need a small set of tenses you can use accurately every time, and the ability to read a task and tell which time frame it calls for. Most tense errors in the exam are not about difficult forms; they come from switching tense within a paragraph for no reason.',
    rules: [
      {
        id: 'm6-r1',
        heading: 'The tenses you actually need',
        rule: 'Almost all academic writing runs on five forms: present simple, past simple, present perfect, past perfect and one future form.',
        whenToUse: 'At the start of each paragraph, decide which time frame you are writing about, then stay in it.',
        structure: [
          'Present simple - general truths, current states, your argument.',
          'Past simple - events finished at a specific past time.',
          'Present perfect - past events with present relevance, or a period that is not yet over.',
          'Past perfect - an event that happened before another past event.',
          'will / be going to - predictions and plans.',
        ],
        table: {
          caption: 'Which tense for which meaning',
          headers: ['Meaning', 'Tense', 'Example'],
          rows: [
            ['Permanent truth', 'Present simple', 'Water boils at 100 degrees.'],
            ['Ongoing trend', 'Present continuous', 'Prices are rising steadily.'],
            ['Finished past event', 'Past simple', 'The policy was introduced in 2015.'],
            ['Past event, present effect', 'Present perfect', 'Costs have risen since 2015.'],
            ['Earlier past', 'Past perfect', 'By 2010 demand had already peaked.'],
            ['Prediction', 'will + base', 'Demand will continue to grow.'],
          ],
        },
      },
      {
        id: 'm6-r2',
        heading: 'Past simple or present perfect',
        rule: 'Use the past simple with a specific, finished time. Use the present perfect when no time is stated or when the time period is still continuing.',
        whenToUse: 'Whenever you describe change over time.',
        structure: [
          'Past simple: Emissions fell sharply in 2019.',
          'Present perfect: Emissions have fallen sharply since 2019.',
          'Present perfect: Several countries have adopted this approach.',
        ],
        notes: [
          'since and so far signal the present perfect; in 2019, last year and ago signal the past simple.',
          'Never mix the two: has fallen in 2019 is wrong.',
        ],
      },
      {
        id: 'm6-r3',
        heading: 'Tense in IELTS tasks',
        rule: 'In Task 1, the years on the chart decide the tense. Task 2 is written mainly in the present simple.',
        whenToUse: 'Read the chart title carefully before you write a single word.',
        structure: [
          'Chart with past years: The number of visitors rose between 2001 and 2010.',
          'Chart with no years: The chart shows how waste is processed.',
          'Chart with future projections: Demand is expected to reach 40 million by 2035.',
          'Process diagram: The glass is crushed and then melted.',
          'Task 2 argument: Governments should prioritise public transport.',
        ],
        notes: [
          'Process diagrams usually use the present simple passive.',
          'Projected future figures take will, is expected to or is projected to, not the past simple.',
        ],
      },
      {
        id: 'm6-r4',
        heading: 'Stay in one tense; switch only with a reason',
        rule: 'Stay in the same time frame unless the meaning requires a change. When you do switch tense, make sure the reader can see why.',
        whenToUse: 'When proofreading your writing at the end.',
        structure: [
          'Unjustified: The government introduced the scheme and spends millions on it.',
          'Fixed: The government introduced the scheme and spent millions on it.',
          'Justified: The government introduced the scheme in 2015, and it still operates today.',
        ],
        notes: [
          'Time markers such as today or since then make the reason for a tense change obvious to the reader.',
        ],
      },
    ],
    examples: [
      {
        wrong: 'The population has increased dramatically in 1990.',
        right: 'The population increased dramatically in 1990.',
        note: 'A specific past year requires the past simple.',
      },
      {
        wrong: 'Since 2010, the city invested heavily in cycling.',
        right: 'Since 2010, the city has invested heavily in cycling.',
        note: 'Since tells us the period is still continuing.',
      },
      {
        wrong: 'The graph showed that sales will rise until 2030.',
        right: 'The graph shows that sales will rise until 2030.',
        note: 'The chart is in front of you now, so describe what it shows in the present.',
      },
      {
        wrong: 'When the researchers arrived, the experiment already finished.',
        right: 'When the researchers arrived, the experiment had already finished.',
        note: 'Of two past events, the earlier one goes in the past perfect.',
      },
      {
        wrong: 'Firstly, the beans are harvested. Then workers dried them.',
        right: 'Firstly, the beans are harvested. They are then dried.',
        note: 'Describe a process in one tense and one voice throughout.',
      },
    ],
    mistakes: [
      {
        wrong: 'Nowadays, people spent more time online than before.',
        right: 'Nowadays, people spend more time online than before.',
        explanation: 'Nowadays refers to the present, so the present simple is needed.',
      },
      {
        wrong: 'In 2020 the figure has reached its highest point.',
        right: 'In 2020 the figure reached its highest point.',
        explanation: 'The present perfect cannot be used with a specific finished time.',
      },
      {
        wrong: 'If technology will improve, costs will fall.',
        right: 'If technology improves, costs will fall.',
        explanation:
          'The if-clause of a first conditional takes the present simple, not will.',
      },
      {
        wrong: 'The report was published last year and describes three solutions.',
        right: 'The report, which was published last year, describes three solutions.',
        explanation:
          'Placed side by side, the tense shift feels confused; a relative clause shows that the two time frames are deliberate.',
      },
      {
        wrong: 'Since the last decade, air quality improved considerably.',
        right: 'Over the last decade, air quality has improved considerably.',
        explanation:
          'Since is followed by a point in time (such as 2010); over is used for a length of time. In both cases the period is still running, so the present perfect fits.',
      },
    ],
    keyTakeaways: [
      'Decide the time frame from the task, then stay in it.',
      'A specific past time means past simple; since or no stated time means present perfect.',
      'Describe what a chart or process shows in the present, and the data in the chart’s own time frame.',
      'Every tense change needs a clear reason.',
    ],
  },

  /* ------------------------------ Module 7 ----------------------------- */
  {
    moduleId: 7,
    intro:
      'Modals show how certain you are and how strongly you are recommending something. They do two main jobs: expressing how likely something is, and expressing what someone should do. Keeping these two jobs apart makes your argument sound balanced rather than one-sided.',
    rules: [
      {
        id: 'm7-r1',
        heading: 'Two jobs: likelihood and obligation',
        rule: 'The same modal can express how likely something is (epistemic) or what is necessary (deontic). Context tells you which meaning is intended.',
        whenToUse: 'Whenever you talk about the future, give advice or express an opinion.',
        structure: [
          'Possibility: This policy may reduce congestion. (it is possible)',
          'Permission: Drivers may park here. (it is allowed)',
          'Deduction: Costs must be rising, given the data. (I conclude this)',
          'Obligation: Governments must act. (it is necessary)',
        ],
        notes: [
          'You do not need to memorise these terms; just get into the habit of asking yourself: am I talking about likelihood, or about what should be done?',
        ],
      },
      {
        id: 'm7-r2',
        heading: 'Degrees of certainty',
        rule: 'Modals can be arranged like a ladder, from almost certain down to a slight possibility. Choosing the right step keeps your claim reasonable.',
        whenToUse: 'When you discuss an outcome you cannot prove.',
        structure: [
          'will - confident prediction: Demand will rise.',
          'must - strong evidence-based deduction: The cause must be economic.',
          'should - reasonable expectation: The scheme should reduce delays.',
          'may / might / could - possibility: Automation may displace workers.',
          'cannot - impossibility: This cannot be the only explanation.',
        ],
        table: {
          caption: 'How strong is the claim?',
          headers: ['Modal', 'Strength', 'Typical use'],
          rows: [
            ['will', '95%', 'Predictions you are confident about'],
            ['must', '90%', 'Logical deductions from evidence'],
            ['should', '70%', 'Reasonable expectations'],
            ['may / might / could', '40%', 'Genuine possibilities'],
            ['could not / cannot', '0%', 'Ruling something out completely'],
          ],
        },
      },
      {
        id: 'm7-r3',
        heading: 'Obligation and advice',
        rule: 'Must is very strong and can sound like an order; should is the natural word for recommendations in an essay.',
        whenToUse: 'In paragraphs that propose solutions.',
        structure: [
          'Governments should invest in renewable energy.',
          'Schools ought to teach financial literacy.',
          'Companies need to disclose their emissions.',
          'Passengers must carry a valid ticket. (a rule, not an opinion)',
          'Students do not have to attend. (no obligation)',
        ],
        notes: [
          'Must not means it is forbidden; do not have to means it is not necessary, but you may if you wish. They never mean the same thing.',
          'In an argument, should is usually the better choice: it recommends without sounding like a law.',
        ],
      },
      {
        id: 'm7-r4',
        heading: 'The modal rules that never change',
        rule: 'A modal is always followed by the bare infinitive. Modals take no -s, no to after them, and two modals cannot sit side by side.',
        whenToUse: 'Always.',
        structure: [
          'modal + base verb: should invest',
          'modal + be + -ing: may be rising',
          'modal + have + past participle: might have caused',
          'modal + be + past participle: should be introduced',
        ],
        notes: [
          'should to invest, musts, will can and should invests are all impossible.',
          'For past possibility, use might have + participle: The delay might have been caused by funding cuts.',
        ],
      },
    ],
    examples: [
      {
        wrong: 'Governments must to reduce emissions.',
        right: 'Governments must reduce emissions.',
        note: 'A modal is followed by the bare infinitive.',
      },
      {
        wrong: 'This policy will definitely solve all social problems.',
        right: 'This policy could address several of these problems.',
        note: 'A measured claim is far easier to defend than an extreme one.',
      },
      {
        wrong: 'Students should to be encouraged to read widely.',
        right: 'Students should be encouraged to read widely.',
        note: 'Modal + be + past participle forms the modal passive.',
      },
      {
        wrong: 'The rise might caused by population growth.',
        right: 'The rise might have been caused by population growth.',
        note: 'Past possibility takes might have been + participle.',
      },
      {
        wrong: 'Employees must not work overtime if they do not want to.',
        right: 'Employees do not have to work overtime if they do not want to.',
        note: 'Must not means prohibition; do not have to means no obligation.',
      },
    ],
    mistakes: [
      {
        wrong: 'The government should to introduce stricter laws.',
        right: 'The government should introduce stricter laws.',
        explanation: 'To never follows a modal.',
      },
      {
        wrong: 'It will can solve the problem.',
        right: 'It will be able to solve the problem.',
        explanation: 'Two modals cannot sit together; replace the second with be able to.',
      },
      {
        wrong: 'Technology must improves education.',
        right: 'Technology must improve education.',
        explanation: 'The verb after a modal never takes -s.',
      },
      {
        wrong: 'Children may to watch television after finishing homework.',
        right: 'Children may watch television after finishing homework.',
        explanation: 'The same bare infinitive rule applies when the modal expresses permission.',
      },
      {
        wrong: 'This evidence must proves that the theory is correct.',
        right: 'This evidence suggests that the theory is correct.',
        explanation:
          'Besides the form error, must makes a stronger claim than a single piece of evidence can support.',
      },
    ],
    keyTakeaways: [
      'Before choosing a modal, ask: am I expressing likelihood or obligation?',
      'In essays, should is the natural way to recommend; keep must for rules and regulations.',
      'Modal + bare infinitive: no to, no -s, never two modals together.',
      'Use may, might and could to make claims you can genuinely defend.',
    ],
  },

  /* ------------------------------ Module 8 ----------------------------- */
  {
    moduleId: 8,
    intro:
      'The passive is a tool for shifting focus. It moves the thing affected by an action into the subject position. You need it when the doer is unknown, obvious or unimportant. It is not a way to make writing sound weighty or scholarly; a paragraph written entirely in the passive becomes harder to read, not better.',
    rules: [
      {
        id: 'm8-r1',
        heading: 'How the passive is formed',
        rule: 'The passive is be + past participle. Be carries the tense, so the participle never changes.',
        whenToUse: 'When what was affected matters more than who did the action.',
        structure: [
          'Present simple: The data are collected annually.',
          'Past simple: The scheme was introduced in 2015.',
          'Present perfect: Several studies have been conducted.',
          'Future: A new system will be installed.',
          'Modal: Emissions should be reduced.',
          'Continuous: The road is being widened.',
        ],
        table: {
          caption: 'Active to passive',
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
        heading: 'Leaving out the agent',
        rule: 'Include by + agent only when the reader needs to know who did the action. In academic writing it is usually omitted.',
        whenToUse: 'In processes, research methods and general statements.',
        structure: [
          'Doer unknown: The documents were destroyed.',
          'Doer obvious: The suspect was arrested. (by the police)',
          'Doer irrelevant: The samples were stored at 4 degrees.',
          'The doer is the key information: The theory was first proposed by Chomsky.',
        ],
        notes: [
          'In academic writing, roughly four out of five passives have no by-phrase.',
        ],
      },
      {
        id: 'm8-r3',
        heading: 'Impersonal reporting',
        rule: 'These two structures let you report a common view without naming who holds it.',
        whenToUse: 'When summarising general opinion or established research in an essay.',
        structure: [
          'It + passive + that-clause: It is argued that automation will reduce employment.',
          'Subject + passive + to-infinitive: Automation is believed to reduce employment.',
          'Common verbs: argue, believe, claim, think, say, expect, consider, report, know.',
        ],
        notes: [
          'These are useful but very noticeable. Once or twice in an essay is enough.',
          'The second structure needs a to-infinitive: X is believed to be..., never X is believed that...',
        ],
      },
      {
        id: 'm8-r4',
        heading: 'When the active is better',
        rule: 'Use the active when the doer is the point, or when the passive would hide responsibility or add needless words.',
        whenToUse: 'Most of the time.',
        structure: [
          'Weak: It was decided by the committee that the project would be cancelled.',
          'Better: The committee cancelled the project.',
          'Weak: Mistakes were made.',
          'Better: The department made several mistakes.',
        ],
        notes: [
          'In Task 2 the doers are usually clear: governments, schools, employers. Name them directly.',
        ],
      },
    ],
    examples: [
      {
        wrong: 'The report was wrote by a team of researchers.',
        right: 'The report was written by a team of researchers.',
        note: 'The passive needs the past participle, not the past simple.',
      },
      {
        wrong: 'The new policy will be introduce next year.',
        right: 'The new policy will be introduced next year.',
        note: 'After a modal, the structure is still be + past participle.',
      },
      {
        wrong: 'It is believed that technology to improve productivity.',
        right: 'It is believed that technology improves productivity.',
        note: 'It is believed that is followed by a full clause.',
      },
      {
        wrong: 'The glass is crushing and then melted.',
        right: 'The glass is crushed and then melted.',
        note: 'Process steps use the passive consistently.',
      },
      {
        wrong: 'The problem was happened last year.',
        right: 'The problem occurred last year.',
        note: 'Intransitive verbs such as happen (which take no object) have no passive form.',
      },
    ],
    mistakes: [
      {
        wrong: 'The results were showed in the second graph.',
        right: 'The results were shown in the second graph.',
        explanation: 'Shown is the participle; showed is the past simple.',
      },
      {
        wrong: 'Many changes have been occurred since then.',
        right: 'Many changes have occurred since then.',
        explanation:
          'occur, happen, rise, arrive and exist take no object, so they cannot be passive.',
      },
      {
        wrong: 'It is said that the policy to be effective.',
        right: 'The policy is said to be effective.',
        explanation:
          'Choose one structure: It is said that the policy is effective, or The policy is said to be effective.',
      },
      {
        wrong: 'The decision was made by the government to increase the tax by them.',
        right: 'The government decided to increase the tax.',
        explanation:
          'The passive added four extra words and forced the doer to be mentioned again. The active is clearer.',
      },
      {
        wrong: 'Air pollution is effected by traffic volume.',
        right: 'Air pollution is affected by traffic volume.',
        explanation:
          'Affect is the verb and effect is the noun. The passive structure itself was correct.',
      },
    ],
    keyTakeaways: [
      'be + past participle; be carries the tense.',
      'Drop the by-phrase if naming the doer tells the reader nothing new.',
      'It is argued that... is useful, but use it sparingly.',
      'When the doer matters, write in the active voice.',
    ],
  },

  /* ------------------------------ Module 9 ----------------------------- */
  {
    moduleId: 9,
    intro:
      'Every verb is followed by a particular pattern: sometimes a gerund, sometimes an infinitive, sometimes object + infinitive, sometimes a that-clause. These patterns cannot be guessed from meaning, so you have to learn each verb together with its pattern. The good news is that a few dozen verbs cover almost everything you need in an essay.',
    rules: [
      {
        id: 'm9-r1',
        heading: 'Verb + gerund (-ing form)',
        rule: 'Some common verbs are always followed by the -ing form, never by to.',
        whenToUse: 'With verbs meaning avoid, continue, propose and consider.',
        structure: [
          'avoid, consider, suggest, involve, risk, delay, deny, mind, practise, enjoy, keep, finish',
          'Governments should avoid raising taxes too quickly.',
          'The plan involves building three new schools.',
          'Critics suggest reviewing the policy.',
        ],
        notes: [
          'Suggest causes the most errors: suggest doing or suggest that someone do, but never suggest to do.',
        ],
      },
      {
        id: 'm9-r2',
        heading: 'Verb + to-infinitive',
        rule: 'Another group of verbs is followed by to + base form.',
        whenToUse: 'With verbs of intention, tendency and attempt.',
        structure: [
          'tend, aim, fail, hope, plan, decide, attempt, refuse, manage, afford, offer, seek, choose',
          'Young people tend to spend more time online.',
          'The scheme aims to cut emissions by half.',
          'Many countries have failed to meet their targets.',
        ],
      },
      {
        id: 'm9-r3',
        heading: 'Verb + object + to-infinitive',
        rule: 'Some verbs require a person or thing before the infinitive; this object cannot be left out.',
        whenToUse: 'When someone causes or enables someone else to do something.',
        structure: [
          'allow, enable, encourage, force, require, persuade, advise, expect, cause, lead',
          'Technology enables students to learn remotely.',
          'The law requires companies to publish their emissions.',
          'This allows people to work from home.',
        ],
        notes: [
          'You cannot write This allows to work from home. The object is compulsory.',
          'Make and let take the bare infinitive: This makes people work harder.',
        ],
        table: {
          caption: 'The patterns learners trip over most',
          headers: ['Verb', 'Pattern', 'Example'],
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
        heading: 'Preposition + gerund and adjective + infinitive',
        rule: 'A verb that comes directly after a preposition always takes the -ing form. Evaluative adjectives (important, difficult) are followed by a to-infinitive.',
        whenToUse: 'In almost every complex sentence.',
        structure: [
          'preposition + -ing: interested in learning, capable of solving, responsible for managing',
          'prevent / stop / discourage sb from doing',
          'adjective + to-infinitive: difficult to measure, likely to increase, important to consider',
          'It is + adjective + to-infinitive: It is essential to act now.',
        ],
        notes: [
          'The to in look forward to and be used to is a preposition, so it takes -ing: used to working late.',
          'Note the difference: used to work means a past habit; be used to working means being accustomed to something.',
        ],
      },
    ],
    examples: [
      {
        wrong: 'The report suggests to increase the budget.',
        right: 'The report suggests increasing the budget.',
        note: 'Suggest is followed by a gerund or a that-clause.',
      },
      {
        wrong: 'This policy allows to reduce traffic.',
        right: 'This policy allows cities to reduce traffic.',
        note: 'Allow needs an object before the infinitive.',
      },
      {
        wrong: 'They avoided to answer the question.',
        right: 'They avoided answering the question.',
        note: 'Avoid is always followed by -ing.',
      },
      {
        wrong: 'The law prevents companies to pollute rivers.',
        right: 'The law prevents companies from polluting rivers.',
        note: 'The pattern for prevent is from + -ing.',
      },
      {
        wrong: 'Students are capable to solve complex problems.',
        right: 'Students are capable of solving complex problems.',
        note: 'Capable is followed by of + -ing.',
      },
    ],
    mistakes: [
      {
        wrong: 'I would recommend to study abroad.',
        right: 'I would recommend studying abroad.',
        explanation: 'Recommend follows the same pattern as suggest.',
      },
      {
        wrong: 'The government should focus to improve healthcare.',
        right: 'The government should focus on improving healthcare.',
        explanation: 'Focus takes on, and a verb after a preposition must be -ing.',
      },
      {
        wrong: 'Technology enables to communicate instantly.',
        right: 'Technology enables people to communicate instantly.',
        explanation: 'Like allow and require, enable needs an object.',
      },
      {
        wrong: 'She is looking forward to hear from you.',
        right: 'She is looking forward to hearing from you.',
        explanation:
          'This to is not part of an infinitive; it is a preposition, so -ing follows.',
      },
      {
        wrong: 'It is difficult measuring happiness objectively.',
        right: 'It is difficult to measure happiness objectively.',
        explanation: 'After It is + evaluative adjective, use the to-infinitive.',
      },
    ],
    keyTakeaways: [
      'Learn each verb and its following pattern together, as one package.',
      'avoid, suggest, consider, involve and risk take -ing.',
      'allow, enable, encourage and require need an object before to.',
      'Any verb after a preposition takes -ing, even after look forward to.',
    ],
  },

  /* ----------------------------- Module 10 ----------------------------- */
  {
    moduleId: 10,
    intro:
      'Which preposition to use depends on the word before it, not on logic. There is no explanation for why we say an increase in but an impact on; the pairs simply have to be remembered. They matter a great deal in Task 1: rose by and rose to describe two completely different numbers.',
    rules: [
      {
        id: 'm10-r1',
        heading: 'Noun + preposition',
        rule: 'Academic nouns come with fixed prepositions. Learn the whole pair, not just the noun.',
        whenToUse: 'In any sentence that expresses a relationship between two things.',
        structure: [
          'an increase / rise / fall / decline / reduction IN something',
          'an impact / effect / influence ON something',
          'access / solution / approach / damage TO something',
          'a reason / need / demand FOR something',
          'a lack / cause / risk OF something',
          'a relationship / difference / link BETWEEN two things',
        ],
        table: {
          caption: 'The pairs you need most',
          headers: ['Noun', 'Preposition', 'Example'],
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
        rule: 'Many academic verbs must be followed by a particular preposition.',
        whenToUse: 'When expressing cause, dependence and responsibility.',
        structure: [
          'result in / result from',
          'depend on, rely on, focus on, concentrate on',
          'contribute to, lead to, respond to, refer to',
          'suffer from, benefit from, result from',
          'deal with, cope with, associate with',
        ],
        notes: [
          'Result in introduces the effect; result from introduces the cause. Congestion results in pollution; pollution results from congestion.',
          'discuss, mention, consider and affect take no preposition: write discuss the issue, not discuss about the issue.',
        ],
      },
      {
        id: 'm10-r3',
        heading: 'Adjective + preposition',
        rule: 'Adjectives have their own fixed prepositions too.',
        whenToUse: 'In evaluative sentences.',
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
        heading: 'Describing change in Task 1',
        rule: 'Four patterns give four different kinds of information. Mix them up and you report the wrong number.',
        whenToUse: 'Every time you describe a change in a figure.',
        structure: [
          'rise / fall BY - the size of the change: Sales rose by 20 per cent.',
          'rise / fall TO - the final value: Sales rose to 80 million.',
          'rise / fall FROM X TO Y: Sales rose from 60 to 80 million.',
          'peak / stand / remain AT - a specific value: Sales peaked at 90 million.',
        ],
        table: {
          caption: 'How to describe change',
          headers: ['Pattern', 'What it shows', 'Example'],
          rows: [
            ['by', 'Size of the change', 'fell by 15 per cent'],
            ['to', 'Final value', 'fell to 15 per cent'],
            ['from... to...', 'Start and end', 'fell from 30 to 15 per cent'],
            ['at', 'A specific value', 'peaked at 30 per cent'],
            ['between... and...', 'The time span', 'between 2000 and 2010'],
            ['in / over', 'A year / a period', 'in 2005; over the decade'],
          ],
        },
        notes: [
          'An increase of 20 per cent is the size of the rise; an increase to 20 per cent is where it ended up.',
        ],
      },
    ],
    examples: [
      {
        wrong: 'There was a sharp increase of the number of tourists.',
        right: 'There was a sharp increase in the number of tourists.',
        note: 'Increase in says what rose; increase of says by how much.',
      },
      {
        wrong: 'Social media has a huge impact in young people.',
        right: 'Social media has a huge impact on young people.',
        note: 'Impact always takes on.',
      },
      {
        wrong: 'The figure rose to 20 per cent between 2000 and 2010, from 40 to 60 million.',
        right: 'The figure rose by 20 per cent between 2000 and 2010, from 40 to 48 million.',
        note: 'Use by for the size of the change and from... to... for the start and end values.',
      },
      {
        wrong: 'Many countries are suffering of water shortages.',
        right: 'Many countries are suffering from water shortages.',
        note: 'Suffer takes from.',
      },
      {
        wrong: 'The essay discusses about three solutions.',
        right: 'The essay discusses three solutions.',
        note: 'Discuss takes a direct object with no preposition.',
      },
    ],
    mistakes: [
      {
        wrong: 'This leads to people become unemployed.',
        right: 'This leads to people becoming unemployed.',
        explanation:
          'The to in lead to is a preposition, so the verb after it takes -ing.',
      },
      {
        wrong: 'Unemployment is one of the main reasons of crime.',
        right: 'Unemployment is one of the main reasons for crime.',
        explanation: 'Reason takes for. The cause of crime would also work.',
      },
      {
        wrong: 'The results are different than the ones reported in 2019.',
        right: 'The results are different from the ones reported in 2019.',
        explanation:
          'Different from is standard in academic English; different than is mainly informal American usage.',
      },
      {
        wrong: 'Consumption peaked to 90 million units.',
        right: 'Consumption peaked at 90 million units.',
        explanation: 'peak, stand and remain all take at.',
      },
      {
        wrong: 'Students should concentrate in their studies.',
        right: 'Students should concentrate on their studies.',
        explanation: 'concentrate, focus, depend and rely all take on.',
      },
    ],
    keyTakeaways: [
      'Memorise each noun with its preposition: increase in, impact on, access to.',
      'Result in is followed by the effect; result from is followed by the cause.',
      'discuss, affect, mention and consider take no preposition.',
      'By = how much it changed; to = where it ended; at = a specific value.',
    ],
  },

  /* ----------------------------- Module 11 ----------------------------- */
  {
    moduleId: 11,
    intro:
      'Academic Task 1 is comparison from start to finish, and Task 2 constantly asks you to weigh one option against another. Comparison errors cost twice: a wrong multiple (twice, three times) is not just poor language, it also reports the wrong data.',
    rules: [
      {
        id: 'm11-r1',
        heading: 'Comparative and superlative forms',
        rule: 'One-syllable adjectives take -er and -est. Longer adjectives take more and most. Never use both together.',
        whenToUse: 'Whenever you say which of two or more things is greater or smaller.',
        structure: [
          'One syllable: high - higher - the highest',
          'Two syllables ending in -y: easy - easier - the easiest',
          'Longer words: expensive - more expensive - the most expensive',
          'Irregular: good - better - best; bad - worse - worst; far - further - furthest',
        ],
        notes: [
          'more higher and most highest are never correct.',
          'Superlatives take the: the largest proportion.',
        ],
      },
      {
        id: 'm11-r2',
        heading: 'Expressing equality and multiples',
        rule: 'Use as + adjective + as for equality, and put the multiple (twice, three times) before the first as.',
        whenToUse: 'When one figure is a multiple of another.',
        structure: [
          'as high as, not as high as',
          'twice as many cars as',
          'three times as expensive as',
          'three times the number of cars',
          'half as many visitors as',
        ],
        table: {
          caption: 'Two ways to express a multiple',
          headers: ['With as...as', 'With the + noun'],
          rows: [
            ['twice as many students as', 'twice the number of students'],
            ['three times as high as', 'three times the height of'],
            ['half as much energy as', 'half the amount of energy'],
          ],
        },
        notes: [
          'Use many with countable nouns and much with uncountable nouns.',
          'Do not write three times more than to mean three times as many as; three times more than is ambiguous.',
        ],
      },
      {
        id: 'm11-r3',
        heading: 'Showing how big the difference is',
        rule: 'An adverb placed before a comparative tells the reader how large the difference is.',
        whenToUse: 'To add variety instead of repeating the same plain comparison.',
        structure: [
          'Large difference: significantly, considerably, substantially, far, much',
          'Small difference: slightly, marginally, somewhat, a little',
          'Examples: significantly higher, slightly more expensive, far less common',
        ],
        notes: [
          'very goes with plain adjectives, not comparatives: very high is fine, but write much higher.',
        ],
      },
      {
        id: 'm11-r4',
        heading: 'Quantities, percentages and change',
        rule: 'A figure can be expressed as a proportion, a fraction or a change. Each has its own pattern.',
        whenToUse: 'Throughout Task 1.',
        structure: [
          'Proportion: 40 per cent of respondents; the proportion of women rose.',
          'Fractions: a quarter of the sample; two thirds of all households.',
          'Majority: the vast majority of; a small minority of.',
          'Adjective + noun: a sharp rise, a slight decline, a steady increase, a dramatic fall.',
          'Verb + adverb: rose sharply, fell slightly, increased steadily, declined dramatically.',
        ],
        table: {
          caption: 'The same data, two structures',
          headers: ['Noun phrase', 'Verb phrase'],
          rows: [
            ['There was a sharp rise in sales.', 'Sales rose sharply.'],
            ['A slight decline occurred in 2010.', 'The figure declined slightly in 2010.'],
            ['The graph shows a steady increase.', 'The figure increased steadily.'],
          ],
        },
        notes: [
          'Adjectives go before nouns; adverbs go after verbs. rose sharp and a sharply rise are clear errors.',
          'A percentage of an uncountable noun takes a singular verb; a percentage of a plural noun takes a plural verb: 40 per cent of the water is..., 40 per cent of students are...',
        ],
      },
    ],
    examples: [
      {
        wrong: 'The second city is more bigger than the first.',
        right: 'The second city is much bigger than the first.',
        note: 'Never combine more with an -er form.',
      },
      {
        wrong: 'There were twice more visitors in July than in January.',
        right: 'There were twice as many visitors in July as in January.',
        note: 'Use as...as to express a multiple.',
      },
      {
        wrong: 'Sales increased sharp between 2010 and 2015.',
        right: 'Sales increased sharply between 2010 and 2015.',
        note: 'An adverb describes the verb.',
      },
      {
        wrong: 'The figure for Spain was the most highest of all.',
        right: 'The figure for Spain was the highest of all.',
        note: 'One superlative marker is enough.',
      },
      {
        wrong: 'Three quarters of the energy are produced by coal.',
        right: 'Three quarters of the energy is produced by coal.',
        note: 'Energy is uncountable, so the verb is singular.',
      },
    ],
    mistakes: [
      {
        wrong: 'China has the larger population in the world.',
        right: 'China has the largest population in the world.',
        explanation:
          'Comparing one thing with all the others requires a superlative, not a comparative.',
      },
      {
        wrong: 'Car ownership is higher than 1990.',
        right: 'Car ownership is higher than it was in 1990.',
        explanation:
          'Compare like with like: a figure with a figure, not a figure with a year.',
      },
      {
        wrong: 'There was a slightly increase in unemployment.',
        right: 'There was a slight increase in unemployment.',
        explanation: 'A noun is modified by an adjective, not an adverb.',
      },
      {
        wrong: 'The number of users was more high in urban areas.',
        right: 'The number of users was higher in urban areas.',
        explanation: 'High is a short adjective, so it takes -er.',
      },
      {
        wrong: 'Japan spent three times more money than Italy did on research.',
        right: 'Japan spent three times as much money on research as Italy did.',
        explanation:
          'Three times more leaves it unclear whether you mean three or four times as much; the as...as pattern is precise.',
      },
    ],
    keyTakeaways: [
      'Each adjective takes one comparative marker: either -er or more.',
      'For multiples use twice / three times + as...as, or + the number of.',
      'Adjective before a noun, adverb after a verb: a sharp rise, rose sharply.',
      'Compare like with like, and make clear what you are comparing against.',
    ],
  },
]
