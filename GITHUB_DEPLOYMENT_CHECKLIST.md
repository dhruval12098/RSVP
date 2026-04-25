# GitHub & Vercel Deployment Checklist

Follow this checklist to push your RSVP app to GitHub and deploy to Vercel.

## Step 1: Prepare Your Project (Local)

- [ ] Download the project ZIP from v0
- [ ] Extract the ZIP to a folder
- [ ] Open terminal in that folder
- [ ] Run `pnpm install`

## Step 2: Create Local Environment File

- [ ] Create `.env.local` file in project root
- [ ] Add your Supabase credentials:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=https://kojhlgnctnxfdwdxukjz.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
  SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
  ```

## Step 3: Setup Database Locally

- [ ] Ensure `.env.local` is set with credentials
- [ ] Run `pnpm setup-db`
- [ ] Verify output shows database setup complete
- [ ] Check Supabase dashboard for new tables:
  - [ ] `rsvps` table exists
  - [ ] `admin_users` table exists
  - [ ] `admin_sessions` table exists

## Step 4: Test Locally

- [ ] Run `pnpm dev`
- [ ] Visit `http://localhost:3000`
- [ ] Test RSVP form:
  - [ ] Form opens when clicking "RSVP Now"
  - [ ] Validation works (required fields show errors)
  - [ ] Submit works and shows success message
- [ ] Test admin login at `/admin/login`:
  - [ ] Username: `admin`
  - [ ] Password: `luxury-event-2024`
  - [ ] Login successful
  - [ ] Dashboard shows RSVPs
  - [ ] Can delete an RSVP
  - [ ] Can upload a banner image

## Step 5: Create GitHub Repository

- [ ] Go to https://github.com/new
- [ ] Create new repository (name it something like `rsvp-app`)
- [ ] Choose **Public** or **Private** (your preference)
- [ ] **Do NOT** initialize with README (we already have one)
- [ ] Click **Create repository**
- [ ] Copy the repository URL

## Step 6: Initialize Git & Push to GitHub

In your project folder, run these commands:

```bash
# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial RSVP app setup - ready for deployment"

# Add GitHub as remote (replace YOUR_USERNAME and YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git branch -M main
git push -u origin main
```

After running these:
- [ ] Check GitHub repository - files should be there
- [ ] Verify `.env.local` is NOT in the repository (should be in `.gitignore`)
- [ ] All project files are visible in GitHub

## Step 7: Connect Supabase Storage Bucket

Before deploying to Vercel:

- [ ] Go to Supabase Dashboard
- [ ] Navigate to **Storage** → **Buckets**
- [ ] Check that `rsvp` bucket exists
- [ ] Verify it is set to **PUBLIC** (important!)
- [ ] If bucket doesn't exist, create it:
  - [ ] Click **Create a new bucket**
  - [ ] Name: `rsvp`
  - [ ] Access: **Public**
  - [ ] Click **Create bucket**

## Step 8: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Click **Add New** → **Project**
3. Click **Import Git Repository**
4. Paste your GitHub repository URL
5. Select the repository
6. Click **Import**
7. On the next screen, add **Environment Variables**:
   - [ ] `NEXT_PUBLIC_SUPABASE_URL` = `https://kojhlgnctnxfdwdxukjz.supabase.co`
   - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGc...` (your anon key)
   - [ ] `SUPABASE_SERVICE_ROLE_KEY` = `eyJhbGc...` (your service role key)
8. Click **Deploy**
9. Wait for deployment to complete (2-3 minutes)

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI (one-time)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# When prompted, add environment variables:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# SUPABASE_SERVICE_ROLE_KEY

# Deploy to production
vercel --prod
```

- [ ] Vercel deployment completed successfully
- [ ] You have a live URL (something like `yourapp.vercel.app`)

## Step 9: Test Live Deployment

- [ ] Open your Vercel URL in browser
- [ ] Test RSVP form:
  - [ ] Form opens
  - [ ] Submit works
  - [ ] Data appears in Supabase
- [ ] Test admin login:
  - [ ] Go to `/admin/login`
  - [ ] Login with `admin` / `luxury-event-2024`
  - [ ] Dashboard shows RSVPs
  - [ ] Banner upload works

## Step 10: Post-Deployment Setup

### Change Admin Password (IMPORTANT!)

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Create new query with:
   ```sql
   -- Use bcrypt-generator.com to generate hash of new password
   -- Then run this:
   UPDATE admin_users
   SET password_hash = '$2a$10/YOUR_NEW_BCRYPT_HASH_HERE'
   WHERE username = 'admin';
   ```
4. Replace the hash with your bcrypt-generated hash
5. Execute the query

- [ ] Admin password changed
- [ ] Tested login with new password on live site

## Step 11: Final Verification

- [ ] Project is on GitHub
- [ ] Project is deployed on Vercel
- [ ] Environment variables are set in Vercel
- [ ] Admin password has been changed
- [ ] Both RSVP and admin features work on live URL
- [ ] Banner images load correctly
- [ ] WhatsApp integration redirects correctly

## Step 12: Optional - Setup Auto-Deploy

Vercel auto-deploys when you push to GitHub, but you can configure additional settings:

- [ ] Go to Vercel project settings
- [ ] Under **Git**, verify auto-deploy is enabled
- [ ] Set production branch to `main`
- [ ] Test by making a change locally, pushing to GitHub, and verifying Vercel auto-deploys

## Troubleshooting During Deployment

### "Environment variables not found"
- Ensure all 3 env vars are added in Vercel Settings → Environment Variables
- Verify the values are correct (no extra spaces)
- Redeploy after adding env vars

### "Database tables not found"
- Run `pnpm setup-db` before first deployment
- Or manually run SQL files in Supabase SQL Editor
- Verify tables exist in Supabase dashboard

### "Admin login fails on live site"
- Check that `admin_users` table was created
- Verify Supabase credentials in Vercel env vars
- Run `pnpm setup-db` again to recreate admin user

### "Banner image doesn't load"
- Verify `rsvp` bucket exists in Supabase Storage
- Ensure bucket is set to **PUBLIC**
- Try uploading a new image in admin dashboard

## Success! 🎉

Your RSVP app is now live! 

**Live URL**: `https://yourapp.vercel.app`

Next steps:
- Monitor the app for errors (Vercel dashboard → Logs)
- Share the landing page with guests
- Review admin dashboard for incoming RSVPs
- Make any design/text adjustments as needed

---

**Need help?** Check these files:
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Detailed deployment guide
- [ADMIN_SETUP.md](./ADMIN_SETUP.md) - Admin authentication details
- [README.md](./README.md) - Project overview
