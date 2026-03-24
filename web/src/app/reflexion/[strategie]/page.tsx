"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useReflexion } from "@/contexts/ReflexionContext";
import { getStrategy } from "@/lib/reflexion-strategies";
import type { Message } from "@/contexts/ReflexionContext";
import { InteractivePhase } from "@/components/reflexion/InteractiveElements";

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110 focus:outline-none"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill={star <= value ? "#eab308" : "none"}
            stroke={star <= value ? "#eab308" : "#d1d5db"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      ))}
      <span className="ml-2 self-center text-sm text-zinc-500">
        {value === 0
          ? "Noch nicht bewertet"
          : value <= 2
          ? "Eher schlecht gelaufen"
          : value === 3
          ? "Gemischt"
          : "Gut gelaufen"}
      </span>
    </div>
  );
}

function WikiCard({ title, summary }: { title: string; summary: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full rounded-lg border border-zinc-200 bg-zinc-50 text-left transition hover:bg-zinc-100"
    >
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-xs font-semibold text-zinc-600">{title}</span>
        <svg
          className={`h-4 w-4 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {open && (
        <div className="border-t border-zinc-200 px-4 pb-3 pt-2">
          <p className="text-xs leading-relaxed text-zinc-600">{summary}</p>
        </div>
      )}
    </button>
  );
}

export default function StrategiePage() {
  const params = useParams();
  const router = useRouter();
  const code = (params.strategie as string).toLowerCase();
  const strategy = getStrategy(code);

  const {
    profile,
    situation,
    strategies,
    selectedStrategies,
    updateStrategy,
    saveToDatabase,
    getNextStrategy,
  } = useReflexion();

  const stratData = strategies[code];
  const [messages, setMessages] = useState<Message[]>(
    stratData?.chatHistory ?? []
  );
  const [formAnswers, setFormAnswers] = useState<Record<string, string>>(
    stratData?.formAnswers ?? {}
  );
  const [interactiveAnswers, setInteractiveAnswers] = useState<Record<string, unknown>>(
    stratData?.interactiveAnswers ?? {}
  );
  const [selbst, setSelbst] = useState(stratData?.selbsteinschaetzung ?? 0);
  const [naechsterSchritt, setNaechsterSchritt] = useState(
    stratData?.naechsterSchritt ?? ""
  );
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatStarted, setChatStarted] = useState(messages.length > 0);
  const [abschlussVisible, setAbschlussVisible] = useState(
    stratData?.abgeschlossen ?? false
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Chat initialisieren
  const initChat = useCallback(async () => {
    if (chatStarted || !strategy || strategy.type !== "chat") return;
    setChatStarted(true);
    setIsChatLoading(true);
    try {
      const res = await fetch("/api/reflection/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          strategie: code,
          messages: [],
          profile,
          situationSummary:
            situation?.kiZusammenfassung || situation?.text || "",
          interactiveAnswers,
        }),
      });
      const data = await res.json();
      const firstMessage: Message = {
        role: "assistant",
        content: data.message,
      };
      setMessages([firstMessage]);
      updateStrategy(code, { chatHistory: [firstMessage] });
    } catch {
      setMessages([
        {
          role: "assistant",
          content: "Entschuldigung, bitte lade die Seite neu.",
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  }, [chatStarted, strategy, code, profile, situation, updateStrategy]);

  const sendChatMessage = useCallback(async () => {
    if (!chatInput.trim() || isChatLoading) return;
    const userMsg: Message = { role: "user", content: chatInput };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const res = await fetch("/api/reflection/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          strategie: code,
          messages: updated,
          profile,
          situationSummary:
            situation?.kiZusammenfassung || situation?.text || "",
          interactiveAnswers,
        }),
      });
      const data = await res.json();
      const assistantMsg: Message = { role: "assistant", content: data.message };
      const withAssistant = [...updated, assistantMsg];
      setMessages(withAssistant);
      updateStrategy(code, { chatHistory: withAssistant });
    } catch {
      const errMsg: Message = {
        role: "assistant",
        content: "Entschuldigung, bitte versuche es erneut.",
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsChatLoading(false);
    }
  }, [chatInput, isChatLoading, messages, code, profile, situation, updateStrategy]);

  const handleInteractiveChange = useCallback((id: string, value: unknown) => {
    setInteractiveAnswers((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleAbschluss = useCallback(async () => {
    const data = {
      chatHistory: messages,
      formAnswers,
      interactiveAnswers,
      selbsteinschaetzung: selbst,
      naechsterSchritt: "",
      abgeschlossen: true,
    };
    updateStrategy(code, data);
    await saveToDatabase();

    router.push("/reflexion/hub");
  }, [
    messages,
    formAnswers,
    selbst,
    naechsterSchritt,
    code,
    updateStrategy,
    saveToDatabase,
    getNextStrategy,
    router,
  ]);

  const currentIdx = selectedStrategies.indexOf(code);
  const totalSelected = selectedStrategies.length;

  if (!strategy) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-500">Strategie nicht gefunden.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-6">
      <main className="mx-auto w-full max-w-3xl pb-16 pt-14">
        {/* Fortschrittsbalken */}
        {totalSelected > 1 && (
          <div className="mb-6 flex gap-1.5">
            {selectedStrategies.map((s, i) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i < currentIdx
                    ? "bg-zinc-950"
                    : i === currentIdx
                    ? "bg-yellow-400"
                    : "bg-zinc-200"
                }`}
              />
            ))}
          </div>
        )}

        {/* Strategie-Header */}
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2 flex-wrap">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-sm font-bold text-white">
              {strategy.letter}
            </div>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${strategy.perspectiveColor}`}>
              {strategy.perspective}
            </span>
            {strategy.type === "chat" && (
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
                KI-Chat
              </span>
            )}
            {totalSelected > 1 && (
              <span className="text-xs text-zinc-400">
                {currentIdx + 1} / {totalSelected}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-zinc-950">{strategy.title}</h1>
          <p className="mt-1 text-base italic text-zinc-600">
            {strategy.kernfrage}
          </p>
        </div>

        {/* Theorie-Box */}
        <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-sm leading-relaxed text-zinc-700">
            {strategy.beschreibung}
          </p>
          {strategy.wikiLinks.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Theoretischer Hintergrund
              </p>
              {strategy.wikiLinks.map((w) => (
                <WikiCard key={w.title} title={w.title} summary={w.summary} />
              ))}
            </div>
          )}
        </div>

        {/* INTERAKTIVE PHASE */}
        {strategy.interactivePhase && strategy.interactivePhase.length > 0 && (
          <InteractivePhase
            elements={strategy.interactivePhase}
            answers={interactiveAnswers}
            onChange={handleInteractiveChange}
          />
        )}

        {/* CHAT (Strategien A, B, E) */}
        {strategy.type === "chat" && (
          <div className="mb-6 rounded-xl border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-100 px-5 py-3">
              <p className="text-sm font-semibold text-zinc-700">
                Reflexionsgespräch
              </p>
            </div>

            {!chatStarted ? (
              <div className="p-6 text-center">
                <p className="mb-4 text-sm text-zinc-600">
                  Die KI wird das Gespräch basierend auf deiner Situation und
                  deinem Profil eröffnen.
                </p>
                <button
                  onClick={initChat}
                  className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
                >
                  Gespräch starten
                </button>
              </div>
            ) : (
              <>
                {/* Nachrichten */}
                <div className="max-h-96 overflow-y-auto p-5">
                  <div className="space-y-4">
                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                            msg.role === "user"
                              ? "bg-zinc-900 text-white"
                              : "bg-zinc-100 text-zinc-900"
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{msg.content}</div>
                        </div>
                      </div>
                    ))}
                    {isChatLoading && (
                      <div className="flex justify-start">
                        <div className="rounded-xl bg-zinc-100 px-4 py-3">
                          <div className="flex gap-1.5">
                            {[0, 1, 2].map((i) => (
                              <div
                                key={i}
                                className="h-2 w-2 animate-bounce rounded-full bg-zinc-400"
                                style={{ animationDelay: `${i * 0.15}s` }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Chat-Input */}
                {!abschlussVisible && (
                  <div className="border-t border-zinc-100 p-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendChatMessage();
                          }
                        }}
                        placeholder="Deine Antwort..."
                        disabled={isChatLoading}
                        className="flex-1 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-100 disabled:opacity-60"
                      />
                      <button
                        onClick={sendChatMessage}
                        disabled={!chatInput.trim() || isChatLoading}
                        className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-950 px-5 text-sm font-semibold text-white disabled:opacity-60"
                      >
                        Senden
                      </button>
                    </div>
                    {messages.length >= 4 && (
                      <button
                        onClick={() => setAbschlussVisible(true)}
                        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:border-zinc-300"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Gespräch beenden und Einschätzung abgeben
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* FORMULAR (Strategien C, D) – Freitext-Ergänzungen */}
        {strategy.type === "form" && strategy.formQuestions && (
          <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-zinc-100" />
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Weitere Gedanken (optional)
              </p>
              <div className="h-px flex-1 bg-zinc-100" />
            </div>
            <div className="space-y-4">
              {strategy.formQuestions.map((q) => (
                <div key={q.id}>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                    {q.question}
                  </label>
                  <textarea
                    value={formAnswers[q.id] ?? ""}
                    onChange={(e) => {
                      const updated = { ...formAnswers, [q.id]: e.target.value };
                      setFormAnswers(updated);
                      updateStrategy(code, { formAnswers: updated });
                    }}
                    placeholder={q.placeholder}
                    rows={2}
                    className="w-full resize-none rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm leading-relaxed text-zinc-800 placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-zinc-100"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABSCHLUSS-SECTION */}
        {(strategy.type === "form" || abschlussVisible) && (
          <div className="mb-6 rounded-xl border-2 border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-base font-bold text-zinc-950">
              Deine Einschätzung
            </h2>

            {/* Selbsteinschätzung */}
            <div>
              <p className="mb-3 text-sm font-semibold text-zinc-800">
                Wie gut ist dieser KI-Einsatz aus dieser Perspektive gelaufen?
              </p>
              <StarRating value={selbst} onChange={setSelbst} />
            </div>

            {/* Speichern & Weiter */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleAbschluss}
                disabled={selbst === 0}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-8 text-sm font-semibold text-white shadow transition hover:bg-zinc-800 disabled:opacity-40"
              >
                Speichern & zurück zum Überblick
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
          </div>
        )}
      </main>
    </div>
  );
}
