import { Search, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  return (
    <header className="flex h-16 border-b border-gray-200 items-center justify-between bg-white px-6">
      {/* Page Title */}
      <h2 className="text-lg font-semibold tracking-tight">Dashboard</h2>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Global Search */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="bg-transparent hover:bg-transparent text-primary p-0!"
        >
          <Search className="size-5" strokeWidth={2} />{" "}
        </Button>

        {/* Admin Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Admin menu"
              className="hover:bg-primary hover:text-white text-white bg-primary opacity-90"
            >
              AD
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-44">
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
    </header>
  );
}
