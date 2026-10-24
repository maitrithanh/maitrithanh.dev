import { getExperiences, getModules, getProjects, getSettings, getSkills } from "@/lib/data";
import { HomeView } from "./HomeView";

export default async function Home() {
  const [projects, skills, timeline, settings, moduleRows] = await Promise.all([
    getProjects(), getSkills(), getExperiences(), getSettings(), getModules("home"),
  ]);
  return <HomeView projects={projects} skills={skills} timeline={timeline} settings={settings} moduleRows={moduleRows} />;
}
