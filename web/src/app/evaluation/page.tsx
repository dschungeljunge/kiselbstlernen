"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type AnswerMap = Record<string, number>;

const likertItems = [
  "Ich traue mir zu, KI-Tools sinnvoll in meinen Unterricht zu integrieren.",
  "Ich kann Lernaufgaben entwickeln, bei denen KI den Lernprozess unterstützt.",
  "Ich kann Lernende dabei unterstützen, KI reflektiert zu nutzen.",
  "Der Einsatz von KI kann die Qualität meines Unterrichts verbessern.",
  "KI kann mich bei der Planung oder Durchführung von Unterricht wirksam unterstützen.",
  "Der Einsatz von KI hilft mir, Lernprozesse effizienter zu gestalten.",
  "Ich plane Unterricht so, dass der Einsatz von KI klar mit meinen Lernzielen verknüpft ist.",
  "Ich kann einschätzen, in welchen Unterrichtssituationen der Einsatz von KI sinnvoll ist und in welchen nicht.",
  "Ich kann begründen, warum ich KI in einer konkreten Unterrichtssituation einsetze oder bewusst darauf verzichte.",
  "Ich beabsichtige, KI in den nächsten Wochen im Unterricht einzusetzen.",
  "Ich plane, Unterrichtsmaterialien mit Unterstützung von KI weiterzuentwickeln.",
];

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
  const base: AnswerMap = {};
  for (let i = 1; i <= 11; i += 1) base[`q${i}`] = 0;
  return base;
}

