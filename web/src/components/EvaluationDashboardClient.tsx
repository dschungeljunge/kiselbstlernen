"use client";

import { useId, useState } from "react";
import { EVALUATION_LIKERT_ITEM_TEXTS, LIKERT_ANSWER_SHORT } from "@/lib/evaluation-likert-labels";
import {
  changeAssessment,
  comparisonTimepoints,
  DISCUSSION_INTRO,
  DISCUSSION_QUESTIONS,
  formatDelta,
  itemFullText,
  SUBSCALE_INFO,
  timepointLabel,
  type DashboardViewMode,
} from "@/lib/evaluation-dashboard-presentation";
import { cn } from "@/lib/cn";
import type { DashboardStatsPayload, ExclusionFlag } from "@/lib/evaluation-statistics";
import {
  DistributionCharts,
  ItemBarChart,
  SubscaleLineChart,
} from "@/components/EvaluationDashboardCharts";

const EXPERT_TABS = [
  { id: "ergebnisse" as const, label: "Ergebnisse" },
  { id: "verteilungen" as const, label: "Verteilungen" },
  { id: "methodik" as const, label: "Methodik & Details" },
];

type ExpertTabId = (typeof EXPERT_TABS)[number]["id"];

type DashboardContext = "overall" | "workshop" | "t3";

