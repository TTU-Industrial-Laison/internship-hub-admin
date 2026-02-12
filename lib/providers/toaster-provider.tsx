"use client";

import { useEffect, useEffectEvent, useState } from "react";
import originalToast, {
  Toaster as HotToaster,
  useToasterStore,
  Toast,
  type ToastOptions,
} from "react-hot-toast";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CustomToastOptions extends ToastOptions {
  data?: {
    type: "info" | "warning";
  };
}

// Custom toast object with extended methods
const toast = {
  ...originalToast, // Include all original methods

  // Custom info method
  info: (message: string, options?: CustomToastOptions) => {
    return originalToast(message, {
      ...options,
      // Add a custom className to identify info toasts
      className: "toast-info-type",
      icon: <Info className="h-5 w-5 text-blue-600" />,
    });
  },

  // Custom warning method
  warn: (message: string, options?: CustomToastOptions) => {
    return originalToast(message, {
      ...options,
      // Add a custom className to identify warning toasts
      className: "toast-warning-type",
      icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
    });
  },
};

/**
 * Enhanced Toaster Component
 */
const Toaster = () => {
  const { toasts } = useToasterStore();

  // Limit to only 1 toast visible at a time for cleaner UX
  const TOAST_LIMIT = 1;

  /**
   * Enforce toast limit by dismissing excess toasts
   */
  useEffect(() => {
    toasts
      .filter((t) => t.visible)
      .filter((_, i) => i >= TOAST_LIMIT)
      .forEach((t) => toast.dismiss(t.id));
  });

  /**
   * Get visual configuration for each toast type
   */
  const getToastConfig = (t: Toast) => {
    // Check for custom class names to identify info and warning toasts
    const isInfoToast = t.className === "toast-info-type";
    const isWarningToast = t.className === "toast-warning-type";

    switch (t.type) {
      case "success":
        return {
          icon: <CheckCircle className="h-5 w-5 text-emerald-600" />,
          bgClass:
            "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200/60 shadow-emerald-100/50",
          progressClass: "bg-gradient-to-r from-emerald-500 to-green-500",
          textClass: "text-emerald-900",
        };
      case "error":
        return {
          icon: <XCircle className="h-5 w-5 text-red-600" />,
          bgClass:
            "bg-gradient-to-r from-red-50 to-rose-50 border-red-200/60 shadow-red-100/50",
          progressClass: "bg-gradient-to-r from-red-500 to-rose-500",
          textClass: "text-red-900",
        };
      case "loading":
        return {
          icon: (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          ),
          bgClass:
            "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200/60 shadow-blue-100/50",
          progressClass: "bg-gradient-to-r from-blue-500 to-indigo-500",
          textClass: "text-blue-900",
        };
      default:
        // Handle info toasts
        if (isInfoToast) {
          return {
            icon: <Info className="h-5 w-5 text-blue-600" />,
            bgClass:
              "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200/60 shadow-blue-100/50",
            progressClass: "bg-gradient-to-r from-blue-500 to-cyan-500",
            textClass: "text-blue-900",
          };
        }
        // Handle warning toasts
        else if (isWarningToast) {
          return {
            icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
            bgClass:
              "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200/60 shadow-amber-100/50",
            progressClass: "bg-gradient-to-r from-amber-500 to-yellow-500",
            textClass: "text-amber-900",
          };
        }
        // Default toast
        return {
          icon: <Info className="h-5 w-5 text-blue-600" />,
          bgClass:
            "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200/60 shadow-blue-100/50",
          progressClass: "bg-gradient-to-r from-blue-500 to-cyan-500",
          textClass: "text-blue-900",
        };
    }
  };

  return (
    <HotToaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 6000,
        style: {
          background: "transparent",
          boxShadow: "none",
          padding: 0,
          margin: 0,
        },
      }}
    >
      {(t) => {
        const config = getToastConfig(t);
        return <ToastWrapper toast={t} config={config} />;
      }}
    </HotToaster>
  );
};

interface ToastWrapperProps {
  toast: Toast;
  config: {
    icon: React.ReactNode;
    bgClass: string;
    progressClass: string;
    textClass: string;
  };
}

/**
 * Individual Toast Wrapper Component
 */
const ToastWrapper = ({ toast: t, config }: ToastWrapperProps) => {
  const [progress, setProgress] = useState(100);
  const [isVisible, setIsVisible] = useState(true);

  const onVisibilityChange = useEffectEvent(() => {
    if (!t.visible) {
      setIsVisible(false);
    }
  });

  useEffect(() => {
    onVisibilityChange();

    if (t.type === "loading") return;

    const duration = t.duration || 6000;
    const interval = 50;
    const decrement = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev - decrement;
        if (next <= 0) {
          clearInterval(timer);
          return 0;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [t.visible, t.duration, t.type]);

  const handleDismiss = () => {
    toast.dismiss(t.id);
  };

  return (
    <div
      className={`
        relative max-w-[25rem] w-full rounded-lg shadow-lg border backdrop-blur-sm
        transform transition-all duration-300 ease-in-out
        ${config.bgClass}
        ${
          isVisible
            ? "translate-x-0 opacity-100 scale-100"
            : "translate-x-full opacity-0 scale-95"
        }
      `}
    >
      {/* Main toast content container */}
      <div className="flex items-center gap-2 p-4 pr-12">
        {/* Icon container */}
        <div className="flex-shrink-0">{config.icon}</div>

        {/* Message content */}
        <div className="flex-1 min-w-0">
          <div
            className={`text-base font-medium leading-5 ${config.textClass}`}
          >
            {typeof t.message === "function" ? t.message(t) : t.message}
          </div>
        </div>
      </div>

      {/* Close/Dismiss button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDismiss}
        className="absolute top-3 right-1 size-7 rounded-full text-gray-800 hover:text-gray-700 hover:bg-white/80 transition-colors duration-150"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </Button>

      {/* Animated Progress bar */}
      {t.type !== "loading" && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/40 rounded-b-lg overflow-hidden">
          <div
            className={`h-full transition-all duration-75 ease-linear ${config.progressClass}`}
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      )}
    </div>
  );
};

export { Toaster, toast };
