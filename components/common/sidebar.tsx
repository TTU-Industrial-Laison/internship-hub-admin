"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileBarChart, Settings, LogOut, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { sideBarNavItems } from "@/lib/constants/navigation";
import { useAppSelector } from "@/lib/store/hooks";
import {
  selectCurrentUser,
  selectIsUploadingImage,
} from "@/lib/store/slices/auth-slice";
import { useLogout } from "@/lib/hooks/mutations/use-auth";

export function Sidebar() {
  const pathname = usePathname();
  const user = useAppSelector(selectCurrentUser);
  const isUploading = useAppSelector(selectIsUploadingImage);
  const initials = `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`;

  const { mutate: logout, isPending: isLoggingOut } = useLogout();

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
            priority
          />
        </div>
        TTU IMS
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {sideBarNavItems.map((item) => {
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
                <p className="font-medium leading-none">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-slate-400 mt-1">{user?.role}</p>
              </div>

              <Avatar className="h-8 w-8 border border-white shadow-md relative">
                <AvatarImage
                  src={user?.avatarUrl || "/placeholder.jpg"}
                  alt="Profile"
                  className={cn(
                    "object-cover object-top transition-opacity duration-300",
                    isUploading && "opacity-50"
                  )}
                />
                <AvatarFallback className="bg-indigo-100 text-indigo-700 text-base font-medium">
                  {initials}
                </AvatarFallback>
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                    <Loader2 className="h-3 w-3 text-white animate-spin" />
                  </div>
                )}
              </Avatar>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="center" className="w-60">
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Admin Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={isLoggingOut}
              className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
              onSelect={(e) => {
                e.preventDefault();
                logout();
              }}
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-destructive" />
                  Logging out
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4" />
                  Logout
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
