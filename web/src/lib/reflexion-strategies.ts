/**
 * Reflexionsstrategien – Konfiguration
 *
 * Definiert die 5 Kernstrategien mit Inhalten, Fragen,
 * Lösungsansätzen und Wiki-Verweisen.
 */

export type StrategyCode = "a" | "b" | "c" | "d" | "e";
export type StrategyType = "chat" | "form";

// Typen für interaktive Elemente (kopiert aus InteractiveElements.tsx um zirkuläre Importe zu vermeiden)
export type InteractiveElementConfig =
  | { type: "bipolar-slider"; id: string; label: string; left: string; right: string; leftDetail?: string; rightDetail?: string }
  | { type: "option-picker"; id: string; label: string; options: string[]; multi?: boolean }
  | { type: "statement-cards"; id: string; label: string; statements: string[] }
  | { type: "ranking"; id: string; label: string; detail?: string; items: string[] }
  | { type: "emotion-grid"; id: string; label: string };

export interface FormQuestion {
  id: string;
  question: string;
  placeholder: string;
}

export interface SolutionHint {
  diagnose: string;
  massnahme: string;
  paedagogischeFunktion: string;
}

export interface WikiLink {
  title: string;
  summary: string;
}

export interface ReflexionStrategy {
  code: StrategyCode;
  letter: string;
  title: string;
  subtitle: string;
  perspective: string;
  perspectiveColor: string;
  kernfrage: string;
  beschreibung: string;
  type: StrategyType;
  diagnoseQuestions: string[];
  formQuestions?: FormQuestion[];
  interactivePhase?: InteractiveElementConfig[];
  solutionHints: SolutionHint[];
  wikiLinks: WikiLink[];
  chatPersona: string;
}

