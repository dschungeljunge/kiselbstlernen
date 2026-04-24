import Link from "next/link";
import { notFound } from "next/navigation";
import { EvaluationDashboardClient } from "@/components/EvaluationDashboardClient";
import { getEvaluationDashboardPayload } from "@/lib/evaluation-dashboard-data";

type PageProps = {
  searchParams: Promise<{ key?: string }>;
};

function isDashboardAllowed(key: string | undefined): boolean {
  const secret = process.env.DASHBOARD_SECRET;
  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }
  return key === secret;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const { key } = await searchParams;
  if (!isDashboardAllowed(key)) {
    if (process.env.NODE_ENV === "production") {
      notFound();
    }
    return (
      <div className="min-h-screen bg-zinc-50 px-6 py-16">
        <div className="mx-auto max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-semibold text-zinc-900">Dashboard gesperrt</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Setze in <code className="rounded bg-zinc-100 px-1">.env.local</code> die Variable{" "}
            <code className="rounded bg-zinc-100 px-1">DASHBOARD_SECRET</code> und rufe die Seite mit
            <code className="mt-2 block rounded bg-zinc-100 p-2 text-sm">
              /dashboard?key=DEIN_GEHEIMNIS
            </code>
            auf.
          </p>
        </div>
      </div>
    );
  }

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
