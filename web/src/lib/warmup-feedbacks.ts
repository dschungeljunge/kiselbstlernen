/**
 * Warmup-Feedbacks – Diagnostisches Triage-Spiel
 *
 * 15 Karten (3 pro Strategie), lockerer Einstieg.
 * Ton: authentisch, Jugendsprache wo passend, Lehrperson = "Lehrperson".
 */

import type { StrategyCode } from "./reflexion-strategies";

export interface WarmupPersona {
  beschreibung: string;
  icon: string;
}

export type FeedbackValenz = "positiv" | "negativ";

export interface WarmupFeedback {
  id: number;
  persona: WarmupPersona;
  zitat: string;
  sterne: number;
  valenz: FeedbackValenz;
  strategien: StrategyCode[];
}

const PERSONAS: Record<string, WarmupPersona> = {
  airpods:        { beschreibung: "Airpods immer drin, tippt alles mit dem Daumen",       icon: "🎧" },
  nebenjob:       { beschreibung: "Arbeitet nebenher, immer leicht abwesend",             icon: "⏰" },
  zweiteranlauf:  { beschreibung: "Zweiter Anlauf, kennt die Schule in- und auswendig",   icon: "🔄" },
  erstereiche:    { beschreibung: "Farbcodierte Notizen, immer erste Reihe",              icon: "📒" },
  neueinsteig:    { beschreibung: "Jüngste in der Klasse, noch etwas verloren",           icon: "🐣" },
  berufserfahren: { beschreibung: "Bereits mehrere Jahre Berufserfahrung mitgebracht",    icon: "💼" },
  humor:          { beschreibung: "Findet überall einen Witz, lockert die Stimmung auf",  icon: "😂" },
  sprachaufbau:   { beschreibung: "Deutsch noch im Aufbau, arbeitet konzentriert daran",  icon: "🌱" },
  praktikorien:   { beschreibung: "Kommt aus der Praxis, Theorie ist Durchhalteübung",    icon: "🔧" },
  nachtschicht:   { beschreibung: "Kommt manchmal direkt von der Nachtschicht",           icon: "😴" },
  kiprofi:        { beschreibung: "Hat KI-Tools schon lang vor dem Unterricht entdeckt",  icon: "🤖" },
};

