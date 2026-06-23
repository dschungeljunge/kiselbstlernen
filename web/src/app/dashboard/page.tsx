import Link from "next/link";
import { Suspense } from "react";
import { EvaluationDashboardShell } from "@/components/EvaluationDashboardShell";
import { getEvaluationDashboardPayload } from "@/lib/evaluation-dashboard-data";

export const dynamic = "force-dynamic";

function DashboardLoading() {
  return (
    <p className="rounded-xl border border-zinc-200 bg-white p-6 text-zinc-600">
      Auswertung wird geladen…
    </p>
  );
}

export default async function DashboardPage(props: PageProps<"/dashboard">) {
  await props.params;
  const payload = await getEvaluationDashboardPayload();
  const { overall, workshops, t3 } = payload;

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white print:border-0">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 print:hidden"
          >
            ← Zur Startseite
          </Link>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            Evaluation: Wirkung der Weiterbildung
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600">
            Grundlage für den Austausch mit Multiplikator:innen und die Projektleitung. Standardansicht:
            Diskussionsmodus mit Workshop-Gruppe — Expertenansicht für detaillierte Statistik.
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        {overall.nRows === 0 ? (
          <p className="rounded-xl border border-zinc-200 bg-white p-6 text-zinc-600">
            Noch keine Evaluationen in der Datenbank.
          </p>
        ) : (
          <Suspense fallback={<DashboardLoading />}>
            <EvaluationDashboardShell overall={overall} workshops={workshops} t3={t3} />
          </Suspense>
        )}
      </main>
    </div>
  );
}
