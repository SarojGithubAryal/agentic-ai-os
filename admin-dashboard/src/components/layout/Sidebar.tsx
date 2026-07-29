import SidebarContent from './SidebarContent'

export default function Sidebar() {
  return (
    <aside className="hidden md:flex fixed left-0 top-0 z-40 h-screen w-64 bg-slate-900 flex-col">
      <SidebarContent />
    </aside>
  )
}