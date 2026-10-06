# Grammar for IELTS — Platform Architecture Audit

_Audit date: 2026-10-04 · Repository state: commit `f8b17b9` ("seo") · Scope: read-only review; no code was changed._

This document describes how the application works today and what has to change to turn it into a
commercial platform with accounts, cloud sync, a CMS, an admin dashboard, subscriptions and
server-side AI. It is meant for whoever plans and builds that migration.

---

## Executive summary

The app is a well-structured **frontend-only React 19 + TypeScript + Vite** application. All
content (24 bilingual grammar lessons, 336 questions, 7 blog articles) is compiled into the
JavaScript bundle as typed TypeScript objects. All learner data lives in `localStorage`. Public pages
are prerendered to static HTML at build time; a hand-written service worker provides offline mode.

What is in good shape and should be kept:

- A clean, typed **domain model** (`src/types/index.ts`) and strict data/UI separation. Lessons and
  questions are pure data, so they can move to a database almost one-to-one.
- A single **SEO source of truth** (`src/seo/meta.ts`) and a working build-time prerender pipeline.
- A **UI kit** (`components/ui/*`) and lesson renderers that are already data-driven.
- A working, tested **offline system** (Cache Storage + service worker).

The main obstacles to a full-stack platform:

1. **Content is code.** Editing a lesson, question or article requires a developer, a commit and a
   redeploy. A CMS needs content in a database or headless CMS.
2. **Progress is a single `localStorage` blob** with numeric module ids as keys, no user id, no
   version field, no timestamps per field, and no conflict handling. This must be restructured before
   it can be synced.
3. **The answer key ships to the browser.** Every test answer is in the JS bundle and scoring
   happens on the client. That is fine for a free self-study app, but not for premium tests or
   anything with certificates or leaderboards.
4. **AI calls go directly from the browser to Gemini using the learner's own key.** A commercial
   product needs a server-side AI proxy with the company's key, quotas and abuse protection.
5. **Prerendering depends on content being available at build time.** With a CMS, publishing must
   trigger a rebuild, or rendering must move to a framework with incremental/server rendering.

None of these need a rewrite. Each can be addressed behind the existing interfaces, in the order
given at the end of this document.

---

## 1. Current folder structure

```
grammar-path/
├── index.html                 HTML template (inline theme script, SEO markers, font links)
├── vercel.json                cleanUrls + SPA rewrite to /app.html + cache headers
├── vite.config.ts             '@' alias, React plugin
├── tailwind.config.js         design tokens: ink (navy/slate), brand (blue), accent (cyan)
├── scripts/
│   ├── postbuild.mjs          prerender, sitemap.xml, robots.txt, offline manifest, sw.js
│   └── sw-template.js         service worker source (placeholders filled at build)
├── public/                    static assets: icons, manifest, blog covers, OG images
├── docs/                      (this audit)
└── src/
    ├── main.tsx               client entry: hydrateRoot vs createRoot, SW registration
    ├── entry-server.tsx       build-time SSR entry (prerenderToNodeStream + StaticRouter)
    ├── app/App.tsx            route table, ProgressProvider, SeoManager
    ├── config/site.ts         SITE_URL / SITE_NAME (VITE_SITE_URL override)
    ├── types/index.ts         domain types (modules, lessons, questions, progress)
    ├── data/
    │   ├── modules.ts         24 modules + 5 stages (Bangla summaries)
    │   ├── modulesEn.ts       English module summaries / IELTS notes / stage text
    │   ├── grammarTopics.ts   public slugs → module ids, related topics
    │   ├── lessons/           Bangla lessons stage1-5.ts + en/stage1-5.ts (English)
    │   ├── questions/         practice + test questions stage1-5.ts
    │   └── blog/              posts.ts (metadata) + articles.ts (block content)
    ├── seo/                   meta.ts (page metadata, JSON-LD, route list) + SeoManager
    ├── offline/offline.ts     Offline Mode download, install prompt
    ├── hooks/                 progress, language, bookmarks, online status, AI, timer...
    ├── utils/                 storage, progression, stats, badges, answers, aiPractice, i18n
    ├── components/
    │   ├── ui/                design-system primitives (Button, Card, Badge, Reveal...)
    │   ├── lesson/            lesson renderers, QuestionCard, AI panel, language switch
    │   ├── public/            public layout, cards, motion helpers
    │   ├── dashboard/         dashboard widgets
    │   └── Layout.tsx         workspace (sidebar) layout
    └── pages/                 workspace pages + pages/public/* (marketing, grammar, blog)
```

Size: ~21,800 lines of TypeScript, of which roughly **11,000 lines are content data**
(`data/lessons`, `data/lessons/en`, `data/questions`, `data/blog`).

**Observations**

- Clear separation between workspace (`pages/*`, `Layout.tsx`) and public site (`pages/public/*`,
  `components/public/*`). Keep it: it maps naturally onto "app" vs "marketing" deployments later.
- There is no `services/` or `api/` layer. Components and hooks call `localStorage` helpers and the
  static data modules directly. **This is the most important seam to introduce before a backend.**
