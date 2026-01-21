// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * PDF Generation API
 * GET /api-chirho/pdf-chirho/:lang/:book?chapter=N&ref=<version_code>
 *
 * Generates interlinear PDF for a book/chapter in the specified language.
 * Uses shared pdf-generator-chirho library for DRY rendering with RTL Hebrew support.
 * Includes reference text below each verse from the appropriate Bible version.
 */

import { error as errorChirho } from '@sveltejs/kit';
import type { RequestHandler as RequestHandlerChirho } from './$types';
import { dbChirho, queryRawChirho, eqChirho } from '$lib/server/db-chirho';
import { bookTableChirho, languageTableChirho, referenceVersionTableChirho } from '$lib/server/schema-chirho';
import {
	createPdfDocumentChirho,
	getMainFontChirho,
	getBoldFontChirho,
	renderInterlinearVerseChirho,
	finalizePdfChirho,
	BOOK_NAME_TO_ID_CHIRHO,
	type WordRowChirho
} from '$lib/server/pdf-generator-chirho';

// Map language codes to default reference version codes
const LANG_TO_REF_VERSION_CHIRHO: Record<string, string> = {
	eng: 'kjv',
	spa: 'rv1909',
	hin: 'hinerv',
	tur: 'TurHADI',
	ben: 'ben2006eb',
	swa: 'Swahili',
	rus: 'russynodal'
};

export const GET: RequestHandlerChirho = async ({ params: paramsChirho, url: urlChirho }) => {
	const langCodeChirho = paramsChirho.lang_chirho;
	const bookNameChirho = paramsChirho.book_chirho.toLowerCase();
	const chapterParamChirho = urlChirho.searchParams.get('chapter');
	const refParamChirho = urlChirho.searchParams.get('ref');

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

	// Get reference version (from URL param or default for language)
	const refVersionCodeChirho = refParamChirho ?? LANG_TO_REF_VERSION_CHIRHO[langCodeChirho] ?? 'kjv';
	const refVersionResultChirho = await dbChirho
		.select()
		.from(referenceVersionTableChirho)
		.where(eqChirho(referenceVersionTableChirho.codeChirho, refVersionCodeChirho))
		.limit(1);

	const refVersionChirho = refVersionResultChirho[0];

	// Build chapter filter
	let chapterFilterChirho = '';
	let chapterPrefixChirho = '';
	if (chapterParamChirho) {
		const chapNumChirho = parseInt(chapterParamChirho, 10);
		if (!isNaN(chapNumChirho)) {
			chapterFilterChirho = ` AND v.chapter = ${chapNumChirho}`;
			chapterPrefixChirho = `${bookIdChirho.toString().padStart(2, '0')}${chapNumChirho.toString().padStart(3, '0')}`;
		}
	} else {
		chapterPrefixChirho = `${bookIdChirho.toString().padStart(2, '0')}`;
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

	// Get reference verses if we have a reference version
	const refVersesMapChirho: Record<string, string> = {};
	if (refVersionChirho) {
		const refVersesChirho = await queryRawChirho<{ verseIdChirho: string; textChirho: string }>(
			`SELECT verse_id_chirho AS "verseIdChirho", text_chirho AS "textChirho"
			 FROM reference_verse_chirho
			 WHERE version_id_chirho = $1 AND verse_id_chirho LIKE $2
			 ORDER BY verse_id_chirho`,
			[refVersionChirho.idChirho, `${chapterPrefixChirho}%`]
		);
		for (const rvChirho of refVersesChirho) {
			// Strip OSIS markup for PDF
			refVersesMapChirho[rvChirho.verseIdChirho] = rvChirho.textChirho
				.replace(/<transChange[^>]*>([^<]*)<\/transChange>/g, '$1')
				.replace(/<w[^>]*>([^<]*)<\/w>/g, '$1')
				.replace(/<[^>]+>/g, '');
		}
	}

	// Create PDF using shared library
	const docChirho = createPdfDocumentChirho();

	const chunksChirho: Buffer[] = [];
	docChirho.on('data', (chunkChirho: Buffer) => chunksChirho.push(chunkChirho));

	const mainFontChirho = getMainFontChirho();
	const boldFontChirho = getBoldFontChirho();

	// Title
	docChirho.font(boldFontChirho).fontSize(20).fillColor('#1e293b').text(`${bookChirho?.nameChirho ?? bookNameChirho}`, { align: 'center' });
	if (chapterParamChirho) {
		docChirho.font(mainFontChirho).fontSize(14).fillColor('#475569').text(`Chapter ${chapterParamChirho}`, { align: 'center' });
	}
	docChirho.font(mainFontChirho).fontSize(10).fillColor('#64748b').text(`${langResultChirho[0].nameChirho} Interlinear`, { align: 'center' });
	if (refVersionChirho) {
		docChirho.font(mainFontChirho).fontSize(9).fillColor('#94a3b8').text(`Reference: ${refVersionChirho.nameChirho}`, { align: 'center' });
	}
	docChirho.moveDown(2);

	// Group words by verse
	const verseGroupsChirho = new Map<string, WordRowChirho[]>();
	for (const wordChirho of wordsChirho) {
		const groupChirho = verseGroupsChirho.get(wordChirho.verseIdChirho) ?? [];
		groupChirho.push(wordChirho);
		verseGroupsChirho.set(wordChirho.verseIdChirho, groupChirho);
	}

	// Determine if this is a Hebrew (OT) book for RTL rendering
	const isHebrewBookChirho = bookIdChirho <= 39;

	// Render each verse using shared library, then add reference text below
	for (const [verseIdChirho, verseWordsChirho] of verseGroupsChirho) {
		const verseNumChirho = parseInt(verseIdChirho.slice(-3), 10);

		// RTL rendering handles right-to-left placement internally, no array reversal needed
		renderInterlinearVerseChirho(docChirho, verseNumChirho, verseWordsChirho, true, isHebrewBookChirho);

		// Add reference text below the interlinear if available
		const refTextChirho = refVersesMapChirho[verseIdChirho];
		if (refTextChirho) {
			// Check if we need a new page
			if (docChirho.y > 750) {
				docChirho.addPage();
			}
			// Render reference text in a subtle style with left border
			const refYChirho = docChirho.y;
			docChirho.moveTo(55, refYChirho).lineTo(55, refYChirho + 12).stroke('#cbd5e1');
			docChirho.font(mainFontChirho).fontSize(9).fillColor('#64748b')
				.text(refTextChirho, 65, refYChirho, { width: 480 });
			docChirho.moveDown(0.5);
		}
	}

	// Finalize PDF
	docChirho.end();
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
