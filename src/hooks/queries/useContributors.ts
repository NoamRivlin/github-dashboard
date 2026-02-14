import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { fetchContributors } from "@/api/github"

export function useContributors(repoFullName: string, enabled: boolean) {
  return useQuery({
    queryKey: ["contributors", repoFullName],
    queryFn: ({ signal }) => fetchContributors(repoFullName, signal),
    enabled,
    staleTime: 5 * 60 * 1000,
    // 30 min — contributor data changes rarely, so keep it cached longer.
    // Persisted to localStorage alongside repos, surviving refreshes.
    gcTime: 30 * 60 * 1000,
    placeholderData: keepPreviousData,
  })
}
