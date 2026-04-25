-- Create rsvps table
CREATE TABLE IF NOT EXISTS rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  guests INTEGER NOT NULL CHECK (guests > 0),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_settings table for storing admin password hash
CREATE TABLE IF NOT EXISTS admin_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON rsvps(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rsvps table (public can insert, no one can read/update/delete)
CREATE POLICY "Allow public insert on rsvps" ON rsvps
  FOR INSERT WITH CHECK (true);

-- RLS Policies for admin_settings (only admins can access)
-- This will be managed via API authentication
CREATE POLICY "Block all access to admin_settings" ON admin_settings
  FOR ALL USING (false);
