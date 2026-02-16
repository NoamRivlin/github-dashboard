import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { fetchRepositories } from "@/api/github"
import { useRateLimitStatus } from "@/hooks/queries/useRateLimitStatus"
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

  const status = useRateLimitStatus(query.error, "search")

  return {
    data: query.data,
    isLoading: query.isLoading,
    dataUpdatedAt: query.dataUpdatedAt,
    refetch: query.refetch,
    status,
  }
}
