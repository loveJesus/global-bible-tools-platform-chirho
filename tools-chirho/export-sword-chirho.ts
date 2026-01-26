#!/usr/bin/env bun
// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Export translations to SWORD module format
 *
 * Usage: bun run tools-chirho/export-sword-chirho.ts <language_code> [output_dir]
 *
 * Example:
 *   bun run tools-chirho/export-sword-chirho.ts spa
 *   bun run tools-chirho/export-sword-chirho.ts spa ./output-chirho
 *
 * This tool:
 * 1. Reads SQL translation files from translations-chirho/
 * 2. Extracts verse text from comment headers
 * 3. Generates OSIS XML file
 * 4. Runs osis2mod to create SWORD module
 * 5. Creates .conf configuration file
 */

import { readdir, readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join, dirname } from "path";
import { $ } from "bun";

// OSIS Book abbreviations mapping from our directory names to OSIS standard
const BOOK_MAPPING_CHIRHO: Record<string, { osisChirho: string; orderChirho: number; nameChirho: string }> = {
  // Old Testament
  "genesis": { osisChirho: "Gen", orderChirho: 1, nameChirho: "Genesis" },
  "exodus": { osisChirho: "Exod", orderChirho: 2, nameChirho: "Exodus" },
  "leviticus": { osisChirho: "Lev", orderChirho: 3, nameChirho: "Leviticus" },
  "numbers": { osisChirho: "Num", orderChirho: 4, nameChirho: "Numbers" },
  "deuteronomy": { osisChirho: "Deut", orderChirho: 5, nameChirho: "Deuteronomy" },
  "joshua": { osisChirho: "Josh", orderChirho: 6, nameChirho: "Joshua" },
  "judges": { osisChirho: "Judg", orderChirho: 7, nameChirho: "Judges" },
  "ruth": { osisChirho: "Ruth", orderChirho: 8, nameChirho: "Ruth" },
  "1samuel": { osisChirho: "1Sam", orderChirho: 9, nameChirho: "1 Samuel" },
  "2samuel": { osisChirho: "2Sam", orderChirho: 10, nameChirho: "2 Samuel" },
  "1kings": { osisChirho: "1Kgs", orderChirho: 11, nameChirho: "1 Kings" },
  "2kings": { osisChirho: "2Kgs", orderChirho: 12, nameChirho: "2 Kings" },
  "1chronicles": { osisChirho: "1Chr", orderChirho: 13, nameChirho: "1 Chronicles" },
  "2chronicles": { osisChirho: "2Chr", orderChirho: 14, nameChirho: "2 Chronicles" },
  "ezra": { osisChirho: "Ezra", orderChirho: 15, nameChirho: "Ezra" },
  "nehemiah": { osisChirho: "Neh", orderChirho: 16, nameChirho: "Nehemiah" },
  "esther": { osisChirho: "Esth", orderChirho: 17, nameChirho: "Esther" },
  "job": { osisChirho: "Job", orderChirho: 18, nameChirho: "Job" },
  "psalms": { osisChirho: "Ps", orderChirho: 19, nameChirho: "Psalms" },
  "proverbs": { osisChirho: "Prov", orderChirho: 20, nameChirho: "Proverbs" },
  "ecclesiastes": { osisChirho: "Eccl", orderChirho: 21, nameChirho: "Ecclesiastes" },
  "songofsolomon": { osisChirho: "Song", orderChirho: 22, nameChirho: "Song of Solomon" },
  "isaiah": { osisChirho: "Isa", orderChirho: 23, nameChirho: "Isaiah" },
  "jeremiah": { osisChirho: "Jer", orderChirho: 24, nameChirho: "Jeremiah" },
  "lamentations": { osisChirho: "Lam", orderChirho: 25, nameChirho: "Lamentations" },
  "ezekiel": { osisChirho: "Ezek", orderChirho: 26, nameChirho: "Ezekiel" },
  "daniel": { osisChirho: "Dan", orderChirho: 27, nameChirho: "Daniel" },
  "hosea": { osisChirho: "Hos", orderChirho: 28, nameChirho: "Hosea" },
  "joel": { osisChirho: "Joel", orderChirho: 29, nameChirho: "Joel" },
  "amos": { osisChirho: "Amos", orderChirho: 30, nameChirho: "Amos" },
  "obadiah": { osisChirho: "Obad", orderChirho: 31, nameChirho: "Obadiah" },
  "jonah": { osisChirho: "Jonah", orderChirho: 32, nameChirho: "Jonah" },
  "micah": { osisChirho: "Mic", orderChirho: 33, nameChirho: "Micah" },
  "nahum": { osisChirho: "Nah", orderChirho: 34, nameChirho: "Nahum" },
  "habakkuk": { osisChirho: "Hab", orderChirho: 35, nameChirho: "Habakkuk" },
  "zephaniah": { osisChirho: "Zeph", orderChirho: 36, nameChirho: "Zephaniah" },
  "haggai": { osisChirho: "Hag", orderChirho: 37, nameChirho: "Haggai" },
  "zechariah": { osisChirho: "Zech", orderChirho: 38, nameChirho: "Zechariah" },
  "malachi": { osisChirho: "Mal", orderChirho: 39, nameChirho: "Malachi" },
  // New Testament
  "matthew": { osisChirho: "Matt", orderChirho: 40, nameChirho: "Matthew" },
  "mark": { osisChirho: "Mark", orderChirho: 41, nameChirho: "Mark" },
  "luke": { osisChirho: "Luke", orderChirho: 42, nameChirho: "Luke" },
  "john": { osisChirho: "John", orderChirho: 43, nameChirho: "John" },
  "acts": { osisChirho: "Acts", orderChirho: 44, nameChirho: "Acts" },
  "romans": { osisChirho: "Rom", orderChirho: 45, nameChirho: "Romans" },
  "1corinthians": { osisChirho: "1Cor", orderChirho: 46, nameChirho: "1 Corinthians" },
  "2corinthians": { osisChirho: "2Cor", orderChirho: 47, nameChirho: "2 Corinthians" },
  "galatians": { osisChirho: "Gal", orderChirho: 48, nameChirho: "Galatians" },
  "ephesians": { osisChirho: "Eph", orderChirho: 49, nameChirho: "Ephesians" },
  "philippians": { osisChirho: "Phil", orderChirho: 50, nameChirho: "Philippians" },
  "colossians": { osisChirho: "Col", orderChirho: 51, nameChirho: "Colossians" },
  "1thessalonians": { osisChirho: "1Thess", orderChirho: 52, nameChirho: "1 Thessalonians" },
  "2thessalonians": { osisChirho: "2Thess", orderChirho: 53, nameChirho: "2 Thessalonians" },
  "1timothy": { osisChirho: "1Tim", orderChirho: 54, nameChirho: "1 Timothy" },
  "2timothy": { osisChirho: "2Tim", orderChirho: 55, nameChirho: "2 Timothy" },
  "titus": { osisChirho: "Titus", orderChirho: 56, nameChirho: "Titus" },
  "philemon": { osisChirho: "Phlm", orderChirho: 57, nameChirho: "Philemon" },
  "hebrews": { osisChirho: "Heb", orderChirho: 58, nameChirho: "Hebrews" },
  "james": { osisChirho: "Jas", orderChirho: 59, nameChirho: "James" },
  "1peter": { osisChirho: "1Pet", orderChirho: 60, nameChirho: "1 Peter" },
  "2peter": { osisChirho: "2Pet", orderChirho: 61, nameChirho: "2 Peter" },
  "1john": { osisChirho: "1John", orderChirho: 62, nameChirho: "1 John" },
  "2john": { osisChirho: "2John", orderChirho: 63, nameChirho: "2 John" },
  "3john": { osisChirho: "3John", orderChirho: 64, nameChirho: "3 John" },
  "jude": { osisChirho: "Jude", orderChirho: 65, nameChirho: "Jude" },
  "revelation": { osisChirho: "Rev", orderChirho: 66, nameChirho: "Revelation" },
  // Alternative naming (handle both formats)
  "1-corinthians": { osisChirho: "1Cor", orderChirho: 46, nameChirho: "1 Corinthians" },
  "2-corinthians": { osisChirho: "2Cor", orderChirho: 47, nameChirho: "2 Corinthians" },
  "1-thessalonians": { osisChirho: "1Thess", orderChirho: 52, nameChirho: "1 Thessalonians" },
  "2-thessalonians": { osisChirho: "2Thess", orderChirho: 53, nameChirho: "2 Thessalonians" },
  "1-timothy": { osisChirho: "1Tim", orderChirho: 54, nameChirho: "1 Timothy" },
  "2-timothy": { osisChirho: "2Tim", orderChirho: 55, nameChirho: "2 Timothy" },
  "1-peter": { osisChirho: "1Pet", orderChirho: 60, nameChirho: "1 Peter" },
  "2-peter": { osisChirho: "2Pet", orderChirho: 61, nameChirho: "2 Peter" },
};