export const STRATEGIES: ReflexionStrategy[] = [
  {
    code: "a",
    letter: "A",
    title: "Kognitive Aktivierung",
    subtitle: "Haben die Lernenden wirklich gedacht?",
    perspective: "Lernende",
    perspectiveColor: "bg-blue-100 text-blue-800",
    kernfrage:
      "Haben die Lernenden aktiv gedacht – oder hat die KI für sie gedacht?",
    beschreibung:
      "Kognitive Aktivierung beschreibt das Ausmass, in dem Lernende zu echtem Nachdenken angeregt werden: Abwägen, Entscheiden, Hinterfragen, Verknüpfen. KI kann kognitive Aktivierung fördern – oder untergraben. Die entscheidende Frage ist nicht ob KI eingesetzt wurde, sondern was Lernende dabei kognitiv geleistet haben.",
    type: "chat",
    diagnoseQuestions: [
      "Mussten Lernende eigene Entscheidungen treffen – oder nur KI-Output übernehmen?",
      "Haben sie Ergebnisse der KI hinterfragt oder kritisch bewertet?",
      "Gab es Momente, in denen Lernende aktiv nachdenken mussten?",
      "War die Aktivität kognitiv anspruchsvoller als ohne KI – oder einfacher?",
    ],
    interactivePhase: [
      {
        type: "bipolar-slider",
        id: "aktivierung",
        label: "Wie aktiv war das Denken der Lernenden in dieser Situation?",
        left: "Passiv & reproduktiv",
        leftDetail: "KI hat geliefert, Lernende haben übernommen",
        right: "Aktiv & konstruktiv",
        rightDetail: "Lernende haben hinterfragt, entschieden, verknüpft",
      },
      {
        type: "option-picker",
        id: "ki-rolle",
        label: "Die KI hat in dieser Stunde hauptsächlich...",
        options: [
          "Fertige Antworten geliefert",
          "Fragen aufgeworfen",
          "Als Werkzeug gedient",
          "Das Denken der Lernenden ersetzt",
          "Neue Denkwege eröffnet",
          "Die Lernenden überfordert",
        ],
        multi: false,
      },
    ],
    solutionHints: [
      {
        diagnose: "Lernende übernehmen KI-Output unkritisch",
        massnahme:
          "Prompt so formulieren, dass KI bewusst unvollständige oder widersprüchliche Antworten gibt",
        paedagogischeFunktion: "Kognitive Dissonanz als Lernanlass (Piaget)",
      },
      {
        diagnose: "Kein echtes Nachdenken sichtbar",
        massnahme:
          'Aufgabe um Beurteilungsphase erweitern: "Bewerte den KI-Output nach diesen Kriterien"',
        paedagogischeFunktion: "Metakognition & kritisches Denken",
      },
      {
        diagnose: "KI macht die Aufgabe zu einfach",
        massnahme:
          "KI als Ausgangsmaterial einsetzen, nicht als fertige Lösung",
        paedagogischeFunktion: "Problembasiertes Lernen (PBL)",
      },
    ],
    wikiLinks: [
      {
        title: "Kognitive Aktivierung",
        summary:
          "Eines der am besten belegten Qualitätsmerkmale von Unterricht (Klieme/Lipowsky): Lernende werden zu echtem Nachdenken angeregt – nicht nur zu Reproduktion. Mit KI ist das möglich, aber nicht automatisch gegeben.",
      },
      {
        title: "Kognitive Dissonanz",
        summary:
          "Wenn neue Informationen nicht zum bisherigen Wissen passen, entsteht Spannung – ein starker Lernanlass (Piaget). KI kann bewusst als Quelle dieser Spannung eingesetzt werden.",
      },
      {
        title: "Problembasiertes Lernen (PBL)",
        summary:
          "Lernende starten mit einem echten Problem, nicht mit dem Lernstoff. KI kann dabei als Recherchewerkzeug oder als Sparringspartner dienen – ohne die Problemlösung zu übernehmen.",
      },
    ],
    chatPersona: "analytisch",
  },
  {
    code: "b",
    letter: "B",
    title: "Professionelles Erleben",
    subtitle: "Wie habe ich mich als Lehrperson gefühlt?",
    perspective: "Lehrperson",
    perspectiveColor: "bg-amber-100 text-amber-800",
    kernfrage:
      "Wie habe ich mich als Lehrperson in dieser Situation gefühlt – und was sagt das über meinen KI-Einsatz?",
    beschreibung:
      "Lehrpersonen sind professionelle Beobachter des Unterrichts. Ihre subjektive Wahrnehmung ist kein blinder Fleck, sondern ein wertvoller Indikator. Das eigene Erleben – Wohlbefinden, Kontrolle, Irritation, Fremdheit – ist ein valides Reflexionsinstrument. Wenn sich eine Lehrperson im KI-Einsatz unwohl fühlt, ist das ein ernst zu nehmendes Signal.",
    type: "chat",
    diagnoseQuestions: [
      "Hatte ich das Gefühl, die Kontrolle über die Lernsituation zu haben?",
      "Hat der KI-Einsatz meiner professionellen Rolle entsprochen – oder hat er sie untergraben?",
      "Was war unangenehm, irritierend oder überraschend?",
      "Hätte ich diese Situation gerne anders gestaltet – und warum?",
    ],
    interactivePhase: [
      {
        type: "emotion-grid",
        id: "gefuehle",
        label: "Wie habe ich mich in dieser Situation gefühlt? (Mehrfachauswahl)",
      },
      {
        type: "bipolar-slider",
        id: "kontrolle",
        label: "Mein Gefühl der professionellen Kontrolle in dieser Situation",
        left: "Kontrollverlust",
        leftDetail: "Die Situation hat mich überwältigt oder überrumpelt",
        right: "Volle Kontrolle",
        rightDetail: "Ich hatte die Situation klar im Griff",
      },
    ],
    solutionHints: [
      {
        diagnose: "Kontrollverlust, Überforderung",
        massnahme:
          "KI-Einsatz auf klar abgegrenzte Phasen beschränken; eigene Rolle explizit definieren",
        paedagogischeFunktion: "Classroom Management; klare Rollenverteilung",
      },
      {
        diagnose: "KI-Output fühlt sich fremd an",
        massnahme:
          "Eigene fachliche Stimme durch Anpassung des Outputs sicherstellen",
        paedagogischeFunktion: "Authentizität als Lehrperson (vgl. Rogers)",
      },
      {
        diagnose: 'Gefühl, KI "übernimmt" den Unterricht',
        massnahme:
          "KI als Werkzeug rahmen, nicht als Akteur; Moderation bewusst bei Lehrperson behalten",
        paedagogischeFunktion: "Instructional Leadership",
      },
    ],
    wikiLinks: [
      {
        title: "Professionelle Wahrnehmung",
        summary:
          "Sherin & van Es zeigen: Erfahrene Lehrpersonen erleben Unterrichtssituationen nicht nur, sie deuten sie aktiv. Diese professionelle Wahrnehmung ist der beste Gradmesser für Unterrichtsqualität – auch beim KI-Einsatz.",
      },
      {
        title: "Berufsethos von Lehrpersonen",
        summary:
          "Fritz Oser beschreibt berufsethische Standards, die Lehrpersonen in ihrem Handeln leiten: Fürsorge, Gerechtigkeit, Wahrhaftigkeit. KI-Einsatz kann diese Standards unterstützen oder in Spannung zu ihnen treten.",
      },
    ],
    chatPersona: "empathisch",
  },
  {
    code: "c",
    letter: "C",
    title: "Angebot & Nutzung",
    subtitle: "Wurde genutzt, was ich geplant hatte?",
    perspective: "Didaktik",
    perspectiveColor: "bg-green-100 text-green-800",
    kernfrage:
      "Wurde mein geplantes Angebot so genutzt, wie ich es mir vorgestellt hatte – und was verrät die Abweichung?",
    beschreibung:
      "Das Angebot-Nutzungs-Modell (Helmke) zeigt: Unterricht ist ein Angebot, das Lernende aktiv und individuell nutzen – oder eben nicht. Beim KI-Einsatz ist dieses Prinzip besonders relevant: Lernende interagieren mit KI auf unvorhergesehene Weise, finden Abkürzungen, nutzen das Tool für andere Zwecke oder scheitern an technischen Hürden.",
    type: "form",
    diagnoseQuestions: [
      "Haben die Lernenden mit der KI so interagiert, wie ich es erwartet hatte?",
      "Gab es unerwartete Nutzungsweisen – positiv oder negativ?",
      "Was hat das über meine Lerngruppe verraten?",
      "Wo klaffte mein geplantes Angebot und die tatsächliche Nutzung auseinander?",
    ],
    interactivePhase: [
      {
        type: "bipolar-slider",
        id: "abweichung",
        label: "Wie stark wich die tatsächliche Nutzung von deiner Planung ab?",
        left: "Genau wie geplant",
        leftDetail: "Lernende haben das Tool so genutzt wie vorgesehen",
        right: "Völlig anders",
        rightDetail: "Die Nutzung hat mich komplett überrascht",
      },
      {
        type: "statement-cards",
        id: "nutzung-statements",
        label: "Was hast du beobachtet?",
        statements: [
          "Lernende nutzten die KI für das, wofür ich sie vorgesehen hatte",
          "Lernende fanden kreative oder unerwartete Wege mit der KI",
          "Einige Lernende nutzten KI, um die eigentliche Aufgabe zu umgehen",
          "Technische Hürden haben die Nutzung beeinflusst",
          "Unterschiede im Vorwissen wurden sichtbar",
        ],
      },
      {
        type: "ranking",
        id: "faktoren",
        label: "Ordne diese Faktoren nach ihrem Einfluss auf die tatsächliche Nutzung",
        detail: "1 = grösster Einfluss – ziehen oder Pfeile nutzen",
        items: [
          "Vorwissen der Lernenden",
          "Klarheit meiner Aufgabenstellung",
          "Motivation der Lernenden",
          "Technische Zugänglichkeit",
          "Zeitdruck",
          "Meine Anleitung und Moderation",
        ],
      },
    ],
    formQuestions: [
      {
        id: "c1",
        question:
          "Wie haben die Lernenden mit der KI interagiert? Entsprach das deiner Erwartung?",
        placeholder:
          "Beschreibe konkret, was du beobachtet hast...",
      },
      {
        id: "c2",
        question:
          "Gab es unerwartete Nutzungsweisen – positiv (kreativ, eigenständig) oder negativ (Abkürzungen, Umgehungen)?",
        placeholder: "Was hat dich überrascht?",
      },
      {
        id: "c3",
        question:
          "Was hat die Art der Nutzung über deine Lerngruppe verraten?",
        placeholder:
          "Welche Voraussetzungen, Stärken oder Lücken wurden sichtbar?",
      },
      {
        id: "c4",
        question:
          "Wo klaffte dein geplantes Angebot und die tatsächliche Nutzung auseinander – und warum?",
        placeholder:
          "Was würdest du beim nächsten Mal anders planen?",
      },
    ],
    solutionHints: [
      {
        diagnose: "Lernende nutzen KI als Abkürzung",
        massnahme:
          "Aufgabe umgestalten: Prozess dokumentieren, nicht nur Ergebnis abgeben",
        paedagogischeFunktion: "Portfolioarbeit; prozessorientiertes Lernen",
      },
      {
        diagnose: "Technische Überforderung",
        massnahme:
          "Scaffolding-Prompts und Schritt-für-Schritt-Anleitungen bereitstellen",
        paedagogischeFunktion: "Zone der nächsten Entwicklung (Vygotsky)",
      },
      {
        diagnose: "Nutzung weicht stark von Planung ab",
        massnahme:
          "Angebot enger rahmen oder bewusst offener gestalten – je nach Ziel",
        paedagogischeFunktion: "Konstruktive Ausrichtung (Biggs)",
      },
    ],
    wikiLinks: [
      {
        title: "Angebot-Nutzungs-Modell",
        summary:
          "Andreas Helmke beschreibt Unterricht als Angebot, das Lernende aktiv und unterschiedlich nutzen. Ob guter Unterricht wirkt, hängt davon ab, wie Lernende das Angebot annehmen. Beim KI-Einsatz klafft diese Lücke zwischen Planung und Wirklichkeit besonders deutlich.",
      },
      {
        title: "Konstruktive Ausrichtung",
        summary:
          "John Biggs' Constructive Alignment: Lernziel, Lernaktivität und Beurteilung müssen kohärent sein. KI-Einsatz stört diese Kohärenz oft – z.B. wenn das Ziel 'Argumentieren' lautet, aber KI das Argument produziert.",
      },
    ],
    chatPersona: "",
  },
  {
    code: "d",
    letter: "D",
    title: "Lernzielorientierung",
    subtitle: "Hat es zum Lernen beigetragen?",
    perspective: "Ziel",
    perspectiveColor: "bg-purple-100 text-purple-800",
    kernfrage:
      "Hat dieser KI-Einsatz zum Erreichen des Lernziels beigetragen – oder daran vorbeigezielt?",
    beschreibung:
      "KI-Einsatz ist nur dann sinnvoll, wenn er Lernzielen dient – nicht wenn er technisch beeindruckt, Zeit füllt oder modern wirkt. Diese Strategie verankert die Reflexion im Kern des Lehrberufs: Was sollen Lernende können, wissen oder verstehen – und hat der KI-Einsatz dazu beigetragen?",
    type: "form",
    diagnoseQuestions: [
      "Was können oder wissen die Lernenden nach dieser Stunde, was sie vorher nicht konnten?",
      "War der KI-Einsatz notwendig, um das Lernziel zu erreichen?",
      "Hätte dasselbe Ziel ohne KI nachhaltiger oder tiefer erreicht werden können?",
      "Hat der Einsatz das Lernziel befördert oder umgangen?",
    ],
    interactivePhase: [
      {
        type: "bipolar-slider",
        id: "lernziel-beitrag",
        label: "Der KI-Einsatz hat das Lernziel...",
        left: "Stark untergraben",
        leftDetail: "KI hat das eigentliche Lernen verhindert oder ersetzt",
        right: "Stark befördert",
        rightDetail: "KI hat das Lernen vertieft, erweitert oder ermöglicht",
      },
      {
        type: "bipolar-slider",
        id: "ki-notwendigkeit",
        label: "Ohne KI wäre das Lernziel...",
        left: "Besser erreicht worden",
        leftDetail: "KI war hier unnötig oder hat gestört",
        right: "Schlechter erreicht worden",
        rightDetail: "KI war für dieses Lernziel unverzichtbar",
      },
      {
        type: "statement-cards",
        id: "lernziel-statements",
        label: "Welche Aussagen treffen auf deinen Unterricht zu?",
        statements: [
          "Lernende können die Kernkompetenz nach dieser Stunde eigenständig anwenden",
          "Der Lernzuwachs wäre ohne KI ähnlich gross gewesen",
          "KI ermöglichte ein tieferes oder weiterführendes Lernziel",
          "Lernende wissen, wann KI sinnvoll einsetzbar ist und wann nicht",
          "Ich kann den Lernzuwachs klar benennen",
        ],
      },
    ],
    formQuestions: [
      {
        id: "d1",
        question:
          "Was war das konkrete Lernziel dieser Unterrichtssequenz?",
        placeholder:
          "Was sollten Lernende nach der Stunde können, wissen oder verstehen?",
      },
      {
        id: "d2",
        question:
          "Hat der KI-Einsatz dieses Lernziel befördert – oder hat er es eher umgangen?",
        placeholder:
          "Begründe deine Einschätzung mit konkreten Beobachtungen...",
      },
      {
        id: "d3",
        question:
          "War der KI-Einsatz für dieses Lernziel notwendig – oder hätte es ohne KI genauso gut (oder besser) funktioniert?",
        placeholder: "Sei ehrlich – KI ist kein Selbstzweck.",
      },
      {
        id: "d4",
        question:
          "Was können die Lernenden jetzt konkret besser als vorher?",
        placeholder:
          "Formuliere den Lernzuwachs so konkret wie möglich...",
      },
    ],
    solutionHints: [
      {
        diagnose: "KI produziert, was Lernende lernen sollten",
        massnahme:
          "Aufgabe umformulieren: KI als Feedbackgeber, nicht als Produzent",
        paedagogischeFunktion: "Formatives Assessment; Feedback-Schleifen (Hattie)",
      },
      {
        diagnose: "Lernziel und KI-Aufgabe passen nicht zusammen",
        massnahme:
          "Lernziel explizit in den Prompt integrieren; Aufgabe rückwärts planen",
        paedagogischeFunktion: "Backward Design (Wiggins & McTighe)",
      },
      {
        diagnose: "KI-Einsatz ohne erkennbaren Lernziel-Bezug",
        massnahme: "Einsatz weglassen oder neu begründen",
        paedagogischeFunktion: "Prinzip der Zielorientierung",
      },
    ],
    wikiLinks: [
      {
        title: "Konstruktive Ausrichtung",
        summary:
          "Lernziel, Lernaktivität und Beurteilung müssen kohärent sein (Biggs). Wenn KI die Lernaktivität verändert, muss das Lernziel neu bedacht werden – nicht umgekehrt.",
      },
      {
        title: "Backward Design",
        summary:
          "Wiggins & McTighe: Planung beginnt beim Lernziel, nicht beim Inhalt. Für KI-Einsatz bedeutet das: Erst das Ziel klar definieren, dann entscheiden ob und wie KI hilft.",
      },
      {
        title: "Sichtbares Lernen (Hattie)",
        summary:
          "John Hatties Meta-Meta-Studie zeigt, welche Faktoren Lernleistung wirklich beeinflussen. Feedback gehört zu den wirksamsten Massnahmen – KI kann qualitativ hochwertiges Feedback geben, wenn es richtig eingesetzt wird.",
      },
    ],
    chatPersona: "",
  },
  {
    code: "e",
    letter: "E",
    title: "Berufsbild der Lernenden",
    subtitle: "Was habe ich über den Beruf vermittelt?",
    perspective: "Berufsschule",
    perspectiveColor: "bg-rose-100 text-rose-800",
    kernfrage:
      "Welches Berufsbild habe ich durch diesen KI-Einsatz – bewusst oder unbewusst – vermittelt?",
    beschreibung:
      "In der Berufsschule lernen Jugendliche nicht nur Wissen und Fertigkeiten – sie werden in eine berufliche Identität hineinsozialisiert. KI-Einsatz im Unterricht vermittelt immer implizit, welche Tätigkeiten automatisierbar sind und welche genuin menschlich bleiben. Diese Botschaft prägt das Berufsbild der Lernenden nachhaltig.",
    type: "chat",
    diagnoseQuestions: [
      "Welches Berufsbild habe ich durch diesen KI-Einsatz implizit vermittelt?",
      "Wurden Tätigkeiten automatisiert, die Lernende später als bedeutsam erleben sollen?",
      "Hätte ich diese berufliche Praxis lieber ohne KI gezeigt?",
      "Rüste ich Lernende damit kritisch auf ihre Arbeitswelt vor – oder nehme ich ihnen etwas weg?",
    ],
    interactivePhase: [
      {
        type: "bipolar-slider",
        id: "berufsbild",
        label: "Die Kerntätigkeiten des Berufs wurden in dieser Stunde durch KI...",
        left: "Ersetzt",
        leftDetail: "KI hat übernommen, was Lernende selbst können sollten",
        right: "Sichtbar gemacht",
        rightDetail: "KI hat verdeutlicht, was menschliche Kompetenz ausmacht",
      },
      {
        type: "option-picker",
        id: "vermitteltes-bild",
        label: "Das Berufsbild, das ich implizit vermittelt habe, war:",
        options: [
          "KI ist ein nützliches Hilfsmittel im Berufsalltag",
          "KI kann viele typische Tätigkeiten übernehmen",
          "Menschliche Kompetenz bleibt unverzichtbar",
          "Der Beruf wird durch KI fundamental verändert werden",
          "Das war mir während des Unterrichts nicht bewusst",
        ],
        multi: false,
      },
    ],
    solutionHints: [
      {
        diagnose: "KI übernimmt Kerntätigkeiten des Berufs",
        massnahme:
          'KI als Vergleichsfolie einsetzen: "Was macht die KI – was machst du anders und warum?"',
        paedagogischeFunktion: "Berufsidentität durch Kontrastierung stärken",
      },
      {
        diagnose:
          "Lernende sehen KI als Ersatz für eigene Kompetenz",
        massnahme:
          "Aufgabe so gestalten, dass menschliches Urteil explizit gefordert wird",
        paedagogischeFunktion: "Berufsethos & professionelles Urteil (Oser)",
      },
      {
        diagnose: "KI-Einsatz unreflektiert aus Arbeitswelt übernommen",
        massnahme:
          "Kritische Auseinandersetzung mit Automatisierung als Unterrichtsinhalt",
        paedagogischeFunktion:
          "Berufliche Handlungskompetenz; kritisches Denken",
      },
    ],
    wikiLinks: [
      {
        title: "Berufliche Identität & Berufssozialisation",
        summary:
          "In der Berufsschule findet nicht nur Wissensvermittlung statt, sondern Sozialisation in einen Beruf. Lernende entwickeln ein Bild davon, was ihren Beruf ausmacht und was ihn wertvoll macht. KI-Einsatz beeinflusst dieses Bild nachhaltig.",
      },
      {
        title: "Berufsethos",
        summary:
          "Fritz Oser beschreibt berufsethische Standards als Kern professionellen Handelns. Für Berufsschullernende ist es wichtig zu verstehen, welche Aspekte ihres Berufs ethische Entscheidungen erfordern – und wo KI diese Entscheidungen nicht übernehmen darf.",
      },
      {
        title: "Prompting als pädagogische Kompetenz",
        summary:
          "Die Fähigkeit, KI sinnvoll zu instruieren, ist eine neue pädagogische Kompetenz. Ein gut formulierter Prompt kann KI so einsetzen, dass menschliche Kompetenz sichtbar bleibt – statt sie zu ersetzen.",
      },
    ],
    chatPersona: "herausfordernd",
  },
];

