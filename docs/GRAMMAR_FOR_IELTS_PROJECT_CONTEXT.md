# Grammar for IELTS — Full Project Context & Development Plan

> **Purpose of this document**
>
> This file is the context handoff for any AI assistant, coding agent, or developer who continues the **Grammar for IELTS** project.
>
> Read this document before making architectural or code changes. Treat it as the current project context and preserve the existing frontend unless a task explicitly requires a change.

---

## 1. Project Identity

### Product name

**Grammar for IELTS**

Current production/frontend domain:

`https://grammar-for-ielts.vercel.app/`

The project should continue using **Grammar for IELTS** as the main product/brand name.

### Product positioning

This is **not intended to become another generic "all-in-one IELTS preparation website."**

The core positioning is:

> **A dedicated grammar-first learning platform for IELTS candidates.**

The long-term product may cover Writing, Reading, Listening, Speaking, vocabulary, AI tools, and other IELTS resources, but grammar remains the main identity and differentiator.

The product should help a learner move through:

```text
Learn grammar
      ↓
Practice
      ↓
Identify mistakes
      ↓
Improve IELTS grammar
      ↓
Improve Writing/Speaking performance
      ↓
Track progress
      ↓
Use personalized/AI features
      ↓
Upgrade to premium features
```

---

# 2. Current Product Situation

The project started as a **100% frontend-only React application**.

Current frontend stack:

- React 19
- TypeScript
- Vite
- React Router
- Tailwind/design system
- PWA/service worker
- Build-time prerendering/SEO
- LocalStorage-based learner state
- Static TypeScript content

The existing app is already a functioning learning product. The goal is **not to rewrite it**.

The migration strategy is:

```text
Existing React application
        ↓
Frontend architecture cleanup
        ↓
Backend-ready abstractions
        ↓
MERN backend
        ↓
Cloud accounts/progress/content
        ↓
Admin/CMS
        ↓
AI backend
        ↓
Premium/subscriptions
```

---

# 3. Important Architecture Decision

## Backend stack decision

The backend decision changed during planning.

### OLD DECISION — DO NOT USE

- Django
- Django REST Framework
- PostgreSQL

That decision has been replaced.

### CURRENT DECISION — USE MERN

The future backend will use:

```text
MongoDB
Express.js
React
Node.js
```

The frontend is already React, so the final architecture will be:

```text
React + TypeScript + Vite
          │
          │ HTTPS / REST API
          ▼
Node.js + Express.js
          │
          ▼
MongoDB
```

Potentially:

```text
React
  ↓
Express API
  ├── Auth
  ├── User/profile APIs
  ├── Progress APIs
  ├── Grammar/content APIs
  ├── Practice/test APIs
  ├── Admin APIs
  ├── AI APIs
  └── Payment/webhook APIs
          ↓
       MongoDB
```

### Do NOT introduce

Do not introduce:

- Django
- DRF
- Firebase as the primary backend architecture
- Supabase client APIs as the application backend
- Node alternatives such as Hono/Fastify unless explicitly reconsidered
- a second frontend framework
- a full frontend rewrite

The project should remain **React + Node + Express + MongoDB**.

---

# 4. Database Cost Requirement

A major project requirement is to use **free-tier/free-source infrastructure where practical**, especially during development and early MVP operation.

The database target is MongoDB.

The exact MongoDB hosting/provider should be selected during the backend phase based on the available free tier, limits, reliability, and suitability at that time.

Do not assume paid infrastructure is required.

Cost-control principle:

```text
Use free tier first
       ↓
Measure real usage
       ↓
Pay only when product usage requires it
```

Avoid adding paid services prematurely.

---

# 5. Current Frontend Architecture

The project currently contains roughly:

- 24 grammar modules/topics
- 24 English lessons
- 24 Bangla lessons
- 336 practice/test questions
- 7 blog articles
- public grammar topic pages
- public blog pages
- practice/test features
- dashboard/progress
- bookmarks
- offline/PWA
- bilingual English/Bangla support
- AI practice

