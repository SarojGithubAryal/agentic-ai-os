// This hook will later call backend APIs.
// For now, it returns placeholder data so the UI can be built.
export interface DashboardMetrics {
  applications: number
  providers: number
  activeAgents: number
  recentExecutions: number
  // add more as needed
}

export function useDashboardData() {
  // Placeholder – replace with real API calls using TanStack Query later.
  const metrics: DashboardMetrics = {
    applications: 5,
    providers: 3,
    activeAgents: 7,
    recentExecutions: 42,
  }

  const isLoading = false
  const error = null

  // In the future: const { data, isLoading, error } = useQuery(...)

  return { metrics, isLoading, error }
}