/**
 * API Route – Personalisierte Profil-Insights pro Schritt
 *
 * Generiert basierend auf dem Lehrpersonenprofil einen prägnanten Satz,
 * der erklärt, weshalb der aktuelle Schritt für diesen Profiltyp relevant ist.
 */

import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const STEP_CONTEXTS: Record<number, string> = {
  5: `Modulvideo "Produktivität als pädagogische Wertschöpfung": Es geht darum, Zeitfresser im Lehralltag zu identifizieren und pädagogische Wirksamkeit zu erhöhen – nicht durch "mehr Output", sondern durch Reduktion belastender Nebenprozesse.`,
  6: `Übung 1 "Informationsverarbeitung mit Dokumenten-Chat": Lehrpersonen laden umfangreiche Konzepttexte (z.B. Lehrpläne) in eine KI hoch und stellen gezielte Fragen, um relevante Stellen für ihre eigene Praxis zu finden – statt alles von A bis Z zu lesen.`,
  7: `Übung 2 "Unterrichtsmaterial differenzieren": Lehrpersonen nutzen KI, um Unterrichtsmaterial an heterogene Lerngruppen anzupassen – z.B. durch Rollenwechsel, Expertenaufträge oder alternative Lernwege – und lassen das Ergebnis als Dokument erstellen.`,
  8: `Übung 3 "Administrative Dokumentation via Spracheingabe": Lehrpersonen diktieren Beobachtungen per Mikrofon in die KI, die daraus formale Dokumentationstexte erstellt und überfachliche Kompetenzen ableitet – ohne zusätzlichen Schreibaufwand.`,
};

const SYSTEM_PROMPT = `Du bist ein empathischer Lernbegleiter in einer Weiterbildung für Lehrpersonen zum Thema KI im Berufsalltag.

Du erhältst ein Lehrpersonenprofil (Name, Beschreibung, Charakterzüge) und den Kontext eines Kursschritts.

Deine Aufgabe: Formuliere EINEN einzigen prägnanten Satz (max. 25 Wörter), der erklärt, weshalb genau DIESER Schritt für DIESE Lehrperson besonders wertvoll ist.

Regeln:
- Beziehe dich konkret auf einen Charakterzug oder eine Eigenschaft aus dem Profil
- Verwende Du-Ansprache
- Sei wertschätzend und ermutigend, aber nicht kitschig
- Kein Ausrufezeichen, keine Emojis
- Antworte NUR mit dem einen Satz, ohne Anführungszeichen`;

interface ProfileData {
  name: string;
  description: string;
  strengths: string[];
}

export async function POST(request: Request) {
  try {
    const { profile, stepNumber }: { profile: ProfileData; stepNumber: number } =
      await request.json();

    if (!profile || !stepNumber || !STEP_CONTEXTS[stepNumber]) {
      return NextResponse.json(
        { error: "Profil und gültige Schrittnummer erforderlich" },
        { status: 400 }
      );
    }

    const stepContext = STEP_CONTEXTS[stepNumber];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Lehrpersonenprofil:
- Typ: ${profile.name}
- Beschreibung: ${profile.description}
- Charakterzüge: ${profile.strengths.join(", ")}

Aktueller Kursschritt: ${stepContext}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    const insight = completion.choices[0].message.content?.trim() || "";

    return NextResponse.json({ insight });
  } catch (error) {
    console.error("Profile-Insight API Fehler:", error);
    return NextResponse.json(
      { error: "Insight-Generierung fehlgeschlagen" },
      { status: 500 }
    );
  }
}
