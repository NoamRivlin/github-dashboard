import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createRouter, RouterProvider } from "@tanstack/react-router"
import { QueryClient } from "@tanstack/react-query"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister"
import { routeTree } from "./routeTree.gen"
import "hover-tilt/web-component"
import "./index.css"

// ---------- Query cache persistence ----------
// The entire query cache (repos + contributors) is persisted to localStorage.
// On page refresh or new tab, cached data is restored instantly (no loading spinner),
// then stale queries refetch silently in the background.
//
// gcTime controls in-memory cache lifetime; persister writes to localStorage independently.
// maxAge (20h) is intentionally generous — better to show old data with a stale indicator
// (navbar timestamp + status overlay) than no data at all on rate-limit or network errors.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 10 * 60 * 1000,
    },
  },
})

const persister = createAsyncStoragePersister({
  storage: window.localStorage,
  // Cache writes to localStorage after every fetch, throttled to 1s (default)
  // to avoid spamming storage on rapid updates.
})

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister, maxAge: 20 * 60 * 60 * 1000 }}>
      <RouterProvider router={router} />
    </PersistQueryClientProvider>
  </StrictMode>,
)
