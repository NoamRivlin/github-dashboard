# Progress & Commits

> Update after EVERY task. Agent: check the box, add timestamp, note deviations.

## Status

| Phase | Status | Done |
|-------|--------|------|
| 0: Scaffold | ✅ Complete | 6/6 |
| 1: API Layer | ✅ Complete | 8/8 |
| 2: UI Pages | ✅ Complete | 9/9 |
| 3: Polish & QA | ⬜ Not Started | 0/7 |

**Current task:** hover-tilt 3D card effects + grey theme complete. Ready for Phase 3.
**Blockers:** None.

---

## Phase 0: Scaffold
- [x] 0.1 — Init project | Vite + React 18.3 + TS scaffolded (downgraded from React 19)
- [x] 0.2 — Install deps | TanStack Router/Query, Axios, Lucide, shadcn (button, card, dialog, badge, skeleton, scroll-area), Tailwind v4. Radix UI via individual @radix-ui/react-* packages (React 18 compatible)
- [x] 0.3 — Dark theme | Blue-tinted dark theme CSS vars from ARCHITECTURE.md, class="dark" on html
- [x] 0.4 — Router setup | File-based routes: __root.tsx, index.tsx (redirect → /repositories), repositories.tsx, developers.tsx. TanStack Router plugin in vite.config.ts. Route tree auto-generated.
- [x] 0.5 — Root layout | __root.tsx has Navbar shell (sticky header, "Github Explorer" title) + Outlet. main.tsx wraps app with QueryClientProvider + RouterProvider. Type-safe router registration.
- [x] 0.6 — QA verify | Playwright: dark theme OK, navbar OK, /repositories renders, /developers renders, redirect from / works, zero console errors

## Phase 1: API Layer
- [x] 1.1 — TS interfaces | Repository, RepositorySearchResponse, Contributor, Developer in types/github.ts
- [x] 1.2 — Axios instance | api/client.ts with baseURL, Accept header, RateLimitError class, 403 interceptor
- [x] 1.3 — API validation | Validated real GitHub API shapes via curl, confirmed license can be null
- [x] 1.4 — Mock data | api/mocks/repositories.ts (10 JS repos), api/mocks/contributors.ts (10 contributors), toggle via VITE_USE_MOCKS
- [x] 1.5 — Service functions | fetchRepositories() (JS repos, per_page=10), fetchContributors(repoFullName, per_page=10)
- [x] 1.6 — Query hooks | useRepositories (10s refetch, keepPreviousData, rate-limit retry), useContributors (on-demand, enabled flag)
- [x] 1.7 — Rate-limit handling | RateLimitError class, no retry on rate-limit, gcTime keeps stale data
- [x] 1.8 — Timestamp hook | useQueryTimestamp reads dataUpdatedAt. All 3 endpoints verified manually via test buttons (repos, developers, contributors)

## Phase 2: UI Pages
- [x] 2.1 — Navbar | flex-col centered on mobile, grid-cols-3 on md+. Title+Code2+UpdatedAtBadge left, Links centered, empty right col. isError badge (amber AlertTriangle on any error).
- [x] 2.2 — RepositoryCard | Responsive widths (85vw/350/420/480px). Stacked detail rows: description paragraph, license row, forks row, issues row. Name+stars flex-col on mobile, sm:flex-row. min-w-0 truncation throughout.
- [x] 2.3 — HorizontalScroll | overflow-x-auto, snap scroll, items-stretch, thin dark scrollbar. Inner px-6 for navbar alignment.
- [x] 2.4 — Repositories page | StatusOverlay + HorizontalScroll + RepositoryCard[] + ContributorsModal. Vertically centered. hasData prop for rate-limit messaging.
- [x] 2.5 — ContributorsModal | shadcn Dialog, isPlaceholderData loading on repo switch, per-repo cache, dark scrollbar, truncated names, green contribution count.
- [x] 2.6 — DeveloperCard | Responsive widths (85vw/350/420/480px). min-w-0 overflow-hidden on CardHeader. Truncated login + repo name + stars. Large centered avatar.
- [x] 2.7 — Developers page | useRepositories dedup, Developer[] mapping, HorizontalScroll, vertically centered. hasData prop.
- [x] 2.8 — StatusOverlay | Loading: responsive skeleton widths. Error: AlertCircle+retry with px-6 py-2. Rate-limited: centered w-fit banner, hasData-aware messaging, always-visible Retry. Empty: message.
- [x] 2.9 — Visual QA | Playwright verified at 1440px, 375px, 287px, 241px. Navbar wraps correctly, cards responsive, truncation works, error states styled.

