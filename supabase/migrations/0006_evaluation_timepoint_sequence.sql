-- Evaluation robust für beliebig viele Messzeitpunkte (T1..Tn)
-- Messzeitpunkt wird als Reihenfolge pro anon_code modelliert.

ALTER TABLE evaluation_responses
  ADD COLUMN IF NOT EXISTS measurement_index integer;

WITH ranked AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY anon_code
      ORDER BY submitted_at ASC, id ASC
    ) AS rn
  FROM evaluation_responses
)
UPDATE evaluation_responses er
SET measurement_index = ranked.rn
FROM ranked
WHERE er.id = ranked.id
  AND (er.measurement_index IS NULL OR er.measurement_index < 1);

ALTER TABLE evaluation_responses
  ALTER COLUMN measurement_index SET NOT NULL;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_name = 'evaluation_responses'
      AND constraint_type = 'UNIQUE'
      AND constraint_name = 'evaluation_responses_anon_code_timepoint_key'
  ) THEN
    ALTER TABLE evaluation_responses
      DROP CONSTRAINT evaluation_responses_anon_code_timepoint_key;
  END IF;
END $$;

DO $$
DECLARE
  constraint_name_to_drop text;
BEGIN
  SELECT c.conname
    INTO constraint_name_to_drop
  FROM pg_constraint c
  JOIN pg_class t ON c.conrelid = t.oid
  WHERE t.relname = 'evaluation_responses'
    AND c.contype = 'c'
    AND pg_get_constraintdef(c.oid) ILIKE '%timepoint%T1%T2%T3%';

  IF constraint_name_to_drop IS NOT NULL THEN
    EXECUTE format(
      'ALTER TABLE evaluation_responses DROP CONSTRAINT %I',
      constraint_name_to_drop
    );
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_evaluation_responses_code_measurement
  ON evaluation_responses (anon_code, measurement_index);

UPDATE evaluation_responses
SET timepoint = CONCAT('T', measurement_index::text)
WHERE timepoint IS DISTINCT FROM CONCAT('T', measurement_index::text);
