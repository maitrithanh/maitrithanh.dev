import { Skeleton } from "@/components/ui/skeleton";
import { Loading } from "@/components/ui/page-skeletons";

// Mirrors BlogPostView: category, title, summary, cover, paragraphs.
export default function PostLoading() {
  return (
    <Loading>
      <div className="mx-auto max-w-3xl pt-6 md:pt-10">
        <Skeleton className="mb-10 h-5 w-24" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="mt-4 h-12 w-full rounded-xl" />
        <Skeleton className="mt-3 h-12 w-2/3 rounded-xl" />
        <Skeleton className="mt-6 h-6 w-full" />
        <Skeleton className="mt-10 aspect-[16/9] w-full rounded-2xl" />
        <div className="mt-10 space-y-3">
          {["w-full", "w-11/12", "w-full", "w-3/4", "w-full", "w-5/6"].map((w, i) => <Skeleton key={i} className={`h-5 ${w}`} />)}
        </div>
      </div>
    </Loading>
  );
}
