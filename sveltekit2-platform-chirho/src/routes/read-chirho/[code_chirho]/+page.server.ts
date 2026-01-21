// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { PageServerLoad as PageServerLoadChirho } from './$types';
import { dbChirho, eqChirho, queryRawChirho } from '$lib/server/db-chirho';
import { languageTableChirho, bookTableChirho, referenceVersionTableChirho } from '$lib/server/schema-chirho';
import { error as errorChirho } from '@sveltejs/kit';
import { existsSync as existsSyncChirho } from 'fs';
import { join as joinChirho } from 'path';

export const load: PageServerLoadChirho = async ({ params: paramsChirho }) => {
	const codeChirho = paramsChirho.code_chirho;

	// Get language
	const languageResultChirho = await dbChirho
		.select()
		.from(languageTableChirho)
		.where(eqChirho(languageTableChirho.codeChirho, codeChirho))
		.limit(1);

	const languageChirho = languageResultChirho[0];
	if (!languageChirho) {
		throw errorChirho(404, `Language '${codeChirho}' not found`);
	}

	// Get only books that have translations for this language
	const booksChirho = await queryRawChirho<{
		idChirho: number;
		nameChirho: string;
	}>(`
		SELECT DISTINCT b.id AS "idChirho", b.name AS "nameChirho"
		FROM book b
		WHERE EXISTS (
			SELECT 1 FROM phrase p
			JOIN phrase_word pw ON pw.phrase_id = p.id
			JOIN word w ON w.id = pw.word_id
			JOIN gloss g ON g.phrase_id = p.id AND g.gloss IS NOT NULL
			WHERE p.language_id = $1
				AND p.deleted_at IS NULL
				AND SUBSTRING(w.verse_id, 1, 2) = LPAD(b.id::text, 2, '0')
		)
		ORDER BY b.id
	`, [languageChirho.idChirho]);

	// Get reference versions for THIS language only (with verse counts)
	const referenceVersionsChirho = await queryRawChirho<{
		idChirho: number;
		codeChirho: string;
		nameChirho: string;
		languageCodeChirho: string;
		verseCountChirho: number;
	}>(`
		SELECT
			rv.id_chirho AS "idChirho",
			rv.code_chirho AS "codeChirho",
			rv.name_chirho AS "nameChirho",
			rv.language_code_chirho AS "languageCodeChirho",
			COUNT(rvs.verse_id_chirho)::int AS "verseCountChirho"
		FROM reference_version_chirho rv
		LEFT JOIN reference_verse_chirho rvs ON rvs.version_id_chirho = rv.id_chirho
		WHERE rv.language_code_chirho = $1
		GROUP BY rv.id_chirho, rv.code_chirho, rv.name_chirho, rv.language_code_chirho
		HAVING COUNT(rvs.verse_id_chirho) > 0
		ORDER BY rv.name_chirho
	`, [codeChirho]);

	// Check which reference version interlinear PDFs exist
	// Format: interlinear-{lang}-{version}-chirho.pdf (e.g., interlinear-hin-erv-chirho.pdf)
	const interlinearVersionsChirho = referenceVersionsChirho
		.map((vChirho) => {
			const pdfPathChirho = joinChirho(process.cwd(), `static/bibles-chirho/interlinear-${codeChirho}-${vChirho.codeChirho.toLowerCase()}-chirho.pdf`);
			return {
				codeChirho: vChirho.codeChirho,
				nameChirho: vChirho.nameChirho,
				hasPdfChirho: existsSyncChirho(pdfPathChirho),
				pdfPathChirho: `/bibles-chirho/interlinear-${codeChirho}-${vChirho.codeChirho.toLowerCase()}-chirho.pdf`
			};
		})
		.filter((vChirho) => vChirho.hasPdfChirho);

	// Check if any interlinear PDF exists for this language
	const hasInterlinearPdfChirho = interlinearVersionsChirho.length > 0;

	return {
		codeChirho,
		languageChirho,
		booksChirho,
		referenceVersionsChirho,
		hasInterlinearPdfChirho,
		interlinearVersionsChirho
	};
};
