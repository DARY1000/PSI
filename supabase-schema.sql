-- =====================================================
-- Wadagni Simulateur — Schéma Supabase
-- Exécuter dans : Supabase Dashboard → SQL Editor
-- =====================================================

-- Visites (page_view)
CREATE TABLE IF NOT EXISTS visits (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  referrer TEXT DEFAULT 'direct',
  langue_navigateur TEXT DEFAULT 'fr',
  screen TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Résultats générés
CREATE TABLE IF NOT EXISTS results (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  profil TEXT NOT NULL,
  region TEXT NOT NULL,
  concerns TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Questions FAQ
CREATE TABLE IF NOT EXISTS questions (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  question TEXT NOT NULL,
  langue_reponse TEXT DEFAULT 'fr',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partages WhatsApp
CREATE TABLE IF NOT EXISTS shares (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  profil TEXT,
  region TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions (durée)
CREATE TABLE IF NOT EXISTS sessions (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  duration_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Événements génériques
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_visits_created ON visits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_results_region ON results(region);
CREATE INDEX IF NOT EXISTS idx_results_profil ON results(profil);
CREATE INDEX IF NOT EXISTS idx_questions_created ON questions(created_at DESC);

-- Activer Row Level Security (sécurité)
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Politique : la clé anon peut INSERT (écriture tracking) mais pas SELECT (lecture admin)
-- La lecture se fait via la fonction Netlify avec la service_role key

CREATE POLICY "Allow insert visits" ON visits FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert results" ON results FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert questions" ON questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert shares" ON shares FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert sessions" ON sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert events" ON events FOR INSERT WITH CHECK (true);

-- Pour que la fonction admin puisse lire, utiliser SUPABASE_SERVICE_KEY
-- (pas anon key) dans les variables Netlify pour admin-data.js