- There are no automated tests in the repository. Verification so far has been done with
  out-of-repo browser scripts.

## 2. Current routing architecture

- **React Router v7** (`react-router-dom`) with `BrowserRouter` on the client and `StaticRouter` in
  the build-time renderer. The route table is in `src/app/App.tsx`.
- Two layout routes:
  - `PublicLayout` (top nav + footer): `/`, `/grammar`, `/grammar/:slug`, `/blog`, `/blog/:slug`,
    `/practice`.
  - `Workspace` (sidebar `Layout`): `/dashboard`, `/course`, `/module/:id`, `/module/:id/test`,
    `/review`, `/progress`, `/settings`, `/bookmarks`.
- Catch-all `*` redirects to `/` on the client (soft 404; HTTP status is still 200).
- All pages except `Home` are `React.lazy` chunks.
- **Hosting:** `vercel.json` uses `cleanUrls` so `/grammar/articles` is served from the prerendered
  `grammar/articles.html`. Every other path is rewritten to `app.html` (an empty shell).

**Implications for the platform**

- There is no route-guard concept. Auth-protected and premium routes need a `RequireAuth` /
  `RequirePlan` wrapper (see section 17).
- Module routes use **numeric ids** (`/module/3`). Content reordering in a CMS would change URLs and
  break saved progress. Prefer stable slugs (`/learn/articles-and-determiners`).
- There is no `404`/`410` page; unknown slugs are client redirects. Search engines may treat them
  as soft-404s. Proper status codes need a server or edge function.

## 3. Current state management

There is no global store library. State is held in four places:

| Concern | Mechanism | File |
| --- | --- | --- |
| Progress + preferences | React Context over `useLocalStorage` | `hooks/useProgress.tsx` |
| Lesson language | module-level store + `useSyncExternalStore` | `hooks/useLessonLanguage.ts` |
| Bookmarks | module-level store + `useSyncExternalStore` | `hooks/useBookmarks.ts` |
| Offline Mode, install prompt | module-level store + `useSyncExternalStore` | `offline/offline.ts` |
| Online status | `useSyncExternalStore` on `online`/`offline` events | `hooks/useOnlineStatus.ts` |
| AI practice session | component state + `sessionStorage` | `hooks/useAiPractice.ts` |
| Hydration gate | `useSyncExternalStore` server snapshot | `hooks/useHydrated.ts` |

`ProgressProvider` exposes command-style mutations (`recordTest`, `markLessonViewed`,
`addStudyMinutes`...). **That is a good shape for a backend**: each mutation can become an API call
or a queued sync operation without changing callers.

**Weak points**

- Whole-object writes: every mutation rewrites the entire `ProgressState` blob. Two tabs writing at
  once → last writer wins. Fine locally, but it becomes data loss once the same blob is synced from
  several devices.
- Derived data is mixed into stored data. `xp`, `badges` and `modules[].completed` are stored
  rather than derived from attempts, so they can drift from the attempt history.
- There is no server-state cache layer. Server data will need one (for example TanStack Query),
  rather than more React Context.

## 4. Current localStorage / IndexedDB usage

**IndexedDB is not used.** All persistent data is in `localStorage` under the `grammar-path:` prefix
(`utils/storage.ts`):

| Key | Content | Notes |
| --- | --- | --- |
| `grammar-path:progress` | `ProgressState` (modules map, attempts[], activity by day, badges, xp, startedAt) | Grows without bound (attempts, daily activity). No schema version. |
| `grammar-path:preferences` | theme, daily goal, hints | Read by the inline script in `index.html` before React. |
| `grammar-path:lessonLanguage` | `"en"` / `"bn"` | Absence triggers the first-run chooser. |
| `grammar-path:bookmarks` | `{kind, path, title, savedAt}[]` | Identified by URL path. |
| `grammar-path:offline` | `{ready, version, readyAt, files, bytes}` | Mirrors a marker in Cache Storage. |
| `grammar-path:geminiApiKey` | the learner's own Gemini API key, **plain text** | See security, section 19. |
| `grammar-path:ai-seen:<moduleId>` | last 30 AI question stems | Used to avoid repeats. |
| `grammar-path:visitor-counted` | `"1"` | Visitor counter de-duplication. |
| `gfi:debug` | flag | Enables hydration diagnostics. |
| sessionStorage `grammar-path:ai-set:<moduleId>` | current AI question set | Per tab. |
| sessionStorage `gfi:reloaded` | flag | Prevents chunk-error reload loops. |

**Cache Storage** (service worker): `gfi-precache-<version>`, `gfi-runtime`, `gfi-fonts`, `gfi-meta`
(the `/__offline-enabled` marker).

**Recommendations**

- Add a `schemaVersion` to the progress blob now. It is cheap, and it makes the later migration
  safe.
- When sync arrives, move learner data to **IndexedDB**: an outbox of pending mutations plus a
  local cache of server data. `localStorage` is synchronous, capped at about 5 MB, and not
  available to service workers.

