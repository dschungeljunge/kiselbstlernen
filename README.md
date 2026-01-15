# KI-Kompass – Online-Weiterbildung für Lehrpersonen

> **Eine strukturierte Lernreise zum professionellen, verantwortungsbewussten Einsatz von KI im Berufsalltag**

**Zielgruppe:** Lehrpersonen des BBZ Olten  
**Entwicklung:** Peter Rigert, PH FHNW  
**Status:** Prototyp (Stand: Januar 2026)

---

## 📋 Über das Projekt

Der **KI-Kompass** ist eine Online-Weiterbildungsplattform, die Lehrpersonen beim kompetenten Einsatz von KI-Tools im Unterrichtsalltag begleitet. Die Plattform folgt einer **linearen Lernreise** durch 10 aufeinander aufbauende Schritte und nutzt die **Doppeldecker-Logik**: Jede Übung verbindet ein reales Praxisproblem mit einem konkreten KI-Feature.

### Kernprinzipien

- ✅ **Linear geführt, selbstbestimmt** – klare Abfolge ohne Zeitdruck
- ✅ **Geschützter Entwicklungsraum** – anonyme Lern-Codes statt Accounts
- ✅ **Doppeldecker-Logik** – handlungsnahe Kompetenzen statt abstraktes Toolwissen
- ✅ **Produktivität als Wertschöpfung** – Entlastung bei administrativen Aufgaben
- ✅ **Keine Prüfung, keine Bewertung** – selbstgesteuertes, reflexives Lernen

### Features

- 🎯 **10 strukturierte Lernschritte** mit integrierter KI-Reflexion
- 💬 **Interaktiver Profil-Chat** zur Erstellung eines personalisierten Lernerprofils
- 🧠 **Reflexions-Chat** zur Vertiefung und zum Merkstze-Generieren
- 🔐 **Anonyme Sessions** – Fortschritt wird über Lern-Codes gespeichert (keine personenbezogenen Daten)
- 📊 **Session-Manager** – automatisches Speichern und Wiederherstellen des Lernfortschritts
- 🎨 **Moderne UI** mit FHNW-Branding (gelb), Tailwind CSS, Flowbite, Framer Motion

---

## 🚀 Schnellstart (Lokal)

### 1. Installation

```bash
cd web
npm install
```

### 2. Umgebungsvariablen konfigurieren

Kopieren Sie `web/ENV.example` zu `web/.env.local` und füllen Sie die Werte aus:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://ihr-projekt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ihr-anon-key
OPENAI_API_KEY=sk-...
```

Die Supabase-Werte finden Sie in Ihrem Supabase-Dashboard unter:  
→ Settings → API → Project URL & API keys

### 3. Entwicklungsserver starten

```bash
npm run dev
```

Die Anwendung läuft dann unter `http://localhost:3000`

---

## 📁 Projektstruktur

```
.
├── web/                          # Next.js Anwendung
│   ├── src/
│   │   ├── app/                  # App Router
│   │   │   ├── page.tsx          # Startseite (Hero, Quiz, Coach-Profil)
│   │   │   ├── step/[1-10]/      # 10 Lernschritte
│   │   │   ├── api/               # API Routes
│   │   │   │   ├── profile-chat/  # Profil-Chat mit OpenAI
│   │   │   │   ├── reflection-chat/ # Reflexions-Chat
│   │   │   │   └── session/       # Session laden/speichern
│   │   │   ├── login/             # Login-Seite (Magic Link)
│   │   │   ├── didaktischer-kommentar/ # Didaktisches Konzept
│   │   │   ├── barrierefreiheit/  # Barrierefreiheitserklärung
│   │   │   ├── datenschutz/       # Datenschutzerklärung
│   │   │   ├── impressum/         # Impressum
│   │   │   └── kontakt/           # Kontaktseite
│   │   ├── components/            # React-Komponenten
│   │   │   ├── CoachProfile.tsx   # Coach-Profil (Peter Rigert)
│   │   │   ├── RelevanceQuiz.tsx  # Interaktives Relevanz-Quiz
│   │   │   ├── SessionExplainer.tsx # Session-Erklärung
│   │   │   ├── ProgressDrawer.tsx # Fortschrittsanzeige
│   │   │   └── Footer.tsx         # Footer mit Links
│   │   ├── contexts/
│   │   │   └── SessionContext.tsx # Session-State-Management
│   │   └── lib/
│   │       ├── supabase/          # Supabase Client (Browser & Server)
│   │       ├── session-manager.ts # Session-Logik
│   │       └── cn.ts              # Utility (clsx + tailwind-merge)
│   └── public/                    # Statische Assets
├── supabase/
│   └── migrations/                # Datenbank-Migrationen
│       ├── 0001_learning_sessions.sql
│       └── 0002_add_reflection_merksatz.sql
├── archive/                       # Konzeptdokumente
│   └── konzept.md
├── SKELETT.md                     # Projekt-Skelett & Architektur
├── IMPLEMENTATION_LOG.md          # Implementierungsdetails
├── todo.md                        # Offene Aufgaben
└── vercel.json                    # Vercel-Konfiguration
```

---

## 🔧 Technologie-Stack

