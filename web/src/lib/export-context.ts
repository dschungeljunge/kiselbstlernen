/**
 * Export-Utility – Kontext-Stack als Markdown
 *
 * Generiert den vollständigen Reflexionskontext als formatierten Markdown-Text,
 * der direkt in ein KI-Tool (ChatGPT, Copilot, Claude) eingefügt werden kann.
 * Macht Context Engineering sichtbar und übertragbar.
 */

import type { ProfileData, SituationData, StrategyData } from "@/contexts/ReflexionContext";
import { getStrategy, formatInteractiveAnswersForPrompt } from "@/lib/reflexion-strategies";

const STARS = (n: number) =>
  n > 0 ? "★".repeat(n) + "☆".repeat(5 - n) : "nicht bewertet";

function formatChatHistory(
  messages: StrategyData["chatHistory"]
): string {
  if (!messages || messages.length === 0) return "_Kein Gespräch geführt._";
  return messages
    .map((m) => `${m.role === "user" ? "**Ich:**" : "**KI:**"} ${m.content}`)
    .join("\n\n");
}

function formatFormAnswers(
  answers: Record<string, string>,
  strategyCode: string
): string {
  const strategy = getStrategy(strategyCode);
  if (!strategy?.formQuestions || Object.keys(answers).length === 0) return "";
  return strategy.formQuestions
    .filter((q) => answers[q.id]?.trim())
    .map((q) => `**${q.question}**\n${answers[q.id]}`)
    .join("\n\n");
}

