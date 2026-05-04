"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useReflexion } from "@/contexts/ReflexionContext";
import { PhaseTimer } from "@/components/reflexion/PhaseTimer";
import { InteractiveQuestionField } from "@/components/reflexion/InteractiveQuestion";
import { DIMENSIONS, type DimensionCode } from "@/lib/reflexion-redesign";

function Rating({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          onClick={() => onChange(rating)}
          className={`h-10 w-10 rounded-full border text-sm font-bold transition ${
            value === rating
              ? "border-yellow-400 bg-yellow-400 text-zinc-950"
              : "border-zinc-200 bg-white text-zinc-600 hover:border-yellow-300"
          }`}
        >
          {rating}
        </button>
      ))}
    </div>
  );
}

export default function DimensionenPage(
  props: PageProps<"/reflexion/dimensionen">,
) {
  use(props.params);
  use(props.searchParams);
  const router = useRouter();
  const { lesson, updateDimension, saveToDatabase, isSaving } = useReflexion();
  const completedCount = DIMENSIONS.filter(
    (dimension) => lesson.dimensions[dimension.code]?.completed,
  ).length;

  async function handleContinue() {
    await saveToDatabase();
    router.push("/reflexion/fazit");
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-6">
      <PhaseTimer minutes={20} />
      <main className="mx-auto w-full max-w-4xl pb-16 pt-12">
        <p className="text-sm font-medium text-zinc-500">Phase 2 von 4</p>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-950">
              Reflexion anhand der fünf Dimensionen
            </h1>
            <p className="mt-2 max-w-2xl text-base text-zinc-600">
              Pro Dimension findest du eine Kernfrage, drei kurze
              Mini-Fragen und zwei offene Felder.
            </p>
          </div>
          <div className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-zinc-700 shadow-sm">
            {completedCount}/{DIMENSIONS.length} abgeschlossen
          </div>
        </div>

        <div className="mt-8 space-y-8">
          {DIMENSIONS.map((dimension) => {
            const data = lesson.dimensions[dimension.code];
            const interactiveAnswers = data?.interactiveAnswers ?? {};
            return (
              <section
                key={dimension.code}
                className={`overflow-hidden rounded-2xl border border-zinc-200 shadow-sm ${
                  data?.completed ? "bg-zinc-100" : "bg-white"
                }`}
              >
                <header className="border-b border-zinc-100 bg-zinc-50 px-6 py-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-yellow-400 text-lg font-bold text-zinc-950">
                        {dimension.letter}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-zinc-950">
                          {dimension.title}
                        </h2>
                        <p className="text-sm text-zinc-500">
                          {dimension.subtitle}
                        </p>
                      </div>
                    </div>
                    {data?.completed && (
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-900">
                        abgeschlossen
                      </span>
                    )}
                  </div>
                  <blockquote className="mt-4 border-l-4 border-yellow-400 bg-white px-4 py-3 text-base italic leading-snug text-zinc-800">
                    {dimension.kernfrage}
                  </blockquote>
                  <p className="mt-3 text-xs leading-5 text-zinc-500">
                    {dimension.intro}
                  </p>
                </header>

                <div className="space-y-8 p-6">
                  <div className="grid gap-6 md:grid-cols-2 md:items-start">
                    <div>
                      <div className="aspect-video overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
                        <iframe
                          src={dimension.loomUrl}
                          allowFullScreen
                          className="h-full w-full"
                          title={`Loom-Video ${dimension.title}`}
                        />
                      </div>
                      <p className="mt-2 text-xs text-zinc-500">
                        Loom-URL ist konfigurierbar.
                      </p>
                    </div>

                    <div className="space-y-5">
                      <label className="block text-sm font-semibold text-zinc-700">
                        {dimension.choice.label}
                        <select
                          value={data?.choices?.[dimension.choice.id] ?? ""}
                          onChange={(event) =>
                            updateDimension(dimension.code, {
                              choices: {
                                [dimension.choice.id]: event.target.value,
                              },
                            })
                          }
                          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none"
                        >
                          <option value="">Bitte wählen</option>
                          {dimension.choice.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>

                      <div>
                        <p className="text-sm font-semibold text-zinc-700">
                          {dimension.ratingLabel}
                        </p>
                        <div className="mt-2">
                          <Rating
                            value={data?.rating ?? 0}
                            onChange={(rating) =>
                              updateDimension(dimension.code, { rating })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                      Mini-Fragen
                    </h3>
                    <div className="mt-3 space-y-4">
                      {dimension.interactiveQuestions.map((question) => (
                        <InteractiveQuestionField
                          key={question.id}
                          question={question}
                          value={interactiveAnswers[question.id]}
                          onChange={(nextValue) =>
                            updateDimension(dimension.code, {
                              interactiveAnswers: {
                                [question.id]: nextValue,
                              },
                            })
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                      Offene Reflexion
                    </h3>
                    <div className="mt-3 grid gap-4 md:grid-cols-2">
                      {dimension.questions.map((question) => (
                        <label
                          key={question.id}
                          className="block text-sm font-medium text-zinc-700"
                        >
                          {question.label}
                          <textarea
                            value={data?.answers?.[question.id] ?? ""}
                            onChange={(event) =>
                              updateDimension(dimension.code, {
                                answers: {
                                  [question.id]: event.target.value,
                                },
                              })
                            }
                            rows={4}
                            placeholder={question.placeholder}
                            className="mt-1 w-full resize-none rounded-lg border border-zinc-300 px-3 py-2 text-sm leading-6 focus:border-yellow-500 focus:outline-none"
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        updateDimension(dimension.code as DimensionCode, {
                          completed: true,
                        })
                      }
                      className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800"
                    >
                      Dimension abschliessen
                    </button>
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={handleContinue}
            disabled={isSaving}
            className="inline-flex h-12 items-center justify-center rounded-xl bg-zinc-950 px-8 text-sm font-semibold text-white shadow-md transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Speichere..." : "Weiter zu Phase 3"}
          </button>
        </div>
      </main>
    </div>
  );
}
