export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/server";
import { projects } from "@/data/projects";
import { skill } from "@/data/skill";
import { careerTimeline } from "@/data/cv";
import { blogPosts } from "@/lib/blog";
import { blogPostRow, projectRow, toExperience, toSkill } from "@/lib/shape";

export async function POST() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const supabase = await createAdminClient();
  const result: Record<string, number> = {};

  const { count: pc } = await supabase.from("projects").select("*", { count: "exact", head: true });
  if (!pc) {
    const rows = projects.map(projectRow);
    const { error } = await supabase.from("projects").insert(rows);
    if (error) throw error;
    result.projects = rows.length;
  }

  const { count: bc } = await supabase.from("blog_posts").select("*", { count: "exact", head: true });
  if (!bc) {
    const rows = blogPosts.map(blogPostRow);
    const { error } = await supabase.from("blog_posts").insert(rows);
    if (error) throw error;
    result.blog_posts = rows.length;
  }

  const { count: sc } = await supabase.from("skills").select("*", { count: "exact", head: true });
  if (!sc) {
    const rows = skill.map(toSkill);
    const { error } = await supabase.from("skills").insert(rows);
    if (error) throw error;
    result.skills = rows.length;
  }

  const { count: ec } = await supabase.from("experiences").select("*", { count: "exact", head: true });
  if (!ec) {
    const rows = careerTimeline.map((e, i) => ({ ...toExperience(e), sort_order: i }));
    const { error } = await supabase.from("experiences").insert(rows);
    if (error) throw error;
    result.experiences = rows.length;
  }

  return NextResponse.json({ ok: true, seeded: result });
}