Content is currently still static TypeScript.

The previous audit found approximately 21,800 lines of TypeScript, with roughly 11,000 lines being content data.

The important point is that the content is already typed and structured, which makes future migration to MongoDB feasible without rewriting the UI renderers.

---

# 6. Current Folder/Architecture Concept

The existing application roughly follows this structure:

```text
grammar-path/
│
├── index.html
├── vercel.json
├── vite.config.ts
├── tailwind.config.js
│
├── scripts/
│   ├── postbuild.mjs
│   └── sw-template.js
│
├── public/
│   ├── icons
│   ├── manifest
│   ├── blog covers
│   └── OG images
│
├── docs/
│
└── src/
    ├── main.tsx
    ├── entry-server.tsx
    │
    ├── app/
    │   ├── App.tsx
    │   └── LearnRedirect.tsx
    │
    ├── config/
    │   └── site.ts
    │
    ├── types/
    │   └── index.ts
    │
    ├── content/
    │   ├── catalog.ts
    │   └── paths.ts
    │
    ├── data/
    │   ├── modules.ts
    │   ├── modulesEn.ts
    │   ├── grammarTopics.ts
    │   ├── lessons/
    │   ├── questions/
    │   └── blog/
    │
    ├── services/
    │   ├── content/
    │   └── progress/
    │
    ├── repositories/
    │
    ├── seo/
    │
    ├── offline/
    │
    ├── hooks/
    │
    ├── utils/
    │
    ├── components/
    │
    └── pages/
```

---

# 7. What Has Already Been Built in Phase 0

Phase 0 is a **frontend groundwork phase**.

Its purpose is to prepare the existing frontend to connect to a future backend without changing the product unnecessarily.

Phase 0 has already implemented and verified a substantial amount.

## 7.1 Progress schema versioning

Current progress data has:

```text
schemaVersion
```

Migration exists from old/unversioned state to version 1.

The migration system:

- preserves valid existing data
- repairs malformed fields where possible
- preserves unknown fields from newer versions
- keeps a backup before migration
- avoids silently resetting valid learner data

Important storage keys must remain stable:

```text
grammar-path:progress
grammar-path:preferences
grammar-path:bookmarks
```

Do not rename these without a migration plan.

---

# 8. Progress Backup/Import/Export

The application now has validated backup/import/export.

Export format is conceptually:

```json
{
  "format": "...",
  "schemaVersion": 1,
  "exportedAt": "...",
  "state": {},
  "preferences": {}
}
```

Legacy exports are still supported.

Malformed/invalid imports should not partially overwrite user data.

---

# 9. Repository Architecture

The frontend now contains repository abstractions.

Examples:

```text
ProgressRepository
BookmarkRepository
```

Current implementation:

```text
React
  ↓
Repository interface
  ↓
LocalStorage implementation
```

This is intentional.

Later:

```text
React
  ↓
Repository interface
  ↓
Local/cloud-sync implementation
  ↓
Express API
  ↓
MongoDB
```

The React components should not need to know whether data is stored locally or remotely.

This is one of the most important architectural decisions in the migration.

---

# 10. ContentService Architecture

A `ContentService` abstraction now exists.

Conceptually:

```text
React page/component
        ↓
ContentService
        ↓
StaticContentService
        ↓
TypeScript content
```

Later:

```text
React page/component
        ↓
ContentService
        ↓
API implementation
        ↓
Express
        ↓
MongoDB
```

This allows the frontend components to remain mostly unchanged when content moves from static files to MongoDB.

The ContentService includes operations conceptually like:

```text
getModules()
getModule(slug)
getLesson(slug, locale)
getPracticeQuestions(slug)
getTestQuestions(slug)
getGrammarTopics()
getGrammarTopic(slug)
getBlogPosts()
getBlogPost(slug)
getStages()
```

The existing static implementation returns already-settled promises where necessary so build-time prerendering remains safe.

---

# 11. Content Bundle Splitting

Lessons and questions are large parts of the bundle.

The current architecture introduced:

