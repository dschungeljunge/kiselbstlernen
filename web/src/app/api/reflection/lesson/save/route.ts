import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import {
  buildLessonSummary,
  buildLessonTitle,
  createEmptyLessonDocument,
  type LessonReflectionDocument,
} from "@/lib/reflexion-redesign";

function normalizeLesson(input: Partial<LessonReflectionDocument> | null | undefined) {
  const empty = createEmptyLessonDocument();
  return {
    ...empty,
    ...input,
    schemaVersion: 1 as const,
    description: {
      ...empty.description,
      ...input?.description,
    },
    dimensions: {
      ...empty.dimensions,
      ...input?.dimensions,
    },
    conclusion: {
      ...empty.conclusion,
      ...input?.conclusion,
    },
  };
}

export async function POST(request: Request) {
  try {
    const supabase = createSupabaseAdmin();
    const body = (await request.json()) as {
      sessionCode?: string;
      lesson?: Partial<LessonReflectionDocument>;
    };

    if (!body.sessionCode) {
      return NextResponse.json({ error: "Session-Code fehlt" }, { status: 400 });
    }

    const lesson = normalizeLesson(body.lesson);
    const title = buildLessonTitle(lesson.description);
    const summary = buildLessonSummary(lesson.description);
    const finalSummary =
      lesson.conclusion.publicSummary.trim() || lesson.conclusion.finalSummary.trim();

    const payload = {
      session_code: body.sessionCode,
      schema_version: lesson.schemaVersion,
      title,
      summary,
      phase1: lesson.description,
      dimensions: lesson.dimensions,
      conclusion: lesson.conclusion,
      final_summary: finalSummary,
      is_public: lesson.conclusion.publishConsent,
      published_at: lesson.conclusion.publishConsent ? new Date().toISOString() : null,
    };

    let lessonId = lesson.lessonId;

    if (!lessonId) {
      const { data: existing } = await supabase
        .from("documented_lessons")
        .select("id")
        .eq("session_code", body.sessionCode)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      lessonId = existing?.id ?? null;
    }

    const query = lessonId
      ? supabase.from("documented_lessons").update(payload).eq("id", lessonId).select("id").single()
      : supabase.from("documented_lessons").insert(payload).select("id").single();

    const { data, error } = await query;

    if (error) {
      console.error("Lesson Save Error:", error);
      return NextResponse.json({ error: "Speichern fehlgeschlagen" }, { status: 500 });
    }

    return NextResponse.json({ success: true, lessonId: data.id });
  } catch (error) {
    console.error("Lesson Save Route Error:", error);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