// Language metadata
const LANGUAGE_INFO_CHIRHO: Record<string, { nameChirho: string; nativeChirho: string; directionChirho: string }> = {
  "spa": { nameChirho: "Spanish", nativeChirho: "Español", directionChirho: "LtoR" },
  "hin": { nameChirho: "Hindi", nativeChirho: "हिन्दी", directionChirho: "LtoR" },
  "ben": { nameChirho: "Bengali", nativeChirho: "বাংলা", directionChirho: "LtoR" },
  "por": { nameChirho: "Portuguese", nativeChirho: "Português", directionChirho: "LtoR" },
  "rus": { nameChirho: "Russian", nativeChirho: "Русский", directionChirho: "LtoR" },
  "swa": { nameChirho: "Swahili", nativeChirho: "Kiswahili", directionChirho: "LtoR" },
  "tur": { nameChirho: "Turkish", nativeChirho: "Türkçe", directionChirho: "LtoR" },
  "arb": { nameChirho: "Arabic", nativeChirho: "العربية", directionChirho: "RtoL" },
  "urd": { nameChirho: "Urdu", nativeChirho: "اردو", directionChirho: "RtoL" },
};

interface VerseDataChirho {
  bookChirho: string;
  chapterChirho: number;
  verseChirho: number;
  textChirho: string;
}

