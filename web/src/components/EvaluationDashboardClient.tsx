"use client";

import { useId, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { EVALUATION_LIKERT_ITEM_TEXTS, LIKERT_ANSWER_SHORT } from "@/lib/evaluation-likert-labels";
import { cn } from "@/lib/cn";
import type { DashboardStatsPayload, ExclusionFlag, TimepointItemDistributions } from "@/lib/evaluation-statistics";

const COLORS = ["#ca8a04", "#3f3f46", "#16a34a", "#2563eb", "#9333ea", "#db2777"];

const LIKERT_STACK_COLORS = ["#b91c1c", "#f97316", "#ca8a04", "#22c55e", "#15803d"] as const;
const DIST_KEYS = ["v1", "v2", "v3", "v4", "v5"] as const;

const TABS = [
  { id: "overview" as const, label: "Übersicht" },
  { id: "charts" as const, label: "Grafiken" },
  { id: "distributions" as const, label: "Verteilungen" },
  { id: "methodology" as const, label: "Methodik & Details" },
];

type TabId = (typeof TABS)[number]["id"];

type DashboardContext = "overall" | "workshop" | "t3";

type Props = {
  data: DashboardStatsPayload;
  context?: DashboardContext;
  title?: string;
};

const EXCLUSION_FLAG_LABEL: Record<ExclusionFlag, string> = {
  too_fast: "Dauer (zu schnell, falls erfasst)",
  low_variance: "Kaum Differenzierung (Binnen-Varianz)",
  long_streak: "Lange Folge identischer Werte (Muster)",
};

function formatP(p: number | null): string {
  if (p == null) return "—";
  if (p < 0.0001) return "< 0,0001";
  return p.toFixed(4).replace(".", ",");
}

function toDistributionChartRows(block: TimepointItemDistributions) {
  return block.items.map((it) => ({
    name: `F${it.item}`,
    v1: it.counts[0]!,
    v2: it.counts[1]!,
    v3: it.counts[2]!,
    v4: it.counts[3]!,
    v5: it.counts[4]!,
  }));
}

type DistTooltipProps = {
  active?: boolean;
  label?: string | number;
  block: TimepointItemDistributions;
};

function TimepointDistTooltip({ active, label, block }: DistTooltipProps) {
  if (!active || label == null || String(label) === "") return null;
  const m = String(label).match(/^F(\d+)$/);
  const nItem = m ? parseInt(m[1]!, 10) : 0;
  const it = block.items.find((x) => x.item === nItem);
  if (!it) return null;
  const total = it.counts.reduce((a, b) => a + b, 0);
  return (
    <div className="max-w-sm rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs shadow-sm">
      <p className="font-semibold text-zinc-900">Item {String(label)}</p>
      <p className="text-zinc-500">n = {total} (Auswertungsstichprobe)</p>
      <ul className="mt-2 space-y-1 text-zinc-800">
        {([1, 2, 3, 4, 5] as const).map((k) => {
          const c = it.counts[k - 1] ?? 0;
          const pct = total > 0 ? (c / total) * 100 : 0;
          return (
            <li key={k} className="flex justify-between gap-4">
              <span>Skala {k}</span>
              <span>
                {c} ({pct.toFixed(1).replace(".", ",")}%)
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function EvaluationDashboardClient({ data, context = "overall", title }: Props) {
  const [tab, setTab] = useState<TabId>("overview");
  const tabPanelId = useId();
  const tabListId = useId();

  const {
    timepoints,
    byTimepoint,
    paired,
    itemChart,
    subscaleChart,
    notes,
    filter,
    nExcludedSubmissions,
    itemDistributions,
    codeLinkage: cl,
    t1T2CompletersCohort: cohortT1T2,
  } = data;

  const itemBarData = itemChart.map((row) => {
    const o: Record<string, string | number> = { name: row.item };
    for (const tp of timepoints) {
      o[tp] = row.byTp[tp] ?? 0;
    }
    return o;
  });

  const subLineData = timepoints.map((tp) => {
    const o: Record<string, string | number> = { timepoint: tp };
    for (const sc of subscaleChart) {
      o[sc.key] = sc.byTp[tp] ?? 0;
    }
    return o;
  });

  const t1Row = cl.nRowsByTimepoint.find((x) => x.timepoint === "T1");
  const shareT1T2Pct =
    t1Row?.nRows != null && t1Row.nRows > 0
      ? `${(cl.shareT1WithFollowupT2 * 100).toFixed(1).replace(".", ",")} %`
      : "—";

  const showLinkage = context !== "t3";
  const t3Block = byTimepoint.find((b) => b.timepoint === "T3");

  return (
    <div className="space-y-8">
      <section
        className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
        aria-label="Kernkennzahlen"
      >
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">
              {title ? `${title} — Auf einen Blick` : "Auf einen Blick"}
            </h2>
            <p className="mt-0.5 text-xs text-zinc-500">
              {context === "t3"
                ? "Individuelle Reflexions-Nachmessung — Details unter «Methodik & Details»."
                : "Stichprobe, Längsschnitt und Datenstand — Details unter «Methodik & Details»."}
            </p>
          </div>
          <p className="text-xs tabular-nums text-zinc-500">
            Stand: {new Date(data.generatedAt).toLocaleString("de-CH")} · DB-Zeilen: {data.nRows}
          </p>
        </div>
        <dl
          className={cn(
            "mt-4 grid gap-3",
            showLinkage ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {showLinkage && (
            <>
              <div className="rounded-lg border border-zinc-100 bg-zinc-50/80 px-4 py-3">
                <dt className="text-xs font-medium text-zinc-500">Längsschnitt (gleicher Code T1↔T2)</dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900">{cl.nCodesWithT1andT2}</dd>
                <dd className="mt-0.5 text-xs text-zinc-600">Anonym-Codes mit T1 und T2</dd>
              </div>
              <div className="rounded-lg border border-zinc-100 bg-zinc-50/80 px-4 py-3">
                <dt className="text-xs font-medium text-zinc-500">Rücklauf T1 → T2</dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900">{shareT1T2Pct}</dd>
                <dd className="mt-0.5 text-xs text-zinc-600">Anteil T1-Befragte mit passendem T2</dd>
              </div>
            </>
          )}
          {context === "t3" && t3Block && (
            <div className="rounded-lg border border-zinc-100 bg-zinc-50/80 px-4 py-3">
              <dt className="text-xs font-medium text-zinc-500">T3 in Auswertung</dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900">{t3Block.nAnalyzed}</dd>
              <dd className="mt-0.5 text-xs text-zinc-600">
                M = {t3Block.totalScoreMean.toFixed(2).replace(".", ",")} (Summenskala)
              </dd>
            </div>
          )}
          <div className="rounded-lg border border-zinc-100 bg-zinc-50/80 px-4 py-3">
            <dt className="text-xs font-medium text-zinc-500">Ausgeschlossen (Qualität)</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900">{nExcludedSubmissions}</dd>
            <dd className="mt-0.5 text-xs text-zinc-600">Vollständige Bogen, ohne Doppelzählung</dd>
          </div>
          {showLinkage && (
            <div className="rounded-lg border border-zinc-100 bg-zinc-50/80 px-4 py-3">
              <dt className="text-xs font-medium text-zinc-500">T1/T2-Kohorte (Mittelwerte T1, T2)</dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900">{cohortT1T2.nAnonCodes}</dd>
              <dd className="mt-0.5 text-xs text-zinc-600">
                Codes mit T1+T2 für {cohortT1T2.appliesToTimepoints.join(" und ")}
              </dd>
            </div>
          )}
        </dl>
      </section>

      <div>
        <div className="border-b border-zinc-200">
          <nav
            id={tabListId}
            className="-mb-px flex flex-wrap gap-1"
            role="tablist"
            aria-label="Dashboard-Bereiche"
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                id={`${tabPanelId}-${t.id}-tab`}
                aria-selected={tab === t.id}
                aria-controls={`${tabPanelId}-${t.id}-panel`}
                tabIndex={tab === t.id ? 0 : -1}
                onClick={() => setTab(t.id)}
                className={cn(
                  "rounded-t-md px-4 py-2.5 text-sm font-medium transition-colors",
                  tab === t.id
                    ? "border border-b-0 border-zinc-200 bg-white text-zinc-900"
                    : "border border-transparent text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900",
                )}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="rounded-b-xl rounded-tr-xl border border-t-0 border-zinc-200 bg-white p-6 shadow-sm sm:rounded-tl-none">
          {TABS.map((t) => (
            <div
              key={t.id}
              id={`${tabPanelId}-${t.id}-panel`}
              role="tabpanel"
              aria-labelledby={`${tabPanelId}-${t.id}-tab`}
              hidden={tab !== t.id}
              className={tab === t.id ? "space-y-10" : undefined}
            >
              {tab === t.id && t.id === "overview" ? (
                <>
                  <p className="text-sm text-zinc-600">
                    Gefilterte Kennzahlen und Signifikanztests. Ausreisser-Regeln und Fragentexte finden Sie unter{" "}
                    <button
                      type="button"
                      className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-600"
                      onClick={() => setTab("methodology")}
                    >
                      Methodik &amp; Details
                    </button>
                    .
                  </p>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {byTimepoint.map((b) => (
                      <div
                        key={b.timepoint}
                        className="rounded-lg border border-zinc-200 bg-zinc-50/40 p-4"
                      >
                        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{b.timepoint}</p>
                        <p className="mt-2 text-3xl font-semibold tabular-nums text-zinc-900">{b.nAnalyzed}</p>
                        <p className="text-sm text-zinc-600">in Auswertung (nach Filter)</p>
                        <p className="mt-3 border-t border-zinc-200/80 pt-3 text-xs text-zinc-600">
                          Roh vollständig: <span className="tabular-nums font-medium text-zinc-800">{b.nComplete}</span>
                          {" · "}
                          ausgeschlossen:{" "}
                          <span className="tabular-nums font-medium text-zinc-800">{b.nExcluded}</span>
                        </p>
                        {b.nExcluded > 0 && (
                          <p className="mt-2 text-xs leading-relaxed text-amber-900/90">
                            {(
                              (["too_fast", "low_variance", "long_streak"] as const)
                                .filter((k) => b.exclusionByFlag[k]! > 0)
                                .map(
                                  (k) => `${EXCLUSION_FLAG_LABEL[k as ExclusionFlag]}: ${b.exclusionByFlag[k]}`,
                                )
                                .join(" · ") || "—"
                            )}
                          </p>
                        )}
                        <div className="mt-3 space-y-1 border-t border-zinc-200/80 pt-3 text-xs text-zinc-700">
                          <p>
                            Summenskala:{" "}
                            <span className="font-medium tabular-nums">
                              M = {b.totalScoreMean.toFixed(2).replace(".", ",")}
                            </span>
                            , SD{" "}
                            <span className="tabular-nums">{b.totalScoreSd.toFixed(2).replace(".", ",")}</span>
                            , α{" "}
                            <span className="tabular-nums">
                              {b.fullScaleCronbachAlpha == null
                                ? "—"
                                : b.fullScaleCronbachAlpha.toFixed(2).replace(".", ",")}
                            </span>
                          </p>
                          <p className="text-zinc-500">
                            Roh: «Einseitig» (Var. &lt; 0,01): {(b.straightLineRate * 100).toFixed(0)}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <section aria-labelledby="paired-heading">
                    <h2 id="paired-heading" className="text-base font-semibold text-zinc-900">
                      Gepaarte Auswertungen (Gesamtskala 11–55)
                    </h2>
                    <p className="mt-1 max-w-3xl text-sm text-zinc-600">
                      Nur Paare mit gültigen Messungen an beiden Zeitpunkten. Gepaarter t-Test; Cohen d (gepaart).
                    </p>
                    <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-100">
                      <table className="min-w-full text-left text-sm">
                        <thead>
                          <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-600">
                            <th className="px-4 py-3 font-medium">Vergleich</th>
                            <th className="px-4 py-3 font-medium">n</th>
                            <th className="px-4 py-3 font-medium">Δ (Summe)</th>
                            <th className="px-4 py-3 font-medium">t</th>
                            <th className="px-4 py-3 font-medium">p (zweiseitig)</th>
                            <th className="px-4 py-3 font-medium">Cohen d (z)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paired.map((p) => (
                            <tr key={p.from + p.to + p.label} className="border-b border-zinc-100 last:border-0">
                              <td className="px-4 py-3 font-medium text-zinc-800">{p.label}</td>
                              <td className="px-4 py-3 tabular-nums text-zinc-700">{p.nPaired}</td>
                              <td className="px-4 py-3 tabular-nums text-zinc-700">
                                {p.meanDiff == null ? "—" : p.meanDiff.toFixed(2).replace(".", ",")}
                              </td>
                              <td className="px-4 py-3 tabular-nums text-zinc-700">
                                {p.t == null ? "—" : p.t.toFixed(2).replace(".", ",")}
                              </td>
                              <td className="px-4 py-3 tabular-nums text-zinc-700">{formatP(p.pTwoSided)}</td>
                              <td className="px-4 py-3 tabular-nums text-zinc-700">
                                {p.cohenDz == null ? "—" : p.cohenDz.toFixed(2).replace(".", ",")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </>
              ) : null}

              {tab === t.id && t.id === "charts" ? (
                <>
                  <p className="text-sm text-zinc-600">
                    F1–F11 = Fragen 1–11. Vollständige Fragewortlaute unter{" "}
                    <button
                      type="button"
                      className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-600"
                      onClick={() => setTab("methodology")}
                    >
                      Methodik &amp; Details
                    </button>
                    .
                  </p>

                  <section className="rounded-xl border border-zinc-100 bg-zinc-50/30 p-5">
                    <h2 className="text-base font-semibold text-zinc-900">Mittelwerte pro Item (Likert 1–5)</h2>
                    <p className="mt-1 text-sm text-zinc-600">
                      Gefilterte Stichprobe, getrennt nach Messzeitpunkt. Höhere Werte = stärkere Zustimmung.
                    </p>
                    <div className="mt-5 h-[min(28rem,55vh)] w-full min-h-[16rem] sm:h-[480px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={itemBarData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200" />
                          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                          <YAxis domain={[1, 5]} tickCount={5} width={32} tick={{ fontSize: 11 }} />
                          <Tooltip
                            formatter={(v) => {
                              const n = typeof v === "number" ? v : Number(v);
                              return [Number.isFinite(n) ? n.toFixed(2) : "—", "M"];
                            }}
                            labelFormatter={(l) => (l != null && l !== "" ? String(l) : "Item")}
                          />
                          <Legend />
                          {timepoints.map((tp, i) => (
                            <Bar
                              key={tp}
                              dataKey={tp}
                              name={tp}
                              fill={COLORS[i % COLORS.length]}
                              radius={[2, 2, 0, 0]}
                            />
                          ))}
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </section>

                  <section className="rounded-xl border border-zinc-100 bg-zinc-50/30 p-5">
                    <h2 className="text-base font-semibold text-zinc-900">Subskala-Mittelwerte über Messzeitpunkte</h2>
                    <p className="mt-1 text-sm text-zinc-600">A–D gemäss Fragebogen (Mittel pro Subskala).</p>
                    <div className="mt-5 h-[min(22rem,45vh)] w-full min-h-[14rem] sm:h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={subLineData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200" />
                          <XAxis dataKey="timepoint" tick={{ fontSize: 12 }} />
                          <YAxis domain={[1, 5]} tickCount={5} width={32} tick={{ fontSize: 11 }} />
                          <Tooltip
                            formatter={(v) => {
                              const n = typeof v === "number" ? v : Number(v);
                              return Number.isFinite(n) ? n.toFixed(2) : "—";
                            }}
                          />
                          <Legend />
                          {subscaleChart.map((sc, i) => (
                            <Line
                              key={sc.key}
                              type="monotone"
                              dataKey={sc.key}
                              name={sc.label}
                              stroke={COLORS[i % COLORS.length]}
                              strokeWidth={2}
                              dot={{ r: 4 }}
                            />
                          ))}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </section>
                </>
              ) : null}

              {tab === t.id && t.id === "distributions" ? (
                <section aria-labelledby="dist-heading">
                  <h2 id="dist-heading" className="text-base font-semibold text-zinc-900">
                    Anteile der Skalenstufen 1–5 pro Item
                  </h2>
                  <p className="mt-1 max-w-3xl text-sm text-zinc-600">
                    100 %-gestapelte Balken pro Frage. Legende zu F1–F11 unter{" "}
                    <button
                      type="button"
                      className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-600"
                      onClick={() => setTab("methodology")}
                    >
                      Methodik &amp; Details
                    </button>
                    .
                  </p>
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-zinc-600">
                    {([1, 2, 3, 4, 5] as const).map((k) => (
                      <span key={k} className="inline-flex items-center gap-1.5">
                        <span
                          className="h-2.5 w-2.5 rounded-sm"
                          style={{ backgroundColor: LIKERT_STACK_COLORS[k - 1] }}
                          aria-hidden
                        />
                        Skala {k}: {LIKERT_ANSWER_SHORT[k - 1]}
                      </span>
                    ))}
                  </div>

                  {itemDistributions.map((block) => {
                    const rowData = toDistributionChartRows(block);
                    return (
                      <div
                        key={block.timepoint}
                        className="mt-10 border-t border-zinc-100 pt-10 first:mt-6 first:border-0 first:pt-0"
                      >
                        <h3 className="text-sm font-semibold text-zinc-800">
                          Messzeitpunkt {block.timepoint}{" "}
                          <span className="font-normal text-zinc-500">· n = {block.nAnalyzed}</span>
                        </h3>
                        {block.nAnalyzed === 0 ? (
                          <p className="mt-2 text-sm text-zinc-500">Keine Fälle in der Auswertungsstichprobe.</p>
                        ) : (
                          <div className="mt-4 h-[min(32rem,70vh)] w-full min-h-[20rem]">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={rowData}
                                margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
                                stackOffset="expand"
                              >
                                <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200" vertical={false} />
                                <XAxis
                                  dataKey="name"
                                  tick={{ fontSize: 10 }}
                                  interval={0}
                                  height={32}
                                  tickMargin={4}
                                />
                                <YAxis
                                  width={40}
                                  tick={{ fontSize: 11 }}
                                  tickFormatter={(v) =>
                                    Number.isFinite(Number(v)) ? `${Math.round(Number(v) * 100)}%` : "—"
                                  }
                                />
                                <Tooltip
                                  content={(tip) => (
                                    <TimepointDistTooltip
                                      active={tip.active}
                                      label={tip.label}
                                      block={block}
                                    />
                                  )}
                                />
                                <Legend
                                  layout="horizontal"
                                  verticalAlign="top"
                                  align="center"
                                  wrapperStyle={{ fontSize: 11, paddingBottom: 8 }}
                                />
                                {DIST_KEYS.map((key, i) => (
                                  <Bar
                                    key={key}
                                    dataKey={key}
                                    name={LIKERT_ANSWER_SHORT[i] ?? `Stufe ${i + 1}`}
                                    stackId="dist"
                                    fill={LIKERT_STACK_COLORS[i] ?? "#71717a"}
                                  />
                                ))}
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </section>
              ) : null}

              {tab === t.id && t.id === "methodology" ? (
                <div className="space-y-8">
                  <section className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-5">
                    <h2 className="text-base font-semibold text-zinc-900">Datenfilter (Ausreisser &amp; Muster)</h2>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                      In den Kennzahlen und Grafiken sind nur vollständige Bogen berücksichtigt, die die Kriterien
                      erfüllen. Ein Fragebogen kann mehrere Kennzeichen zugleich tragen; die Häufigkeit pro Kriterium
                      kann daher höher sein als die Zahl der ausgeschlossenen Bogen.
                    </p>
                    <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm text-zinc-800">
                      <li>
                        Mindestdauer (nur mit erfasster Zeit, neue Absendungen):{" "}
                        <span className="font-medium">≥{filter.minDurationSec}s</span> für 11 Fragen; ältere Bogen ohne
                        Zeitstempel werden <span className="font-medium">nicht</span> daran ausgeschlossen.
                      </li>
                      <li>
                        Binnen-Varianz: unter <span className="font-medium">{filter.minResponseVariance}</span> = kaum
                        Unterschiede zwischen den Items.
                      </li>
                      <li>
                        Muster: identische Werte in mindestens{" "}
                        <span className="font-medium">{filter.minStreakToFlag}</span> Fragen in Folge.
                      </li>
                    </ul>
                    <p className="mt-3 text-sm text-zinc-700">
                      Gesamt: <span className="font-semibold">{nExcludedSubmissions}</span> vollständige Bogen in der
                      Stichprobe ausgeschlossen (alle Zeitpunkte, ohne Doppelzählung derselben Bogen-Submission).
                    </p>
                    <div className="mt-4 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800">
                      <p className="font-semibold text-zinc-900">T1- und T2-Mittelwerte / Verteilungen</p>
                      <p className="mt-1 text-zinc-700">
                        Für {cohortT1T2.appliesToTimepoints.join(" und ")} zählen nur Anonym-Codes, die in der
                        Rohdatenbank <span className="font-medium">T1 und T2</span> (gleicher Code) haben — aktuell{" "}
                        <span className="font-semibold tabular-nums">{cohortT1T2.nAnonCodes}</span> solche IDs. Reine
                        T1-Teilnahmen erscheinen in diesen T1/T2-Statistiken <span className="font-medium">nicht</span>.
                        T3+ bezieht sich auf alle Bogen am jeweiligen Messzeitpunkt ohne diese Einschränkung.
                      </p>
                    </div>
                  </section>

                  {showLinkage && (
                  <section className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-5">
                    <h2 className="text-base font-semibold text-zinc-900">Längsschnitt: gleicher Anonym-Code (T1 ↔ T2)</h2>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                      T2 wird nur erzeugt, wenn dieselbe Person denselben <code className="rounded bg-zinc-100 px-1.5 text-xs">anon_code</code>{" "}
                      wie bei der ersten Befragung einträgt. Mehr T1- als T2-Bogen ist daher üblich: Teilnahme bricht
                      ab, oder in Welle 2 wird ein leicht abweichender Code verwendet — das zählt dann als neuer T1-Code,
                      nicht als T2 zum ursprünglichen Code.
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3">
                        <p className="text-xs text-zinc-500">Eindeutige Anonym-Codes in der DB</p>
                        <p className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900">{cl.nUniqueCodes}</p>
                      </div>
                      <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3">
                        <p className="text-xs text-zinc-500">Codes mit T1 und T2 (matchbar)</p>
                        <p className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900">{cl.nCodesWithT1andT2}</p>
                      </div>
                      <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3">
                        <p className="text-xs text-zinc-500">Anteil T1 mit (gleichem Code) auch T2</p>
                        <p className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900">{shareT1T2Pct}</p>
                      </div>
                      <div className="rounded-lg border border-zinc-200 bg-amber-50/60 px-4 py-3">
                        <p className="text-xs text-amber-900/80">Nur T1, kein T2 unter gleichem Code</p>
                        <p className="mt-1 text-2xl font-semibold tabular-nums text-amber-950">{cl.nCodesT1withoutT2}</p>
                      </div>
                      {cl.nCodesT2orphan > 0 && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 sm:col-span-2">
                          <p className="text-xs font-medium text-red-800">Auffällig: T2 ohne T1 zumselben Code</p>
                          <p className="mt-1 text-2xl font-bold tabular-nums text-red-900">{cl.nCodesT2orphan}</p>
                          <p className="mt-1 text-xs text-red-800/90">
                            Erwartet 0. Wenn &gt; 0: Messzeitpunkt / Migration in Supabase prüfen.
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-200 bg-white p-3">
                      <p className="text-xs font-medium text-zinc-600">Bogen (Zeilen) pro Messzeitpunkt (Roh)</p>
                      <table className="mt-2 min-w-[16rem] text-left text-sm text-zinc-800">
                        <thead>
                          <tr className="border-b border-zinc-200 text-zinc-500">
                            <th className="py-2 pr-4 font-medium">Zeitpunkt</th>
                            <th className="py-2 pr-4 font-medium">n Zeilen</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cl.nRowsByTimepoint.length === 0 ? (
                            <tr>
                              <td colSpan={2} className="py-2 text-zinc-500">
                                —
                              </td>
                            </tr>
                          ) : (
                            cl.nRowsByTimepoint.map((row) => (
                              <tr key={row.timepoint} className="border-b border-zinc-100 last:border-0">
                                <td className="py-2 pr-4 font-mono text-xs">{row.timepoint}</td>
                                <td className="py-2 tabular-nums">{row.nRows}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-3 text-xs text-zinc-600">
                      1 Bogen je Code bisher: {cl.nCodesWithExactly1Submission} · 2+ Messungen:{" "}
                      {cl.nCodesWith2orMoreSubmissions} · 3+: {cl.nCodesWith3orMoreSubmissions}
                    </p>
                    {cl.nRowsByTimepoint.length >= 2 &&
                      (() => {
                        const t1n = cl.nRowsByTimepoint.find((x) => x.timepoint === "T1")?.nRows;
                        const t2n = cl.nRowsByTimepoint.find((x) => x.timepoint === "T2")?.nRows;
                        if (t1n == null || t2n == null) return null;
                        const plaus = t1n - t2n;
                        const ok = plaus === cl.nCodesT1withoutT2;
                        return (
                          <p className="mt-2 text-xs text-zinc-600">
                            Konsistenz: n(T1) − n(T2) = {plaus} (sollte «nur T1» = {cl.nCodesT1withoutT2} entsprechen).{" "}
                            <span className={ok ? "text-emerald-700" : "text-amber-800"}>
                              {ok ? "Stimmt." : "Weicht ab — Daten prüfen."}
                            </span>
                          </p>
                        );
                      })()}
                  </section>
                  )}

                  <section
                    className="rounded-xl border border-zinc-200 bg-white p-5"
                    aria-labelledby="legend-items-heading"
                  >
                    <h2 id="legend-items-heading" className="text-base font-semibold text-zinc-900">
                      Legende: Bedeutung von F1–F11
                    </h2>
                    <p className="mt-1 text-sm text-zinc-600">
                      <span className="font-medium">F#</span> = Frage # (Likert 1–5). Antwortkategorien wie im Fragebogen.
                    </p>
                    <ol className="mt-4 max-h-[min(28rem,50vh)] space-y-2 overflow-y-auto pr-1 text-sm text-zinc-800">
                      {EVALUATION_LIKERT_ITEM_TEXTS.map((text, idx) => (
                        <li key={idx} className="flex gap-3 border-b border-zinc-100 pb-2 last:border-0">
                          <span className="w-8 shrink-0 font-mono text-xs font-semibold text-zinc-500">F{idx + 1}</span>
                          <span className="min-w-0 flex-1 leading-relaxed">{text}</span>
                        </li>
                      ))}
                    </ol>
                    <p className="mt-3 text-xs text-zinc-500">
                      Subskalen: A = F1–F3, B = F4–F6, C = F7–F9, D = F10–F11
                    </p>
                  </section>

                  <section className="rounded-xl border border-zinc-200 bg-white p-5">
                    <h2 className="text-base font-semibold text-zinc-900">Detail: Kennzahlen pro Messzeitpunkt</h2>
                    <div className="mt-4 space-y-6">
                      {byTimepoint.map((b) => (
                        <div key={b.timepoint} className="border-b border-zinc-100 pb-6 last:border-0 last:pb-0">
                          <h3 className="text-sm font-semibold text-zinc-800">
                            {b.timepoint}{" "}
                            <span className="font-normal text-zinc-500">
                              · n (Analyse) = {b.nAnalyzed} · Roh vollst. = {b.nComplete} · Roh ges. = {b.nTotal}
                            </span>
                          </h3>
                          <div className="mt-3 grid gap-4 sm:grid-cols-2">
                            <div>
                              <p className="text-xs font-medium text-zinc-500">Subskalen (M, SD, α)</p>
                              <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-zinc-700">
                                {b.subscales.map((s) => (
                                  <li key={s.id}>
                                    {s.label}: M = {s.mean.toFixed(2).replace(".", ",")}, SD ={" "}
                                    {s.sd.toFixed(2).replace(".", ",")}
                                    {s.cronbachAlpha != null
                                      ? `, α = ${s.cronbachAlpha.toFixed(2).replace(".", ",")}`
                                      : ""}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-zinc-500">Mittlere Binnen-Varianz (über 11 Items)</p>
                              <p className="mt-1 text-sm text-zinc-700">
                                {b.responseVarianceMean.toFixed(2).replace(".", ",")} — höhere Werte: differenziertere
                                Antworten; sehr niedrig: ggf. Einheitlichkeit.
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-xl border border-amber-200/80 bg-amber-50/60 p-5 text-sm text-amber-950">
                    <h2 className="font-semibold text-amber-950">Hinweise zur statistischen Interpretation</h2>
                    <ul className="mt-2 list-inside list-disc space-y-1.5">
                      {notes.map((n, i) => (
                        <li key={i}>{n}</li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs text-amber-900/85">
                      Datenstand: {new Date(data.generatedAt).toLocaleString("de-CH")} · Zeilen in der DB: {data.nRows}{" "}
                      · ausgeschlossen (vollst., alle T): {nExcludedSubmissions}
                    </p>
                  </section>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
