"use client";

import { useMemo, useState } from "react";
import { EvaluationDashboardClient } from "@/components/EvaluationDashboardClient";
import { cn } from "@/lib/cn";
import type { DashboardStatsPayload } from "@/lib/evaluation-statistics";
import type { T3SummarySlice, WorkshopSlice } from "@/lib/evaluation-dashboard-data";

type SliceContext = "overall" | "workshop" | "t3";

type DashboardSlice = {
  id: string;
  label: string;
  description: string;
  context: SliceContext;
  stats: DashboardStatsPayload;
};

type Props = {
  overall: DashboardStatsPayload;
  workshops: WorkshopSlice[];
  t3: T3SummarySlice | null;
};

function timepointCounts(stats: DashboardStatsPayload): string {
  return stats.codeLinkage.nRowsByTimepoint
    .map((r) => `${r.timepoint}: ${r.nRows}`)
    .join(" · ");
}

function buildSlices(overall: DashboardStatsPayload, workshops: WorkshopSlice[], t3: T3SummarySlice | null): DashboardSlice[] {
  const slices: DashboardSlice[] = [
    {
      id: "overall",
      label: "Gesamt",
      description: "Alle Messzeitpunkte und Gruppen",
      context: "overall",
      stats: overall,
    },
  ];

  for (const w of workshops) {
    slices.push({
      id: `workshop-${w.dateKey}`,
      label: w.label,
      description: `Workshop-Gruppe · ${w.nRows} Datensätze (T1/T2)`,
      context: "workshop",
      stats: w.stats,
    });
  }

  if (t3) {
    const range =
      t3.dateFrom && t3.dateTo
        ? t3.dateFrom === t3.dateTo
          ? t3.dateFrom
          : `${t3.dateFrom} – ${t3.dateTo}`
        : null;
    slices.push({
      id: "t3",
      label: "T3 Reflexion",
      description: range
        ? `${t3.nRows} Einreichungen · ${range}`
        : `${t3.nRows} Einreichungen über individuelle Termine`,
      context: "t3",
      stats: t3.stats,
    });
  }

  return slices;
}

export function EvaluationDashboardShell({ overall, workshops, t3 }: Props) {
  const slices = useMemo(() => buildSlices(overall, workshops, t3), [overall, workshops, t3]);
  const [activeId, setActiveId] = useState("overall");
  const active = slices.find((s) => s.id === activeId) ?? slices[0]!;

  return (
    <div className="space-y-6">
      <section aria-label="Auswertungsbereich wählen">
        <p className="text-sm font-medium text-zinc-900">Auswertung wählen</p>
        <p className="mt-0.5 text-sm text-zinc-600">
          T1/T2 pro Workshop-Gruppe, T3 zusammengefasst oder Gesamtübersicht — jeweils eine Detailansicht.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {slices.map((slice) => {
            const selected = slice.id === activeId;
            const tpSummary = timepointCounts(slice.stats);
            return (
              <button
                key={slice.id}
                type="button"
                onClick={() => setActiveId(slice.id)}
                aria-pressed={selected}
                className={cn(
                  "rounded-xl border px-4 py-3 text-left transition-colors",
                  selected
                    ? "border-zinc-900 bg-zinc-900 text-white shadow-sm"
                    : "border-zinc-200 bg-white text-zinc-900 hover:border-zinc-300 hover:bg-zinc-50",
                )}
              >
                <p className="text-sm font-semibold">{slice.label}</p>
                <p className={cn("mt-1 text-xs leading-relaxed", selected ? "text-zinc-300" : "text-zinc-600")}>
                  {slice.description}
                </p>
                {tpSummary && (
                  <p
                    className={cn(
                      "mt-2 text-xs tabular-nums",
                      selected ? "text-zinc-400" : "text-zinc-500",
                    )}
                  >
                    {tpSummary}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <EvaluationDashboardClient data={active.stats} context={active.context} title={active.label} />
    </div>
  );
}