interface BookDataChirho {
  osisChirho: string;
  orderChirho: number;
  nameChirho: string;
  versesChirho: VerseDataChirho[];
}

/**
 * Extract verse text from SQL file comment header
 */
async function extractVerseFromSqlChirho(filePathChirho: string): Promise<string | null> {
  try {
    const contentChirho = await readFile(filePathChirho, "utf-8");
    const linesChirho = contentChirho.split("\n");

    // Look for the verse comment (line 5 or 6, format: "-- BOOK c#-v# - LANG")
    // The verse text follows on the next line (line 6 or 7)
    for (let iChirho = 0; iChirho < Math.min(10, linesChirho.length); iChirho++) {
      const lineChirho = linesChirho[iChirho];
      if (lineChirho.startsWith("-- ") && lineChirho.includes(" c") && lineChirho.includes("-v")) {
        // Next line has the actual verse text
        const verseLineChirho = linesChirho[iChirho + 1];
        if (verseLineChirho && verseLineChirho.startsWith("-- ")) {
          return verseLineChirho.substring(3).trim();
        }
      }
    }
    return null;
  } catch (errChirho) {
    console.error(`Error reading ${filePathChirho}:`, errChirho);
    return null;
  }
}

/**
 * Parse chapter/verse from filename (e.g., "c001-v001-chirho.sql")
 */
function parseFilenameChirho(filenameChirho: string): { chapterChirho: number; verseChirho: number } | null {
  const matchChirho = filenameChirho.match(/c(\d+)-v(\d+)/);
  if (matchChirho) {
    return {
      chapterChirho: parseInt(matchChirho[1], 10),
      verseChirho: parseInt(matchChirho[2], 10),
    };
  }
  return null;
}

/**
 * Parse book name from directory (e.g., "genesis-spa-chirho" -> "genesis")
 */
