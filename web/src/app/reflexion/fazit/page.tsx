"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useReflexion, type Message } from "@/contexts/ReflexionContext";
import { PhaseTimer } from "@/components/reflexion/PhaseTimer";

export default function FazitPage(props: PageProps<"/reflexion/fazit">) {
  use(props.params);
  use(props.searchParams);
  const router = useRouter();
  const {
    lesson,
    updateConclusion,
    saveToDatabase,
    publishLesson,
    isSaving,
  } = useReflexion();
  const [input, setInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [error, setError] = useState("");

  const messages = lesson.conclusion.chatHistory;

  async function sendMessage(content: string) {
    const trimmed = content.trim();
    if (!trimmed || isChatLoading) return;

    setError("");
    setInput("");
    const nextMessages: Message[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    updateConclusion({ chatHistory: nextMessages });
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/reflection/conclusion-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lesson, messages: nextMessages }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Chat fehlgeschlagen");

      const withAssistant: Message[] = [
        ...nextMessages,
        { role: "assistant", content: payload.message },
      ];
      updateConclusion({
        chatHistory: withAssistant,
        finalSummary: payload.message,
      });
      await saveToDatabase({
        conclusion: {
          ...lesson.conclusion,
          chatHistory: withAssistant,
          finalSummary: payload.message,
        },
      });
    } catch (chatError) {
      setError(chatError instanceof Error ? chatError.message : "Chat fehlgeschlagen");
    } finally {
      setIsChatLoading(false);
    }
  }

  async function finishConclusion() {
    const conclusion = {
      ...lesson.conclusion,
      completed: true,
    };
    updateConclusion(conclusion);
    await saveToDatabase({ conclusion });
    if (conclusion.publishConsent) {
      await publishLesson();
    }
    router.push("/reflexion/evaluation-t3");
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-6">
      <PhaseTimer minutes={10} />
      <main className="mx-auto w-full max-w-4xl pb-16 pt-12">
        <p className="text-sm font-medium text-zinc-500">Phase 3 von 4</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-950">
          Abschluss-KI-Chat
        </h1>
        <p className="mt-2 max-w-3xl text-base text-zinc-600">
          Dieser Chat erhält deine Beschreibung und alle fünf Dimensionen als
          Kontext. Ziel ist ein knappes Fazit, das du für dich behalten oder
          anonym für die Sammlung freigeben kannst.
        </p>

        <section className="mt-8 rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-100 px-6 py-4">
            <h2 className="font-semibold text-zinc-950">Reflexionsgespräch</h2>
          </div>
          <div className="max-h-[520px] space-y-4 overflow-y-auto p-6">
            {messages.length === 0 && (
              <div className="rounded-xl bg-yellow-50 p-5 text-sm leading-6 text-zinc-700">
                Starte mit einer kurzen Bitte, zum Beispiel:
                <button
                  type="button"
                  onClick={() =>
                    sendMessage("Bitte stelle mir eine gezielte Rückfrage und hilf mir anschliessend, ein Fazit zu formulieren.")
                  }
                  className="mt-3 block rounded-lg bg-zinc-950 px-4 py-2 text-sm font-semibold text-white"
                >
                  Abschluss-Chat starten
                </button>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.role === "user"
                    ? "ml-auto max-w-[80%] bg-zinc-950 text-white"
                    : "mr-auto max-w-[85%] bg-zinc-100 text-zinc-800"
                }`}
              >
                {message.content}
              </div>
            ))}

            {isChatLoading && (
              <p className="text-sm text-zinc-500">Die KI denkt über dein Fazit nach...</p>
            )}
          </div>

          <div className="border-t border-zinc-100 p-4">
            <div className="flex gap-3">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") void sendMessage(input);
                }}
                placeholder="Schreibe deine Antwort oder bitte um ein Fazit..."
                className="min-w-0 flex-1 rounded-xl border border-zinc-300 px-4 py-3 text-sm focus:border-yellow-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isChatLoading}
                className="rounded-xl bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50"
              >
                Senden
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <label className="block text-sm font-semibold text-zinc-800">
            Öffentliches Kurzfazit für `/sammlung`
            <textarea
              value={lesson.conclusion.publicSummary}
              onChange={(event) =>
                updateConclusion({ publicSummary: event.target.value })
              }
              rows={5}
              placeholder="Formuliere oder kürze das Fazit so, dass es anonym in der Sammlung erscheinen darf."
              className="mt-2 w-full resize-none rounded-lg border border-zinc-300 px-3 py-2 text-sm leading-6 focus:border-yellow-500 focus:outline-none"
            />
          </label>

          <label className="mt-4 flex items-start gap-3 rounded-xl bg-zinc-50 p-4 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={lesson.conclusion.publishConsent}
              onChange={(event) =>
                updateConclusion({ publishConsent: event.target.checked })
              }
              className="mt-1"
            />
            <span>
              Ich bin einverstanden, dass diese Unterrichtseinheit anonymisiert
              in der öffentlichen Sammlung erscheint. Namen, Session-Code und
              Chatverlauf werden nicht angezeigt.
            </span>
          </label>
        </section>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={finishConclusion}
            disabled={isSaving}
            className="inline-flex h-12 items-center justify-center rounded-xl bg-zinc-950 px-8 text-sm font-semibold text-white shadow-md transition hover:bg-zinc-800 disabled:opacity-50"
          >
            {isSaving ? "Speichere..." : "Weiter zu Phase 4"}
          </button>
        </div>
      </main>
    </div>
  );
}