type Props = {
  data: DashboardStatsPayload;
  context?: DashboardContext;
  title?: string;
  initialViewMode?: DashboardViewMode;
  initialPresentation?: boolean;
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

function SectionHeading({
  id,
  title,
  subtitle,
  presentation,
}: {
  id?: string;
  title: string;
  subtitle?: string;
  presentation?: boolean;
}) {
  return (
    <div>
      <h2
        id={id}
        className={cn(
          "font-semibold text-zinc-900",
          presentation ? "text-xl sm:text-2xl" : "text-base",
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={cn("mt-1 text-zinc-600", presentation ? "text-base" : "text-sm")}>{subtitle}</p>
      )}
    </div>
  );
}

function formatMean(n: number): string {
  return n.toFixed(2).replace(".", ",");
}

export function EvaluationDashboardClient({
  data,
  context = "overall",
  title,
  initialViewMode = "diskussion",
  initialPresentation = false,
}: Props) {
  const [viewMode, setViewMode] = useState<DashboardViewMode>(initialViewMode);
  const presentation = initialPresentation;
  const [expertTab, setExpertTab] = useState<ExpertTabId>("ergebnisse");
  const tabListId = useId();

  const {
    timepoints,
    byTimepoint,
    paired,
    notes,
    filter,
    nExcludedSubmissions,
    codeLinkage: cl,
    t1T2CompletersCohort: cohortT1T2,
  } = data;

  const t1Row = cl.nRowsByTimepoint.find((x) => x.timepoint === "T1");
  const shareT1T2Pct =
    t1Row?.nRows != null && t1Row.nRows > 0
      ? (cl.shareT1WithFollowupT2 * 100).toFixed(1).replace(".", ",")
      : null;

  const showLinkage = context !== "t3";
  const t3Block = byTimepoint.find((b) => b.timepoint === "T3");
  const t1Block = byTimepoint.find((b) => b.timepoint === "T1");
  const mainPaired = paired.find((p) => p.from === "T1" && p.to === "T2") ?? paired[0];
  const comparison = comparisonTimepoints(timepoints);
  const itemSummaryRows = data.itemChart
    .map((row) => {
      const itemNum = Number(row.item.replace(/^F/, ""));
      const fromVal = comparison ? row.byTp[comparison.from] ?? 0 : 0;
      const toVal = comparison ? row.byTp[comparison.to] ?? 0 : 0;
      return {
        item: row.item,
        itemNum,
        text: itemFullText(itemNum),
        fromVal,
        toVal,
        delta: toVal - fromVal,
      };
    })
    .filter((row) => Number.isFinite(row.itemNum) && row.itemNum > 0);

  const chartSize = presentation ? "presentation" : "default";

  const viewToggle = (
    <div className="flex flex-wrap items-center gap-2 print:hidden">
      <div className="inline-flex rounded-lg border border-zinc-200 bg-zinc-50 p-0.5">
        <button
          type="button"
          onClick={() => setViewMode("diskussion")}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            viewMode === "diskussion" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900",
          )}
        >
          Diskussion
        </button>
        <button
          type="button"
          onClick={() => setViewMode("experten")}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            viewMode === "experten" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900",
          )}
        >
          Experten
        </button>
      </div>
    </div>
  );

  const discussionKpis = (
    <dl className="mt-4 grid gap-3 sm:grid-cols-3">
      {t1Block && (
        <div className="rounded-lg border border-zinc-100 bg-zinc-50/80 px-4 py-3">
          <dt className="text-xs font-medium text-zinc-500">{timepointLabel("T1")}</dt>
          <dd className={cn("mt-1 font-semibold tabular-nums text-zinc-900", presentation ? "text-3xl" : "text-2xl")}>
            {t1Block.nAnalyzed}
          </dd>
          <dd className="mt-0.5 text-xs text-zinc-600">Teilnehmende in der Auswertung</dd>
        </div>
      )}
      {showLinkage && shareT1T2Pct != null && (
        <div className="rounded-lg border border-zinc-100 bg-zinc-50/80 px-4 py-3">
          <dt className="text-xs font-medium text-zinc-500">Rücklauf T1 → T2</dt>
          <dd className={cn("mt-1 font-semibold tabular-nums text-zinc-900", presentation ? "text-3xl" : "text-2xl")}>
            {shareT1T2Pct} %
          </dd>
          <dd className="mt-0.5 text-xs text-zinc-600">Dieselben Personen bei beiden Befragungen</dd>
        </div>
      )}
      {mainPaired?.meanDiff != null && (
        <div className="rounded-lg border border-zinc-100 bg-zinc-50/80 px-4 py-3">
          <dt className="text-xs font-medium text-zinc-500">Veränderung Gesamtskala</dt>
          <dd
            className={cn(
              "mt-1 font-semibold tabular-nums",
              mainPaired.meanDiff > 0 ? "text-emerald-700" : mainPaired.meanDiff < 0 ? "text-red-700" : "text-zinc-900",
              presentation ? "text-3xl" : "text-2xl",
            )}
          >
            {formatDelta(mainPaired.meanDiff)} Pkt.
          </dd>
          <dd className="mt-0.5 text-xs text-zinc-600">
            {changeAssessment(mainPaired.meanDiff, mainPaired.cohenDz)}
            {mainPaired.nPaired > 0 ? ` · n = ${mainPaired.nPaired}` : ""}
          </dd>
        </div>
      )}
      {context === "t3" && t3Block && !t1Block && (
        <div className="rounded-lg border border-zinc-100 bg-zinc-50/80 px-4 py-3">
          <dt className="text-xs font-medium text-zinc-500">T3 in Auswertung</dt>
          <dd className={cn("mt-1 font-semibold tabular-nums text-zinc-900", presentation ? "text-3xl" : "text-2xl")}>
            {t3Block.nAnalyzed}
          </dd>
          <dd className="mt-0.5 text-xs text-zinc-600">
            M = {t3Block.totalScoreMean.toFixed(2).replace(".", ",")} (Summe 11–55)
          </dd>
        </div>
      )}
    </dl>
  );

  const expertKpis = (
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
            <dd className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900">
              {shareT1T2Pct != null ? `${shareT1T2Pct} %` : "—"}
            </dd>
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
  );

  const timepointCards = (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {byTimepoint.map((b) => (
        <div key={b.timepoint} className="rounded-lg border border-zinc-200 bg-zinc-50/40 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            {timepointLabel(b.timepoint)}
          </p>
          <p className={cn("mt-2 font-semibold tabular-nums text-zinc-900", presentation ? "text-4xl" : "text-3xl")}>
            {b.nAnalyzed}
          </p>
          <p className="text-sm text-zinc-600">in Auswertung (nach Filter)</p>
          {viewMode === "experten" && (
            <>
              <p className="mt-3 border-t border-zinc-200/80 pt-3 text-xs text-zinc-600">
                Roh vollständig: <span className="tabular-nums font-medium text-zinc-800">{b.nComplete}</span>
                {" · "}
                ausgeschlossen: <span className="tabular-nums font-medium text-zinc-800">{b.nExcluded}</span>
              </p>
              {b.nExcluded > 0 && (
                <p className="mt-2 text-xs leading-relaxed text-amber-900/90">
                  {(
                    (["too_fast", "low_variance", "long_streak"] as const)
                      .filter((k) => b.exclusionByFlag[k]! > 0)
                      .map((k) => `${EXCLUSION_FLAG_LABEL[k as ExclusionFlag]}: ${b.exclusionByFlag[k]}`)
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
                  , SD <span className="tabular-nums">{b.totalScoreSd.toFixed(2).replace(".", ",")}</span>, α{" "}
                  <span className="tabular-nums">
                    {b.fullScaleCronbachAlpha == null
                      ? "—"
                      : b.fullScaleCronbachAlpha.toFixed(2).replace(".", ",")}
                  </span>
                </p>
              </div>
            </>
          )}
          {viewMode === "diskussion" && (
            <p className="mt-3 border-t border-zinc-200/80 pt-3 text-xs text-zinc-600">
              Durchschnitt Gesamtskala:{" "}
              <span className="font-medium tabular-nums text-zinc-800">
                {b.totalScoreMean.toFixed(1).replace(".", ",")} / 55
              </span>
            </p>
          )}
        </div>
      ))}
    </div>
  );

  const pairedTableSimplified = (
    <div className="overflow-x-auto rounded-lg border border-zinc-100">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-600">
            <th className="px-4 py-3 font-medium">Vergleich</th>
            <th className="px-4 py-3 font-medium">n</th>
            <th className="px-4 py-3 font-medium">Veränderung (Summe)</th>
            <th className="px-4 py-3 font-medium">Einschätzung</th>
          </tr>
        </thead>
        <tbody>
          {paired.map((p) => (
            <tr key={p.from + p.to + p.label} className="border-b border-zinc-100 last:border-0">
              <td className="px-4 py-3 font-medium text-zinc-800">
                {timepointLabel(p.from)} → {timepointLabel(p.to)}
              </td>
              <td className="px-4 py-3 tabular-nums text-zinc-700">{p.nPaired}</td>
              <td className="px-4 py-3 tabular-nums text-zinc-700">
                {p.meanDiff == null ? "—" : formatDelta(p.meanDiff)}
              </td>
              <td className="px-4 py-3 text-zinc-700">{changeAssessment(p.meanDiff, p.cohenDz)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const pairedTableExpert = (
    <div className="overflow-x-auto rounded-lg border border-zinc-100">
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
  );

  const methodologyContent = (
  <div className="space-y-8">
    <section className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-5">
      <h2 className="text-base font-semibold text-zinc-900">Datenfilter (Ausreisser &amp; Muster)</h2>
      <p className="mt-2 text-sm leading-relaxed text-zinc-700">
        In den Kennzahlen und Grafiken sind nur vollständige Bogen berücksichtigt, die die Kriterien erfüllen.
      </p>
      <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm text-zinc-800">
        <li>
          Mindestdauer (nur mit erfasster Zeit): <span className="font-medium">≥{filter.minDurationSec}s</span>
        </li>
        <li>
          Binnen-Varianz unter <span className="font-medium">{filter.minResponseVariance}</span> = kaum Unterschiede
        </li>
        <li>
          Muster: identische Werte in mindestens{" "}
          <span className="font-medium">{filter.minStreakToFlag}</span> Fragen in Folge
        </li>
      </ul>
      <p className="mt-3 text-sm text-zinc-700">
        Gesamt ausgeschlossen: <span className="font-semibold">{nExcludedSubmissions}</span>
      </p>
      <div className="mt-4 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800">
        <p className="font-semibold text-zinc-900">T1- und T2-Mittelwerte</p>
        <p className="mt-1 text-zinc-700">
          Für T1 und T2 zählen nur Personen mit demselben Anonym-Code bei beiden Messungen — aktuell{" "}
          <span className="font-semibold tabular-nums">{cohortT1T2.nAnonCodes}</span>. T3+ ohne diese
          Einschränkung.
        </p>
      </div>
    </section>

    {showLinkage && (
      <section className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-5">
        <h2 className="text-base font-semibold text-zinc-900">Längsschnitt: gleicher Anonym-Code (T1 ↔ T2)</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-700">
          T2 wird nur erfasst, wenn dieselbe Person denselben Code wie bei T1 verwendet.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3">
            <p className="text-xs text-zinc-500">Eindeutige Codes</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900">{cl.nUniqueCodes}</p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3">
            <p className="text-xs text-zinc-500">Codes mit T1 und T2</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900">{cl.nCodesWithT1andT2}</p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3">
            <p className="text-xs text-zinc-500">Nur T1, kein T2</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900">{cl.nCodesT1withoutT2}</p>
          </div>
        </div>
      </section>
    )}

    <section className="rounded-xl border border-zinc-200 bg-white p-5" aria-labelledby="legend-items-heading">
      <h2 id="legend-items-heading" className="text-base font-semibold text-zinc-900">
        Legende: Fragen F1–F11
      </h2>
      <ol className="mt-4 max-h-[min(28rem,50vh)] space-y-2 overflow-y-auto pr-1 text-sm text-zinc-800">
        {EVALUATION_LIKERT_ITEM_TEXTS.map((text, idx) => (
          <li key={idx} className="flex gap-3 border-b border-zinc-100 pb-2 last:border-0">
            <span className="w-8 shrink-0 font-mono text-xs font-semibold text-zinc-500">F{idx + 1}</span>
            <span className="min-w-0 flex-1 leading-relaxed">{text}</span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-zinc-500">
        Skala: {LIKERT_ANSWER_SHORT.map((l, i) => `${i + 1} = ${l}`).join(" · ")}
      </p>
    </section>

    <section className="rounded-xl border border-amber-200/80 bg-amber-50/60 p-5 text-sm text-amber-950">
      <h2 className="font-semibold text-amber-950">Hinweise zur Interpretation</h2>
      <ul className="mt-2 list-inside list-disc space-y-1.5">
        {notes.map((n, i) => (
          <li key={i}>{n}</li>
        ))}
      </ul>
    </section>
  </div>
  );

  const discussionView = (
    <div className="space-y-8">
      <section className="rounded-xl border border-yellow-200/80 bg-yellow-50/50 p-5">
        <p className={cn("leading-relaxed text-zinc-800", presentation ? "text-base" : "text-sm")}>
          {DISCUSSION_INTRO}
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {DISCUSSION_QUESTIONS.map((q) => (
            <p key={q} className="rounded-lg bg-white/70 px-3 py-2 text-sm text-zinc-800">
              {q}
            </p>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <SectionHeading
          title="1. Entwicklung der vier Bereiche"
          subtitle="Mittelwert je Bereich auf der Skala 1–5. T2 bedeutet: direkt nach dem Workshop."
          presentation={presentation}
        />
        <div className="mt-5">
          <SubscaleLineChart data={data} size={chartSize} showDeltaTable />
        </div>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <SectionHeading
          title="2. Alle Fragen vollständig beschriftet"
          subtitle={
            comparison
              ? `${timepointLabel(comparison.from)} im Vergleich zu ${timepointLabel(comparison.to)}.`
              : "Mittelwerte pro Frage."
          }
          presentation={presentation}
        />
        <div className="mt-5 overflow-hidden rounded-lg border border-zinc-100">
          <div className="grid grid-cols-[minmax(0,1fr)_6rem_6rem_5rem] gap-3 border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-xs font-medium text-zinc-600">
            <span>Frage</span>
            <span className="text-right">{comparison ? timepointLabel(comparison.from) : "Start"}</span>
            <span className="text-right">{comparison ? timepointLabel(comparison.to) : "Ende"}</span>
            <span className="text-right">Δ</span>
          </div>
          <div className="divide-y divide-zinc-100">
            {itemSummaryRows.map((row) => (
              <div
                key={row.item}
                className="grid grid-cols-[minmax(0,1fr)_6rem_6rem_5rem] gap-3 px-4 py-3 text-sm"
              >
                <div className="min-w-0">
                  <span className="mr-2 font-mono text-xs font-semibold text-zinc-500">{row.item}</span>
                  <span className="text-zinc-900">{row.text}</span>
                </div>
                <span className="text-right tabular-nums text-zinc-700">{formatMean(row.fromVal)}</span>
                <span className="text-right tabular-nums text-zinc-700">{formatMean(row.toVal)}</span>
                <span
                  className={cn(
                    "text-right tabular-nums font-medium",
                    row.delta > 0.05 ? "text-emerald-700" : row.delta < -0.05 ? "text-red-700" : "text-zinc-600",
                  )}
                >
                  {formatDelta(row.delta)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {paired.length > 0 && (
        <details className="rounded-xl border border-zinc-200 bg-white p-5">
          <summary className="cursor-pointer text-base font-semibold text-zinc-900">
            Ergänzend: Veränderung Gesamtskala
          </summary>
          <div className="mt-4">{pairedTableSimplified}</div>
        </details>
      )}

      <details className="rounded-xl border border-zinc-200 bg-white p-5 print:hidden">
        <summary className="cursor-pointer text-base font-semibold text-zinc-900">
          Methodik und Datenqualität
        </summary>
        <div className="mt-6">{methodologyContent}</div>
      </details>
    </div>
  );

  const expertErgebnisse = (
    <div className="space-y-10">
      <p className="text-sm text-zinc-600">
        Kennzahlen, Grafiken und gepaarte Tests. Fragetexte unter «Methodik &amp; Details».
      </p>
      {timepointCards}
      <section>
        <h2 className="text-base font-semibold text-zinc-900">Gepaarte Auswertungen (Gesamtskala 11–55)</h2>
        <p className="mt-1 text-sm text-zinc-600">Gepaarter t-Test; Cohen d (gepaart).</p>
        <div className="mt-4">{pairedTableExpert}</div>
      </section>
      <section className="rounded-xl border border-zinc-100 bg-zinc-50/30 p-5">
        <h2 className="text-base font-semibold text-zinc-900">Mittelwerte pro Item (Likert 1–5)</h2>
        <p className="mt-1 text-sm text-zinc-600">Gefilterte Stichprobe nach Messzeitpunkt.</p>
        <div className="mt-5">
          <ItemBarChart data={data} size={chartSize} />
        </div>
      </section>
      <section className="rounded-xl border border-zinc-100 bg-zinc-50/30 p-5">
        <h2 className="text-base font-semibold text-zinc-900">Subskala-Mittelwerte über Messzeitpunkte</h2>
        <div className="mt-5">
          <SubscaleLineChart data={data} size={chartSize} />
        </div>
      </section>
    </div>
  );

  return (
    <div
      className={cn(
        "space-y-6",
        presentation && "dashboard-presentation",
      )}
    >
      <section
        className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
        aria-label="Kernkennzahlen"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className={cn("font-semibold text-zinc-900", presentation ? "text-xl" : "text-sm")}>
              {title ? `${title} — Auf einen Blick` : "Auf einen Blick"}
            </h2>
            <p className="mt-0.5 text-xs text-zinc-500">
              Stand: {new Date(data.generatedAt).toLocaleString("de-CH")}
            </p>
          </div>
          {viewToggle}
        </div>
        {viewMode === "diskussion" ? discussionKpis : expertKpis}
      </section>

      {viewMode === "diskussion" ? (
        discussionView
      ) : (
        <div>
          <div className="border-b border-zinc-200">
            <nav
              id={tabListId}
              className="-mb-px flex flex-wrap gap-1 print:hidden"
              role="tablist"
              aria-label="Dashboard-Bereiche"
            >
              {EXPERT_TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={expertTab === t.id}
                  onClick={() => setExpertTab(t.id)}
                  className={cn(
                    "rounded-t-md px-4 py-2.5 text-sm font-medium transition-colors",
                    expertTab === t.id
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
            {expertTab === "ergebnisse" && expertErgebnisse}
            {expertTab === "verteilungen" && (
              <section>
                <h2 className="text-base font-semibold text-zinc-900">Anteile der Skalenstufen 1–5 pro Item</h2>
                <div className="mt-5">
                  <DistributionCharts data={data} size={chartSize} />
                </div>
              </section>
            )}
            {expertTab === "methodik" && methodologyContent}
          </div>
        </div>
      )}
    </div>
  );
}