```text
packs.ts
lessonPack.ts
questionPack.ts
```

A route that needs a lesson/question pack loads it.

Public pages that do not need lesson/question data should not accidentally load those large packs.

This solved a previous blog bundle regression.

Do not remove the bundle-splitting architecture casually.

---

# 12. Stable Module Identity

Originally many things depended on numeric module IDs.

That was dangerous because reordering content could break URLs/progress.

The current architecture provides:

```text
stable slug
+
legacy numeric ID
```

`resolveModule()` can resolve:

- numeric ID
- numeric string
- module slug
- topic slug

Numeric IDs are still retained because old progress data uses them.

Current canonical lesson URL remains:

```text
/module/:id
```

Stable slug routes are used for internal resolution and compatibility, but indexed URLs must not be changed casually.

---

# 13. `/learn` Routing

The stable slug work added:

```text
/learn/:slug
/learn/:slug/test
```

These resolve/redirect to the existing module routes.

They can accept:

- module slug
- topic slug
- numeric ID

Unknown references redirect to:

```text
/course
```

The canonical lesson address remains:

```text
/module/:id
```

The `/learn` URLs should not become new indexed/canonical URLs.

---

# 14. Current Public Routes

Important public routes include:

```text
/
 /grammar
 /grammar/:slug
 /blog
 /blog/:slug
 /practice
```

Workspace/private routes include:

```text
/dashboard
/course
/module/:id
/module/:id/test
/review
/progress
/settings
/bookmarks
```

`/learn/:slug` and `/learn/:slug/test` are compatibility/redirect routes.

Private learning routes should remain appropriately `noindex`.

Public SEO routes should remain crawlable.

---

# 15. SEO Architecture

The project already has a dedicated SEO system.

Important concepts:

```text
SEO metadata source
        ↓
Title
Description
Canonical
Robots
Open Graph
Twitter
JSON-LD
```

Public content is prerendered during the build.

Current build output historically has:

- 35 prerendered pages
- sitemap containing 36 URLs

The exact count should always be verified rather than assumed.

Important SEO requirements:

- unique title per public page
- unique description where appropriate
- canonical URLs
- correct robots metadata
- JSON-LD where appropriate
- internal links
- no fake FAQ/rating/review schema
- private pages noindex
- existing indexed `/grammar/:slug` and `/blog/:slug` URLs must not be changed casually

The current stable slug work intentionally preserves canonical `/module/:id` behavior.

---

# 16. Current PWA / Offline Architecture

The application already works as a PWA.

It has:

```text
manifest
service worker
Cache Storage
offline download
offline status
install support
```

The service worker caches static content/assets.

The offline experience currently supports:

- grammar lessons
- English/Bangla lessons
- practice
- tests
- blog content
- covers/images
- dashboard/progress
- bookmarks

AI is intentionally online-only.

Do not fake AI responses when offline.

Future authenticated/premium content must NOT simply be placed into shared public Cache Storage.

Future cloud sync will likely require:

```text
IndexedDB
+
offline mutation outbox
+
sync when online
```

but that is a later phase.

---

# 17. Current AI Architecture

Today, AI practice is still browser-side.

The learner provides their own Gemini key.

Conceptually:

```text
Browser
   ↓
Gemini API
```

The key is currently stored locally.

This is acceptable only for the current frontend-only stage.

It is NOT the final commercial architecture.

Future architecture:

```text
React
  ↓
Express API
  ↓
Authentication
  ↓
Rate limit / quota
  ↓
AI provider
  ↓
Response
```

The future backend should use a server-held provider key.

Potential future AI features:

- AI Grammar Coach
- Fix my sentence
- Explain my mistake
- Improve my sentence
- IELTS sentence improvement
- Writing Task 1 feedback
- Writing Task 2 feedback
- Speaking feedback
- personalized practice generation

Do not build those backend features until the backend phase begins.

---

# 18. Important Grading Fix Already Completed

A real pre-existing grading bug was found and fixed.

The old answer checker removed punctuation from all answer comparisons.

