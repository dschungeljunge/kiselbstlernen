/**
 * API Route – Situations-Zusammenfassung
 *
 * POST /api/reflection/situation
 * Empfängt die Situations-Beschreibung der Lehrperson und ihr Profil.
 * Gibt eine strukturierte KI-Zusammenfassung zurück, die als
 * Kontext für alle nachfolgenden Reflexions-Chats dient.
 */

import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface Profile {
  name: string;
  description: string;
  strengths: string[];
}

function buildSystemPrompt(profile: Profile | null): string {
  const profileSection = profile
    ? `
PROFIL DER LEHRPERSON:
Typ: ${profile.name}
Charakterbeschreibung: ${profile.description}
Stärken: ${profile.strengths.join(", ")}
`
    : "";

  return `Du bist ein professioneller Bildungsberater. Deine Aufgabe ist es, die Beschreibung eines KI-Einsatzes einer Berufsschullehrperson in eine strukturierte, präzise Zusammenfassung zu bringen.${profileSection}

DEINE AUFGABE:
Erstelle eine knappe, strukturierte Zusammenfassung der beschriebenen Unterrichtssituation. Die Zusammenfassung wird als Kontext für eine anschliessende pädagogische Reflexion verwendet.

STRUKTUR DER ZUSAMMENFASSUNG (in Fliesstext, ca. 5-8 Sätze):
1. Was wurde gemacht? (KI-Tool, Einsatzform, Unterrichtsphase)
2. Für wen? (Klasse/Gruppe, Fach, Kontext)
3. Was war das Ziel des Einsatzes?
4. Was ist dabei passiert – was war auffällig, unerwartet oder besonders?
5. Erste Einschätzung der Lehrperson (falls erkennbar)

TONALITÄT: Sachlich, klar, respektvoll. Keine Bewertung, keine Schlussfolgerungen. Nur Beschreibung.
SPRACHE: Deutsch, Du-Form gegenüber der Lehrperson.

Antworte NUR mit der Zusammenfassung, kein einleitender Satz wie "Hier ist deine Zusammenfassung:".`;
}

export async function POST(request: Request) {
  try {
    const {
      situationText,
      profile,
    }: { situationText: string; profile: Profile | null } =
      await request.json();

    if (!situationText?.trim()) {
      return NextResponse.json(
        { error: "Situations-Beschreibung fehlt" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-5.2",
      messages: [
        { role: "system", content: buildSystemPrompt(profile) },
        {
          role: "user",
          content: `Hier ist meine Beschreibung des KI-Einsatzes:\n\n${situationText}`,
        },
      ],
      temperature: 0.4,
      max_completion_tokens: 600,
    });

    const summary =
      completion.choices[0].message.content?.trim() ??
      "Zusammenfassung konnte nicht erstellt werden.";

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Situation API Fehler:", error);
    return NextResponse.json(
      { error: "Zusammenfassung fehlgeschlagen" },
      { status: 500 }
    );
  }
}
