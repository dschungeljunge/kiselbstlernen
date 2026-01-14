/**
 * Step 3 – Lehrpersonen-Profil Chat
 * 
 * KI-gestützter Chat zur Erstellung eines kreativen Lehrpersonen-Profils
 */

"use client";

import { useState, useRef, useEffect } from "react";
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

export default function Step3Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<ProfileResult | null>(null);
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  // SessionContext für Profil-Verwaltung
  const sessionContext = useSession();

  // Beim Laden: Prüfen ob bereits ein Profil existiert
  useEffect(() => {
    // Fortschritt aktualisieren (wenn Session existiert)
    if (sessionContext.sessionCode) {
      sessionContext.updateProgress(3);
      sessionContext.markStepCompleted(3);
    }

    // 1. Zuerst im SessionContext prüfen
    if (sessionContext.profile) {
      setProfile(sessionContext.profile);
      setShowChat(false);
      return;
    }

    // 2. Alternativ im localStorage prüfen (Fallback)
    try {
      const savedProfile = localStorage.getItem("canvas_temp_profile");
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile(parsedProfile);
        setShowChat(false);
        return;
      }
    } catch (error) {
      console.error("Fehler beim Laden des Profils aus localStorage:", error);
    }

    // 3. Kein Profil vorhanden → Chat anzeigen
    setShowChat(true);
  }, [sessionContext.profile, sessionContext.sessionCode, sessionContext.updateProgress]);

  // Auto-scroll zu neuen Nachrichten
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initiale Begrüßung von der KI abrufen (nur wenn Chat angezeigt werden soll)
  useEffect(() => {
    if (showChat && messages.length === 0) {
      // Starte Chat mit leerer Nachricht, damit KI mit Willkommensnachricht beginnt
      async function initChat() {
        setIsLoading(true);
        try {
          const response = await fetch("/api/profile-chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: [] }),
          });

          if (!response.ok) {
            throw new Error("Chat-Anfrage fehlgeschlagen");
          }

          const data = await response.json();
          setMessages([{ role: "assistant", content: data.message }]);
        } catch (error) {
          console.error("Chat-Fehler:", error);
          setMessages([
            {
              role: "assistant",
              content: "Willkommen! Es gab einen Fehler beim Laden. Bitte lade die Seite neu.",
            },
          ]);
        } finally {
          setIsLoading(false);
        }
      }
      initChat();
    }
  }, [showChat, messages.length]);

  async function sendMessage() {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/profile-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        throw new Error("Chat-Anfrage fehlgeschlagen");
      }

      const data = await response.json();

      // Prüfen, ob Profil fertig ist
      if (data.profile) {
        setProfile(data.profile);
        // Profil temporär im localStorage speichern (für Step 4)
        localStorage.setItem("canvas_temp_profile", JSON.stringify(data.profile));
      }

      // Assistent-Antwort hinzufügen
      setMessages([...updatedMessages, { role: "assistant", content: data.message }]);
    } catch (error) {
      console.error("Chat-Fehler:", error);
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "Entschuldigung, es gab einen Fehler. Bitte versuche es erneut.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  // Enter-Taste zum Senden
  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  // Profil neu erstellen
  function recreateProfile() {
    setProfile(null);
    setMessages([]);
    setShowChat(true);
    // Profil aus localStorage entfernen
    localStorage.removeItem("canvas_temp_profile");
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-6 pb-16 pt-14">
      <main className="mx-auto w-full max-w-3xl">
        {!profile || showChat ? (
          /* Chat Interface */
          <div className="flex h-[calc(100vh-8rem)] flex-col">
            {/* Chat Messages */}
            <div className="mb-4 flex-1 overflow-y-auto rounded-xl border border-zinc-200 bg-white p-6">
              <div className="space-y-4">
                {messages.map((msg, idx) => (
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
                ))}
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

            {/* Input Area */}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Deine Antwort..."
                disabled={isLoading}
                className="flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-100 disabled:opacity-60"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-950 px-6 text-sm font-semibold text-white hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-200 disabled:opacity-60"
              >
                Senden
              </button>
            </div>
          </div>
        ) : profile ? (
          /* Profil-Anzeige */
          <div className="space-y-6">
            <div className="rounded-xl border border-zinc-200 bg-white p-8">
              <h2 className="text-2xl font-semibold text-zinc-950">
                Dein Lehrpersonen-Profil
              </h2>
              <div className="mt-6 space-y-4">
                <div>
                  <div className="text-sm font-medium text-zinc-600">Dein Profil-Name</div>
                  <div className="mt-1 text-xl font-semibold text-zinc-950">
                    {profile.name}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-zinc-600">Beschreibung</div>
                  <div className="mt-1 text-sm leading-6 text-zinc-700">
                    {profile.description}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-zinc-600">Deine Stärken</div>
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

            {/* Buttons */}
            <div className="mt-6 flex justify-between">
              <button
                onClick={recreateProfile}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-300 bg-white px-6 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 focus:outline-none focus:ring-4 focus:ring-zinc-200"
              >
                Profil neu erstellen
              </button>
              <button
                onClick={() => router.push("/step/4")}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-950 px-8 text-sm font-semibold text-white hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-200"
              >
                Weiter →
              </button>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
