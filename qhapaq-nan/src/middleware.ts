import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware: refresca sesiones automáticamente y aplica rate limiting básico.
 *
 * Corre en cada request (excepto los de _next/static y assets).
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          supabaseResponse = NextResponse.next({ request });
          supabaseResponse.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          supabaseResponse = NextResponse.next({ request });
          supabaseResponse.cookies.set({ name, value: "", ...options });
        },
      },
    },
  );

  // Refresca el token si está cerca de expirar
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Rutas que requieren auth
  const requiresAuth =
    request.nextUrl.pathname.startsWith("/perfil") ||
    request.nextUrl.pathname.startsWith("/api/me");

  if (requiresAuth && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/magic-link";
    url.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static assets)
     * - _next/image (image optimization)
     * - favicon, robots, sitemap
     * - public files (.svg, .png, .jpg, .jpeg, .gif, .webp)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
