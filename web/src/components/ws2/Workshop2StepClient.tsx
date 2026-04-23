"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { WORKSHOP2_STEPS } from "@/lib/workshop2";

interface Workshop2StepClientProps {
  stepNumber: number;
}

export function Workshop2StepClient({ stepNumber }: Workshop2StepClientProps) {
  const stepData = useMemo(
    () => WORKSHOP2_STEPS.find((s) => s.step === stepNumber),
    [stepNumber]
  );

  const [remainingSeconds, setRemainingSeconds] = useState(() => (stepData?.durationMinutes ?? 0) * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [copiedExampleTitle, setCopiedExampleTitle] = useState<string | null>(null);

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

  const isLastStep = stepNumber === WORKSHOP2_STEPS.length;
  const nextStep = Math.min(stepNumber + 1, WORKSHOP2_STEPS.length);
  const initialDurationSeconds = stepData.durationMinutes * 60;
  const minutes = Math.floor(remainingSeconds / 60).toString().padStart(2, "0");
  const seconds = (remainingSeconds % 60).toString().padStart(2, "0");

  function resetTimer() {
    setRemainingSeconds(initialDurationSeconds);
    setIsRunning(false);
  }

  async function copyPrompt(title: string, prompt: string) {
    await navigator.clipboard.writeText(prompt);
    setCopiedExampleTitle(title);
    window.setTimeout(() => setCopiedExampleTitle(null), 1800);
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-6">
      <main className="mx-auto w-full max-w-4xl pb-16 pt-14">
        <div className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-zinc-500">
                Workshop 2 · Schritt {stepNumber} von {WORKSHOP2_STEPS.length}
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

          {stepData.phaseText.length > 0 && (
            <section className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Orientierung
              </p>
              <div className="mt-3 space-y-3">
              {stepData.phaseText.map((text) => (
                <p key={text} className="text-base leading-7 text-zinc-700">
                  {text}
                </p>
              ))}
              </div>
            </section>
          )}

          {stepData.prompts.length > 0 && (
            <section className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                So geht ihr vor
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
              Ergebnis
            </p>
            <p className="mt-2 text-base font-medium text-zinc-900">{stepData.task}</p>
          </div>

          {stepData.examples && (
            <section className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Kopierbare Prompt-Beispiele
              </p>
              <div className="mt-4 space-y-4">
                {stepData.examples.map((example) => (
                  <div
                    key={example.title}
                    className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 sm:p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-zinc-900">{example.title}</p>
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
                          {example.description}
                        </p>
                      </div>
                      <button
                        onClick={() => copyPrompt(example.title, example.prompt)}
                        className="inline-flex h-8 items-center justify-center rounded-lg border border-zinc-300 bg-white px-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 focus:outline-none focus:ring-4 focus:ring-zinc-200"
                      >
                        {copiedExampleTitle === example.title ? "Kopiert" : "Prompt kopieren"}
                      </button>
                    </div>
                    {example.note && (
                      <p className="mt-3 text-sm leading-6 text-zinc-600">{example.note}</p>
                    )}
                    <div className="mt-4 rounded-lg border border-zinc-200 bg-white p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                        Prompt
                      </p>
                      <pre className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-zinc-800">
                      <code>{example.prompt}</code>
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {stepData.guides && (
            <section className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Arbeitshilfen
              </p>
              <div className="mt-4 space-y-4">
                {stepData.guides.map((guide) => (
                  <div
                    key={guide.title}
                    className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 sm:p-5"
                  >
                    <p className="text-sm font-semibold text-zinc-900">{guide.title}</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">{guide.description}</p>
                    <ol className="mt-3 list-decimal space-y-2 pl-5 text-base leading-7 text-zinc-700">
                      {guide.steps.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Timer für diese Phase
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Der Timer startet nicht automatisch und hilft als Orientierung für diese Phase.
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
            href={stepNumber === 1 ? "/ws2" : `/ws2/${stepNumber - 1}`}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-300 bg-white px-6 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 focus:outline-none focus:ring-4 focus:ring-zinc-200"
          >
            ← Zurück
          </Link>

          {isLastStep ? (
            <Link
              href="/ws2"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-950 px-8 text-sm font-semibold text-white hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-200"
            >
              Workshop abschliessen →
            </Link>
          ) : (
            <Link
              href={`/ws2/${nextStep}`}
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

