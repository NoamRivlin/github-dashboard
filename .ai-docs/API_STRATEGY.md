# API Strategy

## Endpoints

| Endpoint | Purpose | Refetch |
|----------|---------|---------|
| `GET /search/repositories?q=language:javascript&sort=stars&order=desc&per_page=10` | Top 10 JS repos | 10s interval |
| `GET /repos/{owner}/{repo}/contributors?per_page=80` | Repo contributors (capped at 80) | On-demand (modal open) |

**Developers page** — derived from the same top 10 JS repos query (no separate endpoint). Both pages share the same TanStack Query cache via `queryKey: ['repositories']`, so only one API call is made:
- `owner.login` → developer name
- `name` → repo name
- `stargazers_count` → stars in that repo
- `owner.avatar_url` → developer profile image
- Same developer may appear more than once if they own multiple top repos
- List is ordered by stars (desc) via the API `sort=stars&order=desc` parameter

---

## Implementation Order

### 1. Make Real Calls First
Before any abstraction, hit the actual endpoints and study the response:
```ts
const res = await fetch('https://api.github.com/search/repositories?q=language:javascript&sort=stars&order=desc&per_page=10');
const data = await res.json();
console.log(JSON.stringify(data.items[0], null, 2));
```
This reveals the exact shape, nullable fields (license is often null), and nested structures.

### 2. Define Clear Interfaces
Based on real responses — only fields we display:
```ts
// types/github.ts
interface Repository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  license: { name: string } | null;
  owner: { login: string; avatar_url: string };
}

interface RepositorySearchResponse {
  total_count: number;
  items: Repository[];
}

interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
  contributions: number;
}

// Derived from the same top 10 JS repos query — NOT a separate API call
// Each repo maps to one developer entry (same owner can appear multiple times)
interface Developer {
  login: string;        // owner.login
  avatar_url: string;   // owner.avatar_url
  repoName: string;     // repo.name
  repoStars: number;    // repo.stargazers_count
}
```

---

## API Layer

```ts
// api/client.ts — just the Axios instance + error class, NO interceptors
const apiClient = axios.create({
  baseURL: 'https://api.github.com',
  headers: { Accept: 'application/vnd.github.v3+json' },
});
export class RateLimitError extends Error { isSecondary: boolean; remaining: number | null; limit: number | null }

// lib/api-utils.ts — explicit helpers (no hidden side effects)
getRateLimit(headers)       // → { remaining, limit } | null
asRateLimitError(error)     // → RateLimitError | null (detects 403/429 + "rate limit" in message, extracts rate limit headers from error response)

// api/github.ts — returns full AxiosResponse, converts rate limit errors explicitly
function rethrow(error: unknown): never {
  throw asRateLimitError(error) ?? error
}
export async function fetchRepositories(signal?) {
  try { return await apiClient.get(...) }
  catch (error) { rethrow(error) }
}

// hooks read headers directly — no mutable globals
const status = useRateLimitStatus(query.error, query.data?.headers)
```

### ETag / Conditional Requests
ETags do **NOT** save rate limit for unauthenticated requests. Per GitHub docs: "Making a conditional request does not count against your primary rate limit if a 304 response is returned **and the request was made while correctly authorized with an Authorization header**." Since this project is unauthenticated, ETags provide zero rate limit benefit.

---

## TanStack Query Config

**Repositories** (polled):
```ts
{
  queryKey: ['repositories'],
  queryFn: ({ signal }) => fetchRepositories(signal),
  refetchInterval: REPOS_REFETCH_INTERVAL,    // 10s fixed
  refetchIntervalInBackground: false,          // Stop polling when tab is unfocused
  staleTime: REPOS_STALE_TIME,                // 10s
  placeholderData: keepPreviousData,           // Show old data during refetch
  retry: false,                                // No retries (rate limit or otherwise)
}
```

**Contributors** (on-demand):
```ts
{
  queryKey: ['contributors', repoFullName],
  queryFn: ({ signal }) => fetchContributors(repoFullName, signal),
  enabled,                              // Only when modal is open
  staleTime: CONTRIBUTORS_STALE_TIME,   // 5 min
  gcTime: CONTRIBUTORS_GC_TIME,         // 30 min — contributor data changes rarely
  placeholderData: keepPreviousData,
  retry: false,                          // No retries
}
```

**QueryClient defaults** (main.tsx):
```ts
gcTime: 10 * 60 * 1000                 // 10 min global default
```

**Persistence** (main.tsx):
```ts
PersistQueryClientProvider + createAsyncStoragePersister({
  storage: window.localStorage          // Entire cache persisted, updated after every fetch (1s throttle)
})
persistOptions: { maxAge: 20 * 60 * 60 * 1000 }  // 20h — prefer stale data over no data
```

