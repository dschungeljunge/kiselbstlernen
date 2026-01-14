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
  const { 
    createSession, 
    updateProgress, 
    markStepCompleted, 
    sessionCode: existingSessionCode,
    profile: existingProfile 
  } = useSession();

  // Beim Laden: Prüfen ob Session bereits existiert oder neue Session erstellen
  useEffect(() => {
    // Falls Session bereits existiert, Code und Profil aus SessionContext laden
    if (existingSessionCode && existingProfile) {
      setSessionCode(existingSessionCode);
      setProfile(existingProfile);
      updateProgress(4);
      markStepCompleted(4);
      return;
    }

    // Sonst: Neue Session erstellen, falls Profil im localStorage vorhanden
    const tempProfile = localStorage.getItem("canvas_temp_profile");
    if (tempProfile) {
      const profileData = JSON.parse(tempProfile);
      setProfile(profileData);
      
      // Code generieren und Session speichern
      generateAndSaveSession(profileData);
    }
  }, [existingSessionCode, existingProfile, updateProgress, markStepCompleted]);

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
        
        <h1 className="text-2xl font-semibold text-zinc-950">
          Zwischenschritte speichern
        </h1>
        
        <div className="mt-6 space-y-4 text-base leading-7 text-zinc-700">
          <p>
            Du kannst jederzeit pausieren und später weitermachen – <strong>ganz ohne Anmeldung</strong>.
          </p>
          <p>
            Dazu verwenden wir ein <strong>anonymes Lern-Code-System</strong>: 
            Du erhältst einen persönlichen Code, mit dem du deinen Fortschritt 
            speichern und später fortsetzen kannst.
          </p>
          <p>
            Notiere dir den Code unten oder mache einen Screenshot. Auf der Startseite 
            kannst du ihn eingeben, um dort weiterzumachen, wo du aufgehört hast.
          </p>
        </div>

        {/* Session-Code Anzeige */}
        {isGenerating ? (
          <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-8 text-center">
            <div className="inline-flex items-center gap-2 text-base text-zinc-600">
              <div className="h-2 w-2 animate-pulse rounded-full bg-zinc-400" />
              <div className="h-2 w-2 animate-pulse rounded-full bg-zinc-400 [animation-delay:0.2s]" />
              <div className="h-2 w-2 animate-pulse rounded-full bg-zinc-400 [animation-delay:0.4s]" />
              <span className="ml-2">Code wird generiert...</span>
            </div>
          </div>
        ) : sessionCode ? (
          <div className="mt-8 space-y-4">
            <div className="text-base font-medium text-zinc-900">
              Dein persönlicher Lern-Code:
            </div>
            
            <div className="flex items-center gap-3 rounded-lg border-2 border-zinc-300 bg-white px-6 py-5">
              <span className="flex-1 font-mono text-2xl font-bold tracking-wider text-zinc-950">
                {formatSessionCode(sessionCode)}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(sessionCode);
                  alert("Code kopiert!");
                }}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-zinc-300 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-300"
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

            {profile && (
              <div className="text-base text-zinc-600">
                Gespeichert: <span className="font-medium text-zinc-900">{profile.name}</span>
              </div>
            )}
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
