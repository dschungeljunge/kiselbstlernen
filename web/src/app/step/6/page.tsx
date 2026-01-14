/**
 * Step 6 – Erste Übung: Informationsverarbeitung mit Dokumenten-Chat
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

export default function Step6Page() {
  const { updateProgress, markStepCompleted, sessionCode } = useSession();
  const [faqOpen, setFaqOpen] = useState(false);
  const [checklistOpen, setChecklistOpen] = useState(false);

  // Fortschritt aktualisieren, wenn Seite geladen wird
  useEffect(() => {
    if (sessionCode) {
      updateProgress(6);
      markStepCompleted(6);
    }
  }, [sessionCode, updateProgress, markStepCompleted]);

  return (
    <div className="min-h-screen bg-zinc-50 px-6">
      <main className="mx-auto w-full max-w-4xl pb-16 pt-14">
        {/* Video Container */}
        <div className="relative w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
            <iframe
              src="https://www.loom.com/embed/765e806e258d450dbf494077b31cf49a"
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
          
          {/* Direktlink zu Copilot */}
          <div className="rounded-xl border border-zinc-200 bg-white p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-zinc-900 mb-1">
                  Jetzt ausprobieren
                </h3>
                <p className="text-sm text-zinc-600 mb-3">
                  Öffne Microsoft Copilot in einem neuen Tab, um die Übung direkt durchzuführen.
                </p>
                <a
                  href="https://m365.cloud.microsoft/chat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 hover:underline"
                >
                  → Microsoft Copilot öffnen
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

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
                    Wo finde ich die Upload-Funktion in Copilot?
                  </p>
                  <p className="text-zinc-600">
                    Im Chat-Eingabefeld findest du unten links ein Plus-Symbol (+). Klicke darauf, um ein Dokument hochzuladen.
                  </p>
                </div>
                
                <div>
                  <p className="font-medium text-zinc-900 mb-1">
                    Welche Dateiformate werden unterstützt?
                  </p>
                  <p className="text-zinc-600">
                    Copilot unterstützt gängige Formate wie PDF, Word (.docx), PowerPoint (.pptx) und Excel (.xlsx). Für Lehrpläne funktionieren PDF und Word am besten.
                  </p>
                </div>
                
                <div>
                  <p className="font-medium text-zinc-900 mb-1">
                    Kann ich mehrere Dokumente gleichzeitig hochladen?
                  </p>
                  <p className="text-zinc-600">
                    Ja, du kannst mehrere Dokumente in einem Chat-Gespräch hochladen. Copilot bezieht sich dann auf alle verfügbaren Dokumente.
                  </p>
                </div>
                
                <div>
                  <p className="font-medium text-zinc-900 mb-1">
                    Was passiert mit meinen hochgeladenen Dokumenten?
                  </p>
                  <p className="text-zinc-600">
                    Die Dokumente werden für den Chat-Verlauf temporär verarbeitet. Beachte die Datenschutzrichtlinien von Microsoft für sensible Informationen.
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
                    Microsoft Copilot öffnen (siehe Link oben)
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-zinc-300 flex items-center justify-center text-xs font-medium text-zinc-600">
                    2
                  </div>
                  <p className="text-zinc-700 pt-0.5">
                    Dokument hochladen (Plus-Symbol + unten links im Chat-Eingabefeld)
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-zinc-300 flex items-center justify-center text-xs font-medium text-zinc-600">
                    3
                  </div>
                  <p className="text-zinc-700 pt-0.5">
                    Eine Frage formulieren, die das Dokument mit deiner Praxis verbindet (z.B. "Wo kommen kreative Prozesse in diesem Lehrplan vor?")
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-zinc-300 flex items-center justify-center text-xs font-medium text-zinc-600">
                    4
                  </div>
                  <p className="text-zinc-700 pt-0.5">
                    Die Antwort der KI durchlesen und relevante Stellen identifizieren
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-zinc-300 flex items-center justify-center text-xs font-medium text-zinc-600">
                    5
                  </div>
                  <p className="text-zinc-700 pt-0.5">
                    Bei Bedarf Rückfragen stellen, um tiefer einzusteigen oder spezifischere Informationen zu erhalten
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Weiter Button */}
        <div className="mt-8 flex justify-end">
          <Link
            href="/step/7"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-950 px-8 text-sm font-semibold text-white hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-200"
          >
            Weiter →
          </Link>
        </div>
      </main>
    </div>
  );
}

