import Link from "next/link";

export default function DemoNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f5f7] px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          Empresa não encontrada
        </h1>
        <p className="mt-2 text-slate-600">
          Não existe uma página publicada com este slug.
        </p>
        <Link
          href="/admin"
          className="mt-6 inline-flex rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
        >
          Voltar ao painel
        </Link>
      </div>
    </main>
  );
}
