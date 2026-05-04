import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import {
  DIMENSIONS,
  formatInteractiveAnswerForPrompt,
  type LessonReflectionDocument,
} from "@/lib/reflexion-redesign";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface Message {
  role: "user" | "assistant";
  content: string;
}

function buildReflectionContext(lesson: LessonReflectionDocument): string {
  const description = lesson.description;
  const dimensionText = DIMENSIONS.map((dimension) => {
    const data = lesson.dimensions[dimension.code];
    const answers = dimension.questions
      .map((question) => {
        const value = data?.answers?.[question.id];
        return value ? `${question.label}: ${value}` : "";
      })
      .filter(Boolean)
      .join("\n");
    const choice = data?.choices?.[dimension.choice.id];
    const interactiveAnswers = data?.interactiveAnswers ?? {};
    const interactiveLines = dimension.interactiveQuestions
      .map((question) =>
        formatInteractiveAnswerForPrompt(
          question,
          interactiveAnswers[question.id],
        ),
      )
      .filter((line): line is string => Boolean(line))
      .map((line) => `- ${line}`)
      .join("\n");
    return [
      `${dimension.letter}. ${dimension.title}`,
      `Einschätzung: ${data?.rating || "nicht bewertet"}/5`,
      choice ? `${dimension.choice.label} ${choice}` : "",
      interactiveLines ? `Interaktive Einschätzungen:\n${interactiveLines}` : "",
      answers ? `Offene Antworten:\n${answers}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }).join("\n\n---\n\n");

  return `UNTERRICHTSEINHEIT
Titel: ${description.title}
Beruf/Feld: ${description.beruf}
Fachbereich: ${description.fachbereich}
Lerngruppe: ${description.lerngruppe}
Thema: ${description.thema}
Tools: ${[...description.tools, description.weitereTools].filter(Boolean).join(", ")}
Ziel: ${description.ziel}
Dauer/Sozialform: ${description.dauer} / ${description.sozialform}
Beschreibung: ${description.beschreibung}
Besonderheiten: ${description.besonderheiten}
Prompts/Materialien: ${[description.prompts, description.materialien].filter(Boolean).join("\n")}

REFLEXION NACH FUENF DIMENSIONEN
${dimensionText}`;
}

function buildSystemPrompt(lesson: LessonReflectionDocument): string {
  return `Du bist ein präziser Reflexionscoach für Berufsschullehrpersonen.

Du bekommst eine dokumentierte KI-Unterrichtseinheit und fünf Reflexionsdimensionen. Deine Aufgabe ist NICHT, allgemein über KI zu reden, sondern aus den vorhandenen Angaben ein fokussiertes Fazit zu entwickeln.

KONTEXT:
${buildReflectionContext(lesson)}

GESPRÄCHSREGELN:
- Stelle gezielte Rückfragen, wenn für ein gutes Fazit noch etwas fehlt.
- Stelle pro Nachricht höchstens eine Frage.
- Beziehe dich konkret auf Unterricht, Berufsfeld, Toolnutzung und die fünf Dimensionen.
- Halte Antworten kurz und hilfreich.
- Wenn genug Kontext vorhanden ist, formuliere ein Fazit mit: wichtigste Erkenntnis, Spannungsfeld, Konsequenz für die nächste Durchführung.
- Keine Emojis und keine Markdown-Tabellen.`;
}

export async function POST(request: Request) {
  try {
    const { lesson, messages } = (await request.json()) as {
      lesson: LessonReflectionDocument;
      messages: Message[];
    };

    if (!lesson) {
      return NextResponse.json({ error: "Reflexionsdaten fehlen" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-5.2",
      messages: [
        { role: "system", content: buildSystemPrompt(lesson) },
        ...(messages ?? []).map((message) => ({
          role: message.role,
          content: message.content,
        })),
      ],
      temperature: 0.6,
      max_completion_tokens: 700,
    });

    const message =
      completion.choices[0].message.content?.trim() ??
      "Ich konnte gerade kein Fazit formulieren. Bitte versuche es erneut.";

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Conclusion Chat Error:", error);
    return NextResponse.json({ error: "Chat-Anfrage fehlgeschlagen" }, { status: 500 });
  }
}
