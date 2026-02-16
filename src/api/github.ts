import type { AxiosResponse } from "axios"
import apiClient from "@/api/client"
import { asRateLimitError } from "@/lib/api-utils"
import type { Contributor, RepositorySearchResponse } from "@/types/github"
import { CONTRIBUTORS_PER_PAGE, REPOS_PER_PAGE } from "@/lib/constants"

function rethrow(error: unknown): never {
  throw asRateLimitError(error) ?? error
}

export async function fetchRepositories(
  signal?: AbortSignal,
): Promise<AxiosResponse<RepositorySearchResponse>> {
  try {
    return await apiClient.get<RepositorySearchResponse>(
      "/search/repositories",
      {
        params: {
          q: "language:javascript",
          sort: "stars",
          order: "desc",
          per_page: REPOS_PER_PAGE,
        },
        signal,
      },
    )
  } catch (error) {
    rethrow(error)
  }
}

export async function fetchContributors(
  repoFullName: string,
  signal?: AbortSignal,
): Promise<AxiosResponse<Contributor[]>> {
  try {
    return await apiClient.get<Contributor[]>(
      `/repos/${repoFullName}/contributors`,
      { params: { per_page: CONTRIBUTORS_PER_PAGE }, signal },
    )
  } catch (error) {
    rethrow(error)
  }
}
