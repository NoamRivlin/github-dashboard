import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { fetchContributors } from "@/api/github"
import { RateLimitError, rateLimits } from "@/api/client"
import {
  QUERY_KEYS,
  CONTRIBUTORS_STALE_TIME,
  CONTRIBUTORS_GC_TIME,
} from "@/lib/constants"

export function useContributors(repoFullName: string, enabled: boolean) {
  const query = useQuery({
    queryKey: QUERY_KEYS.contributors(repoFullName),
    queryFn: ({ signal }) => fetchContributors(repoFullName, signal),
    enabled,
    staleTime: CONTRIBUTORS_STALE_TIME,
    gcTime: CONTRIBUTORS_GC_TIME,
    placeholderData: keepPreviousData,
    retry: false,
  })

  const rateLimitError =
    query.error instanceof RateLimitError ? query.error : null

  return {
    ...query,
    isRateLimited: rateLimitError !== null,
    isSecondaryRateLimit: rateLimitError?.isSecondary ?? false,
    rateLimitRemaining: rateLimits.core?.remaining ?? null,
    rateLimitTotal: rateLimits.core?.limit ?? null,
  }
}
