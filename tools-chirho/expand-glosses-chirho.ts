// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Token-efficient gloss expansion tool
 *
 * Takes minimal JSON input (word ID → gloss only) and generates full SQL
 * by fetching Greek text and lemma IDs from the PostgreSQL database.
 *
 * INPUT FORMAT (minimal - saves tokens):
 * {
 *   "6500100101": "Ioudas",
 *   "6500100102": "de–Iēsoû",
 *   "6500100103": "Christoû"
 * }
 *
 * Usage:
 *   bun run expand-glosses-chirho <lang> <book> <glosses.json>
 *   bun run expand-glosses-chirho spa jude translations-chirho/jude-spa-chirho/glosses.json
 */

import { writeFileSync as writeFileSyncChirho, mkdirSync as mkdirSyncChirho } from 'fs';
import { join as joinChirho } from 'path';
import postgresChirho from 'postgres';

const DATABASE_URL_CHIRHO = process.env.DATABASE_URL_CHIRHO
  ?? 'postgresql://postgres:asdfasdf@localhost:5432/postgres';

const sqlChirho = postgresChirho(DATABASE_URL_CHIRHO);

const HEADER_CHIRHO = `-- For God so loved the world, that He gave His only begotten Son,
-- that all who believe in Him should not perish but have everlasting life.
-- — John 3:16

`;

interface WordInfoChirho {
  wordIdChirho: string;
  textChirho: string;
  lemmaIdChirho: string;
  verseNumChirho: number;
  chapterChirho: number;
}

async function fetchWordInfoChirho(wordIdsChirho: string[]): Promise<Map<string, WordInfoChirho>> {
  const resultsChirho = await sqlChirho`
    SELECT
      w.id as word_id,
      w.text as text,
      lf.lemma_id as lemma_id,
      v.number as verse_num,
      v.chapter as chapter
    FROM word w
    JOIN lemma_form lf ON lf.id = w.form_id
    JOIN verse v ON v.id = w.verse_id
    WHERE w.id = ANY(${wordIdsChirho})
    ORDER BY w.id
  `;

  const mapChirho = new Map<string, WordInfoChirho>();
  for (const rowChirho of resultsChirho) {
    mapChirho.set(rowChirho.word_id, {
      wordIdChirho: rowChirho.word_id,
      textChirho: rowChirho.text,
      lemmaIdChirho: rowChirho.lemma_id,
      verseNumChirho: rowChirho.verse_num,
      chapterChirho: rowChirho.chapter,
    });
  }
  return mapChirho;
}

