"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useReflexion } from "@/contexts/ReflexionContext";

type RecordingState = "idle" | "recording" | "transcribing";

export default function SituationPage() {
  const router = useRouter();
  const { profile, setSituation, saveToDatabase } = useReflexion();

  const [situationText, setSituationText] = useState("");
  const [kiSummary, setKiSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryDone, setSummaryDone] = useState(false);
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [error, setError] = useState("");
  const [prompt, setPrompt] = useState("");
  const [promptOpen, setPromptOpen] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Audio aufnehmen
  const startRecording = useCallback(async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm",
      });
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        await transcribeAudio(audioBlob);
      };

      mediaRecorder.start(250);
      mediaRecorderRef.current = mediaRecorder;
      setRecordingState("recording");
    } catch {
      setError(
        "Mikrofon-Zugriff nicht möglich. Bitte erlaube den Zugriff im Browser."
      );
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      setRecordingState("transcribing");
      mediaRecorderRef.current.stop();
    }
  }, []);

  const transcribeAudio = useCallback(async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "aufnahme.webm");

      const res = await fetch("/api/reflection/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.text) {
        setSituationText((prev) =>
          prev ? `${prev}\n\n${data.text}` : data.text
        );
      } else {
        setError("Transkription fehlgeschlagen. Bitte tippe deinen Text ein.");
      }
    } catch {
      setError("Transkription fehlgeschlagen. Bitte tippe deinen Text ein.");
    } finally {
      setRecordingState("idle");
    }
  }, []);

  // KI-Zusammenfassung erstellen
  const createSummary = useCallback(async () => {
    if (!situationText.trim()) return;
    setIsSummarizing(true);
    setError("");

    try {
      const res = await fetch("/api/reflection/situation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situationText, profile, prompt: prompt.trim() || undefined }),
      });

      const data = await res.json();
      if (data.summary) {
        setKiSummary(data.summary);
        setSummaryDone(true);
      } else {
        setError("Zusammenfassung konnte nicht erstellt werden.");
      }
    } catch {
      setError("Netzwerkfehler. Bitte versuche es erneut.");
    } finally {
      setIsSummarizing(false);
    }
  }, [situationText, profile]);

  // Weiter zur Strategie-Auswahl
  const handleWeiter = useCallback(async () => {
    const summary = kiSummary || situationText;
    setSituation({
      text: situationText,
      kiZusammenfassung: summary,
      prompt: prompt.trim() || undefined,
    });
    await saveToDatabase();
    router.push("/reflexion/hub");
  }, [kiSummary, situationText, prompt, setSituation, saveToDatabase, router]);

  const canProceed = situationText.trim().length > 30;

  return (
    <div className="min-h-screen bg-zinc-50 px-6">
      <main className="mx-auto w-full max-w-3xl pb-16 pt-14">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-medium text-zinc-500">Schritt 1 von 3</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-950">
            Beschreibe deinen KI-Einsatz
          </h1>
          <p className="mt-2 text-base text-zinc-600">
            Erzähle von der Unterrichtssituation, die du analysieren möchtest.
            Was hast du gemacht? Wie lief es? Was war besonders?
          </p>
        </div>

        {/* Texteingabe */}
        <div className="mb-4 rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-100 px-5 py-3">
            <p className="text-sm font-semibold text-zinc-700">
              Deine Beschreibung
            </p>
          </div>
          <div className="p-5">
            <textarea
              value={situationText}
              onChange={(e) => {
                setSituationText(e.target.value);
                setSummaryDone(false);
                setKiSummary("");
              }}
              placeholder="Beschreibe deinen KI-Einsatz... Was hast du mit welchem Tool in welcher Klasse/Fach gemacht? Was war das Ziel? Was ist passiert? Was hat dich überrascht?"
              rows={8}
              className="w-full resize-none text-sm leading-relaxed text-zinc-800 placeholder:text-zinc-400 focus:outline-none"
            />
          </div>

          {/* Audio-Button */}
          <div className="border-t border-zinc-100 px-5 py-4">
            <div className="flex items-center gap-3">
              {recordingState === "idle" && (
                <button
                  onClick={startRecording}
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                  Per Audio erzählen
                </button>
              )}

              {recordingState === "recording" && (
                <button
                  onClick={stopRecording}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
                >
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
                  Aufnahme stoppen
                </button>
              )}

              {recordingState === "transcribing" && (
                <span className="flex items-center gap-2 text-sm text-zinc-500">
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Transkribiere...
                </span>
              )}

              <p className="text-xs text-zinc-400">
                Die Aufnahme wird automatisch in Text umgewandelt.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {/* Vorbereiteter Prompt (optional) */}
        <div className="mb-4 rounded-xl border border-zinc-200 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setPromptOpen(!promptOpen)}
            className="flex w-full items-center justify-between px-5 py-4 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-100">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-800">
                  Vorbereiteter Prompt
                  <span className="ml-2 text-xs font-normal text-zinc-400">optional</span>
                </p>
                {!promptOpen && prompt.trim() && (
                  <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">{prompt}</p>
                )}
              </div>
            </div>
            <svg
              className={`h-4 w-4 flex-shrink-0 text-zinc-400 transition-transform ${promptOpen ? "rotate-180" : ""}`}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {promptOpen && (
            <div className="border-t border-zinc-100 px-5 pb-5 pt-4">
              <p className="mb-3 text-sm text-zinc-600">
                Hast du den Lernenden einen vorbereiteten Prompt zur Verfügung gestellt?
                Füge ihn hier ein – er wird Teil des Reflexionskontexts.
              </p>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`z.B. "Du bist mein Lerncoach. Wenn ich dir eine Aufgabe zeige, gibst du mir nie die Lösung direkt – stattdessen stellst du mir drei Fragen, die mich zum Nachdenken bringen..."`}
                rows={5}
                className="w-full resize-none rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 font-mono text-sm leading-relaxed text-zinc-800 placeholder:font-sans placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-zinc-100"
              />
              {prompt.trim() && (
                <p className="mt-2 text-xs text-zinc-500">
                  ✓ Prompt wird gespeichert und in der Reflexion berücksichtigt.
                </p>
              )}
            </div>
          )}
        </div>

        {/* KI-Zusammenfassung */}
        {canProceed && !summaryDone && (
          <div className="mb-6">
            <button
              onClick={createSummary}
              disabled={isSummarizing}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white py-3.5 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 disabled:opacity-60"
            >
              {isSummarizing ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  KI fasst zusammen...
                </>
              ) : (
                <>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  Situation von KI zusammenfassen lassen (empfohlen)
                </>
              )}
            </button>
          </div>
        )}

        {summaryDone && kiSummary && (
          <div className="mb-6 rounded-xl border border-yellow-200 bg-yellow-50 p-5">
            <div className="mb-3 flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#92400e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <p className="text-sm font-semibold text-amber-900">
                KI-Zusammenfassung
              </p>
            </div>
            <textarea
              value={kiSummary}
              onChange={(e) => setKiSummary(e.target.value)}
              rows={5}
              className="w-full resize-none bg-transparent text-sm leading-relaxed text-amber-900 focus:outline-none"
            />
            <p className="mt-2 text-xs text-amber-700">
              Du kannst die Zusammenfassung anpassen, bevor du weitermachst.
            </p>
          </div>
        )}

        {/* Weiter-Button */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-500">
            {!canProceed
              ? "Bitte beschreibe deine Situation (mindestens ein paar Sätze)."
              : !summaryDone
              ? "Du kannst auch ohne KI-Zusammenfassung weitermachen."
              : ""}
          </p>
          <button
            onClick={handleWeiter}
            disabled={!canProceed}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-8 text-sm font-semibold text-white shadow transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-200 disabled:opacity-40"
          >
            Weiter zu den Strategien
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </main>
    </div>
  );
}
