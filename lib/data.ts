import { createClient } from "./supabase/server";
import { projects as staticProjects } from "@/data/projects";
import { blogPosts as staticBlogPosts } from "@/lib/blog";
import { skill as staticSkills } from "@/data/skill";
import { careerTimeline as staticTimeline } from "@/data/cv";
import { toBlogPost, toExperience, toProject, toSkill } from "@/lib/shape";

export async function getProjects() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    if (data && data.length > 0) return data.map(toProject);
  } catch {}
  return staticProjects;
}

export async function getBlogPosts() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("blog_posts").select("*").order("published_at", { ascending: false });
    if (data && data.length > 0) return data.map(toBlogPost);
  } catch {}
  return staticBlogPosts;
}

export async function getBlogPostBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("blog_posts").select("*").eq("slug", slug).single();
    if (data) return toBlogPost(data);
  } catch {}
  return staticBlogPosts.find((p) => p.slug === slug) || null;
}

export async function getSkills() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("skills").select("*").order("created_at");
    if (data && data.length > 0) return data.map(toSkill);
  } catch {}
  return staticSkills;
}

export async function getExperiences() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("experiences").select("*").order("sort_order");
    if (data && data.length > 0) return data.map(toExperience);
  } catch {}
  return staticTimeline;
}

export async function getSettings() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("site_settings").select("*");
    if (data && data.length > 0) {
      const settings: Record<string, string> = {};
      for (const item of data) {
        settings[item.key] = item.value;
      }
      return settings;
    }
  } catch {}
  return {};
}
