// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

// Converts Serbian Latin script SQL files to Cyrillic script
// Serbian has a perfect 1:1 Latin↔Cyrillic mapping
// Usage: bun run tools-chirho/convert-srp-latin-to-cyrillic-chirho.ts

import { readdir, readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";

const LATIN_TO_CYRILLIC_CHIRHO: Record<string, string> = {
  // Digraphs MUST be checked first (before single letters)
  // Uppercase digraphs
  "Lj": "Љ",
  "LJ": "Љ",
  "Nj": "Њ",
  "NJ": "Њ",
  "Dž": "Џ",
  "DŽ": "Џ",
  // Lowercase digraphs
  "lj": "љ",
  "nj": "њ",
  "dž": "џ",
  // Uppercase single
  "A": "А", "B": "Б", "V": "В", "G": "Г", "D": "Д", "Đ": "Ђ",
  "E": "Е", "Ž": "Ж", "Z": "З", "I": "И", "J": "Ј", "K": "К",
  "L": "Л", "M": "М", "N": "Н", "O": "О", "P": "П", "R": "Р",
  "S": "С", "T": "Т", "Ć": "Ћ", "U": "У", "F": "Ф", "H": "Х",
  "C": "Ц", "Č": "Ч", "Š": "Ш",
  // Lowercase single
  "a": "а", "b": "б", "v": "в", "g": "г", "d": "д", "đ": "ђ",
  "e": "е", "ž": "ж", "z": "з", "i": "и", "j": "ј", "k": "к",
  "l": "л", "m": "м", "n": "н", "o": "о", "p": "п", "r": "р",
  "s": "с", "t": "т", "ć": "ћ", "u": "у", "f": "ф", "h": "х",
  "c": "ц", "č": "ч", "š": "ш",
};

// Order: digraphs first, then single chars (longest match first)
const DIGRAPHS_CHIRHO = ["LJ", "Lj", "lj", "NJ", "Nj", "nj", "DŽ", "Dž", "dž"];
const SINGLE_LATIN_CHIRHO = Object.keys(LATIN_TO_CYRILLIC_CHIRHO).filter(
  (k) => !DIGRAPHS_CHIRHO.includes(k)
);

function latinToCyrillicChirho(textChirho: string): string {
  let resultChirho = "";
  let iChirho = 0;

  while (iChirho < textChirho.length) {
    let matchedChirho = false;

    // Try digraphs first (2-char matches)
    if (iChirho + 1 < textChirho.length) {
      const twoCharChirho = textChirho.substring(iChirho, iChirho + 2);
      if (LATIN_TO_CYRILLIC_CHIRHO[twoCharChirho] !== undefined) {
        resultChirho += LATIN_TO_CYRILLIC_CHIRHO[twoCharChirho];
        iChirho += 2;
        matchedChirho = true;
      }
    }

    // Try single char
    if (!matchedChirho) {
      const oneCharChirho = textChirho[iChirho];
      if (LATIN_TO_CYRILLIC_CHIRHO[oneCharChirho] !== undefined) {
        resultChirho += LATIN_TO_CYRILLIC_CHIRHO[oneCharChirho];
        iChirho += 1;
      } else {
        // Non-Latin character (punctuation, numbers, Hebrew, Greek, etc.) — keep as-is
        resultChirho += oneCharChirho;
        iChirho += 1;
      }
    }
  }

  return resultChirho;
}

function convertSqlGlossChirho(sqlContentChirho: string): string {
  // Convert gloss values in SQL INSERT statements
  // Pattern: SELECT p.id, 'GLOSS_VALUE', 'UNAPPROVED'
  let convertedChirho = sqlContentChirho.replace(
    /(SELECT p\.id, ')((?:[^'\\]|'')*)(', 'UNAPPROVED')/g,
    (_matchChirho, prefixChirho, glossChirho, suffixChirho) => {
      const cyrillicGlossChirho = latinToCyrillicChirho(glossChirho);
      return `${prefixChirho}${cyrillicGlossChirho}${suffixChirho}`;
    }
  );

  // Convert gloss values in ON CONFLICT DO UPDATE
  convertedChirho = convertedChirho.replace(
    /(DO UPDATE SET gloss = EXCLUDED\.gloss)/g,
    "$1"
  );

  // Convert comment lines with glosses: → "GLOSS" [opus-
  convertedChirho = convertedChirho.replace(
    /(→ ")((?:[^"\\]|"")*?)(" \[opus-)/g,
    (_matchChirho, prefixChirho, glossChirho, suffixChirho) => {
      const cyrillicGlossChirho = latinToCyrillicChirho(glossChirho);
      return `${prefixChirho}${cyrillicGlossChirho}${suffixChirho}`;
    }
  );

  // Convert the verse summary comment: -- U–početku stvori Bog ...
  convertedChirho = convertedChirho.replace(
    /^(-- [A-Z]+ c\d+-v\d+ - SRP\n-- )(.*?)$/m,
    (_matchChirho, prefixChirho, verseTextChirho) => {
      return `${prefixChirho}${latinToCyrillicChirho(verseTextChirho)}`;
    }
  );

  return convertedChirho;
}

