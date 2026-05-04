import Link from "next/link";
import { EvaluationDashboardClient } from "@/components/EvaluationDashboardClient";
import { getEvaluationDashboardPayload } from "@/lib/evaluation-dashboard-data";

export const dynamic = "force-dynamic";

export default async function DashboardPage(props: PageProps<"/dashboard">) {
  await props.params;
  const payload = await getEvaluationDashboardPayload();
  const { overall, workshops } = payload;

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
            Kompakte Übersicht für die Projektleitung — inklusive separater Auswertung pro Workshop-Tag.
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        {overall.nRows === 0 ? (
          <p className="rounded-xl border border-zinc-200 bg-white p-6 text-zinc-600">
            Noch keine Evaluationen in der Datenbank.
          </p>
        ) : (
          <div className="space-y-10">
            {workshops.length > 0 && (
              <section className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700">
                <p className="font-medium text-zinc-900">Workshop-Aufteilung nach Datum (Europe/Zurich)</p>
                <ul className="mt-2 list-inside list-disc space-y-1">
                  {workshops.map((w) => (
                    <li key={w.dateKey}>
                      {w.label}: {w.nRows} Datensätze
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {workshops.map((w) => (
              <section key={w.dateKey} className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900">Workshop {w.label}</h2>
                  <p className="text-sm text-zinc-600">Auswertung nur für Einreichungen dieses Tages.</p>
                </div>
                <EvaluationDashboardClient data={w.stats} />
              </section>
            ))}

            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-zinc-900">Gesamtauswertung (alle Workshops)</h2>
                <p className="text-sm text-zinc-600">
                  Referenzansicht über alle verfügbaren Einreichungen.
                </p>
              </div>
              <EvaluationDashboardClient data={overall} />
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
