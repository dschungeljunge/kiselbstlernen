"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/contexts/SessionContext";
import { SessionExplainer } from "@/components/SessionExplainer";
import { CoachProfile } from "@/components/CoachProfile";

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

    const success = await loadSession(code);

    if (success) {
      // Session geladen → zur letzten Position springen
      router.push("/step/1"); // Wird durch SessionContext zur richtigen Step geleitet
    } else {
      setError("Code nicht gefunden. Bitte überprüfe die Eingabe.");
      setIsLoading(false);
    }
  }

  return (
    <>
      <SessionExplainer />
      
      {/* Hero-Bereich mit FHNW-Branding */}
      <div className="relative overflow-hidden bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-400">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="relative px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm backdrop-blur">
              <span className="flex h-2 w-2">
                <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-yellow-600 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-yellow-600"></span>
              </span>
              Eine Weiterbildung der PH FHNW
            </div>
            
            <h1 className="text-5xl font-bold tracking-tight text-zinc-950 md:text-6xl">
              KI-Kompass
            </h1>
            <p className="mt-2 text-2xl font-semibold text-zinc-900">
              KI‑Weiterbildung für Lehrpersonen
            </p>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-800">
              Entdecken Sie in diesem strukturierten Lernpfad, wie Sie Künstliche Intelligenz 
              gewinnbringend in Ihren Unterricht integrieren können. Praxisnah, interaktiv und 
              speziell für Lehrpersonen konzipiert.
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

            {/* Statistiken */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              <div className="rounded-xl bg-white/80 p-4 backdrop-blur">
                <div className="text-3xl font-bold text-zinc-950">8</div>
                <div className="mt-1 text-sm font-medium text-zinc-700">Lernschritte</div>
              </div>
              <div className="rounded-xl bg-white/80 p-4 backdrop-blur">
                <div className="text-3xl font-bold text-zinc-950">2–3h</div>
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
          
          {/* Über den Coach */}
          <section className="mb-16">
            <CoachProfile 
              name="Peter Rigert"
              role="Dozent für Digitale Bildung & KI"
              bio="Als langjähriger Dozent an der PH FHNW begleite ich Lehrpersonen auf ihrem Weg in die digitale Zukunft. Mein Fokus liegt auf der praktischen Anwendung von KI-Tools im Unterricht und der Entwicklung von zukunftsfähigen Lernszenarien."
              imageUrl="/peter-rigert.jpg"
            />
          </section>

          {/* Was erwartet dich? */}
          <section className="mb-16">
            <div className="mb-8 inline-block">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-950">
                Was erwartet dich?
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
                  Strukturierter Lernpfad
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  Durchlaufen Sie 8 aufeinander aufbauende Schritte – von den Grundlagen 
                  bis zur praktischen Anwendung im eigenen Unterricht.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group rounded-2xl border-2 border-zinc-200 bg-white p-6 transition-all hover:border-yellow-400 hover:shadow-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600 transition-all group-hover:bg-yellow-400 group-hover:text-white">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-zinc-950">
                  Individuelles Tempo
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  Lernen Sie in Ihrem eigenen Rhythmus. Ihr Fortschritt wird automatisch 
                  gespeichert und Sie können jederzeit weitermachen.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group rounded-2xl border-2 border-zinc-200 bg-white p-6 transition-all hover:border-yellow-400 hover:shadow-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600 transition-all group-hover:bg-yellow-400 group-hover:text-white">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-zinc-950">
                  Interaktive Übungen
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  Wenden Sie das Gelernte direkt an: Erstellen Sie Ihren persönlichen 
                  AI-Circle und entwickeln Sie konkrete Unterrichtsszenarien.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="group rounded-2xl border-2 border-zinc-200 bg-white p-6 transition-all hover:border-yellow-400 hover:shadow-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600 transition-all group-hover:bg-yellow-400 group-hover:text-white">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-zinc-950">
                  KI-gestützte Begleitung
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  Erhalten Sie personalisierte Rückmeldungen durch unseren KI-Assistenten 
                  und entwickeln Sie Ihre digitalen Kompetenzen gezielt weiter.
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

          {/* Footer-Hinweis */}
          <div className="rounded-xl bg-zinc-100 p-6 text-center">
            <p className="text-sm text-zinc-600">
              Diese Weiterbildung ist Teil des Angebots der{" "}
              <strong className="text-zinc-900">
                Pädagogischen Hochschule der Fachhochschule Nordwestschweiz (PH FHNW)
              </strong>
              .
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
