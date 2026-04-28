import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente Supabase para componentes "use client".
 *
 * Importante: usa la ANON key (pública). Las RLS policies se encargan de
 * proteger los datos — no exponer SUPABASE_SERVICE_ROLE_KEY al cliente.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
