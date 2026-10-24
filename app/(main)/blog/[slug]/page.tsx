import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { blogPosts as fallbackPosts } from "@/lib/blog";
import { getBlogPostBySlug } from "@/lib/data";
import { ArrowLeft } from "iconsax-reactjs";
import { BlogPostView } from "@/components/BlogPostView";
import { SITE_URL } from "@/lib/constants";
import { createMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return fallbackPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getBlogPostBySlug((await params).slug);
  if (!post) return { title: "Post not found", robots: { index: false } };

  return createMetadata({
    path: `/blog/${post.slug}`,
    title: post.title,
    description: post.summary,
    image: post.cover,
    type: "article",
    publishedTime: post.publishedAt,
  });
}

export default async function BlogDetailPage({ params }: PageProps) {
  const post = await getBlogPostBySlug((await params).slug);
  if (!post) notFound();

  return (
    <>
      <JsonLd data={{
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.summary,
            image: `${SITE_URL}${post.cover}`,
            datePublished: post.publishedAt,
            author: { "@type": "Person", name: "Mai Tri Thanh", url: SITE_URL },
            publisher: { "@type": "Person", name: "Mai Tri Thanh" },
            mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${post.slug}` },
          }} />
      <div className="mx-auto max-w-3xl space-y-6">
        <Button asChild variant="outline">
          <Link href="/blog" className="inline-flex items-center gap-2">
            <ArrowLeft variant="Outline" size={12} /> Back to blog
          </Link>
        </Button>

        <BlogPostView post={post} />
      </div>
    </>
  );
}
