import { Star } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { Developer } from "@/types/github"

interface DeveloperCardProps {
  developer: Developer
}

export function DeveloperCard({ developer }: DeveloperCardProps) {
  return (
    <Card className="w-[400px] shrink-0 snap-start transition-colors hover:border-primary/50">
      <CardHeader>
        <CardTitle className="truncate text-lg font-bold" title={developer.login}>
          {developer.login}
        </CardTitle>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <span className="truncate" title={developer.repoName}>{developer.repoName}</span>
          <span className="flex shrink-0 items-center gap-1 text-yellow-500">
            <Star className="h-3.5 w-3.5" />
            {developer.repoStars.toLocaleString()}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 items-center justify-center">
        <img
          src={developer.avatar_url}
          alt={developer.login}
          className="h-24 w-24 rounded-full"
        />
      </CardContent>
    </Card>
  )
}
