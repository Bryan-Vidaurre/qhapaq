"use client";

interface FilterChipProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export function FilterChip({ active, onClick, children }: FilterChipProps) {
  return (
    <button onClick={onClick} className={active ? "qn-chip-active" : "qn-chip"}>
      {children}
    </button>
  );
}
