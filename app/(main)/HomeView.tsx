"use client";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cvQuickInfo as quickInfo } from "@/data/cv";
import type { getExperiences, getProjects, getSkills } from "@/lib/data";
import { ArrowRight, ExportSquare } from "iconsax-reactjs";
import { moduleVisibility, type ModuleRow } from "@/app/utils/moduleVisibility";
import { motion } from "motion/react"
import Counter from "../utils/CounterMotion";
import {
  AvatarGroup,
  AvatarGroupTooltip,
} from '@/components/animate-ui/components/animate/avatar-group';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';

function RevealSection({ children, className, show = true, order }: { children: React.ReactNode; className?: string; show?: boolean; order?: number }) {
  if (!show) return null;
  return <div style={{ order }} className={`border-b last:border-none border-gray-100 pb-10 ${className || ""}`}>{children}</div>;
}

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

  return (
    <div className="flex flex-col gap-6">
      <section className="h-[68dvh] flex justify-center items-center">
        {/* <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative aspect-square h-full overflow-hidden rounded-full bg-muted max-h-56 max-w-56">
          <Image src="/Thanh2.jpg" alt="Mai Tri Thanh" fill priority className="object-cover object-[center_30%]" />
        </motion.div> */}
        <div className="space-y-5 flex flex-col justify-center items-center w-full">
          <Badge variant="secondary" className="w-fit font-normal text-muted-foreground">{settings.hero_badge || "Building clean web experiences"}</Badge>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">I&apos;m Mai Tri Thanh.</h1>
          <p className="max-w-xl text-base leading-7 text-muted-foreground">{settings.hero_subtitle || "..."}</p>
          {/* <p className="text-sm text-muted-foreground">React · Next.js · Laravel</p> */}
          <div className="flex flex-wrap gap-3">
            <motion.button whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }} >
              <Button asChild><Link href="/projects">View projects <ArrowRight variant="Outline" className="ml-1.5" /></Link></Button>
            </motion.button>
            {/* <motion.button whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }} >
              <Button asChild variant="outline"><Link href="/about">About me</Link></Button>
            </motion.button> */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button variant="secondary" onClick={() => resumeDialog.current?.showModal()}>My Resume</Button>
            </motion.div>
          </div>
        </div>
      </section>

      <dialog ref={resumeDialog} aria-labelledby="resume-title" onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.close(); }} className="m-auto h-[min(88vh,900px)] w-[min(94vw,1000px)] max-w-none overflow-hidden rounded-2xl border border-border bg-background p-0 shadow-2xl backdrop:bg-black/70">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
            <h2 id="resume-title" className="font-semibold">Mai Tri Thanh · Resume</h2>
            <div className="flex items-center gap-3">
              <a href="/CV_MaiTriThanh.pdf" download className="text-sm text-muted-foreground hover:text-foreground">Download PDF</a>
              <button type="button" onClick={() => resumeDialog.current?.close()} aria-label="Close resume" className="rounded-md px-2 py-1 text-xl text-muted-foreground hover:bg-muted hover:text-foreground">×</button>
            </div>
          </div>
          <iframe src="/CV_MaiTriThanh.pdf" title="Mai Tri Thanh resume PDF" loading="lazy" className="min-h-0 w-full flex-1" />
        </div>
      </dialog>

      <RevealSection show={modules.isVisible("tech_stack")} order={modules.order("tech_stack", 1)}>
        <div>
          <h2 className="text-md font-bold uppercase tracking-wider text-primary">
            Tech Stack
          </h2>
          <div className="mt-6 flex flex-wrap gap-2 w-full">
            <AvatarGroup className="gap-6 flex flex-wrap justify-between w-full items-center">
              {skills.slice(0, 12).map((item) => (
                <Link key={item.name} href={item.link} target="_blank" rel="noreferrer">
                  <Avatar key={item.name} className="size-12 rounded-sm">
                    <AvatarImage src={item.image} alt={item.name} />
                    <AvatarFallback>{item.name}</AvatarFallback>
                    <AvatarGroupTooltip>{item.name}</AvatarGroupTooltip>
                  </Avatar>
                </Link>
              ))}
            </AvatarGroup>
          </div>
        </div>
      </RevealSection>

      <RevealSection show={modules.isVisible("education")} order={modules.order("education", 2)}>
        <div>
          <h2 className="text-md font-bold uppercase tracking-wider text-primary">
            Education
          </h2>
          <div className="mt-4 border-l-2 border-primary pl-4">
            <p className="font-medium text-foreground">Software Engineering</p>
            <p className="text-sm text-muted-foreground">HUFLIT · 2020 – 2024</p>
            <p className="mt-1 text-sm text-muted-foreground/60 italic">{quickInfo.education}</p>
          </div>
        </div>
      </RevealSection>

      <RevealSection show={modules.isVisible("experience")} order={modules.order("experience", 3)}>
        <div>
          <h2 className="text-md font-bold uppercase tracking-wider text-primary">
            Experience
          </h2>
          <div className="mt-4 space-y-6">
            {timeline.map((item, idx) => (
              <div key={`${item.company}-${item.period}`} className="border-l-2 border-primary pl-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-foreground">{item.role}</p>
                    <p className="text-sm text-muted-foreground">{item.company}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.period}</span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground/60">{item.location}</p>
                <ul className="mt-2 space-y-1">
                  {item.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 block h-1 w-1 shrink-0 rounded-full bg-muted-foreground/40" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      <RevealSection show={modules.isVisible("stats")} order={modules.order("stats", 4)}>
        <div className="flex justify-between gap-6 w-full">
          <div>
            <p className="text-3xl font-semibold tracking-tight text-foreground">
              <Counter to={2} />+
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Years of experience</p>
          </div>
          <div>
            <p className="text-3xl font-semibold tracking-tight text-foreground">
              <Counter to={projects.length} />+</p>
            <p className="mt-1 text-sm text-muted-foreground">Projects shipped</p>
          </div>
          <div>
            <p className="text-3xl font-semibold tracking-tight text-foreground">
              <Counter to={skills.length} />+
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Technologies used</p>
          </div>
          <div>
            <p className="text-3xl font-semibold tracking-tight text-foreground">
              <Counter to={500} />+
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Git contributions</p>
          </div>
        </div>
      </RevealSection>

      <RevealSection show={modules.isVisible("projects")} order={modules.order("projects", 5)}>
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-md font-bold uppercase tracking-wider text-primary">
              Projects
            </h2>
            <Link href="/projects" className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground">
              See all →
            </Link>
          </div>
          <div className="mt-4 grid gap-5 sm:grid-cols-3">
            {projects.slice(0, 3).map((project) => (
              <Card key={project.name} className="group overflow-hidden bg-muted/40 transition-colors hover:bg-muted/70">
                <a href={project.preview} target="_blank" rel="noreferrer" className="block h-full">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={project.image} alt={project.name} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
                  </div>
                  <CardContent className="flex min-h-28 flex-col p-4">
                    <p className="text-xs text-muted-foreground">{project.date}</p>
                    <p className="mt-0.5 font-medium text-foreground">{project.name}</p>
                    <span className="mt-auto inline-flex items-center gap-1 pt-2 text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                      Preview <ExportSquare variant="Outline" />
                    </span>
                  </CardContent>
                </a>
              </Card>
            ))}
          </div>
        </div>
      </RevealSection>

      <RevealSection show={modules.isVisible("cta")} order={modules.order("cta", 6)}>
        <Card className="bg-muted/50">
          <CardContent className="flex flex-col items-center gap-4 p-6 text-center md:flex-row md:justify-between md:text-left">
            <div>
              <p className="font-medium text-foreground">
                {settings.cta_title || "Let's build something memorable."}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {settings.cta_subtitle || "Open for freelance, product, and startup collaborations."}
              </p>
            </div>
            <Button asChild>
              <Link href={`mailto:${settings.email || "maitrithanh06@gmail.com"}`}>
                Contact Me <ArrowRight variant="Outline" className="ml-1.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </RevealSection>
    </div>
  );
}
