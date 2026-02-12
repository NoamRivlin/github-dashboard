import { createFileRoute } from "@tanstack/react-router"
import { useRepositories } from "@/hooks/queries/useRepositories"
import type { Developer } from "@/types/github"

export const Route = createFileRoute("/developers")({
  component: DevelopersPage,
})

function DevelopersPage() {
  const { data, isLoading, isError } = useRepositories()

  const developers: Developer[] =
    data?.items.map((repo) => ({
      login: repo.owner.login,
      avatar_url: repo.owner.avatar_url,
      repoName: repo.name,
      repoStars: repo.stargazers_count,
    })) ?? []

  return (
    <div>
      <h1 className="text-2xl font-bold">Developers</h1>
      <p className="text-sm text-muted-foreground mt-2">
        Status:{" "}
        {isLoading
          ? "Loading..."
          : isError
            ? "Error"
            : `${developers.length} developers`}
      </p>
      <button
        className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded"
        onClick={() => {
          console.log("=== DEVELOPERS (owners of top JS repos) ===")
          developers.forEach((dev, i) => {
            console.log(
              `${i + 1}. ${dev.login} — ${dev.repoName} ★${dev.repoStars}`,
            )
          })
          console.log("Full data:", developers)
        }}
      >
        Log Developers to Console
      </button>
    </div>
  )
}
