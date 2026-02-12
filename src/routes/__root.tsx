import { createRootRoute, Outlet } from "@tanstack/react-router"
import { Navbar } from "@/components/Navbar"

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 h-14 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="h-full px-6">
          <Navbar />
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-6">
        <Outlet />
      </main>
    </div>
  )
}
