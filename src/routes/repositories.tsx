import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { useRepositories } from "@/hooks/queries/useRepositories"
import { RateLimitError } from "@/api/client"
import { HorizontalScroll } from "@/components/HorizontalScroll"
import { RepositoryCard } from "@/components/RepositoryCard"
import { ContributorsModal } from "@/components/ContributorsModal"
import { StatusOverlay } from "@/components/StatusOverlay"

export const Route = createFileRoute("/repositories")({
  component: RepositoriesPage,
})
function RepositoriesPage() {
  const { data, isLoading, isError, error, refetch } = useRepositories()
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null)
  const isRateLimited = error instanceof RateLimitError

  const repos = data?.items ?? []

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col justify-center space-y-4">
      <StatusOverlay
        isLoading={isLoading}
        isError={isError && !isRateLimited}
        isRateLimited={isRateLimited}
        isEmpty={!isLoading && !isError && repos.length === 0}
        onRetry={() => refetch()}
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
