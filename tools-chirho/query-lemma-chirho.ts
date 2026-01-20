#!/usr/bin/env bun
// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Query lemma information including lexicon entries and usage statistics
 * Run: bun run tools-chirho/query-lemma-chirho.ts H3820
 *
 * Shows:
 * - Lemma ID and all grammatical forms
 * - Lexicon entries (BDB, LSJ, Strongs)
 * - Current gloss usage statistics
 * - Our translation decision (if recorded)
 */

import { getPgChirho, closePgChirho, getSqliteChirho, closeSqliteChirho } from "./db-chirho";

interface LemmaFormRowChirho {
  form_id: string;
  grammar: string;
  word_count: number;
}

interface LemmaResourceRowChirho {
  resource_code: string;
  content: string;
}

interface GlossUsageRowChirho {
  gloss: string;
  count: number;
  state: string;
}

interface LemmaDecisionRowChirho {
  primary_gloss_chirho: string;
  notes_chirho: string | null;
  is_polysemous_chirho: number;
  domain_name: string | null;
}

async function queryLemmaChirho(lemmaIdChirho: string): Promise<void> {
  const pgChirho = getPgChirho();
  const sqliteChirho = getSqliteChirho();

  console.log(`\n${"=".repeat(60)}`);
  console.log(`LEMMA: ${lemmaIdChirho}`);
  console.log("=".repeat(60));

  // 1. Get all forms of this lemma
  const formsChirho = await pgChirho<LemmaFormRowChirho[]>`
    SELECT
      lf.id as form_id,
      lf.grammar,
      COUNT(w.id) as word_count
    FROM lemma_form lf
    LEFT JOIN word w ON w.form_id = lf.id
    WHERE lf.lemma_id = ${lemmaIdChirho}
    GROUP BY lf.id, lf.grammar
    ORDER BY word_count DESC
  `;

  if (formsChirho.length === 0) {
    console.log(`\n❌ Lemma not found: ${lemmaIdChirho}`);
    return;
  }

  console.log(`\n📝 FORMS (${formsChirho.length} total):`);
  for (const formChirho of formsChirho.slice(0, 10)) {
    console.log(`  ${formChirho.form_id}`);
    console.log(`    Grammar: ${formChirho.grammar}`);
    console.log(`    Occurrences: ${formChirho.word_count}`);
  }
  if (formsChirho.length > 10) {
    console.log(`  ... and ${formsChirho.length - 10} more forms`);
  }

  // 2. Get lexicon resources
  const resourcesChirho = await pgChirho<LemmaResourceRowChirho[]>`
    SELECT resource_code, content
    FROM lemma_resource
    WHERE lemma_id = ${lemmaIdChirho}
    ORDER BY resource_code
  `;

  if (resourcesChirho.length > 0) {
    console.log(`\n📚 LEXICON ENTRIES:`);
    for (const resChirho of resourcesChirho) {
      console.log(`\n  [${resChirho.resource_code}]`);
      // Truncate long entries
      const contentChirho = resChirho.content.length > 500
        ? resChirho.content.slice(0, 500) + "..."
        : resChirho.content;
      console.log(`  ${contentChirho}`);
    }
  }

  // 3. Get current gloss usage in English
  const glossUsageChirho = await pgChirho<GlossUsageRowChirho[]>`
    SELECT
      g.gloss,
      COUNT(*) as count,
      g.state
    FROM word w
    JOIN lemma_form lf ON lf.id = w.form_id
    JOIN phrase_word pw ON pw.word_id = w.id
    JOIN phrase p ON p.id = pw.phrase_id AND p.deleted_at IS NULL
    JOIN gloss g ON g.phrase_id = p.id
    JOIN language l ON l.id = p.language_id AND l.code = 'eng'
    WHERE lf.lemma_id = ${lemmaIdChirho}
      AND g.gloss IS NOT NULL
      AND g.gloss != ''
    GROUP BY g.gloss, g.state
    ORDER BY count DESC
    LIMIT 15
  `;

  if (glossUsageChirho.length > 0) {
    console.log(`\n📊 CURRENT ENGLISH GLOSSES:`);
    for (const usageChirho of glossUsageChirho) {
      const stateChirho = usageChirho.state === "APPROVED" ? "✓" : "○";
      console.log(`  ${stateChirho} "${usageChirho.gloss}" (${usageChirho.count}x)`);
    }
  }

  // 4. Check our translation decision
  const decisionChirho = sqliteChirho
    .query<LemmaDecisionRowChirho, [string]>(`
      SELECT
        ld.primary_gloss_chirho,
        ld.notes_chirho,
        ld.is_polysemous_chirho,
        sd.name_chirho as domain_name
      FROM lemma_decision_chirho ld
      LEFT JOIN semantic_domain_chirho sd ON sd.id_chirho = ld.semantic_domain_id_chirho
      WHERE ld.lemma_id_chirho = ?
    `)
    .get(lemmaIdChirho);

  if (decisionChirho) {
    console.log(`\n🎯 OUR DECISION:`);
    console.log(`  Primary gloss: "${decisionChirho.primary_gloss_chirho}"`);
    if (decisionChirho.domain_name) {
      console.log(`  Semantic domain: ${decisionChirho.domain_name}`);
    }
    if (decisionChirho.is_polysemous_chirho) {
      console.log(`  ⚠️  Polysemous (has multiple senses)`);
    }
    if (decisionChirho.notes_chirho) {
      console.log(`  Notes: ${decisionChirho.notes_chirho}`);
    }
  } else {
    console.log(`\n⚠️  No translation decision recorded yet for this lemma`);
  }

  console.log("");
}

// Main
const lemmaIdArgChirho = process.argv[2];
if (!lemmaIdArgChirho) {
  console.log("Usage: bun run tools-chirho/query-lemma-chirho.ts <lemma_id>");
  console.log("Example: bun run tools-chirho/query-lemma-chirho.ts H3820");
  process.exit(1);
}

queryLemmaChirho(lemmaIdArgChirho)
  .then(() => closePgChirho())
  .then(() => closeSqliteChirho())
  .catch((errChirho) => {
    console.error("Error:", errChirho);
    process.exit(1);
  });
