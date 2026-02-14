import { Users } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useContributors } from "@/hooks/queries/useContributors"
import { SCROLLBAR_VERTICAL } from "@/lib/card-styles"
import { SKELETON_COUNT } from "@/lib/constants"

interface ContributorsModalProps {
  repoFullName: string | null
  onClose: () => void
}

export function ContributorsModal({ repoFullName, onClose }: ContributorsModalProps) {
  const { data, isLoading, isError, isPlaceholderData } = useContributors(repoFullName ?? "", !!repoFullName)

  const showLoading = isLoading || isPlaceholderData

  return (
    <Dialog open={!!repoFullName} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            Contributors
          </DialogTitle>
          <DialogDescription>{repoFullName}</DialogDescription>
        </DialogHeader>

        <div className={`max-h-80 space-y-1 overflow-y-auto ${SCROLLBAR_VERTICAL}`}>
          {showLoading &&
            Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="ml-auto h-4 w-16" />
              </div>
            ))}

          {!showLoading && isError && (
            <p className="py-4 text-center text-sm text-destructive">Failed to load contributors.</p>
          )}

          {!showLoading &&
            data?.map((contributor) => (
              <div
                key={contributor.id}
                className="flex items-center gap-3 border-b border-border/50 py-2 last:border-0"
              >
                <img src={contributor.avatar_url} alt={contributor.login} className="h-8 w-8 rounded-full" />
                <span className="max-w-[170px] truncate text-sm font-medium" title={contributor.login}>
                  {contributor.login}
                </span>
                <span className="ml-auto px-6 text-xs text-green-500">
                  {contributor.contributions.toLocaleString()} +
                </span>
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
