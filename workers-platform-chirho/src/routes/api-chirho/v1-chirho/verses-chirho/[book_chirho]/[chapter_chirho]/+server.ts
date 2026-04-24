// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { json as jsonChirho, error as errorChirho } from '@sveltejs/kit';
import type { RequestHandler as RequestHandlerChirho } from './$types';
import { resolveLanguageDbChirho } from '$lib/server/d1-resolver-chirho';
import { queryD1Chirho } from '$lib/server/db-d1-chirho';

export const GET: RequestHandlerChirho = async ({ params: paramsChirho, url: urlChirho, platform: platformChirho }) => {
	const bookIdChirho = parseInt(paramsChirho.book_chirho, 10);
	const chapterChirho = parseInt(paramsChirho.chapter_chirho, 10);

	if (isNaN(bookIdChirho) || isNaN(chapterChirho)) {
		throw errorChirho(400, 'Invalid book or chapter number');
	}

	// Use any available language DB since source data is duplicated
	// Pick eng as default, fall back to first available
	const langCodeChirho = urlChirho.searchParams.get('lang') ?? 'eng';
	const dbChirho = resolveLanguageDbChirho(platformChirho, langCodeChirho);
	if (!dbChirho) {
		throw errorChirho(503, 'No database available');
	}

	const wordsChirho = await queryD1Chirho<{
		wordId: string;
		verseId: string;
		text: string;
		lemmaId: string | null;
		grammar: string | null;
	}>(
		dbChirho,
		`SELECT
			w.id AS wordId,
			w.verse_id AS verseId,
			w.text,
			lf.lemma_id AS lemmaId,
			lf.grammar
		 FROM word w
		 JOIN verse v ON v.id = w.verse_id
		 LEFT JOIN lemma_form lf ON lf.id = w.form_id
		 WHERE v.book_id = ? AND v.chapter = ?
		 ORDER BY w.id`,
		[bookIdChirho, chapterChirho]
	);

	return jsonChirho({
		data_chirho: wordsChirho.map((wChirho) => ({
			word_id_chirho: wChirho.wordId,
			verse_id_chirho: wChirho.verseId,
			text_chirho: wChirho.text,
			lemma_id_chirho: wChirho.lemmaId,
			grammar_chirho: wChirho.grammar
		}))
	});
};
