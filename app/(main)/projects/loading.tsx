import { Skeleton } from "@/components/ui/skeleton";
import { Loading, PageIntroSkeleton } from "@/components/ui/page-skeletons";

export default function ProjectsLoading() {
  return (
    <Loading>
      <PageIntroSkeleton />
      <div className="mb-8 flex justify-between border-b pb-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="grid gap-x-6 gap-y-12 md:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i}>
            <Skeleton className="aspect-[16/11] w-full rounded-3xl" />
            <Skeleton className="mt-5 h-4 w-24" />
            <Skeleton className="mt-3 h-8 w-2/3" />
            <Skeleton className="mt-4 h-5 w-1/2" />
          </div>
        ))}
      </div>
    </Loading>
  );
}
