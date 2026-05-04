-- Dokumentierte KI-Unterrichtseinheiten für /reflexion und /sammlung
-- Interne Daten bleiben vollständig gespeichert; öffentliche Abfragen dürfen nur freigegebene,
-- anonymisierte Felder ausgeben.

CREATE TABLE IF NOT EXISTS documented_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_code text REFERENCES learning_sessions(session_code) ON DELETE SET NULL,
  schema_version integer NOT NULL DEFAULT 1,
  title text NOT NULL DEFAULT '',
  summary text NOT NULL DEFAULT '',
  phase1 jsonb NOT NULL DEFAULT '{}'::jsonb,
  dimensions jsonb NOT NULL DEFAULT '{}'::jsonb,
  conclusion jsonb NOT NULL DEFAULT '{}'::jsonb,
  final_summary text NOT NULL DEFAULT '',
  is_public boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_documented_lessons_session_code
  ON documented_lessons(session_code);

CREATE INDEX IF NOT EXISTS idx_documented_lessons_public_published
  ON documented_lessons(is_public, published_at DESC, created_at DESC);

DROP TRIGGER IF EXISTS update_documented_lessons_updated_at ON documented_lessons;
CREATE TRIGGER update_documented_lessons_updated_at
  BEFORE UPDATE ON documented_lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE documented_lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published documented lessons" ON documented_lessons;
CREATE POLICY "Public can read published documented lessons"
  ON documented_lessons
  FOR SELECT
  USING (is_public = true);

COMMENT ON TABLE documented_lessons IS
  'Dokumentierte und reflektierte KI-Unterrichtseinheiten für die öffentliche, anonymisierte Sammlung.';
