"use client";

import { useEffect, useMemo, useState } from "react";

interface PhaseTimerProps {
  minutes: number;
}

export function PhaseTimer({ minutes }: PhaseTimerProps) {
  const initialSeconds = useMemo(() => Math.max(0, Math.floor(minutes * 60)), [minutes]);
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setRemainingSeconds(initialSeconds);
    setIsRunning(false);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning) return;
    if (remainingSeconds <= 0) {
      setIsRunning(false);
      return;
    }

    const interval = window.setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning, remainingSeconds]);

  const minutesPart = Math.floor(remainingSeconds / 60).toString().padStart(2, "0");
  const secondsPart = (remainingSeconds % 60).toString().padStart(2, "0");

  function resetTimer() {
    setRemainingSeconds(initialSeconds);
    setIsRunning(false);
  }

  return (
    <div className="fixed right-6 top-6 z-30 rounded-xl border border-zinc-200 bg-white/95 px-3 py-2 shadow-sm backdrop-blur">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Timer</p>
      <p className="mt-0.5 font-mono text-lg font-semibold text-zinc-900">
        {minutesPart}:{secondsPart}
      </p>
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={() => setIsRunning((running) => !running)}
          className="inline-flex h-7 items-center justify-center rounded-md border border-zinc-300 bg-white px-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          type="button"
          onClick={resetTimer}
          className="inline-flex h-7 items-center justify-center rounded-md border border-zinc-300 bg-white px-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
