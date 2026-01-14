-- Migration: Merksatz-Spalte hinzufügen
-- Speichert den persönlichen Merksatz aus Step 9 (Reflexion)

ALTER TABLE learning_sessions
ADD COLUMN IF NOT EXISTS reflection_merksatz TEXT;

-- Kommentar für Dokumentation
COMMENT ON COLUMN learning_sessions.reflection_merksatz IS 
  'Persönlicher Merksatz aus der Reflexion in Step 9';

