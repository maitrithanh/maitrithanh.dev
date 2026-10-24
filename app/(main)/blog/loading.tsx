import { Skeleton } from "@/components/ui/skeleton";
import { CardGridSkeleton, PageHeaderSkeleton } from "@/components/ui/page-skeletons";

export default function Loading() {
  return (
    <div role="status" className="space-y-12">
      <span className="sr-only">Loading...</span>
      <PageHeaderSkeleton />
      <CardGridSkeleton count={3} className="md:grid-cols-3" image="aspect-[16/9]">
        <Skeleton className="h-3 w-full" />
      </CardGridSkeleton>
    </div>
  );
}
