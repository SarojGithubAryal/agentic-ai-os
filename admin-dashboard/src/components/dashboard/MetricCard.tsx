import { cn } from '../../lib/utils'

interface MetricCardProps {
  title: string
  value: number | string
  description?: string
  icon?: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  className?: string
}

export function MetricCard({ title, value, description, icon, trend, className }: MetricCardProps) {
  return (
    <div className={cn('rounded-lg border bg-white p-6 shadow-sm', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        {icon && <span className="text-slate-400">{icon}</span>}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-semibold text-slate-900">{value}</span>
        {trend === 'up' && <span className="text-sm text-green-600">↑</span>}
        {trend === 'down' && <span className="text-sm text-red-600">↓</span>}
      </div>
      {description && <p className="mt-1 text-xs text-slate-400">{description}</p>}
    </div>
  )
}