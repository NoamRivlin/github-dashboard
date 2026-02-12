# API Strategy

## Endpoints

| Endpoint | Purpose | Refetch |
|----------|---------|---------|
| `GET /search/repositories?q=language:javascript&sort=stars&order=desc&per_page=10` | Top 10 JS repos | 10s interval |
| `GET /repos/{owner}/{repo}/contributors?per_page=10` | Repo contributors (modal, 10 per page) | On-demand (modal open) |

**Developers page** — derived from the same top 10 JS repos query (no separate endpoint). Both pages share the same TanStack Query cache via `queryKey: ['repositories']`, so only one API call is made:
- `owner.login` → developer name
- `name` → repo name
- `stargazers_count` → stars in that repo
- `owner.avatar_url` → developer profile image
- Same developer may appear more than once if they own multiple top repos
- List is ordered by stars (desc), with client-side sort in `fetchRepositories()` for stable ordering across refetches

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

### 3. Create Matching Mock Data
Mocks MUST match real API shape exactly — same fields, same nesting, same nullability:
```ts
// api/mocks/repositories.ts — realistic data, 10 entries
// api/mocks/contributors.ts — realistic data, 10+ entries
```
**Why:** When rate-limited, the app switches to mocks seamlessly. Shape mismatch = broken UI.

### 4. Mock Toggle
```ts
// api/mocks/index.ts
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';
```
Service functions check this flag and return mocks or call the API.

---

## Axios Client

```ts
// api/client.ts
const apiClient = axios.create({
  baseURL: 'https://api.github.com',
  headers: { Accept: 'application/vnd.github.v3+json' },
});

// Rate-limit interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403 &&
        error.response.headers['x-ratelimit-remaining'] === '0') {
      const rateLimitError = new Error('GitHub API rate limit exceeded');
      rateLimitError.name = 'RateLimitError';
      throw rateLimitError;
    }
    throw error;
  }
);
```

---

## TanStack Query Config

**Repositories** (polled):
```ts
{
  queryKey: ['repositories'],
  queryFn: fetchRepositories,
  refetchInterval: 10_000,
  staleTime: 10_000,
  gcTime: 5 * 60 * 1000,              // Cache 5 min
  placeholderData: keepPreviousData,    // Show old data during refetch
  retry: (count, error) => error.name === 'RateLimitError' ? false : count < 2,
}
```

**Contributors** (on-demand):
```ts
{
  queryKey: ['contributors', repoFullName],
  queryFn: () => fetchContributors(repoFullName),
  enabled,                              // Only when modal is open
  staleTime: 5 * 60 * 1000,
  gcTime: 10 * 60 * 1000,
  placeholderData: keepPreviousData,
}
```

### Key Decisions
- **Single repos query shared** between Repositories page and Developers page (zero extra calls)
- **Contributors cached per repo** — same modal opened twice doesn't re-fetch within staleTime. `isPlaceholderData` used in UI to show loading skeletons instead of stale data from a different repo
- **refetchInterval is global** — doesn't reset on navigation between pages
- **Minimize calls:** 1 polled endpoint + on-demand contributors only

---

## Rate-Limit Behavior

| Scenario | What Happens |
|----------|--------------|
| Normal | Fresh data every 10s |
| 403 rate-limited | Query fails → `placeholderData` keeps last good data visible |
| Rate-limited + no cache | StatusOverlay shows friendly error |
| Rate limit clears | Next 10s tick succeeds, UI auto-updates |

**Core rule:** User ALWAYS sees data. Old data > no data.
