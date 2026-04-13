/**
 * Supabase Admin Client (service_role)
 *
 * Bypassed RLS – nur für serverseitige API-Routen verwenden.
 * NIEMALS im Browser oder in Client Components importieren.
 */

import { createClient } from "@supabase/supabase-js";
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

let adminClient: ReturnType<typeof createClient> | null = null;

export function createSupabaseAdmin() {
  if (!adminClient) {
    adminClient = createClient(getSupabaseUrl(), getServiceRoleKey(), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return adminClient;
}
