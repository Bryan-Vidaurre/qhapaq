import Link from "next/link";
import Image from "next/image";
import { ChakanaIcon } from "@/components/ui/ChakanaIcon";
import { getProfile } from "@/lib/auth";

export async function Header() {
  const perfil = await getProfile();

  return (
    <header className="qn-bg-cream-glass sticky top-0 z-30 border-b border-qn-border">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
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
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/plazas" className="text-sm text-qn-text-muted hover:text-qn-ink">
            Mapa de plazas
          </Link>

          {perfil ? (
            <Link
              href="/perfil"
              className="flex items-center gap-2 rounded-full border border-qn-border bg-qn-paper px-4 py-2 text-sm text-qn-ink hover:border-qn-terracotta"
            >
              {perfil.avatar_url ? (
              <Image
                  src={perfil.avatar_url}
                  alt={perfil.nombre_publico}
                  width={24}
                  height={24}
                  className="h-6 w-6 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-qn-ink text-[10px] text-qn-bg">
                  {perfil.nombre_publico.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="hidden sm:inline">{perfil.nombre_publico}</span>
              {perfil.yachay > 0 && (
                <span className="rounded-full bg-qn-gold/20 px-2 text-xs text-qn-brown">
                  {perfil.yachay}
                </span>
              )}
            </Link>
          ) : (
            <Link
              href="/auth/magic-link"
              className="rounded-full bg-qn-ink px-4 py-2 text-sm text-qn-bg"
            >
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
