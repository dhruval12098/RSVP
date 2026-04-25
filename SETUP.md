# Luxury RSVP Event Setup Guide

Your luxury event RSVP application is ready to use! Follow these steps to get started.

## Environment Variables

Make sure the following environment variables are set in your project settings:

- **NEXT_PUBLIC_SUPABASE_URL**: Your Supabase project URL
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Your Supabase anonymous key  
- **SUPABASE_SERVICE_ROLE_KEY**: Your Supabase service role key (for admin operations)

These should already be configured in your project settings.

## Database Setup

1. **Create the database tables** by running the setup script:
   ```bash
   npm run setup-db
   # or
   pnpm setup-db
   ```

   This will:
   - Create the `rsvps` table to store guest RSVPs
   - Create the `admin_settings` table for admin configuration
   - Set up proper indexes and Row Level Security policies

2. **Verify the tables exist** in your Supabase dashboard under the SQL editor

## Storage Setup

1. **Create the storage bucket** in Supabase:
   - Go to Storage → Buckets
   - Create a new bucket named `rsvp`
   - Set it to **PUBLIC** access

2. **Upload a banner image** (optional):
   - Upload your event banner image to the `rsvp` bucket
   - Name it `banner.jpg` 
   - The image will automatically display on the main page
   - If no image is uploaded, a default elegant banner will be shown

## Features

### Main Event Page (Mobile-First)
- **Full-screen banner** with your event image
- **"RSVP Now" button** that opens a popup modal
- **Responsive design** that works perfectly on mobile, tablet, and desktop
- **RSVP modal form** with:
  - Name field
  - Number of guests dropdown (1-10)
  - Optional message field
  - WhatsApp redirect after submission

### Admin Dashboard
- **Protected login page** at `/admin/login`
- **Password-protected dashboard** at `/admin`
- **Stats overview**:
  - Total RSVPs received
  - Total guest count
  - Average party size
- **RSVP management**:
  - View all RSVPs in a table
  - Delete individual RSVPs
- **Banner upload**:
  - Upload new banner images directly from the admin panel
  - Support for PNG, JPG, GIF up to 5MB
  - Images are automatically saved to the `rsvp` storage bucket

## Default Admin Credentials

- **Username**: admin
- **Password**: luxury-event-2024

**⚠️ IMPORTANT**: Change this password immediately after first login by updating the `ADMIN_PASSWORD` environment variable.

## Usage Flow

### For Guests
1. Visit the main page
2. See the beautiful event banner
3. Click "RSVP Now" button
4. Fill in the modal form with their details
5. Submit and get redirected to WhatsApp to confirm

### For Admin
1. Go to `/admin/login`
2. Enter admin credentials
3. View RSVP statistics and guest list
4. Upload a banner image for the event
5. Delete RSVPs if needed
6. Click "Logout" when done

## Customization

### Change Admin Password
Update the `ADMIN_PASSWORD` environment variable in your project settings.

### Customize Event Details
Edit `/components/banner-section.tsx` to change:
- Event title ("You Are Invited")
- Event subtitle ("Join us for an elegant evening of celebration")
- Button text ("RSVP Now")

### Styling
All colors are defined in `/app/globals.css`:
- Primary color: `#d4a574` (gold)
- Background: `#f8f7f5` (soft off-white)
- Text: `#2c2c2c` (dark gray)
- Border: `#e8e5dd` (light beige)

## Troubleshooting

### "Missing Supabase credentials"
- Verify all environment variables are set correctly
- Check that they're added to the "Vars" section in project settings
- Restart the dev server after adding env vars

### Banner image not showing
- Check that the `rsvp` bucket exists and is PUBLIC
- Verify the image is named `banner.jpg`
- Try uploading a new image from the admin dashboard

### Admin login not working
- Clear browser cache and cookies
- Verify the password matches your `ADMIN_PASSWORD` environment variable
- Check that the `admin_settings` table exists in Supabase

### Form submissions failing
- Verify the `rsvps` table was created successfully
- Check that Row Level Security policies allow inserts
- Open the browser console for detailed error messages

## Need Help?

If you encounter any issues, check:
1. Browser console for JavaScript errors
2. Supabase dashboard for database issues
3. Network tab to see API request failures
4. Environment variables are properly set

Good luck with your event!
