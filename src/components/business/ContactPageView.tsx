import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { BusinessFull } from "@/lib/types";
import {
  buildWhatsAppUrl,
  defaultWhatsAppMessage,
  formatPhoneDisplay,
} from "@/lib/utils";
import { BusinessFooter } from "./BusinessFooter";
import { BusinessHeader } from "./BusinessHeader";
import { ClaraAssistant } from "./ClaraAssistant";
import { ContactForm } from "./ContactForm";
import { DemoBanner } from "./DemoBanner";
import { WhatsAppButton } from "./WhatsAppButton";

type ContactPageViewProps = {
  business: BusinessFull;
};

function mapsEmbedUrl(business: BusinessFull) {
  const query = business.address?.trim()
    ? `${business.address}, ${business.city}, ${business.state}, Brasil`
    : `${business.city}, ${business.state}, Brasil`;
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&hl=pt-BR&z=14&ie=UTF8&iwloc=&output=embed`;
}

export function ContactPageView({ business }: ContactPageViewProps) {
  const whatsappUrl = buildWhatsAppUrl(
    business.whatsapp,
    defaultWhatsAppMessage(business.name)
  );

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {business.is_demo ? <DemoBanner /> : null}
      <BusinessHeader
        name={business.name}
        logoUrl={business.logo_url}
        whatsapp={business.whatsapp}
        whatsappUrl={whatsappUrl}
        primaryColor={business.primary_color}
        secondaryColor={business.secondary_color}
        homeHref="/"
      />

      <main>
        <section className="border-b border-black/5 bg-[#f7f8fa]">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
            <p
              className="text-sm font-semibold tracking-wide uppercase"
              style={{ color: business.primary_color }}
            >
              Fale conosco
            </p>
            <h1 className="mt-2 max-w-2xl text-3xl font-bold text-slate-900 sm:text-4xl">
              Solicite orçamento ou tire dúvidas com a {business.name}
            </h1>
            <p className="mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
              Atendimento em {business.city} e região. Resposta rápida pelo
              WhatsApp — sem formulário complicado.
            </p>
            <div className="mt-6">
              <WhatsAppButton
                href={whatsappUrl}
                label="Chamar no WhatsApp agora"
                variant="whatsapp"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-slate-900">
              Envie sua solicitação
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Preencha os dados e continue no WhatsApp com a mensagem pronta.
            </p>
            <div className="mt-6">
              <ContactForm
                businessName={business.name}
                whatsapp={business.whatsapp}
                primaryColor={business.primary_color}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">
                Dados de contato
              </h2>
              <ul className="mt-4 space-y-4">
                <li className="flex gap-3">
                  <Phone
                    className="mt-0.5 h-5 w-5 shrink-0"
                    style={{ color: business.primary_color }}
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900">WhatsApp</p>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-slate-600 hover:underline"
                    >
                      {formatPhoneDisplay(business.whatsapp)}
                    </a>
                  </div>
                </li>
                {business.email ? (
                  <li className="flex gap-3">
                    <Mail
                      className="mt-0.5 h-5 w-5 shrink-0"
                      style={{ color: business.primary_color }}
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-900">E-mail</p>
                      <a
                        href={`mailto:${business.email}`}
                        className="text-sm text-slate-600 hover:underline"
                      >
                        {business.email}
                      </a>
                    </div>
                  </li>
                ) : null}
                <li className="flex gap-3">
                  <MapPin
                    className="mt-0.5 h-5 w-5 shrink-0"
                    style={{ color: business.primary_color }}
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Endereço</p>
                    <p className="text-sm text-slate-600">
                      {business.address || `${business.city} — ${business.state}`}
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Clock
                    className="mt-0.5 h-5 w-5 shrink-0"
                    style={{ color: business.primary_color }}
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Horário</p>
                    <p className="text-sm text-slate-600">
                      {business.opening_hours || "Consulte pelo WhatsApp"}
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="relative aspect-[4/3] w-full bg-slate-100">
                <iframe
                  title={`Localização — ${business.name}`}
                  src={mapsEmbedUrl(business)}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>

            <Link
              href="/"
              className="inline-flex text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              ← Voltar para a página inicial
            </Link>
          </div>
        </section>
      </main>

      <BusinessFooter
        name={business.name}
        city={business.city}
        state={business.state}
        whatsapp={business.whatsapp}
        instagram={business.instagram}
        email={business.email}
      />
      <ClaraAssistant
        businessName={business.name}
        city={business.city}
        state={business.state}
        whatsapp={business.whatsapp}
        openingHours={business.opening_hours}
        address={business.address}
        serviceAreas={business.service_areas.map((a) => a.name)}
        services={business.services.map((s) => s.title)}
        primaryColor={business.primary_color}
      />
    </div>
  );
}
