"use client";

import { useCallback, useEffect, useState } from "react";

type Availability = "yes" | "maybe" | "no";

interface DateOption {
  date: string;
  label: string;
}

interface PollResponse {
  id: string;
  name: string;
  email: string;
  teilschule: string;
  selections: Record<string, Availability>;
  updated_at: string;
}

interface Poll {
  id: string;
  title: string;
  description: string;
  date_options: DateOption[];
  is_active: boolean;
}

const AVAILABILITY_CONFIG: Record<
  Availability,
  { bg: string; text: string; icon: string; label: string }
> = {
  yes: {
    bg: "bg-green-100 border-green-300",
    text: "text-green-700",
    icon: "M5 13l4 4L19 7",
    label: "Ja",
  },
  maybe: {
    bg: "bg-yellow-100 border-yellow-300",
    text: "text-yellow-700",
    icon: "M12 8v4m0 4h.01",
    label: "Vielleicht",
  },
  no: {
    bg: "bg-red-100 border-red-300",
    text: "text-red-700",
    icon: "M6 18L18 6M6 6l12 12",
    label: "Nein",
  },
};

function AvailabilityIcon({ type }: { type: Availability }) {
  const cfg = AVAILABILITY_CONFIG[type];
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cfg.text}
    >
      <path d={cfg.icon} />
    </svg>
  );
}

function countByAvailability(
  responses: PollResponse[],
  date: string,
  type: Availability
) {
  return responses.filter((r) => r.selections[date] === type).length;
}

