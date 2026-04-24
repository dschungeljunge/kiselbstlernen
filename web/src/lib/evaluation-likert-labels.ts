/**
 * Wortlaut der Evaluation-Items (F1–F11) und Likert-Skala — eine Quelle für Fragebogen + Dashboard.
 */

export const EVALUATION_LIKERT_ITEM_TEXTS: readonly [string, ...string[]] = [
  "Ich traue mir zu, KI-Tools sinnvoll in meinen Unterricht zu integrieren.",
  "Ich kann Lernaufgaben entwickeln, bei denen KI den Lernprozess unterstützt.",
  "Ich kann Lernende dabei unterstützen, KI reflektiert zu nutzen.",
  "Der Einsatz von KI kann die Qualität meines Unterrichts verbessern.",
  "KI kann mich bei der Planung oder Durchführung von Unterricht wirksam unterstützen.",
  "Der Einsatz von KI hilft mir, Lernprozesse effizienter zu gestalten.",
  "Ich plane Unterricht so, dass der Einsatz von KI klar mit meinen Lernzielen verknüpft ist.",
  "Ich kann einschätzen, in welchen Unterrichtssituationen der Einsatz von KI sinnvoll ist und in welchen nicht.",
  "Ich kann begründen, warum ich KI in einer konkreten Unterrichtssituation einsetze oder bewusst darauf verzichte.",
  "Ich beabsichtige, KI in den nächsten Wochen im Unterricht einzusetzen.",
  "Ich plane, Unterrichtsmaterialien mit Unterstützung von KI weiterzuentwickeln.",
];

/** Kurzlabels für die Skalenstufe 1–5 (Legende in Grafiken) */
export const LIKERT_ANSWER_SHORT: readonly [string, string, string, string, string] = [
  "1 — stimme ü. nicht zu",
  "2",
  "3 — teils/teils",
  "4",
  "5 — voll zustimmend",
];
