import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/repositories")({
  component: RepositoriesPage,
})

function RepositoriesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Repositories</h1>
    </div>
  )
}
