"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  WARMUP_FEEDBACKS,
  berechneStrategieEmpfehlung,
  type WarmupFeedback,
} from "@/lib/warmup-feedbacks";

// ── Sterne-Anzeige ────────────────────────────────────────────────
function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="16" height="16" viewBox="0 0 24 24"
          fill={s <= value ? "#eab308" : "none"}
          stroke={s <= value ? "#eab308" : "#d1d5db"}
          strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

// ── Feedback-Karte ────────────────────────────────────────────────
function FeedbackCard({
  feedback,
  animDir,
}: {
  feedback: WarmupFeedback;
  animDir: "left" | "right" | null;
}) {
  const slideClass =
    animDir === "right"
      ? "translate-x-[120%] rotate-6 opacity-0"
      : animDir === "left"
      ? "-translate-x-[120%] -rotate-6 opacity-0"
      : "translate-x-0 rotate-0 opacity-100";

  return (
    <div
      className={`transition-all duration-300 ease-in-out ${slideClass}`}
    >
      <div className="rounded-2xl border-2 border-zinc-200 bg-white p-8 shadow-lg">
        {/* Persona */}
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-2xl">
            {feedback.persona.icon}
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-700">
              {feedback.persona.beschreibung}
            </p>
          </div>
          <div className="ml-auto">
            <Stars value={feedback.sterne} />
          </div>
        </div>

        {/* Zitat */}
        <blockquote className="relative">
          <svg
            className="absolute -left-1 -top-2 h-6 w-6 text-zinc-200"
            viewBox="0 0 24 24" fill="currentColor"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <p className="pl-6 text-base leading-relaxed text-zinc-800">
            {feedback.zitat}
          </p>
        </blockquote>
      </div>
    </div>
  );
}

