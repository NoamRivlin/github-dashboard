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
    if (
      error.response?.status === 403 &&
      error.response.headers["x-ratelimit-remaining"] === "0"
    ) {
      throw new RateLimitError()
    }
    throw error
  },
)

export default apiClient
