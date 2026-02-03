// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * SWORD Module Generator - Database Version
 *
 * Reads translations directly from the database and creates SWORD modules.
 *
 * Usage: bun run scripts-chirho/sword-chirho/generate-sword-module-chirho.ts [language]
 * Example: bun run scripts-chirho/sword-chirho/generate-sword-module-chirho.ts por
 */

import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { $ } from "bun";

// OSIS Book IDs mapping
const OSIS_BOOK_IDS_CHIRHO: Record<number, { osisIdChirho: string; nameChirho: string; testamentChirho: "OT" | "NT" }> = {
  1: { osisIdChirho: "Gen", nameChirho: "Genesis", testamentChirho: "OT" },
  2: { osisIdChirho: "Exod", nameChirho: "Exodus", testamentChirho: "OT" },
  3: { osisIdChirho: "Lev", nameChirho: "Leviticus", testamentChirho: "OT" },
  4: { osisIdChirho: "Num", nameChirho: "Numbers", testamentChirho: "OT" },
  5: { osisIdChirho: "Deut", nameChirho: "Deuteronomy", testamentChirho: "OT" },
  6: { osisIdChirho: "Josh", nameChirho: "Joshua", testamentChirho: "OT" },
  7: { osisIdChirho: "Judg", nameChirho: "Judges", testamentChirho: "OT" },
  8: { osisIdChirho: "Ruth", nameChirho: "Ruth", testamentChirho: "OT" },
  9: { osisIdChirho: "1Sam", nameChirho: "1 Samuel", testamentChirho: "OT" },
  10: { osisIdChirho: "2Sam", nameChirho: "2 Samuel", testamentChirho: "OT" },
  11: { osisIdChirho: "1Kgs", nameChirho: "1 Kings", testamentChirho: "OT" },
  12: { osisIdChirho: "2Kgs", nameChirho: "2 Kings", testamentChirho: "OT" },
  13: { osisIdChirho: "1Chr", nameChirho: "1 Chronicles", testamentChirho: "OT" },
  14: { osisIdChirho: "2Chr", nameChirho: "2 Chronicles", testamentChirho: "OT" },
  15: { osisIdChirho: "Ezra", nameChirho: "Ezra", testamentChirho: "OT" },
  16: { osisIdChirho: "Neh", nameChirho: "Nehemiah", testamentChirho: "OT" },
  17: { osisIdChirho: "Esth", nameChirho: "Esther", testamentChirho: "OT" },
  18: { osisIdChirho: "Job", nameChirho: "Job", testamentChirho: "OT" },
  19: { osisIdChirho: "Ps", nameChirho: "Psalms", testamentChirho: "OT" },
  20: { osisIdChirho: "Prov", nameChirho: "Proverbs", testamentChirho: "OT" },
  21: { osisIdChirho: "Eccl", nameChirho: "Ecclesiastes", testamentChirho: "OT" },
  22: { osisIdChirho: "Song", nameChirho: "Song of Solomon", testamentChirho: "OT" },
  23: { osisIdChirho: "Isa", nameChirho: "Isaiah", testamentChirho: "OT" },
  24: { osisIdChirho: "Jer", nameChirho: "Jeremiah", testamentChirho: "OT" },
  25: { osisIdChirho: "Lam", nameChirho: "Lamentations", testamentChirho: "OT" },
  26: { osisIdChirho: "Ezek", nameChirho: "Ezekiel", testamentChirho: "OT" },
  27: { osisIdChirho: "Dan", nameChirho: "Daniel", testamentChirho: "OT" },
  28: { osisIdChirho: "Hos", nameChirho: "Hosea", testamentChirho: "OT" },
  29: { osisIdChirho: "Joel", nameChirho: "Joel", testamentChirho: "OT" },
  30: { osisIdChirho: "Amos", nameChirho: "Amos", testamentChirho: "OT" },
  31: { osisIdChirho: "Obad", nameChirho: "Obadiah", testamentChirho: "OT" },
  32: { osisIdChirho: "Jonah", nameChirho: "Jonah", testamentChirho: "OT" },
  33: { osisIdChirho: "Mic", nameChirho: "Micah", testamentChirho: "OT" },
  34: { osisIdChirho: "Nah", nameChirho: "Nahum", testamentChirho: "OT" },
  35: { osisIdChirho: "Hab", nameChirho: "Habakkuk", testamentChirho: "OT" },
  36: { osisIdChirho: "Zeph", nameChirho: "Zephaniah", testamentChirho: "OT" },
  37: { osisIdChirho: "Hag", nameChirho: "Haggai", testamentChirho: "OT" },
  38: { osisIdChirho: "Zech", nameChirho: "Zechariah", testamentChirho: "OT" },
  39: { osisIdChirho: "Mal", nameChirho: "Malachi", testamentChirho: "OT" },
  40: { osisIdChirho: "Matt", nameChirho: "Matthew", testamentChirho: "NT" },
  41: { osisIdChirho: "Mark", nameChirho: "Mark", testamentChirho: "NT" },
  42: { osisIdChirho: "Luke", nameChirho: "Luke", testamentChirho: "NT" },
  43: { osisIdChirho: "John", nameChirho: "John", testamentChirho: "NT" },
  44: { osisIdChirho: "Acts", nameChirho: "Acts", testamentChirho: "NT" },
  45: { osisIdChirho: "Rom", nameChirho: "Romans", testamentChirho: "NT" },
  46: { osisIdChirho: "1Cor", nameChirho: "1 Corinthians", testamentChirho: "NT" },
  47: { osisIdChirho: "2Cor", nameChirho: "2 Corinthians", testamentChirho: "NT" },
  48: { osisIdChirho: "Gal", nameChirho: "Galatians", testamentChirho: "NT" },
  49: { osisIdChirho: "Eph", nameChirho: "Ephesians", testamentChirho: "NT" },
  50: { osisIdChirho: "Phil", nameChirho: "Philippians", testamentChirho: "NT" },
  51: { osisIdChirho: "Col", nameChirho: "Colossians", testamentChirho: "NT" },
  52: { osisIdChirho: "1Thess", nameChirho: "1 Thessalonians", testamentChirho: "NT" },
  53: { osisIdChirho: "2Thess", nameChirho: "2 Thessalonians", testamentChirho: "NT" },
  54: { osisIdChirho: "1Tim", nameChirho: "1 Timothy", testamentChirho: "NT" },
  55: { osisIdChirho: "2Tim", nameChirho: "2 Timothy", testamentChirho: "NT" },
  56: { osisIdChirho: "Titus", nameChirho: "Titus", testamentChirho: "NT" },
  57: { osisIdChirho: "Phlm", nameChirho: "Philemon", testamentChirho: "NT" },
  58: { osisIdChirho: "Heb", nameChirho: "Hebrews", testamentChirho: "NT" },
  59: { osisIdChirho: "Jas", nameChirho: "James", testamentChirho: "NT" },
  60: { osisIdChirho: "1Pet", nameChirho: "1 Peter", testamentChirho: "NT" },
  61: { osisIdChirho: "2Pet", nameChirho: "2 Peter", testamentChirho: "NT" },
  62: { osisIdChirho: "1John", nameChirho: "1 John", testamentChirho: "NT" },
  63: { osisIdChirho: "2John", nameChirho: "2 John", testamentChirho: "NT" },
  64: { osisIdChirho: "3John", nameChirho: "3 John", testamentChirho: "NT" },
  65: { osisIdChirho: "Jude", nameChirho: "Jude", testamentChirho: "NT" },
  66: { osisIdChirho: "Rev", nameChirho: "Revelation", testamentChirho: "NT" },
};

