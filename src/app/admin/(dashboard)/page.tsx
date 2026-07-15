import Link from "next/link";
import { BusinessTable } from "@/components/admin/BusinessTable";
import { StatsCards } from "@/components/admin/StatsCards";
import { getDashboardStats, listBusinesses } from "@/lib/businesses";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [stats, businesses] = await Promise.all([
    getDashboardStats(),
    listBusinesses(),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Painel</h1>
          <p className="mt-1 text-sm text-slate-500">
            Acompanhe demos, negociações e clientes ativos.
          </p>
        </div>
        <Link
          href="/admin/empresas/nova"
          className="rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Nova empresa
        </Link>
      </div>

      <StatsCards stats={stats} />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Empresas</h2>
        <BusinessTable businesses={businesses} />
      </section>
    </div>
  );
}
