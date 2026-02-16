import { RateLimitError } from "@/api/client"
import { getRateLimit } from "@/lib/api-utils"
import type { QueryStatus } from "@/types/github"

export function useRateLimitStatus(
  error: Error | null,
  headers: Record<string, unknown> | undefined,
): QueryStatus {
  const rateLimit = getRateLimit(headers)
  const isRateLimited = error instanceof RateLimitError

  return {
    isError: error !== null,
    isRateLimited,
    rateLimitRemaining: rateLimit?.remaining ?? null,
    rateLimitTotal: rateLimit?.limit ?? null,
    errorMessage: isRateLimited ? error.message : null,
  }
}
