import { Skeleton } from "@/components/ui/skeleton";
import { Loading } from "@/components/ui/page-skeletons";

// Home: name on the left, portrait arch on the right, stats underneath.
export default function HomeLoading() {
  return (
    <Loading>
      <div className="grid min-h-[calc(100svh-5rem)] content-center gap-x-10 gap-y-8 pb-12 md:grid-cols-12">
        <div className="space-y-4 md:col-span-7">
          <Skeleton className="h-[clamp(3.5rem,11vw,8.5rem)] w-4/5 rounded-xl" />
          <Skeleton className="ml-[12%] h-[clamp(3.5rem,11vw,8.5rem)] w-3/5 rounded-xl" />
          <div className="max-w-md space-y-2 pt-6">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
          </div>
          <div className="flex gap-3 pt-4">
            <Skeleton className="h-11 w-32 rounded-full" />
            <Skeleton className="h-11 w-40 rounded-full" />
          </div>
        </div>
        <Skeleton className="order-first mx-auto aspect-[433/576] w-[min(64vw,17rem)] rounded-b-none rounded-t-full md:order-none md:col-span-5 md:w-full md:max-w-sm" />
        <div className="grid grid-cols-2 gap-6 border-t pt-6 sm:grid-cols-4 md:col-span-12">
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
