// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Import SWORD module reference verses using diatheke
 * Usage: bun run tools-chirho/import-sword-chirho.ts <module> <version_id> [--book <name>]
 *
 * Examples:
 *   bun run tools-chirho/import-sword-chirho.ts KJV 1
 *   bun run tools-chirho/import-sword-chirho.ts SpaRV1909 3
 *   bun run tools-chirho/import-sword-chirho.ts ASV 2 --book Genesis
 */

import { execSync as execSyncChirho } from 'child_process';
import { initPgConnectionChirho, queryPgChirho, closePgChirho } from './db-chirho';

const BOOKS_CHIRHO = [
  // Old Testament
  { idChirho: 1, nameChirho: 'Genesis', chaptersChirho: 50 },
  { idChirho: 2, nameChirho: 'Exodus', chaptersChirho: 40 },
  { idChirho: 3, nameChirho: 'Leviticus', chaptersChirho: 27 },
  { idChirho: 4, nameChirho: 'Numbers', chaptersChirho: 36 },
  { idChirho: 5, nameChirho: 'Deuteronomy', chaptersChirho: 34 },
  { idChirho: 6, nameChirho: 'Joshua', chaptersChirho: 24 },
  { idChirho: 7, nameChirho: 'Judges', chaptersChirho: 21 },
  { idChirho: 8, nameChirho: 'Ruth', chaptersChirho: 4 },
  { idChirho: 9, nameChirho: 'I Samuel', chaptersChirho: 31 },
  { idChirho: 10, nameChirho: 'II Samuel', chaptersChirho: 24 },
  { idChirho: 11, nameChirho: 'I Kings', chaptersChirho: 22 },
  { idChirho: 12, nameChirho: 'II Kings', chaptersChirho: 25 },
  { idChirho: 13, nameChirho: 'I Chronicles', chaptersChirho: 29 },
  { idChirho: 14, nameChirho: 'II Chronicles', chaptersChirho: 36 },
  { idChirho: 15, nameChirho: 'Ezra', chaptersChirho: 10 },
  { idChirho: 16, nameChirho: 'Nehemiah', chaptersChirho: 13 },
  { idChirho: 17, nameChirho: 'Esther', chaptersChirho: 10 },
  { idChirho: 18, nameChirho: 'Job', chaptersChirho: 42 },
  { idChirho: 19, nameChirho: 'Psalms', chaptersChirho: 150 },
  { idChirho: 20, nameChirho: 'Proverbs', chaptersChirho: 31 },
  { idChirho: 21, nameChirho: 'Ecclesiastes', chaptersChirho: 12 },
  { idChirho: 22, nameChirho: 'Song of Solomon', chaptersChirho: 8 },
  { idChirho: 23, nameChirho: 'Isaiah', chaptersChirho: 66 },
  { idChirho: 24, nameChirho: 'Jeremiah', chaptersChirho: 52 },
  { idChirho: 25, nameChirho: 'Lamentations', chaptersChirho: 5 },
  { idChirho: 26, nameChirho: 'Ezekiel', chaptersChirho: 48 },
  { idChirho: 27, nameChirho: 'Daniel', chaptersChirho: 12 },
  { idChirho: 28, nameChirho: 'Hosea', chaptersChirho: 14 },
  { idChirho: 29, nameChirho: 'Joel', chaptersChirho: 3 },
  { idChirho: 30, nameChirho: 'Amos', chaptersChirho: 9 },
  { idChirho: 31, nameChirho: 'Obadiah', chaptersChirho: 1 },
  { idChirho: 32, nameChirho: 'Jonah', chaptersChirho: 4 },
  { idChirho: 33, nameChirho: 'Micah', chaptersChirho: 7 },
  { idChirho: 34, nameChirho: 'Nahum', chaptersChirho: 3 },
  { idChirho: 35, nameChirho: 'Habakkuk', chaptersChirho: 3 },
  { idChirho: 36, nameChirho: 'Zephaniah', chaptersChirho: 3 },
  { idChirho: 37, nameChirho: 'Haggai', chaptersChirho: 2 },
  { idChirho: 38, nameChirho: 'Zechariah', chaptersChirho: 14 },
  { idChirho: 39, nameChirho: 'Malachi', chaptersChirho: 4 },
  // New Testament
  { idChirho: 40, nameChirho: 'Matthew', chaptersChirho: 28 },
  { idChirho: 41, nameChirho: 'Mark', chaptersChirho: 16 },
  { idChirho: 42, nameChirho: 'Luke', chaptersChirho: 24 },
  { idChirho: 43, nameChirho: 'John', chaptersChirho: 21 },
  { idChirho: 44, nameChirho: 'Acts', chaptersChirho: 28 },
  { idChirho: 45, nameChirho: 'Romans', chaptersChirho: 16 },
  { idChirho: 46, nameChirho: 'I Corinthians', chaptersChirho: 16 },
  { idChirho: 47, nameChirho: 'II Corinthians', chaptersChirho: 13 },
  { idChirho: 48, nameChirho: 'Galatians', chaptersChirho: 6 },
  { idChirho: 49, nameChirho: 'Ephesians', chaptersChirho: 6 },
  { idChirho: 50, nameChirho: 'Philippians', chaptersChirho: 4 },
  { idChirho: 51, nameChirho: 'Colossians', chaptersChirho: 4 },
  { idChirho: 52, nameChirho: 'I Thessalonians', chaptersChirho: 5 },
  { idChirho: 53, nameChirho: 'II Thessalonians', chaptersChirho: 3 },
  { idChirho: 54, nameChirho: 'I Timothy', chaptersChirho: 6 },
  { idChirho: 55, nameChirho: 'II Timothy', chaptersChirho: 4 },
  { idChirho: 56, nameChirho: 'Titus', chaptersChirho: 3 },
  { idChirho: 57, nameChirho: 'Philemon', chaptersChirho: 1 },
  { idChirho: 58, nameChirho: 'Hebrews', chaptersChirho: 13 },
  { idChirho: 59, nameChirho: 'James', chaptersChirho: 5 },
  { idChirho: 60, nameChirho: 'I Peter', chaptersChirho: 5 },
  { idChirho: 61, nameChirho: 'II Peter', chaptersChirho: 3 },
  { idChirho: 62, nameChirho: 'I John', chaptersChirho: 5 },
  { idChirho: 63, nameChirho: 'II John', chaptersChirho: 1 },
  { idChirho: 64, nameChirho: 'III John', chaptersChirho: 1 },
  { idChirho: 65, nameChirho: 'Jude', chaptersChirho: 1 },
  { idChirho: 66, nameChirho: 'Revelation', chaptersChirho: 22 },
];