function parseBookDirChirho(dirNameChirho: string, langCodeChirho: string): string | null {
  const suffixChirho = `-${langCodeChirho}-chirho`;
  if (dirNameChirho.endsWith(suffixChirho)) {
    return dirNameChirho.slice(0, -suffixChirho.length);
  }
  return null;
}

/**
 * Clean verse text: handle n-dashes used for particles, clean up formatting
 */
function cleanVerseTextChirho(textChirho: string): string {
  // Replace n-dashes with spaces (they connect particles to words in our format)
  // This separates "En–principio" into "En principio"
  let cleanedChirho = textChirho.replace(/–/g, " ");

  // Remove asterisks used for untranslatable particles (like Hebrew direct object marker)
  cleanedChirho = cleanedChirho.replace(/\s*\*\s*/g, " ");

  // Clean up multiple spaces
  cleanedChirho = cleanedChirho.replace(/\s+/g, " ").trim();

  // Escape XML special characters (but not apostrophes - use actual character)
  cleanedChirho = cleanedChirho
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  // Note: We don't escape apostrophes as &apos; because XHTML doesn't support it
  // and osis2mod warns about it. Use raw ' character instead.

  return cleanedChirho;
}

/**
 * Scan translations directory and collect all verses for a language
 */
async function collectVersesChirho(
  translationsDirChirho: string,
  langCodeChirho: string
): Promise<Map<string, BookDataChirho>> {
  const booksMapChirho = new Map<string, BookDataChirho>();

  // Get all directories matching the language
  const entriesChirho = await readdir(translationsDirChirho, { withFileTypes: true });
  const bookDirsChirho = entriesChirho
    .filter((entryChirho) => entryChirho.isDirectory() && entryChirho.name.endsWith(`-${langCodeChirho}-chirho`))
    .map((entryChirho) => entryChirho.name);

  console.log(`Found ${bookDirsChirho.length} book directories for language ${langCodeChirho}`);

  for (const bookDirChirho of bookDirsChirho) {
    const bookNameChirho = parseBookDirChirho(bookDirChirho, langCodeChirho);
    if (!bookNameChirho) continue;

    const bookInfoChirho = BOOK_MAPPING_CHIRHO[bookNameChirho];
    if (!bookInfoChirho) {
      console.warn(`Unknown book: ${bookNameChirho} (from ${bookDirChirho})`);
      continue;
    }

    const bookPathChirho = join(translationsDirChirho, bookDirChirho);
    const filesChirho = await readdir(bookPathChirho);

    // Filter for verse SQL files (c###-v###-chirho.sql)
    const verseSqlsChirho = filesChirho.filter(
      (fChirho) => fChirho.match(/^c\d+-v\d+-chirho\.sql$/) && fChirho !== "all-verses-chirho.sql"
    );

    const versesChirho: VerseDataChirho[] = [];

    for (const sqlFileChirho of verseSqlsChirho) {
      const parseResultChirho = parseFilenameChirho(sqlFileChirho);
      if (!parseResultChirho) continue;

      const filePathChirho = join(bookPathChirho, sqlFileChirho);
      const verseTextChirho = await extractVerseFromSqlChirho(filePathChirho);

      if (verseTextChirho) {
        versesChirho.push({
          bookChirho: bookInfoChirho.osisChirho,
          chapterChirho: parseResultChirho.chapterChirho,
          verseChirho: parseResultChirho.verseChirho,
          textChirho: cleanVerseTextChirho(verseTextChirho),
        });
      }
    }

    // Sort verses by chapter and verse number
    versesChirho.sort((aChirho, bChirho) => {
      if (aChirho.chapterChirho !== bChirho.chapterChirho) {
        return aChirho.chapterChirho - bChirho.chapterChirho;
      }
      return aChirho.verseChirho - bChirho.verseChirho;
    });

    if (versesChirho.length > 0) {
      booksMapChirho.set(bookInfoChirho.osisChirho, {
        osisChirho: bookInfoChirho.osisChirho,
        orderChirho: bookInfoChirho.orderChirho,
        nameChirho: bookInfoChirho.nameChirho,
        versesChirho,
      });
      console.log(`  ${bookInfoChirho.nameChirho}: ${versesChirho.length} verses`);
    }
  }

  return booksMapChirho;
}

