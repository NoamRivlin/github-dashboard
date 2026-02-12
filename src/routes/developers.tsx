import { createFileRoute } from "@tanstack/react-router"
import { useRepositories } from "@/hooks/queries/useRepositories"
import { RateLimitError } from "@/api/client"
import { HorizontalScroll } from "@/components/HorizontalScroll"
import { DeveloperCard } from "@/components/DeveloperCard"
import { StatusOverlay } from "@/components/StatusOverlay"
import type { Developer } from "@/types/github"

export const Route = createFileRoute("/developers")({
  component: DevelopersPage,
})

function DevelopersPage() {
  const { data, isLoading, isError, error, refetch } = useRepositories()
  const isRateLimited = error instanceof RateLimitError

  const developers: Developer[] =
    data?.items.map((repo) => ({
      login: repo.owner.login,
      avatar_url: repo.owner.avatar_url,
      repoName: repo.name,
      repoStars: repo.stargazers_count,
    })) ?? []

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col justify-center space-y-4">
      <StatusOverlay
        isLoading={isLoading}
        isError={isError && !isRateLimited}
        isRateLimited={isRateLimited}
        isEmpty={!isLoading && !isError && developers.length === 0}
        onRetry={() => refetch()}
      />

      {developers.length > 0 && (
        <HorizontalScroll>
          {developers.map((dev, index) => (
            <DeveloperCard key={`${dev.login}-${index}`} developer={dev} />
          ))}
        </HorizontalScroll>
      )}
    </div>
  )
}
