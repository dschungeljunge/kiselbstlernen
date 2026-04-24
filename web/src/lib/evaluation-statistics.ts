/**
 * Quantitative Auswertung (Likert 1–11), getrennt nach Messzeitpunkten.
 * Cronbach-α, gepaarte t-Tests, Cohen's d, Antwortqualität.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
import jStat from "jstat";

const Q_KEYS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;

export const SUBSCALES: { id: string; label: string; itemIndices: number[] }[] = [
  { id: "A", label: "Selbstwirksamkeit", itemIndices: [1, 2, 3] },
  { id: "B", label: "Wahrgen. Nutzen", itemIndices: [4, 5, 6] },
  { id: "C", label: "Didakt. Integration", itemIndices: [7, 8, 9] },
  { id: "D", label: "Transfer", itemIndices: [10, 11] },
];

export function mean(a: number[]): number {
  if (a.length === 0) return 0;
  return a.reduce((s, v) => s + v, 0) / a.length;
}

export function sampleStdev(a: number[]): number {
  if (a.length < 2) return 0;
  const m = mean(a);
  const s = a.reduce((acc, v) => acc + (v - m) ** 2, 0) / (a.length - 1);
  return Math.sqrt(s);
}

function sampleVar(a: number[]): number {
  if (a.length < 2) return 0;
  const m = mean(a);
  return a.reduce((acc, v) => acc + (v - m) ** 2, 0) / (a.length - 1);
}

export function cronbachAlpha(matrix: number[][]): number | null {
  if (matrix.length < 2) return null;
  const k = matrix[0]?.length;
  if (!k || k < 2) return null;
  for (const row of matrix) {
    if (row.length !== k) return null;
  }
  const itemVars: number[] = [];
  for (let j = 0; j < k; j += 1) {
    itemVars.push(sampleVar(matrix.map((row) => row[j]!)));
  }
  const totalScores = matrix.map((row) => row.reduce((a, b) => a + b, 0));
  const varTotal = sampleVar(totalScores);
  if (varTotal <= 0) return null;
  const sumItemVar = itemVars.reduce((a, b) => a + b, 0);
  return (k / (k - 1)) * (1 - sumItemVar / varTotal);
}

function qValuesFromAnswers(answers: Record<string, unknown> | null): (number | null)[] {
  if (!answers) return Q_KEYS.map(() => null);
  return Q_KEYS.map((i) => {
    const v = answers[`q${i}`];
    if (typeof v === "number" && Number.isFinite(v) && v >= 1 && v <= 5) {
      return v;
    }
    return null;
  });
}

export function isComplete11(answers: Record<string, unknown> | null): boolean {
  return qValuesFromAnswers(answers).every((v) => v !== null);
}

// --- Antwort-Qualität / Filter (Roh- vs. Analyse-Stichprobe) ---

export type ExclusionFlag = "too_fast" | "low_variance" | "long_streak";

export type ResponseFilterConfig = {
  minDurationSec: number;
  minResponseVariance: number;
  minStreakToFlag: number;
};

export const DEFAULT_FILTER_CONFIG: ResponseFilterConfig = {
  minDurationSec: 25,
  minResponseVariance: 0.05,
  minStreakToFlag: 8,
};

type Meta = { durationSec?: unknown };

function readDurationSec(answers: Record<string, unknown> | null): number | null {
  if (!answers) return null;
  const m = (answers as { _meta?: Meta })._meta;
  if (!m || typeof m !== "object" || m === null) return null;
  const d = m.durationSec;
  if (typeof d === "number" && Number.isFinite(d) && d >= 0) return d;
  if (typeof d === "string" && d.trim() !== "") {
    const n = parseFloat(d.replace(",", "."));
    if (Number.isFinite(n) && n >= 0) return n;
  }
  return null;
}

function maxSameValueStreak(values: number[]): number {
  if (values.length === 0) return 0;
  let best = 1;
  let cur = 1;
  for (let i = 1; i < values.length; i += 1) {
    if (values[i] === values[i - 1]) {
      cur += 1;
      if (cur > best) best = cur;
    } else {
      cur = 1;
    }
  }
  return best;
}

function countFlags(flagLists: ExclusionFlag[][]): Record<ExclusionFlag, number> {
  const out: Record<ExclusionFlag, number> = {
    too_fast: 0,
    low_variance: 0,
    long_streak: 0,
  };
  for (const f of flagLists) {
    for (const k of f) {
      out[k] += 1;
    }
  }
  return out;
}

export function assessResponseQuality(
  answers: Record<string, unknown> | null,
  config: ResponseFilterConfig = DEFAULT_FILTER_CONFIG,
): {
  useInAnalysis: boolean;
  flags: ExclusionFlag[];
  durationSec: number | null;
  variance: number | null;
  maxStreak: number | null;
} {
  if (!isComplete11(answers)) {
    return { useInAnalysis: false, flags: [], durationSec: null, variance: null, maxStreak: null };
  }
  const v = responseVariance(answers);
  const vals = Q_KEYS.map((i) => answers![`q${i}`] as number);
  const streak = maxSameValueStreak(vals);
  const durationSec = readDurationSec(answers);
  const flags: ExclusionFlag[] = [];
  if (v != null && v < config.minResponseVariance) {
    flags.push("low_variance");
  }
  if (streak >= config.minStreakToFlag) {
    flags.push("long_streak");
  }
  if (durationSec != null && durationSec < config.minDurationSec) {
    flags.push("too_fast");
  }
  return { useInAnalysis: flags.length === 0, flags, durationSec, variance: v, maxStreak: streak };
}

export function responseVariance(answers: Record<string, unknown> | null): number | null {
  const vals = qValuesFromAnswers(answers).filter((v): v is number => v !== null);
  if (vals.length < 2) return null;
  return sampleVar(vals);
}

export function totalScorePerson(answers: Record<string, unknown> | null): number | null {
  if (!isComplete11(answers)) return null;
  return Q_KEYS.reduce((s, i) => s + (answers![`q${i}`] as number), 0);
}

type JStatWith = { studentt: { cdf: (x: number, dof: number) => number } };
const j = jStat as unknown as JStatWith;

export function pairedTTestPaired(
  a: number[],
  b: number[],
): { n: number; meanDiff: number; sdDiff: number; t: number; df: number; pTwoSided: number; cohenDz: number } | null {
  if (a.length !== b.length || a.length < 2) return null;
  const diffs = a.map((v, i) => b[i] - v);
  const n = diffs.length;
  const meanDiff = mean(diffs);
  const sdDiff = sampleStdev(diffs);
  if (sdDiff === 0) {
    return { n, meanDiff, sdDiff, t: 0, df: n - 1, pTwoSided: meanDiff === 0 ? 1 : 0, cohenDz: 0 };
  }
  const t = (meanDiff / sdDiff) * Math.sqrt(n);
  const df = n - 1;
  const absT = Math.abs(t);
  const pOne = 1 - j.studentt.cdf(absT, df);
  const pTwoSided = Math.min(1, 2 * pOne);
  const cohenDz = meanDiff / sdDiff;
  return { n, meanDiff, sdDiff, t, df, pTwoSided, cohenDz };
}

export function interpretCohenD(d: number): string {
  const ad = Math.abs(d);
  if (ad < 0.2) return "vernachlässigbar";
  if (ad < 0.5) return "klein";
  if (ad < 0.8) return "mittel";
  return "gross";
}

export type DescriptiveItem = { item: number; n: number; mean: number; sd: number };

export type DescriptiveSubscale = {
  id: string;
  label: string;
  n: number;
  mean: number;
  sd: number;
  cronbachAlpha: number | null;
};

export type DescriptiveByTimepoint = {
  timepoint: string;
  nTotal: number;
  /** Vollständige Likert-Fragebögen (Roh) */
  nComplete: number;
  /** Nach Qualitätsfilter in die Auswertung einbezogen */
  nAnalyzed: number;
  /** Ausgeschlossen (Roh-Abzug Analyse) */
  nExcluded: number;
  exclusionByFlag: Record<ExclusionFlag, number>;
  /** Rohdaten: Anteil praktisch ohne Binnen-Varianz (Var &lt; 0,01) */
  straightLineRate: number;
  fullScaleCronbachAlpha: number | null;
  items: DescriptiveItem[];
  subscales: DescriptiveSubscale[];
  totalScoreMean: number;
  totalScoreSd: number;
  /** Mittlere Binnen-Varianz in der **analysierten** Stichprobe */
  responseVarianceMean: number;
};