/**
 * Generate OSIS XML from collected verses
 */
function generateOsisXmlChirho(
  booksMapChirho: Map<string, BookDataChirho>,
  langCodeChirho: string,
  moduleNameChirho: string
): string {
  const langInfoChirho = LANGUAGE_INFO_CHIRHO[langCodeChirho] || {
    nameChirho: langCodeChirho.toUpperCase(),
    nativeChirho: langCodeChirho.toUpperCase(),
    directionChirho: "LtoR",
  };

  // Sort books by canonical order
  const sortedBooksChirho = Array.from(booksMapChirho.values()).sort(
    (aChirho, bChirho) => aChirho.orderChirho - bChirho.orderChirho
  );

  // Check what we have (OT, NT, or both)
  const hasOtChirho = sortedBooksChirho.some((bChirho) => bChirho.orderChirho <= 39);
  const hasNtChirho = sortedBooksChirho.some((bChirho) => bChirho.orderChirho > 39);

  let osisXmlChirho = `<?xml version="1.0" encoding="UTF-8"?>
<osis xmlns="http://www.bibletechnologies.net/2003/OSIS/namespace"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.bibletechnologies.net/2003/OSIS/namespace http://www.crosswire.org/~dmsmith/osis/osisCore.2.1.1-cw-latest.xsd">
  <osisText osisIDWork="${moduleNameChirho}" osisRefWork="Bible" xml:lang="${langCodeChirho}" canonical="true">
    <header>
      <work osisWork="${moduleNameChirho}">
        <title>${langInfoChirho.nativeChirho} - Word-for-Word Bible Translation</title>
        <identifier type="OSIS">Bible.${moduleNameChirho}</identifier>
        <language type="ISO-639-3">${langCodeChirho}</language>
        <refSystem>Bible.KJV</refSystem>
        <rights type="x-copyright">CC BY-SA 4.0 - Global Bible Tools</rights>
      </work>
    </header>
`;

  // Add Old Testament bookGroup if we have OT books
  if (hasOtChirho) {
    osisXmlChirho += `    <div type="bookGroup">
      <title>Old Testament</title>
`;
    for (const bookChirho of sortedBooksChirho) {
      if (bookChirho.orderChirho <= 39) {
        osisXmlChirho += generateBookOsisChirho(bookChirho);
      }
    }
    osisXmlChirho += `    </div>
`;
  }

  // Add New Testament bookGroup if we have NT books
  if (hasNtChirho) {
    osisXmlChirho += `    <div type="bookGroup">
      <title>New Testament</title>
`;
    for (const bookChirho of sortedBooksChirho) {
      if (bookChirho.orderChirho > 39) {
        osisXmlChirho += generateBookOsisChirho(bookChirho);
      }
    }
    osisXmlChirho += `    </div>
`;
  }

  osisXmlChirho += `  </osisText>
</osis>
`;

  return osisXmlChirho;
}

/**
 * Generate OSIS XML for a single book
 */
function generateBookOsisChirho(bookChirho: BookDataChirho): string {
  let xmlChirho = `      <div type="book" osisID="${bookChirho.osisChirho}">
        <title>${bookChirho.nameChirho}</title>
`;

  // Group verses by chapter
  const chaptersMapChirho = new Map<number, VerseDataChirho[]>();
  for (const verseChirho of bookChirho.versesChirho) {
    if (!chaptersMapChirho.has(verseChirho.chapterChirho)) {
      chaptersMapChirho.set(verseChirho.chapterChirho, []);
    }
    chaptersMapChirho.get(verseChirho.chapterChirho)!.push(verseChirho);
  }

  // Sort chapters and generate XML
  const sortedChaptersChirho = Array.from(chaptersMapChirho.keys()).sort((aChirho, bChirho) => aChirho - bChirho);

  for (const chapterNumChirho of sortedChaptersChirho) {
    const versesChirho = chaptersMapChirho.get(chapterNumChirho)!;
    const chapterOsisIdChirho = `${bookChirho.osisChirho}.${chapterNumChirho}`;

    xmlChirho += `        <chapter osisID="${chapterOsisIdChirho}">
`;

    for (const verseChirho of versesChirho) {
      const verseOsisIdChirho = `${bookChirho.osisChirho}.${chapterNumChirho}.${verseChirho.verseChirho}`;
      // Use milestone verse elements as recommended by SWORD
      xmlChirho += `          <verse sID="${verseOsisIdChirho}" osisID="${verseOsisIdChirho}"/>${verseChirho.textChirho}<verse eID="${verseOsisIdChirho}"/>
`;
    }

    xmlChirho += `        </chapter>
`;
  }

  xmlChirho += `      </div>
`;

  return xmlChirho;
}

