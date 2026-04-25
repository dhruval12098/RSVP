# SQL Copy-Paste Guide

If you prefer to manually run SQL instead of using `pnpm setup-db`, copy and paste the exact SQL below.

## How to Use This File

1. Go to: https://app.supabase.com/project/kojhlgnctnxfdwdxukjz/sql/new
2. Click the **+** to create a new query
3. **Copy and paste SECTION 1 below** (everything between the dashes)
4. Click **Run** (or Ctrl+Enter)
5. Wait for success
6. **Then copy and paste SECTION 2 below**
7. Click **Run**
8. Done! Your database is ready.

---

## SECTION 1: Base Tables (Copy & Paste)

Copy everything below and paste into Supabase SQL Editor, then click **Run**:

```sql
-- SECTION 1: BASE RSVP TABLES
-- This creates the rsvps table for event submissions

CREATE TABLE IF NOT EXISTS rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  guests INTEGER NOT NULL CHECK (guests > 0),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON rsvps(created_at DESC);

ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow public insert on rsvps" ON rsvps
  FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Block all access to admin_settings" ON admin_settings
  FOR ALL USING (false);

-- ✅ Section 1 complete!
```

**Expected Result**: You should see "success" with no errors. You now have the `rsvps` table.

---

## SECTION 2: Admin Authentication (Copy & Paste)

Copy everything below and paste into a **NEW** Supabase SQL query, then click **Run**:

```sql
-- SECTION 2: ADMIN AUTHENTICATION
-- This creates admin user accounts and session management

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

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Block all public access
CREATE POLICY IF NOT EXISTS "Block all public access to admin_users" ON admin_users
  FOR ALL USING (false);

-- Insert default admin user
-- Username: admin
-- Password: luxury-event-2024
INSERT INTO admin_users (username, password_hash, email, is_active)
VALUES (
  'admin',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/K1e',
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

-- Create indexes for sessions
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_id ON admin_sessions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions(expires_at);

-- Enable Row Level Security
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Block all public access
CREATE POLICY IF NOT EXISTS "Block all public access to admin_sessions" ON admin_sessions
  FOR ALL USING (false);

-- ✅ Section 2 complete!
-- Your admin user is now created:
-- Username: admin
-- Password: luxury-event-2024
```

**Expected Result**: You should see "success" with no errors. You now have admin tables and the default admin user.

---

## Verify Everything Works

After running both sections, run this quick verification query:

```sql
-- Check rsvps table
SELECT COUNT(*) as rsvps_count FROM rsvps;

-- Check admin_users table
SELECT username, email, is_active FROM admin_users WHERE username = 'admin';

-- Check admin_sessions table exists
SELECT COUNT(*) as sessions_count FROM admin_sessions;
```

Expected output:
- `rsvps_count`: 0 (empty, no submissions yet)
- username: `admin`
- email: `admin@event.local`
- is_active: `true`
- `sessions_count`: 0 (no active sessions yet)

---

## Default Admin Credentials

After running Section 2, you can log in with:

| Field | Value |
|-------|-------|
| **Username** | `admin` |
| **Password** | `luxury-event-2024` |

⚠️ **IMPORTANT**: Change this password in production!

---

## How to Change Admin Password

1. Generate a bcrypt hash of your new password:
   - Go to: https://bcrypt-generator.com/
   - Enter your new password
   - Click Generate
   - Copy the hash (looks like: `$2a$10$...`)

2. Run this SQL query:

```sql
UPDATE admin_users
SET password_hash = '$2a$10/PASTE_YOUR_BCRYPT_HASH_HERE'
WHERE username = 'admin';
```

3. Replace `$2a$10/PASTE_YOUR_BCRYPT_HASH_HERE` with your actual hash

4. Click **Run**

Now you can log in with your new password!

---

## Troubleshooting

### "Relation already exists" error
This is normal if you've run the SQL before. It just means the tables already exist. The `IF NOT EXISTS` clauses prevent errors.

### "Cannot insert duplicate" error on admin user
Just means the admin user already exists. That's fine! You can skip that line.

### Admin login fails
- Make sure you ran **SECTION 2**
- Verify the password hash is correct
- Try the default credentials first: `admin` / `luxury-event-2024`

### Tables not showing up in Supabase
- Refresh the Supabase dashboard
- Check that you're in the correct project
- Verify there were no error messages when running the SQL

---

## What Each Section Does

### Section 1 - Base Tables
- `rsvps` table: Stores all RSVP submissions (name, guests, message)
- `admin_settings`: Reserved for future use
- RLS policies: Allow public RSVP submission only
- Indexes: Speed up queries

### Section 2 - Admin Auth
- `admin_users` table: Admin accounts with bcrypt password hashing
- `admin_sessions` table: Active sessions (expire after 24 hours)
- Default admin: `admin` / `luxury-event-2024`
- RLS policies: Block all public access (backend only)

---

## Next Steps After SQL

1. ✅ Run Section 1 (base tables)
2. ✅ Run Section 2 (admin auth)
3. ✅ Verify the tables were created
4. Test locally: `pnpm dev`
5. Deploy to Vercel

---

## One-Liner Alternative

If you prefer, you can also just run:
```bash
pnpm setup-db
```

This automatically runs both sections for you (no manual SQL needed).

---

**All set! Your database is ready.** 🎉
