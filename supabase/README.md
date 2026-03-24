# Supabase Setup – Canvas Lernplattform

## 🚀 Migration ausführen

### Variante 1: Über Supabase Dashboard (einfachste Methode)

1. Gehe zu deinem Supabase-Projekt: https://supabase.com/dashboard
2. Navigiere zu **SQL Editor**
3. Öffne die Datei `migrations/0001_learning_sessions.sql`
4. Kopiere den gesamten Inhalt
5. Füge ihn im SQL Editor ein
6. Klicke auf **Run** (oder `Ctrl+Enter`)

### Variante 2: Über Supabase CLI (fortgeschritten)

```bash
# Supabase CLI installieren (falls noch nicht vorhanden)
npm install -g supabase

# Mit deinem Projekt verbinden
supabase link --project-ref <dein-projekt-ref>

# Migration ausführen
supabase db push
```

## 📊 Datenbank-Schema

### Tabelle: `learning_sessions`

| Spalte                | Typ           | Beschreibung                                    |
|-----------------------|---------------|-------------------------------------------------|
| `session_code`        | TEXT (PK)     | 6-stelliger Session-Code (z.B. "HL9HML")       |
| `profile_name`        | TEXT          | Kreativer Profil-Name aus Step 3               |
| `profile_description` | TEXT          | Beschreibung des Profils                       |
| `profile_strengths`   | JSONB         | Array der Stärken                              |
| `current_step`        | INTEGER       | Aktueller Schritt (1-n)                        |
| `completed_steps`     | INTEGER[]     | Abgeschlossene Schritte                        |
| `step_data`           | JSONB         | Zusätzliche Daten (für spätere Steps)          |
| `created_at`          | TIMESTAMPTZ   | Erstellungsdatum                               |
| `updated_at`          | TIMESTAMPTZ   | Letzte Aktualisierung (auto-update via Trigger)|

## 🔒 Row Level Security (RLS)

Die Tabelle nutzt **RLS**, ist aber bewusst offen lesbar/schreibbar für alle. 
**Warum?** Sessions sind **anonym** und enthalten keine personenbezogenen Daten. 
Zugriff erfolgt nur mit gültigem Session-Code.

> **Hinweis:** Für spätere Ausbaustufen (z.B. Coaches) können zusätzliche Policies hinzugefügt werden.

## ✅ Prüfen, ob Migration erfolgreich war

Führe im SQL Editor aus:

```sql
SELECT * FROM learning_sessions LIMIT 1;
```

Wenn keine Fehler kommen, ist die Tabelle angelegt! 🎉

## 🧪 Test-Daten (optional)

```sql
INSERT INTO learning_sessions (
  session_code,
  profile_name,
  profile_description,
  profile_strengths,
  current_step,
  completed_steps
) VALUES (
  'TEST01',
  'Der experimentierfreudige Pragmatiker',
  'Du verbindest praktische Lösungen mit kreativen Ansätzen.',
  '["Kreativität", "Praxisnähe", "Mut zum Experiment"]',
  3,
  ARRAY[1, 2, 3]
);
```

## 📝 Nächste Schritte

1. Migration ausführen
2. `.env.local` mit Supabase-Credentials füllen:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
3. Dev-Server neustarten: `npm run dev`
4. Lernplattform testen!









