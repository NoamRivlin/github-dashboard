import { AlertCircle, AlertTriangle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

interface StatusOverlayProps {
  isLoading: boolean
  isError: boolean
  isRateLimited: boolean
  isEmpty: boolean
  onRetry: () => void
}

export function StatusOverlay({
  isLoading,
  isError,
  isRateLimited,
  isEmpty,
  onRetry,
}: StatusOverlayProps) {
  if (isLoading) {
    return (
      <div className="flex gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="w-[400px] shrink-0 space-y-4 rounded-xl border p-6"
          >
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (isRateLimited) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <span className="text-sm text-amber-500">
          Rate limit reached. Using cached data.
        </span>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-12">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-sm text-muted-foreground">
          Failed to load data.
        </p>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center gap-3 py-12">
        <p className="text-sm text-muted-foreground">
          No data available.
        </p>
      </div>
    )
  }

  return null
}
