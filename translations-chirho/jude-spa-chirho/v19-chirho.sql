-- For God so loved the world, that He gave His only begotten Son,
-- that all who believe in Him should not perish but have everlasting life.
-- — John 3:16

-- ============================================================================
-- JUDE VERSE 19 - SPA Translation
-- ============================================================================
-- Verse 19: Estos son los que–causan–divisiones naturales Espíritu no teniendo

BEGIN;

-- Word 6500101901: Οὗτοί (G3778) - "Estos"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500101901' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500101901' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'Estos', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500101901' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500101902: εἰσιν (G1510) - "son"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500101902' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500101902' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'son', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500101902' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500101903: οἱ (G3588) - "los"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500101903' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500101903' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'los', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500101903' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500101904: ἀποδιορίζοντες (G0592) - "que–causan–divisiones"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500101904' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500101904' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'que–causan–divisiones', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500101904' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500101905: ψυχικοί (G5591) - "naturales"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500101905' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500101905' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'naturales', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500101905' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500101906: Πνεῦμα (G4151) - "Espíritu"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500101906' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500101906' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'Espíritu', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500101906' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500101907: μὴ (G3361) - "no"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500101907' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500101907' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'no', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500101907' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500101908: ἔχοντες (G2192) - "teniendo"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500101908' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500101908' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'teniendo', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500101908' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

COMMIT;
