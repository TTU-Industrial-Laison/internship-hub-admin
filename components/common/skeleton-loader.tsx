import { Skeleton } from "@/components/ui/skeleton";

export const ActivityListSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="space-y-6">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="flex gap-4 items-start">
        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
        <div className="space-y-2 flex-1 pt-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
    ))}
  </div>
);

export const RecentActivitySkeleton = () => (
  <section className="p-6 h-96 bg-white rounded-lg border border-gray-300 shadow-card flex flex-col overflow-hidden">
    <div className="flex justify-between items-center mb-6">
      <Skeleton className="h-7 w-40" />
      <Skeleton className="h-4 w-16" />
    </div>
    <div className="flex-1 overflow-hidden">
      <ActivityListSkeleton count={4} />
    </div>
  </section>
);

interface SkeletonLoaderProps {
  type:
    | "table"
    | "card"
    | "form"
    | "stats-card"
    | "progress-chart"
    | "pie-chart"
    | "activity-list";
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
            style={{
              height: `${Math.max(20, ((i + 1) * 37) % 80)}%`,
            }}
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

  if (type === "activity-list") {
    return <ActivityListSkeleton count={count} />;
  }

  // Add other types as needed
  return <Skeleton className="h-32 w-full" />;
};
