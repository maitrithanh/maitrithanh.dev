"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { blogPosts as fallbackPosts } from "@/lib/blog";
import { toBlogPost } from "@/lib/shape";
import { Calendar, ArrowRight } from "iconsax-reactjs";
import { useModuleVisibility } from "@/app/utils/useModuleVisibility";

const BlogPage = () => {
  const [posts, setPosts] = useState(fallbackPosts);
  const modules = useModuleVisibility("blog");

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.length > 0) {
          setPosts(data.map(toBlogPost));
        }
      })
      .catch(() => {});
  }, []);

  return (
    modules.isVisible("content") && (
    <div className="space-y-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <Badge variant="secondary" className="w-fit font-normal text-muted-foreground">Articles</Badge>
          <h1 className="text-4xl font-semibold tracking-tight">Blog</h1>
          <p className="max-w-xl leading-7 text-muted-foreground">Insights on product engineering, motion design, and scalable frontend development.</p>
        </div>
        <Link href="mailto:maitrithanh06@gmail.com" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Suggest a topic →</Link>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="block h-full">
            <Card className="group flex h-full flex-col overflow-hidden bg-muted/40 transition-colors hover:bg-muted/70">
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image src={post.cover} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
              </div>
              <CardContent className="flex flex-1 flex-col p-4">
                <span className="w-fit rounded-md bg-background/70 px-2 py-0.5 text-xs text-foreground/60">{post.category}</span>
                <h3 className="mt-2 line-clamp-2 font-medium text-foreground">{post.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{post.summary}</p>
                <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground/60">
                  <Calendar variant="Outline" className="mr-1" />
                  {new Date(post.publishedAt).toLocaleDateString("en-GB")}
                </div>
                <span className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-medium text-foreground/60 transition-colors group-hover:text-foreground">
                  Read <ArrowRight variant="Outline" size={12} />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
    )
  );
};

export default BlogPage;
