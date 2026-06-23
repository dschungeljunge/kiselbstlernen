"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { LIKERT_ANSWER_SHORT } from "@/lib/evaluation-likert-labels";
import {
  itemFullText,
  itemShortLabel,
  parseItemNum,
  subscaleDeltas,
  timepointLabel,
  type SubscaleDelta,
} from "@/lib/evaluation-dashboard-presentation";
import { SUBSCALES } from "@/lib/evaluation-statistics";
import type { DashboardStatsPayload, TimepointItemDistributions } from "@/lib/evaluation-statistics";
import { cn } from "@/lib/cn";

const COLORS = ["#ca8a04", "#3f3f46", "#16a34a", "#2563eb", "#9333ea", "#db2777"];
const LIKERT_STACK_COLORS = ["#b91c1c", "#f97316", "#ca8a04", "#22c55e", "#15803d"] as const;
const DIST_KEYS = ["v1", "v2", "v3", "v4", "v5"] as const;

const Y_AXIS_LABEL_STYLE = { fontSize: 11, fill: "#52525b" };

function formatMean(v: unknown): string {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n.toFixed(2).replace(".", ",") : "—";
}

type ItemBarRow = Record<string, string | number> & {
  name: string;
  itemNum: number;
  shortLabel: string;
};

function buildItemBarData(
  itemChart: DashboardStatsPayload["itemChart"],
  timepoints: string[],
  labelLength: number,
): ItemBarRow[] {
  return itemChart.map((row) => {
    const itemNum = parseItemNum(row.item);
    const o: ItemBarRow = {
      name: row.item,
      itemNum,
      shortLabel: itemNum > 0 ? itemShortLabel(itemNum, labelLength) : row.item,
    };
    for (const tp of timepoints) {
      o[tp] = row.byTp[tp] ?? 0;
    }
    return o;
  });
}

type ItemTooltipProps = {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: readonly any[];
  label?: string;
  itemBarData: ItemBarRow[];
  nByTimepoint: Record<string, number>;
};