## Pre-Phase 3: Fetch Optimization
- [x] Opt.1 — localStorage persistence | PersistQueryClientProvider + createAsyncStoragePersister. Entire query cache (repos + contributors) persisted to localStorage, updated after every fetch (1s throttle). maxAge 20h. On refresh/new tab, data loads instantly; stale queries refetch in background.
- [x] Opt.2 — Focus-only polling | refetchIntervalInBackground: false on useRepositories. Background tabs make zero API requests. Polling resumes on tab focus.
- [x] Opt.3 — Contributors gcTime bump | 10min → 30min. Contributor data changes rarely, survives longer in cache and localStorage.

## Pre-Phase 3: Visual Enhancement (hover-tilt)
- [x] HT.1 — Install hover-tilt, TS types, web component import in main.tsx
- [x] HT.2 — Wrap RepositoryCard + DeveloperCard with `<hover-tilt>` web component
- [x] HT.3 — CSS hover-tilt effects: 5-layer neon shadow, idle resting shadow, border glow, ::part() selectors
- [x] HT.4 — Custom gradients: luminance beam (repo cards), aurora sweep (dev cards) via data-gradient attributes
- [x] HT.5 — Grey theme: background hsl(222 18% 20%), darker cards hsl(222 22% 14%), brighter muted-foreground
- [x] HT.6 — Fix card clipping: -my-10 py-10 pb-14 padding trick on HorizontalScroll
- [x] HT.7 — Playwright verification: both pages render, hover effects work, modal functional, zero new errors

## Phase 3: Polish & QA
- [ ] 3.1 — Code review |
- [ ] 3.2 — Rate-limit test |
- [ ] 3.3 — Responsive check |
- [ ] 3.4 — Full walkthrough |
- [ ] 3.5 — Console audit |
- [ ] 3.6 — Performance |
- [ ] 3.7 — Final cleanup |

---

## QA Reports

### Task 0.6 — Scaffold QA
| Scenario | Status | Notes |
|----------|--------|-------|
| Dark theme | ✅ | Blue-tinted dark background, white text |
| Navbar | ✅ | Sticky header, "Github Explorer" title |
| / redirect | ✅ | Redirects to /repositories |
| /repositories | ✅ | Renders heading |
| /developers | ✅ | Renders heading |
| Console errors | ✅ | Zero errors (only React DevTools info msg) |

### Task 1.8 — API Verification
| Scenario | Status | Notes |
|----------|--------|-------|
| Repositories fetch | ✅ | Top 10 JS repos logged, sorted by stars desc |
| Developers derivation | ✅ | 10 developers derived from repo owners, same query (TanStack Query dedup) |
| Contributors fetch | ✅ | On-demand fetch for ryanmcdermott/clean-code-javascript, contributors logged |
| TypeScript | ✅ | Zero errors (`npx tsc --noEmit`) |

### Phase 2 — Manual Visual Check (user verified at localhost:5173)
| Scenario | Status | Notes |
|----------|--------|-------|
| Navbar layout | ✅ | Title + timestamp left, links centered, active state works |
| Repository cards | ✅ | 10 cards render, all fields shown, horizontal scroll works |
| Contributors modal | ✅ | Opens per repo, loading skeletons on switch, dark scrollbar, caches per repo |
| Developers page | ✅ | Cards render with avatar, name, repo+stars |
| TypeScript | ✅ | Zero errors (`npx tsc --noEmit`) |
| UI polish needed | ⚠️ | User wants further adjustments to card sizing, layout, etc. |

### Task 2.9 — Responsive UI Refactor & Visual QA (Playwright)
| Scenario | Status | Notes |
|----------|--------|-------|
| Navbar 1440px | ✅ | Grid-cols-3: title+badge left, links centered |
| Navbar 375px | ✅ | Flex-col: title+badge centered, links below centered |
| Navbar 287px | ✅ | Wraps correctly, no overflow |
| Repo cards responsive | ✅ | 85vw on mobile, scales up at sm/lg/xl breakpoints |
| Dev cards responsive | ✅ | Same breakpoints, truncation works for long names |
| Dev card 241px | ✅ | Long login/repo names truncate, no layout break |
| Edge-to-edge scroll | ✅ | Cards extend full viewport, px-6 inner alignment |
| Stacked card rows | ✅ | Each detail (license, forks, issues) on own row |
| Rate-limit state | ✅ | Centered banner, hasData-aware message, Retry always visible |
| Error state | ✅ | AlertCircle + Retry, proper padding |
| StatusOverlay skeletons | ✅ | Responsive widths matching card breakpoints |
| TypeScript | ✅ | Zero errors (`npx tsc --noEmit`) |

