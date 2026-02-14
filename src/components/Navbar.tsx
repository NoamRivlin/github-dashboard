import { Link } from "@tanstack/react-router"
import { Code2 } from "lucide-react"
import { useQueryTimestamp } from "@/hooks/queries/useQueryTimestamp"
import { useRepositories } from "@/hooks/queries/useRepositories"
import { UpdatedAtBadge } from "@/components/UpdatedAtBadge"

export function Navbar() {
  const timestamp = useQueryTimestamp()
  const { error } = useRepositories()

  return (
    <nav className="flex flex-col items-center gap-2 md:grid md:grid-cols-3 md:items-center">
      <div className="flex items-center gap-3 pb-2">
        <Code2 className="h-5 w-5 text-primary" />
        <span className="text-lg font-semibold">Github Explorer</span>
        <UpdatedAtBadge timestamp={timestamp} isError={!!error} />
      </div>

      <div className="flex items-center justify-center gap-1">
        <Link
          to="/repositories"
          className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
          activeProps={{ className: "border border-border text-primary" }}
          inactiveProps={{
            className: "text-muted-foreground hover:text-foreground",
          }}
        >
          repositories
        </Link>
        <Link
          to="/developers"
          className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
          activeProps={{ className: "border border-border text-primary" }}
          inactiveProps={{
            className: "text-muted-foreground hover:text-foreground",
          }}
        >
          developers
        </Link>
      </div>

      <div className="hidden md:block" />
    </nav>
  )
}
