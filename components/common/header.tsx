"use client";

import { useAppSelector } from "@/lib/store/hooks";
import {
  selectCurrentUser,
  selectIsUploadingImage,
} from "@/lib/store/slices/auth-slice";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Bell, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const user = useAppSelector(selectCurrentUser);
  const isUploading = useAppSelector(selectIsUploadingImage);
  const initials = `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`;

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h2 className="text-lg font-medium">Dashboard</h2>
      <div className="flex items-center gap-4">
        <Bell size={19} className="text-primary" />

        <div className="relative rounded-full">
          <Avatar className="h-10 w-10 border-2 border-white shadow-md relative">
            <AvatarImage
              src={user?.avatarUrl || "/placeholder.jpg"}
              alt="Profile"
              className={cn(
                "object-cover object-top transition-opacity duration-300",
                isUploading && "opacity-50"
              )}
            />
            <AvatarFallback className="bg-indigo-100 text-indigo-700 text-lg font-medium">
              {initials}
            </AvatarFallback>
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                <Loader2 className="h-4 w-4 text-white animate-spin" />
              </div>
            )}
          </Avatar>
        </div>
      </div>
    </header>
  );
}
