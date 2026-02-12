import { Clock, AlertTriangle } from "lucide-react"

interface UpdatedAtBadgeProps {
  timestamp: string | null
  isRateLimited: boolean
}

export function UpdatedAtBadge({
  timestamp,
  isRateLimited,
}: UpdatedAtBadgeProps) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium">
      <Clock className="h-3.5 w-3.5" />
      <span>{timestamp ? `updated at: ${timestamp}` : "loading..."}</span>
      {isRateLimited && (
        <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
      )}
    </div>
  )
}