That was wrong for choice questions where punctuation is the actual difference.

The final behavior is:

### Choice questions

Examples:

- multiple choice
- choose-correct-sentence
- error correction

The selected option is compared exactly.

Punctuation matters.

### Typed questions

Examples:

- fill blank
- rewrite

Existing forgiving behavior remains:

- case normalization
- punctuation/spacing normalization
- acceptable alternatives

There is one narrow exception:

If the accepted answer consists only of punctuation, the punctuation is preserved for comparison.

A shared rule:

```text
isTypedQuestion()
```

is used by both the grader and `QuestionCard`.

This prevents the UI and grader from disagreeing about whether a question is typed or choice-based.

No question data was changed.

---

# 19. Automated Testing

The project now has a substantial automated test suite.

Latest confirmed status after the stable-slug work:

```text
Unit tests:
1,585 passed

Browser tests:
67 passed
```

Before the stable-slug work, the test suite had:

```text
1,567 unit tests
59 browser tests
```

The stable-slug work added additional coverage.

The test suite covers areas including:

- progress migration
- validation
- backup/import
- bookmark behaviour
- lesson parity
- question integrity
- SEO metadata
- slug stability
- ContentService
- answer grading
- hydration
- English/Bangla switching
- offline mode
- route redirects
- bookmark persistence

Playwright uses isolated browser contexts and blocks external network requests during tests so tests do not interact with real Gemini, visitor-counting, or external production resources.

Do not assume that every real-world deployment scenario has already been verified.

---

# 20. Known Testing Limitations

Some real-world situations have not necessarily been verified yet and must not be falsely claimed as tested.

Important remaining real-world checks may include:

- real Vercel deployment behavior
- two actual browser tabs syncing
- service-worker update after a new deployment
- offline Google Fonts
- real Gemini key/API interaction
- browsers other than Chrome
- current production hosting behavior

These should be verified before major production changes.

---

# 21. Current Known Pre-existing Issue

The following issue existed before Phase 0:

```text
LanguageChooser
reads document during render
```

This means `/module/:id` is not server-rendered in the same way as public prerendered pages.

It remains client-side.

This did not prevent the production build from passing.

Do not casually rewrite this unless explicitly required.

---

# 22. Phase 0 Current State

Phase 0 is **not yet considered completely closed until the final remaining work has been verified and committed.**

The stable slug work is complete and verified.

The remaining Phase 0 work, based on the latest confirmed status, is:

```text
1. Remaining direct content readers
2. Security headers
3. Final verification
4. CI
5. Final commit
```

The remaining direct content readers were identified in areas such as:

```text
PublicUi
Practice
GrammarIndex
Home
seo/meta.ts
```

The goal is to move them onto:

```text
content/catalog
ContentService
path helpers
```

without changing behavior.

---

# 23. Phase 0 Completion Criteria

Phase 0 is complete only when:

```text
[ ] All intended content consumers use the frontend abstractions
[ ] Stable slugs are verified
[ ] Progress migration is verified
[ ] Import/export is verified
[ ] Repository abstractions are verified
[ ] Answer grading is verified
[ ] SEO regression checks pass
[ ] PWA/offline regression checks pass
[ ] Security headers are implemented and verified
[ ] `npm run test:all` passes
[ ] CI is configured
[ ] Final Phase 0 commit exists
[ ] Working tree is clean
[ ] Final checkpoint is pushed
```

Do not start the backend until this is complete.

---

# 24. Phase 1 — MERN Backend

After Phase 0 is officially finished, start the backend.

Do not immediately build every backend feature.

First establish a clean backend foundation.

Target:

```text
backend/
├── package.json
├── src/
│   ├── config/
│   ├── app/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── middleware/
│   ├── validators/
│   ├── utils/
│   └── server.js / server.ts
└── tests/
```

Exact structure may differ after architectural review.

---

# 25. Phase 1A — Node + Express + MongoDB Foundation

First implement:

```text
Node.js
Express.js
MongoDB
```

Then:

