// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Generate PDF Bible with interlinear glosses and reference translations.
 *
 * Layout per verse:
 *   Greek/Hebrew word grid: [word] [word] [word]
 *                           [G1234] [G5678] [H1234]
 *                           [gloss] [gloss] [gloss]
 *   Reference: "For God so loved the world..." (KJV/RV1909/etc)
 *
 * Usage:
 *   bun run tools-chirho/generate-pdf-chirho.ts <language> <book> [options]
 *
 * Options:
 *   --chapter=N     Generate single chapter
 *   --size=A4|A5|letter  Page size (default: A4)
 *   --output=path   Output file path
 *
 * Examples:
 *   bun run tools-chirho/generate-pdf-chirho.ts spa matthew
 *   bun run tools-chirho/generate-pdf-chirho.ts hin genesis --chapter=1
 *   bun run tools-chirho/generate-pdf-chirho.ts spa jude --size=A5 --output=./jude-spa.pdf
 */

import PDFDocumentChirho from 'pdfkit';
import { createWriteStream as createWriteStreamChirho } from 'node:fs';
import { mkdir as mkdirChirho } from 'node:fs/promises';
import { execSync as execSyncChirho } from 'node:child_process';
import { initPgConnectionChirho, queryPgChirho, closePgChirho } from './db-chirho';

// Book name mappings
const BOOK_NAMES_CHIRHO: Record<string, { idChirho: number; nameChirho: string; chaptersChirho: number }> = {
	// Old Testament
	genesis: { idChirho: 1, nameChirho: 'Genesis', chaptersChirho: 50 },
	exodus: { idChirho: 2, nameChirho: 'Exodus', chaptersChirho: 40 },
	leviticus: { idChirho: 3, nameChirho: 'Leviticus', chaptersChirho: 27 },
	numbers: { idChirho: 4, nameChirho: 'Numbers', chaptersChirho: 36 },
	deuteronomy: { idChirho: 5, nameChirho: 'Deuteronomy', chaptersChirho: 34 },
	psalms: { idChirho: 19, nameChirho: 'Psalms', chaptersChirho: 150 },
	proverbs: { idChirho: 20, nameChirho: 'Proverbs', chaptersChirho: 31 },
	// New Testament
	matthew: { idChirho: 40, nameChirho: 'Matthew', chaptersChirho: 28 },
	mark: { idChirho: 41, nameChirho: 'Mark', chaptersChirho: 16 },
	luke: { idChirho: 42, nameChirho: 'Luke', chaptersChirho: 24 },
	john: { idChirho: 43, nameChirho: 'John', chaptersChirho: 21 },
	acts: { idChirho: 44, nameChirho: 'Acts', chaptersChirho: 28 },
	romans: { idChirho: 45, nameChirho: 'Romans', chaptersChirho: 16 },
	'1corinthians': { idChirho: 46, nameChirho: '1 Corinthians', chaptersChirho: 16 },
	'2corinthians': { idChirho: 47, nameChirho: '2 Corinthians', chaptersChirho: 13 },
	galatians: { idChirho: 48, nameChirho: 'Galatians', chaptersChirho: 6 },
	ephesians: { idChirho: 49, nameChirho: 'Ephesians', chaptersChirho: 6 },
	philippians: { idChirho: 50, nameChirho: 'Philippians', chaptersChirho: 4 },
	colossians: { idChirho: 51, nameChirho: 'Colossians', chaptersChirho: 4 },
	'1thessalonians': { idChirho: 52, nameChirho: '1 Thessalonians', chaptersChirho: 5 },
	'2thessalonians': { idChirho: 53, nameChirho: '2 Thessalonians', chaptersChirho: 3 },
	'1timothy': { idChirho: 54, nameChirho: '1 Timothy', chaptersChirho: 6 },
	'2timothy': { idChirho: 55, nameChirho: '2 Timothy', chaptersChirho: 4 },
	titus: { idChirho: 56, nameChirho: 'Titus', chaptersChirho: 3 },
	philemon: { idChirho: 57, nameChirho: 'Philemon', chaptersChirho: 1 },
	hebrews: { idChirho: 58, nameChirho: 'Hebrews', chaptersChirho: 13 },
	james: { idChirho: 59, nameChirho: 'James', chaptersChirho: 5 },
	'1peter': { idChirho: 60, nameChirho: '1 Peter', chaptersChirho: 5 },
	'2peter': { idChirho: 61, nameChirho: '2 Peter', chaptersChirho: 3 },
	'1john': { idChirho: 62, nameChirho: '1 John', chaptersChirho: 5 },
	'2john': { idChirho: 63, nameChirho: '2 John', chaptersChirho: 1 },
	'3john': { idChirho: 64, nameChirho: '3 John', chaptersChirho: 1 },
	jude: { idChirho: 65, nameChirho: 'Jude', chaptersChirho: 1 },
	revelation: { idChirho: 66, nameChirho: 'Revelation', chaptersChirho: 22 },
};

