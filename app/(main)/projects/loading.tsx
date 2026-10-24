import { Skeleton } from "@/components/ui/skeleton";
import { Loading, PageIntroSkeleton } from "@/components/ui/page-skeletons";

export default function ProjectsLoading() {
  return (
    <Loading>
      <PageIntroSkeleton />
      <div className="grid gap-x-8 gap-y-14 md:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className={i % 2 ? "md:mt-24" : ""}>
            <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
            <Skeleton className="mt-5 h-8 w-2/3" />
            <Skeleton className="mt-4 h-5 w-1/2" />
          </div>
        ))}
      </div>
    </Loading>
  );
}
