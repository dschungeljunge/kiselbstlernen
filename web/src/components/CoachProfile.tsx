/**
 * CoachProfile Komponente
 * 
 * Zeigt Informationen über den Kursleiter/Coach an.
 * Enthält Bild, Name, Rolle und eine kurze Biografie.
 */

interface CoachProfileProps {
  name?: string;
  role?: string;
  bio?: string;
  imageUrl?: string;
  email?: string;
}

export function CoachProfile({
  name = "Peter Rigert",
  role = "Dozent für Digitale Bildung & KI",
  bio = "Als langjähriger Dozent an der PH FHNW begleite ich Lehrpersonen auf ihrem Weg in die digitale Zukunft. Mein Fokus liegt auf der praktischen Anwendung von KI-Tools im Unterricht und der Entwicklung von zukunftsfähigen Lernszenarien.",
  imageUrl = "/peter-rigert.jpg",
  email,
}: CoachProfileProps) {
  return (
    <div className="rounded-2xl border-2 border-zinc-200 bg-white p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        {/* Profilbild */}
        <div className="flex-shrink-0">
          <div className="relative h-32 w-32 overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-500">
            {/* Echtes Profilbild oder Fallback zu Initialen */}
            <img 
              src={imageUrl} 
              alt={name}
              className="h-full w-full object-cover"
              onError={(e) => {
                // Fallback zu Initialen bei Fehler
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const fallback = document.createElement('div');
                  fallback.className = 'flex h-full w-full items-center justify-center text-4xl font-bold text-zinc-900';
                  fallback.textContent = name.split(' ').map(n => n[0]).join('');
                  parent.appendChild(fallback);
                }
              }}
            />
          </div>
        </div>

        {/* Text-Inhalt */}
        <div className="flex-1">
          <div className="mb-1 inline-block rounded-lg bg-yellow-100 px-3 py-1 text-xs font-semibold text-zinc-900">
            Ihr Coach
          </div>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-zinc-950">
            {name}
          </h3>
          <p className="mt-1 text-sm font-medium text-zinc-600">
            {role}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-zinc-700">
            {bio}
          </p>
          {email && (
            <a
              href={`mailto:${email}`}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-zinc-900 hover:text-yellow-600"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M3 4h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
                <path d="m3 5 7 5 7-5" />
              </svg>
              Kontakt aufnehmen
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

