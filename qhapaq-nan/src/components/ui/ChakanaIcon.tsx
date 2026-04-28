interface ChakanaIconProps {
  size?: number;
  color?: string;
  className?: string;
}

/**
 * La chakana o cruz andina — símbolo presente en sitios arqueológicos
 * a lo largo de los Andes. Logo de Qhapaq Ñan.
 */
export function ChakanaIcon({ size = 18, color = "currentColor", className }: ChakanaIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 2 H15 V5 H18 V8 H21 V16 H18 V19 H15 V22 H9 V19 H6 V16 H3 V8 H6 V5 H9 Z"
        fill={color}
        stroke={color}
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      <rect x="11" y="11" width="2" height="2" fill="var(--qn-bg)" />
    </svg>
  );
}