type Row = {
  anon_code: string;
  timepoint: string;
  /** Reihenfolge 1,2,3… (DB); bei älteren Bogen ggf. fehlend, dann steueren wir nur über timepoint-String. */
  measurement_index?: number | null;
  answers: Record<string, unknown>;
};

export type CodeLinkageDiagnostics = {
  /** Eind. anonyme Codes in der Tabelle (Personen-IDs) */
  nUniqueCodes: number;
  /** Anzahl Bogen (Zeilen) pro Messzeitpunkt (T1, T2, …) */
  nRowsByTimepoint: { timepoint: string; nRows: number }[];
  /**
   * Codes mit mindestens T1- und T2-Messung (Längschnitt: derselbe `anon_code` in beiden Wellen; pro Code
   * max. 1 T1, 1 T2).
   */
  nCodesWithT1andT2: number;
  /** T1-Teilnahme, aber derselbe Code hat (noch) kein T2. */
  nCodesT1withoutT2: number;
  /**
   * Sollte 0 sein: T2 existiert, aber derselbe `anon_code` hat kein T1 (Daten- oder
   * Migrationsanomalie).
   */
  nCodesT2orphan: number;
  nCodesWithExactly1Submission: number;
  nCodesWith2orMoreSubmissions: number;
  nCodesWith3orMoreSubmissions: number;
  /**
   * nCodesWithT1andT2 / n Zeilen T1. Wie viele ursprünglich T1-begonnene Bogen führen (unter gleichem Code) auch
   * zu T2? 1, wenn n T1 = 0.
   */
  shareT1WithFollowupT2: number;
};

