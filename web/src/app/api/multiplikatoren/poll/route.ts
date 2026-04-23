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
      .maybeSingle();

    if (pollError) {
      console.error("Poll GET multiplikator_polls:", pollError);
      return NextResponse.json(
        { error: "Terminfindung konnte nicht geladen werden (Datenbank)." },
        { status: 500 }
      );
    }

    if (!poll) {
      return NextResponse.json(
        {
          error:
            "Die Terminfindung ist auf dem Server noch nicht freigeschaltet (kein aktiver Eintrag). Bitte später erneut versuchen oder die Kontaktperson informieren.",
        },
        { status: 404 }
      );
    }

    const { data: responses, error: respError } = await supabase
      .from("multiplikator_poll_responses")
      .select("id, name, email, teilschule, selections, updated_at")
      .eq("poll_id", poll.id)
      .order("created_at", { ascending: true });

    if (respError) {
      console.error("Poll GET multiplikator_poll_responses:", respError);
      return NextResponse.json(
        { error: "Antworten konnten nicht geladen werden (Datenbank)." },
        { status: 500 }
      );
    }

    return NextResponse.json({ poll, responses: responses ?? [] });
  } catch (error) {
    console.error("Poll GET Error:", error);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
