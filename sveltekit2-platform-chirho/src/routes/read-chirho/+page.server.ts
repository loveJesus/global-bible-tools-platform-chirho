// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { PageServerLoad as PageServerLoadChirho } from './$types';
import { getOrRefreshAllLanguagesChirho } from '$lib/server/stats-cache-chirho';

export const load: PageServerLoadChirho = async () => {
	// Use shared cron-based cache (refreshes every 5 min via cron, 2-hour fallback)
	const languagesChirho = await getOrRefreshAllLanguagesChirho();

	return {
		languagesChirho
	};
};

