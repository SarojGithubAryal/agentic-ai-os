import { useAuth } from '../../hooks/useAuth'
import { User, Mail, Key } from 'lucide-react'

export default function SettingsPage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="text-red-500">You are not logged in.</div>
    )
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold">Settings</h2>
      <p className="mt-1 text-muted-foreground">Your profile information.</p>

      <div className="mt-6 rounded-lg border bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold">Profile</h3>
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-3">
            <User size={18} className="text-slate-400" />
            <div>
              <p className="text-sm font-medium text-slate-500">Name</p>
              <p className="text-sm text-slate-900">{user.name || 'Not set'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail size={18} className="text-slate-400" />
            <div>
              <p className="text-sm font-medium text-slate-500">Email</p>
              <p className="text-sm text-slate-900">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Key size={18} className="text-slate-400" />
            <div>
              <p className="text-sm font-medium text-slate-500">User ID</p>
              <p className="text-sm text-slate-900 font-mono">{user.id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder for future password change, etc. */}
      <div className="mt-8 rounded-lg border bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold">Account Actions</h3>
        <p className="mt-2 text-sm text-slate-500">
          Password changes and other account management features will be added here when the backend endpoints become available.
        </p>
      </div>
    </div>
  )
}