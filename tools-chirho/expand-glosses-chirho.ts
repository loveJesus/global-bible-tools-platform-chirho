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

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import postgres from 'postgres';

const DATABASE_URL_CHIRHO = process.env.DATABASE_URL_CHIRHO
  ?? 'postgresql://postgres:asdfasdf@localhost:5432/postgres';

const sqlChirho = postgres(DATABASE_URL_CHIRHO);

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
  langCodeChirho: string
): string {
  const escapedGlossChirho = glossChirho.replace(/'/g, "''");

  return `-- ${wordIdChirho}: ${greekChirho} (${lemmaIdChirho}) → "${glossChirho}"
WITH ep AS (
  INSERT INTO phrase (language_id, created_at)
  SELECT (SELECT id FROM language WHERE code = '${langCodeChirho}'), NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
    WHERE pw.word_id = '${wordIdChirho}' AND p.language_id = (SELECT id FROM language WHERE code = '${langCodeChirho}') AND p.deleted_at IS NULL
  ) RETURNING id
), epw AS (
  INSERT INTO phrase_word (phrase_id, word_id) SELECT id, '${wordIdChirho}' FROM ep ON CONFLICT DO NOTHING
)
INSERT INTO gloss (phrase_id, gloss, state, updated_at, source)
SELECT p.id, '${escapedGlossChirho}', 'UNAPPROVED', NOW(), 'IMPORT'
FROM phrase p JOIN phrase_word pw ON pw.phrase_id = p.id
WHERE pw.word_id = '${wordIdChirho}' AND p.language_id = (SELECT id FROM language WHERE code = '${langCodeChirho}') AND p.deleted_at IS NULL
ON CONFLICT (phrase_id) DO UPDATE SET gloss = EXCLUDED.gloss, updated_at = EXCLUDED.updated_at WHERE gloss.gloss IS DISTINCT FROM EXCLUDED.gloss;
`;
}

async function mainChirho() {
  const argsChirho = process.argv.slice(2);

  if (argsChirho.length < 3) {
    console.log('Usage: bun run expand-glosses-chirho <lang> <book> <glosses.json>');
    console.log('');
    console.log('Input JSON format (minimal - just word ID to gloss):');
    console.log('{');
    console.log('  "6500100101": "Ioudas",');
    console.log('  "6500100102": "de–Iēsoû"');
    console.log('}');
    console.log('');
    console.log('The tool fetches Greek text and lemma IDs from PostgreSQL automatically.');
    process.exit(1);
  }

  const langCodeChirho = argsChirho[0];
  const bookNameChirho = argsChirho[1];
  const jsonFileChirho = argsChirho[2];

  // Read the minimal JSON file (word ID → gloss only)
  const glossesChirho: Record<string, string> = await Bun.file(jsonFileChirho).json();
  const wordIdsChirho = Object.keys(glossesChirho);

  console.log(`Processing ${wordIdsChirho.length} glosses...`);

  // Fetch word info from database
  const wordInfoMapChirho = await fetchWordInfoChirho(wordIdsChirho);

  // Group by verse
  const verseGroupsChirho = new Map<number, { wordIdChirho: string; glossChirho: string; infoChirho: WordInfoChirho }[]>();

  for (const [wordIdChirho, glossChirho] of Object.entries(glossesChirho)) {
    const infoChirho = wordInfoMapChirho.get(wordIdChirho);
    if (!infoChirho) {
      console.warn(`Warning: Word ${wordIdChirho} not found in database`);
      continue;
    }

    const verseNumChirho = infoChirho.verseNumChirho;
    if (!verseGroupsChirho.has(verseNumChirho)) {
      verseGroupsChirho.set(verseNumChirho, []);
    }
    verseGroupsChirho.get(verseNumChirho)!.push({ wordIdChirho, glossChirho, infoChirho });
  }

  // Sort verses
  const sortedVersesChirho = Array.from(verseGroupsChirho.entries()).sort((a, b) => a[0] - b[0]);

  // Create output directory
  const outDirChirho = join(process.cwd(), 'translations-chirho', `${bookNameChirho.toLowerCase()}-${langCodeChirho}-chirho`);
  mkdirSync(outDirChirho, { recursive: true });

  // Generate files for each verse
  for (const [verseNumChirho, wordsChirho] of sortedVersesChirho) {
    // Sort words within verse by word ID
    wordsChirho.sort((a, b) => a.wordIdChirho.localeCompare(b.wordIdChirho));

    // Build summary from glosses
    const summaryChirho = wordsChirho.map(w => w.glossChirho).join(' ');

    let sqlChirhoContent = HEADER_CHIRHO;
    sqlChirhoContent += `-- ============================================================================
-- ${bookNameChirho.toUpperCase()} VERSE ${verseNumChirho} - ${langCodeChirho.toUpperCase()} Translation
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
        langCodeChirho
      );
      sqlChirhoContent += '\n';
    }

    sqlChirhoContent += 'COMMIT;\n';

    const fileNameChirho = `v${String(verseNumChirho).padStart(2, '0')}-chirho.sql`;
    const filePathChirho = join(outDirChirho, fileNameChirho);
    writeFileSync(filePathChirho, sqlChirhoContent);
    console.log(`Generated: ${filePathChirho}`);
  }

  // Generate combined file
  let combinedSqlChirho = HEADER_CHIRHO;
  combinedSqlChirho += `-- ============================================================================
-- ${bookNameChirho.toUpperCase()} - ${langCodeChirho.toUpperCase()} Translation (Combined)
-- ============================================================================
-- Generated: ${new Date().toISOString()}
-- Total verses: ${sortedVersesChirho.length}
-- Total words: ${wordIdsChirho.length}

`;

  for (const [verseNumChirho, wordsChirho] of sortedVersesChirho) {
    wordsChirho.sort((a, b) => a.wordIdChirho.localeCompare(b.wordIdChirho));
    const summaryChirho = wordsChirho.map(w => w.glossChirho).join(' ');
    combinedSqlChirho += `-- v${verseNumChirho}: ${summaryChirho}\n`;
  }
  combinedSqlChirho += '\n';

  for (const [verseNumChirho, wordsChirho] of sortedVersesChirho) {
    wordsChirho.sort((a, b) => a.wordIdChirho.localeCompare(b.wordIdChirho));
    combinedSqlChirho += `BEGIN;\n-- === Verse ${verseNumChirho} ===\n`;
    for (const wordChirho of wordsChirho) {
      combinedSqlChirho += generateWordSqlChirho(
        wordChirho.wordIdChirho,
        wordChirho.glossChirho,
        wordChirho.infoChirho.textChirho,
        wordChirho.infoChirho.lemmaIdChirho,
        langCodeChirho
      );
    }
    combinedSqlChirho += 'COMMIT;\n\n';
  }

  const combinedFilePathChirho = join(outDirChirho, 'all-verses-chirho.sql');
  writeFileSync(combinedFilePathChirho, combinedSqlChirho);
  console.log(`Generated combined: ${combinedFilePathChirho}`);

  await sqlChirho.end();
}

mainChirho().catch(console.error);
