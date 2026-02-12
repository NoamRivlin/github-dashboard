# Architecture & Conventions

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | React 18.3 (functional components, hooks only) |
| Language | TypeScript strict, no `any` |
| Routing | TanStack Router (file-based) |
| Data Fetching | TanStack Query (cache + refetch) |
| HTTP | Axios (single centralized instance) |
| UI Components | shadcn/ui (dark theme) |
| Icons | Lucide React |
| Styling | Tailwind CSS |
| Build | Vite |
| State Mgmt | None — TanStack Query cache is sufficient |

---

## Folder Structure

```
src/
├── api/
│   ├── client.ts              # Axios instance + interceptors
│   ├── github.ts              # API service functions
│   └── mocks/
│       ├── repositories.ts    # Mock repo data
│       ├── contributors.ts    # Mock contributor data
│       └── index.ts           # Mock toggle
├── components/
│   ├── ui/                    # shadcn primitives (auto-generated)
│   ├── Navbar.tsx
│   ├── RepositoryCard.tsx
│   ├── DeveloperCard.tsx
│   ├── ContributorsModal.tsx
│   ├── HorizontalScroll.tsx
│   ├── UpdatedAtBadge.tsx
│   └── StatusOverlay.tsx      # Shared loading/error/rate-limit
├── hooks/
│   └── queries/
│       ├── useRepositories.ts
│       ├── useContributors.ts
│       └── useQueryTimestamp.ts
├── types/
│   └── github.ts              # ALL interfaces here
├── lib/
│   └── utils.ts               # cn() helper
├── routes/
│   ├── __root.tsx             # Layout (Navbar + Outlet)
│   ├── index.tsx              # Redirect → /repositories
│   ├── repositories.tsx
│   └── developers.tsx
├── styles/
│   └── globals.css
└── main.tsx
```

---

## Key Patterns

**Data flow:** `Component → useQuery hook → API service fn → Axios instance → GitHub API`

- ALL HTTP through `api/client.ts` — never import axios elsewhere
- ALL server data through query hooks — components never call API directly
- ALL types in `types/github.ts` — no inline type definitions
- Pages are thin — compose components + wire hooks
- Developers page derives data from the repos query (no extra API call)

## Naming

| Item | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `RepositoryCard.tsx` |
| Hooks | camelCase, `use` prefix | `useRepositories.ts` |
| Types | PascalCase | `Repository`, `Contributor` |
| API fns | camelCase, verb prefix | `fetchRepositories()` |
| No comments | Code is self-explanatory | Clear names instead |

## DRY Checklist — Read Before Creating Any File
- [ ] Does a similar component/hook/utility already exist?
- [ ] Am I importing axios directly instead of `api/client.ts`?
- [ ] Am I fetching data in a component instead of a query hook?
- [ ] Am I duplicating error/loading UI instead of using `StatusOverlay`?
- [ ] Am I defining types outside `types/github.ts`?

---

## Design System

### Theme — Dark with Blue Accents

```css
:root {
  --background:         222.2 84% 4.9%;      /* Near black, blue tint */
  --foreground:         210 40% 98%;          /* Off-white */
  --card:               222.2 84% 6.9%;      /* Slightly lighter */
  --card-foreground:    210 40% 98%;
  --muted:              217.2 32.6% 12%;
  --muted-foreground:   215 20.2% 55%;
  --primary:            217.2 91.2% 59.8%;   /* Vivid blue #3B82F6 */
  --primary-foreground: 222.2 84% 4.9%;
  --secondary:          217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --accent:             217.2 32.6% 17.5%;
  --accent-foreground:  210 40% 98%;
  --border:             217.2 32.6% 17.5%;
  --input:              217.2 32.6% 17.5%;
  --ring:               224.3 76.3% 48%;
  --destructive:        0 62.8% 50%;
  --destructive-foreground: 210 40% 98%;
  --radius: 0.625rem;
}
```

