# Admin Dashboard Setup Guide

## Overview

Your admin dashboard is now fully configured to allow super_admin users to log in and directly upload/manage content on the site. This includes managing news articles, events, research items, and more.

## Features Included

✅ **Admin Authentication** - Super admin role-based access control  
✅ **Content Management** - Create, edit, delete news, events, and research items  
✅ **File Uploads** - Direct image and document uploads to Supabase Storage  
✅ **Status Management** - Draft and Published states for content  
✅ **Request Handling** - Organization and user verification request management  

## Getting Started

### 1. Create Supabase Tables

Follow the instructions in `ADMIN_DASHBOARD_SCHEMA.md`:

1. Log in to [Supabase Dashboard](https://supabase.com)
2. Go to SQL Editor
3. Create tables for `news`, `events`, and `research`
4. (Optional) Create `page_content` and `site_settings` tables

**Quick SQL Setup:**

```sql
-- Create news table
create table news (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  excerpt text not null,
  content text not null,
  featured_image text,
  author text,
  published_date date not null default now(),
  tags text[] default array[]::text[],
  status text default 'draft',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create events table
create table events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  event_date date not null,
  event_time time,
  location text,
  featured_image text,
  organizer text,
  tags text[] default array[]::text[],
  status text default 'draft',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create research table
create table research (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  abstract text not null,
  content text not null,
  document_url text,
  featured_image text,
  author text,
  published_date date not null default now(),
  tags text[] default array[]::text[],
  status text default 'draft',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### 2. Create Storage Buckets

In Supabase Dashboard > Storage:

1. Create bucket: `news-images`
2. Create bucket: `events-images`
3. Create bucket: `research-images`
4. Create bucket: `research-documents`

Set all buckets to **Public** if you want public URLs for content.

### 3. Set Up Admin User

In Supabase Dashboard > Authentication:

1. Create/identify your admin user with email
2. Add super_admin role to their profile in `user` table:

```sql
update user 
set role = 'super_admin' 
where id = 'YOUR_USER_ID';
```

### 4. Access the Admin Portal

Navigate to: `http://localhost:3000/admin/portal`

Login with your super_admin account to access:

- **Requests Tab** - Approve organization and user verification requests
- **News Tab** - Create, edit, publish news articles with images
- **Events Tab** - Manage events with dates, times, and images
- **Research Tab** - Upload research papers and documents
- **Settings Tab** - Site-wide configuration (expandable)

## File Structure

```
src/
  api/
    AdminApi.js                 # All admin API functions
  components/
    FileUploadWidget.jsx        # Reusable file upload component
    admin/
      NewsEditor.jsx            # News article form
      EventEditor.jsx           # Event form
      ResearchEditor.jsx        # Research item form
  pages/
    admin/
      InternalAdminDashboard.jsx  # Main admin dashboard
```

## Key Components

### AdminApi.js
Provides these main functions:

**File Management:**
- `uploadFile(file, bucket, folder)` - Upload to Supabase Storage
- `deleteFile(filePath, bucket)` - Delete from storage

**Content CRUD:**
- `createNews/updateNews/deleteNews/getNews()`
- `createEvent/updateEvent/deleteEvent/getEvents()`
- `createResearch/updateResearch/deleteResearch/getResearch()`

**Page Content:**
- `updatePageContent(pageName, content)`
- `getPageContent(pageName)`

### FileUploadWidget.jsx
Reusable component for file uploads with:
- Drag-and-drop support
- File type validation
- Size limit checking
- Image preview
- Progress indication

### Content Editors
Each editor (News, Event, Research) includes:
- Form validation
- Image upload with preview
- Document uploads (for research)
- Status management (draft/published)
- Tags support
- Auto-save feedback

## Usage Examples

### Adding News

1. Go to Admin Portal > News tab
2. Click "Create News Article"
3. Fill in:
   - Title
   - Excerpt
   - Content
   - Upload featured image
   - Set publication date
   - Add tags (comma-separated)
4. Choose status (Draft or Published)
5. Click "Save Article"

### Creating an Event

1. Go to Events tab > "Create Event"
2. Enter event details:
   - Title
   - Description
   - Date and time
   - Location
   - Featured image
3. Publish or keep as draft
4. Save

### Uploading Research

1. Go to Research tab > "Create Research Item"
2. Fill in:
   - Title
   - Abstract
   - Full content
   - Upload featured image
   - Upload PDF/document
3. Save

## Extending the Dashboard

### Add New Content Types

1. Create a database table in Supabase
2. Add API functions to `AdminApi.js`:
   ```javascript
   export async function createMyContent(data) { ... }
   export async function getMyContent(filters) { ... }
   export async function updateMyContent(id, data) { ... }
   export async function deleteMyContent(id) { ... }
   ```

3. Create an editor component (e.g., `src/components/admin/MyContentEditor.jsx`)
4. Add a new tab to the admin dashboard

### Customize File Upload

To change upload behavior in `FileUploadWidget.jsx`:

```javascript
// Change max file size
<FileUploadWidget
  maxSize={50}  // 50MB
  bucket="news-images"
  folder="featured"
  acceptedTypes="image/jpeg,image/png"
  label="Upload Image"
  onUpload={handleUpload}
/>
```

### Add RLS Security Policies

After going live, add Row Level Security to protect admin-only operations:

```sql
alter table news enable row level security;

create policy "admin_full_access" on news
  for all using (auth.jwt() ->> 'role' = 'super_admin');

create policy "public_read_published" on news
  for select using (status = 'published');
```

## Troubleshooting

### Admin portal not loading
- Ensure your user has `super_admin` role in `user`
- Check that you're logged in with the correct account
- Verify the route is protected in `App.jsx`

### Files not uploading
- Ensure storage buckets exist in Supabase
- Check bucket permissions are set to public (if needed)
- Verify file size is under limit
- Check browser console for error messages

### Content not appearing on pages
- Ensure content is marked as "Published" (not Draft)
- Verify database tables exist with correct schema
- Check that frontend pages are fetching from the correct tables

## Best Practices

1. **Always use drafts first** - Test content before publishing
2. **Use meaningful tags** - Helps with content organization and SEO
3. **Optimize images** - Compress before upload to save storage
4. **Regular backups** - Back up your Supabase data regularly
5. **Version control** - Document schema changes and migrations

## Support

For issues:
1. Check the browser console for errors
2. Review Supabase logs
3. Verify database schema matches documentation
4. Test with sample data first

## Next Steps

1. ✅ Create database tables (see section 1)
2. ✅ Create storage buckets (see section 2)
3. ✅ Set up admin user (see section 3)
4. ✅ Test by logging in to `/admin/portal`
5. ✅ Create your first news article
6. ✅ Integrate content display on frontend pages

Happy content management! 🚀