async function processBookChirho(
  srcDirChirho: string,
  destDirChirho: string,
  bookNameChirho: string
): Promise<number> {
  const srcBookChirho = join(srcDirChirho, `${bookNameChirho}-chirho`);
  const destBookChirho = join(destDirChirho, `${bookNameChirho}-chirho`);

  let filesChirho: string[];
  try {
    filesChirho = await readdir(srcBookChirho);
  } catch {
    return 0;
  }

  const sqlFilesChirho = filesChirho.filter(
    (fChirho) => fChirho.startsWith("c") && fChirho.endsWith("-chirho.sql") && !fChirho.startsWith("all-")
  );

  if (sqlFilesChirho.length === 0) return 0;

  await mkdir(destBookChirho, { recursive: true });

  let countChirho = 0;
  for (const fileChirho of sqlFilesChirho) {
    const contentChirho = await readFile(join(srcBookChirho, fileChirho), "utf-8");
    const convertedChirho = convertSqlGlossChirho(contentChirho);
    await writeFile(join(destBookChirho, fileChirho), convertedChirho, "utf-8");
    countChirho++;
  }

  // Regenerate all-verses file
  if (countChirho > 0) {
    const allSqlFilesChirho = sqlFilesChirho.sort();
    let combinedChirho = "";
    for (const fileChirho of allSqlFilesChirho) {
      const contentChirho = await readFile(join(destBookChirho, fileChirho), "utf-8");
      combinedChirho += contentChirho;
    }
    await writeFile(join(destBookChirho, "all-verses-chirho.sql"), combinedChirho, "utf-8");
  }

  return countChirho;
}

async function mainChirho(): Promise<void> {
  const baseDirChirho = join(import.meta.dir, "..", "translations-chirho");
  const srcDirChirho = join(baseDirChirho, "readers-chirho", "srp-chirho");
  const destDirChirho = join(baseDirChirho, "readers-chirho", "srp-cyrl-chirho");

  await mkdir(destDirChirho, { recursive: true });

  const booksChirho = [
    "genesis", "exodus", "leviticus", "numbers", "deuteronomy",
    "joshua", "judges", "ruth", "1samuel", "2samuel",
    "1kings", "2kings", "1chronicles", "2chronicles",
    "ezra", "nehemiah", "esther", "job", "psalms", "proverbs",
    "ecclesiastes", "songofsolomon", "isaiah", "jeremiah",
    "lamentations", "ezekiel", "daniel",
    "hosea", "joel", "amos", "obadiah", "jonah", "micah",
    "nahum", "habakkuk", "zephaniah", "haggai", "zechariah", "malachi",
    "matthew", "mark", "luke", "john", "acts",
    "romans", "1corinthians", "2corinthians",
    "galatians", "ephesians", "philippians", "colossians",
    "1thessalonians", "2thessalonians", "1timothy", "2timothy",
    "titus", "philemon", "hebrews", "james",
    "1peter", "2peter", "1john", "2john", "3john", "jude", "revelation",
  ];

  console.log("Converting Serbian Latin → Cyrillic...\n");

  let totalChirho = 0;
  for (const bookChirho of booksChirho) {
    const countChirho = await processBookChirho(srcDirChirho, destDirChirho, bookChirho);
    if (countChirho > 0) {
      console.log(`  ${bookChirho}: ${countChirho} verse files converted`);
      totalChirho += countChirho;
    }
  }

  console.log(`\n✓ Converted ${totalChirho} verse files to Cyrillic`);
  console.log(`  Source: ${srcDirChirho}`);
  console.log(`  Output: ${destDirChirho}`);

  // Quick verification: show Gen 1:1
  const gen11Chirho = join(destDirChirho, "genesis-chirho", "c001-v001-chirho.sql");
  try {
    const contentChirho = await readFile(gen11Chirho, "utf-8");
    const glossesChirho = contentChirho.match(/SELECT p\.id, '([^']*)', 'UNAPPROVED'/g);
    if (glossesChirho) {
      console.log("\n  Sample (Genesis 1:1 glosses):");
      for (const gChirho of glossesChirho) {
        const matchChirho = gChirho.match(/SELECT p\.id, '([^']*)',/);
        if (matchChirho && matchChirho[1]) {
          console.log(`    ${matchChirho[1]}`);
        }
      }
    }
  } catch {
    console.log("\n  (Genesis 1:1 not yet available for preview)");
  }
}

mainChirho().catch(console.error);
