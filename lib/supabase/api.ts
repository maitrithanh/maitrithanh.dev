import { createClient } from "./server";
import { createAdminClient } from "./server";
import { applySavedOrder } from "@/lib/sort";

export type TableName = "projects" | "blog_posts" | "skills" | "experiences" | "site_settings";
const sortableTables = new Set<TableName>(["projects", "blog_posts", "skills", "experiences"]);

export async function list(table: TableName, options?: { orderBy?: string; ascending?: boolean }) {
  const supabase = await createClient();
  let query = supabase.from(table).select("*");
  if (options?.orderBy) {
    query = query.order(options.orderBy, { ascending: options.ascending ?? false });
  }
  const { data, error } = await query;
  if (error) throw error;
  if (sortableTables.has(table)) {
    const { data: setting, error: sortError } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", `sort:${table}`)
      .maybeSingle();
    if (sortError) throw sortError;
    if (setting) {
      try {
        const ids = JSON.parse(setting.value);
        if (Array.isArray(ids)) return applySavedOrder(data, ids);
      } catch { /* Keep the database order if a saved value is malformed. */ }
    }
  }
  return data;
}

export async function getById(table: TableName, id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from(table).select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

// Callers may not choose DB-owned columns.
function writable(body: unknown) {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("Invalid body");
  const { id, created_at, updated_at, ...rest } = body as Record<string, unknown>;
  return rest;
}

export async function create(table: TableName, body: unknown) {
  const supabase = await createAdminClient();
  const { data, error } = await supabase.from(table).insert(writable(body)).select().single();
  if (error) throw error;
  return data;
}

export async function update(table: TableName, id: string, body: unknown) {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from(table)
    .update({ ...writable(body), updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function remove(table: TableName, id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;
}
