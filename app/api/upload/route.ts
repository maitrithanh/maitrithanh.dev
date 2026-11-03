import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/auth";

const BUCKET = "images";
const MAX_BYTES = 5 * 1024 * 1024;
const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif", "image/avif": "avif" };

// Admin-only image upload to the public Supabase Storage bucket. Returns the public URL.
export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const file = (await request.formData()).get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file" }, { status: 400 });
  const ext = TYPES[file.type];
  if (!ext) return NextResponse.json({ error: "Only JPG, PNG, WebP, GIF or AVIF" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Max 5 MB" }, { status: 400 });

  // Plain service-role client (no session cookies) so storage writes bypass RLS.
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const path = `${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type, cacheControl: "31536000" });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ url: supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl });
}
