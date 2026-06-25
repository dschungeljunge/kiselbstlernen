export type SpezialprogrammVideo = {
  title: string;
  description: string;
  loomId: string;
};

export type SpezialprogrammLink = {
  label: string;
  href: string;
  description: string;
  external?: boolean;
};

export type SpezialprogrammTeil = {
  slug: string;
  number: number;
  title: string;
  shortTitle: string;
  intro: string;
  goal: string;
  duration: string;
  href: string;
  videos: SpezialprogrammVideo[];
  tasks: string[];
  links: SpezialprogrammLink[];
};

export const SPECIAL_PROGRAM_OVERVIEW_VIDEO = {
  title: "Begrüssung und Orientierung",
  description:
    "Kurze Einführung in das Spezialprogramm, die Weiterbildungstage im Sommer und den Transferauftrag.",
  loomId: "8e59e9891d9e49189953b586457682e9",
};

/** Grobe Gesamtzeit für die Hero-Kachel (Teile 1–3 Pflicht, Teil 4 freiwillig). */
export const SPECIAL_PROGRAM_UMFANG = "4 Teile, ca. 2–4 Stunden";

export const SPEZIALPROGRAMM_TEILE: SpezialprogrammTeil[] = [
  {
    slug: "teil1",
    number: 1,
    title: "Einführung",
    shortTitle: "Einführung",
    intro:
      "Du holst die zentrale Einführung aus dem Workshop nach und lernst die Grundidee des KI-Kompass kennen.",
    goal:
      "Die drei kurzen Referatsvideos geben dir Orientierung: Worum geht es bei KI im Unterricht, welche Haltung steckt hinter dem Kompass und wie arbeitest du mit dem Programm weiter?",
    duration: "ca. 30 Minuten",
    href: "/spezialprogramm/teil1",
    videos: [
      {
        title: "Referat 1",
        description: "Einstieg in Thema, Zielsetzung und Haltung der Weiterbildung.",
        loomId: "a3cf6a3f38704171abd48b1ae037165b",
      },
      {
        title: "Referat 2",
        description: "Vertiefung der zentralen Begriffe und didaktischen Leitideen.",
        loomId: "5707acef125e4b55adf532b2ee48023a",
      },
      {
        title: "Referat 3",
        description: "Überleitung zur eigenen Arbeit im KI-Kompass.",
        loomId: "ecd0bc2ed2d14f9591683fab46da0243",
      },
    ],
    tasks: [
      "Schau die drei Referatsvideos nacheinander an.",
      "Notiere eine konkrete Unterrichtssituation, in der KI dich entlasten oder Lernen verbessern könnte.",
      "Nimm diese Situation als roten Faden in die nächsten Teile mit.",
    ],
    links: [],
  },
  {
    slug: "teil2",
    number: 2,
    title: "Selbstlernen",
    shortTitle: "Selbstlernen",
    intro:
      "Du steigst in den eigentlichen KI-Kompass ein und bearbeitest die Online-Weiterbildung in deinem Tempo.",
    goal:
      "Die Selbsteinschätzung hilft dir, deinen Ausgangspunkt zu klären. Danach kannst du direkt in die Lernreise starten.",
    duration: "ca. 30-120 Minuten",
    href: "/spezialprogramm/teil2",
    videos: [],
    tasks: [
      "Starte mit der Selbsteinschätzung, wenn du deinen Standort klären möchtest.",
      "Bearbeite anschließend die Weiterbildung ab Schritt 1.",
      "Halte eine Idee fest, die du in deinem Unterricht ausprobieren willst.",
    ],
    links: [
      {
        label: "Selbsteinschätzung ausfüllen",
        href: "/evaluation",
        description: "Kurzer Einstieg zur eigenen Praxis und zum aktuellen Umgang mit KI.",
      },
      {
        label: "Weiterbildung direkt starten",
        href: "/step/1",
        description: "Ohne Umweg in den ersten Schritt des KI-Kompass einsteigen.",
      },
    ],
  },
  {
    slug: "teil3",
    number: 3,
    title: "Gemeinsam einen Tutor erstellen",
    shortTitle: "Tutor erstellen",
    intro:
      "Du vollziehst das gemeinsame Workshop-Beispiel nach und entwickelst eine instruierte KI-Lehrperson.",
    goal:
      "An einem konkreten Beispiel lernst du, wie aus Bedürfnissen, Kontext und Iteration ein brauchbarer Tutor-Prompt entsteht.",
    duration: "ca. 45-60 Minuten",
    href: "/spezialprogramm/teil3",
    videos: [
      {
        title: "Warm-up: Kuriose KI",
        description: "Ein spielerischer Einstieg in das Prinzip der Instruktion.",
        loomId: "1ff8dd68f6f842a89da16fa04a7a9cfb",
      },
      {
        title: "Erster Schritt: Bedürfnisse und Prompt",
        description:
          "Bedürfnisse von Lehrperson und Lernenden klären und daraus einen ersten Prompt formulieren.",
        loomId: "b12b09bb2b384009b61b7797358f22ce",
      },
      {
        title: "Zweiter Schritt: Iteration",
        description: "Den Tutor testen, Beobachtungen aufnehmen und gezielt optimieren.",
        loomId: "2a40bdb77f7541bbaadafcf4816b4fb4",
      },
      {
        title: "Dritter Schritt: Teilen",
        description: "Resultate sichern, weitergeben und für die eigene Praxis nutzbar machen.",
        loomId: "7c7c6c1591604eb8b5c0ff5bdb09c521",
      },
    ],
    tasks: [
      "Skizziere die Bedürfnisse deiner Lernenden und deine eigenen Anforderungen als Lehrperson.",
      "Formuliere daraus einen ersten Tutor-Prompt.",
      "Teste den Prompt, optimiere ihn und nimm das Ergebnis an die Weiterbildungstage im Sommer mit.",
    ],
    links: [],
  },
  {
    slug: "teil4",
    number: 4,
    title: "Vertiefung mit Workshop 1 und 2",
    shortTitle: "Vertiefung",
    intro:
      "Wenn du weiterarbeiten möchtest, kannst du die beiden Workshop-Formate freiwillig nachholen.",
    goal:
      "Workshop 1 führt dich zu einem Berufs-Tutor. Workshop 2 hilft dir, eine KI-Lernaufgabe für deinen Unterricht zu entwickeln.",
    duration: "freiwillig, je ca. 30 Minuten",
    href: "/spezialprogramm/teil4",
    videos: [],
    tasks: [
      "Wähle den Workshop, der besser zu deinem aktuellen Unterrichtsvorhaben passt.",
      "Arbeite die Schritte nacheinander durch.",
      "Nimm dein Ergebnis an die Weiterbildungstage im Sommer oder in dein Team mit.",
    ],
    links: [
      {
        label: "Workshop 1 nachholen",
        href: "/ws1",
        description: "Einen KI-Tutor für einen spezifischen Beruf entwickeln.",
      },
      {
        label: "Workshop 2 nachholen",
        href: "/ws2",
        description: "Eine konkrete KI-Lernaufgabe für Lernende erstellen.",
      },
    ],
  },
];

export function getSpezialprogrammTeil(slug: string) {
  return SPEZIALPROGRAMM_TEILE.find((teil) => teil.slug === slug);
}

export function getLoomEmbedUrl(loomId: string) {
  return `https://www.loom.com/embed/${loomId}`;
}

export function getLoomShareUrl(loomId: string) {
  return `https://www.loom.com/share/${loomId}`;
}
