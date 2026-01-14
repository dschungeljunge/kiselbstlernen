/**
 * Footer-Komponente für die gesamte Website
 * Kompaktes Design mit allen rechtlich notwendigen Links
 */

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Hauptbereich */}
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Linke Seite: Institutionelle Zuordnung */}
          <div className="text-center md:text-left">
            <p className="text-sm text-zinc-600">
              <strong className="text-zinc-900">KI-Kompass</strong> – Eine Weiterbildung für Lehrpersonen des BBZ Olten
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Entwickelt und begleitet durch die Pädagogische Hochschule FHNW
            </p>
          </div>

          {/* Rechte Seite: Navigation */}
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
            <Link
              href="/didaktischer-kommentar"
              className="text-zinc-600 transition-colors hover:text-zinc-900 hover:underline"
            >
              Didaktischer Kommentar
            </Link>
            <span className="text-zinc-300">•</span>
            <Link
              href="/kontakt"
              className="text-zinc-600 transition-colors hover:text-zinc-900 hover:underline"
            >
              Kontakt
            </Link>
            <span className="text-zinc-300">•</span>
            <Link
              href="/impressum"
              className="text-zinc-600 transition-colors hover:text-zinc-900 hover:underline"
            >
              Impressum
            </Link>
            <span className="text-zinc-300">•</span>
            <Link
              href="/datenschutz"
              className="text-zinc-600 transition-colors hover:text-zinc-900 hover:underline"
            >
              Datenschutz
            </Link>
            <span className="text-zinc-300">•</span>
            <Link
              href="/barrierefreiheit"
              className="text-zinc-600 transition-colors hover:text-zinc-900 hover:underline"
            >
              Barrierefreiheit
            </Link>
          </nav>
        </div>

        {/* Copyright-Zeile mit Prototyp-Hinweis */}
        <div className="mt-6 border-t border-zinc-100 pt-6">
          <div className="flex flex-col items-center justify-center gap-2 text-center md:flex-row md:gap-3">
            <p className="text-xs text-zinc-500">
              © {new Date().getFullYear()} Pädagogische Hochschule der Fachhochschule Nordwestschweiz (PH FHNW). 
              Alle Rechte vorbehalten.
            </p>
            <span className="hidden text-zinc-300 md:inline">•</span>
            <span className="text-xs text-zinc-500">
              Prototyp v1.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
