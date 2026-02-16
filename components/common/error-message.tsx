import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  message: string;
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult>;
  className?: string;
}

export const ErrorMessage = ({
  message,
  refetch,
  className,
}: ErrorMessageProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-10",
        className
      )}
    >
      <div className="flex items-center gap-2 text-red-600 mb-4">
        <AlertTriangle className="h-6 w-6" />
        <h3 className="text-lg font-semibold">{message}</h3>
      </div>
      <Button onClick={() => refetch()} className="">
        Try Again
      </Button>
    </div>
  );
};
