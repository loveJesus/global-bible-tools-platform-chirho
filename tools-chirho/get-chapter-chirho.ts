#!/usr/bin/env bun
// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Get an entire chapter with all words, lemmas, and current glosses
 * Run: bun run tools-chirho/get-chapter-chirho.ts "Genesis 1"
 *      bun run tools-chirho/get-chapter-chirho.ts 1 1
 *
 * Outputs JSON suitable for translation work
 */

import { getPgChirho, closePgChirho } from "./db-chirho";

interface ChapterWordChirho {
  verse_number: number;
  word_id: string;
  text: string;
  lemma_id: string;
  grammar: string;
  gloss: string | null;
  state: string | null;
}

interface VerseOutputChirho {
  verseNumberChirho: number;
  verseIdChirho: string;
  wordsChirho: Array<{
    wordIdChirho: string;
    textChirho: string;
    lemmaIdChirho: string;
    grammarChirho: string;
    currentGlossChirho: string | null;
  }>;
}

async function getChapterChirho(
  bookRefChirho: string,
  chapterNumChirho?: number
): Promise<void> {
  const pgChirho = getPgChirho();

  let bookIdChirho: number;
  let chapterChirho: number;

  // Parse input
  if (chapterNumChirho !== undefined) {
    // Numeric: book_id, chapter
    bookIdChirho = parseInt(bookRefChirho);
    chapterChirho = chapterNumChirho;
  } else {
    // String: "Genesis 1" or "Gen 1"
    const matchChirho = bookRefChirho.match(/^(\w+)\s+(\d+)$/);
    if (!matchChirho) {
      console.error('Invalid format. Use "Genesis 1" or book_id chapter');
      process.exit(1);
    }

    const [, bookNameChirho, chapStrChirho] = matchChirho;
    chapterChirho = parseInt(chapStrChirho);

    const bookResultChirho = await pgChirho<{ id: number; name: string }[]>`
      SELECT id, name FROM book
      WHERE LOWER(name) LIKE ${bookNameChirho.toLowerCase() + "%"}
      LIMIT 1
    `;

    if (bookResultChirho.length === 0) {
      console.error(`Book not found: ${bookNameChirho}`);
      process.exit(1);
    }

    bookIdChirho = bookResultChirho[0].id;
  }

  // Get book name
  const bookInfoChirho = await pgChirho<{ name: string }[]>`
    SELECT name FROM book WHERE id = ${bookIdChirho}
  `;

  if (bookInfoChirho.length === 0) {
    console.error(`Book ID not found: ${bookIdChirho}`);
    process.exit(1);
  }

  const bookNameChirho = bookInfoChirho[0].name;

  // Get all words in chapter
  const wordsChirho = await pgChirho<ChapterWordChirho[]>`
    SELECT
      v.number as verse_number,
      w.id as word_id,
      w.text,
      lf.lemma_id,
      lf.grammar,
      g.gloss,
      g.state
    FROM verse v
    JOIN word w ON w.verse_id = v.id
    JOIN lemma_form lf ON lf.id = w.form_id
    LEFT JOIN phrase_word pw ON pw.word_id = w.id
    LEFT JOIN phrase p ON p.id = pw.phrase_id
      AND p.deleted_at IS NULL
      AND p.language_id = (SELECT id FROM language WHERE code = 'eng')
    LEFT JOIN gloss g ON g.phrase_id = p.id
    WHERE v.book_id = ${bookIdChirho}
      AND v.chapter = ${chapterChirho}
    ORDER BY w.id
  `;

  if (wordsChirho.length === 0) {
    console.error(`No words found for ${bookNameChirho} ${chapterChirho}`);
    process.exit(1);
  }

  // Group by verse
  const versesMapChirho = new Map<number, ChapterWordChirho[]>();
  for (const wordChirho of wordsChirho) {
    const verseNumChirho = wordChirho.verse_number;
    if (!versesMapChirho.has(verseNumChirho)) {
      versesMapChirho.set(verseNumChirho, []);
    }
    versesMapChirho.get(verseNumChirho)!.push(wordChirho);
  }

  // Build output
  const outputChirho: {
    bookChirho: string;
    chapterChirho: number;
    versesChirho: VerseOutputChirho[];
  } = {
    bookChirho: bookNameChirho,
    chapterChirho: chapterChirho,
    versesChirho: [],
  };

  for (const [verseNumChirho, verseWordsChirho] of versesMapChirho) {
    const firstWordChirho = verseWordsChirho[0];
    const verseIdChirho = firstWordChirho.word_id.slice(0, 8); // Extract verse ID from word ID

    outputChirho.versesChirho.push({
      verseNumberChirho: verseNumChirho,
      verseIdChirho: verseIdChirho,
      wordsChirho: verseWordsChirho.map((wChirho) => ({
        wordIdChirho: wChirho.word_id,
        textChirho: wChirho.text,
        lemmaIdChirho: wChirho.lemma_id,
        grammarChirho: wChirho.grammar,
        currentGlossChirho: wChirho.gloss,
      })),
    });
  }

  // Output as JSON
  console.log(JSON.stringify(outputChirho, null, 2));
}

// Main
const arg1Chirho = process.argv[2];
const arg2Chirho = process.argv[3] ? parseInt(process.argv[3]) : undefined;

if (!arg1Chirho) {
  console.log("Usage:");
  console.log('  bun run tools-chirho/get-chapter-chirho.ts "Genesis 1"');
  console.log("  bun run tools-chirho/get-chapter-chirho.ts 1 1  (book_id, chapter)");
  process.exit(1);
}

getChapterChirho(arg1Chirho, arg2Chirho)
  .then(() => closePgChirho())
  .catch((errChirho) => {
    console.error("Error:", errChirho);
    process.exit(1);
  });
