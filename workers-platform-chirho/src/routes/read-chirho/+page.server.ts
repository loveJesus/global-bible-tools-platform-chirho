// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { PageServerLoad as PageServerLoadChirho } from './$types';
import { getMetaDbChirho } from '$lib/server/d1-resolver-chirho';
import { queryD1Chirho } from '$lib/server/db-d1-chirho';

interface LanguageStatsChirho {
	code: string;
	name: string;
	font: string | null;
	text_direction: string;
	verse_count_chirho: number | null;
	word_count_chirho: number | null;
}

export const load: PageServerLoadChirho = async ({ platform: platformChirho }) => {
	const metaDbChirho = getMetaDbChirho(platformChirho);
	if (!metaDbChirho) {
		return { languagesChirho: [] };
	}

	const languagesChirho = await queryD1Chirho<LanguageStatsChirho>(
		metaDbChirho,
		`SELECT code, name, font, text_direction, verse_count_chirho, word_count_chirho
		 FROM language_stats_chirho
		 ORDER BY name`
	);

	return {
		languagesChirho: languagesChirho.map((lChirho) => ({
			codeChirho: lChirho.code,
			nameChirho: lChirho.name,
			fontChirho: lChirho.font,
			textDirectionChirho: lChirho.text_direction,
			verseCountChirho: lChirho.verse_count_chirho ?? 0,
			wordCountChirho: lChirho.word_count_chirho ?? 0
		}))
	};
};
