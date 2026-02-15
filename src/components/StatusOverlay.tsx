import { AlertCircle, AlertTriangle, Info, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StatusOverlayProps {
  isError: boolean
  isRateLimited: boolean
  isSecondaryRateLimit: boolean
  isEmpty: boolean
  onRetry: () => void
  rateLimitRemaining?: number | null
  rateLimitTotal?: number | null
}

export function StatusOverlay({
  isError,
  isRateLimited,
  isSecondaryRateLimit,
  isEmpty,
  onRetry,
  rateLimitRemaining,
  rateLimitTotal,
}: StatusOverlayProps) {
  const rateLimitMessage = isSecondaryRateLimit
    ? "Secondary rate limit hit, please wait."
    : "Rate limit reached, please wait a moment."

  // Full-page states (no cached data)
  if (isRateLimited && isEmpty) {
    return (
      <div className="flex justify-center px-6">
        <div className="flex w-fit max-w-full items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
          <span className="text-sm text-amber-500">{rateLimitMessage}</span>
        </div>
      </div>
    )
  }

  if (isError && isEmpty) {
    return (
      <div className="flex flex-col items-center gap-3 px-6 py-2">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-sm text-muted-foreground">Failed to load data.</p>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center gap-3 px-6 py-12">
        <p className="text-sm text-muted-foreground">No data available.</p>
      </div>
    )
  }

  // Banner states (cached data is showing)
  const showRemainingInfo =
    !isRateLimited && rateLimitRemaining != null && rateLimitTotal != null

  return (
    <div className="flex min-h-14.5 items-center justify-center px-6 sm:min-h-10">
      {isRateLimited && (
        <div className="flex w-fit max-w-full items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
          <span className="text-sm text-amber-500">
            {rateLimitMessage} Using cached data.
          </span>
        </div>
      )}
      {isError && !isRateLimited && (
        <div className="flex w-fit max-w-full items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 text-destructive" />
          <span className="text-sm text-destructive">
            Failed to refresh data, using cached data.
          </span>
          <Button
            variant="outline"
            size="icon"
            className="text-destructive"
            onClick={onRetry}
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
      )}
      {showRemainingInfo && (
        <div className="flex w-fit max-w-full items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2">
          <Info className="h-3.5 w-3.5 shrink-0 text-blue-500" />
          <span className="text-sm text-blue-500">
            API calls: {rateLimitRemaining}/{rateLimitTotal} remaining
          </span>
        </div>
      )}
    </div>
  )
}
