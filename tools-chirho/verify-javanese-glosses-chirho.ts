// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

// Verify Javanese glosses against reference Bible
// Outputs issues to a file - blank file means all OK

import { Client } from 'pg';

const BOOK_NAMES_CHIRHO: Record<number, string> = {
  1: 'Genesis', 2: 'Exodus', 3: 'Leviticus', 4: 'Numbers', 5: 'Deuteronomy',
  6: 'Joshua', 7: 'Judges', 8: 'Ruth', 9: '1 Samuel', 10: '2 Samuel',
  11: '1 Kings', 12: '2 Kings', 13: '1 Chronicles', 14: '2 Chronicles',
  15: 'Ezra', 16: 'Nehemiah', 17: 'Esther', 18: 'Job', 19: 'Psalms',
  20: 'Proverbs', 21: 'Ecclesiastes', 22: 'Song of Solomon', 23: 'Isaiah',
  24: 'Jeremiah', 25: 'Lamentations', 26: 'Ezekiel', 27: 'Daniel',
  28: 'Hosea', 29: 'Joel', 30: 'Amos', 31: 'Obadiah', 32: 'Jonah',
  33: 'Micah', 34: 'Nahum', 35: 'Habakkuk', 36: 'Zephaniah', 37: 'Haggai',
  38: 'Zechariah', 39: 'Malachi', 40: 'Matthew', 41: 'Mark', 42: 'Luke',
  43: 'John', 44: 'Acts', 45: 'Romans', 46: '1 Corinthians', 47: '2 Corinthians',
  48: 'Galatians', 49: 'Ephesians', 50: 'Philippians', 51: 'Colossians',
  52: '1 Thessalonians', 53: '2 Thessalonians', 54: '1 Timothy', 55: '2 Timothy',
  56: 'Titus', 57: 'Philemon', 58: 'Hebrews', 59: 'James', 60: '1 Peter',
  61: '2 Peter', 62: '1 John', 63: '2 John', 64: '3 John', 65: 'Jude',
  66: 'Revelation',
};

interface VerseDataChirho {
  verseIdChirho: string;
  wordsChirho: Array<{
    wordIdChirho: string;
    originalTextChirho: string;
    glossChirho: string | null;
    lemmaChirho: string | null;
  }>;
  referenceTextChirho: string | null;
}

async function getChapterDataChirho(
  clientChirho: Client,
  bookIdChirho: number,
  chapterChirho: number
): Promise<VerseDataChirho[]> {
  const chapterPrefixChirho = `${bookIdChirho.toString().padStart(2, '0')}${chapterChirho.toString().padStart(3, '0')}`;

  // Get all words with Javanese glosses for this chapter
  // Use subquery to get exactly one gloss per word (if exists)
  const wordsResultChirho = await clientChirho.query(`
    SELECT DISTINCT ON (w.id)
      w.id as word_id,
      w.verse_id,
      w.text as original_text,
      (
        SELECT g.gloss
        FROM phrase_word pw
        JOIN phrase p ON p.id = pw.phrase_id
          AND p.language_id = (SELECT id FROM language WHERE code = 'jav')
          AND p.deleted_at IS NULL
        JOIN gloss g ON g.phrase_id = p.id
        WHERE pw.word_id = w.id
        LIMIT 1
      ) as gloss,
      lf.lemma_id
    FROM word w
    LEFT JOIN lemma_form lf ON lf.id = w.form_id
    WHERE w.verse_id LIKE $1
    ORDER BY w.id
  `, [chapterPrefixChirho + '%']);

  // Get reference verses
  const refResultChirho = await clientChirho.query(`
    SELECT verse_id_chirho, text_chirho
    FROM reference_verse_chirho
    WHERE version_id_chirho = 34 AND verse_id_chirho LIKE $1
  `, [chapterPrefixChirho + '%']);

  const refMapChirho = new Map<string, string>();
  for (const rowChirho of refResultChirho.rows) {
    refMapChirho.set(rowChirho.verse_id_chirho, rowChirho.text_chirho);
  }

  // Group words by verse
  const versesMapChirho = new Map<string, VerseDataChirho>();

  for (const rowChirho of wordsResultChirho.rows) {
    const verseIdChirho = rowChirho.verse_id;

    if (!versesMapChirho.has(verseIdChirho)) {
      versesMapChirho.set(verseIdChirho, {
        verseIdChirho,
        wordsChirho: [],
        referenceTextChirho: refMapChirho.get(verseIdChirho) || null,
      });
    }

    versesMapChirho.get(verseIdChirho)!.wordsChirho.push({
      wordIdChirho: rowChirho.word_id,
      originalTextChirho: rowChirho.original_text,
      glossChirho: rowChirho.gloss,
      lemmaChirho: rowChirho.lemma_id,
    });
  }

  return Array.from(versesMapChirho.values()).sort((aChirho, bChirho) =>
    aChirho.verseIdChirho.localeCompare(bChirho.verseIdChirho)
  );
}

function formatVerseRefChirho(verseIdChirho: string): string {
  const bookIdChirho = parseInt(verseIdChirho.slice(0, 2));
  const chapterChirho = parseInt(verseIdChirho.slice(2, 5));
  const verseChirho = parseInt(verseIdChirho.slice(5, 8));
  const bookNameChirho = BOOK_NAMES_CHIRHO[bookIdChirho] || `Book${bookIdChirho}`;
  return `${bookNameChirho} ${chapterChirho}:${verseChirho}`;
}

