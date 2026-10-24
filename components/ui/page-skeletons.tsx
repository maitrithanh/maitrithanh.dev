import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Shared by the blog and projects loading states: badge, title, intro.
export function PageHeaderSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-5 w-full max-w-xl" />
    </div>
  );
}

export function CardGridSkeleton({ count, className, image, children }: { count: number; className?: string; image: string; children?: React.ReactNode }) {
  return (
    <div className={cn("grid gap-6", className)}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="overflow-hidden rounded-xl bg-muted/40">
          <Skeleton className={cn("w-full rounded-none", image)} />
          <div className="space-y-2 p-4">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-3/4" />
            {children}
          </div>
        </div>
      ))}
    </div>
  );
}
