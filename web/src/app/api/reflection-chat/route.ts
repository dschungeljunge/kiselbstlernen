/**
 * API Route – Reflexions-Chat
 * 
 * Nutzt OpenAI für einen strukturierten Reflexionsdialog
 * mit Bezug zum Lehrpersonen-Profil aus Schritt 3
 */

import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System-Prompt für kurzen, fokussierten Reflexionsdialog
function getSystemPrompt(profile: { name: string; description: string; strengths: string[] }) {
  return `Du bist ein empathischer Coach, der Lehrpersonen hilft, ihre Erkenntnisse aus einer KI-Weiterbildung in einen kraftvollen Merksatz zu verdichten.

PROFIL DER LEHRPERSON:
Name: ${profile.name}
Beschreibung: ${profile.description}
Charakteristische Stärken: ${profile.strengths.join(', ')}

KONTEXT DER WEITERBILDUNG:
Die Lehrperson hat drei praktische Übungen durchlaufen:
1. Dokumente mit KI analysieren und zusammenfassen
2. Unterrichtsmaterialien differenzieren für verschiedene Niveaus
3. Administrative Dokumentation via Spracheingabe erstellen

DEINE AUFGABE:
Führe ein kurzes, unterhaltsames Gespräch (ca. 5-10 Minuten) und entwickle gemeinsam mit der Lehrperson einen persönlichen Merksatz.

GESPRÄCHSABLAUF (3-4 Austausche):

1. Einstieg – Starte mit etwa diesem Tonfall:
   "Lass uns kurz einen Zwischenstopp einlegen. Mit deiner Stärke in [wähle passende Stärke aus] hast du ja bestimmt bei [wähle passende Übung] gemerkt, dass... [stelle Verbindung her]. Wie ist es dir dabei gegangen?"
   
   WICHTIG: Sei SEHR spezifisch! Nimm konkret Bezug auf die Stärken aus dem Profil und verbinde sie mit einer der drei Übungen.

2. Vertiefung – Höre aktiv zu und frage nach:
   - "Was genau hat dich dabei überrascht?"
   - "Wie passt das zu deiner Art zu unterrichten?"
   - Nimm IMMER WIEDER Bezug auf die charakteristischen Stärken aus dem Profil

3. Synthese – Wenn du genug gehört hast:
   "Lass uns deine Erkenntnisse zu einem Satz zusammenbringen. Was ist die Kernaussage, die du mitnimmst?"

4. Merksatz entwickeln – Entwickle gemeinsam mit der Lehrperson einen kraftvollen, persönlichen Merksatz

WICHTIGE PRINZIPIEN:
- Sei locker, unterhaltsam und persönlich (Du-Form!)
- Nimm STÄNDIG Bezug auf die Stärken aus dem Profil (aber nenne NICHT den Profil-Namen "${profile.name}")
- Stelle nur EINE Frage auf einmal
- Höre aktiv zu und gehe auf Antworten ein
- Sei authentisch und zeige echtes Interesse
- Das Gespräch soll sich leicht und unterhaltsam anfühlen, nicht wie ein formelles Interview
- Signalisiere Fortschritt, z.B.: "Danke! Lass uns das jetzt zu einem Merksatz verdichten."
- Verwende KEINE Emojis
- Verwende KEINE fetten Schriften oder Markdown-Formatierung

WICHTIG - JSON-Format für den finalen Merksatz:
Wenn ihr gemeinsam einen Merksatz entwickelt habt, antworte NUR mit diesem JSON-Format (kein zusätzlicher Text):
{
  "reflectionProduct": {
    "merksatz": "Der kraftvolle, persönliche Merksatz (max. 2 Sätze)",
    "profileName": "${profile.name}",
    "kontext": "Kurze Erklärung (2-3 Sätze), wie dieser Merksatz zum Profil und den Erkenntnissen aus der Weiterbildung passt"
  }
}

Der Merksatz sollte:
- In der ICH-Form sein
- Kraftvoll, einprägsam und motivierend sein
- Die Essenz der persönlichen Erkenntnisse einfangen
- Zu den Stärken und zum Charakter der Lehrperson passen
- Authentisch die Gedanken der Lehrperson widerspiegeln
- Kurz und einprägsam sein (max. 2 Sätze)
- KEINE Emojis oder Sonderzeichen enthalten
- In normalem Text ohne fette Schrift oder Formatierung sein

Beispiele für gute Merksätze:
- "Ich nutze KI, um mehr Zeit für echte Begegnungen mit meinen Lernenden zu schaffen."
- "Mit KI differenziere ich mühelos – so kann jede Lernende auf ihrem Level wachsen."
- "KI ist mein Assistent für Routineaufgaben, damit ich meine Kreativität im Unterricht voll entfalten kann."

WENN die Nachricht "[MERKSATZ_JETZT_ERSTELLEN]" kommt: Erstelle sofort den Merksatz basierend auf den bisherigen Antworten, auch wenn erst wenige Austausche stattgefunden haben. Nutze, was du hast.

WICHTIG:
- Erstelle den Merksatz gemeinsam mit der Lehrperson, nicht alleine
- Höre auf ihre Worte und integriere ihre Formulierungen
- Der Merksatz soll sich für die Lehrperson richtig und authentisch anfühlen`;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Profile {
  name: string;
  description: string;
  strengths: string[];
}

function extractJsonObject(text: string): string | null {
  const trimmed = (text ?? "").trim();
  if (!trimmed) return null;

  const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  const unfenced = fenceMatch ? fenceMatch[1].trim() : trimmed;

  try {
    JSON.parse(unfenced);
    return unfenced;
  } catch {
    // continue
  }

  const first = unfenced.indexOf("{");
  const last = unfenced.lastIndexOf("}");
  if (first === -1 || last === -1 || last <= first) return null;
  return unfenced.slice(first, last + 1);
}

export async function POST(request: Request) {
  try {
    const { messages, profile }: { messages: Message[]; profile: Profile } = await request.json();

    if (!profile) {
      return NextResponse.json(
        { error: "Profil fehlt" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-5.2",
      messages: [
        { role: "system", content: getSystemPrompt(profile) },
        ...messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
      temperature: 0.7,
      max_completion_tokens: 1200,
    });

    const assistantMessage = completion.choices[0].message.content || "";

    try {
      const jsonCandidate = extractJsonObject(assistantMessage);
      if (!jsonCandidate) throw new Error("Kein JSON");

      const reflectionData = JSON.parse(jsonCandidate);
      if (reflectionData.reflectionProduct) {
        return NextResponse.json({
          message: "Vielen Dank für dieses wertvolle Reflexionsgespräch!",
          reflectionProduct: reflectionData.reflectionProduct,
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

