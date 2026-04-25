-- Admin User Setup
-- Run this after setup-db.sql to create the admin authentication system

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Block all public access - only authenticated backend can access
CREATE POLICY IF NOT EXISTS "Block all public access to admin_users" ON admin_users
  FOR ALL USING (false);

-- Insert default admin user
-- Username: admin
-- Password: luxury-event-2024
-- NOTE: In production, change this password immediately!
INSERT INTO admin_users (username, password_hash, email, is_active)
VALUES (
  'admin',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/K1e', -- bcrypt hash of 'luxury-event-2024'
  'admin@event.local',
  true
)
ON CONFLICT (username) DO NOTHING;

-- Create admin_sessions table for tracking active sessions
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '24 hours'
);

-- Create index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_id ON admin_sessions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions(expires_at);

-- Enable Row Level Security
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Block all public access
CREATE POLICY IF NOT EXISTS "Block all public access to admin_sessions" ON admin_sessions
  FOR ALL USING (false);

-- Create a function to verify admin credentials
CREATE OR REPLACE FUNCTION verify_admin_password(
  p_username VARCHAR(255),
  p_password_hash VARCHAR(255)
)
RETURNS TABLE (
  admin_id UUID,
  username VARCHAR(255),
  email VARCHAR(255)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    au.id,
    au.username,
    au.email
  FROM admin_users au
  WHERE au.username = p_username
    AND au.password_hash = p_password_hash
    AND au.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM admin_sessions
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Optional: Create a trigger to auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_users_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF NOT EXISTS admin_users_update_timestamp ON admin_users;
CREATE TRIGGER admin_users_update_timestamp
BEFORE UPDATE ON admin_users
FOR EACH ROW
EXECUTE FUNCTION update_admin_users_timestamp();

-- Informational comments
COMMENT ON TABLE admin_users IS 'Stores admin user credentials. Password hashes use bcrypt.';
COMMENT ON TABLE admin_sessions IS 'Stores active admin sessions with 24-hour expiration.';
COMMENT ON FUNCTION verify_admin_password(VARCHAR, VARCHAR) IS 'Securely verify admin login credentials.';
COMMENT ON FUNCTION cleanup_expired_sessions() IS 'Remove expired admin sessions (call periodically).';

-- Default Admin Credentials (for reference only - stored hashed above)
-- Username: admin
-- Password: luxury-event-2024
-- IMPORTANT: Change this immediately in production!
