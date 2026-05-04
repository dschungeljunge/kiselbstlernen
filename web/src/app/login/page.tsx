/**
 * Minimaler Login-Screen (Pilot)
 *
 * Ziel: Magic-Link Versand auslösen. Der eigentliche Session-Handshake passiert
 * in `/auth/callback`.
 */

import { LoginPageClient } from "./LoginPageClient";

export default async function LoginPage(props: PageProps<"/login">) {
  const searchParams = await props.searchParams;
  const raw = searchParams?.error;
  const errorCode = Array.isArray(raw) ? raw[0] : raw;

  return <LoginPageClient errorCode={errorCode} />;
}
