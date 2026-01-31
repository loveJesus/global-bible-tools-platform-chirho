#!/usr/bin/env bun
// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * SWORD Module Generator for Interlinear Bible Translations
 *
 * Generates SWORD modules (CrossWire Bible Society format) from our SQL-based
 * interlinear translations. The module includes:
 * - Original Greek/Hebrew text
 * - Word-by-word translations (glosses)
 * - Strong's numbers
 * - Morphological codes
 *
 * Usage:
 *   bun run tools-chirho/generate-sword-module-chirho.ts <language> [--books book1,book2]
 *
 * Examples:
 *   bun run tools-chirho/generate-sword-module-chirho.ts spa
 *   bun run tools-chirho/generate-sword-module-chirho.ts hin --books matthew,john,jude
 *   bun run tools-chirho/generate-sword-module-chirho.ts ben --books jude
 */

import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, basename } from "path";
import { $ } from "bun";
import postgres from "postgres";

// =============================================================================
// Configuration
// =============================================================================

const DATABASE_URL_CHIRHO =
  process.env.DATABASE_URL_CHIRHO ??
  "postgresql://postgres:asdfasdf@localhost:5435/postgres";

const TRANSLATIONS_DIR_CHIRHO = join(import.meta.dir, "..", "translations-chirho");
const OUTPUT_DIR_CHIRHO = join(import.meta.dir, "..", "sword-modules-chirho");

// Language name mappings for module metadata
const LANGUAGE_NAMES_CHIRHO: Record<string, { nameChirho: string; nativeNameChirho: string }> = {
  eng: { nameChirho: "English", nativeNameChirho: "English" },
  spa: { nameChirho: "Spanish", nativeNameChirho: "Español" },
  hin: { nameChirho: "Hindi", nativeNameChirho: "हिन्दी" },
  ben: { nameChirho: "Bengali", nativeNameChirho: "বাংলা" },
  por: { nameChirho: "Portuguese", nativeNameChirho: "Português" },
  rus: { nameChirho: "Russian", nativeNameChirho: "Русский" },
  swa: { nameChirho: "Swahili", nativeNameChirho: "Kiswahili" },
  tur: { nameChirho: "Turkish", nativeNameChirho: "Türkçe" },
  fra: { nameChirho: "French", nativeNameChirho: "Français" },
  deu: { nameChirho: "German", nativeNameChirho: "Deutsch" },
  ara: { nameChirho: "Arabic", nativeNameChirho: "العربية" },
  zho: { nameChirho: "Chinese", nativeNameChirho: "中文" },
  jpn: { nameChirho: "Japanese", nativeNameChirho: "日本語" },
  kor: { nameChirho: "Korean", nativeNameChirho: "한국어" },
  heb: { nameChirho: "Hebrew", nativeNameChirho: "עברית" },
  urd: { nameChirho: "Urdu", nativeNameChirho: "اردو" },
  ind: { nameChirho: "Indonesian", nativeNameChirho: "Bahasa Indonesia" },
  jav: { nameChirho: "Javanese", nativeNameChirho: "Basa Jawa" },
};

