import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div role="status" className="flex flex-col gap-14">
      <span className="sr-only">Loading...</span>
      <section className="space-y-5">
        <Skeleton className="mx-auto size-56 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-9 w-full max-w-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </section>
      <div className="space-y-4">
        <Skeleton className="h-4 w-24" />
        {Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-4 w-full" />)}
      </div>
    </div>
  );
}
