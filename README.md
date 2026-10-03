# Grammar Path

A frontend-only grammar learning app that takes a learner from basic clause control to
**IELTS Writing Band 8+ and professional C1-C2 English**. Twenty-four modules across five
stages, unlocked one at a time.

## Running it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (http://localhost:5173 by default).

```bash
npm run build     # type-check and produce a production build in dist/
npm run preview   # serve the production build
```

No backend, no database, no authentication. Everything runs in the browser and all progress
is stored in `localStorage` under the `grammar-path:` prefix.

## The teaching model

The course is sequential. A module unlocks only when the one before it has been passed:

```
Lesson -> Quick practice -> Module test -> 80% or higher -> next module unlocks
```

The ordering principle is **accuracy first, then complexity, then control**. Stage 1 is where
most band-limiting errors actually live, so advanced structures stay locked until the
foundations are secure. The app deliberately does not teach that more complicated grammar
means better writing, and it does not claim IELTS requires showpiece structures such as
inversion or clefts — Module 22 says so explicitly and is marked Optional.

### Stages

| Stage | Name | Modules |
|-------|------|---------|
| 1 | Foundation | 1-5 |
| 2 | Core Grammar | 6-11 |
| 3 | Complex Sentence Control | 12-17 |
| 4 | Advanced Grammar | 18-22 |
| 5 | Professional Writing | 23-24 |

## Each module page

1. **Header** — number, title, stage, difficulty, time estimate, topic chips, status
2. **IELTS relevance** — importance plus one of: Essential for Band 8 / High-value enhancement / Optional
3. **The rule** — rule, when to use it, structure, important notes, tables
4. **Examples** — incorrect, correct, explanation
5. **Common mistakes** — 3-6 per module, visually distinct
6. **Quick practice** — instant feedback, does not affect the score
7. **Module test** — 10 mixed questions, 80% to pass

## Project structure

```
src/
├── app/            App shell and routes (content routes are lazy-loaded)
├── components/
│   ├── ui/         Button, Card, Badge, ProgressBar, ProgressRing, StatTile, EmptyState
│   ├── lesson/     RuleCard, examples, mistakes, IELTS relevance, QuestionCard
│   └── dashboard/  StageTrack, ActivityCalendar
├── data/
│   ├── modules.ts  Metadata for the 24 modules and 5 stages
│   ├── lessons/    stage1-5.ts — rules, examples, mistakes, takeaways
│   └── questions/  stage1-5.ts — practice and test banks
├── hooks/          useLocalStorage, useProgress, useStreak, useStudyTimer, useTheme
├── pages/          Dashboard, Course, Module, Test, Review, Progress, Settings
├── types/          Shared domain types
└── utils/          progression, streak, stats, badges, answers, storage, date, cn
```

Content is fully separated from UI. Adding a module means adding one entry to `modules.ts`,
one `Lesson` object, and its questions — no component changes.

### Adding a module

```ts
// src/data/modules.ts
{ id: 25, slug: 'new-topic', title: 'New Topic', stage: 5, difficulty: 'Advanced',
  summary: '...', estimatedMinutes: 15, topics: ['...'],
  ielts: { importance: 'High', priority: 'High-value enhancement', note: '...' } }
```

Then add a `Lesson` with the same `moduleId` in `src/data/lessons/`, and questions in
`src/data/questions/` (ids `m25-p*` for practice, `m25-t*` for the test). Unlocking, progress
percentages, stage rollups and the dashboard all derive from the data automatically.

### Question types

`multiple-choice`, `fill-blank`, `choose-correct-sentence`, `error-correction`, `rewrite`.
Typed answers are graded case- and punctuation-insensitively, and each question can list
`acceptable` alternatives.

## Tracking

- **Progress** — completed modules, best score, latest score, attempt count
- **Daily activity** — minutes, modules completed, tests taken, questions answered and correct
- **Streaks** — a day counts once 10 minutes are studied; current and longest are both kept
- **Study timer** — accrues a minute per active minute, pausing when the tab is hidden or
  after three minutes without interaction, so the figure reflects real study time
- **Weak areas** — modules whose average test score sits below the pass mark
- **Gamification** — XP, 11 badges, completion percentage, milestone messages

## Data management

Settings offers theme (light / dark / system), a daily study goal, JSON export and import of
progress, and a confirmed reset.

## Content totals

24 modules · 24 lessons · 96 rule blocks · 120 worked examples · 121 common mistakes ·
96 practice questions · 240 test questions.
