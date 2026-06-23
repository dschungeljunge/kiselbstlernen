"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { EvaluationDashboardClient } from "@/components/EvaluationDashboardClient";
import {
  resolveSliceIdFromGruppe,
  type DashboardViewMode,
} from "@/lib/evaluation-dashboard-presentation";
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
      description: `Workshop-Gruppe · ${w.nRows} Datensätze`,
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
        ? `${t3.nRows} Einreichungen · individuelle Zeitpunkte, ${range}`
        : `${t3.nRows} Einreichungen · individuelle Zeitpunkte im Frühling/Sommer`,
      context: "t3",
      stats: t3.stats,
    });
  }

  return slices;
}

function resolveInitialSliceId(slices: DashboardSlice[], gruppe: string | null, modus: string | null): string {
  const fromUrl = resolveSliceIdFromGruppe(slices, gruppe);
  if (fromUrl) return fromUrl;
  if (modus === "experten") return "overall";
  const firstWorkshop = slices.find((s) => s.context === "workshop");
  if (firstWorkshop) return firstWorkshop.id;
  return "overall";
}

function parseViewMode(modus: string | null): DashboardViewMode {
  return modus === "experten" ? "experten" : "diskussion";
}

export function EvaluationDashboardShell({ overall, workshops, t3 }: Props) {
  const searchParams = useSearchParams();
  const slices = useMemo(() => buildSlices(overall, workshops, t3), [overall, workshops, t3]);

  const gruppe = searchParams.get("gruppe");
  const modus = searchParams.get("modus");
  const praesentation = searchParams.get("praesentation") === "1";

  const [activeId, setActiveId] = useState(() => resolveInitialSliceId(slices, gruppe, modus));

  useEffect(() => {
    const next = resolveInitialSliceId(slices, gruppe, modus);
    setActiveId(next);
  }, [slices, gruppe, modus]);

  const active = slices.find((s) => s.id === activeId) ?? slices[0]!;
  const viewMode = parseViewMode(modus);

  return (
    <div className="space-y-6">
      <section aria-label="Auswertungsbereich wählen" className="print:hidden">
        <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-900">Auswertung</p>
            <p className="mt-0.5 text-xs text-zinc-600">{active.description}</p>
          </div>
          <select
            value={activeId}
            onChange={(event) => setActiveId(event.target.value)}
            className="min-w-0 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm sm:min-w-64"
            aria-label="Auswertung wählen"
          >
            {slices.map((slice) => (
              <option key={slice.id} value={slice.id}>
                {slice.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <EvaluationDashboardClient
        data={active.stats}
        context={active.context}
        title={active.label}
        initialViewMode={viewMode}
        initialPresentation={praesentation}
      />
    </div>
  );
}
