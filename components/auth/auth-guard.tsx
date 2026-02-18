"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";
import {
  selectIsAuthenticated,
  selectIsLoading,
  selectCurrentUser,
} from "@/lib/store/slices/auth-slice";

/**
 * Wraps protected routes. Redirects to /auth/login if not authenticated.
 * Shows a loading state while session is being checked.
 */
export function AuthGuard({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);

  const user = useAppSelector(selectCurrentUser);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Not authenticated -> Login
        router.replace(
          `/auth/login?callbackUrl=${encodeURIComponent(pathname)}`
        );
      } else if (
        user?.shouldResetPassword &&
        pathname !== "/auth/change-password"
      ) {
        // Authenticated but must change password -> Change Password
        router.replace("/auth/change-password");
      } else if (
        !user?.shouldResetPassword &&
        pathname === "/auth/change-password"
      ) {
        // Authenticated and no need to change password -> Dashboard
        router.replace("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, router, pathname, user]);

  // Show loading spinner while checking session status
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-6">
          {/* Stacked rings */}
          <div className="relative flex items-center justify-center h-16 w-16">
            <div className="absolute h-16 w-16 rounded-full border-2 border-indigo-100" />
            <div className="absolute h-16 w-16 animate-spin rounded-full border-2 border-transparent border-t-indigo-700 animation-duration-[3s]" />
            <div className="absolute h-11 w-11 animate-spin rounded-full border-2 border-transparent border-t-indigo-600 animation-duration-[1.5s]" />
            <div className="absolute h-6 w-6 animate-spin rounded-full border-2 border-transparent border-t-indigo-800 animation-duration-[0.75s]" />
            <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
          </div>

          {/* Text with animated ellipsis */}
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-medium text-slate-700">
              Loading application
            </p>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-1 w-1 rounded-full bg-indigo-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated (and not loading), don't render children
  // The useEffect will handle the redirect
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
