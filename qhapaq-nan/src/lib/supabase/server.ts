import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cliente Supabase para Server Components y Route Handlers.
 *
 * Maneja cookies de sesión correctamente con el helper de Next.js.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Server Components solo pueden leer; ignorar fallos al setear.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            /* idem */
          }
        },
      },
    },
  );
}

/**
 * Cliente con service_role — usar SOLO en endpoints server-side controlados.
 * Salta RLS, así que cualquier query con este cliente debe validar permisos
 * a nivel aplicación.
 */
export function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY no configurada");
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        get: () => undefined,
        set: () => {},
        remove: () => {},
      },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}