```text
Environment configuration
Database connection
Express application
Error handling
Request validation
API routing
Health endpoint
Logging
CORS policy
Security middleware
```

Example initial endpoint:

```text
GET /api/health
```

Expected:

```json
{
  "status": "ok"
}
```

Do not implement payments or AI at this stage.

---

# 26. Phase 1B — Authentication

Then build:

```text
signup
login
logout
session/token handling
password reset
profile
```

The exact authentication library/strategy must be decided before implementation.

Possible architecture:

```text
React
  ↓
Express
  ↓
Auth service
  ↓
MongoDB
```

Authentication and authorization must be enforced by the backend, not merely by React route hiding.

---

# 27. Phase 1C — User Profiles

Profile data may eventually include:

```text
display name
avatar
target IELTS band
current level
exam date
language
timezone
daily study goal
preferences
```

Do not collect unnecessary personal data.

---

# 28. Phase 1D — Cloud Progress

Current:

```text
React
 ↓
localStorage
```

Future:

```text
React
 ↓
Repository
 ↓
Express API
 ↓
MongoDB
```

The important architectural principle is:

**local-first, cloud-sync later.**

The user should still be able to use the product anonymously/free where appropriate.

When signing in for the first time, existing local progress should be claimable/migrated to the account rather than discarded.

---

# 29. Phase 1E — Content API / CMS

Eventually move content from:

```text
TypeScript files
```

to:

```text
MongoDB
```

Likely entities:

```text
stages
modules
lessons
lesson translations
rules
examples
mistakes
questions
tests
blog posts
categories
tags
media
```

Do not blindly copy the frontend data model into MongoDB.

Design the database for:

- editing
- publishing
- localization
- stable slugs
- versioning
- relationships
- search
- future IELTS skill expansion

---

# 30. Localization Model

The existing app has English and Bangla.

Do not create two completely separate courses.

Prefer one content entity with localized fields/objects.

Conceptually:

```text
lesson
├── slug
├── english
│   ├── title
│   ├── explanation
│   └── notes
└── bangla
    ├── title
    ├── explanation
    └── notes
```

Shared examples that do not need translation should be stored once.

The frontend should choose the active locale.

---

# 31. Phase 1F — Admin/CMS

Eventually create:

```text
/admin
```

Admin capabilities should include:

```text
Users
Grammar modules
Lessons
Questions
Tests
Blog posts
Categories
Tags
IELTS tips
Media
Publishing
Drafts
```

Blog editor should support fields such as:

```text
title
slug
category
cover
English content
Bangla content
SEO title
SEO description
tags
publish status
publish date
```

Admin authorization must be enforced by the backend.

---

# 32. Phase 1G — Server-side AI

Future AI architecture:

```text
React
 ↓
Express
 ↓
Auth check
 ↓
Quota check
 ↓
AI service
 ↓
Gemini/other provider
 ↓
Validated response
 ↓
React
```

Store usage information so the system can support:

```text
free quota
premium quota
rate limiting
usage analytics
abuse prevention
```

Do not expose the company's AI provider key in browser code.

---

# 33. Phase 1H — Premium System

Monetization should come after real product value exists.

Potential free features:

```text
grammar lessons
basic practice
SEO blog
basic IELTS resources
limited AI
basic progress
```

Potential premium features:

```text
advanced practice
AI Grammar Coach
AI Writing Evaluation
personalized recommendations
advanced analytics
more AI usage
premium tests
premium content
```

The entitlement model should be backend-controlled.

Do not trust:

```text
localStorage
React state
URL parameters
```

for deciding who is premium.

---

# 34. Payments

Payment provider has not been permanently selected.

Selection should consider:

- Bangladesh merchant availability
- international payments
- recurring subscriptions
- fees
- webhook support
- settlement
- refunds
- tax/compliance requirements

The backend should receive a verified payment webhook and then update subscription/entitlement state.

Do not unlock premium features solely because the frontend received a "payment successful" message.

---

# 35. Future IELTS Expansion

