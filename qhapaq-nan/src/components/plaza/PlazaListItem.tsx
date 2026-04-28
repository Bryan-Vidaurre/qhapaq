"use client";

import { MapPin, Mountain, ShieldAlert, Star } from "lucide-react";
import type { PlazaPublica } from "@/types/padron";
import { Star5 } from "@/components/ui/Star5";

interface PlazaListItemProps {
  plaza: PlazaPublica;
  isSelected: boolean;
  onClick: () => void;
}

export function PlazaListItem({ plaza, isSelected, onClick }: PlazaListItemProps) {
  const gdClass = `qn-gd-${plaza.gd.split("-")[1]}`;

  return (
    <button
      onClick={onClick}
      className={`block w-full border-b border-qn-border-soft p-4 text-left transition-colors hover:bg-qn-soft ${
        isSelected ? "bg-qn-soft" : ""
      }`}
    >
      <div className="mb-1 flex items-start justify-between gap-2">
        <div className="qn-display flex-1 leading-tight text-qn-ink" style={{ fontSize: 15 }}>
          {plaza.establecimiento}
        </div>
        <span className={`shrink-0 rounded px-1.5 text-[10px] font-medium ${gdClass}`}>
          {plaza.gd}
        </span>
      </div>

      <div className="mb-2 flex items-center gap-1 text-xs text-qn-text-muted">
        <MapPin size={11} />
        <span className="truncate">
          {plaza.distrito} · {plaza.provincia}, {plaza.departamento}
        </span>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <span className="rounded-full bg-qn-warm px-2 py-0.5 text-qn-brown">
          {plaza.profesion_nombre}
        </span>
        {plaza.n_plazas > 1 && (
          <span className="text-qn-text-subtle">×{plaza.n_plazas}</span>
        )}
        {plaza.zaf && (
          <span className="flex items-center gap-0.5 text-qn-terracotta">
            <Mountain size={10} /> ZAF
          </span>
        )}
        {plaza.ze && (
          <span className="flex items-center gap-0.5 text-qn-rust">
            <ShieldAlert size={10} /> VRAEM
          </span>
        )}
      </div>

      {plaza.avg_rating && plaza.total_reviews > 0 && (
        <div className="mt-2 flex items-center gap-1 text-xs">
          <Star5 value={plaza.avg_rating} size={11} />
          <span className="text-qn-text-muted">
            {plaza.avg_rating.toFixed(1)} · {plaza.total_reviews}{" "}
            {plaza.total_reviews === 1 ? "reseña" : "reseñas"}
          </span>
        </div>
      )}
    </button>
  );
}
