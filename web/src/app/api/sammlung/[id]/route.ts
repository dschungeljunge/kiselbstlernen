import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { mapLessonToPublicDetail } from "@/lib/sammlung-public";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = createSupabaseAdmin();

    const { data, error } = await supabase
      .from("documented_lessons")
      .select("id, title, summary, phase1, dimensions, final_summary, published_at, created_at")
      .eq("id", id)
      .eq("is_public", true)
      .maybeSingle();

    if (error) {
      console.error("Sammlung Detail Error:", error);
      return NextResponse.json({ error: "Eintrag konnte nicht geladen werden." }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Eintrag nicht gefunden." }, { status: 404 });
    }

    return NextResponse.json({
      lesson: mapLessonToPublicDetail(data as Record<string, unknown>),
    });
  } catch (error) {
    console.error("Sammlung Detail Route Error:", error);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
