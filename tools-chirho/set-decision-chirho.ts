#!/usr/bin/env bun
// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Record a translation decision for a lemma
 * Run: bun run tools-chirho/set-decision-chirho.ts <lemma_id> <gloss> [notes]
 *
 * Example:
 *   bun run tools-chirho/set-decision-chirho.ts H3820 "heart" "Never translate as 'mind'"
 */

import { getSqliteChirho, closeSqliteChirho, initSqliteChirho } from "./db-chirho";

interface ExistingDecisionChirho {
  primary_gloss_chirho: string;
  notes_chirho: string | null;
}

function setDecisionChirho(
  lemmaIdChirho: string,
  glossChirho: string,
  notesChirho?: string
): void {
  // Ensure DB is initialized
  initSqliteChirho();

  const sqliteChirho = getSqliteChirho();

  // Check if decision already exists
  const existingChirho = sqliteChirho
    .query<ExistingDecisionChirho, [string]>(`
      SELECT primary_gloss_chirho, notes_chirho
      FROM lemma_decision_chirho
      WHERE lemma_id_chirho = ?
    `)
    .get(lemmaIdChirho);

  if (existingChirho) {
    console.log(`\n⚠️  Updating existing decision for ${lemmaIdChirho}`);
    console.log(`   Previous gloss: "${existingChirho.primary_gloss_chirho}"`);

    sqliteChirho
      .query(`
        UPDATE lemma_decision_chirho
        SET primary_gloss_chirho = ?,
            notes_chirho = ?,
            updated_at_chirho = CURRENT_TIMESTAMP
        WHERE lemma_id_chirho = ?
      `)
      .run(glossChirho, notesChirho ?? existingChirho.notes_chirho, lemmaIdChirho);

    console.log(`   New gloss: "${glossChirho}"`);
  } else {
    sqliteChirho
      .query(`
        INSERT INTO lemma_decision_chirho (lemma_id_chirho, primary_gloss_chirho, notes_chirho)
        VALUES (?, ?, ?)
      `)
      .run(lemmaIdChirho, glossChirho, notesChirho ?? null);

    console.log(`\n✓ Recorded decision for ${lemmaIdChirho}: "${glossChirho}"`);
  }

  if (notesChirho) {
    console.log(`   Notes: ${notesChirho}`);
  }
}

// Main
const lemmaIdArgChirho = process.argv[2];
const glossArgChirho = process.argv[3];
const notesArgChirho = process.argv[4];

if (!lemmaIdArgChirho || !glossArgChirho) {
  console.log("Usage: bun run tools-chirho/set-decision-chirho.ts <lemma_id> <gloss> [notes]");
  console.log("Example:");
  console.log('  bun run tools-chirho/set-decision-chirho.ts H3820 "heart" "Always literal"');
  process.exit(1);
}

setDecisionChirho(lemmaIdArgChirho, glossArgChirho, notesArgChirho);
closeSqliteChirho();
