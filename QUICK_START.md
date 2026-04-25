# Quick Start - Luxury Event RSVP App

## 🚀 Get Started in 3 Steps

### Step 1: Environment Variables
Your Supabase credentials have been added to project settings:
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
- ✅ `SUPABASE_SERVICE_ROLE_KEY`

### Step 2: Setup Database
Run this command in the terminal:
```bash
pnpm setup-db
```

This creates the necessary tables in Supabase.

### Step 3: Create Storage Bucket
In your Supabase dashboard:
1. Go to **Storage → Buckets**
2. Click **+ New bucket**
3. Name it `rsvp`
4. Set it to **PUBLIC**

Done! 🎉

---

## 📱 App Structure

### Main Page (Mobile-First)
```
/ (root)
├─ Full-screen banner image
├─ "RSVP Now" button overlay
└─ Opens modal with RSVP form
```

### RSVP Form (Modal Dialog)
```
┌─────────────────┐
│      RSVP       │
├─────────────────┤
│ Name:      [__] │
│ Guests:    [1▼] │
│ Message:   [__] │
│           [Submit]→ WhatsApp
└─────────────────┘
```

### Admin Dashboard
```
/admin/login
  ↓ (login with credentials)
/admin
├─ RSVP Stats (total, guests, avg size)
├─ Banner Upload Section
├─ RSVP List Table
└─ Delete RSVPs
```

---

## 🎨 Design Highlights

- **Colors**: Gold (#d4a574), soft off-white (#f8f7f5), dark gray (#2c2c2c)
- **Typography**: Playfair Display serif for headings
- **Responsive**: Mobile-first, works on all screen sizes
- **Modern**: Smooth animations, subtle shadows, elegant spacing

---

## 🔐 Admin Access

**URL**: `yourdomain.com/admin/login`  
**Username**: `admin`  
**Password**: `luxury-event-2024`

⚠️ Change password immediately:
1. Add `ADMIN_PASSWORD` environment variable
2. Deploy/restart the app

---

## 📸 Banner Image

### Upload from Admin Panel
1. Go to `/admin`
2. Scroll to "Event Banner" section
3. Upload a new image (PNG, JPG, GIF, max 5MB)
4. Automatically saves to Supabase storage

### Manual Upload
Or upload directly to Supabase:
1. Storage → `rsvp` bucket
2. Upload your image
3. Rename to `banner.jpg`

A default elegant banner is used if no image is present.

---

## 🔗 WhatsApp Integration

After RSVP submission, users get:
- Automatic redirect to WhatsApp
- Pre-filled message with their details
- Message format:
  ```
  Hello! I am confirming my RSVP for X guests. 
  Name: [Name]. Message: [Optional message]
  ```

---

## 📊 What Gets Stored

**RSVPs Table**:
- `name` - Guest name
- `guests` - Number of attendees  
- `message` - Optional notes
- `created_at` - Submission timestamp

All data is secure and stored in your Supabase account.

---

## 🛠️ Customization

### Change Event Details
Edit `/components/banner-section.tsx`:
```tsx
<h1>You Are Invited</h1>  // Change title
<p>Join us for an elegant evening of celebration</p>  // Change subtitle
```

### Change Colors
Edit `/app/globals.css` - search for `--accent`, `--background`, etc.

### Change Admin Password
Set `ADMIN_PASSWORD` environment variable in Vars section.

---

## 📱 Mobile Optimization

The app is **mobile-first**, meaning:
- Excellent on small phones (perfect!)
- Scales beautifully to tablets
- Fully optimized for desktop
- Touch-friendly buttons and forms
- No horizontal scrolling

---

## ✅ Checklist

- [ ] Environment variables set
- [ ] Database setup completed (`pnpm setup-db`)
- [ ] Storage bucket created (`rsvp`, PUBLIC)
- [ ] Banner image uploaded or using default
- [ ] Admin can log in with credentials
- [ ] Main page displays banner + button
- [ ] RSVP form opens when button clicked
- [ ] Form submits successfully to Supabase
- [ ] WhatsApp link opens after submission

---

## 🆘 Troubleshooting

**"Cannot connect to Supabase"**
→ Check env variables are set in project settings

**"Banner image not showing"**
→ Create the `rsvp` bucket and set it to PUBLIC

**"Form not submitting"**  
→ Open browser console (F12) and check error messages

**"Admin login fails"**
→ Clear browser cache, try incognito window

---

## 📞 Support

Check `/SETUP.md` for detailed troubleshooting guide.

Enjoy your luxury event! 🎊
