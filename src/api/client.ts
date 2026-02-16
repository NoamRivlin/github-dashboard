import axios from "axios"

export class RateLimitError extends Error {
  isSecondary: boolean

  constructor(isSecondary: boolean) {
    super(
      isSecondary
        ? "Secondary rate limit hit, please wait."
        : "Rate limit reached, please wait a moment.",
    )
    this.name = "RateLimitError"
    this.isSecondary = isSecondary
  }
}

// Keyed by GitHub's x-ratelimit-resource header ("core", "search", etc.)
export const rateLimits: Record<
  string,
  { remaining: number; limit: number }
> = {}

const apiClient = axios.create({
  baseURL: "https://api.github.com",
  headers: { Accept: "application/vnd.github.v3+json" },
})

apiClient.interceptors.response.use((response) => {
  const resource = response.headers["x-ratelimit-resource"]
  const remaining = response.headers["x-ratelimit-remaining"]
  const limit = response.headers["x-ratelimit-limit"]

  if (resource && remaining != null && limit != null) {
    rateLimits[resource] = {
      remaining: Number(remaining),
      limit: Number(limit),
    }
  }

  return response
})

apiClient.interceptors.response.use(undefined, (error) => {
  const status = error.response?.status
  const message: string = error.response?.data?.message ?? ""

  const isRateLimited =
    (status === 403 || status === 429) &&
    message.toLowerCase().includes("rate limit")

  if (isRateLimited) {
    const isSecondary = message.toLowerCase().includes("secondary")
    throw new RateLimitError(isSecondary)
  }
  throw error
})

export default apiClient
