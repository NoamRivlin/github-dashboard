import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { fetchRepositories } from "@/api/github"
import { RateLimitError } from "@/api/client"

export function useRepositories() {
  return useQuery({
    queryKey: ["repositories"],
    queryFn: ({ signal }) => fetchRepositories(signal),
    refetchInterval: 10_000,
    // Stop polling when the browser tab is not focused.
    // Polling resumes automatically when the user returns to the tab
    refetchIntervalInBackground: false,
    staleTime: 10_000,
    placeholderData: keepPreviousData,
    retry: (failureCount, error) =>
      error instanceof RateLimitError ? false : failureCount < 2,
  })
}
