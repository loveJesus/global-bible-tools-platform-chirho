#!/usr/bin/env bun
// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Check translation consistency - find lemmas with multiple different glosses
 * Run: bun run tools-chirho/check-consistency-chirho.ts [min_count] [max_variants]
 *
 * Arguments:
 *   min_count: Minimum occurrences to report (default: 10)
 *   max_variants: Show lemmas with more than this many variants (default: 3)
 */

import { getPgChirho, closePgChirho } from "./db-chirho";

interface InconsistentLemmaChirho {
  lemma_id: string;
  total_words: number;
  variant_count: number;
  glosses: string;
}

async function checkConsistencyChirho(
  minCountChirho: number,
  maxVariantsChirho: number
): Promise<void> {
  const pgChirho = getPgChirho();

  console.log(`\n${"=".repeat(70)}`);
  console.log(`CONSISTENCY CHECK`);
  console.log(`Finding lemmas with >${maxVariantsChirho} gloss variants (min ${minCountChirho} occurrences)`);
  console.log("=".repeat(70));

  const resultsChirho = await pgChirho<InconsistentLemmaChirho[]>`
    WITH lemma_glosses AS (
      SELECT
        lf.lemma_id,
        g.gloss,
        COUNT(*) as count
      FROM word w
      JOIN lemma_form lf ON lf.id = w.form_id
      JOIN phrase_word pw ON pw.word_id = w.id
      JOIN phrase p ON p.id = pw.phrase_id AND p.deleted_at IS NULL
      JOIN gloss g ON g.phrase_id = p.id
      JOIN language l ON l.id = p.language_id AND l.code = 'eng'
      WHERE g.gloss IS NOT NULL AND g.gloss != ''
      GROUP BY lf.lemma_id, g.gloss
    ),
    lemma_stats AS (
      SELECT
        lemma_id,
        SUM(count) as total_words,
        COUNT(DISTINCT gloss) as variant_count,
        STRING_AGG(gloss || ' (' || count || ')', ', ' ORDER BY count DESC) as glosses
      FROM lemma_glosses
      GROUP BY lemma_id
      HAVING SUM(count) >= ${minCountChirho}
        AND COUNT(DISTINCT gloss) > ${maxVariantsChirho}
    )
    SELECT * FROM lemma_stats
    ORDER BY variant_count DESC, total_words DESC
    LIMIT 50
  `;

  if (resultsChirho.length === 0) {
    console.log(`\n✓ No significant inconsistencies found!`);
    return;
  }

  console.log(`\nFound ${resultsChirho.length} lemmas with inconsistent translations:\n`);

  for (const lemmaChirho of resultsChirho) {
    console.log(`📍 ${lemmaChirho.lemma_id}`);
    console.log(`   Words: ${lemmaChirho.total_words} | Variants: ${lemmaChirho.variant_count}`);

    // Truncate glosses list if too long
    const glossesChirho = lemmaChirho.glosses.length > 200
      ? lemmaChirho.glosses.slice(0, 200) + "..."
      : lemmaChirho.glosses;
    console.log(`   Glosses: ${glossesChirho}`);
    console.log("");
  }

  // Summary
  const totalInconsistentChirho = resultsChirho.reduce(
    (sumChirho, lChirho) => sumChirho + lChirho.total_words,
    0
  );
  console.log("-".repeat(70));
  console.log(`Total words affected: ${totalInconsistentChirho}`);
  console.log(`\nUse 'bun run tools-chirho/query-lemma-chirho.ts <lemma_id>' to investigate`);
}

// Main
const minCountArgChirho = parseInt(process.argv[2] ?? "10");
const maxVariantsArgChirho = parseInt(process.argv[3] ?? "3");

checkConsistencyChirho(minCountArgChirho, maxVariantsArgChirho)
  .then(() => closePgChirho())
  .catch((errChirho) => {
    console.error("Error:", errChirho);
    process.exit(1);
  });
