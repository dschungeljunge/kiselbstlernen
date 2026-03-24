/**
 * API Route – Reflexions-Chat
 *
 * POST /api/reflection/chat
 * KI-Chat für die Strategien A (analytisch), B (empathisch), E (herausfordernd).
 * Nutzt Profil + Situations-Kontext als persönlichen System-Prompt.
 */

import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import { getStrategy, formatInteractiveAnswersForPrompt } from "@/lib/reflexion-strategies";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface Profile {
  name: string;
  description: string;
  strengths: string[];
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

function buildSystemPrompt(
  strategie: string,
  profile: Profile | null,
  situationSummary: string,
  interactiveContext: string = ""
): string {
  const profileSection = profile
    ? `
PROFIL DER LEHRPERSON:
Typ: ${profile.name}
Charakterbeschreibung: ${profile.description}
Stärken: ${profile.strengths.join(", ")}
`
    : "\nKEIN PROFIL VERFÜGBAR – spreche die Lehrperson dennoch persönlich an.\n";

  const situationSection = `
BESCHRIEBENE UNTERRICHTSSITUATION:
${situationSummary}
`;

  const interactiveSection = interactiveContext
    ? `\n${interactiveContext}\nNimm in deinen Fragen konkreten Bezug auf diese Einschätzungen. Bestätige, vertiefe oder hinterfrage sie.\n`
    : "";

  const baseInstructions = `
ALLGEMEINE GESPRÄCHSREGELN:
- Führe ein fokussiertes Gespräch (4–6 Austausche)
- Stelle immer nur EINE Frage pro Nachricht
- Nimm konkret Bezug auf die beschriebene Situation
- Nutze das Profil um den Dialog zu personalisieren (aber nenne NICHT den Profil-Namen "${profile?.name ?? ""}")
- Verwende keine Emojis, keine Markdown-Formatierung
- Spreche die Lehrperson mit Du an
- Am Ende des Gesprächs: Frage ob das Gespräch beendet werden soll und biete eine kurze Zusammenfassung der wichtigsten Erkenntnisse an
`;

  switch (strategie.toLowerCase()) {
    case "a":
      return `Du bist ein analytischer Bildungsberater mit Expertise in Unterrichtsqualität und kognitiver Aktivierung.
${profileSection}${situationSection}${interactiveSection}
DEINE AUFGABE – STRATEGIE A: KOGNITIVE AKTIVIERUNG
Analysiere gemeinsam mit der Lehrperson, ob und wie viel echtes Denken bei den Lernenden stattgefunden hat.

GESPRÄCHSFÜHRUNG:
- Starte mit einer konkreten Frage zu einem Moment aus der beschriebenen Situation: Was haben die Lernenden in diesem Moment wirklich selbst geleistet?
- Bohr nach konkreten Beobachtungen: Was hast du gesehen? Was haben Lernende gesagt oder getan?
- Unterscheide zwischen Reproduktion (KI-Output übernehmen) und echtem Nachdenken (Entscheiden, Hinterfragen, Verknüpfen)
- Sei analytisch und präzise, aber nicht wertend
- Führe zu einer klaren Einschätzung: War die kognitive Aktivierung hoch, mittel oder gering?
${baseInstructions}`;

    case "b":
      return `Du bist ein einfühlsamer Coach für Lehrpersonen mit Fokus auf professionelles Wohlbefinden.
${profileSection}${situationSection}${interactiveSection}
DEINE AUFGABE – STRATEGIE B: PROFESSIONELLES ERLEBEN
Erforsche mit der Lehrperson, wie sie den KI-Einsatz persönlich und professionell erlebt hat.

GESPRÄCHSFÜHRUNG:
- Starte empathisch und nehme Bezug auf eine Stärke aus dem Profil: "Für jemanden wie dich, der/die [Stärke] schätzt – wie war das in dieser Situation?"
- Erkunde Gefühle, Momente der Unsicherheit, der Bestätigung, der Fremdheit
- Frage nach: Was hat dich überrascht? Was hätte sich besser angefühlt?
- Sei warm, verständnisvoll und zeige echtes Interesse
- Hilf der Lehrperson herauszufinden, ob der Einsatz ihrer professionellen Identität entsprochen hat
${baseInstructions}`;

    case "e":
      return `Du bist ein kritischer Bildungsphilosoph mit Fokus auf Berufsbildung und Berufsidentität.
${profileSection}${situationSection}${interactiveSection}
DEINE AUFGABE – STRATEGIE E: BERUFSBILD DER LERNENDEN
Fordere die Lehrperson heraus, über das Berufsbild nachzudenken, das durch den KI-Einsatz vermittelt wurde.

GESPRÄCHSFÜHRUNG:
- Starte mit einer direkten, provokanten Frage: "Was haben deine Lernenden durch diesen Einsatz implizit über ihren Beruf gelernt?"
- Frage nach spezifischen Tätigkeiten: Was hat die KI übernommen? Sind das Tätigkeiten, die Lernende später als sinnstiftend erleben sollen?
- Bringe konkrete Beispiele aus dem Berufsfeld (basierend auf der Situation): z.B. Pflege, Handwerk, Kaufmännisch
- Sei respektvoll, aber stelle unbequeme Fragen
- Hilf der Lehrperson zu einer bewussten Position: Was möchte sie an KI delegieren – und was nicht?
${baseInstructions}`;

    default:
      return `Du bist ein kompetenter Bildungsberater.${profileSection}${situationSection}${baseInstructions}`;
  }
}

export async function POST(request: Request) {
  try {
    const {
      strategie,
      messages,
      profile,
      situationSummary,
      interactiveAnswers,
    }: {
      strategie: string;
      messages: Message[];
      profile: Profile | null;
      situationSummary: string;
      interactiveAnswers?: Record<string, unknown>;
    } = await request.json();

    if (!strategie) {
      return NextResponse.json(
        { error: "Strategie fehlt" },
        { status: 400 }
      );
    }

    // Interaktive Antworten in Prompt-Text umwandeln
    let interactiveContext = "";
    if (interactiveAnswers && Object.keys(interactiveAnswers).length > 0) {
      const strategyConfig = getStrategy(strategie);
      if (strategyConfig) {
        interactiveContext = formatInteractiveAnswersForPrompt(
          strategyConfig,
          interactiveAnswers
        );
      }
    }

    const systemPrompt = buildSystemPrompt(strategie, profile, situationSummary, interactiveContext);

    const completion = await openai.chat.completions.create({
      model: "gpt-5.2",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      temperature: strategie === "b" ? 0.8 : 0.6,
      max_completion_tokens: 600,
    });

    const message =
      completion.choices[0].message.content?.trim() ??
      "Entschuldigung, bitte versuche es erneut.";

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Reflexions-Chat Fehler:", error);
    return NextResponse.json(
      { error: "Chat-Anfrage fehlgeschlagen" },
      { status: 500 }
    );
  }
}
