export interface Workshop2Step {
  step: number;
  title: string;
  intro: string;
  phaseText: string[];
  prompts: string[];
  task: string;
  durationMinutes: number;
  examples?: Workshop2PromptExample[];
  guides?: Workshop2Guide[];
}

export interface Workshop2PromptExample {
  title: string;
  description: string;
  prompt: string;
  note?: string;
}

export interface Workshop2Guide {
  title: string;
  description: string;
  steps: string[];
}

export const WORKSHOP2_STEPS: Workshop2Step[] = [
  {
    step: 1,
    title: "Beispielhafte KI-Lernaufgaben erkunden und testen",
    intro:
      "In der Prompt-Bibliothek befinden sich Beispiele, die angepasst und getestet werden können.",
    phaseText: [
      "Die Instruktion (in Fachsprache Prompt genannt) beschreibt, welche Lernaufgabe die KI ausführen soll. Die Instruktion ist in Du-Form geschrieben und richtet sich direkt an die KI (\"Du stellst Fragen... Du überprüfst... Du antwortest...\").",
      "Je präziser die Instruktion, desto besser werden die Lernenden durch die Aufgabe geführt und desto eher werden die Lernziele erreicht.",
      "Erkunde die Beispiele, wähle eines aus und passe es für deinen Unterricht an. Eigene Ideen sind ausdrücklich willkommen.",
    ],
    prompts: [
      "Erkunde verschiedene KI-Lernaufgaben aus der Bibliothek.",
      "Teste mindestens eine Aufgabe mit einer Lernenden-Perspektive.",
      "Wähle eine Aufgabe aus, die im eigenen Unterricht einsetzbar ist.",
    ],
    task: "Eine geeignete KI-Lernaufgabe auswählen und kurz begründen.",
    durationMinutes: 25,
    examples: [
      {
        title: "Experten-Gespräch: Raumplanungs-Spezialist",
        description:
          "Die KI übernimmt eine Expertenrolle. Lernende diskutieren fachspezifische Fragen und erhalten Hinweise zu Lösungsstrategien statt fertiger Lösungen.",
        prompt:
          "Stell dir vor, du bist Experte für Raumplanung in der Schweiz und ich stelle dir Fragen. Du kennst dich sehr gut mit den Bauvorschriften und -richtlinien der Schweiz, dem Minergie-Standard und der nachhaltigen Architektur aus. Zu anderen Themen äusserst du dich nicht. Gib nur kurze Antworten als Hilfestellung, jedoch keine Lösungen auf meine Fragen.\n\nIch bin Lernende/r in der Berufsbildung im Bereich Zeichner/in EFZ und soll ein nachhaltig gebautes Quartier in Zürich planen. Ich ziehe dich bei, wenn ich fachliche Fragen habe.",
      },
      {
        title: "Kommunikationstraining: Vorstellungsgespräch",
        description:
          "Die KI simuliert ein reales Gespräch und trainiert Formulierungen, Gesprächsaufbau und angemessenes Reagieren in einer beruflichen Situation.",
        prompt:
          "Stell dir vor, ich habe mich für eine Lehrstelle als Kauffrau/Kaufmann EFZ beworben. Ich möchte mit dir das Bewerbungsgespräch üben. Du bist HR-Verantwortliche/r eines Unternehmens in der Schweiz und führst mit mir ein realistisches Interview. Stelle mir jeweils eine Frage und warte auf meine Antwort.",
      },
      {
        title: "Fremdsprachen üben: Französisch-Chatbot",
        description:
          "Die KI spricht konsequent in der Zielsprache und passt den Wortschatz an das Lernniveau an, damit ein flüssiger, verständlicher Dialog möglich ist.",
        prompt:
          "Ich möchte mein Französisch für den Berufsalltag verbessern. Bitte schreibe in diesem Chat nur Französisch mit mir. Ich bin Lernende/r im 1. Lehrjahr und möchte typische Situationen aus dem Betrieb üben (Telefonat, Terminvereinbarung, Kundenanfrage). Verwende einen klaren, alltagsnahen Wortschatz auf Niveau A2-B1.",
      },
      {
        title: "Rätsel: Fehlerdiagnose im Betrieb",
        description:
          "Die KI schafft ein spielerisches Rätsel-Setting. Lernende fragen gezielt nach, schließen logisch und trainieren dabei sprachliche Präzision.",
        prompt:
          "Stell dir vor, du bist ein/e erfahrene/r Berufsbildner/in in einem technischen Betrieb. Gib mir ein kurzes Fehlerdiagnose-Rätsel aus dem Berufsalltag (z. B. Störung, Qualitätsproblem, Prozessfehler), aber verrate die Ursache nicht sofort. Stelle mir Rückfragen, bis ich eine begründete Diagnose abgebe. Gib erst dann ein kurzes Feedback und die Auflösung.",
      },
      {
        title: "Zeitreise: Büroalltag im Wandel",
        description:
          "Die KI arbeitet in einer historischen Rolle. Lernende verbinden Fachwissen, Perspektivenübernahme und Quellenbezug in einer anspruchsvollen Schreibaufgabe.",
        prompt:
          "Stell dir vor, du bist ein/e Schweizer KV-Lernende/r im Jahr 1985 und arbeitest in einem Industriebetrieb. Schreibe einen Brief an eine heutige KV-Klasse und berichte, wie Büroarbeit damals organisiert war (Kommunikation, Ablage, Arbeitsmittel, Zusammenarbeit). Verwende realistische Details.\n\nStütze dich auf historische Fakten und nenne am Schluss die wichtigsten Quellen. Schreibe auf Deutsch mit maximal 400 Wörtern.",
      },
      {
        title: "Wissen aktivieren: Glossar erstellen",
        description:
          "Die KI strukturiert Vorwissen systematisch und baut zentrale Begriffe mit Definitionen, Beispielen und typischen Missverständnissen auf.",
        prompt:
          "Ich möchte mein Verständnis der Schlüsselbegriffe und -konzepte zum Thema [THEMA] vertiefen. Bitte erstelle ein detailliertes Glossar mit 20 wichtigen Begriffen. Gib zu jedem Begriff eine ausführliche Definition, Beispiele für die Anwendung, verwandte Konzepte und mögliche Missverständnisse oder häufige Fehler bei der Verwendung.",
      },
    ],
  },
  {
    step: 2,
    title: "KI-Lernaufgabe für den eigenen Unterricht schärfen",
    intro:
      "Du passt deine gewählte KI-Lernaufgabe so an, dass sie zu deinem Unterricht, deiner Lerngruppe und deinen Materialien passt.",
    phaseText: [
      "Eine gute KI-Lernaufgabe wird nicht besser, weil sie möglichst viele Informationen enthält, sondern weil sie die richtigen Informationen enthält.",
      "Entscheidend ist, dass die Aufgabe für deine Lernenden verständlich ist, fachlich zu deinem Unterricht passt und die KI sinnvoll unterstützt, ohne den Lernprozess zu übernehmen.",
      "Lege zuerst fest, für wen die Aufgabe gedacht ist: Beruf, Lehrjahr, Vorwissen und sprachliches Niveau.",
      "Ergänze danach nur die Informationen und Materialien, die die KI wirklich braucht, um passend zu reagieren.",
    ],
    prompts: [
      "Lege eine konkrete Zielgruppe fest: Beruf, Lehrjahr, Vorwissen, sprachliches Niveau.",
      "Präzisiere den Prompt so, dass Ziel, Ablauf und Rolle der KI klar werden.",
      "Ergänze nur die Materialien, die für gute Antworten wirklich nötig sind.",
      "Prüfe mit 1-2 typischen Lernfragen, ob die Aufgabe verständlich und passend bleibt.",
    ],
    task:
      "Ein überarbeiteter Prompt, der auf eine konkrete Lerngruppe abgestimmt ist und mit dem eigenen Unterrichtsmaterial sinnvoll arbeitet.",
    durationMinutes: 20,
    guides: [
      {
        title: "Anleitung 1: Prompt didaktisch schärfen",
        description:
          "Beschreibe die Lernaufgabe so konkret, dass die KI Zielgruppe, Lernziel, Ablauf und Grenzen der Unterstützung klar versteht.",
        steps: [
          "Lernziel präzisieren: Was sollen Lernende am Ende können?",
          "Zielgruppe definieren: Beruf, Lehrjahr, Vorkenntnisse, sprachliches Niveau.",
          "Aufgabenrahmen ergänzen: Thema, Zeitrahmen, gewünschtes Ergebnisformat.",
          "Didaktische Regeln festlegen: Hilfestellungen ja, fertige Lösungen nein.",
          "Festlegen, was die KI ausdrücklich nicht übernehmen soll.",
          "Mit 1-2 typischen Lernfragen prüfen und unklare Stellen nachschärfen.",
        ],
      },
      {
        title: "Anleitung 2: Materialien gezielt ergänzen",
        description:
          "Gib der KI nur die Unterlagen, die für fachlich passende und unterrichtsnahe Antworten wirklich hilfreich sind.",
        steps: [
          "Relevante Unterlagen auswählen (Dossier, Merkblatt, Glossar, Musteraufgabe).",
          "Dateien klar benennen und kurz beschreiben, wofür sie genutzt werden sollen.",
          "Wichtige Links ergänzen (Lehrmittel, Normen, offizielle Informationsseiten).",
          "Im Prompt festhalten: 'Nutze primär die bereitgestellten Quellen'.",
          "Quellenpriorität definieren, falls Dokumente und Links unterschiedliche Aussagen enthalten.",
          "Stichprobe machen: Prüfen, ob die KI die Materialien sinnvoll nutzt und trotzdem verständlich bleibt.",
        ],
      },
    ],
  },
  {
    step: 3,
    title: "KI-Lernaufgabe erweitern",
    intro: "Die Lernaufgabe wird um zusätzliche didaktische Funktionen erweitert.",
    phaseText: [
      "Wir erhöhen die Komplexität der Lernaufgabe mit weiteren Aspekten.",
      "Es ist beispielsweise möglich, dass eine KI nach einer gewissen Anzahl Antworten Feedback generiert oder die Schwierigkeit gemäss Niveau der Lernenden adaptiert.",
      "Dazu kann die Instruktion mit weiteren Teilaufgaben erweitert werden.",
      "Füge weitere Funktionen hinzu, damit die Lernenden einen umfassenden Lernprozess erfahren. Nutze dazu die Beispiele und passe sie an.",
    ],
    prompts: [
      "Definiere, wie sich die Schwierigkeit adaptiv an Antworten anpasst.",
      "Lege fest, wann und wie Feedback ausgegeben wird.",
      "Plane, wann zu einer zweiten Lernaufgabe gewechselt wird.",
    ],
    task: "Die Lernaufgabe mit mindestens zwei Zusatzfunktionen erweitern und testen.",
    durationMinutes: 20,
    examples: [
      {
        title: "Adaptive Schwierigkeit + Feedback nach 5 Antworten",
        description:
          "Die KI passt die Komplexität dynamisch an und erzeugt nach mehreren Interaktionen ein gezieltes Zwischenfeedback zum Lernstand.",
        prompt:
          "Du bist ein KI-Tutor für [THEMA]. Führe Lernende Schritt für Schritt durch die Aufgabe.\n\nDidaktische Logik:\n- Starte mit einer einfachen Frage.\n- Wenn die Antwort korrekt ist, erhöhe die Schwierigkeit leicht.\n- Wenn die Antwort unklar/falsch ist, vereinfache die nächste Frage und gib einen kurzen Hinweis.\n- Nach jeder Antwort gib maximal 1 Satz Rückmeldung.\n- Nach genau 5 Antworten erstelle ein kurzes Zwischenfeedback mit: Stärken, häufige Fehler, nächster Fokus.\n\nWichtig: keine vollständigen Lösungen.",
      },
      {
        title: "Wechsel zu zweiter Lernaufgabe nach 3 Antworten",
        description:
          "Die KI führt durch zwei Teilkompetenzen mit klarer Sequenz und reflektiert den Lernfortschritt am Ende strukturiert.",
        prompt:
          "Du trainierst mit Lernenden zwei Teilkompetenzen:\nA) [KOMPETENZ A]\nB) [KOMPETENZ B]\n\nAblauf:\n1) Starte mit Teilkompetenz A und stelle nacheinander 3 Fragen.\n2) Gib nach jeder Antwort kurzes formatives Feedback.\n3) Wechsle danach automatisch zu Teilkompetenz B und kündige den Wechsel an.\n4) Stelle dort weitere 3 Fragen.\n5) Schließe mit einer 3-Punkte-Reflexion ab: Was gelingt schon? Was üben? Was als Nächstes?\n\nSprache: klar, motivierend, altersgerecht.",
      },
      {
        title: "Punktesystem mit Lernstands-Hinweis",
        description:
          "Die KI kombiniert ein einfaches Scoring mit formativer Rückmeldung und macht Fortschritt über mehrere Fragen transparent.",
        prompt:
          "Du bist Lernbegleiter für [THEMA]. Nutze ein einfaches Punktesystem über 6 Fragen.\n\nRegeln:\n- Für jede gute Antwort +2 Punkte, für teilweise richtige +1 Punkt, sonst 0 Punkte.\n- Zeige den Punktestand nach jeder Frage.\n- Gib ab Frage 4 zusätzlich einen Lernstands-Hinweis (z. B. 'Du bist auf gutem Weg bei ...').\n- Nach Frage 6 gib ein Abschlussfeedback mit einem konkreten nächsten Lernschritt.\n\nKeine Musterlösung ausgeben, sondern nur Hilfestellungen.",
      },
    ],
  },
];