export const WARMUP_FEEDBACKS: WarmupFeedback[] = [

  // ── A: Kognitive Aktivierung ─────────────────────────────────
  {
    id: 1,
    persona: PERSONAS.kiprofi,
    zitat: "die KI hat mir keine fertige antwort gegeben sondern immer weitergefragt. hab mich kurz geärgert – und dann gemerkt dass ich's jetzt mega gut verstanden hab",
    sterne: 5,
    valenz: "positiv",
    strategien: ["a"],
  },
  {
    id: 2,
    persona: PERSONAS.airpods,
    zitat: "alles reinkopiert, KI hat geantwortet, ich hab abgegeben. ob ich jetzt mehr weiss als vorher? ngl keine ahnung",
    sterne: 2,
    valenz: "negativ",
    strategien: ["a"],
  },
  {
    id: 3,
    persona: PERSONAS.erstereiche,
    zitat: "Die KI hat etwas Falsches gesagt und ich hab's gemerkt. Kleiner Moment, aber lowkey das Beste an der ganzen Stunde.",
    sterne: 4,
    valenz: "positiv",
    strategien: ["a"],
  },

  // ── B: Professionelles Erleben ───────────────────────────────
  {
    id: 4,
    persona: PERSONAS.humor,
    zitat: "als das tool abgestürzt ist hat die Lehrperson kurz gelacht und gemeint 'typisch, dann machen wirs halt anders'. kein drama. das war eigentlich voll gut",
    sterne: 4,
    valenz: "positiv",
    strategien: ["b"],
  },
  {
    id: 5,
    persona: PERSONAS.berufserfahren,
    zitat: "Man hat gemerkt dass die Lehrperson das selber noch nicht so sicher beherrscht. Ich kenn das aus dem Betrieb – wenn jemand etwas erklärt das er selbst noch lernt.",
    sterne: 2,
    valenz: "negativ",
    strategien: ["b"],
  },
  {
    id: 6,
    persona: PERSONAS.nebenjob,
    zitat: "die Lehrperson wirkte etwas angespannt – hatte das Gefühl sie wollte unbedingt dass es klappt. verständlich aber hat mich auch verunsichert",
    sterne: 3,
    valenz: "negativ",
    strategien: ["b"],
  },

  // ── C: Angebot & Nutzung ─────────────────────────────────────
  {
    id: 7,
    persona: PERSONAS.zweiteranlauf,
    zitat: "in 4 minuten fertig was andere 45 min gebraucht haben. die Lehrperson hatte nicht gesagt dass man das nicht so machen darf. vielleicht hätte sie die aufgabe anders stellen sollen",
    sterne: 2,
    valenz: "negativ",
    strategien: ["c"],
  },
  {
    id: 8,
    persona: PERSONAS.sprachaufbau,
    zitat: "Ich habe nicht gut verstanden was die Lehrperson von uns wollte. Habe dann gemacht was die anderen gemacht haben. War nicht sicher ob das richtig war.",
    sterne: 2,
    valenz: "negativ",
    strategien: ["c"],
  },
  {
    id: 9,
    persona: PERSONAS.neueinsteig,
    zitat: "die Lehrperson hat erklärt wie man's nutzen soll aber ich hab's einfach anders gemacht – hab die KI gefragt mir gegenfragen zu stellen statt antworten. hat voll gut funktioniert 🤷",
    sterne: 5,
    valenz: "positiv",
    strategien: ["c"],
  },

  // ── D: Lernzielorientierung ──────────────────────────────────
  {
    id: 10,
    persona: PERSONAS.kiprofi,
    zitat: "ich könnte das thema jetzt jemandem erklären. nicht die KI-antwort sondern wirklich. das ist für mich das zeichen dass ich's gecheckt hab",
    sterne: 5,
    valenz: "positiv",
    strategien: ["d"],
  },
  {
    id: 11,
    persona: PERSONAS.praktikorien,
    zitat: "hätte das ehrlich gesagt schneller ohne KI hingekriegt. weiss nicht was das gebracht hat ausser Zeit zu verschwenden",
    sterne: 2,
    valenz: "negativ",
    strategien: ["d"],
  },
  {
    id: 12,
    persona: PERSONAS.nachtschicht,
    zitat: "was haben wir heute eigentlich gelernt? die KI war cool aber ich weiss nicht was ich damit anfangen soll. kommt das in die prüfung oder?",
    sterne: 3,
    valenz: "negativ",
    strategien: ["d"],
  },

  // ── E: Berufsbild der Lernenden ──────────────────────────────
  {
    id: 13,
    persona: PERSONAS.berufserfahren,
    zitat: "Die KI hat Vorschläge gemacht die in der Praxis nie funktionieren würden. Das hab ich sofort gemerkt. Jetzt weiss ich wenigstens wofür ich die letzten Jahre gebraucht hab.",
    sterne: 4,
    valenz: "positiv",
    strategien: ["e"],
  },
  {
    id: 14,
    persona: PERSONAS.praktikorien,
    zitat: "wenn die KI das alles in 2 minuten macht – was mache ich dann die nächsten 40 jahre? ernsthaft, keine rhetorik, ich frag mich das wirklich",
    sterne: 3,
    valenz: "negativ",
    strategien: ["e"],
  },
  {
    id: 15,
    persona: PERSONAS.humor,
    zitat: "stell dir vor in der Pflege schreibt die KI den Bericht. und dann ist da ein Fehler drin. und niemand kontrolliert es weil alle dachten die KI macht das schon. not cool 😬",
    sterne: 3,
    valenz: "negativ",
    strategien: ["e"],
  },
];

export function berechneStrategieEmpfehlung(
  akzeptierteIds: number[]
): StrategyCode[] {
  const counts: Record<string, number> = {};
  for (const id of akzeptierteIds) {
    const f = WARMUP_FEEDBACKS.find((fb) => fb.id === id);
    if (!f) continue;
    for (const s of f.strategien) counts[s] = (counts[s] ?? 0) + 1;
  }
  return (Object.entries(counts) as [StrategyCode, number][])
    .sort((a, b) => b[1] - a[1])
    .map(([code]) => code);
}

export function analysiereFeedbackValenz(
  akzeptierteIds: number[]
): Record<string, { positiv: number; negativ: number }> {
  const result: Record<string, { positiv: number; negativ: number }> = {};
  for (const id of akzeptierteIds) {
    const f = WARMUP_FEEDBACKS.find((fb) => fb.id === id);
    if (!f) continue;
    for (const s of f.strategien) {
      if (!result[s]) result[s] = { positiv: 0, negativ: 0 };
      result[s][f.valenz]++;
    }
  }
  return result;
}
