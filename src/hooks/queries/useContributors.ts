import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { fetchContributors } from "@/api/github"

export function useContributors(repoFullName: string, enabled: boolean) {
  return useQuery({
    queryKey: ["contributors", repoFullName],
    queryFn: () => fetchContributors(repoFullName),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
  })
}
