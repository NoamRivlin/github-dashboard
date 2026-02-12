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
  CardDescription,
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
    <Card className="w-[400px] shrink-0 snap-start transition-colors hover:border-primary/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <a
            href={repository.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 truncate text-primary hover:underline"
            title={repository.name}
          >
            <span className="truncate">{repository.name}</span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
          </a>
          <span className="ml-auto flex shrink-0 items-center gap-1 text-sm font-normal text-yellow-500">
            <Star className="h-4 w-4" />
            {repository.stargazers_count.toLocaleString()}
          </span>
        </CardTitle>
        <CardDescription className="line-clamp-3" title={repository.description ?? undefined}>
          {repository.description ?? "No description"}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Scale className="h-4 w-4" />
            {repository.license?.name ?? "No license"}
          </span>
          <span className="flex items-center gap-1.5">
            <GitFork className="h-4 w-4" />
            {repository.forks_count.toLocaleString()}
          </span>
          <span className="flex items-center gap-1.5">
            <CircleDot className="h-4 w-4" />
            {repository.open_issues_count.toLocaleString()}
          </span>
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
