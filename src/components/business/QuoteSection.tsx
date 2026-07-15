import { MessageSquare, Clock3, CheckCircle2 } from "lucide-react";
import { WhatsAppButton } from "./WhatsAppButton";

const STEPS = [
  {
    icon: MessageSquare,
    title: "Chame no WhatsApp",
    text: "Informe o serviço que precisa e a localização.",
  },
  {
    icon: Clock3,
    title: "Receba o retorno",
    text: "A equipe responde com orientação e disponibilidade.",
  },
  {
    icon: CheckCircle2,
    title: "Orçamento sem compromisso",
    text: "Você avalia o valor antes de fechar qualquer serviço.",
  },
];

type QuoteSectionProps = {
  name: string;
  city: string;
  whatsappUrl: string;
  primaryColor: string;
};

export function QuoteSection({
  name,
  city,
  whatsappUrl,
  primaryColor,
}: QuoteSectionProps) {
  return (
    <section id="orcamento" className="border-b border-black/5 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p
            className="text-sm font-semibold tracking-wide uppercase"
            style={{ color: primaryColor }}
          >
            Orçamento
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            Solicite seu orçamento em {city}
          </h2>
          <p className="mt-3 text-slate-600">
            Atendimento rápido pelo WhatsApp da {name}. Sem formulário
            complicado — você fala direto com a equipe.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className="relative rounded-xl border border-slate-200 bg-[#f7f8fa] p-5 text-center"
            >
              <span
                className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: primaryColor }}
              >
                {index + 1}
              </span>
              <div
                className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${primaryColor}18`, color: primaryColor }}
              >
                <step.icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {step.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <WhatsAppButton
            href={whatsappUrl}
            label="Solicitar orçamento agora"
            variant="whatsapp"
            className="px-6 py-3.5 text-base"
          />
        </div>
      </div>
    </section>
  );
}
