# Phase 0 — Frontend groundwork (complete)

_Completed: 2026-10-07 · Base commit: `f8b17b9` · Checkpoint commit: `5924811` · Branch: `phase0-slug-cleanup`_

Phase 0 prepared the frontend-only app for a backend without changing what learners see. It adds
no backend, authentication, payments, CMS or server-side AI.

The planned backend is **MERN: MongoDB, Express.js and Node.js**, with the existing **React +
TypeScript + Vite + PWA** frontend. This decision replaces the earlier Django/DRF/PostgreSQL plan
and post-dates `PLATFORM_AUDIT.md`. The audit's stack table is out of date, but its analysis still
applies. No backend code exists yet.

Every result in this document comes from a command that was run. Anything not run is listed under
[Known limitations](#known-limitations-outside-phase-0).

## Summary

| Item | Result |
| --- | --- |
| A. Progress `schemaVersion` + migrations | Done, verified |
| B. Import/export validation | Done, verified |
| C. Automated tests | Done: 1,612 unit tests, 124 browser tests |
| D. `ContentService` + bundle splitting | Done: every component, page and hook reads content through it |
| E. `ProgressRepository` | Done, verified |
| F. `BookmarkRepository` | Done, verified |
| G. Stable module slugs | Done: `/learn/:slug` and `/module/<slug>` redirect to the canonical `/module/:id` |
| H. Topic/module identity | Done: one `GrammarModule` catalogue; no reads of `src/data` outside the content layer |
| I. Security headers | Done: CSP (hash-based scripts), HSTS, nosniff, Referrer-Policy, Permissions-Policy, X-Frame-Options |
| J. CI | Done: GitHub Actions runs `npm run test:all` on every push and pull request |
| K. Documentation | This file |

Two bugs were found and fixed along the way (see [Bugs found and fixed](#bugs-found-and-fixed)).
One of them, the punctuation grading bug, predates Phase 0.

## Architecture after Phase 0

### Content access

```
components / pages / hooks ──useContent()──▶ ContentService (interface, async)
                                               └─ staticContentService (bundled TypeScript data)
                                                    ├─ lessonPack   (lessons, code-split)
                                                    └─ questionPack (questions, code-split)

utils (progression, badges, stats, i18n), seo/meta.ts ──▶ src/content/catalog.ts (synchronous)

src/data/** ◀── only src/content/** and src/services/content/**
```

- **`ContentService`** (`src/services/content/types.ts`) is the only way UI code reads content:
  - Methods: `getStages`, `getModules`, `getModule`, `getLesson`, `getPracticeQuestions`,
    `getTestQuestions`, `getGrammarTopics`, `getGrammarTopic`, `getFeaturedGrammarTopics`,
    `getBlogPosts`, `getBlogPost`, `getBlogCategories`.
  - It is async and backend-agnostic: no network, storage or framework code. An Express API
    client can implement it later without changing pages.
  - Content record types (`GrammarModule`, `BlogPostMeta`, `BlogBlock`, `BlogCategory`,
    `GrammarTopic`) are re-exported from `@/services/content`, so UI code never imports
    `src/data`, not even types.
- **`staticContentService`** reads the bundled data and returns already-settled promises
  (`status: 'fulfilled'`). React's `use()` (wrapped as `useContent`) reads them in the first
  render, so prerendering and hydration are exactly as before. Results are memoised per argument.
- **Content packs.** Lessons and questions (about 460 KB) are separate chunks that register
  themselves when imported.
  - Importers: `Module.tsx`, `GrammarTopic.tsx` and `Test.tsx`, plus `useAiPractice.ts` (used by
    the lesson page).
  - Any other caller still works: the pack is loaded on demand and the caller suspends.
  - **Contract:** a prerendered page must import the pack it reads, or its HTML would contain a
    loading fallback, which `postbuild.mjs` rejects.
- **`src/content/catalog.ts`** joins course modules and grammar topics into one `GrammarModule`:
  stable `slug`, numeric `legacyId`, `topic` view and stage.
  - It also offers synchronous views (`COURSE_MODULES`, `COURSE_STAGES`, `GRAMMAR_TOPIC_MODULES`,
    `FEATURED_TOPIC_MODULES`, English module and stage text, the blog index).
  - These serve domain logic that cannot wait for a promise: unlocking, badges, stats,
    localisation, and SEO metadata, which the build-time prerenderer and `<SeoManager>` read
    synchronously.
- **`src/content/blog.ts`** holds pure blog helpers moved out of the data file: `featuredPost`
  and `relatedPosts` (now given the post list), `formatPostDate` and `postCover`.
- **`src/content/paths.ts`** builds every in-app content URL: `modulePath`, `moduleTestPath`,
  `learnPath`, `learnTestPath`, `grammarTopicPath` and `blogPostPath`.

All of these rules are enforced by `tests/unit/architecture.test.ts`.

**Migration of the remaining direct readers (final step).** These files used to import `src/data`
directly and now go through the content layer:

| Files | Now reads through |
| --- | --- |
| Home, GrammarIndex, Practice, BlogIndex, BlogPost, PublicUi (`GrammarCard`, blog cards), PublicLayout (footer categories) | `ContentService` |
| Layout, Dashboard, Course, Review, StageTrack | `ContentService` |
| Progress | its computed stats (`stats.totalModules`) |
| `utils/progression`, `utils/badges`, `utils/stats`, `utils/i18n`, `seo/meta.ts` | the synchronous catalogue |

`GrammarCard` now takes the unified `GrammarModule` entry instead of joining a topic to its module
itself. Rendered output is unchanged: the prerendered HTML is identical to the original commit.

### Learner data

- **Progress** (`src/services/progress/`):
  - `schemaVersion: 1` with an ordered migration chain. Unversioned saves are version 0.
  - A validator with a strict mode (imports) and a repair mode (stored data: keeps every valid
    field). Unknown fields are stripped and sizes are capped.
  - Data from a newer app version keeps its unknown fields.
  - The original string is copied once to `grammar-path:progress:before-v1` when it is migrated,
    repaired or unreadable.
- **Backups:**
  - Format: `{ format, schemaVersion, exportedAt, state, preferences }`.
  - Legacy `{ state, preferences }` files still import.
  - A file is applied only if it is entirely valid.
- **Repositories** (`src/repositories/`):
  - `ProgressRepository` and `BookmarkRepository` interfaces with localStorage implementations
    over an injectable `KeyValueStore`.
  - Storage keys are **unchanged**.
  - Reads are synchronous by design (local-first). Future sync will wrap the local repository.

### Module URLs

| URL | Behaviour |
| --- | --- |
| `/module/:id`, `/module/:id/test` | **Canonical**, unchanged. The numeric id is still the progress key. |
| `/module/<module-slug or topic-slug>` (and `/test`) | Redirects to the numeric URL. |
| `/learn/<module-slug, topic-slug or id>` (and `/test`) | Redirects to the numeric URL. |
| Unknown reference under `/module/` or `/learn/` | Redirects to `/course`. |
| `/grammar/:slug`, `/blog/:slug` | Unchanged; indexed. |

Every form of a lesson URL is `noindex`, and its canonical points at `/module/:id`. No lesson URL is
in the sitemap.

### Security headers

`vercel.json` sends these on every path (`/(.*)`); the existing caching and service-worker headers
are unchanged:

| Header | Value |
| --- | --- |
| `Content-Security-Policy` | see below |
| `Strict-Transport-Security` | `max-age=63072000` (2 years) |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()` |
| `X-Frame-Options` | `DENY` (legacy companion to `frame-ancestors 'none'`) |

The CSP, directive by directive:

| Directive | Value | Why |
| --- | --- | --- |
| `default-src` | `'self'` | |
| `script-src` | `'self' 'sha256-xUchrIZ6…'` | The theme script in `index.html` is the only executable inline script; it is allowed by hash. No `'unsafe-inline'` and no `'unsafe-eval'` (the bundles use neither). JSON-LD blocks are data, not scripts, so CSP does not apply to them. |
| `style-src-elem` | `'self' https://fonts.googleapis.com` | Inline `<style>` elements are blocked (the app has none). |
| `style-src-attr` | `'unsafe-inline'` | Required: prerendered pages contain 875 `style=""` attributes (React style props such as the `--i` stagger index), and React sets inline styles at runtime. |
| `style-src` | `'self' 'unsafe-inline' https://fonts.googleapis.com` | Fallback for browsers without CSP Level 3 `-elem`/`-attr` support. |
| `font-src` | `https://fonts.gstatic.com` | |
| `img-src` | `'self'` | All images are same-origin; there are no `data:` images. |
| `connect-src` | `'self'` + `generativelanguage.googleapis.com` (AI practice), `abacus.jasoncameron.dev` (visitor counter), `fonts.googleapis.com` + `fonts.gstatic.com` (Offline Mode caches fonts) | |
| `worker-src`, `manifest-src` | `'self'` | |
| `object-src`, `base-uri`, `frame-ancestors` | `'none'` | |
| `form-action` | `'self'` | The app has no forms. |

Notes on the other headers:

- **`Permissions-Policy`** disables only features the app never uses. The dashboard share card
  needs `clipboard-write` and `web-share`, so those are left enabled.
- **`Strict-Transport-Security`** has no `includeSubDomains` and no `preload`. Add them only after
  checking every subdomain of a future custom domain.

**Build check.** `scripts/check-csp.mjs` runs at the end of `npm run build`. It fails the build if:
- any executable inline script in `index.html` or `dist/**/*.html` is not allowed by a hash;
- an allowed hash matches no script (a stale hash);
- `script-src` contains `'unsafe-inline'` or `'unsafe-eval'`.

The failure message prints the hash to use. It was checked both ways: it passes on the real build
and fails when the theme script is edited.

## Automated tests

### Configuration

| File | Purpose |
| --- | --- |
| `vitest.config.ts` | Unit tests in `tests/unit`, Node environment, `@` alias |
| `playwright.config.ts` | Browser tests in `tests/e2e`. Uses installed Google Chrome by default; `PW_BUNDLED_CHROMIUM=1` uses Playwright's Chromium (as CI does). 4 workers locally, 2 in CI. |
| `tests/e2e/server.mjs` | Serves `dist/` like Vercel (clean URLs, trailing-slash redirect, `app.html` fallback) **with the headers from `vercel.json`**, so every browser test runs under the production CSP |
| `tests/e2e/fixtures.ts` | Network isolation, console and page-error capture, storage helpers |
| `tests/fixtures/legacy-progress.json` | A realistic pre-versioning progress save |
| `tsconfig.test.json` | Type-checks `src`, `tests` and the configs |
| `scripts/check-csp.mjs` | CSP hash check, part of `npm run build` |

| Command | Runs |
| --- | --- |
| `npm test` | Vitest |
| `npm run test:e2e` | Playwright (needs a fresh `npm run build`) |
| `npm run typecheck` | `tsc` for app and tests |
| `npm run test:all` | typecheck → lint → unit → build (includes the CSP check) → browser tests |

**Isolation.**
- Every browser test uses a fresh browser context, with its own storage, caches and service
  worker.
- Requests to any host other than the local server are aborted.
- Tests that need Gemini, the visitor counter or Google Fonts answer those hosts with local mocks.
- Nothing reaches a production service, and no real key or account is used.
- **One Chromium diagnostic is ignored**, the "preload … not used because it is a cross-world
  service worker resource mismatch" warning:
  - It appears rarely, on a first visit, when the service worker claims the page mid-load.
  - The file is simply fetched again.
  - It was seen once in a CI-mode run and not in 15 targeted repeats.
  - All errors, page exceptions, hydration recoveries and other warnings still fail the tests.

### Unit tests (Vitest): 11 files, 1,612 tests

| File | Tests | Verifies |
| --- | --- | --- |
| `progress-migration.test.ts` | 51 | v0 → v1 keeps every value; defaults for sparse saves; idempotent; malformed input never throws; field-level repair; newer-version data kept; 13 kinds of strict-validation failure; repository migrates in place, keeps the original (including unreadable JSON), syncs tabs |
| `progress-backup.test.ts` | 34 | Export format and round trip; legacy import; malformed, oversized, foreign, newer-version and damaged files rejected; never half-applied |
| `bookmarks.test.ts` | 6 | Same key as before; damaged and off-site entries dropped; cross-tab updates; store toggle/remove |
| `lesson-parity.test.ts` | 148 | 24 modules × English/Bangla: same rule ids, structure and counts; identical English example sentences |
| `question-integrity.test.ts` | 1,080 | 336 questions: counts per module, unique ids, valid types and references, options and answers, exactly one correct option |
| `grading.test.ts` | 39 | Option questions compare exactly; typed answers stay forgiving; punctuation-only answers keep punctuation; regressions for the 11 affected questions |
| `seo.test.ts` | 175 | 36 sitemap routes; per-page robots, title, description, canonical, Open Graph; unique titles and descriptions; JSON-LD; `noindex` for private pages; every lesson URL form canonicalises to `/module/:id` |
| `slugs.test.ts` | 46 | Pinned id/slug/topic-slug table and blog slugs; slug rules; no cross-collisions; `resolveModule()`; URL builders |
| `content-service.test.ts` | 15 | Settled promises; on-demand pack loading; memoisation; featured topics, categories, modules, topics, stages, posts; blog helpers (featured and related posts pinned, dates, covers); localisation |
| `architecture.test.ts` | 6 | No `src/data` imports outside the content layer; UI does not read the catalogue directly; packs imported only by the four routes; no network or storage code in the content service; no hand-built content URLs |
| `security-headers.test.ts` | 12 | Every header and value; CSP hash equals the theme script's hash; no unsafe script sources; exact external origins; caching headers unchanged |

### Browser tests (Playwright): 6 files, 124 tests

| File | Tests | Verifies |
| --- | --- | --- |
| `hydration.spec.ts` | 43 | All 35 prerendered pages hydrate with no errors, warnings or React hydration recoveries, and keep the server-rendered `<h1>` node; 6 pages for a returning learner (saved progress, Bangla, dark theme); a control proves a tampered page is caught |
| `learner-flows.spec.ts` | 22 | English/Bangla choice, switching and persistence; legacy progress migrated in real localStorage; passing a test on migrated progress; export/import round trip; legacy import; 5 malformed files rejected with storage unchanged; `/module/<slug>` and `/learn/...` redirects; canonical tag after a redirect; course links; bookmarks |
| `offline.spec.ts` | 2 | Download for Offline, then stop the server and go offline: grammar lesson (English and Bangla), practice, course lesson, passing a test, blog article with cover, dashboard; a control proves the origin is really unreachable |
| `public-pages.spec.ts` | 5 | Home (featured topics, ticker, stage overview, latest posts), GrammarIndex (stage filter, stage text, search, filtered URL), Practice (24 topics by stage), BlogIndex (category filter and counts), BlogPost (topic chips, related posts, footer categories) |
| `bundle.spec.ts` | 48 | Lesson and question packs are separate chunks, absent from the entry, BlogPost, BlogIndex, GrammarIndex, Practice, Dashboard, Course, Settings and Bookmarks, and present where needed; sitemap and robots.txt valid; each of the 35 public pages prerendered with an `<h1>`, canonical, robots tag and no loading fallback |
| `security.spec.ts` | 4 | Security headers on HTML, app shell, service worker, manifest and assets; no CSP violations across 7 pages including Settings; CSP allows Google Fonts, the visitor counter and Gemini (local mocks) |

## CI

`.github/workflows/ci.yml` runs on every push and pull request:

1. `ubuntu-latest`, **Node 22** with an npm cache, then `npm ci`.
2. `npx playwright install --with-deps chromium`.
3. `npm run test:all`. Any type error, lint error, failed unit test, failed build (including the
   CSP check) or failed browser test fails the job.
4. Playwright traces are uploaded on failure.

There is no deployment step; Vercel deploys separately.

**Node version.** The repository pins no Node version. CI uses Node 22, the current LTS line,
because Node 20 reached end of life in April 2026. Local development used Node 20.19.

**Verified locally, not yet on GitHub:**
- The workflow YAML parses.
- A clean `npm ci` with npm 10 (the version Node 22 ships) installs every tool.
- `CI=1 PW_BUNDLED_CHROMIUM=1 npm run test:all` was run with Playwright's Chromium.

The first real run happens on the next push.

## Bugs found and fixed

1. **Unreadable stored progress was overwritten with no copy** (gap in a new Phase 0 safeguard).
   It is now copied to `grammar-path:progress:before-v1` first.
2. **Punctuation grading** (pre-existing since before `f8b17b9`; fixed during Phase 0).
   `isCorrect()` stripped punctuation from every answer.
   - **Choice questions.** In 8 questions whose options differ only in punctuation, every option
     was graded correct: 17 wrong options were accepted, 5 of them in module tests (`m5-p1`,
     `m13-p3`, `m24-p2`, `m5-t2`, `m5-t10`, `m12-t10`, `m13-t2`, `m24-t6`).
   - **Typed questions.** In 3 questions whose answer is punctuation (`m5-p4`, `m24-p3`, test
     `m5-t3`), any punctuation was accepted.
   - **Fix.** Option questions now compare exactly. Typed answers keep the forgiving comparison,
     except that punctuation-only answers keep their punctuation. No question data changed.

## Verification record (2026-10-07, final)

All runs below started from a clean tree (`dist/`, `dist-server/`, `test-results/` deleted). The
baseline is a build of untouched `f8b17b9`.

| Check | Result |
| --- | --- |
| `npm run typecheck` | 0 errors |
| `npm run lint` | 0 errors; 25 warnings, none new compared with `f8b17b9` (which had 26) |
| `npm test` | 11 files, 1,612 passed, 0 failed |
| `npm run build` | Passes: 35 pages prerendered, sitemap with 36 URLs, offline manifest with 100 files, CSP check passed (37 HTML files, 1 inline script hash) |
| `npm run test:e2e` (Google Chrome) | 124 passed, 0 failed |
| `npm run test:all` (Google Chrome) | Passed |
| `CI=1 PW_BUNDLED_CHROMIUM=1 npm run test:all` | Passed |
| Prerendered HTML vs baseline (36 files, asset names ignored) | **0 content differences**: titles, meta, canonical, JSON-LD and body |
| Canonical URLs vs baseline | Identical on all 35 pages that have one |
| `sitemap.xml` / `robots.txt` vs baseline | Identical, except build-date `<lastmod>` |
| Bundle per route (static imports) | Home 455 KB, BlogPost 465 KB, BlogIndex 457 KB, GrammarIndex 460 KB, Practice 461 KB (none load the packs); GrammarTopic 944 KB, Module 976 KB (both packs); Test 604 KB (questions only). Baseline: BlogPost 453 KB, GrammarTopic 932 KB. |

## Known limitations (outside Phase 0)

- **No real deployment was tested.**
  - Headers, CSP, `cleanUrls` and the service-worker shell were tested on a local server that
    reproduces `vercel.json`.
  - Check them on a Vercel preview deployment before production. The browser's DevTools console
    shows any CSP violation.
- **CI has not run on GitHub yet.** See [CI](#ci).
- **Browsers:** Chrome and Chromium only; not tested in Firefox or Safari/iOS.
- **Not exercised:**
  - Offline font caching (fonts are blocked in tests).
  - Real Gemini generation: only the first request is checked against the CSP, and it gets a
    mocked error.
  - Cross-tab sync between two real tabs.
  - Service-worker updates after a new deploy.
- **Styles:** inline style attributes need `'unsafe-inline'` in `style-src-attr` (875 attributes in
  prerendered HTML). Removing it would mean replacing React style props with classes.
- **Synchronous catalogue.** Progression, badges, stats, localisation and SEO metadata read
  `src/content/catalog.ts` synchronously. When content moves to an Express API, the catalogue must
  be populated from a content snapshot before the app starts, and at build time for prerendering.
- **Pre-existing, unchanged:**
  - Answer keys ship in the bundle and grading is client-side.
  - The learner's Gemini key is in localStorage.
  - The visitor counter is a third-party service.
  - `/module/:id` cannot be server-rendered: `LanguageChooser` reads `document` during render,
    which doesn't matter while lesson pages are client-only.
  - All of these are tracked in `PLATFORM_AUDIT.md`.

## Phase 0 completion criteria

- [x] **Progress has a schema version and migrations.** Unit tests (51), plus a real-browser test
  with legacy data where values are preserved and the original is kept.
- [x] **Imports are validated and exports versioned; legacy backups still import.** Unit tests
  (34), plus browser tests for round trip, legacy file and 5 rejected files with storage unchanged.
- [x] **UI depends on repository interfaces, not localStorage.** `ProgressRepository` and
  `BookmarkRepository` with the same keys; unit and browser tests.
- [x] **Content is read through a backend-agnostic `ContentService` with a static adapter.** The
  architecture test shows no `src/data` imports outside the content layer and no network code in
  the service.
- [x] **Bundle splitting is healthy.** The browser bundle test shows lesson and question data only
  on the routes that use them.
- [x] **Modules have stable slugs, with legacy ids and URLs preserved.** The pinned identity table,
  `/learn/:slug` and `/module/<slug>` redirects, and canonical `/module/:id` are covered by unit
  and browser tests.
- [x] **Grammar topics and course modules are one entity.** `GrammarModule` in
  `src/content/catalog.ts`; unit tests.
- [x] **Security headers are set, with a CSP hash check.** Header tests; build check; 0 CSP
  violations; Gemini, the visitor counter and fonts allowed.
- [x] **Automated tests cover the critical behaviour.** 1,612 unit and 124 browser tests passing.
- [x] **CI runs the full verification.** Workflow added and its steps verified locally; first
  GitHub run pending.
- [x] **No SEO, prerender, PWA, English/Bangla or URL regressions.** Prerendered HTML, canonicals,
  sitemap and robots.txt are identical to the baseline; the offline and language browser tests
  pass.
- [x] **Documentation.** This file.

## Do not change without the tests

- **localStorage key names.** The inline theme script reads `grammar-path:preferences` before
  React loads.
- **The inline theme script.** Any change needs a new CSP hash in `vercel.json`; the build fails
  and prints the hash.
- **Module identity.** Numeric module ids are the progress keys and `/module/:id` is the canonical
  lesson URL. Slugs are pinned in `tests/unit/slugs.test.ts`.
- **Indexed URLs.** `/grammar/:slug` and `/blog/:slug` are indexed by search engines.
- **Offline and service-worker code.** Run `offline.spec.ts` on a fresh build after changing
  `scripts/postbuild.mjs`, `scripts/sw-template.js` or the offline manifest logic.
- **Lesson and question data.** Covered by the parity, integrity and grading tests.
