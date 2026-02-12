import apiClient from "@/api/client"
import { USE_MOCKS } from "@/api/mocks"
import { mockRepositoriesResponse } from "@/api/mocks/repositories"
import { mockContributors } from "@/api/mocks/contributors"
import type { Contributor, RepositorySearchResponse } from "@/types/github"

export async function fetchRepositories(): Promise<RepositorySearchResponse> {
  if (USE_MOCKS) return mockRepositoriesResponse

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
  return data
}

export async function fetchContributors(
  repoFullName: string,
): Promise<Contributor[]> {
  if (USE_MOCKS) return mockContributors

  const { data } = await apiClient.get<Contributor[]>(
    `/repos/${repoFullName}/contributors`
  )
  return data
}
