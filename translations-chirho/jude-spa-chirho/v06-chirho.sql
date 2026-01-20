-- For God so loved the world, that He gave His only begotten Son,
-- that all who believe in Him should not perish but have everlasting life.
-- — John 3:16

-- ============================================================================
-- JUDE VERSE 6 - Spanish Translation
-- ============================================================================
-- Verse 6: ángeles y los–que no guardaron la de–ellos–mismos autoridad sino
--          abandonaron el propio habitación para juicio de–gran día con–cadenas
--          eternas bajo oscuridad ha–guardado

BEGIN;

-- Word 6500100601: ἀγγέλους (G0032) - "angels"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500100601' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500100601' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'ángeles', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500100601' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500100602: τε (G5037) - "and"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500100602' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500100602' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'y', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500100602' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500100603: τοὺς (G3588) - "the (ones who)"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500100603' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500100603' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'los–que', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500100603' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500100604: μὴ (G3361) - "not"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500100604' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500100604' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'no', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500100604' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500100605: τηρήσαντας (G5083) - "having kept"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500100605' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500100605' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'guardaron', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500100605' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500100606: τὴν (G3588) - "the"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500100606' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500100606' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'la', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500100606' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500100607: ἑαυτῶν (G1438) - "of themselves"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500100607' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500100607' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'de–ellos–mismos', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500100607' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500100608: ἀρχὴν (G0746) - "domain/authority"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500100608' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500100608' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'dominio', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500100608' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500100609: ἀλλὰ (G0235) - "but"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500100609' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500100609' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'sino', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500100609' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500100610: ἀπολιπόντας (G0620) - "having abandoned"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500100610' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500100610' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'abandonaron', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500100610' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500100611: τὸ (G3588) - "the"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500100611' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500100611' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'el', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500100611' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500100612: ἴδιον (G2398) - "own"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500100612' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500100612' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'propio', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500100612' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500100613: οἰκητήριον (G3613) - "dwelling"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500100613' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500100613' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'habitación', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500100613' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500100614: εἰς (G1519) - "for"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500100614' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500100614' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'para', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500100614' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500100615: κρίσιν (G2920) - "judgment"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500100615' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500100615' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'juicio', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500100615' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500100616: μεγάλης (G3173) - "great"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500100616' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500100616' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'del–gran', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500100616' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500100617: ἡμέρας (G2250) - "day"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500100617' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500100617' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'día', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500100617' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500100618: δεσμοῖς (G1199) - "with chains"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500100618' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500100618' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'con–cadenas', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500100618' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500100619: ἀϊδίοις (G0126) - "eternal"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500100619' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500100619' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'eternas', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500100619' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500100620: ὑπὸ (G5259) - "under"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500100620' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500100620' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'bajo', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500100620' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500100621: ζόφον (G2217) - "darkness"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500100621' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500100621' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'oscuridad', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500100621' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500100622: τετήρηκεν (G5083) - "he has kept"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500100622' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500100622' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'ha–guardado', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500100622' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

COMMIT;
