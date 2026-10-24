import Image from "next/image";
import { Markdown } from "@/components/Markdown";
import type { BlogPost } from "@/types/blog";

// The post body as readers see it. The CMS preview renders this same
// component so what you edit is exactly what ships.
export function BlogPostView({ post, preview }: { post: BlogPost; preview?: boolean }) {
  const date = new Date(post.publishedAt);
  const meta = [
    !isNaN(date.getTime()) && date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
    post.readTime,
  ].filter(Boolean).join(", ");

  return (
    <article>
      <header>
        {post.category && <p className="text-sm font-medium text-muted-foreground">{post.category}</p>}
        <h1 className="mt-3 text-[clamp(2.25rem,5.5vw,4rem)] font-bold leading-[1] tracking-[-0.03em] [font-stretch:88%]">{post.title}</h1>
        {post.summary && <p className="mt-5 text-xl leading-8 text-muted-foreground">{post.summary}</p>}
        {meta && <p className="mt-5 text-sm text-muted-foreground">{meta}</p>}
      </header>
      {post.cover && (
        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
          {preview ? (
            // Half-typed URLs would throw in next/image, so the CMS preview uses a plain img.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <Image src={post.cover} alt="" fill sizes="(min-width: 768px) 48rem, 100vw" className="object-cover" priority />
          )}
        </div>
      )}
      <div className="mt-10 text-lg">
        {/* Older posts store one paragraph per entry; new ones store one markdown string. */}
        <Markdown source={post.content.join("\n\n")} />
      </div>
    </article>
  );
}
