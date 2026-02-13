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
| 2.1 | Navbar | ✅ Done | 1.8 | flex-col centered on mobile, grid-cols-3 on md+. Title+Code2+UpdatedAtBadge left, Links centered. isError badge (generic). |
| 2.2 | RepositoryCard | ✅ Done | 1.6 | Responsive (85vw/350/420/480px), stacked detail rows, name+stars flex-col→sm:flex-row, min-w-0 truncation. Hover border-primary/50 |
| 2.3 | HorizontalScroll | ✅ Done | — | overflow-x-auto, snap scroll, items-stretch, thin dark scrollbar, inner px-6 alignment |
| 2.4 | Repositories page | ✅ Done | 2.1–2.3 | StatusOverlay (hasData) + HorizontalScroll + RepositoryCards + ContributorsModal. Vertically centered. |
| 2.5 | ContributorsModal | ✅ Done | 2.4 | shadcn Dialog, isPlaceholderData for loading on repo switch, per-repo cache, dark scrollbar, truncated names, green contribution count |
| 2.6 | DeveloperCard | ✅ Done | 1.6 | Responsive (85vw/350/420/480px), min-w-0 overflow-hidden on CardHeader, truncated login+repo. Large centered avatar. |
| 2.7 | Developers page | ✅ Done | 2.1, 2.6 | useRepositories dedup, Developer[] mapping, HorizontalScroll, vertically centered, hasData prop |
| 2.8 | StatusOverlay | ✅ Done | 2.4, 2.7 | Responsive skeleton widths, hasData-aware rate-limit messaging, always-visible Retry, proper padding on all states. Shared. |
| 2.9 | Visual verification | ✅ Done | 2.8 | Playwright verified at 1440/375/287/241px. Responsive layout, truncation, error states all correct. |

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