function buildCodeLinkageDiagnostics(rows: Row[]): CodeLinkageDiagnostics {
  const empty: CodeLinkageDiagnostics = {
    nUniqueCodes: 0,
    nRowsByTimepoint: [],
    nCodesWithT1andT2: 0,
    nCodesT1withoutT2: 0,
    nCodesT2orphan: 0,
    nCodesWithExactly1Submission: 0,
    nCodesWith2orMoreSubmissions: 0,
    nCodesWith3orMoreSubmissions: 0,
    shareT1WithFollowupT2: 1,
  };
  if (rows.length === 0) {
    return empty;
  }
  const byCode = new Map<string, Row[]>();
  for (const r of rows) {
    if (!byCode.has(r.anon_code)) {
      byCode.set(r.anon_code, []);
    }
    byCode.get(r.anon_code)!.push(r);
  }
  const byTimepointCount = new Map<string, number>();
  for (const r of rows) {
    const t = r.timepoint || "?";
    byTimepointCount.set(t, (byTimepointCount.get(t) ?? 0) + 1);
  }
  const nRowsByTimepoint = Array.from(byTimepointCount.entries())
    .sort(
      (a, b) =>
        (parseInt(a[0].replace(/^\D+/, ""), 10) || 0) -
        (parseInt(b[0].replace(/^\D+/, ""), 10) || 0),
    )
    .map(([timepoint, nRows]) => ({ timepoint, nRows }));
  const nT1 = byTimepointCount.get("T1") ?? 0;

  let nCodesWithExactly1Submission = 0;
  let nCodesWith2orMoreSubmissions = 0;
  let nCodesWith3orMoreSubmissions = 0;
  let nCodesWithT1andT2 = 0;
  let nCodesT1withoutT2 = 0;
  let nCodesT2orphan = 0;
  for (const [, list] of byCode) {
    const tps = new Set(list.map((r) => r.timepoint));
    if (list.length === 1) nCodesWithExactly1Submission += 1;
    if (list.length >= 2) nCodesWith2orMoreSubmissions += 1;
    if (list.length >= 3) nCodesWith3orMoreSubmissions += 1;
    if (tps.has("T1") && tps.has("T2")) nCodesWithT1andT2 += 1;
    if (tps.has("T1") && !tps.has("T2")) nCodesT1withoutT2 += 1;
    if (tps.has("T2") && !tps.has("T1")) nCodesT2orphan += 1;
  }
  return {
    nUniqueCodes: byCode.size,
    nRowsByTimepoint,
    nCodesWithT1andT2,
    nCodesT1withoutT2,
    nCodesT2orphan,
    nCodesWithExactly1Submission,
    nCodesWith2orMoreSubmissions,
    nCodesWith3orMoreSubmissions,
    shareT1WithFollowupT2: nT1 > 0 ? nCodesWithT1andT2 / nT1 : 1,
  };
}

function personMatrix(completeRows: { answers: Record<string, unknown> }[]): number[][] {
  return completeRows
    .map((r) => {
      if (!isComplete11(r.answers)) return null;
      return Q_KEYS.map((i) => r.answers[`q${i}`] as number);
    })
    .filter((row): row is number[] => row !== null);
}

