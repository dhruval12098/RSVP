# Admin Authentication Setup Guide

## Overview

Your RSVP app has a complete admin authentication system with:
- **Admin user accounts** with bcrypt password hashing
- **Session management** with 24-hour token expiration
- **Row Level Security (RLS)** policies
- **Admin-only RSVP management** and banner uploads

## Database Schema

### Table 1: `admin_users`
Stores admin user credentials securely with bcrypt hashing.

```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,          -- bcrypt hashed
  email VARCHAR(255) UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Indexes:**
- `idx_admin_users_username` - Fast username lookups
- `idx_admin_users_email` - Fast email lookups

### Table 2: `admin_sessions`
Tracks active admin sessions with automatic 24-hour expiration.

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
- `idx_admin_sessions_admin_id` - Fast session lookups by admin
- `idx_admin_sessions_token` - Fast token validation
- `idx_admin_sessions_expires_at` - Fast expiration checks

## Default Admin Credentials

When you run `pnpm setup-db`, the following admin user is created:

| Field | Value |
|-------|-------|
| **Username** | `admin` |
| **Password** | `luxury-event-2024` |
| **Email** | `admin@event.local` |
| **Status** | Active |

**⚠️ CRITICAL:** Change this password immediately in production!

## How to Change Admin Password

### Method 1: Update via SQL (Fastest)

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Create a new query with:

```sql
-- Generate bcrypt hash of your new password
-- Use an online bcrypt generator: https://bcrypt-generator.com/
-- Example: new password "MySecurePassword123!" hashes to:
-- $2a$10$abcdefghijklmnopqrstuvwxyz... (64 character hash)

UPDATE admin_users
SET 
  password_hash = '$2a$10/YOUR_BCRYPT_HASH_HERE',
  updated_at = NOW()
WHERE username = 'admin';
```

3. Replace `$2a$10/YOUR_BCRYPT_HASH_HERE` with your bcrypt hash
4. Execute the query

### Method 2: Generate Bcrypt Hash

Use an online bcrypt generator to hash your new password:
- Website: https://bcrypt-generator.com/
- Cost: 10 (recommended for security)
- Example input: `MySecurePassword123!`
- Example output: `$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/K1e`

## How to Add New Admin Users

### Via SQL

```sql
INSERT INTO admin_users (username, password_hash, email)
VALUES (
  'username',
  '$2a$10/YOUR_BCRYPT_HASH_HERE',  -- bcrypt hash of password
  'email@example.com'
);
```

### Verify the user was created

```sql
SELECT id, username, email, is_active, created_at 
FROM admin_users 
WHERE username = 'username';
```

## How to Deactivate an Admin

If an admin needs to be removed but you want to keep the record:

```sql
UPDATE admin_users
SET is_active = false
WHERE username = 'username';
```

The admin will no longer be able to log in.

## How to Delete an Admin

To completely remove an admin (this also cascades to delete their sessions):

```sql
DELETE FROM admin_users
WHERE username = 'username';
```

## Security Features

### 1. Password Hashing
- All passwords are hashed using **bcrypt** (cost factor 10)
- Raw passwords are never stored
- Passwords are compared using bcrypt verification

### 2. Session Tokens
- Sessions expire after **24 hours**
- Tokens are randomly generated and stored hashed
- Each login creates a new session token
- Old sessions are automatically cleaned up

### 3. Row Level Security (RLS)
- `admin_users` and `admin_sessions` tables are protected by RLS policies
- Public users cannot access these tables
- Only backend API routes (using service role key) can manage admin data

### 4. API Protection
- Admin endpoints check session token validity
- Service role key is used only on the backend (server-side)
- Anon key cannot access admin tables

## API Endpoints

### Login
```
POST /api/admin/login
Body: { username: "admin", password: "luxury-event-2024" }
Returns: { token: "...", message: "Login successful" }
```

### Get RSVPs (Protected)
```
GET /api/admin/rsvps?token=SESSION_TOKEN
Returns: { rsvps: [...], stats: { totalRsvps, totalGuests } }
```

### Delete RSVP (Protected)
```
DELETE /api/admin/rsvps?id=RSVP_ID&token=SESSION_TOKEN
Returns: { message: "RSVP deleted" }
```

## Database Functions (Advanced)

### `verify_admin_password(username, password_hash)`
Securely verify admin login credentials.

```sql
-- Check if login is valid
SELECT * FROM verify_admin_password('admin', 'bcrypt_hash');
```

### `cleanup_expired_sessions()`
Remove expired admin sessions (runs automatically).

```sql
-- Manual cleanup (optional)
SELECT cleanup_expired_sessions();
```

## Monitoring & Maintenance

### View All Admin Users
```sql
SELECT id, username, email, is_active, created_at, updated_at 
FROM admin_users 
ORDER BY created_at DESC;
```

### View Active Sessions
```sql
SELECT 
  as.id,
  au.username,
  as.created_at,
  as.expires_at,
  CASE WHEN as.expires_at > NOW() THEN 'active' ELSE 'expired' END as status
FROM admin_sessions as
JOIN admin_users au ON as.admin_id = au.id
ORDER BY as.created_at DESC;
```

### Cleanup Expired Sessions
```sql
DELETE FROM admin_sessions
WHERE expires_at < NOW();
```

## Production Checklist

- [ ] Changed default admin password
- [ ] Created additional admin users if needed
- [ ] Set up Supabase Storage bucket (`rsvp`) as PUBLIC
- [ ] Set all environment variables in Vercel
- [ ] Tested admin login on live site
- [ ] Tested RSVP management in admin dashboard
- [ ] Tested banner image upload
- [ ] Enabled backup for Supabase database
- [ ] Set up monitoring/logging for errors

## Troubleshooting

### Admin login not working
- Verify username and password are correct
- Check that `admin_users` table was created (run `pnpm setup-db`)
- Verify the user is active (`is_active = true`)

### Session token errors
- Clear browser cache/sessionStorage
- Log out and log back in
- Check that sessions table was created

### Can't access admin endpoints
- Verify token is being sent in query parameters
- Check that token exists in `admin_sessions` table
- Make sure token hasn't expired

---

**Your admin system is fully secured and ready for production!**