## 5. Current authentication assumptions

- **There is no authentication.** The code assumes one anonymous learner per browser profile.
- Nothing has a user id. Progress, bookmarks and preferences have no owner field.
- Settings offers **JSON export/import** of progress. That is the only portability mechanism, and
  its validation is minimal (it only checks that `state.modules` exists).
- Visitor counting uses an external service (Abacus) keyed per browser, unrelated to identity.

**Implications**

- The first sign-in must offer to **claim local progress** into the new account (one-time merge).
- The app should keep working anonymously, as a free tier, with sign-in as an upgrade path. That
  protects SEO, the offline experience and today's users.

## 6. Current content architecture

All content is TypeScript modules compiled into the bundle:

| Content | Location | Format | Size |
| --- | --- | --- | --- |
| Stages, module metadata | `data/modules.ts` (+ English text in `modulesEn.ts`) | typed objects | 5 stages, 24 modules |
| Lessons | `data/lessons/stage*.ts` (Bangla) + `data/lessons/en/stage*.ts` (English) | `Lesson` objects | 2 × 24 lessons |
| Questions | `data/questions/stage*.ts` | `Question[]` | 96 practice + 240 test |
| Public grammar topics | `data/grammarTopics.ts` | slug ↔ moduleId map, English description, related slugs | 24 |
| Blog | `data/blog/posts.ts` (meta) + `articles.ts` (bodies) | block arrays with `[label](/path)` links | 7 articles |
| Blog covers | `public/blog/covers/*` | WebP 800/1600 + OG JPG, rendered once from HTML | 8 sets |
| UI copy | inline in components | mostly English; some Bangla strings in `utils/i18n.ts` | — |

**Assessment**

- The data is well typed and consistent: a parity check confirmed English and Bangla lessons share
  identical rule ids, example sentences and item counts.
- **Localisation is split three ways.** Bangla lives in the base objects, English in parallel
  files keyed by id (`lessons/en/*`, `modulesEn.ts`), and UI labels in `i18n.ts`. A CMS should hold
  translations as fields of one entity (`content_translations` or JSON locale columns), not as
  parallel trees.
- Questions and their explanations exist **only in Bangla**. There is no English explanation field.
- Public grammar topics are a second, hand-maintained catalogue (`grammarTopics.ts`) pointing at
  modules by numeric id. In a CMS, *topic* and *course module* should be one entity, or explicitly
  linked.
- Blog bodies use a custom block format. That maps well to a CMS with structured rich text
  (Portable Text, or JSON blocks in Postgres). Raw HTML/Markdown would lose that structure.

## 7. Current grammar lesson data structure

`src/types/index.ts`:

```ts
ModuleMeta { id: number; slug; title; stage: 1..5; difficulty; summary;
             estimatedMinutes; topics: string[];
             ielts: { importance; priority; note } }

Lesson     { moduleId: number; intro; rules: RuleBlock[]; examples: ExamplePair[];
             mistakes: CommonMistake[]; keyTakeaways: string[] }

RuleBlock  { id: 'm3-r2'; heading; rule; whenToUse; structure: string[];
             notes?: string[]; table?: { caption?, headers[], rows[][] };
             examples?: ExamplePair[] }

ExamplePair   { wrong?; right; note? }
CommonMistake { wrong; right; explanation }
```

- Localised text is selected by `getLesson(moduleId, 'en' | 'bn')` (two arrays), and module text
  by `localizeModule()` in `utils/i18n.ts`.
- **Strengths:** structured (not free HTML), so lessons render consistently and can be validated.
  `RuleBlock.id` is already stable.
- **Gaps for a platform:**
  - no `status` (draft or published), no `version`, no `updatedAt`, no author;
  - no premium/free flag;
  - no media fields (images, audio for Speaking/Listening);
  - English example sentences are duplicated in both language trees. In a database they should
    be stored once, with only explanations translated.
  - The unlock rule ("module N needs module N−1 passed") is hard-coded in
    `utils/progression.ts`, not data-driven.

## 8. Current blog data structure

```ts
BlogPostMeta { slug; title; excerpt; coverAlt; category: 'Grammar Tips' | 'IELTS Writing' |
               'Task 1' | 'Task 2' | 'Study Strategy'; date: 'YYYY-MM-DD';
               readingMinutes (derived from body); featured?; topics: string[] /* grammar slugs */ }

BlogBlock = { type: 'p' | 'h2'; text }      // text supports [label](/path) links
          | { type: 'list'; items[]; ordered? }
          | { type: 'example'; wrong; right; note? }
          | { type: 'tip'; title?; text }
```

- Covers are resolved by convention (`/blog/covers/<slug>-800.webp`), with a fallback set.
- Categories are a TypeScript union, so adding one needs a code change.
- Related posts are computed from category and shared topics (`relatedPosts()`).
- Missing for a CMS: author, updatedAt, status, scheduled publish, SEO overrides (meta title and
  description), tags separate from grammar topics, and Bangla versions of articles.

