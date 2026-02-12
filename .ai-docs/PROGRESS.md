# Progress & Commits

> Update after EVERY task. Agent: check the box, add timestamp, note deviations.

## Status

| Phase | Status | Done |
|-------|--------|------|
| 0: Scaffold | ✅ Complete | 6/6 |
| 1: API Layer | ✅ Complete | 8/8 |
| 2: UI Pages | ⬜ Not Started | 0/9 |
| 3: Polish & QA | ⬜ Not Started | 0/7 |

**Current task:** Phase 1 complete — ready for Phase 2
**Blockers:** None

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
- [ ] 2.1 — Navbar |
- [ ] 2.2 — RepositoryCard |
- [ ] 2.3 — HorizontalScroll |
- [ ] 2.4 — Repositories page |
- [ ] 2.5 — ContributorsModal |
- [ ] 2.6 — DeveloperCard |
- [ ] 2.7 — Developers page |
- [ ] 2.8 — StatusOverlay |
- [ ] 2.9 — Visual QA |

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

---

## Deviations Log
| Task | Deviation | Reason |
|------|-----------|--------|
| 2.6, 2.7 | DeveloperCard uses HorizontalScroll instead of Grid | Mockup shows horizontal scroll for both pages |

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

### Phase 2 Commit — ⬜ Pending
```
<!-- filled after phase 2 -->
```
Files changed:

### Phase 3 Commit — ⬜ Pending
```
<!-- filled after phase 3 -->
```
Files changed:
