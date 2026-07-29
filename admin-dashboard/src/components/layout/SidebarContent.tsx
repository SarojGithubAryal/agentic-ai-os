import { Link, useLocation } from 'react-router-dom'
import { mainNavigation } from '../../config/navigation'
import { cn } from '../../lib/utils'

export default function SidebarContent() {
  const location = useLocation()

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center h-16 px-6 border-b border-slate-700">
        <span className="text-xl font-bold text-white">Agentic AI OS</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {mainNavigation.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}