// OSIS book ID mappings (SWORD standard)
const BOOK_TO_OSIS_CHIRHO: Record<string, string> = {
  genesis: "Gen", exodus: "Exod", leviticus: "Lev", numbers: "Num",
  deuteronomy: "Deut", joshua: "Josh", judges: "Judg", ruth: "Ruth",
  "1samuel": "1Sam", "2samuel": "2Sam", "1kings": "1Kgs", "2kings": "2Kgs",
  "1chronicles": "1Chr", "2chronicles": "2Chr", ezra: "Ezra", nehemiah: "Neh",
  esther: "Esth", job: "Job", psalms: "Ps", proverbs: "Prov",
  ecclesiastes: "Eccl", songofsolomon: "Song", isaiah: "Isa", jeremiah: "Jer",
  lamentations: "Lam", ezekiel: "Ezek", daniel: "Dan", hosea: "Hos",
  joel: "Joel", amos: "Amos", obadiah: "Obad", jonah: "Jonah",
  micah: "Mic", nahum: "Nah", habakkuk: "Hab", zephaniah: "Zeph",
  haggai: "Hag", zechariah: "Zech", malachi: "Mal",
  matthew: "Matt", mark: "Mark", luke: "Luke", john: "John",
  acts: "Acts", romans: "Rom", "1corinthians": "1Cor", "2corinthians": "2Cor",
  galatians: "Gal", ephesians: "Eph", philippians: "Phil", colossians: "Col",
  "1thessalonians": "1Thess", "2thessalonians": "2Thess",
  "1timothy": "1Tim", "2timothy": "2Tim", titus: "Titus", philemon: "Phlm",
  hebrews: "Heb", james: "Jas", "1peter": "1Pet", "2peter": "2Pet",
  "1john": "1John", "2john": "2John", "3john": "3John", jude: "Jude",
  revelation: "Rev",
};

// Alternate book name mappings (from SQL dir names)
const BOOK_ALIASES_CHIRHO: Record<string, string> = {
  "1-corinthians": "1corinthians",
  "2-corinthians": "2corinthians",
  "1-peter": "1peter",
  "2-peter": "2peter",
  "1-thessalonians": "1thessalonians",
  "2-thessalonians": "2thessalonians",
  "1-timothy": "1timothy",
  "2-timothy": "2timothy",
};

// =============================================================================
// Types
// =============================================================================

interface WordDataChirho {
  wordIdChirho: string;
  greekTextChirho: string;
  lemmaIdChirho: string;
  grammarChirho: string;
  glossChirho: string;
  verseIdChirho: string;
  chapterChirho: number;
  verseNumChirho: number;
  wordPosChirho: number;
}

interface VerseDataChirho {
  verseIdChirho: string;
  osisIdChirho: string;
  chapterChirho: number;
  verseNumChirho: number;
  wordsChirho: WordDataChirho[];
}

interface BookDataChirho {
  bookNameChirho: string;
  osisBookChirho: string;
  versesChirho: Map<string, VerseDataChirho>;
}

// =============================================================================
// SQL Parsing
// =============================================================================

/**
 * Parse SQL comment to extract word ID, Greek text, lemma ID, and gloss
 * Format: -- 6500100101: Ἰούδας, (G2455) → "Ioúdas" [opus-4.5-chirho]
 */
function parseSqlCommentChirho(lineChirho: string): {
  wordIdChirho: string;
  greekTextChirho: string;
  lemmaIdChirho: string;
  glossChirho: string;
} | null {
  // Match pattern: -- WORDID: GREEK (LEMMA) → "GLOSS" [source]
  const matchChirho = lineChirho.match(
    /^--\s*(\d+):\s*([^(]+)\s*\(([^)]+)\)\s*→\s*"([^"]+)"/
  );

  if (!matchChirho) return null;

  return {
    wordIdChirho: matchChirho[1].trim(),
    greekTextChirho: matchChirho[2].trim().replace(/,$/, ""),
    lemmaIdChirho: matchChirho[3].trim(),
    glossChirho: matchChirho[4].trim(),
  };
}

/**
 * Parse a SQL file to extract word-by-word translation data
 */
function parseSqlFileChirho(filePathChirho: string): Map<string, { glossChirho: string; greekTextChirho: string; lemmaIdChirho: string }> {
  const contentChirho = readFileSync(filePathChirho, "utf-8");
  const linesChirho = contentChirho.split("\n");
  const wordsChirho = new Map<string, { glossChirho: string; greekTextChirho: string; lemmaIdChirho: string }>();

  for (const lineChirho of linesChirho) {
    const parsedChirho = parseSqlCommentChirho(lineChirho);
    if (parsedChirho) {
      wordsChirho.set(parsedChirho.wordIdChirho, {
        glossChirho: parsedChirho.glossChirho,
        greekTextChirho: parsedChirho.greekTextChirho,
        lemmaIdChirho: parsedChirho.lemmaIdChirho,
      });
    }
  }

  return wordsChirho;
}

