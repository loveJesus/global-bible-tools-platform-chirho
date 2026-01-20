// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Import reference Bible versions from eBible.org or similar sources.
 * Supports USX, USFM, and plain text formats.
 *
 * Usage:
 *   bun run tools-chirho/import-reference-chirho.ts <version_code> <path_or_url>
 *
 * Examples:
 *   bun run tools-chirho/import-reference-chirho.ts kjv ./data-chirho/kjv.txt
 *   bun run tools-chirho/import-reference-chirho.ts web https://ebible.org/Scriptures/eng-web.txt
 */

import { initPgConnectionChirho, queryPgChirho, closePgConnectionChirho } from './db-chirho';

// Book name to ID mapping (standard Protestant canon order)
const BOOK_ID_MAP_CHIRHO: Record<string, number> = {
	// Old Testament
	GEN: 1, EXO: 2, LEV: 3, NUM: 4, DEU: 5,
	JOS: 6, JDG: 7, RUT: 8, '1SA': 9, '2SA': 10,
	'1KI': 11, '2KI': 12, '1CH': 13, '2CH': 14, EZR: 15,
	NEH: 16, EST: 17, JOB: 18, PSA: 19, PRO: 20,
	ECC: 21, SNG: 22, ISA: 23, JER: 24, LAM: 25,
	EZK: 26, DAN: 27, HOS: 28, JOL: 29, AMO: 30,
	OBA: 31, JON: 32, MIC: 33, NAM: 34, HAB: 35,
	ZEP: 36, HAG: 37, ZEC: 38, MAL: 39,
	// New Testament
	MAT: 40, MRK: 41, LUK: 42, JHN: 43, ACT: 44,
	ROM: 45, '1CO': 46, '2CO': 47, GAL: 48, EPH: 49,
	PHP: 50, COL: 51, '1TH': 52, '2TH': 53, '1TI': 54,
	'2TI': 55, TIT: 56, PHM: 57, HEB: 58, JAS: 59,
	'1PE': 60, '2PE': 61, '1JN': 62, '2JN': 63, '3JN': 64,
	JUD: 65, REV: 66,
	// Alternate names
	GENESIS: 1, EXODUS: 2, LEVITICUS: 3, NUMBERS: 4, DEUTERONOMY: 5,
	JOSHUA: 6, JUDGES: 7, RUTH: 8, ESTHER: 17, PSALMS: 19,
	PROVERBS: 20, ECCLESIASTES: 21, ISAIAH: 23, JEREMIAH: 24,
	EZEKIEL: 26, DANIEL: 27, HOSEA: 28, JOEL: 29, AMOS: 30,
	OBADIAH: 31, JONAH: 32, MICAH: 33, NAHUM: 34, HABAKKUK: 35,
	ZEPHANIAH: 36, HAGGAI: 37, ZECHARIAH: 38, MALACHI: 39,
	MATTHEW: 40, MARK: 41, LUKE: 42, JOHN: 43, ACTS: 44,
	ROMANS: 45, GALATIANS: 48, EPHESIANS: 49, PHILIPPIANS: 50,
	COLOSSIANS: 51, TITUS: 56, PHILEMON: 57, HEBREWS: 58,
	JAMES: 59, JUDE: 65, REVELATION: 66
};

interface VerseDataChirho {
	verseIdChirho: string;
	textChirho: string;
}

/**
 * Parse a reference like "GEN 1:1" or "Genesis 1:1" to verse ID "01001001"
 */
function parseReferenceChirho(refChirho: string): { bookIdChirho: number; chapterChirho: number; verseChirho: number } | null {
	// Pattern: BOOK CHAPTER:VERSE
	const matchChirho = refChirho.match(/^(\d?\w+)\s+(\d+):(\d+)/i);
	if (!matchChirho) return null;

	const [, bookNameChirho, chapterStrChirho, verseStrChirho] = matchChirho;
	const bookIdChirho = BOOK_ID_MAP_CHIRHO[bookNameChirho.toUpperCase()];
	if (!bookIdChirho) return null;

	return {
		bookIdChirho,
		chapterChirho: parseInt(chapterStrChirho, 10),
		verseChirho: parseInt(verseStrChirho, 10)
	};
}