export default function EvaluationPage() {
  const [flowStep, setFlowStep] = useState<"setup" | "survey" | "completed">("setup");
  const [anonCode, setAnonCode] = useState("");
  const [motherFirstName, setMotherFirstName] = useState("");
  const [homeTown, setHomeTown] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [phoneLastDigits, setPhoneLastDigits] = useState("");

  const [answers, setAnswers] = useState<AnswerMap>(emptyAnswers());
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);

  const generatedCode = useMemo(() => {
    return `${firstLetter(motherFirstName)}${firstLetter(homeTown)}${lastTwoDigits(
      birthDay,
    )}${lastTwoDigits(phoneLastDigits)}`;
  }, [motherFirstName, homeTown, birthDay, phoneLastDigits]);

  const totalQuestions = 11;
  const currentQuestionNumber = questionIndex + 1;
  const currentQuestionKey = `q${currentQuestionNumber}`;
  const currentValue = answers[currentQuestionKey] ?? -1;
  const isLastQuestion = questionIndex === totalQuestions - 1;
  const progressPercent = Math.round((currentQuestionNumber / totalQuestions) * 100);
  const currentQuestionText = likertItems[currentQuestionNumber - 1];
  const currentOptions = likertOptions;
  const canStartSurvey =
    motherFirstName.trim().length > 0 &&
    homeTown.trim().length > 0 &&
    birthDay.replace(/\D/g, "").length > 0 &&
    phoneLastDigits.replace(/\D/g, "").length > 0;

  async function loadSavedData(codeOverride?: string): Promise<boolean> {
    const resolvedCode = (codeOverride ?? anonCode).trim().toUpperCase();

    if (!resolvedCode) {
      setErrorMessage("Bitte zuerst einen anonymisierten Code eingeben.");
      return false;
    }

    setIsLoadingSaved(true);
    setErrorMessage("");
    setStatusMessage("");

    try {
      const code = resolvedCode;
      const response = await fetch(`/api/evaluation?code=${encodeURIComponent(code)}`);
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Laden fehlgeschlagen.");
      }

      setAnonCode(code);
      setAnswers(emptyAnswers());
      setQuestionIndex(0);
      return true;
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Daten konnten nicht geladen werden.",
      );
      return false;
    } finally {
      setIsLoadingSaved(false);
    }
  }

  function validateCurrentAnswers(): string | null {
    for (let i = 1; i <= 11; i += 1) {
      if (!answers[`q${i}`] || answers[`q${i}`] < 1 || answers[`q${i}`] > 5) {
        return `Bitte Frage ${i} beantworten.`;
      }
    }

    return null;
  }

  async function submitSurvey() {
    setStatusMessage("");
    setErrorMessage("");

    const code = anonCode.trim().toUpperCase();
    if (!code) {
      setErrorMessage("Bitte einen anonymisierten Code eingeben.");
      return;
    }

    const validationError = validateCurrentAnswers();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/evaluation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anonCode: code,
          answers,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Speichern fehlgeschlagen.");
      }

      setFlowStep("completed");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Antworten konnten nicht gespeichert werden.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function beginSurvey() {
    if (!canStartSurvey) {
      setErrorMessage("Bitte zuerst alle vier Felder ausfüllen.");
      return;
    }

    const code = generatedCode.trim().toUpperCase();
    setAnonCode(code);
    const loaded = await loadSavedData(code);
    if (loaded) {
      setFlowStep("survey");
    }
  }

  async function handleSelectAnswer(value: number) {
    setAnswers((prev) => ({ ...prev, [currentQuestionKey]: value }));
    setErrorMessage("");

    if (!isLastQuestion) {
      setQuestionIndex((prev) => prev + 1);
      return;
    }

    const nextAnswers = { ...answers, [currentQuestionKey]: value };
    const hasAllLikert = Array.from({ length: 11 }, (_, i) => i + 1).every((idx) => {
      const answerValue = nextAnswers[`q${idx}`];
      return typeof answerValue === "number" && answerValue >= 1 && answerValue <= 5;
    });
    if (hasAllLikert) {
      await submitSurvey();
    }
  }

  function goToPrevious() {
    if (questionIndex === 0) return;
    setQuestionIndex((prev) => prev - 1);
  }

  async function goToNextOrSave() {
    const hasAnswer = currentValue >= 1 && currentValue <= 5;

    if (!hasAnswer) {
      setErrorMessage("Bitte wählen Sie eine Antwort aus.");
      return;
    }

    setErrorMessage("");
    if (!isLastQuestion) {
      setQuestionIndex((prev) => prev + 1);
      return;
    }

    await submitSurvey();
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="relative overflow-hidden bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-400">
        <div className="relative mx-auto max-w-5xl px-6 py-14">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-800 transition-colors hover:text-zinc-950"
          >
            <span aria-hidden>←</span> Zurück zur Startseite
          </Link>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-950 md:text-5xl">
            Evaluation KI im Unterricht
          </h1>
          <p className="mt-3 max-w-3xl text-zinc-800">
            Der Messzeitpunkt wird automatisch anhand der bereits erfassten Daten pro anonymisiertem
            Code bestimmt.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-6 py-10">
        {flowStep === "setup" && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-zinc-950">1) Anonymisierten Code generieren</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Beispielregel: erster Buchstabe Vorname Mutter + erster Buchstabe Heimatort + Tag der
              Geburt (2-stellig) + letzte 2 Ziffern einer privaten Zahl.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="text-sm text-zinc-700">
                Vorname Mutter (nur erster Buchstabe)
                <input
                  value={motherFirstName}
                  onChange={(e) => setMotherFirstName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none"
                />
              </label>
              <label className="text-sm text-zinc-700">
                Heimatort (nur erster Buchstabe)
                <input
                  value={homeTown}
                  onChange={(e) => setHomeTown(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none"
                />
              </label>
              <label className="text-sm text-zinc-700">
                Tag der Geburt (z. B. 03, 17, 29)
                <input
                  value={birthDay}
                  onChange={(e) => setBirthDay(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none"
                />
              </label>
              <label className="text-sm text-zinc-700">
                Letzte 2 Ziffern (frei wählbar, aber konstant)
                <input
                  value={phoneLastDigits}
                  onChange={(e) => setPhoneLastDigits(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none"
                />
              </label>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="rounded-lg bg-zinc-100 px-4 py-2 font-mono text-lg tracking-widest text-zinc-900">
                {generatedCode}
              </div>
            </div>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => {
                  void beginSurvey();
                }}
                disabled={isLoadingSaved || !canStartSurvey}
                className="rounded-lg bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoadingSaved ? "Starte..." : "Umfrage beginnen"}
              </button>

              {statusMessage && <p className="mt-3 text-sm text-emerald-700">{statusMessage}</p>}
              {errorMessage && <p className="mt-3 text-sm text-red-700">{errorMessage}</p>}
            </div>
          </div>
        )}

        {flowStep === "survey" && (
          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-zinc-600">
                    Frage {currentQuestionNumber} von {totalQuestions}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFlowStep("setup")}
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
                >
                  Zurück
                </button>
              </div>

              <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-zinc-200">
                <div
                  className="h-full rounded-full bg-yellow-400 transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <p className="text-lg font-semibold text-zinc-950">
                {currentQuestionNumber}. {currentQuestionText}
              </p>

              <div className="mt-5 grid gap-3">
                {currentOptions.map((option) => (
                  <button
                    key={`${currentQuestionKey}-${option.value}`}
                    type="button"
                    onClick={() => {
                      void handleSelectAnswer(option.value);
                    }}
                    className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                      currentValue === option.value
                        ? "border-yellow-500 bg-yellow-50 text-zinc-900"
                        : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={goToPrevious}
                  disabled={questionIndex === 0}
                  className="rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 disabled:opacity-60"
                >
                  Zurück
                </button>
                <button
                  type="button"
                  onClick={goToNextOrSave}
                  disabled={isSaving}
                  className="rounded-lg bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-yellow-300 disabled:opacity-60"
                >
                  {isSaving ? "Speichere..." : isLastQuestion ? "Umfrage speichern" : "Weiter"}
                </button>
              </div>
              {statusMessage && <p className="mt-3 text-sm text-emerald-700">{statusMessage}</p>}
              {errorMessage && <p className="mt-3 text-sm text-red-700">{errorMessage}</p>}
            </div>
          </div>
        )}

        {flowStep === "completed" && (
          <div className="mt-8">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-zinc-950">Vielen Dank</h2>
              <p className="mt-2 text-sm text-zinc-600">
                Ihre Antworten wurden gespeichert. Sie können das Fenster schliessen oder eine weitere
                Runde starten.
              </p>
              <button
                type="button"
                onClick={() => setFlowStep("setup")}
                className="mt-6 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
              >
                Zurück zum Start
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
