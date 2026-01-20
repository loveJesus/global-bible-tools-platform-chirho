-- For God so loved the world, that He gave His only begotten Son,
-- that all who believe in Him should not perish but have everlasting life.
-- — John 3:16

-- Add MACHINE value to gloss_source enum for AI-generated translations
ALTER TYPE gloss_source ADD VALUE IF NOT EXISTS 'MACHINE';
