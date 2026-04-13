"use client";

import Link from "next/link";
import { PollDeadlineBanner } from "@/components/PollDeadlineBanner";
import { PollScheduler } from "@/components/PollScheduler";

export default function MultiplikatorenPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-400">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        <div className="relative px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-800 transition-colors hover:text-zinc-950"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M10 12L6 8l4-4" />
              </svg>
              Zurück zur Startseite
            </Link>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-950 md:text-5xl">
              Multiplikator:innen
            </h1>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-zinc-800">
              Gemeinsam gestalten wir den Rollout der KI-Kompass Weiterbildung
              am BBZ Olten. Danke, dass du als Multiplikator:in mitwirkst!
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="space-y-12">
          {/* --- Section 1: Konzept --- */}
          <section>
            <div className="mb-6 inline-block">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-950">
                Das Konzept
              </h2>
              <div className="mt-2 h-1 w-16 rounded-full bg-yellow-400" />
            </div>
            <div className="rounded-2xl border-2 border-zinc-200 bg-white p-8">
              <p className="text-base leading-relaxed text-zinc-700">
                Im Rahmen der Pilotdurchführung haben sich engagierte
                Lehrpersonen bereit erklärt, beim Rollout der KI-Kompass
                Weiterbildung aktiv mitzuwirken. Als{" "}
                <strong className="text-zinc-900">Multiplikator:innen</strong>{" "}
                bildet ihr die Brücke zwischen dem Projektteam und euren
                Kolleg:innen am BBZ Olten.
              </p>
              <p className="mt-4 text-base leading-relaxed text-zinc-700">
                Zur Vorbereitung auf diese Rolle findet ein{" "}
                <strong className="text-zinc-900">
                  halbtägiger Weiterbildungskurs
                </strong>{" "}
                statt. Dort werden die Inhalte, Materialien und der geplante
                Ablauf der Weiterbildungstage gemeinsam besprochen, damit ihr
                optimal vorbereitet seid.
              </p>
            </div>
          </section>

          {/* --- Section 2: Rollen --- */}
          <section>
            <div className="mb-6 inline-block">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-950">
                Eure Rolle
              </h2>
              <div className="mt-2 h-1 w-16 rounded-full bg-yellow-400" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Rolle 1 */}
              <div className="group rounded-2xl border-2 border-zinc-200 bg-white p-6 transition-all hover:border-yellow-400 hover:shadow-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600 transition-all group-hover:bg-yellow-400 group-hover:text-white">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-zinc-950">
                  Workshop-Unterstützung
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  Während den Weiterbildungstagen seid ihr als
                  Ansprechpartner:innen vor Ort und unterstützt die Dozierenden
                  bei der Durchführung der Workshops. Ihr helft bei technischen
                  Fragen und begleitet Kleingruppen.
                </p>
              </div>

              {/* Rolle 2 */}
              <div className="group rounded-2xl border-2 border-zinc-200 bg-white p-6 transition-all hover:border-yellow-400 hover:shadow-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600 transition-all group-hover:bg-yellow-400 group-hover:text-white">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-zinc-950">
                  Community of Practice
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  Im zweiten Teil der Weiterbildung (Sommer) leitet ihr
                  selbstständig die Auswertung und den Community of Practice
                  Austausch. So bringt ihr eure eigene Praxiserfahrung direkt
                  ein.
                </p>
              </div>

              {/* Rolle 3 */}
              <div className="group rounded-2xl border-2 border-zinc-200 bg-white p-6 transition-all hover:border-yellow-400 hover:shadow-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600 transition-all group-hover:bg-yellow-400 group-hover:text-white">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-zinc-950">
                  Peer-Expertise
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  Als Kolleg:innen, die den Kurs bereits kennen, seid ihr
                  authentische Ansprechpersonen. Eure Erfahrung aus dem Pilot
                  macht euch zu glaubwürdigen Begleiter:innen.
                </p>
              </div>

              {/* Rolle 4 */}
              <div className="group rounded-2xl border-2 border-zinc-200 bg-white p-6 transition-all hover:border-yellow-400 hover:shadow-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600 transition-all group-hover:bg-yellow-400 group-hover:text-white">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-zinc-950">
                  Halbtägige Vorbereitung
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  Der Vorbereitungskurs umfasst einen Halbtag und bereitet euch
                  gezielt auf die Weiterbildungstage vor: Ablauf, Materialien,
                  Moderationstipps und offene Fragen.
                </p>
              </div>
            </div>
          </section>

          {/* --- Section 3: Programm & Ort --- */}
          <section>
            <div className="mb-6 inline-block">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-950">
                Programm &amp; Ort
              </h2>
              <div className="mt-2 h-1 w-16 rounded-full bg-yellow-400" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Programm */}
              <div className="rounded-2xl border-2 border-zinc-200 bg-white p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-950">
                    Programm
                  </h3>
                </div>
                <p className="mb-4 text-sm font-medium text-zinc-500">
                  Dauer: 3 Stunden (je nach Termin Nachmittag oder Abend)
                </p>
                <ol className="space-y-3">
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 text-xs font-bold text-yellow-700">
                      1
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">
                        KI Update
                      </p>
                      <p className="text-sm text-zinc-600">
                        Neuste Entwicklungen, Hot-Topics und Diskussion
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 text-xs font-bold text-yellow-700">
                      2
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">
                        Erkenntnisse erster Weiterbildungstag
                      </p>
                      <p className="text-sm text-zinc-600">
                        Rückblick und Lessons Learned vom ersten Weiterbildungstag
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 text-xs font-bold text-yellow-700">
                      3
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">
                        Deep-Dive zweiter Weiterbildungstag
                      </p>
                      <p className="text-sm text-zinc-600">
                        Vorbereitung auf den nächsten Workshop-Block
                      </p>
                    </div>
                  </li>
                </ol>
              </div>

              {/* Ort */}
              <div className="rounded-2xl border-2 border-zinc-200 bg-white p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-950">Ort</h3>
                </div>
                <div className="rounded-xl bg-zinc-50 p-4">
                  <p className="text-base font-semibold text-zinc-900">
                    FHNW Campus Olten
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">
                    Genauer Raum wird mit der Terminbestätigung kommuniziert.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* --- Section 4: Terminfindung --- */}
          <section>
            <div className="mb-6 inline-block">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-950">
                Terminfindung
              </h2>
              <div className="mt-2 h-1 w-16 rounded-full bg-yellow-400" />
            </div>
            <p className="mb-6 text-base text-zinc-600">
              Bitte trag deine Verfügbarkeit für die vorgeschlagenen Termine
              ein, damit wir den besten Termin für den Vorbereitungskurs finden.
            </p>

            <PollDeadlineBanner />

            <PollScheduler />
          </section>

          {/* --- Section 4: Ressourcen-Bibliothek --- */}
          <section>
            <div className="mb-6 inline-block">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-950">
                Ressourcen-Bibliothek
              </h2>
              <div className="mt-2 h-1 w-16 rounded-full bg-yellow-400" />
            </div>

            <div className="rounded-2xl border-2 border-dashed border-zinc-300 bg-white p-10 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-zinc-700">
                Unterlagen folgen
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
                Die Materialien für den Vorbereitungskurs und die
                Weiterbildungstage werden hier bereitgestellt, sobald sie
                finalisiert sind. Geplante Inhalte:
              </p>
              <div className="mx-auto mt-6 grid max-w-lg gap-3 text-left sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg bg-zinc-50 px-4 py-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-zinc-200 text-zinc-500">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <span className="text-sm text-zinc-600">
                    Ablaufplan Weiterbildungstage
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-zinc-50 px-4 py-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-zinc-200 text-zinc-500">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <span className="text-sm text-zinc-600">
                    Workshop-Materialien
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-zinc-50 px-4 py-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-zinc-200 text-zinc-500">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <span className="text-sm text-zinc-600">
                    Moderationsleitfaden
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-zinc-50 px-4 py-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-zinc-200 text-zinc-500">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <span className="text-sm text-zinc-600">
                    CoP-Gesprächsleitfaden
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Kontakt-Hinweis */}
          <section className="rounded-xl bg-zinc-100 p-6 text-center">
            <p className="text-sm text-zinc-600">
              Fragen zum Multiplikatoren-Programm? Melde dich bei{" "}
              <a
                href="mailto:peter.rigert@fhnw.ch"
                className="font-medium text-yellow-600 hover:underline"
              >
                peter.rigert@fhnw.ch
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
