import { useLocation, Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

export default function Breadcrumbs() {
  const location = useLocation()
  const pathSegments = location.pathname.split('/').filter(Boolean)

  if (pathSegments.length === 0) {
    return (
      <nav className="flex items-center text-sm text-slate-500 py-2">
        <Link to="/" className="flex items-center gap-1 hover:text-slate-700">
          <Home size={14} />
          Dashboard
        </Link>
      </nav>
    )
  }

  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/')
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
    return { label, path }
  })

  return (
    <nav className="flex items-center gap-1 text-sm text-slate-500 py-2">
      <Link to="/" className="flex items-center gap-1 hover:text-slate-700">
        <Home size={14} />
        Dashboard
      </Link>
      {breadcrumbs.map((crumb) => (
        <span key={crumb.path} className="flex items-center gap-1">
          <ChevronRight size={14} />
          <Link to={crumb.path} className="hover:text-slate-700">
            {crumb.label}
          </Link>
        </span>
      ))}
    </nav>
  )
}