// =============================================================================
// Database Access
// =============================================================================

/**
 * Fetch word metadata from database (morphology, verse info)
 */
async function fetchWordMetadataChirho(
  sqlChirho: ReturnType<typeof postgres>,
  wordIdsChirho: string[]
): Promise<Map<string, { grammarChirho: string; verseIdChirho: string; chapterChirho: number; verseNumChirho: number; bookNameChirho: string }>> {
  if (wordIdsChirho.length === 0) return new Map();

  const resultsChirho = await sqlChirho`
    SELECT
      w.id as word_id,
      lf.grammar as grammar,
      v.id as verse_id,
      v.chapter as chapter,
      v.number as verse_num,
      b.name as book_name
    FROM word w
    JOIN lemma_form lf ON lf.id = w.form_id
    JOIN verse v ON v.id = w.verse_id
    JOIN book b ON b.id = v.book_id
    WHERE w.id = ANY(${wordIdsChirho})
  `;

  const mapChirho = new Map<string, { grammarChirho: string; verseIdChirho: string; chapterChirho: number; verseNumChirho: number; bookNameChirho: string }>();
  for (const rowChirho of resultsChirho) {
    mapChirho.set(rowChirho.word_id, {
      grammarChirho: rowChirho.grammar || "",
      verseIdChirho: rowChirho.verse_id,
      chapterChirho: rowChirho.chapter,
      verseNumChirho: rowChirho.verse_num,
      bookNameChirho: rowChirho.book_name,
    });
  }

  return mapChirho;
}

// =============================================================================
// OSIS XML Generation
// =============================================================================

/**
 * Escape XML special characters
 */
