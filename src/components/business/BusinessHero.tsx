import { SafeImage } from "./SafeImage";
import { WhatsAppButton } from "./WhatsAppButton";
import { getDefaultHeroImage, normalizeImageUrl } from "@/lib/stock-images";

type BusinessHeroProps = {
  name: string;
  city: string;
  description?: string | null;
  heroImageUrl: string | null;
  whatsappUrl: string;
  primaryColor: string;
};

export function BusinessHero({
  name,
  city,
  description,
  heroImageUrl,
  whatsappUrl,
  primaryColor,
}: BusinessHeroProps) {
  const support =
    description?.trim() ||
    "Atendimento para residências, empresas e comércios. Solicite seu orçamento diretamente pelo WhatsApp.";

  const imageSrc = normalizeImageUrl(heroImageUrl, getDefaultHeroImage());

  return (
    <section className="border-b border-black/5 bg-[#f7f8fa]">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:py-16">
        <div className="animate-fade-up order-2 lg:order-1">
          <p
            className="mb-3 text-sm font-semibold tracking-wide uppercase"
            style={{ color: primaryColor }}
          >
            {name}
          </p>
          <h1 className="max-w-xl text-3xl leading-tight font-bold text-slate-900 sm:text-4xl lg:text-[2.75rem]">
            Instalação e manutenção de ar-condicionado em {city}
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-600 sm:text-lg">
            {support}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <WhatsAppButton
              href={whatsappUrl}
              label="Pedir orçamento"
              variant="whatsapp"
            />
            <a
              href="#servicos"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Ver serviços
            </a>
          </div>
        </div>

        <div className="relative animate-fade-up-delayed order-1 aspect-[16/10] overflow-hidden rounded-2xl bg-slate-200 shadow-md ring-1 ring-black/5 lg:order-2 lg:aspect-[5/4]">
          <SafeImage
            src={imageSrc}
            alt={`Serviço de ar-condicionado — ${name}`}
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            primaryColor={primaryColor}
            fallbackLabel="Instalação de ar-condicionado"
          />
        </div>
      </div>
    </section>
  );
}
