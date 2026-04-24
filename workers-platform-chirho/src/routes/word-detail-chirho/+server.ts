// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { json as jsonChirho, error as errorChirho } from '@sveltejs/kit';
import type { RequestHandler as RequestHandlerChirho } from './$types';
import { resolveLanguageDbChirho } from '$lib/server/d1-resolver-chirho';
import { queryD1Chirho, queryD1OneChirho } from '$lib/server/db-d1-chirho';

export const GET: RequestHandlerChirho = async ({ url: urlChirho, platform: platformChirho }) => {
	const wordIdChirho = urlChirho.searchParams.get('wordId');
	const langCodeChirho = urlChirho.searchParams.get('lang') ?? 'eng';

	if (!wordIdChirho) {
		throw errorChirho(400, 'wordId is required');
	}

	const dbChirho = resolveLanguageDbChirho(platformChirho, langCodeChirho);
	if (!dbChirho) {
		throw errorChirho(503, 'Database not available');
	}

	// Get word + lemma info
	const wordChirho = await queryD1OneChirho<{
		id: string;
		text: string;
		verse_id: string;
		lemma_id: string | null;
		grammar: string | null;
	}>(
		dbChirho,
		`SELECT w.id, w.text, w.verse_id, lf.lemma_id, lf.grammar
		 FROM word w
		 LEFT JOIN lemma_form lf ON lf.id = w.form_id
		 WHERE w.id = ?`,
		[wordIdChirho]
	);

	if (!wordChirho) {
		throw errorChirho(404, 'Word not found');
	}

	// Get lexicon entries for the lemma
	let resourcesChirho: Array<{ resource_code: string; content: string }> = [];
	if (wordChirho.lemma_id) {
		resourcesChirho = await queryD1Chirho<{ resource_code: string; content: string }>(
			dbChirho,
			`SELECT resource_code, content FROM lemma_resource WHERE lemma_id = ?`,
			[wordChirho.lemma_id]
		);
	}

	return jsonChirho({
		data_chirho: {
			word_id_chirho: wordChirho.id,
			text_chirho: wordChirho.text,
			verse_id_chirho: wordChirho.verse_id,
			lemma_id_chirho: wordChirho.lemma_id,
			grammar_chirho: wordChirho.grammar,
			resources_chirho: resourcesChirho.map((rChirho) => ({
				resource_code_chirho: rChirho.resource_code,
				content_chirho: rChirho.content
			}))
		}
	});
};
