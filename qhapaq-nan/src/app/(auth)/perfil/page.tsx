import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";
import { LogoutButton } from "@/components/perfil/LogoutButton";
import { DeleteAccountForm } from "@/components/perfil/DeleteAccountForm";

export const metadata = {
  title: "Mi perfil",
};

export default async function PerfilPage() {
  const perfil = await getProfile();
  if (!perfil) redirect("/auth/magic-link?from=/perfil");

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-qn-bg">
      <Header />

      <main className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="qn-display mb-8 text-qn-ink" style={{ fontSize: 36 }}>
          Mi perfil
        </h1>

        <div className="space-y-4">
          {/* Identidad */}
          <Section title="Identidad">
            <Field label="Nombre público" value={perfil.nombre_publico} />
            <Field label="Correo" value={user?.email ?? "—"} />
            <Field
              label="Tipo de cuenta"
              value={perfil.kind === "general" ? "General" : "Profesional"}
            />
            {perfil.prof_level && (
              <Field
                label="Nivel"
                value={
                  perfil.prof_level === "autodeclarado"
                    ? "Autodeclarado (sin verificar)"
                    : perfil.prof_level === "estudiante"
                      ? "Estudiante verificado"
                      : perfil.prof_level === "egresado"
                        ? "Egresado verificado"
                        : perfil.prof_level === "colegiado"
                          ? "Colegiado verificado"
                          : perfil.prof_level === "serums_activo"
                            ? "SERUMS activo"
                            : "Profesional perenne"
                }
              />
            )}
            <Field label="Yachay" value={String(perfil.yachay)} />
          </Section>

          {/* Verificación CTA */}
          {perfil.kind === "general" && (
            <Section title="Verificarme como profesional">
              <p className="text-sm text-qn-text-muted">
                Si trabajas en salud, puedes verificarte para acceder a marketplace, foros y
                reseñas. La verificación es manual y toma 1–3 días hábiles.
              </p>
              <p className="mt-3 text-xs italic text-qn-text-subtle">
                Disponible en v0.2 — el sistema de verificación con documentos y revisión manual
                entra en el siguiente sprint.
              </p>
            </Section>
          )}

          {/* Privacidad y datos */}
          <Section title="Mis datos">
            <p className="text-sm text-qn-text-muted">
              Bajo la Ley 29733 tienes derecho a acceder, rectificar, cancelar y oponerte al
              tratamiento de tus datos personales (derechos ARCO).
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href="/api/me/export"
                className="rounded-full border border-qn-border bg-qn-paper px-4 py-2 text-xs text-qn-ink hover:border-qn-terracotta"
                download
              >
                Descargar mis datos (JSON)
              </a>
            </div>
          </Section>

          {/* Eliminar cuenta */}
          <Section title="Eliminar mi cuenta" tone="danger">
            <DeleteAccountForm />
          </Section>

          {/* Logout */}
          <Section title="Cerrar sesión">
            <LogoutButton />
          </Section>
        </div>
      </main>
    </div>
  );
}

function Section({
  title,
  children,
  tone,
}: {
  title: string;
  children: React.ReactNode;
  tone?: "danger";
}) {
  return (
    <section
      className={`rounded-2xl border bg-qn-paper p-6 ${
        tone === "danger" ? "border-qn-rust/30" : "border-qn-border"
      }`}
    >
      <h2 className="qn-display mb-4 text-qn-ink" style={{ fontSize: 18 }}>
        {title}
      </h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-qn-border-soft pb-2 last:border-0">
      <span className="text-xs uppercase tracking-qn-wide text-qn-text-subtle">{label}</span>
      <span className="text-right text-sm text-qn-ink">{value}</span>
    </div>
  );
}
