# Progress & Commits

> Update after EVERY task. Agent: check the box, add timestamp, note deviations.

## Status

| Phase | Status | Done |
|-------|--------|------|
| 0: Scaffold | ✅ Complete | 6/6 |
| 1: API Layer | ⬜ Not Started | 0/8 |
| 2: UI Pages | ⬜ Not Started | 0/9 |
| 3: Polish & QA | ⬜ Not Started | 0/7 |

**Current task:** Phase 0 complete — ready for Phase 1
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
- [ ] 1.1 — TS interfaces |
- [ ] 1.2 — Axios instance |
- [ ] 1.3 — API validation |
- [ ] 1.4 — Mock data |
- [ ] 1.5 — Service functions |
- [ ] 1.6 — Query hooks |
- [ ] 1.7 — Rate-limit handling |
- [ ] 1.8 — Timestamp hook |

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

### Phase 1 Commit — ⬜ Pending
```
<!-- filled after phase 1 -->
```
Files changed:

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
