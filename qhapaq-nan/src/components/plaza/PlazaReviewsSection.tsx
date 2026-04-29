"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { ReviewsList } from "./ReviewsList";
import { ReviewForm } from "./ReviewForm";
import type { Perfil } from "@/types/user";

interface Props {
  renipress: string;
  perfil: Perfil | null;
}

export function PlazaReviewsSection({ renipress, perfil }: Props) {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="mt-6">
      <div className="mb-4 flex items-center gap-2">
        <Star size={16} className="text-qn-gold" fill="currentColor" />
        <h2 className="qn-display text-xl text-qn-ink">Reseñas de la comunidad</h2>
      </div>

      <ReviewsList renipress={renipress} refreshKey={refreshKey} />

      <ReviewForm
        renipress={renipress}
        perfil={perfil}
        onCreated={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  );
}
