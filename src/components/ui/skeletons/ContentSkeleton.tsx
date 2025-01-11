import { Skeleton } from "@/components/ui/skeleton";

export const CardSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-32 w-full" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
    </div>
  </div>
);

export const MetricsSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-3">
    {[1, 2, 3].map((i) => (
      <div key={i} className="p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
        <Skeleton className="h-8 w-24 mb-2" />
        <Skeleton className="h-12 w-full" />
      </div>
    ))}
  </div>
);

export const ChartSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-[300px] w-full" />
  </div>
);