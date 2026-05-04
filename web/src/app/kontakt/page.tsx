/**
 * Kontakt-Seite
 * Bietet verschiedene Kontaktmöglichkeiten für Support und Rückfragen
 */

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt | KI-Kompass",
  description: "Kontaktmöglichkeiten für Fragen und Support zur KI-Kompass Weiterbildungsplattform",
};

export default async function KontaktPage(props: PageProps<"/kontakt">) {
  await props.params;
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header mit Zurück-Link */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-6">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 12L6 8l4-4" />
            </svg>
            Zurück zur Startseite
          </Link>
        </div>
      </div>

      {/* Hauptinhalt */}
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-950">Kontakt</h1>
        <p className="mt-2 text-lg text-zinc-600">
          Bei Fragen, technischen Problemen oder Feedback können Sie mich gerne kontaktieren.
        </p>

        <div className="mt-10 space-y-8">
          {/* Prototyp-Hinweis */}
          <section className="rounded-xl border-2 border-yellow-400 bg-yellow-50 p-6">
            <p className="text-sm leading-relaxed text-zinc-700">
              <strong>Hinweis:</strong> Dies ist ein Prototyp in Entwicklung. Für Anfragen zum 
              BBZ Olten oder zur PH FHNW wenden Sie sich bitte direkt an die jeweiligen Institutionen.
            </p>
          </section>

          {/* Hauptkontakt */}
          <section className="rounded-2xl border-2 border-zinc-200 bg-white p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-yellow-400 text-zinc-900">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-zinc-950">Peter Rigert</h2>
                <p className="mt-1 text-base text-zinc-700">
                  Verantwortlich für diesen Prototyp
                </p>
                <div className="mt-4 space-y-2">
                  <p className="flex items-center gap-2 text-zinc-700">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <a 
                      href="mailto:peter.rigert@fhnw.ch" 
                      className="font-medium text-yellow-600 hover:underline"
                    >
                      peter.rigert@fhnw.ch
                    </a>
                  </p>
                  <p className="text-sm text-zinc-600">
                    Antwortzeit: In der Regel innerhalb von 2 Werktagen
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Kontaktgründe */}
          <section>
            <h2 className="text-2xl font-semibold text-zinc-900">Wofür können Sie mich kontaktieren?</h2>
            
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {/* Technische Probleme */}
              <div className="rounded-xl border border-zinc-200 bg-white p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900">Technische Probleme</h3>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-zinc-700">
                  <li className="flex items-start gap-2">
                    <span className="text-zinc-400">•</span>
                    <span>Lernfortschritt wird nicht gespeichert</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-zinc-400">•</span>
                    <span>Seiten laden nicht korrekt</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-zinc-400">•</span>
                    <span>Session-Code vergessen oder verloren</span>
                  </li>
                </ul>
              </div>

              {/* Inhaltliche Fragen */}
              <div className="rounded-xl border border-zinc-200 bg-white p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900">Inhaltliche Fragen</h3>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-zinc-700">
                  <li className="flex items-start gap-2">
                    <span className="text-zinc-400">•</span>
                    <span>Verständnisfragen zu Inhalten</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-zinc-400">•</span>
                    <span>Feedback zu Übungen</span>
                  </li>
                </ul>
              </div>

              {/* Feedback */}
              <div className="rounded-xl border border-zinc-200 bg-white p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900">Feedback</h3>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-zinc-700">
                  <li className="flex items-start gap-2">
                    <span className="text-zinc-400">•</span>
                    <span>Verbesserungsvorschläge</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-zinc-400">•</span>
                    <span>Fehler oder Tippfehler melden</span>
                  </li>
                </ul>
              </div>

              {/* Datenschutz */}
              <div className="rounded-xl border border-zinc-200 bg-white p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900">Datenschutz</h3>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-zinc-700">
                  <li className="flex items-start gap-2">
                    <span className="text-zinc-400">•</span>
                    <span>Auskunft über Ihre Daten</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-zinc-400">•</span>
                    <span>Löschung Ihrer Daten</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Tipps für Kontaktaufnahme */}
          <section className="rounded-lg bg-zinc-100 p-6">
            <h2 className="text-lg font-semibold text-zinc-900">
              💡 Tipps für eine schnelle Antwort
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-zinc-700">
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">✓</span>
                <span>
                  <strong>Bei technischen Problemen:</strong> Geben Sie Ihren Browser, 
                  Betriebssystem und (wenn vorhanden) Ihren Session-Code an
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">✓</span>
                <span>
                  <strong>Bei Datenschutzanfragen:</strong> Geben Sie Ihren Session-Code an, 
                  damit ich Ihre Daten identifizieren kann
                </span>
              </li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}

