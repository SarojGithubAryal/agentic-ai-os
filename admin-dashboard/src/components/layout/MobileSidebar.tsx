import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { Menu } from 'lucide-react'
import SidebarContent from './SidebarContent'

export default function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="md:hidden p-2 rounded-md hover:bg-slate-100">
          <Menu size={20} />
          <span className="sr-only">Open menu</span>
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64 bg-slate-900">
        <SidebarContent />
      </SheetContent>
    </Sheet>
  )
}