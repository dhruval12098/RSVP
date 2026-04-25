# SQL Files Reference

This document explains the SQL files used to set up your database.

## File 1: `setup-db.sql`

**Purpose**: Creates the base RSVP event tables

**Tables Created:**
- `rsvps` - Stores all event RSVP submissions
- `admin_settings` - Reserved for future admin configuration

**What it does:**
1. Creates the `rsvps` table with columns: id, name, guests, message, created_at
2. Creates indexes for fast lookups on created_at
3. Enables Row Level Security (RLS)
4. Creates a policy allowing public RSVP insertion
5. Blocks all access to admin_settings (protected backend access only)

**Example Data Stored:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Doe",
  "guests": 3,
  "message": "Can't wait!",
  "created_at": "2024-12-20T14:30:00Z"
}
```

---

## File 2: `setup-admin.sql`

**Purpose**: Creates the admin authentication system

**Tables Created:**
- `admin_users` - Stores admin account credentials with bcrypt password hashing
- `admin_sessions` - Tracks active admin sessions with 24-hour expiration

**Key Features:**
- Uses bcrypt password hashing (cost factor 10)
- Automatic session expiration after 24 hours
- Default admin user: `admin` / `luxury-event-2024`
- Row Level Security to prevent public access
- Functions for password verification and session cleanup

**Default Admin User:**
```sql
username: admin
password_hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/K1e
password (plain): luxury-event-2024
email: admin@event.local
```

**Tables Details:**

### `admin_users` Table
```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Indexes:**
- `idx_admin_users_username` - For fast login lookups
- `idx_admin_users_email` - For email searches

### `admin_sessions` Table
```sql
CREATE TABLE admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '24 hours'
);
```

**Indexes:**
- `idx_admin_sessions_admin_id` - For session lookup by admin
- `idx_admin_sessions_token` - For token validation
- `idx_admin_sessions_expires_at` - For expiration checks

---

## How to Run These Files

### Automatic (Recommended)
```bash
pnpm setup-db
```

This runs both SQL files automatically using the Node.js script `setup-db.mjs`.

### Manual via Supabase Console

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Create a new query
3. Copy the content of `setup-db.sql`
4. Execute the query
5. Then copy and execute `setup-admin.sql`

---

## Key SQL Functions

### Password Verification Function
```sql
CREATE OR REPLACE FUNCTION verify_admin_password(
  p_username VARCHAR(255),
  p_password_hash VARCHAR(255)
)
RETURNS TABLE (admin_id UUID, username VARCHAR(255), email VARCHAR(255))
```

Used by the backend to securely verify admin credentials during login.

### Session Cleanup Function
```sql
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void
```

Automatically removes expired admin sessions. Can be called manually or via a scheduled trigger.

---

## Row Level Security (RLS) Policies

All admin tables are protected by RLS policies that:
- Block all public access
- Allow only the backend (via service role key) to manage admin data
- Prevent users from accessing admin credentials

---

## Important Notes

⚠️ **Security**: 
- The password hash shown here is for demonstration only
- Default admin password should be changed immediately
- All passwords are hashed with bcrypt before storage
- Never store plain-text passwords

✅ **Best Practices**:
- Passwords are hashed with bcrypt (cost factor 10)
- Sessions automatically expire after 24 hours
- All admin tables are RLS-protected
- Backend uses service role key for admin operations

---

## Modifying the Schema

### Add a New Admin User
```sql
-- First, generate a bcrypt hash of your password at https://bcrypt-generator.com/
INSERT INTO admin_users (username, password_hash, email)
VALUES ('newadmin', '$2a$10/YOUR_HASH_HERE', 'newadmin@example.com');
```

### Change Admin Password
```sql
-- Generate new bcrypt hash, then:
UPDATE admin_users
SET password_hash = '$2a$10/NEW_HASH_HERE'
WHERE username = 'admin';
```

### Deactivate an Admin
```sql
UPDATE admin_users
SET is_active = false
WHERE username = 'admin';
```

### Delete Expired Sessions
```sql
DELETE FROM admin_sessions
WHERE expires_at < NOW();
```

---

## Testing the Setup

After running both SQL files, verify everything is set up correctly:

```sql
-- Check that rsvps table exists
SELECT COUNT(*) as total_rsvps FROM rsvps;

-- Check that admin user exists
SELECT username, email, is_active FROM admin_users WHERE username = 'admin';

-- Check admin sessions table
SELECT COUNT(*) as active_sessions FROM admin_sessions WHERE expires_at > NOW();
```

---

## File Execution Order

Always run files in this order:
1. **setup-db.sql** (base tables)
2. **setup-admin.sql** (admin authentication)

The `setup-db.mjs` script automatically handles the order when you run `pnpm setup-db`.

---

For more information, see:
- [ADMIN_SETUP.md](../ADMIN_SETUP.md) - Admin authentication details
- [DEPLOYMENT.md](../DEPLOYMENT.md) - Deployment instructions
- [README.md](../README.md) - Project overview
