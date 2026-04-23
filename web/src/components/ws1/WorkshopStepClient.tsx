"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { WORKSHOP1_STEPS, WORKSHOP1_TUTOR_TEMPLATE } from "@/lib/workshop1";

interface WorkshopStepClientProps {
  stepNumber: number;
}

export function WorkshopStepClient({ stepNumber }: WorkshopStepClientProps) {
  const stepData = useMemo(
    () => WORKSHOP1_STEPS.find((s) => s.step === stepNumber),
    [stepNumber]
  );

  const [remainingSeconds, setRemainingSeconds] = useState(() => (stepData?.durationMinutes ?? 0) * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!stepData) return;
    setRemainingSeconds(stepData.durationMinutes * 60);
    setIsRunning(false);
  }, [stepData]);

  useEffect(() => {
    if (!isRunning) return;
    if (remainingSeconds <= 0) {
      setIsRunning(false);
      return;
    }

    const interval = window.setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning, remainingSeconds]);

  if (!stepData) return null;

  const isLastStep = stepNumber === WORKSHOP1_STEPS.length;
  const nextStep = Math.min(stepNumber + 1, WORKSHOP1_STEPS.length);
  const initialDurationSeconds = stepData.durationMinutes * 60;
  const minutes = Math.floor(remainingSeconds / 60).toString().padStart(2, "0");
  const seconds = (remainingSeconds % 60).toString().padStart(2, "0");

  function resetTimer() {
    setRemainingSeconds(initialDurationSeconds);
    setIsRunning(false);
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-6">
      <main className="mx-auto w-full max-w-4xl pb-16 pt-14">
        <div className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-zinc-500">
                Workshop 1 · Schritt {stepNumber} von {WORKSHOP1_STEPS.length}
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950">
                {stepData.title}
              </h1>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
              Empfohlene Zeit:{" "}
              <span className="font-semibold text-zinc-950">{stepData.durationMinutes} Minuten</span>
            </div>
          </div>

          <section className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Arbeitsauftrag
            </p>
            <p className="mt-2 text-base leading-7 text-zinc-700">{stepData.intro}</p>
          </section>

          {stepData.prompts.length > 0 && (
            <section className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Leitfragen
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-7 text-zinc-700">
                {stepData.prompts.map((prompt) => (
                  <li key={prompt}>{prompt}</li>
                ))}
              </ul>
            </section>
          )}

          <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-yellow-800">
              Festhalten
            </p>
            <p className="mt-2 text-base font-medium text-zinc-900">{stepData.task}</p>
          </div>

          {stepData.examples && (
            <section className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Beispiele
              </p>
              <ul className="mt-3 space-y-2 text-base leading-7 text-zinc-600">
                {stepData.examples.map((example) => (
                  <li
                    key={example}
                    className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3"
                  >
                    {example}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {stepNumber === 5 && (
            <section className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Vorlage</p>
              <h2 className="mt-2 text-lg font-semibold text-zinc-950">Berufs-Tutor formulieren</h2>
              <p className="mt-2 text-base leading-7 text-zinc-700">
                Kopiert die Vorlage und ersetzt die Platzhalter für euren Beruf.
              </p>
              <pre className="mt-4 overflow-x-auto rounded-xl bg-zinc-950 p-4 text-sm leading-7 text-zinc-100">
                <code>{WORKSHOP1_TUTOR_TEMPLATE}</code>
              </pre>
            </section>
          )}
        </div>

        <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Timer für diese Aufgabe
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Der Timer startet nicht automatisch und kann bei Bedarf pausiert oder neu gestartet
            werden.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="rounded-lg bg-zinc-900 px-4 py-3 font-mono text-2xl font-semibold text-white">
              {minutes}:{seconds}
            </div>
            <button
              onClick={() => setIsRunning((running) => !running)}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-950 px-4 text-sm font-semibold text-white hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-200"
            >
              {isRunning ? "Timer pausieren" : "Timer starten"}
            </button>
            <button
              onClick={resetTimer}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 focus:outline-none focus:ring-4 focus:ring-zinc-200"
            >
              Neu starten
            </button>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <Link
            href={stepNumber === 1 ? "/ws1" : `/ws1/${stepNumber - 1}`}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-300 bg-white px-6 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 focus:outline-none focus:ring-4 focus:ring-zinc-200"
          >
            ← Zurück
          </Link>

          {isLastStep ? (
            <Link
              href="/ws1"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-950 px-8 text-sm font-semibold text-white hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-200"
            >
              Workshop abschliessen →
            </Link>
          ) : (
            <Link
              href={`/ws1/${nextStep}`}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-950 px-8 text-sm font-semibold text-white hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-200"
            >
              Weiter →
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}

