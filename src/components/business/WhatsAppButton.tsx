import Link from "next/link";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "./WhatsAppIcon";

type WhatsAppButtonProps = {
  href: string;
  label?: string;
  variant?: "primary" | "secondary" | "light" | "whatsapp";
  className?: string;
  color?: string;
};

export function WhatsAppButton({
  href,
  label = "Chamar no WhatsApp",
  variant = "primary",
  className,
  color,
}: WhatsAppButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2.5 rounded-lg px-5 py-3 text-sm font-semibold transition hover:brightness-105 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

  if (variant === "whatsapp") {
    return (
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(base, "bg-[#25D366] text-white shadow-sm", className)}
      >
        <WhatsAppIcon className="h-5 w-5 shrink-0" />
        {label}
      </Link>
    );
  }

  if (variant === "primary") {
    return (
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(base, "text-white shadow-sm", className)}
        style={{ backgroundColor: color ?? "#0B3A66" }}
      >
        <WhatsAppIcon className="h-5 w-5 shrink-0" />
        {label}
      </Link>
    );
  }

  if (variant === "light") {
    return (
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          base,
          "bg-white text-[#128C7E] shadow-md ring-1 ring-white/40",
          className
        )}
      >
        <WhatsAppIcon className="h-5 w-5 shrink-0 text-[#25D366]" />
        {label}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        base,
        "border border-current bg-transparent text-inherit",
        className
      )}
      style={color ? { color, borderColor: color } : undefined}
    >
      <WhatsAppIcon className="h-5 w-5 shrink-0" />
      {label}
    </Link>
  );
}
