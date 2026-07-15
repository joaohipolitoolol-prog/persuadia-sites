"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Wind } from "lucide-react";

type SafeImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
  fallbackLabel?: string;
  primaryColor?: string;
};

export function SafeImage({
  src,
  alt,
  fill = true,
  priority = false,
  className = "object-cover",
  sizes,
  fallbackLabel = "Foto do serviço",
  primaryColor = "#0B3A66",
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (failed || !src) {
    return (
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-100 text-slate-500"
        style={{ backgroundColor: `${primaryColor}12` }}
      >
        <Wind className="h-10 w-10" style={{ color: primaryColor }} aria-hidden />
        <span className="px-4 text-center text-xs font-medium">
          {fallbackLabel}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      priority={priority}
      className={className}
      sizes={sizes}
      onError={() => setFailed(true)}
    />
  );
}
