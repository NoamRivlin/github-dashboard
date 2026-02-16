import type { ReactNode } from "react"
import { AlertCircle, AlertTriangle, Info, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { QueryStatus } from "@/types/github"

interface StatusOverlayProps {
  status: QueryStatus
  isEmpty: boolean
  onRetry: () => void
  compact?: boolean
}

export function StatusOverlay({
  status,
  isEmpty,
  onRetry,
  compact,
}: StatusOverlayProps) {
  const {
    isError,
    isRateLimited,
    isSecondaryRateLimit,
    rateLimitRemaining,
    rateLimitTotal,
  } = status

  const rateLimitMessage = isSecondaryRateLimit
    ? "Secondary rate limit hit, please wait."
    : "Rate limit reached, please wait a moment."

  if (isRateLimited && isEmpty) {
    return (
      <div className="flex justify-center px-6">
        <StatusBanner variant="warning">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
          <span className="text-sm text-amber-500">{rateLimitMessage}</span>
        </StatusBanner>
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

  const showRemainingInfo =
    !isRateLimited &&
    !isError &&
    rateLimitRemaining != null &&
    rateLimitTotal != null

  const wrapperClass = compact
    ? "flex items-center justify-center"
    : "flex min-h-14.5 items-center justify-center px-6 sm:min-h-10"

  return (
    <div className={wrapperClass}>
      {isRateLimited && (
        <StatusBanner variant="warning">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
          <span className="text-sm text-amber-500">
            {rateLimitMessage} Using cached data.
          </span>
        </StatusBanner>
      )}
      {isError && !isRateLimited && (
        <StatusBanner variant="error">
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
        </StatusBanner>
      )}
      {showRemainingInfo && (
        <StatusBanner variant="info">
          <Info className="h-3.5 w-3.5 shrink-0 text-blue-500" />
          <span className="text-sm text-blue-500">
            API calls: {rateLimitRemaining}/{rateLimitTotal} remaining
          </span>
        </StatusBanner>
      )}
    </div>
  )
}

const BANNER_BASE =
  "flex w-fit max-w-full items-center gap-2 rounded-lg border px-3 py-2"

const BANNER_VARIANTS = {
  warning: `${BANNER_BASE} border-amber-500/30 bg-amber-500/10`,
  error: `${BANNER_BASE} border-destructive/30 bg-destructive/10`,
  info: `${BANNER_BASE} border-blue-500/30 bg-blue-500/10`,
} as const

type BannerVariant = keyof typeof BANNER_VARIANTS

function StatusBanner({
  variant,
  children,
}: {
  variant: BannerVariant
  children: ReactNode
}) {
  return <div className={BANNER_VARIANTS[variant]}>{children}</div>
}
