"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useReflexion } from "@/contexts/ReflexionContext";
import { STRATEGIES, getStrategy } from "@/lib/reflexion-strategies";
import { InteractiveAnswerSummary } from "@/components/reflexion/InteractiveAnswerSummary";

function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="14" height="14" viewBox="0 0 24 24"
          fill={s <= value ? "#eab308" : "none"}
          stroke={s <= value ? "#eab308" : "#d1d5db"}
          strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function HubPage() {
  const { profile, situation, strategies } = useReflexion();

  const [gesamtKommentar, setGesamtKommentar] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [kommentarDone, setKommentarDone] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const completedCodes = STRATEGIES.map((s) => s.code).filter(
    (c) => strategies[c]?.abgeschlossen
  );
  const openCodes = STRATEGIES.map((s) => s.code).filter(
    (c) => !strategies[c]?.abgeschlossen
  );

  const generateKommentar = useCallback(async () => {
    setIsGenerating(true);
    try {
      const summaries = completedCodes.map((code) => {
        const s = getStrategy(code);
        const d = strategies[code];
        return `${s?.title}: ${d.selbsteinschaetzung}/5 Sterne.`;
      });
      const res = await fetch("/api/reflection/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          strategie: "gesamt",
          messages: [{ role: "user", content: `Berufsschullehrperson hat reflektiert:\n${summaries.join("\n")}\n\nKurzer motivierender Gesamtkommentar (4 Sätze, Du-Form, keine Emojis).` }],
          profile,
          situationSummary: situation?.kiZusammenfassung || "",
        }),
      });
      const data = await res.json();
      setGesamtKommentar(data.message ?? "");
      setKommentarDone(true);
    } catch {
      setGesamtKommentar("Kommentar konnte nicht erstellt werden.");
      setKommentarDone(true);
    } finally {
      setIsGenerating(false);
    }
  }, [completedCodes, strategies, profile, situation]);

  return (
    <>
      {/* Hero – gelbes Banner wie Startseite */}
      <div className="relative overflow-hidden bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-400">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

        <div className="relative px-6 py-14">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-950 md:text-5xl">
              Mein Reflexionsraum
            </h1>
            {profile && (
              <p className="mt-1 text-lg font-semibold text-zinc-800">
                {profile.name}
              </p>
            )}

            {/* Situation */}
            {situation ? (
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-800">
                {situation.kiZusammenfassung || situation.text}
              </p>
            ) : (
              <p className="mt-4 text-base text-zinc-700">
                Noch keine Situation beschrieben.{" "}
                <Link href="/reflexion/situation" className="font-semibold underline">
                  Jetzt beschreiben →
                </Link>
              </p>
            )}

            {/* Fortschritts-Stats */}
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="rounded-xl bg-white/80 px-5 py-3 backdrop-blur">
                <div className="text-3xl font-bold text-zinc-950">
                  {completedCodes.length}
                  <span className="text-lg font-normal text-zinc-500">/5</span>
                </div>
                <div className="mt-0.5 text-sm font-medium text-zinc-700">
                  Reflexionen
                </div>
              </div>

              {completedCodes.length > 0 && (
                <div className="rounded-xl bg-white/80 px-5 py-3 backdrop-blur">
                  <div className="text-3xl font-bold text-zinc-950">
                    {(completedCodes.reduce(
                      (sum, c) => sum + (strategies[c]?.selbsteinschaetzung ?? 0), 0
                    ) / completedCodes.length).toFixed(1)}
                    <span className="text-lg font-normal text-zinc-500">/5</span>
                  </div>
                  <div className="mt-0.5 text-sm font-medium text-zinc-700">
                    Ø Einschätzung
                  </div>
                </div>
              )}

              {/* Fortschrittsstriche */}
              <div className="flex items-end gap-1.5 rounded-xl bg-white/80 px-5 py-3 backdrop-blur">
                {STRATEGIES.map((s) => {
                  const done = strategies[s.code]?.abgeschlossen;
                  return (
                    <div key={s.code} className="flex flex-col items-center gap-1">
                      <div className={`w-6 rounded-sm ${done ? "h-6 bg-zinc-950" : "h-3 bg-zinc-300"}`} />
                      <span className="text-xs font-bold text-zinc-500">{s.letter}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Aktionen */}
            <div className="mt-6 flex flex-wrap gap-3">
              {situation && (
                <Link href="/reflexion/situation"
                  className="inline-flex h-10 items-center gap-1.5 rounded-xl border-2 border-zinc-900/20 bg-white/60 px-4 text-sm font-semibold text-zinc-800 backdrop-blur transition hover:bg-white">
                  Situation bearbeiten
                </Link>
              )}
              <button onClick={() => window.print()}
                className="inline-flex h-10 items-center gap-1.5 rounded-xl border-2 border-zinc-900/20 bg-white/60 px-4 text-sm font-semibold text-zinc-800 backdrop-blur transition hover:bg-white">
                Exportieren
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hauptinhalt */}
      <div className="min-h-screen bg-zinc-50 px-6">
        <main className="mx-auto w-full max-w-4xl pb-20 pt-14">

          {/* Abgeschlossene Reflexionen */}
          {completedCodes.length > 0 && (
            <section className="mb-14">
              <div className="mb-6 inline-block">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                  Abgeschlossene Reflexionen
                </h2>
                <div className="mt-2 h-1 w-16 rounded-full bg-yellow-400" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {completedCodes.map((code) => {
                  const s = getStrategy(code);
                  const d = strategies[code];
                  const isOpen = expanded[code] ?? false;
                  if (!s) return null;

                  return (
                    <div key={code}
                      className="rounded-2xl border-2 border-zinc-200 bg-white p-6 transition-all hover:border-yellow-400 hover:shadow-lg">

                      {/* Karten-Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-yellow-100 text-base font-bold text-yellow-700">
                            {s.letter}
                          </div>
                          <div>
                            <p className="font-semibold text-zinc-950">{s.title}</p>
                            <Stars value={d.selbsteinschaetzung} />
                          </div>
                        </div>
                        <button
                          onClick={() => setExpanded(p => ({ ...p, [code]: !p[code] }))}
                          className="flex-shrink-0 rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-50 hover:text-zinc-700"
                        >
                          <svg className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>

                      {/* Aufgeklappter Inhalt */}
                      {isOpen && (
                        <div className="mt-4 border-t border-zinc-100 pt-4 space-y-3">
                          {Object.keys(d.interactiveAnswers ?? {}).length > 0 && (
                            <InteractiveAnswerSummary
                              strategy={s}
                              answers={d.interactiveAnswers ?? {}}
                            />
                          )}
                          <Link href={`/reflexion/${code}`}
                            className="inline-block text-xs font-medium text-zinc-400 hover:text-zinc-700">
                            Nochmal bearbeiten →
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Gesamtkommentar */}
          {completedCodes.length >= 2 && (
            <section className="mb-14">
              <div className="rounded-2xl border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-white p-8 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-yellow-400 text-zinc-900 shadow-md">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-zinc-950">
                      Gesamteinschätzung
                    </h2>
                    {!kommentarDone ? (
                      <>
                        <p className="mt-1 text-sm text-zinc-600">
                          Lass dir von der KI eine Gesamteinschätzung deiner Reflexionen erstellen.
                        </p>
                        <button
                          onClick={generateKommentar}
                          disabled={isGenerating}
                          className="mt-4 inline-flex h-11 items-center gap-2 rounded-xl bg-zinc-950 px-6 text-sm font-semibold text-white shadow-md transition hover:bg-zinc-800 disabled:opacity-60"
                        >
                          {isGenerating ? (
                            <>
                              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                              </svg>
                              Wird generiert...
                            </>
                          ) : "KI-Kommentar generieren"}
                        </button>
                      </>
                    ) : (
                      <p className="mt-3 text-base leading-relaxed text-zinc-700">
                        {gesamtKommentar}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Weitere Perspektiven */}
          {openCodes.length > 0 && (
            <section className="mb-14">
              <div className="mb-6 inline-block">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                  Weitere Perspektiven
                </h2>
                <div className="mt-2 h-1 w-16 rounded-full bg-yellow-400" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {openCodes.map((code) => {
                  const s = getStrategy(code);
                  if (!s) return null;
                  return (
                    <div key={code}
                      className="group rounded-2xl border-2 border-zinc-200 bg-white p-6 transition-all hover:border-yellow-400 hover:shadow-lg">
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 text-base font-bold text-yellow-700 transition-all group-hover:bg-yellow-400 group-hover:text-white">
                        {s.letter}
                      </div>
                      <h3 className="text-base font-semibold text-zinc-950">
                        {s.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 line-clamp-2">
                        {s.kernfrage}
                      </p>
                      <div className="mt-4">
                        <Link
                          href={`/reflexion/${code}`}
                          className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-zinc-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
                        >
                          Starten
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Alle abgeschlossen */}
          {openCodes.length === 0 && completedCodes.length === 5 && (
            <div className="rounded-2xl border-2 border-zinc-200 bg-white p-8 text-center">
              <p className="text-lg font-semibold text-zinc-950">
                Alle fünf Perspektiven abgeschlossen.
              </p>
              <p className="mt-1 text-sm text-zinc-600">
                Du hast einen vollständigen Blick auf deinen KI-Einsatz entwickelt.
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-4 rounded-lg bg-zinc-100 p-5 text-center">
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
