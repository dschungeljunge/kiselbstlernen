"use client";

/**
 * Interaktive Reflexions-Elemente
 *
 * BipolarSlider    – Schieberegler zwischen zwei Polen
 * OptionPicker     – Visuelle Auswahl aus Optionskarten
 * StatementCards   – Aussagen auf 5-Punkt-Skala bewerten
 * RankingList      – Elemente in Reihenfolge bringen
 * EmotionGrid      – Gefühls-Wörter auswählen
 */

import { useState, useCallback } from "react";

// ─────────────────────────────────────────────
// BIPOLAR SLIDER
// ─────────────────────────────────────────────

interface BipolarSliderProps {
  id: string;
  label: string;
  left: string;
  right: string;
  leftDetail?: string;
  rightDetail?: string;
  value: number; // 0–100
  onChange: (v: number) => void;
}

export function BipolarSlider({
  label,
  left,
  right,
  leftDetail,
  rightDetail,
  value,
  onChange,
}: BipolarSliderProps) {
  const getPositionLabel = () => {
    if (value <= 15) return left;
    if (value <= 35) return `Eher ${left.toLowerCase().split(" ")[0]}`;
    if (value <= 65) return "Dazwischen";
    if (value <= 85) return `Eher ${right.toLowerCase().split(" ")[0]}`;
    return right;
  };

  const trackColor = () => {
    if (value <= 20) return "#ef4444";
    if (value <= 40) return "#f97316";
    if (value <= 60) return "#eab308";
    if (value <= 80) return "#84cc16";
    return "#22c55e";
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="mb-4 text-sm font-semibold text-zinc-800">{label}</p>

      {/* Pole-Labels */}
      <div className="mb-3 flex justify-between gap-4">
        <div className="max-w-[42%]">
          <p className="text-xs font-semibold text-zinc-600">{left}</p>
          {leftDetail && (
            <p className="mt-0.5 text-xs text-zinc-400">{leftDetail}</p>
          )}
        </div>
        <div className="max-w-[42%] text-right">
          <p className="text-xs font-semibold text-zinc-600">{right}</p>
          {rightDetail && (
            <p className="mt-0.5 text-xs text-zinc-400">{rightDetail}</p>
          )}
        </div>
      </div>

      {/* Slider */}
      <div className="relative px-1">
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-100 outline-none"
          style={{
            background: `linear-gradient(to right, ${trackColor()} 0%, ${trackColor()} ${value}%, #e4e4e7 ${value}%, #e4e4e7 100%)`,
          }}
        />
      </div>

      {/* Wert-Label */}
      <div className="mt-3 text-center">
        <span
          className="inline-block rounded-full px-3 py-0.5 text-xs font-semibold text-white"
          style={{ backgroundColor: trackColor() }}
        >
          {getPositionLabel()}
        </span>
      </div>

      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #18181b;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
          transition: transform 0.1s;
        }
        input[type='range']::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        input[type='range']::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #18181b;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────
// OPTION PICKER
// ─────────────────────────────────────────────

interface OptionPickerProps {
  id: string;
  label: string;
  options: string[];
  selected: string[];
  multi?: boolean;
  onChange: (selected: string[]) => void;
}

export function OptionPicker({
  label,
  options,
  selected,
  multi = false,
  onChange,
}: OptionPickerProps) {
  function toggle(opt: string) {
    if (multi) {
      onChange(
        selected.includes(opt)
          ? selected.filter((s) => s !== opt)
          : [...selected, opt]
      );
    } else {
      onChange(selected.includes(opt) ? [] : [opt]);
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="mb-4 text-sm font-semibold text-zinc-800">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = selected.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => toggle(opt)}
              className={`rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-all focus:outline-none ${
                isSelected
                  ? "border-zinc-950 bg-zinc-950 text-white shadow-sm"
                  : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-400 hover:bg-white"
              }`}
            >
              {isSelected && (
                <span className="mr-1.5 inline-block">✓</span>
              )}
              {opt}
            </button>
          );
        })}
      </div>
      {multi && (
        <p className="mt-3 text-xs text-zinc-400">Mehrfachauswahl möglich</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// STATEMENT CARDS
// ─────────────────────────────────────────────

const STATEMENT_LABELS = [
  { value: 1, short: "Nein", color: "#ef4444", bg: "#fef2f2" },
  { value: 2, short: "Eher nein", color: "#f97316", bg: "#fff7ed" },
  { value: 3, short: "Neutral", color: "#eab308", bg: "#fefce8" },
  { value: 4, short: "Eher ja", color: "#84cc16", bg: "#f7fee7" },
  { value: 5, short: "Ja", color: "#22c55e", bg: "#f0fdf4" },
];

interface StatementCardsProps {
  id: string;
  label: string;
  statements: string[];
  values: Record<number, number>; // index → rating 1–5
  onChange: (idx: number, val: number) => void;
}

export function StatementCards({
  label,
  statements,
  values,
  onChange,
}: StatementCardsProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="mb-1 text-sm font-semibold text-zinc-800">{label}</p>
      <p className="mb-4 text-xs text-zinc-400">Klicke auf eine Aussage, um sie zu bewerten</p>

      <div className="space-y-3">
        {statements.map((stmt, idx) => {
          const selected = values[idx] ?? 0;
          return (
            <div
              key={idx}
              className="rounded-lg border border-zinc-100 bg-zinc-50 p-4"
            >
              <p className="mb-3 text-sm text-zinc-800">{stmt}</p>
              <div className="flex gap-2">
                {STATEMENT_LABELS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => onChange(idx, opt.value)}
                    title={opt.short}
                    className="flex flex-1 flex-col items-center gap-1 rounded-lg border-2 py-2 text-xs font-medium transition-all focus:outline-none"
                    style={
                      selected === opt.value
                        ? {
                            borderColor: opt.color,
                            backgroundColor: opt.bg,
                            color: opt.color,
                          }
                        : {
                            borderColor: "#e4e4e7",
                            backgroundColor: "white",
                            color: "#71717a",
                          }
                    }
                  >
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor:
                          selected === opt.value ? opt.color : "#d4d4d8",
                      }}
                    />
                    <span className="hidden sm:inline">{opt.short}</span>
                  </button>
                ))}
              </div>
              {selected > 0 && (
                <p
                  className="mt-2 text-xs font-medium"
                  style={{ color: STATEMENT_LABELS[selected - 1].color }}
                >
                  {STATEMENT_LABELS[selected - 1].short}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Legende */}
      <div className="mt-4 flex flex-wrap gap-3">
        {STATEMENT_LABELS.map((l) => (
          <div key={l.value} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: l.color }}
            />
            <span className="text-xs text-zinc-500">{l.short}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// RANKING LIST
// ─────────────────────────────────────────────

interface RankingListProps {
  id: string;
  label: string;
  detail?: string;
  items: string[];
  order: number[]; // current order as indices into items[]
  onReorder: (newOrder: number[]) => void;
}

export function RankingList({
  label,
  detail,
  items,
  order,
  onReorder,
}: RankingListProps) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  // Initialize order if empty
  const currentOrder =
    order.length === items.length
      ? order
      : items.map((_, i) => i);

  function moveUp(pos: number) {
    if (pos === 0) return;
    const newOrder = [...currentOrder];
    [newOrder[pos - 1], newOrder[pos]] = [newOrder[pos], newOrder[pos - 1]];
    onReorder(newOrder);
  }

  function moveDown(pos: number) {
    if (pos === currentOrder.length - 1) return;
    const newOrder = [...currentOrder];
    [newOrder[pos], newOrder[pos + 1]] = [newOrder[pos + 1], newOrder[pos]];
    onReorder(newOrder);
  }

  // Simple drag-and-drop with HTML5 API
  function handleDragStart(pos: number) {
    setDragIdx(pos);
  }

  function handleDragOver(e: React.DragEvent, pos: number) {
    e.preventDefault();
    if (dragIdx === null || dragIdx === pos) return;
    const newOrder = [...currentOrder];
    const [moved] = newOrder.splice(dragIdx, 1);
    newOrder.splice(pos, 0, moved);
    onReorder(newOrder);
    setDragIdx(pos);
  }

  function handleDragEnd() {
    setDragIdx(null);
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="mb-1 text-sm font-semibold text-zinc-800">{label}</p>
      {detail && <p className="mb-4 text-xs text-zinc-400">{detail}</p>}

      <div className="space-y-2">
        {currentOrder.map((itemIdx, pos) => (
          <div
            key={itemIdx}
            draggable
            onDragStart={() => handleDragStart(pos)}
            onDragOver={(e) => handleDragOver(e, pos)}
            onDragEnd={handleDragEnd}
            className={`flex cursor-grab items-center gap-3 rounded-xl border-2 bg-white p-3 transition-all active:cursor-grabbing ${
              dragIdx === pos
                ? "border-yellow-400 bg-yellow-50 opacity-70"
                : "border-zinc-200 hover:border-zinc-300"
            }`}
          >
            {/* Rang-Badge */}
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-zinc-950 text-xs font-bold text-white">
              {pos + 1}
            </div>

            {/* Drag-Handle */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#a1a1aa"
              strokeWidth="2"
              strokeLinecap="round"
              className="flex-shrink-0"
            >
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>

            {/* Text */}
            <span className="flex-1 text-sm text-zinc-800">
              {items[itemIdx]}
            </span>

            {/* Up/Down Buttons */}
            <div className="flex gap-1">
              <button
                onClick={() => moveUp(pos)}
                disabled={pos === 0}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 text-zinc-400 transition hover:border-zinc-400 hover:text-zinc-700 disabled:opacity-30 focus:outline-none"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 15l-6-6-6 6" />
                </svg>
              </button>
              <button
                onClick={() => moveDown(pos)}
                disabled={pos === currentOrder.length - 1}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 text-zinc-400 transition hover:border-zinc-400 hover:text-zinc-700 disabled:opacity-30 focus:outline-none"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-zinc-400">
        Ziehen oder Pfeile verwenden. 1 = grösster Einfluss.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// EMOTION GRID
// ─────────────────────────────────────────────

const EMOTIONS = [
  { word: "Kontrolliert", valence: "positive" },
  { word: "Inspiriert", valence: "positive" },
  { word: "Präsent", valence: "positive" },
  { word: "Motiviert", valence: "positive" },
  { word: "Authentisch", valence: "positive" },
  { word: "Neugierig", valence: "positive" },
  { word: "Begeistert", valence: "positive" },
  { word: "Sicher", valence: "positive" },
  { word: "Überfordert", valence: "negative" },
  { word: "Unsicher", valence: "negative" },
  { word: "Fremd", valence: "negative" },
  { word: "Skeptisch", valence: "neutral" },
  { word: "Kritisch", valence: "neutral" },
  { word: "Beobachtend", valence: "neutral" },
  { word: "Überrascht", valence: "neutral" },
  { word: "Abwartend", valence: "neutral" },
];

interface EmotionGridProps {
  label: string;
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function EmotionGrid({ label, selected, onChange }: EmotionGridProps) {
  function toggle(word: string) {
    onChange(
      selected.includes(word)
        ? selected.filter((w) => w !== word)
        : [...selected, word]
    );
  }

  const colorFor = (valence: string, isSelected: boolean) => {
    if (!isSelected)
      return "border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-zinc-300";
    if (valence === "positive")
      return "border-green-400 bg-green-50 text-green-800 font-semibold";
    if (valence === "negative")
      return "border-red-300 bg-red-50 text-red-800 font-semibold";
    return "border-zinc-400 bg-zinc-100 text-zinc-900 font-semibold";
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="mb-1 text-sm font-semibold text-zinc-800">{label}</p>
      <p className="mb-4 text-xs text-zinc-400">Mehrfachauswahl möglich</p>
      <div className="flex flex-wrap gap-2">
        {EMOTIONS.map(({ word, valence }) => (
          <button
            key={word}
            onClick={() => toggle(word)}
            className={`rounded-xl border-2 px-3 py-2 text-sm transition-all focus:outline-none ${colorFor(
              valence,
              selected.includes(word)
            )}`}
          >
            {selected.includes(word) && (
              <span className="mr-1">✓</span>
            )}
            {word}
          </button>
        ))}
      </div>
      {selected.length > 0 && (
        <p className="mt-3 text-xs text-zinc-500">
          Ausgewählt: {selected.join(", ")}
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// INTERACTIVE PHASE RENDERER
// ─────────────────────────────────────────────

export type InteractiveElementConfig =
  | {
      type: "bipolar-slider";
      id: string;
      label: string;
      left: string;
      right: string;
      leftDetail?: string;
      rightDetail?: string;
    }
  | {
      type: "option-picker";
      id: string;
      label: string;
      options: string[];
      multi?: boolean;
    }
  | {
      type: "statement-cards";
      id: string;
      label: string;
      statements: string[];
    }
  | {
      type: "ranking";
      id: string;
      label: string;
      detail?: string;
      items: string[];
    }
  | { type: "emotion-grid"; id: string; label: string };

interface InteractivePhaseProps {
  elements: InteractiveElementConfig[];
  answers: Record<string, unknown>;
  onChange: (id: string, value: unknown) => void;
}

export function InteractivePhase({
  elements,
  answers,
  onChange,
}: InteractivePhaseProps) {
  const getSliderValue = useCallback(
    (id: string) => (typeof answers[id] === "number" ? (answers[id] as number) : 50),
    [answers]
  );

  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-zinc-200" />
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
          Erste Eindrücke
        </p>
        <div className="h-px flex-1 bg-zinc-200" />
      </div>

      {elements.map((el) => {
        switch (el.type) {
          case "bipolar-slider":
            return (
              <BipolarSlider
                key={el.id}
                id={el.id}
                label={el.label}
                left={el.left}
                right={el.right}
                leftDetail={el.leftDetail}
                rightDetail={el.rightDetail}
                value={getSliderValue(el.id)}
                onChange={(v) => onChange(el.id, v)}
              />
            );

          case "option-picker":
            return (
              <OptionPicker
                key={el.id}
                id={el.id}
                label={el.label}
                options={el.options}
                selected={(answers[el.id] as string[]) ?? []}
                multi={el.multi}
                onChange={(v) => onChange(el.id, v)}
              />
            );

          case "statement-cards":
            return (
              <StatementCards
                key={el.id}
                id={el.id}
                label={el.label}
                statements={el.statements}
                values={(answers[el.id] as Record<number, number>) ?? {}}
                onChange={(idx, val) => {
                  const current =
                    (answers[el.id] as Record<number, number>) ?? {};
                  onChange(el.id, { ...current, [idx]: val });
                }}
              />
            );

          case "ranking":
            return (
              <RankingList
                key={el.id}
                id={el.id}
                label={el.label}
                detail={el.detail}
                items={el.items}
                order={(answers[el.id] as number[]) ?? el.items.map((_, i) => i)}
                onReorder={(v) => onChange(el.id, v)}
              />
            );

          case "emotion-grid":
            return (
              <EmotionGrid
                key={el.id}
                label={el.label}
                selected={(answers[el.id] as string[]) ?? []}
                onChange={(v) => onChange(el.id, v)}
              />
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
