// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { PageServerLoad as PageServerLoadChirho } from './$types';
import { queryRawChirho } from '$lib/server/db-chirho';

// Cache for language stats (expensive query)
const CACHE_TTL_MS_CHIRHO = 2 * 60 * 1000; // 2 minutes
let cachedLanguagesChirho: {
	dataChirho: Array<{
		idChirho: string;
		codeChirho: string;
		nameChirho: string;
		glossCountChirho: number;
		bookCountChirho: number;
	}>;
	timestampChirho: number;
} | null = null;

async function getLanguagesWithStatsCachedChirho() {
	const nowChirho = Date.now();

	// Return cached data if valid
	if (cachedLanguagesChirho && nowChirho - cachedLanguagesChirho.timestampChirho < CACHE_TTL_MS_CHIRHO) {
		return cachedLanguagesChirho.dataChirho;
	}

	// Query fresh data
	const languagesChirho = await queryRawChirho<{
		idChirho: string;
		codeChirho: string;
		nameChirho: string;
		glossCountChirho: number;
		bookCountChirho: number;
	}>(`
		SELECT
			l.id AS "idChirho",
			l.code AS "codeChirho",
			l.name AS "nameChirho",
			COALESCE(stats_chirho.gloss_count_chirho, 0)::int AS "glossCountChirho",
			COALESCE(stats_chirho.book_count_chirho, 0)::int AS "bookCountChirho"
		FROM language l
		LEFT JOIN LATERAL (
			SELECT
				COUNT(DISTINCT g.phrase_id) AS gloss_count_chirho,
				COUNT(DISTINCT SUBSTRING(w.verse_id, 1, 2)) AS book_count_chirho
			FROM phrase p
			JOIN phrase_word pw ON pw.phrase_id = p.id
			JOIN word w ON w.id = pw.word_id
			JOIN gloss g ON g.phrase_id = p.id AND g.gloss IS NOT NULL
			WHERE p.language_id = l.id
				AND p.deleted_at IS NULL
		) stats_chirho ON true
		ORDER BY l.name
	`, []);

	// Update cache
	cachedLanguagesChirho = {
		dataChirho: languagesChirho,
		timestampChirho: nowChirho
	};

	return languagesChirho;
}

export const load: PageServerLoadChirho = async () => {
	const languagesChirho = await getLanguagesWithStatsCachedChirho();

	return {
		languagesChirho
	};
};

