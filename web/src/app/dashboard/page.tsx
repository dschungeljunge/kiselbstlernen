import Link from "next/link";
import { EvaluationDashboardShell } from "@/components/EvaluationDashboardShell";
import { getEvaluationDashboardPayload } from "@/lib/evaluation-dashboard-data";

export const dynamic = "force-dynamic";

export default async function DashboardPage(props: PageProps<"/dashboard">) {
  await props.params;
  const payload = await getEvaluationDashboardPayload();
  const { overall, workshops, t3 } = payload;

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
            Auswertung für die Projektleitung — wählen Sie eine Gruppe oder die Gesamtübersicht.
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        {overall.nRows === 0 ? (
          <p className="rounded-xl border border-zinc-200 bg-white p-6 text-zinc-600">
            Noch keine Evaluationen in der Datenbank.
          </p>
        ) : (
          <EvaluationDashboardShell overall={overall} workshops={workshops} t3={t3} />
        )}
      </main>
    </div>
  );
}
