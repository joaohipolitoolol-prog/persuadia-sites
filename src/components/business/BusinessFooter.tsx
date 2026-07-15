import Link from "next/link";
import { formatPhoneDisplay } from "@/lib/utils";

type BusinessFooterProps = {
  name: string;
  city: string;
  state: string;
  whatsapp: string;
  instagram: string | null;
  email: string | null;
};

export function BusinessFooter({
  name,
  city,
  state,
  whatsapp,
  instagram,
  email,
}: BusinessFooterProps) {
  return (
    <footer className="border-t border-black/5 bg-slate-900 text-slate-300">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div>
          <p className="text-base font-semibold text-white">{name}</p>
          <p className="mt-1 text-sm">
            {city} — {state}
          </p>
          <p className="mt-1 text-sm">{formatPhoneDisplay(whatsapp)}</p>
        </div>
        <div className="text-sm">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link href="/" className="hover:text-white hover:underline">
              Início
            </Link>
            <Link href="/#servicos" className="hover:text-white hover:underline">
              Serviços
            </Link>
            <Link href="/contato" className="hover:text-white hover:underline">
              Fale conosco
            </Link>
          </div>
          {instagram ? (
            <p className="mt-3">
              Instagram:{" "}
              <a
                href={`https://instagram.com/${instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline-offset-2 hover:underline"
              >
                @{instagram.replace("@", "")}
              </a>
            </p>
          ) : null}
          {email ? <p className="mt-1">{email}</p> : null}
          <p className="mt-4 text-xs text-slate-500">
            Página gerada para demonstração comercial.
          </p>
        </div>
      </div>
    </footer>
  );
}