/**
 * Generate .conf file for the SWORD module
 */
function generateConfFileChirho(
  moduleNameChirho: string,
  langCodeChirho: string,
  versionChirho: string
): string {
  const langInfoChirho = LANGUAGE_INFO_CHIRHO[langCodeChirho] || {
    nameChirho: langCodeChirho.toUpperCase(),
    nativeChirho: langCodeChirho.toUpperCase(),
    directionChirho: "LtoR",
  };

  const todayChirho = new Date().toISOString().split("T")[0];

  return `[${moduleNameChirho}]
DataPath=./modules/texts/ztext/${moduleNameChirho.toLowerCase()}/
ModDrv=zText
BlockType=BOOK
CompressType=ZIP
Encoding=UTF-8
SourceType=OSIS
Lang=${langCodeChirho}
LCSH=Bible. ${langInfoChirho.nameChirho}.
Versification=KJV
Direction=${langInfoChirho.directionChirho}

Abbreviation=${moduleNameChirho}
Description=${langInfoChirho.nativeChirho} Word-for-Word Bible Translation
About=A literal word-for-word translation of the Bible into ${langInfoChirho.nameChirho} (${langInfoChirho.nativeChirho}).\\par\\par\
This translation aims to preserve the original word order and meaning of the Hebrew and Greek texts.\\par\\par\
Generated by Global Bible Tools (https://global-tools.bible.systems)\\par\
Date: ${todayChirho}

Version=${versionChirho}
History_${versionChirho}=(${todayChirho}) Initial release
SwordVersionDate=${todayChirho}
MinimumVersion=1.6.0

DistributionLicense=Creative Commons: by-sa
TextSource=Global Bible Tools - https://global-tools.bible.systems
Copyright=Copyright (c) ${new Date().getFullYear()} Global Bible Tools
CopyrightHolder=Global Bible Tools
CopyrightDate=${new Date().getFullYear()}

Feature=NoParagraphs
Category=Biblical Texts
`;
}

/**
 * Main export function
 */
