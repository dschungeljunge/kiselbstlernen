import Link from "next/link";
import { WORKSHOP2_STEPS } from "@/lib/workshop2";

export default function Workshop2Page() {
  const totalMinutes = WORKSHOP2_STEPS.reduce((sum, step) => sum + step.durationMinutes, 0);

  return (
    <>
      <div className="relative overflow-hidden bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-400">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        <div className="relative px-6 py-14">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-950 md:text-5xl">
              Workshop 2
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-800 md:text-lg">
              Du erstellst eine konkrete KI-Lernaufgabe für deine Lernenden. Anders als in
              Workshop 1 gibst du eine klare Aufgabenstruktur vor und steuerst den Lernprozess
              durch gezielte Prompt-Instruktionen.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/75 p-4 shadow-sm ring-1 ring-white/50">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-600">
                  Umfang
                </p>
                <p className="mt-1 text-sm font-semibold text-zinc-950">
                  {WORKSHOP2_STEPS.length} Phasen, ca. {totalMinutes} Minuten
                </p>
              </div>
              <div className="rounded-2xl bg-white/75 p-4 shadow-sm ring-1 ring-white/50">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-600">
                  Arbeitsweise
                </p>
                <p className="mt-1 text-sm font-semibold text-zinc-950">
                  Beispiele testen, Kontext ergänzen, Aufgabe schärfen
                </p>
              </div>
              <div className="rounded-2xl bg-white/75 p-4 shadow-sm ring-1 ring-white/50">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-600">
                  Ergebnis
                </p>
                <p className="mt-1 text-sm font-semibold text-zinc-950">
                  Eine einsatzbereite KI-Lernaufgabe für den Unterricht
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-zinc-50 px-6">
        <main className="mx-auto w-full max-w-4xl pb-20 pt-12">
          <section className="rounded-2xl border border-yellow-300 bg-gradient-to-br from-yellow-50 to-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-yellow-700">Ziel</p>
            <h2 className="mt-2 text-xl font-bold text-zinc-950">
              Eine konkrete KI-Lernaufgabe entwickeln
            </h2>
            <p className="mt-3 text-base leading-7 text-zinc-700">
              Eine instruierte KI-Lernaufgabe erstellen, die Lernende durch einen konkreten
              Prozess führt und direkt im Unterricht eingesetzt werden kann.
            </p>
          </section>

          <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Ablauf
                </p>
                <h3 className="mt-1 text-lg font-semibold text-zinc-950">
                  In drei Phasen zur fertigen Lernaufgabe
                </h3>
              </div>
              <p className="text-sm text-zinc-500">
                Empfohlene Gesamtdauer: ca. {totalMinutes} Minuten
              </p>
            </div>
            <ol className="mt-5 grid gap-3">
              {WORKSHOP2_STEPS.map((step) => (
                <li
                  key={step.step}
                  className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700"
                >
                  <p className="font-semibold text-zinc-950">
                    {step.step}. {step.title}
                  </p>
                  <p className="mt-1 text-zinc-500">{step.durationMinutes} Minuten</p>
                </li>
              ))}
            </ol>
          </section>

          <div className="mt-8 flex justify-end">
            <Link
              href="/ws2/1"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-950 px-8 text-sm font-semibold text-white hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-200"
            >
              Workshop starten →
            </Link>
          </div>

          <div className="mt-8 rounded-lg bg-zinc-100 p-5 text-center">
            <p className="text-sm text-zinc-600">
              <Link href="/" className="font-medium text-zinc-800 hover:underline">
                ← Zur Startseite
              </Link>
            </p>
          </div>
        </main>
      </div>
    </>
  );
}

