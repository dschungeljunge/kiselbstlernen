/**
 * Step 2 – Zweites Video der Weiterbildung
 * 
 * Minimalistisch: Video + Weiter-Button
 */

"use client";

import Link from "next/link";
import { use, useEffect } from "react";
import { useSession } from "@/contexts/SessionContext";

export default function Step2Page(props: PageProps<"/step/2">) {
  use(props.params);
  use(props.searchParams);
  const { updateProgress, markStepCompleted, sessionCode } = useSession();

  // Fortschritt aktualisieren, wenn Seite geladen wird
  useEffect(() => {
    if (sessionCode) {
      updateProgress(2);
      markStepCompleted(2);
    }
  }, [sessionCode, updateProgress, markStepCompleted]);

  return (
    <div className="min-h-screen bg-zinc-50 px-6">
      <main className="mx-auto w-full max-w-4xl pb-16 pt-14">
        {/* Video Container */}
        <div className="relative w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
            <iframe
              src="https://www.loom.com/embed/04b8821342264b60a2d26e98825065f9"
              frameBorder="0"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        </div>

        {/* Weiter Button */}
        <div className="mt-8 flex justify-end">
          <Link
            href="/step/3"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-950 px-8 text-sm font-semibold text-white hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-200"
          >
            Weiter →
          </Link>
        </div>
      </main>
    </div>
  );
}

