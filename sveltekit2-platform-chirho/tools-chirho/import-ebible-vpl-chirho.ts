#!/usr/bin/env bun
// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Import Bible from eBible.org VPL (Verse-Per-Line) format
 *
 * Format: "BOOK CHAPTER:VERSE TEXT"
 * Example: "GEN 1:1 In the beginning..."
 *
 * Usage:
 *   bun run tools-chirho/import-ebible-vpl-chirho.ts <zip_url> <version_code> [version_name] [language_code]
 *
 * Example:
 *   bun run tools-chirho/import-ebible-vpl-chirho.ts https://eBible.org/Scriptures/swhonen_vpl.zip Swahili "Swahili Full Bible" swa
 */

import pg from 'pg';
import { join as joinChirho } from 'path';
import { execSync as execSyncChirho } from 'child_process';
import {
	writeFileSync as writeFileSyncChirho,
	mkdirSync as mkdirSyncChirho,
	existsSync as existsSyncChirho,
	readFileSync as readFileSyncChirho
} from 'fs';

const { Pool: PoolChirho } = pg;

const poolChirho = new PoolChirho({
	connectionString: process.env.DATABASE_URL_CHIRHO || 'postgresql://postgres:asdfasdf@localhost:5435/postgres'
});

// Standard book abbreviation to ID mapping (includes alternate abbreviations)
const BOOK_ABBREV_TO_ID_CHIRHO: Record<string, number> = {
	GEN: 1, EXO: 2, LEV: 3, NUM: 4, DEU: 5,
	JOS: 6, JDG: 7, RUT: 8, '1SA': 9, '2SA': 10,
	'1KI': 11, '2KI': 12, '1CH': 13, '2CH': 14,
	EZR: 15, NEH: 16, EST: 17, JOB: 18, PSA: 19,
	PRO: 20, ECC: 21, SNG: 22, SOL: 22, ISA: 23, JER: 24,
	LAM: 25, EZK: 26, EZE: 26, DAN: 27, HOS: 28, JOL: 29, JOE: 29,
	AMO: 30, OBA: 31, JON: 32, MIC: 33, NAM: 34,
	HAB: 35, ZEP: 36, HAG: 37, ZEC: 38, MAL: 39,
	MAT: 40, MRK: 41, MAR: 41, LUK: 42, JHN: 43, JOH: 43, ACT: 44,
	ROM: 45, '1CO': 46, '2CO': 47, GAL: 48, EPH: 49,
	PHP: 50, PHI: 50, COL: 51, '1TH': 52, '2TH': 53,
	'1TI': 54, '2TI': 55, TIT: 56, PHM: 57, HEB: 58,
	JAS: 59, JAM: 59, '1PE': 60, '2PE': 61, '1JN': 62, '1JO': 62, '2JN': 63, '2JO': 63,
	'3JN': 64, '3JO': 64, JUD: 65, REV: 66
};

interface ParsedVerseChirho {
	bookIdChirho: number;
	chapterChirho: number;
	verseChirho: number;
	textChirho: string;
}

/**
 * Parse VPL line: "BOOK CHAPTER:VERSE TEXT"
 */
function parseVplLineChirho(lineChirho: string): ParsedVerseChirho | null {
	const matchChirho = lineChirho.match(/^(\w+)\s+(\d+):(\d+)\s+(.+)$/);
	if (!matchChirho) return null;

	const [, bookAbbrChirho, chapterStrChirho, verseStrChirho, textChirho] = matchChirho;
	const bookIdChirho = BOOK_ABBREV_TO_ID_CHIRHO[bookAbbrChirho.toUpperCase()];

	if (!bookIdChirho) return null;

	return {
		bookIdChirho,
		chapterChirho: parseInt(chapterStrChirho, 10),
		verseChirho: parseInt(verseStrChirho, 10),
		textChirho: textChirho.trim()
	};
}

/**
 * Format verse ID: BBCCCVVV
 */
function formatVerseIdChirho(bookIdChirho: number, chapterChirho: number, verseChirho: number): string {
	return `${bookIdChirho.toString().padStart(2, '0')}${chapterChirho.toString().padStart(3, '0')}${verseChirho.toString().padStart(3, '0')}`;
}

