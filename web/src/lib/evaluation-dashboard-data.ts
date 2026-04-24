import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { buildDashboardStats, type DashboardStatsPayload } from "@/lib/evaluation-statistics";

export type { DashboardStatsPayload };

export async function getEvaluationDashboardPayload(): Promise<DashboardStatsPayload> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("evaluation_responses")
    .select("anon_code, timepoint, answers, submitted_at, measurement_index")
    .order("timepoint", { ascending: true });

  if (error) {
    console.error("Dashboard fetch:", error);
    return buildDashboardStats([]);
  }

  const rows =
    (data as {
      anon_code: string;
      timepoint: string;
      measurement_index?: number | null;
      answers: Record<string, unknown>;
    }[])?.map((r) => ({
      anon_code: r.anon_code,
      timepoint: r.timepoint,
      measurement_index: r.measurement_index ?? null,
      answers: r.answers || {},
    })) ?? [];

  return buildDashboardStats(rows);
}
