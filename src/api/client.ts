import axios from "axios"

export class RateLimitError extends Error {
  constructor() {
    super("GitHub API rate limit exceeded. Showing last updated data.")
    this.name = "RateLimitError"
  }
}

const apiClient = axios.create({
  baseURL: "https://api.github.com",
  headers: { Accept: "application/vnd.github.v3+json" },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.message ?? ""
    const rateLimitRemaining = error.response?.headers?.["x-ratelimit-remaining"]

    const isRateLimited =
      status === 403 &&
      (message.toLowerCase().includes("rate limit") || rateLimitRemaining?.toString() === "0")

    if (isRateLimited) {
      throw new RateLimitError()
    }
    throw error
  },
)

export default apiClient