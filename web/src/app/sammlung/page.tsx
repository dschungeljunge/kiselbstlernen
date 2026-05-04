import Link from "next/link";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { mapLessonToPublicListItem, type PublicSammlungListItem } from "@/lib/sammlung-public";

export const dynamic = "force-dynamic";

async function loadLessons(): Promise<PublicSammlungListItem[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("documented_lessons")
    .select("id, title, summary, phase1, dimensions, final_summary, published_at, created_at")
    .eq("is_public", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Sammlung Page Load Error:", error);
    return [];
  }

  return (data ?? []).map((item) => mapLessonToPublicListItem(item as Record<string, unknown>));
}

export default async function SammlungPage(props: PageProps<"/sammlung">) {
  await props.params;
  const lessons = await loadLessons();

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="relative overflow-hidden bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-400">
        <div className="relative mx-auto max-w-6xl px-6 py-14">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-800 transition-colors hover:text-zinc-950"
          >
            <span aria-hidden>←</span> Zurück zur Startseite
          </Link>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-950 md:text-5xl">
            Sammlung KI-Unterrichtseinheiten
          </h1>
          <p className="mt-3 max-w-3xl text-zinc-800">
            Anonymisierte Beispiele aus dokumentierten und reflektierten
            Unterrichtseinheiten mit KI.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {lessons.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-zinc-950">
              Noch keine freigegebenen Einheiten
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              Sobald Reflexionen anonym veröffentlicht werden, erscheinen sie hier.
            </p>
            <Link
              href="/reflexion"
              className="mt-5 inline-flex rounded-xl bg-zinc-950 px-6 py-3 text-sm font-semibold text-white"
            >
              Reflexion starten
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {lessons.map((lesson) => (
              <Link
                key={lesson.id}
                href={`/sammlung/${lesson.id}`}
                className="block rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-yellow-300 hover:shadow-md"
              >
                <div className="flex flex-wrap gap-2 text-xs font-semibold text-zinc-600">
                  {lesson.beruf && (
                    <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-yellow-900">
                      {lesson.beruf}
                    </span>
                  )}
                  {lesson.fachbereich && (
                    <span className="rounded-full bg-zinc-100 px-2.5 py-1">
                      {lesson.fachbereich}
                    </span>
                  )}
                </div>
                <h2 className="mt-4 text-xl font-bold text-zinc-950">
                  {lesson.title}
                </h2>
                {lesson.thema && (
                  <p className="mt-1 text-sm font-medium text-zinc-600">
                    Thema: {lesson.thema}
                  </p>
                )}
                <p className="mt-4 line-clamp-5 text-sm leading-6 text-zinc-700">
                  {lesson.summary}
                </p>
                {lesson.tools.length > 0 && (
                  <p className="mt-4 text-xs text-zinc-500">
                    Tools: {lesson.tools.join(", ")}
                  </p>
                )}
                <div className="mt-5 grid gap-2">
                  {lesson.dimensions.map((dimension) => (
                    <div
                      key={dimension.code}
                      className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 text-xs"
                    >
                      <span className="font-medium text-zinc-700">{dimension.title}</span>
                      <span className="font-bold text-zinc-950">{dimension.rating || "-"}/5</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm font-semibold text-zinc-900">
                  Mehr erfahren →
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
