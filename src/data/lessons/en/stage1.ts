import type { Lesson } from '@/types'

/* English versions of the Stage 1 lessons. Same shape and ids as ../stage1.ts. */
export const stage1LessonsEn: Lesson[] = [
  /* ------------------------------ Module 1 ----------------------------- */
  {
    moduleId: 1,
    intro:
      'Every English sentence is built from clauses, and every clause needs a subject and a verb. Most learners who fall short of Band 8 are not held back by advanced grammar; they lose marks for missing subjects, doubled subjects and broken word order. Once this foundation is secure, every later module becomes easier.',
    rules: [
      {
        id: 'm1-r1',
        heading: 'The five clause elements',
        rule: 'A clause is made of up to five elements: Subject, Verb, Object, Complement and Adverbial. The verb is always required, and in written English the subject is required too.',
        whenToUse:
          'Use this as an error-finding tool. When a sentence feels wrong, split it into its elements and check what is missing or what appears twice.',
        structure: [
          'Subject + Verb: Prices rose.',
          'Subject + Verb + Object: The government introduced a tax.',
          'Subject + Verb + Complement: The results are significant.',
          'Subject + Verb + Adverbial: The figure peaked in 2015.',
          'Subject + Verb + Object + Adverbial: Cities attract migrants for economic reasons.',
        ],
        notes: [
          'A complement describes the subject and usually follows be, become, seem or appear.',
          'Adverbials can move around the sentence; objects and complements cannot.',
        ],
        table: {
          caption: 'A quick way to identify each element',
          headers: ['Element', 'Question it answers', 'Example'],
          rows: [
            ['Subject', 'Who or what does the action?', 'Public transport reduces congestion.'],
            ['Verb', 'What happens?', 'Public transport reduces congestion.'],
            ['Object', 'What receives the action?', 'Public transport reduces congestion.'],
            ['Complement', 'What is the subject?', 'The policy is effective.'],
            ['Adverbial', 'When, where, why, how?', 'The policy worked in rural areas.'],
          ],
        },
      },
      {
        id: 'm1-r2',
        heading: 'Basic word order: Subject - Verb - Object',
        rule: 'English uses word order to carry meaning. If the subject and object swap places, the person doing the action changes, so this order cannot be rearranged freely.',
        whenToUse: 'In every ordinary statement.',
        structure: [
          'Statement: Subject + Verb + Object + (Adverbial)',
          'An adverbial can also open the sentence: In 2020, the government introduced a tax.',
          'Keep the verb close to its subject; do not insert long material between them.',
        ],
        notes: [
          'An opening adverbial of more than a few words is followed by a comma.',
          'Do not put an adverb between a verb and its object: not reduces significantly congestion, but significantly reduces congestion.',
        ],
      },
      {
        id: 'm1-r3',
        heading: 'A prepositional phrase can never be the subject',
        rule: 'A phrase beginning with in, on, from, by, for or according to is an adverbial, not a subject. The clause still needs its own subject.',
        whenToUse:
          'Especially in the opening sentence of Task 1, where many writers start with In the graph or According to the table.',
        structure: [
          'Wrong: In this graph shows the data.',
          'Right: The graph shows the data.',
          'Right: In this graph, the data shows a clear trend.',
          'Right: As the graph shows, consumption rose steadily.',
        ],
        notes: [
          'If you open with In / From / According to, check that a real subject follows the comma.',
        ],
        examples: [
          {
            wrong: 'In the chart illustrates the number of visitors.',
            right: 'The chart illustrates the number of visitors.',
            note: 'Removing the preposition lets the chart become the subject.',
          },
        ],
      },
      {
        id: 'm1-r4',
        heading: 'Dummy it and existential there',
        rule: 'An English clause cannot run without a subject. When there is no meaningful subject to use, it or there fills the empty slot.',
        whenToUse:
          'In evaluative sentences (It is important to...), for weather and time, and to say that something exists (There are three reasons...).',
        structure: [
          'It + be + adjective + to-infinitive: It is important to consider the cost.',
          'It + be + adjective + that-clause: It is clear that demand has risen.',
          'There + be + noun: There are several explanations for this trend.',
        ],
        notes: [
          'Never drop this it; in written English, Is important to consider is not a complete sentence.',
          'There is / There are changes with the noun that follows. Module 2 covers this in detail.',
        ],
      },
    ],
    examples: [
      {
        wrong: 'In this graph shows the population of three cities.',
        right: 'This graph shows the population of three cities.',
        note: 'In this graph is an adverbial phrase, so the clause had no subject.',
      },
      {
        wrong: 'Is important to invest in education.',
        right: 'It is important to invest in education.',
        note: 'Written English requires the dummy subject it.',
      },
      {
        wrong: 'The students they often struggle with grammar.',
        right: 'The students often struggle with grammar.',
        note: 'Do not repeat the subject with a pronoun.',
      },
      {
        wrong: 'The policy reduced significantly air pollution.',
        right: 'The policy significantly reduced air pollution.',
        note: 'An adverb cannot sit between a verb and its object.',
      },
      {
        wrong: 'Have many reasons for this problem.',
        right: 'There are many reasons for this problem.',
        note: 'Use existential there to say that something exists.',
      },
    ],
    mistakes: [
      {
        wrong: 'In the first chart shows a sharp rise.',
        right: 'The first chart shows a sharp rise.',
        explanation:
          'A prepositional phrase can never act as the subject. Either remove the preposition or add a subject after the comma.',
      },
      {
        wrong: 'Is necessary to reduce carbon emissions.',
        right: 'It is necessary to reduce carbon emissions.',
        explanation: 'Every written clause needs a subject; when there is no real one, a dummy subject must fill the slot.',
      },
      {
        wrong: 'My country it has a growing economy.',
        right: 'My country has a growing economy.',
        explanation:
          'My country is already the subject, so adding it gives the clause two subjects.',
      },
      {
        wrong: 'Nowadays, more and more people living in cities.',
        right: 'Nowadays, more and more people live in cities.',
        explanation:
          'An -ing form on its own is never a finite verb, so the clause had no real verb.',
      },
      {
        wrong: 'Explains the author that technology has changed society.',
        right: 'The author explains that technology has changed society.',
        explanation:
          'In English statements the subject always comes before the verb; the order only inverts in questions.',
      },
    ],
    keyTakeaways: [
      'Make a habit of finding the subject and the finite verb in every sentence.',
      'A phrase starting with in, on or according to is never the subject.',
      'When there is no real subject, use it or there; never leave the subject slot empty.',
      'Do not double the subject with a pronoun, and do not put an adverb between the verb and its object.',
    ],
  },

  /* ------------------------------ Module 2 ----------------------------- */
  {
    moduleId: 2,
    intro:
      'Agreement feels easy when the subject is short. The trouble starts when the subject gets long: we lose track of the real subject and match the verb to the nearest noun instead. Because this error repeats throughout an essay, it has an outsized effect on your accuracy.',
    rules: [
      {
        id: 'm2-r1',
        heading: 'Find the head noun, then match the verb',
        rule: 'The verb agrees with the head noun of the subject noun phrase, not with whichever noun happens to sit just before the verb.',
        whenToUse:
          'Whenever the subject contains of, with, along with, as well as or a relative clause.',
        structure: [
          'The number of students is rising. (head = number)',
          'The effects of the policy are visible. (head = effects)',
          'The quality of the roads has improved. (head = quality)',
        ],
        notes: [
          'Mentally skip everything between the head noun and the verb, then check the match.',
          'along with, together with and as well as do not turn a singular subject into a plural one.',
        ],
      },
      {
        id: 'm2-r2',
        heading: 'There is and there are',
        rule: 'In existential sentences the verb agrees with the noun that follows, not with there.',
        whenToUse: 'When introducing that something new exists.',
        structure: [
          'There is a clear difference between the two groups.',
          'There are several reasons for this change.',
          'There has been a steady increase in demand.',
          'There have been numerous attempts to solve the problem.',
        ],
        notes: [
          'With a list, agree with the first item: There is a library and two laboratories on campus.',
        ],
      },
      {
        id: 'm2-r3',
        heading: 'Uncountable nouns are always singular',
        rule: 'Many abstract nouns (advice, progress) and mass nouns (equipment) have no plural in English and always take a singular verb.',
        whenToUse: 'Almost constantly in academic writing, which relies heavily on abstract nouns.',
        structure: [
          'Information is widely available.',
          'This research supports the hypothesis.',
          'The equipment was installed last year.',
        ],
        table: {
          caption: 'The nouns learners get wrong most often',
          headers: ['Uncountable (no -s)', 'Use this when you need to count'],
          rows: [
            ['information', 'pieces of information / facts'],
            ['research', 'studies'],
            ['advice', 'pieces of advice / suggestions'],
            ['equipment', 'machines / tools'],
            ['knowledge', 'skills'],
            ['furniture', 'items of furniture'],
            ['evidence', 'findings'],
            ['progress', 'steps / improvements'],
          ],
        },
        notes: [
          'Never write informations, researches, advices or equipments.',
          'To count, use a unit word: three pieces of evidence.',
        ],
      },
      {
        id: 'm2-r4',
        heading: 'Each, every, one of and the two kinds of number',
        rule: 'Each and every take a singular verb. One of takes a singular verb even though a plural noun follows it. A number of is plural; the number of is singular.',
        whenToUse: 'When making general statements and when describing data or statistics.',
        structure: [
          'Each student receives a laptop.',
          'Every country faces this challenge.',
          'One of the main causes is poor planning.',
          'A number of studies have reached the same conclusion.',
          'The number of applicants has fallen.',
        ],
        notes: [
          'A number of means several, so the verb is plural. The number of refers to one specific figure, so the verb is singular.',
          'In academic English, collective nouns such as government, team and company take a singular verb: The government has announced a plan.',
        ],
      },
    ],
    examples: [
      {
        wrong: 'The impact of social media on young people are significant.',
        right: 'The impact of social media on young people is significant.',
        note: 'The head noun is impact, which is singular.',
      },
      {
        wrong: 'There is many factors behind this trend.',
        right: 'There are many factors behind this trend.',
        note: 'The verb agrees with factors.',
      },
      {
        wrong: 'Researches show that exercise improves memory.',
        right: 'Research shows that exercise improves memory.',
        note: 'Research is uncountable: no -s and a singular verb.',
      },
      {
        wrong: 'One of the biggest problem are traffic congestion.',
        right: 'One of the biggest problems is traffic congestion.',
        note: 'One of takes a plural noun but a singular verb.',
      },
      {
        wrong: 'The number of cars have increased sharply.',
        right: 'The number of cars has increased sharply.',
        note: 'The number of refers to one figure, so the verb is singular.',
      },
    ],
    mistakes: [
      {
        wrong: 'The government are planning new regulations.',
        right: 'The government is planning new regulations.',
        explanation:
          'In academic English, collective nouns take a singular verb. Whichever form you choose, keep it consistent throughout the essay.',
      },
      {
        wrong: 'Each of the participants were interviewed twice.',
        right: 'Each of the participants was interviewed twice.',
        explanation: 'The head of the subject is each, and each is always singular.',
      },
      {
        wrong: 'Modern technology have changed the way we work.',
        right: 'Modern technology has changed the way we work.',
        explanation: 'Technology is uncountable here, so it takes a singular verb.',
      },
      {
        wrong: 'A number of solutions has been proposed.',
        right: 'A number of solutions have been proposed.',
        explanation: 'A number of means several, so the verb must be plural.',
      },
      {
        wrong: 'The data was collected from three countries, and they was analysed in 2020.',
        right: 'The data were collected from three countries and analysed in 2020.',
        explanation:
          'Academic writing usually treats data as plural. Whichever form you choose, keep it consistent.',
      },
    ],
    keyTakeaways: [
      'Strip out the material in the middle and match the verb to the head noun.',
      'There is / there are agrees with the noun that follows, not with there.',
      'information, research, advice, equipment and evidence never take -s.',
      'A number of = plural verb; the number of = singular verb.',
    ],
  },

  /* ------------------------------ Module 3 ----------------------------- */
  {
    moduleId: 3,
    intro:
      'Articles carry little meaning of their own, so they are easy to drop and easy to miss. The problem is volume: a single essay has around a hundred places where an article decision is needed, so even a small error rate makes the whole text look inaccurate. Work through it in steps: countable or uncountable, then specific or general, then first mention or something already introduced.',
    rules: [
      {
        id: 'm3-r1',
        heading: 'The article decision steps',
        rule: 'Ask three questions: Is the noun countable? Is it singular? Will the reader know exactly which one you mean?',
        whenToUse: 'Just before writing any common noun.',
        structure: [
          'Countable + singular + specific: the solution',
          'Countable + singular + non-specific: a solution',
          'Countable + plural + general: solutions',
          'Uncountable + general: pollution',
          'Any noun already mentioned: the',
        ],
        table: {
          caption: 'Which article goes where',
          headers: ['Noun type', 'General meaning', 'Specific meaning'],
          rows: [
            ['Singular countable', 'a / an car', 'the car'],
            ['Plural countable', 'cars (no article)', 'the cars'],
            ['Uncountable', 'water (no article)', 'the water'],
          ],
        },
      },
      {
        id: 'm3-r2',
        heading: 'First mention and second mention',
        rule: 'Introduce something new with a or no article; refer back to the same thing later with the.',
        whenToUse: 'In paragraphs that develop a single example.',
        structure: [
          'The city built a new railway. The railway has reduced congestion.',
          'Governments could introduce taxes. The taxes would fund public transport.',
        ],
        notes: [
          'Use the when context makes the reference clear: the government, the environment, the internet.',
          'Use the before superlatives and ordinals: the highest figure, the first stage.',
        ],
      },
      {
        id: 'm3-r3',
        heading: 'Talking about things in general',
        rule: 'For general reference, use plural countable nouns with no article and uncountable nouns with no article.',
        whenToUse:
          'In Task 2 introductions and topic sentences, where you discuss a whole category rather than a specific example.',
        structure: [
          'Cars pollute the air. (not The cars pollute...)',
          'Education reduces inequality.',
          'Children learn languages quickly.',
          'A child learns languages quickly. (singular generic, less common)',
        ],
        notes: [
          'The + plural noun means a specific group: The children in the study learned quickly.',
          'Abstract nouns used in a general sense take no the: the technology has changed society is wrong.',
        ],
      },
      {
        id: 'm3-r4',
        heading: 'Determiners and quantifiers',
        rule: 'Demonstratives and quantifiers take the place of an article; do not combine them with a or the.',
        whenToUse: 'To point back to an earlier idea or to express an approximate amount.',
        structure: [
          'this / that + singular; these / those + plural',
          'much + uncountable; many + countable plural',
          'a little / little + uncountable; a few / few + countable plural',
          'some, any, all, most, several, both',
        ],
        table: {
          caption: 'Which nouns each quantifier goes with',
          headers: ['Quantifier', 'Noun type', 'Example'],
          rows: [
            ['much, a little, less', 'uncountable', 'much progress, less traffic'],
            ['many, a few, fewer', 'countable plural', 'many studies, fewer cars'],
            ['most, some, all', 'both types', 'most people, most pollution'],
            ['each, every', 'countable singular', 'each student'],
          ],
        },
        notes: [
          'Most people means most people in general; most of the people means most of a specific group.',
          'A few means some; few means almost none. The difference between a little and little works the same way.',
        ],
      },
    ],
    examples: [
      {
        wrong: 'The technology has transformed the education.',
        right: 'Technology has transformed education.',
        note: 'Both nouns are general and uncountable here, so neither takes an article.',
      },
      {
        wrong: 'He is engineer at a large company.',
        right: 'He is an engineer at a large company.',
        note: 'A singular countable noun always needs a determiner.',
      },
      {
        wrong: 'The cars are a major source of pollution.',
        right: 'Cars are a major source of pollution.',
        note: 'Use the plural with no article for general reference.',
      },
      {
        wrong: 'There are much advantages to this approach.',
        right: 'There are many advantages to this approach.',
        note: 'Advantages is countable, so it takes many.',
      },
      {
        wrong: 'Government should invest more in the public transport.',
        right: 'The government should invest more in public transport.',
        note: 'The government is specific, but public transport is general here.',
      },
    ],
    mistakes: [
      {
        wrong: 'Internet has changed how we communicate.',
        right: 'The internet has changed how we communicate.',
        explanation:
          'Unique, shared things take the: the internet, the environment, the media.',
      },
      {
        wrong: 'She did a research on renewable energy.',
        right: 'She carried out research on renewable energy.',
        explanation:
          'Research is uncountable, so it cannot take a. If you need a countable noun, use a study.',
      },
      {
        wrong: 'Most of people believe that education is important.',
        right: 'Most people believe that education is important.',
        explanation:
          'For general reference use most + plural noun. Most of needs a determiner after it: most of the people in the survey.',
      },
      {
        wrong: 'The children in general need more outdoor activity.',
        right: 'Children in general need more outdoor activity.',
        explanation:
          'A whole category takes the plural with no article; adding the would point to one particular group.',
      },
      {
        wrong: 'This problems affect every city.',
        right: 'These problems affect every city.',
        explanation: 'This is for singular nouns; plural nouns take these.',
      },
      {
        wrong: 'It is a useful information for students.',
        right: 'It is useful information for students.',
        explanation:
          'An uncountable noun never takes a. To count it, add a piece of.',
      },
    ],
    keyTakeaways: [
      'First decide countable or uncountable, then specific or general.',
      'Use a to introduce something new and the to refer back to it.',
      'For general reference, use plural or uncountable nouns with no article.',
      'Never put an article next to this, these, each, every or most.',
    ],
  },

  /* ------------------------------ Module 4 ----------------------------- */
  {
    moduleId: 4,
    intro:
      'Every time you use a pronoun, you assume the reader already knows who or what you mean. If they do not, the argument stalls even though the sentence is grammatically well formed. This error costs marks in both Grammar and Coherence, so it is worth fixing properly.',
    rules: [
      {
        id: 'm4-r1',
        heading: 'Pronoun-noun number agreement',
        rule: 'A pronoun must agree in number with the noun it refers to (its antecedent). Use it, he, she or singular they for singular nouns, and they for plural nouns.',
        whenToUse: 'Every time you refer back to a noun you have already mentioned.',
        structure: [
          'The company increased its budget.',
          'Companies increased their budgets.',
          'A student should submit their work on time. (singular they, now widely accepted)',
        ],
        notes: [
          'If you treat a collective noun as singular, use it: The government published its report.',
          'Singular they is acceptable in academic writing for an unspecified person and avoids clumsy forms such as he or she.',
        ],
      },
      {
        id: 'm4-r2',
        heading: 'One pronoun, one antecedent',
        rule: 'A pronoun should point to exactly one noun. If two nouns could fit, repeat the noun instead of using a pronoun.',
        whenToUse: 'When a sentence contains two nouns that the pronoun could refer to.',
        structure: [
          'Ambiguous: Governments give money to charities, but they waste it.',
          'Clear: Governments give money to charities, but the charities waste it.',
          'Clear: Governments give money to charities, although this funding is often wasted.',
        ],
        notes: [
          'If you hesitate for a moment while rereading your own writing, the reader will too.',
          'Repeating a noun is never wrong; an ambiguous pronoun always is.',
        ],
      },
      {
        id: 'm4-r3',
        heading: 'This, that and summary nouns',
        rule: 'This and that can refer to a whole idea, but this on its own often leaves the reader guessing. Adding a noun makes the reference clear.',
        whenToUse:
          'At the start of a sentence that comments on the previous one. This is one of the most useful habits in academic writing.',
        structure: [
          'Weak: Cities are expanding rapidly. This causes problems.',
          'Strong: Cities are expanding rapidly. This expansion places pressure on housing.',
          'Useful summary nouns: this trend, this approach, this finding, this shift, this policy, this argument.',
        ],
        notes: ['Module 21 develops this same structure as a cohesion technique.'],
      },
      {
        id: 'm4-r4',
        heading: 'Dummy it vs existential there',
        rule: 'Use it to evaluate or to move a long clause to the end of the sentence; use there to say that something exists. One cannot replace the other.',
        whenToUse: 'In introduction sentences and when bringing in new information.',
        structure: [
          'It is clear that demand has risen.',
          'It is difficult to measure happiness.',
          'There is a strong link between diet and health.',
          'There are three main arguments against this view.',
        ],
        notes: [
          'It comes before an adjective or a that-clause; there comes before a noun phrase.',
          'The it in It is clear that... does not refer to anything, so it needs no antecedent.',
        ],
      },
    ],
    examples: [
      {
        wrong: 'Every company must protect their data.',
        right: 'Every company must protect its data.',
        note: 'With every, the pronoun must be singular.',
      },
      {
        wrong: 'When parents talk to teachers, they often disagree with them.',
        right: 'When parents talk to teachers, the parents often disagree with them.',
        note: 'With two plural nouns, they was ambiguous.',
      },
      {
        wrong: 'There is clear that the policy failed.',
        right: 'It is clear that the policy failed.',
        note: 'Use it before an adjective and a that-clause.',
      },
      {
        wrong: 'The results were surprising. It suggests a new explanation.',
        right: 'The results were surprising. They suggest a new explanation.',
        note: 'The antecedent results is plural.',
      },
      {
        wrong: 'Pollution increased, and this is a problem that must be solved.',
        right: 'Pollution increased, and this deterioration must be addressed.',
        note: 'The summary noun makes it clear what this refers to.',
      },
    ],
    mistakes: [
      {
        wrong: 'Students should bring his or her own laptop.',
        right: 'Students should bring their own laptops.',
        explanation: 'Keeping the antecedent plural makes the pronoun simple and natural.',
      },
      {
        wrong: 'It has many museums in the city.',
        right: 'There are many museums in the city.',
        explanation: 'Use there, not it, to say that something exists.',
      },
      {
        wrong: 'The committee announced their decision, and it was criticised by them.',
        right: 'The committee announced its decision, which was widely criticised.',
        explanation:
          'Keep the collective noun singular, and use a relative clause to untangle the chain of pronouns.',
      },
      {
        wrong: 'Technology is advancing quickly, which they make old skills obsolete.',
        right: 'Technology is advancing quickly, which makes old skills obsolete.',
        explanation:
          'The relative pronoun which is already the subject, so they adds a second subject.',
      },
      {
        wrong: 'Some people prefer cars to public transport because it is faster.',
        right: 'Some people prefer cars to public transport because cars are faster.',
        explanation:
          'It could refer to either option, so the comparison loses its meaning.',
      },
    ],
    keyTakeaways: [
      'Check that every pronoun has one clear antecedent and agrees with it in number.',
      'Replace a vague this with this + summary noun.',
      'It introduces evaluation; there introduces existence.',
      'Repeating the noun is always better than an ambiguous pronoun.',
    ],
  },

  /* ------------------------------ Module 5 ----------------------------- */
  {
    moduleId: 5,
    intro:
      'This module answers one question: where does a sentence begin and end? Fragments, run-ons and comma splices all come from getting that answer wrong. The good news is that the check is mechanical, so you can run it under exam pressure without having to think about meaning.',
    rules: [
      {
        id: 'm5-r1',
        heading: 'Independent and dependent clauses',
        rule: 'An independent clause can stand alone as a complete sentence. A dependent clause begins with a subordinator (such as because or although) and cannot stand alone.',
        whenToUse: 'Just before you put a full stop.',
        structure: [
          'Independent: Air quality has improved.',
          'Dependent: Because air quality has improved',
          'Complete: Because air quality has improved, fewer people suffer from asthma.',
        ],
        table: {
          caption: 'Words that create a dependent clause',
          headers: ['Relationship', 'Subordinator'],
          rows: [
            ['Reason', 'because, since, as'],
            ['Contrast', 'although, though, whereas, while'],
            ['Condition', 'if, unless, provided that'],
            ['Time', 'when, before, after, until, once'],
            ['Purpose', 'so that, in order that'],
          ],
        },
        notes: [
          'A sentence can contain several dependent clauses, but it must contain at least one independent clause.',
        ],
      },
      {
        id: 'm5-r2',
        heading: 'Fragments',
        rule: 'A fragment is a piece of a sentence punctuated as if it were complete. It usually lacks a finite verb, or it is a dependent clause standing on its own.',
        whenToUse: 'Check every sentence that starts with because, although, which or an -ing form.',
        structure: [
          'Fragment: Because the cost of housing has risen sharply.',
          'Fixed: Because the cost of housing has risen sharply, many young people cannot buy a home.',
          'Fragment: Which is the main reason for the decline.',
          'Fixed: This is the main reason for the decline.',
        ],
        notes: [
          'An -ing form is not a finite verb, so The population growing rapidly. is a fragment.',
        ],
      },
      {
        id: 'm5-r3',
        heading: 'Run-ons and comma splices',
        rule: 'Two independent clauses cannot be joined with nothing between them (a run-on) or with only a comma (a comma splice).',
        whenToUse:
          'Whenever you join two complete ideas, especially around however and therefore.',
        structure: [
          'Splice: The policy was expensive, it reduced emissions.',
          'Fix 1 - full stop: The policy was expensive. It reduced emissions.',
          'Fix 2 - coordinator: The policy was expensive, but it reduced emissions.',
          'Fix 3 - semicolon: The policy was expensive; it reduced emissions.',
          'Fix 4 - subordinator: Although the policy was expensive, it reduced emissions.',
        ],
        notes: [
          'The four fixes do not mean the same thing. Choose the one that expresses the relationship you intend.',
        ],
      },
      {
        id: 'm5-r4',
        heading: 'Coordinators vs linking adverbials',
        rule: 'And, but, so, or, yet and for can join two clauses after a comma. However, therefore, moreover and nevertheless cannot, because they are adverbs, not conjunctions.',
        whenToUse: 'Every time you use however or therefore.',
        structure: [
          'Correct: The cost was high, but the benefits were clear.',
          'Correct: The cost was high. However, the benefits were clear.',
          'Correct: The cost was high; however, the benefits were clear.',
          'Wrong: The cost was high, however the benefits were clear.',
        ],
        table: {
          caption: 'Punctuation for each type of connector',
          headers: ['Connector type', 'Examples', 'Punctuation'],
          rows: [
            ['Coordinator', 'and, but, so, or, yet', 'clause, + coordinator + clause'],
            ['Subordinator', 'although, because, if', 'Subordinator clause, + main clause'],
            ['Linking adverbial', 'however, therefore, moreover', 'clause. + Adverbial, + clause'],
          ],
        },
        notes: [
          'A semicolon can replace the full stop before a linking adverbial, but a comma never can.',
          'A semicolon joins two complete, closely related sentences. If either side is not a complete sentence, use a comma.',
        ],
      },
    ],
    examples: [
      {
        wrong: 'Many cities face congestion, however few have solved it.',
        right: 'Many cities face congestion; however, few have solved it.',
        note: 'However cannot join two clauses with just a comma.',
      },
      {
        wrong: 'Although the scheme was popular, but it was cancelled.',
        right: 'Although the scheme was popular, it was cancelled.',
        note: 'One connector is enough; although already expresses the contrast.',
      },
      {
        wrong: 'Because the system is efficient. It saves money.',
        right: 'Because the system is efficient, it saves money.',
        note: 'The first part is a dependent clause but was punctuated as a full sentence.',
      },
      {
        wrong: 'Online learning is convenient it is also cheaper.',
        right: 'Online learning is convenient, and it is also cheaper.',
        note: 'Two independent clauses need something to join them.',
      },
      {
        wrong: 'Working from home has become common; which reduces commuting.',
        right: 'Working from home has become common, which reduces commuting.',
        note: 'A semicolon must be followed by an independent clause.',
      },
    ],
    mistakes: [
      {
        wrong: 'Technology is advancing rapidly, therefore many jobs will disappear.',
        right: 'Technology is advancing rapidly; therefore, many jobs will disappear.',
        explanation:
          'Therefore is a linking adverbial, so a comma alone creates a comma splice. A full stop would work equally well.',
      },
      {
        wrong: 'The report was published last year. Which caused a public debate.',
        right: 'The report was published last year, which caused a public debate.',
        explanation: 'A clause beginning with which cannot stand alone as a sentence.',
      },
      {
        wrong: 'More people are cycling, this reduces air pollution.',
        right: 'More people are cycling, which reduces air pollution.',
        explanation:
          'This starts a new independent clause, so the comma creates a splice. A relative clause joins the two ideas neatly.',
      },
      {
        wrong: 'Despite the government invested heavily, the problem remained.',
        right: 'Although the government invested heavily, the problem remained.',
        explanation:
          'Despite is followed by a noun or an -ing form; a full clause needs although. Module 12 covers this difference in detail.',
      },
      {
        wrong: 'The city has three main problems; traffic, pollution and housing.',
        right: 'The city has three main problems: traffic, pollution and housing.',
        explanation:
          'A colon introduces a list. A semicolon would need a complete sentence on both sides.',
      },
    ],
    keyTakeaways: [
      'Before every full stop, check that the sentence has a subject and a finite verb.',
      'Join two independent clauses with a full stop, a semicolon, a coordinator or a subordinator.',
      'However and therefore follow a full stop or a semicolon, never just a comma.',
      'Never use two connectors to express one relationship.',
    ],
  },
]
