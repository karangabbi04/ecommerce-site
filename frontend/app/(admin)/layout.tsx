import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import Navbar from "@/components/admin/dashboard/navbar/navbar"


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b ">
          <Navbar/>
        </header>
        <div className="flex flex-1 flex-col gap-4 ">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}