### Key Decisions
- **Single repos query shared** between Repositories page and Developers page (zero extra calls)
- **Contributors cached per repo** — same modal opened twice doesn't re-fetch within staleTime. `isPlaceholderData` used in UI to show loading skeletons instead of stale data from a different repo
- **Contributors capped at 80** — single request with `per_page=80` (constant `CONTRIBUTORS_PER_PAGE`). Avoids pagination loops that drain rate limit. Modal header shows `80+` when response hits the cap
- **refetchInterval is fixed 10s** — doesn't reset on navigation between pages
- **retry: false on all queries** — simplified from conditional retry. Rate-limited queries fail immediately, `placeholderData` keeps last good data visible
- **Minimize calls:** 1 polled endpoint + on-demand contributors only
- **localStorage persistence** — entire query cache (repos + contributors) persisted. On refresh/new tab, data loads instantly; stale queries refetch in background. If refetch fails (rate limit/network), user sees last good data with warning indicators
- **Focus-only polling** — background tabs make zero API requests. Polling resumes on tab focus
- **Generous maxAge (20h)** — better to show old data with stale indicators (navbar timestamp + amber warning + overlay message) than no data at all
- **Rate limit detection** — `asRateLimitError()` in `lib/api-utils.ts` checks 403/429 + "rate limit" in message, extracts `x-ratelimit-remaining` / `x-ratelimit-limit` from error response headers into `RateLimitError.remaining` / `.limit`. Called explicitly in `github.ts` try/catch via `rethrow()`. No interceptors.
- **Rate limit info display** — `getRateLimit(headers)` reads `x-ratelimit-remaining` and `x-ratelimit-limit` from response headers. Called by `useRateLimitStatus(error, headers)` — each hook passes its own response headers. Blue info banner via shared StatusOverlay.
- **No mutable globals** — rate limit info flows from response headers through hooks. No module-level `rateLimits` record. Each query's headers are the source of truth.
- **ETags not used** — conditional requests only exempt from rate limits when authenticated (per GitHub docs). No benefit for unauthenticated calls

---

## Rate-Limit Behavior

| Scenario | What Happens |
|----------|--------------|
| Normal | Fresh data every 10s, blue info banner shows remaining calls per resource |
| 403 or 429 primary rate-limited | Query fails → `placeholderData` keeps last good data visible, amber banner: "Rate limit reached" + remaining calls from error response headers |
| 403 or 429 secondary rate-limited | Same behavior, amber banner: "Secondary rate limit hit" + remaining calls from error response headers |
| Rate-limited + no cache | StatusOverlay shows friendly error |
| Rate limit clears | Next 10s tick succeeds, UI auto-updates |
| Tab unfocused | Polling stops completely, zero requests |
| Tab refocused | Immediate refetch if data is stale |
| Page refresh | Cached data from localStorage shown instantly, background refetch |
| Refresh + rate-limited | Persisted data shown, navbar shows last update time, amber warning |

### Rate Limit Info Display
- **Blue info banner** (non-error state): Shows "API calls: X/Y remaining" from `x-ratelimit-remaining` / `x-ratelimit-limit` headers. Animated with breathing glow.
- **Amber rate-limit banner** (error state): Shows warning message + remaining calls count from error response headers. Both shown simultaneously in a two-line banner. Animated with breathing glow + rotating rainbow conic-gradient border.
- Each hook reads headers from its own query response via `getRateLimit(query.data?.headers)` — no shared mutable state
- When rate-limited, `useRateLimitStatus` prefers `RateLimitError.remaining`/`.limit` (from error response), falls back to cached successful response headers
- Repositories page reads search resource headers, Contributors modal reads core resource headers — no cross-contamination

### Primary vs Secondary Rate Limits
- **Primary:** `message.includes("rate limit")` but NOT `message.includes("secondary")` — standard per-resource rate limit
- **Secondary:** `message.includes("secondary")` — GitHub's abuse detection (by day/hour), can trigger even when primary remaining > 0
- `RateLimitError.isSecondary` boolean distinguishes the two; GitHub's original error message is passed through to the UI via `QueryStatus.errorMessage`

### Rate Limit Budgets (Unauthenticated)
| Resource | Limit | Used By |
|----------|-------|---------|
| `search` | 10 req/min | `/search/repositories` — at 10s polling = 6 req/min (60% usage) |
| `core` | 60 req/hour | `/repos/*/contributors` — on-demand only |

**Core rule:** User ALWAYS sees data. Old data > no data.
