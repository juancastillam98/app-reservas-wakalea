-- ============================================================
-- 008 — Add dynamic schedules + image storage to experiences
--       Add guest breakdown to bookings
-- ============================================================

-- 1. EXPERIENCES — Schedule (JSONB)
-- Structure: { "available_days": [1,3,5], "time_slots": [{"start":"10:00","end":"12:00"}], "duration_minutes": 120 }
ALTER TABLE public.experiences
  ADD COLUMN IF NOT EXISTS schedule jsonb;

-- 2. EXPERIENCES — Image storage columns (Supabase Storage URLs)
ALTER TABLE public.experiences
  ADD COLUMN IF NOT EXISTS main_image_url text,
  ADD COLUMN IF NOT EXISTS gallery_urls text[] DEFAULT '{}';

-- Migrate existing data: copy images[1] → main_image_url, rest → gallery_urls
UPDATE public.experiences
  SET main_image_url = images[1]
  WHERE main_image_url IS NULL AND images IS NOT NULL AND array_length(images, 1) > 0;

UPDATE public.experiences
  SET gallery_urls = images[2:]
  WHERE gallery_urls = '{}' AND images IS NOT NULL AND array_length(images, 1) > 1;

-- 3. BOOKINGS — Guest breakdown + extra fields
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS booking_time text,
  ADD COLUMN IF NOT EXISTS adults integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS children_0_5 integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS children_6_12 integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS children_13_17 integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS how_found text;

-- 4. STORAGE — Make the bucket public for read access
UPDATE storage.buckets
  SET public = true
  WHERE id = 'experiences_images';

-- Allow public read
DO $$ BEGIN
  CREATE POLICY "experiences_images_public_read"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'experiences_images');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Allow authenticated users (admins) to upload
DO $$ BEGIN
  CREATE POLICY "experiences_images_admin_insert"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'experiences_images');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Allow authenticated users (admins) to delete
DO $$ BEGIN
  CREATE POLICY "experiences_images_admin_delete"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'experiences_images');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