async function mainChirho(): Promise<void> {
	const argsChirho = process.argv.slice(2);

	if (argsChirho.length < 2) {
		console.log('Usage: bun run import-ebible-vpl-chirho.ts <zip_url> <version_code> [version_name] [language_code]');
		console.log('Example: bun run import-ebible-vpl-chirho.ts https://eBible.org/Scriptures/swhonen_vpl.zip Swahili "Swahili Full Bible" swa');
		process.exit(1);
	}

	const zipUrlChirho = argsChirho[0];
	const versionCodeChirho = argsChirho[1];
	const versionNameChirho = argsChirho[2] || versionCodeChirho;
	const languageCodeChirho = argsChirho[3] || 'swa';

	console.log(`Importing Bible from ${zipUrlChirho}`);
	console.log(`Version: ${versionCodeChirho} (${versionNameChirho})`);

	// Download zip
	console.log('Downloading...');
	const responseChirho = await fetch(zipUrlChirho);
	if (!responseChirho.ok) {
		console.error(`Failed to download: ${responseChirho.status}`);
		process.exit(1);
	}

	const zipBufferChirho = await responseChirho.arrayBuffer();
	const zipPathChirho = `/tmp/ebible-${versionCodeChirho}.zip`;
	writeFileSyncChirho(zipPathChirho, Buffer.from(zipBufferChirho));

	// Extract and find VPL file
	console.log('Extracting...');

	// Use native unzip
	const tmpDirChirho = `/tmp/ebible-${versionCodeChirho}`;
	if (!existsSyncChirho(tmpDirChirho)) mkdirSyncChirho(tmpDirChirho, { recursive: true });

	execSyncChirho(`unzip -o "${zipPathChirho}" -d "${tmpDirChirho}"`, { stdio: 'pipe' });

	// Find VPL file
	const filesChirho = execSyncChirho(`ls "${tmpDirChirho}"/*.txt 2>/dev/null || echo ""`, { encoding: 'utf-8' }).trim();
	const vplFileChirho = filesChirho.split('\n').find(fChirho => fChirho.includes('_vpl.txt'));

	if (!vplFileChirho) {
		console.error('No VPL file found in zip');
		process.exit(1);
	}

	console.log(`Found VPL file: ${vplFileChirho}`);

	// Read VPL content
	const contentChirho = readFileSyncChirho(vplFileChirho, 'utf-8');
	const linesChirho = contentChirho.split('\n').filter(lChirho => lChirho.trim());

	// Get or create version
	let versionResultChirho = await poolChirho.query<{ idChirho: number }>(
		`SELECT id_chirho AS "idChirho" FROM reference_version_chirho WHERE code_chirho = $1`,
		[versionCodeChirho]
	);

	let versionIdChirho: number;
	if (versionResultChirho.rows.length === 0) {
		console.log(`Creating new version: ${versionNameChirho}`);
		const insertResultChirho = await poolChirho.query<{ idChirho: number }>(
			`INSERT INTO reference_version_chirho (code_chirho, name_chirho, language_code_chirho, source_chirho)
			 VALUES ($1, $2, $3, 'ebible.org')
			 RETURNING id_chirho AS "idChirho"`,
			[versionCodeChirho, versionNameChirho, languageCodeChirho]
		);
		versionIdChirho = insertResultChirho.rows[0].idChirho;
	} else {
		versionIdChirho = versionResultChirho.rows[0].idChirho;
		console.log(`Using existing version ID: ${versionIdChirho}`);
	}

	// Parse and insert verses
	console.log(`Parsing ${linesChirho.length} lines...`);
	let insertedChirho = 0;
	let skippedChirho = 0;

	for (const lineChirho of linesChirho) {
		const parsedChirho = parseVplLineChirho(lineChirho);
		if (!parsedChirho) {
			skippedChirho++;
			continue;
		}

		const verseIdChirho = formatVerseIdChirho(
			parsedChirho.bookIdChirho,
			parsedChirho.chapterChirho,
			parsedChirho.verseChirho
		);

		await poolChirho.query(
			`INSERT INTO reference_verse_chirho (version_id_chirho, verse_id_chirho, text_chirho)
			 VALUES ($1, $2, $3)
			 ON CONFLICT (version_id_chirho, verse_id_chirho)
			 DO UPDATE SET text_chirho = EXCLUDED.text_chirho`,
			[versionIdChirho, verseIdChirho, parsedChirho.textChirho]
		);

		insertedChirho++;

		if (insertedChirho % 1000 === 0) {
			process.stdout.write(`  ${insertedChirho} verses...\r`);
		}
	}

	// Get final count
	const countResultChirho = await poolChirho.query<{ countChirho: string }>(
		`SELECT COUNT(*) AS "countChirho" FROM reference_verse_chirho WHERE version_id_chirho = $1`,
		[versionIdChirho]
	);

	console.log('\n' + '='.repeat(50));
	console.log(`Import complete!`);
	console.log(`  Version: ${versionNameChirho} (ID: ${versionIdChirho})`);
	console.log(`  Inserted: ${insertedChirho} verses`);
	console.log(`  Skipped: ${skippedChirho} lines`);
	console.log(`  Total verses: ${countResultChirho.rows[0].countChirho}`);
	console.log('='.repeat(50));

	await poolChirho.end();
}

mainChirho().catch((errChirho) => {
	console.error('Error:', errChirho);
	process.exit(1);
});
