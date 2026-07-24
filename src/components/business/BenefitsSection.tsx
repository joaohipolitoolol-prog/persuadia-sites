import { Clock3, Home, MapPinned, Truck, Wallet, Wrench } from "lucide-react";
import type { BenefitItem } from "@/lib/business-copy";

const ICONS = {
  clock: Clock3,
  wallet: Wallet,
  home: Home,
  map: MapPinned,
  truck: Truck,
  wrench: Wrench,
} as const;

type BenefitsSectionProps = {
  primaryColor: string;
  items: BenefitItem[];
};

export function BenefitsSection({ primaryColor, items }: BenefitsSectionProps) {
  return (
    <section className="border-b border-black/5 bg-white">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {items.map((item) => {
          const Icon = ICONS[item.icon];
          return (
            <div key={item.title} className="flex gap-3">
              <div
                className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-white"
                style={{ backgroundColor: primaryColor }}
              >
                <Icon className="h-5 w-5" aria-hidden />
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
          );
        })}
      </div>
    </section>
  );
}
