import axios from "axios"

export class RateLimitError extends Error {
  isSecondary: boolean
  remaining: number | null
  limit: number | null

  constructor(
    message: string,
    isSecondary: boolean,
    remaining: number | null,
    limit: number | null,
  ) {
    super(message)
    this.name = "RateLimitError"
    this.isSecondary = isSecondary
    this.remaining = remaining
    this.limit = limit
  }
}

const apiClient = axios.create({
  baseURL: "https://api.github.com",
  headers: { Accept: "application/vnd.github.v3+json" },
})

export default apiClient
