import {
  Building2,
  Droplets,
  Settings2,
  ShieldCheck,
  Snowflake,
  Wrench,
} from "lucide-react";
import type { Service } from "@/lib/types";

const ICONS = [Snowflake, Droplets, ShieldCheck, Wrench, Settings2, Building2];

type ServicesSectionProps = {
  services: Service[];
  primaryColor: string;
};

export function ServicesSection({
  services,
  primaryColor,
}: ServicesSectionProps) {
  if (!services.length) return null;

  return (
    <section id="servicos" className="border-b border-black/5 bg-[#f7f8fa]">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Serviços
          </h2>
          <p className="mt-2 text-slate-600">
            Soluções práticas para instalar, limpar e manter seu ar-condicionado.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <div
                key={service.id}
                className="rounded-lg border border-black/5 bg-white p-5"
              >
                <div
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-md text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {service.title}
                </h3>
                {service.description ? (
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {service.description}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
