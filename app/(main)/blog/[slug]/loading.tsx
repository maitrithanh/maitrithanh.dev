import { Skeleton } from "@/components/ui/skeleton";

// Mirrors BlogPostView: cover, badge, title, summary, meta, paragraphs.
export default function Loading() {
  return (
    <div role="status" className="mx-auto max-w-3xl space-y-6">
      <span className="sr-only">Loading...</span>
      <Skeleton className="h-10 w-36" />
      <div className="overflow-hidden rounded-xl bg-muted/30">
        <Skeleton className="h-56 w-full rounded-none md:h-72" />
        <div className="space-y-5 p-6 md:p-8">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-10 w-4/5" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-4 w-48" />
          <div className="space-y-2 pt-2">
            {["w-full", "w-11/12", "w-full", "w-3/4", "w-full", "w-5/6"].map((w, i) => <Skeleton key={i} className={`h-4 ${w}`} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