// Language metadata
interface LanguageMetadataChirho {
  codeChirho: string;
  nameChirho: string;
  nativeNameChirho: string;
  directionChirho: "LtoR" | "RtoL";
  moduleNameChirho: string;
  descriptionChirho: string;
}

const LANGUAGE_METADATA_CHIRHO: Record<string, LanguageMetadataChirho> = {
  hin: {
    codeChirho: "hi",
    nameChirho: "Hindi",
    nativeNameChirho: "हिन्दी",
    directionChirho: "LtoR",
    moduleNameChirho: "LJMTIntHin",
    descriptionChirho: "Love Jesus Machine Translation Interlinear - Hindi",
  },
  spa: {
    codeChirho: "es",
    nameChirho: "Spanish",
    nativeNameChirho: "Español",
    directionChirho: "LtoR",
    moduleNameChirho: "LJMTIntSpa",
    descriptionChirho: "Love Jesus Machine Translation Interlinear - Spanish",
  },
  ben: {
    codeChirho: "bn",
    nameChirho: "Bengali",
    nativeNameChirho: "বাংলা",
    directionChirho: "LtoR",
    moduleNameChirho: "LJMTIntBen",
    descriptionChirho: "Love Jesus Machine Translation Interlinear - Bengali",
  },
  por: {
    codeChirho: "pt",
    nameChirho: "Portuguese",
    nativeNameChirho: "Português",
    directionChirho: "LtoR",
    moduleNameChirho: "LJMTIntPor",
    descriptionChirho: "Love Jesus Machine Translation Interlinear - Portuguese",
  },
};

