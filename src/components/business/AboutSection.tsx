type AboutSectionProps = {
  name: string;
  city: string;
  description?: string | null;
  headline?: string;
  primaryColor: string;
};

export function AboutSection({
  name,
  city,
  description,
  headline,
  primaryColor,
}: AboutSectionProps) {
  const text =
    description?.trim() ||
    `A ${name} oferece serviços de instalação, limpeza e manutenção de ar-condicionado em ${city}. Trabalhamos com atendimento residencial e empresarial, buscando entregar agilidade, segurança e um serviço bem executado.`;

  return (
    <section id="sobre" className="border-b border-black/5 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        <div>
          <p
            className="text-sm font-semibold tracking-wide uppercase"
            style={{ color: primaryColor }}
          >
            Sobre
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            {headline || "Uma empresa local focada em serviços bem feitos"}
          </h2>
        </div>
        <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
          {text}
        </p>
      </div>
    </section>
  );
}
