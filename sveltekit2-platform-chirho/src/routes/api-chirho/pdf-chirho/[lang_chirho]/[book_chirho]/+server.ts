// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * PDF Generation API
 * GET /api-chirho/pdf-chirho/:lang/:book?chapter=N
 *
 * Generates interlinear PDF for a book/chapter in the specified language.
 */

import { error as errorChirho } from '@sveltejs/kit';
import type { RequestHandler as RequestHandlerChirho } from './$types';
import { dbChirho, queryRawChirho, eqChirho } from '$lib/server/db-chirho';
import { bookTableChirho, languageTableChirho } from '$lib/server/schema-chirho';
import PDFDocument from 'pdfkit';
import { readFileSync as readFileSyncChirho } from 'fs';
import { join as joinChirho } from 'path';

// Load Noto Sans font for Greek/Hebrew support
const FONT_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoSans-Regular.ttf');
let notoFontChirho: Buffer | null = null;
try {
	notoFontChirho = readFileSyncChirho(FONT_PATH_CHIRHO);
} catch {
	console.warn('Noto Sans font not found, using default fonts');
}

interface WordRowChirho {
	wordIdChirho: string;
	textChirho: string;
	lemmaIdChirho: string | null;
	glossChirho: string | null;
	verseIdChirho: string;
}

const BOOK_NAME_TO_ID_CHIRHO: Record<string, number> = {
	// Full names
	genesis: 1,
	exodus: 2,
	psalms: 19,
	matthew: 40,
	john: 43,
	jude: 65,
	revelation: 66,
	// Common abbreviations
	gen: 1,
	exo: 2,
	exod: 2,
	psa: 19,
	psalm: 19,
	mat: 40,
	matt: 40,
	joh: 43,
	jhn: 43,
	jud: 65,
	rev: 66
};

