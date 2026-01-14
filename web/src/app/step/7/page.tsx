/**
 * Step 7 – Zweite Übung: Unterrichtsmaterial differenzieren
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

export default function Step7Page() {
  const { updateProgress, markStepCompleted, sessionCode } = useSession();
  const [faqOpen, setFaqOpen] = useState(false);
  const [checklistOpen, setChecklistOpen] = useState(false);

  // Fortschritt aktualisieren, wenn Seite geladen wird
  useEffect(() => {
    if (sessionCode) {
      updateProgress(7);
      markStepCompleted(7);
    }
  }, [sessionCode, updateProgress, markStepCompleted]);

  return (
    <div className="min-h-screen bg-zinc-50 px-6">
      <main className="mx-auto w-full max-w-4xl pb-16 pt-14">
        {/* Video Container */}
        <div className="relative w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
            <iframe
              src="https://www.loom.com/embed/2a5fabcbc2a94e8eb54caecbbc6004a3"
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
                    Wie lade ich das generierte Word-Dokument herunter?
                  </p>
                  <p className="text-zinc-600">
                    Nachdem Copilot das Dokument erstellt hat, erscheint ein Download-Link oder Button direkt in der Chat-Antwort. Klicke darauf, um die Word-Datei herunterzuladen. <strong>Hinweis:</strong> Die Download-Funktion ist nicht immer zuverlässig. Falls der Download nicht funktioniert, kannst du den Text aus dem Chat kopieren und manuell in ein Word-Dokument einfügen.
                  </p>
                </div>
                
                <div>
                  <p className="font-medium text-zinc-900 mb-1">
                    Kann ich das generierte Dokument direkt bearbeiten?
                  </p>
                  <p className="text-zinc-600">
                    Ja, das heruntergeladene Word-Dokument kannst du in Microsoft Word oder einem anderen Textverarbeitungsprogramm öffnen und beliebig anpassen.
                  </p>
                </div>
                
                <div>
                  <p className="font-medium text-zinc-900 mb-1">
                    Was mache ich, wenn die Vorschläge nicht zu meiner Situation passen?
                  </p>
                  <p className="text-zinc-600">
                    Beschreibe die Situation konkreter oder frage nach alternativen Ansätzen. Du kannst auch einzelne Aspekte gezielt nachfragen oder präzisieren.
                  </p>
                </div>
                
                <div>
                  <p className="font-medium text-zinc-900 mb-1">
                    Welche Dateiformate kann Copilot erstellen?
                  </p>
                  <p className="text-zinc-600">
                    Copilot kann verschiedene Microsoft-Formate erstellen, insbesondere Word (.docx), PowerPoint (.pptx) und Excel (.xlsx). Du kannst auch explizit nach einem bestimmten Format fragen.
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
                    Unterrichtsmaterial hochladen (Plus-Symbol + unten links im Chat-Eingabefeld)
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-zinc-300 flex items-center justify-center text-xs font-medium text-zinc-600">
                    3
                  </div>
                  <p className="text-zinc-700 pt-0.5">
                    Die konkrete Unterrichtssituation beschreiben (z.B. Lernender mit besonderer Ausgangslage)
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-zinc-300 flex items-center justify-center text-xs font-medium text-zinc-600">
                    4
                  </div>
                  <p className="text-zinc-700 pt-0.5">
                    Nach didaktischen Vorschlägen für Differenzierung fragen
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-zinc-300 flex items-center justify-center text-xs font-medium text-zinc-600">
                    5
                  </div>
                  <p className="text-zinc-700 pt-0.5">
                    Einen passenden Vorschlag auswählen und Copilot bitten, daraus einen konkreten Unterrichtsauftrag zu formulieren
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-zinc-300 flex items-center justify-center text-xs font-medium text-zinc-600">
                    6
                  </div>
                  <p className="text-zinc-700 pt-0.5">
                    Das Ergebnis als Word-Dokument erstellen und herunterladen lassen
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Weiter Button */}
        <div className="mt-8 flex justify-end">
          <Link
            href="/step/8"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-950 px-8 text-sm font-semibold text-white hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-200"
          >
            Weiter →
          </Link>
        </div>
      </main>
    </div>
  );
}

