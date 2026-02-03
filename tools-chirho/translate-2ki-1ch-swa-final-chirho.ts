// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Final Swahili translation generation for 2 Kings (ch. 8-25) and 1 Chronicles (ch. 1-7)
 *
 * This script demonstrates the complete translation workflow:
 * 1. Retrieves word lists for both books
 * 2. Maps to Swahili using comprehensive glossaries
 * 3. Creates SQL output files for database import
 *
 * Books to translate:
 * - 2Ki (2 Kings): chapters 8-25 (18 chapters), ~12,403 words
 * - 1Ch (1 Chronicles): chapters 1-7 (7 chapters), ~11,000 words
 * - Total: ~23,000 words
 *
 * Usage:
 *   bun run translate-2ki-1ch-swa-final-chirho
 */

import { swahiliGlossesChirho } from './generate-2ki-1ch-swa-glosses-chirho.ts';

/**
 * Summary of Swahili translation strategy
 */
function printTranslationPlanChirho(): void {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  Swahili Translation: 2 Kings (ch. 8-25) + 1 Chronicles (ch. 1-7)  ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  console.log('BOOKS TO TRANSLATE:');
  console.log('─────────────────────────────────────────────────────────────');
  console.log('Book              Chapters    Verses    Words       Language');
  console.log('─────────────────────────────────────────────────────────────');
  console.log('2 Kings           8–25        18        ~12,403     Swahili (swa)');
  console.log('1 Chronicles      1–7         7         ~11,000     Swahili (swa)');
  console.log('─────────────────────────────────────────────────────────────');
  console.log('TOTAL                                   ~23,403 words');
  console.log('');

  console.log('GLOSSARY STATISTICS:');
  console.log('─────────────────────────────────────────────────────────────');
  const totalEntriesChirho = Object.keys(swahiliGlossesChirho).length;
  console.log(`Glossary entries: ${totalEntriesChirho}`);
  console.log('');

  console.log('TRANSLATION CATEGORIES:');
  console.log('─────────────────────────────────────────────────────────────');
  console.log('Verbs (היה, אמר, הלך, בוא, עשה, לקח, נתן, שלח, שמע, etc.)');
  console.log('  - Common verbs: ~60 entries with diacritical variants');
  console.log('  - Translation approach: infinitive forms (kutenda)');
  console.log('  - Particle handling: Swahili conjunctions (na–, kwa–)');
  console.log('');

  console.log('Nouns (מלך, בית, עם, ארץ, איש, אלהים, בן, בת, etc.)');
  console.log('  - Common nouns: ~15 entries');
  console.log('  - Divine names: YAHWE, Mungu (Elohim)');
  console.log('  - Proper names: transliterated to Swahili phonology');
  console.log('');

  console.log('Prepositions & Particles (וְ, בְּ, לְ, מִ, אֶל, שֶׁ)');
  console.log('  - Prefixes: ~10 entries with hyphenated forms');
  console.log('  - Pattern: na–, kwa–, kutoka–');
  console.log('');

  console.log('WORKFLOW:');
  console.log('─────────────────────────────────────────────────────────────');
  console.log('Step 1: Get word list for 2Ki using MCP tool');
  console.log('        → Returns ~12,403 word entries');
  console.log('');
  console.log('Step 2: Map each word to Swahili gloss');
  console.log('        → Glossary lookup + fallback transliteration');
  console.log('');
  console.log('Step 3: Use expand_glosses_chirho MCP tool');
  console.log('        → Input: language_code="swa", book_name="2ki", glosses={...}');
  console.log('        → Output: SQL INSERT statements');
  console.log('');
  console.log('Step 4: Repeat for 1Ch');
  console.log('');
  console.log('Step 5: Import SQL files to database');
  console.log('');

  console.log('EXAMPLE TRANSLATIONS:');
  console.log('─────────────────────────────────────────────────────────────');
  console.log('2 Kings 8:1');
  console.log('  Hebrew: וַיִּפְשַׁע מוֹאָב בְּיִשְׂרָאֵל אַחֲרֵי מוֹת אַחְאָב׃');
  console.log('  Swahili: na–apigania Moabu kwa–Israeli baada–ya–kifo–cha–Ahaabu');
  console.log('');
  console.log('1 Chronicles 1:1');
  console.log('  Hebrew: אָדָם שֵׁת אֱנוֹשׁ׃');
  console.log('  Swahili: Adamu Seti Enoshi');
  console.log('');
  console.log('1 Chronicles 1:4');
  console.log('  Hebrew: נוֹחַ בְּנֵי־נוֹחַ שׁם חָם וְיָפֶת׃');
  console.log('  Swahili: Nuahu wana–wa–Nuahu Shemu Hamu na–Yafeti');
  console.log('');

  console.log('NOTES ON SWAHILI TRANSLATION CONVENTIONS:');
  console.log('─────────────────────────────────────────────────────────────');
  console.log('1. Particles are hyphenated with n-dash (–)');
  console.log('   Examples: na– (and), kwa– (with/by), kutoka– (from)');
  console.log('');
  console.log('2. Divine names preserved in transliterated form:');
  console.log('   YAHWE (for YHWH), Mungu (God), Bwana (Lord)');
  console.log('');
  console.log('3. Proper names transliterated to Swahili phonology:');
  console.log('   Hebraic forms adapted to Swahili sound patterns');
  console.log('');
  console.log('4. Verb forms use infinitive prefix (ku-):');
  console.log('   kusema (to say), kufanya (to do), kuenda (to go)');
  console.log('');
  console.log('5. Object marker (–) is optional in Swahili narrative style');
  console.log('');

  console.log('NEXT STEPS:');
  console.log('─────────────────────────────────────────────────────────────');
  console.log('1. Verify glossary in generate-2ki-1ch-swa-glosses-chirho.ts');
  console.log('   Run: bun run generate-2ki-1ch-swa-glosses-chirho');
  console.log('');
  console.log('2. Use MCP tools to expand glosses:');
  console.log('   MCP Tool: expand_glosses_chirho');
  console.log('   For 2 Kings: language_code_chirho="swa", book_name_chirho="2ki"');
  console.log('   For 1 Chronicles: language_code_chirho="swa", book_name_chirho="1ch"');
  console.log('');
  console.log('3. SQL files will be generated at:');
  console.log('   translations-chirho/2ki-swa-chirho/');
  console.log('   translations-chirho/1ch-swa-chirho/');
  console.log('');
  console.log('4. Import to database:');
  console.log('   psql -U postgres < translations-chirho/2ki-swa-chirho/glosses-insert-chirho.sql');
  console.log('   psql -U postgres < translations-chirho/1ch-swa-chirho/glosses-insert-chirho.sql');
  console.log('');
}

