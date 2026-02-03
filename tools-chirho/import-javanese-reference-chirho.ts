// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

// Import Javanese Reference Bible from alkitab.mobi into the database
// FOR PERSONAL/SCHOLARLY USE ONLY - not for redistribution

import { Client } from 'pg';

const BOOKS_CHIRHO = [
  { code: 'Kej', name: 'Genesis', chapters: 50 },
  { code: 'Kel', name: 'Exodus', chapters: 40 },
  { code: 'Im', name: 'Leviticus', chapters: 27 },
  { code: 'Bil', name: 'Numbers', chapters: 36 },
  { code: 'Ul', name: 'Deuteronomy', chapters: 34 },
  { code: 'Yos', name: 'Joshua', chapters: 24 },
  { code: 'Hak', name: 'Judges', chapters: 21 },
  { code: 'Rut', name: 'Ruth', chapters: 4 },
  { code: '1Sam', name: '1 Samuel', chapters: 31 },
  { code: '2Sam', name: '2 Samuel', chapters: 24 },
  { code: '1Raj', name: '1 Kings', chapters: 22 },
  { code: '2Raj', name: '2 Kings', chapters: 25 },
  { code: '1Taw', name: '1 Chronicles', chapters: 29 },
  { code: '2Taw', name: '2 Chronicles', chapters: 36 },
  { code: 'Ezr', name: 'Ezra', chapters: 10 },
  { code: 'Neh', name: 'Nehemiah', chapters: 13 },
  { code: 'Est', name: 'Esther', chapters: 10 },
  { code: 'Ayb', name: 'Job', chapters: 42 },
  { code: 'Mzm', name: 'Psalms', chapters: 150 },
  { code: 'Ams', name: 'Proverbs', chapters: 31 },
  { code: 'Pkh', name: 'Ecclesiastes', chapters: 12 },
  { code: 'Kid', name: 'Song of Solomon', chapters: 8 },
  { code: 'Yes', name: 'Isaiah', chapters: 66 },
  { code: 'Yer', name: 'Jeremiah', chapters: 52 },
  { code: 'Rat', name: 'Lamentations', chapters: 5 },
  { code: 'Yeh', name: 'Ezekiel', chapters: 48 },
  { code: 'Dan', name: 'Daniel', chapters: 12 },
  { code: 'Hos', name: 'Hosea', chapters: 14 },
  { code: 'Yl', name: 'Joel', chapters: 3 },
  { code: 'Am', name: 'Amos', chapters: 9 },
  { code: 'Ob', name: 'Obadiah', chapters: 1 },
  { code: 'Yun', name: 'Jonah', chapters: 4 },
  { code: 'Mi', name: 'Micah', chapters: 7 },
  { code: 'Nah', name: 'Nahum', chapters: 3 },
  { code: 'Hab', name: 'Habakkuk', chapters: 3 },
  { code: 'Zef', name: 'Zephaniah', chapters: 3 },
  { code: 'Hag', name: 'Haggai', chapters: 2 },
  { code: 'Za', name: 'Zechariah', chapters: 14 },
  { code: 'Mal', name: 'Malachi', chapters: 4 },
  { code: 'Mat', name: 'Matthew', chapters: 28 },
  { code: 'Mrk', name: 'Mark', chapters: 16 },
  { code: 'Luk', name: 'Luke', chapters: 24 },
  { code: 'Yoh', name: 'John', chapters: 21 },
  { code: 'Kis', name: 'Acts', chapters: 28 },
  { code: 'Rom', name: 'Romans', chapters: 16 },
  { code: '1Kor', name: '1 Corinthians', chapters: 16 },
  { code: '2Kor', name: '2 Corinthians', chapters: 13 },
  { code: 'Gal', name: 'Galatians', chapters: 6 },
  { code: 'Ef', name: 'Ephesians', chapters: 6 },
  { code: 'Flp', name: 'Philippians', chapters: 4 },
  { code: 'Kol', name: 'Colossians', chapters: 4 },
  { code: '1Tes', name: '1 Thessalonians', chapters: 5 },
  { code: '2Tes', name: '2 Thessalonians', chapters: 3 },
  { code: '1Tim', name: '1 Timothy', chapters: 6 },
  { code: '2Tim', name: '2 Timothy', chapters: 4 },
  { code: 'Tit', name: 'Titus', chapters: 3 },
  { code: 'Flm', name: 'Philemon', chapters: 1 },
  { code: 'Ibr', name: 'Hebrews', chapters: 13 },
  { code: 'Yak', name: 'James', chapters: 5 },
  { code: '1Ptr', name: '1 Peter', chapters: 5 },
  { code: '2Ptr', name: '2 Peter', chapters: 3 },
  { code: '1Yoh', name: '1 John', chapters: 5 },
  { code: '2Yoh', name: '2 John', chapters: 1 },
  { code: '3Yoh', name: '3 John', chapters: 1 },
  { code: 'Yud', name: 'Jude', chapters: 1 },
  { code: 'Why', name: 'Revelation', chapters: 22 },
];