interface WordDataChirho {
  wordIdChirho: string;
  bookIdChirho: number;
  chapterChirho: number;
  verseChirho: number;
  originalTextChirho: string;
  morphologyChirho: string;
  strongsChirho: string;
  glossChirho: string;
}

interface VerseDataChirho {
  bookIdChirho: number;
  chapterChirho: number;
  verseChirho: number;
  wordsChirho: WordDataChirho[];
}

interface BookDataChirho {
  bookIdChirho: number;
  osisIdChirho: string;
  nameChirho: string;
  testamentChirho: "OT" | "NT";
  versesChirho: VerseDataChirho[];
}

/**
 * Fetch all words with glosses from the database for a language (interlinear format)
 */
async function fetchWordsFromDbChirho(languageCodeChirho: string): Promise<WordDataChirho[]> {
  // First get the language ID
  const langQueryChirho = `SELECT id FROM language WHERE code = '${languageCodeChirho}'`;
  const langResultChirho = await $`docker exec sveltekit2-platform-chirho-db-chirho-1 psql -U postgres -t -A -c ${langQueryChirho}`.text();

  const languageIdChirho = langResultChirho.trim();
  if (!languageIdChirho) {
    throw new Error(`Language not found: ${languageCodeChirho}`);
  }
  console.log(`Found language ID: ${languageIdChirho}`);

  // Query all words with their original text, morphology, strongs, and glosses
  const queryChirho = `
    SELECT
      w.id as word_id,
      v.book_id,
      v.chapter,
      v.number as verse_number,
      w.text as original_text,
      lf.grammar as morphology,
      lf.lemma_id as strongs,
      COALESCE(g.gloss, '') as gloss
    FROM word w
    JOIN verse v ON v.id = w.verse_id
    JOIN lemma_form lf ON lf.id = w.form_id
    JOIN phrase_word pw ON pw.word_id = w.id
    JOIN phrase p ON p.id = pw.phrase_id AND p.language_id = '${languageIdChirho}'
    LEFT JOIN gloss g ON g.phrase_id = p.id
    ORDER BY v.book_id, v.chapter, v.number, w.id
  `;

  console.log("Fetching words from database (interlinear format)...");
  const resultChirho = await $`docker exec sveltekit2-platform-chirho-db-chirho-1 psql -U postgres -t -A -F '	' -c ${queryChirho}`.text();

  const linesChirho = resultChirho.trim().split('\n').filter((lChirho) => lChirho.trim());
  console.log(`Found ${linesChirho.length} words`);

  return linesChirho.map((lineChirho) => {
    const partsChirho = lineChirho.split('\t');
    return {
      wordIdChirho: partsChirho[0],
      bookIdChirho: parseInt(partsChirho[1], 10),
      chapterChirho: parseInt(partsChirho[2], 10),
      verseChirho: parseInt(partsChirho[3], 10),
      originalTextChirho: partsChirho[4] || "",
      morphologyChirho: partsChirho[5] || "",
      strongsChirho: partsChirho[6] || "",
      glossChirho: partsChirho[7]?.trim() || "",
    };
  });
}

/**
 * Escape XML special characters
 */
function escapeXmlChirho(textChirho: string): string {
  return textChirho
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "'"); // Use literal apostrophe instead of &apos;
}

/**
 * Generate OSIS XML document from book data
 */
