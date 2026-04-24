// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { PageServerLoad as PageServerLoadChirho } from './$types';
import { error as errorChirho } from '@sveltejs/kit';
import { resolveLanguageDbChirho } from '$lib/server/d1-resolver-chirho';
import { queryD1Chirho, queryD1OneChirho } from '$lib/server/db-d1-chirho';
import { getBookNameChirho } from '$lib/shared-chirho/book-names-chirho';

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

interface RefVersionRowChirho {
	id: number;
	code: string;
	name: string;
	language_code: string;
	verseCount: number;
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

	// Reference versions for this language (simple lookup, no count)
	const referenceVersionsChirho = await queryD1Chirho<RefVersionRowChirho>(
		dbChirho,
		`SELECT id, code, name, language_code, 0 AS verseCount
		 FROM reference_version_chirho
		 WHERE language_code = ?
		 ORDER BY name`,
		[codeChirho]
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
		referenceVersionsChirho: referenceVersionsChirho.map((vChirho) => ({
			idChirho: vChirho.id,
			codeChirho: vChirho.code,
			nameChirho: vChirho.name,
			languageCodeChirho: vChirho.language_code,
			verseCountChirho: vChirho.verseCount
		})),
		hasInterlinearPdfChirho: false,
		interlinearVersionsChirho: [] as Array<{ pdfPathChirho: string; nameChirho: string; badgeChirho: string | null }>
	};
};
