import { Skeleton } from "@/components/ui/skeleton";
import { Loading, PageIntroSkeleton } from "@/components/ui/page-skeletons";

export default function BlogLoading() {
  return (
    <Loading>
      <PageIntroSkeleton />
      <div className="border-t">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="grid gap-4 border-b py-8 sm:grid-cols-[8rem_1fr_9rem] sm:gap-8">
            <Skeleton className="h-4 w-24" />
            <div className="space-y-3">
              <Skeleton className="h-8 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="hidden aspect-[4/3] w-full rounded-xl sm:block" />
          </div>
        ))}
      </div>
    </Loading>
  );
}