export const GET: RequestHandlerChirho = async ({ params: paramsChirho, url: urlChirho }) => {
	const langCodeChirho = paramsChirho.lang_chirho;
	const bookNameChirho = paramsChirho.book_chirho.toLowerCase();
	const chapterParamChirho = urlChirho.searchParams.get('chapter');

	// Get book ID
	const bookIdChirho = BOOK_NAME_TO_ID_CHIRHO[bookNameChirho];
	if (!bookIdChirho) {
		throw errorChirho(404, `Book '${bookNameChirho}' not found`);
	}

	// Verify language exists
	const langResultChirho = await dbChirho
		.select()
		.from(languageTableChirho)
		.where(eqChirho(languageTableChirho.codeChirho, langCodeChirho))
		.limit(1);

	if (langResultChirho.length === 0) {
		throw errorChirho(404, `Language '${langCodeChirho}' not found`);
	}

	// Get book info
	const bookResultChirho = await dbChirho
		.select()
		.from(bookTableChirho)
		.where(eqChirho(bookTableChirho.idChirho, bookIdChirho))
		.limit(1);

	const bookChirho = bookResultChirho[0];

	// Build chapter filter
	let chapterFilterChirho = '';
	if (chapterParamChirho) {
		const chapNumChirho = parseInt(chapterParamChirho, 10);
		if (!isNaN(chapNumChirho)) {
			chapterFilterChirho = ` AND v.chapter = ${chapNumChirho}`;
		}
	}

	// Get words with glosses using LATERAL join to avoid duplicates
	const wordsChirho = await queryRawChirho<WordRowChirho>(
		`SELECT
			w.id AS "wordIdChirho",
			w.text AS "textChirho",
			lf.lemma_id AS "lemmaIdChirho",
			ph.gloss AS "glossChirho",
			w.verse_id AS "verseIdChirho"
		FROM word w
		JOIN verse v ON v.id = w.verse_id
		LEFT JOIN lemma_form lf ON lf.id = w.form_id
		LEFT JOIN LATERAL (
			SELECT g.gloss
			FROM phrase_word pw
			JOIN phrase p ON p.id = pw.phrase_id
			LEFT JOIN gloss g ON g.phrase_id = p.id
			WHERE pw.word_id = w.id
				AND p.language_id = $1
				AND p.deleted_at IS NULL
			LIMIT 1
		) AS ph ON true
		WHERE v.book_id = $2 ${chapterFilterChirho}
		ORDER BY w.id`,
		[langResultChirho[0].idChirho, bookIdChirho]
	);

	if (wordsChirho.length === 0) {
		throw errorChirho(404, 'No data found for this chapter');
	}

	// Create PDF
	const docChirho = new PDFDocument({
		size: 'A4',
		margins: { top: 50, bottom: 50, left: 50, right: 50 }
	});

	// Register Noto Sans font for Unicode support (Greek, Hebrew, etc.)
	if (notoFontChirho) {
		docChirho.registerFont('NotoSans', notoFontChirho);
	}

	const chunksChirho: Buffer[] = [];
	docChirho.on('data', (chunkChirho: Buffer) => chunksChirho.push(chunkChirho));

	// Use Noto Sans if available, otherwise Helvetica
	const mainFontChirho = notoFontChirho ? 'NotoSans' : 'Helvetica';

	// Title
	docChirho.font(mainFontChirho).fontSize(20).text(`${bookChirho?.nameChirho ?? bookNameChirho}`, { align: 'center' });
	if (chapterParamChirho) {
		docChirho.fontSize(14).text(`Chapter ${chapterParamChirho}`, { align: 'center' });
	}
	docChirho.fontSize(10).text(`${langResultChirho[0].nameChirho} Translation`, { align: 'center' });
	docChirho.moveDown(2);

	// Group words by verse
	const verseGroupsChirho = new Map<string, typeof wordsChirho>();
	for (const wordChirho of wordsChirho) {
		const groupChirho = verseGroupsChirho.get(wordChirho.verseIdChirho) ?? [];
		groupChirho.push(wordChirho);
		verseGroupsChirho.set(wordChirho.verseIdChirho, groupChirho);
	}

	// Helper to generate BibleHub URL for Strong's number
	const getStrongLinkChirho = (lemmaIdChirho: string | null): string | null => {
		if (!lemmaIdChirho) return null;
		const matchChirho = lemmaIdChirho.match(/^([HG])(\d+)$/);
		if (!matchChirho) return null;
		const [, prefixChirho, numberStrChirho] = matchChirho;
		const langChirho = prefixChirho === 'H' ? 'hebrew' : 'greek';
		const numberChirho = parseInt(numberStrChirho, 10); // Strip leading zeros
		return `https://biblehub.com/${langChirho}/${numberChirho}.htm`;
	};

	// Layout constants
	const PAGE_WIDTH_CHIRHO = 495; // A4 width minus margins
	const WORD_PADDING_CHIRHO = 12; // More padding between words
	const WORD_HEIGHT_CHIRHO = 45; // Height for each word block (original + gloss + strongs)
	const LEFT_MARGIN_CHIRHO = 50;

	// Render each verse in table-like layout
	for (const [verseIdChirho, verseWordsChirho] of verseGroupsChirho) {
		const verseNumChirho = parseInt(verseIdChirho.slice(-3), 10);

		// Calculate word widths using proper font
		const wordWidthsChirho = verseWordsChirho.map((wChirho) => {
			const originalWidthChirho = docChirho.font(mainFontChirho).fontSize(10).widthOfString(wChirho.textChirho);
			const glossWidthChirho = docChirho.font(mainFontChirho).fontSize(9).widthOfString(wChirho.glossChirho ?? '—');
			const strongsWidthChirho = wChirho.lemmaIdChirho
				? docChirho.font(mainFontChirho).fontSize(7).widthOfString(wChirho.lemmaIdChirho)
				: 0;
			return Math.max(originalWidthChirho, glossWidthChirho, strongsWidthChirho) + WORD_PADDING_CHIRHO;
		});

		// Break words into rows that fit page width
		const rowsChirho: { wordsChirho: typeof verseWordsChirho; widthsChirho: number[] }[] = [];
		let currentRowChirho: typeof verseWordsChirho = [];
		let currentWidthsChirho: number[] = [];
		let currentWidthChirho = 25; // Space for verse number

		for (let iChirho = 0; iChirho < verseWordsChirho.length; iChirho++) {
			const wordWidthChirho = wordWidthsChirho[iChirho];
			if (currentWidthChirho + wordWidthChirho > PAGE_WIDTH_CHIRHO && currentRowChirho.length > 0) {
				rowsChirho.push({ wordsChirho: currentRowChirho, widthsChirho: currentWidthsChirho });
				currentRowChirho = [];
				currentWidthsChirho = [];
				currentWidthChirho = 15; // Indent continuation
			}
			currentRowChirho.push(verseWordsChirho[iChirho]);
			currentWidthsChirho.push(wordWidthChirho);
			currentWidthChirho += wordWidthChirho;
		}
		if (currentRowChirho.length > 0) {
			rowsChirho.push({ wordsChirho: currentRowChirho, widthsChirho: currentWidthsChirho });
		}

		// Check if verse fits on page, otherwise add page break
		const verseHeightChirho = rowsChirho.length * WORD_HEIGHT_CHIRHO + 10;
		if (docChirho.y + verseHeightChirho > 780) {
			docChirho.addPage();
		}

		// Render each row
		for (let rowIdxChirho = 0; rowIdxChirho < rowsChirho.length; rowIdxChirho++) {
			const rowChirho = rowsChirho[rowIdxChirho];
			const rowYChirho = docChirho.y;
			let xChirho = LEFT_MARGIN_CHIRHO;

			// Verse number on first row only
			if (rowIdxChirho === 0) {
				docChirho.font(mainFontChirho).fontSize(9).fillColor('#666').text(`${verseNumChirho}`, xChirho, rowYChirho);
				xChirho += 25;
			} else {
				xChirho += 20; // Indent continuation rows
			}

			// Render each word in the row
			for (let wIdxChirho = 0; wIdxChirho < rowChirho.wordsChirho.length; wIdxChirho++) {
				const wordChirho = rowChirho.wordsChirho[wIdxChirho];
				const strongLinkChirho = getStrongLinkChirho(wordChirho.lemmaIdChirho);

				// Original text (top) - Greek/Hebrew
				docChirho.font(mainFontChirho).fontSize(10).fillColor('#333').text(wordChirho.textChirho, xChirho, rowYChirho);

				// Gloss (middle)
				docChirho
					.font(mainFontChirho)
					.fontSize(9)
					.fillColor('#000')
					.text(wordChirho.glossChirho ?? '—', xChirho, rowYChirho + 14);

				// Strong's number (bottom, clickable)
				if (wordChirho.lemmaIdChirho && strongLinkChirho) {
					docChirho
						.font(mainFontChirho)
						.fontSize(7)
						.fillColor('#0066cc')
						.text(wordChirho.lemmaIdChirho, xChirho, rowYChirho + 28, {
							link: strongLinkChirho,
							underline: true
						});
				}

				xChirho += rowChirho.widthsChirho[wIdxChirho];
			}

			docChirho.y = rowYChirho + WORD_HEIGHT_CHIRHO;
		}

		docChirho.moveDown(0.3);
	}

	// Finalize PDF
	docChirho.end();

	// Wait for PDF to complete
	await new Promise<void>((resolveChirho) => docChirho.on('end', resolveChirho));

	const pdfBufferChirho = Buffer.concat(chunksChirho);
	const filenameChirho = `${bookNameChirho}-${langCodeChirho}${chapterParamChirho ? `-ch${chapterParamChirho}` : ''}.pdf`;

	return new Response(pdfBufferChirho, {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': `attachment; filename="${filenameChirho}"`
		}
	});
};
