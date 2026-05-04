import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const { sessionCode, lessonId } = (await request.json()) as {
      sessionCode?: string;
      lessonId?: string | null;
    };

    if (!sessionCode && !lessonId) {
      return NextResponse.json({ error: "Lesson-ID oder Session-Code fehlt" }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();
    let query = supabase
      .from("documented_lessons")
      .update({ is_public: true, published_at: new Date().toISOString() });

    query = lessonId ? query.eq("id", lessonId) : query.eq("session_code", sessionCode);

    const { error } = await query;
    if (error) {
      console.error("Lesson Publish Error:", error);
      return NextResponse.json({ error: "Veröffentlichen fehlgeschlagen" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lesson Publish Route Error:", error);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
