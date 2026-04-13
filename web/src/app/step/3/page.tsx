/**
 * Step 3 – Lehrpersonen-Profil Chat
 *
 * KI-gestützter Chat zur Erstellung eines kreativen Lehrpersonen-Profils.
 * Optimiert für zügigen Durchlauf (~5 Min.) mit Intro-Screen,
 * Fortschrittsanzeige und "Profil jetzt erstellen"-Option.
 */

"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/contexts/SessionContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ProfileResult {
  name: string;
  description: string;
  strengths: string[];
}

const EXPECTED_QUESTIONS = 6;
const MIN_QUESTIONS_FOR_EARLY_FINISH = 3;

export default function Step3Page() {
  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<ProfileResult | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const sessionContext = useSession();

  const userMessageCount = useMemo(
    () => messages.filter((m) => m.role === "user").length,
    [messages],
  );

  const progressPercent = Math.min(
    100,
    Math.round((userMessageCount / EXPECTED_QUESTIONS) * 100),
  );

  const canFinishEarly =
    userMessageCount >= MIN_QUESTIONS_FOR_EARLY_FINISH && !profile;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (chatStarted && messages.length === 0) {
      initChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatStarted]);

  async function initChat() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/profile-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [] }),
      });
      if (!response.ok) throw new Error("Chat-Anfrage fehlgeschlagen");
      const data = await response.json();
      setMessages([{ role: "assistant", content: data.message }]);
    } catch (error) {
      console.error("Chat-Fehler:", error);
      setMessages([
        {
          role: "assistant",
          content:
            "Willkommen! Es gab einen Fehler beim Laden. Bitte lade die Seite neu.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  async function sendMessage(overrideContent?: string) {
    const content = overrideContent ?? input.trim();
    if (!content || isLoading) return;

    const userMessage: Message = { role: "user", content };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    if (!overrideContent) {
      setInput("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    }
    setIsLoading(true);

    try {
      const response = await fetch("/api/profile-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      if (!response.ok) throw new Error("Chat-Anfrage fehlgeschlagen");
      const data = await response.json();

      if (data.profile) {
        setProfile(data.profile);
        localStorage.setItem(
          "canvas_temp_profile",
          JSON.stringify(data.profile),
        );
      }

      setMessages([
        ...updatedMessages,
        { role: "assistant", content: data.message },
      ]);
    } catch (error) {
      console.error("Chat-Fehler:", error);
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content:
            "Entschuldigung, es gab einen Fehler. Bitte versuche es erneut.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  const resizeTextarea = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function requestEarlyProfile() {
    sendMessage("[PROFIL_JETZT_ERSTELLEN]");
  }

  // ── Intro Screen ──────────────────────────────────────────────
  if (!chatStarted && !profile) {
    return (
      <div className="min-h-screen bg-zinc-50 px-6 pb-16 pt-14">
        <main className="mx-auto w-full max-w-2xl">
          <div className="rounded-xl border border-zinc-200 bg-white p-8">
            <h1 className="text-2xl font-semibold text-zinc-950">
              Dein persönliches Lehrpersonen-Profil
            </h1>

            <p className="mt-4 text-sm leading-6 text-zinc-600">
              Im folgenden kurzen Gespräch stellt dir eine KI einige Fragen
              zu deinem Unterrichtsalltag. Daraus entsteht ein spielerisches
              Profil, das deinen Unterrichtsstil sichtbar macht.
            </p>

            <div className="mt-6 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-amber-600 text-lg">💡</span>
                <div className="text-sm leading-6 text-amber-900">
                  <strong>Tipp:</strong> Dauer{" "}
                  <strong>ca. 10 Minuten</strong>. Antworte spontan und aus
                  dem Bauch heraus. Es gibt keine richtigen oder falschen
                  Antworten.
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2 text-sm text-zinc-500">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Ein kurzes Gespräch, ca. 10 Minuten
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
                Keine Bewertung, keine Daten an Dritte
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                </svg>
                Spielerisch und unverbindlich
              </div>
            </div>

            <button
              onClick={() => setChatStarted(true)}
              className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-xl bg-zinc-950 text-sm font-semibold text-white hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-200"
            >
              Gespräch starten →
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ── Profil-Anzeige ────────────────────────────────────────────
  if (profile) {
    return (
      <div className="min-h-screen bg-zinc-50 px-6 pb-16 pt-14">
        <main className="mx-auto w-full max-w-3xl space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-8">
            <h2 className="text-2xl font-semibold text-zinc-950">
              Dein Lehrpersonen-Profil
            </h2>
            <div className="mt-6 space-y-4">
              <div>
                <div className="text-sm font-medium text-zinc-600">
                  Dein Profil-Name
                </div>
                <div className="mt-1 text-xl font-semibold text-zinc-950">
                  {profile.name}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-zinc-600">
                  Beschreibung
                </div>
                <div className="mt-1 text-sm leading-6 text-zinc-700">
                  {profile.description}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-zinc-600">
                  Deine Stärken
                </div>
                <ul className="mt-2 space-y-1">
                  {profile.strengths.map((strength, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-zinc-700"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-zinc-900" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => router.push("/step/4")}
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
                  msg.content === "[PROFIL_JETZT_ERSTELLEN]"
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
                  <div className="max-w-[80%] rounded-xl bg-zinc-100 px-4 py-3 text-sm text-zinc-600">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-zinc-400" />
                      <div className="h-2 w-2 animate-pulse rounded-full bg-zinc-400 [animation-delay:0.2s]" />
                      <div className="h-2 w-2 animate-pulse rounded-full bg-zinc-400 [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-2 mt-3 flex items-center gap-3">
            <div className="h-1.5 flex-1 rounded-full bg-zinc-200">
              <div
                className="h-1.5 rounded-full bg-zinc-900 transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-medium text-zinc-400 tabular-nums">
              {userMessageCount}/{EXPECTED_QUESTIONS}
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
                onClick={requestEarlyProfile}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 text-xs font-medium text-zinc-500 transition-colors hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-700"
              >
                Genug gesagt? → Profil jetzt erstellen
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
