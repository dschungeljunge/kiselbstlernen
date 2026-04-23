-- Evaluationen für Lehrpersonen (T1/T2/T3)
-- Antwortdaten werden über anonymisierten Code verknüpft.

CREATE TABLE IF NOT EXISTS evaluation_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anon_code text NOT NULL,
  timepoint text NOT NULL CHECK (timepoint IN ('T1', 'T2', 'T3')),
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (anon_code, timepoint)
);

CREATE INDEX IF NOT EXISTS idx_evaluation_responses_code
  ON evaluation_responses(anon_code);

CREATE INDEX IF NOT EXISTS idx_evaluation_responses_submitted_at
  ON evaluation_responses(submitted_at);

DROP TRIGGER IF EXISTS update_evaluation_responses_updated_at ON evaluation_responses;
CREATE TRIGGER update_evaluation_responses_updated_at
  BEFORE UPDATE ON evaluation_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE evaluation_responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can create evaluation responses" ON evaluation_responses;
CREATE POLICY "Anyone can create evaluation responses"
  ON evaluation_responses
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can read evaluation responses" ON evaluation_responses;
CREATE POLICY "Anyone can read evaluation responses"
  ON evaluation_responses
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can update evaluation responses" ON evaluation_responses;
CREATE POLICY "Anyone can update evaluation responses"
  ON evaluation_responses
  FOR UPDATE
  USING (true);
