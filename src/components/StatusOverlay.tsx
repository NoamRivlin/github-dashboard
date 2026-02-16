import { AlertCircle, AlertTriangle, Info, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { QueryStatus } from "@/types/github"

interface StatusOverlayProps {
  status: QueryStatus
  onRetry: () => void
}

export function StatusOverlay({ status, onRetry }: StatusOverlayProps) {
  const {
    isError,
    isRateLimited,
    rateLimitRemaining,
    rateLimitTotal,
    errorMessage,
  } = status

  const hasRateLimitInfo = rateLimitRemaining != null && rateLimitTotal != null

  if (isRateLimited) {
    return (
      <BannerSlot>
        <div className="status-breathe-amber status-border-rainbow flex w-fit max-w-full flex-col gap-2 rounded-lg border border-transparent bg-amber-500/10 px-4 py-2.5 text-amber-500">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span className="text-sm">{errorMessage}</span>
          </div>
          {hasRateLimitInfo && (
            <div className="flex items-center gap-2 border-t border-amber-500/20 pt-2">
              <Info className="h-3 w-3 shrink-0 opacity-70" />
              <span className="text-xs opacity-80">
                API calls: {rateLimitRemaining}/{rateLimitTotal} remaining
              </span>
            </div>
          )}
        </div>
      </BannerSlot>
    )
  }

  if (isError) {
    return (
      <BannerSlot>
        <div className="status-breathe-red flex w-fit max-w-full items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-destructive">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span className="text-sm">Failed to load data.</span>
          <Button variant="outline" size="icon" onClick={onRetry}>
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
      </BannerSlot>
    )
  }

  if (hasRateLimitInfo) {
    return (
      <BannerSlot>
        <div className="status-breathe-blue flex w-fit max-w-full items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2.5 text-blue-500">
          <Info className="h-3.5 w-3.5 shrink-0" />
          <span className="text-sm">
            API calls: {rateLimitRemaining}/{rateLimitTotal} remaining
          </span>
        </div>
      </BannerSlot>
    )
  }

  return <BannerSlot />
}

function BannerSlot({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex h-22 items-center justify-center overflow-hidden">
      {children}
    </div>
  )
}
