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

// System-Prompt für Profilerstellung
const SYSTEM_PROMPT = `Du bist ein einfühlsamer Coach, der Lehrpersonen dabei hilft, ihre Stärken zu entdecken.

Deine Aufgabe:
1. Stelle 4-5 kurze, offene Fragen über ihre Unterrichtstätigkeit (z.B. Fächer, Stufe, Lieblings-Lehrmomente, Herausforderungen, Unterrichtsstil).
2. Höre aktiv zu und stelle Nachfragen, wenn Antworten interessante Details enthalten.
3. Nach genügend Informationen (ca. 4-5 Austausche) erstelle ein kreatives Lehrpersonen-Profil.

Das Profil besteht aus:
- **Kreativer Profil-Name** (z.B. "Der experimentierfreudige Pragmatiker", "Die strukturierte Motivatorin")
- **Kurze Beschreibung** (2-3 Sätze, was die Person auszeichnet)
- **3-4 Stärken** (konkrete, positive Eigenschaften)

Wenn du das Profil erstellt hast, antworte mit diesem JSON-Format:
{
  "profile": {
    "name": "Profil-Name",
    "description": "Beschreibung...",
    "strengths": ["Stärke 1", "Stärke 2", "Stärke 3"]
  }
}

WICHTIG: 
- Sei warmherzig, wertschätzend und konkret
- Stelle nur EINE Frage pro Nachricht
- Halte Fragen kurz und zugänglich
- Erstelle das Profil erst nach 4-5 Austauschen
- Wenn du das Profil erstellst, gib NUR das JSON zurück (kein zusätzlicher Text)`;

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: Request) {
  try {
    const { messages }: { messages: Message[] } = await request.json();

    // OpenAI API Call
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Oder "o1-preview" / "gpt-4-turbo" je nach Verfügbarkeit
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
      temperature: 0.8,
      max_tokens: 800,
    });

    const assistantMessage = completion.choices[0].message.content || "";

    // Prüfen, ob Profil erstellt wurde (JSON-Format)
    try {
      const profileData = JSON.parse(assistantMessage);
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



