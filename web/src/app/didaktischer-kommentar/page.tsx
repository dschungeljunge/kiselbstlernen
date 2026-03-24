import Link from "next/link";

export default function DidaktischerKommentar() {
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header mit Rücknavigation */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 10H5M8 7l-3 3 3 3" />
            </svg>
            Zurück zur Startseite
          </Link>
        </div>
      </div>

      {/* Hauptinhalt */}
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-12">
          <div className="inline-block rounded-lg bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-900">
            Für Entscheidungsträger
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-950 md:text-5xl">
            Didaktischer Kommentar
          </h1>
          <p className="mt-4 text-xl leading-8 text-zinc-600">
            Grundlegende Designentscheide dieser Weiterbildung für Lehrpersonen zum professionellen Einsatz von Künstlicher Intelligenz
          </p>
        </div>

        {/* Haupttext */}
        <div className="prose prose-zinc max-w-none">
          <div className="rounded-2xl border-2 border-zinc-200 bg-white p-8 shadow-sm">
            
            <h2 className="text-2xl font-bold text-zinc-950">Ausgangslage und Zielgruppe</h2>
            <p className="mt-4 text-base leading-7 text-zinc-700">
              Diese Weiterbildung wurde konzipiert für Lehrpersonen, die sich aus organisatorischem oder implizitem Druck heraus mit dem Thema Künstliche Intelligenz auseinandersetzen – nicht aus intrinsischer Motivation. Die didaktische Architektur berücksichtigt bewusst die Haltungen von Personen, die zwischen pragmatischer Skepsis, professioneller Erschöpfung, kritischer Distanz und defensiver Vermeidung navigieren. Der Kurs ist daher nicht als klassisches Lernangebot konzipiert, sondern als geschützter Entwicklungsraum, in dem professionelles Selbstbild gewahrt und gleichzeitig erste Akzeptanz für den Einsatz von KI als Werkzeug angebahnt werden kann. Erfolg bedeutet in diesem Kontext weniger die Aneignung umfassender Kompetenzen, sondern vielmehr die Reduktion von Widerstand, das Schaffen innerer Ruhe und das Ermöglichen erster praktischer Erfahrungen ohne Bloßstellung oder Leistungsdruck.
            </p>

            <h2 className="mt-10 text-2xl font-bold text-zinc-950">Orientierung statt Wahlfreiheit: Die lineare Führung</h2>
            <p className="mt-4 text-base leading-7 text-zinc-700">
              Ein zentraler Designentscheid liegt in der bewusst linearen Struktur der Weiterbildung. Während moderne E-Learning-Angebote häufig auf Wahlfreiheit und selbstgesteuerte Navigation setzen, wäre dies für die vorliegende Zielgruppe kontraproduktiv. Personen, die wenig technikaffin sind, sich bereits überlastet fühlen oder dem Thema skeptisch gegenüberstehen, profitieren nicht von Offenheit, sondern von Orientierung. Die lineare Führung reduziert Entscheidungsdruck, schafft Klarheit über den Verlauf und minimiert das Risiko von Überforderung oder Abbruch. Gleichzeitig bleibt die Weiterbildung selbstbestimmt: Teilnehmende entscheiden über Tempo, Tiefe der Auseinandersetzung und den Grad der Vertiefung. Es gibt keine Prüfung, keine Bewertung und keinen Zwang zur Vollständigkeit. Diese Kombination aus linearer Struktur und individueller Autonomie ermöglicht es, professionelle Würde zu wahren und gleichzeitig einen niederschwelligen Zugang zu schaffen.
            </p>

            <h2 className="mt-10 text-2xl font-bold text-zinc-950">Schutzraum statt Monitoring: Anonymität als Vertrauensbasis</h2>
            <p className="mt-4 text-base leading-7 text-zinc-700">
              Ein weiteres konstitutives Merkmal dieser Weiterbildung ist die konsequente Anonymisierung. Teilnehmende melden sich nicht mit personenbezogenen Daten an, sondern erhalten nach der ersten interaktiven Übung einen sechsstelligen Code, den sie selbst aufbewahren. Dieser Code dient als einzige Zuordnung zur individuellen Lernhistorie und ermöglicht die Speicherung des Fortschritts, ohne dass Identitäten, Leistungen oder Verhaltensmuster an den Arbeitgeber zurückgemeldet werden. Diese Entscheidung ist didaktisch zentral: Sie schafft einen Schutzraum, in dem Unsicherheiten, Fehler und Lernprozesse ohne Angst vor Bewertung oder institutioneller Kontrolle möglich werden. Die Plattform ist bewusst kein Monitoring-Instrument, sondern ein Erprobungsraum für professionelle Entwicklung. Vertrauen wird nicht durch Überwachung, sondern durch strukturelle Entlastung geschaffen.
            </p>

            <h2 className="mt-10 text-2xl font-bold text-zinc-950">Doppeldecker-Logik: Didaktisches Problem und KI-Feature</h2>
            <p className="mt-4 text-base leading-7 text-zinc-700">
              Alle Übungen folgen einem erkennbaren didaktischen Muster, das als „Doppeldecker-Logik" bezeichnet werden kann. Auf der ersten Ebene wird ein reales, plausibler Praxisproblem aus dem Lehralltag adressiert – etwa die zeitraubende Verarbeitung umfangreicher Konzepttexte, die Notwendigkeit differenzierten Unterrichtsmaterials oder die administrative Dokumentation von Beobachtungen. Auf der zweiten Ebene wird parallel ein spezifisches KI-Feature eingeführt, das schrittweise in seiner Komplexität aufgebaut wird. Diese Parallelisierung ermöglicht es, dass Teilnehmende nicht abstraktes Toolwissen erwerben, sondern handlungsnahe Kompetenzen entwickeln: Sie erleben konkrete Entlastung und lernen gleichzeitig die dafür notwendige Bedienlogik. Der Begriff „Minimalkompetenz" beschreibt diesen Ansatz treffend – es geht nicht um umfassende Beherrschung, sondern um funktionale Handlungsfähigkeit in klar umrissenen Anwendungsfällen.
            </p>

            <h2 className="mt-10 text-2xl font-bold text-zinc-950">Produktivität als pädagogische Wertschöpfung</h2>
            <p className="mt-4 text-base leading-7 text-zinc-700">
              Ein weiterer grundlegender Designentscheid liegt in der Rahmung von Produktivität. Der Begriff wird bewusst nicht als „mehr Output" verstanden, sondern als pädagogische Wertschöpfung. Produktivität entsteht in diesem Verständnis nicht durch Beschleunigung oder Optimierung des Kerngeschäfts Unterricht, sondern durch die gezielte Reduktion von Zeitfressern und belastenden Nebenprozessen. Lehrpersonen sollen mehr ihrer Zeit und Energie dort einsetzen können, wo Lernende tatsächlich erreicht und in Kompetenz- und Wissensaufbau bewegt werden. Diese Rahmung verschiebt den Fokus von effizienzgetriebener Rationalisierung hin zu professioneller Entlastung und pädagogischer Wirksamkeit. KI wird nicht als Mittel zur Leistungssteigerung inszeniert, sondern als Werkzeug zur Rückgewinnung pädagogischer Handlungsspielräume.
            </p>

            <h2 className="mt-10 text-2xl font-bold text-zinc-950">Schiff und Kompass: Die normative Rahmung</h2>
            <p className="mt-4 text-base leading-7 text-zinc-700">
              Die Weiterbildung arbeitet mit zwei metaphorischen Ankern, die das Verhältnis zwischen Mensch und KI normativ rahmen. Das Schiff steht für KI als Werkzeug, das Bewegung ermöglicht und Arbeit unterstützt. Der Kompass symbolisiert menschliche Verantwortung und Orientierung – Ziel, Werte und pädagogische Entscheidungen bleiben bei der Lehrperson. Diese Metaphorik wird bereits im Begrüssungsvideo eingeführt und durchzieht die gesamte Dramaturgie. Sie verhindert ein Autonomie-Narrativ der KI und stellt klar, dass technologische Unterstützung nicht mit professioneller Delegation gleichzusetzen ist. In allen Übungen bleibt die didaktische Entscheidungshoheit explizit bei der Lehrperson; die KI liefert Vorschläge, Struktur und Formulierungen, aber keine pädagogischen Urteile.
            </p>

            <h2 className="mt-10 text-2xl font-bold text-zinc-950">Aktivierung durch personalisierte Interaktion</h2>
            <p className="mt-4 text-base leading-7 text-zinc-700">
              Nach den einleitenden Videos folgt eine erste interaktive Übung, die bewusst als Aktivierung und nicht als Diagnostik konzipiert ist. Teilnehmende werden in einem strukturierten Interview durch praxisnahe Unterrichtssituationen geführt und nehmen Stellung zu ihrem eigenen Handeln. Aus den Antworten generiert ein KI-Chatbot ein kreativ formuliertes Lehrpersonenprofil, das als persönlicher Spiegel und Startpunkt für den weiteren Kursverlauf dient. Dieses Profil ist kein Leistungsindikator, sondern ein Identifikationsangebot: Es macht individuelle Muster sichtbar, fördert Selbstreflexion und schafft einen niederschwelligen Einstieg in die Interaktion mit KI, ohne dabei Bewertung oder Vergleichbarkeit zu implizieren.
            </p>

            <h2 className="mt-10 text-2xl font-bold text-zinc-950">Kritische Klarstellungen für die Implementierung</h2>
            <p className="mt-4 text-base leading-7 text-zinc-700">
              Abschließend sind einige Klarstellungen relevant, die bei der Entscheidung über den Einsatz dieser Weiterbildung im eigenen Team berücksichtigt werden sollten. Erstens: Es gibt keine Leistungsmessung, Zertifizierung oder Evaluation. Der Kurs ist nicht auf Nachweis, sondern auf Erprobung ausgelegt. Zweitens: Es werden keine personenbezogenen Daten erhoben oder an den Arbeitgeber zurückgemeldet. Die Plattform ist strukturell als Entwicklungsraum, nicht als Kontrollinstanz konzipiert. Drittens: Der Kompetenzaufbau ist handlungsnah und funktional, nicht theoretisch oder umfassend. Viertens: KI bleibt in allen Übungen Werkzeug – die didaktische Entscheidung verbleibt bei der Lehrperson. Fünftens: Die Weiterbildung ist für Pflichtteilnehmende konzipiert, nicht für intrinsisch Motivierte; sie arbeitet mit Entlastung, Orientierung und Schutz statt mit Innovationsdruck oder Zukunftsversprechen.
            </p>

            <h2 className="mt-10 text-2xl font-bold text-zinc-950">Umsetzungsstand</h2>
            <p className="mt-4 text-base leading-7 text-zinc-700">
              Der aktuelle Prototyp umfasst den vollständigen Einstiegsbereich mit Begrüßungsvideo, Orientierungsvideo, interaktiver Profilübung und dem vollständig ausgearbeiteten Modul 1 mit drei exemplarischen Übungen. Weitere Module sind konzeptionell vorgesehen, aber noch nicht implementiert. Der vorliegende Stand ermöglicht eine fundierte Einschätzung der didaktischen Architektur, der Kursdramaturgie und der Doppeldecker-Logik und kann als funktionaler Proof of Concept für die Entscheidung über eine breitere Implementierung dienen.
            </p>

          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 rounded-xl bg-gradient-to-br from-yellow-50 to-white border-2 border-yellow-400 p-8 shadow-lg">
          <h3 className="text-xl font-bold text-zinc-950">
            Interesse an dieser Weiterbildung für Ihr Team?
          </h3>
          <p className="mt-3 text-base leading-7 text-zinc-700">
            Diese Plattform steht als Prototyp zur Verfügung. Für Rückfragen zur didaktischen Konzeption, 
            zur technischen Implementierung oder zu möglichen Anpassungen für Ihre Institution wenden Sie 
            sich bitte an die Pädagogische Hochschule FHNW.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-6 py-3 text-base font-semibold text-white shadow-md transition-all hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-300"
            >
              Zur Plattform
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 10h10M12 7l3 3-3 3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-200 bg-white py-8">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-center text-sm text-zinc-600">
            © 2025 Pädagogische Hochschule der Fachhochschule Nordwestschweiz (PH FHNW)
          </p>
        </div>
      </div>
    </div>
  );
}







