// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Generate SQL files for Bible verse translations
 *
 * Usage: bun run tools-chirho/generate-verse-sql-chirho.ts <language> <book> <chapter> <verse> <translations.json>
 *
 * The translations.json file should contain an array of { wordId, gloss } objects
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

interface TranslationWordChirho {
  wordIdChirho: string;
  glossChirho: string;
  greekChirho?: string;
  lemmaIdChirho?: string;
}

interface VerseTranslationChirho {
  verseNumChirho: number;
  summaryChirho: string;
  wordsChirho: TranslationWordChirho[];
}

const HEADER_CHIRHO = `-- For God so loved the world, that He gave His only begotten Son,
-- that all who believe in Him should not perish but have everlasting life.
-- — John 3:16

`;

function generateWordSqlChirho(wordIdChirho: string, glossChirho: string, greekChirho: string, lemmaIdChirho: string, langCodeChirho: string): string {
  // Escape single quotes in gloss
  const escapedGlossChirho = glossChirho.replace(/'/g, "''");

  return `-- Word ${wordIdChirho}: ${greekChirho} (${lemmaIdChirho}) - "${glossChirho}"
WITH ensure_phrase AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = '${langCodeChirho}'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '${wordIdChirho}' AND p.language_id = (SELECT id FROM language WHERE code = '${langCodeChirho}') AND p.deleted_at IS NULL
  ) RETURNING id
), ensure_pw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '${wordIdChirho}' FROM ensure_phrase ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, '${escapedGlossChirho}', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '${wordIdChirho}' AND p.language_id = (SELECT id FROM language WHERE code = '${langCodeChirho}') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;
`;
}

function generateVerseFileSqlChirho(
  bookNameChirho: string,
  chapterChirho: number,
  verseChirho: VerseTranslationChirho,
  langCodeChirho: string
): string {
  let sqlChirho = HEADER_CHIRHO;

  sqlChirho += `-- ============================================================================
-- ${bookNameChirho.toUpperCase()} VERSE ${verseChirho.verseNumChirho} - ${langCodeChirho.toUpperCase()} Translation
-- ============================================================================
-- Verse ${verseChirho.verseNumChirho}: ${verseChirho.summaryChirho}

BEGIN;

`;

  for (const wordChirho of verseChirho.wordsChirho) {
    sqlChirho += generateWordSqlChirho(
      wordChirho.wordIdChirho,
      wordChirho.glossChirho,
      wordChirho.greekChirho || '',
      wordChirho.lemmaIdChirho || '',
      langCodeChirho
    );
    sqlChirho += '\n';
  }

  sqlChirho += 'COMMIT;\n';
  return sqlChirho;
}

async function mainChirho() {
  const argsChirho = process.argv.slice(2);

  if (argsChirho.length < 3) {
    console.log('Usage: bun run tools-chirho/generate-verse-sql-chirho.ts <language> <book> <verses.json>');
    console.log('');
    console.log('The verses.json should have format:');
    console.log('{');
    console.log('  "versesChirho": [');
    console.log('    {');
    console.log('      "verseNumChirho": 1,');
    console.log('      "summaryChirho": "translation summary",');
    console.log('      "wordsChirho": [');
    console.log('        { "wordIdChirho": "...", "glossChirho": "...", "greekChirho": "...", "lemmaIdChirho": "..." }');
    console.log('      ]');
    console.log('    }');
    console.log('  ]');
    console.log('}');
    process.exit(1);
  }

  const langCodeChirho = argsChirho[0];
  const bookNameChirho = argsChirho[1];
  const jsonFileChirho = argsChirho[argsChirho.length - 1];

  // Read the JSON file
  const jsonDataChirho = await Bun.file(jsonFileChirho).json();

  // Create output directory
  const outDirChirho = join(process.cwd(), 'translations-chirho', `${bookNameChirho.toLowerCase()}-${langCodeChirho}-chirho`);
  mkdirSync(outDirChirho, { recursive: true });

  // Generate files for each verse
  for (const verseChirho of jsonDataChirho.versesChirho as VerseTranslationChirho[]) {
    const sqlContentChirho = generateVerseFileSqlChirho(bookNameChirho, 1, verseChirho, langCodeChirho);
    const fileNameChirho = `v${String(verseChirho.verseNumChirho).padStart(2, '0')}-chirho.sql`;
    const filePathChirho = join(outDirChirho, fileNameChirho);

    writeFileSync(filePathChirho, sqlContentChirho);
    console.log(`Generated: ${filePathChirho}`);
  }

  // Generate a combined file for easy application
  let combinedSqlChirho = HEADER_CHIRHO;
  combinedSqlChirho += `-- ============================================================================
-- ${bookNameChirho.toUpperCase()} - ${langCodeChirho.toUpperCase()} Translation (Combined)
-- ============================================================================
-- Generated: ${new Date().toISOString()}
-- Total verses: ${jsonDataChirho.versesChirho.length}

`;

  for (const verseChirho of jsonDataChirho.versesChirho as VerseTranslationChirho[]) {
    combinedSqlChirho += `-- Verse ${verseChirho.verseNumChirho}: ${verseChirho.summaryChirho}\n`;
  }
  combinedSqlChirho += '\n';

  for (const verseChirho of jsonDataChirho.versesChirho as VerseTranslationChirho[]) {
    combinedSqlChirho += `BEGIN;\n-- === Verse ${verseChirho.verseNumChirho} ===\n\n`;
    for (const wordChirho of verseChirho.wordsChirho) {
      combinedSqlChirho += generateWordSqlChirho(
        wordChirho.wordIdChirho,
        wordChirho.glossChirho,
        wordChirho.greekChirho || '',
        wordChirho.lemmaIdChirho || '',
        langCodeChirho
      );
      combinedSqlChirho += '\n';
    }
    combinedSqlChirho += 'COMMIT;\n\n';
  }

  const combinedFilePathChirho = join(outDirChirho, 'all-verses-chirho.sql');
  writeFileSync(combinedFilePathChirho, combinedSqlChirho);
  console.log(`Generated combined file: ${combinedFilePathChirho}`);
}

mainChirho().catch(console.error);
