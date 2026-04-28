import { Star } from "lucide-react";

interface Star5Props {
  value: number;
  size?: number;
}

export function Star5({ value, size = 14 }: Star5Props) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          fill={i <= Math.round(value) ? "var(--qn-terracotta)" : "transparent"}
          color={i <= Math.round(value) ? "var(--qn-terracotta)" : "var(--qn-border)"}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}
