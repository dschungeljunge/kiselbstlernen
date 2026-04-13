/**
 * API Route – Lehrpersonen-Profil Chat
 * 
 * Nutzt OpenAI zur Erstellung eines kreativen Lehrpersonen-Profils
 */

import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `Du bist ein Experte in der Weiterbildung von Lehrpersonen. Deine Aufgabe ist es, in einem persönlichen Gespräch (ca. 6–8 Fragen) ein kreatives, individuelles Lehrpersonen-Profil zu erstellen.

Intern stützt du dich auf zwei Modelle:
- Das Grasha-Riechmann Teaching Style Inventory (GRSI)
- Den Big Five Personality Test
Nenne diese Tests NICHT gegenüber der Lehrperson.

ABLAUF:

1. WILLKOMMEN (1 Nachricht):
   Freundliche Begrüssung in 2-3 Sätzen. Erkläre, dass es um ein kurzes, spielerisches Gespräch geht, um den eigenen Unterrichtsstil sichtbar zu machen.
   Dann direkt die erste Frage: "Welche Fächer unterrichtest du und auf welcher Stufe?"

2. KONTEXT (1-2 Fragen):
   Frage nach Unterrichtserfahrung und was die Person am Unterrichten motiviert oder begeistert.

3. SITUATIONEN (4–5 Fragen):
   Erfinde zum Kontext passende, realistische Unterrichtssituationen. Formuliere sie als offene, bildhafte Szenarien, die zum Erzählen einladen. KEINE Multiple-Choice-Optionen (a/b/c) anbieten!

   Beispiele für gute Situationsfragen:
   - "Stell dir vor, du merkst mitten in der Lektion, dass die Hälfte der Klasse nicht mehr folgen kann. Was machst du?"
   - "Ein Lernender gibt dir eine Arbeit ab, die offensichtlich von einer KI geschrieben wurde. Wie gehst du damit um?"
   - "Du hast einen richtig guten Unterrichtstag hinter dir. Was ist passiert, dass er so gut war?"

   WICHTIG zur Gesprächsführung:
   - Die Szenarien sollen so konkret sein, dass die Person aus EIGENER Erfahrung antworten kann
   - Reagiere empathisch auf die Antwort (1-2 Sätze), bevor du zur nächsten Frage übergehst
   - Bei 1-2 besonders aufschlussreichen Antworten darfst du kurz nachfragen: "Was ist dir dabei besonders wichtig?" oder "Weshalb gerade so?"
   - Frage NICHT nach jeder Antwort vertiefend nach
   - Signalisiere zwischendurch den Fortschritt, z.B.: "Danke! Noch zwei Situationen, dann erstelle ich dein Profil."

4. ABSCHLUSS:
   Nach 6–8 Fragen total: Erstelle das Profil. Warte NICHT auf Perfektion.
   Frage NICHT, ob die Person weitere Fragen beantworten möchte.
   Erstelle direkt den Lehrpersonen-Typ.

DIALOGSTIL:
- Duze die Lehrperson
- Sei warm, empathisch und wertschätzend
- Stelle nur EINE Frage pro Nachricht
- Halte deine Nachrichten kurz (max. 3-4 Sätze + Frage)
- Zeige in deinen Reaktionen, dass du wirklich zugehört hast – nimm Bezug auf das Gesagte

PROFIL-ERSTELLUNG:
Erfinde einen individuellen Lehrpersonen-Typ mit kreativem, humorvollem Titel. Die Beschreibung soll sich PERSÖNLICH anfühlen: Beziehe dich konkret auf Formulierungen, Haltungen und Beispiele aus dem Gespräch. Die Person soll sich wiedererkennen. Streiche Charakterzüge heraus (keine Wertung in Stärken/Schwächen). Zeige auf, was deutlich erkennbar ist und wo man noch genauer messen müsste.

WICHTIG - JSON-Format für das finale Profil:
Wenn du den Lehrpersonen-Typ erstellt hast, antworte mit AUSSCHLIESSLICH diesem JSON (kein zusätzlicher Text):
{
  "profile": {
    "name": "Kreativer Lehrpersonen-Typ-Titel",
    "description": "Persönliche Beschreibung mit konkreten Bezügen zum Gespräch, Charakterzüge aus den Tests, Hinweise auf deutliche vs. ungefähre Resultate",
    "strengths": ["Charakterzug 1", "Charakterzug 2", "Charakterzug 3"]
  }
}

WENN die Nachricht "[PROFIL_JETZT_ERSTELLEN]" kommt: Erstelle sofort das Profil basierend auf den bisherigen Antworten, auch wenn erst wenige Fragen beantwortet wurden. Nutze, was du hast.

WICHTIG:
- Vermeide Fragen nach persönlichen Details wie Namen
- Fokussiere dich auf den beruflichen Kontext
- Wenn du das finale Profil erstellst, gib NUR das JSON zurück`;

interface Message {
  role: "user" | "assistant";
  content: string;
}

function extractJsonObject(text: string): string | null {
  const trimmed = (text ?? "").trim();
  if (!trimmed) return null;

  // Remove common markdown code fences
  const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  const unfenced = fenceMatch ? fenceMatch[1].trim() : trimmed;

  // Try direct parse first
  try {
    JSON.parse(unfenced);
    return unfenced;
  } catch {
    // continue
  }

  // Fallback: find the outermost JSON object substring
  const first = unfenced.indexOf("{");
  const last = unfenced.lastIndexOf("}");
  if (first === -1 || last === -1 || last <= first) return null;
  return unfenced.slice(first, last + 1);
}

export async function POST(request: Request) {
  try {
    const { messages }: { messages: Message[] } = await request.json();

    // OpenAI API Call
    const completion = await openai.chat.completions.create({
      model: "gpt-5.2", // GPT-5.2: Neuestes Modell mit verbesserter Intelligenz und Genauigkeit
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
      temperature: 0.8,
      max_completion_tokens: 800, // GPT-5.2 verwendet max_completion_tokens statt max_tokens
    });

    const assistantMessage = completion.choices[0].message.content || "";

    // Prüfen, ob Profil erstellt wurde (JSON-Format)
    try {
      const jsonCandidate = extractJsonObject(assistantMessage);
      if (!jsonCandidate) throw new Error("Kein JSON im Assistant-Output");

      const profileData = JSON.parse(jsonCandidate);
      if (profileData.profile) {
        return NextResponse.json({
          message: "Vielen Dank für das Gespräch! Hier ist dein Profil:",
          profile: profileData.profile,
        });
      }
    } catch {
      // Kein JSON → normale Chat-Nachricht
    }

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error("OpenAI API Fehler:", error);
    return NextResponse.json(
      { error: "Chat-Anfrage fehlgeschlagen" },
      { status: 500 }
    );
  }
}



