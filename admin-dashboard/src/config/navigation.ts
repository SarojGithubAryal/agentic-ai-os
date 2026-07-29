import {
  LayoutDashboard,
  AppWindow,
  Users,
  Cloud,
  Brain,
  BookOpen,
  Wrench,
  GitBranch,
  Bot,
  MessageSquare,
  ScrollText,
  BarChart3,
  Settings,
} from 'lucide-react'

export interface NavItem {
  label: string
  path: string
  icon: React.ComponentType<{ size?: number | string }>
}

export const mainNavigation: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Applications', path: '/applications', icon: AppWindow },
  { label: 'Users', path: '/users', icon: Users },
  { label: 'Providers', path: '/providers', icon: Cloud },
  { label: 'Memory', path: '/memory', icon: Brain },
  { label: 'Knowledge', path: '/knowledge', icon: BookOpen },
  { label: 'Tools', path: '/tools', icon: Wrench },
  { label: 'Workflows', path: '/workflows', icon: GitBranch },
  { label: 'Agents', path: '/agents', icon: Bot },
  { label: 'Chat Playground', path: '/chat', icon: MessageSquare },
  { label: 'Logs', path: '/logs', icon: ScrollText },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'Settings', path: '/settings', icon: Settings },
]