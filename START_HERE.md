# 🚀 START HERE - Deployment Guide

Welcome! This guide will walk you through deploying your RSVP app to GitHub and Vercel.

## What You're Deploying

A complete, production-ready RSVP application with:
- ✨ Full-screen luxury banner with image upload
- 📝 RSVP form modal with validation
- 🔐 Secure admin dashboard with authentication
- 💾 Supabase database for data persistence
- 📱 Mobile-responsive design
- 🎨 Elegant luxury aesthetic

## The Two SQL Files (Pre-Made)

Your app has two pre-configured SQL files ready to run:

### 1. `setup-db.sql` - Base Tables
Creates the `rsvps` table for storing event submissions.
- Simple: Just stores name, guests, message
- Public access: Anyone can submit an RSVP

### 2. `setup-admin.sql` - Admin Authentication  
Creates complete admin authentication system:
- `admin_users` table - Secure password hashing (bcrypt)
- `admin_sessions` table - 24-hour session management
- Default admin: `admin` / `luxury-event-2024`
- Row Level Security protection

**Both files are automatically executed when you run:**
```bash
pnpm setup-db
```

## 3-Step Deployment Process

### Step 1: Local Testing (5 minutes)
```bash
# Install dependencies
pnpm install

# Create .env.local with your Supabase credentials
echo 'NEXT_PUBLIC_SUPABASE_URL=...' > .env.local
echo 'NEXT_PUBLIC_SUPABASE_ANON_KEY=...' >> .env.local
echo 'SUPABASE_SERVICE_ROLE_KEY=...' >> .env.local

# Setup database
pnpm setup-db

# Test locally
pnpm dev
# Visit http://localhost:3000
```

### Step 2: Push to GitHub (2 minutes)
```bash
git init
git add .
git commit -m "Initial RSVP app"
git remote add origin https://github.com/YOUR/REPO.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel (2 minutes)
1. Go to https://vercel.com/dashboard
2. Click **Add New** → **Project** → Import GitHub repo
3. Add 3 environment variables (same as `.env.local`)
4. Click **Deploy** ✅

**Total time: ~10 minutes**

---

## File Structure Explained

```
project/
├── scripts/
│   ├── setup-db.mjs           ← Run this: pnpm setup-db
│   ├── setup-db.sql           ← Base tables (RSVP)
│   └── setup-admin.sql        ← Admin auth (users, sessions)
│
├── app/
│   ├── page.tsx               ← Landing page with banner
│   ├── admin/login/page.tsx   ← Admin login
│   ├── admin/page.tsx         ← Admin dashboard
│   ├── api/
│   │   ├── rsvp/route.ts      ← RSVP submission API
│   │   └── admin/rsvps/       ← Admin RSVP management API
│   └── globals.css            ← Colors & design tokens
│
├── components/
│   ├── banner-section.tsx     ← Hero banner component
│   ├── rsvp-modal.tsx         ← RSVP form modal
│   └── admin-dashboard.tsx    ← Admin UI (has image upload!)
│
├── README.md                  ← Project overview
├── DEPLOYMENT.md              ← Full deployment guide
├── ADMIN_SETUP.md             ← Admin auth details
├── GITHUB_DEPLOYMENT_CHECKLIST.md ← Step-by-step checklist
└── .env.local                 ← Your Supabase credentials (local only)
```

---

## Your Supabase Credentials

You have these ready to use:
- **Project URL**: `https://kojhlgnctnxfdwdxukjz.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvamhsZ25jdG54ZmR3ZHh1a2p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNDkzMjMsImV4cCI6MjA5MjYyNTMyM30.jaP6l3cRXjZtjwhE-yeOCZ-9m6SLE1rVFdMY3umsAWk`
- **Service Role Key**: (you'll add this to Vercel)
- **Storage Bucket**: `rsvp` (public)

---

## Quick Start Commands

```bash
# 1. Install
pnpm install

# 2. Setup database (runs both SQL files)
pnpm setup-db

# 3. Test locally
pnpm dev
# Visit http://localhost:3000
# Login at /admin/login (admin / luxury-event-2024)

# 4. Push to GitHub
git init && git add . && git commit -m "Initial setup"
git remote add origin https://github.com/YOUR/REPO.git
git push -u origin main

# 5. Deploy to Vercel
# Go to https://vercel.com/dashboard
# Import GitHub repo + add env vars + deploy
```

---

## Admin Features You Get

✅ **Admin Login** (`/admin/login`)
- Username: `admin`
- Password: `luxury-event-2024` ⚠️ Change this!

✅ **Admin Dashboard** (`/admin`)
- View all RSVPs with statistics
- Delete RSVPs
- **NEW: Upload custom banner images**
- Secure 24-hour sessions

---

## Important Notes

### Security
- Passwords are bcrypt hashed (cost factor 10)
- Sessions expire after 24 hours
- Row Level Security protects admin tables
- Service role key never exposed to frontend

### Customization
- Change admin password: See [ADMIN_SETUP.md](./ADMIN_SETUP.md)
- Change colors: Edit `/app/globals.css`
- Change fonts: Edit `/app/layout.tsx`
- Change default banner: Upload in admin dashboard

### Production Checklist
- [ ] Change admin password immediately
- [ ] Verify `rsvp` bucket is PUBLIC in Supabase
- [ ] Test all features on live site
- [ ] Set up monitoring (Vercel logs)
- [ ] Create backup of database

---

## Where to Get Help

| Question | File |
|----------|------|
| How do I deploy? | [DEPLOYMENT.md](./DEPLOYMENT.md) |
| How do I manage admins? | [ADMIN_SETUP.md](./ADMIN_SETUP.md) |
| What does the SQL do? | [scripts/SQL_REFERENCE.md](./scripts/SQL_REFERENCE.md) |
| Step-by-step checklist? | [GITHUB_DEPLOYMENT_CHECKLIST.md](./GITHUB_DEPLOYMENT_CHECKLIST.md) |
| Full project info? | [README.md](./README.md) |

---

## Next Steps

1. **Now**: Follow [GITHUB_DEPLOYMENT_CHECKLIST.md](./GITHUB_DEPLOYMENT_CHECKLIST.md)
2. **Push**: Get code to GitHub
3. **Deploy**: Connect to Vercel
4. **Test**: Verify everything works live
5. **Share**: Send landing page link to guests

---

## Done! 🎉

Once deployed, your RSVP app will be live and ready for:
- Guests to submit RSVPs
- WhatsApp integration for confirmations
- Admin dashboard for RSVP management
- Custom banner uploads

**Total setup time: ~10 minutes**

Questions? Check the docs or test locally first with `pnpm dev`.

**Let's go live! 🚀**
