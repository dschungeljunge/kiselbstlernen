/**
 * Seed-Skript für öffentliche Beispiel-Einträge in documented_lessons.
 *
 * Ausführen:
 * node --env-file=.env.local scripts/seed-sammlung-examples.mjs
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Fehlende Umgebungsvariablen: NEXT_PUBLIC_SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY."
  );
  process.exit(1);
}

const nowIso = new Date().toISOString();

const examples = [
  {
    schema_version: 1,
    session_code: null,
    title: "ABU: Argumentieren mit KI-Gegenpositionen",
    summary:
      "Lernende entwickeln zunächst ohne KI eine Position und nutzen KI danach als kritischen Gegenpart zur Überarbeitung.",
    phase1: {
      title: "ABU: Argumentieren mit KI-Gegenpositionen",
      beruf: "Kaufmännische Berufe",
      fachbereich: "ABU / Kommunikation",
      lerngruppe: "2. Lehrjahr, 18 Lernende",
      thema: "Leserbrief zu Lohngerechtigkeit",
      tools: ["ChatGPT", "Microsoft Copilot"],
      weitereTools: "",
      ziel: "Eigene Positionen argumentativ begründen und überarbeiten.",
      dauer: "45 Minuten",
      sozialform: "Einzelarbeit",
      materialien: "Beispielartikel, Kriterienraster",
      prompts: "Nenne mir ein starkes Gegenargument zu meinem Text.",
      beschreibung:
        "Die Lernenden verfassten zuerst einen Rohtext ohne KI und arbeiteten danach mit KI-Gegenargumenten eine zweite Version aus.",
      besonderheiten:
        "Stärkere Texte bei Lernenden, die die KI als Prüfinstanz statt als Autor nutzten.",
    },
    dimensions: {
      a: { rating: 4, completed: true, answers: {}, choices: {} },
      b: { rating: 3, completed: true, answers: {}, choices: {} },
      c: { rating: 4, completed: true, answers: {}, choices: {} },
      d: { rating: 4, completed: true, answers: {}, choices: {} },
      e: { rating: 4, completed: true, answers: {}, choices: {} },
    },
    conclusion: {
      chatHistory: [],
      finalSummary:
        "Die Reihenfolge ist entscheidend: Erst eigene Denkarbeit, dann KI als kritisches Werkzeug.",
      publicSummary:
        "Die Einheit zeigte, dass KI die Argumentationsqualität verbessert, wenn Lernende zuerst selbst Position beziehen.",
      publishConsent: true,
      completed: true,
    },
    final_summary:
      "Die Einheit zeigte, dass KI die Argumentationsqualität verbessert, wenn Lernende zuerst selbst Position beziehen.",
    is_public: true,
    published_at: nowIso,
  },
  {
    schema_version: 1,
    session_code: null,
    title: "Pflege: Fallanalyse mit KI-Fragenavigator",
    summary:
      "Eine Pflegeklasse analysiert Patientensituationen und nutzt KI zur Strukturierung klinischer Entscheidungsfragen.",
    phase1: {
      title: "Pflege: Fallanalyse mit KI-Fragenavigator",
      beruf: "Gesundheit / Pflege",
      fachbereich: "Pflegeprozess",
      lerngruppe: "3. Lehrjahr HF, 14 Lernende",
      thema: "Postoperative Schmerzbeobachtung",
      tools: ["ChatGPT"],
      weitereTools: "Schulinternes LMS",
      ziel: "Pflegebeobachtungen priorisieren und begründen.",
      dauer: "60 Minuten",
      sozialform: "Partnerarbeit",
      materialien: "Fallvignette, Beobachtungsbogen",
      prompts: "Formuliere 5 priorisierte Rückfragen für die Fallanalyse.",
      beschreibung:
        "Lernende nutzten KI zur Fragegenerierung und begründeten anschliessend jede Priorisierung mit Fachwissen.",
      besonderheiten:
        "Höhere Beteiligung bei unsicheren Lernenden durch klaren KI-Scaffold.",
    },
    dimensions: {
      a: { rating: 4, completed: true, answers: {}, choices: {} },
      b: { rating: 4, completed: true, answers: {}, choices: {} },
      c: { rating: 3, completed: true, answers: {}, choices: {} },
      d: { rating: 4, completed: true, answers: {}, choices: {} },
      e: { rating: 5, completed: true, answers: {}, choices: {} },
    },
    conclusion: {
      chatHistory: [],
      finalSummary:
        "KI als Fragegenerator stärkte diagnostisches Denken, solange Begründungen verpflichtend eingefordert wurden.",
      publicSummary:
        "Die Fallanalyse profitierte von KI-Leitfragen; entscheidend blieb die fachliche Begründung durch Lernende.",
      publishConsent: true,
      completed: true,
    },
    final_summary:
      "Die Fallanalyse profitierte von KI-Leitfragen; entscheidend blieb die fachliche Begründung durch Lernende.",
    is_public: true,
    published_at: nowIso,
  },
  {
    schema_version: 1,
    session_code: null,
    title: "Informatik: Prompt-Debugging im Team",
    summary:
      "Lernende verbessern iterativ fehlerhafte Prompts und dokumentieren, wie Prompt-Änderungen die Codequalität beeinflussen.",
    phase1: {
      title: "Informatik: Prompt-Debugging im Team",
      beruf: "Informatik",
      fachbereich: "Applikationsentwicklung",
      lerngruppe: "1. Lehrjahr, 20 Lernende",
      thema: "Funktionen testen und verbessern",
      tools: ["Claude", "GitHub Copilot"],
      weitereTools: "VS Code",
      ziel: "Prompt-Qualität als Teil von Softwarequalität verstehen.",
      dauer: "90 Minuten",
      sozialform: "Gruppenarbeit",
      materialien: "Starter-Repository mit Bugs",
      prompts: "Refaktoriere nur diesen Block und erkläre jede Änderung in einem Satz.",
      beschreibung:
        "Teams erhielten absichtlich schlechte Ausgangsprompts und mussten diese systematisch verbessern.",
      besonderheiten:
        "Höchster Lerngewinn in Teams mit expliziter Prompt-Dokumentation.",
    },
    dimensions: {
      a: { rating: 5, completed: true, answers: {}, choices: {} },
      b: { rating: 4, completed: true, answers: {}, choices: {} },
      c: { rating: 4, completed: true, answers: {}, choices: {} },
      d: { rating: 4, completed: true, answers: {}, choices: {} },
      e: { rating: 4, completed: true, answers: {}, choices: {} },
    },
    conclusion: {
      chatHistory: [],
      finalSummary:
        "Die Qualität der Prompts wurde als überprüfbare Engineering-Leistung sichtbar und nicht nur als KI-Interaktion.",
      publicSummary:
        "Prompt-Debugging machte deutlich, dass präzise Aufgabenstellung und Review-Kompetenz den KI-Nutzen bestimmen.",
      publishConsent: true,
      completed: true,
    },
    final_summary:
      "Prompt-Debugging machte deutlich, dass präzise Aufgabenstellung und Review-Kompetenz den KI-Nutzen bestimmen.",
    is_public: true,
    published_at: nowIso,
  },
];

async function seed() {
  console.log(`Seede ${examples.length} Beispiel-Einträge in documented_lessons...`);
  const response = await fetch(`${SUPABASE_URL}/rest/v1/documented_lessons`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(examples),
  });

  const payload = await response.text();
  if (!response.ok) {
    console.error("Fehler beim Seeding:", payload);
    process.exit(1);
  }

  let rows = [];
  try {
    rows = JSON.parse(payload);
  } catch {
    rows = [];
  }
  console.log(`✓ Erfolgreich eingefügt: ${rows.length} Einträge`);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
