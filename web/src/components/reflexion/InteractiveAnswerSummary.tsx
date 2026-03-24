"use client";

/**
 * InteractiveAnswerSummary
 *
 * Zeigt die interaktiven Antworten einer Strategie kompakt im Cockpit an.
 */

import { ReflexionStrategy } from "@/lib/reflexion-strategies";

const RATING_LABELS = ["", "Nein", "Eher nein", "Neutral", "Eher ja", "Ja"];
const RATING_COLORS = ["", "#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e"];

interface Props {
  strategy: ReflexionStrategy;
  answers: Record<string, unknown>;
}

export function InteractiveAnswerSummary({ strategy, answers }: Props) {
  if (!strategy.interactivePhase || Object.keys(answers).length === 0)
    return null;

  return (
    <div className="mt-3 space-y-3">
      {strategy.interactivePhase.map((el) => {
        const value = answers[el.id];
        if (value === undefined || value === null) return null;

        switch (el.type) {
          case "bipolar-slider": {
            const v = value as number;
            const pct = `${v}%`;
            const color =
              v <= 20 ? "#ef4444" : v <= 40 ? "#f97316" : v <= 60 ? "#eab308" : v <= 80 ? "#84cc16" : "#22c55e";
            return (
              <div key={el.id}>
                <p className="mb-1 text-xs text-zinc-500">{el.label}</p>
                <div className="flex items-center gap-2">
                  <span className="w-24 truncate text-right text-xs text-zinc-400">
                    {el.left}
                  </span>
                  <div className="relative h-2 flex-1 rounded-full bg-zinc-100">
                    <div
                      className="absolute left-0 top-0 h-2 rounded-full transition-all"
                      style={{ width: pct, backgroundColor: color }}
                    />
                    <div
                      className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
                      style={{ left: pct, backgroundColor: color }}
                    />
                  </div>
                  <span className="w-24 truncate text-xs text-zinc-400">
                    {el.right}
                  </span>
                </div>
              </div>
            );
          }

          case "option-picker": {
            const sel = value as string[];
            if (!sel?.length) return null;
            return (
              <div key={el.id}>
                <p className="mb-1.5 text-xs text-zinc-500">{el.label}</p>
                <div className="flex flex-wrap gap-1.5">
                  {sel.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-zinc-900 px-2.5 py-0.5 text-xs font-medium text-white"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            );
          }

          case "emotion-grid": {
            const sel = value as string[];
            if (!sel?.length) return null;
            return (
              <div key={el.id}>
                <p className="mb-1.5 text-xs text-zinc-500">{el.label}</p>
                <div className="flex flex-wrap gap-1.5">
                  {sel.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs text-zinc-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            );
          }

          case "statement-cards": {
            const ratings = value as Record<number, number>;
            const rated = el.statements
              .map((stmt, idx) => ({ stmt, rating: ratings[idx] }))
              .filter((r) => r.rating);
            if (!rated.length) return null;
            return (
              <div key={el.id}>
                <p className="mb-2 text-xs text-zinc-500">{el.label}</p>
                <div className="space-y-1.5">
                  {rated.map(({ stmt, rating }, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                        style={{ backgroundColor: RATING_COLORS[rating] }}
                      />
                      <span className="flex-1 text-xs text-zinc-700 line-clamp-1">
                        {stmt}
                      </span>
                      <span
                        className="flex-shrink-0 text-xs font-medium"
                        style={{ color: RATING_COLORS[rating] }}
                      >
                        {RATING_LABELS[rating]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          case "ranking": {
            const order = value as number[];
            if (!order?.length) return null;
            return (
              <div key={el.id}>
                <p className="mb-1.5 text-xs text-zinc-500">{el.label}</p>
                <ol className="space-y-1">
                  {order.slice(0, 3).map((idx, pos) => (
                    <li key={pos} className="flex items-center gap-2">
                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white">
                        {pos + 1}
                      </span>
                      <span className="text-xs text-zinc-700">
                        {el.items[idx]}
                      </span>
                    </li>
                  ))}
                  {order.length > 3 && (
                    <li className="text-xs text-zinc-400 pl-7">
                      + {order.length - 3} weitere
                    </li>
                  )}
                </ol>
              </div>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}
