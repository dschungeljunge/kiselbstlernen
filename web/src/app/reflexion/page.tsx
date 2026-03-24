"use client";

import Link from "next/link";
import { useReflexion } from "@/contexts/ReflexionContext";

export default function ReflexionLandingPage() {
  const { profile, sessionCode, isLoading } = useReflexion();

  return (
    <div className="min-h-screen bg-zinc-50 px-6">
      <main className="mx-auto w-full max-w-3xl pb-16 pt-14">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400 shadow-md">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-950">
            Reflexion meines KI-Einsatzes
          </h1>
          <p className="mt-3 text-lg text-zinc-600">
            Workshop 2 – Zweiter Teil
          </p>
        </div>

        {/* Profil-Karte */}
        {!isLoading && (
          <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            {profile && sessionCode ? (
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-yellow-100">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#92400e"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Profil geladen
                  </p>
                  <p className="mt-0.5 text-base font-semibold text-zinc-900">
                    {profile.name}
                  </p>
                  <p className="mt-1 text-sm text-zinc-600 line-clamp-2">
                    {profile.description}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-zinc-100">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#71717a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4M12 16h.01" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    Kein Lern-Code erkannt
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">
                    Die Reflexion funktioniert auch ohne Profil. Für eine
                    personalisierte Erfahrung gib deinen Lern-Code auf der
                    Startseite ein.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Intro-Text */}
        <div className="mb-8 space-y-4 rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-zinc-950">
            Was dich erwartet
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-zinc-700">
            <p>
              Du hast seit dem ersten Workshop einen KI-Einsatz in deinem
              Unterricht ausprobiert und deine Erfahrungen mitgebracht. Jetzt
              reflektieren wir diese Situation gemeinsam – strukturiert und mit
              Unterstützung einer KI.
            </p>
            <p>
              Die Reflexion besteht aus drei Teilen:
            </p>
          </div>

          <ol className="space-y-4 pt-2">
            {[
              {
                step: "1",
                title: "Situation beschreiben",
                desc: "Du erzählst (per Text oder Audio) von deinem KI-Einsatz. Eine KI fasst die Situation zusammen und bereitet den Kontext für die Reflexion vor.",
              },
              {
                step: "2",
                title: "Strategien wählen & reflektieren",
                desc: "Du wählst 1–5 Reflexionsstrategien aus fünf unterschiedlichen Perspektiven. Jede Strategie führt dich durch ein Gespräch oder ein strukturiertes Formular.",
              },
              {
                step: "3",
                title: "Cockpit",
                desc: "Alle Erkenntnisse werden in einem persönlichen Cockpit zusammengeführt – mit konkreten nächsten Schritten für deinen nächsten KI-Einsatz.",
              },
            ].map((item) => (
              <li key={item.step} className="flex gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-zinc-950 text-sm font-bold text-white">
                  {item.step}
                </div>
                <div>
                  <p className="font-semibold text-zinc-900">{item.title}</p>
                  <p className="mt-0.5 text-sm text-zinc-600">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <Link
            href={"/reflexion/situation"}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-10 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-300"
          >
            Reflexion starten
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </main>
    </div>
  );
}
