// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Import KJV reference verses using diatheke (SWORD tools)
 * Usage: bun run tools-chirho/import-kjv-chirho.ts [--book <name>]
 */

import { spawn as spawnChirho } from 'child_process';
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

interface VerseDataChirho {
  osisChirho: string;
  plainChirho: string;
}

async function getVerseDataChirho(refChirho: string): Promise<VerseDataChirho | null> {
  return new Promise((resolveChirho) => {
    // Get OSIS format (includes Strong's numbers in savlm attribute)
    const procChirho = spawnChirho('diatheke', ['-b', 'KJV', '-f', 'OSIS', '-k', refChirho]);
    let outputChirho = '';

    procChirho.stdout.on('data', (dataChirho: Buffer) => {
      outputChirho += dataChirho.toString();
    });

    procChirho.on('close', () => {
      // diatheke returns: "Reference: <w>...</w>...\n(KJV)"
      // Strip the reference prefix and trailing (KJV)
      const osisChirho = outputChirho
        .replace(/^[^:]+:\s*/, '')  // Remove "Jude 1:1: " prefix
        .replace(/\(KJV\)[\s\S]*$/, '')  // Remove "(KJV)" and anything after
        .replace(/<milestone[^>]*>/g, '')  // Remove milestone tags
        .trim();

      if (!osisChirho || osisChirho.length < 2) {
        resolveChirho(null);
        return;
      }

      // Create plain text by stripping all XML tags
      const plainChirho = osisChirho
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      if (!plainChirho || plainChirho.length < 2) {
        resolveChirho(null);
      } else {
        resolveChirho({ osisChirho, plainChirho });
      }
    });

    procChirho.on('error', () => {
      resolveChirho(null);
    });
  });
}

async function importBookChirho(bookChirho: typeof BOOKS_CHIRHO[0]): Promise<number> {
  let countChirho = 0;

  for (let chapChirho = 1; chapChirho <= bookChirho.chaptersChirho; chapChirho++) {
    let verseNumChirho = 1;
    let emptyCountChirho = 0;

    while (emptyCountChirho < 3) {
      const refChirho = `${bookChirho.nameChirho} ${chapChirho}:${verseNumChirho}`;
      const dataChirho = await getVerseDataChirho(refChirho);

      if (!dataChirho) {
        emptyCountChirho++;
        verseNumChirho++;
        continue;
      }

      emptyCountChirho = 0;
      const verseIdChirho = `${bookChirho.idChirho.toString().padStart(2, '0')}${chapChirho.toString().padStart(3, '0')}${verseNumChirho.toString().padStart(3, '0')}`;

      // Store both OSIS and plain text - OSIS in osis_chirho column, plain in text_chirho
      await queryPgChirho(
        `INSERT INTO reference_verse_chirho (version_id_chirho, verse_id_chirho, text_chirho, osis_chirho)
         VALUES (1, $1, $2, $3)
         ON CONFLICT (version_id_chirho, verse_id_chirho) DO UPDATE SET text_chirho = EXCLUDED.text_chirho, osis_chirho = EXCLUDED.osis_chirho`,
        [verseIdChirho, dataChirho.plainChirho, dataChirho.osisChirho]
      );

      countChirho++;
      verseNumChirho++;
    }

    process.stdout.write(`\r  ${bookChirho.nameChirho} ${chapChirho}/${bookChirho.chaptersChirho} - ${countChirho} verses`);
  }

  console.log();
  return countChirho;
}

async function mainChirho() {
  const argsChirho = process.argv.slice(2);
  const bookFilterChirho = argsChirho.includes('--book')
    ? argsChirho[argsChirho.indexOf('--book') + 1]?.toLowerCase()
    : null;

  console.log('Importing KJV reference verses...');
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
    const countChirho = await importBookChirho(bookChirho);
    totalChirho += countChirho;
  }

  console.log(`\nImported ${totalChirho} verses total.`);
  await closePgChirho();
}

mainChirho().catch((errChirho) => {
  console.error('Import failed:', errChirho);
  process.exit(1);
});
