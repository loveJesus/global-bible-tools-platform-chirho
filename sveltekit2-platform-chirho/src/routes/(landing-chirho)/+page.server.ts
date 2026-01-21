// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { PageServerLoad as PageServerLoadChirho } from './$types';
import { dbChirho, countChirho } from '$lib/server/db-chirho';
import { bookTableChirho } from '$lib/server/schema-chirho';
import { getOrRefreshStatsChirho } from '$lib/server/stats-cache-chirho';

export const load: PageServerLoadChirho = async () => {
	try {
		const resultChirho = await dbChirho
			.select({ countChirho: countChirho() })
			.from(bookTableChirho);

		// Get translation progress from cache, or refresh if stale (>2 hours) or empty.
		// Normal operation: cron refreshes every 5 minutes, this just reads cache.
		// Fallback: if cron hasn't run for 2+ hours, refresh on page load.
		const progressChirho = await getOrRefreshStatsChirho();

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
