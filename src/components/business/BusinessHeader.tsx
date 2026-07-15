"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";
import { Phone, X } from "lucide-react";
import { BusinessLogo } from "./BusinessLogo";
import { WhatsAppButton } from "./WhatsAppButton";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { formatPhoneDisplay } from "@/lib/utils";

type BusinessHeaderProps = {
  name: string;
  logoUrl: string | null;
  whatsapp: string;
  whatsappUrl: string;
  primaryColor: string;
  secondaryColor?: string;
  homeHref?: string;
};

export function BusinessHeader({
  name,
  logoUrl,
  whatsapp,
  whatsappUrl,
  primaryColor,
  secondaryColor,
  homeHref = "/",
}: BusinessHeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const homePath = homeHref.split("#")[0] || "/";

  function scrollToTopSmooth(e: MouseEvent<HTMLAnchorElement>) {
    const alreadyOnHome =
      pathname === homePath ||
      (homePath === "/" &&
        (pathname === "/" || pathname.startsWith("/demo/")));

    if (!alreadyOnHome) return;

    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const nav = [
    { href: `${homeHref}#servicos`, label: "Serviços" },
    { href: `${homeHref}#orcamento`, label: "Orçamento" },
    { href: `${homeHref}#galeria`, label: "Galeria" },
    { href: `${homeHref}#avaliacoes`, label: "Avaliações" },
    { href: `${homeHref}#regioes`, label: "Regiões" },
    { href: "/contato", label: "Fale conosco" },
  ];

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            {/* Menu hamburger — troca o “logo quadrado” no mobile */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex h-11 w-11 shrink-0 items-center justify-center md:hidden"
              aria-label="Abrir menu"
              aria-expanded={open}
            >
              <svg
                width="20"
                height="14"
                viewBox="0 0 20 14"
                fill="none"
                aria-hidden
                className="text-slate-800"
              >
                <path
                  d="M1 1h18M1 7h18M1 13h18"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <Link
              href={homeHref}
              onClick={scrollToTopSmooth}
              className="flex min-w-0 items-center gap-3"
            >
              <span className="hidden md:block">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoUrl}
                    alt={`Logo ${name}`}
                    className="h-11 w-11 rounded-xl object-cover shadow-sm"
                  />
                ) : (
                  <BusinessLogo
                    name={name}
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                  />
                )}
              </span>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-slate-900">
                  {name}
                </p>
                <p className="hidden items-center gap-1 text-xs text-slate-500 sm:flex sm:text-sm">
                  <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  {formatPhoneDisplay(whatsapp)}
                </p>
              </div>
            </Link>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            {nav.slice(0, 3).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <WhatsAppButton
            href={whatsappUrl}
            label="WhatsApp"
            variant="whatsapp"
            className="shrink-0 px-3 py-2.5 text-xs sm:px-4 sm:text-sm"
          />
        </div>
      </header>

      {/* Overlay + sidebar */}
      <div
        className={`fixed inset-0 z-50 transition ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <button
          type="button"
          className={`absolute inset-0 bg-slate-900/40 transition-opacity ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
          aria-label="Fechar menu"
        />

        <aside
          className={`absolute inset-y-0 left-0 flex w-[min(86vw,320px)] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
            <div className="flex items-center gap-3">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt=""
                  className="h-10 w-10 rounded-xl object-cover"
                />
              ) : (
                <BusinessLogo
                  name={name}
                  primaryColor={primaryColor}
                  secondaryColor={secondaryColor}
                  size="sm"
                />
              )}
              <div>
                <p className="font-semibold text-slate-900">{name}</p>
                <p className="text-xs text-slate-500">Menu</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <ul className="space-y-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-800 transition hover:bg-slate-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-slate-100 p-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Chamar no WhatsApp
            </a>
            <p className="mt-3 text-center text-xs text-slate-500">
              {formatPhoneDisplay(whatsapp)}
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
