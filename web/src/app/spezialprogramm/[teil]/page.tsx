import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  SPEZIALPROGRAMM_TEILE,
  getLoomEmbedUrl,
  getLoomShareUrl,
  getSpezialprogrammTeil,
  type SpezialprogrammLink,
  type SpezialprogrammVideo,
} from "@/lib/spezialprogramm";

export function generateStaticParams() {
  return SPEZIALPROGRAMM_TEILE.map((teil) => ({
    teil: teil.slug,
  }));
}

export async function generateMetadata(
  props: PageProps<"/spezialprogramm/[teil]">,
): Promise<Metadata> {
  const params = await props.params;
  const teil = getSpezialprogrammTeil(params.teil);

  if (!teil) {
    return {
      title: "Spezialprogramm | KI-Kompass",
    };
  }

  return {
    title: `Teil ${teil.number}: ${teil.title} | Spezialprogramm`,
    description: teil.intro,
  };
}

function VideoCard({ video }: { video: SpezialprogrammVideo }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="aspect-video bg-zinc-100">
        <iframe
          src={getLoomEmbedUrl(video.loomId)}
          title={video.title}
          allowFullScreen
          className="h-full w-full"
        />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-zinc-950">{video.title}</h3>
        <p className="mt-2 text-sm leading-6 text-zinc-600">{video.description}</p>
        <a
          href={getLoomShareUrl(video.loomId)}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex text-sm font-semibold text-zinc-950 hover:underline"
        >
          Video in Loom öffnen &rarr;
        </a>
      </div>
    </article>
  );
}

function ActionLink({ link }: { link: SpezialprogrammLink }) {
  const className =
    "rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-left transition-all hover:border-yellow-400 hover:bg-yellow-50 focus:outline-none focus:ring-4 focus:ring-yellow-100";

  const content = (
    <>
      <span className="block text-sm font-semibold text-zinc-950">{link.label}</span>
      <span className="mt-1 block text-sm leading-6 text-zinc-600">{link.description}</span>
    </>
  );

  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      {content}
    </Link>
  );
}

export default async function SpezialprogrammTeilPage(
  props: PageProps<"/spezialprogramm/[teil]">,
) {
  const params = await props.params;
  const teil = getSpezialprogrammTeil(params.teil);

  if (!teil) {
    notFound();
  }

  const currentIndex = SPEZIALPROGRAMM_TEILE.findIndex((item) => item.slug === teil.slug);
  const previousTeil = SPEZIALPROGRAMM_TEILE[currentIndex - 1];
  const nextTeil = SPEZIALPROGRAMM_TEILE[currentIndex + 1];

  return (
    <>
      <div className="relative overflow-hidden bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-400">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        <div className="relative px-6 py-14">
          <div className="mx-auto max-w-4xl">
            <Link
              href="/spezialprogramm"
              className="text-sm font-semibold text-zinc-800 hover:underline"
            >
              &larr; Spezialprogramm
            </Link>
            <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-zinc-800">
              Teil {teil.number}
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-zinc-950 md:text-5xl">
              {teil.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-800 md:text-lg">
              {teil.intro}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/75 p-4 shadow-sm ring-1 ring-white/50">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-600">
                  Dauer
                </p>
                <p className="mt-1 text-sm font-semibold text-zinc-950">{teil.duration}</p>
              </div>
              <div className="rounded-2xl bg-white/75 p-4 shadow-sm ring-1 ring-white/50">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-600">
                  Ergebnis
                </p>
                <p className="mt-1 text-sm font-semibold text-zinc-950">
                  Ein konkreter nächster Schritt für deine Praxis
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-zinc-50 px-6">
        <main className="mx-auto w-full max-w-4xl pb-20 pt-12">
          <section className="rounded-2xl border border-yellow-300 bg-gradient-to-br from-yellow-50 to-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-yellow-700">
              Ziel dieses Teils
            </p>
            <h2 className="mt-2 text-xl font-bold text-zinc-950">
              Worum es hier geht
            </h2>
            <p className="mt-3 text-base leading-7 text-zinc-700">{teil.goal}</p>
          </section>

          {teil.videos.length > 0 && (
            <section className="mt-8">
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Videos
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-zinc-950">
                    Schritt für Schritt ansehen
                  </h2>
                </div>
                <p className="text-sm text-zinc-500">
                  {teil.videos.length} {teil.videos.length === 1 ? "Video" : "Videos"}
                </p>
              </div>
              <div className="grid gap-5">
                {teil.videos.map((video) => (
                  <VideoCard key={video.loomId} video={video} />
                ))}
              </div>
            </section>
          )}

          <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Arbeitsauftrag
            </p>
            <h2 className="mt-1 text-xl font-bold text-zinc-950">
              Was du am Ende festhalten solltest
            </h2>
            <ol className="mt-5 grid gap-3">
              {teil.tasks.map((task, index) => (
                <li
                  key={task}
                  className="flex gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm leading-6 text-zinc-700"
                >
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-yellow-400 text-xs font-bold text-zinc-950">
                    {index + 1}
                  </span>
                  <span>{task}</span>
                </li>
              ))}
            </ol>
          </section>

          {teil.links.length > 0 && (
            <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Weiterarbeiten
              </p>
              <h2 className="mt-1 text-xl font-bold text-zinc-950">
                Passende Links
              </h2>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {teil.links.map((link) => (
                  <ActionLink key={link.href} link={link} />
                ))}
              </div>
            </section>
          )}

          <nav className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {previousTeil ? (
              <Link
                href={previousTeil.href}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-300 bg-white px-5 text-sm font-semibold text-zinc-800 hover:bg-zinc-100 focus:outline-none focus:ring-4 focus:ring-zinc-200"
              >
                &larr; Teil {previousTeil.number}
              </Link>
            ) : (
              <Link
                href="/spezialprogramm"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-300 bg-white px-5 text-sm font-semibold text-zinc-800 hover:bg-zinc-100 focus:outline-none focus:ring-4 focus:ring-zinc-200"
              >
                &larr; Zur Übersicht
              </Link>
            )}

            {nextTeil ? (
              <Link
                href={nextTeil.href}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-950 px-6 text-sm font-semibold text-white hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-200"
              >
                Weiter zu Teil {nextTeil.number} &rarr;
              </Link>
            ) : (
              <Link
                href="/kontakt"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-950 px-6 text-sm font-semibold text-white hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-200"
              >
                Fragen klären
              </Link>
            )}
          </nav>
        </main>
      </div>
    </>
  );
}
