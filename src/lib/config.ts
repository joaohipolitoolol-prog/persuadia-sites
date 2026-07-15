export type DataSource = "local" | "supabase";

function hasSupabaseConfig(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return Boolean(url && key && !url.includes("SEU_PROJECT"));
}

export function getDataSource(): DataSource {
  const explicit = process.env.DATA_SOURCE ?? process.env.NEXT_PUBLIC_DATA_SOURCE;
  if (explicit === "local" || explicit === "supabase") return explicit;
  return hasSupabaseConfig() ? "supabase" : "local";
}

export function isLocalMode(): boolean {
  return getDataSource() === "local";
}

export function getAdminCredentials() {
  return {
    email: process.env.ADMIN_EMAIL ?? "admin@persuadia.local",
    password: process.env.ADMIN_PASSWORD ?? "persuadia123",
  };
}
