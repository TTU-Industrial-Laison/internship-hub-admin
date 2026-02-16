import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonLoaderProps {
  type: "table" | "card" | "form";
  count?: number;
}

export const SkeletonLoader = ({ type, count = 5 }: SkeletonLoaderProps) => {
  if (type === "table") {
    return (
      <div className="w-full rounded-md border shadow-sm">
        <div className="border-b p-4">
          <div className="flex justify-between gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        </div>
        <div className="p-4 space-y-4">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex gap-4">
              {Array.from({ length: 4 }).map((_, j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Add other types as needed
  return <Skeleton className="h-32 w-full" />;
};