### hover-tilt Enhancement — Playwright QA
| Scenario | Status | Notes |
|----------|--------|-------|
| Grey theme renders | ✅ | Background #2b2f3a, cards darker, text readable |
| Repo cards hover | ✅ | Blue border glow, neon shadow, scale 1.05, tilt active |
| Dev cards hover | ✅ | Same effects with cyan aurora sweep gradient |
| Card clipping | ✅ | Fixed — padding trick prevents overflow cut |
| Custom gradients applied | ✅ | data-gradient attrs set, CSS vars computed correctly |
| Contributors modal | ✅ | Opens, shows data, closes — unaffected by changes |
| Console errors | ✅ | Zero new errors (only pre-existing Radix ref warning) |
| TypeScript | ✅ | Zero errors (`npx tsc --noEmit`) |

---

## Deviations Log
| Task | Deviation | Reason |
|------|-----------|--------|
| 2.6, 2.7 | DeveloperCard uses HorizontalScroll instead of Grid | Mockup shows horizontal scroll for both pages |
| 2.1 | Navbar uses grid-cols-3 with title+timestamp on left (not UpdatedAt on right) | Matches mockup layout more closely |
| 2.2, 2.6 | Cards responsive (85vw/350/420/480px) instead of fixed w-[400px] | User feedback: larger on wide screens, responsive on small |
| 2.2 | Each card detail on own row (not grouped) | User feedback: more symmetrical layout matching mockup |
| 2.5 | ContributorsModal uses isPlaceholderData for loading state | Prevents flicker when switching repos while keeping per-repo cache |
| 1.5 | fetchRepositories sorts client-side by stargazers_count | Prevents jarring reorder on 10s refetch |
| layout | Removed max-w-7xl from main, edge-to-edge scroll | Mockup shows cards extending to viewport edge |
| 2.1 | UpdatedAtBadge uses isError (generic) not isRateLimited | User simplification: amber indicator on any error |
| 2.8 | StatusOverlay has hasData prop, rate-limit always shows Retry | User preference: always offer retry action |
| HT | CSS element selectors instead of class selectors on hover-tilt | React 18 sets className as `classname` attribute on web components — classes don't apply |
| HT | data-gradient attrs + CSS attr selectors for custom gradients | Inline style on web component causes `setProperty` crash in React 18 |
| HT | Theme shifted from near-black navy to gentle grey | User request: make shadows/effects visible, match hover-tilt site aesthetic |

---

## Commit Log

Format: conventional commits
```
<type>(<scope>): <short description>

<body — what was done, key decisions>

Tasks: X.X–X.X
```

### Phase 0 Commit — ⬜ Pending
```
<!-- filled after phase 0 -->
```
Files changed:

### Phase 1 Commit — ✅
```
feat(api): implement API layer with types, hooks, mocks, and rate-limit handling
```
Files changed:
- `src/types/github.ts` — Repository, RepositorySearchResponse, Contributor, Developer interfaces
- `src/api/client.ts` — Axios instance, RateLimitError class, 403 interceptor
- `src/api/github.ts` — fetchRepositories (JS repos), fetchContributors (per_page=10)
- `src/api/mocks/repositories.ts` — 10 realistic mock JS repos
- `src/api/mocks/contributors.ts` — 10 realistic mock contributors
- `src/api/mocks/index.ts` — VITE_USE_MOCKS toggle
- `src/hooks/queries/useRepositories.ts` — 10s refetch, keepPreviousData, rate-limit retry
- `src/hooks/queries/useContributors.ts` — on-demand, enabled flag
- `src/hooks/queries/useQueryTimestamp.ts` — reads dataUpdatedAt for navbar
- `src/routes/repositories.tsx` — temp test buttons (repos + contributors)
- `src/routes/developers.tsx` — temp test button (developers derived from repos)
- `.ai-docs/API_STRATEGY.md` — updated endpoints, contributor per_page, developer derivation
- `.ai-docs/ARCHITECTURE.md` — clarified shared query pattern
- `.ai-docs/TASKS.md` — updated task 2.7 description

