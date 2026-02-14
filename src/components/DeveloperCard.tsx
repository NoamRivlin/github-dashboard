import { Star } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { Developer } from "@/types/github"

interface DeveloperCardProps {
  developer: Developer
}

export function DeveloperCard({ developer }: DeveloperCardProps) {
  return (
    <hover-tilt
      data-gradient="aurora-sweep"
      tilt-factor="0.4"
      scale-factor="1.05"
      glare-intensity="0.4"
      glare-hue="190"
      blend-mode="overlay"
      shadow=""
      exit-delay="200"
    >
      <Card className="w-[85vw] sm:w-[350px] lg:w-[420px] xl:w-[480px]">
        <CardHeader className="min-w-0 overflow-hidden">
          <CardTitle className="min-w-0 truncate text-lg font-bold" title={developer.login}>
            {developer.login}
          </CardTitle>
          <div className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
            <span className="min-w-0 truncate" title={developer.repoName}>{developer.repoName}</span>
            <span className="flex shrink-0 items-center gap-1 text-yellow-500">
              <Star className="h-3.5 w-3.5" fill="currentColor" />
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
    </hover-tilt>
  )
}
