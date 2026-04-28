import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

const BodySchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  redirectTo: z.string().startsWith("/").default("/"),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Correo inválido" }, { status: 400 });
  }

  const { email, redirectTo } = parsed.data;

  // Rate limit por email (3 intentos / 15 min)
  const ok = await checkRateLimit(
    `magic_link:${email}`,
    RATE_LIMITS.magicLink.max,
    RATE_LIMITS.magicLink.windowSeconds,
  );

  if (!ok) {
    return NextResponse.json(
      { error: "Demasiados intentos. Espera 15 minutos antes de pedir otro enlace." },
      { status: 429 },
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
  const callback = `${siteUrl}/auth/callback?next=${encodeURIComponent(redirectTo)}`;

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: callback,
      // Permite registro automático si el correo aún no existe
      shouldCreateUser: true,
    },
  });

  if (error) {
    console.error("magic link error:", error.message);
    // Mensaje genérico — no filtrar si el correo está registrado o no
    return NextResponse.json(
      { error: "No pudimos enviar el enlace. Reintenta en unos segundos." },
      { status: 500 },
    );
  }

  // Respuesta genérica — no confirma si el correo existe (anti-enumeración)
  return NextResponse.json({ ok: true });
}
