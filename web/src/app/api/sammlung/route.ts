import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { mapLessonToPublicListItem } from "@/lib/sammlung-public";

export async function GET() {
  try {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from("documented_lessons")
      .select("id, title, summary, phase1, dimensions, final_summary, published_at, created_at")
      .eq("is_public", true)
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Sammlung Load Error:", error);
      return NextResponse.json({ error: "Sammlung konnte nicht geladen werden." }, { status: 500 });
    }

    const lessons = (data ?? []).map((item) =>
      mapLessonToPublicListItem(item as Record<string, unknown>),
    );

    return NextResponse.json({ lessons });
  } catch (error) {
    console.error("Sammlung Route Error:", error);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
