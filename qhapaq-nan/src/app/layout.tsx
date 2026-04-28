import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Qhapaq Ñan · El gran camino del SERUMS",
    template: "%s · Qhapaq Ñan",
  },
  description:
    "Mapa colaborativo del SERUMS peruano. Reseñas verificadas de plazas, comunidad de profesionales de salud, marketplace y pedidos colectivos.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://qhapaqnan.pe"),
  openGraph: {
    title: "Qhapaq Ñan · El gran camino del SERUMS",
    description: "Mapa colaborativo del SERUMS peruano.",
    type: "website",
    locale: "es_PE",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#F5EFE3",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
