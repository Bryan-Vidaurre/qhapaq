"use client";

import { useState } from "react";
import { X } from "lucide-react";

const NOMBRES = [
  {
    quechua: "Qhapaq Ñan",
    literal: "El gran camino",
    uso: "Nombre de la plataforma. En la historia andina era la red de caminos del Tawantinsuyu que conectaba pueblos remotos con los centros del poder. Aquí conecta a los serumistas con la información y la comunidad que necesitan para su camino.",
  },
  {
    quechua: "Yachay",
    literal: "Conocimiento / saber",
    uso: "Feed social de la plataforma. Espacio para compartir reflexiones, casos clínicos y guías entre profesionales. Del quechua «yachay»: aprender, conocer.",
  },
  {
    quechua: "Kawsay",
    literal: "Vida / vivir bien",
    uso: "Foro comunitario. En la cosmovisión andina, el kawsay pleno se logra en comunidad. Aquí es el espacio de debate, consulta y ayuda mutua entre serumistas.",
  },
  {
    quechua: "Qhatus",
    literal: "Mercado / feria",
    uso: "Marketplace próximo. En los qhatus andinos se intercambiaban bienes entre comunidades. En la plataforma será el espacio de pedidos colectivos y servicios entre colegas.",
  },
];

export function QuechuaNamesButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-full border border-qn-border bg-qn-paper px-4 py-1.5 text-xs text-qn-text-muted hover:border-qn-terracotta hover:text-qn-ink transition-colors"
      >
        <span className="text-qn-terracotta">※</span>
        ¿Qué significan los nombres en quechua?
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-qn-ink/40 px-4 backdrop-blur-sm animate-qn-fade-in"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="relative w-full max-w-lg rounded-3xl border border-qn-border bg-qn-paper shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-qn-border-soft px-6 py-5">
              <div>
                <h2 className="qn-display text-xl text-qn-ink">Nombres en quechua</h2>
                <p className="mt-0.5 text-xs text-qn-text-subtle">La lengua del Tawantinsuyu vive en cada rincón de la plataforma</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-qn-text-subtle hover:bg-qn-soft hover:text-qn-ink transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Entries */}
            <div className="divide-y divide-qn-border-soft px-6 py-2 max-h-[60vh] overflow-y-auto">
              {NOMBRES.map((n) => (
                <div key={n.quechua} className="py-5">
                  <div className="flex items-baseline gap-3 mb-1.5">
                    <span className="qn-display-italic text-lg text-qn-terracotta">{n.quechua}</span>
                    <span className="text-xs text-qn-text-subtle">· {n.literal}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-qn-text-muted">{n.uso}</p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-qn-border-soft px-6 py-4">
              <p className="text-[11px] text-qn-text-subtle">
                El quechua (runasimi, «lengua de la gente») es hablado por más de 8 millones de personas en los Andes.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