// SWORD module mappings by language
const SWORD_MODULES_CHIRHO: Record<string, string[]> = {
	eng: ['KJV'],
	spa: ['SpaRV1909'],
	hin: ['KJV'], // Fallback to KJV until Hindi module available
	fra: ['KJV'],
	deu: ['KJV'],
	kor: ['KorRV']
};

// Page sizes in points (72 points = 1 inch)
const PAGE_SIZES_CHIRHO: Record<string, [number, number]> = {
	a4: [595.28, 841.89],
	a5: [419.53, 595.28],
	letter: [612, 792]
};

interface WordDataChirho {
	wordIdChirho: string;
	textChirho: string;
	lemmaIdChirho: string | null;
	glossChirho: string | null;
}

interface VerseDataChirho {
	verseIdChirho: string;
	verseNumberChirho: number;
	wordsChirho: WordDataChirho[];
}

interface ChapterDataChirho {
	chapterChirho: number;
	versesChirho: VerseDataChirho[];
}

interface TocEntryChirho {
	titleChirho: string;
	pageChirho: number;
}

/**
 * Get reference text from SWORD using diatheke
 */
function getReferenceTextChirho(moduleChirho: string, bookNameChirho: string, chapterChirho: number, verseChirho: number): string {
	try {
		const refChirho = `${bookNameChirho} ${chapterChirho}:${verseChirho}`;
		const outputChirho = execSyncChirho(`diatheke -b ${moduleChirho} -f plain -k "${refChirho}" 2>/dev/null`, {
			encoding: 'utf-8',
			timeout: 5000
		});

		// Clean up output - remove reference prefix and module name suffix
		let textChirho = outputChirho
			.replace(/^[^:]+:\s*/, '') // Remove "John 3:16: " prefix
			.replace(/\([A-Za-z0-9]+\)\s*$/, '') // Remove "(KJV)" suffix
			.replace(/<[^>]+>/g, '') // Remove XML tags
			.replace(/\s+/g, ' ')
			.trim();

		return textChirho;
	} catch {
		return '';
	}
}

/**
 * Query database for chapter data
 */
