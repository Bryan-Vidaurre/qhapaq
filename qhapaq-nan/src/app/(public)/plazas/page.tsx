import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { PlazasExplorer } from "@/components/plaza/PlazasExplorer";

export const metadata = {
  title: "Mapa de plazas SERUMS",
  description:
    "Explora las 16,018 plazas oficiales del SERUMS 2026-I del MINSA. Filtra por profesión, departamento, grado de dificultad y bonos.",
};

export default function PlazasPage() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <Suspense
        fallback={
          <div className="flex flex-1 items-center justify-center bg-qn-bg">
            <div className="text-sm text-qn-text-muted">Cargando mapa...</div>
          </div>
        }
      >
        <PlazasExplorer />
      </Suspense>
    </div>
  );
}