### Typography
System font stack (shadcn default). Page titles: `text-2xl font-bold`. Card titles: `text-lg font-semibold`. Body: `text-sm`. Meta: `text-xs text-muted-foreground`.

### Layout Rules
- Max width: `max-w-7xl mx-auto`, page padding: `px-6 py-6`
- **No animations** — no scroll animations, parallax, transitions, auto-scroll
- Subtle hover only: opacity/border changes on cards and buttons
- Dark mode only (no theme toggle)

### Component Specs

**Navbar:** Fixed top, `bg-background/80 backdrop-blur-sm border-b border-border`, h-14. Logo/title left, nav links center, UpdatedAt right. Active link: `text-primary`. Rate-limit: amber dot near timestamp.

**RepositoryCard:** shadcn Card, `w-[360px]` fixed for scroll. Shows: name (link), stars, description (2-3 line clamp), license (handle null), forks, issues, "View Contributors" button (`variant="outline"`). Hover: `border-primary/50`.

**HorizontalScroll:** `overflow-x-auto`, `scroll-snap-type: x mandatory`, `gap-4`. Thin custom scrollbar. No scroll animations.

**ContributorsModal:** shadcn Dialog. Avatar `rounded-full w-8 h-8`, list items `flex items-center gap-3 py-2 border-b border-border/50`.

**DeveloperCard:** shadcn Card, `w-[360px]` fixed for horizontal scroll (same pattern as RepositoryCard). Layout top-to-bottom: developer name (bold), "Repository He Made – stars amount" sub-line, large avatar `rounded-full w-24 h-24 mx-auto` in bottom portion. Hover: `border-primary/50`. Used inside `HorizontalScroll` container on Developers page.

**StatusOverlay:** Loading → skeleton cards. Error → `AlertCircle` + retry. Rate-limited → amber banner "Using cached data". Empty → friendly message.

### Icons (Lucide React)

Stars→`Star`, Forks→`GitFork`, Issues→`CircleDot`, License→`Scale`, Link→`ExternalLink`, Time→`Clock`, Contributors→`Users`, Error→`AlertCircle`, RateLimit→`AlertTriangle`, Logo→`Code2`. Default: `w-4 h-4 text-muted-foreground`. Stars: `text-yellow-500`.

### Avoid
Custom fonts, gradient backgrounds, scroll animations, parallax, complex hover animations, light mode toggle, overly rounded corners.

---

## MCP Tools

### Context7 — Library Docs
**When:** Before using any TanStack Router, TanStack Query, or shadcn API.
**How:** Resolve library → fetch docs for the specific feature. Never rely on training data for API signatures.

### Playwright — Visual QA & Debugging
**When:** After any UI task, and during QA phase.
**Workflow:**
1. `playwright_navigate` → `http://localhost:5173`
2. `playwright_screenshot` → verify layout
3. Check console for errors (zero tolerance for `console.error`)
4. Test interactions: nav links, scroll, modal open/close
5. Screenshot after each interaction

### QA Test Scenarios

| # | Scenario | Verify |
|---|----------|--------|
| 1 | Initial load | Dark theme, navbar, redirect to /repositories, no console errors |
| 2 | Repositories page | 10 cards in horizontal scroll, all fields shown |
| 3 | Contributors modal | Opens on button click, shows avatars/names, closes cleanly |
| 4 | Navigation | Both pages work, no timer reset on page switch |
| 5 | Developers page | Horizontal scroll of cards with name, repo+stars, avatar |
| 6 | Updated-at timestamp | Changes every ~10s, persists across navigation |
| 7 | Rate-limit fallback | Stale data shown, amber indicator, no crash |
| 8 | Responsive | No broken layouts at 1440/1024/768px |

**Console policy:** Zero `console.error` in normal operation. Rate-limit errors caught by interceptor, not thrown. React StrictMode warnings are acceptable.

**QA report format** — add to `PROGRESS.md`:
```
| Scenario | Status | Notes |
|----------|--------|-------|
| Initial Load | ✅ | No errors |
| ...          | ⚠️ | Needs fix at 768px |
```