function describeTimepoint(
  timepoint: string,
  rows: Row[],
  filterConfig: ResponseFilterConfig,
): DescriptiveByTimepoint {
  const nTotal = rows.length;
  const complete = rows.filter((r) => isComplete11(r.answers));
  const nComplete = complete.length;
  const withQ = complete.map((r) => ({
    r,
    q: assessResponseQuality(r.answers, filterConfig),
  }));
  const flagLists = withQ.map((x) => x.q.flags);
  const exclusionByFlag = countFlags(flagLists);
  const analyzed = withQ.filter((x) => x.q.useInAnalysis).map((x) => x.r);
  const nAnalyzed = analyzed.length;
  const nExcluded = nComplete - nAnalyzed;

  const varWithin = analyzed
    .map((r) => responseVariance(r.answers))
    .filter((v): v is number => v != null);
  const straight = complete.filter((r) => {
    const v = responseVariance(r.answers);
    return v !== null && v < 0.01;
  }).length;
  const mat11 = personMatrix(analyzed);
  const fullScaleCronbachAlpha = cronbachAlpha(mat11);

  const items: DescriptiveItem[] = Q_KEYS.map((i) => {
    const xs = analyzed.map((r) => r.answers[`q${i}`] as number);
    return {
      item: i,
      n: xs.length,
      mean: nAnalyzed > 0 ? mean(xs) : 0,
      sd: nAnalyzed > 1 ? sampleStdev(xs) : 0,
    };
  });

  const subscales: DescriptiveSubscale[] = SUBSCALES.map((s) => {
    const perPerson: number[] = [];
    for (const r of analyzed) {
      const ind = s.itemIndices;
      const vals = ind.map((ii) => r.answers[`q${ii}`] as number);
      perPerson.push(mean(vals));
    }
    const subMat = s.itemIndices.length >= 2 ? personMatrix(analyzed) : null;
    let scAlpha: number | null = null;
    if (subMat && s.itemIndices.length >= 2) {
      const colMat = subMat.map((row) => s.itemIndices.map((k) => row[k - 1]));
      scAlpha = cronbachAlpha(colMat);
    }
    return {
      id: s.id,
      label: s.label,
      n: perPerson.length,
      mean: perPerson.length ? mean(perPerson) : 0,
      sd: perPerson.length > 1 ? sampleStdev(perPerson) : 0,
      cronbachAlpha: scAlpha,
    };
  });

  const totals = analyzed
    .map((r) => totalScorePerson(r.answers))
    .filter((v): v is number => v != null);
  return {
    timepoint,
    nTotal,
    nComplete,
    nAnalyzed,
    nExcluded,
    exclusionByFlag,
    straightLineRate: nComplete > 0 ? straight / nComplete : 0,
    fullScaleCronbachAlpha: fullScaleCronbachAlpha,
    items,
    subscales,
    totalScoreMean: totals.length ? mean(totals) : 0,
    totalScoreSd: totals.length > 1 ? sampleStdev(totals) : 0,
    responseVarianceMean: varWithin.length ? mean(varWithin) : 0,
  };
}

export type PairedResult = {
  from: string;
  to: string;
  nPaired: number;
  pTwoSided: number | null;
  t: number | null;
  cohenDz: number | null;
  meanDiff: number | null;
  label: string;
};

export type ItemDistribution = {
  item: number;
  /** Index 0 = Skalenwert 1, …, Index 4 = 5 (Anzahlen in der Auswertungsstichprobe) */
  counts: [number, number, number, number, number];
};

export type TimepointItemDistributions = {
  timepoint: string;
  nAnalyzed: number;
  items: ItemDistribution[];
};

