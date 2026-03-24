# Canvas – Minimales Projekt-Skelett

**Stand:** 2026-01-13  
**Zweck:** Radikaler Reset – nur die Basis bleibt, Inhalte werden Step-by-Step neu aufgebaut.

---

## 📦 Was ist VORHANDEN (minimales Skelett)

### 1. Konzept & Architektur
- **`archive/konzept.md`** – die konzeptionelle Grundlage (unverändert)

### 2. Web-App (Next.js + Supabase)

#### Technisches Setup
```
web/
├── package.json          # Dependencies: Next.js 16, React 19, Supabase, Tailwind
├── tsconfig.json         # TypeScript-Konfiguration
├── next.config.ts        # Next.js App Router Setup
├── ENV.example           # Environment-Variablen Template
└── eslint.config.mjs     # Linter-Konfiguration
```

#### Supabase-Integration
```
web/src/lib/supabase/
├── client.ts             # Browser-Client (createSupabaseBrowserClient)
├── server.ts             # Server-Client (createSupabaseServerClient)
└── env.ts                # Environment-Variablen Validierung
```

#### Auth-Flow (Magic Link)
```
web/src/app/auth/callback/
└── route.ts              # OAuth Callback Handler
```

```
web/src/app/login/
└── page.tsx              # Login-Seite mit Magic Link Versand
```

#### UI-Basis
```
web/src/app/
├── layout.tsx            # Root Layout (Metadata, Fonts)
├── globals.css           # Tailwind-Basis + Custom Styles
├── page.tsx              # Minimalistische Startseite
└── favicon.ico           # App-Icon
```

#### Utilities
```
web/src/lib/
└── cn.ts                 # className Helper (clsx + tailwind-merge)
```

#### Supabase-Ordner (leer)
```
supabase/                 # Platzhalter für zukünftige Migrations/Seeds
```

---

## 🗑️ Was wurde ENTFERNT

### Content & Module
- ❌ `WB_LP/` (alle Modul-Dokumente)
- ❌ `web/content/` (Steps-Markdown)
- ❌ `archive/` (alle außer `konzept.md`)

### Dokumentation & Planung
- ❌ `coordination/` (Status, Decisions, Interfaces, Handoffs)
- ❌ `qa/` (Testkataloge, Persona-Tests, Smoke-Suite)
- ❌ `db/` (Datenmodell-Dokumentation)
- ❌ `supabase/migrations/`, `supabase/seed/`, `supabase/policies.md`
- ❌ `web/ops/`, `web/docs/`

### Implementierungen
- ❌ `web/src/app/prototype/` (Wizard-Prototyp)
- ❌ `web/src/app/privacy/` (Privacy-Seite)
- ❌ `web/src/app/api/chat/` (Chat-API)
- ❌ `web/src/components/` (ChatStep, LoomEmbed, OverviewDrawer, TimelineStepper)
- ❌ `web/src/lib/curriculum/` (loadStepsFromMarkdown, types)
- ❌ `web/src/lib/privacy.ts`

---

## 🎯 Nächste Schritte (Step-by-Step Aufbau)

Das Projekt ist jetzt bereit für einen **schrittweisen, bewussten Aufbau**:

1. **Datenmodell definieren** (minimal, erweiterbar)
2. **Erste Migration erstellen** (User, Rollen, Kurse)
3. **Lineare Kursstruktur** implementieren (1 Kurs → Module → Lektionen)
4. **AI-Circle-Datenstruktur** als Kern etablieren
5. **PoC-Abgaben** (Text + Upload) implementieren
6. **Fortschritts-Tracking** (minimalistisch)
7. **Diskussion pro Modul** (einfach, ohne Likes/Feeds)
8. **Coach-Übersicht** (wer ist wo?)

---

## 🛠️ Technologie-Stack (unverändert)

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend:** Supabase (Postgres, Auth, Storage, RLS)
- **Deployment:** Vercel (Frontend), Supabase (Backend)
- **Auth:** Magic Link (Supabase Auth)

---

## 📋 Leitplanken (aus konzept.md)

- Geschlossene Nutzergruppe (keine öffentlichen Seiten)
- 1 Kurs mit 3–4 Modulen
- Lineare Abfolge (keine freie Navigation)
- AI-Circle als strukturiertes Datenobjekt (nicht nur Text)
- PoC-Abgaben mit privater Sichtbarkeit
- Diskussion pro Modul
- Fortschritts-Tracking für Teilnehmende & Kursverantwortliche

**Bewusst NICHT im Pilot:**
- Payment / Rechnungslogik
- Zertifikate / Badges
- Automatisiertes KI-Feedback
- Umfassende Analytics
- Öffentliche Landingpages

---

## ✅ Definition of Done (für kommende Features)

Jedes neue Feature ist fertig, wenn:
1. Es in die lineare Lernreise integriert ist
2. Rollenrechte korrekt greifen (RLS + Storage Policies)
3. UI-Zustände konsistent sind (Loading, Empty, Error)
4. AI-Circle-Struktur respektiert wird
5. Kein ausgeschlossener Scope eingeführt wird

---

**Bereit für den Neustart.** 🚀









