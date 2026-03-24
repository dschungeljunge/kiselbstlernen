/**
 * Supabase Environment Helpers
 *
 * Ziel: Konfiguration zentralisieren und Fehler früh sichtbar machen.
 * Hinweis: NEXT_PUBLIC_* Variablen sind in Next.js bewusst "public" und können
 * im Browser landen. Sicherheit kommt hier nicht durch Secrets, sondern durch
 * konsequente RLS/Storage-Policies in Supabase.
 */

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Fehlende Environment Variable ${name}. Lege sie in web/.env.local ab oder setze sie im Deployment.`,
    );
  }
  return value;
}

export function getSupabaseUrl(): string {
  return requiredEnv("NEXT_PUBLIC_SUPABASE_URL");
}

export function getSupabaseAnonKey(): string {
  return requiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
}














