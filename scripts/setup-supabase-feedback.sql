-- MuseFlow Feedback Loop — Supabase Table Setup
-- Run this in Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS generation_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  signal_type TEXT NOT NULL CHECK (signal_type IN ('thumbs_up', 'thumbs_down', 'save')),
  user_query TEXT,
  query_rewritten TEXT,
  retrieved_knowledge JSONB,
  generated_theme JSONB,
  model_name TEXT,
  mode TEXT DEFAULT 'wechat'
);

CREATE INDEX IF NOT EXISTS idx_feedback_signal ON generation_feedback(signal_type);
CREATE INDEX IF NOT EXISTS idx_feedback_time ON generation_feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_mode ON generation_feedback(mode);

-- RLS: anonymous users can ONLY INSERT (not SELECT/UPDATE/DELETE)
ALTER TABLE generation_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts" ON generation_feedback
  FOR INSERT WITH CHECK (true);

-- Authenticated users (you via Dashboard) can read
CREATE POLICY "Allow authenticated reads" ON generation_feedback
  FOR SELECT USING (auth.role() = 'authenticated');