| Bereich | Technologie | Version |
|---------|-------------|---------|
| **Frontend** | Next.js (App Router) | 16.1.1 |
| **UI Framework** | React | 19.2.3 |
| **Styling** | Tailwind CSS | 4.x |
| **UI-Komponenten** | Flowbite | 4.0.1 |
| **Animation** | Framer Motion | 12.23.26 |
| **Backend** | Supabase (Auth, DB, Storage) | 2.49.1 |
| **AI** | OpenAI API | 6.15.0 |
| **Sprache** | TypeScript | 5.x |
| **Deployment** | Vercel | – |

---

## 🌐 Deployment auf Vercel

### 1. Projekt importieren

- Gehen Sie zu [vercel.com/new](https://vercel.com/new)
- Importieren Sie Ihr GitHub/GitLab Repository

### 2. Build-Konfiguration

- **Root Directory:** `web`
- **Framework Preset:** Next.js (wird automatisch erkannt)
- **Build Command:** `npm run build`
- **Output Directory:** `.next`

### 3. Umgebungsvariablen hinzufügen

Fügen Sie in den Vercel-Projekteinstellungen unter **Environment Variables** hinzu:

```
NEXT_PUBLIC_SUPABASE_URL=https://ihr-projekt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
OPENAI_API_KEY=sk-...
```

### 4. Deploy

Klicken Sie auf **Deploy** – Vercel baut und veröffentlicht die Anwendung automatisch.

---

## 🗄️ Datenbank-Setup (Supabase)

### Migrationen anwenden

Die Datenbank-Migrationen befinden sich in `supabase/migrations/`:

1. **0001_learning_sessions.sql** – Tabelle für Lernsessions (anonyme Codes, Fortschritt, Profil-Daten)
2. **0002_add_reflection_merksatz.sql** – Erweiterung: Reflexions- und Merkstze-Felder

Sie können die Migrationen entweder:
- Direkt im **Supabase SQL Editor** ausführen, oder
- Mit der **Supabase CLI** deployen: `supabase db push`

### Row Level Security (RLS)

Die Sessions-Tabelle verwendet **anonyme Session-Codes** statt User-IDs. RLS-Policies sind entsprechend konfiguriert, sodass nur der Besitzer eines Codes auf dessen Session zugreifen kann.

---

## 📝 Weitere Dokumentation

- **[SKELETT.md](SKELETT.md)** – Projekt-Canvas, Architektur, bewusste Entscheidungen
- **[archive/konzept.md](archive/konzept.md)** – Konzeptionelle Grundlage, didaktisches Modell
- **[IMPLEMENTATION_LOG.md](IMPLEMENTATION_LOG.md)** – Implementierungsdetails und Entscheidungen
- **[todo.md](todo.md)** – Offene Aufgaben und nächste Schritte
- **[didaktische_personas_ki_kurs.md](didaktische_personas_ki_kurs.md)** – Personas für den Kurs

---

## 🆘 Troubleshooting

### 404-Fehler auf Vercel

1. ✅ **Root Directory** muss auf `web` gesetzt sein
2. ✅ Alle **Umgebungsvariablen** korrekt konfiguriert?
3. ✅ **Build Logs** prüfen (Vercel Dashboard → Deployments → Build Logs)
4. ✅ Sicherstellen, dass der Build erfolgreich war

### Build-Fehler lokal

```bash
cd web
npm run build
```

Falls Fehler auftreten:
- TypeScript-Fehler prüfen
- Alle Abhängigkeiten installiert? (`npm install`)
- `.env.local` korrekt konfiguriert?

### Session-Code wird nicht gespeichert

- Supabase-Verbindung prüfen (Console → Netzwerk-Tab)
- Migrationen angewendet?
- RLS-Policies korrekt konfiguriert?

---

## 🧪 Testing

**Manuelle Tests:**
- Lernreise durchlaufen (Step 1-10)
- Profil-Chat testen (Step 1)
- Session-Code speichern und wiederherstellen
- Reflexions-Chat testen (Step 10)

**Empfohlene Testszenarien:**
- Anonyme Session starten → Code notieren → Browser schließen → Code eingeben → Session fortsetzen
- Quiz auf der Startseite durchklicken
- Responsive Design testen (Mobile, Tablet, Desktop)

---

## 📧 Kontakt & Support

**Entwicklung & Konzept:**  
Peter Rigert  
Dozent für Digitale Bildung & KI, PH FHNW

**Support:**  
Bei technischen Problemen oder Fragen zur Weiterbildung wenden Sie sich bitte an:  
→ [Kontaktseite](/kontakt)

---

## 🔒 Datenschutz & Barrierefreiheit

- **Keine personenbezogenen Daten** – nur anonyme Session-Codes
- **Keine Weitergabe an Arbeitgeber** – vollständig geschützter Lernraum
- **WCAG 2.1 Level AA** – barrierefreie Gestaltung
- Weitere Informationen: [Datenschutzerklärung](/datenschutz) | [Barrierefreiheit](/barrierefreiheit)

---

**Prototyp entwickelt im Rahmen der Weiterbildungsentwicklung PH FHNW, 2026**
