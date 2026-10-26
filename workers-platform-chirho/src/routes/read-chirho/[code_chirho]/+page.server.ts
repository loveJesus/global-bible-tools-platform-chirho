// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { PageServerLoad as PageServerLoadChirho } from './$types';
import { error as errorChirho } from '@sveltejs/kit';
import { resolveLanguageDbChirho } from '$lib/server/d1-resolver-chirho';
import { queryD1Chirho, queryD1OneChirho } from '$lib/server/db-d1-chirho';
import { getBookNameChirho } from '$lib/shared-chirho/book-names-chirho';
import { pdfDownloadsForLanguageChirho, pdfShortLabelChirho } from '$lib/shared-chirho/pdf-downloads-chirho';

interface LanguageRowChirho {
	id: string;
	code: string;
	name: string;
	font: string | null;
}

interface BookRowChirho {
	id: number;
	name: string;
}

export const load: PageServerLoadChirho = async ({ params: paramsChirho, platform: platformChirho }) => {
	const codeChirho = paramsChirho.code_chirho;

	const dbChirho = resolveLanguageDbChirho(platformChirho, codeChirho);
	if (!dbChirho) {
		throw errorChirho(404, `Language '${codeChirho}' not available`);
	}

	const languageChirho = await queryD1OneChirho<LanguageRowChirho>(
		dbChirho,
		`SELECT id, code, name, font FROM language WHERE code = ?`,
		[codeChirho]
	);
	if (!languageChirho) {
		throw errorChirho(404, `Language '${codeChirho}' not found`);
	}

	// All books — every per-language DB has the full Bible
	const booksChirho = await queryD1Chirho<BookRowChirho>(
		dbChirho,
		`SELECT id, name FROM book ORDER BY id`
	);

	return {
		codeChirho,
		languageChirho: {
			idChirho: languageChirho.id,
			codeChirho: languageChirho.code,
			nameChirho: languageChirho.name,
			fontChirho: languageChirho.font
		},
		booksChirho: booksChirho.map((bChirho) => ({
			idChirho: bChirho.id,
			nameChirho: getBookNameChirho(bChirho.id, codeChirho)
		})),
		// Interlinear PDFs on R2. Reference-text-only PDFs were generated on demand by the retired
		// VPS (/api-chirho/pdf-chirho/full-bible-chirho/*); nothing on the Worker serves them.
		interlinearVersionsChirho: pdfDownloadsForLanguageChirho(codeChirho).map((pdfChirho) => ({
			pdfPathChirho: pdfChirho.pathChirho,
			nameChirho: pdfShortLabelChirho(pdfChirho),
			badgeChirho: pdfChirho.badgeChirho ?? null
		}))
	};
};
