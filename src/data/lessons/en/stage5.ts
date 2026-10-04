import type { Lesson } from '@/types'

/* English versions of the Stage 5 lessons. Same shape and ids as ../stage5.ts. */
export const stage5LessonsEn: Lesson[] = [
  /* ----------------------------- Module 23 ----------------------------- */
  {
    moduleId: 23,
    intro:
      'This module introduces no new grammar; it is an editing checklist. Everything here happens after the writing is done: cutting what is unnecessary, placing modifiers next to the right word, and keeping subjects close to their verbs. These habits reduce errors even under exam pressure, because short, well-organised sentences contain fewer mistakes.',
    rules: [
      {
        id: 'm23-r1',
        heading: 'Cut the deadwood',
        rule: 'Some familiar phrases only add length, not meaning. Replace them with a single word.',
        whenToUse:
          'In every draft, even when you only have two minutes left in the exam.',
        structure: [
          'due to the fact that -> because',
          'in spite of the fact that -> although',
          'at this point in time -> now',
          'in the event that -> if',
          'has the ability to -> can',
          'a large number of -> many',
          'in order to -> to',
          'it is important to note that -> can often be deleted entirely',
        ],
        table: {
          caption: 'Long form and short form',
          headers: ['Wordy', 'Concise'],
          rows: [
            ['There are many people who believe', 'Many people believe'],
            ['The reason why this happens is because', 'This happens because'],
            ['In todays modern world', 'Today'],
            ['make a decision about', 'decide'],
            ['conduct an investigation into', 'investigate'],
          ],
        },
        notes: [
          'Nouns made from verbs often hide the real action: write decide instead of make a decision. When the nominalization from Module 18 goes too far, this is how you turn it back into a verb.',
        ],
      },
      {
        id: 'm23-r2',
        heading: 'Keep the subject close to the verb',
        rule: 'When many words separate a subject from its verb, the reader has to hold the subject in mind, and the risk of agreement errors rises.',
        whenToUse: 'When more than about eight words come between the subject and the verb.',
        structure: [
          'Hard: The policy, which was introduced in 2015 after a lengthy consultation involving several agencies, failed.',
          'Better: The policy failed, despite a lengthy consultation involving several agencies before its introduction in 2015.',
          'Better: Introduced in 2015 after a lengthy consultation, the policy failed.',
        ],
      },
      {
        id: 'm23-r3',
        heading: 'Place modifiers next to the word they modify',
        rule: 'A modifier attaches to the nearest word. If that is not the word you meant, move the modifier to the right place.',
        whenToUse: 'Check only, almost, nearly, just and every descriptive phrase.',
        structure: [
          'Only the committee approved the plan. (nobody else approved it)',
          'The committee only approved the plan. (it approved it and did nothing more)',
          'The committee approved only the plan. (nothing except this plan was approved)',
          'Misplaced: The minister announced a plan to reduce emissions on Tuesday.',
          'Fixed: On Tuesday the minister announced a plan to reduce emissions.',
        ],
        notes: [
          'Put only directly before the part you want to limit.',
          'A time or place phrase at the end of a sentence attaches to the nearest noun, which is often the wrong one.',
        ],
      },
      {
        id: 'm23-r4',
        heading: 'Keep sentences from running too long',
        rule: 'Vary sentence length, but set a limit on long sentences. If a sentence goes beyond about thirty words, split it.',
        whenToUse: 'When you lose track of your own sentence while writing it.',
        structure: [
          'Split at a coordinator: ...costs, and the delay... becomes two separate sentences.',
          'Split at a relative pronoun: ..., which meant... becomes This meant...',
          'Turn a clause into a phrase: Because it was expensive -> Owing to its cost',
        ],
        notes: [
          'Long sentences are not proof of skill; the right mix of short and long sentences is.',
          'Two accurate sentences score higher than one heavy sentence with three errors.',
        ],
      },
    ],
    examples: [
      {
        wrong: 'Due to the fact that the cost was high, the project was cancelled.',
        right: 'Because the cost was high, the project was cancelled.',
        note: 'Five words have become one.',
      },
      {
        wrong: 'He almost drove his children to school every day.',
        right: 'He drove his children to school almost every day.',
        note: 'Almost belongs right next to every day.',
      },
      {
        wrong: 'The committee made a decision to conduct an investigation into the matter.',
        right: 'The committee decided to investigate the matter.',
        note: 'Two verbs hidden inside nouns have been restored.',
      },
      {
        wrong: 'There are a large number of students who are struggling with the course.',
        right: 'Many students are struggling with the course.',
        note: 'The There is... structure added no meaning.',
      },
      {
        wrong: 'Walking through the park, the statues were impressive.',
        right: 'Walking through the park, we found the statues impressive.',
        note: 'Statues do not walk; the modifier needed a proper subject.',
      },
    ],
    mistakes: [
      {
        wrong: 'In todays modern world of today, technology is important.',
        right: 'Technology is now central to daily life.',
        explanation:
          'The opening phrase said the same thing twice, and important is vague.',
      },
      {
        wrong: 'The report that was written by the team that was appointed last year was published.',
        right: 'The report by the team appointed last year has been published.',
        explanation:
          'Two full relative clauses have been reduced to phrases, so the verb arrives sooner after the subject.',
      },
      {
        wrong: 'She only eats vegetables on weekdays, which are organic.',
        right: 'On weekdays she eats only organic vegetables.',
        explanation:
          'Both only and the relative clause had drifted away from the words they belonged to.',
      },
      {
        wrong: 'It is important to note that it should be mentioned that costs have risen.',
        right: 'Costs have risen.',
        explanation: 'Neither opening phrase carries any information; delete both.',
      },
      {
        wrong: 'The implementation of the utilisation of renewable resources is necessary.',
        right: 'Renewable resources must be used more widely.',
        explanation:
          'A chain of nominalizations was hiding a simple verb. Unpack them and write a plain clause again.',
      },
    ],
    keyTakeaways: [
      'Replace long stock phrases with a single word.',
      'Keep the subject next to its verb.',
      'Place only and every descriptive phrase right next to the word it refers to.',
      'If you lose track of a sentence while writing it, split it.',
    ],
  },

  /* ----------------------------- Module 24 ----------------------------- */
  {
    moduleId: 24,
    intro:
      'The final module is about judgement: choosing a register that fits the task, punctuating deliberately, and varying sentence length for effect rather than for show. Band 8 requires a wide range of structures used flexibly, and flexibility means choosing the right structure, not making everything complicated.',
    rules: [
      {
        id: 'm24-r1',
        heading: 'Academic and professional register',
        rule: 'Formal written English avoids contractions (don\'t, it\'s), conversational phrasal verbs and addressing the reader directly as you.',
        whenToUse: 'IELTS Task 1 and Task 2, reports and most official writing.',
        structure: [
          'No contractions: do not, cannot, it is',
          'Avoid: get, a lot of, kids, stuff, things',
          'Prefer: obtain or receive, a great deal of, children, factors, issues',
          'Single-word verbs instead of phrasal verbs: find out -> discover; go up -> increase; cut down on -> reduce',
          'No direct address: not As you can see, but As the chart shows',
        ],
        table: {
          caption: 'Informal to formal',
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
          'A workplace email is less formal than an academic essay, and some contractions are normal there. Register is not one-size-fits-all; match it to the type of writing.',
          'In formal writing, do not start sentences with And or But. Use Moreover or However, or restructure the sentence.',
        ],
      },
      {
        id: 'm24-r2',
        heading: 'Semicolons, colons and dashes',
        rule: 'Each mark has a specific job. Using the right one removes the need for extra words.',
        whenToUse: 'Sparingly, and never twice in the same sentence.',
        structure: [
          'Semicolon - joins two closely related complete sentences: Costs rose; demand fell.',
          'Semicolon - separates list items that already contain commas.',
          'Colon - signals that a list, explanation or conclusion follows: Three factors matter: cost, time and access.',
          'Dash - sets off an aside with emphasis: The result - entirely unexpected - changed the policy.',
        ],
        notes: [
          'A colon must follow a complete clause, not a fragment.',
          'Use dashes sparingly in formal academic writing; they are more common in professional writing.',
        ],
      },
      {
        id: 'm24-r3',
        heading: 'Purposeful sentence variety',
        rule: 'Vary sentence length so that the structure reinforces the meaning. A short sentence after two long ones lands with force.',
        whenToUse: 'At the end of a paragraph, or when stating your position.',
        structure: [
          'A long sentence for context and conditions...',
          'A medium sentence to explain the point...',
          'A short sentence for the conclusion: The cost is simply too high.',
        ],
        notes: [
          'Avoid three consecutive sentences of the same length and structure.',
          'Vary sentence openings too; not every sentence has to start with the subject. An opening adverbial or participle clause changes the rhythm.',
        ],
      },
      {
        id: 'm24-r4',
        heading: 'Aim for flexibility, not complexity everywhere',
        rule: 'Good range means choosing the right structure for the job, even when that structure is simple. It does not mean every sentence has to be complex.',
        whenToUse: 'In your final check before submitting any piece of writing.',
        structure: [
          'Ask yourself: does this sentence really need to be complex, or am I complicating it to look advanced?',
          'Ask yourself: is every complex sentence error-free?',
          'Ask yourself: will the reader understand it on the first read?',
        ],
        notes: [
          'This is where the whole course comes together: accuracy first, then complexity, then the judgement to know which to use when.',
        ],
      },
    ],
    examples: [
      {
        wrong: 'There is a lot of stuff that governments can do about this.',
        right: 'Governments can take a number of measures to address this.',
        note: 'A vague conversational noun has been replaced with precise academic vocabulary.',
      },
      {
        wrong: 'The policy didnt work, and it cost a lot too.',
        right: 'The policy did not work, and it was expensive.',
        note: 'No contraction, and a precise adjective instead of a vague quantity like a lot.',
      },
      {
        wrong: 'Three factors matter: are cost, time and access.',
        right: 'Three factors matter: cost, time and access.',
        note: 'The clause before the colon must be complete, and the list follows directly.',
      },
      {
        wrong: 'Costs rose, demand fell.',
        right: 'Costs rose; demand fell.',
        note: 'A semicolon joins two complete sentences where a comma cannot.',
      },
      {
        wrong: 'As you can see from the graph, sales went up.',
        right: 'As the graph shows, sales increased.',
        note: 'Avoid addressing the reader directly, and use a one-word verb instead of a phrasal verb.',
      },
    ],
    mistakes: [
      {
        wrong: 'In conclusion, I wanna say that governments should do more.',
        right: 'In conclusion, governments should do more.',
        explanation:
          'Wanna is not acceptable in written English, and the lead-in phrase was unnecessary anyway.',
      },
      {
        wrong: 'The main issues are: cost, time and access.',
        right: 'The main issues are cost, time and access.',
        explanation:
          'A colon cannot separate a verb from its object; the clause before a colon must be complete.',
      },
      {
        wrong: 'Costs rose; however demand fell; and prices stayed flat.',
        right: 'Costs rose; however, demand fell and prices stayed flat.',
        explanation:
          'However needs a comma after it, and two semicolons in one sentence is excessive.',
      },
      {
        wrong: 'Kids nowadays are getting addicted to their phones big time.',
        right: 'Children today spend an increasing amount of time on their phones.',
        explanation:
          'Three register problems in one sentence: a conversational noun, a conversational verb and slang.',
      },
      {
        wrong: 'Although many argue that the policy is effective, and despite the evidence, however it remains controversial.',
        right: 'Although many argue that the policy is effective, it remains controversial.',
        explanation:
          'Three connectors for one contrast. A muddled complex sentence reads worse than a simple one.',
      },
    ],
    keyTakeaways: [
      'Match the register to the task: no contractions or conversational words in academic writing.',
      'Semicolons join sentences, colons introduce what follows, dashes emphasise an aside.',
      'Vary sentence length and openings deliberately, especially at the end of a paragraph.',
      'Good range means choosing the right structure, not always the most complex one.',
    ],
  },
]
