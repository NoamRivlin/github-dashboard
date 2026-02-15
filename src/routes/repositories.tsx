import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { useRepositories } from "@/hooks/queries/useRepositories"
import { HorizontalScroll } from "@/components/HorizontalScroll"
import { RepositoryCard } from "@/components/RepositoryCard"
import { ContributorsModal } from "@/components/ContributorsModal"
import { CardSkeletons } from "@/components/CardSkeleton"
import { StatusOverlay } from "@/components/StatusOverlay"
import { PAGE_LAYOUT } from "@/lib/card-styles"

export const Route = createFileRoute("/repositories")({
  component: RepositoriesPage,
})

function RepositoriesPage() {
  const {
    data,
    isLoading,
    isError,
    isRateLimited,
    isSecondaryRateLimit,
    rateLimitRemaining,
    rateLimitTotal,
    refetch,
  } = useRepositories()
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null)

  const repos = data?.items ?? []

  if (isLoading) {
    return (
      <div className={PAGE_LAYOUT}>
        <CardSkeletons />
      </div>
    )
  }

  return (
    <div className={PAGE_LAYOUT}>
      <StatusOverlay
        isError={isError && !isRateLimited}
        isRateLimited={isRateLimited}
        isSecondaryRateLimit={isSecondaryRateLimit}
        isEmpty={repos.length === 0}
        onRetry={() => refetch()}
        rateLimitRemaining={rateLimitRemaining}
        rateLimitTotal={rateLimitTotal}
      />

      {repos.length > 0 && (
        <HorizontalScroll>
          {repos.map((repo) => (
            <RepositoryCard
              key={repo.id}
              repository={repo}
              onViewContributors={setSelectedRepo}
            />
          ))}
        </HorizontalScroll>
      )}

      <ContributorsModal
        repoFullName={selectedRepo}
        onClose={() => setSelectedRepo(null)}
      />
    </div>
  )
}