## 9. Current practice / test data structure

```ts
Question { id; moduleId; type: 'multiple-choice' | 'fill-blank' | 'choose-correct-sentence'
           | 'error-correction' | 'rewrite'; question; prompt?; options?; answer;
           acceptable?: string[]; explanation /* Bangla */;
           source?: 'ai' | 'static'; level?; context? }
```

- Practice questions (4 per module) and test questions (10 per module) are separate arrays,
  selected by `getPracticeQuestions` / `getTestQuestions`.
- Scoring is client-side (`utils/answers.ts`: normalised string comparison against `answer` and
  `acceptable`). The pass mark is 80% (`PASS_THRESHOLD`).
- Each test is the same fixed 10 questions in the same order. There is no question pool,
  randomisation or attempt token.
- A recorded attempt stores `{moduleId, at, score, total, percentage, passed}`. Per-question
  answers are **not** persisted, so there is no item-level analytics and no mistake review.
- **For a commercial platform:** answers must not be in the client bundle for graded or premium
  tests. Grading moves to the server, and attempts should store per-item responses (needed for weak
  areas, analytics and AI feedback).

## 10. Current AI integration

- **Feature:** "AI Practice Questions" in each lesson (`components/lesson/AiPracticePanel.tsx`,
  `hooks/useAiPractice.ts`, `utils/aiPractice.ts`).
- **Flow:** the learner pastes their **own Gemini API key** in Settings. It is stored in
  `localStorage`. The browser calls `generativelanguage.googleapis.com` directly:
  1. `GET /models?key=…` to discover usable models (cached in sessionStorage);
  2. `POST /models/{model}:generateContent?key=…` with a prompt built from the lesson's rules and
     mistakes.
- The response is parsed and validated defensively: JSON fence stripping, option normalisation,
  answer-in-options checks, shuffling and de-duplication against recent stems.
- Online-only behaviour: all triggers are disabled offline, with a clear message. Nothing is faked.
- AI is **optional**: built-in questions are always available.

**Assessment**

- Good: no company secret is in the source, and the prompt engineering and output validation are
  solid. That code can move to a server mostly unchanged.
- Not commercially viable as-is: it needs every user to bring a key, the key is readable by any
  script on the origin, there are no quotas or usage tracking, prompts are visible and editable in
  the client, and the model choice is resolved per browser.
- Future AI features (essay scoring, grammar feedback) need **long-running, metered, logged**
  calls. That is a backend job.

## 11. Current PWA / offline architecture

- **Manifest** `public/manifest.webmanifest` (standalone, `start_url: /dashboard`, maskable icon,
  shortcuts). Chrome reports it installable.
- **Service worker:** `scripts/sw-template.js`, emitted as `dist/sw.js` with a content-hash
  `VERSION` and an app-shell list.
  - Install: precache the shell. If the learner enabled Offline Mode (marker in `gfi-meta`),
    re-download the full manifest so offline content survives deploys.
  - Navigations: network-first with a 6 s timeout, then the cached page. The `/dashboard` shell is
    served only after a full download; otherwise a static offline page.
  - Same-origin assets: cache-first into `gfi-runtime`. Google Fonts: cache-first into `gfi-fonts`.
    Other origins, including Gemini, are never intercepted.
  - Activate: delete old precaches and the runtime cache, `clients.claim()`, `skipWaiting()`.
- **Offline download:** `offline/offline.ts` fetches `offline-manifest.json` (about 96 files) plus
  font files into Cache Storage, with progress UI.
- **Tested:** refresh offline, both lesson languages, blog with covers, practice, a full test,
  progress, bookmarks, AI disabled, reconnection.

**Platform implications**

- Today offline works because *all* content is public and static. With premium content and auth:
  - premium HTML/JSON must not be cached for users who are not entitled to it, and must be cleared
    on sign-out;
  - authenticated API responses must never land in a shared cache. Keep per-user data in
    IndexedDB, not Cache Storage.
- Offline writes (test attempts, progress) will need a **sync outbox**: an IndexedDB queue,
  replayed with idempotency keys when back online. Background Sync where available.
- The precache list is generated from `dist/`. Once content comes from an API, the offline manifest
  must include API payloads (versioned content snapshots), not just HTML.

## 12. Current SEO / prerendering architecture

- `src/seo/meta.ts` is the single source of truth. It covers title, description, canonical,
  robots, Open Graph/Twitter and JSON-LD (WebSite, BreadcrumbList, Article), plus
  `indexableRoutes()`.
- **Build pipeline** (`npm run build`):
  1. `tsc -b`;
  2. client `vite build`;
  3. `vite build --ssr src/entry-server.tsx` into `dist-server/`;
  4. `scripts/postbuild.mjs`, which renders 35 public routes with React's static
     `prerenderToNodeStream` (after warming up lazy routes, with `progressiveChunkSize: Infinity`)
     into `dist/**.html`, injects head tags, and writes `app.html`, `sitemap.xml`, `robots.txt`,
     the offline manifest and `sw.js`.