async function getChapterDataChirho(
	languageCodeChirho: string,
	bookIdChirho: number,
	chapterNumChirho: number
): Promise<ChapterDataChirho> {
	// Get language ID
	const langResultChirho = await queryPgChirho<{ id: string }>(
		`SELECT id FROM language WHERE code = $1`,
		[languageCodeChirho]
	);

	if (langResultChirho.length === 0) {
		throw new Error(`Language '${languageCodeChirho}' not found`);
	}

	const languageIdChirho = langResultChirho[0].id;

	// Get verses for chapter
	const versesResultChirho = await queryPgChirho<{ id: string; number: number }>(
		`SELECT id, number FROM verse
		 WHERE book_id = $1 AND chapter = $2
		 ORDER BY number`,
		[bookIdChirho, chapterNumChirho]
	);

	const versesChirho: VerseDataChirho[] = [];

	for (const verseRowChirho of versesResultChirho) {
		// Get words with glosses for this verse
		const wordsResultChirho = await queryPgChirho<{
			wordId: string;
			text: string;
			lemmaId: string | null;
			gloss: string | null;
		}>(
			`SELECT
				w.id AS "wordId",
				w.text,
				lf.lemma_id AS "lemmaId",
				g.gloss
			FROM word AS w
			LEFT JOIN lemma_form AS lf ON lf.id = w.form_id
			LEFT JOIN LATERAL (
				SELECT g.gloss
				FROM phrase_word AS pw
				JOIN phrase AS p ON p.id = pw.phrase_id
				LEFT JOIN gloss AS g ON g.phrase_id = p.id
				WHERE pw.word_id = w.id
					AND p.language_id = $2
					AND p.deleted_at IS NULL
				LIMIT 1
			) AS g ON true
			WHERE w.verse_id = $1
			ORDER BY w.id`,
			[verseRowChirho.id, languageIdChirho]
		);

		versesChirho.push({
			verseIdChirho: verseRowChirho.id,
			verseNumberChirho: verseRowChirho.number,
			wordsChirho: wordsResultChirho.map((wChirho) => ({
				wordIdChirho: wChirho.wordId,
				textChirho: wChirho.text,
				lemmaIdChirho: wChirho.lemmaId,
				glossChirho: wChirho.gloss
			}))
		});
	}

	return {
		chapterChirho: chapterNumChirho,
		versesChirho
	};
}

/**
 * Generate PDF for a book
 */
