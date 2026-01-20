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
  { idChirho: 1, nameChirho: 'Genesis', chaptersChirho: 50 },
  { idChirho: 2, nameChirho: 'Exodus', chaptersChirho: 40 },
  { idChirho: 19, nameChirho: 'Psalms', chaptersChirho: 150 },
  { idChirho: 40, nameChirho: 'Matthew', chaptersChirho: 28 },
  { idChirho: 43, nameChirho: 'John', chaptersChirho: 21 },
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
