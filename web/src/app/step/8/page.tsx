/**
 * Step 8 – Dritte Übung: Administrative Dokumentation via Spracheingabe
 * 
 * Erweitert mit optionalen Unterstützungselementen:
 * - Direktlink zu Microsoft Copilot
 * - FAQ (ausklappbar)
 * - Checkliste (ausklappbar)
 */

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "@/contexts/SessionContext";

export default function Step8Page() {
  const { updateProgress, markStepCompleted, sessionCode } = useSession();
  const [faqOpen, setFaqOpen] = useState(false);
  const [checklistOpen, setChecklistOpen] = useState(false);

  // Fortschritt aktualisieren, wenn Seite geladen wird
  useEffect(() => {
    if (sessionCode) {
      updateProgress(8);
      markStepCompleted(8);
    }
  }, [sessionCode, updateProgress, markStepCompleted]);

  return (
    <div className="min-h-screen bg-zinc-50 px-6">
      <main className="mx-auto w-full max-w-4xl pb-16 pt-14">
        {/* Video Container */}
        <div className="relative w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
            <iframe
              src="https://www.loom.com/embed/29ffb79fde674362895d1061122a72a8"
              frameBorder="0"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        </div>

        {/* Optionale Unterstützungselemente */}
        <div className="mt-8 space-y-4">

          {/* FAQ (ausklappbar) */}
          <div className="rounded-xl border border-zinc-200 bg-white">
            <button
              onClick={() => setFaqOpen(!faqOpen)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-semibold text-zinc-900">
                  Häufige Fragen (FAQ)
                </span>
              </div>
              <svg 
                className={`w-5 h-5 text-zinc-400 transition-transform ${faqOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {faqOpen && (
              <div className="border-t border-zinc-200 p-4 space-y-4 text-sm">
                <div>
                  <p className="font-medium text-zinc-900 mb-1">
                    Wie aktiviere ich die Spracheingabe in Copilot?
                  </p>
                  <p className="text-zinc-600">
                    Im Chat-Eingabefeld findest du unten rechts ein Mikrofon-Symbol. Klicke darauf und erlaube dem Browser den Zugriff auf dein Mikrofon. Beim ersten Mal wirst du nach einer Berechtigung gefragt.
                  </p>
                </div>
                
                <div>
                  <p className="font-medium text-zinc-900 mb-1">
                    Was passiert mit meiner Sprachaufnahme?
                  </p>
                  <p className="text-zinc-600">
                    Die Spracheingabe wird in Text umgewandelt und an Copilot gesendet. Die Aufnahme selbst wird nicht dauerhaft gespeichert. Beachte dennoch die Datenschutzrichtlinien für sensible Informationen.
                  </p>
                </div>
                
                <div>
                  <p className="font-medium text-zinc-900 mb-1">
                    Muss ich besonders deutlich sprechen?
                  </p>
                  <p className="text-zinc-600">
                    Normale, klare Aussprache reicht aus. Du musst nicht übertrieben deutlich sprechen, aber vermeide Hintergrundgeräusche für bessere Ergebnisse. Die KI versteht auch Umgangssprache und kann mit Pausen umgehen.
                  </p>
                </div>
                
                <div>
                  <p className="font-medium text-zinc-900 mb-1">
                    Was mache ich, wenn die Transkription Fehler enthält?
                  </p>
                  <p className="text-zinc-600">
                    Du kannst den transkribierten Text nach der Aufnahme korrigieren, bevor du ihn absendest. Alternativ kannst du Copilot bitten, offensichtliche Fehler zu korrigieren, oder einfach nochmals sprechen.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Checkliste (ausklappbar) */}
          <div className="rounded-xl border border-zinc-200 bg-white">
            <button
              onClick={() => setChecklistOpen(!checklistOpen)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <span className="text-sm font-semibold text-zinc-900">
                  Schritt-für-Schritt Checkliste
                </span>
              </div>
              <svg 
                className={`w-5 h-5 text-zinc-400 transition-transform ${checklistOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {checklistOpen && (
              <div className="border-t border-zinc-200 p-4 space-y-3 text-sm">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-zinc-300 flex items-center justify-center text-xs font-medium text-zinc-600">
                    1
                  </div>
                  <p className="text-zinc-700 pt-0.5">
                    Microsoft Copilot öffnen
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-zinc-300 flex items-center justify-center text-xs font-medium text-zinc-600">
                    2
                  </div>
                  <p className="text-zinc-700 pt-0.5">
                    Mikrofon-Symbol anklicken und Mikrofon-Zugriff erlauben
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-zinc-300 flex items-center justify-center text-xs font-medium text-zinc-600">
                    3
                  </div>
                  <p className="text-zinc-700 pt-0.5">
                    Beobachtung oder Situation mündlich beschreiben
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-zinc-300 flex items-center justify-center text-xs font-medium text-zinc-600">
                    4
                  </div>
                  <p className="text-zinc-700 pt-0.5">
                    Copilot bitten, aus der mündlichen Beobachtung einen formalen Dokumentationstext zu erstellen
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-zinc-300 flex items-center justify-center text-xs font-medium text-zinc-600">
                    5
                  </div>
                  <p className="text-zinc-700 pt-0.5">
                    Ergebnis für deine Dokumentation verwenden
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Weiter Button zur Reflexion */}
        <div className="mt-8 flex justify-end">
          <Link
            href="/step/9"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-950 px-8 text-sm font-semibold text-white hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-200"
          >
            Zur Reflexion →
          </Link>
        </div>
      </main>
    </div>
  );
}