export function PollScheduler() {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [responses, setResponses] = useState<PollResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [teilschule, setTeilschule] = useState("");
  const [selections, setSelections] = useState<Record<string, Availability>>(
    {}
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const loadPoll = useCallback(async () => {
    setError("");
    try {
      const res = await fetch("/api/multiplikatoren/poll");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          typeof data.error === "string"
            ? data.error
            : "Die Terminfindung konnte nicht geladen werden. Bitte später erneut versuchen.";
        setError(msg);
        setPoll(null);
        setResponses([]);
        return;
      }
      setPoll(data.poll ?? null);
      setResponses(data.responses ?? []);
    } catch {
      setError(
        "Netzwerkfehler beim Laden der Terminfindung. Bitte Seite neu laden."
      );
      setPoll(null);
      setResponses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPoll();
  }, [loadPoll]);

  function cycleAvailability(date: string) {
    setSelections((prev) => {
      const current = prev[date];
      const next: Availability =
        current === "yes" ? "maybe" : current === "maybe" ? "no" : "yes";
      return { ...prev, [date]: next };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!poll || !name.trim() || !email.trim()) return;

    const allDatesSelected = poll.date_options.every(
      (d) => selections[d.date] !== undefined
    );
    if (!allDatesSelected) {
      setError("Bitte gib f\u00fcr jeden Termin deine Verf\u00fcgbarkeit an.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/multiplikatoren/poll/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pollId: poll.id,
          name: name.trim(),
          email: email.trim(),
          teilschule: teilschule.trim(),
          selections,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Fehler beim Speichern.");
        return;
      }

      setSubmitted(true);
      await loadPoll();
    } catch {
      setError("Netzwerkfehler. Bitte versuche es erneut.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-yellow-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 rounded-xl border border-amber-200 bg-amber-50/80 p-6 text-center">
        <p className="text-sm leading-relaxed text-zinc-800">{error}</p>
        <button
          type="button"
          onClick={() => {
            setLoading(true);
            loadPoll();
          }}
          className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-800 shadow-sm transition-colors hover:bg-zinc-50"
        >
          Erneut laden
        </button>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-center text-sm text-zinc-500">
        Aktuell ist keine Terminfindung aktiv.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current responses overview */}
      {responses.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                <th className="px-4 py-3 text-left font-semibold text-zinc-700">
                  Teilnehmer:in
                </th>
                <th className="px-3 py-3 text-left font-semibold text-zinc-700">
                  Teilschule
                </th>
                {poll.date_options.map((d) => (
                  <th
                    key={d.date}
                    className="px-3 py-3 text-center font-semibold text-zinc-700"
                  >
                    <span className="block text-xs leading-tight">
                      {d.label.split(",")[0]}
                    </span>
                    <span className="block text-[11px] font-normal text-zinc-500">
                      {d.label.split(",").slice(1).join(",").trim()}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {responses.map((r) => (
                <tr key={r.id} className="border-b border-zinc-50">
                  <td className="px-4 py-2.5 font-medium text-zinc-900">
                    {r.name}
                  </td>
                  <td className="px-3 py-2.5 text-sm text-zinc-600">
                    {r.teilschule || "–"}
                  </td>
                  {poll.date_options.map((d) => {
                    const avail = r.selections[d.date] as
                      | Availability
                      | undefined;
                    return (
                      <td key={d.date} className="px-3 py-2.5 text-center">
                        {avail ? (
                          <span
                            className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium ${AVAILABILITY_CONFIG[avail].bg} ${AVAILABILITY_CONFIG[avail].text}`}
                          >
                            <AvailabilityIcon type={avail} />
                            <span className="ml-1">
                              {AVAILABILITY_CONFIG[avail].label}
                            </span>
                          </span>
                        ) : (
                          <span className="text-zinc-300">–</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {/* Summary row */}
              <tr className="bg-zinc-50 font-medium">
                <td className="px-4 py-3 text-zinc-700">Zusammenfassung</td>
                <td />

                {poll.date_options.map((d) => {
                  const yesCount = countByAvailability(
                    responses,
                    d.date,
                    "yes"
                  );
                  const maybeCount = countByAvailability(
                    responses,
                    d.date,
                    "maybe"
                  );
                  return (
                    <td key={d.date} className="px-3 py-3 text-center">
                      <span className="text-green-600">{yesCount}</span>
                      <span className="mx-1 text-zinc-300">/</span>
                      <span className="text-yellow-600">{maybeCount}</span>
                      <span className="mx-1 text-zinc-300">/</span>
                      <span className="text-red-600">
                        {responses.length - yesCount - maybeCount}
                      </span>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Response form */}
      {!submitted ? (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border-2 border-zinc-200 bg-white p-6"
        >
          <h3 className="text-lg font-semibold text-zinc-900">
            Deine Verfügbarkeit eintragen
          </h3>
          <p className="mt-1 text-sm text-zinc-500">
            Klicke auf die Termine, um zwischen Ja / Vielleicht / Nein zu
            wechseln.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-zinc-700">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Vor- und Nachname"
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700">
                E-Mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="vorname.name@bbzolten.ch"
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700">
                Teilschule BBZ Olten
              </label>
              <input
                type="text"
                value={teilschule}
                onChange={(e) => setTeilschule(e.target.value)}
                placeholder="z.B. KBS, BfGS, GIB ..."
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-100"
              />
            </div>
          </div>

          <div className="mt-6 space-y-2">
            {poll.date_options.map((d) => {
              const avail = selections[d.date] as Availability | undefined;
              const cfg = avail ? AVAILABILITY_CONFIG[avail] : null;

              return (
                <button
                  key={d.date}
                  type="button"
                  onClick={() => cycleAvailability(d.date)}
                  className={`flex w-full items-center justify-between rounded-lg border-2 px-4 py-3 text-left transition-all ${
                    cfg
                      ? `${cfg.bg}`
                      : "border-zinc-200 bg-zinc-50 hover:border-zinc-300"
                  }`}
                >
                  <span className="text-sm font-medium text-zinc-900">
                    {d.label}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      cfg
                        ? `${cfg.text}`
                        : "text-zinc-400"
                    }`}
                  >
                    {avail ? (
                      <>
                        <AvailabilityIcon type={avail} />
                        {cfg!.label}
                      </>
                    ) : (
                      "Anklicken"
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-zinc-500">
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full bg-green-200 border border-green-400" />
              Ja, passt
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full bg-yellow-200 border border-yellow-400" />
              Vielleicht
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-full bg-red-200 border border-red-400" />
              Nein, geht nicht
            </span>
          </div>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-zinc-950 px-6 text-sm font-semibold text-white shadow-md transition-all hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-300 disabled:opacity-60"
          >
            {submitting ? "Wird gespeichert..." : "Verfügbarkeit eintragen"}
          </button>
        </form>
      ) : (
        <div className="rounded-xl border-2 border-green-200 bg-green-50 p-6 text-center">
          <svg
            className="mx-auto h-10 w-10 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <p className="mt-3 text-lg font-semibold text-green-800">
            Danke für deine Rückmeldung!
          </p>
          <p className="mt-1 text-sm text-green-700">
            Deine Verfügbarkeit wurde gespeichert. Du kannst sie jederzeit
            aktualisieren, indem du das Formular mit derselben E-Mail-Adresse
            erneut ausfüllst.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-4 text-sm font-medium text-green-700 underline hover:text-green-900"
          >
            Antwort ändern
          </button>
        </div>
      )}
    </div>
  );
}
