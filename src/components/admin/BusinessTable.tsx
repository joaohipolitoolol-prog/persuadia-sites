"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Copy, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { deleteBusiness, duplicateBusiness } from "@/lib/business-actions";
import { BUSINESS_STATUS_LABELS, type Business } from "@/lib/types";

type BusinessTableProps = {
  businesses: Business[];
};

export function BusinessTable({ businesses }: BusinessTableProps) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Excluir a empresa "${name}"? Essa ação não pode ser desfeita.`)) {
      return;
    }
    setBusyId(id);
    setError(null);
    try {
      await deleteBusiness(id);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDuplicate(id: string) {
    setBusyId(id);
    setError(null);
    try {
      const newId = await duplicateBusiness(id);
      router.push(`/admin/empresas/${newId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao duplicar");
      setBusyId(null);
    }
  }

  if (!businesses.length) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
        <p className="text-slate-600">Nenhuma empresa cadastrada ainda.</p>
        <Link
          href="/admin/empresas/nova"
          className="mt-4 inline-flex rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
        >
          Cadastrar primeira empresa
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Empresa</th>
              <th className="px-4 py-3 font-medium">Cidade</th>
              <th className="px-4 py-3 font-medium">WhatsApp</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Criada em</th>
              <th className="px-4 py-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {businesses.map((business) => (
              <tr key={business.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {business.name}
                </td>
                <td className="px-4 py-3 text-slate-600">{business.city}</td>
                <td className="px-4 py-3 text-slate-600">{business.whatsapp}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                    {BUSINESS_STATUS_LABELS[business.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {new Date(business.created_at).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/demo/${business.slug}`}
                      target="_blank"
                      className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      title="Visualizar"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/admin/empresas/${business.id}`}
                      className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      disabled={busyId === business.id}
                      onClick={() => handleDuplicate(business.id)}
                      className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
                      title="Duplicar"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      disabled={busyId === business.id}
                      onClick={() => handleDelete(business.id, business.name)}
                      className="rounded p-1.5 text-red-500 hover:bg-red-50 disabled:opacity-50"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