async function exportSwordModuleChirho(
  langCodeChirho: string,
  outputDirChirho: string
): Promise<void> {
  const projectRootChirho = dirname(dirname(import.meta.path));
  const translationsDirChirho = join(projectRootChirho, "translations-chirho");

  console.log(`\nExporting SWORD module for language: ${langCodeChirho}`);
  console.log(`Translations directory: ${translationsDirChirho}`);
  console.log(`Output directory: ${outputDirChirho}`);
  console.log("");

  // 1. Collect all verses
  console.log("Step 1: Collecting verses from SQL files...");
  const booksMapChirho = await collectVersesChirho(translationsDirChirho, langCodeChirho);

  if (booksMapChirho.size === 0) {
    console.error(`No translations found for language: ${langCodeChirho}`);
    process.exit(1);
  }

  const totalVersesChirho = Array.from(booksMapChirho.values()).reduce(
    (sumChirho, bookChirho) => sumChirho + bookChirho.versesChirho.length,
    0
  );
  console.log(`\nTotal: ${booksMapChirho.size} books, ${totalVersesChirho} verses`);

  // 2. Generate module name
  const moduleNameChirho = `GBT${langCodeChirho.toUpperCase()}`;
  const versionChirho = "1.0";

  // 3. Create output directories
  console.log("\nStep 2: Creating output directories...");
  const moduleDirChirho = join(outputDirChirho, "modules", "texts", "ztext", moduleNameChirho.toLowerCase());
  const modsDirChirho = join(outputDirChirho, "mods.d");
  const osisPathChirho = join(outputDirChirho, `${moduleNameChirho}.xml`);

  await mkdir(moduleDirChirho, { recursive: true });
  await mkdir(modsDirChirho, { recursive: true });
  console.log(`  Created: ${moduleDirChirho}`);
  console.log(`  Created: ${modsDirChirho}`);

  // 4. Generate and save OSIS XML
  console.log("\nStep 3: Generating OSIS XML...");
  const osisXmlChirho = generateOsisXmlChirho(booksMapChirho, langCodeChirho, moduleNameChirho);
  await writeFile(osisPathChirho, osisXmlChirho, "utf-8");
  console.log(`  Saved: ${osisPathChirho} (${(osisXmlChirho.length / 1024 / 1024).toFixed(2)} MB)`);

  // 5. Run osis2mod to create SWORD module
  console.log("\nStep 4: Running osis2mod to create SWORD module...");
  try {
    const resultChirho = await $`osis2mod ${moduleDirChirho} ${osisPathChirho} -z z -b 4 -v KJV 2>&1`.text();
    console.log(resultChirho);
  } catch (errChirho: unknown) {
    if (errChirho instanceof Error) {
      console.error("osis2mod error:", errChirho.message);
    }
    // Continue anyway - osis2mod sometimes returns non-zero even on success
  }

  // 6. Generate and save .conf file
  console.log("\nStep 5: Generating .conf file...");
  const confContentChirho = generateConfFileChirho(moduleNameChirho, langCodeChirho, versionChirho);
  const confPathChirho = join(modsDirChirho, `${moduleNameChirho.toLowerCase()}.conf`);
  await writeFile(confPathChirho, confContentChirho, "utf-8");
  console.log(`  Saved: ${confPathChirho}`);

  // 7. Create distributable zip file
  console.log("\nStep 6: Creating distributable zip file...");
  const zipPathChirho = join(outputDirChirho, `${moduleNameChirho}.zip`);
  try {
    await $`cd ${outputDirChirho} && zip -r ${moduleNameChirho}.zip mods.d modules -x "*.DS_Store" 2>&1`.text();
    const zipStatsChirho = await Bun.file(zipPathChirho).size;
    console.log(`  Created: ${zipPathChirho} (${(zipStatsChirho / 1024 / 1024).toFixed(2)} MB)`);
  } catch (errChirho) {
    console.error("  Warning: Could not create zip file");
  }

  // 8. Create README with installation instructions
  console.log("\nStep 7: Creating README...");
  const readmeContentChirho = generateReadmeChirho(moduleNameChirho, langCodeChirho, booksMapChirho.size, totalVersesChirho);
  const readmePathChirho = join(outputDirChirho, "README.txt");
  await writeFile(readmePathChirho, readmeContentChirho, "utf-8");
  console.log(`  Saved: ${readmePathChirho}`);

  // 9. Summary
  console.log("\n" + "=".repeat(60));
  console.log("SWORD MODULE EXPORT COMPLETE");
  console.log("=".repeat(60));
  console.log(`Module Name: ${moduleNameChirho}`);
  console.log(`Books: ${booksMapChirho.size}`);
  console.log(`Verses: ${totalVersesChirho}`);
  console.log(`\nOutput files:`);
  console.log(`  OSIS XML: ${osisPathChirho}`);
  console.log(`  Module data: ${moduleDirChirho}/`);
  console.log(`  Config: ${confPathChirho}`);
  console.log(`  ZIP package: ${zipPathChirho}`);
  console.log(`  README: ${readmePathChirho}`);
  console.log(`\nTo install, copy the following to your SWORD data directory:`);
  console.log(`  - ${modsDirChirho}/${moduleNameChirho.toLowerCase()}.conf -> ~/.sword/mods.d/`);
  console.log(`  - ${moduleDirChirho}/ -> ~/.sword/modules/texts/ztext/${moduleNameChirho.toLowerCase()}/`);
  console.log(`\nOr extract the zip file to your SWORD data directory (~/.sword/)`);
  console.log("");
}

