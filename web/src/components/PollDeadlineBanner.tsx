"use client";

import { useEffect, useState } from "react";

/** Abgabe Terminfindung: Sonntag 19.04.2026,23:59 MESZ */
const DEADLINE_MS = new Date("2026-04-19T23:59:59+02:00").getTime();

function remainingParts(ms: number) {
  if (ms <= 0) return null;
  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  return { days, hours, minutes };
}

export function PollDeadlineBanner() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const parts = remainingParts(DEADLINE_MS - now);
  const expired = DEADLINE_MS <= now;

  return (
    <div
      className="mb-6 rounded-lg border border-zinc-200/90 bg-white/70 px-4 py-3 text-sm text-zinc-600 shadow-sm backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <p className="leading-relaxed">
        Bitte Verfügbarkeit und Teilschule bis spätestens{" "}
        <time dateTime="2026-04-19" className="font-medium text-zinc-700">
          Sonntag, 19. April 2026
        </time>{" "}
        eintragen (Ende dieser Woche), damit wir planen können.
      </p>
      {!expired && parts && (
        <p className="mt-2 font-mono text-xs tabular-nums text-zinc-500">
          Noch{" "}
          <span className="text-zinc-700">
            {parts.days} {parts.days === 1 ? "Tag" : "Tage"}
          </span>
          , {parts.hours} Std., {parts.minutes} Min.
        </p>
      )}
      {expired && (
        <p className="mt-2 text-xs text-zinc-500">
          Die Frist ist abgelaufen. Bei Bedarf bitte kurz per E-Mail melden.
        </p>
      )}
    </div>
  );
}
