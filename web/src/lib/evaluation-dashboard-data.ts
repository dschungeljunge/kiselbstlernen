import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { buildDashboardStats, type DashboardStatsPayload } from "@/lib/evaluation-statistics";

export type { DashboardStatsPayload };

type DashboardDataRow = {
  anon_code: string;
  timepoint: string;
  measurement_index: number | null;
  submitted_at: string | null;
  answers: Record<string, unknown>;
};

export type WorkshopSlice = {
  dateKey: string;
  label: string;
  nRows: number;
  stats: DashboardStatsPayload;
};

export type T3SummarySlice = {
  nRows: number;
  /** Frühestes und spätestes Einreichungsdatum (Europe/Zurich) */
  dateFrom: string | null;
  dateTo: string | null;
  stats: DashboardStatsPayload;
};

export type DashboardWithWorkshopsPayload = {
  overall: DashboardStatsPayload;
  /** T1/T2-Workshops, gruppiert nach Einreichungsdatum */
  workshops: WorkshopSlice[];
  /** T3 über alle individuellen Termine zusammengefasst */
  t3: T3SummarySlice | null;
};

function isWorkshopTimepoint(row: DashboardDataRow): boolean {
  if (row.measurement_index != null) return row.measurement_index <= 2;
  return row.timepoint === "T1" || row.timepoint === "T2";
}

function isT3Timepoint(row: DashboardDataRow): boolean {
  if (row.measurement_index != null) return row.measurement_index === 3;
  return row.timepoint === "T3";
}

const DAY_KEY_FORMAT = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Zurich",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const DAY_LABEL_FORMAT = new Intl.DateTimeFormat("de-CH", {
  timeZone: "Europe/Zurich",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function workshopDayKey(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return DAY_KEY_FORMAT.format(d);
}

function workshopDayLabel(dateKey: string): string {
  const d = new Date(`${dateKey}T12:00:00.000Z`);
  if (Number.isNaN(d.getTime())) return dateKey;
  return DAY_LABEL_FORMAT.format(d);
}

export async function getEvaluationDashboardPayload(): Promise<DashboardWithWorkshopsPayload> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("evaluation_responses")
    .select("anon_code, timepoint, answers, submitted_at, measurement_index")
    .order("timepoint", { ascending: true });

  if (error) {
    console.error("Dashboard fetch:", error);
    return { overall: buildDashboardStats([]), workshops: [], t3: null };
  }

  const rows =
    (data as {
      anon_code: string;
      timepoint: string;
      submitted_at?: string | null;
      measurement_index?: number | null;
      answers: Record<string, unknown>;
    }[])?.map(
      (r): DashboardDataRow => ({
        anon_code: r.anon_code,
        timepoint: r.timepoint,
        submitted_at: r.submitted_at ?? null,
        measurement_index: r.measurement_index ?? null,
        answers: r.answers || {},
      }),
    ) ?? [];

  const overall = buildDashboardStats(rows);

  const workshopRows = rows.filter(isWorkshopTimepoint);
  const t3Rows = rows.filter(isT3Timepoint);

  const byWorkshop = new Map<string, DashboardDataRow[]>();
  for (const row of workshopRows) {
    const key = workshopDayKey(row.submitted_at);
    if (!key) continue;
    if (!byWorkshop.has(key)) {
      byWorkshop.set(key, []);
    }
    byWorkshop.get(key)!.push(row);
  }

  const workshops: WorkshopSlice[] = Array.from(byWorkshop.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([dateKey, dayRows]) => ({
      dateKey,
      label: workshopDayLabel(dateKey),
      nRows: dayRows.length,
      stats: buildDashboardStats(dayRows),
    }));

  const t3DateKeys = t3Rows
    .map((r) => workshopDayKey(r.submitted_at))
    .filter((k): k is string => k != null)
    .sort((a, b) => a.localeCompare(b));

  const t3: T3SummarySlice | null =
    t3Rows.length > 0
      ? {
          nRows: t3Rows.length,
          dateFrom: t3DateKeys[0] ? workshopDayLabel(t3DateKeys[0]) : null,
          dateTo: t3DateKeys.at(-1) ? workshopDayLabel(t3DateKeys.at(-1)!) : null,
          stats: buildDashboardStats(t3Rows),
        }
      : null;

  return { overall, workshops, t3 };
}
