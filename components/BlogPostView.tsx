import Image from "next/image";
import { Calendar, Clock } from "iconsax-reactjs";
import { Badge } from "@/components/ui/badge";
import { Markdown } from "@/components/Markdown";
import type { BlogPost } from "@/types/blog";

// The post body as readers see it. The CMS preview renders this same
// component so what you edit is exactly what ships.
export function BlogPostView({ post, preview }: { post: BlogPost; preview?: boolean }) {
  const date = new Date(post.publishedAt);
  return (
    <div className="overflow-hidden rounded-xl bg-muted/30">
      {post.cover && (
        <div className="relative h-56 w-full md:h-72">
          {preview ? (
            // Half-typed URLs would throw in next/image, so the CMS preview uses a plain img.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <Image src={post.cover} alt={post.title} fill className="object-cover" priority />
          )}
        </div>
      )}
      <div className="space-y-5 p-6 md:p-8">
        {post.category && (
          <Badge variant="secondary" className="text-xs text-foreground/70">{post.category}</Badge>
        )}
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl">{post.title}</h1>
        <p className="text-base text-muted-foreground">{post.summary}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {!isNaN(date.getTime()) && <span className="inline-flex items-center gap-1.5"><Calendar variant="Outline" />{date.toLocaleDateString("en-GB")}</span>}
          {post.readTime && <span className="inline-flex items-center gap-1.5"><Clock variant="Outline" />{post.readTime}</span>}
        </div>
        <article>
          {/* Older posts store one paragraph per entry; new ones store one markdown string. */}
          <Markdown source={post.content.join("\n\n")} />
        </article>
      </div>
    </div>
  );
}