async function generatePdfChirho(
	languageCodeChirho: string,
	bookKeyChirho: string,
	optionsChirho: {
		chapterChirho?: number;
		pageSizeChirho: string;
		outputPathChirho?: string;
	}
): Promise<string> {
	const bookInfoChirho = BOOK_NAMES_CHIRHO[bookKeyChirho.toLowerCase()];
	if (!bookInfoChirho) {
		throw new Error(`Unknown book: ${bookKeyChirho}. Available: ${Object.keys(BOOK_NAMES_CHIRHO).join(', ')}`);
	}

	const swordModulesChirho = SWORD_MODULES_CHIRHO[languageCodeChirho] || ['KJV'];
	const swordModuleChirho = swordModulesChirho[0];

	const pageSizeChirho = PAGE_SIZES_CHIRHO[optionsChirho.pageSizeChirho.toLowerCase()] || PAGE_SIZES_CHIRHO.a4;

	// Determine chapters to generate
	const chaptersToGenerateChirho: number[] = [];
	if (optionsChirho.chapterChirho) {
		chaptersToGenerateChirho.push(optionsChirho.chapterChirho);
	} else {
		for (let iChirho = 1; iChirho <= bookInfoChirho.chaptersChirho; iChirho++) {
			chaptersToGenerateChirho.push(iChirho);
		}
	}

	// Output path
	const outputDirChirho = '/Volumes/ENC_4TB_WDB_CHIRHO/dev-aleluya/friends-aleluya/andrewbeth-chirho/platform-chirho/output-chirho/pdfs-chirho';
	await mkdirChirho(outputDirChirho, { recursive: true });

	const fileNameChirho = optionsChirho.chapterChirho
		? `${bookKeyChirho}-${languageCodeChirho}-ch${optionsChirho.chapterChirho}-chirho.pdf`
		: `${bookKeyChirho}-${languageCodeChirho}-chirho.pdf`;

	const outputPathChirho = optionsChirho.outputPathChirho || `${outputDirChirho}/${fileNameChirho}`;

	// Connect to database
	await initPgConnectionChirho();

	// Create PDF document
	const docChirho = new PDFDocumentChirho({
		size: pageSizeChirho,
		margins: { top: 60, bottom: 60, left: 50, right: 50 },
		bufferPages: true,
		info: {
			Title: `${bookInfoChirho.nameChirho} - ${languageCodeChirho.toUpperCase()} Interlinear`,
			Author: 'Global Bible Tools',
			Subject: 'Interlinear Bible Translation',
			Creator: 'generate-pdf-chirho'
		}
	});

	const streamChirho = createWriteStreamChirho(outputPathChirho);
	docChirho.pipe(streamChirho);

	const tocEntriesChirho: TocEntryChirho[] = [];
	const pageWidthChirho = pageSizeChirho[0] - 100; // Account for margins

	// Title page
	docChirho.fontSize(28).font('Helvetica-Bold');
	docChirho.text(bookInfoChirho.nameChirho, { align: 'center' });
	docChirho.moveDown(0.5);
	docChirho.fontSize(18).font('Helvetica');
	docChirho.text(`${languageCodeChirho.toUpperCase()} Interlinear Translation`, { align: 'center' });
	docChirho.moveDown(2);
	docChirho.fontSize(12);
	docChirho.text('Word-by-word translation with Strong\'s numbers', { align: 'center' });
	docChirho.moveDown(0.5);
	docChirho.text(`Reference: ${swordModuleChirho}`, { align: 'center' });
	docChirho.moveDown(3);
	docChirho.fontSize(10).fillColor('#666666');
	docChirho.text('Generated by Global Bible Tools', { align: 'center' });
	docChirho.text('https://global-tools.bible.systems', { align: 'center', link: 'https://global-tools.bible.systems' });

	// Table of Contents placeholder page
	docChirho.addPage();
	const tocPageChirho = docChirho.bufferedPageRange().count;
	docChirho.fontSize(20).font('Helvetica-Bold').fillColor('#000000');
	docChirho.text('Table of Contents', { align: 'center' });
	docChirho.moveDown(2);
	// We'll fill this in later

	// Generate chapters
	for (const chapterNumChirho of chaptersToGenerateChirho) {
		console.log(`Generating chapter ${chapterNumChirho}...`);

		docChirho.addPage();
		const chapterPageChirho = docChirho.bufferedPageRange().count;

		tocEntriesChirho.push({
			titleChirho: `Chapter ${chapterNumChirho}`,
			pageChirho: chapterPageChirho
		});

		// Chapter header
		docChirho.fontSize(18).font('Helvetica-Bold').fillColor('#000000');
		docChirho.text(`Chapter ${chapterNumChirho}`, { align: 'center' });
		docChirho.moveDown(1);

		// Get chapter data
		const chapterDataChirho = await getChapterDataChirho(
			languageCodeChirho,
			bookInfoChirho.idChirho,
			chapterNumChirho
		);

		// Render verses
		for (const verseChirho of chapterDataChirho.versesChirho) {
			// Check if we need a new page
			if (docChirho.y > pageSizeChirho[1] - 150) {
				docChirho.addPage();
			}

			// Verse number
			docChirho.fontSize(10).font('Helvetica-Bold').fillColor('#666666');
			docChirho.text(`${verseChirho.verseNumberChirho}`, { continued: false });

			const startYChirho = docChirho.y;
			let currentXChirho = 50;
			const wordWidthChirho = 70;
			const lineHeightChirho = 42;

			// Word grid
			for (const wordChirho of verseChirho.wordsChirho) {
				// Check if we need to wrap to next line
				if (currentXChirho + wordWidthChirho > pageWidthChirho + 50) {
					currentXChirho = 50;
					docChirho.y += lineHeightChirho;

					// Check if we need a new page mid-verse
					if (docChirho.y > pageSizeChirho[1] - 100) {
						docChirho.addPage();
						docChirho.y = 60;
					}
				}

				const wordYChirho = docChirho.y;

				// Original text (Greek/Hebrew)
				docChirho.fontSize(10).font('Helvetica').fillColor('#000000');
				docChirho.text(wordChirho.textChirho, currentXChirho, wordYChirho, {
					width: wordWidthChirho,
					align: 'center',
					lineBreak: false
				});

				// Strong's number
				if (wordChirho.lemmaIdChirho) {
					docChirho.fontSize(6).fillColor('#888888');
					docChirho.text(wordChirho.lemmaIdChirho, currentXChirho, wordYChirho + 12, {
						width: wordWidthChirho,
						align: 'center',
						lineBreak: false
					});
				}

				// Gloss
				const glossTextChirho = wordChirho.glossChirho || '—';
				docChirho.fontSize(9).fillColor('#2563eb');
				docChirho.text(glossTextChirho, currentXChirho, wordYChirho + 22, {
					width: wordWidthChirho,
					align: 'center',
					lineBreak: false
				});

				currentXChirho += wordWidthChirho;
			}

			// Move below the word grid
			docChirho.y += lineHeightChirho + 5;

			// Reference translation
			const refTextChirho = getReferenceTextChirho(
				swordModuleChirho,
				bookInfoChirho.nameChirho,
				chapterNumChirho,
				verseChirho.verseNumberChirho
			);

			if (refTextChirho) {
				docChirho.fontSize(9).font('Helvetica-Oblique').fillColor('#555555');
				docChirho.text(refTextChirho, 50, docChirho.y, {
					width: pageWidthChirho,
					align: 'left'
				});
			}

			docChirho.moveDown(1);
		}
	}

	// Go back and fill in TOC
	docChirho.switchToPage(tocPageChirho - 1);
	docChirho.y = 120;
	docChirho.fontSize(12).font('Helvetica').fillColor('#000000');

	for (const entryChirho of tocEntriesChirho) {
		const textChirho = entryChirho.titleChirho;
		const pageNumChirho = entryChirho.pageChirho.toString();

		docChirho.text(textChirho, 50, docChirho.y, { continued: true, width: pageWidthChirho - 50 });
		docChirho.text(pageNumChirho, { align: 'right' });
		docChirho.moveDown(0.3);
	}

	// Finalize
	docChirho.end();

	await closePgChirho();

	return new Promise((resolveChirho, rejectChirho) => {
		streamChirho.on('finish', () => {
			console.log(`PDF generated: ${outputPathChirho}`);
			resolveChirho(outputPathChirho);
		});
		streamChirho.on('error', rejectChirho);
	});
}

