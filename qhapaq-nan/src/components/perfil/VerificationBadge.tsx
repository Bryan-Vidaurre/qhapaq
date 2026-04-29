import type { ProfLevel } from "@/types/user";

const LEVEL_CONFIG: Record<
  ProfLevel,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  autodeclarado:  { label: "Autodeclarado",  color: "#6b7280", bg: "#f3f4f6", border: "#d1d5db", dot: "#9ca3af" },
  estudiante:     { label: "Estudiante",      color: "#1d4ed8", bg: "#eff6ff", border: "#bfdbfe", dot: "#3b82f6" },
  egresado:       { label: "Egresado",        color: "#0f766e", bg: "#f0fdfa", border: "#99f6e4", dot: "#14b8a6" },
  colegiado:      { label: "Colegiado",       color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0", dot: "#22c55e" },
  serums_activo:  { label: "SERUMS Activo",   color: "#92400e", bg: "#fffbeb", border: "#fde68a", dot: "#f59e0b" },
  perenne:        { label: "Perenne",         color: "#7c2d12", bg: "#fff7ed", border: "#fed7aa", dot: "#f97316" },
};

interface VerificationBadgeProps {
  level: ProfLevel;
  size?: "sm" | "md" | "lg";
  showDot?: boolean;
}

export function VerificationBadge({ level, size = "md", showDot = true }: VerificationBadgeProps) {
  const cfg = LEVEL_CONFIG[level];
  const padding = size === "sm" ? "px-1.5 py-0.5 text-[10px]" : size === "lg" ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-xs";

  return (
    <span
      style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${padding}`}
    >
      {showDot && (
        <span
          className="inline-block h-1.5 w-1.5 rounded-full flex-shrink-0"
          style={{ background: cfg.dot }}
        />
      )}
      {cfg.label}
    </span>
  );
}

export { LEVEL_CONFIG };
