import { useAuth } from '../../hooks/useAuth'
import { useDashboardData } from '../../hooks/useDashboardData'
import { MetricCard } from '../../components/dashboard/MetricCard'
import { AppWindow, Cloud, Bot, Activity } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()
  const { metrics, error } = useDashboardData()

  if (error) {
    return (
      <div className="text-red-500">Failed to load dashboard data.</div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">Dashboard Overview</h2>
      <p className="mt-1 text-muted-foreground">
        Welcome back{user?.name ? `, ${user.name}` : ''}! Here’s a summary of your platform.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Applications"
          value={metrics.applications}
          icon={<AppWindow size={20} />}
          description="Registered applications"
        />
        <MetricCard
          title="Providers"
          value={metrics.providers}
          icon={<Cloud size={20} />}
          description="Active AI providers"
          trend="up"
        />
        <MetricCard
          title="Agents"
          value={metrics.activeAgents}
          icon={<Bot size={20} />}
          description="Running agents"
        />
        <MetricCard
          title="Recent Executions"
          value={metrics.recentExecutions}
          icon={<Activity size={20} />}
          description="Last 24 hours"
        />
      </div>

      {/* Placeholder for future charts / detailed stats */}
      <div className="mt-8 rounded-lg border bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold">Activity Overview</h3>
        <p className="text-sm text-slate-500 mt-2">
          Charts and execution timelines will appear here once the backend analytics endpoints are available.
        </p>
      </div>
    </div>
  )
}