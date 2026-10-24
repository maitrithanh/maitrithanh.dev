import Link from "next/link";
import Image from "next/image";
import { getBlogPosts, getModules } from "@/lib/data";
import { moduleVisibility } from "@/app/utils/moduleVisibility";
import { PageIntro } from "@/app/components/PageIntro";

const BlogPage = async () => {
  const [posts, rows] = await Promise.all([getBlogPosts(), getModules("blog")]);
  const modules = moduleVisibility(rows);

  return (
    modules.isVisible("content") && (
      <>
        <PageIntro title="Blog">
          Notes on product engineering, motion, and building frontends that stay fast as they grow.
        </PageIntro>

        <ul className="border-t">
          {posts.map((post) => (
            <li key={post.slug} className="border-b">
              <Link href={`/blog/${post.slug}`} className="group grid gap-4 py-8 sm:grid-cols-[8rem_1fr_9rem] sm:gap-8">
                <time dateTime={post.publishedAt} className="text-sm tabular-nums text-muted-foreground sm:pt-1.5">
                  {new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </time>
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight transition-colors md:text-3xl">
                    <span className="link-sweep">{post.title}</span>
                  </h2>
                  <p className="mt-2 max-w-2xl leading-7 text-muted-foreground">{post.summary}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{post.category}, {post.readTime}</p>
                </div>
                <div className="relative hidden aspect-[4/3] overflow-hidden rounded-xl bg-muted sm:block">
                  <Image src={post.cover} alt="" fill sizes="9rem" className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </>
    )
  );
};

export default BlogPage;
