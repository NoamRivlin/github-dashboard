import { useRepositories } from "@/hooks/queries/useRepositories"

export function useQueryTimestamp() {
  const { dataUpdatedAt } = useRepositories()

  if (!dataUpdatedAt) return null

  return new Date(dataUpdatedAt).toLocaleTimeString()
}
