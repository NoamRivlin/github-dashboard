import {
  Star,
  GitFork,
  CircleDot,
  Scale,
  ExternalLink,
  Users,
} from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Repository } from "@/types/github"

interface RepositoryCardProps {
  repository: Repository
  onViewContributors: (repoFullName: string) => void
}

export function RepositoryCard({
  repository,
  onViewContributors,
}: RepositoryCardProps) {
  return (
    <Card className="w-[85vw] shrink-0 snap-start transition-colors hover:border-primary/50 sm:w-[350px] lg:w-[420px] xl:w-[480px]">
      <CardHeader className="min-w-0 overflow-hidden">
        <CardTitle className="flex min-w-0 flex-col gap-1 overflow-hidden text-lg sm:flex-row sm:items-center sm:gap-2">
          <a
            href={repository.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-w-0 items-center gap-1.5 overflow-hidden text-primary hover:underline"
            title={repository.name}
          >
            <span className="min-w-0 truncate">{repository.name}</span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
          </a>
          <span className="flex shrink-0 items-center gap-1 text-sm font-normal text-yellow-500 sm:ml-auto">
            <Star className="h-4 w-4" fill="currentColor" />
            {repository.stargazers_count.toLocaleString()}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        <p className="line-clamp-3 pb-5" title={repository.description ?? undefined}>
          {repository.description ?? "No description"}
        </p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 shrink-0" />
            {repository.license?.name ?? "No license"}
          </div>
          <div className="flex items-center gap-2">
            <GitFork className="h-4 w-4 shrink-0" />
            {repository.forks_count.toLocaleString()} forks
          </div>
          <div className="flex items-center gap-2">
            <CircleDot className="h-4 w-4 shrink-0" />
            {repository.open_issues_count.toLocaleString()} open issues
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => onViewContributors(repository.full_name)}
        >
          <Users className="h-4 w-4" />
          View Contributors
        </Button>
      </CardFooter>
    </Card>
  )
}