function generateOsisXmlChirho(
  booksChirho: BookDataChirho[],
  metadataChirho: LanguageMetadataChirho
): string {
  const moduleIdChirho = metadataChirho.moduleNameChirho;
  const todayChirho = new Date().toISOString().split("T")[0];

  // Sort books by ID
  const sortedBooksChirho = [...booksChirho].sort(
    (aChirho, bChirho) => aChirho.bookIdChirho - bChirho.bookIdChirho
  );

  // Separate OT and NT
  const otBooksChirho = sortedBooksChirho.filter((bChirho) => bChirho.testamentChirho === "OT");
  const ntBooksChirho = sortedBooksChirho.filter((bChirho) => bChirho.testamentChirho === "NT");

  let osisChirho = `<?xml version="1.0" encoding="UTF-8"?>
<osis xmlns="http://www.bibletechnologies.net/2003/OSIS/namespace"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.bibletechnologies.net/2003/OSIS/namespace
      http://www.bibletechnologies.net/osisCore.2.1.1.xsd">
<osisText osisIDWork="${moduleIdChirho}" osisRefWork="Bible" xml:lang="${metadataChirho.codeChirho}">
<header>
  <work osisWork="${moduleIdChirho}">
    <title>${metadataChirho.descriptionChirho}</title>
    <identifier type="OSIS">${moduleIdChirho}</identifier>
    <language type="ISO-639-1">${metadataChirho.codeChirho}</language>
    <refSystem>Bible.KJV</refSystem>
    <date>${todayChirho}</date>
    <rights>Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)</rights>
    <contributor role="translator">Global Bible Tools</contributor>
    <publisher>Global Bible Tools</publisher>
    <source>https://global-tools.bible.systems</source>
  </work>
</header>
`;

  // Generate Old Testament
  if (otBooksChirho.length > 0) {
    osisChirho += `<div type="bookGroup" osisID="OT">\n`;
    for (const bookChirho of otBooksChirho) {
      osisChirho += generateBookOsisChirho(bookChirho);
    }
    osisChirho += `</div>\n`;
  }

  // Generate New Testament
  if (ntBooksChirho.length > 0) {
    osisChirho += `<div type="bookGroup" osisID="NT">\n`;
    for (const bookChirho of ntBooksChirho) {
      osisChirho += generateBookOsisChirho(bookChirho);
    }
    osisChirho += `</div>\n`;
  }

  osisChirho += `</osisText>
</osis>`;

  return osisChirho;
}

/**
 * Generate OSIS XML for a single book (interlinear format)
 */
function generateBookOsisChirho(bookChirho: BookDataChirho): string {
  const osisIdChirho = bookChirho.osisIdChirho;

  // Group verses by chapter
  const chaptersChirho = new Map<number, VerseDataChirho[]>();
  for (const verseChirho of bookChirho.versesChirho) {
    const chapterVersesChirho = chaptersChirho.get(verseChirho.chapterChirho) || [];
    chapterVersesChirho.push(verseChirho);
    chaptersChirho.set(verseChirho.chapterChirho, chapterVersesChirho);
  }

  // Sort chapters
  const sortedChaptersChirho = Array.from(chaptersChirho.keys()).sort((aChirho, bChirho) => aChirho - bChirho);

  let bookOsisChirho = `<div type="book" osisID="${osisIdChirho}">\n`;

  for (const chapterNumChirho of sortedChaptersChirho) {
    const versesChirho = chaptersChirho.get(chapterNumChirho)!;
    versesChirho.sort((aChirho, bChirho) => aChirho.verseChirho - bChirho.verseChirho);

    bookOsisChirho += `<chapter osisID="${osisIdChirho}.${chapterNumChirho}" sID="${osisIdChirho}.${chapterNumChirho}"/>\n`;

    for (const verseChirho of versesChirho) {
      const verseIdChirho = `${osisIdChirho}.${chapterNumChirho}.${verseChirho.verseChirho}`;
      bookOsisChirho += `<verse osisID="${verseIdChirho}" sID="${verseIdChirho}"/>`;

      // Generate interlinear word elements
      let wordNumChirho = 1;
      for (const wordChirho of verseChirho.wordsChirho) {
        const escapedOriginalChirho = escapeXmlChirho(wordChirho.originalTextChirho);
        const escapedGlossChirho = escapeXmlChirho(wordChirho.glossChirho || "*");
        const morphChirho = wordChirho.morphologyChirho.replace(/\|/g, " | ");

        // Format Strong's number with prefix
        const strongsPrefixChirho = wordChirho.strongsChirho.startsWith("H") ? "strong:" : "strong:";

        bookOsisChirho += `<w lemma="${strongsPrefixChirho}${wordChirho.strongsChirho}" morph="robinson:${morphChirho}" gloss="${escapedGlossChirho}" n="${wordNumChirho}">${escapedOriginalChirho}</w> `;
        wordNumChirho++;
      }

      bookOsisChirho += `<verse eID="${verseIdChirho}"/>\n`;
    }

    bookOsisChirho += `<chapter eID="${osisIdChirho}.${chapterNumChirho}"/>\n`;
  }

  bookOsisChirho += `</div>\n`;
  return bookOsisChirho;
}

