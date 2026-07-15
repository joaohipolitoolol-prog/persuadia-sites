"use client";

import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";

export function AdminNav() {
  async function signOut() {
    await logoutAction();
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="text-lg font-bold text-slate-900">
            Persuadia Sites
          </Link>
          <nav className="hidden gap-4 text-sm text-slate-600 sm:flex">
            <Link href="/admin" className="hover:text-slate-900">
              Painel
            </Link>
            <Link href="/admin/empresas/nova" className="hover:text-slate-900">
              Nova empresa
            </Link>
          </nav>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          Sair
        </button>
      </div>
    </header>
  );
}
