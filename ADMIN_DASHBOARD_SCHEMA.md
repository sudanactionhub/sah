# Supabase Database Schema for Admin Dashboard

This document describes the required tables and their schemas for the admin dashboard to function properly.

## Required Tables

### 1. `news` table
For managing news articles.

```sql
create table news (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  excerpt text not null,
  content text not null,
  featured_image text,
  author text,
  published_date date not null default now(),
  tags text[] default array[]::text[],
  status text default 'draft' check (status in ('draft', 'published')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### 2. `events` table
For managing events.

```sql
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
  status text default 'draft' check (status in ('draft', 'published')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### 3. `research` table
For managing research items.

```sql
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
  status text default 'draft' check (status in ('draft', 'published')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### 4. `page_content` table (Optional)
For managing dynamic page content.

```sql
create table page_content (
  id uuid primary key default uuid_generate_v4(),
  page_name text not null unique,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone default now()
);
```

### 5. `site_settings` table (Optional)
For managing site-wide settings.

```sql
create table site_settings (
  id uuid primary key default uuid_generate_v4(),
  setting_key text not null unique,
  setting_value jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone default now()
);
```

## Required Storage Buckets

Create the following storage buckets in Supabase:

1. **news-images** - For news article featured images
2. **events-images** - For event featured images
3. **research-images** - For research item featured images
4. **research-documents** - For research PDF documents
5. **page-content** - For general page content uploads

### Bucket Configuration

Each bucket should be configured with:
- Public access enabled (if you want public URLs)
- Max upload size: 50MB (configurable)
- Allowed MIME types: Restrict based on bucket purpose

## Row Level Security (RLS) Policies

Recommended RLS policies for content tables:

```sql
-- For news table
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Allow authenticated super_admin to insert, update, delete
CREATE POLICY admin_full_access ON news
  FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');

-- Allow anyone to read published content
CREATE POLICY public_read_published ON news
  FOR SELECT USING (status = 'published');

-- Similar policies for events and research tables
```

## Setup Instructions

1. Go to Supabase Dashboard > SQL Editor
2. Copy and paste each CREATE TABLE statement
3. Execute them one by one
4. Go to Storage > Create new bucket for each required bucket
5. (Optional) Set up RLS policies for data security

## Next Steps

1. Create these tables in your Supabase database
2. Create the required storage buckets
3. Test the admin dashboard by creating a news article
4. Verify files are uploading to Supabase storage
5. Set up RLS policies for production security

## API Functions Available

The `AdminApi.js` provides these functions for content management:

### News
- `createNews(newsData)` - Create a new article
- `updateNews(id, newsData)` - Update an article
- `deleteNews(id)` - Delete an article
- `getNews(filters)` - Get articles with optional filters

### Events
- `createEvent(eventData)` - Create a new event
- `updateEvent(id, eventData)` - Update an event
- `deleteEvent(id)` - Delete an event
- `getEvents(filters)` - Get events with optional filters

### Research
- `createResearch(researchData)` - Create research item
- `updateResearch(id, researchData)` - Update research item
- `deleteResearch(id)` - Delete research item
- `getResearch(filters)` - Get research items with optional filters

### File Management
- `uploadFile(file, bucket, folder)` - Upload file to storage
- `deleteFile(filePath, bucket)` - Delete file from storage

### Page Content
- `updatePageContent(pageName, content)` - Update page content
- `getPageContent(pageName)` - Get page content

### Bulk Operations
- `publishMultiple(contentType, ids)` - Publish multiple items
- `deleteMultiple(contentType, ids)` - Delete multiple items
