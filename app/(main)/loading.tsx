import { Skeleton } from "@/components/ui/skeleton";
import { Loading } from "@/components/ui/page-skeletons";

// Home: meta rule, the name edge to edge (two lines on phones), intro + actions, stats.
export default function HomeLoading() {
  return (
    <Loading>
      <div className="flex min-h-[calc(100svh-5rem)] flex-col justify-center gap-8 pb-12 md:gap-12">
        <div className="flex justify-between border-b pb-4">
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-4 w-36" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-[38vw] w-4/5 rounded-xl md:h-[min(18vw,13rem)] md:w-full" />
          <Skeleton className="h-[38vw] w-full rounded-xl md:hidden" />
        </div>
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="max-w-lg space-y-2 md:col-span-7">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
          </div>
          <div className="flex gap-3 md:col-span-5 md:justify-end">
            <Skeleton className="h-11 w-32 rounded-full" />
            <Skeleton className="h-11 w-40 rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 border-t pt-6 sm:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>
    </Loading>
  );
}
