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
  const body = await request.json();
  const supabase = await createAdminClient();

  for (const [key, value] of Object.entries(body)) {
    const { data: existing } = await supabase
      .from("site_settings")
      .select("id")
      .eq("key", key)
      .single();

    if (existing) {
      await supabase
        .from("site_settings")
        .update({ value: String(value), updated_at: new Date().toISOString() })
        .eq("key", key);
    } else {
      await supabase.from("site_settings").insert({ key, value: String(value) });
    }
  }

  return NextResponse.json({ ok: true });
}