function generateWordSqlChirho(
  wordIdChirho: string,
  glossChirho: string,
  greekChirho: string,
  lemmaIdChirho: string,
  langCodeChirho: string,
  modelChirho: string
): string {
  const escapedGlossChirho = glossChirho.replace(/'/g, "''");

  // Note: source column is enum {USER, IMPORT, MACHINE} - use MACHINE for AI translations
  // Model identifier is stored in SQL comments for tracking
  // Fixed: Two separate statements to handle both new and existing phrases
  // Statement 1: Creates phrase + phrase_word if they don't exist
  // Statement 2: Always inserts/updates gloss (works whether phrase existed or was just created)
  return `-- ${wordIdChirho}: ${greekChirho} (${lemmaIdChirho}) → "${glossChirho}" [${modelChirho}]
WITH np AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = '${langCodeChirho}'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '${wordIdChirho}' AND p.language_id = (SELECT id FROM language WHERE code = '${langCodeChirho}') AND p.deleted_at IS NULL
  )
  RETURNING id
)
INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '${wordIdChirho}' FROM np ON CONFLICT DO NOTHING;
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, '${escapedGlossChirho}', 'UNAPPROVED', NOW(), 'MACHINE'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '${wordIdChirho}' AND p.language_id = (SELECT id FROM language WHERE code = '${langCodeChirho}') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at, source = EXCLUDED.source;
`;
}

async function mainChirho() {
  const argsChirho = process.argv.slice(2);

  if (argsChirho.length < 3) {
    console.log('Usage: bun run expand-glosses-chirho <lang> <book> <glosses.json> [source]');
    console.log('');
    console.log('Input JSON format (minimal - just word ID to gloss):');
    console.log('{');
    console.log('  "6500100101": "Ioudas",');
    console.log('  "6500100102": "de–Iēsoû"');
    console.log('}');
    console.log('');
    console.log('Optional source defaults to "opus-4.5-chirho" (model identifier)');
    console.log('The tool fetches Greek text and lemma IDs from PostgreSQL automatically.');
    process.exit(1);
  }

  const langCodeChirho = argsChirho[0];
  const bookNameChirho = argsChirho[1];
  const jsonFileChirho = argsChirho[2];
  const sourceChirho = argsChirho[3] ?? 'opus-4.5-chirho';

  // Read the minimal JSON file (word ID → gloss only)
  const glossesChirho: Record<string, string> = await Bun.file(jsonFileChirho).json();
  const wordIdsChirho = Object.keys(glossesChirho);

  console.log(`Processing ${wordIdsChirho.length} glosses...`);

  // Fetch word info from database
  const wordInfoMapChirho = await fetchWordInfoChirho(wordIdsChirho);

  // Group by chapter and verse (key format: "028-011" for chapter 28, verse 11)
  const verseGroupsChirho = new Map<string, { wordIdChirho: string; glossChirho: string; infoChirho: WordInfoChirho }[]>();

  for (const [wordIdChirho, glossChirho] of Object.entries(glossesChirho)) {
    const infoChirho = wordInfoMapChirho.get(wordIdChirho);
    if (!infoChirho) {
      console.warn(`Warning: Word ${wordIdChirho} not found in database`);
      continue;
    }

    // Create key with chapter and verse: "028-011"
    const chapterVerseKeyChirho = `${String(infoChirho.chapterChirho).padStart(3, '0')}-${String(infoChirho.verseNumChirho).padStart(3, '0')}`;
    if (!verseGroupsChirho.has(chapterVerseKeyChirho)) {
      verseGroupsChirho.set(chapterVerseKeyChirho, []);
    }
    verseGroupsChirho.get(chapterVerseKeyChirho)!.push({ wordIdChirho, glossChirho, infoChirho });
  }

  // Sort by chapter-verse key
  const sortedVersesChirho = Array.from(verseGroupsChirho.entries()).sort((aChirho, bChirho) => aChirho[0].localeCompare(bChirho[0]));

  // Create output directory
  const outDirChirho = joinChirho(process.cwd(), 'translations-chirho', `${bookNameChirho.toLowerCase()}-${langCodeChirho}-chirho`);
  mkdirSyncChirho(outDirChirho, { recursive: true });

  // Generate files for each chapter-verse
  for (const [chapterVerseKeyChirho, wordsChirho] of sortedVersesChirho) {
    // Sort words within verse by word ID
    wordsChirho.sort((aChirho, bChirho) => aChirho.wordIdChirho.localeCompare(bChirho.wordIdChirho));

    // Extract chapter and verse from key (format: "028-011")
    const [chapterStrChirho, verseStrChirho] = chapterVerseKeyChirho.split('-');
    const chapterNumChirho = parseInt(chapterStrChirho, 10);
    const verseNumChirho = parseInt(verseStrChirho, 10);

    // Build summary from glosses
    const summaryChirho = wordsChirho.map(wChirho => wChirho.glossChirho).join(' ');

    let sqlChirhoContent = HEADER_CHIRHO;
    sqlChirhoContent += `-- ============================================================================
-- ${bookNameChirho.toUpperCase()} CHAPTER ${chapterNumChirho} VERSE ${verseNumChirho} - ${langCodeChirho.toUpperCase()} Translation
-- ============================================================================
-- ${summaryChirho}

BEGIN;

`;

    for (const wordChirho of wordsChirho) {
      sqlChirhoContent += generateWordSqlChirho(
        wordChirho.wordIdChirho,
        wordChirho.glossChirho,
        wordChirho.infoChirho.textChirho,
        wordChirho.infoChirho.lemmaIdChirho,
        langCodeChirho,
        sourceChirho
      );
      sqlChirhoContent += '\n';
    }

    sqlChirhoContent += 'COMMIT;\n';

    // Use c028-v011-chirho.sql naming format
    const fileNameChirho = `c${chapterStrChirho}-v${verseStrChirho}-chirho.sql`;
    const filePathChirho = joinChirho(outDirChirho, fileNameChirho);
    writeFileSyncChirho(filePathChirho, sqlChirhoContent);
    console.log(`Generated: ${filePathChirho}`);
  }

  // Generate combined file
  let combinedSqlChirho = HEADER_CHIRHO;
  combinedSqlChirho += `-- ============================================================================
-- ${bookNameChirho.toUpperCase()} - ${langCodeChirho.toUpperCase()} Translation (Combined)
-- ============================================================================
-- Generated: ${new Date().toISOString()}
-- Total chapter-verses: ${sortedVersesChirho.length}
-- Total words: ${wordIdsChirho.length}

`;

  for (const [chapterVerseKeyChirho, wordsChirho] of sortedVersesChirho) {
    wordsChirho.sort((aChirho, bChirho) => aChirho.wordIdChirho.localeCompare(bChirho.wordIdChirho));
    const summaryChirho = wordsChirho.map(wChirho => wChirho.glossChirho).join(' ');
    const [chapterStrChirho, verseStrChirho] = chapterVerseKeyChirho.split('-');
    combinedSqlChirho += `-- c${chapterStrChirho}-v${verseStrChirho}: ${summaryChirho}\n`;
  }
  combinedSqlChirho += '\n';

  for (const [chapterVerseKeyChirho, wordsChirho] of sortedVersesChirho) {
    wordsChirho.sort((aChirho, bChirho) => aChirho.wordIdChirho.localeCompare(bChirho.wordIdChirho));
    const [chapterStrChirho, verseStrChirho] = chapterVerseKeyChirho.split('-');
    combinedSqlChirho += `BEGIN;\n-- === Chapter ${parseInt(chapterStrChirho, 10)} Verse ${parseInt(verseStrChirho, 10)} ===\n`;
    for (const wordChirho of wordsChirho) {
      combinedSqlChirho += generateWordSqlChirho(
        wordChirho.wordIdChirho,
        wordChirho.glossChirho,
        wordChirho.infoChirho.textChirho,
        wordChirho.infoChirho.lemmaIdChirho,
        langCodeChirho,
        sourceChirho
      );
    }
    combinedSqlChirho += 'COMMIT;\n\n';
  }

  const combinedFilePathChirho = joinChirho(outDirChirho, 'all-verses-chirho.sql');
  writeFileSyncChirho(combinedFilePathChirho, combinedSqlChirho);
  console.log(`Generated combined: ${combinedFilePathChirho}`);

  await sqlChirho.end();
}

mainChirho().catch(console.error);
