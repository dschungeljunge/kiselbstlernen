/**
 * Supabase Admin Client (service_role)
 *
 * Bypassed RLS – nur für serverseitige API-Routen verwenden.
 * NIEMALS im Browser oder in Client Components importieren.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "./env";

function getServiceRoleKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY fehlt. Setze sie in web/.env.local oder als Deployment-Variable.",
    );
  }
  return key;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let adminClient: SupabaseClient<any, "public", any> | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createSupabaseAdmin(): SupabaseClient<any, "public", any> {
  if (!adminClient) {
    adminClient = createClient(getSupabaseUrl(), getServiceRoleKey(), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return adminClient;
}