export function getStrategy(code: string): ReflexionStrategy | undefined {
  return STRATEGIES.find((s) => s.code === code.toLowerCase());
}

export const STRATEGY_ORDER: StrategyCode[] = ["a", "b", "c", "d", "e"];

const RATING_LABELS = ["", "Nein", "Eher nein", "Neutral", "Eher ja", "Ja"];
const SLIDER_LABEL = (v: number, left: string, right: string) => {
  if (v <= 15) return left;
  if (v <= 35) return `Eher ${left.split(" ")[0].toLowerCase()}`;
  if (v <= 65) return "In der Mitte";
  if (v <= 85) return `Eher ${right.split(" ")[0].toLowerCase()}`;
  return right;
};

/**
 * Wandelt interaktiveAnswers in einen lesbaren Prompt-Abschnitt um.
 * Wird vom Chat-API genutzt, um die KI zu kontextualisieren.
 */
export function formatInteractiveAnswersForPrompt(
  strategy: ReflexionStrategy,
  answers: Record<string, unknown>
): string {
  if (!strategy.interactivePhase || Object.keys(answers).length === 0) return "";

  const lines: string[] = [
    "ERSTE EINSCHÄTZUNGEN DER LEHRPERSON (vor dem Gespräch eingetragen):",
  ];

  for (const el of strategy.interactivePhase) {
    const value = answers[el.id];
    if (value === undefined || value === null) continue;

    switch (el.type) {
      case "bipolar-slider": {
        const v = value as number;
        lines.push(
          `- ${el.label}\n  Einschätzung: ${SLIDER_LABEL(v, el.left, el.right)} (${v}/100 auf der Skala ${el.left} ↔ ${el.right})`
        );
        break;
      }
      case "option-picker": {
        const sel = value as string[];
        if (sel.length > 0)
          lines.push(`- ${el.label}\n  Antwort: ${sel.join(", ")}`);
        break;
      }
      case "emotion-grid": {
        const sel = value as string[];
        if (sel.length > 0)
          lines.push(`- ${el.label}\n  Gefühle: ${sel.join(", ")}`);
        break;
      }
      case "statement-cards": {
        const ratings = value as Record<number, number>;
        const rated = el.statements
          .map((stmt, idx) =>
            ratings[idx]
              ? `  • "${stmt}" → ${RATING_LABELS[ratings[idx]]}`
              : null
          )
          .filter(Boolean);
        if (rated.length > 0) {
          lines.push(`- ${el.label}`);
          lines.push(...(rated as string[]));
        }
        break;
      }
      case "ranking": {
        const order = value as number[];
        if (order.length > 0) {
          const ranked = order
            .map((idx, pos) => `${pos + 1}. ${el.items[idx]}`)
            .join(", ");
          lines.push(`- ${el.label}\n  Reihenfolge: ${ranked}`);
        }
        break;
      }
    }
  }

  return lines.length > 1 ? lines.join("\n") : "";
}
