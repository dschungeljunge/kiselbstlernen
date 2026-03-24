/**
 * API Route – Audio-Transkription
 *
 * POST /api/reflection/transcribe
 * Empfängt eine Audio-Datei (FormData) und gibt den transkribierten Text zurück.
 * Nutzt OpenAI Whisper.
 */

import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File | null;

    if (!audioFile) {
      return NextResponse.json(
        { error: "Keine Audio-Datei gefunden" },
        { status: 400 }
      );
    }

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: "de",
      prompt:
        "Berufsschullehrperson beschreibt einen KI-Einsatz im Unterricht. Pädagogischer Kontext.",
    });

    return NextResponse.json({ text: transcription.text });
  } catch (error) {
    console.error("Transkriptions-Fehler:", error);
    return NextResponse.json(
      { error: "Transkription fehlgeschlagen" },
      { status: 500 }
    );
  }
}
