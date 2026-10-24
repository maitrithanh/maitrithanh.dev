import Image from "next/image";
import { moduleVisibility } from "@/app/utils/moduleVisibility";
import { getExperiences, getModules, getSettings } from "@/lib/data";
import { Timeline } from "@/app/components/Timeline";
import { cvQuickInfo } from "@/data/cv";

const AboutPage = async () => {
  const [settings, rows, timeline] = await Promise.all([getSettings(), getModules("about"), getExperiences()]);
  const modules = moduleVisibility(rows);

  return (
    <div className="flex flex-col">
      {modules.isVisible("bio") && (
        <section style={{ order: modules.order("bio", 1) }} className="grid items-end gap-10 pb-16 pt-6 md:grid-cols-12 md:pt-10">
          <div className="relative mx-auto w-[min(64vw,18rem)] md:col-span-4 md:w-full">
            <div aria-hidden className="absolute inset-x-[6%] bottom-0 top-[18%] rounded-t-full bg-marigold" />
            <div className="relative aspect-[433/540] overflow-hidden">
              <Image src="/portrait/center.webp" alt="Mai Trí Thành" width={433} height={576} priority className="w-full" />
            </div>
          </div>
          <div className="md:col-span-8">
            <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.03em] [font-stretch:85%]">
              I&apos;m Thành, a software engineer in Ho Chi Minh City.
            </h1>
            <div className="mt-8 max-w-2xl space-y-5 text-lg leading-8 text-muted-foreground">
              <p>{settings.about_me || "I enjoy blending solid engineering with thoughtful UI, building digital products that are fast, useful, and easy to understand."}</p>
              <p>{settings.about_focus || "My focus is building fast web products with clean architecture, smooth interactions, and details users can feel."}</p>
            </div>
            <ul className="mt-8 flex flex-wrap gap-1.5">
              {cvQuickInfo.coreSkills.map((skill) => (
                <li key={skill} className="rounded-full border px-3 py-1 text-sm text-muted-foreground">{skill}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {modules.isVisible("experience") && (
        <section style={{ order: modules.order("experience", 2) }} className="grid gap-8 border-t py-16 md:grid-cols-12 md:py-24">
          <h2 className="text-3xl font-semibold tracking-tight md:col-span-4 md:text-4xl">Experience</h2>
          <div className="md:col-span-8"><Timeline items={timeline} /></div>
        </section>
      )}

      {modules.isVisible("education") && (
        <section style={{ order: modules.order("education", 3) }} className="grid gap-8 border-t py-16 md:grid-cols-12 md:py-24">
          <h2 className="text-3xl font-semibold tracking-tight md:col-span-4 md:text-4xl">Education</h2>
          <div className="md:col-span-8">
            <p className="font-display text-2xl font-semibold tracking-tight">Software Engineering</p>
            <p className="mt-2 text-muted-foreground">Ho Chi Minh City University of Foreign Languages and Information Technology</p>
            <p className="mt-1 text-sm text-muted-foreground">2020 to 2024, GPA 3.2/4.0</p>
          </div>
        </section>
      )}
    </div>
  );
};

export default AboutPage;
