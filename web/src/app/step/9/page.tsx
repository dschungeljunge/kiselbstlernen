/**
 * Step 9 – Reflexions-Chat (Merksatz entwickeln)
 *
 * Optimiert mit Intro-Screen, Fortschrittsanzeige,
 * auto-wachsender Textarea und "Merksatz erstellen"-Option.
 */

"use client";

import {
  use,
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/contexts/SessionContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ReflectionProduct {
  merksatz: string;
  profileName: string;
  kontext: string;
}

const EXPECTED_EXCHANGES = 4;
const MIN_EXCHANGES_FOR_EARLY_FINISH = 2;

export default function Step9Page(props: PageProps<"/step/9">) {
  use(props.params);
  use(props.searchParams);
  const router = useRouter();
  const { profile, sessionCode, updateProgress, markStepCompleted } = useSession();
  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reflectionProduct, setReflectionProduct] = useState<ReflectionProduct | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const userMessageCount = useMemo(
    () => messages.filter((m) => m.role === "user").length,
    [messages],
  );

  const progressPercent = Math.min(
    100,
    Math.round((userMessageCount / EXPECTED_EXCHANGES) * 100),
  );

  const canFinishEarly =
    userMessageCount >= MIN_EXCHANGES_FOR_EARLY_FINISH && !reflectionProduct;

  const resizeTextarea = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (sessionCode) {
      updateProgress(9);
    }
  }, [sessionCode, updateProgress]);

  useEffect(() => {
    if (chatStarted && messages.length === 0 && profile) {
      initChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatStarted]);

  async function initChat() {
    if (!profile) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/reflection-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [], profile }),
      });
      const data = await res.json();
      setMessages([{ role: "assistant", content: data.message }]);
    } catch {
      setMessages([{ role: "assistant", content: "Willkommen! Lass uns gemeinsam einen Merksatz entwickeln." }]);
    } finally {
      setIsLoading(false);
    }
  }

  async function sendMessage(overrideContent?: string) {
    const content = overrideContent ?? input.trim();
    if (!content || isLoading || !profile) return;

    const userMsg: Message = { role: "user", content };
    const updated = [...messages, userMsg];
    setMessages(updated);
    if (!overrideContent) {
      setInput("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    }
    setIsLoading(true);

    try {
      const res = await fetch("/api/reflection-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated, profile }),
      });
      const data = await res.json();

      if (data.reflectionProduct) {
        setReflectionProduct(data.reflectionProduct);
        if (sessionCode) {
          markStepCompleted(9);
          await fetch("/api/session/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionCode,
              stepData: { merksatz: data.reflectionProduct.merksatz },
            }),
          });
        }
      }

      setMessages([...updated, { role: "assistant", content: data.message }]);
    } catch {
      setMessages([...updated, { role: "assistant", content: "Entschuldigung, bitte versuche es erneut." }]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function requestEarlyMerksatz() {
    sendMessage("[MERKSATZ_JETZT_ERSTELLEN]");
  }

  // ── Intro Screen ──────────────────────────────────────────────
  if (!chatStarted && !reflectionProduct) {
    return (
      <div className="min-h-screen bg-zinc-50 px-6 pb-16 pt-14">
        <main className="mx-auto w-full max-w-2xl">
          <div className="rounded-xl border border-zinc-200 bg-white p-8">
            <h1 className="text-2xl font-semibold text-zinc-950">
              Dein persönlicher Merksatz
            </h1>

            <p className="mt-4 text-sm leading-6 text-zinc-600">
              Zeit für einen kurzen Zwischenstopp. Im folgenden Gespräch
              reflektierst du gemeinsam mit einer KI über deine Erfahrungen
              aus den drei Übungen. Am Ende entsteht ein persönlicher
              Merksatz, der deine Erkenntnisse auf den Punkt bringt.
            </p>

            <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-lg text-amber-600">💡</span>
                <div className="text-sm leading-6 text-amber-900">
                  <strong>Tipp:</strong> Dauer{" "}
                  <strong>ca. 5 Minuten</strong>. Antworte spontan und
                  ehrlich. Es geht um deine persönlichen Eindrücke –
                  es gibt kein Richtig oder Falsch.
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2 text-sm text-zinc-500">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Ein kurzes Gespräch, ca. 5 Minuten
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
                Ergebnis: Dein persönlicher Merksatz
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                </svg>
                Locker und persönlich
              </div>
            </div>

            <button
              onClick={() => setChatStarted(true)}
              className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-xl bg-zinc-950 text-sm font-semibold text-white hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-200"
            >
              Reflexion starten →
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ── Merksatz-Anzeige ──────────────────────────────────────────
  if (reflectionProduct) {
    return (
      <div className="min-h-screen bg-zinc-50 px-6 pb-16 pt-14">
        <main className="mx-auto w-full max-w-3xl space-y-6">
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-8 text-center">
            <h2 className="mb-2 text-2xl font-bold text-zinc-950">Dein Merksatz</h2>
            <blockquote className="mt-4 text-xl font-medium italic text-zinc-800">
              &ldquo;{reflectionProduct.merksatz}&rdquo;
            </blockquote>
            <p className="mt-4 text-sm text-zinc-600">{reflectionProduct.kontext}</p>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => router.push("/step/10")}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-950 px-8 text-sm font-semibold text-white hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-200"
            >
              Weiter →
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ── Chat Interface ────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-zinc-50 px-6 pb-16 pt-14">
      <main className="mx-auto w-full max-w-3xl">
        <div className="flex h-[calc(100vh-8rem)] flex-col">
          {/* Chat Messages */}
          <div className="mb-4 flex-1 overflow-y-auto rounded-xl border border-zinc-200 bg-white p-6">
            <div className="space-y-4">
              {messages.map((msg, idx) => {
                if (
                  msg.role === "user" &&
                  msg.content === "[MERKSATZ_JETZT_ERSTELLEN]"
                ) {
                  return null;
                }
                return (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-6 ${
                        msg.role === "user"
                          ? "bg-zinc-900 text-white"
                          : "bg-zinc-100 text-zinc-900"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  </div>
                );
              })}
              {isLoading && (
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

          {/* Progress Bar */}
          <div className="mb-2 flex items-center gap-3">
            <div className="h-1.5 flex-1 rounded-full bg-zinc-200">
              <div
                className="h-1.5 rounded-full bg-zinc-900 transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-medium text-zinc-400 tabular-nums">
              {userMessageCount}/{EXPECTED_EXCHANGES}
            </span>
          </div>

          {/* Input Area */}
          <div className="space-y-2">
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  resizeTextarea();
                }}
                onKeyDown={handleKeyDown}
                placeholder="Deine Antwort..."
                disabled={isLoading}
                className="flex-1 resize-none rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm leading-6 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-100 disabled:opacity-60"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-950 px-6 text-sm font-semibold text-white hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-200 disabled:opacity-60"
              >
                Senden
              </button>
            </div>

            {canFinishEarly && !isLoading && (
              <button
                onClick={requestEarlyMerksatz}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 text-xs font-medium text-zinc-500 transition-colors hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-700"
              >
                Genug reflektiert? → Merksatz jetzt erstellen
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
