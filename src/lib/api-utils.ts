import { AxiosError } from "axios"
import { RateLimitError } from "@/api/client"

export interface RateLimit {
  remaining: number
  limit: number
}

/** Extract rate-limit info from GitHub response headers. */
export function getRateLimit(
  headers: Record<string, unknown> | undefined,
): RateLimit | null {
  if (!headers) return null

  const remaining = headers["x-ratelimit-remaining"]
  const limit = headers["x-ratelimit-limit"]

  if (remaining == null || limit == null) return null

  return { remaining: Number(remaining), limit: Number(limit) }
}

/** Convert a GitHub rate-limit error (403/429) to RateLimitError, or return null. */
export function asRateLimitError(
  error: unknown,
): RateLimitError | null {
  if (!(error instanceof AxiosError) || !error.response) return null

  const { status, data } = error.response
  const message: string = data?.message ?? ""

  const isRateLimited =
    (status === 403 || status === 429) &&
    message.toLowerCase().includes("rate limit")

  if (!isRateLimited) return null

  const isSecondary = message.toLowerCase().includes("secondary")
  const shortMessage = isSecondary
    ? "Secondary rate limit hit, please wait."
    : "Rate limit reached, please wait a moment."
  return new RateLimitError(shortMessage, isSecondary)
}
