import { Skeleton } from "@/components/ui/skeleton";
import { Loading } from "@/components/ui/page-skeletons";

export default function AboutLoading() {
  return (
    <Loading>
      <div className="grid items-end gap-10 pb-16 pt-6 md:grid-cols-12 md:pt-10">
        <Skeleton className="mx-auto aspect-[433/576] w-[min(64vw,18rem)] rounded-b-none rounded-t-full md:col-span-4 md:w-full" />
        <div className="space-y-4 md:col-span-8">
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-14 w-3/4 rounded-xl" />
          <div className="max-w-2xl space-y-2 pt-6">
            {["w-full", "w-11/12", "w-4/5", "w-full", "w-2/3"].map((w, i) => <Skeleton key={i} className={`h-5 ${w}`} />)}
          </div>
        </div>
      </div>
    </Loading>
  );
}
