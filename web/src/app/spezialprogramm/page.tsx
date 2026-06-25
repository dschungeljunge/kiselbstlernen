import type { Metadata } from "next";
import Link from "next/link";
import {
  SPECIAL_PROGRAM_OVERVIEW_VIDEO,
  SPECIAL_PROGRAM_UMFANG,
  SPEZIALPROGRAMM_TEILE,
  getLoomEmbedUrl,
} from "@/lib/spezialprogramm";

export const metadata: Metadata = {
  title: "KI@BBZ Olten Spezialprogramm | KI-Kompass",
  description:
    "Nachholprogramm für Lehrpersonen des BBZ Olten, die Workshops verpasst haben oder neu starten.",
};

export default function SpezialprogrammPage() {
  return (
    <>
      <div className="relative overflow-hidden bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-400">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        <div className="relative px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-zinc-800">
              Nachholen und einsteigen
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight text-zinc-950 md:text-5xl">
              KI@BBZ Olten Spezialprogramm
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-800 md:text-lg">
              Diese Unterseite ist für Lehrpersonen gedacht, die die Workshops vor Ort
              verpasst haben oder erst im Sommer am BBZ Olten starten. Du findest hier
              die wichtigsten Inhalte in vier kompakten Teilen.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/75 p-4 shadow-sm ring-1 ring-white/50">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-600">
                  Umfang
                </p>
                <p className="mt-1 text-sm font-semibold text-zinc-950">
                  {SPECIAL_PROGRAM_UMFANG}
                </p>
              </div>
              <div className="rounded-2xl bg-white/75 p-4 shadow-sm ring-1 ring-white/50">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-600">
                  Arbeitsweise
                </p>
                <p className="mt-1 text-sm font-semibold text-zinc-950">
                  Videos, Selbstlernen, Transferauftrag
                </p>
              </div>
              <div className="rounded-2xl bg-white/75 p-4 shadow-sm ring-1 ring-white/50">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-600">
                  Ziel
                </p>
                <p className="mt-1 text-sm font-semibold text-zinc-950">
                  Bereit für die Weiterbildungstage im Sommer
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-zinc-50 px-6">
        <main className="mx-auto w-full max-w-5xl pb-20 pt-12">
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm md:p-6">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 shadow-sm">
                <div className="aspect-video">
                  <iframe
                    src={getLoomEmbedUrl(SPECIAL_PROGRAM_OVERVIEW_VIDEO.loomId)}
                    title={SPECIAL_PROGRAM_OVERVIEW_VIDEO.title}
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-yellow-700">
                  Start
                </p>
                <h2 className="mt-2 text-2xl font-bold text-zinc-950">
                  {SPECIAL_PROGRAM_OVERVIEW_VIDEO.title}
                </h2>
                <p className="mt-3 text-base leading-7 text-zinc-700">
                  {SPECIAL_PROGRAM_OVERVIEW_VIDEO.description}
                </p>
                <p className="mt-4 rounded-xl bg-yellow-50 p-4 text-sm leading-6 text-zinc-700">
                  Empfehlung: Schau zuerst dieses kurze Video und arbeite danach die Teile
                  der Reihe nach durch. Wenn du schon Vorwissen mitbringst, kannst du direkt
                  zu dem Teil springen, der für dich relevant ist.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-10">
            <div className="mb-6 inline-block">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-950">
                Die vier Teile
              </h2>
              <div className="mt-2 h-1 w-20 rounded-full bg-yellow-400" />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {SPEZIALPROGRAMM_TEILE.map((teil) => (
                <Link
                  key={teil.slug}
                  href={teil.href}
                  className="group flex h-full flex-col rounded-2xl border-2 border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-yellow-400 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-yellow-100"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-yellow-100 text-lg font-bold text-yellow-700 transition-all group-hover:bg-yellow-400 group-hover:text-zinc-950">
                      {teil.number}
                    </div>
                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600">
                      {teil.duration}
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-zinc-950">
                    Teil {teil.number}: {teil.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-zinc-600">
                    {teil.intro}
                  </p>
                  <span className="mt-5 text-sm font-semibold text-zinc-950">
                    Teil öffnen &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-10 rounded-2xl border border-yellow-300 bg-gradient-to-br from-yellow-50 to-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-yellow-700">
              Transferauftrag
            </p>
            <h2 className="mt-2 text-xl font-bold text-zinc-950">
              Nimm ein konkretes Ergebnis mit
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-700">
              Am Ende des Spezialprogramms solltest du eine konkrete Unterrichtsidee,
              einen ersten Prompt oder eine einsatzbereite KI-Lernaufgabe festhalten.
              Nimm dieses Ergebnis an die Weiterbildungstage im Sommer mit, damit du
              dort direkt daran weiterarbeiten und es im Team teilen kannst.
            </p>
          </section>

          <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Fragen
                </p>
                <h2 className="mt-1 text-lg font-semibold text-zinc-950">
                  Brauchst du Unterstützung?
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Bei inhaltlichen oder technischen Fragen findest du die Kontaktmöglichkeit
                  auf der Kontaktseite.
                </p>
              </div>
              <Link
                href="/kontakt"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-950 px-6 text-sm font-semibold text-white hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-200"
              >
                Kontakt aufnehmen
              </Link>
            </div>
          </section>

          <div className="mt-8 rounded-lg bg-zinc-100 p-5 text-center">
            <p className="text-sm text-zinc-600">
              <Link href="/" className="font-medium text-zinc-800 hover:underline">
                Zur Startseite
              </Link>
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