/**
 * Convert book/chapter/verse to 8-digit verse ID
 */
function toVerseIdChirho(bookIdChirho: number, chapterChirho: number, verseChirho: number): string {
	return `${bookIdChirho.toString().padStart(2, '0')}${chapterChirho.toString().padStart(3, '0')}${verseChirho.toString().padStart(3, '0')}`;
}

/**
 * Parse USFM-style text file
 * Format: \v 1 In the beginning...
 */
function parseUsfmTextChirho(contentChirho: string): VerseDataChirho[] {
	const versesChirho: VerseDataChirho[] = [];
	let currentBookIdChirho = 0;
	let currentChapterChirho = 0;

	const linesChirho = contentChirho.split('\n');

	for (const lineChirho of linesChirho) {
		const trimmedChirho = lineChirho.trim();

		// Book marker: \id GEN
		const idMatchChirho = trimmedChirho.match(/^\\id\s+(\w+)/);
		if (idMatchChirho) {
			currentBookIdChirho = BOOK_ID_MAP_CHIRHO[idMatchChirho[1].toUpperCase()] ?? 0;
			continue;
		}

		// Chapter marker: \c 1
		const chapterMatchChirho = trimmedChirho.match(/^\\c\s+(\d+)/);
		if (chapterMatchChirho) {
			currentChapterChirho = parseInt(chapterMatchChirho[1], 10);
			continue;
		}

		// Verse marker: \v 1 Text...
		const verseMatchChirho = trimmedChirho.match(/^\\v\s+(\d+)\s+(.+)/);
		if (verseMatchChirho && currentBookIdChirho > 0 && currentChapterChirho > 0) {
			const verseNumChirho = parseInt(verseMatchChirho[1], 10);
			const textChirho = verseMatchChirho[2]
				.replace(/\\[a-z]+\*?\s*/g, '') // Remove USFM markers
				.replace(/\s+/g, ' ')
				.trim();

			versesChirho.push({
				verseIdChirho: toVerseIdChirho(currentBookIdChirho, currentChapterChirho, verseNumChirho),
				textChirho
			});
		}
	}

	return versesChirho;
}

/**
 * Parse simple tab-separated or pipe-separated format
 * Format: GEN 1:1 | In the beginning...
 * Or: 01001001	In the beginning...
 */
function parseSimpleTextChirho(contentChirho: string): VerseDataChirho[] {
	const versesChirho: VerseDataChirho[] = [];
	const linesChirho = contentChirho.split('\n');

	for (const lineChirho of linesChirho) {
		const trimmedChirho = lineChirho.trim();
		if (!trimmedChirho || trimmedChirho.startsWith('#')) continue;

		// Try verse ID format: 01001001	Text
		const tabMatchChirho = trimmedChirho.match(/^(\d{8})\t(.+)/);
		if (tabMatchChirho) {
			versesChirho.push({
				verseIdChirho: tabMatchChirho[1],
				textChirho: tabMatchChirho[2].trim()
			});
			continue;
		}

		// Try reference format: GEN 1:1 | Text
		const pipeMatchChirho = trimmedChirho.match(/^(.+?)\s*\|\s*(.+)/);
		if (pipeMatchChirho) {
			const parsedChirho = parseReferenceChirho(pipeMatchChirho[1].trim());
			if (parsedChirho) {
				versesChirho.push({
					verseIdChirho: toVerseIdChirho(parsedChirho.bookIdChirho, parsedChirho.chapterChirho, parsedChirho.verseChirho),
					textChirho: pipeMatchChirho[2].trim()
				});
			}
		}
	}

	return versesChirho;
}

/**
 * Main import function
 */
