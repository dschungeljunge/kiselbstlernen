/**
 * Datenschutzerklärung
 * Informiert transparent über Datenverarbeitung gemäss DSGVO und Schweizer DSG
 */

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung | KI-Kompass",
  description: "Datenschutzerklärung der KI-Kompass Weiterbildungsplattform",
};

export default async function DatenschutzPage(
  props: PageProps<"/datenschutz">,
) {
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
        <h1 className="text-4xl font-bold tracking-tight text-zinc-950">Datenschutzerklärung</h1>
        <p className="mt-2 text-lg text-zinc-600">
          Informationen zur Datenverarbeitung auf der KI-Kompass Plattform
        </p>
        <p className="mt-1 text-sm text-zinc-500">
          Stand: {new Date().toLocaleDateString("de-CH", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="mt-10 space-y-10">
          {/* Grundsatz */}
          <section className="rounded-xl border-2 border-green-400 bg-green-50 p-6">
            <h2 className="text-xl font-semibold text-green-900">
              Privacy by Design: Maximaler Datenschutz
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-green-800">
              Die KI-Kompass Plattform wurde nach dem Grundsatz <strong>„Privacy by Design"</strong> entwickelt. 
              Ihr Lernfortschritt wird <strong>ausschliesslich über einen anonymen Code</strong> gespeichert. 
              Es werden <strong>keine personenbezogenen Daten</strong> wie Name, E-Mail-Adresse oder 
              Identifikationsnummern erfasst. Es gibt kein Monitoring durch Arbeitgeber oder Institutionen.
            </p>
          </section>

          {/* Welche Daten werden erfasst */}
          <section>
            <h2 className="text-2xl font-semibold text-zinc-900">Welche Daten werden erfasst?</h2>
            
            <div className="mt-6 space-y-6">
              {/* Lernfortschritt */}
              <div>
                <h3 className="text-lg font-medium text-zinc-900">1. Lernfortschritt (anonymisiert)</h3>
                <div className="mt-2 space-y-2 text-sm text-zinc-700">
                  <p><strong>Was wird gespeichert:</strong></p>
                  <ul className="ml-6 list-disc space-y-1">
                    <li>Ihr aktueller Lernfortschritt (welche Schritte Sie absolviert haben)</li>
                    <li>Ihre Antworten in den interaktiven Übungen</li>
                    <li>Zeitstempel Ihrer Aktivitäten</li>
                    <li>Ihr gewähltes Lern-Persona-Profil</li>
                  </ul>
                  <p className="mt-3"><strong>Wie wird es gespeichert:</strong></p>
                  <p>
                    Alle Daten werden ausschliesslich über einen <strong>anonymen 7-stelligen Code</strong> 
                    (z.B. "AB7-XYZ") verknüpft. Dieser Code wird zufällig generiert und enthält keinerlei 
                    Rückschlüsse auf Ihre Identität.
                  </p>
                  <p className="mt-3"><strong>Zweck:</strong></p>
                  <p>
                    Ermöglicht es Ihnen, die Weiterbildung über mehrere Sitzungen hinweg fortzusetzen, 
                    ohne Fortschritt zu verlieren.
                  </p>
                  <p className="mt-3"><strong>Speicherdauer:</strong></p>
                  <p>
                    Die Daten bleiben gespeichert, solange Sie Ihren Session-Code verwenden. 
                    Sie können jederzeit die Löschung Ihrer Daten beantragen (siehe "Ihre Rechte" weiter unten).
                  </p>
                </div>
              </div>

              {/* KI-Interaktionen */}
              <div>
                <h3 className="text-lg font-medium text-zinc-900">2. KI-Interaktionen</h3>
                <div className="mt-2 space-y-2 text-sm text-zinc-700">
                  <p><strong>Was wird verarbeitet:</strong></p>
                  <ul className="ml-6 list-disc space-y-1">
                    <li>Ihre Eingaben im Profil-Chat (zur Erstellung Ihres Lern-Profils)</li>
                    <li>Kommunikation erfolgt über OpenAI API</li>
                  </ul>
                  <p className="mt-3"><strong>Wichtig:</strong></p>
                  <p>
                    Ihre Eingaben werden an OpenAI übermittelt, um KI-gestützte Antworten zu generieren. 
                    OpenAI verwendet diese Daten gemäss deren Datenschutzrichtlinien. Wir empfehlen, 
                    <strong> keine persönlichen oder sensiblen Informationen</strong> in den Chat einzugeben.
                  </p>
                  <p className="mt-3"><strong>Datenschutzrichtlinien von OpenAI:</strong></p>
                  <p>
                    <a 
                      href="https://openai.com/privacy/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-yellow-600 hover:underline"
                    >
                      https://openai.com/privacy/ ↗
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-zinc-900">Cookies und lokale Speicherung</h2>
            <div className="mt-4 space-y-2 text-sm text-zinc-700">
              <p>
                Die Plattform verwendet den <strong>Local Storage</strong> Ihres Browsers, um:
              </p>
              <ul className="ml-6 list-disc space-y-1">
                <li>Ihren Session-Code lokal zu speichern (nur auf Ihrem Gerät)</li>
                <li>Ihren Lernfortschritt zwischen Seitenaufrufen verfügbar zu halten</li>
                <li>Die Funktionalität der Plattform sicherzustellen</li>
              </ul>
              <p className="mt-3">
                Es werden <strong>keine Tracking-Cookies</strong>, Analytics-Tools oder Marketing-Cookies verwendet.
              </p>
            </div>
          </section>

          {/* Weitergabe an Dritte */}
          <section>
            <h2 className="text-2xl font-semibold text-zinc-900">Dienste Dritter</h2>
            <div className="mt-4 space-y-2 text-sm text-zinc-700">
              <p>Diese Plattform nutzt folgende externe Dienste:</p>
              <ul className="ml-6 list-disc space-y-1">
                <li>
                  <strong>OpenAI:</strong> Verarbeitung von KI-Chat-Anfragen 
                  (siehe <a href="https://openai.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-yellow-600 hover:underline">Datenschutzrichtlinien OpenAI ↗</a>)
                </li>
                <li>
                  <strong>Supabase:</strong> Speicherung Ihres anonymisierten Lernfortschritts 
                  (Server-Standort: EU)
                </li>
                <li>
                  <strong>Vercel:</strong> Hosting der Website (Server-Standort: EU)
                </li>
              </ul>
              <p className="mt-3">
                <strong>Wichtig:</strong> Es erfolgt keine Weitergabe Ihrer Daten an Ihren Arbeitgeber, 
                Bildungsinstitutionen oder andere Organisationen. Ihr Session-Code bleibt nur Ihnen bekannt.
              </p>
            </div>
          </section>

          {/* Ihre Rechte */}
          <section>
            <h2 className="text-2xl font-semibold text-zinc-900">Ihre Rechte</h2>
            <div className="mt-4 space-y-2 text-sm text-zinc-700">
              <p>Sie haben folgende Rechte bezüglich Ihrer Daten:</p>
              <ul className="ml-6 list-disc space-y-1">
                <li>
                  <strong>Recht auf Auskunft:</strong> Sie können Auskunft über die zu Ihrem Session-Code 
                  gespeicherten Daten verlangen
                </li>
                <li>
                  <strong>Recht auf Löschung:</strong> Sie können jederzeit die Löschung Ihrer 
                  Daten verlangen (kontaktieren Sie uns mit Ihrem Session-Code)
                </li>
                <li>
                  <strong>Recht auf Datenübertragbarkeit:</strong> Sie können eine Kopie Ihrer 
                  Daten anfordern
                </li>
              </ul>
              <p className="mt-3">
                <strong>Kontakt für Datenschutzanfragen:</strong>{" "}
                <a href="mailto:peter.rigert@fhnw.ch" className="text-yellow-600 hover:underline">
                  peter.rigert@fhnw.ch
                </a>
              </p>
              <p className="mt-2 text-xs text-zinc-600">
                Bitte geben Sie bei Anfragen Ihren Session-Code an, damit wir Ihre Daten identifizieren können.
              </p>
            </div>
          </section>

          {/* Datensicherheit */}
          <section>
            <h2 className="text-2xl font-semibold text-zinc-900">Datensicherheit</h2>
            <div className="mt-4 space-y-2 text-sm text-zinc-700">
              <p>
                Wir setzen technische Sicherheitsmassnahmen ein, um Ihre Daten zu schützen:
              </p>
              <ul className="ml-6 list-disc space-y-1">
                <li>HTTPS-Verschlüsselung für alle Datenübertragungen</li>
                <li>Anonymisierung durch Session-Codes ohne Personenbezug</li>
                <li>Sichere Datenbankverbindungen über Supabase</li>
              </ul>
              <p className="mt-3 text-xs text-zinc-600">
                <strong>Hinweis:</strong> Dies ist ein Prototyp. Die Plattform wird kontinuierlich 
                weiterentwickelt und verbessert.
              </p>
            </div>
          </section>

          {/* Änderungen */}
          <section>
            <h2 className="text-2xl font-semibold text-zinc-900">
              Änderungen dieser Datenschutzerklärung
            </h2>
            <div className="mt-4 text-sm text-zinc-700">
              <p>
                Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an geänderte 
                Rechtslagen oder Änderungen unserer Dienstleistungen anzupassen. Bei wesentlichen 
                Änderungen werden Sie auf der Startseite informiert.
              </p>
            </div>
          </section>

          {/* Aufsichtsbehörde */}
          <section>
            <h2 className="text-2xl font-semibold text-zinc-900">Aufsichtsbehörde</h2>
            <div className="mt-4 space-y-2 text-sm text-zinc-700">
              <p>
                Bei Fragen oder Beschwerden zum Datenschutz können Sie sich an die zuständige 
                Aufsichtsbehörde wenden:
              </p>
              <div className="mt-3">
                <p className="font-medium">
                  Eidgenössischer Datenschutz- und Öffentlichkeitsbeauftragter (EDÖB)
                </p>
                <p>Feldeggweg 1, 3003 Bern, Schweiz</p>
                <p>
                  <a 
                    href="https://www.edoeb.admin.ch" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-yellow-600 hover:underline"
                  >
                    www.edoeb.admin.ch ↗
                  </a>
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

