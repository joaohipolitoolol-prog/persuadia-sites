import { LoginForm } from "@/components/admin/LoginForm";
import { getAdminCredentials, isLocalMode } from "@/lib/config";

export default function AdminLoginPage() {
  const localMode = isLocalMode();
  const creds = getAdminCredentials();

  return (
    <main className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Entrar no painel</h1>
        <p className="mt-2 text-sm text-slate-500">
          {localMode
            ? "Sistema pronto para uso local — sem Supabase necessário."
            : "Use a conta criada no Supabase Auth."}
        </p>
        {localMode ? (
          <p className="mt-3 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            Login: <strong>{creds.email}</strong> · Senha: <strong>persuadia123</strong>
          </p>
        ) : null}
        <div className="mt-6">
          <LoginForm defaultEmail={localMode ? creds.email : ""} />
        </div>
      </div>
    </main>
  );
}
