-- Migration: RLS-Policies verschärfen
--
-- VORHER: WITH CHECK (true) / USING (true) = jeder mit dem anon-key kann alles lesen/schreiben.
-- NACHHER: Kein Zugriff über anon-key. Alle DB-Operationen laufen über service_role (bypassed RLS).

-- Alte, offene Policies entfernen
DROP POLICY IF EXISTS "Anyone can create sessions" ON learning_sessions;
DROP POLICY IF EXISTS "Anyone can read their session" ON learning_sessions;
DROP POLICY IF EXISTS "Anyone can update their session" ON learning_sessions;

-- Restriktive Policies: Nur authentifizierte Supabase-User dürfen zugreifen.
-- Da unsere App anonyme Session-Codes nutzt (keine Supabase Auth),
-- greift keine dieser Policies für den anon-key → effektiv kein direkter Zugriff.
-- Alle Zugriffe laufen über die Next.js API-Routen mit service_role.

CREATE POLICY "Authenticated users can read own sessions"
  ON learning_sessions
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert sessions"
  ON learning_sessions
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update sessions"
  ON learning_sessions
  FOR UPDATE
  USING (auth.role() = 'authenticated');
