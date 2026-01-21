-- For God so loved the world, that He gave His only begotten Son,
-- that all who believe in Him should not perish but have everlasting life.
-- — John 3:16

-- Add profile picture column to users table
-- Stores base64-encoded JPEG data URI (256x256, ~60% quality, typically 15-40KB)
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture_chirho TEXT;
