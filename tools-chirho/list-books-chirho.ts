#!/usr/bin/env bun
// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * List all books in the Bible with chapter/verse counts
 * Run: bun run tools-chirho/list-books-chirho.ts
 */

import { getPgChirho, closePgChirho } from "./db-chirho";

interface BookRowChirho {
  id: number;
  name: string;
  chapter_count: number;
  verse_count: number;
  word_count: number;
}

async function listBooksChirho(): Promise<void> {
  const pgChirho = getPgChirho();

  const booksChirho = await pgChirho<BookRowChirho[]>`
    SELECT
      b.id,
      b.name,
      MAX(v.chapter) as chapter_count,
      COUNT(DISTINCT v.id) as verse_count,
      COUNT(w.id) as word_count
    FROM book b
    JOIN verse v ON v.book_id = b.id
    JOIN word w ON w.verse_id = v.id
    GROUP BY b.id, b.name
    ORDER BY b.id
  `;

  console.log(`\n${"=".repeat(60)}`);
  console.log(`BIBLE BOOKS (${booksChirho.length} total)`);
  console.log("=".repeat(60));
  console.log("");
  console.log("ID  | Name                  | Chapters | Verses | Words");
  console.log("-".repeat(60));

  let totalVersesChirho = 0;
  let totalWordsChirho = 0;

  for (const bookChirho of booksChirho) {
    const idPadChirho = bookChirho.id.toString().padStart(2, " ");
    const namePadChirho = bookChirho.name.padEnd(21, " ");
    const chapPadChirho = bookChirho.chapter_count.toString().padStart(8, " ");
    const versePadChirho = bookChirho.verse_count.toString().padStart(6, " ");
    const wordPadChirho = bookChirho.word_count.toString().padStart(6, " ");

    console.log(`${idPadChirho}  | ${namePadChirho} | ${chapPadChirho} | ${versePadChirho} | ${wordPadChirho}`);

    totalVersesChirho += bookChirho.verse_count;
    totalWordsChirho += bookChirho.word_count;
  }

  console.log("-".repeat(60));
  console.log(`TOTAL: ${totalVersesChirho} verses, ${totalWordsChirho} words`);
  console.log("");
}

listBooksChirho()
  .then(() => closePgChirho())
  .catch((errChirho) => {
    console.error("Error:", errChirho);
    process.exit(1);
  });
