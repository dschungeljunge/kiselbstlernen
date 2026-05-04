import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { createEmptyLessonDocument } from "@/lib/reflexion-redesign";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionCode = searchParams.get("sessionCode")?.trim();

    if (!sessionCode) {
      return NextResponse.json({ error: "Session-Code fehlt" }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from("documented_lessons")
      .select("id, schema_version, phase1, dimensions, conclusion")
      .eq("session_code", sessionCode)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Lesson Load Error:", error);
      return NextResponse.json({ error: "Laden fehlgeschlagen" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ lesson: null });
    }

    const empty = createEmptyLessonDocument();
    return NextResponse.json({
      lesson: {
        ...empty,
        schemaVersion: data.schema_version ?? 1,
        lessonId: data.id,
        description: {
          ...empty.description,
          ...(data.phase1 ?? {}),
        },
        dimensions: {
          ...empty.dimensions,
          ...(data.dimensions ?? {}),
        },
        conclusion: {
          ...empty.conclusion,
          ...(data.conclusion ?? {}),
        },
      },
    });
  } catch (error) {
    console.error("Lesson Load Route Error:", error);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
