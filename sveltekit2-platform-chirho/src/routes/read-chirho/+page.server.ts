// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { PageServerLoad as PageServerLoadChirho } from './$types';
import { queryRawChirho } from '$lib/server/db-chirho';

export const load: PageServerLoadChirho = async () => {
	// Get languages with translation stats (gloss count and book count)
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

	return {
		languagesChirho
	};
};
