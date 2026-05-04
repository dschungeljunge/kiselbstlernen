"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useReflexion } from "@/contexts/ReflexionContext";
import { PhaseTimer } from "@/components/reflexion/PhaseTimer";
import {
  DURATION_OPTIONS,
  KI_TOOL_OPTIONS,
  SOZIALFORM_OPTIONS,
  type LessonDescriptionData,
} from "@/lib/reflexion-redesign";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-medium text-zinc-700">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}

export default function BeschreibungPage(
  props: PageProps<"/reflexion/beschreibung">,
) {
  use(props.params);
  use(props.searchParams);
  const router = useRouter();
  const { lesson, updateDescription, saveToDatabase, isSaving } = useReflexion();
  const description = lesson.description;

  function setValue<K extends keyof LessonDescriptionData>(
    key: K,
    value: LessonDescriptionData[K],
  ) {
    updateDescription({ [key]: value } as Partial<LessonDescriptionData>);
  }

  function toggleTool(tool: string) {
    const tools = description.tools.includes(tool)
      ? description.tools.filter((item) => item !== tool)
      : [...description.tools, tool];
    setValue("tools", tools);
  }

  async function handleContinue() {
    await saveToDatabase();
    router.push("/reflexion/dimensionen");
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-6">
      <PhaseTimer minutes={10} />
      <main className="mx-auto w-full max-w-4xl pb-16 pt-12">
        <p className="text-sm font-medium text-zinc-500">Phase 1 von 4</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-950">
          Unterrichtseinheit beschreiben
        </h1>
        <p className="mt-2 max-w-2xl text-base text-zinc-600">
          Erfasse die wichtigsten Eckdaten deines KI-Einsatzes. Diese Angaben
          bilden später den Kontext für die fünf Dimensionen und den Abschluss-Chat.
        </p>

        <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Titel der Einheit">
              <input
                value={description.title}
                onChange={(event) => setValue("title", event.target.value)}
                placeholder="z. B. Bewerbungsschreiben mit KI überarbeiten"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none"
              />
            </Field>

            <Field label="Beruf / Bildungsgang">
              <input
                value={description.beruf}
                onChange={(event) => setValue("beruf", event.target.value)}
                placeholder="z. B. Detailhandel, Informatik, Pflege"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none"
              />
            </Field>

            <Field label="Fach / Bereich">
              <input
                value={description.fachbereich}
                onChange={(event) => setValue("fachbereich", event.target.value)}
                placeholder="z. B. ABU, Deutsch, Pflege, Wirtschaft"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none"
              />
            </Field>

            <Field label="Lerngruppe">
              <input
                value={description.lerngruppe}
                onChange={(event) => setValue("lerngruppe", event.target.value)}
                placeholder="z. B. 2. Lehrjahr, 18 Lernende"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none"
              />
            </Field>

            <Field label="Thema">
              <input
                value={description.thema}
                onChange={(event) => setValue("thema", event.target.value)}
                placeholder="Worum ging es inhaltlich?"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none"
              />
            </Field>

            <Field label="Dauer">
              <select
                value={description.dauer}
                onChange={(event) => setValue("dauer", event.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none"
              >
                <option value="">Bitte wählen</option>
                {DURATION_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Sozialform">
              <select
                value={description.sozialform}
                onChange={(event) => setValue("sozialform", event.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none"
              >
                <option value="">Bitte wählen</option>
                {SOZIALFORM_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
                <option value="Sonstiges">Sonstiges</option>
              </select>
            </Field>

            <Field label="Ziel des KI-Einsatzes">
              <input
                value={description.ziel}
                onChange={(event) => setValue("ziel", event.target.value)}
                placeholder="Was sollte durch KI möglich oder besser werden?"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none"
              />
            </Field>
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium text-zinc-700">Genutzte KI-Tools</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {KI_TOOL_OPTIONS.map((tool) => {
                const active = description.tools.includes(tool);
                return (
                  <button
                    key={tool}
                    type="button"
                    onClick={() => toggleTool(tool)}
                    className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                      active
                        ? "border-yellow-400 bg-yellow-100 text-yellow-900"
                        : "border-zinc-200 bg-white text-zinc-700 hover:border-yellow-300"
                    }`}
                  >
                    {tool}
                  </button>
                );
              })}
            </div>
            <input
              value={description.weitereTools}
              onChange={(event) => setValue("weitereTools", event.target.value)}
              placeholder="Weitere Tools oder genaue Versionen"
              className="mt-3 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none"
            />
          </div>

          <div className="mt-6 grid gap-5">
            <Field label="Kurze Beschreibung der Durchführung">
              <textarea
                value={description.beschreibung}
                onChange={(event) => setValue("beschreibung", event.target.value)}
                rows={6}
                placeholder="Was hast du vorbereitet? Was haben die Lernenden konkret gemacht? Wie wurde KI eingesetzt?"
                className="w-full resize-none rounded-lg border border-zinc-300 px-3 py-2 text-sm leading-6 focus:border-yellow-500 focus:outline-none"
              />
            </Field>

            <Field label="Prompt">
              <textarea
                value={description.prompts}
                onChange={(event) => setValue("prompts", event.target.value)}
                rows={4}
                placeholder="Optional: zentrale Prompts, Arbeitsauftrag, Kriterienraster..."
                className="w-full resize-none rounded-lg border border-zinc-300 px-3 py-2 text-sm leading-6 focus:border-yellow-500 focus:outline-none"
              />
            </Field>

            <Field label="Besonderheiten oder Beobachtungen">
              <textarea
                value={description.besonderheiten}
                onChange={(event) => setValue("besonderheiten", event.target.value)}
                rows={4}
                placeholder="Was fällt dir als erstes ein, wenn du über die Unterrichtssituation nachdenkst?"
                className="w-full resize-none rounded-lg border border-zinc-300 px-3 py-2 text-sm leading-6 focus:border-yellow-500 focus:outline-none"
              />
            </Field>
          </div>
        </section>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleContinue}
            disabled={isSaving}
            className="inline-flex h-12 items-center justify-center rounded-xl bg-zinc-950 px-8 text-sm font-semibold text-white shadow-md transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Speichere..." : "Weiter zu Phase 2"}
          </button>
        </div>
      </main>
    </div>
  );
}
