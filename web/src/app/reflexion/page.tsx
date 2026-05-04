"use client";

import { use } from "react";
import Link from "next/link";
import { useReflexion } from "@/contexts/ReflexionContext";
import { DIMENSIONS } from "@/lib/reflexion-redesign";

export default function ReflexionLandingPage(
  props: PageProps<"/reflexion">,
) {
  use(props.params);
  use(props.searchParams);
  const { profile, sessionCode, lesson, isLoading } = useReflexion();
  const completedDimensions = DIMENSIONS.filter(
    (dimension) => lesson.dimensions[dimension.code]?.completed
  ).length;
  const hasDescription = lesson.description.beschreibung.trim().length > 0;
  const hasConclusion = lesson.conclusion.completed;

  return (
    <div className="min-h-screen bg-zinc-50 px-6">
      <main className="mx-auto w-full max-w-4xl pb-16 pt-14">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400 shadow-md">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-950">
            Reflexion meines KI-Einsatzes
          </h1>
          <p className="mt-3 text-lg text-zinc-600">
            Vier Phasen von der dokumentierten Unterrichtseinheit bis zum Fazit
          </p>
          <div className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-sm">
            <div className="aspect-video">
              <iframe
                src="https://www.loom.com/embed/38e5aa125cf5495490e4c4425b2f9c93"
                title="Kurze Übersicht: Arbeitsauftrag Reflexion"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </div>
        </div>

        {!isLoading && (
          <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            {profile && sessionCode ? (
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-yellow-100">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#92400e"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Profil geladen
                  </p>
                  <p className="mt-0.5 text-base font-semibold text-zinc-900">
                    {profile.name}
                  </p>
                  <p className="mt-1 text-sm text-zinc-600 line-clamp-2">
                    {profile.description}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-zinc-100">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#71717a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4M12 16h.01" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    Kein Lern-Code erkannt
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">
                    Die Reflexion funktioniert auch ohne Profil. Für eine
                    personalisierte Erfahrung gib deinen Lern-Code auf der
                    Startseite ein.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mb-8 space-y-4 rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-zinc-950">
            Ablauf
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-zinc-700">
            <p>
              Du dokumentierst zuerst deine umgesetzte Unterrichtseinheit. Danach
              reflektierst du sie anhand von fünf Dimensionen mit kurzen Video-Impulsen.
              Erst am Schluss bündelt ein KI-Chat deine Angaben zu einem Fazit.
            </p>
          </div>

          <ol className="space-y-4 pt-2">
            {[
              {
                step: "1",
                title: "Unterrichtseinheit beschreiben",
                desc: "Beruf, Lerngruppe, Thema, KI-Tools, Ziel, Material und Verlauf werden strukturiert erfasst.",
                done: hasDescription,
              },
              {
                step: "2",
                title: "Fünf Dimensionen reflektieren",
                desc: "Jede Dimension enthält ein Loom-Video, konkrete Leitfragen und eine Einschätzung.",
                done: completedDimensions === DIMENSIONS.length,
              },
              {
                step: "3",
                title: "Abschluss-KI-Chat",
                desc: "Ein einziger KI-Chat zieht alle bisherigen Informationen zusammen und formuliert ein Fazit.",
                done: hasConclusion,
              },
              {
                step: "4",
                title: "Evaluation",
                desc: "Zum Abschluss folgt die Selbsteinschätzung für den dritten Messzeitpunkt.",
                done: false,
              },
            ].map((item) => (
              <li key={item.step} className="flex gap-4">
                <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  item.done ? "bg-yellow-400 text-zinc-950" : "bg-zinc-950 text-white"
                }`}>
                  {item.done ? "✓" : item.step}
                </div>
                <div>
                  <p className="font-semibold text-zinc-900">{item.title}</p>
                  <p className="mt-0.5 text-sm text-zinc-600">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="grid gap-3 md:grid-cols-1">
          <Link
            href="/reflexion/beschreibung"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-zinc-950 px-5 text-sm font-semibold text-white shadow-md transition hover:bg-zinc-800"
          >
            Reflexion starten
          </Link>
        </div>
      </main>
    </div>
  );
}
