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

  if (isRateLimited) {
    return (
      <Banner className="border-amber-500/30 bg-amber-500/10 text-amber-500">
        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
        <span className="text-sm">{errorMessage}</span>
      </Banner>
    )
  }

  if (isError) {
    return (
      <Banner className="border-destructive/30 bg-destructive/10 text-destructive">
        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
        <span className="text-sm">Failed to load data.</span>
        <Button variant="outline" size="icon" onClick={onRetry}>
          <RefreshCw className="h-3 w-3" />
        </Button>
      </Banner>
    )
  }

  if (rateLimitRemaining != null && rateLimitTotal != null) {
    return (
      <Banner className="border-blue-500/30 bg-blue-500/10 text-blue-500">
        <Info className="h-3.5 w-3.5 shrink-0" />
        <span className="text-sm">
          API calls: {rateLimitRemaining}/{rateLimitTotal} remaining
        </span>
      </Banner>
    )
  }

  return null
}

function Banner({
  className,
  children,
}: {
  className: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`flex w-fit max-w-full items-center gap-2 rounded-lg border px-3 py-2 ${className}`}
      >
        {children}
      </div>
    </div>
  )
}
