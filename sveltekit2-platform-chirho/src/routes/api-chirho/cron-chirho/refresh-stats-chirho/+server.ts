// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { RequestHandler as RequestHandlerChirho } from './$types';
import { json as jsonChirho } from '@sveltejs/kit';
import { refreshTranslationStatsCacheChirho } from '$lib/server/stats-cache-chirho';

/**
 * Cron endpoint to refresh translation stats cache.
 * Call this every 5 minutes via cron:
 *   curl -X POST https://global-tools.bible.systems/api-chirho/cron-chirho/refresh-stats-chirho
 *
 * The endpoint checks if the total gloss count changed before running the expensive query.
 * If unchanged, it skips the refresh and returns quickly.
 */
export const POST: RequestHandlerChirho = async ({ request: requestChirho }) => {
	const startChirho = Date.now();

	try {
		const resultChirho = await refreshTranslationStatsCacheChirho();
		const durationChirho = Date.now() - startChirho;

		return jsonChirho({
			successChirho: true,
			skippedChirho: resultChirho.skippedChirho,
			languagesChirho: resultChirho.progressChirho.length,
			glossCountChirho: resultChirho.glossCountChirho,
			durationMsChirho: durationChirho
		});
	} catch (errorChirho) {
		console.error('Failed to refresh stats cache:', errorChirho);
		return jsonChirho(
			{ successChirho: false, errorChirho: String(errorChirho) },
			{ status: 500 }
		);
	}
};

// Also allow GET for easy testing
export const GET: RequestHandlerChirho = POST;
