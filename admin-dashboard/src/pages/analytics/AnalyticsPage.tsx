import { BarChart3 } from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Analytics</h2>
      <p className="text-muted-foreground mt-1">Usage metrics and reports.</p>
      <div className="mt-12 flex flex-col items-center justify-center rounded-lg border bg-white p-12 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <BarChart3 size={32} className="text-gray-400" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">Coming Soon</h3>
        <p className="mt-2 text-sm text-gray-500 max-w-md">
          Analytics dashboards will be available once the backend aggregation endpoints are built. You'll see token usage, provider performance, and execution trends here.
        </p>
      </div>
    </div>
  )
}