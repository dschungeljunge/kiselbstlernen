import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { mapLessonToPublicDetail } from "@/lib/sammlung-public";

export const dynamic = "force-dynamic";

async function loadLesson(id: string) {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("documented_lessons")
    .select("id, title, summary, phase1, dimensions, final_summary, published_at, created_at")
    .eq("id", id)
    .eq("is_public", true)
    .maybeSingle();

  if (error) {
    console.error("Sammlung Detail Page Error:", error);
    return null;
  }
  if (!data) return null;
  return mapLessonToPublicDetail(data as Record<string, unknown>);
}

export default async function SammlungDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lesson = await loadLesson(id);
  if (!lesson) notFound();

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="relative overflow-hidden bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-400">
        <div className="relative mx-auto max-w-5xl px-6 py-12">
          <Link
            href="/sammlung"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-800 transition-colors hover:text-zinc-950"
          >
            <span aria-hidden>←</span> Zurück zur Sammlung
          </Link>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-950">
            {lesson.title}
          </h1>
          <p className="mt-3 max-w-3xl text-zinc-800">{lesson.summary}</p>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-zinc-950">Kontext der Einheit</h2>
          <div className="mt-4 grid gap-3 text-sm text-zinc-700 md:grid-cols-2">
            <p><span className="font-semibold">Beruf:</span> {lesson.beruf || "-"}</p>
            <p><span className="font-semibold">Fachbereich:</span> {lesson.fachbereich || "-"}</p>
            <p><span className="font-semibold">Thema:</span> {lesson.thema || "-"}</p>
            <p><span className="font-semibold">Ziel:</span> {lesson.ziel || "-"}</p>
            <p><span className="font-semibold">Dauer:</span> {lesson.dauer || "-"}</p>
            <p><span className="font-semibold">Sozialform:</span> {lesson.sozialform || "-"}</p>
          </div>
          {lesson.tools.length > 0 && (
            <p className="mt-4 text-sm text-zinc-700">
              <span className="font-semibold">Tools:</span> {lesson.tools.join(", ")}
            </p>
          )}
          {lesson.besonderheiten && (
            <p className="mt-4 rounded-xl bg-zinc-50 p-4 text-sm leading-6 text-zinc-700">
              <span className="font-semibold">Besonderheiten:</span> {lesson.besonderheiten}
            </p>
          )}
        </section>

        <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-zinc-950">Reflexion der 5 Dimensionen</h2>
          <div className="mt-4 grid gap-2">
            {lesson.dimensions.map((dimension) => (
              <div
                key={dimension.code}
                className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 text-sm"
              >
                <span className="font-medium text-zinc-700">{dimension.title}</span>
                <span className="font-bold text-zinc-950">{dimension.rating || "-"}/5</span>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-6 text-xs text-zinc-500">
          Diese Detailansicht zeigt nur öffentlich freigegebene Felder. Interne
          Rohdaten (Session-Code, Chatverläufe, Freitext-Rohantworten) sind nicht sichtbar.
        </p>
      </main>
    </div>
  );
}