// CLI
async function mainChirho(): Promise<void> {
	const argsChirho = process.argv.slice(2);

	if (argsChirho.length < 2) {
		console.log('Usage: bun run tools-chirho/generate-pdf-chirho.ts <language> <book> [options]');
		console.log('');
		console.log('Options:');
		console.log('  --chapter=N      Generate single chapter');
		console.log('  --size=A4|A5|letter  Page size (default: A4)');
		console.log('  --output=path    Output file path');
		console.log('');
		console.log('Examples:');
		console.log('  bun run tools-chirho/generate-pdf-chirho.ts spa matthew');
		console.log('  bun run tools-chirho/generate-pdf-chirho.ts hin genesis --chapter=1');
		console.log('  bun run tools-chirho/generate-pdf-chirho.ts spa jude --size=A5');
		console.log('');
		console.log('Available books:', Object.keys(BOOK_NAMES_CHIRHO).join(', '));
		process.exit(1);
	}

	const languageCodeChirho = argsChirho[0];
	const bookKeyChirho = argsChirho[1];

	// Parse options
	let chapterChirho: number | undefined;
	let pageSizeChirho = 'a4';
	let outputPathChirho: string | undefined;

	for (const argChirho of argsChirho.slice(2)) {
		if (argChirho.startsWith('--chapter=')) {
			chapterChirho = parseInt(argChirho.split('=')[1], 10);
		} else if (argChirho.startsWith('--size=')) {
			pageSizeChirho = argChirho.split('=')[1].toLowerCase();
		} else if (argChirho.startsWith('--output=')) {
			outputPathChirho = argChirho.split('=')[1];
		}
	}

	await generatePdfChirho(languageCodeChirho, bookKeyChirho, {
		chapterChirho,
		pageSizeChirho,
		outputPathChirho
	});
}

mainChirho().catch((errChirho) => {
	console.error('PDF generation failed:', errChirho);
	process.exit(1);
});