export type DashboardStatsPayload = {
  generatedAt: string;
  nRows: number;
  /** Summe ausgeschlossener, vollständiger Fragebögen (über alle Messzeitpunkte) */
  nExcludedSubmissions: number;
  timepoints: string[];
  byTimepoint: DescriptiveByTimepoint[];
  /** Häufigkeitsverteilung (Likert 1–5) pro Item, pro Messzeitpunkt; gefilterte Stichprobe */
  itemDistributions: TimepointItemDistributions[];
  paired: PairedResult[];
  itemChart: { item: string; byTp: Record<string, number> }[];
  subscaleChart: { key: string; label: string; byTp: Record<string, number> }[];
  notes: string[];
  filter: ResponseFilterConfig;
  /** Roh: gleicher `anon_code` über T1/T2/…; nicht von Qualitätsfilter betroffen */
  codeLinkage: CodeLinkageDiagnostics;
  /**
   * Deskriptive Kennzahlen, Mittel- und Verteilungsdiagramme für T1/T2: nur Befragte, bei denen in der DB
   * **beide** Messungen T1 und T2 (gleicher Code) vorkommen. (T3+ in den Rohdaten unverändert.)
   */
  t1T2CompletersCohort: { nAnonCodes: number; appliesToTimepoints: readonly ["T1", "T2"] };
};

function collectPair(
  from: string,
  to: string,
  byCode: Map<string, Map<string, Record<string, unknown>>>,
  passPair: (anon: string) => boolean,
  label: string,
): PairedResult {
  const scoresA: number[] = [];
  const scoresB: number[] = [];
  for (const [anon, tmap] of byCode) {
    if (!passPair(anon)) continue;
    const a = tmap.get(from);
    const b = tmap.get(to);
    if (a == null || b == null) continue;
    const ta = totalScorePerson(a);
    const tb = totalScorePerson(b);
    if (ta == null || tb == null) continue;
    scoresA.push(ta);
    scoresB.push(tb);
  }
  if (scoresA.length < 2) {
    return { from, to, nPaired: scoresA.length, pTwoSided: null, t: null, cohenDz: null, meanDiff: null, label };
  }
  const p = pairedTTestPaired(scoresA, scoresB);
  if (!p) {
    return { from, to, nPaired: scoresA.length, pTwoSided: null, t: null, cohenDz: null, meanDiff: null, label };
  }
  return {
    from,
    to,
    nPaired: p.n,
    pTwoSided: p.pTwoSided,
    t: p.t,
    cohenDz: p.cohenDz,
    meanDiff: p.meanDiff,
    label,
  };
}

