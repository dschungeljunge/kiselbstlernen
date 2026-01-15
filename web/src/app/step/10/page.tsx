/**
 * Step 10 – Zwischenstand und Ausblick
 * 
 * Lob für den bisherigen Fortschritt und Hinweis auf kommende Inhalte
 */

"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSession } from "@/contexts/SessionContext";

export default function Step10Page() {
  const { updateProgress, markStepCompleted, sessionCode } = useSession();

  // Fortschritt aktualisieren, wenn Seite geladen wird
  useEffect(() => {
    if (sessionCode) {
      updateProgress(10);
      markStepCompleted(10);
    }
  }, [sessionCode, updateProgress, markStepCompleted]);

  return (
    <div className="min-h-screen bg-zinc-50 px-6">
      <main className="mx-auto w-full max-w-4xl pb-16 pt-14">
        
        {/* Zwischenstand-Container */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-10 shadow-lg">
          
          <div className="relative">
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-md">
                <svg 
                  width="40" 
                  height="40" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
            </div>

            {/* Haupttitel */}
            <h1 className="mb-4 text-center text-4xl font-bold tracking-tight text-zinc-950">
              Zwischenziel erreicht!
            </h1>

            {/* Lob-Text */}
            <div className="mx-auto max-w-2xl space-y-6 text-center">
              <p className="text-xl leading-relaxed text-zinc-800">
                Du hast die ersten Übungen der Weiterbildung erfolgreich abgeschlossen. 
                Die praktischen Beispiele haben dir gezeigt, wie KI als Werkzeug in deinem 
                Berufsalltag Entlastung schaffen kann.
              </p>

              <p className="text-lg leading-relaxed text-zinc-700">
                Du hast erste Erfahrungen gesammelt, wie du Dokumente analysierst, 
                Unterrichtsmaterialien differenzierst und administrative Aufgaben effizienter 
                gestaltest – alles mit dem Ziel, mehr Zeit für das Wesentliche zu gewinnen: 
                die Arbeit mit deinen Lernenden.
              </p>
            </div>

            {/* Trennlinie */}
            <div className="my-8 flex items-center justify-center">
              <div className="h-px w-24 rounded-full bg-gradient-to-r from-transparent via-zinc-300 to-transparent"></div>
            </div>

            {/* Ausblick */}
            <div className="mx-auto max-w-2xl space-y-4 text-center">
              <h2 className="text-2xl font-bold text-zinc-950">
                Wie geht es weiter?
              </h2>
              
              <p className="text-lg leading-relaxed text-zinc-700">
                Die nächsten Module werden in den kommenden Wochen aufgeschaltet. 
                Diese bauen auf deinen bisherigen Erfahrungen auf und vertiefen weitere 
                zentrale Bereiche deiner professionellen Praxis im Umgang mit KI.
              </p>

              <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50/80 p-6">
                <p className="text-base leading-relaxed text-zinc-700">
                  Du wirst informiert, sobald die weiteren Module verfügbar sind. 
                  Nutze die Zwischenzeit gerne, um die gelernten Techniken in deinem Alltag 
                  auszuprobieren und erste Erfahrungen zu sammeln.
                </p>
              </div>
            </div>

            {/* Info-Box */}
            <div className="mt-8 rounded-xl border-l-4 border-zinc-300 bg-zinc-50/50 p-5">
              <p className="text-sm leading-relaxed text-zinc-700">
                <strong className="text-zinc-900">Hinweis:</strong> Mit deinem persönlichen 
                Lern-Code kannst du jederzeit hierher zurückkehren und deinen Fortschritt 
                weiterführen, sobald die neuen Module verfügbar sind. Der Code wurde dir nach 
                dem Profil-Chat zugestellt.
              </p>
            </div>
          </div>
        </div>

        {/* Zurück zur Startseite Button */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-10 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-300"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Zurück zur Startseite
          </Link>
        </div>

        {/* Zusätzlicher Motivationstext */}
        <div className="mt-8 text-center">
          <p className="text-sm text-zinc-600">
            Danke für dein Engagement und deine Bereitschaft, neue Wege im 
            Umgang mit KI zu erkunden.
          </p>
        </div>
      </main>
    </div>
  );
}