After the grammar platform is stable, expand content:

```text
Grammar
Writing
Reading
Listening
Speaking
Vocabulary
```

But retain the core positioning:

> Grammar-first IELTS learning platform.

The product should not lose its differentiation by becoming another generic IELTS portal.

---

# 36. SEO Growth Strategy

Long-term acquisition should come from useful public content.

Example funnel:

```text
Google
  ↓
SEO article
  ↓
Grammar topic
  ↓
Lesson
  ↓
Practice
  ↓
Account
  ↓
Personalized learning
  ↓
Premium
```

Potential content areas:

```text
IELTS grammar rules
IELTS grammar practice
grammar for IELTS writing
IELTS articles
IELTS tenses
IELTS conditionals
IELTS complex sentences
IELTS grammar mistakes
grammar for band 7
IELTS punctuation
sentence structures
```

Do not use keyword stuffing.

Content must be genuinely useful.

---

# 37. Commercial Product Vision

The eventual product should feel like:

```text
FREE SEO CONTENT
        ↓
DISCOVERABILITY
        ↓
ACCOUNT
        ↓
PERSONALIZED LEARNING
        ↓
AI/ADVANCED PRACTICE
        ↓
PREMIUM
```

Do not build the monetization system before there is sufficient premium value.

---

# 38. Important Rules for Future AI Assistants

Any AI agent working on this repository should follow these rules.

## Rule 1 — Do not rewrite the application unnecessarily

The existing frontend is already functional.

Prefer:

```text
refactor
adapter
repository
service
migration
```

over:

```text
rewrite
replace everything
new framework
```

---

## Rule 2 — Preserve indexed URLs

Never casually change:

```text
/grammar/:slug
/blog/:slug
```

These are SEO assets.

---

## Rule 3 — Preserve local data compatibility

Do not rename:

```text
grammar-path:progress
grammar-path:preferences
grammar-path:bookmarks
```

without explicit migration planning.

---

## Rule 4 — Do not break offline support

Any content/API migration must consider:

```text
offline cache
offline reads
offline writes
sync
service-worker versioning
```

---

## Rule 5 — Do not introduce the backend during Phase 0

Phase 0 is frontend groundwork only.

The backend begins only after Phase 0 completion.

---

## Rule 6 — Backend must be MERN

Future backend:

```text
MongoDB
Express
React
Node
```

Do not switch back to Django/DRF unless the architecture is intentionally reconsidered.

---

## Rule 7 — Do not claim tests passed unless they actually ran

When reporting:

```text
Build: pass
Tests: pass
```

there must be an actual command/result supporting it.

---

## Rule 8 — Keep public SEO pages fast and indexable

Avoid introducing API loading that causes public pages to render only a loading skeleton at build time.

---

## Rule 9 — Keep ContentService/Repository abstractions

These abstractions are specifically intended to make the future backend migration easier.

---

## Rule 10 — Prefer incremental migration

Desired pattern:

```text
Static adapter
      ↓
Backend adapter
```

not:

```text
Delete everything
      ↓
Rewrite everything
```

---

# 39. What NOT to Build All at Once

Do not simultaneously implement:

- authentication
- database
- admin
- CMS
- payments
- AI
- writing evaluation
- four IELTS skills
- analytics
- notifications

Instead:

```text
Phase 0
Frontend groundwork

Phase 1
MERN foundation

Phase 2
Auth + profiles

Phase 3
Progress sync

Phase 4
Content API + CMS

Phase 5
Admin

Phase 6
AI

Phase 7
Premium/payment

Phase 8
IELTS skill expansion
```

---

# 40. Current Confirmed Development Position

### Confirmed completed/verified

- React frontend remains functional
- progress schema migration
- progress backup/import validation
- repository abstraction
- ContentService foundation
- content bundle splitting
- stable module identity
- stable slug routing
- grading fix
- extensive automated unit testing
- Playwright browser testing
- SEO/prerender regression protection
- PWA/offline regression coverage

### Latest confirmed test counts after stable slug work

