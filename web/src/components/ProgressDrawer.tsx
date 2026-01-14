/**
 * ProgressDrawer – Rechte Sidebar für Fortschritts-Übersicht
 * 
 * Zeigt alle Steps als vertikalen Timeline-Pfad
 */

"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface Step {
  id: number;
  title: string;
  href: string;
}

// Temporäre Steps-Liste (später aus DB/Config laden)
const STEPS: Step[] = [
  { id: 1, title: "Willkommen", href: "/step/1" },
  { id: 2, title: "Wie wir arbeiten", href: "/step/2" },
  { id: 3, title: "Profil-Chat", href: "/step/3" },
  { id: 4, title: "Lern-Code", href: "/step/4" },
  { id: 5, title: "Produktiv sein", href: "/step/5" },
  { id: 6, title: "Erste Übung", href: "/step/6" },
  { id: 7, title: "Zweite Übung", href: "/step/7" },
  { id: 8, title: "Dritte Übung", href: "/step/8" },
  { id: 9, title: "Reflexion", href: "/step/9" },
  { id: 10, title: "Abschluss", href: "/step/10" },
];

export function ProgressDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Schließen bei Route-Wechsel
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Escape-Taste zum Schließen
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  // Aktuellen Step ermitteln
  const currentStepId = STEPS.find((s) => s.href === pathname)?.id || 0;

  return (
    <>
      {/* Menu Button (oben rechts, fixed) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-6 top-6 z-40 flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-4 focus:ring-zinc-200"
        aria-label="Fortschritt anzeigen"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M3 6h14M3 10h14M3 14h14" />
        </svg>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-zinc-900/20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-80 transform border-l border-zinc-200 bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-zinc-950">Fortschritt</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100"
              aria-label="Schließen"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M5 5l10 10M15 5l-10 10" />
              </svg>
            </button>
          </div>

          {/* Timeline */}
          <div className="flex-1 overflow-y-auto px-6 py-8">
            <div className="relative">
              {STEPS.map((step, index) => {
                const isCompleted = step.id < currentStepId;
                const isCurrent = step.id === currentStepId;
                const isAccessible = step.id <= currentStepId;

                return (
                  <div key={step.id} className="relative pb-8 last:pb-0">
                    {/* Verbindungslinie */}
                    {index < STEPS.length - 1 && (
                      <div
                        className={`absolute left-[15px] top-[30px] h-full w-0.5 ${
                          isCompleted ? "bg-zinc-900" : "bg-zinc-200"
                        }`}
                      />
                    )}

                    {/* Step Item */}
                    <div className="relative flex items-start gap-4">
                      {/* Punkt */}
                      <div
                        className={`relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                          isCurrent
                            ? "border-zinc-900 bg-zinc-900"
                            : isCompleted
                              ? "border-zinc-900 bg-zinc-900"
                              : "border-zinc-200 bg-white"
                        }`}
                      >
                        {isCompleted ? (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                          >
                            <path d="M3 7l3 3 5-6" />
                          </svg>
                        ) : (
                          <div
                            className={`h-2 w-2 rounded-full ${
                              isCurrent ? "bg-white" : "bg-zinc-300"
                            }`}
                          />
                        )}
                      </div>

                      {/* Step Info */}
                      {isAccessible ? (
                        <Link
                          href={step.href}
                          className={`flex-1 pt-1 ${
                            isCurrent
                              ? "font-semibold text-zinc-950"
                              : "text-zinc-600 hover:text-zinc-950"
                          }`}
                        >
                          <div className="text-sm">{step.title}</div>
                          {isCurrent && (
                            <div className="mt-0.5 text-xs text-zinc-500">
                              Aktuell
                            </div>
                          )}
                        </Link>
                      ) : (
                        <div className="flex-1 pt-1 text-sm text-zinc-400">
                          {step.title}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