/**
 * Generate README file with installation instructions
 */
function generateReadmeChirho(
  moduleNameChirho: string,
  langCodeChirho: string,
  bookCountChirho: number,
  verseCountChirho: number
): string {
  const langInfoChirho = LANGUAGE_INFO_CHIRHO[langCodeChirho] || {
    nameChirho: langCodeChirho.toUpperCase(),
    nativeChirho: langCodeChirho.toUpperCase(),
    directionChirho: "LtoR",
  };
  const todayChirho = new Date().toISOString().split("T")[0];

  return `${moduleNameChirho} - ${langInfoChirho.nativeChirho} Word-for-Word Bible Translation
${"=".repeat(70)}

Module Name: ${moduleNameChirho}
Language: ${langInfoChirho.nameChirho} (${langInfoChirho.nativeChirho})
Books: ${bookCountChirho}
Verses: ${verseCountChirho}
Generated: ${todayChirho}

ABOUT THIS TRANSLATION
----------------------
This is a literal word-for-word translation of the Bible into ${langInfoChirho.nameChirho}.
It preserves the original word order and meaning of the Hebrew and Greek texts.
Generated by Global Bible Tools (https://global-tools.bible.systems)

INSTALLATION INSTRUCTIONS
-------------------------

For Linux/macOS:
1. Extract the zip file: unzip ${moduleNameChirho}.zip -d ~/.sword/
   Or manually copy:
   - mods.d/${moduleNameChirho.toLowerCase()}.conf -> ~/.sword/mods.d/
   - modules/ -> ~/.sword/modules/

For Windows:
1. Extract the zip file to your SWORD data directory
   Default location: C:\\Users\\<username>\\AppData\\Roaming\\Sword\\
   Or: C:\\Program Files\\BibleCS\\

For Android (AndBible):
1. Copy the zip file to your device
2. Open AndBible -> Menu -> Download Documents -> Install from zip file
3. Select the ${moduleNameChirho}.zip file

For iOS (PocketSword):
1. Connect to iTunes file sharing
2. Copy modules folder and mods.d/${moduleNameChirho.toLowerCase()}.conf to PocketSword documents

COMPATIBLE SOFTWARE
-------------------
- BibleTime (Linux, Windows, macOS)
- Xiphos (Linux, Windows)
- BibleDesktop (Windows, Java)
- AndBible (Android)
- PocketSword (iOS)
- MacSword (macOS)

LICENSE
-------
Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0)
https://creativecommons.org/licenses/by-sa/4.0/

SOURCE
------
Global Bible Tools
https://global-tools.bible.systems

For God so loved the world, that He gave His only begotten Son,
that all who believe in Him should not perish but have everlasting life.
- John 3:16
`;
}

// CLI entry point
const argsChirho = process.argv.slice(2);

if (argsChirho.length < 1) {
  console.log(`
Usage: bun run tools-chirho/export-sword-chirho.ts <language_code> [output_dir]

Arguments:
  language_code  Three-letter ISO 639-3 code (e.g., spa, hin, ben)
  output_dir     Output directory (default: ./sword-export-chirho)

Examples:
  bun run tools-chirho/export-sword-chirho.ts spa
  bun run tools-chirho/export-sword-chirho.ts spa ./my-output
  bun run tools-chirho/export-sword-chirho.ts hin

Supported languages:
  spa - Spanish (Español)
  hin - Hindi (हिन्दी)
  ben - Bengali (বাংলা)
  por - Portuguese (Português)
  rus - Russian (Русский)
  swa - Swahili (Kiswahili)
  tur - Turkish (Türkçe)
  arb - Arabic (العربية)
  urd - Urdu (اردو)
`);
  process.exit(1);
}

const langCodeArgChirho = argsChirho[0];
const outputDirArgChirho = argsChirho[1] || join(dirname(dirname(import.meta.path)), "sword-export-chirho");

exportSwordModuleChirho(langCodeArgChirho, outputDirArgChirho).catch((errChirho) => {
  console.error("Error:", errChirho);
  process.exit(1);
});
