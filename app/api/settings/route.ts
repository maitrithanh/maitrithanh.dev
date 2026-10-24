export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { list } from "@/lib/supabase/api";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  const data = await list("site_settings");
  const settings: Record<string, string> = {};
  for (const item of data) {
    if (!item.key.startsWith("sort:") && item.key !== "page_modules") settings[item.key] = item.value;
  }
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await request.json().catch(() => null);
  const entries = body && typeof body === "object" && !Array.isArray(body) ? Object.entries(body) : [];
  // sort:* and page_modules are owned by their own endpoints.
  if (!entries.length || entries.length > 50 || !entries.every(([key, value]) =>
      /^[a-z0-9_]{1,50}$/.test(key) && key !== "page_modules" &&
      typeof value === "string" && value.length <= 5000)) {
    return NextResponse.json({ error: "Invalid settings" }, { status: 400 });
  }

  const supabase = await createAdminClient();
  const now = new Date().toISOString();
  const { error } = await supabase.from("site_settings").upsert(
    entries.map(([key, value]) => ({ key, value, updated_at: now })),
    { onConflict: "key" },
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
