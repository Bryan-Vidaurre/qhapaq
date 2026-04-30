import Link from "next/link";
import Image from "next/image";
import { ChakanaIcon } from "@/components/ui/ChakanaIcon";
import { getProfile } from "@/lib/auth";

export async function Header() {
  const perfil = await getProfile();

  return (
    <header className="qn-bg-cream-glass sticky top-0 z-30 border-b border-qn-border">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-qn-ink">
            <ChakanaIcon size={20} color="var(--qn-gold)" />
          </div>
          <div>
            <div className="qn-display-italic leading-none text-qn-ink" style={{ fontSize: 22 }}>
              qhapaq ñan
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-qn-extra text-qn-text-subtle">
              Red de caminos
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          {/* Siempre visible */}
          <Link href="/"
            className="hidden rounded-full px-3 py-2 text-sm text-qn-text-muted hover:bg-qn-soft hover:text-qn-ink md:inline">
            Inicio
          </Link>
          <Link href="/plazas"
            className="rounded-full px-3 py-2 text-sm text-qn-text-muted hover:bg-qn-soft hover:text-qn-ink">
            Mapa
          </Link>

          {perfil ? (
            <>
              {/* Nav autenticada */}
              <Link href="/yachay"
                className="rounded-full px-3 py-2 text-sm text-qn-text-muted hover:bg-qn-soft hover:text-qn-ink">
                Yachay
              </Link>
              <Link href="/qhatus"
                className="rounded-full px-3 py-2 text-sm text-qn-text-muted hover:bg-qn-soft hover:text-qn-ink">
                Qhatus
              </Link>
              <Link href="/kawsay"
                className="rounded-full px-3 py-2 text-sm text-qn-text-muted hover:bg-qn-soft hover:text-qn-ink">
                Kawsay
              </Link>

              {/* Avatar / perfil */}
              <Link
                href="/perfil"
                className="ml-3 flex items-center gap-2 rounded-full border border-qn-border bg-qn-paper px-3 py-1.5 text-sm text-qn-ink hover:border-qn-terracotta"
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
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-qn-ink text-[10px] font-semibold text-qn-bg">
                    {perfil.nombre_publico.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:inline">{perfil.nombre_publico.split(" ")[0]}</span>
                {perfil.yachay > 0 && (
                  <span className="rounded-full bg-qn-gold/20 px-1.5 text-xs text-qn-brown">
                    {perfil.yachay}
                  </span>
                )}
              </Link>
            </>
          ) : (
            <Link
              href="/auth/magic-link"
              className="ml-3 rounded-full bg-qn-ink px-5 py-2 text-sm font-medium text-qn-bg"
            >
              Entrar · Crear cuenta
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
