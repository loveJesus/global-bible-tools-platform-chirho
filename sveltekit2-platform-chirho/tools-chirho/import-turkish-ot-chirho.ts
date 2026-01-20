#!/usr/bin/env bun
// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Import Turkish Old Testament from sacred-texts.com
 *
 * Fetches Turkish OT text and adds to existing TurHADI version
 * (which currently only has NT)
 *
 * Usage:
 *   bun run tools-chirho/import-turkish-ot-chirho.ts
 */

import pg from 'pg';

const { Pool: PoolChirho } = pg;

const poolChirho = new PoolChirho({
	connectionString: process.env.DATABASE_URL_CHIRHO || 'postgresql://postgres:asdfasdf@localhost:5435/postgres'
});

// OT book abbreviations from sacred-texts.com
const OT_BOOKS_CHIRHO = [
	{ idChirho: 1, abbrevChirho: 'gen', nameChirho: 'Genesis' },
	{ idChirho: 2, abbrevChirho: 'exo', nameChirho: 'Exodus' },
	{ idChirho: 3, abbrevChirho: 'lev', nameChirho: 'Leviticus' },
	{ idChirho: 4, abbrevChirho: 'num', nameChirho: 'Numbers' },
	{ idChirho: 5, abbrevChirho: 'deu', nameChirho: 'Deuteronomy' },
	{ idChirho: 6, abbrevChirho: 'jos', nameChirho: 'Joshua' },
	{ idChirho: 7, abbrevChirho: 'jdg', nameChirho: 'Judges' },
	{ idChirho: 8, abbrevChirho: 'rut', nameChirho: 'Ruth' },
	{ idChirho: 9, abbrevChirho: 'sa1', nameChirho: '1 Samuel' },
	{ idChirho: 10, abbrevChirho: 'sa2', nameChirho: '2 Samuel' },
	{ idChirho: 11, abbrevChirho: 'kg1', nameChirho: '1 Kings' },
	{ idChirho: 12, abbrevChirho: 'kg2', nameChirho: '2 Kings' },
	{ idChirho: 13, abbrevChirho: 'ch1', nameChirho: '1 Chronicles' },
	{ idChirho: 14, abbrevChirho: 'ch2', nameChirho: '2 Chronicles' },
	{ idChirho: 15, abbrevChirho: 'ezr', nameChirho: 'Ezra' },
	{ idChirho: 16, abbrevChirho: 'neh', nameChirho: 'Nehemiah' },
	{ idChirho: 17, abbrevChirho: 'est', nameChirho: 'Esther' },
	{ idChirho: 18, abbrevChirho: 'job', nameChirho: 'Job' },
	{ idChirho: 19, abbrevChirho: 'psa', nameChirho: 'Psalms' },
	{ idChirho: 20, abbrevChirho: 'pro', nameChirho: 'Proverbs' },
	{ idChirho: 21, abbrevChirho: 'ecc', nameChirho: 'Ecclesiastes' },
	{ idChirho: 22, abbrevChirho: 'sol', nameChirho: 'Song of Solomon' },
	{ idChirho: 23, abbrevChirho: 'isa', nameChirho: 'Isaiah' },
	{ idChirho: 24, abbrevChirho: 'jer', nameChirho: 'Jeremiah' },
	{ idChirho: 25, abbrevChirho: 'lam', nameChirho: 'Lamentations' },
	{ idChirho: 26, abbrevChirho: 'eze', nameChirho: 'Ezekiel' },
	{ idChirho: 27, abbrevChirho: 'dan', nameChirho: 'Daniel' },
	{ idChirho: 28, abbrevChirho: 'hos', nameChirho: 'Hosea' },
	{ idChirho: 29, abbrevChirho: 'joe', nameChirho: 'Joel' },
	{ idChirho: 30, abbrevChirho: 'amo', nameChirho: 'Amos' },
	{ idChirho: 31, abbrevChirho: 'oba', nameChirho: 'Obadiah' },
	{ idChirho: 32, abbrevChirho: 'jon', nameChirho: 'Jonah' },
	{ idChirho: 33, abbrevChirho: 'mic', nameChirho: 'Micah' },
	{ idChirho: 34, abbrevChirho: 'nah', nameChirho: 'Nahum' },
	{ idChirho: 35, abbrevChirho: 'hab', nameChirho: 'Habakkuk' },
	{ idChirho: 36, abbrevChirho: 'zep', nameChirho: 'Zephaniah' },
	{ idChirho: 37, abbrevChirho: 'hag', nameChirho: 'Haggai' },
	{ idChirho: 38, abbrevChirho: 'zac', nameChirho: 'Zechariah' },
	{ idChirho: 39, abbrevChirho: 'mal', nameChirho: 'Malachi' }
];

