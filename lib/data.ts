import { createClient } from "./supabase/server";
import { list, type TableName } from "./supabase/api";
import { getPageModules } from "./page-modules";
import { projects as staticProjects } from "@/data/projects";
import { blogPosts as staticBlogPosts } from "@/lib/blog";
import { skill as staticSkills } from "@/data/skill";
import { careerTimeline as staticTimeline } from "@/data/cv";
import { toBlogPost, toExperience, toProject, toSkill } from "@/lib/shape";

// Server reads for the public pages. Same query and saved CMS order as the
// /api routes; the bundled static data is used only when the database errors
// or the table is empty.
async function read<T>(table: TableName, map: (row: any) => NoInfer<T>, fallback: T[], options: { orderBy: string; ascending?: boolean }) {
  try {
    const rows = await list(table, options);
    if (rows?.length) return rows.map(map);
  } catch (e) {
    console.error(`Failed to load ${table}, using static data`, e);
  }
  return fallback;
}

export const getProjects = () => read("projects", toProject, staticProjects, { orderBy: "created_at" });
export const getBlogPosts = () => read("blog_posts", toBlogPost, staticBlogPosts, { orderBy: "published_at" });
export const getSkills = () => read("skills", toSkill, staticSkills, { orderBy: "created_at", ascending: true });
export const getExperiences = () => read("experiences", toExperience, staticTimeline, { orderBy: "sort_order", ascending: true });

export async function getBlogPostBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).maybeSingle();
    if (error) throw error;
    if (data) return toBlogPost(data);
  } catch (e) {
    console.error("Failed to load blog post, using static data", e);
  }
  return staticBlogPosts.find((p) => p.slug === slug) || null;
}

export async function getSettings() {
  const settings: Record<string, string> = {};
  try {
    for (const item of await list("site_settings")) {
      if (!item.key.startsWith("sort:") && item.key !== "page_modules") settings[item.key] = item.value;
    }
  } catch (e) {
    console.error("Failed to load settings, using defaults", e);
  }
  return settings;
}

// Visibility/order rows for one page; empty means "show everything in default order".
export async function getModules(page: string) {
  try {
    return (await getPageModules())
      .filter((m) => m.page === page)
      .map((m) => ({ section: m.section, visible: m.visible }));
  } catch (e) {
    console.error("Failed to load page modules", e);
    return [];
  }
}
