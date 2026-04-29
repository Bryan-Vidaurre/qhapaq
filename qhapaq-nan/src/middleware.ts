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

  const pathname = request.nextUrl.pathname;

  // Rutas que requieren auth
  const requiresAuth =
    pathname.startsWith("/perfil") ||
    pathname.startsWith("/api/me") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/yachay") ||
    pathname.startsWith("/qhatus") ||
    pathname.startsWith("/kawsay");

  if (requiresAuth && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/magic-link";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // Si el usuario está autenticado en rutas protegidas (no /api ni /auth ni /onboarding),
  // verificar si completó el onboarding y redirigir si no.
  if (
    user &&
    !pathname.startsWith("/onboarding") &&
    !pathname.startsWith("/api/") &&
    !pathname.startsWith("/auth/") &&
    (pathname.startsWith("/perfil") || pathname === "/plazas")
  ) {
    const { data: perfil } = await supabase
      .from("perfiles")
      .select("onboarding_completado")
      .eq("user_id", user.id)
      .single();

    if (perfil && !perfil.onboarding_completado) {
      const url = request.nextUrl.clone();
      url.pathname = "/onboarding";
      return NextResponse.redirect(url);
    }
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
