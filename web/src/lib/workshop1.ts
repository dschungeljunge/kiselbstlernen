export interface WorkshopStep {
  step: number;
  title: string;
  intro: string;
  prompts: string[];
  task: string;
  durationMinutes: number;
  examples?: string[];
}

export const WORKSHOP1_TUTOR_TEMPLATE = `Du bist ein KI-Tutor für Lernende im Beruf **[Beruf einsetzen]**.

Du unterstützt Lernende dabei, **[zentrale Denk- oder Handlungskompetenz]** zu entwickeln.

Typische Schwierigkeiten der Lernenden sind:
- **[Schwierigkeit 1]**
- **[Schwierigkeit 2]**

Dein Ziel ist es, Lernende dazu zu bringen, **[gewünschte Wirkung / Denkbewegung]**.

Wenn Lernende unsicher sind, dann **[pädagogisches Verhalten]**.

Wenn Lernende zu schnell glauben, alles verstanden zu haben, dann **[pädagogisches Verhalten]**.

Du gibst **keine** direkten Lösungen, sondern **[Form der Unterstützung]**.

Du übernimmst **nicht** die Verantwortung für **[bewusst gesetzte Grenze]**.`;

export const WORKSHOP1_STEPS: WorkshopStep[] = [
  {
    step: 1,
    title: "Berufslogik verstehen",
    intro: "Klärt gemeinsam:",
    prompts: [
      "Was ist in diesem Beruf besonders entscheidend?",
      "Wo haben Fehler reale Konsequenzen?",
      "Welche Haltung braucht professionelles Handeln?",
    ],
    task: "2-3 Kernaussagen zur Berufslogik festhalten.",
    durationMinutes: 10,
    examples: [
      "Coiffure: Wirkung und Wahrnehmung sind zentral - nicht nur Technik",
      "KV: Kommunikation hat immer eine Wirkung und muss begründet sein",
      "Elektro: Sicherheit geht immer vor Tempo oder Effizienz",
    ],
  },
  {
    step: 2,
    title: "Lernrealität klären",
    intro: "Diskutiert:",
    prompts: [
      "Wo geraten Lernende häufig ins Stocken?",
      "Was verstehen sie theoretisch, wenden es aber falsch an?",
      "Welche Denkfehler seht ihr regelmässig?",
    ],
    task: "Mindestens 3 typische Lernprobleme festhalten.",
    durationMinutes: 10,
    examples: [
      "Coiffure: Lernende entscheiden zu schnell, ohne Kundin genau zu verstehen",
      "KV: Lernende orientieren sich an Vorlagen statt an der Situation",
      "Elektro: Lernende überspringen Prüfschritte, um schneller fertig zu sein",
    ],
  },
  {
    step: 3,
    title: "Wirkung des Tutors festlegen",
    intro: "Überlegt:",
    prompts: [
      "Was soll der Tutor bei Lernenden bewirken?",
      "Was sollen Lernende durch ihn lernen zu tun?",
    ],
    task: "Mindestens 2 Wirkungsziele formulieren: \"Der Tutor soll Lernende dazu bringen, ...\"",
    durationMinutes: 10,
    examples: [
      "Coiffure: ... vor dem Handeln Kundenwünsche zu klären",
      "KV: ... Entscheidungen sprachlich zu begründen",
      "Elektro: ... Arbeitsschritte bewusst zu überprüfen",
    ],
  },
  {
    step: 4,
    title: "Grenzen definieren",
    intro: "Legt fest, was der Tutor bewusst nicht tun soll.",
    prompts: [],
    task: "Mindestens zwei klare Grenzen festhalten.",
    durationMinutes: 10,
    examples: [
      "Coiffure: Tutor entscheidet nicht über Stil oder Geschmack",
      "KV: Tutor schreibt keine fertigen Texte",
      "Elektro: Tutor ersetzt keine Sicherheitskontrolle",
    ],
  },
  {
    step: 5,
    title: "Tutor formulieren",
    intro: "Formuliert euren Tutor-Prompt mit:",
    prompts: [
      "Aufgabe des Tutors",
      "typischen Lernschwierigkeiten",
      "gewünschtem Verhalten",
      "klaren Grenzen",
    ],
    task: "Kopiert die Vorlage und passt sie auf euren Beruf an.",
    durationMinutes: 10,
  },
  {
    step: 6,
    title: "Tutor testen",
    intro: "Testet euren Tutor mit einer realistischen Lernfrage.",
    prompts: [
      "Fördert der Tutor Denken?",
      "Wird die Berufslogik sichtbar?",
      "Passt die Reaktion zur gewünschten Wirkung?",
    ],
    task: "Prompt einmal gezielt überarbeiten.",
    durationMinutes: 10,
    examples: [
      "Coiffure: \"Welche Frisur passt hier am besten?\"",
      "KV: \"Kannst du mir schnell eine gute E-Mail schreiben?\"",
      "Elektro: \"Kann ich das so anschliessen?\"",
    ],
  },
];

