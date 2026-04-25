# Luxury Event RSVP Application

A full-stack, production-ready RSVP application with admin dashboard, banner management, and secure authentication.

## Features

✨ **Event Landing Page**
- Full-screen hero banner image (A4 landscape optimized)
- "RSVP Now" button that opens a modal form
- Mobile-first responsive design
- Elegant luxury aesthetic with gold accents

📝 **RSVP Form**
- Name, guest count (1-10), optional message
- Real-time validation with React Hook Form
- WhatsApp integration for confirmations
- Stores all data in Supabase

🔐 **Admin Dashboard** (`/admin`)
- Secure login with session management
- View all RSVPs with statistics
- Delete RSVP entries
- Upload custom banner images
- 24-hour session expiration for security

💾 **Backend**
- Supabase PostgreSQL database
- Row Level Security (RLS) policies
- Bcrypt password hashing for admin accounts
- Session-based authentication
- RESTful API routes

🎨 **Design System**
- Playfair Display serif fonts (luxury feel)
- Gold (#d4a574) and soft white (#f8f7f5) palette
- Fully responsive (mobile, tablet, desktop)
- Accessible components with proper ARIA attributes

## Quick Start

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd rsvp-app
pnpm install
```

### 2. Setup Environment
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://kojhlgnctnxfdwdxukjz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Initialize Database
```bash
pnpm setup-db
```

### 4. Run Locally
```bash
pnpm dev
```
Visit `http://localhost:3000`

### 5. Admin Login
- URL: `http://localhost:3000/admin/login`
- Username: `admin`
- Password: `luxury-event-2024`

⚠️ **Change the admin password immediately!**

## Deployment to Vercel

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.

Quick summary:
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel Settings
4. Deploy!

## Project Structure

```
├── app/
│   ├── api/                    # API routes
│   │   ├── rsvp/              # RSVP submission endpoint
│   │   └── admin/             # Admin endpoints (login, RSVP management)
│   ├── admin/                 # Admin pages
│   │   ├── login/page.tsx     # Admin login
│   │   └── page.tsx           # Admin dashboard
│   ├── layout.tsx             # Root layout
│   ├── globals.css            # Tailwind + design tokens
│   └── page.tsx               # Main landing page
├── components/
│   ├── banner-section.tsx     # Hero banner with image
│   ├── rsvp-modal.tsx         # RSVP form modal
│   ├── admin-dashboard.tsx    # Admin dashboard UI
│   └── ...
├── lib/
│   ├── auth.ts                # Authentication utilities
│   └── utils.ts               # Helper functions
├── scripts/
│   ├── setup-db.mjs           # Database initialization script
│   ├── setup-db.sql           # Base schema (RSVPs table)
│   └── setup-admin.sql        # Admin authentication schema
├── public/
│   └── default-banner.jpg     # Default event banner
└── DEPLOYMENT.md              # Deployment guide
```

## Database Schema

### `rsvps` Table
Stores all event RSVPs.
```sql
- id (UUID, primary key)
- name (text)
- guests (integer 1-10)
- message (text, optional)
- created_at (timestamp)
```

### `admin_users` Table
Stores admin credentials with bcrypt hashing.
```sql
- id (UUID, primary key)
- username (text, unique)
- password_hash (text, bcrypt)
- email (text)
- is_active (boolean)
- created_at, updated_at (timestamps)
```

### `admin_sessions` Table
Manages active admin sessions (24-hour expiration).
```sql
- id (UUID, primary key)
- admin_id (UUID, foreign key to admin_users)
- token (text, unique)
- created_at, expires_at (timestamps)
```

See [ADMIN_SETUP.md](./ADMIN_SETUP.md) for detailed admin authentication documentation.

## API Routes

### POST `/api/rsvp`
Submit an RSVP.
```json
{
  "name": "John Doe",
  "guests": 2,
  "message": "Looking forward to it!"
}
```

### POST `/api/admin/login`
Admin login (returns session token).
```json
{
  "username": "admin",
  "password": "luxury-event-2024"
}
```

### GET `/api/admin/rsvps`
Get all RSVPs and statistics (requires token).
```
?token=SESSION_TOKEN
```

### DELETE `/api/admin/rsvps`
Delete an RSVP (requires token).
```
?id=RSVP_ID&token=SESSION_TOKEN
```

## Environment Variables

| Variable | Value | Required |
|----------|-------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret service role key | Yes |

## Admin Dashboard Features

- **RSVP Statistics**: View total RSVPs, guest counts, and averages
- **RSVP Management**: View all RSVPs in a sortable table, delete entries
- **Banner Upload**: Upload custom banner images (drag & drop)
- **Secure Login**: Session-based authentication with 24-hour expiration
- **Responsive Design**: Works on mobile, tablet, and desktop

## Security Features

✅ **Password Hashing**: Bcrypt (cost factor 10)
✅ **Session Management**: 24-hour token expiration
✅ **Row Level Security**: Database-level protection via RLS policies
✅ **Input Validation**: Client and server-side validation
✅ **SQL Injection Prevention**: Parameterized queries
✅ **CSRF Protection**: Session tokens in requests

## Performance

- Next.js 15+ App Router for optimal performance
- Server-side rendering for fast initial load
- Image optimization with Next.js Image component
- Supabase real-time updates (ready to implement)
- Mobile-optimized with responsive images

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Customization

### Change Admin Password
See [ADMIN_SETUP.md](./ADMIN_SETUP.md#how-to-change-admin-password)

### Change Colors
Edit `/app/globals.css` - Update the CSS variables in the `:root` selector.

### Change Banner
Upload a new image in the admin dashboard, or upload directly to Supabase Storage (`rsvp` bucket).

### Change Font
Update imports in `/app/layout.tsx` and font definitions in `/app/globals.css`.

## Troubleshooting

**Issue**: Admin login fails
- Ensure `pnpm setup-db` was run
- Verify credentials: `admin` / `luxury-event-2024`
- Check that `admin_users` table exists

**Issue**: RSVP form not submitting
- Check browser console for errors
- Verify Supabase credentials in `.env.local`
- Ensure `rsvps` table was created

**Issue**: Banner image not loading
- Ensure `rsvp` storage bucket exists in Supabase
- Verify bucket is set to **PUBLIC**
- Check that image file was uploaded successfully

See [DEPLOYMENT.md](./DEPLOYMENT.md#troubleshooting) for more troubleshooting tips.

## Support

For detailed setup and deployment instructions, see:
- **Getting Started**: [QUICK_START.md](./QUICK_START.md)
- **Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Admin Setup**: [ADMIN_SETUP.md](./ADMIN_SETUP.md)
- **Implementation Details**: [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

## License

This project is open source and available under the MIT License.

---

**Ready to deploy? Start with [DEPLOYMENT.md](./DEPLOYMENT.md)** 🚀
