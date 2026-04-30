import Link from "next/link";
import { ArrowRight, MapPin, Users, MessageSquare, BookOpen, ShoppingBag, Star } from "lucide-react";
import { Header } from "@/components/layout/Header";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-qn-bg">
      <Header />

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
            href="/auth/signup"
            className="flex h-12 items-center gap-2 rounded-full bg-qn-ink px-7 text-sm font-medium text-qn-bg"
          >
            Crear cuenta gratis <ArrowRight size={16} />
          </Link>
          <Link
            href="/plazas"
            className="flex h-12 items-center gap-2 rounded-full border border-qn-border bg-qn-paper px-7 text-sm font-medium text-qn-ink hover:border-qn-terracotta"
          >
            Explorar el mapa
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-5xl px-6 py-4">
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

      {/* Funcionalidades principales */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <p className="mb-6 text-center text-[10px] font-semibold uppercase tracking-widest text-qn-text-subtle">
          Todo lo que necesitas para tu SERUMS
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: MapPin,
              title: "Mapa de plazas",
              desc: "Padrón completo MINSA con grado de dificultad, bonos ZAF/ZE y filtros por carrera.",
              color: "#B85820",
              href: "/plazas",
              cta: "Explorar mapa",
            },
            {
              icon: Star,
              title: "Reseñas verificadas",
              desc: "Opiniones reales de serumistas sobre vivienda, equipamiento, jefatura y conectividad.",
              color: "#2D5938",
              href: "/plazas",
              cta: "Ver reseñas",
            },
            {
              icon: BookOpen,
              title: "Yachay · Feed",
              desc: "Publica reflexiones, casos clínicos y guías. Aprende de colegas en todo el Perú.",
              color: "#1d4ed8",
              href: "/yachay",
              cta: "Ir al feed",
            },
            {
              icon: MessageSquare,
              title: "Kawsay · Foro",
              desc: "Debate, consulta y resuelve dudas con la comunidad serumista. Categorías por especialidad.",
              color: "#7e22ce",
              href: "/kawsay",
              cta: "Ir al foro",
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="flex flex-col rounded-2xl border border-qn-border bg-qn-paper p-6">
                <div
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ backgroundColor: card.color }}
                >
                  <Icon size={20} color="#FAF6F0" strokeWidth={1.6} />
                </div>
                <h3 className="qn-display mb-2 leading-tight text-qn-ink" style={{ fontSize: 16 }}>
                  {card.title}
                </h3>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-qn-text-muted">{card.desc}</p>
                <Link
                  href={card.href}
                  className="flex items-center gap-1 text-xs font-medium text-qn-terracotta hover:underline"
                >
                  {card.cta} <ArrowRight size={12} />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comunidad + Qhatus teaser */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-qn-border bg-qn-paper p-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-qn-ink">
              <Users size={18} color="var(--qn-gold)" strokeWidth={1.6} />
            </div>
            <h3 className="qn-display mb-2 text-lg text-qn-ink">Comunidad verificada</h3>
            <p className="text-sm leading-relaxed text-qn-text-muted">
              Sistema de niveles: autodeclarado → estudiante → egresado → colegiado → serumista activo.
              Solo quienes verifican su identidad pueden dejar reseñas de plazas.
            </p>
          </div>
          <div className="rounded-2xl border border-qn-gold/30 bg-qn-gold/5 p-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-qn-brown">
              <ShoppingBag size={18} color="#FAF6F0" strokeWidth={1.6} />
            </div>
            <h3 className="qn-display mb-2 text-lg text-qn-ink">Qhatus · Próximamente</h3>
            <p className="text-sm leading-relaxed text-qn-text-muted">
              Marketplace para la comunidad serumista: pedidos colectivos, servicios entre colegas
              y logística a zonas rurales.
            </p>
            <span className="mt-3 inline-block rounded-full border border-qn-gold/40 px-3 py-1 text-[10px] font-medium text-qn-brown">
              En construcción · v0.2
            </span>
          </div>
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
            <Link href="/privacidad" className="hover:underline">Política de privacidad</Link>
            <span>·</span>
            <Link href="/terminos" className="hover:underline">Términos</Link>
            <span>·</span>
            <Link href="/contenido" className="hover:underline">Reglas de la comunidad</Link>
            <span>·</span>
            <a href="mailto:hola@qhapaqnan.pe" className="hover:underline">hola@qhapaqnan.pe</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