### Phase 2 Commit (initial) — ✅
```
feat(ui): implement Phase 2 UI pages — navbar, cards, scroll, modal, status overlay
```
Files changed:
- `src/components/Navbar.tsx` — grid layout, Router Links, UpdatedAtBadge, rate-limit indicator
- `src/components/UpdatedAtBadge.tsx` — 24H timestamp, Clock icon, amber AlertTriangle
- `src/components/RepositoryCard.tsx` — w-[400px], truncation, all fields, View Contributors button
- `src/components/HorizontalScroll.tsx` — overflow-x-auto, snap, items-stretch, dark scrollbar
- `src/components/ContributorsModal.tsx` — shadcn Dialog, isPlaceholderData loading, dark scrollbar
- `src/components/DeveloperCard.tsx` — w-[400px], avatar, name, repo+stars
- `src/components/StatusOverlay.tsx` — loading skeletons, error+retry, rate-limit banner, empty
- `src/routes/__root.tsx` — uses Navbar component
- `src/routes/repositories.tsx` — composed page with cards, scroll, modal, vertical centering
- `src/routes/developers.tsx` — composed page with dev cards, scroll, vertical centering
- `src/hooks/queries/useQueryTimestamp.ts` — 24H format (en-GB, hour12: false)
- `src/api/github.ts` — client-side sort by stargazers_count for stable ordering

### Phase 2 Commit (refactor) — ✅
```
refactor(ui): responsive layout, stacked card rows, edge-to-edge scroll, error states
```
Files changed:
- `src/routes/__root.tsx` — removed max-w-7xl from main, header py-3 instead of h-14
- `src/components/Navbar.tsx` — flex-col centered on mobile, grid-cols-3 on md+, isError badge
- `src/components/UpdatedAtBadge.tsx` — renamed isRateLimited → isError for generic error indicator
- `src/components/HorizontalScroll.tsx` — px-6 inner alignment with navbar
- `src/components/RepositoryCard.tsx` — responsive widths (85vw/350/420/480px), stacked detail rows, min-w-0 truncation
- `src/components/DeveloperCard.tsx` — responsive widths, min-w-0 overflow-hidden on CardHeader, truncation
- `src/components/StatusOverlay.tsx` — hasData prop, responsive skeleton widths, centered rate-limit banner, always-visible Retry
- `src/routes/repositories.tsx` — hasData prop to StatusOverlay
- `src/routes/developers.tsx` — hasData prop to StatusOverlay
- `src/hooks/queries/useRepositories.ts` — minor cleanup
- `src/api/mocks/index.ts` — mock toggle change

### Pre-Phase 3 Commit (fetch optimization) — ✅
```
feat(query): add localStorage persistence and focus-only polling
```
Files changed:
- `package.json` — added @tanstack/query-async-storage-persister, @tanstack/react-query-persist-client
- `src/main.tsx` — PersistQueryClientProvider, createAsyncStoragePersister, global gcTime 10min, maxAge 20h
- `src/hooks/queries/useRepositories.ts` — refetchIntervalInBackground: false, removed per-query gcTime
- `src/hooks/queries/useContributors.ts` — gcTime bumped to 30min
- `.ai-docs/API_STRATEGY.md` — updated query config, rate-limit table, key decisions
- `.ai-docs/PROGRESS.md` — added optimization entries

### hover-tilt Enhancement Commit (initial) — ✅
```
feat(ui): add hover-tilt 3D card effects with grey theme
```
Files changed:
- `package.json` — added hover-tilt ^1.0.0
- `src/types/hover-tilt.d.ts` — new: JSX IntrinsicElements types for web component
- `src/main.tsx` — import hover-tilt/web-component registration
- `src/index.css` — hover-tilt CSS (::part selectors, 3-layer blue shadow, border glow)
- `src/components/RepositoryCard.tsx` — wrapped with `<hover-tilt>`, removed old hover classes
- `src/components/DeveloperCard.tsx` — wrapped with `<hover-tilt>`, removed old hover classes

### hover-tilt Enhancement Commit (enhanced) — ✅
```
feat(ui): grey theme, enhanced hover-tilt effects, fix card clipping
```
Files changed:
- `src/index.css` — grey theme colors (bg hsl(222 18% 20%), card hsl(222 22% 14%)), 5-layer neon shadow, idle resting shadow, luminance-beam + aurora-sweep custom gradient CSS
- `src/components/HorizontalScroll.tsx` — -my-10 py-10 pb-14 clipping fix
- `src/components/RepositoryCard.tsx` — data-gradient="luminance-beam", scale-factor=1.05, glare-intensity=0.4, blend-mode=overlay
- `src/components/DeveloperCard.tsx` — data-gradient="aurora-sweep", scale-factor=1.05, glare-intensity=0.4, blend-mode=overlay
- `.ai-docs/ARCHITECTURE.md` — updated theme, component specs, tech stack
- `.ai-docs/PROGRESS.md` — added hover-tilt entries + commit log
- `.ai-docs/TASKS.md` — added hover-tilt task section

### Phase 3 Commit — ⬜ Pending
```
<!-- filled after phase 3 -->
```
Files changed:
