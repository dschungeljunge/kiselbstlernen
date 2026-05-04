export type DimensionCode = "a" | "b" | "c" | "d" | "e";

export interface LessonDescriptionData {
  title: string;
  beruf: string;
  fachbereich: string;
  lerngruppe: string;
  thema: string;
  tools: string[];
  weitereTools: string;
  ziel: string;
  dauer: string;
  sozialform: string;
  materialien: string;
  prompts: string;
  beschreibung: string;
  besonderheiten: string;
}

export interface DimensionReflectionData {
  rating: number;
  answers: Record<string, string>;
  choices: Record<string, string>;
  interactiveAnswers: Record<string, unknown>;
  completed: boolean;
}

export interface ConclusionData {
  chatHistory: Array<{ role: "user" | "assistant"; content: string }>;
  finalSummary: string;
  publicSummary: string;
  publishConsent: boolean;
  completed: boolean;
}

export interface LessonReflectionDocument {
  schemaVersion: 1;
  lessonId: string | null;
  description: LessonDescriptionData;
  dimensions: Record<DimensionCode, DimensionReflectionData>;
  conclusion: ConclusionData;
}

export type InteractiveQuestionKind =
  | "slider"
  | "likert"
  | "ranking"
  | "weighting"
  | "rating-multi"
  | "multiple-choice"
  | "binary-list";

interface InteractiveQuestionBase {
  id: string;
  kind: InteractiveQuestionKind;
  prompt: string;
  helper?: string;
}

export interface SliderQuestion extends InteractiveQuestionBase {
  kind: "slider";
  min: number;
  max: number;
  step?: number;
  leftLabel: string;
  rightLabel: string;
  defaultValue?: number;
}

export interface LikertQuestion extends InteractiveQuestionBase {
  kind: "likert";
  steps: number;
  leftLabel: string;
  rightLabel: string;
}

export interface RankingQuestion extends InteractiveQuestionBase {
  kind: "ranking";
  items: Array<{ id: string; label: string }>;
  topLabel?: string;
  bottomLabel?: string;
}

export interface WeightingQuestion extends InteractiveQuestionBase {
  kind: "weighting";
  items: Array<{ id: string; label: string }>;
  total: number;
}

export interface RatingMultiQuestion extends InteractiveQuestionBase {
  kind: "rating-multi";
  items: Array<{ id: string; label: string }>;
  scale: number;
  scaleLabels?: [string, string];
}

export interface MultipleChoiceQuestion extends InteractiveQuestionBase {
  kind: "multiple-choice";
  options: Array<{ id: string; label: string }>;
}

export interface BinaryListQuestion extends InteractiveQuestionBase {
  kind: "binary-list";
  statements: Array<{ id: string; label: string }>;
  agreeLabel?: string;
  disagreeLabel?: string;
}

export type InteractiveQuestion =
  | SliderQuestion
  | LikertQuestion
  | RankingQuestion
  | WeightingQuestion
  | RatingMultiQuestion
  | MultipleChoiceQuestion
  | BinaryListQuestion;

export interface DimensionConfig {
  code: DimensionCode;
  letter: string;
  title: string;
  subtitle: string;
  kernfrage: string;
  loomUrl: string;
  intro: string;
  ratingLabel: string;
  questions: Array<{ id: string; label: string; placeholder: string }>;
  choice: {
    id: string;
    label: string;
    options: string[];
  };
  interactiveQuestions: InteractiveQuestion[];
}

export const EMPTY_LESSON_DESCRIPTION: LessonDescriptionData = {
  title: "",
  beruf: "",
  fachbereich: "",
  lerngruppe: "",
  thema: "",
  tools: [],
  weitereTools: "",
  ziel: "",
  dauer: "",
  sozialform: "",
  materialien: "",
  prompts: "",
  beschreibung: "",
  besonderheiten: "",
};

export const EMPTY_DIMENSION_REFLECTION: DimensionReflectionData = {
  rating: 0,
  answers: {},
  choices: {},
  interactiveAnswers: {},
  completed: false,
};

export const EMPTY_CONCLUSION: ConclusionData = {
  chatHistory: [],
  finalSummary: "",
  publicSummary: "",
  publishConsent: false,
  completed: false,
};

export const KI_TOOL_OPTIONS = [
  "ChatGPT",
  "Microsoft Copilot",
  "Claude",
  "Gemini",
  "Perplexity",
  "DeepL Write",
  "Canva KI",
  "Fobizz Tools",
  "Eigene Schulplattform",
];

export const BERUF_OPTIONS = [
  "Detailhandel",
  "Kaufmännische Berufe",
  "Gesundheit / Pflege",
  "Gastronomie / Hotellerie",
  "Informatik",
  "Technik / Industrie",
  "Handwerk",
  "Allgemeinbildung",
  "Andere",
];

export const SOZIALFORM_OPTIONS = [
  "Einzelarbeit",
  "Partnerarbeit",
  "Gruppenarbeit",
  "Plenum",
  "Werkstatt / Stationen",
  "Projektarbeit",
];

export const DURATION_OPTIONS = [
  "15 Minuten",
  "30 Minuten",
  "45 Minuten",
  "60 Minuten",
  "90 Minuten",
  "Mehr als 90 Minuten",
];

export const DIMENSIONS: DimensionConfig[] = [
  {
    code: "a",
    letter: "A",
    title: "Kognitive Aktivierung",
    subtitle: "Perspektive: Lernende",
    kernfrage:
      "Haben die Lernenden aktiv gedacht – oder hat die KI für sie gedacht?",
    loomUrl: "https://www.loom.com/embed/8fb4e6021d274fc79f2b67bf0a23df2b",
    intro:
      "Kognitive Aktivierung beschreibt, wie stark Lernende zu echtem Nachdenken angeregt werden (Klieme, Lipowsky). Die Frage ist nicht, ob KI eingesetzt wurde, sondern was Lernende in dieser Zeit kognitiv geleistet haben.",
    ratingLabel: "Wie stark wurden die Lernenden kognitiv aktiviert?",
    choice: {
      id: "ki_rolle",
      label: "Die KI war in dieser Einheit vor allem...",
      options: [
        "Antwortmaschine",
        "Sparringspartner",
        "Recherchehilfe",
        "Strukturierungshilfe",
        "Kreativer Impuls",
        "Abkürzung für Lernende",
      ],
    },
    questions: [
      {
        id: "denkmoment",
        label:
          "Beschreibe einen Moment, in dem Lernende vom KI-Output abwichen, ihn hinterfragten oder sichtbar weiterdachten.",
        placeholder:
          "Konkrete Situation – wer hat wann was getan, das auf echtes Nachdenken hindeutete?",
      },
      {
        id: "ohne_ki_szenario",
        label:
          "Was wäre kognitiv anders gelaufen, wenn diese Stunde ohne KI stattgefunden hätte?",
        placeholder:
          "Welche Denkleistung wäre weggefallen, welche dazugekommen, welche tiefer gegangen?",
      },
    ],
    interactiveQuestions: [
      {
        id: "wer_hat_gedacht",
        kind: "slider",
        prompt: "Wer hat in dieser Einheit mehr gedacht?",
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 50,
        leftLabel: "Vor allem die KI",
        rightLabel: "Vor allem die Lernenden",
      },
      {
        id: "ohne_ki_gleich_viel",
        kind: "likert",
        prompt: "„Die Lernenden hätten ohne KI ähnlich viel gelernt.“",
        steps: 7,
        leftLabel: "Stimme nicht zu",
        rightLabel: "Stimme voll zu",
      },
      {
        id: "zeitverteilung",
        kind: "weighting",
        prompt: "Womit haben die Lernenden ihre KI-Zeit tatsächlich verbracht?",
        helper: "Verteile 100 Punkte – ehrlich, nicht idealisiert.",
        total: 100,
        items: [
          { id: "eigenes_denken", label: "Eigenes Denken & Entscheiden" },
          { id: "kopieren", label: "KI-Output kopieren / übernehmen" },
          { id: "diskutieren", label: "Diskutieren mit Mitlernenden" },
          { id: "bewerten", label: "KI-Output prüfen & bewerten" },
        ],
      },
    ],
  },
  {
    code: "b",
    letter: "B",
    title: "Professionelles Erleben",
    subtitle: "Perspektive: Lehrperson",
    kernfrage:
      "Wie habe ich mich als Lehrperson gefühlt – und was sagt das über meinen KI-Einsatz?",
    loomUrl: "https://www.loom.com/embed/3c39d7f8bfb04f3a930f9c82ff05b691",
    intro:
      "Lehrpersonen sind professionelle Beobachter:innen ihres Unterrichts (Sherin & van Es). Dein eigenes Erleben – Sicherheit, Irritation, Kontrolle, Fremdheit – ist ein valider Indikator für Qualität, auch wenn die Stunde technisch funktioniert hat.",
    ratingLabel: "Wie stimmig fühlte sich der KI-Einsatz für dich an?",
    choice: {
      id: "erleben",
      label: "Mein dominierendes Erleben war...",
      options: [
        "Sicherheit",
        "Neugier",
        "Kontrollverlust",
        "Entlastung",
        "Skepsis",
        "Überraschung",
      ],
    },
    questions: [
      {
        id: "irritation_oder_stolz",
        label:
          "Welche Situation aus dieser Stunde geht dir nach – als Irritation, Stolz oder offene Frage?",
        placeholder:
          "Beschreibe kurz die Situation und warum sie dich beschäftigt.",
      },
      {
        id: "rolle_neu",
        label:
          "Was würdest du beim nächsten KI-Einsatz an deiner Lehrrolle bewusst anders gestalten?",
        placeholder:
          "Konkret: Welche Position, welche Geste, welche Phase würdest du anders machen?",
      },
    ],
    interactiveQuestions: [
      {
        id: "kontrolle",
        kind: "slider",
        prompt: "Wie war dein Kontrollempfinden während der Stunde?",
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 50,
        leftLabel: "Ich hatte volle Kontrolle",
        rightLabel: "Die KI hat übernommen",
      },
      {
        id: "gefuehle_ranking",
        kind: "ranking",
        prompt: "Sortiere deine Gefühle während der Stunde nach Stärke.",
        topLabel: "Am stärksten",
        bottomLabel: "Am schwächsten",
        items: [
          { id: "sicherheit", label: "Sicherheit" },
          { id: "neugier", label: "Neugier" },
          { id: "anspannung", label: "Anspannung" },
          { id: "stolz", label: "Stolz" },
          { id: "irritation", label: "Irritation" },
        ],
      },
      {
        id: "rollen_aussagen",
        kind: "binary-list",
        prompt: "Wie zutreffend sind diese Aussagen über deine Stunde?",
        agreeLabel: "Trifft zu",
        disagreeLabel: "Trifft nicht zu",
        statements: [
          {
            id: "kein_techsupport",
            label: "Ich war Lehrperson – nicht Tech-Support für die KI.",
          },
          {
            id: "spontan_reagieren",
            label: "Ich konnte spontan reagieren, als etwas nicht lief.",
          },
          {
            id: "lieber_ohne",
            label: "Ich hätte die Stunde ohne KI lieber gehalten.",
          },
          {
            id: "berufsethos_intakt",
            label: "Mein Berufsethos blieb unbeschädigt.",
          },
        ],
      },
    ],
  },
  {
    code: "c",
    letter: "C",
    title: "Angebot & Nutzung",
    subtitle: "Perspektive: Didaktik",
    kernfrage:
      "Wurde mein geplantes Angebot so genutzt, wie ich es mir vorgestellt hatte – und was verrät die Abweichung?",
    loomUrl: "https://www.loom.com/embed/1b66870f8b8842ec9e368ab816c486bd",
    intro:
      "Das Angebot-Nutzungs-Modell (Helmke) zeigt: Unterricht ist ein Angebot, das Lernende aktiv nutzen – oder eben nicht. Bei KI-Einsatz ist die Lücke zwischen Plan und Nutzung besonders aufschlussreich, weil Lernende oft eigene Wege finden.",
    ratingLabel: "Wie gut passten Planung und tatsächliche Nutzung zusammen?",
    choice: {
      id: "nutzung",
      label: "Die Nutzung durch die Lernenden war...",
      options: [
        "wie geplant",
        "kreativer als erwartet",
        "oberflächlicher als erwartet",
        "technisch erschwert",
        "stark unterschiedlich",
        "kaum beobachtbar",
      ],
    },
    questions: [
      {
        id: "abweichung_konkret",
        label:
          "Beschreibe eine konkrete Abweichung zwischen Angebot und Nutzung – was verrät sie über deine Lerngruppe?",
        placeholder: "Was war geplant, was ist passiert, und was lese ich daraus?",
      },
      {
        id: "rahmung",
        label:
          "Wo hätte dein Angebot enger oder offener sein müssen, damit die Nutzung dem Lernziel dient?",
        placeholder: "Welche Rahmung hat gefehlt – oder zu eng gewirkt?",
      },
    ],
    interactiveQuestions: [
      {
        id: "passung",
        kind: "slider",
        prompt: "Wie war die Passung zwischen Plan und Realität?",
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 50,
        leftLabel: "Komplett anders gelaufen",
        rightLabel: "Genau wie geplant",
      },
      {
        id: "ursachen_ranking",
        kind: "ranking",
        prompt:
          "Sortiere die Ursachen der Abweichung nach Bedeutung – wichtigste zuerst.",
        topLabel: "Wichtigste Ursache",
        bottomLabel: "Geringe Wirkung",
        items: [
          { id: "aufgabe", label: "Aufgabenformulierung" },
          { id: "vorwissen", label: "Vorwissen der Lernenden" },
          { id: "zugang", label: "Tool-Zugang & Technik" },
          { id: "zeit", label: "Zeitdruck" },
          { id: "tool_verhalten", label: "Verhalten des KI-Tools" },
        ],
      },
      {
        id: "nutzung_wofuer",
        kind: "weighting",
        prompt: "Wofür haben die Lernenden die KI tatsächlich genutzt?",
        helper: "Verteile 100 Punkte – nüchtern, nicht wunschdenkend.",
        total: 100,
        items: [
          { id: "hauptaufgabe", label: "Für die eigentliche Aufgabe" },
          { id: "abkuerzung", label: "Als Abkürzung zum Ergebnis" },
          { id: "uebersetzung", label: "Übersetzung / Sprachhilfe" },
          { id: "inspiration", label: "Inspiration / Ideen sammeln" },
        ],
      },
    ],
  },
  {
    code: "d",
    letter: "D",
    title: "Lernzielorientierung",
    subtitle: "Perspektive: Ziel",
    kernfrage:
      "Hat dieser KI-Einsatz zum Erreichen des Lernziels beigetragen – oder daran vorbeigezielt?",
    loomUrl: "https://www.loom.com/embed/6785aaf891d34f87beb6d280ceba1a16",
    intro:
      "Constructive Alignment (Biggs) verlangt Kohärenz zwischen Lernziel, Aktivität und Beurteilung. KI-Einsatz stört diese Kohärenz oft – etwa wenn das Ziel „Argumentieren“ ist, aber die KI das Argument liefert.",
    ratingLabel: "Wie stark hat der KI-Einsatz das Lernziel unterstützt?",
    choice: {
      id: "lernziel_bezug",
      label: "Der Bezug zum Lernziel war...",
      options: [
        "Direkt zielführend",
        "Unterstützend (Hilfsfunktion)",
        "Neutral (kein Effekt)",
        "Ablenkend",
        "Lernziel umgangen",
        "Nicht klar bestimmbar",
      ],
    },
    questions: [
      {
        id: "neuer_kompetenzgewinn",
        label:
          "Was können oder wissen die Lernenden nach dieser Stunde, was sie vorher nicht konnten – und ist das genau das, was du wolltest?",
        placeholder:
          "Beschreibe den konkreten Kompetenzgewinn – beobachtbar, nicht nur vermutet.",
      },
      {
        id: "ohne_ki_nachhaltiger",
        label:
          "Hätte das Lernziel ohne KI nachhaltiger oder tiefer erreicht werden können – warum oder warum nicht?",
        placeholder:
          "Was hätte die KI verhindert, was hätte sie ermöglicht – aufs Lernziel bezogen?",
      },
    ],
    interactiveQuestions: [
      {
        id: "ziel_im_zentrum",
        kind: "slider",
        prompt: "Was stand im Zentrum dieser Stunde?",
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 50,
        leftLabel: "Das KI-Tool",
        rightLabel: "Das Lernziel",
      },
      {
        id: "ki_notwendig",
        kind: "likert",
        prompt:
          "„Der KI-Einsatz war für das Erreichen des Lernziels notwendig.“",
        steps: 7,
        leftLabel: "Stimme nicht zu",
        rightLabel: "Stimme voll zu",
      },
      {
        id: "alignment",
        kind: "rating-multi",
        prompt: "Wie kohärent waren die Bestandteile deiner Stunde?",
        helper: "Constructive Alignment: Wo passt was zusammen?",
        scale: 5,
        scaleLabels: ["nicht kohärent", "voll kohärent"],
        items: [
          { id: "ziel_aufgabe", label: "Lernziel ↔ Aufgabe" },
          { id: "aufgabe_ki", label: "Aufgabe ↔ KI-Einsatz" },
          { id: "aufgabe_beurteilung", label: "Aufgabe ↔ Beurteilung" },
          { id: "beurteilung_ziel", label: "Beurteilung ↔ Lernziel" },
        ],
      },
    ],
  },
  {
    code: "e",
    letter: "E",
    title: "Berufsbild der Lernenden",
    subtitle: "Perspektive: Berufsschule",
    kernfrage:
      "Welches Berufsbild habe ich durch diesen KI-Einsatz – bewusst oder unbewusst – vermittelt?",
    loomUrl: "https://www.loom.com/embed/6064b8539bb64cd7bab5495adec93b2f",
    intro:
      "Berufsschule sozialisiert Lernende in eine berufliche Identität (Oser). Wenn KI Tätigkeiten übernimmt, die später als sinnstiftend erlebt werden sollen, vermittelt das implizit: Diese Tätigkeit ist automatisierbar – also nicht wichtig. Eine berufsethische Aussage, die reflektiert werden muss.",
    ratingLabel: "Wie bewusst hast du den KI-Einsatz mit dem Berufsbild verknüpft?",
    choice: {
      id: "berufsbezug",
      label: "Der KI-Einsatz zeigte den Lernenden vor allem...",
      options: [
        "Automatisierung",
        "Qualitätssicherung",
        "Kreative Unterstützung",
        "Kritische Verantwortung",
        "Effizienz",
        "Noch keinen klaren Berufsbezug",
      ],
    },
    questions: [
      {
        id: "kerntaetigkeit_grenze",
        label:
          "Welche Tätigkeit deines Berufsfelds darf in deinem Unterricht niemals an die KI delegiert werden – und warum?",
        placeholder: "Formuliere eine konkrete Grenze für dein Berufsfeld.",
      },
      {
        id: "berufliches_lernen",
        label:
          "Was haben die Lernenden über ihren zukünftigen Beruf gelernt – nicht über das Tool, sondern über den Beruf selbst?",
        placeholder: "Welche Botschaft über den Beruf bleibt nach der Stunde hängen?",
      },
    ],
    interactiveQuestions: [
      {
        id: "ersatz_oder_unterstuetzung",
        kind: "slider",
        prompt: "Was hat dein Einsatz über den Beruf vermittelt?",
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 50,
        leftLabel: "KI ersetzt Tätigkeiten",
        rightLabel: "KI unterstützt Tätigkeiten",
      },
      {
        id: "delegierbarkeit",
        kind: "ranking",
        prompt:
          "Sortiere typische Tätigkeiten deines Berufsfelds nach KI-Delegierbarkeit – am ehesten delegierbar zuerst.",
        topLabel: "Eher an KI delegierbar",
        bottomLabel: "Bleibt bei Menschen",
        items: [
          { id: "routine", label: "Routinearbeit" },
          { id: "doku", label: "Dokumentation & Berichte" },
          { id: "diagnose", label: "Diagnose & Beurteilung" },
          { id: "kommunikation", label: "Kommunikation mit Menschen" },
          { id: "ethik", label: "Ethische Entscheidungen" },
        ],
      },
      {
        id: "botschaften",
        kind: "weighting",
        prompt: "Welche Botschaften über den Beruf sind angekommen?",
        helper: "Verteile 100 Punkte – auch unbeabsichtigte Botschaften zählen.",
        total: 100,
        items: [
          { id: "effizienz", label: "Effizienz ist wichtig" },
          { id: "qualitaet", label: "Qualität ist wichtig" },
          { id: "verantwortung", label: "Verantwortung bleibt beim Menschen" },
          { id: "menschlichkeit", label: "Menschlichkeit zählt" },
          { id: "bedrohung", label: "Mein Beruf ist bedroht" },
        ],
      },
    ],
  },
];

export function createEmptyLessonDocument(): LessonReflectionDocument {
  return {
    schemaVersion: 1,
    lessonId: null,
    description: { ...EMPTY_LESSON_DESCRIPTION },
    dimensions: DIMENSIONS.reduce((acc, dimension) => {
      acc[dimension.code] = {
        ...EMPTY_DIMENSION_REFLECTION,
        answers: {},
        choices: {},
        interactiveAnswers: {},
      };
      return acc;
    }, {} as Record<DimensionCode, DimensionReflectionData>),
    conclusion: { ...EMPTY_CONCLUSION, chatHistory: [] },
  };
}

export function buildLessonTitle(description: LessonDescriptionData): string {
  return (
    description.title.trim() ||
    [description.thema, description.fachbereich, description.beruf]
      .filter(Boolean)
      .join(" - ") ||
    "KI-Unterrichtseinheit"
  );
}

export function buildLessonSummary(description: LessonDescriptionData): string {
  const parts = [
    description.ziel && `Ziel: ${description.ziel}`,
    description.tools.length > 0 && `Tools: ${description.tools.join(", ")}`,
    description.beschreibung,
  ].filter(Boolean);
  return parts.join("\n\n").slice(0, 1200);
}

/**
 * Formatiert die Antwort einer interaktiven Frage als Klartext für KI-Prompts
 * oder Exporte. Liefert null, wenn keine sinnvolle Antwort vorliegt.
 */
