import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonLoaderProps {
  type:
    | "table"
    | "card"
    | "form"
    | "stats-card"
    | "progress-chart"
    | "pie-chart";
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

  if (type === "stats-card") {
    return (
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className="p-4 bg-white rounded-lg border border-gray-300 shadow-card"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </div>
        ))}
      </section>
    );
  }

  if (type === "progress-chart") {
    return (
      <div className="flex items-end gap-2 h-full w-full pt-4">
        {[...Array(count)].map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1"
            style={{ height: `${Math.random() * 60 + 20}%` }}
          />
        ))}
      </div>
    );
  }

  if (type === "pie-chart") {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full gap-4">
        <Skeleton className="h-48 w-48 rounded-full" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    );
  }

  // Add other types as needed
  return <Skeleton className="h-32 w-full" />;
};
