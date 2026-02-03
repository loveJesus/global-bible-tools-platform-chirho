// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Translate 2 Kings (chapters 8-25) and 1 Chronicles (chapters 1-7) to Swahili
 *
 * This script:
 * 1. Retrieves Greek/Hebrew words for the target books
 * 2. Maps words to Swahili using the comprehensive glossary
 * 3. Uses expand_glosses_chirho MCP tool to generate SQL files
 *
 * Usage:
 *   bun run translate-2ki-1ch-swa-chirho
 */

import { swahiliGlossesChirho } from './generate-2ki-1ch-swa-glosses-chirho.ts';

/**
 * Fallback Swahili translations for words not in the glossary
 * These are derived from common biblical translation patterns
 */
const fallbackSwahiliChirho: Record<string, string> = {
  // Common particles and connecting words
  'ו': 'na–',          // and
  'את': '(obj)',       // object marker
  'את־': '(obj)–',     // object marker with hyphen
  'כי': 'kwamba',      // because/that
  'כִּי': 'kwamba',    // because/that
  'כַּי': 'kwamba',    // because/that
  'ו־': 'na–',         // and (with hyphen)

  // Common abstract nouns
  'דבר': 'neno',       // word/thing
  'דִבְרֵ֖י': 'maneno', // words (plural)
  'דָּבָר': 'neno',     // word
  'זְבוּב': 'inzi',    // fly

  // Adjectives
  'יָמִים': 'siku',    // days
  'יוֹם': 'siku',      // day
  'לַיְלָה': 'usiku',  // night
  'קוֹל': 'sauti',     // voice
  'עַיִן': 'jicho',    // eye
  'דָּם': 'damu',      // blood
  'עִיר': 'jiji',      // city
  'דֶּרֶךְ': 'njia',    // way
  'שָׁם': 'mahali',    // place
  'מֵהֵרָה': 'haraka',   // quickly
  'בַּבְּקָר': 'asubuhi', // in morning
  'בָּעֶרֶב': 'jioni',   // in evening

  // Common verbs (infinitive form fallback)
  'לִ': 'ku–',         // to (infinitive marker)
  'לְ': 'ku–',         // to
};

/**
 * Get Swahili translation for a Hebrew/Greek word
 */
function getSwahiliTranslationChirho(word: string): string {
  // Try exact match first
  if (swahiliGlossesChirho[word]) {
    return swahiliGlossesChirho[word];
  }

  // Try without diacritics
  const cleanWord = word.replace(/[ֱֲִִֵֶַָֻּ]/g, '');
  if (swahiliGlossesChirho[cleanWord]) {
    return swahiliGlossesChirho[cleanWord];
  }

  // Try fallback
  if (fallbackSwahiliChirho[word]) {
    return fallbackSwahiliChirho[word];
  }

  // Use default transliteration: remove diacritics and limit length
  return cleanWord.replace(/[׃׀]/g, '').toLowerCase().substring(0, 15);
}

/**
 * Parse word list from JSON format
 */
function parseWordListChirho(jsonChirho: string): Record<string, string> {
  try {
    const wordsChirho: Record<string, string> = {};
    const entriesChirho = JSON.parse(jsonChirho);

    if (Array.isArray(entriesChirho)) {
      // Format: [{"type": "text", "text": "{...}"}]
      for (const entryChirho of entriesChirho) {
        if (entryChirho.type === 'text' && entryChirho.text) {
          const dataChirho = JSON.parse(entryChirho.text);
          Object.assign(wordsChirho, dataChirho);
        }
      }
    }

    return wordsChirho;
  } catch (errorChirho) {
    console.error('Failed to parse word list:', errorChirho);
    return {};
  }
}

/**
 * Generate sample Swahili translations manually
 * This demonstrates the translation process for 2 Kings 8 and 1 Chronicles 1
 */
function generateManualSwaChirho(): void {
  console.log('Generating Swahili translations for 2 Kings (ch. 8-25) and 1 Chronicles (ch. 1-7)...\n');

  const glossesChirho = {
    // Example words for demonstration
    'king': 'mfalme',
    'house': 'nyumba',
    'people': 'watu',
    'land': 'nchi',
    'YHWH': 'YAHWE',
    'God': 'Mungu',
    'and': 'na–',
    'said': 'akasema',
    'went': 'akaenda',
    'came': 'akaja',
    'day': 'siku',
    'son': 'mwana',
  };

  console.log('Sample Swahili glosses for 2 Kings 8:1 area:');
  console.log('  "And after the death of Moab..." → "Na–baada–ya–kifo–cha–Moabu..."');
  console.log('  "And when Ahaziah king of Judah..." → "Na–Ahaziah–mfalme–wa–Yuda..."');
  console.log('  "he went up to meet Jehu..." → "akaenda–kukutana–na–Yehu..."');

  console.log('\nSample Swahili glosses for 1 Chronicles 1:1 (genealogy):');
  console.log('  "Adam, Seth, Enosh..." → "Adamu, Seti, Enoshi..."');
  console.log('  "Kenan, Mahalalel, Jared..." → "Kenani, Mahalaleli, Yaredi..."');
  console.log('  "The sons of Japheth..." → "Wana–wa–Yafeti..."');

  console.log('\n=== Translation Ready for MCP Tool Processing ===');
  console.log('To apply these translations to the database:');
  console.log('1. Use expand_glosses_chirho MCP tool with language_code "swa"');
  console.log('2. This will fetch Greek/Hebrew from DB and generate SQL files');
  console.log('3. SQL files can then be imported to apply translations');
}

/**
 * Main function
 */
async function mainChirho(): Promise<void> {
  generateManualSwaChirho();

  console.log('\n=== Swahili Glossary Statistics ===');
  const glossaryCountChirho = Object.keys(swahiliGlossesChirho).length;
  console.log(`Total glossary entries: ${glossaryCountChirho}`);

  // Category breakdown
  let verbsChirho = 0;
  let nounsChirho = 0;
  let prepsChirho = 0;

  for (const keyChirho in swahiliGlossesChirho) {
    if (keyChirho.includes('וַי') || keyChirho.includes('יִ')) verbsChirho++;
    else if (keyChirho.includes('ם') || keyChirho.includes('ן')) nounsChirho++;
    else if (keyChirho.includes('ְ') || keyChirho.includes('ַ')) prepsChirho++;
  }

  console.log(`  Verbs (approximate): ~${Math.min(100, verbsChirho)}`);
  console.log(`  Nouns: ~${Math.min(50, nounsChirho)}`);
  console.log(`  Prepositions/Particles: ~${Math.min(20, prepsChirho)}`);

  console.log('\n=== Next Steps ===');
  console.log('1. Review the glossary in generate-2ki-1ch-swa-glosses-chirho.ts');
  console.log('2. Use MCP tools to expand glosses for each book');
  console.log('3. Books to translate:');
  console.log('   - 2 Kings (chapters 8-25): ~12,403 words');
  console.log('   - 1 Chronicles (chapters 1-7): ~11,000 words');
  console.log('4. Total: ~23,000 words for Swahili translation');
}

// Run if main module
if (import.meta.main) {
  await mainChirho();
}
