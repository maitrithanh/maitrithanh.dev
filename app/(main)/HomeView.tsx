"use client";
import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { cvQuickInfo as quickInfo } from "@/data/cv";
import type { getExperiences, getProjects, getSkills } from "@/lib/data";
import { moduleVisibility, type ModuleRow } from "@/app/utils/moduleVisibility";
import { WorkList } from "@/app/components/WorkList";
import { Timeline } from "@/app/components/Timeline";
import Counter from "../utils/CounterMotion";
import { cn } from "@/lib/utils";
import Link from "next/link";

const ease = [0.22, 1, 0.36, 1] as const;

// Data is loaded on the server by page.tsx; this renders it with the
// interactive bits (resume dialog, motion).
export function HomeView({ projects, skills, timeline, settings, moduleRows }: {
  projects: Awaited<ReturnType<typeof getProjects>>;
  skills: Awaited<ReturnType<typeof getSkills>>;
  timeline: Awaited<ReturnType<typeof getExperiences>>;
  settings: Record<string, string>;
  moduleRows: ModuleRow[];
}) {
  const resumeDialog = useRef<HTMLDialogElement>(null);
  const modules = moduleVisibility(moduleRows);
  const reduce = useReducedMotion();
  const email = settings.email || "maitrithanh06@gmail.com";
  const current = timeline[0];
  const fadeUp = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease },
  });

  return (
    <>
      {/* Editorial hero: meta rule on top, the name set edge to edge, intro and actions beneath. */}
      <section className="flex min-h-[calc(100svh-5rem)] flex-col justify-center gap-8 pb-12 md:gap-12">
        <motion.div {...fadeUp(0)} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b pb-4 text-sm text-muted-foreground">
          <span>Software engineer · Ho Chi Minh City</span>
          {current && (
            <span className="flex items-center gap-2.5">
              <span className="relative flex size-2 shrink-0">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-marigold opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-marigold" />
              </span>
              <span>Now at <span className="font-medium text-foreground">{current.company}</span></span>
            </span>
          )}
        </motion.div>

        {/* Font size in container units so the name spans the column exactly: one line on desktop, two on phones. */}
        <div className="[container-type:inline-size]">
          <h1 className="-ml-[0.04em] text-[48cqw] font-bold leading-[0.8] tracking-[-0.045em] [font-stretch:78%] md:whitespace-nowrap md:text-[25.4cqw]">
            <HeroLine delay={0.05} className="md:inline-block">Mai Trí</HeroLine>{" "}
            <HeroLine delay={0.15} className="pr-[0.08em] md:inline-block">Thành<span className="text-marigold">.</span></HeroLine>
          </h1>
        </div>

        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <motion.p {...fadeUp(0.55)} className="max-w-lg text-lg leading-8 text-muted-foreground md:col-span-7 md:text-xl md:leading-9">
            {settings.hero_subtitle || "Software engineer building iOS apps and web products in Ho Chi Minh City."}
          </motion.p>
          <motion.div {...fadeUp(0.65)} className="flex flex-wrap gap-3 md:col-span-5 md:justify-end">
            <Button asChild size="lg" className="px-6">
              <a href={`mailto:${email}`}>Email me</a>
            </Button>
            <Button size="lg" variant="outline" className="px-6" onClick={() => resumeDialog.current?.showModal()}>
              Read my resume
            </Button>
          </motion.div>
        </div>

        {modules.isVisible("stats") && (
          <motion.dl {...fadeUp(0.85)} className="grid grid-cols-2 gap-y-6 border-t pt-6 sm:grid-cols-4">
            {[
              [2, "years shipping products"],
              [projects.length, "projects built"],
              [skills.length, "technologies used"],
              [500, "contributions on GitHub"],
            ].map(([n, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="font-display text-4xl font-semibold tracking-tight"><Counter to={n as number} />+</dd>
                <dd className="mt-1 text-sm text-muted-foreground">{label}</dd>
              </div>
            ))}
          </motion.dl>
        )}
      </section>

      <div className="flex flex-col">
        {modules.isVisible("projects") && (
          <section style={{ order: modules.order("projects", 1) }} className="border-t py-16 md:py-24">
            <div className="mb-10 flex items-end justify-between gap-4">
              <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">Selected work</h2>
              <Link href="/projects" className="link-sweep pb-1 text-sm font-medium">All projects</Link>
            </div>
            <WorkList projects={projects.slice(0, 4)} />
          </section>
        )}

        {modules.isVisible("experience") && (
          <Section title="Experience" order={modules.order("experience", 2)}>
            <Timeline items={timeline} />
          </Section>
        )}

        {modules.isVisible("tech_stack") && (
          <Section title="Tools I use" order={modules.order("tech_stack", 3)}>
            <ul className="grid grid-cols-3 border-l border-t sm:grid-cols-4">
              {skills.map((item) => (
                <li key={item.name} className="border-b border-r">
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="group flex aspect-[4/3] flex-col items-center justify-center gap-3 transition-colors hover:bg-card">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt="" loading="lazy" className="size-9 object-contain transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-hover:scale-110" />
                    <span className="text-xs text-muted-foreground group-hover:text-foreground">{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {modules.isVisible("education") && (
          <Section title="Education" order={modules.order("education", 4)}>
            <p className="font-display text-2xl font-semibold tracking-tight">Software Engineering</p>
            <p className="mt-2 max-w-xl leading-7 text-muted-foreground">{quickInfo.education}</p>
          </Section>
        )}

        {modules.isVisible("cta") && (
          <section style={{ order: modules.order("cta", 5) }} className="border-t py-20 md:py-32">
            <p className="max-w-md text-lg text-muted-foreground">
              {settings.cta_subtitle || "Open for freelance, product, and startup collaborations."}
            </p>
            <h2 className="mt-3 max-w-3xl text-5xl font-semibold tracking-tight md:text-7xl">
              {settings.cta_title || "Let's build something memorable."}
            </h2>
            <a href={`mailto:${email}`} className="link-sweep mt-10 inline-block break-all font-display text-2xl font-medium tracking-tight sm:text-4xl md:text-5xl">
              {email}
            </a>
          </section>
        )}
      </div>

      <dialog ref={resumeDialog} aria-labelledby="resume-title" onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.close(); }} className="m-auto h-[min(88vh,900px)] w-[min(94vw,1000px)] max-w-none overflow-hidden rounded-2xl border bg-background p-0 text-foreground shadow-2xl backdrop:bg-[hsl(231_52%_10%/0.7)] backdrop:backdrop-blur-sm">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
            <h2 id="resume-title" className="font-semibold">Resume</h2>
            <div className="flex items-center gap-4">
              <a href="/CV_MaiTriThanh.pdf" download className="text-sm text-muted-foreground hover:text-foreground">Download PDF</a>
              <button type="button" onClick={() => resumeDialog.current?.close()} aria-label="Close resume" className="rounded-md px-2 py-1 text-xl text-muted-foreground hover:bg-muted hover:text-foreground">×</button>
            </div>
          </div>
          <iframe src="/CV_MaiTriThanh.pdf" title="Mai Trí Thành resume" loading="lazy" className="min-h-0 w-full flex-1" />
        </div>
      </dialog>
    </>
  );
}

// One line of the hero name, rising from behind a mask. The padding keeps
// Vietnamese diacritics from being clipped by the mask.
function HeroLine({ children, delay, className }: { children: React.ReactNode; delay: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <span className={cn("block overflow-hidden pb-[0.06em] pt-[0.16em]", className)}>
      <motion.span
        className="block"
        initial={reduce ? false : { y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1, delay, ease }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function Section({ title, order, children }: { title: string; order: number; children: React.ReactNode }) {
  return (
    <section style={{ order }} className="grid gap-8 border-t py-16 md:grid-cols-12 md:py-24">
      <h2 className="text-3xl font-semibold tracking-tight md:sticky md:top-28 md:col-span-4 md:self-start md:text-4xl">{title}</h2>
      <div className="md:col-span-8">{children}</div>
    </section>
  );
}
