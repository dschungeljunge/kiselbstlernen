/**
 * Step 4 – Session-System Erklärung & Code-Generierung
 * 
 * Erklärt das anonyme Lern-Code-System und generiert Session-Code
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "@/contexts/SessionContext";
import { generateSessionCode, formatSessionCode } from "@/lib/session-manager";

interface ProfileData {
  name: string;
  description: string;
  strengths: string[];
}

export default function Step4Page() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [sessionCode, setSessionCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { createSession } = useSession();

  // Beim Laden: Profil aus localStorage holen und Code generieren
  useEffect(() => {
    const tempProfile = localStorage.getItem("canvas_temp_profile");
    if (tempProfile) {
      const profileData = JSON.parse(tempProfile);
      setProfile(profileData);
      
      // Code generieren und Session speichern
      generateAndSaveSession(profileData);
    }
  }, []);

  async function generateAndSaveSession(profileData: ProfileData) {
    setIsGenerating(true);
    
    try {
      // Session erstellen (generiert Code + speichert in DB)
      const code = await createSession(profileData);
      setSessionCode(code);
      
      // Temp-Profil aus localStorage entfernen
      localStorage.removeItem("canvas_temp_profile");
      
      console.log("✅ Session erstellt:", code);
    } catch (error) {
      console.error("❌ Session-Erstellung fehlgeschlagen:", error);
      
      // Fallback: Nur Code generieren (nicht speichern)
      const fallbackCode = generateSessionCode(profileData.name);
      setSessionCode(fallbackCode);
      
      alert("⚠️ Hinweis: Code wurde erstellt, konnte aber nicht gespeichert werden. Bitte Supabase-Migration ausführen (siehe Console).");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-6 pb-16 pt-14">
      <main className="mx-auto w-full max-w-3xl">
        {/* Info-Box: Session-System Erklärung */}
        <div className="rounded-xl border border-zinc-200 bg-white p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-blue-600"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-zinc-950">
                Zwischenschritte speichern
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-6 text-zinc-700">
                <p>
                  Du kannst jederzeit pausieren und später weitermachen – <strong>ganz ohne Anmeldung</strong>.
                </p>
                <p>
                  Dazu verwenden wir ein <strong>anonymes Lern-Code-System</strong>: 
                  Du erhältst einen persönlichen Code, mit dem du deinen Fortschritt 
                  speichern und später fortsetzen kannst.
                </p>
                <p className="rounded-lg bg-amber-50 px-3 py-2 text-amber-900">
                  💡 <strong>So funktioniert's:</strong> Notiere dir den Code unten oder 
                  mache einen Screenshot. Auf der Startseite kannst du ihn eingeben, 
                  um dort weiterzumachen, wo du aufgehört hast.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Session-Code Anzeige */}
        {isGenerating ? (
          <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-8 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-zinc-600">
              <div className="h-2 w-2 animate-pulse rounded-full bg-zinc-400" />
              <div className="h-2 w-2 animate-pulse rounded-full bg-zinc-400 [animation-delay:0.2s]" />
              <div className="h-2 w-2 animate-pulse rounded-full bg-zinc-400 [animation-delay:0.4s]" />
              <span className="ml-2">Code wird generiert...</span>
            </div>
          </div>
        ) : sessionCode ? (
          <div className="mt-6 rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-zinc-950">
                  ✅ Dein Lern-Code wurde erstellt!
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-700">
                  Mit diesem Code kannst du jederzeit dort weitermachen, wo du aufgehört hast.
                </p>
                
                <div className="mt-5 space-y-2">
                  <div className="text-sm font-semibold text-zinc-900">
                    Dein persönlicher Lern-Code:
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border-2 border-blue-300 bg-white px-5 py-4 shadow-sm">
                    <span className="flex-1 font-mono text-2xl font-bold tracking-wider text-blue-600">
                      {formatSessionCode(sessionCode)}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(sessionCode);
                        alert("✅ Code kopiert! Du findest ihn jetzt in deiner Zwischenablage.");
                      }}
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                      title="Code kopieren"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect x="5" y="5" width="9" height="9" rx="1" />
                        <path d="M3 11V3a2 2 0 012-2h6" />
                      </svg>
                    </button>
                  </div>
                </div>

                {profile && (
                  <div className="mt-4 rounded-lg bg-white px-4 py-3 text-sm text-zinc-700">
                    <strong>Gespeichert:</strong> {profile.name}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {/* Weiter Button */}
        <div className="mt-8 flex justify-end">
          <Link
            href="/step/5"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-950 px-8 text-sm font-semibold text-white hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-200"
          >
            Weiter →
          </Link>
        </div>
      </main>
    </div>
  );
}
