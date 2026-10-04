import type { Lesson } from '@/types'

/* English versions of the Stage 4 lessons. Same shape and ids as ../stage4.ts. */
export const stage4LessonsEn: Lesson[] = [
  /* ----------------------------- Module 18 ----------------------------- */
  {
    moduleId: 18,
    intro:
      'Academic writing sounds academic not because of long chains of clauses, but because it packs a lot of information into noun phrases. Building noun phrases, and unpacking them when needed, is the most useful advanced skill in this course. Knowing where to stop is part of that skill.',
    rules: [
      {
        id: 'm18-r1',
        heading: 'Four ways to expand a noun phrase',
        rule: 'Description can be added before the noun, after it, or on both sides. All four patterns are used heavily in academic writing.',
        whenToUse: 'When a sentence feels loose or keeps repeating itself.',
        structure: [
          'Adjective + noun: rapid growth',
          'Noun + noun: government policy, traffic congestion, air quality',
          'Noun + of-phrase: the growth of the economy',
          'Noun + another preposition: the impact on rural communities',
          'Noun + relative or participle clause: the policy introduced in 2015',
        ],
        table: {
          caption: 'Building a noun phrase step by step',
          headers: ['Step', 'Phrase'],
          rows: [
            ['Head noun', 'growth'],
            ['+ adjective', 'rapid growth'],
            ['+ noun modifier', 'rapid population growth'],
            ['+ prepositional phrase', 'rapid population growth in coastal cities'],
            ['+ participle clause', 'rapid population growth in coastal cities driven by migration'],
          ],
        },
        notes: [
          'In noun + noun combinations, the first noun stays singular: a three-year programme, a car park, government policy.',
        ],
      },
      {
        id: 'm18-r2',
        heading: 'Nominalization (turning verbs into nouns)',
        rule: 'Nominalization turns a verb or adjective into a noun. This lets a whole process become the subject of a sentence (prices rose → the rise in prices).',
        whenToUse:
          'When you want to refer back to an action concisely, or make it the topic of the next sentence.',
        structure: [
          'rise -> the rise; grow -> growth; decide -> the decision',
          'reduce -> a reduction; expand -> expansion; analyse -> analysis',
          'Because prices rose rapidly, demand fell. -> The rapid rise in prices reduced demand.',
          'The government decided to invest. -> The government decision to invest...',
        ],
        table: {
          caption: 'From verb to noun',
          headers: ['Clause', 'Nominalized phrase'],
          rows: [
            ['Temperatures increased sharply.', 'the sharp increase in temperatures'],
            ['The policy failed.', 'the failure of the policy'],
            ['Cities are expanding.', 'the expansion of cities'],
            ['People consume more energy.', 'rising energy consumption'],
          ],
        },
        notes: [
          'The adverb becomes an adjective: rose rapidly becomes a rapid rise.',
          'Keep the noun’s fixed preposition: a rise in, an impact on, a reduction in.',
        ],
      },
      {
        id: 'm18-r3',
        heading: 'Apposition and noun complement clauses',
        rule: 'In apposition, two noun phrases sit side by side and the second renames the first. A noun complement clause uses that to state the content of nouns such as idea, claim or fact.',
        whenToUse: 'To explain a term without a new sentence, or to state what a claim actually says.',
        structure: [
          'Apposition: Jakarta, the capital of Indonesia, is sinking.',
          'Apposition: One solution, congestion charging, has proved effective.',
          'Noun + that-clause: the claim that technology destroys jobs',
          'Common nouns: the idea / belief / fact / claim / argument / possibility that...',
        ],
        notes: [
          'A noun complement clause is not a relative clause: the fact that prices rose is correct; the fact which prices rose is not.',
        ],
      },
      {
        id: 'm18-r4',
        heading: 'Knowing where to stop',
        rule: 'Density is a tool, not a goal. When three or more modifiers pile up in one noun phrase, the reader has to unpack it piece by piece and the writing becomes unclear.',
        whenToUse: 'When you lose track while rereading your own sentence.',
        structure: [
          'Overloaded: Government urban transport infrastructure investment policy reform proposals',
          'Clearer: proposals to reform government policy on investment in urban transport',
          'Overloaded: The implementation of the reduction of the utilisation of plastic',
          'Clearer: Reducing plastic use',
        ],
        notes: [
          'A chain of of-phrases is a sure sign you have gone too far. Module 23 shows how to fix it.',
        ],
      },
    ],
    examples: [
      {
        wrong: 'Because the population grew quickly, the city expanded.',
        right: 'Rapid population growth drove the expansion of the city.',
        note: 'The clause has become a noun phrase that can act as the subject.',
      },
      {
        wrong: 'There was an increase of 20 per cent in the prices rapidly.',
        right: 'There was a rapid 20 per cent increase in prices.',
        note: 'Inside a noun phrase, the adverb becomes an adjective.',
      },
      {
        wrong: 'the governments policies on the environment',
        right: 'government environmental policy',
        note: 'Noun modifiers stay singular and take no apostrophe.',
      },
      {
        wrong: 'The fact which the policy failed is undeniable.',
        right: 'The fact that the policy failed is undeniable.',
        note: 'A noun complement clause takes that, not which.',
      },
      {
        wrong: 'The reduction of the amount of the consumption of water',
        right: 'Reduced water consumption',
        note: 'Three of-phrases have been reduced to two noun modifiers.',
      },
    ],
    mistakes: [
      {
        wrong: 'The increasing of prices has affected low-income families.',
        right: 'The increase in prices has affected low-income families.',
        explanation:
          'When an established noun form exists, use it, together with its own preposition.',
      },
      {
        wrong: 'a five-years plan for the development of the economy',
        right: 'a five-year economic development plan',
        explanation:
          'Compound modifiers stay singular, and an adjective is lighter than an of-phrase.',
      },
      {
        wrong: 'The analyse of the data shows a clear pattern.',
        right: 'The analysis of the data shows a clear pattern.',
        explanation: 'Analyse is the verb; analysis is the noun.',
      },
      {
        wrong: 'There is a possibility of that the scheme will fail.',
        right: 'There is a possibility that the scheme will fail.',
        explanation:
          'A noun complement clause follows the noun directly; no preposition comes before that.',
      },
      {
        wrong: 'The utilisation of the implementation of new technology methodologies',
        right: 'Introducing new technology',
        explanation:
          'Stacking abstract nouns destroys meaning. When that happens, go back to a verb.',
      },
    ],
    keyTakeaways: [
      'Arrange information before and after the head noun.',
      'Turning a clause into a noun phrase lets a whole process become the subject.',
      'Noun modifiers stay singular: a three-year plan, government policy.',
      'If the reader has to read it twice, stop there.',
    ],
  },

  /* ----------------------------- Module 19 ----------------------------- */
  {
    moduleId: 19,
    intro:
      'Hedging is how experienced writers make claims they can defend. An absolute claim with all or always immediately makes the reader think of an exception, but a measured claim survives. Hedging is not weakness or vagueness; it is saying precisely as much as your evidence supports.',
    rules: [
      {
        id: 'm19-r1',
        heading: 'The hedging toolkit',
        rule: 'Four kinds of words can soften a claim: modal verbs, lexical verbs (tend, appear), adverbs (often, generally) and quantifiers (many, some).',
        whenToUse: 'In any general claim about causes, effects or the future.',
        structure: [
          'Modal: may, might, could, can, would',
          'Verb: tend to, appear to, seem to, suggest, indicate, imply',
          'Adverb: often, generally, largely, arguably, relatively, possibly',
          'Quantifier: many, most, some, a number of, in some cases',
          'Frames: It is likely that..., It appears that..., There is evidence that...',
        ],
        table: {
          caption: 'Softening a claim',
          headers: ['Absolute claim', 'Measured claim'],
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
        heading: 'Add a condition instead of a hedge',
        rule: 'Often the best approach is not to soften the verb, but to state the circumstances in which the claim holds.',
        whenToUse: 'When you believe the claim, but it is not true in every case.',
        structure: [
          'Weak: Technology always improves education.',
          'Better: Technology can improve educational outcomes when it is properly implemented.',
          'Better: In well-resourced schools, technology has improved outcomes considerably.',
        ],
        notes: [
          'A conditional clause does not just soften the claim; it makes it more precise.',
          'It also strengthens your Task Response, because it shows you have considered limitations.',
        ],
      },
      {
        id: 'm19-r3',
        heading: 'Reporting what others say',
        rule: 'Your choice of reporting verb reveals your own stance, so choose it deliberately.',
        whenToUse: 'When referring to research, critics or common opinion.',
        structure: [
          'Neutral: states, reports, notes, describes',
          'Supportive: shows, demonstrates, establishes, confirms',
          'Cautious: suggests, indicates, implies',
          'Distancing: claims, asserts, alleges',
        ],
        notes: [
          'With shows or demonstrates you accept the finding yourself; suggests or indicates carries no such commitment.',
          'Claims signals that you doubt the point. Use it on purpose, not by accident.',
        ],
      },
      {
        id: 'm19-r4',
        heading: 'Do not over-hedge',
        rule: 'Stacking hedges until the sentence says nothing is as bad as overclaiming. One or two per claim is enough.',
        whenToUse: 'When editing your writing.',
        structure: [
          'Over-hedged: It could possibly be argued that there may perhaps be some evidence that this might be true.',
          'Fixed: There is some evidence that this is true.',
          'Over-hedged: It seems that it may be likely that costs could rise.',
          'Fixed: Costs are likely to rise.',
        ],
        notes: [
          'In IELTS Task 2 you must answer the question. Hedging measures your position; it is not an excuse for not having one.',
        ],
      },
    ],
    examples: [
      {
        wrong: 'Technology always improves education.',
        right: 'Technology can improve educational outcomes when it is implemented effectively.',
        note: 'Adding a condition makes the claim defensible.',
      },
      {
        wrong: 'All young people are addicted to social media.',
        right: 'Many young people spend a considerable amount of time on social media.',
        note: 'Both the absolute quantifier and the overstated verb have been changed.',
      },
      {
        wrong: 'This study proves that exercise prevents depression.',
        right: 'This study indicates that exercise may help prevent depression.',
        note: 'A single study indicates; it does not prove.',
      },
      {
        wrong: 'It is possible that it might perhaps be true that costs may rise.',
        right: 'Costs are likely to rise.',
        note: 'One hedge is enough.',
      },
      {
        wrong: 'Everybody knows that cities are dangerous.',
        right: 'Cities are often perceived as less safe than rural areas.',
        note: 'Present an opinion as an opinion, not as established fact.',
      },
    ],
    mistakes: [
      {
        wrong: 'Pollution definitely causes all respiratory diseases.',
        right: 'Pollution contributes to a range of respiratory conditions.',
        explanation:
          'All and definitely are impossible to defend; contributes to describes a realistic relationship.',
      },
      {
        wrong: 'The graph proves that the policy was successful.',
        right: 'The graph suggests that the policy had some effect.',
        explanation: 'A chart shows a trend; it does not prove a cause.',
      },
      {
        wrong: 'It tends to be that students may possibly perform better.',
        right: 'Students tend to perform better.',
        explanation: 'Tend to is already a hedge; the rest is padding.',
      },
      {
        wrong: 'In my opinion, I think that perhaps the government should maybe act.',
        right: 'The government should act.',
        explanation:
          'Your position should be clear. Hedge claims about evidence, not your own opinion.',
      },
      {
        wrong: 'Research is proving that this approach is the only solution.',
        right: 'Research suggests that this approach is one effective solution.',
        explanation:
          'The only solution is an absolute claim that no research can support.',
      },
    ],
    keyTakeaways: [
      'Use modals, tend to, suggest and adverbs to match the claim to the evidence.',
      'Adding a condition is often better than softening the verb.',
      'Reporting verbs carry your stance: shows commits you, suggests does not.',
      'One hedge per claim; do not hedge your own position out of existence.',
    ],
  },

  /* ----------------------------- Module 20 ----------------------------- */
  {
    moduleId: 20,
    intro:
      'Writing flows when each sentence starts with something the reader already knows. When a paragraph feels disjointed, most people add more linking words. The real fix is usually to change the order of information inside the sentence.',
    rules: [
      {
        id: 'm20-r1',
        heading: 'Given before new',
        rule: 'Start a sentence with what the reader already knows, and put the new information at the end.',
        whenToUse: 'In every sentence after the first one in a paragraph.',
        structure: [
          'Choppy: A new tax was introduced in 2015. Congestion fell by 20 per cent because of the tax.',
          'Flowing: In 2015 the city introduced a new tax. This measure cut congestion by 20 per cent.',
        ],
        notes: [
          'Readers remember the last few words of a sentence best. Put your key point there.',
          'This principle does most of the work you are trying to make linking words do.',
        ],
      },
      {
        id: 'm20-r2',
        heading: 'End-weight',
        rule: 'Long, complex material goes at the end of the sentence, not at the start.',
        whenToUse: 'When the subject grows longer than about ten words.',
        structure: [
          'Heavy subject: That governments should invest more heavily in renewable infrastructure is clear.',
          'End-weight: It is clear that governments should invest more heavily in renewable infrastructure.',
          'Heavy subject: The need to reduce emissions, cut waste and protect biodiversity is urgent.',
          'End-weight: There is an urgent need to reduce emissions, cut waste and protect biodiversity.',
        ],
      },
      {
        id: 'm20-r3',
        heading: 'Tools for reordering information',
        rule: 'Four structures let you move information around a sentence without changing the information itself.',
        whenToUse: 'When writing the sentence the natural way puts the new information first.',
        structure: [
          'Passive: brings the affected thing forward. The scheme was criticised by residents.',
          'Existential there: introduces something new. There are three explanations for this.',
          'Extraposition: moves a clause to the end. It is clear that demand has risen.',
          'Fronted adverbial: sets the context first. In rural areas, access remains limited.',
        ],
        notes: [
          'These are the same structures from Modules 8 and 14, used here for flow rather than for grammar.',
        ],
      },
      {
        id: 'm20-r4',
        heading: 'Linking sentences: this + summary noun',
        rule: 'Start a sentence with this or these plus a noun that sums up the previous sentence in one word.',
        whenToUse: 'At the start of a sentence that comments on the whole previous sentence.',
        structure: [
          'Cities are expanding rapidly. This expansion places pressure on housing.',
          'Many firms now allow remote work. This shift has reduced office demand.',
          'Useful nouns: trend, shift, change, approach, measure, finding, problem, development, practice.',
        ],
        notes: [
          'This is both a cohesion technique and a way of putting given information first.',
          'Without a noun, this on its own is often unclear. Modules 4 and 21 make the same point.',
        ],
      },
    ],
    examples: [
      {
        wrong: 'A sharp fall in rainfall, which affected three regions and lasted two years, occurred.',
        right: 'There was a sharp fall in rainfall, which affected three regions and lasted two years.',
        note: 'The heavy material is now at the end of the sentence.',
      },
      {
        wrong: 'Firstly, cities grew. Moreover, housing costs rose. Furthermore, commuting increased.',
        right: 'Cities grew rapidly. This growth pushed up housing costs and lengthened commutes.',
        note: 'Reordering removed the need for three connectors.',
      },
      {
        wrong: 'To find a solution that satisfies all stakeholders is difficult.',
        right: 'It is difficult to find a solution that satisfies all stakeholders.',
        note: 'Extraposition moved the heavy part to the end (end-weight).',
      },
      {
        wrong: 'Residents criticised the scheme. The scheme was expensive and poorly planned.',
        right: 'The scheme was criticised by residents, who considered it expensive and poorly planned.',
        note: 'The passive brings the known topic to the front.',
      },
      {
        wrong: 'Unemployment rose. This is a problem.',
        right: 'Unemployment rose sharply. This increase has placed pressure on welfare budgets.',
        note: 'The summary noun picks up the previous idea and carries it forward.',
      },
    ],
    mistakes: [
      {
        wrong: 'Moreover, in addition, furthermore, the cost should also be considered.',
        right: 'Cost is a further consideration.',
        explanation:
          'Three connectors are doing the same job of adding a point. The sentence order already does that.',
      },
      {
        wrong: 'That the climate is changing rapidly and that action is needed urgently is accepted.',
        right: 'It is widely accepted that the climate is changing rapidly and that urgent action is needed.',
        explanation: 'Two heavy subject clauses belong at the end of the sentence.',
      },
      {
        wrong: 'Congestion charging reduced traffic. Traffic reduction improved air quality. Air quality improvements reduced illness.',
        right: 'Congestion charging reduced traffic, which improved air quality and, in turn, lowered rates of illness.',
        explanation:
          'Mechanically chaining given-new across three sentences sounds artificial; one sentence says it better.',
      },
      {
        wrong: 'There is the government which should act on this issue.',
        right: 'The government should act on this issue.',
        explanation:
          'Existential there introduces new, indefinite information, not a subject the reader already knows.',
      },
      {
        wrong: 'This is why it matters a lot for the future.',
        right: 'This pattern matters because it shapes long-term planning.',
        explanation: 'The vague this is replaced with a summary noun and a reason, so the link is clear.',
      },
    ],
    keyTakeaways: [
      'Start with information the reader knows; end with new information.',
      'Put heavy material at the end of the sentence.',
      'Use the passive, there, extraposition and fronting to reorder without changing content.',
      'This + summary noun is the most reliable way to link two sentences.',
    ],
  },

  /* ----------------------------- Module 21 ----------------------------- */
  {
    moduleId: 21,
    intro:
      'Cohesion is not a long list of connectors. It is the set of techniques that let a text point back to what it has already said without repeating it in full. The band descriptors explicitly penalise mechanical overuse of cohesive devices, which makes reference, substitution and ellipsis far more valuable skills.',
    rules: [
      {
        id: 'm21-r1',
        heading: 'Reference',
        rule: 'Pronouns, demonstratives (this, these) and the definite article (the) all point back to something already mentioned.',
        whenToUse: 'In every paragraph, all the time.',
        structure: [
          'Pronoun: The committee met yesterday. It approved the budget.',
          'Demonstrative: Three cities were studied. These differ in size.',
          'Definite article: A new tax was introduced. The tax raised 2 billion.',
          'Comparative reference: a similar pattern, the same trend, another approach',
        ],
        notes: [
          'The alone tells the reader the noun has appeared before; it creates cohesion by itself.',
        ],
      },
      {
        id: 'm21-r2',
        heading: 'Substitution',
        rule: 'Instead of repeating a long phrase, replace it with a short word.',
        whenToUse: 'When you would otherwise repeat a noun or verb phrase.',
        structure: [
          'one / ones for countable nouns: The old system was slow; the new one is faster.',
          'do so / does so for verb phrases: Those who recycle do so for environmental reasons.',
          'so for clauses: If demand rises, and it seems likely to do so, prices will follow.',
          'such + noun: Such measures are rarely popular.',
        ],
        notes: [
          'Do so is the formal written version of do it, and it is very useful in essays.',
        ],
      },
      {
        id: 'm21-r3',
        heading: 'Ellipsis',
        rule: 'Leave out words the reader can recover from the previous clause.',
        whenToUse: 'In paired structures and comparisons.',
        structure: [
          'Some countries invest heavily in rail; others, in roads.',
          'The first policy succeeded; the second did not.',
          'She can speak French, and he can too.',
          'More was spent on healthcare than on education.',
        ],
        notes: [
          'The reader must be able to recover whatever you omit. If they would have to guess, write the words out.',
        ],
      },
      {
        id: 'm21-r4',
        heading: 'Use connectors sparingly',
        rule: 'Use a linking adverbial only when the relationship is genuinely unexpected or needs to be stated. Do not start every sentence with a connector.',
        whenToUse: 'Roughly once every three or four sentences, not more.',
        structure: [
          'Overloaded: Firstly, cities are growing. Moreover, housing is scarce. Furthermore, prices are rising. In addition, wages are flat.',
          'Natural: Cities are growing while housing remains scarce. Prices have risen accordingly, and wages have not kept pace.',
        ],
        table: {
          caption: 'What to do instead of adding another connector',
          headers: ['Instead of', 'Do this'],
          rows: [
            ['Moreover, ...', 'Join the two sentences with and or a relative clause'],
            ['Furthermore, ...', 'Move forward with this + summary noun'],
            ['In addition, ...', 'Build a list inside one sentence'],
            ['Therefore, ...', 'Use a result participle clause: ..., reducing costs.'],
          ],
        },
      },
    ],
    examples: [
      {
        wrong: 'The new policy replaced the old policy because the old policy was ineffective.',
        right: 'The new policy replaced the old one, which had proved ineffective.',
        note: 'Substitution and a relative clause removed two repetitions.',
      },
      {
        wrong: 'People who volunteer, they volunteer for personal reasons.',
        right: 'People who volunteer usually do so for personal reasons.',
        note: 'Do so replaces the whole verb phrase.',
      },
      {
        wrong: 'Firstly, pollution is rising. Secondly, traffic is rising. Thirdly, noise is rising.',
        right: 'Pollution, traffic and noise are all increasing.',
        note: 'One sentence does the work of three connectors.',
      },
      {
        wrong: 'These kind of problems require urgent action.',
        right: 'These kinds of problem require urgent action.',
        note: 'These must agree with a plural noun.',
      },
      {
        wrong: 'Some countries invest in rail. Other countries invest in roads.',
        right: 'Some countries invest in rail; others, in roads.',
        note: 'Ellipsis removes the words the reader can supply.',
      },
    ],
    mistakes: [
      {
        wrong: 'Such problem is difficult to solve.',
        right: 'Such problems are difficult to solve.',
        explanation:
          'Such is followed by a plural or uncountable noun; a singular countable noun needs such a.',
      },
      {
        wrong: 'Moreover, furthermore, the cost is also high.',
        right: 'The cost is also high.',
        explanation: 'Also already adds the point, so the other two connectors are redundant.',
      },
      {
        wrong: 'The report was long. This made difficult to read.',
        right: 'The report was long, which made it difficult to read.',
        explanation: 'Make needs an object; here it refers to the report.',
      },
      {
        wrong: 'I prefer the first option than the second one.',
        right: 'I prefer the first option to the second.',
        explanation:
          'Prefer takes to, and after ellipsis the second is enough on its own.',
      },
      {
        wrong: 'Students who study abroad, they do it because of career reasons.',
        right: 'Students who study abroad often do so for career reasons.',
        explanation:
          'Remove the extra pronoun and use the formal alternative do so.',
      },
    ],
    keyTakeaways: [
      'Reference, substitution and ellipsis create cohesion without connectors.',
      'Use one, ones, do so and such instead of repeating the same phrase.',
      'Leave out only what the reader can recover.',
      'A connector in every sentence sounds mechanical and costs marks.',
    ],
  },

  /* ----------------------------- Module 22 ----------------------------- */
  {
    moduleId: 22,
    intro:
      'This module is optional. Clefts and inversion are real structures that skilled writers use for emphasis. But IELTS does not require them for any band, and many candidates who force inversion turn a correct sentence into an incorrect one. Learn them so you recognise them, and use them only when emphasis is genuinely needed.',
    rules: [
      {
        id: 'm22-r1',
        heading: 'What-clefts',
        rule: 'A what-cleft moves the part you want to emphasise into the second half of the sentence.',
        whenToUse:
          'At most once per essay, usually to emphasise a central point or recommendation.',
        structure: [
          'Plain: Governments need long-term planning.',
          'Cleft: What governments need is long-term planning.',
          'Plain: The cost matters most.',
          'Cleft: What matters most is the cost.',
        ],
        notes: [
          'When a what-clause is the subject, the verb after it is singular: What matters is...',
        ],
      },
      {
        id: 'm22-r2',
        heading: 'It-clefts',
        rule: 'An it-cleft singles out one particular part of the sentence, especially to show contrast.',
        whenToUse: 'When correcting a reader’s likely misconception.',
        structure: [
          'Plain: Poor planning caused the delay.',
          'Cleft: It was poor planning that caused the delay.',
          'Plain: The policy failed in rural areas.',
          'Cleft: It was in rural areas that the policy failed.',
        ],
        notes: ['Use that for things and circumstances, and who or that for people.'],
      },
      {
        id: 'm22-r3',
        heading: 'Negative inversion',
        rule: 'When a sentence opens with a negative or restrictive adverbial such as never, rarely or only then, the subject and auxiliary swap places, as in a question.',
        whenToUse: 'Rarely, and only when you fully control the structure.',
        structure: [
          'Not only does the scheme reduce costs, but it also improves safety.',
          'Rarely has a policy attracted so much criticism.',
          'Only after 2010 did the figure begin to fall.',
          'Under no circumstances should this be ignored.',
        ],
        table: {
          caption: 'Normal and inverted forms',
          headers: ['Normal', 'Inverted'],
          rows: [
            ['The scheme not only reduces costs but also improves safety.', 'Not only does the scheme reduce costs, but it also improves safety.'],
            ['A policy has rarely attracted so much criticism.', 'Rarely has a policy attracted so much criticism.'],
            ['The figure only began to fall after 2010.', 'Only after 2010 did the figure begin to fall.'],
          ],
        },
        notes: [
          'If there is no auxiliary, do, does or did fills the slot and the main verb returns to its base form.',
          'In not only...but also, only the first clause inverts, not the second.',
        ],
      },
      {
        id: 'm22-r4',
        heading: 'When not to use them',
        rule: 'Emphatic structures have a cost: they are long, noticeable and easy to get wrong. A plain sentence never loses marks for being plain.',
        whenToUse: 'Read this before using any structure from this module.',
        structure: [
          'IELTS rewards a range of structures used accurately and flexibly, not a checklist of particular \'impressive\' forms.',
          'An inverted sentence with errors does far more damage than an accurate plain sentence.',
          'If a structure does not come easily and naturally under time pressure, do not use it in the exam.',
        ],
        notes: [
          'At advanced level, marks really come from the skills in Modules 18 to 21. Treat this module as extra knowledge.',
        ],
      },
    ],
    examples: [
      {
        wrong: 'What governments needs is long-term planning.',
        right: 'What governments need is long-term planning.',
        note: 'The verb inside the what-clause agrees with governments.',
      },
      {
        wrong: 'Not only the scheme reduces costs, but also improves safety.',
        right: 'Not only does the scheme reduce costs, but it also improves safety.',
        note: 'A fronted negative needs inversion, and the second clause needs its own subject.',
      },
      {
        wrong: 'Rarely a policy has attracted so much criticism.',
        right: 'Rarely has a policy attracted so much criticism.',
        note: 'Rarely at the start triggers inversion.',
      },
      {
        wrong: 'It was the cost what caused the delay.',
        right: 'It was the cost that caused the delay.',
        note: 'An it-cleft takes that, not what.',
      },
      {
        wrong: 'Only after the law changed the figure began to fall.',
        right: 'Only after the law changed did the figure begin to fall.',
        note: 'Only + adverbial requires do-support and the base form.',
      },
    ],
    mistakes: [
      {
        wrong: 'Never before people have had access to so much information.',
        right: 'Never before have people had access to so much information.',
        explanation: 'With a fronted negative, the auxiliary moves before the subject.',
      },
      {
        wrong: 'What is needed are stronger regulations.',
        right: 'What is needed is stronger regulations.',
        explanation: 'The what-clause is a singular subject, so the verb stays singular.',
      },
      {
        wrong: 'Not only it is expensive but also ineffective.',
        right: 'It is not only expensive but also ineffective.',
        explanation:
          'If you do not front the phrase, no inversion is needed; the normal form is correct and simpler.',
      },
      {
        wrong: 'Under no circumstances we should ignore this evidence.',
        right: 'Under no circumstances should we ignore this evidence.',
        explanation: 'A fronted restrictive phrase requires inversion.',
      },
      {
        wrong: 'It is the government who is responsible for it is the funding.',
        right: 'The government is responsible for funding.',
        explanation:
          'No cleft is better than a broken one. When in doubt, write the plain sentence.',
      },
    ],
    keyTakeaways: [
      'These structures are optional and not required for Band 8.',
      'What-clefts and it-clefts shift the emphasis; keep the verb singular after a what-clause.',
      'A fronted negative inverts the subject and auxiliary, with do-support where needed.',
      'An accurate plain sentence always beats an impressive sentence with errors.',
    ],
  },
]