function ItemBarTooltip({ active, payload, label, itemBarData, nByTimepoint }: ItemTooltipProps) {
  if (!active || !payload?.length) return null;
  const row = itemBarData.find((r) => r.name === label);
  const itemNum = row?.itemNum ?? parseItemNum(String(label ?? ""));
  return (
    <div className="max-w-sm rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs shadow-md">
      <p className="font-semibold text-zinc-900">
        {row?.name ?? label} — {itemNum > 0 ? itemFullText(itemNum) : label}
      </p>
      <ul className="mt-2 space-y-1 text-zinc-800">
        {payload.map((p) => {
          const tp = String(p.dataKey ?? "");
          const n = nByTimepoint[tp];
          const val = typeof p.value === "number" ? p.value : Number(p.value);
          return (
            <li key={tp} className="flex justify-between gap-4">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
                {timepointLabel(tp)}
              </span>
              <span className="tabular-nums">
                M = {formatMean(val)}
                {n != null ? ` · n = ${n}` : ""}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
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
    <div className="max-w-sm rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs shadow-md">
      <p className="font-semibold text-zinc-900">F{nItem}</p>
      <p className="mt-0.5 text-zinc-600">{itemFullText(nItem)}</p>
      <p className="mt-1 text-zinc-500">n = {total}</p>
      <ul className="mt-2 space-y-1 text-zinc-800">
        {([1, 2, 3, 4, 5] as const).map((k) => {
          const c = it.counts[k - 1] ?? 0;
          const pct = total > 0 ? (c / total) * 100 : 0;
          return (
            <li key={k} className="flex justify-between gap-4">
              <span>
                {k}: {LIKERT_ANSWER_SHORT[k - 1]}
              </span>
              <span className="tabular-nums">
                {c} ({pct.toFixed(1).replace(".", ",")}%)
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function toDistributionChartRows(block: TimepointItemDistributions, itemFilter?: number[]) {
  const items =
    itemFilter != null ? block.items.filter((it) => itemFilter.includes(it.item)) : block.items;
  return items.map((it) => ({
    name: `F${it.item}`,
    itemNum: it.item,
    shortLabel: itemShortLabel(it.item, 28),
    v1: it.counts[0]!,
    v2: it.counts[1]!,
    v3: it.counts[2]!,
    v4: it.counts[3]!,
    v5: it.counts[4]!,
  }));
}

type ChartSize = "default" | "presentation";

function chartHeight(size: ChartSize, defaultCls: string, presentationCls: string): string {
  return size === "presentation" ? presentationCls : defaultCls;
}

type ItemBarChartProps = {
  data: DashboardStatsPayload;
  size?: ChartSize;
  itemFilter?: number[];
};

export function ItemBarChart({ data, size = "default", itemFilter }: ItemBarChartProps) {
  const { itemChart, timepoints, byTimepoint } = data;
  const nByTimepoint = Object.fromEntries(byTimepoint.map((b) => [b.timepoint, b.nAnalyzed]));
  let itemBarData = buildItemBarData(itemChart, timepoints, size === "presentation" ? 78 : 64);
  if (itemFilter?.length) {
    itemBarData = itemBarData.filter((r) => itemFilter.includes(r.itemNum));
  }

  return (
    <div
      className={chartHeight(
        size,
        "h-[min(36rem,62vh)] min-h-[22rem] w-full sm:h-[620px]",
        "h-[min(40rem,70vh)] min-h-[24rem] w-full sm:h-[680px]",
      )}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={itemBarData} margin={{ top: 12, right: 12, left: 4, bottom: 132 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: size === "presentation" ? 11 : 10 }}
            interval={0}
            angle={-32}
            textAnchor="end"
            height={140}
            tickFormatter={(v) => {
              const row = itemBarData.find((r) => r.name === v);
              return row?.shortLabel ?? String(v);
            }}
          />
          <YAxis domain={[1, 5]} tickCount={5} width={36} tick={{ fontSize: 11 }}>
            <Label
              value="Mittelwert (Skala 1–5)"
              angle={-90}
              position="insideLeft"
              style={Y_AXIS_LABEL_STYLE}
              offset={8}
            />
          </YAxis>
          <Tooltip
            content={(tip) => (
              <ItemBarTooltip
                active={tip.active}
                payload={tip.payload}
                label={tip.label != null ? String(tip.label) : undefined}
                itemBarData={itemBarData}
                nByTimepoint={nByTimepoint}
              />
            )}
          />
          <Legend
            formatter={(value) => timepointLabel(String(value))}
            wrapperStyle={{ fontSize: size === "presentation" ? 13 : 12, paddingTop: 8 }}
          />
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
  );
}

type SubscaleLineChartProps = {
  data: DashboardStatsPayload;
  size?: ChartSize;
  showDeltaTable?: boolean;
};

export function SubscaleLineChart({ data, size = "default", showDeltaTable = true }: SubscaleLineChartProps) {
  const { timepoints, subscaleChart } = data;
  const subLineData = timepoints.map((tp) => {
    const o: Record<string, string | number> = { timepoint: tp, timepointLabel: timepointLabel(tp) };
    for (const sc of subscaleChart) {
      o[sc.key] = sc.byTp[tp] ?? 0;
    }
    return o;
  });
  const deltas = subscaleDeltas(subscaleChart, timepoints);

  return (
    <div className="space-y-4">
      <div
        className={chartHeight(
          size,
          "h-[min(22rem,45vh)] min-h-[14rem] w-full sm:h-80",
          "h-[min(26rem,50vh)] min-h-[16rem] w-full sm:h-96",
        )}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={subLineData} margin={{ top: 12, right: 12, left: 4, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200" />
            <XAxis dataKey="timepointLabel" tick={{ fontSize: size === "presentation" ? 12 : 11 }} />
            <YAxis domain={[3, 5]} tickCount={3} width={36} tick={{ fontSize: 11 }}>
              <Label
                value="Mittelwert (Skala 3–5)"
                angle={-90}
                position="insideLeft"
                style={Y_AXIS_LABEL_STYLE}
                offset={8}
              />
            </YAxis>
            <Tooltip
              formatter={(v, name) => {
                const sc = subscaleChart.find((s) => s.key === name);
                return [formatMean(v), sc?.label ?? String(name)];
              }}
              labelFormatter={(_, payload) => {
                const p = payload?.[0]?.payload as { timepoint?: string } | undefined;
                return p?.timepoint ? timepointLabel(p.timepoint) : "";
              }}
            />
            <Legend wrapperStyle={{ fontSize: size === "presentation" ? 13 : 12 }} />
            {subscaleChart.map((sc, i) => (
              <Line
                key={sc.key}
                type="monotone"
                dataKey={sc.key}
                name={`${sc.label} (${SUBSCALES.find((s) => s.id === sc.key)?.itemIndices.map((n) => `F${n}`).join(", ") ?? sc.key})`}
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={2}
                dot={{ r: size === "presentation" ? 5 : 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {showDeltaTable && deltas.length > 0 && <SubscaleDeltaTable deltas={deltas} timepoints={timepoints} />}
    </div>
  );
}

function SubscaleDeltaTable({
  deltas,
  timepoints,
}: {
  deltas: SubscaleDelta[];
  timepoints: string[];
}) {
  const cmp = timepoints.includes("T1") && timepoints.includes("T2")
    ? { from: "T1", to: "T2" }
    : timepoints.length >= 2
      ? { from: timepoints[0]!, to: timepoints[timepoints.length - 1]! }
      : null;
  if (!cmp) return null;

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-100 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-600">
            <th className="px-3 py-2 font-medium">Bereich</th>
            <th className="px-3 py-2 font-medium">Items</th>
            <th className="px-3 py-2 font-medium">{timepointLabel(cmp.from)}</th>
            <th className="px-3 py-2 font-medium">{timepointLabel(cmp.to)}</th>
            <th className="px-3 py-2 font-medium">Veränderung</th>
          </tr>
        </thead>
        <tbody>
          {deltas.map((d) => (
            <tr key={d.id} className="border-b border-zinc-100 last:border-0">
              <td className="px-3 py-2 font-medium text-zinc-800">{d.label}</td>
              <td className="px-3 py-2 text-xs text-zinc-500">{d.itemRange}</td>
              <td className="px-3 py-2 tabular-nums text-zinc-700">{d.fromVal.toFixed(2).replace(".", ",")}</td>
              <td className="px-3 py-2 tabular-nums text-zinc-700">{d.toVal.toFixed(2).replace(".", ",")}</td>
              <td
                className={cn(
                  "px-3 py-2 tabular-nums font-medium",
                  d.delta > 0.05 ? "text-emerald-700" : d.delta < -0.05 ? "text-red-700" : "text-zinc-600",
                )}
              >
                {d.delta > 0 ? "+" : ""}
                {d.delta.toFixed(2).replace(".", ",")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type DistributionChartsProps = {
  data: DashboardStatsPayload;
  size?: ChartSize;
  /** Wenn gesetzt: nur diese Items; sonst alle */
  itemFilter?: number[];
  /** Nur einen Messzeitpunkt zeigen */
  timepointFilter?: string;
};

export function DistributionCharts({
  data,
  size = "default",
  itemFilter,
  timepointFilter,
}: DistributionChartsProps) {
  const blocks = timepointFilter
    ? data.itemDistributions.filter((b) => b.timepoint === timepointFilter)
    : data.itemDistributions;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-zinc-600">
        {([1, 2, 3, 4, 5] as const).map((k) => (
          <span key={k} className="inline-flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: LIKERT_STACK_COLORS[k - 1] }}
              aria-hidden
            />
            {k}: {LIKERT_ANSWER_SHORT[k - 1]}
          </span>
        ))}
      </div>

      {blocks.map((block) => {
        const rowData = toDistributionChartRows(block, itemFilter);
        return (
          <div key={block.timepoint}>
            <h3 className="text-sm font-semibold text-zinc-800">
              {timepointLabel(block.timepoint)}{" "}
              <span className="font-normal text-zinc-500">· n = {block.nAnalyzed}</span>
            </h3>
            {block.nAnalyzed === 0 ? (
              <p className="mt-2 text-sm text-zinc-500">Keine Fälle in der Auswertungsstichprobe.</p>
            ) : (
              <div
                className={chartHeight(
                  size,
                  "mt-4 h-[min(28rem,65vh)] min-h-[16rem] w-full",
                  "mt-4 h-[min(32rem,70vh)] min-h-[20rem] w-full",
                )}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rowData} margin={{ top: 8, right: 8, left: 8, bottom: 56 }} stackOffset="expand">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 9 }}
                      interval={0}
                      angle={-32}
                      textAnchor="end"
                      height={64}
                      tickFormatter={(v) => {
                        const row = rowData.find((r) => r.name === v);
                        return row?.shortLabel ?? String(v);
                      }}
                    />
                    <YAxis
                      width={44}
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) =>
                        Number.isFinite(Number(v)) ? `${Math.round(Number(v) * 100)}%` : "—"
                      }
                    >
                      <Label
                        value="Anteil der Antworten"
                        angle={-90}
                        position="insideLeft"
                        style={Y_AXIS_LABEL_STYLE}
                        offset={4}
                      />
                    </YAxis>
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
    </div>
  );
}
