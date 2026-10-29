-- ==============================================================================
-- Ibtikan Properties - Supabase Database Schema
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS public.admins (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  role TEXT NOT NULL DEFAULT 'Administrator',
  summary TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  published BOOLEAN DEFAULT false,
  sort INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Properties Table
CREATE TABLE IF NOT EXISTS public.properties (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ref TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  transaction_type TEXT DEFAULT 'sale',
  description TEXT DEFAULT '',
  location TEXT DEFAULT '',
  region TEXT DEFAULT '',
  price NUMERIC DEFAULT NULL,
  currency TEXT DEFAULT 'GH₵',
  land_area TEXT DEFAULT NULL,
  building_area TEXT DEFAULT NULL,
  bedrooms INTEGER DEFAULT NULL,
  bathrooms INTEGER DEFAULT NULL,
  features JSONB DEFAULT '[]'::jsonb,
  availability TEXT DEFAULT 'available',
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  cover_image TEXT DEFAULT NULL,
  seo_title TEXT DEFAULT NULL,
  seo_description TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Property Images Table
CREATE TABLE IF NOT EXISTS public.property_images (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  property_id BIGINT REFERENCES public.properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT DEFAULT '',
  sort INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  location TEXT DEFAULT '',
  category TEXT DEFAULT 'development',
  status TEXT DEFAULT 'planned',
  description TEXT DEFAULT '',
  features JSONB DEFAULT '[]'::jsonb,
  cover_image TEXT DEFAULT NULL,
  published BOOLEAN DEFAULT true,
  sort INTEGER DEFAULT 0,
  seo_title TEXT DEFAULT NULL,
  seo_description TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enquiries Table
CREATE TABLE IF NOT EXISTS public.enquiries (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT NULL,
  type TEXT DEFAULT 'general',
  source TEXT DEFAULT 'enquire',
  property_id BIGINT REFERENCES public.properties(id) ON DELETE SET NULL,
  property_ref TEXT DEFAULT NULL,
  country TEXT DEFAULT NULL,
  preferred_contact TEXT DEFAULT 'email',
  message TEXT DEFAULT '',
  consent BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'new',
  ip_hash TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Rate Limit Table
CREATE TABLE IF NOT EXISTS public.rate_limit (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ip_hash TEXT NOT NULL,
  day TEXT NOT NULL,
  submissions INTEGER DEFAULT 1,
  UNIQUE(ip_hash, day)
);

-- 7. Articles Table
CREATE TABLE IF NOT EXISTS public.articles (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT DEFAULT '',
  body TEXT DEFAULT '',
  status TEXT DEFAULT 'draft',
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Team Members Table
CREATE TABLE IF NOT EXISTS public.team_members (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  summary TEXT DEFAULT '',
  bio JSONB DEFAULT '{}'::jsonb,
  portrait TEXT DEFAULT NULL,
  published BOOLEAN DEFAULT true,
  sort INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Settings Table
CREATE TABLE IF NOT EXISTS public.settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_properties_slug ON public.properties(slug);
CREATE INDEX IF NOT EXISTS idx_properties_published ON public.properties(published);
CREATE INDEX IF NOT EXISTS idx_properties_category ON public.properties(category);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON public.enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);

-- Storage bucket creation for media
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage public read policy
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

-- Storage insert policy for authenticated or service role
CREATE POLICY "Service Role Upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'media');
