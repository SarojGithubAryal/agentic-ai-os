import { ScrollText } from 'lucide-react'

export default function LogsPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Logs</h2>
      <p className="text-muted-foreground mt-1">System logs and execution traces.</p>
      <div className="mt-12 flex flex-col items-center justify-center rounded-lg border bg-white p-12 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <ScrollText size={32} className="text-gray-400" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">Coming Soon</h3>
        <p className="mt-2 text-sm text-gray-500 max-w-md">
          Centralized log viewing is not yet available. The backend uses structured logging (Pino) and will expose a log retrieval API in a future phase.
        </p>
      </div>
    </div>
  )
}