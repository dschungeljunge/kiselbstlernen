/**
 * Barrierefreiheitserklärung
 * Informiert über den Stand der digitalen Barrierefreiheit der Plattform
 */

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Barrierefreiheit | KI-Kompass",
  description: "Erklärung zur digitalen Barrierefreiheit der KI-Kompass Weiterbildungsplattform",
};

export default function BarrierefreiheitPage() {
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
        <h1 className="text-4xl font-bold tracking-tight text-zinc-950">
          Erklärung zur digitalen Barrierefreiheit
        </h1>
        <p className="mt-2 text-lg text-zinc-600">
          Unser Engagement für eine zugängliche Lernplattform
        </p>
        <p className="mt-1 text-sm text-zinc-500">
          Stand: {new Date().toLocaleDateString("de-CH", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="mt-10 space-y-10">
          {/* Grundsatz */}
          <section>
            <h2 className="text-2xl font-semibold text-zinc-900">Unser Anspruch</h2>
            <div className="mt-4 space-y-3 text-zinc-700">
              <p>
                Die Pädagogische Hochschule FHNW ist bestrebt, ihre Weiterbildungsplattform 
                KI-Kompass im Einklang mit den nationalen Rechtsvorschriften zur Umsetzung 
                des Behindertengleichstellungsgesetzes (BehiG) sowie den 
                <strong> Web Content Accessibility Guidelines (WCAG) 2.1</strong> auf der 
                Konformitätsstufe AA barrierefrei zugänglich zu machen.
              </p>
              <p>
                Diese Erklärung zur Barrierefreiheit gilt für die KI-Kompass Plattform unter 
                der Domain, auf der Sie sich befinden.
              </p>
            </div>
          </section>

          {/* Stand der Vereinbarkeit */}
          <section>
            <h2 className="text-2xl font-semibold text-zinc-900">Stand der Vereinbarkeit</h2>
            <div className="mt-4 space-y-3 text-zinc-700">
              <p>
                Diese Website ist mit den WCAG 2.1 Level AA <strong>teilweise vereinbar</strong>.
              </p>
              <p>
                Die nachstehend aufgeführten Inhalte sind aus folgenden Gründen noch nicht 
                vollständig barrierefrei:
              </p>
            </div>
          </section>

          {/* Bereits umgesetzte Massnahmen */}
          <section>
            <h2 className="text-2xl font-semibold text-zinc-900">
              Bereits umgesetzte Barrierefreiheits-Massnahmen
            </h2>
            
            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-green-200 bg-green-50 p-5">
                <h3 className="flex items-center gap-2 font-semibold text-green-900">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Wahrnehmbarkeit
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-green-800">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Ausreichende Farbkontraste (mindestens 4.5:1)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Skalierbare Schriftgrössen ohne Funktionsverlust bis 200%</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Keine ausschliessliche Informationsvermittlung durch Farbe</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Strukturierte HTML-Semantik (Überschriften, Listen, Landmarks)</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-green-200 bg-green-50 p-5">
                <h3 className="flex items-center gap-2 font-semibold text-green-900">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Bedienbarkeit
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-green-800">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Vollständige Tastatur-Navigation möglich</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Sichtbarer Fokus-Indikator bei Tastaturnavigation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Aussagekräftige Linktexte (keine "Hier klicken")</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Konsistente Navigation über alle Seiten</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-green-200 bg-green-50 p-5">
                <h3 className="flex items-center gap-2 font-semibold text-green-900">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Verständlichkeit
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-green-800">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Klare, verständliche Sprache ohne unnötiges Fachvokabular</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Logische, vorhersehbare Seitenstruktur</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Hilfestellungen und Fehlermeldungen in verständlicher Sprache</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Korrektes HTML-Lang-Attribut (de)</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Bekannte Einschränkungen */}
          <section>
            <h2 className="text-2xl font-semibold text-zinc-900">
              Bekannte Einschränkungen und geplante Verbesserungen
            </h2>
            
            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-orange-200 bg-orange-50 p-5">
                <h3 className="flex items-center gap-2 font-semibold text-orange-900">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  Screenreader-Unterstützung
                </h3>
                <div className="mt-3 space-y-2 text-sm text-orange-800">
                  <p>
                    <strong>Aktueller Stand:</strong> Die Plattform ist grundsätzlich mit 
                    Screenreadern nutzbar, aber noch nicht optimal.
                  </p>
                  <p>
                    <strong>Geplant:</strong> Verbesserte ARIA-Labels, aussagekräftigere 
                    Alt-Texte für Grafiken, optimierte Ankündigungen bei dynamischen Inhalten.
                  </p>
                  <p className="text-xs">
                    <strong>Zeitplan:</strong> Q2 2026
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-orange-200 bg-orange-50 p-5">
                <h3 className="flex items-center gap-2 font-semibold text-orange-900">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  Interaktive KI-Chat-Elemente
                </h3>
                <div className="mt-3 space-y-2 text-sm text-orange-800">
                  <p>
                    <strong>Aktueller Stand:</strong> Der Profil-Chat ist über Tastatur bedienbar, 
                    aber Screenreader-Nutzer erhalten nicht immer zeitnahe Rückmeldungen zu 
                    KI-Antworten.
                  </p>
                  <p>
                    <strong>Geplant:</strong> Live-Region-Ankündigungen für Chat-Antworten, 
                    verbesserte Fokus-Steuerung.
                  </p>
                  <p className="text-xs">
                    <strong>Zeitplan:</strong> Q2 2026
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-orange-200 bg-orange-50 p-5">
                <h3 className="flex items-center gap-2 font-semibold text-orange-900">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  Leichte Sprache / Einfache Sprache
                </h3>
                <div className="mt-3 space-y-2 text-sm text-orange-800">
                  <p>
                    <strong>Aktueller Stand:</strong> Die Plattform verwendet verständliche Sprache, 
                    aber noch keine Version in Leichter Sprache.
                  </p>
                  <p>
                    <strong>Geplant:</strong> Prüfung der Machbarkeit für ausgewählte Kerninhalte.
                  </p>
                  <p className="text-xs">
                    <strong>Zeitplan:</strong> Noch offen
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Feedback */}
          <section>
            <h2 className="text-2xl font-semibold text-zinc-900">
              Feedback und Kontaktmöglichkeit
            </h2>
            <div className="mt-4 space-y-3 text-zinc-700">
              <p>
                Wir sind bestrebt, die Barrierefreiheit dieser Website kontinuierlich zu verbessern. 
                Wenn Sie auf Barrieren stossen oder Verbesserungsvorschläge haben, freuen wir uns 
                über Ihre Rückmeldung.
              </p>
              <div className="mt-4 rounded-xl border-2 border-yellow-400 bg-yellow-50 p-5">
                <p className="font-medium text-zinc-900">Kontakt für Barrierefreiheits-Anliegen:</p>
                <p className="mt-2 text-sm">
                  <strong>E-Mail:</strong>{" "}
                  <a href="mailto:peter.rigert@fhnw.ch" className="text-yellow-600 hover:underline">
                    peter.rigert@fhnw.ch
                  </a>
                </p>
                <p className="mt-2 text-xs text-zinc-600">
                  Bitte beschreiben Sie das Problem möglichst genau und geben Sie an, welche 
                  Seite oder Funktion betroffen ist und welche assistive Technologie Sie verwenden.
                </p>
              </div>
            </div>
          </section>

          {/* Durchsetzungsverfahren */}
          <section>
            <h2 className="text-2xl font-semibold text-zinc-900">Durchsetzungsverfahren</h2>
            <div className="mt-4 space-y-3 text-sm text-zinc-700">
              <p>
                Sollten Sie der Meinung sein, dass Ihr Anliegen zur Barrierefreiheit nicht 
                zufriedenstellend behandelt wurde, können Sie sich an folgende Stellen wenden:
              </p>
              <div className="mt-4 rounded-lg border border-zinc-200 bg-white p-4">
                <p className="font-medium text-zinc-900">
                  Eidgenössisches Büro für die Gleichstellung von Menschen mit Behinderungen (EBGB)
                </p>
                <p className="mt-2">Inselgasse 1, 3003 Bern</p>
                <p>
                  <strong>E-Mail:</strong>{" "}
                  <a href="mailto:ebgb@gs-edi.admin.ch" className="text-yellow-600 hover:underline">
                    ebgb@gs-edi.admin.ch
                  </a>
                </p>
                <p>
                  <a 
                    href="https://www.edi.admin.ch/ebgb" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-yellow-600 hover:underline"
                  >
                    www.edi.admin.ch/ebgb ↗
                  </a>
                </p>
              </div>
            </div>
          </section>

          {/* Erstellungsdatum */}
          <section className="border-t border-zinc-200 pt-6">
            <p className="text-xs text-zinc-500">
              Diese Erklärung wurde am 14. Januar 2026 erstellt und zuletzt am{" "}
              {new Date().toLocaleDateString("de-CH", { 
                year: "numeric", 
                month: "long", 
                day: "numeric" 
              })} aktualisiert.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

