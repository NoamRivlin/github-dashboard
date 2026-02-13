import apiClient from "@/api/client"



import type { Contributor, RepositorySearchResponse } from "@/types/github"

export async function fetchRepositories(): Promise<RepositorySearchResponse> {


  const { data } = await apiClient.get<RepositorySearchResponse>(
    "/search/repositories",
    {
      params: {
        q: "language:javascript",
        sort: "stars",
        order: "desc",
        per_page: 10,
      },
    },
  )
  data.items.sort((a, b) => b.stargazers_count - a.stargazers_count)
  return data
}

export async function fetchContributors(
  repoFullName: string,
): Promise<Contributor[]> {


  const { data } = await apiClient.get<Contributor[]>(
    `/repos/${repoFullName}/contributors`
  )
  return data
}