async function importReferenceVersionChirho(versionCodeChirho: string, sourcePathChirho: string): Promise<void> {
	console.log(`Importing reference version: ${versionCodeChirho} from ${sourcePathChirho}`);

	// Read content
	let contentChirho: string;
	if (sourcePathChirho.startsWith('http://') || sourcePathChirho.startsWith('https://')) {
		const responseChirho = await fetch(sourcePathChirho);
		if (!responseChirho.ok) {
			throw new Error(`Failed to fetch ${sourcePathChirho}: ${responseChirho.status}`);
		}
		contentChirho = await responseChirho.text();
	} else {
		contentChirho = await Bun.file(sourcePathChirho).text();
	}

	console.log(`Read ${contentChirho.length} bytes`);

	// Parse content
	let versesChirho: VerseDataChirho[];
	if (contentChirho.includes('\\id ') || contentChirho.includes('\\v ')) {
		console.log('Detected USFM format');
		versesChirho = parseUsfmTextChirho(contentChirho);
	} else {
		console.log('Using simple text format');
		versesChirho = parseSimpleTextChirho(contentChirho);
	}

	console.log(`Parsed ${versesChirho.length} verses`);

	if (versesChirho.length === 0) {
		throw new Error('No verses parsed from input file');
	}

	// Connect to database
	await initPgConnectionChirho();

	// Get version ID
	const versionResultChirho = await queryPgChirho<{ id_chirho: number }>(
		`SELECT id_chirho FROM reference_version_chirho WHERE code_chirho = $1`,
		[versionCodeChirho]
	);

	if (versionResultChirho.length === 0) {
		throw new Error(`Version '${versionCodeChirho}' not found. Run the migration first.`);
	}

	const versionIdChirho = versionResultChirho[0].id_chirho;
	console.log(`Version ID: ${versionIdChirho}`);

	// Insert verses in batches
	const batchSizeChirho = 500;
	let insertedChirho = 0;

	for (let iChirho = 0; iChirho < versesChirho.length; iChirho += batchSizeChirho) {
		const batchChirho = versesChirho.slice(iChirho, iChirho + batchSizeChirho);

		// Build batch insert
		const valuesChirho: string[] = [];
		const paramsChirho: (number | string)[] = [];
		let paramIdxChirho = 1;

		for (const verseChirho of batchChirho) {
			valuesChirho.push(`($${paramIdxChirho}, $${paramIdxChirho + 1}, $${paramIdxChirho + 2})`);
			paramsChirho.push(versionIdChirho, verseChirho.verseIdChirho, verseChirho.textChirho);
			paramIdxChirho += 3;
		}

		await queryPgChirho(
			`INSERT INTO reference_verse_chirho (version_id_chirho, verse_id_chirho, text_chirho)
			 VALUES ${valuesChirho.join(', ')}
			 ON CONFLICT (version_id_chirho, verse_id_chirho)
			 DO UPDATE SET text_chirho = EXCLUDED.text_chirho`,
			paramsChirho
		);

		insertedChirho += batchChirho.length;
		console.log(`Inserted ${insertedChirho}/${versesChirho.length} verses`);
	}

	await closePgConnectionChirho();
	console.log('Import complete!');
}

// CLI execution
const argsChirho = process.argv.slice(2);
if (argsChirho.length < 2) {
	console.log('Usage: bun run tools-chirho/import-reference-chirho.ts <version_code> <path_or_url>');
	console.log('');
	console.log('Examples:');
	console.log('  bun run tools-chirho/import-reference-chirho.ts kjv ./data-chirho/kjv.txt');
	console.log('  bun run tools-chirho/import-reference-chirho.ts web https://example.com/web.txt');
	process.exit(1);
}

const [versionCodeArgChirho, sourcePathArgChirho] = argsChirho;

importReferenceVersionChirho(versionCodeArgChirho, sourcePathArgChirho).catch((errChirho) => {
	console.error('Import failed:', errChirho);
	process.exit(1);
});
