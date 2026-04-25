# 📚 Documentation Index

Welcome! Here's where to find everything you need.

---

## 🎯 I Want To...

### Deploy My App
**→ Read**: [GITHUB_DEPLOYMENT_CHECKLIST.md](./GITHUB_DEPLOYMENT_CHECKLIST.md)

Step-by-step checklist from local testing all the way to Vercel deployment.

---

### Get Started Quickly
**→ Read**: [START_HERE.md](./START_HERE.md)

3-step overview of the entire deployment process.

---

### Copy-Paste SQL Manually
**→ Read**: [SQL_COPY_PASTE.md](./SQL_COPY_PASTE.md)

If you prefer to run SQL directly instead of using `pnpm setup-db`.

---

### Understand SQL Files
**→ Read**: [scripts/SQL_REFERENCE.md](./scripts/SQL_REFERENCE.md)

Detailed explanation of what each SQL file does.

---

### Manage Admin Users
**→ Read**: [ADMIN_SETUP.md](./ADMIN_SETUP.md)

How to change admin password, add new admins, manage sessions.

---

### Full Deployment Details
**→ Read**: [DEPLOYMENT.md](./DEPLOYMENT.md)

Complete deployment guide with troubleshooting.

---

### Project Overview
**→ Read**: [README.md](./README.md)

Features, structure, API routes, browser support.

---

### Quick Reference
**→ Read**: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

One-page cheat sheet with commands and URLs.

---

### Everything in One Place
**→ Read**: [FINAL_SUMMARY.md](./FINAL_SUMMARY.md)

Comprehensive summary of the entire project.

---

## 📋 All Documentation Files

| File | Purpose | Length | When to Read |
|------|---------|--------|--------------|
| **START_HERE.md** | Quick overview | 3 min | First! |
| **QUICK_REFERENCE.md** | Command cheat sheet | 2 min | While deploying |
| **GITHUB_DEPLOYMENT_CHECKLIST.md** | Step-by-step deployment | 10 min | Before deployment |
| **SQL_COPY_PASTE.md** | Manual SQL option | 5 min | If not using `pnpm setup-db` |
| **DEPLOYMENT.md** | Detailed deployment guide | 15 min | For detailed info |
| **ADMIN_SETUP.md** | Admin authentication | 20 min | For admin management |
| **README.md** | Project overview | 10 min | Project reference |
| **scripts/SQL_REFERENCE.md** | SQL explanation | 15 min | To understand database |
| **FINAL_SUMMARY.md** | Complete reference | 20 min | Comprehensive overview |

---

## 🚀 Quick Deployment Path

1. **Read** [START_HERE.md](./START_HERE.md) (3 min)
2. **Setup locally**:
   - `pnpm install`
   - `pnpm setup-db`
   - `pnpm dev`
3. **Test**: Visit http://localhost:3000 and `/admin/login`
4. **Deploy**: Follow [GITHUB_DEPLOYMENT_CHECKLIST.md](./GITHUB_DEPLOYMENT_CHECKLIST.md)
5. **Done!** Your app is live

**Total time: ~15-20 minutes**

---

## 🗂️ Project Structure Overview

```
DEPLOYMENT DOCS/
├── START_HERE.md                    ← Read this first!
├── QUICK_REFERENCE.md               ← Cheat sheet
├── GITHUB_DEPLOYMENT_CHECKLIST.md   ← Step-by-step
├── SQL_COPY_PASTE.md               ← Manual SQL
├── DEPLOYMENT.md                    ← Detailed guide
├── ADMIN_SETUP.md                   ← Admin users
├── README.md                        ← Project info
└── scripts/
    └── SQL_REFERENCE.md            ← SQL explanation

SQL FILES (Ready to Run)/
├── setup-db.sql                     ← Base tables
└── setup-admin.sql                  ← Admin auth

APP CODE/
├── app/page.tsx                     ← Landing page
├── app/admin/                       ← Admin pages
├── components/                      ← React components
└── api/                             ← API routes

CONFIG FILES/
├── app/globals.css                  ← Colors & fonts
├── tailwind.config.ts               ← Tailwind config
├── package.json                     ← Dependencies
└── tsconfig.json                    ← TypeScript config
```

---

## 📞 FAQ - Where To Find Answers

