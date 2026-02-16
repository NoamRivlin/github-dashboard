import axios from "axios"

export class RateLimitError extends Error {
  isSecondary: boolean

  constructor(message: string, isSecondary: boolean) {
    super(message)
    this.name = "RateLimitError"
    this.isSecondary = isSecondary
  }
}

const apiClient = axios.create({
  baseURL: "https://api.github.com",
  headers: { Accept: "application/vnd.github.v3+json" },
})

export default apiClient
