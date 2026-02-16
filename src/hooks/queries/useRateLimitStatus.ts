import { RateLimitError } from "@/api/client"
import { getRateLimit } from "@/lib/api-utils"
import type { QueryStatus } from "@/types/github"

export function useRateLimitStatus(
  error: Error | null,
  headers: Record<string, unknown> | undefined,
): QueryStatus {
  const successRateLimit = getRateLimit(headers)
  const isRateLimited = error instanceof RateLimitError

  const rateLimitRemaining = isRateLimited
    ? (error.remaining ?? successRateLimit?.remaining ?? null)
    : (successRateLimit?.remaining ?? null)

  const rateLimitTotal = isRateLimited
    ? (error.limit ?? successRateLimit?.limit ?? null)
    : (successRateLimit?.limit ?? null)

  return {
    isError: error !== null,
    isRateLimited,
    rateLimitRemaining,
    rateLimitTotal,
    errorMessage: isRateLimited ? error.message : null,
  }
}
