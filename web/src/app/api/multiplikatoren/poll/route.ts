import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createSupabaseAdmin();

    const { data: poll, error: pollError } = await supabase
      .from("multiplikator_polls")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (pollError || !poll) {
      return NextResponse.json(
        { error: "Kein aktiver Poll gefunden" },
        { status: 404 }
      );
    }

    const { data: responses, error: respError } = await supabase
      .from("multiplikator_poll_responses")
      .select("id, name, email, teilschule, selections, updated_at")
      .eq("poll_id", poll.id)
      .order("created_at", { ascending: true });

    if (respError) {
      return NextResponse.json(
        { error: "Fehler beim Laden der Antworten" },
        { status: 500 }
      );
    }

    return NextResponse.json({ poll, responses: responses ?? [] });
  } catch (error) {
    console.error("Poll GET Error:", error);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
