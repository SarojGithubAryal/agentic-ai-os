import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import ProtectedRoute from './components/auth/ProtectedRoute'
import DashboardLayout from './components/layout/DashboardLayout'

const LoginPage = lazy(() => import('./pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'))
const DashboardHome = lazy(() => import('./pages/dashboard/DashboardPage'))
const ApplicationsPage = lazy(() => import('./pages/applications/ApplicationsPage'))
const UsersPage = lazy(() => import('./pages/users/UsersPage'))
const ProvidersPage = lazy(() => import('./pages/providers/ProvidersPage'))
const MemoryPage = lazy(() => import('./pages/memory/MemoryPage'))
const KnowledgePage = lazy(() => import('./pages/knowledge/KnowledgePage'))
const ToolsPage = lazy(() => import('./pages/tools/ToolsPage'))
const WorkflowsPage = lazy(() => import('./pages/workflows/WorkflowsPage'))
const AgentsPage = lazy(() => import('./pages/agents/AgentsPage'))
const ChatPage = lazy(() => import('./pages/chat/ChatPage'))
const LogsPage = lazy(() => import('./pages/logs/LogsPage'))
const AnalyticsPage = lazy(() => import('./pages/analytics/AnalyticsPage'))
const SettingsPage = lazy(() => import('./pages/settings/SettingsPage'))
const PlaceholderPage = lazy(() => import('./pages/PlaceholderPage'))

export default function App() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="providers" element={<ProvidersPage />} />
          <Route path="memory" element={<MemoryPage />} />
          <Route path="knowledge" element={<KnowledgePage />} />
          <Route path="tools" element={<ToolsPage />} />
          <Route path="workflows" element={<WorkflowsPage />} />
          <Route path="agents" element={<AgentsPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="logs" element={<LogsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<PlaceholderPage />} />
      </Routes>
    </Suspense>
  )
}