interface ParsedVerseChirho {
  verseIdChirho: string;
  osisChirho: string;
  plainChirho: string;
}

function getChapterVersesChirho(
  moduleChirho: string,
  bookChirho: typeof BOOKS_CHIRHO[0],
  chapterChirho: number
): ParsedVerseChirho[] {
  const versesChirho: ParsedVerseChirho[] = [];
  const refChirho = `${bookChirho.nameChirho} ${chapterChirho}`;

  try {
    // Get entire chapter at once - MUCH faster than verse-by-verse
    const outputChirho = execSyncChirho(`diatheke -b ${moduleChirho} -f OSIS -k "${refChirho}"`, {
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
    });

    // Each verse is on a separate line: "Genesis 1:1: <w>In the beginning</w>..."
    const linesChirho = outputChirho.split('\n');

    for (const lineChirho of linesChirho) {
      // Parse reference and content - handle various SWORD output formats
      // Format 1: "Book Chapter:Verse: content"
      // Format 2: "<tags>Book Chapter:Verse: <more tags>content"
      const matchChirho = lineChirho.match(/(?:^|>)(\w[\w\s]*?)\s+(\d+):(\d+):\s*(.+)$/);
      if (!matchChirho) continue;

      const [, returnedBookChirho, returnedChapChirho, verseNumChirho, contentChirho] = matchChirho;

      // Verify this is still from the requested book (diatheke continues into next book)
      const requestedBookLowerChirho = bookChirho.nameChirho.toLowerCase();
      const returnedBookLowerChirho = returnedBookChirho.trim().toLowerCase();

      if (!returnedBookLowerChirho.startsWith(requestedBookLowerChirho.slice(0, 3))) {
        // We've crossed into a different book, stop processing
        break;
      }

      // Verify chapter matches
      if (parseInt(returnedChapChirho) !== chapterChirho) {
        break;
      }

      // Clean OSIS content
      const osisChirho = contentChirho
        .replace(/<milestone[^>]*>/g, '')
        .trim();

      if (!osisChirho || osisChirho.length < 2) continue;

      // Create plain text by stripping XML tags
      const plainChirho = osisChirho
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      if (!plainChirho || plainChirho.length < 2) continue;

      // Create verse ID: BBCCCVVV
      const verseIdChirho = `${bookChirho.idChirho.toString().padStart(2, '0')}${chapterChirho.toString().padStart(3, '0')}${verseNumChirho.padStart(3, '0')}`;

      versesChirho.push({ verseIdChirho, osisChirho, plainChirho });
    }
  } catch (errChirho) {
    console.error(`Error getting ${refChirho}:`, errChirho);
  }

  return versesChirho;
}

