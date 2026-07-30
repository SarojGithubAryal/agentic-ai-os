import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import Breadcrumbs from './Breadcrumbs'
import { Toaster } from '../ui/sonner'

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="md:ml-64 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-6 px-6">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  )
}