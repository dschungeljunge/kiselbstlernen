/**
 * Supabase Server Client (Next.js App Router)
 *
 * Dieses File ist bewusst klein und stark kommentiert, damit klar ist, was
 * passiert: Supabase-Auth verwaltet eine Session via Cookies. In Route Handlers
 * dürfen wir Cookies setzen; in Server Components ist das Cookie-Objekt
 * readonly, weshalb setAll dort typischerweise nicht ausgeführt wird.
 */

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl } from "./env";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export function createSupabaseServerClient(cookieStore: ReadonlyRequestCookies) {
  return createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        // In Route Handlers ist cookieStore mutierbar; in Server Components
        // kann das je nach Next-Version/Context fehlschlagen. Das ist ok,
        // weil dort in der Regel keine Session "ausgetauscht" wird.
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch (error) {
          // Server Components können Cookies nicht setzen
          console.warn("Cookies konnten nicht gesetzt werden (readonly context)");
        }
      },
    },
  });
}







