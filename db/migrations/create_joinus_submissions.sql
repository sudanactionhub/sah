/**
 * Supabase Migration: Create joinus_submissions table
 * 
 * Run this in the Supabase SQL Editor to create the table structure
 * 
 * Steps:
 * 1. Go to Supabase Dashboard > SQL Editor
 * 2. Create a new query
 * 3. Copy-paste this entire file
 * 4. Run the query
 * 5. The table will be created and ready for submissions
 */

-- Create joinus_submissions table
CREATE TABLE IF NOT EXISTS joinus_submissions (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Key contact fields
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  location VARCHAR(500),
  
  -- Submission details
  availability VARCHAR(255),
  interests JSONB, -- Array of selected contribution areas
  payload_json JSONB NOT NULL, -- Full form data

  -- Metadata
  user_agent VARCHAR(2000),
  ip_address VARCHAR(45)
);

-- Create index on email for faster lookups
CREATE INDEX idx_joinus_submissions_email ON joinus_submissions (email);

-- Create index on created_at for time-based queries
CREATE INDEX idx_joinus_submissions_created_at ON joinus_submissions (created_at DESC);

-- Enable RLS (Row-Level Security)
ALTER TABLE joinus_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy: only authenticated admins can select
CREATE POLICY "admin_select_joinus_submissions"
  ON joinus_submissions
  FOR SELECT
  USING (
    auth.jwt() ->> 'email' IN (
      SELECT email FROM profiles WHERE role = 'super_admin'
    )
  );

-- Create policy: authenticated users can insert
CREATE POLICY "public_insert_joinus_submissions"
  ON joinus_submissions
  FOR INSERT
  WITH CHECK (TRUE);

-- Note: These policies are basic. For production, implement proper authentication checks.
-- Consider using Supabase Auth or your own authentication system.

-- Optional: Add materialized view for admin dashboard
CREATE MATERIALIZED VIEW joinus_submissions_summary AS
SELECT 
  COUNT(*) as total_submissions,
  COUNT(DISTINCT email) as unique_submitters,
  COUNT(CASE WHEN availability = 'Leadership or advisory capacity' THEN 1 END) as leadership_interested,
  COUNT(CASE WHEN availability = 'Regular, structured involvement' THEN 1 END) as regular_involved,
  MAX(created_at) as latest_submission,
  MIN(created_at) as earliest_submission
FROM joinus_submissions;

-- Optional: Add function to search submissions
CREATE OR REPLACE FUNCTION search_joinus_submissions(search_term TEXT)
RETURNS TABLE (
  id BIGINT,
  name VARCHAR,
  email VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE,
  availability VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    js.id,
    js.name,
    js.email,
    js.created_at,
    js.availability
  FROM joinus_submissions js
  WHERE 
    js.name ILIKE '%' || search_term || '%'
    OR js.email ILIKE '%' || search_term || '%'
    OR js.location ILIKE '%' || search_term || '%'
  ORDER BY js.created_at DESC;
END;
$$ LANGUAGE plpgsql;
