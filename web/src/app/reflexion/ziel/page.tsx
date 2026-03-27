"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useReflexion } from "@/contexts/ReflexionContext";
import { generateContextMarkdown } from "@/lib/export-context";
import type { Message } from "@/contexts/ReflexionContext";

// ── Sterne ────────────────────────────────────────────────────────
function Stars({ value }: { value: number }) {
  return (
    <span className="text-yellow-500">
      {"★".repeat(value)}{"☆".repeat(5 - value)}
    </span>
  );
}

// ── Kontext-Vorschau ──────────────────────────────────────────────
function KontextVorschau({
  profile,
  situation,
  strategies,
}: {
  profile: ReturnType<typeof useReflexion>["profile"];
  situation: ReturnType<typeof useReflexion>["situation"];
  strategies: ReturnType<typeof useReflexion>["strategies"];
}) {
  const [open, setOpen] = useState(false);
  const completed = Object.entries(strategies).filter(([, d]) => d.abgeschlossen);

  return (
    <div className="mb-6 rounded-xl border border-zinc-200 bg-white shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900">Dein Kontext-Stack</p>
            <p className="text-xs text-zinc-500">
              {profile ? profile.name : "Kein Profil"} · {completed.length} Reflexion{completed.length !== 1 ? "en" : ""} abgeschlossen
            </p>
          </div>
        </div>
        <svg
          className={`h-4 w-4 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-zinc-100 px-5 pb-5 pt-4 space-y-4">
          {profile && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-1">Profil</p>
              <p className="text-sm text-zinc-700"><span className="font-medium">{profile.name}</span> · {profile.description}</p>
            </div>
          )}
          {situation && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-1">Situation</p>
              <p className="text-sm text-zinc-700 line-clamp-3">{situation.kiZusammenfassung || situation.text}</p>
            </div>
          )}
          {completed.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-2">Reflexionen</p>
              <div className="space-y-1.5">
                {completed.map(([code, data]) => (
                  <div key={code} className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-yellow-100 text-xs font-bold text-yellow-700">{code.toUpperCase()}</span>
                    <Stars value={data.selbsteinschaetzung} />
                    <span className="text-xs text-zinc-500">{data.selbsteinschaetzung}/5</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <p className="text-xs text-zinc-400 italic">
            Das ist der Kontext, den die KI kennt – beim Ziel auf der Plattform automatisch, beim Export manuell eingefügt.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Zielkarte ─────────────────────────────────────────────────────
function Zielkarte({
  kontext,
  absicht,
  massnahme,
  termin,
  zielsatz,
}: {
  kontext: string;
  absicht: string;
  massnahme: string;
  termin: string;
  zielsatz: string;
}) {
  return (
    <div className="rounded-2xl border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-white p-8 shadow-lg print:shadow-none">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400 text-zinc-900">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-zinc-950">Mein KI-Ziel</h2>
        <span className="ml-auto text-xs text-zinc-400">{new Date().toLocaleDateString("de-CH")}</span>
      </div>

      {zielsatz && (
        <blockquote className="mb-6 rounded-xl bg-white px-5 py-4 shadow-sm">
          <p className="text-base font-medium leading-relaxed text-zinc-900 italic">"{zielsatz}"</p>
        </blockquote>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { label: "Kontext", value: kontext, icon: "📍" },
          { label: "Absicht", value: absicht, icon: "🎯" },
          { label: "Massnahme", value: massnahme, icon: "🔧" },
          { label: "Termin", value: termin, icon: "📅" },
        ].map(({ label, value, icon }) => (
          <div key={label} className="rounded-lg bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">{icon} {label}</p>
            <p className="mt-0.5 text-sm text-zinc-800">{value || <span className="text-zinc-400 italic">nicht angegeben</span>}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Haupt-Seite ───────────────────────────────────────────────────
export default function ZielPage() {
  const { profile, situation, strategies, ziel, updateZiel, saveToDatabase } = useReflexion();

  const [phase, setPhase] = useState<"start" | "chat" | "form" | "karte">(
    ziel?.abgeschlossen ? "karte" : "start"
  );
  const [messages, setMessages] = useState<Message[]>(ziel?.chatHistory ?? []);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatStarted, setChatStarted] = useState(messages.length > 0);
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");

  const [kontext, setKontext] = useState(ziel?.kontext ?? "");
  const [absicht, setAbsicht] = useState(ziel?.absicht ?? "");
  const [massnahme, setMassnahme] = useState(ziel?.massnahme ?? "");
  const [termin, setTermin] = useState(ziel?.termin ?? "");
  const [zielsatz, setZielsatz] = useState(ziel?.zielsatz ?? "");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const completedCount = Object.values(strategies).filter((d) => d.abgeschlossen).length;

  // Chat starten
  const initChat = useCallback(async () => {
    if (chatStarted) return;
    setChatStarted(true);
    setIsChatLoading(true);
    try {
      const res = await fetch("/api/reflection/ziel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [], profile, situation, strategies }),
      });
      const data = await res.json();
      const firstMsg: Message = { role: "assistant", content: data.message };
      setMessages([firstMsg]);
      updateZiel({ chatHistory: [firstMsg] });
    } catch {
      setMessages([{ role: "assistant", content: "Entschuldigung, bitte lade die Seite neu." }]);
    } finally {
      setIsChatLoading(false);
    }
  }, [chatStarted, profile, situation, strategies, updateZiel]);

  const sendMessage = useCallback(async () => {
    if (!chatInput.trim() || isChatLoading) return;
    const userMsg: Message = { role: "user", content: chatInput };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setChatInput("");
    setIsChatLoading(true);
    try {
      const res = await fetch("/api/reflection/ziel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated, profile, situation, strategies }),
      });
      const data = await res.json();
      const assistantMsg: Message = { role: "assistant", content: data.message };
      const withAssistant = [...updated, assistantMsg];
      setMessages(withAssistant);
      updateZiel({ chatHistory: withAssistant });
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Fehler – bitte erneut versuchen." }]);
    } finally {
      setIsChatLoading(false);
    }
  }, [chatInput, isChatLoading, messages, profile, situation, strategies, updateZiel]);

  const handleCopyContext = useCallback(async () => {
    const markdown = generateContextMarkdown(profile, situation, strategies);
    await navigator.clipboard.writeText(markdown);
    setCopyState("copied");
    setTimeout(() => setCopyState("idle"), 2500);
  }, [profile, situation, strategies]);

  const handleSaveZiel = useCallback(async () => {
    updateZiel({ kontext, absicht, massnahme, termin, zielsatz, abgeschlossen: true });
    await saveToDatabase();
    setPhase("karte");
  }, [kontext, absicht, massnahme, termin, zielsatz, updateZiel, saveToDatabase]);

  const canSave = kontext.trim() && absicht.trim();

  // ── Start-Phase ──────────────────────────────────────────────────
  if (phase === "start") {
    return (
      <div className="min-h-screen bg-zinc-50 px-6">
        <main className="mx-auto w-full max-w-3xl pb-16 pt-14">
          <Link href="/reflexion/hub" className="mb-8 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Zurück zum Überblick
          </Link>

          <div className="mb-8">
            <p className="text-sm font-medium text-zinc-500">Teil 4 – Abschluss</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-950">Mein persönliches KI-Ziel</h1>
            <p className="mt-2 text-base text-zinc-600">
              Du hast heute {completedCount > 0 ? `${completedCount} Perspektive${completedCount !== 1 ? "n" : ""} reflektiert` : "reflektiert"}.
              Jetzt geht es darum, was du konkret als nächstes anders machst.
            </p>
          </div>

          <KontextVorschau profile={profile} situation={situation} strategies={strategies} />

          {/* Zwei Wege */}
          <div className="grid gap-4 sm:grid-cols-2">
            <button
              onClick={() => { setPhase("chat"); setTimeout(initChat, 50); }}
              className="group flex flex-col rounded-2xl border-2 border-zinc-200 bg-white p-6 text-left transition-all hover:border-yellow-400 hover:shadow-lg"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700 transition-all group-hover:bg-yellow-400 group-hover:text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-zinc-950">Hier auf der Plattform</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                KI kennt deinen Kontext automatisch und hilft dir, ein situiertes Ziel zu erarbeiten.
              </p>
              <span className="mt-4 text-xs font-medium text-yellow-600">Empfohlen →</span>
            </button>

            <button
              onClick={handleCopyContext}
              className="group flex flex-col rounded-2xl border-2 border-zinc-200 bg-white p-6 text-left transition-all hover:border-zinc-400 hover:shadow-lg"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 transition-all group-hover:bg-zinc-200">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </div>
              <h3 className="font-semibold text-zinc-950">Kontext exportieren</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                Kopiere deinen Kontext und arbeite in ChatGPT, Copilot oder Claude.
              </p>
              <span className="mt-4 text-xs font-medium text-zinc-500">
                {copyState === "copied" ? "✓ Kopiert!" : "Kontext in Zwischenablage →"}
              </span>
            </button>
          </div>

          {completedCount === 0 && (
            <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Du hast noch keine Strategie abgeschlossen. Das Ziel lässt sich trotzdem ableiten – aber mit mehr Reflexion wird es präziser.
            </p>
          )}

          {/* Direkt zum Formular */}
          <button
            onClick={() => setPhase("form")}
            className="mt-6 text-sm text-zinc-400 hover:text-zinc-700"
          >
            Ziel direkt ohne Chat eingeben →
          </button>
        </main>
      </div>
    );
  }

  // ── Chat-Phase ────────────────────────────────────────────────────
  if (phase === "chat") {
    return (
      <div className="min-h-screen bg-zinc-50 px-6">
        <main className="mx-auto w-full max-w-3xl pb-16 pt-14">
          <button onClick={() => setPhase("start")} className="mb-8 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Zurück
          </button>

          <h1 className="mb-6 text-2xl font-bold text-zinc-950">Ziel ableiten – mit KI</h1>

          <div className="mb-6 rounded-xl border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-100 px-5 py-3">
              <p className="text-sm font-semibold text-zinc-700">Context Engineering in Aktion</p>
              <p className="text-xs text-zinc-500 mt-0.5">Die KI kennt dein Profil, deine Situation und deine Reflexionsergebnisse.</p>
            </div>

            <div className="max-h-[28rem] overflow-y-auto p-5">
              <div className="space-y-4">
                {!chatStarted && (
                  <div className="flex justify-center py-8">
                    <button
                      onClick={initChat}
                      className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
                    >
                      Gespräch starten
                    </button>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user" ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-900"}`}>
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="rounded-xl bg-zinc-100 px-4 py-3">
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <div key={i} className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {chatStarted && (
              <div className="border-t border-zinc-100 p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    placeholder="Deine Antwort..."
                    disabled={isChatLoading}
                    className="flex-1 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-100 disabled:opacity-60"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!chatInput.trim() || isChatLoading}
                    className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-950 px-5 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    Senden
                  </button>
                </div>
                {messages.length >= 3 && (
                  <button
                    onClick={() => setPhase("form")}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    Ziel jetzt festhalten
                  </button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // ── Formular-Phase ────────────────────────────────────────────────
  if (phase === "form") {
    return (
      <div className="min-h-screen bg-zinc-50 px-6">
        <main className="mx-auto w-full max-w-3xl pb-16 pt-14">
          <button onClick={() => setPhase(messages.length > 0 ? "chat" : "start")} className="mb-8 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Zurück
          </button>

          <h1 className="mb-2 text-2xl font-bold text-zinc-950">Mein KI-Ziel festhalten</h1>
          <p className="mb-8 text-sm text-zinc-600">Fülle mindestens Kontext und Absicht aus. Der Rest ist optional, aber hilfreich.</p>

          <div className="space-y-5">
            {[
              { key: "kontext", label: "📍 Kontext", placeholder: "In welchem Fach / welcher Klasse?", value: kontext, set: setKontext, required: true },
              { key: "absicht", label: "🎯 Absicht", placeholder: "Was werde ich konkret anders machen?", value: absicht, set: setAbsicht, required: true },
              { key: "massnahme", label: "🔧 Massnahme", placeholder: "Welche konkrete technische oder didaktische Änderung nehme ich vor?", value: massnahme, set: setMassnahme, required: false },
              { key: "termin", label: "📅 Termin", placeholder: "Bis wann? In welcher Unterrichtseinheit?", value: termin, set: setTermin, required: false },
            ].map(({ key, label, placeholder, value, set, required }) => (
              <div key={key}>
                <label className="mb-1.5 block text-sm font-semibold text-zinc-800">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  placeholder={placeholder}
                  rows={2}
                  className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-100"
                />
              </div>
            ))}

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-zinc-800">
                ✍️ Formulierter Zielsatz{" "}
                <span className="text-xs font-normal text-zinc-500">(optional – kann aus dem Gespräch übernommen werden)</span>
              </label>
              <textarea
                value={zielsatz}
                onChange={(e) => setZielsatz(e.target.value)}
                placeholder="Ich werde in [Fach] mit [Klasse] die KI so einsetzen, dass..."
                rows={3}
                className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-100"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSaveZiel}
              disabled={!canSave}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-8 text-sm font-semibold text-white shadow transition hover:bg-zinc-800 disabled:opacity-40"
            >
              Ziel speichern & Zielkarte anzeigen
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ── Zielkarte-Phase ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-zinc-50 px-6">
      <main className="mx-auto w-full max-w-3xl pb-16 pt-14">
        <Link href="/reflexion/hub" className="mb-8 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Zurück zum Überblick
        </Link>

        <div className="mb-8">
          <p className="text-sm font-medium text-zinc-500">Abgeschlossen</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-950">Dein KI-Ziel</h1>
          <p className="mt-2 text-base text-zinc-600">
            Gut gemacht. Dieses Ziel basiert auf deiner heutigen Reflexion.
          </p>
        </div>

        <Zielkarte
          kontext={ziel?.kontext ?? kontext}
          absicht={ziel?.absicht ?? absicht}
          massnahme={ziel?.massnahme ?? massnahme}
          termin={ziel?.termin ?? termin}
          zielsatz={ziel?.zielsatz ?? zielsatz}
        />

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => window.print()}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
            </svg>
            Zielkarte drucken
          </button>
          <button
            onClick={() => setPhase("form")}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50"
          >
            Ziel anpassen
          </button>
        </div>

        <div className="mt-10 rounded-xl border border-zinc-200 bg-white p-6">
          <p className="text-sm font-semibold text-zinc-950 mb-1">Was jetzt?</p>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Drucke deine Zielkarte aus oder fotografiere sie. Setze dir eine Erinnerung für die angegebene Unterrichtseinheit.
            Wenn du das Ziel umgesetzt hast, kannst du eine neue Reflexion starten.
          </p>
        </div>
      </main>
    </div>
  );
}
