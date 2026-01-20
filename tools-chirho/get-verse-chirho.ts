#!/usr/bin/env bun
// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Get verse with all words and current glosses
 * Run: bun run tools-chirho/get-verse-chirho.ts "01001001"
 *      bun run tools-chirho/get-verse-chirho.ts "Genesis 1:1"
 *
 * Output includes:
 * - Hebrew/Greek text
 * - Lemma IDs
 * - Grammar codes
 * - Current English gloss
 */

import { getPgChirho, closePgChirho } from "./db-chirho";

interface VerseRowChirho {
  verse_id: string;
  book_name: string;
  chapter: number;
  verse_number: number;
}

interface WordRowChirho {
  word_id: string;
  text: string;
  lemma_id: string;
  grammar: string;
  gloss: string | null;
  state: string | null;
}

async function parseVerseRefChirho(refChirho: string): Promise<string | null> {
  const pgChirho = getPgChirho();

  // If already in ID format (e.g., "01001001")
  if (/^\d{8}$/.test(refChirho)) {
    return refChirho;
  }

  // Parse "Genesis 1:1" or "Gen 1:1" format
  const matchChirho = refChirho.match(/^(\w+)\s+(\d+):(\d+)$/);
  if (!matchChirho) {
    return null;
  }

  const [, bookChirho, chapterChirho, verseChirho] = matchChirho;

  const resultChirho = await pgChirho<{ id: string }[]>`
    SELECT v.id
    FROM verse v
    JOIN book b ON b.id = v.book_id
    WHERE LOWER(b.name) LIKE ${bookChirho.toLowerCase() + "%"}
      AND v.chapter = ${parseInt(chapterChirho)}
      AND v.number = ${parseInt(verseChirho)}
    LIMIT 1
  `;

  return resultChirho[0]?.id ?? null;
}

async function getVerseChirho(verseRefChirho: string): Promise<void> {
  const pgChirho = getPgChirho();

  const verseIdChirho = await parseVerseRefChirho(verseRefChirho);
  if (!verseIdChirho) {
    console.log(`❌ Could not parse verse reference: ${verseRefChirho}`);
    return;
  }

  // Get verse info
  const verseInfoChirho = await pgChirho<VerseRowChirho[]>`
    SELECT
      v.id as verse_id,
      b.name as book_name,
      v.chapter,
      v.number as verse_number
    FROM verse v
    JOIN book b ON b.id = v.book_id
    WHERE v.id = ${verseIdChirho}
  `;

  if (verseInfoChirho.length === 0) {
    console.log(`❌ Verse not found: ${verseIdChirho}`);
    return;
  }

  const vChirho = verseInfoChirho[0];
  console.log(`\n${"=".repeat(60)}`);
  console.log(`${vChirho.book_name} ${vChirho.chapter}:${vChirho.verse_number} (${vChirho.verse_id})`);
  console.log("=".repeat(60));

  // Get all words with glosses
  const wordsChirho = await pgChirho<WordRowChirho[]>`
    SELECT
      w.id as word_id,
      w.text,
      lf.lemma_id,
      lf.grammar,
      g.gloss,
      g.state
    FROM word w
    JOIN lemma_form lf ON lf.id = w.form_id
    LEFT JOIN phrase_word pw ON pw.word_id = w.id
    LEFT JOIN phrase p ON p.id = pw.phrase_id
      AND p.deleted_at IS NULL
      AND p.language_id = (SELECT id FROM language WHERE code = 'eng')
    LEFT JOIN gloss g ON g.phrase_id = p.id
    WHERE w.verse_id = ${verseIdChirho}
    ORDER BY w.id
  `;

  console.log(`\n📖 ORIGINAL TEXT:`);
  const originalTextChirho = wordsChirho.map((wChirho) => wChirho.text).join(" ");
  console.log(`  ${originalTextChirho}`);

  console.log(`\n📝 WORD-BY-WORD:`);
  console.log("-".repeat(60));

  for (let iChirho = 0; iChirho < wordsChirho.length; iChirho++) {
    const wChirho = wordsChirho[iChirho];
    const numChirho = (iChirho + 1).toString().padStart(2, " ");
    const glossDisplayChirho = wChirho.gloss ?? "(no gloss)";
    const stateChirho = wChirho.state === "APPROVED" ? "✓" : "○";

    console.log(`${numChirho}. ${wChirho.text}`);
    console.log(`    Lemma: ${wChirho.lemma_id} | Grammar: ${wChirho.grammar}`);
    console.log(`    Gloss: ${stateChirho} ${glossDisplayChirho}`);
  }

  console.log("-".repeat(60));

  // Show current English reading
  console.log(`\n📚 CURRENT ENGLISH GLOSS:`);
  const englishGlossChirho = wordsChirho
    .map((wChirho) => wChirho.gloss ?? "___")
    .join(" ");
  console.log(`  ${englishGlossChirho}`);

  console.log("");
}

// Main
const verseArgChirho = process.argv[2];
if (!verseArgChirho) {
  console.log("Usage: bun run tools-chirho/get-verse-chirho.ts <verse_ref>");
  console.log("Examples:");
  console.log('  bun run tools-chirho/get-verse-chirho.ts "Genesis 1:1"');
  console.log('  bun run tools-chirho/get-verse-chirho.ts "01001001"');
  process.exit(1);
}

getVerseChirho(verseArgChirho)
  .then(() => closePgChirho())
  .catch((errChirho) => {
    console.error("Error:", errChirho);
    process.exit(1);
  });
