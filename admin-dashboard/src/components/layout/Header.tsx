import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { LogOut, User } from 'lucide-react'
import MobileSidebar from './MobileSidebar'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <MobileSidebar />
        {/* Optional: show a small brand or page title on mobile */}
        <span className="md:hidden text-lg font-semibold text-slate-800">Agentic AI OS</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <User size={16} />
          <span>{user?.name || user?.email || 'Admin'}</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  )
}