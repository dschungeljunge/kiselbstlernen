-- Migration: Multiplikatoren-Terminfindung (Doodle-artiges Poll-System)
-- Idempotent: kann erneut ausgeführt werden, wenn Tabellen bereits existieren.

CREATE TABLE IF NOT EXISTS multiplikator_polls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  date_options jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS multiplikator_poll_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id uuid NOT NULL REFERENCES multiplikator_polls(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  selections jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(poll_id, email)
);

ALTER TABLE multiplikator_poll_responses
  ADD COLUMN IF NOT EXISTS teilschule text NOT NULL DEFAULT '';

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at_poll_responses ON multiplikator_poll_responses;
CREATE TRIGGER set_updated_at_poll_responses
  BEFORE UPDATE ON multiplikator_poll_responses
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

ALTER TABLE multiplikator_polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE multiplikator_poll_responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated read polls" ON multiplikator_polls;
CREATE POLICY "Authenticated read polls"
  ON multiplikator_polls FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated read responses" ON multiplikator_poll_responses;
CREATE POLICY "Authenticated read responses"
  ON multiplikator_poll_responses FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated insert responses" ON multiplikator_poll_responses;
CREATE POLICY "Authenticated insert responses"
  ON multiplikator_poll_responses FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated update responses" ON multiplikator_poll_responses;
CREATE POLICY "Authenticated update responses"
  ON multiplikator_poll_responses FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Seed / Sync: bestehenden Poll aktualisieren oder einen anlegen
UPDATE multiplikator_polls
SET
  title = 'Vorbereitungskurs Multiplikator:innen',
  description = 'Halbtägiger Vorbereitungskurs für die Rolle als Multiplikator:in beim KI-Kompass Rollout.',
  date_options = '[
    {"date": "2026-06-03", "label": "Mi, 3. Juni 2026, 13:30–16:30"},
    {"date": "2026-06-04", "label": "Do, 4. Juni 2026, 13:30–16:30"},
    {"date": "2026-06-05", "label": "Fr, 5. Juni 2026, 17:00–20:00"},
    {"date": "2026-06-10", "label": "Mi, 10. Juni 2026, 13:30–16:30"},
    {"date": "2026-06-19", "label": "Fr, 19. Juni 2026, 17:00–20:00"},
    {"date": "2026-06-24", "label": "Mi, 24. Juni 2026, 13:30–16:30"},
    {"date": "2026-06-25", "label": "Do, 25. Juni 2026, 13:30–16:30"}
  ]'::jsonb
WHERE title IN (
  'Weiterbildungstag Multiplikatoren',
  'Vorbereitungskurs Multiplikator:innen'
);

INSERT INTO multiplikator_polls (title, description, date_options)
SELECT
  'Vorbereitungskurs Multiplikator:innen',
  'Halbtägiger Vorbereitungskurs für die Rolle als Multiplikator:in beim KI-Kompass Rollout.',
  '[
    {"date": "2026-06-03", "label": "Mi, 3. Juni 2026, 13:30–16:30"},
    {"date": "2026-06-04", "label": "Do, 4. Juni 2026, 13:30–16:30"},
    {"date": "2026-06-05", "label": "Fr, 5. Juni 2026, 17:00–20:00"},
    {"date": "2026-06-10", "label": "Mi, 10. Juni 2026, 13:30–16:30"},
    {"date": "2026-06-19", "label": "Fr, 19. Juni 2026, 17:00–20:00"},
    {"date": "2026-06-24", "label": "Mi, 24. Juni 2026, 13:30–16:30"},
    {"date": "2026-06-25", "label": "Do, 25. Juni 2026, 13:30–16:30"}
  ]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM multiplikator_polls);
