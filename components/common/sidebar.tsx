"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  Calendar,
  Users,
  GraduationCap,
  FileBarChart,
  Settings,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Map & Zones", href: "/dashboard/map", icon: Map },
  {
    label: "Internship Periods",
    href: "/dashboard/periods",
    icon: Calendar,
  },
  { label: "Supervisors", href: "/dashboard/supervisors", icon: Users },
  { label: "Students", href: "/dashboard/students", icon: GraduationCap },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      {/* Logo */}
      <div className="flex py-2 items-center gap-2 border-b border-white/15 px-6 text-lg font-semibold">
        <div className="rounded-full bg-white p-1.5 backdrop-blur">
          <Image
            src="/images/ttu-logo.png"
            alt="Logo"
            width={40}
            height={40}
            className=""
          />{" "}
        </div>
        TTU IMS
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white [&a]:last-of-type:mb-4",
                isActive && "bg-primary hover:bg-primary/90 text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}

        {/* Section: Analytics */}
        <div className="py-4 border-t border-b border-white/15">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Analytics
          </p>

          <Link
            href="/dashboard/reports"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white",
              pathname === "/dashboard/reports" &&
                "bg-primary hover:bg-primary/90 text-white"
            )}
          >
            <FileBarChart className="h-4 w-4" />
            Reports
          </Link>
        </div>

        {/* Section: System */}
        <div className="pt-4">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            System
          </p>

          <Link
            href="/dashboard/settings"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname === "/dashboard/settings"
                ? "bg-primary hover:bg-primary/90 text-white"
                : "text-slate-300 hover:bg-white/10 hover:text-white"
            )}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </div>
      </nav>

      {/* Footer Admin Profile */}
      <div className="border-t border-white/10 px-4 py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              aria-label="Admin menu"
              className="flex w-full items-center justify-between rounded-md px-2 py-2 transition-colors hover:bg-white/10"
            >
              <div className="text-left text-sm">
                <p className="font-medium leading-none">Dr. K. Mensah</p>
                <p className="text-xs text-slate-400">Administrator</p>
              </div>

              <Button
                variant="ghost"
                size="icon-sm"
                className="bg-primary text-white hover:bg-primary hover:text-white"
              >
                AD
              </Button>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="center" className="w-60">
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Admin Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