- **Client:** `main.tsx` hydrates when `#root` has content, otherwise it renders.
  `<SeoManager>` keeps head tags in sync on client navigation. `useHydrated()` gates any
  `localStorage`- or query-dependent rendering so hydration matches.
- `/course` is in the sitemap but client-rendered. `/module/*` and private pages are `noindex`.
- `SITE_URL` comes from `VITE_SITE_URL`, defaulting to `https://grammar-for-ielts.vercel.app`.

**Assessment**

- Works well for build-time content. **It does not scale to a CMS** without one of the following:
  - **(a)** a deploy hook that rebuilds on publish (simplest; fine for tens to low hundreds of
    pages);
  - **(b)** moving public pages to a framework with incremental static regeneration or SSR
    (Next.js, Remix/React Router framework mode, or Astro for the marketing site).
- The hydration-safety rules (`useHydrated`) are easy to break. Any new component on a public page
  that reads `localStorage` during render will cause a mismatch. This must be documented and ideally
  linted.

## 13. Components that should be preserved

These are stable, data-driven and UI-only. Keep them as-is:

- **Design system:** `components/ui/*` (Button + `buttonClasses`, Card, Badge, ProgressBar,
  ProgressRing, Reveal, Skeleton, StatTile, EmptyState) and the Tailwind tokens.
- **Lesson rendering:** `LessonSections.tsx` (RuleCard, ExamplesSection, MistakesSection,
  TakeawaysSection), `IeltsRelevance`, `LanguageSwitch` (toggle + chooser), `QuestionCard`.
  They render props only, so they work unchanged with server data.
- **Public site:** `PublicLayout`, `PublicUi` (GrammarCard, BlogCard, PostCover, Breadcrumbs,
  RichText), `motion.tsx`, and all `pages/public/*` layouts.
- **Workspace shell:** `Layout.tsx`, dashboard widgets, `ModuleCard`, `PageHeader`.
- **Cross-cutting:** `ConnectionStatus`, `BookmarkButton`, `OfflineDownload`, `SeoManager`, and
  `utils/aiPractice.ts` validation logic (it moves server-side, but the logic is sound).
- **Domain types** in `types/index.ts`: extend them, do not replace them.

## 14. Components that should be refactored

| Area | Why | Refactor |
| --- | --- | --- |
| `hooks/useProgress.tsx` | Whole-blob localStorage writes; derived fields stored; no user/version | Put a `ProgressRepository` interface behind the provider (local implementation now, remote later); store events (attempts, lesson views), derive XP/badges/completion |
| `data/*` access (`getLesson`, `getPracticeQuestions`, `MODULES` imports in 22 files) | Components import static arrays directly | Introduce a `contentService` with async functions (`getModule(slug)`, `getLesson(slug, locale)`...) and migrate callers; keep the static implementation as the first adapter |
| `utils/i18n.ts`, `modulesEn.ts`, `lessons/en/*` | Three translation mechanisms | Unify into a locale-aware content model (one entity, per-locale fields) |
| `grammarTopics.ts` ↔ `modules.ts` | Two catalogues joined by numeric id | One `topic/module` entity with stable slug; numeric order becomes a field |
| `useAiPractice` / `aiPractice.ts` | Browser-side calls with the user's key | Call a server `/ai/practice` endpoint; keep the hook's interface |
| `pages/Test.tsx` + `utils/answers.ts` | Client-side grading with bundled answers | Server-graded attempts for premium/graded tests; keep local grading for free practice |
| `pages/Settings.tsx` import/export | Weak validation (`state.modules` check only) | Schema validation (e.g. zod) + becomes "claim local data" on sign-in |
| `utils/visitorCount.ts` | Third-party counter (Abacus), public namespace, easy to inflate | Replace with your own analytics/metrics endpoint |
| `hooks/useBookmarks.ts` | Path strings as ids | Store `{contentType, contentId}`; sync |
| `scripts/postbuild.mjs` | Reads static data via the SSR bundle | Fetch published content from the API/CMS at build, or retire in favour of framework SSG/ISR |
| Copy | UI strings hard-coded in English across components | Adopt an i18n library (e.g. i18next or Lingui) before adding Bangla UI chrome |

## 15. Code that should eventually move to the backend

- **AI generation and feedback.** All of `utils/aiPractice.ts` (prompt building, model resolution,
  output validation), behind authenticated, rate-limited endpoints using a server-held key.
- **Test grading** for graded/premium tests (`scoreAnswers`, `PASS_THRESHOLD`), plus storage of
  per-item responses.
- **Progression rules and rewards.** Unlocking, XP and badge awarding (`utils/progression.ts`,
  `utils/badges.ts`, `recordTest` logic). Otherwise users can grant themselves any achievement by
  editing `localStorage`. Note that this matters only once these have value (premium,
  certificates, leaderboards).
- **Entitlements.** Free vs premium checks, enforced server-side. The client only hides UI.
- **Content storage and publishing.** Lessons, questions, topics, blog posts and media.
- **Sitemap generation**, from published content.
- **Analytics and visitor counting.**
- **Email.** Verification, password reset, receipts.

