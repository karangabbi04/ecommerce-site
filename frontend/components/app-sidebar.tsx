"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  Layers,
  Boxes,
  ShoppingCart,
  CreditCard,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
  Search
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInput,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function AppSidebar() {
  const pathname = usePathname()

  const navigation = [
    {
      group: "Overview",
      items: [
        { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      ]
    },
    {
      group: "Catalog",
      items: [
        { title: "Products", href: "/dashboard/products", icon: Package },
        { title: "Categories", href: "/dashboard/categories", icon: Layers },
        { title: "Inventory", href: "/dashboard/inventory", icon: Boxes },
      ]
    },
    {
      group: "Sales & Orders",
      items: [
        { title: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
        { title: "Payments", href: "/dashboard/payments", icon: CreditCard },
      ]
    },
    {
      group: "Customers & Feedback",
      items: [
        { title: "Customers", href: "/dashboard/customers", icon: Users },
        { title: "Reviews", href: "/dashboard/reviews", icon: MessageSquare },
      ]
    },
    {
      group: "Reports",
      items: [
        { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
      ]
    },
    {
      group: "System Settings",
      items: [
        { title: "Settings", href: "/dashboard/settings", icon: Settings },
      ]
    }
  ]

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      {/* Brand Header */}
      <SidebarHeader className="border-b border-sidebar-border/40 py-4 px-4 flex flex-row items-center justify-between gap-3 overflow-hidden">
        <div className="flex items-center gap-3 overflow-hidden group-data-[collapsible=icon]:hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="size-5 text-amber-400 fill-amber-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm leading-tight text-sidebar-foreground">BottleCraft</span>
            <span className="text-[10px] text-sidebar-foreground/60 leading-none">Admin Console</span>
          </div>
        </div>
        <SidebarTrigger className="shrink-0 group-data-[collapsible=icon]:mx-auto" />
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {/* Search Widget */}
        <div className="relative px-2 mb-4 group-data-[collapsible=icon]:hidden">
          <Search className="absolute left-4 top-2.5 size-4 text-sidebar-foreground/45" />
          <SidebarInput 
            placeholder="Search console..." 
            className="pl-8 bg-sidebar-accent/30 border-sidebar-border/40 text-xs placeholder:text-sidebar-foreground/40 focus-visible:ring-1"
          />
        </div>

        {/* Navigation Groups */}
        {navigation.map((group, index) => (
          <SidebarGroup key={index} className="py-2">
            <SidebarGroupLabel className="text-[10px] uppercase font-bold tracking-wider text-sidebar-foreground/50 px-3">
              {group.group}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item, idx) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <SidebarMenuItem key={idx}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive}
                        className={cn(
                          "transition-all duration-150 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground px-3 py-2",
                          isActive 
                            ? "bg-sidebar-accent/80 text-sidebar-accent-foreground font-semibold shadow-xs" 
                            : "text-sidebar-foreground/80"
                        )}
                      >
                        <a href={item.href} className="flex items-center gap-3 w-full">
                          <Icon className={cn("size-4", isActive ? "text-primary" : "text-sidebar-foreground/60")} />
                          <span className="text-xs">{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer Profile */}
      <SidebarFooter className="border-t border-sidebar-border/40 py-3 px-3">
        <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-sidebar-accent/20 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:bg-transparent">
          <div className="flex items-center gap-2.5 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center">
            <div className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs group-data-[collapsible=icon]:mx-auto">
              KB
            </div>
            <div className="flex flex-col transition-opacity duration-200 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:hidden">
              <span className="font-semibold text-xs leading-none text-sidebar-foreground">Karan Gabbi</span>
              <span className="text-[9px] text-sidebar-foreground/55 mt-0.5">karan@bottlecraft.com</span>
            </div>
          </div>
          <button 
            className="flex items-center justify-center size-7 shrink-0 rounded-md text-sidebar-foreground/60 hover:bg-destructive/10 hover:text-destructive transition-colors group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:hidden"
            title="Log out"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
