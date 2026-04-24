// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { json as jsonChirho, error as errorChirho } from '@sveltejs/kit';
import type { RequestHandler as RequestHandlerChirho } from './$types';
import { resolveLanguageDbChirho } from '$lib/server/d1-resolver-chirho';
import { queryD1Chirho, queryD1OneChirho, isNotDistinctFromD1Chirho } from '$lib/server/db-d1-chirho';

export const GET: RequestHandlerChirho = async ({ params: paramsChirho, url: urlChirho, platform: platformChirho }) => {
	const langCodeChirho = paramsChirho.lang_chirho;
	const bookIdChirho = parseInt(paramsChirho.book_chirho, 10);
	const chapterChirho = parseInt(paramsChirho.chapter_chirho, 10);
	const typeParamChirho = urlChirho.searchParams.get('type') ?? 'terse';
	const formatParamChirho = urlChirho.searchParams.get('format');

	if (isNaN(bookIdChirho) || isNaN(chapterChirho)) {
		throw errorChirho(400, 'Invalid book or chapter number');
	}

	const dbChirho = resolveLanguageDbChirho(platformChirho, langCodeChirho);
	if (!dbChirho) {
		throw errorChirho(404, `Language '${langCodeChirho}' not available`);
	}

	const languageChirho = await queryD1OneChirho<{ id: string }>(
		dbChirho,
		`SELECT id FROM language WHERE code = ?`,
		[langCodeChirho]
	);
	if (!languageChirho) {
		throw errorChirho(404, `Language '${langCodeChirho}' not found`);
	}

	const translationTypeChirho = typeParamChirho === 'readers' ? 'readers' : null;
	const typeFilterChirho = isNotDistinctFromD1Chirho('p.translation_type_chirho');

	const glossesChirho = await queryD1Chirho<{
		wordId: string;
		verseId: string;
		gloss: string | null;
		state: string | null;
		source: string | null;
	}>(
		dbChirho,
		`SELECT
			pw.word_id AS wordId,
			w.verse_id AS verseId,
			g.gloss,
			g.state,
			g.source
		 FROM phrase_word pw
		 JOIN phrase p ON p.id = pw.phrase_id
		 JOIN word w ON w.id = pw.word_id
		 JOIN verse v ON v.id = w.verse_id
		 LEFT JOIN gloss g ON g.phrase_id = p.id
		 WHERE v.book_id = ?
		   AND v.chapter = ?
		   AND p.language_id = ?
		   AND p.deleted_at IS NULL
		   AND ${typeFilterChirho}
		 ORDER BY w.id`,
		[bookIdChirho, chapterChirho, languageChirho.id, translationTypeChirho, translationTypeChirho]
	);

	return jsonChirho({
		data_chirho: glossesChirho.map((gChirho) => {
			let glossTextChirho = gChirho.gloss;
			if (formatParamChirho === 'plain' && glossTextChirho) {
				glossTextChirho = glossTextChirho.replace(/–/g, ' ').replace(/\s+/g, ' ').trim();
			}
			return {
				word_id_chirho: gChirho.wordId,
				verse_id_chirho: gChirho.verseId,
				gloss_chirho: glossTextChirho,
				state_chirho: gChirho.state,
				source_chirho: gChirho.source
			};
		})
	});
};
