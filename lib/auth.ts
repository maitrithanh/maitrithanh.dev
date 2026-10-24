import { NextResponse } from "next/server";
import { createClient } from "./supabase/server";

import { ALLOWED_EMAIL } from "./auth-config";

export { ALLOWED_EMAIL };

export async function getAdminUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ALLOWED_EMAIL) return null;
  return user;
}

export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}
