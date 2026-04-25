# Deployment Guide: RSVP App to GitHub & Vercel

## Step 1: Download & Setup Locally

1. **Download the ZIP file** from v0 (click the 3-dot menu → Download ZIP)
2. **Extract** the ZIP to your local machine
3. **Open terminal** in the project folder
4. **Install dependencies**: `pnpm install`

## Step 2: Setup Environment Variables Locally

Create a `.env.local` file in the project root with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://kojhlgnctnxfdwdxukjz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvamhsZ25jdG54ZmR3ZHh1a2p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNDkzMjMsImV4cCI6MjA5MjYyNTMyM30.jaP6l3cRXjZtjwhE-yeOCZ-9m6SLE1rVFdMY3umsAWk
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Step 3: Setup Supabase Database

### 3a. Create Storage Bucket

1. Go to your Supabase project: https://app.supabase.com/project/kojhlgnctnxfdwdxukjz/storage/buckets
2. Click **Create a new bucket**
3. Name it: `rsvp`
4. Set it to **PUBLIC** (important!)
5. Click **Create bucket**

### 3b. Run Database Setup Script

```bash
pnpm setup-db
```

This script will:
- Create the `rsvps` table for event RSVPs
- Create the `admin_users` table for admin authentication
- Create the `admin_sessions` table for session management
- Set up Row Level Security policies
- Create the default admin user

**Default Admin Credentials:**
- Username: `admin`
- Password: `luxury-event-2024`

**⚠️ IMPORTANT:** Change this password immediately in production!

## Step 4: Test Locally

```bash
pnpm dev
```

Visit `http://localhost:3000` and test:
- RSVP form submission
- Admin login at `/admin/login`
- Banner image upload in admin dashboard

## Step 5: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial RSVP app setup"

# Add your GitHub repo as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 6: Deploy to Vercel

### Option A: Via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Select the repository you just pushed
5. Click **Import**
6. Set **Environment Variables** in the "Environment Variables" section:
   - `NEXT_PUBLIC_SUPABASE_URL=https://kojhlgnctnxfdwdxukjz.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...` (your anon key)
   - `SUPABASE_SERVICE_ROLE_KEY=...` (your service role key)
7. Click **Deploy**

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Add environment variables when prompted
# Then deploy with env vars:
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel deploy --prod
```

## Step 7: Post-Deployment

1. **Verify the app** at your Vercel domain
2. **Test the complete flow**:
   - RSVP submission
   - WhatsApp redirect
   - Admin login and dashboard
   - Banner upload

3. **Change Admin Password** (do this immediately!):
   - Log in to admin dashboard
   - Go to Supabase SQL Editor
   - Update the admin password using bcrypt hash of your new password

## Environment Variables Reference

| Variable | Value | Required |
|----------|-------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key | Yes |

## Troubleshooting

### "Bucket not found" error
- Make sure the `rsvp` bucket exists in Supabase Storage
- Make sure it's set to **PUBLIC**

### "Admin login fails"
- Run `pnpm setup-db` again to ensure admin user exists
- Verify `SUPABASE_SERVICE_ROLE_KEY` is correct

### "RSVP form not submitting"
- Check browser console for errors
- Verify environment variables are loaded correctly
- Check Supabase project logs for any issues

### Images not loading
- Make sure Supabase Storage bucket is **PUBLIC**
- Check that images were uploaded correctly to the bucket

## File Structure

```
/vercel/share/v0-project/
├── app/
│   ├── api/
│   │   ├── admin/
│   │   │   ├── login/route.ts       # Admin login endpoint
│   │   │   └── rsvps/route.ts       # Admin RSVP management
│   │   └── rsvp/route.ts            # RSVP submission
│   ├── admin/
│   │   ├── login/page.tsx           # Admin login page
│   │   └── page.tsx                 # Admin dashboard
│   ├── layout.tsx
│   ├── globals.css
│   └── page.tsx                     # Main landing page
├── components/
│   ├── banner-section.tsx           # Hero banner with image
│   ├── rsvp-modal.tsx              # RSVP form modal
│   ├── admin-dashboard.tsx         # Admin management UI
│   └── ...
├── scripts/
│   ├── setup-db.mjs                # Database setup script
│   ├── setup-db.sql                # Base tables schema
│   └── setup-admin.sql             # Admin authentication schema
└── public/
    └── default-banner.jpg          # Default event banner image
```

## Support

For issues or questions:
1. Check the browser console for error messages
2. Check Supabase logs (Project Settings → Logs)
3. Verify all environment variables are set correctly
4. Run `pnpm setup-db` again to reinitialize the database

---

**Ready to go live! 🚀**
