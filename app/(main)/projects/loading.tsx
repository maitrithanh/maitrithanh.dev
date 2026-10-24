import { CardGridSkeleton, PageHeaderSkeleton } from "@/components/ui/page-skeletons";

export default function Loading() {
  return (
    <div role="status" className="space-y-12">
      <span className="sr-only">Loading...</span>
      <PageHeaderSkeleton />
      <CardGridSkeleton count={4} className="md:grid-cols-2" image="aspect-[16/9]" />
    </div>
  );
}
