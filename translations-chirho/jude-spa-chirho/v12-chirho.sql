-- For God so loved the world, that He gave His only begotten Son,
-- that all who believe in Him should not perish but have everlasting life.
-- — John 3:16

-- ============================================================================
-- JUDE VERSE 12 - SPA Translation
-- ============================================================================
-- Verse 12: Estos son los en las ágapes de–vosotros escollos festejando–juntos sin–temor a–sí–mismos apacentando nubes sin–agua por vientos llevadas árboles otoñales sin–fruto dos–veces muertos desarraigados

BEGIN;

-- Word 6500101201: Οὗτοί (G3778) - "Estos"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500101201' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500101201' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'Estos', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500101201' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500101202: εἰσιν (G1510) - "son"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500101202' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500101202' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'son', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500101202' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500101203: οἱ (G3588) - "los"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500101203' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500101203' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'los', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500101203' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500101204: ἐν (G1722) - "en"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500101204' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500101204' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'en', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500101204' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500101205: ταῖς (G3588) - "las"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500101205' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500101205' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'las', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500101205' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500101206: ἀγάπαις (G0026) - "ágapes"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500101206' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500101206' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'ágapes', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500101206' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500101207: ὑμῶν (G4771) - "de–vosotros"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500101207' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500101207' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'de–vosotros', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500101207' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500101208: σπιλάδες (G4694) - "escollos"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500101208' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500101208' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'escollos', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500101208' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500101209: συνευωχούμενοι (G4910) - "festejando–juntos"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500101209' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500101209' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'festejando–juntos', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500101209' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500101210: ἀφόβως (G0870) - "sin–temor"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500101210' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500101210' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'sin–temor', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500101210' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500101211: ἑαυτοὺς (G1438) - "a–sí–mismos"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500101211' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500101211' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'a–sí–mismos', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500101211' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500101212: ποιμαίνοντες (G4165) - "apacentando"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500101212' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500101212' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'apacentando', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500101212' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500101213: νεφέλαι (G3507) - "nubes"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500101213' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500101213' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'nubes', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500101213' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500101214: ἄνυδροι (G0504) - "sin–agua"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500101214' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500101214' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'sin–agua', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500101214' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500101215: ὑπὸ (G5259) - "por"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500101215' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500101215' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'por', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500101215' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500101216: ἀνέμων (G0417) - "vientos"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500101216' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500101216' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'vientos', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500101216' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500101217: παραφερόμεναι (G3911) - "llevadas"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500101217' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500101217' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'llevadas', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500101217' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500101218: δένδρα (G1186) - "árboles"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500101218' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500101218' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'árboles', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500101218' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500101219: φθινοπωρινὰ (G5352) - "otoñales"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500101219' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500101219' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'otoñales', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500101219' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500101220: ἄκαρπα (G0175) - "sin–fruto"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500101220' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500101220' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'sin–fruto', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500101220' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500101221: δὶς (G1364) - "dos–veces"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500101221' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500101221' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'dos–veces', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500101221' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500101222: ἀποθανόντα (G0599) - "muertos"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500101222' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500101222' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'muertos', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500101222' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

-- Word 6500101223: ἐκριζωθέντα (G1610) - "desarraigados"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = 'spa'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '6500101223' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '6500101223' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, 'desarraigados', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '6500101223' AND p.language_id = (SELECT id FROM language WHERE code = 'spa') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;

COMMIT;
