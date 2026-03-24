/**
 * Supabase Browser Client
 *
 * Nutzung: in Client Components für Login/Logout und Client-seitige Calls.
 * WICHTIG: Für sensible Daten immer über RLS absichern. Der ANON Key ist kein Secret.
 */

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl } from "./env";

export function createSupabaseBrowserClient() {
  return createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey());
}














