/**
 * Magic-Link Callback (PKCE)
 *
 * Supabase redirectet nach dem Klick auf den Magic Link auf diese Route.
 * Wir tauschen den `code` gegen eine Session aus und landen danach wieder
 * in der App. Die Session wird via Cookies gespeichert.
 */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/prototype";

  if (!code) {
    // Kein Code = kein Session Exchange möglich.
    return NextResponse.redirect(new URL(`/login?error=missing_code`, url));
  }

  // Cookie Store abrufen und an createSupabaseServerClient übergeben
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient(cookieStore);

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=auth_exchange_failed`, url),
    );
  }

  return NextResponse.redirect(new URL(next, url));
}








