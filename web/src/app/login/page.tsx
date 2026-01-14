/**
 * Minimaler Login-Screen (Pilot)
 *
 * Ziel: Magic-Link Versand auslösen. Der eigentliche Session-Handshake passiert
 * in `/auth/callback`.
 *
 * Hinweis: Dies ist bewusst "plain" gehalten. Agent 03/04 können daraus später
 * die finale UX/Microcopy machen.
 */

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/cn";
// Privacy hint placeholder (später definieren)
const PRIVACY_HINT_SHORT = "Deine Daten werden sicher verarbeitet und nicht an Dritte weitergegeben.";

export default function LoginPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string | null>(null);

  const errorCode = useMemo(() => {
    const raw = searchParams?.error;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [searchParams]);

  async function sendMagicLink() {
    setStatus("sending");
    setMessage(null);

    const supabase = createSupabaseBrowserClient();

    // redirectTo muss zu den "Redirect URLs" in Supabase Auth passen.
    const redirectTo = `${window.location.origin}/auth/callback`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    if (error) {
      setStatus("error");
      setMessage(
        "Login-Link konnte nicht gesendet werden. Bitte E-Mail prüfen oder später nochmals versuchen.",
      );
      return;
    }

    setStatus("sent");
    setMessage(
      "Login-Link gesendet. Öffne dein E-Mail und klicke auf den Magic Link.",
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-6">
      <main className="mx-auto w-full max-w-md pb-16 pt-14">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
          Login
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          Du erhältst einen Magic Link per E-Mail. Es werden keine Passwörter
          gespeichert.
        </p>
        <div className="mt-4 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm leading-6 text-zinc-700">
          <span className="font-medium text-zinc-900">Hinweis:</span>{" "}
          {PRIVACY_HINT_SHORT}
        </div>

        {errorCode ? (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Es gab ein Problem beim Login ({errorCode}). Bitte versuche es erneut.
          </div>
        ) : null}

        <div className="mt-6">
          <label className="text-sm font-medium text-zinc-900" htmlFor="email">
            E-Mail
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@schule.ch"
            className={cn(
              "mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3",
              "text-sm leading-6 text-zinc-950 placeholder:text-zinc-400",
              "focus:border-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-100",
            )}
          />
        </div>

        <div className="mt-5">
          <button
            type="button"
            disabled={!email || status === "sending"}
            onClick={sendMagicLink}
            className={cn(
              "inline-flex h-11 w-full items-center justify-center rounded-xl px-5",
              "bg-zinc-950 text-sm font-semibold text-white",
              "hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-200",
              (!email || status === "sending") && "opacity-60",
            )}
          >
            {status === "sending" ? "Sende…" : "Magic Link senden"}
          </button>
        </div>

        {message ? (
          <div className="mt-5 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900">
            {message}
          </div>
        ) : null}

        <div className="mt-6 text-sm">
          <Link href="/" className="font-medium text-zinc-700 hover:text-zinc-950">
            ← Zur Startseite
          </Link>
        </div>
      </main>
    </div>
  );
}


