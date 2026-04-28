import { createAdminClient } from "@/lib/supabase/server";

/**
 * Rate limiter usando la tabla `rate_limits` y la función SQL
 * `public.check_rate_limit`.
 *
 * Para producción multi-instancia con alto tráfico, migrar a Upstash Redis.
 */
export async function checkRateLimit(
  key: string,
  maxAttempts: number,
  windowSeconds: number,
): Promise<boolean> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("check_rate_limit", {
    p_key: key,
    p_max_attempts: maxAttempts,
    p_window_seconds: windowSeconds,
  });

  if (error) {
    // Fail-open en caso de error de DB para no romper UX, pero log para alertas
    console.error("Rate limit check failed:", error);
    return true;
  }

  return data === true;
}

/**
 * Configuraciones predefinidas.
 */
export const RATE_LIMITS = {
  magicLink: { max: 3, windowSeconds: 900 },        // 3 / 15 min
  apiGeneric: { max: 100, windowSeconds: 60 },      // 100 / min
  reviewCreate: { max: 5, windowSeconds: 3600 },    // 5 / hora
  reportSubmit: { max: 10, windowSeconds: 86400 },  // 10 / día
} as const;
