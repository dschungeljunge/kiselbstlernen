/**
 * API Route – KI-Ziel Chat
 *
 * POST /api/reflection/ziel
 * Nutzt den vollständigen Kontext-Stack aus der Reflexion,
 * um ein konkretes, situiertes KI-Ziel zu erarbeiten.
 */

import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import { buildZielSystemPrompt } from "@/lib/export-context";
import type { ProfileData, SituationData, StrategyData } from "@/contexts/ReflexionContext";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: Request) {
  try {
    const {
      messages,
      profile,
      situation,
      strategies,
    }: {
      messages: Message[];
      profile: ProfileData | null;
      situation: SituationData | null;
      strategies: Record<string, StrategyData>;
    } = await request.json();

    const systemPrompt = buildZielSystemPrompt(profile, situation, strategies);

    const completion = await openai.chat.completions.create({
      model: "gpt-5.2",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.65,
      max_completion_tokens: 500,
    });

    const message =
      completion.choices[0].message.content?.trim() ??
      "Entschuldigung, bitte versuche es erneut.";

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Ziel-Chat Fehler:", error);
    return NextResponse.json(
      { error: "Chat-Anfrage fehlgeschlagen" },
      { status: 500 }
    );
  }
}
