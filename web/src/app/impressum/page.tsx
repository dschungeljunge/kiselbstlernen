/**
 * Impressum-Seite
 * Erfüllt rechtliche Anforderungen für öffentliche Websites (Anbieterkennzeichnung)
 */

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum | KI-Kompass",
  description: "Impressum und Anbieterkennzeichnung der KI-Kompass Weiterbildungsplattform",
};

export default function ImpressumPage() {
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
        <h1 className="text-4xl font-bold tracking-tight text-zinc-950">Impressum</h1>
        <p className="mt-2 text-lg text-zinc-600">Angaben gemäss Schweizer Recht</p>

        <div className="mt-10 space-y-10">
          {/* Wichtiger Hinweis */}
          <section className="rounded-xl border-2 border-yellow-400 bg-yellow-50 p-6">
            <h2 className="text-lg font-semibold text-zinc-900">
              Hinweis zum Status dieser Plattform
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-700">
              Bei dieser Website handelt es sich um einen <strong>Prototyp</strong> im Rahmen der 
              Entwicklung einer Online-Weiterbildungsplattform. Die Plattform befindet sich in 
              der Testphase und ist noch nicht institutionell freigegeben.
            </p>
          </section>

          {/* Verantwortlich für den Inhalt */}
          <section>
            <h2 className="text-2xl font-semibold text-zinc-900">Verantwortlich für den Inhalt</h2>
            <div className="mt-4 text-zinc-700">
              <p className="font-medium text-lg">Peter Rigert</p>
              <p className="mt-3">
                <strong>E-Mail:</strong>{" "}
                <a href="mailto:peter.rigert@fhnw.ch" className="text-yellow-600 hover:underline">
                  peter.rigert@fhnw.ch
                </a>
              </p>
            </div>
          </section>

          {/* Haftungsausschluss */}
          <section>
            <h2 className="text-2xl font-semibold text-zinc-900">Haftungsausschluss</h2>
            <div className="mt-4 space-y-2 text-sm text-zinc-700">
              <p>
                Der Autor bemüht sich, korrekte und aktuelle Informationen auf dieser Website 
                bereitzustellen. Dennoch können Fehler oder Unklarheiten nicht vollständig 
                ausgeschlossen werden. Es wird keine Haftung für die Richtigkeit, Genauigkeit, 
                Aktualität, Zuverlässigkeit und Vollständigkeit der Informationen übernommen.
              </p>
              <p>
                Haftungsansprüche wegen Schäden materieller oder immaterieller Art, die aus dem 
                Zugriff oder der Nutzung bzw. Nichtnutzung der veröffentlichten Informationen, 
                durch Missbrauch der Verbindung oder durch technische Störungen entstanden sind, 
                werden ausgeschlossen.
              </p>
            </div>
          </section>

          {/* Externe Links */}
          <section>
            <h2 className="text-2xl font-semibold text-zinc-900">Verweise und Links</h2>
            <div className="mt-4 text-sm text-zinc-700">
              <p>
                Diese Website kann Verweise (Links) auf Websites Dritter enthalten. Es wird 
                ausdrücklich erklärt, dass kein Einfluss auf die Gestaltung und die Inhalte 
                der verlinkten Seiten besteht. Es wird sich von allen Inhalten aller verlinkten 
                Seiten Dritter distanziert und diese Inhalte werden nicht zu eigen gemacht.
              </p>
            </div>
          </section>

          {/* Urheberrecht */}
          <section>
            <h2 className="text-2xl font-semibold text-zinc-900">Urheberrecht</h2>
            <div className="mt-4 text-sm text-zinc-700">
              <p>
                Alle Inhalte dieser Website sind urheberrechtlich geschützt. Für die Reproduktion 
                jeglicher Elemente ist die schriftliche Zustimmung des Autors im Voraus einzuholen.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

