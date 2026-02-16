import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { fetchContributors } from "@/api/github"
import { useRateLimitStatus } from "@/hooks/queries/useRateLimitStatus"
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

  const status = useRateLimitStatus(query.error, query.data?.headers)

  return {
    data: query.data?.data,
    isLoading: query.isLoading,
    isPlaceholderData: query.isPlaceholderData,
    refetch: query.refetch,
    status,
  }
}
