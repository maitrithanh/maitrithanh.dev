import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-5 md:px-8">
      <p className="text-[clamp(6rem,24vw,16rem)] font-display font-bold leading-[0.8] tracking-[-0.05em] text-marigold [font-stretch:75%]">404</p>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight md:text-5xl">This page doesn&apos;t exist.</h1>
      <p className="mt-3 max-w-md text-lg text-muted-foreground">The link may be old or mistyped. Start from the home page or browse the projects.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild size="lg" className="px-6"><Link href="/">Go home</Link></Button>
        <Button asChild size="lg" variant="outline" className="px-6"><Link href="/projects">See projects</Link></Button>
      </div>
    </main>
  );
}
