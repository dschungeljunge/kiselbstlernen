/**
 * API Route – Reflexionsdaten speichern
 *
 * POST /api/reflection/save
 * Speichert alle Reflexionsdaten in step_data.reflexion der Session.
 */

import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const supabase = createSupabaseAdmin();

    const {
      sessionCode,
      reflexionData,
    }: { sessionCode: string; reflexionData: unknown } = await request.json();

    if (!sessionCode) {
      return NextResponse.json(
        { error: "Session-Code fehlt" },
        { status: 400 }
      );
    }

    // Bestehende step_data laden
    const { data: existing } = await supabase
      .from("learning_sessions")
      .select("step_data")
      .eq("session_code", sessionCode)
      .single();

    const currentStepData = (existing?.step_data as Record<string, unknown>) ?? {};

    // Reflexionsdaten mergen
    const updatedStepData = {
      ...currentStepData,
      reflexion: reflexionData,
    };

    const { error } = await supabase
      .from("learning_sessions")
      .update({ step_data: updatedStepData })
      .eq("session_code", sessionCode);

    if (error) {
      console.error("Supabase Update Error:", error);
      return NextResponse.json(
        { error: "Speichern fehlgeschlagen" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reflection Save Error:", error);
    return NextResponse.json(
      { error: "Fehler beim Speichern" },
      { status: 500 }
    );
  }
}
