import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { ALLOWED_EMAIL } from "@/lib/auth-config";

// Gate the CMS on the server so its shell never renders for strangers, and
// refresh the Supabase session cookie on the way through.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = user?.email === ALLOWED_EMAIL;
  const isLogin = request.nextUrl.pathname === "/qlmtt/login";

  if (!isAdmin && !isLogin) return NextResponse.redirect(new URL("/qlmtt/login", request.url));
  if (isAdmin && isLogin) return NextResponse.redirect(new URL("/qlmtt", request.url));
  return response;
}

export const config = { matcher: ["/qlmtt/:path*"] };
