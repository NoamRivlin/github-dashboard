# Tasks

> Pick the next `TODO` task whose dependencies are all `DONE`.
> Each task = one focused unit of work. Update `PROGRESS.md` after each.
> **Commit after every subtask.** Big changes/refactors → commit BEFORE and AFTER.

---

## Phase 0: Scaffold

| # | Task | Role | Deps | Key Details |
|---|------|------|------|-------------|
| 0.1 | Init Vite + React + TS | Architect | — | `npm create vite@latest`, verify it compiles |
| 0.2 | Install all deps | Architect | 0.1 | tanstack query/router, axios, lucide, shadcn init + components (button, card, dialog, badge, skeleton, scroll-area). **Context7:** verify shadcn init cmd + TanStack Router install |
| 0.3 | Configure dark theme | Architect | 0.2 | CSS vars from `ARCHITECTURE.md` design system. Dark default, blue accents |
| 0.4 | Set up TanStack Router | Architect | 0.2 | File-based routes: `__root`, `index` (→ /repositories), `repositories`, `developers`. **Context7:** verify router setup |
| 0.5 | Root layout | Architect | 0.3, 0.4 | `__root.tsx` with Navbar shell + `<Outlet/>`, wrap with QueryClientProvider |
| 0.6 | Verify clean start | QA | 0.5 | **Playwright:** dev server runs, both routes render, zero console errors |

→ **COMMIT → STOP → REVIEW**

---

## Phase 1: API Layer

| # | Task | Role | Deps | Key Details |
|---|------|------|------|-------------|
| 1.1 | Define TS interfaces | Architect | 0.6 | `types/github.ts`: Repository, RepositorySearchResponse, Contributor. See `API_STRATEGY.md` |
| 1.2 | Axios instance | Implementer | 1.1 | `api/client.ts` with baseURL, Accept header, rate-limit interceptor (403 → RateLimitError) |
| 1.3 | Validate API shapes | Implementer | 1.2 | Make real calls, compare responses to interfaces, fix mismatches (esp. nullable fields) |
| 1.4 | Mock data | Implementer | 1.3 | `api/mocks/` — realistic data matching validated types exactly. Toggle via `VITE_USE_MOCKS` |
| 1.5 | API service functions | Implementer | 1.2, 1.4 | `api/github.ts`: `fetchRepositories()`, `fetchContributors(owner, repo)`. Check mock toggle |
| 1.6 | Query hooks | Implementer | 1.5 | `useRepositories` (10s refetch, keepPreviousData), `useContributors` (enabled flag, on-demand). **Context7:** verify TanStack Query v5 options |
| 1.7 | Rate-limit handling | Implementer | 1.6 | No retry on RateLimitError, gcTime keeps stale data, rate-limit status flag for UI |
| 1.8 | Timestamp hook | Implementer | 1.6 | `useQueryTimestamp` — reads `dataUpdatedAt`, formats for navbar display |

→ **COMMIT → STOP → REVIEW**

---

## Phase 2: UI Pages

| # | Task | Role | Deps | Key Details |
|---|------|------|------|-------------|
| 2.1 | Navbar | Implementer+Designer | 1.8 | TanStack Router `<Link>`, active state, UpdatedAtBadge, rate-limit indicator. See design system |
| 2.2 | RepositoryCard | Implementer+Designer | 1.6 | All fields: name (link), stars, desc, license (null-safe), forks, issues, "View Contributors" btn. Lucide icons |
| 2.3 | HorizontalScroll | Implementer+Designer | — | `overflow-x-auto`, snap scroll, thin custom scrollbar, no animations |
| 2.4 | Repositories page | Implementer | 2.1–2.3 | Compose: useRepositories → HorizontalScroll → RepositoryCard[]. Loading skeletons |
| 2.5 | ContributorsModal | Implementer+Designer | 2.4 | shadcn Dialog, useContributors (enabled on open). Avatars, names, contribution count. **Context7:** verify Dialog API |
| 2.6 | DeveloperCard | Implementer+Designer | 1.6 | `w-[360px]` fixed-width card for horizontal scroll. Top: developer name (bold), sub-line: repo name – stars. Bottom: large avatar (`w-24 h-24`). Matches mockup layout |
| 2.7 | Developers page | Implementer | 2.1, 2.6 | Derive developers from useRepositories (owner = developer). HorizontalScroll layout (same pattern as Repositories page, per mockup) |
| 2.8 | StatusOverlay | Implementer+Designer | 2.4, 2.7 | Shared: loading (skeletons), error (icon + retry), rate-limited (amber banner), empty. Used by both pages |
| 2.9 | Visual verification | QA | 2.8 | **Playwright:** both pages, modal, scroll, timestamps, console check |

→ **COMMIT → STOP → REVIEW**

---

## Phase 3: Polish & QA

| # | Task | Role | Deps | Key Details |
|---|------|------|------|-------------|
| 3.1 | Code review | Reviewer | 2.9 | Full audit: DRY, naming, no comments, no `any`, conventions. See reviewer checklist in `MASTER_PLAN.md` |
| 3.2 | Rate-limit test | QA | 3.1 | Toggle mocks → simulate 403. Verify stale data displays, indicator shows, no crash |
| 3.3 | Responsive check | QA | 3.1 | **Playwright:** viewports 1440/1024/768px. No broken layouts |
| 3.4 | Full walkthrough | QA | 3.2, 3.3 | E2E: load → repos → scroll → modal → close → devs → verify timestamp updates |
| 3.5 | Console + network audit | QA | 3.4 | Zero console errors. No redundant API calls. 10s interval correct, no reset on nav |
| 3.6 | Performance | Reviewer | 3.5 | Re-renders, memo usage, query efficiency, contributors only fetched when modal open |
| 3.7 | Final cleanup | Reviewer | 3.6 | Remove unused imports/dead code, final DRY pass, update PROGRESS.md |

→ **COMMIT → FINAL REVIEW**
