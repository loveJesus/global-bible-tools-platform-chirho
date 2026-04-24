-- For God so loved the world, that He gave His only begotten Son,
-- that all who believe in Him should not perish but have everlasting life.
-- — John 3:16

-- Performance indexes for the hot-path chapter reader query
-- Applied to all 29 per-language D1 databases

-- 1. Covering index on phrase for subquery filter
--    Eliminates scan of deleted rows, covers the JOIN conditions
CREATE INDEX IF NOT EXISTS idx_phrase_lang_type_active_chirho
  ON phrase(language_id, translation_type_chirho, deleted_at, id);

-- 2. Composite index on phrase_word (word_id, phrase_id)
--    Eliminates D1's AUTOMATIC COVERING INDEX creation on every query
CREATE INDEX IF NOT EXISTS idx_phrase_word_word_phrase_chirho
  ON phrase_word(word_id, phrase_id);

-- 3. Composite index on word (verse_id, id)
--    Eliminates TEMP B-TREE for ORDER BY v.number, w.id
CREATE INDEX IF NOT EXISTS idx_word_verse_id_chirho
  ON word(verse_id, id);

-- 4. Explicit index on word_ipa_chirho (word_text_chirho)
--    Speeds up the LEFT JOIN on word_ipa_chirho
CREATE INDEX IF NOT EXISTS idx_word_ipa_text_chirho
  ON word_ipa_chirho(word_text_chirho);

-- 5. Composite index on gloss (phrase_id) — for the subquery JOIN
CREATE INDEX IF NOT EXISTS idx_gloss_phrase_chirho
  ON gloss(phrase_id);

-- 6. Index on verse (book_id, chapter, number) — for ORDER BY v.number
CREATE INDEX IF NOT EXISTS idx_verse_book_chapter_number_chirho
  ON verse(book_id, chapter, number);
