import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const supabase = createSupabaseAdmin();
    const { pollId, name, email, teilschule, selections } = await request.json();

    if (!pollId || !name?.trim() || !email?.trim() || !selections) {
      return NextResponse.json(
        { error: "Alle Felder sind erforderlich" },
        { status: 400 }
      );
    }

    const emailNorm = email.trim().toLowerCase();

    const { data, error } = await supabase
      .from("multiplikator_poll_responses")
      .upsert(
        {
          poll_id: pollId,
          name: name.trim(),
          email: emailNorm,
          teilschule: (teilschule ?? "").trim(),
          selections,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "poll_id,email" }
      )
      .select()
      .single();

    if (error) {
      console.error("Poll respond error:", error);
      return NextResponse.json(
        { error: "Fehler beim Speichern" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, response: data });
  } catch (error) {
    console.error("Poll POST Error:", error);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
