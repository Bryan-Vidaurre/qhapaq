import { Suspense } from "react";
import Link from "next/link";
import { ChakanaIcon } from "@/components/ui/ChakanaIcon";
import { MagicLinkForm } from "@/components/auth/MagicLinkForm";

export const metadata = {
  title: "Entrar",
};

export default function MagicLinkPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-qn-bg px-6">
      <Link href="/" className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-qn-ink">
          <ChakanaIcon size={24} color="var(--qn-gold)" />
        </div>
        <div>
          <div className="qn-display-italic leading-none text-qn-ink" style={{ fontSize: 26 }}>
            qhapaq ñan
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-qn-extra text-qn-text-subtle">
            SERUMS · El gran camino
          </div>
        </div>
      </Link>

      <div className="w-full max-w-sm rounded-3xl border border-qn-border bg-qn-paper p-8 shadow-sm">
        <h1 className="qn-display mb-2 text-2xl text-qn-ink">Entrar</h1>
        <p className="mb-6 text-sm text-qn-text-muted">
          Te enviamos un enlace seguro a tu correo. Sin contraseñas que recordar.
        </p>

        <Suspense fallback={<div className="h-32 animate-pulse rounded-xl bg-qn-soft" />}>
          <MagicLinkForm />
        </Suspense>
      </div>
    </main>
  );
}