/**
 * Generate SWORD .conf file
 */
function generateConfFileChirho(
  metadataChirho: LanguageMetadataChirho,
  bookCountChirho: number,
  verseCountChirho: number
): string {
  const todayChirho = new Date().toISOString().split("T")[0];
  const moduleNameChirho = metadataChirho.moduleNameChirho;

  return `## ${metadataChirho.descriptionChirho}
## Generated by Global Bible Tools SWORD Module Generator
## ${todayChirho}

[${moduleNameChirho}]
DataPath=./modules/texts/ztext/${moduleNameChirho}/
ModDrv=zText
SourceType=OSIS
Encoding=UTF-8
CompressType=ZIP
BlockType=BOOK
Versification=KJV

# Module Information
Abbreviation=${moduleNameChirho}
Description=${metadataChirho.descriptionChirho}
Lang=${metadataChirho.codeChirho}
Direction=${metadataChirho.directionChirho}
Version=1.0
SwordVersionDate=${todayChirho}
MinimumVersion=1.5.9

# Text Features
Feature=NoParagraphs

# Copyright and Distribution
Copyright=Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
CopyrightDate=${new Date().getFullYear()}
DistributionLicense=CC BY-SA 4.0
ShortPromo=<a href="https://global-tools.bible.systems">Global Bible Tools</a>
TextSource=https://global-tools.bible.systems

# About
About=${metadataChirho.descriptionChirho}\\par\\par\\
This is a word-for-word literal translation created using Global Bible Tools.\\par\\
It translates each Hebrew/Greek word directly, preserving original word order.\\par\\par\\
Language: ${metadataChirho.nativeNameChirho} (${metadataChirho.nameChirho})\\par\\
Books: ${bookCountChirho}\\par\\
Verses: ${verseCountChirho}\\par\\par\\
Website: https://global-tools.bible.systems\\par\\
License: CC BY-SA 4.0

# Distribution Notes
DistributionNotes=This module is freely redistributable under the terms of\\par\\
Creative Commons Attribution-ShareAlike 4.0 International License.\\par\\
You are free to share and adapt this work with appropriate credit.
`;
}

/**
 * Main function to generate SWORD module
 */