async function mainChirho() {
  const argsChirho = process.argv.slice(2);

  if (argsChirho.length < 2) {
    console.log('Usage: bun run verify-javanese-glosses-chirho.ts <book_id> <chapter>');
    console.log('       bun run verify-javanese-glosses-chirho.ts <book_id> all');
    console.log('Example: bun run verify-javanese-glosses-chirho.ts 1 1  (Genesis 1)');
    console.log('Example: bun run verify-javanese-glosses-chirho.ts 43 all  (All of John)');
    process.exit(1);
  }

  const bookIdChirho = parseInt(argsChirho[0]);
  const chapterArgChirho = argsChirho[1];
  const bookNameChirho = BOOK_NAMES_CHIRHO[bookIdChirho];

  if (!bookNameChirho) {
    console.error(`Invalid book ID: ${bookIdChirho}`);
    process.exit(1);
  }

  const clientChirho = new Client({
    host: 'localhost',
    port: 5435,
    database: 'postgres',
    user: 'postgres',
    password: 'asdfasdf',
  });

  await clientChirho.connect();

  const issuesChirho: string[] = [];

  // Determine chapters to process
  let chaptersChirho: number[] = [];
  if (chapterArgChirho === 'all') {
    // Get max chapter for this book
    const maxChapterResultChirho = await clientChirho.query(`
      SELECT MAX(CAST(SUBSTRING(verse_id FROM 3 FOR 3) AS INTEGER)) as max_chapter
      FROM word
      WHERE verse_id LIKE $1
    `, [bookIdChirho.toString().padStart(2, '0') + '%']);
    const maxChapterChirho = maxChapterResultChirho.rows[0].max_chapter || 1;
    for (let cChirho = 1; cChirho <= maxChapterChirho; cChirho++) {
      chaptersChirho.push(cChirho);
    }
  } else {
    chaptersChirho = [parseInt(chapterArgChirho)];
  }

  console.log(`Verifying ${bookNameChirho} (${chaptersChirho.length} chapters)...`);

  for (const chapterChirho of chaptersChirho) {
    const versesChirho = await getChapterDataChirho(clientChirho, bookIdChirho, chapterChirho);

    for (const verseChirho of versesChirho) {
      const verseRefChirho = formatVerseRefChirho(verseChirho.verseIdChirho);
      const problemsChirho: string[] = [];

      // Check 1: Missing glosses
      const missingGlossesChirho = verseChirho.wordsChirho.filter(wChirho => !wChirho.glossChirho);
      if (missingGlossesChirho.length > 0) {
        problemsChirho.push(`Missing ${missingGlossesChirho.length} glosses: ${missingGlossesChirho.map(wChirho => wChirho.originalTextChirho).join(', ')}`);
      }

      // Check 2: No reference text available
      if (!verseChirho.referenceTextChirho) {
        problemsChirho.push('No reference text available');
      }

      // Check 3: Build combined gloss and compare conceptually
      if (verseChirho.referenceTextChirho && missingGlossesChirho.length === 0) {
        const combinedGlossChirho = verseChirho.wordsChirho
          .map(wChirho => wChirho.glossChirho || '')
          .filter(gChirho => gChirho && gChirho !== '*')
          .join(' ')
          .replace(/–/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        // Check for obvious issues
        if (combinedGlossChirho.length < 5 && verseChirho.referenceTextChirho.length > 20) {
          problemsChirho.push(`Gloss too short: "${combinedGlossChirho}" vs reference length ${verseChirho.referenceTextChirho.length}`);
        }

        // Check for untranslated Greek/Hebrew characters
        if (/[\u0370-\u03FF\u0590-\u05FF]/.test(combinedGlossChirho)) {
          problemsChirho.push(`Contains untranslated Greek/Hebrew: "${combinedGlossChirho}"`);
        }

        // Check for placeholder markers that shouldn't be there
        if (/\[.*?\]/.test(combinedGlossChirho)) {
          problemsChirho.push(`Contains brackets/placeholders: "${combinedGlossChirho}"`);
        }
      }

      if (problemsChirho.length > 0) {
        issuesChirho.push(`${verseRefChirho}: ${problemsChirho.join('; ')}`);
      }
    }

    process.stdout.write('.');
  }

  await clientChirho.end();
  console.log('');

  // Write issues to file
  const outputPathChirho = `/Volumes/ENC_4TB_WDB_CHIRHO/dev-aleluya/friends-aleluya/andrewbeth-chirho/platform-chirho/translations-chirho/verify-jav-${bookNameChirho.toLowerCase().replace(/\s+/g, '-')}-chirho.txt`;

  if (issuesChirho.length > 0) {
    await Bun.write(outputPathChirho, issuesChirho.join('\n') + '\n');
    console.log(`Found ${issuesChirho.length} issues. Written to: ${outputPathChirho}`);
  } else {
    await Bun.write(outputPathChirho, '');
    console.log(`No issues found! Empty file: ${outputPathChirho}`);
  }
}

mainChirho().catch(console.error);
