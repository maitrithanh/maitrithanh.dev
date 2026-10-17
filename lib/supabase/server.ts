import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function createServerSupabase(key: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url || !key) throw new Error("Supabase env vars not configured");

  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options),
        );
      },
    },
  });
}

export function createClient() {
  return createServerSupabase(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "");
}

export function createAdminClient() {
  return createServerSupabase(process.env.SUPABASE_SERVICE_ROLE_KEY || "");
}