async function importBookChirho(
  moduleChirho: string,
  versionIdChirho: number,
  bookChirho: typeof BOOKS_CHIRHO[0]
): Promise<number> {
  let countChirho = 0;

  for (let chapChirho = 1; chapChirho <= bookChirho.chaptersChirho; chapChirho++) {
    const versesChirho = getChapterVersesChirho(moduleChirho, bookChirho, chapChirho);

    // Batch insert all verses for this chapter
    for (const verseChirho of versesChirho) {
      await queryPgChirho(
        `INSERT INTO reference_verse_chirho (version_id_chirho, verse_id_chirho, text_chirho, osis_chirho)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (version_id_chirho, verse_id_chirho) DO UPDATE SET text_chirho = EXCLUDED.text_chirho, osis_chirho = EXCLUDED.osis_chirho`,
        [versionIdChirho, verseChirho.verseIdChirho, verseChirho.plainChirho, verseChirho.osisChirho]
      );
      countChirho++;
    }

    process.stdout.write(`\r  ${bookChirho.nameChirho} ${chapChirho}/${bookChirho.chaptersChirho} - ${countChirho} verses`);
  }

  console.log();
  return countChirho;
}

async function mainChirho() {
  const argsChirho = process.argv.slice(2);

  if (argsChirho.length < 2) {
    console.error('Usage: bun run tools-chirho/import-sword-chirho.ts <module> <version_id> [--book <name>]');
    console.error('\nExamples:');
    console.error('  bun run tools-chirho/import-sword-chirho.ts KJV 1');
    console.error('  bun run tools-chirho/import-sword-chirho.ts SpaRV1909 3');
    console.error('  bun run tools-chirho/import-sword-chirho.ts ASV 2 --book Genesis');
    console.error('\nAvailable SWORD modules (run `diatheke -b system -k modulelist` to see all):');
    console.error('  KJV, ASV, SpaRV1909, etc.');
    process.exit(1);
  }

  const moduleChirho = argsChirho[0];
  const versionIdChirho = parseInt(argsChirho[1], 10);

  if (isNaN(versionIdChirho)) {
    console.error('version_id must be a number');
    process.exit(1);
  }

  const bookFilterChirho = argsChirho.includes('--book')
    ? argsChirho[argsChirho.indexOf('--book') + 1]?.toLowerCase()
    : null;

  console.log(`Importing ${moduleChirho} (version_id=${versionIdChirho}) reference verses...`);
  await initPgConnectionChirho();

  const booksToImportChirho = bookFilterChirho
    ? BOOKS_CHIRHO.filter(bChirho => bChirho.nameChirho.toLowerCase() === bookFilterChirho)
    : BOOKS_CHIRHO;

  if (booksToImportChirho.length === 0) {
    console.error(`Book not found: ${bookFilterChirho}`);
    console.error('Available books:', BOOKS_CHIRHO.map(bChirho => bChirho.nameChirho).join(', '));
    process.exit(1);
  }

  let totalChirho = 0;
  for (const bookChirho of booksToImportChirho) {
    console.log(`Importing ${bookChirho.nameChirho}...`);
    const countChirho = await importBookChirho(moduleChirho, versionIdChirho, bookChirho);
    totalChirho += countChirho;
  }

  console.log(`\nImported ${totalChirho} verses total.`);
  await closePgChirho();
}

mainChirho().catch((errChirho) => {
  console.error('Import failed:', errChirho);
  process.exit(1);
});