Keep client-side: rendering, offline cache, free-practice grading, optimistic progress updates
(reconciled with the server), and UI preferences such as theme.

## 16. Duplicated or fragile architecture

1. **Hydration contract.** Public components must not read `localStorage`, `window` or the URL
   query during render. Today this is enforced by convention (`useHydrated`, server snapshots).
   One careless component causes React to discard the prerendered DOM. *Mitigation:* a lint rule
   or a test that prerenders and hydrates each public route with debug enabled (the
   `gfi:debug` flag already exists).
2. **Content duplication.** English example sentences duplicated across language trees. Module
   summaries in two files. Topic descriptions separate from module summaries.
3. **Numeric module ids as identity.** These are progress keys, URLs (`/module/3`), and the links
   from grammar topics and bookmarks. Reordering the course would corrupt progress.
4. **Two prerender passes per route.** A warm-up render is needed to resolve `React.lazy`, and
   `progressiveChunkSize: Infinity` is required. Both are subtle; upgrading React could change
   behaviour. Covered by build-time assertions in `postbuild.mjs` (no H1, a loading fallback, or
   noindex metadata fails the build).
5. **Service-worker coupling to hosting.** The offline shell is fetched via `/dashboard` and relies
   on Vercel's rewrite. `cleanUrls` behaviour was emulated locally, not verified on Vercel.
6. **Cache-first runtime assets** depend on activate-time clearing. A deploy while a tab is open
   relies on the `vite:preloadError` reload (once per session).
7. **Unbounded local growth.** `attempts[]` and `activity{}` grow forever.
8. **Store pattern repeated three times** (`useLessonLanguage`, `useBookmarks`, `offline.ts`):
   each re-implements a localStorage-backed external store. A small shared helper would reduce
   bugs.
9. **No automated tests in the repo.** Lesson parity, offline and SEO checks were run ad hoc.
10. **Branding inconsistency.** The dashboard heading and the export filename say "Grammar Path";
    the public site says "Grammar for IELTS".

## 17. Recommended migration strategy (frontend-only → full-stack)

**Guiding principles**

- *Strangler pattern.* Introduce interfaces in the frontend first (repositories and services),
  ship them with the existing local implementations, then swap in remote implementations one
  domain at a time.
- *Anonymous-first.* Every current feature keeps working without an account. Accounts add sync,
  premium and AI.
- *Content and learner data are separate tracks.* Content (CMS) and user data (auth + sync) can be
  migrated independently.
- *Keep public SEO pages static.*

**Suggested target stack (decide before Phase 3)**

| Concern | Recommendation | Notes |
| --- | --- | --- |
| Database | PostgreSQL (managed: Supabase or Neon) | Relational content and progress; JSON columns for structured lesson blocks |
| Auth | Supabase Auth, Clerk or Auth.js | Email + Google; keep JWT validation server-side |
| API | TypeScript API (Hono/Fastify on Vercel Functions, or Supabase Edge Functions + row-level security) | Shares types with the frontend |
| CMS | Either (a) a custom admin in this app on Postgres, or (b) a headless CMS (Sanity, Payload) for blog/marketing | Lessons and questions fit a custom admin best because they are highly structured |
| Public rendering | Keep the prerender + deploy hook first; move to an SSG/ISR framework only if publishing volume demands it | Avoids a big-bang rewrite |
| Payments | Choose a provider that supports the business's country. Stripe is not available to Bangladesh-based merchants; consider SSLCommerz/bKash for local payments, or a merchant-of-record (Paddle, Lemon Squeezy) for international ones | Entitlements stored in your DB, updated by webhooks |
| AI | Server-held provider key; per-user quotas; usage log table | Keep "bring your own key" as an optional power-user mode, or remove it |

**Phased plan** (details in the final section)

1. Groundwork in the frontend (no backend): schema versioning, repository/service interfaces,
   stable slugs, tests.
2. Backend skeleton + auth + profiles (anonymous still works).
3. Cloud progress sync with local-first outbox and a one-time "claim local progress".
4. Content in the database + admin/CMS; build reads from the API; publish triggers rebuild.
5. Server AI proxy with quotas.
6. Roles and admin dashboard hardening.
7. Subscriptions, entitlements, premium content and server-graded tests.
8. New IELTS skills (Writing/Reading/Listening/Speaking) on the new content model.

## 18. Potential breaking changes

