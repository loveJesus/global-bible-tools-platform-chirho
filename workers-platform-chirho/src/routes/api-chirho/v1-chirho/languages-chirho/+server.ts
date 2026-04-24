// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { json as jsonChirho } from '@sveltejs/kit';
import type { RequestHandler as RequestHandlerChirho } from './$types';
import { getMetaDbChirho } from '$lib/server/d1-resolver-chirho';
import { queryD1Chirho } from '$lib/server/db-d1-chirho';

export const GET: RequestHandlerChirho = async ({ platform: platformChirho }) => {
	const metaDbChirho = getMetaDbChirho(platformChirho);
	if (!metaDbChirho) {
		return jsonChirho({ error_chirho: 'Database not available' }, { status: 503 });
	}

	const languagesChirho = await queryD1Chirho<{
		code: string;
		name: string;
		font: string | null;
		text_direction: string;
		verse_count_chirho: number | null;
		word_count_chirho: number | null;
	}>(
		metaDbChirho,
		`SELECT code, name, font, text_direction, verse_count_chirho, word_count_chirho
		 FROM language_stats_chirho
		 ORDER BY name`
	);

	return jsonChirho({
		data_chirho: languagesChirho.map((lChirho) => ({
			code_chirho: lChirho.code,
			name_chirho: lChirho.name,
			font_chirho: lChirho.font,
			text_direction_chirho: lChirho.text_direction,
			verse_count_chirho: lChirho.verse_count_chirho ?? 0,
			word_count_chirho: lChirho.word_count_chirho ?? 0
		}))
	});
};
