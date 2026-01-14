/**
 * Step 9 – Reflexion mit KI
 * 
 * KI-gestützter Reflexionsdialog über das Gelernte mit Bezug zum Lehrpersonen-Profil
 * Am Ende wird ein konkretes Reflexionsprodukt erstellt
 */

"use client";

import { useState, useRef, useEffect } from "react";
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

export default function Step9Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reflectionProduct, setReflectionProduct] = useState<ReflectionProduct | null>(null);
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  // SessionContext für Profil-Zugriff
  const sessionContext = useSession();

  // Beim Laden: Prüfen ob bereits ein Merksatz existiert
  useEffect(() => {
    // Fortschritt aktualisieren (wenn Session existiert)
    if (sessionContext.sessionCode) {
      sessionContext.updateProgress(9);
      sessionContext.markStepCompleted(9);
    }

    // 1. Zuerst prüfen ob Merksatz im SessionContext vorhanden
    if (sessionContext.merksatz) {
      setReflectionProduct({
        merksatz: sessionContext.merksatz,
        profileName: sessionContext.profile?.name || "",
        kontext: ""
      });
      setShowChat(false);
      return;
    }

    // 2. Kein Merksatz vorhanden → Chat anzeigen
    setShowChat(true);
  }, [sessionContext.merksatz, sessionContext.sessionCode, sessionContext.profile]);

  // Auto-scroll zu neuen Nachrichten
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initiale Begrüßung von der KI abrufen (nur wenn Chat angezeigt werden soll)
  useEffect(() => {
    if (showChat && messages.length === 0 && sessionContext.profile) {
      async function initChat() {
        setIsLoading(true);
        try {
          const response = await fetch("/api/reflection-chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              messages: [],
              profile: sessionContext.profile 
            }),
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
              content: "Willkommen zur Reflexion! Es gab einen Fehler beim Laden. Bitte lade die Seite neu.",
            },
          ]);
        } finally {
          setIsLoading(false);
        }
      }
      initChat();
    }
  }, [showChat, messages.length, sessionContext.profile]);

  async function sendMessage() {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/reflection-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: updatedMessages,
          profile: sessionContext.profile 
        }),
      });

      if (!response.ok) {
        throw new Error("Chat-Anfrage fehlgeschlagen");
      }

      const data = await response.json();

      // Prüfen, ob Reflexionsprodukt fertig ist
      if (data.reflectionProduct) {
        setReflectionProduct(data.reflectionProduct);
        // Merksatz in der Datenbank speichern
        await sessionContext.saveMerksatz(data.reflectionProduct.merksatz);
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


  // Prüfung ob Profil vorhanden ist
  if (!sessionContext.profile) {
    return (
      <div className="min-h-screen bg-zinc-50 px-6 pb-16 pt-14">
        <main className="mx-auto w-full max-w-3xl">
          <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center">
            <h2 className="text-2xl font-semibold text-zinc-950">
              Kein Profil gefunden
            </h2>
            <p className="mt-4 text-zinc-600">
              Bitte erstelle zuerst ein Lehrpersonen-Profil in Schritt 3.
            </p>
            <button
              onClick={() => router.push("/step/3")}
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-zinc-950 px-8 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              Zu Schritt 3
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-6 pb-16 pt-14">
      <main className="mx-auto w-full max-w-3xl">
        {!reflectionProduct || showChat ? (
          /* Chat Interface */
          <div className="flex h-[calc(100vh-8rem)] flex-col">
            {/* Header */}
            <div className="mb-4 rounded-xl border border-zinc-200 bg-white p-4">
              <h1 className="text-xl font-semibold text-zinc-950">
                Kurzer Zwischenstopp
              </h1>
              <p className="mt-2 text-sm text-zinc-600">
                Lass uns kurz über deine Erfahrungen sprechen und gemeinsam einen persönlichen 
                Merksatz entwickeln, der deine Erkenntnisse auf den Punkt bringt.
              </p>
            </div>

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
        ) : (
          /* Merksatz-Anzeige */
          <div className="space-y-6">
            {/* Hauptkarte mit Merksatz */}
            <div className="rounded-xl border border-zinc-200 bg-white p-12">
              
              {/* Der Merksatz - groß und prominent */}
              <div className="mb-8">
                <p className="text-2xl leading-relaxed text-zinc-900">
                  {reflectionProduct.merksatz}
                </p>
              </div>

              {/* Kontext */}
              <div className="border-t border-zinc-200 pt-6">
                <p className="text-sm leading-relaxed text-zinc-600">
                  {reflectionProduct.kontext}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setShowChat(true);
                  setReflectionProduct(null);
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-6 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
              >
                Merksatz anpassen
              </button>
              
              <button
                onClick={() => router.push("/step/10")}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-950 px-8 text-sm font-semibold text-white hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-200"
              >
                Weiter →
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
