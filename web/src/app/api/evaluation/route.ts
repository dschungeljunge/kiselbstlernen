import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

function normalizeCode(input: unknown): string {
  if (typeof input !== "string") return "";
  return input.trim().toUpperCase();
}

function isValidAnonCode(code: string): boolean {
  return /^[A-Z0-9-]{4,20}$/.test(code);
}

function validateAnswers(answers: unknown): { valid: boolean; error?: string } {
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return { valid: false, error: "Antworten sind ungültig." };
  }

  const answerMap = answers as Record<string, unknown>;
  const requiredLikert = Array.from({ length: 11 }, (_, i) => `q${i + 1}`);

  for (const key of requiredLikert) {
    const value = answerMap[key];
    if (typeof value !== "number" || !Number.isInteger(value) || value < 1 || value > 5) {
      return { valid: false, error: `Ungültige Antwort bei ${key}.` };
    }
  }

  return { valid: true };
}

async function getNextMeasurementIndex(anonCode: string): Promise<number> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("evaluation_responses")
    .select("measurement_index")
    .eq("anon_code", anonCode)
    .order("measurement_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return (data?.measurement_index ?? 0) + 1;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const anonCode = normalizeCode(searchParams.get("code"));

    if (!isValidAnonCode(anonCode)) {
      return NextResponse.json({ error: "Ungültiger Code." }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from("evaluation_responses")
      .select("measurement_index, timepoint, answers, submitted_at, updated_at")
      .eq("anon_code", anonCode)
      .order("measurement_index", { ascending: true });

    if (error) {
      console.error("Evaluation GET Error:", error);
      return NextResponse.json(
        { error: "Daten konnten nicht geladen werden." },
        { status: 500 },
      );
    }

    return NextResponse.json({ code: anonCode, responses: data ?? [] });
  } catch (error) {
    console.error("Evaluation GET Route Error:", error);
    return NextResponse.json({ error: "Serverfehler." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { anonCode: rawCode, answers } = await request.json();
    const anonCode = normalizeCode(rawCode);

    if (!isValidAnonCode(anonCode)) {
      return NextResponse.json({ error: "Ungültiger Code." }, { status: 400 });
    }

    let measurementIndex = await getNextMeasurementIndex(anonCode);
    let attempts = 0;
    const maxAttempts = 3;
    const supabase = createSupabaseAdmin();

    while (attempts < maxAttempts) {
      attempts += 1;
      const answersValidation = validateAnswers(answers);
      if (!answersValidation.valid) {
        return NextResponse.json(
          { error: answersValidation.error ?? "Ungültige Antworten." },
          { status: 400 },
        );
      }

      const timepoint = `T${measurementIndex}`;
      const { error } = await supabase.from("evaluation_responses").insert({
        anon_code: anonCode,
        measurement_index: measurementIndex,
        timepoint,
        answers,
        submitted_at: new Date().toISOString(),
      });

      if (!error) {
        return NextResponse.json({
          success: true,
          measurementIndex,
          timepoint,
        });
      }

      // Bei Race Condition (gleicher Index) nächsten Index probieren.
      if (error.code === "23505") {
        measurementIndex += 1;
        continue;
      }

      console.error("Evaluation POST Error:", error);
      return NextResponse.json({ error: "Speichern fehlgeschlagen." }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Speichern fehlgeschlagen (Kollision). Bitte erneut versuchen." },
      { status: 409 },
    );
  } catch (error) {
    console.error("Evaluation POST Route Error:", error);
    return NextResponse.json({ error: "Serverfehler." }, { status: 500 });
  }
}
