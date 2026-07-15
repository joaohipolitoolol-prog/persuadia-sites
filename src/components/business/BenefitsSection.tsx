import { Clock3, Home, MapPinned, Wallet } from "lucide-react";

const BENEFITS = [
  {
    icon: Clock3,
    title: "Atendimento rápido",
    text: "Resposta ágil pelo WhatsApp para agendar sua visita.",
  },
  {
    icon: Wallet,
    title: "Orçamento sem compromisso",
    text: "Você entende o serviço e o valor antes de decidir.",
  },
  {
    icon: Home,
    title: "Residencial e empresarial",
    text: "Atendimento para casas, apartamentos, lojas e escritórios.",
  },
  {
    icon: MapPinned,
    title: "Atendimento na região",
    text: "Cobertura na cidade e municípios próximos.",
  },
];

type BenefitsSectionProps = {
  primaryColor: string;
};

export function BenefitsSection({ primaryColor }: BenefitsSectionProps) {
  return (
    <section className="border-b border-black/5 bg-white">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {BENEFITS.map((item) => (
          <div key={item.title} className="flex gap-3">
            <div
              className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-white"
              style={{ backgroundColor: primaryColor }}
            >
              <item.icon className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                {item.title}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                {item.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