export function formatInteractiveAnswerForPrompt(
  question: InteractiveQuestion,
  value: unknown,
): string | null {
  if (value === undefined || value === null) return null;

  switch (question.kind) {
    case "slider": {
      if (typeof value !== "number") return null;
      return `${question.prompt} → ${value} (${question.leftLabel} ↔ ${question.rightLabel})`;
    }
    case "likert": {
      if (typeof value !== "number") return null;
      return `${question.prompt} → ${value}/${question.steps} (${question.leftLabel} ↔ ${question.rightLabel})`;
    }
    case "ranking": {
      if (!Array.isArray(value)) return null;
      const labelMap = Object.fromEntries(question.items.map((item) => [item.id, item.label]));
      const ordered = (value as string[])
        .map((id, idx) => `${idx + 1}. ${labelMap[id] ?? id}`)
        .join(" | ");
      return ordered ? `${question.prompt} → ${ordered}` : null;
    }
    case "weighting": {
      if (typeof value !== "object") return null;
      const labelMap = Object.fromEntries(question.items.map((item) => [item.id, item.label]));
      const entries = Object.entries(value as Record<string, number>)
        .filter(([, v]) => typeof v === "number" && v > 0)
        .sort((a, b) => b[1] - a[1])
        .map(([id, v]) => `${labelMap[id] ?? id}: ${v}`);
      return entries.length ? `${question.prompt} → ${entries.join(", ")}` : null;
    }
    case "rating-multi": {
      if (typeof value !== "object") return null;
      const labelMap = Object.fromEntries(question.items.map((item) => [item.id, item.label]));
      const entries = Object.entries(value as Record<string, number>)
        .filter(([, v]) => typeof v === "number" && v > 0)
        .map(([id, v]) => `${labelMap[id] ?? id}: ${v}/${question.scale}`);
      return entries.length ? `${question.prompt} → ${entries.join(", ")}` : null;
    }
    case "multiple-choice": {
      if (!Array.isArray(value)) return null;
      const labelMap = Object.fromEntries(question.options.map((opt) => [opt.id, opt.label]));
      const labels = (value as string[]).map((id) => labelMap[id] ?? id);
      return labels.length ? `${question.prompt} → ${labels.join(", ")}` : null;
    }
    case "binary-list": {
      if (typeof value !== "object") return null;
      const map = value as Record<string, "agree" | "disagree">;
      const lines = question.statements
        .map((stmt) => {
          const v = map[stmt.id];
          if (!v) return null;
          return `  - „${stmt.label}“ → ${v === "agree" ? (question.agreeLabel ?? "Stimme zu") : (question.disagreeLabel ?? "Stimme nicht zu")}`;
        })
        .filter(Boolean);
      return lines.length ? `${question.prompt}\n${lines.join("\n")}` : null;
    }
  }
}
