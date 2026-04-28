import Link from "next/link";
import { ArrowRight, MapPin, Users, Sparkles } from "lucide-react";
import { ChakanaIcon } from "@/components/ui/ChakanaIcon";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-qn-bg">
      {/* Header */}
      <header className="qn-bg-cream-glass sticky top-0 z-30 border-b border-qn-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-qn-ink">
              <ChakanaIcon size={20} color="var(--qn-gold)" />
            </div>
            <div>
              <div className="qn-display-italic leading-none text-qn-ink" style={{ fontSize: 22 }}>
                qhapaq ñan
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-qn-extra text-qn-text-subtle">
                SERUMS · El gran camino
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-3">
            <Link
              href="/plazas"
              className="hidden text-sm text-qn-text-muted hover:text-qn-ink sm:inline"
            >
              Mapa de plazas
            </Link>
            <Link
              href="/auth/magic-link"
              className="rounded-full bg-qn-ink px-4 py-2 text-sm text-qn-bg"
            >
              Entrar
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <div className="mb-6 inline-block text-[10px] uppercase tracking-qn-extra text-qn-terracotta">
          Lanzamiento público · semestre 2026-I
        </div>
        <h1
          className="qn-display mb-6 leading-tight text-qn-ink"
          style={{ fontSize: 56, letterSpacing: "-0.02em" }}
        >
          Donde se cuentan las plazas{" "}
          <span className="qn-display-italic text-qn-terracotta">como son</span>.
        </h1>
        <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-qn-text-muted">
          Mapa colaborativo del SERUMS peruano. 16,018 plazas oficiales, reseñas verificadas
          por quienes ya hicieron el camino, comunidad de profesionales de salud a nivel nacional.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/plazas"
            className="flex h-12 items-center gap-2 rounded-full bg-qn-ink px-7 text-sm font-medium text-qn-bg"
          >
            Explorar el mapa <ArrowRight size={16} />
          </Link>
          <Link
            href="/auth/magic-link"
            className="flex h-12 items-center gap-2 rounded-full border border-qn-border bg-qn-paper px-7 text-sm font-medium text-qn-ink hover:border-qn-terracotta"
          >
            Crear cuenta gratis
          </Link>
        </div>
      </section>

      {/* Stats — datos reales del padrón 2026-I */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid grid-cols-2 gap-6 rounded-2xl border border-qn-border bg-qn-paper p-8 md:grid-cols-4">
          {[
            { num: "16,018", label: "Ofertas en padrón oficial" },
            { num: "5,810", label: "Establecimientos" },
            { num: "1,745", label: "Distritos" },
            { num: "17", label: "Profesiones" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="qn-display leading-none text-qn-ink" style={{ fontSize: 36 }}>
                {s.num}
              </div>
              <div className="mt-2 text-xs text-qn-text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tres usos */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              icon: MapPin,
              title: "Mapa con datos oficiales",
              desc: "Padrón completo MINSA con grado de dificultad, bonos ZAF/ZE, categoría del establecimiento y filtros por carrera.",
              color: "#B85820",
            },
            {
              icon: Users,
              title: "Comunidad verificada",
              desc: "Reseñas de quienes ya cumplieron servicio. Cruce con la resolución oficial para evitar suplantación.",
              color: "#2D5938",
            },
            {
              icon: Sparkles,
              title: "Yachay · saber compartido",
              desc: "Logros, reputación y memoria colectiva. Lo que aporta la cohorte queda como guía para la siguiente.",
              color: "#D9A02D",
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="rounded-2xl border border-qn-border bg-qn-paper p-6">
                <div
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ backgroundColor: card.color }}
                >
                  <Icon size={20} color="#FAF6F0" strokeWidth={1.6} />
                </div>
                <h3 className="qn-display mb-2 leading-tight text-qn-ink" style={{ fontSize: 18 }}>
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed text-qn-text-muted">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-qn-border-soft py-12">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="mb-4 text-xs text-qn-text-subtle">
            Qhapaq Ñan es un proyecto independiente, sin afiliación con MINSA, ESSALUD ni colegios
            profesionales. Los datos del padrón provienen del Anexo 2 y Anexo 3 oficiales del
            proceso SERUMS 2026-I.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-qn-text-muted">
            <Link href="/privacidad" className="hover:underline">
              Política de privacidad
            </Link>
            <span>·</span>
            <Link href="/terminos" className="hover:underline">
              Términos
            </Link>
            <span>·</span>
            <Link href="/contenido" className="hover:underline">
              Reglas de la comunidad
            </Link>
            <span>·</span>
            <a href="mailto:hola@qhapaqnan.pe" className="hover:underline">
              hola@qhapaqnan.pe
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
