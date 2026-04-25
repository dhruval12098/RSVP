# 🎯 Quick Reference Card

Keep this handy while deploying!

---

## 1️⃣ Local Setup (5 min)

```bash
pnpm install
pnpm setup-db
pnpm dev
# Visit http://localhost:3000
```

**Test Admin**: `admin` / `luxury-event-2024`
**Admin URL**: http://localhost:3000/admin/login

---

## 2️⃣ GitHub (2 min)

```bash
git init
git add .
git commit -m "Initial setup"
git remote add origin https://github.com/YOUR/REPO.git
git push -u origin main
```

---

## 3️⃣ Vercel (2 min)

1. Go to https://vercel.com/dashboard
2. Click **Add New** → **Project**
3. Import GitHub repo
4. Add 3 env vars:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://kojhlgnctnxfdwdxukjz.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your anon key
   - `SUPABASE_SERVICE_ROLE_KEY` = Your service role key
5. Click **Deploy**

---

## SQL Files at a Glance

| File | What It Does | Run Via |
|------|-------------|---------|
| `setup-db.sql` | Creates `rsvps` table | `pnpm setup-db` |
| `setup-admin.sql` | Creates admin auth system | `pnpm setup-db` |

**Both files run together:**
```bash
pnpm setup-db
```

**Or copy-paste manually:**
See [SQL_COPY_PASTE.md](./SQL_COPY_PASTE.md)

---

## Admin Credentials

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `luxury-event-2024` |

⚠️ **Change immediately before going live!**

How to change:
1. Generate hash: https://bcrypt-generator.com/
2. Run SQL in Supabase:
   ```sql
   UPDATE admin_users
   SET password_hash = '$2a$10/HASH_HERE'
   WHERE username = 'admin';
   ```

---

## Environment Variables

```env
# Local: Create .env.local
# Vercel: Settings → Environment Variables

NEXT_PUBLIC_SUPABASE_URL=https://kojhlgnctnxfdwdxukjz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

---

## Database Tables

### `rsvps`
Stores RSVP submissions
```sql
id | name | guests | message | created_at
```

### `admin_users`
Admin accounts (bcrypt hashed)
```sql
id | username | password_hash | email | is_active
```

### `admin_sessions`
Active sessions (24h expiration)
```sql
id | admin_id | token | created_at | expires_at
```

---

## Key URLs

| Page | URL | Purpose |
|------|-----|---------|
| Landing | `/` | RSVP form with banner |
| Admin Login | `/admin/login` | Admin sign-in |
| Admin Dashboard | `/admin` | View/manage RSVPs, upload banner |

---

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/rsvp` | Submit RSVP |
| `POST` | `/api/admin/login` | Admin login |
| `GET` | `/api/admin/rsvps` | Get all RSVPs (admin) |
| `DELETE` | `/api/admin/rsvps` | Delete RSVP (admin) |

---

## File Structure

```
scripts/
├── setup-db.mjs          ← Run this: pnpm setup-db
├── setup-db.sql          ← Base tables
└── setup-admin.sql       ← Admin auth

app/
├── page.tsx              ← Landing page
├── admin/
│   ├── login/page.tsx    ← Admin login
│   └── page.tsx          ← Admin dashboard
└── api/
    ├── rsvp/route.ts     ← RSVP API
    └── admin/rsvps/      ← Admin API
```

---

## Common Commands

```bash
# Setup
pnpm install
pnpm setup-db

# Development
pnpm dev           # Start local server
pnpm build         # Build for production

# Git
git init
git add .
git commit -m "message"
git push

# Database (optional - manual SQL)
# Go to Supabase SQL Editor
# Copy from SQL_COPY_PASTE.md
```

---

## Deployment Flow

```
Local Setup
    ↓
pnpm setup-db (create tables)
    ↓
Test locally (pnpm dev)
    ↓
Git push to GitHub
    ↓
Import repo in Vercel
    ↓
Add 3 environment variables
    ↓
Click Deploy
    ↓
Change admin password
    ↓
Test on live site
    ↓
Share with guests!
```

---

## Troubleshooting Quick Fixes

| Problem | Fix |
|---------|-----|
| `setup-db` fails | Check `.env.local` credentials |
| Admin login fails | Run `pnpm setup-db` again |
| RSVP form doesn't work | Check Supabase `rsvps` table exists |
| Banner doesn't load | Create `rsvp` bucket in Supabase (PUBLIC) |
| Vercel deployment fails | Add all 3 env vars in Vercel Settings |

---

## Important Reminders

- ⚠️ Change admin password before going live
- ⚠️ Make `rsvp` storage bucket PUBLIC in Supabase
- ⚠️ Don't commit `.env.local` to GitHub (it's in `.gitignore`)
- ⚠️ Service role key stays on backend only
- ⚠️ Test everything locally before deploying

---

## Testing Checklist

Landing Page:
- [ ] Banner loads
- [ ] "RSVP Now" button works
- [ ] Form opens in modal
- [ ] Form validation works
- [ ] WhatsApp redirect works

Admin:
- [ ] Login works
- [ ] Can see RSVPs
- [ ] Can delete RSVPs
- [ ] Can upload banner
- [ ] Logout works

---

## Helpful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://app.supabase.com
- **Bcrypt Generator**: https://bcrypt-generator.com/
- **GitHub**: https://github.com/new

---

## Need More Details?

| Question | Read |
|----------|------|
| How do I deploy? | [GITHUB_DEPLOYMENT_CHECKLIST.md](./GITHUB_DEPLOYMENT_CHECKLIST.md) |
| Admin setup details? | [ADMIN_SETUP.md](./ADMIN_SETUP.md) |
| SQL reference? | [SQL_REFERENCE.md](./scripts/SQL_REFERENCE.md) |
| Full overview? | [README.md](./README.md) |
| Everything? | [FINAL_SUMMARY.md](./FINAL_SUMMARY.md) |

---

## Success Indicators ✅

You'll know it's working when:

- ✅ `pnpm setup-db` completes without errors
- ✅ Tables appear in Supabase (check SQL Editor)
- ✅ Admin can log in at `/admin/login`
- ✅ RSVP form submits and saves data
- ✅ Admin dashboard shows RSVPs
- ✅ Live site on Vercel works like local

---

**You've got this! Deploy now! 🚀**
