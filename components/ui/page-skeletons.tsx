import { Skeleton } from "@/components/ui/skeleton";

// Matches PageIntro: condensed display title and an intro paragraph.
export function PageIntroSkeleton() {
  return (
    <div className="space-y-6 pb-12 pt-6 md:pb-16 md:pt-10">
      <Skeleton className="h-[clamp(3rem,9vw,6.5rem)] w-3/5 rounded-xl" />
      <div className="max-w-xl space-y-2">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-4/5" />
      </div>
    </div>
  );
}

export function Loading({ children }: { children: React.ReactNode }) {
  return (
    <div role="status">
      <span className="sr-only">Loading...</span>
      {children}
    </div>
  );
}
