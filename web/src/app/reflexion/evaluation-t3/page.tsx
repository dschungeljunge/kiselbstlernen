"use client";

import Link from "next/link";
import { use, useMemo, useRef, useState } from "react";
import { EVALUATION_LIKERT_ITEM_TEXTS } from "@/lib/evaluation-likert-labels";

type AnswerMap = Record<string, number>;

const likertOptions = [
  { value: 1, label: "Stimme überhaupt nicht zu" },
  { value: 2, label: "Stimme eher nicht zu" },
  { value: 3, label: "Teils / teils" },
  { value: 4, label: "Stimme eher zu" },
  { value: 5, label: "Stimme voll zu" },
];

function firstLetter(value: string): string {
  const cleaned = value.trim().toUpperCase();
  if (!cleaned) return "X";
  return cleaned[0].replace(/[^A-Z]/g, "") || "X";
}

function lastTwoDigits(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 0) return "00";
  if (digits.length === 1) return `0${digits}`;
  return digits.slice(-2);
}

function emptyAnswers(): AnswerMap {
  return Object.fromEntries(
    Array.from({ length: 11 }, (_, index) => [`q${index + 1}`, 0]),
  ) as AnswerMap;
}

export default function EvaluationT3Page(
  props: PageProps<"/reflexion/evaluation-t3">,
) {
  use(props.params);
  use(props.searchParams);
  const [flowStep, setFlowStep] = useState<"setup" | "survey" | "completed">("setup");
  const [motherFirstName, setMotherFirstName] = useState("");
  const [homeTown, setHomeTown] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [phoneLastDigits, setPhoneLastDigits] = useState("");
  const [anonCode, setAnonCode] = useState("");
  const [answers, setAnswers] = useState<AnswerMap>(emptyAnswers());
  const [questionIndex, setQuestionIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const surveyStartedAtMs = useRef<number | null>(null);

  const generatedCode = useMemo(() => {
    return `${firstLetter(motherFirstName)}${firstLetter(homeTown)}${lastTwoDigits(
      birthDay,
    )}${lastTwoDigits(phoneLastDigits)}`;
  }, [motherFirstName, homeTown, birthDay, phoneLastDigits]);

  const currentQuestionNumber = questionIndex + 1;
  const currentQuestionKey = `q${currentQuestionNumber}`;
  const currentValue = answers[currentQuestionKey] ?? 0;
  const isLastQuestion = questionIndex === EVALUATION_LIKERT_ITEM_TEXTS.length - 1;
  const canStart =
    motherFirstName.trim() &&
    homeTown.trim() &&
    birthDay.replace(/\D/g, "") &&
    phoneLastDigits.replace(/\D/g, "");

  async function submit(nextAnswers: AnswerMap) {
    setIsSaving(true);
    setErrorMessage("");
    const started = surveyStartedAtMs.current;
    const durationSec = started ? (Date.now() - started) / 1000 : undefined;

    try {
      const response = await fetch("/api/evaluation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anonCode,
          answers: nextAnswers,
          durationSec,
          measurementIndex: 3,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Speichern fehlgeschlagen.");
      setFlowStep("completed");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Antworten konnten nicht gespeichert werden.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function selectAnswer(value: number) {
    const nextAnswers = { ...answers, [currentQuestionKey]: value };
    setAnswers(nextAnswers);
    setErrorMessage("");

    if (!isLastQuestion) {
      setQuestionIndex((prev) => prev + 1);
      return;
    }

    await submit(nextAnswers);
  }

  function startSurvey() {
    if (!canStart) {
      setErrorMessage("Bitte zuerst alle vier Felder ausfüllen.");
      return;
    }
    setAnonCode(generatedCode);
    surveyStartedAtMs.current = Date.now();
    setFlowStep("survey");
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-6">
      <main className="mx-auto w-full max-w-3xl pb-16 pt-12">
        <p className="text-sm font-medium text-zinc-500">Phase 4 von 4</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-950">
          Evaluation
        </h1>
        <p className="mt-2 text-base text-zinc-600">
          Zum Abschluss füllst du die Selbsteinschätzung für den dritten
          Messzeitpunkt aus. Der anonymisierte Code wird gleich gebildet wie in
          den bisherigen Evaluationen.
        </p>

        {flowStep === "setup" && (
          <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-zinc-950">
              Anonymisierten Code generieren
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <input
                value={motherFirstName}
                onChange={(event) => setMotherFirstName(event.target.value)}
                placeholder="Vorname Mutter"
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none"
              />
              <input
                value={homeTown}
                onChange={(event) => setHomeTown(event.target.value)}
                placeholder="Heimatort"
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none"
              />
              <input
                value={birthDay}
                onChange={(event) => setBirthDay(event.target.value)}
                placeholder="Geburtstag, z. B. 07"
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none"
              />
              <input
                value={phoneLastDigits}
                onChange={(event) => setPhoneLastDigits(event.target.value)}
                placeholder="Letzte 2 Ziffern einer privaten Zahl"
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none"
              />
            </div>
            <div className="mt-5 rounded-xl bg-zinc-50 p-4 text-sm text-zinc-700">
              Dein Code: <span className="font-bold">{generatedCode}</span>
            </div>
            <button
              type="button"
              onClick={startSurvey}
              className="mt-5 rounded-xl bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              T3-Evaluation starten
            </button>
          </section>
        )}

        {flowStep === "survey" && (
          <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="mb-5 text-sm font-semibold text-zinc-500">
              Frage {currentQuestionNumber} von {EVALUATION_LIKERT_ITEM_TEXTS.length}
            </div>
            <h2 className="text-xl font-semibold text-zinc-950">
              {EVALUATION_LIKERT_ITEM_TEXTS[questionIndex]}
            </h2>
            <div className="mt-6 space-y-3">
              {likertOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => selectAnswer(option.value)}
                  disabled={isSaving}
                  className={`block w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                    currentValue === option.value
                      ? "border-yellow-400 bg-yellow-50"
                      : "border-zinc-200 bg-white hover:border-yellow-300"
                  }`}
                >
                  {option.value} - {option.label}
                </button>
              ))}
            </div>
            {questionIndex > 0 && (
              <button
                type="button"
                onClick={() => setQuestionIndex((prev) => prev - 1)}
                className="mt-5 text-sm font-medium text-zinc-600 hover:text-zinc-950"
              >
                Zurück
              </button>
            )}
          </section>
        )}

        {flowStep === "completed" && (
          <section className="mt-8 rounded-2xl border border-yellow-300 bg-yellow-50 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-zinc-950">
              Danke, T3 ist gespeichert.
            </h2>
            <p className="mt-2 text-sm text-zinc-700">
              Deine Reflexion ist abgeschlossen. Freigegebene Unterrichtseinheiten
              erscheinen anonymisiert in der Sammlung.
            </p>
            <Link
              href="/sammlung"
              className="mt-5 inline-flex rounded-xl bg-zinc-950 px-6 py-3 text-sm font-semibold text-white"
            >
              Zur Sammlung
            </Link>
          </section>
        )}

        {errorMessage && <p className="mt-4 text-sm text-red-600">{errorMessage}</p>}
      </main>
    </div>
  );
}