const BOOK_ID_MAP_CHIRHO: Record<string, number> = {
  'Genesis': 1, 'Exodus': 2, 'Leviticus': 3, 'Numbers': 4, 'Deuteronomy': 5,
  'Joshua': 6, 'Judges': 7, 'Ruth': 8, '1 Samuel': 9, '2 Samuel': 10,
  '1 Kings': 11, '2 Kings': 12, '1 Chronicles': 13, '2 Chronicles': 14,
  'Ezra': 15, 'Nehemiah': 16, 'Esther': 17, 'Job': 18, 'Psalms': 19,
  'Proverbs': 20, 'Ecclesiastes': 21, 'Song of Solomon': 22, 'Isaiah': 23,
  'Jeremiah': 24, 'Lamentations': 25, 'Ezekiel': 26, 'Daniel': 27,
  'Hosea': 28, 'Joel': 29, 'Amos': 30, 'Obadiah': 31, 'Jonah': 32,
  'Micah': 33, 'Nahum': 34, 'Habakkuk': 35, 'Zephaniah': 36, 'Haggai': 37,
  'Zechariah': 38, 'Malachi': 39, 'Matthew': 40, 'Mark': 41, 'Luke': 42,
  'John': 43, 'Acts': 44, 'Romans': 45, '1 Corinthians': 46, '2 Corinthians': 47,
  'Galatians': 48, 'Ephesians': 49, 'Philippians': 50, 'Colossians': 51,
  '1 Thessalonians': 52, '2 Thessalonians': 53, '1 Timothy': 54, '2 Timothy': 55,
  'Titus': 56, 'Philemon': 57, 'Hebrews': 58, 'James': 59, '1 Peter': 60,
  '2 Peter': 61, '1 John': 62, '2 John': 63, '3 John': 64, 'Jude': 65,
  'Revelation': 66,
};

async function fetchChapterChirho(bookCodeChirho: string, chapterChirho: number): Promise<Map<number, string>> {
  const urlChirho = `https://alkitab.mobi/jawa/${bookCodeChirho}/${chapterChirho}/`;
  const versesChirho = new Map<number, string>();

  try {
    const responseChirho = await fetch(urlChirho);
    const htmlChirho = await responseChirho.text();

    // Parse verses from HTML - pattern: <span class="reftext"><a name=v1...>1</a></span>Text...</p>
    // Match verse number and text until next <p> or end of div
    const versePatternChirho = /<span class="reftext"><a[^>]*>(\d+)<\/a><\/span>([^<]*(?:<(?!\/p>|span class="reftext")[^>]*>[^<]*)*)/g;
    let matchChirho;

    while ((matchChirho = versePatternChirho.exec(htmlChirho)) !== null) {
      const verseNumChirho = parseInt(matchChirho[1]);
      let textChirho = matchChirho[2]
        .replace(/<[^>]+>/g, '') // Remove HTML tags
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#\d+;/g, '') // Remove numeric HTML entities
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();

      if (textChirho && verseNumChirho > 0) {
        versesChirho.set(verseNumChirho, textChirho);
      }
    }
  } catch (errorChirho) {
    console.error(`Error fetching ${bookCodeChirho} ${chapterChirho}:`, errorChirho);
  }

  return versesChirho;
}

function makeVerseIdChirho(bookIdChirho: number, chapterChirho: number, verseChirho: number): string {
  const bbChirho = bookIdChirho.toString().padStart(2, '0');
  const cccChirho = chapterChirho.toString().padStart(3, '0');
  const vvvChirho = verseChirho.toString().padStart(3, '0');
  return `${bbChirho}${cccChirho}${vvvChirho}`;
}

const PARALLEL_BATCH_SIZE_CHIRHO = 10; // Fetch 10 chapters at once