export function generateContextMarkdown(
  profile: ProfileData | null,
  situation: SituationData | null,
  strategies: Record<string, StrategyData>,
  datum?: string
): string {
  const today = datum ?? new Date().toLocaleDateString("de-CH");
  const lines: string[] = [];

  lines.push(`# Mein Reflexionskontext – KI-Einsatz im Unterricht`);
  lines.push(`_Erstellt am ${today} | BBZ Olten Weiterbildung_`);
  lines.push("");
  lines.push("---");
  lines.push("");

  // Profil
  if (profile) {
    lines.push("## Wer ich bin");
    lines.push(`**${profile.name}**`);
    lines.push("");
    lines.push(profile.description);
    if (profile.strengths?.length > 0) {
      lines.push("");
      lines.push(`Stärken: ${profile.strengths.join(", ")}`);
    }
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  // Situation
  if (situation) {
    lines.push("## Meine Unterrichtssituation");
    if (situation.kiZusammenfassung) {
      lines.push(situation.kiZusammenfassung);
      lines.push("");
      lines.push(`<details><summary>Originalbeschreibung</summary>\n\n${situation.text}\n\n</details>`);
    } else {
      lines.push(situation.text);
    }
    if (situation.prompt?.trim()) {
      lines.push("");
      lines.push("### Verwendeter Prompt");
      lines.push("```");
      lines.push(situation.prompt.trim());
      lines.push("```");
    }
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  // Abgeschlossene Strategien
  const completedCodes = Object.entries(strategies)
    .filter(([, d]) => d.abgeschlossen)
    .map(([code]) => code);

  if (completedCodes.length === 0) {
    lines.push("_Noch keine Reflexionsstrategien abgeschlossen._");
  } else {
    for (const code of completedCodes) {
      const strategy = getStrategy(code);
      const data = strategies[code];
      if (!strategy || !data) continue;

      lines.push(`## Strategie ${strategy.letter}: ${strategy.title} (${STARS(data.selbsteinschaetzung)})`);
      lines.push(`_${strategy.kernfrage}_`);
      lines.push("");

      // Interaktive Antworten
      if (strategy.interactivePhase && Object.keys(data.interactiveAnswers ?? {}).length > 0) {
        const formatted = formatInteractiveAnswersForPrompt(strategy, data.interactiveAnswers ?? {});
        if (formatted) {
          lines.push("### Erste Einschätzungen");
          lines.push(formatted);
          lines.push("");
        }
      }

      // Chat (Strategien A, B, E)
      if (strategy.type === "chat" && data.chatHistory?.length > 0) {
        lines.push("### Reflexionsgespräch");
        lines.push(formatChatHistory(data.chatHistory));
        lines.push("");
      }

      // Formular-Antworten (Strategien C, D)
      if (strategy.type === "form" && Object.keys(data.formAnswers ?? {}).length > 0) {
        const formatted = formatFormAnswers(data.formAnswers ?? {}, code);
        if (formatted) {
          lines.push("### Meine Antworten");
          lines.push(formatted);
          lines.push("");
        }
      }

      lines.push("---");
      lines.push("");
    }
  }

  // Prompt-Vorschlag
  lines.push("## Nächster Schritt: KI-Ziel ableiten");
  lines.push("");
  lines.push(
    "Kopiere diesen Text in ein KI-Tool deiner Wahl (ChatGPT, Microsoft Copilot, Claude) und stelle folgende Frage:"
  );
  lines.push("");
  lines.push(
    '> **"Basierend auf diesem Reflexionskontext: Formuliere mir ein konkretes, umsetzbares KI-Ziel für meine nächste Unterrichtseinheit. Strukturiere es nach: Kontext (Fach/Klasse), Absicht (Was werde ich anders machen?), Massnahme (Konkrete technische oder didaktische Änderung), Termin (Bis wann?)."**'
  );

  return lines.join("\n");
}

/**
 * Erstellt den kompakten Kontext-Stack als System-Prompt für den Ziel-Chat auf der Plattform.
 * Strukturierter als der Export, optimiert für KI-Verarbeitung.
 */
export function buildZielSystemPrompt(
  profile: ProfileData | null,
  situation: SituationData | null,
  strategies: Record<string, StrategyData>
): string {
  const profileSection = profile
    ? `PROFIL:\nTyp: ${profile.name}\n${profile.description}\nStärken: ${profile.strengths.join(", ")}`
    : "KEIN PROFIL – spreche die Lehrperson direkt an.";

  const situationSection = situation
    ? [
        `SITUATION:\n${situation.kiZusammenfassung || situation.text}`,
        situation.prompt?.trim()
          ? `VERWENDETER PROMPT DER LEHRPERSON:\n${situation.prompt.trim()}`
          : "",
      ].filter(Boolean).join("\n\n")
    : "KEINE SITUATION BESCHRIEBEN.";

  const completedCodes = Object.entries(strategies)
    .filter(([, d]) => d.abgeschlossen)
    .map(([code]) => code);

  const strategiesSection = completedCodes.length === 0
    ? "KEINE REFLEXIONEN ABGESCHLOSSEN."
    : completedCodes.map((code) => {
        const strategy = getStrategy(code);
        const data = strategies[code];
        if (!strategy || !data) return "";

        const rating = `Selbsteinschätzung: ${data.selbsteinschaetzung}/5`;
        const lastMessages = (data.chatHistory ?? []).slice(-4);
        const chatSummary = lastMessages.length > 0
          ? "Letzter Gesprächsauszug:\n" + lastMessages.map(m => `${m.role === "user" ? "LP" : "KI"}: ${m.content.substring(0, 200)}`).join("\n")
          : "";
        const formSummary = Object.entries(data.formAnswers ?? {})
          .filter(([, v]) => v?.trim())
          .map(([, v]) => v.substring(0, 200))
          .join(" | ");

        return [
          `STRATEGIE ${strategy.letter} – ${strategy.title}:`,
          rating,
          chatSummary,
          formSummary,
        ].filter(Boolean).join("\n");
      }).join("\n\n---\n\n");

  return `Du bist ein KI-Coach, der einer Berufsschullehrperson hilft, ein konkretes KI-Ziel für den nächsten Unterricht zu formulieren.

${profileSection}

${situationSection}

REFLEXIONSERGEBNISSE DES TAGES:
${strategiesSection}

DEINE AUFGABE:
1. Stelle eine kurze, gezielte Rückfrage (Fach? Klasse? Was liegt als nächstes an?)
2. Schlage basierend auf den Reflexionsergebnissen ein konkretes Ziel vor – nicht generisch
3. Das Ziel hat 4 Dimensionen: Kontext (Fach/Klasse), Absicht (Was ändere ich?), Massnahme (Konkrete Aktion), Termin (Wann?)
4. Formuliere das finale Ziel als einen klaren, motivierenden Satz

GESPRÄCHSREGELN:
- Halte es kurz (max. 3–4 Austausche bis zum Ziel)
- Stelle immer nur EINE Frage
- Keine Emojis, keine Markdown-Formatierung im Chat
- Nimm direkt Bezug auf konkrete Erkenntnisse aus der Reflexion
- Spreche die Lehrperson mit Du an`;
}
