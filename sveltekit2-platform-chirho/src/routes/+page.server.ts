// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { PageServerLoad as PageServerLoadChirho } from './$types';
import { dbChirho, countChirho, queryRawChirho } from '$lib/server/db-chirho';
import { bookTableChirho } from '$lib/server/schema-chirho';

export const load: PageServerLoadChirho = async () => {
	try {
		const resultChirho = await dbChirho
			.select({ countChirho: countChirho() })
			.from(bookTableChirho);

		// Get translation progress per language
		const progressChirho = await queryRawChirho<{
			codeChirho: string;
			nameChirho: string;
			glossCountChirho: number;
			bookCountChirho: number;
		}>(`
			SELECT
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
			WHERE COALESCE(stats_chirho.gloss_count_chirho, 0) > 0
			ORDER BY stats_chirho.gloss_count_chirho DESC
			LIMIT 12
		`, []);

		return {
			booksCountChirho: resultChirho[0]?.countChirho ?? 0,
			progressChirho
		};
	} catch (errorChirho) {
		console.error('Database connection error:', errorChirho);
		return {
			booksCountChirho: 0,
			progressChirho: []
		};
	}
};
