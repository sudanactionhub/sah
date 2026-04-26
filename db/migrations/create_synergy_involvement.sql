/**
 * Supabase Migration: Create synergy_involvement table
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

-- Create synergy_involvement table
CREATE TABLE IF NOT EXISTS synergy_involvement (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Contact fields
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT,
  message TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE synergy_involvement ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from authenticated and anonymous users
CREATE POLICY "Allow public inserts" ON synergy_involvement
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow admins to read all records
CREATE POLICY "Allow admin read" ON synergy_involvement
  FOR SELECT
  USING (auth.jwt() ->> 'role' = 'super_admin');