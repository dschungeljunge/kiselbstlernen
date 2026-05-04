"use client";

import type {
  BinaryListQuestion,
  InteractiveQuestion,
  LikertQuestion,
  MultipleChoiceQuestion,
  RankingQuestion,
  RatingMultiQuestion,
  SliderQuestion,
  WeightingQuestion,
} from "@/lib/reflexion-redesign";

interface InteractiveQuestionProps {
  question: InteractiveQuestion;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function InteractiveQuestionField({
  question,
  value,
  onChange,
}: InteractiveQuestionProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-zinc-900">{question.prompt}</p>
      {question.helper ? (
        <p className="mt-1 text-xs text-zinc-500">{question.helper}</p>
      ) : null}
      <div className="mt-3">{renderInput(question, value, onChange)}</div>
    </div>
  );
}

function renderInput(
  question: InteractiveQuestion,
  value: unknown,
  onChange: (v: unknown) => void,
) {
  switch (question.kind) {
    case "slider":
      return (
        <SliderInput
          question={question}
          value={value as number | undefined}
          onChange={onChange}
        />
      );
    case "likert":
      return (
        <LikertInput
          question={question}
          value={value as number | undefined}
          onChange={onChange}
        />
      );
    case "ranking":
      return (
        <RankingInput
          question={question}
          value={value as string[] | undefined}
          onChange={onChange}
        />
      );
    case "weighting":
      return (
        <WeightingInput
          question={question}
          value={value as Record<string, number> | undefined}
          onChange={onChange}
        />
      );
    case "rating-multi":
      return (
        <RatingMultiInput
          question={question}
          value={value as Record<string, number> | undefined}
          onChange={onChange}
        />
      );
    case "multiple-choice":
      return (
        <MultipleChoiceInput
          question={question}
          value={value as string[] | undefined}
          onChange={onChange}
        />
      );
    case "binary-list":
      return (
        <BinaryListInput
          question={question}
          value={value as Record<string, "agree" | "disagree"> | undefined}
          onChange={onChange}
        />
      );
  }
}

function SliderInput({
  question,
  value,
  onChange,
}: {
  question: SliderQuestion;
  value: number | undefined;
  onChange: (v: number) => void;
}) {
  const fallback =
    question.defaultValue ?? Math.round((question.min + question.max) / 2);
  const current = value ?? fallback;
  const isSet = value !== undefined;
  return (
    <div>
      <input
        type="range"
        min={question.min}
        max={question.max}
        step={question.step ?? 1}
        value={current}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-yellow-500"
      />
      <div className="mt-1 flex items-center justify-between gap-2 text-xs text-zinc-500">
        <span className="max-w-[40%] leading-tight">{question.leftLabel}</span>
        <span
          className={`min-w-[3ch] text-center font-bold tabular-nums ${
            isSet ? "text-zinc-900" : "text-zinc-400"
          }`}
        >
          {isSet ? current : "—"}
        </span>
        <span className="max-w-[40%] text-right leading-tight">
          {question.rightLabel}
        </span>
      </div>
    </div>
  );
}

function LikertInput({
  question,
  value,
  onChange,
}: {
  question: LikertQuestion;
  value: number | undefined;
  onChange: (v: number) => void;
}) {
  const steps = Array.from({ length: question.steps }, (_, i) => i + 1);
  return (
    <div>
      <div className="flex items-center gap-1.5">
        {steps.map((step) => (
          <button
            key={step}
            type="button"
            onClick={() => onChange(step)}
            className={`h-9 flex-1 rounded-md border text-sm font-semibold transition ${
              value === step
                ? "border-yellow-400 bg-yellow-400 text-zinc-950"
                : "border-zinc-200 bg-white text-zinc-600 hover:border-yellow-300"
            }`}
          >
            {step}
          </button>
        ))}
      </div>
      <div className="mt-2 flex justify-between gap-2 text-xs text-zinc-500">
        <span className="max-w-[45%] leading-tight">{question.leftLabel}</span>
        <span className="max-w-[45%] text-right leading-tight">
          {question.rightLabel}
        </span>
      </div>
    </div>
  );
}