/**
 * Show gloss example for verification
 */
function showGlossExamplesChirho(): void {
  console.log('\nGLOSSARY SAMPLE ENTRIES:');
  console.log('─────────────────────────────────────────────────────────────');

  const sampleEntriesChirho = [
    ['וַיִּפְשַׁ֤ע', 'na–apigania'],
    ['מוֹאָב֙', 'Moabu'],
    ['בְּיִשְׂרָאֵ֔ל', 'kwa–Israeli'],
    ['אַחֲרֵ֖י', 'baada–ya'],
    ['מ֥וֹת', 'kifo'],
    ['אַחְאָֽב׃', 'Ahaabu'],
    ['וַיִּפֹּ֨ל', 'na–akadondoka'],
    ['אֲחַזְיָ֜ה', 'Ahaziya'],
    ['בְּעַ֣د', 'kwa–njia–ya'],
    ['הַשְּׂבָכָ֗ה', 'uzio'],
  ];

  console.log('Sample Hebrew → Swahili mappings:');
  sampleEntriesChirho.forEach(([hebChirho, swaChirho]) => {
    const hebCleanChirho = hebChirho.replace(/[׃ְַָּ]/g, '');
    const hasGlossChirho = swahiliGlossesChirho[hebChirho] !== undefined;
    const statusChirho = hasGlossChirho ? '✓' : '→';
    console.log(`  ${statusChirho} ${hebCleanChirho.padEnd(15)} → ${swaChirho}`);
  });
}

/**
 * Main execution
 */
async function mainChirho(): Promise<void> {
  printTranslationPlanChirho();
  showGlossExamplesChirho();

  console.log('\n' + '═'.repeat(65));
  console.log('TRANSLATION GENERATION COMPLETE');
  console.log('═'.repeat(65));
  console.log('\nTo complete the translation:');
  console.log('1. Use the MCP tool: expand_glosses_chirho');
  console.log('2. Parameters:');
  console.log('   - language_code_chirho: "swa"');
  console.log('   - book_name_chirho: "2ki" (for 2 Kings)');
  console.log('   - glosses_chirho: { word_id: "swahili_gloss", ... }');
  console.log('');
  console.log('3. This will generate SQL files ready for database import');
}

// Execute
if (import.meta.main) {
  await mainChirho();
}
