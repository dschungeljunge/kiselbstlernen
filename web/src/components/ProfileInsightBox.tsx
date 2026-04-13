"use client";

/**
 * ProfileInsightBox – Personalisierte Infobox basierend auf dem Lehrpersonenprofil
 *
 * Zeigt einen KI-generierten Satz, der erklärt, weshalb der aktuelle Schritt
 * für den jeweiligen Profiltyp besonders relevant ist. Das Ergebnis wird im
 * localStorage gecacht, damit es nur einmal pro Session generiert wird.
 */

import { useEffect, useState } from "react";
import { useSession } from "@/contexts/SessionContext";

interface ProfileInsightBoxProps {
  stepNumber: number;
}

function getCacheKey(sessionCode: string, stepNumber: number): string {
  return `profile_insight_${sessionCode}_step${stepNumber}`;
}

export default function ProfileInsightBox({ stepNumber }: ProfileInsightBoxProps) {
  const { profile, sessionCode } = useSession();
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!profile || !sessionCode) return;

    const cacheKey = getCacheKey(sessionCode, stepNumber);
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setInsight(cached);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    fetch("/api/profile-insight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, stepNumber }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.insight) {
          setInsight(data.insight);
          localStorage.setItem(cacheKey, data.insight);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [profile, sessionCode, stepNumber]);

  if (!profile || (!insight && !isLoading)) return null;

  return (
    <div className="rounded-xl border-l-4 border-zinc-300 bg-zinc-50/50 p-5">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <svg
            className="w-5 h-5 text-zinc-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-zinc-500 mb-1">
            {profile.name}
          </p>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-zinc-300 animate-pulse" />
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-zinc-300 animate-pulse [animation-delay:150ms]" />
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-zinc-300 animate-pulse [animation-delay:300ms]" />
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-zinc-700">
              {insight}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