function RankingInput({
  question,
  value,
  onChange,
}: {
  question: RankingQuestion;
  value: string[] | undefined;
  onChange: (v: string[]) => void;
}) {
  const defaultOrder = question.items.map((item) => item.id);
  const order =
    value && value.length === question.items.length ? value : defaultOrder;
  const labelMap = Object.fromEntries(
    question.items.map((item) => [item.id, item.label]),
  );

  function move(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  }

  return (
    <div>
      {(question.topLabel || question.bottomLabel) && (
        <div className="mb-2 flex justify-between text-xs font-medium text-zinc-500">
          <span>{question.topLabel ?? ""}</span>
          <span>{question.bottomLabel ?? ""}</span>
        </div>
      )}
      <ol className="space-y-2">
        {order.map((itemId, idx) => (
          <li
            key={itemId}
            className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2"
          >
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-yellow-400 text-xs font-bold text-zinc-950">
              {idx + 1}
            </span>
            <span className="flex-1 text-sm text-zinc-800">
              {labelMap[itemId] ?? itemId}
            </span>
            <button
              type="button"
              onClick={() => move(idx, -1)}
              disabled={idx === 0}
              aria-label="Nach oben verschieben"
              className="h-7 w-7 rounded-md border border-zinc-200 bg-white text-sm text-zinc-600 transition hover:border-yellow-300 disabled:cursor-not-allowed disabled:opacity-30"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => move(idx, 1)}
              disabled={idx === order.length - 1}
              aria-label="Nach unten verschieben"
              className="h-7 w-7 rounded-md border border-zinc-200 bg-white text-sm text-zinc-600 transition hover:border-yellow-300 disabled:cursor-not-allowed disabled:opacity-30"
            >
              ↓
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function WeightingInput({
  question,
  value,
  onChange,
}: {
  question: WeightingQuestion;
  value: Record<string, number> | undefined;
  onChange: (v: Record<string, number>) => void;
}) {
  const total = question.total;
  const weights = value ?? {};
  const sum = question.items.reduce((acc, item) => acc + (weights[item.id] ?? 0), 0);
  const isExact = sum === total;
  const isOver = sum > total;

  function update(itemId: string, val: number) {
    onChange({ ...weights, [itemId]: val });
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="text-zinc-500">
          Verteile {total} Punkte auf die Optionen
        </span>
        <span
          className={`font-semibold tabular-nums ${
            isExact
              ? "text-emerald-600"
              : isOver
                ? "text-red-600"
                : "text-zinc-700"
          }`}
        >
          {sum} / {total}
        </span>
      </div>
      <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
        <div
          className={`h-full transition-all ${
            isOver ? "bg-red-400" : isExact ? "bg-emerald-400" : "bg-yellow-400"
          }`}
          style={{ width: `${Math.min(100, (sum / total) * 100)}%` }}
        />
      </div>
      <div className="space-y-2">
        {question.items.map((item) => {
          const v = weights[item.id] ?? 0;
          return (
            <div
              key={item.id}
              className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3"
            >
              <span className="flex-1 text-sm text-zinc-700 sm:max-w-[40%]">
                {item.label}
              </span>
              <input
                type="range"
                min={0}
                max={total}
                value={v}
                onChange={(event) => update(item.id, Number(event.target.value))}
                className="flex-1 accent-yellow-500"
              />
              <span className="w-12 text-right text-sm font-semibold tabular-nums text-zinc-700">
                {v}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RatingMultiInput({
  question,
  value,
  onChange,
}: {
  question: RatingMultiQuestion;
  value: Record<string, number> | undefined;
  onChange: (v: Record<string, number>) => void;
}) {
  const ratings = value ?? {};
  const max = question.scale;
  return (
    <div>
      {question.scaleLabels && (
        <div className="mb-2 flex justify-end gap-1 text-[11px] text-zinc-500">
          <span>{question.scaleLabels[0]}</span>
          <span>↔</span>
          <span>{question.scaleLabels[1]}</span>
        </div>
      )}
      <div className="space-y-2">
        {question.items.map((item) => {
          const current = ratings[item.id] ?? 0;
          return (
            <div
              key={item.id}
              className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
            >
              <span className="text-sm text-zinc-700">{item.label}</span>
              <div className="flex gap-1">
                {Array.from({ length: max }, (_, i) => i + 1).map((step) => (
                  <button
                    key={step}
                    type="button"
                    onClick={() =>
                      onChange({
                        ...ratings,
                        [item.id]: ratings[item.id] === step ? 0 : step,
                      })
                    }
                    aria-label={`${item.label}: ${step}`}
                    className={`h-7 w-7 rounded-full border text-xs font-bold transition ${
                      current >= step
                        ? "border-yellow-400 bg-yellow-400 text-zinc-950"
                        : "border-zinc-200 bg-white text-zinc-400 hover:border-yellow-300"
                    }`}
                  >
                    {step}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MultipleChoiceInput({
  question,
  value,
  onChange,
}: {
  question: MultipleChoiceQuestion;
  value: string[] | undefined;
  onChange: (v: string[]) => void;
}) {
  const selected = value ?? [];
  function toggle(optId: string) {
    if (selected.includes(optId)) {
      onChange(selected.filter((id) => id !== optId));
    } else {
      onChange([...selected, optId]);
    }
  }
  return (
    <div className="flex flex-wrap gap-2">
      {question.options.map((option) => {
        const isSelected = selected.includes(option.id);
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => toggle(option.id)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              isSelected
                ? "border-yellow-400 bg-yellow-400 text-zinc-950"
                : "border-zinc-200 bg-white text-zinc-600 hover:border-yellow-300"
            }`}
          >
            {isSelected ? "✓ " : ""}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function BinaryListInput({
  question,
  value,
  onChange,
}: {
  question: BinaryListQuestion;
  value: Record<string, "agree" | "disagree"> | undefined;
  onChange: (v: Record<string, "agree" | "disagree">) => void;
}) {
  const answers = value ?? {};
  const agreeLabel = question.agreeLabel ?? "Stimme zu";
  const disagreeLabel = question.disagreeLabel ?? "Stimme nicht zu";

  function set(stmtId: string, choice: "agree" | "disagree") {
    if (answers[stmtId] === choice) {
      const next = { ...answers };
      delete next[stmtId];
      onChange(next);
    } else {
      onChange({ ...answers, [stmtId]: choice });
    }
  }

  return (
    <div className="space-y-2">
      {question.statements.map((stmt) => {
        const current = answers[stmt.id];
        return (
          <div
            key={stmt.id}
            className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="text-sm text-zinc-800">{stmt.label}</span>
            <div className="flex flex-shrink-0 gap-2">
              <button
                type="button"
                onClick={() => set(stmt.id, "agree")}
                className={`rounded-md border px-3 py-1 text-xs font-semibold transition ${
                  current === "agree"
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-emerald-400"
                }`}
              >
                ✓ {agreeLabel}
              </button>
              <button
                type="button"
                onClick={() => set(stmt.id, "disagree")}
                className={`rounded-md border px-3 py-1 text-xs font-semibold transition ${
                  current === "disagree"
                    ? "border-red-500 bg-red-500 text-white"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-red-400"
                }`}
              >
                ✗ {disagreeLabel}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
