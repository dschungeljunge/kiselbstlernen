-- Learning Sessions Table
-- Speichert anonyme Lernfortschritte mit Session-Codes

CREATE TABLE IF NOT EXISTS learning_sessions (
  -- Session Code als Primary Key (z.B. "HL9HML")
  session_code TEXT PRIMARY KEY,
  
  -- Profil-Daten aus Step 3
  profile_name TEXT,
  profile_description TEXT,
  profile_strengths JSONB,
  
  -- Fortschritt
  current_step INTEGER NOT NULL DEFAULT 1,
  completed_steps INTEGER[] DEFAULT ARRAY[]::INTEGER[],
  
  -- Zusätzliche Daten (für spätere Steps)
  step_data JSONB DEFAULT '{}'::JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index für schnellere Lookups
CREATE INDEX IF NOT EXISTS idx_learning_sessions_created_at 
  ON learning_sessions(created_at);

-- Automatisches Update von updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_learning_sessions_updated_at
  BEFORE UPDATE ON learning_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
-- Sessions sind öffentlich lesbar/schreibbar, aber nur mit gültigem Code
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Jeder kann eine Session mit gültigem Code erstellen
CREATE POLICY "Anyone can create sessions"
  ON learning_sessions
  FOR INSERT
  WITH CHECK (true);

-- Policy: Jeder kann seine Session mit dem Code lesen
CREATE POLICY "Anyone can read their session"
  ON learning_sessions
  FOR SELECT
  USING (true);

-- Policy: Jeder kann seine Session mit dem Code aktualisieren
CREATE POLICY "Anyone can update their session"
  ON learning_sessions
  FOR UPDATE
  USING (true);

-- Kommentar für Dokumentation
COMMENT ON TABLE learning_sessions IS 
  'Anonyme Lern-Sessions mit Session-Codes (zebis.digital-Style)';



