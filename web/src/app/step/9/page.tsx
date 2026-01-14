/**
 * Step 9 – Zwischenstand und Ausblick
 * 
 * Lob für den bisherigen Fortschritt und Hinweis auf kommende Inhalte
 */

import Link from "next/link";

export default function Step9Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-zinc-50 to-yellow-50 px-6">
      <main className="mx-auto w-full max-w-4xl pb-16 pt-14">
        
        {/* Gratulations-Container */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-yellow-400 bg-gradient-to-br from-white to-yellow-50 p-10 shadow-xl">
          
          {/* Dekoratives Element */}
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-yellow-300 opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-yellow-400 opacity-20 blur-3xl"></div>
          
          <div className="relative">
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-lg">
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
              Herzliche Gratulation!
            </h1>

            {/* Lob-Text */}
            <div className="mx-auto max-w-2xl space-y-6 text-center">
              <p className="text-xl leading-relaxed text-zinc-800">
                Du hast einen wichtigen Meilenstein erreicht! Du hast die ersten Schritte 
                der Weiterbildung erfolgreich abgeschlossen und damit gezeigt, dass du bereit 
                bist, neue Wege im Umgang mit KI zu gehen.
              </p>

              <p className="text-lg leading-relaxed text-zinc-700">
                Die ersten Übungen haben dir gezeigt, wie KI als Werkzeug in deinem 
                Berufsalltag echte Entlastung schaffen kann. Du hast gelernt, wie du 
                Dokumente analysierst, Unterrichtsmaterialien differenzierst und 
                administrative Aufgaben effizienter gestaltest – alles mit dem Ziel, 
                mehr Zeit für das Wesentliche zu gewinnen: die Arbeit mit deinen Lernenden.
              </p>
            </div>

            {/* Trennlinie */}
            <div className="my-8 flex items-center justify-center">
              <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
            </div>

            {/* Ausblick */}
            <div className="mx-auto max-w-2xl space-y-4 text-center">
              <h2 className="text-2xl font-bold text-zinc-950">
                Wie geht es weiter?
              </h2>
              
              <p className="text-lg leading-relaxed text-zinc-700">
                Die nächsten Module werden in Kürze aufgeschaltet. Diese werden sich 
                mit weiteren zentralen Bereichen deiner professionellen Praxis beschäftigen:
              </p>

              <div className="mt-6 grid gap-4 text-left sm:grid-cols-2">
                <div className="rounded-xl border border-yellow-300 bg-white/60 p-5 backdrop-blur">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-zinc-950">Modul 2</h3>
                  </div>
                  <p className="text-sm text-zinc-600">
                    Didaktische Qualität und Unterrichtsgestaltung
                  </p>
                </div>

                <div className="rounded-xl border border-yellow-300 bg-white/60 p-5 backdrop-blur">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-zinc-950">Modul 3</h3>
                  </div>
                  <p className="text-sm text-zinc-600">
                    Individuelle Förderung und Beziehungsarbeit
                  </p>
                </div>

                <div className="rounded-xl border border-yellow-300 bg-white/60 p-5 backdrop-blur sm:col-span-2">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-zinc-950">Modul 4</h3>
                  </div>
                  <p className="text-sm text-zinc-600">
                    Verantwortungsvoller Umgang: Datenschutz, Ethik und kritische Reflexion
                  </p>
                </div>
              </div>
            </div>

            {/* Info-Box */}
            <div className="mt-8 rounded-xl border-l-4 border-yellow-400 bg-yellow-50/50 p-5">
              <p className="text-sm leading-relaxed text-zinc-700">
                <strong className="text-zinc-900">Tipp:</strong> Du kannst jederzeit mit deinem 
                persönlichen Lern-Code zurückkehren und deinen Fortschritt weiterführen, sobald 
                die neuen Module verfügbar sind. Der Code wurde dir nach dem Profil-Chat zugestellt.
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
            Vielen Dank für dein Engagement und deine Bereitschaft, dich 
            auf diese Lernreise einzulassen!
          </p>
        </div>
      </main>
    </div>
  );
}