// ── Ergebnis-Ansicht ──────────────────────────────────────────────
function Ergebnis({
  akzeptiert,
  verworfen,
  onRestart,
}: {
  akzeptiert: WarmupFeedback[];
  verworfen: WarmupFeedback[];
  empfehlung: string[];
  onRestart: () => void;
}) {
  const total = WARMUP_FEEDBACKS.length;
  const avgScore = akzeptiert.length > 0
    ? akzeptiert.reduce((sum, f) => sum + f.sterne, 0) / akzeptiert.length
    : 0;
  const avgRounded = Math.round(avgScore * 10) / 10;

  // Google-Maps-style Balken pro Stern
  const sternCounts = [5, 4, 3, 2, 1].map((s) => ({
    sterne: s,
    count: akzeptiert.filter((f) => f.sterne === s).length,
  }));

  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-400">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        <div className="relative px-6 py-14">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-950">
              Danke fürs Mitspielen!
            </h1>
            <p className="mt-2 text-lg text-zinc-800">
              Du hast {akzeptiert.length} von {total} Feedbacks als passend markiert.
            </p>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-zinc-50 px-6">
        <main className="mx-auto w-full max-w-3xl pb-20 pt-14">

          {akzeptiert.length === 0 ? (
            <div className="mb-10 rounded-2xl border-2 border-zinc-200 bg-white p-8 text-center">
              <p className="text-base text-zinc-600">
                Du hast keine Feedbacks als passend markiert. Kein Problem – überlege, welche Reaktionen von deinen Lernenden möglich wären, und versuch es nochmals.
              </p>
              <button onClick={onRestart}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-zinc-800 underline">
                Nochmal spielen
              </button>
            </div>
          ) : (
            <>
              {/* Score-Box à la Google Maps */}
              <section className="mb-10">
                <div className="rounded-2xl border-2 border-zinc-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start gap-8">
                    {/* Grosse Zahl */}
                    <div className="text-center">
                      <div className="text-6xl font-bold text-zinc-950 leading-none">
                        {avgRounded.toFixed(1)}
                      </div>
                      <div className="mt-2">
                        <Stars value={Math.round(avgScore)} />
                      </div>
                      <div className="mt-1 text-xs text-zinc-400">
                        {akzeptiert.length} {akzeptiert.length === 1 ? "Bewertung" : "Bewertungen"}
                      </div>
                    </div>

                    {/* Balken-Diagramm */}
                    <div className="flex-1 space-y-1.5">
                      {sternCounts.map(({ sterne, count }) => (
                        <div key={sterne} className="flex items-center gap-2">
                          <span className="w-4 text-right text-xs text-zinc-500">{sterne}</span>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="#eab308" stroke="none">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                          <div className="flex-1 h-2 rounded-full bg-zinc-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-yellow-400 transition-all"
                              style={{ width: akzeptiert.length > 0 ? `${(count / akzeptiert.length) * 100}%` : "0%" }}
                            />
                          </div>
                          <span className="w-4 text-xs text-zinc-400">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Passende Feedbacks */}
              <section className="mb-10">
                <div className="mb-5 inline-block">
                  <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                    Deine passenden Feedbacks
                  </h2>
                  <div className="mt-2 h-1 w-16 rounded-full bg-yellow-400" />
                </div>
                <div className="space-y-3">
                  {akzeptiert.map((f) => (
                    <div key={f.id}
                      className="rounded-2xl border-2 border-zinc-200 bg-white p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xl">{f.persona.icon}</span>
                        <span className="text-sm text-zinc-500">
                          {f.persona.beschreibung}
                        </span>
                        <div className="ml-auto flex-shrink-0">
                          <Stars value={f.sterne} />
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-zinc-800 italic">
                        "{f.zitat}"
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between">
            <button onClick={onRestart}
              className="text-sm text-zinc-400 hover:text-zinc-700">
              ← Nochmal spielen
            </button>
            <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-700">
              Zur Startseite
            </Link>
          </div>

        </main>
      </div>
    </>
  );
}

// ── Haupt-Komponente ──────────────────────────────────────────────
export default function WarmupPage() {
  const [phase, setPhase] = useState<"intro" | "spiel" | "ergebnis">("intro");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [akzeptiert, setAkzeptiert] = useState<WarmupFeedback[]>([]);
  const [verworfen, setVerworfen] = useState<WarmupFeedback[]>([]);
  const [animDir, setAnimDir] = useState<"left" | "right" | null>(null);

  const total = WARMUP_FEEDBACKS.length;
  const current = WARMUP_FEEDBACKS[currentIdx];
  const empfehlung = berechneStrategieEmpfehlung(akzeptiert.map((f) => f.id));
  const handleEntscheidung = useCallback(
    (passt: boolean) => {
      if (animDir) return; // Verhindert Doppelklick während Animation
      setAnimDir(passt ? "right" : "left");

      setTimeout(() => {
        if (passt) {
          setAkzeptiert((prev) => [...prev, current]);
        } else {
          setVerworfen((prev) => [...prev, current]);
        }

        setAnimDir(null);

        if (currentIdx + 1 >= total) {
          setPhase("ergebnis");
        } else {
          setCurrentIdx((i) => i + 1);
        }
      }, 280);
    },
    [animDir, current, currentIdx, total]
  );

  function restart() {
    setPhase("intro");
    setCurrentIdx(0);
    setAkzeptiert([]);
    setVerworfen([]);
    setAnimDir(null);
  }

  // ── Intro ──
  if (phase === "intro") {
    return (
      <>
        <div className="relative overflow-hidden bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-400">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
          <div className="relative px-6 py-16">
            <div className="mx-auto max-w-4xl">
              <h1 className="text-5xl font-bold tracking-tight text-zinc-950">
                Warmup
              </h1>
              <p className="mt-2 text-xl font-semibold text-zinc-800">
                Welche Feedbacks passen zu deiner Unterrichtssituation?
              </p>
              <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-800">
                Du siehst gleich {total} Feedbacks von unterschiedlichen Lernenden-Typen.
                Entscheide bei jeder Karte: Könnte dieses Feedback von deinen Lernenden
                kommen – passt es zu der Situation, die du reflektieren möchtest?
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <button
                  onClick={() => setPhase("spiel")}
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-8 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-zinc-800"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
                  </svg>
                  Starten
                </button>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4">
                <div className="rounded-xl bg-white/80 p-4 backdrop-blur">
                  <div className="text-3xl font-bold text-zinc-950">{total}</div>
                  <div className="mt-1 text-sm font-medium text-zinc-700">Feedback-Karten</div>
                </div>
                <div className="rounded-xl bg-white/80 p-4 backdrop-blur">
                  <div className="text-3xl font-bold text-zinc-950">7</div>
                  <div className="mt-1 text-sm font-medium text-zinc-700">Lernenden-Typen</div>
                </div>
                <div className="rounded-xl bg-white/80 p-4 backdrop-blur">
                  <div className="text-3xl font-bold text-zinc-950">5</div>
                  <div className="mt-1 text-sm font-medium text-zinc-700">Reflexionsstrategien</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-50 px-6 py-12">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { icon: "👁", title: "Lesen", text: "Lies das Feedback aufmerksam. Wer könnte das so sagen?" },
                { icon: "🤔", title: "Einschätzen", text: "Könnte dieses Feedback von jemandem aus deiner Klasse kommen?" },
                { icon: "✓ / ✗", title: "Entscheiden", text: "Passt – oder passt nicht. Es gibt kein Richtig oder Falsch." },
              ].map((step) => (
                <div key={step.title}
                  className="group rounded-2xl border-2 border-zinc-200 bg-white p-6 transition-all hover:border-yellow-400 hover:shadow-lg">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-100 text-xl transition-all group-hover:bg-yellow-400">
                    {step.icon}
                  </div>
                  <h3 className="text-base font-semibold text-zinc-950">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Ergebnis ──
  if (phase === "ergebnis") {
    return (
      <Ergebnis
        akzeptiert={akzeptiert}
        verworfen={verworfen}
        empfehlung={empfehlung}
        onRestart={restart}
      />
    );
  }

  // ── Spiel ──
  const progress = Math.round((currentIdx / total) * 100);

  return (
    <div className="min-h-screen bg-zinc-50 px-6">
      <main className="mx-auto w-full max-w-xl pb-16 pt-10">

        {/* Fortschritt */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-sm text-zinc-500">
            <span>Karte {currentIdx + 1} von {total}</span>
            <span>{akzeptiert.length} passend</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-zinc-200">
            <div
              className="h-1.5 rounded-full bg-zinc-950 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Karte */}
        <div className="overflow-hidden">
          <FeedbackCard feedback={current} animDir={animDir} />
        </div>

        {/* Buttons */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <button
            onClick={() => handleEntscheidung(false)}
            disabled={!!animDir}
            className="group flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-zinc-200 bg-white py-5 font-semibold text-zinc-500 shadow-sm transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Passt nicht
          </button>

          <button
            onClick={() => handleEntscheidung(true)}
            disabled={!!animDir}
            className="group flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-zinc-200 bg-white py-5 font-semibold text-zinc-500 shadow-sm transition-all hover:border-green-300 hover:bg-green-50 hover:text-green-600 disabled:opacity-50"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Passt zu mir
          </button>
        </div>

        {/* Keyboard-Hint */}
        <p className="mt-5 text-center text-xs text-zinc-400">
          Oder: Pfeiltaste ← für "Passt nicht" · → für "Passt zu mir"
        </p>

        {/* Keyboard-Support */}
        <KeyboardHandler onLeft={() => handleEntscheidung(false)} onRight={() => handleEntscheidung(true)} />

      </main>
    </div>
  );
}

// ── Keyboard-Handler ──────────────────────────────────────────────
function KeyboardHandler({
  onLeft,
  onRight,
}: {
  onLeft: () => void;
  onRight: () => void;
}) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") onLeft();
      if (e.key === "ArrowRight") onRight();
    },
    [onLeft, onRight]
  );

  // Attach on mount
  if (typeof window !== "undefined") {
    // Remove old listener if any, then add new
    window.onkeydown = handleKey;
  }

  return null;
}