async function mainChirho() {
  console.log('=== Importing Javanese Reference Bible (PARALLEL) ===');
  console.log('Source: alkitab.mobi/jawa (SABDA)');
  console.log('FOR PERSONAL/SCHOLARLY USE ONLY');
  console.log(`Parallel batch size: ${PARALLEL_BATCH_SIZE_CHIRHO}`);
  console.log('');

  // Connect to database
  const clientChirho = new Client({
    host: 'localhost',
    port: 5435,
    database: 'postgres',
    user: 'postgres',
    password: 'asdfasdf',
  });

  await clientChirho.connect();
  console.log('Connected to database');

  // Create or update version entry
  const versionResultChirho = await clientChirho.query(`
    INSERT INTO reference_version_chirho (code_chirho, name_chirho, language_code_chirho, source_chirho)
    VALUES ('javSABDA', 'Javanese Bible (SABDA)', 'jav', 'alkitab.mobi/jawa - Personal scholarly use only')
    ON CONFLICT (code_chirho) DO UPDATE SET name_chirho = EXCLUDED.name_chirho
    RETURNING id_chirho
  `);
  const versionIdChirho = versionResultChirho.rows[0].id_chirho;
  console.log(`Version ID: ${versionIdChirho}`);
  console.log('');

  let totalVersesChirho = 0;
  let totalChaptersChirho = 0;
  const totalExpectedChaptersChirho = BOOKS_CHIRHO.reduce((sumChirho, bChirho) => sumChirho + bChirho.chapters, 0);
  const startTimeChirho = Date.now();

  for (const bookChirho of BOOKS_CHIRHO) {
    const bookIdChirho = BOOK_ID_MAP_CHIRHO[bookChirho.name];
    const bookStartChirho = Date.now();
    let bookVersesChirho = 0;

    process.stdout.write(`${bookChirho.name}: `);

    // Process chapters in parallel batches
    for (let batchStartChirho = 1; batchStartChirho <= bookChirho.chapters; batchStartChirho += PARALLEL_BATCH_SIZE_CHIRHO) {
      const batchEndChirho = Math.min(batchStartChirho + PARALLEL_BATCH_SIZE_CHIRHO - 1, bookChirho.chapters);
      const chaptersInBatchChirho: number[] = [];
      for (let cChirho = batchStartChirho; cChirho <= batchEndChirho; cChirho++) {
        chaptersInBatchChirho.push(cChirho);
      }

      // Fetch all chapters in batch in parallel
      const batchResultsChirho = await Promise.all(
        chaptersInBatchChirho.map(async (chapterChirho) => {
          const versesChirho = await fetchChapterChirho(bookChirho.code, chapterChirho);
          return { chapterChirho, versesChirho };
        })
      );

      // Insert verses from batch (sequential DB writes to avoid conflicts)
      for (const { chapterChirho, versesChirho } of batchResultsChirho) {
        for (const [verseNumChirho, textChirho] of versesChirho) {
          const verseIdChirho = makeVerseIdChirho(bookIdChirho, chapterChirho, verseNumChirho);

          await clientChirho.query(`
            INSERT INTO reference_verse_chirho (version_id_chirho, verse_id_chirho, text_chirho)
            VALUES ($1, $2, $3)
            ON CONFLICT (version_id_chirho, verse_id_chirho) DO UPDATE SET text_chirho = EXCLUDED.text_chirho
          `, [versionIdChirho, verseIdChirho, textChirho]);

          totalVersesChirho++;
          bookVersesChirho++;
        }
        totalChaptersChirho++;
        process.stdout.write('.');
      }

      // Small delay between batches to be respectful
      await new Promise(resolveChirho => setTimeout(resolveChirho, 100));
    }

    const elapsedChirho = ((Date.now() - bookStartChirho) / 1000).toFixed(1);
    const totalElapsedChirho = ((Date.now() - startTimeChirho) / 1000).toFixed(0);
    console.log(` ${bookVersesChirho} verses (${elapsedChirho}s) [${totalChaptersChirho}/${totalExpectedChaptersChirho}] ${totalElapsedChirho}s total`);
  }

  await clientChirho.end();

  const totalTimeChirho = ((Date.now() - startTimeChirho) / 1000).toFixed(1);
  console.log('');
  console.log(`=== Complete ===`);
  console.log(`Total verses: ${totalVersesChirho}`);
  console.log(`Total chapters: ${totalChaptersChirho}`);
  console.log(`Total time: ${totalTimeChirho}s`);
}

mainChirho().catch(console.error);
