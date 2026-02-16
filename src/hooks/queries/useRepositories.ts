import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { fetchRepositories } from "@/api/github"
import { RateLimitError, rateLimits } from "@/api/client"
import {
  QUERY_KEYS,
  REPOS_REFETCH_INTERVAL,
  REPOS_STALE_TIME,
} from "@/lib/constants"

export function useRepositories() {
  const query = useQuery({
    queryKey: QUERY_KEYS.repositories,
    queryFn: ({ signal }) => fetchRepositories(signal),
    refetchInterval: REPOS_REFETCH_INTERVAL,
    refetchIntervalInBackground: false,
    staleTime: REPOS_STALE_TIME,
    placeholderData: keepPreviousData,
    retry: false,
  })

  const rateLimitError =
    query.error instanceof RateLimitError ? query.error : null

  return {
    ...query,
    isRateLimited: rateLimitError !== null,
    isSecondaryRateLimit: rateLimitError?.isSecondary ?? false,
    rateLimitRemaining: rateLimits.search?.remaining ?? null,
    rateLimitTotal: rateLimits.search?.limit ?? null,
  }
}
