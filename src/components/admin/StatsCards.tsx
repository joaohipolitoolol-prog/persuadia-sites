import type { DashboardStats } from "@/lib/types";

type StatsCardsProps = {
  stats: DashboardStats;
};

const CARDS: Array<{ key: keyof DashboardStats; label: string }> = [
  { key: "total", label: "Empresas cadastradas" },
  { key: "demos", label: "Prévias / demonstrações" },
  { key: "negotiating", label: "Em negociação" },
  { key: "awaitingPayment", label: "Aguardando pagamento" },
  { key: "active", label: "Clientes ativos" },
  { key: "cancelled", label: "Cancelados" },
];

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {CARDS.map((card) => (
        <div
          key={card.key}
          className="rounded-lg border border-slate-200 bg-white px-4 py-5"
        >
          <p className="text-sm text-slate-500">{card.label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {stats[card.key]}
          </p>
        </div>
      ))}
    </div>
  );
}
