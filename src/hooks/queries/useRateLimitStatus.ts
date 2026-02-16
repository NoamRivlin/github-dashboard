import { RateLimitError, rateLimits } from "@/api/client"
import type { QueryStatus } from "@/types/github"

export function useRateLimitStatus(
  error: Error | null,
  resource: string,
): QueryStatus {
  const rateLimitError =
    error instanceof RateLimitError ? error : null

  return {
    isError: error !== null,
    isRateLimited: rateLimitError !== null,
    isSecondaryRateLimit: rateLimitError?.isSecondary ?? false,
    rateLimitRemaining: rateLimits[resource]?.remaining ?? null,
    rateLimitTotal: rateLimits[resource]?.limit ?? null,
  }
}
