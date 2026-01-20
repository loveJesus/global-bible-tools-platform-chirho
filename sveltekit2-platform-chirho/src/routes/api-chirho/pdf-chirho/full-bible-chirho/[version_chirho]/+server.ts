// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Full Bible PDF Generation API
 * GET /api-chirho/pdf-chirho/full-bible-chirho/:version
 *
 * Generates a complete Bible PDF for a reference version (KJV, WEB, etc.)
 * Includes cover page, table of contents, and all books.
 */

import { error as errorChirho } from '@sveltejs/kit';
import type { RequestHandler as RequestHandlerChirho } from './$types';
import {
	createPdfDocumentChirho,
	addCoverPageChirho,
	addTableOfContentsChirho,
	addBookHeaderChirho,
	renderVerseTextChirho,
	getAllBooksChirho,
	getReferenceVersionChirho,
	getReferenceVersesForBookChirho,
	finalizePdfChirho,
	BOOK_ID_TO_NAME_CHIRHO
} from '$lib/server/pdf-generator-chirho';

export const GET: RequestHandlerChirho = async ({ params: paramsChirho }) => {
	const versionCodeChirho = paramsChirho.version_chirho.toLowerCase();

	// Get reference version
	const versionChirho = await getReferenceVersionChirho(versionCodeChirho);
	if (!versionChirho) {
		throw errorChirho(404, `Version '${versionCodeChirho}' not found`);
	}

	// Get all books
	const booksChirho = await getAllBooksChirho();
	if (booksChirho.length === 0) {
		throw errorChirho(500, 'No books found in database');
	}

	// Create PDF document
	const docChirho = createPdfDocumentChirho({
		info: {
			Title: `The Holy Bible - ${versionChirho.nameChirho}`,
			Author: 'Global Bible Tools',
			Subject: 'Holy Bible',
			Keywords: 'Bible, Scripture, ' + versionChirho.nameChirho,
			Creator: 'Global Bible Tools (global-tools.bible.systems)'
		}
	});

	// Collect PDF data
	const chunksChirho: Buffer[] = [];
	docChirho.on('data', (chunkChirho: Buffer) => chunksChirho.push(chunkChirho));

	// Add cover page
	addCoverPageChirho(docChirho, {
		titleChirho: 'THE HOLY BIBLE',
		subtitleChirho: versionChirho.nameChirho,
		languageNameChirho: getLanguageNameChirho(versionChirho.languageCodeChirho),
		yearChirho: new Date().getFullYear()
	});

	// Add table of contents
	addTableOfContentsChirho(docChirho, booksChirho);

	// Process each book
	let currentBookIdChirho = 0;
	let currentChapterChirho = 0;

	for (const bookChirho of booksChirho) {
		// Get verses for this book
		const versesChirho = await getReferenceVersesForBookChirho(versionChirho.idChirho, bookChirho.idChirho);

		// Skip books with no verses (e.g., NT-only versions)
		if (versesChirho.length === 0) {
			continue;
		}

		// Add book header (new page)
		addBookHeaderChirho(docChirho, bookChirho.nameChirho, true);
		currentBookIdChirho = bookChirho.idChirho;
		currentChapterChirho = 0;

		// Render verses
		for (const verseChirho of versesChirho) {
			// Parse verse ID (format: BBCCCVVV)
			const chapterNumChirho = parseInt(verseChirho.verseIdChirho.slice(2, 5), 10);
			const verseNumChirho = parseInt(verseChirho.verseIdChirho.slice(5, 8), 10);

			// Add chapter header if new chapter
			if (chapterNumChirho !== currentChapterChirho) {
				currentChapterChirho = chapterNumChirho;
				addChapterHeaderChirho(docChirho, chapterNumChirho);
			}

			// Render verse
			renderVerseTextChirho(docChirho, verseNumChirho, verseChirho.textChirho);
		}
	}

	// Finalize
	docChirho.end();
	await new Promise<void>((resolveChirho) => docChirho.on('end', resolveChirho));

	const pdfBufferChirho = Buffer.concat(chunksChirho);
	const filenameChirho = `Bible-${versionCodeChirho.toUpperCase()}.pdf`;

	return new Response(pdfBufferChirho, {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': `attachment; filename="${filenameChirho}"`,
			'Content-Length': pdfBufferChirho.length.toString()
		}
	});
};

/**
 * Add chapter header
 */
function addChapterHeaderChirho(docChirho: typeof import('pdfkit').prototype, chapterChirho: number): void {
	// Check if we need page break
	if (docChirho.y > 700) {
		docChirho.addPage();
	}

	docChirho.moveDown(1);
	docChirho.font('Helvetica-Bold').fontSize(12).fillColor('#334155');
	docChirho.text(`Chapter ${chapterChirho}`, { align: 'left' });
	docChirho.moveDown(0.5);
}

/**
 * Get human-readable language name from code
 */
function getLanguageNameChirho(codeChirho: string): string {
	const mapChirho: Record<string, string> = {
		eng: 'English',
		spa: 'Spanish',
		hin: 'Hindi',
		ben: 'Bengali',
		swa: 'Swahili',
		tur: 'Turkish',
		rus: 'Russian',
		ara: 'Arabic',
		fra: 'French',
		deu: 'German',
		por: 'Portuguese',
		zho: 'Chinese',
		jpn: 'Japanese',
		kor: 'Korean'
	};
	return mapChirho[codeChirho] ?? codeChirho;
}
