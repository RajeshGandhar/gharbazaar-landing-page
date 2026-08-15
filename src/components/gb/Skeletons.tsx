import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-surface-2", className)} />;
}

export function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-3 w-56" />
        <Skeleton className="h-3 w-32" />
        <div className="flex items-center justify-between border-t border-border pt-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-7 w-24" />
        </div>
      </div>
    </div>
  );
}

export function PropertyGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
  return (
    <ul className={cn("mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <PropertyCardSkeleton />
        </li>
      ))}
    </ul>
  );
}

/** Horizontal chip/tile rows (categories). */
export function TileRowSkeleton({ count = 6 }: { count?: number }) {
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="flex items-center gap-3 rounded-lg border border-border bg-surface p-2.5">
          <Skeleton className="size-12 shrink-0" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3 w-14" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function MediaGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
  return (
    <ul className={cn("mt-7 grid grid-cols-2 gap-3 md:grid-cols-4", className)}>
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <Skeleton className="aspect-[5/4] w-full" />
        </li>
      ))}
    </ul>
  );
}
