import { EVALUATION_LIKERT_ITEM_TEXTS } from "@/lib/evaluation-likert-labels";
import { SUBSCALES } from "@/lib/evaluation-statistics";

export type DashboardViewMode = "diskussion" | "experten";

export const TIMEPOINT_LABELS: Record<string, string> = {
  T1: "Vor dem Workshop",
  T2: "Direkt nach dem Workshop",
  T3: "Reflexion im Frühling/Sommer",
};

export function timepointLabel(tp: string): string {
  return TIMEPOINT_LABELS[tp] ?? tp;
}

export function itemFullText(itemNum: number): string {
  return EVALUATION_LIKERT_ITEM_TEXTS[itemNum - 1] ?? `Frage ${itemNum}`;
}

export function itemShortLabel(itemNum: number, maxLen = 36): string {
  const text = itemFullText(itemNum);
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen - 1)}…`;
}

export function parseItemNum(label: string): number {
  const m = label.match(/^F(\d+)$/);
  return m ? parseInt(m[1]!, 10) : 0;
}

export const DISCUSSION_INTRO =
  "Diese Kurzansicht ist als Gesprächsgrundlage gedacht: Was sehen wir direkt nach dem Workshop, und was nehmen die Teilnehmenden später im Verlauf des Frühlings bis zu den Sommerferien mit?";

export const DISCUSSION_QUESTIONS = [
  "Was bestätigt eure Beobachtungen aus dem Workshop?",
  "Wo sollten wir den zweiten Workshop klarer, praktischer oder fokussierter machen?",
  "Welche Ergebnisse möchtet ihr mit den Kolleg:innen vertieft besprechen?",
] as const;

export const SUBSCALE_INFO = SUBSCALES.map((s) => ({
  id: s.id,
  label: s.label,
  itemRange:
    s.itemIndices.length === 1
      ? `F${s.itemIndices[0]}`
      : `F${s.itemIndices[0]}–F${s.itemIndices[s.itemIndices.length - 1]}`,
  itemIndices: s.itemIndices,
}));

export type ItemDelta = {
  item: string;
  itemNum: number;
  fromTp: string;
  toTp: string;
  fromVal: number;
  toVal: number;
  delta: number;
};

export function comparisonTimepoints(timepoints: string[]): { from: string; to: string } | null {
  if (timepoints.length < 2) return null;
  if (timepoints.includes("T1") && timepoints.includes("T2")) {
    return { from: "T1", to: "T2" };
  }
  return { from: timepoints[0]!, to: timepoints[timepoints.length - 1]! };
}

export function topItemDeltas(
  itemChart: { item: string; byTp: Record<string, number> }[],
  timepoints: string[],
  limit = 3,
): ItemDelta[] {
  const cmp = comparisonTimepoints(timepoints);
  if (!cmp) return [];

  return itemChart
    .map((row) => {
      const itemNum = parseItemNum(row.item);
      const fromVal = row.byTp[cmp.from] ?? 0;
      const toVal = row.byTp[cmp.to] ?? 0;
      return {
        item: row.item,
        itemNum,
        fromTp: cmp.from,
        toTp: cmp.to,
        fromVal,
        toVal,
        delta: toVal - fromVal,
      };
    })
    .filter((x) => x.itemNum > 0)
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    .slice(0, limit);
}

export type SubscaleDelta = {
  id: string;
  label: string;
  itemRange: string;
  fromVal: number;
  toVal: number;
  delta: number;
};

export function subscaleDeltas(
  subscaleChart: { key: string; label: string; byTp: Record<string, number> }[],
  timepoints: string[],
): SubscaleDelta[] {
  const cmp = comparisonTimepoints(timepoints);
  if (!cmp) return [];

  return subscaleChart.map((sc) => {
    const info = SUBSCALE_INFO.find((s) => s.id === sc.key);
    const fromVal = sc.byTp[cmp.from] ?? 0;
    const toVal = sc.byTp[cmp.to] ?? 0;
    return {
      id: sc.key,
      label: sc.label,
      itemRange: info?.itemRange ?? sc.key,
      fromVal,
      toVal,
      delta: toVal - fromVal,
    };
  });
}

export function formatDelta(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2).replace(".", ",")}`;
}

export function changeAssessment(meanDiff: number | null, cohenDz: number | null): string {
  if (meanDiff == null) return "—";
  const d = cohenDz ?? 0;
  if (Math.abs(meanDiff) < 0.15) return "Kaum Veränderung";
  if (Math.abs(d) >= 0.5 || Math.abs(meanDiff) >= 2) {
    return meanDiff > 0 ? "Deutliche Verbesserung" : "Deutlicher Rückgang";
  }
  return meanDiff > 0 ? "Leichte Verbesserung" : "Leichter Rückgang";
}

export function resolveSliceIdFromGruppe(
  slices: { id: string }[],
  gruppe: string | null,
): string | null {
  if (!gruppe) return null;
  const candidates = [
    gruppe,
    gruppe.startsWith("workshop-") ? gruppe : `workshop-${gruppe}`,
  ];
  for (const id of candidates) {
    if (slices.some((s) => s.id === id)) return id;
  }
  return null;
}
