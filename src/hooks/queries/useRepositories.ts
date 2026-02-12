import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { fetchRepositories } from "@/api/github"
import { RateLimitError } from "@/api/client"

export function useRepositories() {
  return useQuery({
    queryKey: ["repositories"],
    queryFn: fetchRepositories,
    refetchInterval: 10_000,
    staleTime: 10_000,
    gcTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
    retry: (failureCount, error) =>
      error instanceof RateLimitError ? false : failureCount < 2,
  })
}
