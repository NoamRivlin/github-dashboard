import { useRepositories } from "@/hooks/queries/useRepositories"

export function useQueryTimestamp() {
  const { dataUpdatedAt } = useRepositories()

  if (!dataUpdatedAt) return null

  return new Date(dataUpdatedAt).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
}
