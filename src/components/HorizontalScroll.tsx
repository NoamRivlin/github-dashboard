import type { ReactNode } from "react"

interface HorizontalScrollProps {
  children: ReactNode
}

export function HorizontalScroll({ children }: HorizontalScrollProps) {
  return (
    <div className="-my-10 overflow-x-auto py-10 pb-14 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-muted [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30">
      <div className="flex items-stretch gap-4 px-6">{children}</div>
    </div>
  )
}
