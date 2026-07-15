type BusinessLogoProps = {
  name: string;
  primaryColor: string;
  secondaryColor?: string;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "h-9 w-9 rounded-lg",
  md: "h-11 w-11 rounded-xl",
  lg: "h-14 w-14 rounded-xl",
};

const iconSizes = {
  sm: "h-[18px] w-[18px]",
  md: "h-6 w-6",
  lg: "h-7 w-7",
};

/** Marca: unidade split + fluxo de ar — legível em 36px. */
export function BusinessLogo({
  name,
  primaryColor,
  secondaryColor,
  size = "md",
}: BusinessLogoProps) {
  const accent = secondaryColor ?? primaryColor;

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden ${sizes[size]}`}
      style={{
        background: `linear-gradient(145deg, ${primaryColor} 0%, ${accent} 100%)`,
      }}
      aria-label={`Logo ${name}`}
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        className={iconSizes[size]}
        aria-hidden
      >
        {/* Caixa do split */}
        <rect
          x="5"
          y="8"
          width="22"
          height="12"
          rx="3"
          fill="white"
          fillOpacity="0.95"
        />
        {/* Frente / display */}
        <rect
          x="7.5"
          y="10.5"
          width="17"
          height="7"
          rx="1.5"
          fill={primaryColor}
          fillOpacity="0.2"
        />
        {/* Grade de ar */}
        <path
          d="M9 13.5h14M9 15.5h10"
          stroke={primaryColor}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.85"
        />
        {/* LED */}
        <circle cx="23" cy="12" r="1" fill={accent} />
        {/* Fluxo de ar */}
        <path
          d="M10 23.5c1.5-1.2 3.5-1.2 5 0M15.5 25.5c1.5-1.2 3.5-1.2 5 0M21 23.5c1.2-1 2.8-1 4 0"
          stroke="white"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.9"
        />
      </svg>
    </div>
  );
}
