/**
 * SessionExplainer – Erklärt das anonyme Lern-Code-System
 * 
 * Zeigt beim ersten Besuch ein Modal mit Erklärung
 */

"use client";

import { useState, useEffect } from "react";

export function SessionExplainer() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Prüfen, ob Erklärung bereits gesehen wurde
    const hasSeenExplainer = localStorage.getItem("canvas_seen_explainer");
    if (!hasSeenExplainer) {
      setIsOpen(true);
    }
  }, []);

  function handleClose() {
    localStorage.setItem("canvas_seen_explainer", "true");
    setIsOpen(false);
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-zinc-900/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-2xl">
          {/* Icon */}
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="text-blue-600"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
          </div>

          {/* Titel */}
          <h2 className="mt-4 text-xl font-semibold text-zinc-950">
            So funktioniert dein Lernfortschritt
          </h2>

          {/* Text */}
          <div className="mt-4 space-y-3 text-sm leading-6 text-zinc-700">
            <p>
              Diese Weiterbildung funktioniert <strong>anonym</strong> und ohne
              komplizierte Anmeldung.
            </p>
            <p>
              Nach den ersten Schritten erhältst du einen{" "}
              <strong>persönlichen Lern-Code</strong> (z.B. "HL9-HML"). Mit
              diesem Code kannst du jederzeit dort weitermachen, wo du aufgehört
              hast.
            </p>
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-amber-900">
              💡 <strong>Tipp:</strong> Notiere dir den Code oder speichere ihn
              sicher, sobald er angezeigt wird.
            </p>
          </div>

          {/* Button */}
          <button
            onClick={handleClose}
            className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-zinc-950 text-sm font-semibold text-white hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-200"
          >
            Verstanden, los geht's!
          </button>
        </div>
      </div>
    </>
  );
}



