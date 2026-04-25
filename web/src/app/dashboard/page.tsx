import Link from "next/link";
import { EvaluationDashboardClient } from "@/components/EvaluationDashboardClient";
import { getEvaluationDashboardPayload } from "@/lib/evaluation-dashboard-data";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await getEvaluationDashboardPayload();

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            ← Zur Startseite
          </Link>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            Evaluation: Wirkung der Weiterbildung
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600">
            Kompakte Übersicht für die Projektleitung — Kennzahlen, Signifikanztests und Grafiken sind in
            Registerkarten gruppiert; Methodik und Fragetexte sind separat abgelegt.
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        {data.nRows === 0 ? (
          <p className="rounded-xl border border-zinc-200 bg-white p-6 text-zinc-600">
            Noch keine Evaluationen in der Datenbank.
          </p>
        ) : (
          <EvaluationDashboardClient data={data} />
        )}
      </main>
    </div>
  );
}