async function generateSwordModuleChirho(languageCodeChirho: string): Promise<void> {
  const projectRootChirho = "/Volumes/ENC_4TB_WDB_CHIRHO/dev-aleluya/friends-aleluya/andrewbeth-chirho/platform-chirho";
  const swordRepoChirho = join(projectRootChirho, "sword-repo-chirho");

  // Get language metadata
  const metadataChirho = LANGUAGE_METADATA_CHIRHO[languageCodeChirho];
  if (!metadataChirho) {
    console.error(`Unknown language code: ${languageCodeChirho}`);
    console.error("Supported languages:", Object.keys(LANGUAGE_METADATA_CHIRHO).join(", "));
    process.exit(1);
  }

  console.log(`\n=== Generating SWORD module for ${metadataChirho.nameChirho} (${languageCodeChirho}) ===\n`);

  // Create output directories
  const moduleNameChirho = metadataChirho.moduleNameChirho;
  const dataPathChirho = join(swordRepoChirho, "modules", "texts", "ztext", moduleNameChirho);
  const confPathChirho = join(swordRepoChirho, "mods.d");
  const osisPathChirho = join(projectRootChirho, "output-chirho", "sword-chirho", moduleNameChirho.toLowerCase(), "osis");

  await mkdir(dataPathChirho, { recursive: true });
  await mkdir(confPathChirho, { recursive: true });
  await mkdir(osisPathChirho, { recursive: true });

  // Fetch words from database (interlinear format)
  const wordsChirho = await fetchWordsFromDbChirho(languageCodeChirho);

  // Group words by book -> verse
  const bookMapChirho = new Map<number, Map<string, WordDataChirho[]>>();
  for (const wordChirho of wordsChirho) {
    if (!bookMapChirho.has(wordChirho.bookIdChirho)) {
      bookMapChirho.set(wordChirho.bookIdChirho, new Map());
    }
    const verseKeyChirho = `${wordChirho.chapterChirho}:${wordChirho.verseChirho}`;
    const bookVersesChirho = bookMapChirho.get(wordChirho.bookIdChirho)!;
    if (!bookVersesChirho.has(verseKeyChirho)) {
      bookVersesChirho.set(verseKeyChirho, []);
    }
    bookVersesChirho.get(verseKeyChirho)!.push(wordChirho);
  }

  // Convert to BookData with verses containing words
  const booksChirho: BookDataChirho[] = [];
  let totalVersesChirho = 0;
  let totalWordsChirho = 0;

  for (const [bookIdChirho, verseMapChirho] of bookMapChirho) {
    const bookMetaChirho = OSIS_BOOK_IDS_CHIRHO[bookIdChirho];
    if (!bookMetaChirho) {
      console.warn(`Unknown book ID: ${bookIdChirho}`);
      continue;
    }

    // Convert verse map to VerseData array
    const versesChirho: VerseDataChirho[] = [];
    for (const [verseKeyChirho, verseWordsChirho] of verseMapChirho) {
      const [chapterStrChirho, verseStrChirho] = verseKeyChirho.split(':');
      versesChirho.push({
        bookIdChirho,
        chapterChirho: parseInt(chapterStrChirho, 10),
        verseChirho: parseInt(verseStrChirho, 10),
        wordsChirho: verseWordsChirho,
      });
      totalWordsChirho += verseWordsChirho.length;
    }

    booksChirho.push({
      bookIdChirho,
      osisIdChirho: bookMetaChirho.osisIdChirho,
      nameChirho: bookMetaChirho.nameChirho,
      testamentChirho: bookMetaChirho.testamentChirho,
      versesChirho,
    });

    totalVersesChirho += versesChirho.length;
    console.log(`  ${bookMetaChirho.osisIdChirho}: ${versesChirho.length} verses, ${verseMapChirho.size > 0 ? Array.from(verseMapChirho.values()).reduce((sChirho, wChirho) => sChirho + wChirho.length, 0) : 0} words`);
  }

  if (booksChirho.length === 0) {
    console.error("No books found to process!");
    process.exit(1);
  }

  console.log(`\nTotal: ${booksChirho.length} books, ${totalVersesChirho} verses, ${totalWordsChirho} words`);

  // Generate OSIS XML
  console.log("\nGenerating OSIS XML...");
  const osisXmlChirho = generateOsisXmlChirho(booksChirho, metadataChirho);
  const osisFileChirho = join(osisPathChirho, `${moduleNameChirho.toLowerCase()}.xml`);
  await writeFile(osisFileChirho, osisXmlChirho, "utf-8");
  console.log(`  Written: ${osisFileChirho}`);

  // Generate .conf file
  console.log("\nGenerating .conf file...");
  const confContentChirho = generateConfFileChirho(metadataChirho, booksChirho.length, totalVersesChirho);
  const confFileChirho = join(confPathChirho, `${moduleNameChirho.toLowerCase()}.conf`);
  await writeFile(confFileChirho, confContentChirho, "utf-8");
  console.log(`  Written: ${confFileChirho}`);

  // Run osis2mod to create the SWORD module
  console.log("\nRunning osis2mod...");
  try {
    const resultChirho = await $`osis2mod ${dataPathChirho} ${osisFileChirho} -z z -b 4 -v KJV 2>&1`.text();
    console.log(resultChirho);
    console.log("  osis2mod completed successfully!");
  } catch (errorChirho) {
    console.error("  osis2mod failed:", errorChirho);
    console.log("\n  You can manually run:");
    console.log(`  osis2mod ${dataPathChirho} ${osisFileChirho} -z z -b 4 -v KJV`);
  }

  // Check final module size
  const duResultChirho = await $`du -sh ${dataPathChirho}`.text();
  console.log(`\nModule size: ${duResultChirho.trim()}`);

  console.log(`\n=== SWORD module generated successfully! ===`);
  console.log(`Module: ${moduleNameChirho}`);
  console.log(`Data: ${dataPathChirho}`);
  console.log(`Conf: ${confFileChirho}`);
}

// Main entry point
const languageArgChirho = process.argv[2];
if (!languageArgChirho) {
  console.log("Usage: bun run scripts-chirho/sword-chirho/generate-sword-module-chirho.ts <language>");
  console.log("Languages:", Object.keys(LANGUAGE_METADATA_CHIRHO).join(", "));
  process.exit(1);
}

generateSwordModuleChirho(languageArgChirho);
