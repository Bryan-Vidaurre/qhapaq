import Link from "next/link";
import { ChakanaIcon } from "@/components/ui/ChakanaIcon";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-qn-bg px-6 text-center">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-qn-ink">
        <ChakanaIcon size={28} color="var(--qn-gold)" />
      </div>
      <h1 className="qn-display mb-3 text-qn-ink" style={{ fontSize: 48 }}>
        Mana tariykuchu
      </h1>
      <p className="mb-2 text-sm text-qn-text-muted">No se encontró el camino.</p>
      <p className="mb-8 max-w-sm text-xs text-qn-text-subtle">
        La página que buscas no existe o se movió. Quizás un enlace antiguo, un typo en la URL, o
        el contenido fue eliminado.
      </p>
      <Link
        href="/"
        className="rounded-full bg-qn-ink px-6 py-3 text-sm text-qn-bg hover:opacity-90"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