function escapeXmlChirho(textChirho: string): string {
  return textChirho
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Convert Strong's number format (G2424 or H3068) to OSIS lemma format
 */
function formatStrongsChirho(lemmaIdChirho: string): string {
  // Handle formats like G2424, H3068, G0011
  const matchChirho = lemmaIdChirho.match(/^([GH])(\d+)$/);
  if (matchChirho) {
    const prefixChirho = matchChirho[1] === "G" ? "strong:G" : "strong:H";
    return `${prefixChirho}${matchChirho[2].padStart(4, "0")}`;
  }
  return `strong:${lemmaIdChirho}`;
}

/**
 * Convert morphology code to OSIS morph format
 * Input: Hebrew/Greek grammar codes from the database
 */
function formatMorphChirho(grammarChirho: string): string {
  if (!grammarChirho) return "";
  // Use robinson scheme for Greek NT morphology
  // For Hebrew, would use oshm or similar
  return `robinson:${grammarChirho}`;
}

/**
 * Generate OSIS XML header
 */
function generateOsisHeaderChirho(
  moduleIdChirho: string,
  langCodeChirho: string,
  langNameChirho: string
): string {
  const dateChirho = new Date().toISOString().split("T")[0];

  return `<?xml version="1.0" encoding="UTF-8"?>
<osis xmlns="http://www.bibletechnologies.net/2003/OSIS/namespace"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.bibletechnologies.net/2003/OSIS/namespace
                          http://www.crosswire.org/~dmsmith/osis/osisCore.2.1.1-cw-latest.xsd">
  <osisText osisIDWork="${moduleIdChirho}" osisRefWork="defaultReferenceScheme" xml:lang="${langCodeChirho}">
    <header>
      <work osisWork="${moduleIdChirho}">
        <title>Global Bible Tools Interlinear - ${langNameChirho}</title>
        <identifier type="OSIS">${moduleIdChirho}</identifier>
        <refSystem>Bible</refSystem>
        <language type="ISO-639-3">${langCodeChirho}</language>
        <date event="publication">${dateChirho}</date>
        <publisher>Global Bible Tools (global-tools.bible.systems)</publisher>
        <rights type="x-license">Creative Commons Attribution 4.0</rights>
        <description>Word-by-word interlinear translation from Greek/Hebrew with Strong's numbers and morphology</description>
      </work>
      <work osisWork="strong">
        <refSystem>Dict.Strongs</refSystem>
      </work>
      <work osisWork="robinson">
        <refSystem>Robinson</refSystem>
      </work>
    </header>
`;
}

/**
 * Generate OSIS XML for a single word with interlinear markup
 */
function generateWordOsisChirho(wordChirho: WordDataChirho, wordIndexChirho: number): string {
  const lemmaChirho = formatStrongsChirho(wordChirho.lemmaIdChirho);
  const morphChirho = wordChirho.grammarChirho ? ` morph="${formatMorphChirho(wordChirho.grammarChirho)}"` : "";
  const glossChirho = escapeXmlChirho(wordChirho.glossChirho);
  const textChirho = escapeXmlChirho(wordChirho.greekTextChirho);

  return `<w lemma="${lemmaChirho}"${morphChirho} gloss="${glossChirho}" n="${wordIndexChirho + 1}">${textChirho}</w>`;
}

/**
 * Generate OSIS XML for a verse
 */
function generateVerseOsisChirho(verseChirho: VerseDataChirho): string {
  const wordsXmlChirho = verseChirho.wordsChirho
    .map((wChirho, idxChirho) => generateWordOsisChirho(wChirho, idxChirho))
    .join(" ");

  return `        <verse osisID="${verseChirho.osisIdChirho}" sID="${verseChirho.osisIdChirho}"/>${wordsXmlChirho}<verse eID="${verseChirho.osisIdChirho}"/>
`;
}

/**
 * Generate OSIS XML for a chapter
 */
function generateChapterOsisChirho(
  osisBookChirho: string,
  chapterNumChirho: number,
  versesChirho: VerseDataChirho[]
): string {
  const chapterIdChirho = `${osisBookChirho}.${chapterNumChirho}`;
  const versesXmlChirho = versesChirho
    .sort((aChirho, bChirho) => aChirho.verseNumChirho - bChirho.verseNumChirho)
    .map(vChirho => generateVerseOsisChirho(vChirho))
    .join("");

  return `      <chapter osisID="${chapterIdChirho}" sID="${chapterIdChirho}"/>
${versesXmlChirho}      <chapter eID="${chapterIdChirho}"/>
`;
}

/**
 * Generate OSIS XML for a book
 */
function generateBookOsisChirho(bookChirho: BookDataChirho): string {
  // Group verses by chapter
  const chapterMapChirho = new Map<number, VerseDataChirho[]>();

  for (const verseChirho of bookChirho.versesChirho.values()) {
    if (!chapterMapChirho.has(verseChirho.chapterChirho)) {
      chapterMapChirho.set(verseChirho.chapterChirho, []);
    }
    chapterMapChirho.get(verseChirho.chapterChirho)!.push(verseChirho);
  }

  // Sort chapters and generate XML
  const chaptersChirho = Array.from(chapterMapChirho.entries())
    .sort((aChirho, bChirho) => aChirho[0] - bChirho[0]);

  const chaptersXmlChirho = chaptersChirho
    .map(([chNumChirho, versesChirho]) => generateChapterOsisChirho(bookChirho.osisBookChirho, chNumChirho, versesChirho))
    .join("");

  return `    <div type="book" osisID="${bookChirho.osisBookChirho}">
${chaptersXmlChirho}    </div>
`;
}

/**
 * Generate complete OSIS XML document
 */
function generateOsisDocumentChirho(
  moduleIdChirho: string,
  langCodeChirho: string,
  langNameChirho: string,
  booksChirho: BookDataChirho[]
): string {
  const headerChirho = generateOsisHeaderChirho(moduleIdChirho, langCodeChirho, langNameChirho);
  const booksXmlChirho = booksChirho
    .map(bChirho => generateBookOsisChirho(bChirho))
    .join("");

  return `${headerChirho}${booksXmlChirho}  </osisText>
</osis>
`;
}

// =============================================================================
// SWORD Configuration
// =============================================================================

/**
 * Generate SWORD .conf file
 */
function generateConfFileChirho(
  moduleIdChirho: string,
  langCodeChirho: string,
  langInfoChirho: { nameChirho: string; nativeNameChirho: string },
  bookCountChirho: number,
  verseCountChirho: number
): string {
  const dateChirho = new Date().toISOString().split("T")[0];

  return `[${moduleIdChirho}]
DataPath=./modules/texts/ztext/${moduleIdChirho}/
ModDrv=zText
SourceType=OSIS
Encoding=UTF-8
CompressType=ZIP
BlockType=BOOK
Versification=KJV

# Module Information
Description=Love Jesus Machine Translation Interlinear - ${langInfoChirho.nameChirho}
About=Word-by-word interlinear Bible translation from Greek/Hebrew.\\par\\par\\
Includes Strong's numbers, morphology codes, and ${langInfoChirho.nameChirho} glosses for each word.\\par\\par\\
Generated by Love Jesus (https://sword-modules-chirho.bible.systems)\\par\\
${bookCountChirho} books, ${verseCountChirho} verses translated.\\par\\par\\
Creative Commons Attribution 4.0 International License

# Language
Lang=${langCodeChirho}
LangSortOrder=${langCodeChirho}

# Version and Updates
Version=1.0
SwordVersionDate=${dateChirho}
MinimumVersion=1.7.0

# Features - Enable Strong's and morphology display
Feature=StrongsNumbers
GlobalOptionFilter=OSISStrongs
GlobalOptionFilter=OSISMorph
GlobalOptionFilter=OSISLemma
GlobalOptionFilter=OSISGlosses

# Distribution
DistributionLicense=Creative Commons: by 4.0
DistributionSource=https://sword-modules-chirho.bible.systems
TextSource=Love Jesus Project

# Category
Category=Biblical Texts
`;
}

// =============================================================================
// Main Processing
// =============================================================================

/**
 * Get list of available translation directories for a language
 */
function getTranslationDirsChirho(langCodeChirho: string): string[] {
  const suffixChirho = `-${langCodeChirho}-chirho`;
  const dirsChirho = readdirSync(TRANSLATIONS_DIR_CHIRHO)
    .filter(dChirho => dChirho.endsWith(suffixChirho))
    .map(dChirho => join(TRANSLATIONS_DIR_CHIRHO, dChirho));

  return dirsChirho;
}

/**
 * Extract book name from directory name
 * e.g., "matthew-spa-chirho" → "matthew"
 */
function extractBookNameChirho(dirNameChirho: string, langCodeChirho: string): string {
  const suffixChirho = `-${langCodeChirho}-chirho`;
  let bookChirho = basename(dirNameChirho).replace(suffixChirho, "");

  // Handle aliases
  if (BOOK_ALIASES_CHIRHO[bookChirho]) {
    bookChirho = BOOK_ALIASES_CHIRHO[bookChirho];
  }

  return bookChirho;
}

/**
 * Parse word ID to extract position
 * Word ID format: BBBCCVVVWWW (Book 3, Chapter 2, Verse 3, Word 3)
 */
function parseWordIdChirho(wordIdChirho: string): { bookChirho: number; chapterChirho: number; verseChirho: number; wordPosChirho: number } {
  // Format: 4000100101 = book 40, chapter 1, verse 1, word 1
  const idNumChirho = parseInt(wordIdChirho, 10);
  const wordPosChirho = idNumChirho % 100;
  const verseChirho = Math.floor((idNumChirho % 100000) / 100);
  const chapterChirho = Math.floor((idNumChirho % 10000000) / 100000);
  const bookChirho = Math.floor(idNumChirho / 10000000);

  return { bookChirho, chapterChirho, verseChirho, wordPosChirho };
}

/**
 * Process all translations for a language and build book data
 */
async function processTranslationsChirho(
  sqlChirho: ReturnType<typeof postgres>,
  langCodeChirho: string,
  filterBooksChirho?: string[]
): Promise<BookDataChirho[]> {
  const dirsChirho = getTranslationDirsChirho(langCodeChirho);

  if (dirsChirho.length === 0) {
    throw new Error(`No translations found for language: ${langCodeChirho}`);
  }

  console.log(`Found ${dirsChirho.length} translation directories for ${langCodeChirho}`);

  const booksMapChirho = new Map<string, BookDataChirho>();

  for (const dirChirho of dirsChirho) {
    const bookNameChirho = extractBookNameChirho(dirChirho, langCodeChirho);

    // Filter books if specified
    if (filterBooksChirho && !filterBooksChirho.includes(bookNameChirho.toLowerCase())) {
      continue;
    }

    const osisBookChirho = BOOK_TO_OSIS_CHIRHO[bookNameChirho.toLowerCase()];
    if (!osisBookChirho) {
      console.warn(`Unknown book: ${bookNameChirho}, skipping`);
      continue;
    }

    console.log(`Processing: ${bookNameChirho} (${osisBookChirho})`);

    // Get all SQL files in this directory
    const sqlFilesChirho = readdirSync(dirChirho)
      .filter(fChirho => fChirho.endsWith("-chirho.sql") && fChirho.startsWith("c"))
      .map(fChirho => join(dirChirho, fChirho));

    // Parse all SQL files to collect word data
    const allWordsChirho = new Map<string, { glossChirho: string; greekTextChirho: string; lemmaIdChirho: string }>();

    for (const sqlFileChirho of sqlFilesChirho) {
      const wordsChirho = parseSqlFileChirho(sqlFileChirho);
      for (const [idChirho, dataChirho] of wordsChirho) {
        allWordsChirho.set(idChirho, dataChirho);
      }
    }

    if (allWordsChirho.size === 0) {
      console.warn(`No words found in ${bookNameChirho}`);
      continue;
    }

    // Fetch metadata from database
    const wordIdsChirho = Array.from(allWordsChirho.keys());
    const metadataChirho = await fetchWordMetadataChirho(sqlChirho, wordIdsChirho);

    // Build verse structure
    const versesMapChirho = new Map<string, VerseDataChirho>();

    for (const [wordIdChirho, wordDataChirho] of allWordsChirho) {
      const metaChirho = metadataChirho.get(wordIdChirho);
      if (!metaChirho) {
        console.warn(`No metadata for word ${wordIdChirho}`);
        continue;
      }

      const parsedIdChirho = parseWordIdChirho(wordIdChirho);
      const osisVerseIdChirho = `${osisBookChirho}.${metaChirho.chapterChirho}.${metaChirho.verseNumChirho}`;

      if (!versesMapChirho.has(osisVerseIdChirho)) {
        versesMapChirho.set(osisVerseIdChirho, {
          verseIdChirho: metaChirho.verseIdChirho,
          osisIdChirho: osisVerseIdChirho,
          chapterChirho: metaChirho.chapterChirho,
          verseNumChirho: metaChirho.verseNumChirho,
          wordsChirho: [],
        });
      }

      versesMapChirho.get(osisVerseIdChirho)!.wordsChirho.push({
        wordIdChirho,
        greekTextChirho: wordDataChirho.greekTextChirho,
        lemmaIdChirho: wordDataChirho.lemmaIdChirho,
        grammarChirho: metaChirho.grammarChirho,
        glossChirho: wordDataChirho.glossChirho,
        verseIdChirho: metaChirho.verseIdChirho,
        chapterChirho: metaChirho.chapterChirho,
        verseNumChirho: metaChirho.verseNumChirho,
        wordPosChirho: parsedIdChirho.wordPosChirho,
      });
    }

    // Sort words within each verse by position
    for (const verseChirho of versesMapChirho.values()) {
      verseChirho.wordsChirho.sort((aChirho, bChirho) => aChirho.wordPosChirho - bChirho.wordPosChirho);
    }

    booksMapChirho.set(bookNameChirho, {
      bookNameChirho,
      osisBookChirho,
      versesChirho: versesMapChirho,
    });
  }

  // Sort books by canonical order
  const bookOrderChirho = Object.keys(BOOK_TO_OSIS_CHIRHO);
  const sortedBooksChirho = Array.from(booksMapChirho.values())
    .sort((aChirho, bChirho) => {
      const idxAChirho = bookOrderChirho.indexOf(aChirho.bookNameChirho.toLowerCase());
      const idxBChirho = bookOrderChirho.indexOf(bChirho.bookNameChirho.toLowerCase());
      return idxAChirho - idxBChirho;
    });

  return sortedBooksChirho;
}

/**
 * Main entry point
 */
async function mainChirho(): Promise<void> {
  const argsChirho = process.argv.slice(2);

  if (argsChirho.length === 0) {
    console.log("SWORD Module Generator for Interlinear Bible Translations");
    console.log("");
    console.log("Usage:");
    console.log("  bun run tools-chirho/generate-sword-module-chirho.ts <language> [--books book1,book2]");
    console.log("");
    console.log("Examples:");
    console.log("  bun run tools-chirho/generate-sword-module-chirho.ts spa");
    console.log("  bun run tools-chirho/generate-sword-module-chirho.ts hin --books matthew,john,jude");
    console.log("  bun run tools-chirho/generate-sword-module-chirho.ts ben --books jude");
    console.log("");
    console.log("Available languages:");
    const availableLangsChirho = new Set<string>();
    for (const dirChirho of readdirSync(TRANSLATIONS_DIR_CHIRHO)) {
      const matchChirho = dirChirho.match(/-([a-z]{3})-chirho$/);
      if (matchChirho) availableLangsChirho.add(matchChirho[1]);
    }
    console.log("  " + Array.from(availableLangsChirho).sort().join(", "));
    process.exit(1);
  }

  const langCodeChirho = argsChirho[0].toLowerCase();

  // Parse --books flag
  let filterBooksChirho: string[] | undefined;
  const booksIdxChirho = argsChirho.indexOf("--books");
  if (booksIdxChirho !== -1 && argsChirho[booksIdxChirho + 1]) {
    filterBooksChirho = argsChirho[booksIdxChirho + 1].toLowerCase().split(",");
    console.log(`Filtering to books: ${filterBooksChirho.join(", ")}`);
  }

  // Get language info
  const langInfoChirho = LANGUAGE_NAMES_CHIRHO[langCodeChirho] ?? {
    nameChirho: langCodeChirho.toUpperCase(),
    nativeNameChirho: langCodeChirho.toUpperCase(),
  };

  // Module ID (e.g., LJMTIntSpaChirho for Spanish - Love Jesus Machine Translation)
  const moduleIdChirho = `LJMTInt${langCodeChirho.charAt(0).toUpperCase()}${langCodeChirho.slice(1)}Chirho`;

  console.log(`\n${"=".repeat(60)}`);
  console.log(`Generating SWORD Module: ${moduleIdChirho}`);
  console.log(`Language: ${langInfoChirho.nameChirho} (${langCodeChirho})`);
  console.log("=".repeat(60));
  console.log("");

  // Connect to database
  console.log("Connecting to database...");
  const sqlChirho = postgres(DATABASE_URL_CHIRHO, {
    max: 5,
    idle_timeout: 30,
  });

  try {
    // Test connection
    await sqlChirho`SELECT 1`;
    console.log("Database connected successfully\n");

    // Process translations
    const booksChirho = await processTranslationsChirho(sqlChirho, langCodeChirho, filterBooksChirho);

    if (booksChirho.length === 0) {
      throw new Error("No books processed successfully");
    }

    // Count total verses
    let totalVersesChirho = 0;
    for (const bookChirho of booksChirho) {
      totalVersesChirho += bookChirho.versesChirho.size;
    }

    console.log(`\nProcessed ${booksChirho.length} books, ${totalVersesChirho} verses`);

    // Create output directory structure
    const modulePathChirho = join(OUTPUT_DIR_CHIRHO, moduleIdChirho);
    const modulesPathChirho = join(modulePathChirho, "modules", "texts", "ztext", moduleIdChirho);
    const modsPathChirho = join(modulePathChirho, "mods.d");

    mkdirSync(modulesPathChirho, { recursive: true });
    mkdirSync(modsPathChirho, { recursive: true });

    // Generate OSIS XML
    console.log("\nGenerating OSIS XML...");
    const osisXmlChirho = generateOsisDocumentChirho(
      moduleIdChirho,
      langCodeChirho,
      langInfoChirho.nameChirho,
      booksChirho
    );

    const osisPathChirho = join(modulePathChirho, `${moduleIdChirho}.xml`);
    writeFileSync(osisPathChirho, osisXmlChirho, "utf-8");
    console.log(`Created: ${osisPathChirho}`);

    // Generate .conf file
    console.log("Generating .conf file...");
    const confContentChirho = generateConfFileChirho(
      moduleIdChirho,
      langCodeChirho,
      langInfoChirho,
      booksChirho.length,
      totalVersesChirho
    );

    const confPathChirho = join(modsPathChirho, `${moduleIdChirho.toLowerCase()}.conf`);
    writeFileSync(confPathChirho, confContentChirho, "utf-8");
    console.log(`Created: ${confPathChirho}`);

    // Run osis2mod to create the module
    console.log("\nRunning osis2mod...");
    try {
      const resultChirho = await $`osis2mod ${modulesPathChirho} ${osisPathChirho} -z z -b 4`.text();
      console.log("osis2mod completed successfully");
      if (resultChirho.trim()) {
        console.log(resultChirho);
      }
    } catch (errChirho) {
      console.error("osis2mod failed:", errChirho);
      console.log("\nNote: The OSIS XML file was still created. You can run osis2mod manually:");
      console.log(`  osis2mod ${modulesPathChirho} ${osisPathChirho} -z z -b 4`);
    }

    // Summary
    console.log(`\n${"=".repeat(60)}`);
    console.log("SWORD Module Generation Complete!");
    console.log("=".repeat(60));
    console.log("");
    console.log(`Module ID: ${moduleIdChirho}`);
    console.log(`Output directory: ${modulePathChirho}`);
    console.log("");
    console.log("Files created:");
    console.log(`  - ${osisPathChirho}`);
    console.log(`  - ${confPathChirho}`);
    console.log(`  - ${modulesPathChirho}/ (binary module files)`);
    console.log("");
    console.log("To install the module:");
    console.log(`  1. Copy ${modulePathChirho}/mods.d/*.conf to ~/.sword/mods.d/`);
    console.log(`  2. Copy ${modulePathChirho}/modules/ to ~/.sword/modules/`);
    console.log("");
    console.log("Or create a ZIP for distribution:");
    console.log(`  cd ${modulePathChirho} && zip -r ${moduleIdChirho}.zip mods.d modules`);

  } finally {
    await sqlChirho.end();
  }
}

mainChirho().catch((errChirho) => {
  console.error("Error:", errChirho);
  process.exit(1);
});
