/**
 * Step 4 – Session-Code erstellen und speichern
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { generateSessionCode, formatSessionCode, saveSessionToLocal } from "@/lib/session-manager";
import { useSession } from "@/contexts/SessionContext";

export default function Step4Page() {
  const router = useRouter();
  const { setProfile } = useSession();
  const [sessionCode, setSessionCode] = useState("");
  const [profile, setLocalProfile] = useState<{ name: string; description: string; strengths: string[] } | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Profil aus localStorage laden (von Step 3)
    const raw = localStorage.getItem("canvas_temp_profile");
    if (raw) {
      try {
        setLocalProfile(JSON.parse(raw));
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    if (profile) {
      const code = generateSessionCode(profile.name);
      setSessionCode(code);
    }
  }, [profile]);

  async function handleSave() {
    if (!sessionCode || !profile) return;

    saveSessionToLocal(sessionCode);
    setProfile(profile, sessionCode);

    // Session in Supabase speichern
    await fetch("/api/session/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionCode, profile }),
    });

    localStorage.removeItem("canvas_temp_profile");
    setSaved(true);
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-6">
      <main className="mx-auto w-full max-w-3xl pb-16 pt-14">
        <div className="rounded-2xl border border-zinc-200 bg-white p-10 shadow-lg">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-zinc-950">
            Dein persönlicher Lern-Code
          </h1>

          {profile ? (
            <div className="space-y-6">
              <p className="text-zinc-600">
                Mit diesem Code kannst du jederzeit zu deinem Lernfortschritt zurückkehren.
                Notiere ihn dir gut!
              </p>

              <div className="flex items-center justify-center rounded-xl border-2 border-zinc-200 bg-zinc-50 py-8">
                <span className="text-4xl font-bold tracking-widest text-zinc-950">
                  {formatSessionCode(sessionCode)}
                </span>
              </div>

              {!saved ? (
                <button
                  onClick={handleSave}
                  className="inline-flex w-full h-12 items-center justify-center rounded-xl bg-zinc-950 text-sm font-semibold text-white hover:bg-zinc-800"
                >
                  Code speichern und weiter
                </button>
              ) : (
                <button
                  onClick={() => router.push("/step/5")}
                  className="inline-flex w-full h-12 items-center justify-center rounded-xl bg-zinc-950 text-sm font-semibold text-white hover:bg-zinc-800"
                >
                  Weiter →
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-zinc-600">
                Kein Profil gefunden. Bitte gehe zurück zu Schritt 3.
              </p>
              <button
                onClick={() => router.push("/step/3")}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 px-6 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                ← Zurück zu Schritt 3
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
