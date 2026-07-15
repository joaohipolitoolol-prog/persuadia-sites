import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { WhatsAppButton } from "./WhatsAppButton";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { formatPhoneDisplay } from "@/lib/utils";

type ContactSectionProps = {
  name: string;
  address: string | null;
  openingHours: string | null;
  city: string;
  state: string;
  whatsapp: string;
  whatsappUrl: string;
  email: string | null;
  instagram: string | null;
  primaryColor: string;
};

export function ContactSection({
  name,
  address,
  openingHours,
  city,
  state,
  whatsapp,
  whatsappUrl,
  email,
  instagram,
  primaryColor,
}: ContactSectionProps) {
  const cards = [
    {
      icon: MapPin,
      title: "Endereço",
      text: address || `${city} — ${state}`,
    },
    {
      icon: Clock,
      title: "Horário",
      text: openingHours || "Consulte pelo WhatsApp",
    },
    {
      icon: Phone,
      title: "WhatsApp",
      text: formatPhoneDisplay(whatsapp),
      href: whatsappUrl,
    },
    ...(email
      ? [{ icon: Mail, title: "E-mail", text: email, href: `mailto:${email}` }]
      : []),
  ];

  return (
    <section id="contato" className="bg-[#f7f8fa]">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div
          className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="grid lg:grid-cols-[1.2fr_1fr]">
            <div className="px-6 py-10 sm:px-10 sm:py-12">
              <p className="text-sm font-semibold uppercase tracking-wide text-white/75">
                Contato
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Fale com a equipe da {name}
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-white/90">
                Precisa instalar, limpar ou fazer a manutenção do seu
                ar-condicionado? Chame no WhatsApp ou envie pela página de
                contato.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <WhatsAppButton
                  href={whatsappUrl}
                  label="Chamar no WhatsApp"
                  variant="light"
                />
                <Link
                  href="/contato"
                  className="inline-flex items-center justify-center rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Fale conosco
                </Link>
                {instagram ? (
                  <a
                    href={`https://instagram.com/${instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Instagram
                  </a>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col justify-center gap-3 bg-white/10 p-6 sm:p-8">
              <div className="flex items-center gap-3 rounded-xl bg-white/15 px-4 py-4 backdrop-blur-sm">
                <WhatsAppIcon className="h-8 w-8 shrink-0 text-[#25D366]" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/70">
                    Resposta rápida
                  </p>
                  <p className="text-sm font-semibold text-white">
                    Orçamento pelo WhatsApp
                  </p>
                </div>
              </div>
              <p className="text-sm text-white/80">
                Atendemos {city} e região. Orçamento sem compromisso.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;
            const content = (
              <div className="flex h-full items-start gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: `${primaryColor}12`,
                    color: primaryColor,
                  }}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {card.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">{card.text}</p>
                </div>
              </div>
            );

            if ("href" in card && card.href) {
              return (
                <a
                  key={card.title}
                  href={card.href}
                  target={card.title === "WhatsApp" ? "_blank" : undefined}
                  rel={
                    card.title === "WhatsApp"
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="transition hover:-translate-y-0.5"
                >
                  {content}
                </a>
              );
            }

            return <div key={card.title}>{content}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
