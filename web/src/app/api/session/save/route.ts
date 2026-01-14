/**
 * API Route – Session speichern
 * 
 * POST /api/session/save
 * Body: { sessionCode, profile, currentStep, completedSteps, stepData }
 */

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createSupabaseServerClient(cookieStore);
    
    const body = await request.json();
    const {
      sessionCode,
      profile,
      currentStep,
      completedSteps,
      merksatz,
      stepData,
    } = body;

    if (!sessionCode) {
      return NextResponse.json(
        { error: "Session-Code fehlt" },
        { status: 400 }
      );
    }

    // Prüfen, ob Session bereits existiert
    const { data: existing } = await supabase
      .from("learning_sessions")
      .select("session_code")
      .eq("session_code", sessionCode)
      .single();

    if (existing) {
      // Update
      const { error } = await supabase
        .from("learning_sessions")
        .update({
          profile_name: profile?.name || null,
          profile_description: profile?.description || null,
          profile_strengths: profile?.strengths || null,
          current_step: currentStep,
          completed_steps: completedSteps,
          reflection_merksatz: merksatz || null,
          step_data: stepData,
        })
        .eq("session_code", sessionCode);

      if (error) throw error;
    } else {
      // Insert
      const { error } = await supabase
        .from("learning_sessions")
        .insert({
          session_code: sessionCode,
          profile_name: profile?.name || null,
          profile_description: profile?.description || null,
          profile_strengths: profile?.strengths || null,
          current_step: currentStep,
          completed_steps: completedSteps,
          reflection_merksatz: merksatz || null,
          step_data: stepData,
        });

      if (error) throw error;
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


