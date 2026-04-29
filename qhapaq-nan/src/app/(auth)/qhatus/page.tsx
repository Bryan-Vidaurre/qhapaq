import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { getProfile } from "@/lib/auth";
import { ShoppingBag, Package, Users, Truck, HandshakeIcon, Lock } from "lucide-react";

export const metadata = { title: "Qhatus · Qhapaq Ñan" };

const SECCIONES = [
  {
    icon: Package,
    title: "Pedidos colectivos",
    desc: "Agrupa compras con otros serumistas: botiquines, equipos, insumos a precio de mayoreo.",
    label: "Próximamente",
  },
  {
    icon: HandshakeIcon,
    title: "Servicios entre profesionales",
    desc: "Intercambia guardias, ofrece asesorías, conecta con colegas que necesitan apoyo.",
    label: "Solo verificados",
  },
  {
    icon: Truck,
    title: "Logística a zonas rurales",
    desc: "Coordinación de envíos hacia establecimientos en zonas alejadas y sin acceso a tiendas.",
    label: "Solo verificados",
  },
  {
    icon: Users,
    title: "Directorio de proveedores",
    desc: "Empresas que trabajan con el sector salud rural: farmacias, laboratorios, equipamiento.",
    label: "Próximamente",
  },
];

export default async function QhatusPage() {
  const perfil = await getProfile();
  if (!perfil) redirect("/auth/magic-link?from=/qhatus");

  return (
    <div className="min-h-screen bg-qn-bg">
      <Header />

      <main className="mx-auto max-w-2xl px-4 py-10">

        {/* Hero */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-qn-ink">
            <ShoppingBag size={28} color="var(--qn-gold)" />
          </div>
          <h1 className="qn-display text-3xl text-qn-ink">Qhatus</h1>
          <p className="mt-2 text-sm text-qn-text-muted">
            <em>Qhatus</em> significa <em>mercado</em> en quechua. Un espacio para el intercambio
            y la colaboración económica entre profesionales del SERUMS.
          </p>
        </div>

        {/* Secciones */}
        <div className="grid gap-3">
          {SECCIONES.map(({ icon: Icon, title, desc, label }) => (
            <div
              key={title}
              className="relative overflow-hidden rounded-2xl border border-qn-border bg-qn-paper p-5 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-qn-soft">
                  <Icon size={18} className="text-qn-brown" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-qn-ink">{title}</h2>
                    <span className="flex items-center gap-1 rounded-full border border-qn-border px-2 py-0.5 text-[10px] text-qn-text-subtle">
                      <Lock size={9} /> {label}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-qn-text-muted">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Estado */}
        <div className="mt-8 rounded-2xl border border-qn-gold/30 bg-qn-gold/5 p-5 text-center">
          <p className="text-sm font-medium text-qn-brown">Qhatus está en construcción</p>
          <p className="mt-1 text-xs text-qn-text-muted">
            La primera funcionalidad será pedidos colectivos. Si tienes un proveedor o una
            necesidad específica, cuéntanos en el perfil.
          </p>
        </div>

      </main>
    </div>
  );
}
