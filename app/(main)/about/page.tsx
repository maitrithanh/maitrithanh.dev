"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useModuleVisibility } from "@/app/utils/useModuleVisibility";

const AboutPage = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const modules = useModuleVisibility("about");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => Object.keys(d).length && setSettings(d))
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col gap-14">
      {modules.isVisible("bio") && (
      <section style={{ order: modules.order("bio", 1) }} className="w-full">
        <div className="flex w-full justify-center items-center">
          <div className="w-full relative aspect-square overflow-hidden rounded-full bg-muted flex justify-center items-center max-h-56 max-w-56">
            <Image src="/Thanh2.jpg" alt="Mai Tri Thanh" fill className="object-cover object-[center_30%]" priority />
          </div>
        </div>
        <div className="space-y-5 text-base leading-7 text-muted-foreground">
          <Badge variant="secondary" className="w-fit font-normal text-muted-foreground">About</Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">I&apos;m Thanh, a full-stack developer based in Ho Chi Minh City.</h1>
          <p>{settings.about_me || "I enjoy blending solid engineering with thoughtful UI, building digital products that are fast, useful, and easy to understand."}</p>
          <p>{settings.about_focus || "My focus is building fast web products with clean architecture, smooth interactions, and details users can feel."}</p>
          <div className="flex flex-wrap gap-1.5 pt-2">
            {["Next.js", "React", "TypeScript", "Laravel", "REST APIs"].map((skill) => (
              <span key={skill} className="rounded-md bg-muted px-2.5 py-0.5 text-xs text-foreground/70">{skill}</span>
            ))}
          </div>
        </div>
      </section>
      )}

      {modules.isVisible("experience") && (
      <div style={{ order: modules.order("experience", 2) }}>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Experience</h2>
        <div className="mt-5 space-y-4">
          {[
            "Built responsive production interfaces and optimized performance on modern frontend stacks.",
            "Contributed backend APIs and data integrations to ship end-to-end features.",
            "Collaborated with designers to turn concepts into maintainable, reusable component systems.",
          ].map((text) => (
            <div key={text} className="flex gap-3 border-l-2 border-border pl-4">
              <span className="text-sm leading-relaxed text-muted-foreground">{text}</span>
            </div>
          ))}
        </div>
      </div>
      )}

      {modules.isVisible("education") && (
      <div style={{ order: modules.order("education", 3) }}>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Education</h2>
        <div className="mt-5 border-l-2 border-primary pl-4">
          <p className="font-medium text-foreground">Software Engineering</p>
          <p className="text-sm text-muted-foreground">Ho Chi Minh City University of Foreign Languages – Information Technology</p>
          <p className="mt-0.5 text-xs text-muted-foreground/60">2020 – 2024 · GPA 3.2/4.0</p>
        </div>
      </div>
      )}
    </div>
  );
};

export default AboutPage;
