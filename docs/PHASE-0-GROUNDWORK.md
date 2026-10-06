# Phase 0 — Frontend groundwork (in progress)

_Last updated: 2026-10-06 · Base commit: `f8b17b9` · All work below is **uncommitted** in the working tree._

Phase 0 prepares the existing frontend-only app for a later backend without changing what users
see. It adds no backend, auth, payments or CMS. The planned backend is **Django + Django REST
Framework + PostgreSQL** (decided after `PLATFORM_AUDIT.md` was written; that document's
stack table predates the decision).

Status words used here:

- **Implemented**: code exists, type-checks, builds, and is wired into the app.
- **Verified**: checked by an automated test or a command whose result is recorded below.
- **Unverified**: implemented, but not yet exercised by tests or in a browser.

> **Not committed and not deployed.** Loading the app migrates every learner's stored progress to
> `schemaVersion: 1` and writes it back. That path is now covered by unit and browser tests (see
> [Automated tests](#automated-tests)). The remaining Phase 0 items below are still open.

## Status by item

| Item | State | Verified so far |
| --- | --- | --- |
| A. Progress `schemaVersion` + migrations | Implemented, **verified** | Unit tests + browser test with real localStorage |
| B. Import/export validation | Implemented, **verified** | Unit tests + browser tests through Settings |
| C. Automated tests | Implemented, **verified** | 1,567 unit tests, 59 browser tests; no expected failures |
| D. `ContentService` | Implemented for Module, Test, GrammarTopic, BlogPost, `useAiPractice`; other callers not migrated | Unit tests, bundle graph, prerender diff, hydration tests |
| E. `ProgressRepository` | Implemented, **verified** | Unit tests (in-memory store) + browser tests |
| F. `BookmarkRepository` | Implemented, **verified** | Unit tests + browser test |
| G. Stable module slugs | **Partial**: catalogue + `/module/<slug>` → `/module/<id>` redirect; no `/learn/:slug` route yet | Identity pinned by unit tests; redirects tested in the browser |
| H. Topic/module identity | **Partial**: `GrammarModule` catalogue; 5 files still read `grammarTopics.ts` directly | Unit tests |
| I. Security headers | **Not started** | — |
| J. Documentation | This file | — |

## What exists

### Content (`src/content/`, `src/services/content/`)

- `content/catalog.ts`: `GrammarModule` joins a course module (`data/modules.ts`) and its public
  grammar topic (`data/grammarTopics.ts`). It has a stable `slug`, a numeric `legacyId` and a
  `topic` view. `resolveModule(ref)` accepts a legacy id, a module slug or a topic slug.
- `content/paths.ts`: URL builders (`modulePath`, `moduleTestPath`, `learnPath`, ...). Only the
  migrated pages use them so far.
- `services/content/types.ts`: the async `ContentService` interface (`getModules`, `getModule`,
  `getLesson`, `getPracticeQuestions`, `getTestQuestions`, `getGrammarTopics`, `getGrammarTopic`,
  `getBlogPosts`, `getBlogPost`, `getStages`).
- `services/content/staticContentService.ts`: the only implementation. It reads the bundled
  TypeScript data and returns **already-settled promises** (`status: 'fulfilled'`), so React's
  `use()` (wrapped as `useContent`) reads them in the first render. Prerendered HTML and hydration
  are therefore unchanged. Results are memoised per argument.
- **Content packs** (`packs.ts`, `lessonPack.ts`, `questionPack.ts`): lessons and questions are
  most of the bundle, so the service does not import them. A route that shows them imports the
  pack (`import '@/services/content/lessonPack'`), which registers it before the first render.
  If a caller asks for a pack that its route did not import, the service loads it on demand and
  returns a pending promise. That caller then suspends under its route's `<Suspense>`.
  - `Module.tsx` imports `lessonPack`; `useAiPractice.ts` and `Test.tsx` import `questionPack`;
    `GrammarTopic.tsx` imports both.

**Contract for future callers:** on a prerendered public page, import the pack you read from.
Otherwise the page renders a loading fallback at build time, which `postbuild.mjs` rejects.

### Progress (`src/services/progress/`)

- `state.ts`: `PROGRESS_SCHEMA_VERSION = 1`, `createInitialState`, `DEFAULT_PREFERENCES`.
- `schema.ts`: a hand-written validator with two modes:
  - **strict** (`validateProgressState`, `validatePreferences`) rejects bad input; used for imports;
  - **repair** (`repairProgressState`, `repairPreferences`) keeps valid fields and replaces or drops
    invalid ones; used for data already in the browser.

  It also enforces size limits and strips unknown fields.
- `migrations.ts`: an ordered migration chain. Unversioned data is version 0; `v0 → v1` adds
  `schemaVersion` and fills fields that early saves may lack. `loadStoredProgress()` never throws
  and never resets valid data. Data written by a newer app version keeps its unknown fields.
- `backup.ts`: the export format is `{ format, schemaVersion, exportedAt, state, preferences }`.
  `parseBackup()` accepts legacy `{ state, preferences }` files, migrates them, validates them
  strictly, and applies nothing unless the whole file is valid.

### Learner-data repositories (`src/repositories/`)

- `ProgressRepository` and `BookmarkRepository` interfaces. Reads are synchronous on purpose: the
  app is local-first, and later sync will wrap the local repository rather than replace it.
- localStorage implementations use the **same keys as before** (`grammar-path:progress`,
  `grammar-path:preferences`, `grammar-path:bookmarks`). They run over an injectable
  `KeyValueStore` (`utils/storage.ts`), and `createMemoryStore()` exists for tests.
- On first migration or repair, or when the stored string is not valid JSON, the original progress
  string is copied once to `grammar-path:progress:before-v1`.
- `ProgressProvider` takes an optional `repository` prop. `useBookmarks` is built from
  `createBookmarkStore(repository)`. `hooks/useLocalStorage.ts` was removed because it had no
  remaining callers.

## Automated tests

### Configuration

| File | Purpose |
| --- | --- |
| `vitest.config.ts` | Unit tests: `tests/unit/**/*.test.ts`, Node environment, `@` alias to `src/` |
| `playwright.config.ts` | Browser tests: `tests/e2e`, installed Google Chrome (`channel: 'chrome'`; set `PW_BUNDLED_CHROMIUM=1` to use Playwright's Chromium), 4 workers |
| `tests/e2e/server.mjs` | Serves `dist/` the way Vercel does: clean URLs, trailing-slash redirect, `app.html` fallback, headers copied from `vercel.json` |
| `tests/e2e/fixtures.ts` | Network isolation, console/page-error capture, localStorage helpers |
| `tests/fixtures/legacy-progress.json` | A realistic progress save from before versioning, shared by unit and browser tests |
| `tsconfig.test.json` | Type-checks `src`, `tests` and both configs |

Scripts:

| Command | What it runs |
| --- | --- |
| `npm test` | Vitest, once |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:e2e` | Playwright. **Needs a current build**: run `npm run build` first |
| `npm run typecheck` | `tsc` for app code and for tests |
| `npm run test:all` | typecheck → lint → unit → build → browser tests |

**Isolation.** Every browser test runs in a fresh browser context, with its own localStorage,
Cache Storage and service worker. Every request to a host other than the local test server is
aborted (Google Fonts, the production visitor counter at Abacus, Gemini), so the tests never
read or write production data. No test uses a real account or API key.

### Unit tests (Vitest): 9 files, 1,567 tests

| File | Tests | What it verifies |
| --- | --- | --- |
| `progress-migration.test.ts` | 51 | v0 → v1 keeps every value exactly; sparse early saves get defaults; v1 data is unchanged and migration is idempotent; malformed input never throws; one bad field is repaired without losing the rest; newer-version data keeps unknown fields; strict validation rejects 13 kinds of damage; repair mode strips unknown fields, de-duplicates and caps history; preferences; the localStorage repository migrates in place, keeps the original once, ignores removals and syncs tabs |
| `progress-backup.test.ts` | 34 | Export format and round trip; legacy `{ state, preferences }` import; malformed JSON, non-objects, wrong format, oversized input, newer or unreadable versions, damaged state, invalid preferences; a file is never half-applied; unknown fields are not imported |
| `bookmarks.test.ts` | 6 | Same storage key as before; malformed, duplicate and off-site entries are dropped; cross-tab updates; toggle/remove through the store the hook uses |
| `lesson-parity.test.ts` | 148 | 24 modules each have a Bangla and an English lesson; same rule ids in the same order; same structure (structure steps, notes, table shape, example and mistake counts, takeaways); identical English example sentences; Bangla text only in the Bangla version; every lesson has practice and test questions |
| `question-integrity.test.ts` | 1,080 | 4 practice + 10 test questions per module (336); unique ids; valid module references and types; non-empty text, answers and explanations; option questions have exactly distinct options containing the answer, with exactly one graded correct; typed answers and their alternatives are accepted |
| `seo.test.ts` | 158 | The 36 sitemap routes; 35 prerendered; indexable robots tag, title, description length, canonical and Open Graph URL for each; unique titles and descriptions; JSON-LD (WebSite, BreadcrumbList, Article) where expected; JSON-LD `<` escaping; private, module and unknown pages are `noindex` |
| `slugs.test.ts` | 46 | The id → module slug → topic slug table and blog slugs are pinned; slugs are kebab-case, unique and never numeric; no module slug equals another module's topic slug; related-topic and blog topic links resolve; `resolveModule()` by number, digit string, module slug and topic slug; URL builders |
| `content-service.test.ts` | 5 | Already-fulfilled promises once a pack is registered; on-demand pack loading otherwise; the same promise for the same request; empty results for unknown ids |
| `grading.test.ts` | 39 | Option questions compare exactly: punctuation-only differences are not equivalent, the correct option is accepted, and case or spacing variants are not. All 8 affected questions accept only their answer. Module tests lose a mark for a comma splice. Typed answers still ignore case, punctuation and spacing and accept alternatives, except that a punctuation-only answer (`:` or `;`) keeps its punctuation. |

There are no expected failures. All 1,567 tests run as normal tests.

### Browser tests (Playwright + Chrome): 3 files, 59 tests

| File | Tests | What it verifies |
| --- | --- | --- |
| `hydration.spec.ts` | 43 | All 35 prerendered pages from the built `sitemap.xml` hydrate with no console errors, no page errors and no React "hydration recovered" log, and the server-rendered `<h1>` node is kept. The same checks run on 6 pages for a returning learner with saved progress, Bangla and dark theme. A control test serves a tampered page and confirms the checks catch it. |
| `learner-flows.spec.ts` | 14 | Choosing Bangla, switching to English, persistence after reload; a public grammar page switching language; legacy progress migrated in real localStorage (values kept, original kept, module 4 open and 5 locked); passing module 4's test on migrated progress (module 5 unlocks, earlier data intact); export → clear → import round trip; legacy-file import with preferences; five malformed or invalid files rejected with storage byte-for-byte unchanged; `/module/<slug>` and `/module/<topic-slug>` redirects; unknown module → `/course`; bookmarks persist and can be removed |
| `offline.spec.ts` | 2 | Download for Offline, then **stop the server** and set the browser offline: grammar lesson in English and Bangla, practice answer checking, course lesson in Bangla, passing a module test (saved locally), blog article with cover image, dashboard, newly unlocked module. A control test confirms that without the download an unvisited page shows the "You are offline" page (HTTP 503), so the origin really is unreachable. |

The full browser suite passed three consecutive runs (59/59 each, about 1.4 minutes).

### Bugs found by the tests

1. **Fixed (Phase 0 code):** the local progress repository did not keep unreadable stored
   progress. If the stored string was not valid JSON, for example after a truncated write, the app
   started fresh and the next save overwrote the original with no copy. The repository now copies
   it to `grammar-path:progress:before-v1` first (`src/repositories/localProgressRepository.ts`).
   The old app also lost such data, so this is a gap in the new safeguard, not a regression.
2. **Fixed (pre-existing bug, present since before Phase 0 at `f8b17b9`; fixed while continuing
   Phase 0):** `isCorrect()` in `src/utils/answers.ts` stripped punctuation before comparing
   every answer.
   - **Choice questions.** In 8 questions whose options differ only in punctuation, every option
     was graded correct. Across them, 17 wrong options were accepted.
     - Practice: `m5-p1`, `m13-p3`, `m24-p2`.
     - Test: `m5-t2`, `m5-t10`, `m12-t10`, `m13-t2`, `m24-t6`. These affect pass/fail and
       unlocking.
   - **Typed questions whose answer is punctuation.** The answer was reduced to an empty string,
     so any punctuation typed was accepted:
     - `m5-p4` accepted `;` for a colon question;
     - `m24-p3` accepted `,` for `;`;
     - the test question `m5-t3` accepted a bare `,`, a comma splice.
   - **Fix.**
     - Questions answered by picking an option (multiple-choice, choose-correct-sentence,
       error-correction) now compare the picked option with the answer exactly.
     - Typed questions (fill-blank, rewrite) keep the forgiving comparison: case, punctuation
       and spacing are ignored and `acceptable` alternatives are allowed. The exception is an
       accepted answer made only of punctuation, which is compared with its punctuation (spaces
       ignored).
     - `isTypedQuestion()` is the single rule for which questions are typed, used by the grader
       and by `QuestionCard`.
     - No question text or answer data changed. AI-generated questions already set `answer` to
       the exact option string, so they grade the same way.
   - **Checked against the old grader.** Run on the `f8b17b9` version of `answers.ts`, the
     regression cases fail: 17 wrong options accepted, plus the 3 typed cases. On the fixed
     version all pass.

## Verification record (2026-10-06)

Commands run against the working tree. The "baseline" is a build of untouched `f8b17b9`, captured
before any Phase 0 change.

| Check | Result |
| --- | --- |
| `tsc -p tsconfig.app.json --noEmit` | 0 errors |
| `npm run typecheck` (app + tests) | 0 errors |
| `npm run lint` (oxlint) | 0 errors, 25 warnings. The baseline had 26; no warning is new, including in test code. |
| `npm test` (Vitest) | 9 files: 1,567 passed, 0 failed, 0 expected failures |
| `npm run test:e2e` (Playwright) | 59 passed, 0 failed (three runs in a row before the grading fix; one full run after it) |
| `npm run build` | Passes. 35 pages prerendered, sitemap with 36 URLs, offline manifest with 100 files. |
| Prerendered HTML vs baseline (36 files, asset references removed) | **0 content differences** (titles, meta, canonical, JSON-LD, body) |
| `sitemap.xml` vs baseline | Identical except build-date `<lastmod>` values |
| `robots.txt` vs baseline | Identical |
| Offline manifest | 96 → 100 files: adds `lessonPack`, `questionPack`, `grammarTopics`, `paths` and `preload-helper` chunks; `lightbulb` was merged away. Every entry exists in `dist/`. `sw.js` placeholders are filled. |
| Blog bundle regression | **Fixed.** Static import graph per route: BlogPost 463 KB (baseline 453 KB) and loads neither `lessonPack` nor `questionPack`. Before this fix it pulled in a 473 KB lesson+question chunk. Home, BlogIndex, GrammarIndex and Practice also load neither pack. GrammarTopic, Module and Test load the same data as at baseline. |
| Content service (scratch script via Vite SSR loader) | All 24 modules have EN and BN lessons; 336 practice+test questions; reads are synchronous once a pack is registered; the on-demand pack load works when it is not; same promise for the same arguments. |
| SSR render of `/grammar/*`, `/blog/*`, `/module/1/test`, `/module/24` | Rendered inline with an `<h1>`. |

Known pre-existing issue (not caused by Phase 0): `/module/:id` cannot be server-rendered because
`LanguageChooser` reads `document` during render. Module pages are client-only, so this does not
affect the build.

Each route's JavaScript grew by about 9–11 KB (catalogue, content service and progress validation).

### Not verified yet

- **Cross-tab sync in a real browser.** The repository's subscription is unit-tested with an
  in-memory store; two real tabs are not tested.
- **Real Vercel hosting.** Tests run against a local server that reproduces `vercel.json` routing.
  `cleanUrls`, the rewrite and the service-worker shell fetch have not been checked on a Vercel
  preview deployment.
- **Service-worker update after a new deploy** while Offline Mode is on (the re-download on
  install), and the reload-on-chunk-error path.
- **Google Fonts offline.** Fonts are blocked in tests, so offline font caching is not exercised.
- **AI practice with a real Gemini key.** Not exercised; external calls are blocked by design.
- **Browsers other than Chrome** (Firefox, Safari/iOS).
- **The production build itself.** It is not exercised by unit tests: the browser tests need a
  fresh `npm run build`, and a stale `dist/` tests old code.

## Remaining Phase 0 work (priority order)

1. **Stable slugs**:
   - `/learn/:slug` redirect route;
   - make the `seo/meta.ts` module pattern accept slugs;
   - replace the remaining hand-built `/module/` URLs (ModuleCard, useCourseCta, Dashboard,
     Review, Practice).
2. **Remaining callers**: move PublicUi, Practice, GrammarIndex, Home and `seo/meta.ts` off direct
   `grammarTopics.ts` and `data/*` imports, onto the catalogue or `ContentService`.
3. **Security headers** in `vercel.json` (CSP with a hash of the inline theme script, HSTS,
   nosniff, Referrer-Policy, Permissions-Policy), plus a build check that the hash matches.
4. Final verification pass and commit. Add CI that runs `npm run test:all`.

## Do not change yet

- localStorage key names: the inline theme script in `index.html` reads `grammar-path:preferences`
  before React loads.
- Numeric module ids as progress keys, and `/module/:id` as the canonical lesson URL.
- `/grammar/:slug` and `/blog/:slug` URLs: these pages are indexed by search engines.
- `scripts/postbuild.mjs`, `scripts/sw-template.js` and the offline manifest logic, without
  running `offline.spec.ts` against a fresh build.
- Lesson and question data files.
