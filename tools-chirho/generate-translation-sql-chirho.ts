#!/usr/bin/env bun
// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Generate SQL for translation data that can be applied to PostgreSQL idempotently
 *
 * Usage:
 *   bun run tools-chirho/generate-translation-sql-chirho.ts <language_code> <verse_data_json>
 *
 * Input JSON format:
 * {
 *   "verseId": "01001001",
 *   "glosses": [
 *     { "wordId": "01001001001", "gloss": "In–beginning" },
 *     { "wordId": "01001001002", "gloss": "created" },
 *     ...
 *   ]
 * }
 *
 * Or for batch:
 * {
 *   "verses": [
 *     { "verseId": "01001001", "glosses": [...] },
 *     ...
 *   ]
 * }
 */

import { writeFileSync } from "fs";
import { join } from "path";

interface GlossInputChirho {
  wordIdChirho: string;
  glossChirho: string;
}

interface VerseInputChirho {
  verseIdChirho: string;
  glossesChirho: GlossInputChirho[];
}

interface BatchInputChirho {
  versesChirho: VerseInputChirho[];
}

function escapeStringChirho(strChirho: string): string {
  return strChirho.replace(/'/g, "''");
}

function generateSqlChirho(
  languageCodeChirho: string,
  versesChirho: VerseInputChirho[]
): string {
  const linesChirho: string[] = [];

  linesChirho.push(`-- For God so loved the world, that He gave His only begotten Son,`);
  linesChirho.push(`-- that all who believe in Him should not perish but have everlasting life.`);
  linesChirho.push(`-- — John 3:16`);
  linesChirho.push(``);
  linesChirho.push(`-- Translation data for language: ${languageCodeChirho}`);
  linesChirho.push(`-- Generated: ${new Date().toISOString()}`);
  linesChirho.push(`-- Verses: ${versesChirho.length}`);
  linesChirho.push(``);
  linesChirho.push(`BEGIN;`);
  linesChirho.push(``);

  // Get or create language (idempotent)
  linesChirho.push(`-- Ensure language exists`);
  linesChirho.push(`INSERT INTO language (code, name)`);
  linesChirho.push(`VALUES ('${languageCodeChirho}', '${languageCodeChirho}')`);
  linesChirho.push(`ON CONFLICT (code) DO NOTHING;`);
  linesChirho.push(``);

  // Process each verse
  for (const verseChirho of versesChirho) {
    linesChirho.push(`-- Verse ${verseChirho.verseIdChirho}`);

    for (const glossChirho of verseChirho.glossesChirho) {
      const escapedGlossChirho = escapeStringChirho(glossChirho.glossChirho);
      const wordIdChirho = glossChirho.wordIdChirho;

      // This is idempotent - creates phrase if needed, updates gloss
      linesChirho.push(`
-- Word ${wordIdChirho}
WITH target_phrase AS (
  SELECT p.id as phrase_id
  FROM phrase p
  JOIN phrase_word pw ON pw.phrase_id = p.id
  WHERE pw.word_id = '${wordIdChirho}'
    AND p.language_id = (SELECT id FROM language WHERE code = '${languageCodeChirho}')
    AND p.deleted_at IS NULL
),
new_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = '${languageCodeChirho}'), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM target_phrase)
  RETURNING id as phrase_id
),
phrase_ref AS (
  SELECT phrase_id FROM target_phrase
  UNION ALL
  SELECT phrase_id FROM new_phrase
)
INSERT INTO phrase_word (phrase_id, word_id)
SELECT phrase_id, '${wordIdChirho}'
FROM new_phrase
ON CONFLICT DO NOTHING;

INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT
  COALESCE(
    (SELECT p.id FROM phrase p
     JOIN phrase_word pw ON pw.phrase_id = p.id
     WHERE pw.word_id = '${wordIdChirho}'
       AND p.language_id = (SELECT id FROM language WHERE code = '${languageCodeChirho}')
       AND p.deleted_at IS NULL),
    (SELECT id FROM phrase WHERE language_id = (SELECT id FROM language WHERE code = '${languageCodeChirho}') ORDER BY id DESC LIMIT 1)
  ),
  '${escapedGlossChirho}',
  'UNAPPROVED',
  NOW(),
  'IMPORT'
ON CONFLICT (phrase_id) DO UPDATE SET
  gloss = EXCLUDED.gloss,
  updated_at = EXCLUDED.updated_at,
  source = EXCLUDED.source
WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;
`);
    }
  }

  linesChirho.push(`COMMIT;`);

  return linesChirho.join("\n");
}

// Export for use by other tools
export { generateSqlChirho, GlossInputChirho, VerseInputChirho };

// Main CLI
if (import.meta.main) {
  const languageCodeArgChirho = process.argv[2];
  const jsonArgChirho = process.argv[3];

  if (!languageCodeArgChirho || !jsonArgChirho) {
    console.log("Usage: bun run tools-chirho/generate-translation-sql-chirho.ts <language_code> <json_file_or_data>");
    console.log("");
    console.log("Examples:");
    console.log('  bun run tools-chirho/generate-translation-sql-chirho.ts fra translations.json');
    console.log('  bun run tools-chirho/generate-translation-sql-chirho.ts spa \'{"versesChirho":[...]}\'');
    process.exit(1);
  }

  let inputChirho: BatchInputChirho | VerseInputChirho;

  try {
    // Try to read as file first
    const Bun = globalThis.Bun;
    const fileChirho = Bun.file(jsonArgChirho);
    if (await fileChirho.exists()) {
      inputChirho = await fileChirho.json();
    } else {
      // Parse as JSON string
      inputChirho = JSON.parse(jsonArgChirho);
    }
  } catch (errChirho) {
    console.error("Error parsing input:", errChirho);
    process.exit(1);
  }

  // Normalize input
  const versesChirho: VerseInputChirho[] = "versesChirho" in inputChirho
    ? inputChirho.versesChirho
    : [inputChirho];

  const sqlChirho = generateSqlChirho(languageCodeArgChirho, versesChirho);

  // Output to file
  const outputPathChirho = join(
    import.meta.dir,
    "..",
    "translations-chirho",
    `${languageCodeArgChirho}-${Date.now()}.sql`
  );

  writeFileSync(outputPathChirho, sqlChirho);
  console.log(`✓ Generated SQL written to: ${outputPathChirho}`);
  console.log(`  Apply with: docker compose exec db psql -U postgres -f /path/to/file.sql`);
}
