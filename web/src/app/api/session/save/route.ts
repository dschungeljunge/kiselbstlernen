/**
 * API Route – Session speichern
 *
 * POST /api/session/save
 * Body: { sessionCode, currentStep?, completedSteps?, profile?, stepData? }
 */

import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const supabase = createSupabaseAdmin();

    const body = await request.json();
    const { sessionCode, currentStep, completedSteps, profile, stepData } =
      body;

    if (!sessionCode) {
      return NextResponse.json(
        { error: "Session-Code fehlt" },
        { status: 400 }
      );
    }

    // Nur definierte Felder aktualisieren
    const updates: Record<string, unknown> = {};
    if (currentStep !== undefined) updates.current_step = currentStep;
    if (completedSteps !== undefined) updates.completed_steps = completedSteps;
    if (profile !== undefined) {
      updates.profile_name = profile.name;
      updates.profile_description = profile.description;
      updates.profile_strengths = profile.strengths;
    }
    if (stepData !== undefined) updates.step_data = stepData;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: true });
    }

    // Upsert: Session anlegen falls nicht vorhanden
    const { error } = await supabase
      .from("learning_sessions")
      .upsert({ session_code: sessionCode, ...updates });

    if (error) {
      console.error("Supabase Upsert Error:", error);
      return NextResponse.json(
        { error: "Speichern fehlgeschlagen" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Session Save Error:", error);
    return NextResponse.json(
      { error: "Fehler beim Speichern" },
      { status: 500 }
    );
  }
}