interface VerseDataChirho {
	verseIdChirho: string;
	textChirho: string;
}

/**
 * Parse verse text from page content
 * Format: "1:1 text 1:2 text 2:1 text..."
 */
function parseVersesChirho(contentChirho: string, bookIdChirho: number): VerseDataChirho[] {
	const versesChirho: VerseDataChirho[] = [];

	// Remove HTML tags for cleaner parsing
	const cleanTextChirho = contentChirho
		.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
		.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
		.replace(/<[^>]+>/g, ' ')
		.replace(/&nbsp;/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();

	// Match pattern: chapter:verse followed by text until next chapter:verse
	const versePatternChirho = /(\d+):(\d+)\s+([^]*?)(?=\d+:\d+|$)/g;
	let matchChirho;

	while ((matchChirho = versePatternChirho.exec(cleanTextChirho)) !== null) {
		const chapterChirho = parseInt(matchChirho[1], 10);
		const verseChirho = parseInt(matchChirho[2], 10);
		const textChirho = matchChirho[3].trim();

		if (textChirho && textChirho.length > 1) {
			// Format verse ID: BBCCCVVV
			const bookPaddedChirho = bookIdChirho.toString().padStart(2, '0');
			const chapterPaddedChirho = chapterChirho.toString().padStart(3, '0');
			const versePaddedChirho = verseChirho.toString().padStart(3, '0');
			const verseIdChirho = `${bookPaddedChirho}${chapterPaddedChirho}${versePaddedChirho}`;
			versesChirho.push({ verseIdChirho, textChirho });
		}
	}

	return versesChirho;
}

async function mainChirho(): Promise<void> {
	console.log('Importing Turkish OT from sacred-texts.com...\n');

	// Get TurHADI version ID
	const versionResultChirho = await poolChirho.query<{ idChirho: number }>(
		`SELECT id_chirho AS "idChirho" FROM reference_version_chirho WHERE code_chirho = 'TurHADI'`
	);

	if (versionResultChirho.rows.length === 0) {
		console.error('TurHADI version not found in database');
		process.exit(1);
	}

	const versionIdChirho = versionResultChirho.rows[0].idChirho;
	console.log(`Using version ID: ${versionIdChirho}`);

	let totalVersesChirho = 0;

	for (const bookChirho of OT_BOOKS_CHIRHO) {
		const urlChirho = `https://sacred-texts.com/bib/wb/trk/${bookChirho.abbrevChirho}.htm`;

		try {
			console.log(`Fetching ${bookChirho.nameChirho}...`);
			const responseChirho = await fetch(urlChirho);

			if (!responseChirho.ok) {
				console.warn(`  Failed to fetch ${bookChirho.nameChirho}: ${responseChirho.status}`);
				continue;
			}

			const contentChirho = await responseChirho.text();
			const versesChirho = parseVersesChirho(contentChirho, bookChirho.idChirho);

			if (versesChirho.length === 0) {
				console.warn(`  No verses found for ${bookChirho.nameChirho}`);
				continue;
			}

			// Insert verses (upsert to avoid duplicates)
			for (const verseChirho of versesChirho) {
				await poolChirho.query(
					`INSERT INTO reference_verse_chirho (version_id_chirho, verse_id_chirho, text_chirho)
					 VALUES ($1, $2, $3)
					 ON CONFLICT (version_id_chirho, verse_id_chirho)
					 DO UPDATE SET text_chirho = EXCLUDED.text_chirho`,
					[versionIdChirho, verseChirho.verseIdChirho, verseChirho.textChirho]
				);
			}

			console.log(`  ${bookChirho.nameChirho}: ${versesChirho.length} verses`);
			totalVersesChirho += versesChirho.length;

			// Small delay to be polite to the server
			await new Promise<void>(resolveChirho => setTimeout(resolveChirho, 200));

		} catch (errChirho) {
			console.error(`  Error processing ${bookChirho.nameChirho}:`, errChirho);
		}
	}

	// Get total verse count for Turkish version
	const countResultChirho = await poolChirho.query<{ countChirho: string }>(
		`SELECT COUNT(*) AS "countChirho" FROM reference_verse_chirho WHERE version_id_chirho = $1`,
		[versionIdChirho]
	);

	console.log('\n' + '='.repeat(50));
	console.log(`OT verses imported: ${totalVersesChirho}`);
	console.log(`Total Turkish verses now: ${countResultChirho.rows[0].countChirho}`);
	console.log('='.repeat(50));

	await poolChirho.end();
}

mainChirho().catch((errChirho) => {
	console.error('Error:', errChirho);
	process.exit(1);
});