| Question | Answer In |
|----------|-----------|
| How do I deploy to Vercel? | [GITHUB_DEPLOYMENT_CHECKLIST.md](./GITHUB_DEPLOYMENT_CHECKLIST.md) |
| How do I change the admin password? | [ADMIN_SETUP.md](./ADMIN_SETUP.md) |
| What SQL files do I need to run? | [SQL_COPY_PASTE.md](./SQL_COPY_PASTE.md) |
| What do the SQL files do? | [scripts/SQL_REFERENCE.md](./scripts/SQL_REFERENCE.md) |
| How do I test locally? | [START_HERE.md](./START_HERE.md) |
| What are the API endpoints? | [README.md](./README.md#api-routes) |
| How do I customize colors? | [README.md](./README.md#customization) |
| What's the project structure? | [README.md](./README.md#project-structure) |
| Why is my admin login failing? | [DEPLOYMENT.md](./DEPLOYMENT.md#troubleshooting) |
| Why isn't the banner loading? | [DEPLOYMENT.md](./DEPLOYMENT.md#troubleshooting) |

---

## 🔑 Key Concepts

### SQL Files (2 files, both automated)
- `setup-db.sql` - Creates RSVP table
- `setup-admin.sql` - Creates admin authentication
- **Run together**: `pnpm setup-db`

### Admin Credentials
- Username: `admin`
- Password: `luxury-event-2024`
- ⚠️ **MUST** change before going live!

### Environment Variables (3 required)
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

### Database Tables (3 tables)
- `rsvps` - Public RSVPs
- `admin_users` - Admin accounts
- `admin_sessions` - Active sessions

---

## ✅ Success Checklist

- [ ] Read [START_HERE.md](./START_HERE.md)
- [ ] Run `pnpm install`
- [ ] Run `pnpm setup-db`
- [ ] Test locally with `pnpm dev`
- [ ] Verify admin login works
- [ ] Push to GitHub
- [ ] Deploy to Vercel
- [ ] Change admin password
- [ ] Test live site
- [ ] Share with guests!

---

## 🆘 Troubleshooting

**Common Issues & Solutions:**

1. **`pnpm setup-db` fails**
   → Check `.env.local` has correct credentials
   → See [SQL_COPY_PASTE.md](./SQL_COPY_PASTE.md) for manual option

2. **Admin login doesn't work**
   → Run `pnpm setup-db` again
   → Verify table was created in Supabase

3. **RSVP form doesn't submit**
   → Check browser console for errors
   → Verify Supabase credentials

4. **Banner image doesn't load**
   → Create `rsvp` bucket in Supabase
   → Set bucket to **PUBLIC**

For more: See [DEPLOYMENT.md](./DEPLOYMENT.md#troubleshooting)

---

## 📱 Mobile-First Design

This app is optimized for:
- ✅ Mobile phones
- ✅ Tablets
- ✅ Desktops

Responsive breakpoints:
- Mobile: 320px+
- Tablet: 768px+
- Desktop: 1024px+

---

## 🎨 Customization Quick Links

| Want to Change | File | How |
|---|---|---|
| Colors | `app/globals.css` | Edit CSS variables |
| Fonts | `app/layout.tsx` | Change font imports |
| Banner image | Admin dashboard | Upload in `/admin` |
| Admin password | See [ADMIN_SETUP.md](./ADMIN_SETUP.md) | Update SQL |
| Form fields | `components/rsvp-modal.tsx` | Edit form |

---

## 🚀 Next Steps

1. **Start**: Read [START_HERE.md](./START_HERE.md)
2. **Deploy**: Follow [GITHUB_DEPLOYMENT_CHECKLIST.md](./GITHUB_DEPLOYMENT_CHECKLIST.md)
3. **Reference**: Keep [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) handy
4. **Questions**: Check this index for the right doc

---

## 📞 Support

- **Stuck on deployment?** → [GITHUB_DEPLOYMENT_CHECKLIST.md](./GITHUB_DEPLOYMENT_CHECKLIST.md)
- **SQL questions?** → [SQL_REFERENCE.md](./scripts/SQL_REFERENCE.md)
- **Admin issues?** → [ADMIN_SETUP.md](./ADMIN_SETUP.md)
- **General help?** → [DEPLOYMENT.md](./DEPLOYMENT.md) or [README.md](./README.md)

---

## 🎉 You're All Set!

Everything you need is here. Pick a starting point above and get deploying!

**Recommended order:**
1. START_HERE.md
2. GITHUB_DEPLOYMENT_CHECKLIST.md
3. Keep QUICK_REFERENCE.md open
4. Reference other docs as needed

**Good luck! 🚀**
