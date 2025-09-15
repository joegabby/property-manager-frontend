"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LayoutDashboard, Search, Heart, MessageSquare, Settings, LogOut, Menu, Home, User, Building } from "lucide-react"

interface UserLayoutProps {
  children: React.ReactNode
}

const sidebarItems = [
  { icon: LayoutDashboard, label: "Home", href: "/user/properties" },
  // { icon: LayoutDashboard, label: "Home", href: "/user/dashboard" },
  // { icon: Search, label: "Browse Agents", href: "/user/agents" },
  // { icon: Building, label: "Properties", href: "/user/properties" },
  // { icon: MessageSquare, label: "My Inquiries", href: "/user/inquiries" },
  { icon: User, label: "Profile", href: "/user/profile" },
  // { icon: Settings, label: "Settings", href: "/user/settings" },
]

export function UserLayout({ children }: UserLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <Link href="/user/properties" className="flex items-center space-x-2">
        <img
            src= "/logo.png"
            alt="castle and castle properties logo"
            className=" object-contain"
          />
          {/* <Home className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-primary">Castle and Castle Properties</span> */}
        </Link>
        <p className="text-sm text-center text-muted-foreground mt-1">Find Your Home</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-card border-r">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden fixed top-4 left-4 z-50">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
