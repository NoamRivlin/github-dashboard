# Progress & Commits

> Update after EVERY task. Agent: check the box, add timestamp, note deviations.

## Status

| Phase | Status | Done |
|-------|--------|------|
| 0: Scaffold | ✅ Complete | 6/6 |
| 1: API Layer | ✅ Complete | 8/8 |
| 2: UI Pages | 🔶 In Progress | 8/9 (2.9 pending — Playwright blocked by Chrome conflict) |
| 3: Polish & QA | ⬜ Not Started | 0/7 |

**Current task:** Phase 2 components built (2.1–2.8), UI refinements applied. User wants more UI changes before 2.9 QA.
**Blockers:** Playwright MCP can't launch while system Chrome is open. Config updated to use bundled Chromium (`--browser chromium` in `.mcp.json`) but needs session restart.

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
- [x] 2.1 — Navbar | Grid layout: Code2 icon + "Github Explorer" + UpdatedAtBadge (24H) on left, TanStack Router Links centered (activeProps border + text-primary), empty right col. Rate-limit amber AlertTriangle.
- [x] 2.2 — RepositoryCard | w-[400px] card with truncated name (link + ExternalLink icon), stars (yellow), line-clamp-3 description with title tooltip, license/forks/issues row, "View Contributors" outline button at bottom via flex-1 on CardContent.
- [x] 2.3 — HorizontalScroll | overflow-x-auto, scroll-snap-type x mandatory, items-stretch for equal card heights, thin dark custom scrollbar (bg-muted track, bg-muted-foreground/30 thumb).
- [x] 2.4 — Repositories page | Composes StatusOverlay + HorizontalScroll + RepositoryCard[] + ContributorsModal. Vertically centered via min-h-[calc(100vh-8rem)] flex justify-center.
- [x] 2.5 — ContributorsModal | shadcn Dialog, controlled open via repoFullName state. Uses isPlaceholderData to show loading skeletons when switching repos (prevents stale data flicker). Dark scrollbar. Contributor avatars, truncated names, green contribution count.
- [x] 2.6 — DeveloperCard | w-[400px] card, truncated login + repo name + stars, large centered avatar (w-24 h-24 rounded-full). flex-1 on content for consistent height.
- [x] 2.7 — Developers page | Derives Developer[] from useRepositories (TanStack Query dedup). HorizontalScroll layout. Vertically centered.
- [x] 2.8 — StatusOverlay | Loading: 5 skeleton cards (w-[400px]). Error: AlertCircle + retry button. Rate-limited: amber banner. Empty: friendly message. Shared by both pages.
- [ ] 2.9 — Visual QA | **Blocked:** Playwright can't launch (Chrome conflict). Config updated to Chromium, awaiting session restart. Manual visual check done by user.

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

---

## Deviations Log
| Task | Deviation | Reason |
|------|-----------|--------|
| 2.6, 2.7 | DeveloperCard uses HorizontalScroll instead of Grid | Mockup shows horizontal scroll for both pages |
| 2.1 | Navbar uses grid-cols-3 with title+timestamp on left (not UpdatedAt on right) | Matches mockup layout more closely |
| 2.2, 2.6 | Cards w-[400px] instead of w-[360px] | User feedback: cards should be bigger |
| 2.5 | ContributorsModal uses isPlaceholderData for loading state | Prevents flicker when switching repos while keeping per-repo cache |
| 1.5 | fetchRepositories sorts client-side by stargazers_count | Prevents jarring reorder on 10s refetch |

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

### Phase 2 Commit — 🔶 In Progress
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
- `.ai-docs/PROGRESS.md` — updated Phase 2 tasks
- `.ai-docs/ARCHITECTURE.md` — updated card widths, navbar layout, modal behavior
- `.ai-docs/TASKS.md` — updated task details

### Phase 3 Commit — ⬜ Pending
```
<!-- filled after phase 3 -->
```
Files changed:
