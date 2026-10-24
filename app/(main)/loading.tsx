import { Skeleton } from "@/components/ui/skeleton";

// Home: centered hero, then section blocks.
export default function Loading() {
  return (
    <div role="status" className="flex flex-col gap-6">
      <span className="sr-only">Loading...</span>
      <section className="flex h-[68dvh] flex-col items-center justify-center gap-5">
        <Skeleton className="h-6 w-48 rounded-full" />
        <Skeleton className="h-12 w-80 max-w-full" />
        <Skeleton className="h-5 w-96 max-w-full" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-28" />
        </div>
      </section>
      <div className="space-y-6 border-b border-gray-100 pb-10">
        <Skeleton className="h-5 w-28" />
        <div className="flex flex-wrap justify-between gap-6">
          {Array.from({ length: 8 }, (_, i) => <Skeleton key={i} className="size-12 rounded-sm" />)}
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-5 w-28" />
        {Array.from({ length: 2 }, (_, i) => (
          <div key={i} className="space-y-2 border-l-2 border-muted pl-4">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>
        ))}
      </div>
    </div>
  );
}
