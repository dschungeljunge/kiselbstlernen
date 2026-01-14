# KI-Selbstlernen E-Learning Plattform

Eine interaktive E-Learning-Plattform für selbstgesteuertes Lernen mit KI-Unterstützung.

## 🚀 Deployment auf Vercel

### Voraussetzungen

1. **Vercel Account**: Erstellen Sie einen Account auf [vercel.com](https://vercel.com)
2. **Supabase Projekt**: Sie benötigen ein Supabase-Projekt mit konfigurierten Umgebungsvariablen

### Deployment-Schritte

1. **Projekt auf Vercel importieren**
   - Gehen Sie zu [vercel.com/new](https://vercel.com/new)
   - Importieren Sie Ihr GitHub Repository: `https://github.com/dschungeljunge/kiselbstlernen`

2. **Root Directory konfigurieren**
   - In den Projekt-Einstellungen unter "Build & Development Settings"
   - Setzen Sie **Root Directory** auf: `web`
   - Framework Preset sollte automatisch auf **Next.js** erkannt werden

3. **Umgebungsvariablen konfigurieren**
   
   Fügen Sie folgende Umgebungsvariablen in Vercel hinzu:
   
   ```
   NEXT_PUBLIC_SUPABASE_URL=ihre-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=ihr-supabase-anon-key
   OPENAI_API_KEY=ihr-openai-api-key
   ```
   
   Die Supabase-Werte finden Sie in Ihrem Supabase-Dashboard unter:
   - Settings → API → Project URL
   - Settings → API → Project API keys → anon/public

4. **Deploy**
   - Klicken Sie auf "Deploy"
   - Vercel wird automatisch bauen und deployen

### Lokale Entwicklung

1. **Installation**
   ```bash
   cd web
   npm install
   ```

2. **Umgebungsvariablen**
   - Kopieren Sie `web/ENV.example` zu `web/.env.local`
   - Füllen Sie die Variablen mit Ihren Werten

3. **Entwicklungsserver starten**
   ```bash
   npm run dev
   ```

## 📁 Projektstruktur

```
.
├── web/                    # Next.js Anwendung
│   ├── src/
│   │   ├── app/           # App Router (Pages & API Routes)
│   │   ├── components/    # React Komponenten
│   │   ├── contexts/      # React Contexts
│   │   └── lib/           # Utilities & Supabase Client
│   └── public/            # Statische Assets
├── supabase/              # Supabase Migrationen
└── vercel.json            # Vercel Konfiguration
```

## 🔧 Technologie-Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **UI**: Tailwind CSS, Flowbite, Framer Motion
- **Backend**: Supabase (Auth, Database)
- **AI**: OpenAI API
- **Deployment**: Vercel

## 📝 Weitere Dokumentation

- `SKELETT.md` - Projektstruktur und Konzept
- `IMPLEMENTATION_LOG.md` - Implementierungsdetails
- `todo.md` - Offene Aufgaben

## 🆘 Troubleshooting

### 404 Fehler auf Vercel

Wenn Sie einen 404-Fehler erhalten:

1. Überprüfen Sie, dass das **Root Directory** in Vercel auf `web` gesetzt ist
2. Stellen Sie sicher, dass alle **Umgebungsvariablen** korrekt konfiguriert sind
3. Prüfen Sie die **Build Logs** in Vercel auf Fehler
4. Vergewissern Sie sich, dass der Build erfolgreich war

### Build-Fehler

Wenn der Build fehlschlägt:

1. Testen Sie den Build lokal: `npm run build`
2. Überprüfen Sie die TypeScript-Fehler
3. Stellen Sie sicher, dass alle Abhängigkeiten installiert sind

## 📧 Kontakt

Bei Fragen oder Problemen wenden Sie sich bitte an den Projektbetreuer.

