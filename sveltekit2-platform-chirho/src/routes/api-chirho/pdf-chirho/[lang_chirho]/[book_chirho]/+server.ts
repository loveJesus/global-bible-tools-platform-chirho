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

interface WordRowChirho {
	wordIdChirho: string;
	textChirho: string;
	lemmaIdChirho: string | null;
	glossChirho: string | null;
	verseIdChirho: string;
}

const BOOK_NAME_TO_ID_CHIRHO: Record<string, number> = {
	genesis: 1,
	exodus: 2,
	matthew: 40,
	jude: 65,
	psalms: 19,
	john: 43,
	revelation: 66
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

	// Get words with glosses
	const wordsChirho = await queryRawChirho<WordRowChirho>(
		`SELECT
			w.id AS "wordIdChirho",
			w.text AS "textChirho",
			lf.lemma_id AS "lemmaIdChirho",
			g.gloss AS "glossChirho",
			w.verse_id AS "verseIdChirho"
		FROM word w
		JOIN verse v ON v.id = w.verse_id
		LEFT JOIN lemma_form lf ON lf.id = w.form_id
		LEFT JOIN phrase_word pw ON pw.word_id = w.id
		LEFT JOIN phrase p ON p.id = pw.phrase_id AND p.language_id = $1 AND p.deleted_at IS NULL
		LEFT JOIN gloss g ON g.phrase_id = p.id
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

	const chunksChirho: Buffer[] = [];
	docChirho.on('data', (chunkChirho: Buffer) => chunksChirho.push(chunkChirho));

	// Title
	docChirho.fontSize(20).text(`${bookChirho?.nameChirho ?? bookNameChirho}`, { align: 'center' });
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

	// Render each verse
	let currentVerseChirho = '';
	for (const [verseIdChirho, verseWordsChirho] of verseGroupsChirho) {
		// Extract verse number from ID
		const verseNumChirho = parseInt(verseIdChirho.slice(-3), 10);

		// Verse number
		docChirho.fontSize(10).fillColor('#666').text(`${verseNumChirho}`, { continued: true });
		docChirho.fillColor('#000');

		// Words in a simple format
		const lineChirho = verseWordsChirho
			.map((wChirho) => `${wChirho.textChirho}[${wChirho.glossChirho ?? '—'}]`)
			.join(' ');

		docChirho.fontSize(9).text(` ${lineChirho}`);
		docChirho.moveDown(0.5);

		// Page break check
		if (docChirho.y > 750) {
			docChirho.addPage();
		}
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
