import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/developers")({
  component: DevelopersPage,
})

function DevelopersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Developers</h1>
    </div>
  )
}