| Change | What breaks | Mitigation |
| --- | --- | --- |
| Switching module identity from numeric id to slug | Saved progress (`modules[3]`), `/module/3` URLs, bookmarks, grammar topic links | Keep `legacyId` on modules; migrate local data on load; redirect `/module/:id` → slug URL |
| Progress schema change (blob → events) | Existing `localStorage` data, export files | `schemaVersion` + migration function; keep import of v1 files |
| Content moved to API | Offline Mode (manifest built from `dist/`), prerender pipeline, synchronous `getLesson()` callers | Versioned content snapshots for offline; async content service; build fetches from API |
| Auth-gated or premium content | Offline caches may hold content a user is no longer entitled to; SEO pages could lose content | Never gate public SEO pages; clear premium caches on sign-out or plan change; serve premium via authenticated API, not static HTML |
| Server-graded tests | Offline tests (currently fully local) | Keep offline grading for free practice; queue graded attempts and mark them "pending" until synced, or require online for graded/premium tests |
| Removing "bring your own Gemini key" | Learners who rely on it | Grace period; keep it as an option for free users |
| Moving to an SSR/ISR framework | Routing, `vercel.json`, SW navigation strategy, hydration gates | Do this last, only if needed; keep URLs identical |
| Changing `SITE_URL`/domain | Canonicals, sitemap, Search Console property | 301 redirects at the host; new Search Console property |
| Service worker changes | Cached old shells serving old code | Keep the versioned cache naming and `skipWaiting` + reload-on-chunk-error flow |

## 19. Security concerns

**Today (frontend-only):**

1. **Gemini API key in `localStorage` (plain text).** Any XSS, malicious browser extension, or
   compromised third-party script on the origin can read it. Risk is currently limited to the
   learner's own key and quota, but it must not be repeated for any company key.
2. **Third-party requests.** Google Fonts (privacy: IP disclosure to Google; consider
   self-hosting), and the Abacus visitor counter (public namespace; anyone can increment it). No
   Content Security Policy is configured.
3. **No security headers.** `vercel.json` sets caching headers only. Add CSP, HSTS,
   `X-Content-Type-Options`, `Referrer-Policy` and `Permissions-Policy` before accounts exist.
   CSP needs a hash for the inline theme script and must allow the JSON-LD blocks.
4. **Client-controlled progress and answers.** Anyone can edit `localStorage` to unlock modules
   or set scores, and the answer key is in the bundle. Acceptable while results have no value.
5. **Import validation.** The progress import accepts arbitrary JSON with only a minimal shape
   check. A malformed file could put unexpected data in state. React escaping prevents script
   injection, but types are not enforced.
6. **No `dangerouslySetInnerHTML` with user content.** The only raw HTML is build-time JSON-LD
   (escaped `<`) and the static template. Blog "rich text" is parsed into React elements. Good.

**For the platform:**

- All authorisation (roles, entitlements, content access) enforced server-side. Use row-level
  security if you choose Supabase.
- Admin/CMS input must be sanitised. If rich text or HTML is ever stored, render through a
  sanitiser and keep the structured-block approach.
- AI endpoints: authentication, per-user and per-IP rate limits, input size limits, prompt
  injection hardening, output validation (already present), and usage logging. Never return
  provider errors containing keys.
- Payments: verify webhook signatures; derive entitlements only from webhooks, not client
  callbacks.
- PII and compliance: user profiles, essays and voice recordings are personal data. Plan for
  privacy policy, data export/delete, retention rules, and consent for analytics.
- Service worker: never cache authenticated API responses in Cache Storage; scope caches by user,
  and clear them on sign-out.

## 20. Recommended database entities

PostgreSQL-oriented. `id` is a UUID unless noted; all tables have `created_at`/`updated_at`.

**Identity and access**

- `users`: id, email, email_verified_at, auth_provider, status (active/suspended/deleted)
- `profiles`: user_id (PK/FK), display_name, avatar_url, target_band, exam_date, country,
  ui_locale, lesson_locale (`en`/`bn`), timezone, daily_goal_minutes, theme
- `roles`: id, key (`student`, `editor`, `admin`, `support`)
- `user_roles`: user_id, role_id

**Content (versioned, localised)**

- `stages`: id, slug, position
- `stage_translations`: stage_id, locale, name, tagline, description
- `modules` (= grammar topic): id, slug (stable), legacy_id (current numeric id), stage_id,
  position, difficulty, estimated_minutes, ielts_importance, ielts_priority, access_tier
  (free/premium), status (draft/published), published_at
- `module_translations`: module_id, locale, title, public_name, summary, description, ielts_note,
  topics[]
- `lessons`: id, module_id, version, status, published_at
- `lesson_translations`: lesson_id, locale, intro, key_takeaways[]
- `lesson_rules`: id, lesson_id, key (`m3-r2`), position, structure[], table JSON
- `lesson_rule_translations`: rule_id, locale, heading, rule, when_to_use, notes[], table_caption,
  table_headers[]
- `examples`: id, owner_type (lesson/rule), owner_id, position, wrong, right (English, stored once)
- `example_translations`: example_id, locale, note
- `common_mistakes` + `common_mistake_translations` (explanation per locale)
- `module_relations`: module_id, related_module_id, kind (related/prerequisite)
- `media_assets`: id, kind (image/audio/video), url, alt (per locale via translations), width,
  height, duration

**Assessment**

- `questions`: id, module_id, skill (grammar/writing/reading/listening/speaking), type, usage
  (practice/test/both), difficulty, access_tier, status, source (static/ai/editor)
