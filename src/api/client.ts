import axios from "axios"

// --- Rate Limit Error (primary vs secondary) ---

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

// --- Rate limit info from response headers ---

export let rateLimitRemaining: number | null = null
export let rateLimitTotal: number | null = null

// --- Axios Client ---

const apiClient = axios.create({
  baseURL: "https://api.github.com",
  headers: { Accept: "application/vnd.github.v3+json" },
})

// Read rate limit headers from every successful response
apiClient.interceptors.response.use((response) => {
  const remaining = response.headers["x-ratelimit-remaining"]
  const limit = response.headers["x-ratelimit-limit"]

  if (remaining != null) rateLimitRemaining = Number(remaining)
  if (limit != null) rateLimitTotal = Number(limit)

  return response
})

// Detect rate limit errors (403 / 429)
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