```text
Unit tests:      1,585 passed
Browser tests:      67 passed
Lint:               0 errors
Type check:         pass
Build:              pass
```

### Important status caveat

The latest *confirmed* status provided in the project conversation was that stable-slug work was complete and ready for commit/review, with these remaining Phase 0 items:

```text
1. Remaining direct content readers
2. Security headers
3. Final verification
4. CI
5. Final Phase 0 commit/push
```

A later instruction was prepared to complete all of those in one prompt, but this document should **not assume that work completed successfully until a fresh status report confirms it**.

---

# 41. Immediate Next Actions

If Phase 0 has NOT yet been confirmed complete:

```text
1. Finish remaining direct content readers
2. Implement security headers
3. Run final full verification
4. Add CI
5. Commit final Phase 0
6. Push final Phase 0 checkpoint
```

Then begin Phase 1.

If Phase 0 HAS already been confirmed complete:

```text
START PHASE 1
```

with:

```text
Node.js
Express.js
MongoDB
REST API
```

---

# 42. Phase 1 First Prompt Concept

The first backend task should NOT be "build the entire backend."

It should be:

```text
Create the MERN backend foundation only.

- Node.js
- Express
- MongoDB connection
- environment configuration
- API structure
- health endpoint
- centralized error handling
- request validation foundation
- CORS configuration
- security middleware
- development scripts
- test foundation

Do not implement:
- authentication
- users
- payments
- CMS
- AI
- subscriptions
- admin
```

Only after that should authentication begin.

---

# 43. Final Target Architecture

Eventually the complete product should look conceptually like this:

```text
                        GOOGLE / PUBLIC USERS
                                  │
                                  ▼
                         ┌─────────────────┐
                         │ PUBLIC WEBSITE  │
                         │ SEO + CONTENT   │
                         └────────┬────────┘
                                  │
                                  ▼
                             REACT APP
                                  │
                         HTTPS REST API
                                  │
                                  ▼
                      ┌───────────────────────┐
                      │   EXPRESS + NODE.JS  │
                      │                       │
                      │ Auth                  │
                      │ Users                 │
                      │ Progress              │
                      │ Content               │
                      │ Practice              │
                      │ AI                    │
                      │ Payments              │
                      │ Admin                 │
                      └───────────┬───────────┘
                                  │
                                  ▼
                            ┌────────────┐
                            │  MONGODB   │
                            └────────────┘
```

With local-first/offline support:

```text
                     REACT
                       │
              ┌────────┴────────┐
              ▼                 ▼
         LOCAL CACHE          EXPRESS API
              │                 │
              │                 ▼
              │              MONGODB
              │
              ▼
          OFFLINE MODE
```

And eventually:

```text
USER
 │
 ├── Grammar
 ├── Practice
 ├── IELTS skills
 ├── Progress
 ├── Mistakes
 ├── Bookmarks
 ├── AI
 └── Subscription
```

while:

```text
ADMIN
 │
 ├── Users
 ├── Grammar
 ├── Lessons
 ├── Questions
 ├── Blog
 ├── IELTS tips
 ├── AI
 ├── Media
 └── Subscriptions
```

---

# 44. Bottom Line

The project is **not being rebuilt from scratch**.

The strategy is:

```text
CURRENT
React + static content + localStorage + PWA + SEO
        │
        ▼
PHASE 0
Architecture safety + repositories + services + tests
        │
        ▼
PHASE 1
Node + Express + MongoDB
        │
        ▼
PHASE 2
Accounts + profiles
        │
        ▼
PHASE 3
Cloud sync
        │
        ▼
PHASE 4
Database content + CMS
        │
        ▼
PHASE 5
Admin
        │
        ▼
PHASE 6
AI backend
        │
        ▼
PHASE 7
Premium + payments
        │
        ▼
PHASE 8
Full IELTS skill expansion
```

The core principle is:

> **Preserve the working product, create clean boundaries, migrate one domain at a time, and never sacrifice the existing SEO, bilingual content, or offline experience while introducing the backend.**