export function buildDashboardStats(
  rows: Row[],
  config: ResponseFilterConfig = DEFAULT_FILTER_CONFIG,
): DashboardStatsPayload {
  const codeToTimepoints = new Map<string, Set<string>>();
  for (const r of rows) {
    if (!codeToTimepoints.has(r.anon_code)) {
      codeToTimepoints.set(r.anon_code, new Set());
    }
    codeToTimepoints.get(r.anon_code)!.add(r.timepoint);
  }
  const t1T2Completers = new Set<string>();
  for (const [code, tps] of codeToTimepoints) {
    if (tps.has("T1") && tps.has("T2")) {
      t1T2Completers.add(code);
    }
  }

  const notes: string[] = [
    "Gesamtskala: Summe der Items 1–11 (Spannweite 11–55). Gepaarte Tests: gleiche anonyme Codes, aufeinanderfolgende oder übersprungene Messungen; nur Paare, bei denen beide Erhebungen die Qualitätsfilter bestanden.",
    "p-Werte: gepaarter t-Test auf Differenzen (Likert-Intervalsskala, üblich in Evaluation). Nicht korrigiert für Mehrfachtests.",
    "α (Cronbach): interne Konsistenz; nur bei n≥2 Personen aussagekräftig; berechnet auf **gefilterter** Stichprobe.",
    `Datenqualität: Ausschluss bei niedriger Binnen-Varianz (unter ${config.minResponseVariance} über 11 Items, „Klischee/Straightlining“), langer Kategorie-Streak (≥${config.minStreakToFlag} identische Werte in Folge), oder (falls erfasst) Bearbeitungsdauer von unter ${config.minDurationSec} Sekunden.`,
    "T1- und T2-Deskriptionen (Kacheln, Mittelwert-/Verteilungs-Grafiken): ausschliesslich Befragte, bei denen derselbe `anon_code` in der DB **sowohl T1 als T2** hat. Ohne T2-Partner bleibende T1-Only-Bogen erscheinen in diesen T1–T2-Statistiken nicht. Messzeitpunkte T3+ sind davon unberührt.",
  ];

  const byTp = new Map<string, Row[]>();
  for (const r of rows) {
    const tp = r.timepoint || `T?`;
    if (!byTp.has(tp)) byTp.set(tp, []);
    byTp.get(tp)!.push(r);
  }

  for (const mustPair of ["T1", "T2"] as const) {
    if (!byTp.has(mustPair)) {
      continue;
    }
    byTp.set(
      mustPair,
      (byTp.get(mustPair) ?? []).filter((r) => t1T2Completers.has(r.anon_code)),
    );
  }

  const timepoints = Array.from(byTp.keys()).sort((a, b) => {
    const na = parseInt(a.replace(/^\D+/, ""), 10) || 0;
    const nb = parseInt(b.replace(/^\D+/, ""), 10) || 0;
    return na - nb;
  });

  const byTimepoint = timepoints.map((tp) => describeTimepoint(tp, byTp.get(tp)!, config));

  const nExcludedSubmissions = byTimepoint.reduce((s, b) => s + b.nExcluded, 0);

  const byCode = new Map<string, Map<string, Record<string, unknown>>>();
  for (const r of rows) {
    if (!byCode.has(r.anon_code)) {
      byCode.set(r.anon_code, new Map());
    }
    byCode.get(r.anon_code)!.set(r.timepoint, r.answers);
  }

  const passBoth = (a: string, b: string) => (code: string) => {
    const tmap = byCode.get(code);
    if (tmap == null) return false;
    const aa = tmap.get(a);
    const bb = tmap.get(b);
    if (aa == null || bb == null) return false;
    if (!isComplete11(aa) || !isComplete11(bb)) return false;
    const qa = assessResponseQuality(aa, config);
    const qb = assessResponseQuality(bb, config);
    return qa.useInAnalysis && qb.useInAnalysis;
  };

  const paired: PairedResult[] = [];
  for (let i = 0; i < timepoints.length - 1; i += 1) {
    const from = timepoints[i]!;
    const to = timepoints[i + 1]!;
    paired.push(
      collectPair(
        from,
        to,
        byCode,
        passBoth(from, to),
        `Differenz ${from} und ${to} (gepaart)`,
      ),
    );
  }
  if (timepoints.length > 2) {
    const first = timepoints[0]!;
    const last = timepoints[timepoints.length - 1]!;
    paired.push(
      collectPair(
        first,
        last,
        byCode,
        passBoth(first, last),
        `Differenz ${first} und ${last} (gepaart, erste vs. letzte messung)`,
      ),
    );
  }

  const itemChart: DashboardStatsPayload["itemChart"] = Q_KEYS.map((n) => {
    const byTp2: Record<string, number> = {};
    for (const tp of timepoints) {
      const desc = byTimepoint.find((d) => d.timepoint === tp);
      const it = desc?.items.find((x) => x.item === n);
      byTp2[tp] = it ? it.mean : 0;
    }
    return { item: `F${n}`, byTp: byTp2 };
  });

  const subscaleChart: DashboardStatsPayload["subscaleChart"] = SUBSCALES.map((s) => {
    const byTp2: Record<string, number> = {};
    for (const tp of timepoints) {
      const desc = byTimepoint.find((d) => d.timepoint === tp);
      const sub = desc?.subscales.find((x) => x.id === s.id);
      byTp2[tp] = sub ? sub.mean : 0;
    }
    return { key: s.id, label: s.label, byTp: byTp2 };
  });

  const itemDistributions: TimepointItemDistributions[] = timepoints.map((tp) => {
    const rowsTp = byTp.get(tp) ?? [];
    const analyzed = rowsTp.filter(
      (r) =>
        isComplete11(r.answers) && assessResponseQuality(r.answers, config).useInAnalysis,
    );
    const nAnalyzed = analyzed.length;
    const items: ItemDistribution[] = Q_KEYS.map((itemNum) => {
      const counts: [number, number, number, number, number] = [0, 0, 0, 0, 0];
      for (const r of analyzed) {
        const v = r.answers[`q${itemNum}`] as number;
        if (v >= 1 && v <= 5 && Number.isInteger(v)) {
          counts[v - 1] += 1;
        }
      }
      return { item: itemNum, counts };
    });
    return { timepoint: tp, nAnalyzed, items };
  });

  const codeLinkage = buildCodeLinkageDiagnostics(rows);

  return {
    generatedAt: new Date().toISOString(),
    nRows: rows.length,
    nExcludedSubmissions,
    timepoints,
    byTimepoint,
    itemDistributions,
    paired,
    itemChart,
    subscaleChart,
    notes,
    filter: config,
    codeLinkage,
    t1T2CompletersCohort: {
      nAnonCodes: t1T2Completers.size,
      appliesToTimepoints: ["T1", "T2"],
    },
  };
}