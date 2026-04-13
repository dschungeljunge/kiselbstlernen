/**
 * API Route – Session laden
 * 
 * POST /api/session/load
 * Body: { sessionCode }
 */

import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const supabase = createSupabaseAdmin();
    
    const { sessionCode } = await request.json();

    if (!sessionCode) {
      return NextResponse.json(
        { error: "Session-Code fehlt" },
        { status: 400 }
      );
    }

    // Session laden
    const { data, error } = await supabase
      .from("learning_sessions")
      .select("*")
      .eq("session_code", sessionCode)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Session nicht gefunden" },
        { status: 404 }
      );
    }

    // Response formatieren
    return NextResponse.json({
      sessionCode: data.session_code,
      profile: data.profile_name
        ? {
            name: data.profile_name,
            description: data.profile_description,
            strengths: data.profile_strengths,
          }
        : null,
      currentStep: data.current_step,
      completedSteps: data.completed_steps || [],
      merksatz: data.reflection_merksatz || null,
      stepData: data.step_data || {},
    });
  } catch (error) {
    console.error("Session Load Error:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden" },
      { status: 500 }
    );
  }
}


