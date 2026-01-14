"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/contexts/SessionContext";
import { CoachProfile } from "@/components/CoachProfile";
import { RelevanceQuiz } from "@/components/RelevanceQuiz";

export default function Home() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { loadSession } = useSession();

  async function handleCodeSubmit() {
    if (!code.trim()) return;

    setIsLoading(true);
    setError("");

    const result = await loadSession(code);

    if (result.success && result.currentStep) {
      // Session geladen → zur aktuellen Position springen
      router.push(`/step/${result.currentStep}`);
    } else {
      setError("Code nicht gefunden. Bitte überprüfe die Eingabe.");
      setIsLoading(false);
    }
  }

  return (
    <>
      {/* Hero-Bereich mit FHNW-Branding */}
      <div className="relative overflow-hidden bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-400">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="relative px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <h1 className="text-5xl font-bold tracking-tight text-zinc-950 md:text-6xl">
              KI-Kompass
            </h1>
            <p className="mt-2 text-2xl font-semibold text-zinc-900">
              Online-Weiterbildung für Lehrpersonen des BBZ Olten
            </p>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-800">
              Eine strukturierte Lernreise zum professionellen, verantwortungsbewussten Einsatz 
              von KI im Berufsalltag. KI wird nicht als Technikthema vermittelt, sondern als 
              Werkzeug zur Entlastung und zur Stärkung Ihrer professionellen Handlungskompetenz.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/step/1"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-8 text-base font-semibold text-white shadow-lg shadow-zinc-900/20 transition-all hover:scale-105 hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-300"
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
                  <path d="M5 10h10M12 7l3 3-3 3" />
                </svg>
                Weiterbildung starten
              </Link>
            </div>

            {/* Kernmerkmale */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              <div className="rounded-xl bg-white/80 p-4 backdrop-blur">
                <div className="text-3xl font-bold text-zinc-950">4</div>
                <div className="mt-1 text-sm font-medium text-zinc-700">Module</div>
              </div>
              <div className="rounded-xl bg-white/80 p-4 backdrop-blur">
                <div className="text-3xl font-bold text-zinc-950">2–4h</div>
                <div className="mt-1 text-sm font-medium text-zinc-700">Zeitaufwand</div>
              </div>
              <div className="rounded-xl bg-white/80 p-4 backdrop-blur">
                <div className="text-3xl font-bold text-zinc-950">100%</div>
                <div className="mt-1 text-sm font-medium text-zinc-700">Praxisnah</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hauptinhalt */}
      <div className="min-h-screen bg-zinc-50 px-6">
        <main className="mx-auto w-full max-w-5xl pb-16 pt-16">
          
          {/* Relevanz-Quiz */}
          <section className="mb-16">
            <RelevanceQuiz />
          </section>

          {/* Über den Coach */}
          <section className="mb-16">
            <CoachProfile 
              name="Peter Rigert"
              role="Dozent für Digitale Bildung & KI, PH FHNW"
              bio="Ich begleite Sie auf dieser Lernreise durch die Welt der KI-gestützten Unterrichtspraxis. Mein Fokus liegt darauf, KI nicht als Technikthema zu vermitteln, sondern als praktisches Werkzeug, das Sie in Ihrem professionellen Alltag entlastet und Ihre pädagogische Wirksamkeit stärkt."
              imageUrl="/peter-rigert.jpg"
            />
          </section>

          {/* Was erwartet dich? */}
          <section className="mb-16">
            <div className="mb-8 inline-block">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-950">
                So funktioniert die Weiterbildung
              </h2>
              <div className="mt-2 h-1 w-20 rounded-full bg-yellow-400"></div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Feature 1 */}
              <div className="group rounded-2xl border-2 border-zinc-200 bg-white p-6 transition-all hover:border-yellow-400 hover:shadow-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600 transition-all group-hover:bg-yellow-400 group-hover:text-white">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-zinc-950">
                  Linear geführt, selbstbestimmt
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  Eine klare Abfolge schafft Orientierung und reduziert Überforderung. 
                  Sie bestimmen Tempo und Tiefe der Bearbeitung selbst – es gibt keine 
                  Prüfung und keine Bewertung.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group rounded-2xl border-2 border-zinc-200 bg-white p-6 transition-all hover:border-yellow-400 hover:shadow-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600 transition-all group-hover:bg-yellow-400 group-hover:text-white">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-zinc-950">
                  Geschützter Entwicklungsraum
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  Keine personenbezogenen Daten, kein Monitoring, keine Rückmeldung an 
                  den Arbeitgeber. Ihr Fortschritt wird über einen anonymen Code gespeichert, 
                  den nur Sie kennen.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group rounded-2xl border-2 border-zinc-200 bg-white p-6 transition-all hover:border-yellow-400 hover:shadow-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600 transition-all group-hover:bg-yellow-400 group-hover:text-white">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v20M2 12h20" />
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-zinc-950">
                  Doppeldecker-Logik
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  Jede Übung verbindet ein reales Praxisproblem aus Ihrem Lehralltag mit 
                  einem konkreten KI-Feature. So erwerben Sie handlungsnahe Kompetenzen 
                  statt abstraktes Toolwissen.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="group rounded-2xl border-2 border-zinc-200 bg-white p-6 transition-all hover:border-yellow-400 hover:shadow-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600 transition-all group-hover:bg-yellow-400 group-hover:text-white">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-zinc-950">
                  Produktivität als Wertschöpfung
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  Nicht Ihr Unterricht wird „optimiert", sondern zeitraubende Nebenprozesse 
                  werden reduziert. Mehr Zeit für das, wo Lernende wirklich erreicht werden.
                </p>
              </div>
            </div>
          </section>

          {/* Code eingeben - neu gestylt */}
          <section className="mb-16">
            <div className="rounded-2xl border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-white p-8 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-yellow-400 text-zinc-900 shadow-md">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M3 10h14M9 4l6 6-6 6" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-zinc-950">
                    Bereits begonnen?
                  </h2>
                  <p className="mt-2 text-base leading-7 text-zinc-700">
                    Geben Sie Ihren <strong>Lern-Code</strong> ein, um dort fortzufahren, 
                    wo Sie aufgehört haben. Den Code haben Sie nach dem Profil-Chat erhalten.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === "Enter" && handleCodeSubmit()}
                  placeholder="z.B. HL9-HML"
                  maxLength={7}
                  disabled={isLoading}
                  className="h-12 w-48 rounded-xl border-2 border-zinc-300 bg-white px-4 py-2.5 font-mono text-base uppercase tracking-wider text-zinc-950 shadow-sm transition-all placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-zinc-400 hover:border-yellow-400 focus:border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-100 disabled:opacity-60"
                />
                <button
                  onClick={handleCodeSubmit}
                  disabled={!code.trim() || isLoading}
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-zinc-950 px-6 text-base font-semibold text-white shadow-md transition-all hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-300 disabled:opacity-60"
                >
                  {isLoading ? "Laden..." : "Code eingeben"}
                </button>
              </div>

              {error && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-sm">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}
            </div>
          </section>

          {/* Wichtige Hinweise */}
          <section className="mb-16">
            <div className="rounded-lg bg-zinc-50 p-5">
              <p className="text-xs leading-relaxed text-zinc-600">
                <strong className="text-zinc-700">Hinweise:</strong> Es gibt keine Leistungsmessung, 
                Prüfung oder Bewertung. Ihr Fortschritt wird über einen anonymen Code gespeichert – 
                keine personenbezogenen Daten werden verarbeitet. Didaktische Entscheidungen bleiben 
                bei Ihnen; KI liefert Vorschläge, Sie treffen die professionellen Entscheidungen.
              </p>
            </div>
          </section>

          {/* Footer-Hinweis */}
          <div className="rounded-xl bg-zinc-100 p-6 text-center">
            <p className="text-sm text-zinc-600">
              Eine Weiterbildung für Lehrpersonen des <strong className="text-zinc-900">BBZ Olten</strong>, 
              entwickelt und begleitet durch die{" "}
              <strong className="text-zinc-900">
                Pädagogische Hochschule der Fachhochschule Nordwestschweiz (PH FHNW)
              </strong>
              .
            </p>
            <p className="mt-3 text-xs text-zinc-500">
              Dies ist ein <strong>Prototyp</strong> im Rahmen der Entwicklung einer 
              Online-Weiterbildungsplattform.
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
