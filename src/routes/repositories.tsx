import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { useRepositories } from "@/hooks/queries/useRepositories"
import { useContributors } from "@/hooks/queries/useContributors"

export const Route = createFileRoute("/repositories")({
  component: RepositoriesPage,
})

function RepositoriesPage() {
  const { data, isLoading, isError } = useRepositories()
  const [fetchContribs, setFetchContribs] = useState(false)
  const contributors = useContributors(
    "ryanmcdermott/clean-code-javascript",
    fetchContribs,
  )

  return (
    <div>
      <h1 className="text-2xl font-bold">Repositories</h1>
      <p className="text-sm text-muted-foreground mt-2">
        Status: {isLoading ? "Loading..." : isError ? "Error" : `${data?.items.length} repos loaded`}
      </p>
      <div className="mt-4 flex gap-3">
        <button
          className="px-4 py-2 bg-primary text-primary-foreground rounded"
          onClick={() => {
            if (data) {
              console.log("=== TOP 10 JS REPOS ===")
              data.items.forEach((repo, i) => {
                console.log(`${i + 1}. ${repo.full_name} — ★${repo.stargazers_count}`)
              })
              console.log("Full data:", data.items)
            }
          }}
        >
          Log Repos to Console
        </button>
        <button
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded"
          onClick={() => {
            setFetchContribs(true)
          }}
        >
          Fetch Contributors (clean-code-javascript)
        </button>
      </div>
      {contributors.data && (
        <button
          className="mt-3 px-4 py-2 bg-primary text-primary-foreground rounded"
          onClick={() => {
            console.log("=== CONTRIBUTORS: ryanmcdermott/clean-code-javascript ===")
            contributors.data.forEach((c, i) => {
              console.log(`${i + 1}. ${c.login} — ${c.contributions} contributions`)
            })
            console.log("Full data:", contributors.data)
          }}
        >
          Log Contributors to Console
        </button>
      )}
      {contributors.isLoading && (
        <p className="mt-3 text-sm text-muted-foreground">Loading contributors...</p>
      )}
      {contributors.isError && (
        <p className="mt-3 text-sm text-destructive">Error loading contributors</p>
      )}
    </div>
  )
}
