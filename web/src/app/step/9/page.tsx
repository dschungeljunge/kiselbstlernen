/**
 * Step 9 – Reflexions-Chat (Merksatz entwickeln)
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
  const router = useRouter();
  const { profile, sessionCode, updateProgress, markStepCompleted } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reflectionProduct, setReflectionProduct] = useState<ReflectionProduct | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (sessionCode) {
      updateProgress(9);
    }
  }, [sessionCode, updateProgress]);

  // Chat initialisieren
  useEffect(() => {
    if (messages.length === 0 && profile) {
      initChat();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

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

  async function sendMessage() {
    if (!input.trim() || isLoading || !profile) return;

    const userMsg: Message = { role: "user", content: input };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
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
          // Merksatz speichern
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

  return (
    <div className="min-h-screen bg-zinc-50 px-6 pb-16 pt-14">
      <main className="mx-auto w-full max-w-3xl">
        {!reflectionProduct ? (
          <div className="flex h-[calc(100vh-8rem)] flex-col">
            <div className="mb-3 rounded-xl border border-zinc-200 bg-white p-4">
              <p className="text-sm font-semibold text-zinc-900">Reflexionsgespräch</p>
              <p className="text-xs text-zinc-500">Entwickle gemeinsam mit der KI deinen persönlichen Merksatz</p>
            </div>

            <div className="mb-4 flex-1 overflow-y-auto rounded-xl border border-zinc-200 bg-white p-6">
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-6 ${
                      msg.role === "user" ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-900"
                    }`}>
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="rounded-xl bg-zinc-100 px-4 py-3">
                      <div className="flex gap-1.5">
                        {[0,1,2].map(i => (
                          <div key={i} className="h-2 w-2 animate-bounce rounded-full bg-zinc-400"
                            style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Deine Antwort..."
                disabled={isLoading}
                className="flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm focus:border-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-100 disabled:opacity-60"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-950 px-6 text-sm font-semibold text-white disabled:opacity-60"
              >
                Senden
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-8 text-center">
              <h2 className="mb-2 text-2xl font-bold text-zinc-950">Dein Merksatz</h2>
              <blockquote className="mt-4 text-xl font-medium italic text-zinc-800">
                "{reflectionProduct.merksatz}"
              </blockquote>
              <p className="mt-4 text-sm text-zinc-600">{reflectionProduct.kontext}</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => router.push("/step/10")}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-950 px-8 text-sm font-semibold text-white hover:bg-zinc-800"
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