- `question_translations`: question_id, locale, question, prompt, explanation
- `question_options`: id, question_id, position, text, is_correct
- `question_answers`: question_id, answer, is_primary (accepted typed answers)
- `tests`: id, module_id, slug, pass_mark, question_count, randomize, time_limit
- `test_questions`: test_id, question_id, position (or pool rules)
- `attempts`: id, user_id, test_id or module_id, kind (practice/test), started_at, submitted_at,
  score, total, percentage, passed, client_attempt_id (idempotency for offline sync)
- `attempt_answers`: attempt_id, question_id, response, is_correct, time_ms

**Learner progress and engagement**

- `module_progress`: user_id, module_id, lesson_viewed_at, practice_completed_at, completed_at,
  best_score, latest_score, attempts_count (derivable; cache for speed)
- `study_sessions` / `daily_activity`: user_id, date, minutes, questions_answered,
  questions_correct, tests_taken, modules_completed
- `xp_events`: user_id, source, amount, ref_id (sum = XP; auditable)
- `badges`: id, key, translations; `user_badges`: user_id, badge_id, awarded_at
- `bookmarks`: user_id, content_type (module/article/lesson), content_id, created_at
- `sync_mutations` (optional): user_id, client_id, client_mutation_id, type, payload,
  applied_at (idempotent offline replay)

**Blog / CMS**

- `posts`: id, slug, status, category_id, author_id, cover_asset_id, featured, published_at,
  updated_at
- `post_translations`: post_id, locale, title, excerpt, body (JSON blocks), seo_title,
  seo_description, cover_alt
- `categories` + `category_translations`; `tags`; `post_tags`; `post_modules` (links to grammar
  topics)
- `content_revisions`: entity_type, entity_id, version, snapshot JSON, editor_id, created_at
  (audit and rollback)

**AI**

- `ai_requests`: id, user_id, feature (practice/essay_feedback/speaking), model, input_tokens,
  output_tokens, cost_estimate, status, latency_ms, created_at
- `ai_quotas`: plan_id or user_id, feature, period, limit
- `ai_generated_items` (optional): request_id, question JSON, reviewed_by (to promote good items
  into the bank)
- `writing_submissions`: id, user_id, task_type (Task 1/Task 2), prompt_id, text, word_count,
  submitted_at; `writing_feedback`: submission_id, criteria scores, comments JSON, model

**Commerce**

- `plans`: id, key, name, price, currency, interval, features JSON
- `subscriptions`: id, user_id, plan_id, provider, provider_subscription_id, status,
  current_period_end, cancel_at
- `payments`: id, user_id, provider, provider_payment_id, amount, currency, status, raw JSON
- `entitlements`: user_id, feature or access_tier, source (subscription/promo), expires_at
- `promo_codes`, `redemptions` (optional)

**Operations**

- `audit_log`: actor_id, action, entity, entity_id, diff, at
- `feature_flags` (optional)

---

## Migration plan — ordered from lowest to highest risk

1. **Add safety nets (no user-visible change).**
   - A `schemaVersion` on `grammar-path:progress` and a migration hook.
   - Schema validation for progress import.
   - Commit the existing ad-hoc checks (lesson parity, SEO audit, hydration and offline tests) to
     the repo, and run them in CI.
   - Security headers (CSP, HSTS, Referrer-Policy) in `vercel.json`.
2. **Introduce seams in the frontend.** Add `contentService` (async, static adapter) and a
   `ProgressRepository` / `BookmarkRepository` (localStorage adapter). Migrate callers. No
   behaviour change.
3. **Stabilise identities.** Add stable slugs to modules and use them in new URLs. Keep
   `legacyId`, redirect `/module/:id`, and migrate local progress keys. Unify the topic/module
   catalogues.
4. **Stand up the backend skeleton.** Postgres + API + auth (email/Google) + profiles + roles.
   The app still works fully anonymous. Sign-in is optional.
5. **Cloud sync for learner data.** IndexedDB outbox, idempotent mutation endpoints, and a
   one-time "claim local progress" on first sign-in. Bookmarks and preferences first, then
   attempts and progress. Server derives XP, badges and unlocks.
6. **Move content into the database and add the admin/CMS.**
   - Seed it from the existing TypeScript data (a mechanical import script).
   - The build reads published content from the API; publishing triggers a Vercel deploy hook.
   - Offline Mode switches to versioned content snapshots.
7. **Server-side AI.** A `/ai/practice` endpoint with a company key, quotas and logging, behind
   the existing hook interface. Then new AI features (essay feedback).
8. **Subscriptions and entitlements.** Payment provider + webhooks + `entitlements`. Gate premium
   *new* content first; keep existing public SEO content free.
9. **Server-graded and premium tests.** Remove answer keys for graded/premium tests from the
   bundle; per-item responses; pending-sync handling for offline attempts.
10. **New IELTS skills and rendering upgrades (highest risk).** Writing/Reading/Listening/Speaking
    content types with media. Move public pages to an SSG/ISR framework only if publishing volume
    makes rebuild-on-publish impractical.
